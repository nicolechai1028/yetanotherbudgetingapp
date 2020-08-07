/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Added this History section                                                      *
 *   +                                                                                  *
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
const Constants = require("../../../constants");

/**
 * Matches routes with /api/category/create
 * Create category route
 * 
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : World Currencies
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 * 
 * Expects:
 *  - sessionUUID
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);
});

module.exports = router;
