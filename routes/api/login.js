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
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let email = req.body.email;
  let password = req.body.password;
  if (email == null || (email = email.trim()).length == 0) {
    let response = { status: "ERROR", message: "Invalid or missing email" };
    res.json(response);
    return;
  }
  // check if the user exists in the database
  db.UserProfile.find({ email: email })
    .then((dbModel) => {
      if (!dbModel) {
        let response = { status: "ERROR", message: `No such user (${email})` };
        res.json(response);
        return;
      }
      if (!dbModel.isVerified) {
        let response = {
          status: "ERROR",
          message: `Account has not been verified. Please check your email (${email})`,
        };
        res.json(response);
        return;
      }
      // check password
      let passwordHash = Utilities.createHmacSHA256Hash(password, email);
      if (passwordHash != dbModel.password) {
        let response = { status: "ERROR", message: `Incorrect password` };
        res.json(response);
        return;
      }
      let sessionUUID = Utilities.generateUUID();
      let timestamp = Date.now();
      let statusMsg = { status: "OK", message: `Welcome ${dbModel.fullName}!!`, sessionUUID: sessionUUID };
      let {
        _id,
        email,
        isVerified,
        password,
        emailVerificationId,
        lastLoginTimestamp,
        lastTransactionTimestamp,
        ...response
      } = { ...dbModel, ...statusMsg };
      // modify dbModel object and update database
      dbModel = {
        ...dbModel,
        lastLoginTimestamp: timestamp,
        lastTransactionTimestamp: timestamp,
        sessionUUID: statusMsg.sessionUUID,
      };
    })
    .catch((err) => {
      let response = { status: "ERROR", message: err.message };
      res.json(response);
      return;
    });
  res.json(response);
});

module.exports = router;
