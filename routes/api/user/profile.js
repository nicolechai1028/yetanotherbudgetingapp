/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   +    Added this History section                                                    *
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
const db = require("../../../models");
const Utilities = require("../../../utilities");

/**
 * Matches routes with /api/user/profile
 * Register route. Success will return the following object:
 *
 *  - status: OK
 *  - message : User profile for {email}
 *  - profile : { email, firstName, lastName,
 *                currency : { code, name, uniDec }
 *              }
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 * Expects:
 *  - sessionUUID: <sessionUUID>
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let response;
  let sessionUUID = req.body.sessionUUID;
  if (sessionUUID == null) {
    response = { status: "ERROR", message: "Invalid sessionUUID" };
    res.json(response);
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    return;
  }
  (async () => {
    let dbResult,
      currency = {},
      ref;
    let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID }).populate("currencyRef");
    if (dbResults == null || dbResults.length != 1) {
      response = { status: "ERROR", message: "Invalid sessionUUID" };
    } else {
      dbResult = dbResults[0];
      if (dbResult.currencyRef != null) {
        ref = dbResult.currencyRef;
        currency = { code: ref._id, name: ref.name, uniDec: ref.uniDec };
      }
      response = {
        status: "OK",
        message: `User profile for ${dbResult.email}`,
        firstName: dbResult.firstName,
        lastName: dbResult.lastName,
        currency: currency,
      };
    }
    console.log("User Profile API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
