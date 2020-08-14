/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +  Added this History section                                                      *
 *   +  Moved file to route/api/user                                                    *
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   +  Corrected comment that referred to the path as "/api/register" instead of       *
 *        "/api/user/register"                                                          *
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   +  Added check for "currencyCode"                                                  *
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
const db = require("../../../models");
const Utilities = require("../../../utilities");

/**
 * Matches routes with /api/user/register
 * Register route. Success will return the following object:
 *
 *  - status: OK
 *  - message : <User {email} successfully registered in>
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 * Expects:
 *  - firstName: <user first name>
 *  - lastName: <user last name>
 *  - email : <user login email ID>
 *  - password: <user password>
 *  - currencyCode: <three character currency code> // if not present or not among valid choice, "USD" is used
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let { firstName, lastName, email, password, currencyCode } = req.body;
  if (firstName == null || (firstName = firstName.trim()).length == 0) {
    res.json({ status: "ERROR", message: "First Name field is required" });
    return;
  }
  if (lastName == null || (lastName = lastName.trim()).length == 0) {
    res.json({ status: "ERROR", message: "Last Name field is required" });
    return;
  }
  if (password == null || (password = password.trim()).length == 0) {
    res.json({ status: "ERROR", message: "Password field is required" });
    return;
  }
  if (email == null || (email = email.trim().toLowerCase()).length == 0) {
    res.json({ status: "ERROR", message: "Email field is required" });
    return;
  }
  if (!currencyCode) currencyCode = "USD";
  currencyCode = currencyCode.toUpperCase();

  // check if email is in the database. If so,
  (async () => {
    try {
      let dbCurrency = await db.Currency.findById(currencyCode);
      if (!dbCurrency) currencyCode = "USD";
      let dbResult = await db.UserProfile.find({ email: email });
      console.log(dbResult);
      if (dbResult != null && dbResult.length != 0) {
        res.json({ status: "ERROR", message: `Email (${email}) is already registered` });
        return;
      }
      let hashedPassword = Utilities.createHmacSHA256Hash(password, email);
      let emailVerificationId = Utilities.generateUUID();
      let dbModel = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword, // hashed password
        // isVerified: true,
        emailVerificationId: emailVerificationId,
        currencyRef: currencyCode,
      };
      dbResult = await db.UserProfile.create(dbModel);
      if (dbResult == null || !dbResult._id) {
        res.json({ status: "ERROR", message: `Unable to register ${email}` });
        return;
      }
      console.log("User Profile Data:", dbResult);
      let emailInfo = await Utilities.sendConfirmationEmail(req, email, emailVerificationId);
      console.log(emailInfo);
      res.json({
        status: "OK",
        message: "Registation Successful",
        firstName: firstName,
        lastName: lastName,
        email: email,
      });
    } catch (err) {
      res.json({ status: "ERROR", message: err.message });
      return;
    }
  })();
});

module.exports = router;
