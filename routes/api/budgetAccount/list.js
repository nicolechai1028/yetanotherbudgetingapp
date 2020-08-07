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
 * Matches with /api/budgetAccount/list
 * Expects:
 *  - sessionUUID
 *  - accountUUID (optional)
 *
 *  The "option" param (req.params.option) is optional. Values are ["all", "closed", "active"]
 *  Default is "all".
 *
 * Returns list of accounts (name, type, starting balance, accountUUID,)
 */
router.route("/:option?").post((req, res) => {
  console.log("Request BODY:\n", req.body);
  console.log("Request PARAMS:\n", req.params);
  let isClosed = null,
    opt;
  if ((opt = req.params.option) != null) {
    switch (opt.toLowerCase().trim()) {
      case "closed":
        isClosed = true;
        break;
      case "active":
        isClosed = false;
        break;
      default:
        isClosed = null;
    }
  }

  let response = {};
  let sessionUUID = req.body.sessionUUID;
  let accountUUID = req.body.accountUUID;

  //  if (sessionUUID == null || (sessionUUID = sessionUUID.trim()).length == 0) {
  //    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  //    res.json(response);
  //    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
  //    return;
  //  }

  (async () => {
    try {
      let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults != null && dbResults.length != 0)
        userProfile = dbResults[0];
      // let userProfile = await userProfileController.findBySessionUUID(sessionUUID);
      if (userProfile != null && userProfile.isVerified == true) {
        let query = { ownerRef: userProfile._id };
        if (isClosed != null) query["isClosed"] = isClosed;
        if (accountUUID != null) query["_id"] = accountUUID;
        let dbResults = await db.BudgetAccount.find(query);
        let accounts = [];
        if (dbResults != null) {
          for (let index = 0; index < dbResults.length; index++) {
            let acct = dbResults[index];
            accounts.push({
              accountUUID: acct._id,
              name: acct.name,
              type: acct.accountType,
              balance: acct.balance,
              isClosed: acct.isClosed,
            });
          }
          response = {
            status: "OK",
            message: `${dbResults.length} Budget Accounts found`,
            accounts: accounts,
          };
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
