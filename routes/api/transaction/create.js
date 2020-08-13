/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   +  Added this History section                                                      *
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   +  Added function to update Budget activity with transaction amount                *
 *   +                                                                                  *
 *   +                                                                                  *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 ****************************************************************************************
 */

/**
 * @see https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
 * @see https://codeforgeek.com/expressjs-router-tutorial/
 */

const crypto = require("crypto");
const router = require("express").Router();
const db = require("../../../models");
const Utilities = require("../../../utilities");
const Utils = require("../../../utils");
const Constants = require("../../../constants");
const TransactionController = require("../../../controllers/transactionController");
const AccountController = require("../../../controllers/budgetAccountController");

/**
 * Matches routes with /api/transaction/create
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Transaction Created
 *  - transaction: {  }
 *  - account : {  }
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - accountUUID
 *  - payee
 *  - categoryUUID
 *  - subCategoryUUID
 *  - amount
 *  - date // optional. Date in yyyymmdd format. If missing, today's date will be used
 *  - memo (optional)
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);
  let response,
    dbProfile,
    ownerRef,
    dbAccount,
    dbResults,
    dbXaction,
    dbModel,
    dbCategory,
    perspective,
    query,
    originalAccountBalance;

  let {
    date,
    sessionUUID = "",
    accountUUID = "",
    payee = "",
    categoryUUID = "",
    subCategoryUUID = "",
    amount = 0.0,
    memo = "",
  } = req.body;

  if ((sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if ((accountUUID = accountUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid accountUUID" };
  else if ((payee = payee.trim()).length == 0) response = { status: "ERROR", message: "Missing or invalid payee" };
  else if ((categoryUUID = categoryUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid categoryUUID" };
  else if ((subCategoryUUID = subCategoryUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid subCategoryUUID" };
  else if (isNaN(amount) == true) response = { status: "ERROR", message: "Missing or amount" };
  else if ((memo = memo.trim()).length == 0) memo = undefined;

  if (!date || isNaN(date) == true) date = Utilities.formatTransactionDateFromUTC();
  else if ((date = parseInt(date)) < Constants.MIN_YYYYMMDD || date > Constants.MAX_YYYYMMDD)
    date = Utilities.formatTransactionDateFromUTC();

  amount = new Number(amount);
  if (amount == 0) response = { status: "ERROR", message: "Transaction amount is zero (0.00)" };
  if (response) {
    console.log("Create Transaction API Response:\n", response);
    res.json(response);
    return;
  }

  response = { status: "OK" };
  (async () => {
    try {
      dbResults = await db.UserProfile.find({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbResults || dbResults.length == 0) response = { status: "ERROR", message: "Invalid sessionUUID" };
      else {
        dbProfile = dbResults[0];
        ownerRef = dbProfile._id;
        // check if category and subCategory are valid
        query = { _id: categoryUUID, "subCategory._id": subCategoryUUID, ownerRef: ownerRef };
        dbCategory = await db.UserCategoryGroup.findOne(query);
        console.log("\n\nCategory:\n", dbCategory);
        if (!dbCategory) response = { status: "ERROR", message: "Unable to find Category/SubCategory" };
        else {
          // make sure the amount is the right sign base on the perspective of the Category
          perspective = dbCategory.perspective;
          amount = perspective == "Inflow" ? Utilities.makePositive(amount) : Utilities.makeNegative(amount);
          // make sure budget account is valid
          dbAccount = await db.BudgetAccount.findById(accountUUID);
          if (!dbAccount) response = { status: "ERROR", message: "Unable to find Budget Account" };
          else {
            dbModel = {
              payee: payee,
              ownerRef: ownerRef,
              accountRef: accountUUID,
              categoryRef: categoryUUID,
              subCategoryRef: subCategoryUUID,
              memo: memo,
              amount: amount,
              date: date,
            };
            console.log("\nTraction Model:\n", dbModel);
            dbXaction = await db.Transaction.create(dbModel);
            console.log("\nSaved Transaction Object:\n", dbXaction);
            // now use the value and adjust the balance in the account
            originalAccountBalance = dbAccount.balance;
            //accountBalance = dbAccount.balance + amount;
            dbAccount.balance = dbAccount.balance + amount;

            console.log(`"originalAccountBalance" ==> ${originalAccountBalance}`);
            console.log(`"accountBalance" ==> ${dbAccount.balance}`);
            dbAccount = await dbAccount.save();
            console.log(`\n\nAfter Account save:`);
            console.log(`Account Balance: ${dbAccount.balance}`);
            // update budget
            //let dbBudget = await updateBudget(dbXaction, dbCategory, subCategoryUUID);
             let dbBudget = await Utils.updateBudgetWithTransaction(dbXaction, null, dbCategory, subCategoryUUID);

            let transactionJSON = TransactionController.getJSON(dbXaction);
            let accountJSON = AccountController.getJSON(dbAccount);
            // get rid of ownerRef from both JSON objects
            delete transactionJSON.ownerRef;
            delete accountJSON.ownerRef;
            response = {
              status: "OK",
              message: `Transaction saved & Account (${dbAccount.name}) updated`,
              transaction: transactionJSON,
              account: accountJSON,
            };
          }
        }
      }
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    console.log("Create Transaction API Response:\n", response);
    res.json(response);
  })();
});

async function updateBudget(dbXaction, dbCategory, subCategoryUUID) {
  try {
    let dbSubCategory;
    if (
      !dbXaction ||
      !dbCategory ||
      !subCategoryUUID ||
      !(dbSubCategory = dbCategory.getSubCategoryById(subCategoryUUID))
    )
      return;

    // check if there is a budget for the transaction yearMonth
    let yearMonth = parseInt(dbXaction.date / 100);
    if (yearMonth < Constants.MIN_YYYYMM || yearMonth > Constants.MAX_YYYYMM) return;
    // get budget, if it exists
    let ownerRef = dbXaction.ownerRef;
    let amount = dbXaction.amount;
    if (Math.abs(amount) < 0.01) return; // rounding error
    let categoryUUID = dbCategory._id;
    let query = { yearMonth: yearMonth, categoryRef: categoryUUID, ownerRef: ownerRef };
    let dbBudget = await db.Budget.findOne(query);
    if (!dbBudget) {
      let subModels = [];
      let idNamesMap = dbCategory.getSubCategoryIdNameMap();
      for (idKey in idNamesMap) {
        let model = { subCategoryRef: idKey, budgeted: 0.0, activity: 0.0 };
        if (idKey == subCategoryUUID) model["activity"] = amount;
        subModels.push(model);
      }
      // create budget
      let budgetModel = {
        yearMonth: yearMonth,
        ownerRef: ownerRef,
        categoryRef: categoryUUID,
        subCategory: subModels,
      };
      console.log("\n\n******** Creating Budget Item From Transaction *********:");
      console.log(`\n**** Model Data ****:\n${JSON.stringify(budgetModel, null, 2)}`);
      dbBudget = await db.Budget.create(budgetModel);
      console.log(`\n*** Saved Data ****:\n${JSON.stringify(dbBudget, null, 2)}\n\n`);
    } else {
      let subBudget = null;
      console.log("\n\n******** Updating Budget Item From Transaction *********:");
      console.log(`**** Previous Budget ****:\n${JSON.stringify(dbBudget, null, 2)}`);
      for (let index = 0; index < dbBudget.subCategory.length; index++) {
        subBudget = dbBudget.subCategory[index];
        if (subBudget.subCategoryRef == subCategoryUUID) {
          subBudget.activity += amount;
          subBudget = null;
          break;
        }
      }
      // budget found, but no entry for subCategory
      if (subBudget == null) {
        let model = { subCategoryRef: subCategoryUUID, budgeted: 0.0, activity: amount };
        dbBudget.subCategory.push(model);
        await dbBudget.save();
        console.log(`\n*** Updated Data ****:\n${JSON.stringify(dbBudget, null, 2)}\n\n`);
      }
    }
    return dbBudget;
  } catch (error) {
    console.log(error);
    return;
  }
}

module.exports = router;
