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
const UserProfileController = require("../../../controllers/userProfileController");
/**
 * Matches with /api/login
 * Login route. Success will return the following object:
 *
 *  - status: OK
 *  - message : <User {email} successfully logged in>
 *  - sessionUUID : <Unique session UUID for this login session. Used for every communication with server>
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *  - firstName: <user first name>
 *  - lastName: <user last name>
 * Expects:
 *  - email : <user login email ID>
 *  - password: <user password>
 * */

router.route("/").post((req, res) => {
  console.log(req.body);
  console.log(Utilities.getFullUrl(req));

  let { email, password } = req.body;
  let response, dbResult;

  if (!email || (email = email.trim()).length == 0) response = { status: "ERROR", message: "Invalid or missing email" };
  else if (password == null || password.length == 0)
    response = { status: "ERROR", message: "Invalid or missing password" };

  if (response) {
    console.log("Update/Modify Transaction API Response:\n", response);
    res.json(response);
    return;
  }

  (async () => {
    try {
      dbResult = await db.UserProfile.findOne({ email: email }).populate("currencyRef");
      if (!dbResult) throw new Error(`No such user (${email})`);

      console.log("Original UserProfile\n", dbResult);

      if (dbResult.isVerified == false)
        throw new Error(`Account has not been verified. Please check your email (${email})`);

      // check password
      let passwordHash = Utilities.createHmacSHA256Hash(password, email);

      if (passwordHash != dbResult.password) throw new Error("Incorrect password");

      let currency = {},
        ref;
      if (dbResult.currencyRef != null) {
        ref = dbResult.currencyRef;
        currency = { code: ref._id, name: ref.name, uniDec: ref.uniDec };
      }
      let sessionUUID = Utilities.generateUUID();
      let timestamp = Date.now();
      response = {
        status: "OK",
        message: `Welcome ${dbResult.fullName}!!`,
        sessionUUID: sessionUUID,
        firstName: dbResult.firstName,
        lastName: dbResult.lastName,
        currency: currency,
      };
      console.log("JSON Response:\n", response);
      // modify dbResult object and update database
      dbResult.lastLoginTimestamp = timestamp;
      dbResult.lastTransactionTimestamp = timestamp;
      dbResult.sessionUUID = sessionUUID;
      dbResult.lastLogoutTimestamp = undefined;

      await dbResult.save();
      console.log("Saved User Profile:\n", dbResult);

    } catch (err) {
      console.log(err);
      response = { status: "ERROR", message: err.message };
    }
    console.log("Modify Transaction API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
