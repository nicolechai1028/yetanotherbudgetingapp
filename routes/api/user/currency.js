/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   +    Added this History section                                                    *
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

const router = require("express").Router();
const db = require("../../../models");
const Utilities = require("../../../utilities");

/**
 * Matches routes with /api/user/currency/:code?
 * Currency route. If the "code" param is not on the path, all currencies will be returned.
 * More than one currency code separated with commas can be listed on the URL
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : World Currencies
 *  - currencies : [{}]
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 * Expects:
 *  - sessionUUID
 */
router.route("/:codes?").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);
  let response,
    codes = null;
  let sessionUUID = req.body.sessionUUID;

  if (sessionUUID == null) {
    response = { status: "ERROR", message: "Invalid sessionUUID" };
    res.json(response);
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    return;
  }

  if ((codes = req.params.codes) != null) codes = codes.trim().toUpperCase().split(",");

  (async () => {
    try {
      let dbProfile, currency;
      let dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults == null || dbResults.length != 1) {
        response = { status: "ERROR", message: "Invalid sessionUUID" };
      } else {
        dbProfile = dbResults[0];
        let query = {};
        if (codes != null) {
          if (codes.length == 1) query = { _id: codes[0] };
          else query = { _id: { $in: codes } };
        }
        console.log("\nCurrency Query:\n", query);
        dbResults = await db.Currency.find(query);
        if (dbResults != null && dbResults.length != 0) {
          currency = [];
          for (let index = 0; index < dbResults.length; index++) {
            let dbResult = dbResults[index];
            currency.unshift({ code: dbResult._id, name: dbResult.name, uniDec: dbResult.uniDec });
          }
        }
        response = { status: "OK", message: `World Currencies` };
        if (currency != null) response = { status: "OK", message: `World Currencies`, currency: currency };
      }
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
    }
    console.log("User Profile API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
