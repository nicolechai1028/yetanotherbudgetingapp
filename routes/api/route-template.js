/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
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

const crypto = require("crypto");
const router = require("express").Router();
// const db = require("../../../models");
// const Utilities = require("../../../utilities");
// const Constants = require("../../../constants");

/**
 * Matches routes with /api/
 *
 * Success will return the following object:
 *  - status: OK
 *  - message : <message>
 *  - ?...
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - ?...
 * 
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  (async () => {
    dbResults = await db.UserProfile.find({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
    if (!dbResults || dbResults.length == 0) response = { status: "ERROR", message: "Invalid sessionUUID" };
    else {
      dbProfile = dbResults[0];
      ownerRef = dbProfile._id;
    }
    console.log("Create Transaction API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
