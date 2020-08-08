/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +  Created                                                                         *
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Changed response field "startingBalance" to "balance". Changed request optional *
 *       field "startingBalance" to "balance"                                           *
 *   +  Added optional "transaction" object field to response. This is sent only of the *
 *       input "balance" field is not zero (0) and a "Starting Balance" transaction is  *
 *       successfully recorded                                                          *
 *   +                                                                                  *
 *   +                                                                                  *
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
const Utilities = require("../../../utilities");
const db = require("../../../models");
const budgetAccountController = require("../../../controllers/budgetAccountController");
const userProfileController = require("../../../controllers/userProfileController");
const Constants = require("../../../constants");
/**
 * Matches with /api/budgetAccount/create
 * BudgetAccount create route. Creats a new Budget Account
 * Success will return the following object:
 *  - status: OK
 *  - message: `Account "${name}" created`
 *  - name: ${name}
 *  - accountUUID: <UUID of account>
 *  - accountType : <one of ["Checking", "Saving", "Credit Card", ...]>
 *  - balance: ${balance}
 *  Optional if balance <> 0
 *  - transaction:
 *  {
 *     - id: <transactionID>
 *     - payee: "Starting Balance"
 *     - accountUUID: <id of created account>
 *     - categoryName: <Name of category Group>
 *     - categoryUUID: <UUID of category Group>
 *     - subCategoryName: <Name of sub category >
 *     - subCcategoryUUID: <UUID of sub category >
 *     - perspective: <one of ["Inflow","Outflow"]
 *     - amount: <transaction amount>
 *     - date: <transaction date number in yyyymmdd>
 *  }
 *
 * Expects:
 *  - sessionUUID
 *  - name
 *  - accountType // one of ["Checking", "Saving", "Cash", "Credit Card", "Line of Credit"]
 *  - balance // default = 0.0
 *
 */
router.route("/").post((req, res) => {
  console.log(req.body);
  let response = null;
  let { sessionUUID, name, accountType, balance } = { ...req.body };
  if (sessionUUID == null || (sessionUUID = sessionUUID.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  } else if (name == null || (name = name.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid Account Name" };
  } else if ((balance = parseFloat(balance)) == NaN) {
    balance = 0.0;
  } else if (accountType == null || (accountType = accountType.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid Account Type" };
  } else if (Constants.BUDGET_ACCOUNT_TYPES.find((element) => element == accountType) == null) {
    response = { status: "ERROR", message: "Invalid Account Type" };
  }

  
  if (response != null) {
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
    return;
  }

  (async () => {
    try {
      let userProfile;
      let dbResult, dbAccount;
      let accountName4Compare;
      let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults != null && dbResults.length == 1) userProfile = dbResults[0];
      //let userProfile = await userProfileController.findBySessionUUID(sessionUUID);
      if (userProfile != null && userProfile.isVerified == true) {
        // check if an account with that name already exists for this user
        let ownerRef = userProfile._id;
        accountName4Compare = Utilities.multipleSpaceRemovedTrimLC(name);
        name = Utilities.multipleSpaceRemovedTrim(name);
        dbResults = await db.BudgetAccount.find({ ownerRef: ownerRef, accountName4Compare: accountName4Compare });
        if (dbResults != null && dbResults.length != 0) dbAccount = dbResults[0];
        // let dbResult = await budgetAccountController.findByOwnerAndName(ownerRef, name);
        if (dbAccount != null) {
          // an account with that name already exists
          response = { status: "ERROR", message: "An account with name exists" };
        } else {
          let dbModel = {
            name: name,
            accountName4Compare: Utilities.multipleSpaceRemovedTrimLC(name),
            ownerRef: ownerRef,
            accountType: accountType,
            balance: balance,
          };
          // create account
          console.log(dbModel);
          dbAccount = await db.BudgetAccount.create(dbModel);
          if (dbAccount == null || !dbAccount._id) {
            response = { status: "ERROR", message: `Unable to create Account "${name}"` };
          } else {
            console.log("Created Budget Account:\n", dbAccount);
            console.log(`\n\naccountName4Compare (code):      "${accountName4Compare}"`);
            console.log(`accountName4Compare (document):  "${dbAccount.accountName4Compare}"\n\n`);
            response = {
              status: "OK",
              message: `Account "${name}" created`,
              name: dbAccount.name,
              accountUUID: dbAccount._id,
              accountType: accountType,
              balance: balance,
            };
            // if balance <> 0, create transaction

            if (balance != 0) {
              // get UUID of Category depending on whether the balance is negative or positive
              let categoryName = "Inflow Adjustment";
              let perspective = "Inflow";
              if (balance < 0) {
                categoryName = "Outflow Adjustment";
                perspective = "Outflow";
              }
              let query = { categoryName: categoryName, ownerRef: userProfile._id };
              dbResults = await db.UserCategoryGroup.find(query);
              if (dbResults != null && dbResults.length != 0) {
                let dbCategory = dbResults[0];
                console.log("\n\nCategory:\n",dbCategory);
                let dbSubCategory = dbCategory.subCategory[0];
                console.log("\n\nSubCategory:\n",dbSubCategory);
                // create transaction
                let xactionModel = {
                  payee: "Starting Balance",
                  ownerRef: userProfile._id,
                  accountRef: dbAccount._id,
                  categoryRef: dbCategory._id,
                  subCategoryRef: dbSubCategory._id,
                  perspective: perspective,
                  amount: balance,
                };
                let dbXaction = await db.Transaction.create(xactionModel);
                if (dbXaction != null) {
                  let transaction = {
                    id: dbXaction._id,
                    payee: dbXaction.payee,
                    accountUUID: dbAccount._id,
                    categoryName: dbCategory.categoryName,
                    categoryUUID: dbCategory._id,
                    subCategoryName: dbSubCategory.subCategoryName,
                    subCategoryUUID: dbSubCategory._id,
                    amount: balance,
                    perspective: perspective,
                  };
                  response["transaction"] = transaction;
                }
              }
            }
          }
        }
      } else {
        response = { status: "ERROR", message: "Invalid sessionUUID" };
      }
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
    }
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
  })();
});

module.exports = router;
