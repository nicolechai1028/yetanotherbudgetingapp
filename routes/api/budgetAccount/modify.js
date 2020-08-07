/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +  Created                                                                         *
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Added "notes" and "balance" as parameters to be modified                        *
 *   +                                                                                  *
 *   +                                                                                  *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
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
const Utilities = require("../../../utilities");
const db = require("../../../models");
const budgetAccountController = require("../../../controllers/budgetAccountController");

/**
 * Matches with /api/budgetAccount/modify
 * Used to edit the name of a Budget Account.
 * Requires:
 *  - sessionUUID
 *  - accountUUID
 *  - name
 *  - balance
 *  - notes
 * Name will be checked to make sure it does not conflict with another account name (case insensitive, trimmed, multi-spaces removed)
 */
router.route("/").post((req, res) => {
  console.log(req.body);
  let response = null;
  let sessionUUID = req.body.sessionUUID;
  let accountUUID = req.body.accountUUID;
  let newAccountName = req.body.name;
  let newBalance = req.body.balance;
  let newNotes = req.body.notes;
  let accountNewName4Compare;
  let level = 2;

  if (sessionUUID == null || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if (accountUUID == null || (accountUUID = accountUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid accountUUID" };
  // else if (newAccountName == null || (newAccountName = Utilities.multipleSpaceRemovedTrim(newAccountName)).length == 0)
  //   response = { status: "ERROR", message: "Missing or invalid Name" };
  if (newAccountName != null) newAccountName = Utilities.multipleSpaceRemovedTrim(newAccountName);
  if (newNotes != null) newNotes = Utilities.multipleSpaceRemovedTrim(newNotes);

  if (newBalance != null && (newBalance = parseFloat(newBalance)) == NaN)
    response = { status: "ERROR", message: "Illegal number input for balance" };

  if (response != null) {
    res.json(response);
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    return;
  }

  // ********************* DEBUG ******* Remove!!! **********
  if (level == 1) {
    let resp = { status: "DEBUG", message: `Level ${level} Reached` };
    console.log(resp);
    res.json(resp);
    return;
  }
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  (async () => {
    try {
      let dbAccount, userProfile, dbResult;
      let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults != null && dbResults.length != 0) userProfile = dbResults[0];
      // let userProfile = await userProfileController.findBySessionUUID(sessionUUID);
      if (userProfile != null && userProfile.isVerified == true) {
        // ********************* DEBUG ******* Remove!!! **********
        level = userProfile.level;
        console.log(`LEVEL = ${userProfile.level}`);
        console.log(userProfile);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        let ownerRef = userProfile._id;
        // load the budget account
        dbAccount = await db.BudgetAccount.findById(accountUUID);
        if (dbAccount == null || dbAccount._id != accountUUID) {
          response = { status: "ERROR", message: "Account not found" };
          console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
          res.json(response);
          return;
        }

        // ********************* DEBUG ******* Remove!!! **********
        if (level == 2) {
          let resp = { status: "DEBUG", message: `Level ${level} Reached` };
          console.log(resp);
          res.json(resp);
          return;
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        // check if user wants to change the name of the account
        if (newAccountName != null) {
          accountNewName4Compare = Utilities.multipleSpaceRemovedTrimLC(newAccountName);
          // check if there is an account owned by the user with the same name
          let query = { ownerRef: ownerRef, accountName4Compare: accountNewName4Compare };
          dbResults = await db.BudgetAccount.find(query);

          // ********************* DEBUG ******* Remove!!! **********
          console.log("\n",query);
          console.log(dbResult);

          if (level == 3) {
            let resp = { status: "DEBUG", message: `Level ${level} Reached` };
            console.log(resp);
            res.json(resp);
            return;
          }
          // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

          if (dbResults != null && dbResults.length != 0) {
            response = { status: "ERROR", message: "An account with name exists" };
            console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
            res.json(response);
            return;
          }
        }

        let updateRequired = false;
        let perspective = null;
        let categoryName = null;

        // update the document with the relevant fields:
        let updateLog = "These are the fields that will be updated:\n";
        if (newAccountName != null) {
          updateRequired = true;
          updateLog += `\tOld Name: ${dbAccount.name}\tNew Name: ${newAccountName}\n`;
          dbAccount.name = newAccountName;
          dbAccount.accountName4Compare = accountNewName4Compare;
        }
        if (newNotes != null && newNotes.length != 0) {
          updateRequired = true;
          updateLog += `\tOld Note: ${dbAccount.notes}\tNew Note: ${newNotes}\n`;
          dbAccount.notes = newNotes;
        }
        let manualAdjustment = Utilities.roundToOneHundredthFin(newBalance - dbAccount.balance);
        if (dbAccount.balance != newBalance) {
          updateRequired = true;
          if (newBalance > dbAccount.balance) {
            categoryName = "Inflow Adjustment";
            perspective = "Inflow";
          } else {
            perspective = "Outflow";
            categoryName = "Outflow Adjustment";
          }
          updateLog += `\tOld Balance: ${dbAccount.balance}\tNew Balalce: ${newBalance}\tPerspective: "${perspective}"\n`;
          dbAccount.balance = newBalance;
        }

        // ********************* DEBUG ******* Remove!!! **********
        if (level == 4) {
          let resp = { status: "DEBUG", message: `Level ${level} Reached\nUpdate Log:\n${updateLog}` };
          console.log(resp);
          res.json(resp);
          return;
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        // if we have to update, lets update
        if (updateRequired == false) {
          response = { status: "OK", message: "Nothing Changed. No update done" };
          console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
          res.json(response);
          return;
        } else {
          dbAccount = await dbAccount.save();
          console.log(updateLog);
          console.log("Updated Account Budget:\n", dbAccount);
          response = {
            status: "OK",
            message: "Updated Account Budget",
            name: dbAccount.name,
            balance: dbAccount.balance,
            notes: dbAccount.notes,
          };

          // ********************* DEBUG ******* Remove!!! **********
          if (level == 5) {
            let resp = { status: "DEBUG", message: `Level ${level} Reached` };
            console.log(resp);
            res.json(resp);
            return;
          }
          // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

          // now create a transaction
          if (perspective != null) {
            // get the Category for Adjustment
            dbResults = await db.UserCategoryGroup.find({ categoryName: categoryName, ownerRef: ownerRef });
            if (dbResults != null && dbResults.length != 0) {
              let dbCategory = dbResults[0];
              let dbSubCategory = dbCategory.subCategory[0];
              let xactionModel = {
                payee: "Manual Adjustment",
                ownerRef: userProfile._id,
                accountRef: dbAccount._id,
                categoryRef: dbCategory._id,
                subCategoryRef: dbSubCategory._id,
                perspective: perspective,
                amount: manualAdjustment,
              };
              // create new transaction

              // ********************* DEBUG ******* Remove!!! **********
              console.log("\nTransaction Model:\n", xactionModel);
              // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

              let dbXaction = await db.Transaction.create(xactionModel);
              console.log("\nSaved Transaction:\n", dbXaction);
              if (dbXaction != null) {
                let transaction = {
                  id: dbXaction._id,
                  payee: dbXaction.payee,
                  accountUUID: dbAccount._id,
                  categoryName: dbCategory.categoryName,
                  categoryUUID: dbCategory._id,
                  subCategoryName: dbSubCategory.subCategoryName,
                  subCategoryUUID: dbSubCategory._id,
                  amount: manualAdjustment,
                  perspective: perspective,
                };
                response["transaction"] = transaction;
              }
            }
          }
          // send response
          console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
          res.json(response);
          return;
        }
        // let accountName4Compare = Utilities.multipleSpaceRemovedTrimLC(newAccountName);
        // // check if there is a budget account already with the new name
        // dbResults = await db.BudgetAccount.find({ ownerRef: ownerRef, accountName4Compare: accountName4Compare });
        // if (dbResults != null && dbResults.length != 0) {
        //   response = { status: "ERROR", message: "An account with name exists" };
        // } else {
        //   // get the budget account
        //   dbResults = await db.BudgetAccount.find({ ownerRef: ownerRef, _id: accountUUID });
        //   if (dbResults == null || dbResults.length == 0) {
        //     response = { status: "ERROR", message: "Invalid Budget Account ID: account not found" };
        //   } else {
        //     // found the correct budgetAccount document
        //     budgetAccount = dbResults[0];
        //     let oldName = budgetAccount.name;
        //     budgetAccount.name = newAccountName;
        //     budgetAccount.accountName4Compare = Utilities.multipleSpaceRemovedTrimLC(newAccountName);
        //     await budgetAccount.save();
        //     let message = `Account name changed from "${oldName}" to "${newAccountName}"`;
        //     response = { status: "OK", message: message, name: newAccountName };
        //   }
        // }
      } else {
        response = { status: "ERROR", message: "Invalid sessionUUID" };
      }
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
  })();
});

module.exports = router;
