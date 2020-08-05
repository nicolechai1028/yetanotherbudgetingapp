/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *   +    Moved file to route/api/user                                                  *
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
const UserCategoryGroupController = require("../../../controllers/userCategoryGroupController");

/**
 * Matches routes with /api/verify/:verifyCode
 * Email Verification route route. Success or failure will result in sending of HTML page as
 * response. GET method is processed and is designed to be launched from a browser
 *
 * Verification code in req.params.verifyCode. The verification code is the last element of the URL path
 */
router.route("/:verifyCode").get((req, res) => {
  console.log(req.params);
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
    let html = Utilities.emailValidationPage(info);
    console.log(html);
    res.send(html);
    return;
  }
  let verifyCode = params.verifyCode;
  // check database for the code.
  (async () => {
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
      let html = Utilities.emailValidationPage(info);
      console.log(html);
      res.send(html);
      return;
    }
    let result = dbResult[0];
    if (result.isVerified == true) {
      let email = result.email;
      let targetUrl = `${Utilities.getProtocolHostUrl(req)}/login`;
      let info = {
        intro: "There has been an issue validating your registration",
        header: "INFO/WARNING",
        message: "Account has already been verified",
        text: `Click the button below and login using ${email}`,
        targetUrl: targetUrl,
        btnLabel: "LOGIN",
      };
      let html = Utilities.emailValidationPage(info);
      console.log(html);
      res.send(html);
      return;
    } else {
      result.isVerified = true;
      await result.save();
      let email = result.email;
      let targetUrl = `${Utilities.getProtocolHostUrl(req)}/login`;
      let info = {
        intro: "Account has been verified",
        header: "SUCCESS",
        message: "Account is ready to be used",
        text: `Click the button below and login using ${email}`,
        targetUrl: targetUrl,
        btnLabel: "LOGIN",
      };
      let html = Utilities.emailValidationPage(info);
      console.log(html);
      res.send(html);
      let categoryGroups = await UserCategoryGroupController.InitializeUserCategoryGroup(result.email);
      console.log("\nCategory Groups:\n",JSON.stringify(categoryGroups,null,2));
    }
  })();
});

module.exports = router;
