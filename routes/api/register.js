/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
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

const db = require("../../models");
const crypto = require("crypto");
const Utilities = require("../../utilities");
const router = require("express").Router();

/**
 * Matches routes with /api/register
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
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let { firstName, lastName, email, password } = req.body;
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
  // check if email is in the database. If so,
  (async () => {
    try {
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
        isVerified: false,
        emailVerificationId: emailVerificationId,
      };
      dbResult = await db.UserProfile.create(dbModel);
      if (dbResult == null || !dbResult._id) {
        res.json({ status: "ERROR", message: `Unable to register ${email}` });
        return;
      }
      console.log("User Profile Data:", dbResult);
      let emailInfo = Utilities.sendConfirmationEmail(req, email, emailVerificationId);
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
