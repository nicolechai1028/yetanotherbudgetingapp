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

  let email = req.body.email,
    password = req.body.password,
    response;

  if (email == null || (email = email.trim()).length == 0) {
    res.json({ status: "ERROR", message: "Invalid or missing email" });
    return;
  }

  if (password == null || password.length == 0) {
    res.json({ status: "ERROR", message: "Invalid or missing password" });
    return;
  }

  let query = { email: email, password: password };

  (async () => {
    response = await checkLogin(query);

    console.log("Login API Response:\n", response);
    res.send(response);
  })();
});

async function checkLogin(query) {
  let response = {},
    dbResult,
    dbResults;

  try {
    dbResults = await db.UserProfile.find({ email: query.email }).populate("currencyRef");
    console.log(dbResults);
    if (dbResults == null || dbResults.length == 0) {
      return { status: "ERROR", message: `No such user (${query.email})` };
    }

    dbResult = dbResults[0];
    console.log("Original UserProfile\n", dbResult);

    if (dbResult.isVerified == false) {
      return {
        status: "ERROR",
        message: `Account has not been verified. Please check your email (${query.email})`,
      };
    }
    // check password
    let passwordHash = Utilities.createHmacSHA256Hash(query.password, query.email);

    if (passwordHash != dbResult.password) {
      return { status: "ERROR", message: "Incorrect password" };
    }

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
      lastname: dbResult.lastName,
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

    return response;
  } catch (err) {
    console.log(err);
    return { status: "ERROR", message: err.message };
  }
}

module.exports = router;
