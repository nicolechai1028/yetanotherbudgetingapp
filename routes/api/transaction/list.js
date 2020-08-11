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
const TransactionController = require("../../../controllers/transactionController");

/**
 * Matches routes with /api/transaction/list
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : "Transaction Modified"
 *  -
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - accountUUID
 *  - filter { // optional, Default is no condition but with a limit of 1024, decending sort by date
 *    - limit // optional. Default = 1024
 *    - startDate  // optional. Default is today
 *    - enddate  // optional. No default. Limited by "limit" filter
 *    - sort // optional. Default is -1 (descending). Value for ascending is 1
 *   }
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);
  let response, dbProfile, ownerRef, dbAccount, dbResults, query, perspective, xactionJSON, categoryUUID;

  let { sessionUUID = "", accountUUID = "", filter } = req.body;
  let { limit, startDate, endDate, sort } = filter;

  if ((sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if ((accountUUID = accountUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid accountUUID" };

  if (response) {
    console.log("List Transaction API Response:\n", response);
    res.json(response);
    return;
  }

  if (!limit || isNaN(limit) == true || (limit = parseInt(limit)) < 1) limit = 1024;
  if (
    !startDate ||
    isNaN(startDate) == true ||
    (startDate = parseInt(startDate)) < Constants.MIN_YYYYMMDD ||
    startDate > Constants.MAX_YYYYMMDD
  )
    startDate = Constants.MIN_YYYYMMDD;

  if (!endDate || isNaN(endDate) == true || (endDate = parseInt(endDate)) > Constants.MAX_YYYYMMDD)
    endDate = Constants.MAX_YYYYMMDD;

  if (!sort || isNaN(sort) == true) sort = -1;
  else sort = parseInt(sort);
  if (sort > 0) sort = 1;
  else sort = -1;

  (async () => {
    try {
      dbResults = await db.UserProfile.find({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbResults || dbResults.length == 0) response = { status: "ERROR", message: "Invalid sessionUUID" };
      else {
        dbProfile = dbResults[0];
        ownerRef = dbProfile._id;
        // make sure budget account is valid
        dbAccount = await db.BudgetAccount.findById(accountUUID);
        if (!dbAccount) response = { status: "ERROR", message: "Unable to find Budget Account" };
        else {
          query = {
            $and: [
              { ownerRef: { $eq: ownerRef } },
              { accountRef: { $eq: accountUUID } },
              { date: { $gte: startDate } },
              { date: { $lte: endDate } },
            ],
          };
          dbResults = await db.Transaction.find(query).populate("categoryRef").limit(limit).sort({ date: sort });
          if (!dbResults) response = { status: "ERROR", message: "Error retreiving data" };
          else {
            let transactions = [];
            dbResults.map((result) => {
              perspective = result.categoryRef.perspective;
              categoryUUID = result.categoryRef._id;
              xactionJSON = TransactionController.getJSON(result);
              if (perspective && xactionJSON && categoryUUID) {
                xactionJSON.perspective = perspective;
                xactionJSON.categoryUUID = categoryUUID;
                delete xactionJSON.ownerRef;
                transactions.push(xactionJSON);
              }
            });
            response = { status: "OK", message: `Found ${dbResults.length} transactions`, transaction: transactions };
          }
        }
      }
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    console.log("List Transaction API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
