/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Created                                                                       *
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
 * Name will be checked to make sure it does not conflict with another account name (case insensitive, trimmed, multi-spaces removed)
 */
router.route("/").post((req, res) => {
  console.log(req.body);
  let response = null;
  let sessionUUID = req.body.sessionUUID;
  let accountUUID = req.body.accountUUID;
  let newAccountName = req.body.name;

  if (sessionUUID == null || (sessionUUID = sessionUUID.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  } else if (accountUUID == null || (accountUUID = accountUUID.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid accountUUID" };
  } else if (newAccountName == null || (newAccountName = newAccountName.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid Name" };
  }

  if (response != null) {
    res.json(response);
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    return;
  }

  (async () => {
    try {
      let budgetAccount, userProfile,dbResult;
      let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults != null && dbResults.length != 0) userProfile = dbResults[0];
      // let userProfile = await userProfileController.findBySessionUUID(sessionUUID);
      if (userProfile != null && userProfile.isVerified == true) {
        let ownerRef = userProfile._id;
        let accountName4Compare = Utilities.multipleSpaceRemovedTrimLC(newAccountName);
        // check if there is a budget account already with the new name
        dbResults = await db.BudgetAccount.find ({ownerRef: ownerRef,accountName4Compare:accountName4Compare});
        if (dbResults != null && dbResults.length != 0) dbResult = dbResults[0];
        //let dbResult = await budgetAccountController.findByOwnerAndName(userProfile._id, newAccountName);
        if (dbResult != null) {
          // an account with that name already exists
          response = { status: "ERROR", message: "An account with name exists" };
        } else {
          // dbResult = await budgetAccountController.findById(accountUUID);
          dbResult = null;
          dbResults = await db.BudgetAccount.find({_id:accountUUID});
          if (dbResults != null && dbResults.length != 0) dbResult = dbResults[0];
          if (dbResult == null) {
            response = { status: "ERROR", message: "Account not found" };
          } else {
            let oldName = dbResult.name;
            dbResult.name = newAccountName;
            dbResult.accountName4Compare = Utilities.multipleSpaceRemovedTrimLC(newAccountName);
            await dbResult.save();
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
