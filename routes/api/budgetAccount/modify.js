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

  if (sessionUUID == null || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if (accountUUID == null || (accountUUID = accountUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid accountUUID" };
  if (newAccountName != null) newAccountName = Utilities.multipleSpaceRemovedTrim(newAccountName);
  if (newNotes != null) newNotes = Utilities.multipleSpaceRemovedTrim(newNotes);

  if (newBalance != null && (newBalance = parseFloat(newBalance)) == NaN)
    response = { status: "ERROR", message: "Illegal number input for balance" };

  if (response != null) {
    res.json(response);
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    return;
  }

  (async () => {
    try {
      let dbAccount, userProfile, dbResult;
      let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults != null && dbResults.length != 0) userProfile = dbResults[0];
      // let userProfile = await userProfileController.findBySessionUUID(sessionUUID);
      if (userProfile != null && userProfile.isVerified == true) {

        let ownerRef = userProfile._id;
        // load the budget account
        dbAccount = await db.BudgetAccount.findById(accountUUID);
        if (dbAccount == null || dbAccount._id != accountUUID) {
          response = { status: "ERROR", message: "Account not found" };
          console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
          res.json(response);
          return;
        }

        // check if user wants to change the name of the account
        if (newAccountName != null) {
          accountNewName4Compare = Utilities.multipleSpaceRemovedTrimLC(newAccountName);
          // check if there is an account owned by the user with the same name
          let query = { ownerRef: ownerRef, accountName4Compare: accountNewName4Compare };
          dbResults = await db.BudgetAccount.find(query);

          if (dbResults != null && dbResults.length != 0) {
            // found a user account with the same name. It should be this one. Otherwise
            // user is trying to change the name to one already in use
            dbResult = dbResults[0];
            if (dbAccount._id != dbResult._id) {
              response = { status: "ERROR", message: "An account with name exists" };
              console.log(`\n\n******* Account with the same Name as new Name (${newAccountName}) **********`);
              console.log(dbResult);
              console.log("\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n\n");
              console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
              res.json(response);
              return;
            }
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
