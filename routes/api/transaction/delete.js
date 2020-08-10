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
const db = require("../../../models");
const Utilities = require("../../../utilities");
const Constants = require("../../../constants");

/**
 * Matches routes with /api/transaction/delete
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Transaction Deleted
 *  -
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - transactionUUID
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let response, dbProfile, ownerRef, dbAccount, dbResults, query, perspective, xactionJSON;
  let { sessionUUID, transactionUUID, subCategoryUUID, payee, date, amount, memo } = req.body;

  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if (!transactionUUID || (transactionUUID = transactionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid transactionUUID" };

  (async () => {
    console.log("Delete Transaction API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
