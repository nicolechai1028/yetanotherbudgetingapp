/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Created                                                                       *
 *                                                                                      *
 * == chikeobi-05 ==                                                                    *
 *   +    Changed name of file from "getBudget" to "getBudgetItem". Will be used to     *
 *          retreive a single budget item                                               *
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

/**
 * Matches with /api/budget/getBudgetItem
 * Gets the budget for a specific user. Parameters will determine for which year and month.
 * Budgets can also be retrieved for a Category Group and/or a specific category
 *
 *
 *
 *  - status: "OK | ERROR"
 *  - message : "Success | <Error text>"
 *  - response {
 *               date{
 *                     year: <yyyy>
 *                     month: <mm>
 *                   },
 *                data[
 *
 *                    ]
 *             }
 *
 * */

router.route("/").post((req, res) => {
  const body = req.body;
  console.log(Utilities.getFullUrl(req));
  console.log(body);

  res.json({ status: "OK", message: `(${req.method}) ==> ${Utilities.getFullUrl(req)}` });
});

module.exports = router;
