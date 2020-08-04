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
const userProfileController = require("../../../controllers/userProfileController");
const Constants = require("../../../constants");
/**
 * Matches with /api/budgetAccount/create
 * Expects:
 *  - sessionUUID
 *  - name
 *  - accountType // one of ["Checking", "Saving", "Cash", "Credit Card", "Line of Credit"]
 *  - startingBalance // default = 0.0
 */
router.route("/").post((req, res) => {
  console.log(req.body);
  let response = null;
  let sessionUUID = req.body.sessionUUID;
  let name = req.body.name;
  let accountType = req.body.accountType;
  let startingBalance = req.body.startingBalance;

  if (sessionUUID == null || (sessionUUID = sessionUUID.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  } else if (name == null || (name = name.trim()).length == 0) {
    response = { status: "ERROR", message: "Missing or invalid Account Name" };
  } else if ((startingBalance = parseFloat(startingBalance)) == NaN) {
    startingBalance = 0.0;
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
      let dbResult;
      let accountName4Compare;
      let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults != null && dbResults.length == 1) userProfile = dbResults[0];
      //let userProfile = await userProfileController.findBySessionUUID(sessionUUID);
      if (userProfile != null && userProfile.isVerified == true) {
        // check if an account with that name already exists for this user
        let ownerRef = userProfile._id;
        accountName4Compare = Utilities.multipleSpaceRemovedTrimLC(name);
        dbResults = await db.BudgetAccount.find({ ownerRef: ownerRef, accountName4Compare: accountName4Compare });
        if (dbResults != null && dbResults.length != 0) dbResult = dbResults[0];
        // let dbResult = await budgetAccountController.findByOwnerAndName(ownerRef, name);
        if (dbResult != null) {
          // an account with that name already exists
          response = { status: "ERROR", message: "An account with name exists" };
        } else {
          let dbModel = {
            name: name,
            accountName4Compare: Utilities.multipleSpaceRemovedTrimLC(name),
            ownerRef: ownerRef,
            accountType: accountType,
            balance: startingBalance,
          };
          // create account
          dbResult = await db.BudgetAccount.create(dbModel);
          if (dbResult == null || !dbResult._id) {
            response = { status: "ERROR", message: `Unable to create Account "${name}"` };
          } else {
            console.log("Created Budget Account:\n", dbResult);
            console.log(`\n\naccountName4Compare (code):      "${accountName4Compare}"`);
            console.log(`accountName4Compare (document):  "${dbResult.accountName4Compare}"\n\n`);
            response = {
              status: "OK",
              message: `Account "${name}" created`,
              name: name,
              accountUUID: dbResult._id,
              accountType: accountType,
              startingBalance: startingBalance,
            };
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
