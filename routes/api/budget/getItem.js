/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-12 ==                                                                    *
 *   +  Created                                                                         *
 *   +                                                                                  *
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
const Utilities = require("../../../utilities");
const db = require("../../../models");

/**
 * Matches with /api/budget/getItem
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
  console.log(req.body);

  let response,
  dbProfile,
  ownerRef,
  dbResults,
  dbCategory,
  dbSubCategory,
  dbSubCategories,
  budgetCategory,
  subgetSubCategories;

  let { sessionUUID,yearMonth } = req.body;
  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if (
    !yearMonth ||
    (yearMonth = yearMonth.trim()).length == 0 ||
    isNaN(yearMonth) == true ||
    yearMonth < Constants.MIN_YYYYMM ||
    yearMonth > Constants.MAX_YYYYMM
  )
    yearMonth = Utilities.getYearMonth();

    if (response) {
      console.log("Create Budget getItem API Response:\n", response);
      res.json(response);
      return;
    }

    (async () => {
    try {
      dbResults = await db.UserProfile.find({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbResults || dbResults.length == 0) throw "Invalid sessionUUID";
      dbProfile = dbResults[0];
      ownerRef = dbProfile._id;
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    console.log("Create Transaction API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
