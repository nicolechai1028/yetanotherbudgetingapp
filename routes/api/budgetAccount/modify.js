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

  (async () => {
    try {
      let budgetAccount, userProfile, dbResult;
      let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults != null && dbResults.length != 0) userProfile = dbResults[0];
      // let userProfile = await userProfileController.findBySessionUUID(sessionUUID);
      if (userProfile != null && userProfile.isVerified == true) {
        let ownerRef = userProfile._id;
        let accountName4Compare = Utilities.multipleSpaceRemovedTrimLC(newAccountName);
        // check if there is a budget account already with the new name
        dbResults = await db.BudgetAccount.find({ ownerRef: ownerRef, accountName4Compare: accountName4Compare });
        if (dbResults != null && dbResults.length != 0) {
          response = { status: "ERROR", message: "An account with name exists" };
        } else {
          // get the budget account
          dbResults = await db.BudgetAccount.find({ ownerRef: ownerRef, _id: accountUUID });
          if (dbResults == null || dbResults.length == 0) {
            response = { status: "ERROR", message: "Invalid Budget Account ID: account not found" };
          } else {
            // found the correct budgetAccount document
            budgetAccount = dbResults[0];
            let oldName = budgetAccount.name;
            budgetAccount.name = newAccountName;
            budgetAccount.accountName4Compare = Utilities.multipleSpaceRemovedTrimLC(newAccountName);
            await budgetAccount.save();
            let message = `Account name changed from "${oldName}" to "${newAccountName}"`;
            response = { status: "OK", message: message, name: newAccountName };
          }
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
