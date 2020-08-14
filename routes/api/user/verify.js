/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +  Added this History section                                                      *
 *   +  Moved file to route/api/user                                                    *
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Updated "verificationTimestamp" field when verify is successful                 *
 *   +                                                                                  *
 *   +                                                                                  *
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
const Constants = require("../../../constants");
const UserCategoryGroupController = require("../../../controllers/userCategoryGroupController");

const DEFAULT_BUDGET_ACCOUNT_UUID = "63a9b997-d793-429e-bb93-eb57ae5ade9c";
const DEFAULT_BUDGET_ACCOUNT_NAME = "My Credit Card";
const DEFAULT_BUDGET_ACCOUNT_TYPE = Constants.ACCOUNT_TYPES[Constants.CREDIT_CARD_TYPE];
/**
 * Matches routes with /api/verify/:verifyCode
 * Email Verification route route. Success or failure will result in sending of HTML page as
 * response. GET method is processed and is designed to be launched from a browser
 *
 * Verification code in req.params.verifyCode. The verification code is the last element of the URL path
 */
let response;

router.route("/:verifyCode").get((req, res) => {
  console.log(req.params);
  let dbProfile;
  const params = req.params;
  if (params.verifyCode == null) {
    let targetUrl = `${Utilities.getProtocolHostUrl(req)}/register`;
    let info = {
      intro: "There has been an error validating your registration",
      header: "ERROR",
      message: "Missing validation key",
      text: "Check your Email again or repeat registration",
      targetUrl: targetUrl,
      btnLabel: "REGISTER",
    };
    response = Utilities.emailValidationPage(info);
    //console.log(response);
    res.send(response);
    return;
  }
  let verifyCode = params.verifyCode;
  // check database for the code.
  (async () => {
    try {
      let dbResult = await db.UserProfile.find({ emailVerificationId: verifyCode });
      if (dbResult == null || dbResult.length == 0) {
        let targetUrl = `${Utilities.getProtocolHostUrl(req)}/register`;
        let info = {
          intro: "There has been an error validating your registration",
          header: "ERROR",
          message: "Validation code not found",
          text: "Check your Email again or repeat registration",
          targetUrl: targetUrl,
          btnLabel: "REGISTER",
        };
        response = Utilities.emailValidationPage(info);
        //console.log(response);
        res.send(response);
        return;
      }
      dbProfile = dbResult[0];
      if (dbProfile.isVerified == true) {
        let email = dbProfile.email;
        let targetUrl = `${Utilities.getProtocolHostUrl(req)}/login`;
        let info = {
          intro: "There has been an issue validating your registration",
          header: "INFO/WARNING",
          message: "Account has already been verified",
          text: `Click the button below and login using ${email}`,
          targetUrl: targetUrl,
          btnLabel: "LOGIN",
        };
        response = Utilities.emailValidationPage(info);
        //console.log(html);
        res.send(response);
        return;
      } else {
        dbProfile.isVerified = true;
        dbProfile.verificationTimestamp = Date.now();
        await dbProfile.save();
        let email = dbProfile.email;
        let targetUrl = `${Utilities.getProtocolHostUrl(req)}/login`;
        let info = {
          intro: "Account has been verified",
          header: "SUCCESS",
          message: "Account is ready to be used",
          text: `Click the button below and login using ${email}`,
          targetUrl: targetUrl,
          btnLabel: "LOGIN",
        };
        response = Utilities.emailValidationPage(info);
        //console.log(html);
        res.send(response);
        let categoryGroups = await UserCategoryGroupController.InitializeUserCategoryGroup(dbProfile.email);
        console.log("\nCategory Groups:\n", JSON.stringify(categoryGroups, null, 2));
        // create default Budget Account
        let ownerRef = dbProfile._id;
        let accountUUID = DEFAULT_BUDGET_ACCOUNT_UUID;
        let name = DEFAULT_BUDGET_ACCOUNT_NAME;
        let accountType = DEFAULT_BUDGET_ACCOUNT_TYPE;
        let accountName4Compare = Utilities.multipleSpaceRemovedTrimLC(name);
        let notes = `Default ${accountType} Budget Account`;
        let dbModel = {
          _id: accountUUID,
          name: name,
          ownerRef: ownerRef,
          accountType: accountType,
          notes: notes,
          accountName4Compare: accountName4Compare,
        };
        console.log(`\n\nSetting up default Budget Account:\n${JSON.stringify(dbModel, null, 2)}`);
        let dbAccount = await db.BudgetAccount.create(dbModel);
        if (dbAccount) {
          response = {
            status: "OK",
            message: `Successfully created Default Budget Account:\n${JSON.stringify(dbAccount, null, 2)}`,
          };
          console.log(JSON.stringify(response, null, 2));
        }
      }
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
      //res.send(response);
    }
  })();
});

module.exports = router;
