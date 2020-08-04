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
const userProfileController = require("../../../controllers/userProfileController");
const budgetAccountController = require("../../../controllers/budgetAccountController");

/**
 * Matches with /api/budgetAccount/close
 * Expects:
 *  - sessionUUID
 *  - accountUUID. Identifies the account to be "closed"
 * Returns:
 *  - status: [OK | ERROR]
 *  - message: ["Invalid sessionUUID" | "No such Budget Account" | "Account <name> successfully closed"]
 */
router.route("/").post((req, res) => {
  console.log(req.body);
  let response = null;
  let sessionUUID = req.body.sessionUUID;
  let accountUUID = req.body.accountUUID;

  if (sessionUUID == null || (sessionUUID = sessionUUID.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  } else if (accountUUID == null || (accountUUID = accountUUID.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid accountUUID" };
  }

  if (response != null) {
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
  }

  (async () => {
    try {
      let userProfile, budgetAccount;

      // check if sessionUUID is "valid". That means it exists in the database and the associated account has been verified
      let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults != null && dbResults.length == 1) userProfile = dbResults[0];
      // let userProfile = await userProfileController.findBySessionUUID(sessionUUID);
      if (userProfile != null && userProfile.isVerified == true) {
        // check for validity of accountUUID
        if ((dbResults = await db.BudgetAccount.find({ _id: accountUUID })) == null || dbResults.length == 0) {
          response = { status: "ERROR", message: "No such Budget Account" };
        } else {
          budgetAccount = dbResults[0];
          budgetAccount.isClosed = true;
          await budgetAccount.save();
          response = { status: "OK", message: "Account closed" };
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
