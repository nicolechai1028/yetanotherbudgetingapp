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
const AccountController = require("../../../controllers/budgetAccountController");
/** **TODO:ENHANCEMENT**  */
/**
 * Matches routes with /api/transaction/find
 *
 * URL Path: /api/transaction/find/:findBy?/:using?
 *  - findBy    // one of
 *    uuid          // transactionUUID
 *    payee         // "payee" field. This is the default if this field is missing
 *    category      // category of the transaction.
 *     - using  // one of
 *       name           // name of the category. This is the default if the field is not specified
 *       uuid           // categoryUUID
 *    subCategory   //subCategory of the transaction.
 *     - using  // one of
 *       name           // name of the subCategory. This is the default if the field is not specified
 *       uuid           // subCategoryUUID
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Transaction Created
 *  - transaction: {  }
 *  - account : {  }
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects (POST):
 *  - sessionUUID
 *  - accountUUID
 *  - value // what to search for.
 *  - matchCase // optional [true|false]. Default is "false"
 *  - regex     // optional [true/false]. Default is false. If true, the "value" field is treated as a "Regular Expression"
 */
router.route("/:findBy?/:using?").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let(sessionUUID, accountUUID, value, (matchCase = false), (regex = false)) = req.body;
  
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
