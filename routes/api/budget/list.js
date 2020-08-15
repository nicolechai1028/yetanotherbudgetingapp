/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-05 ==                                                                    *
 *   +    Created                                                                       *
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

const router = require("express").Router();
const Utilities = require("../../../utilities");
const db = require("../../../models");
const Constants = require("../../../constants");
const BudgetController = require("../../../controllers/budgetController");

/**
 * Matches with /api/budget/list
 * Used to retreive Budget for a given Month and Year. It returns budget for all Categories and
 * SubCategories, even ones that have not been set. Those not set are given a value of zero (0.0)
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Budget for YYYYMMDD
 *  - yearMonth : YYYYMM
 *  - budget { ... }
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - yearMonth
 *
 */
router.route("/").post((req, res) => {
  const body = req.body;
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let { sessionUUID, yearMonth } = req.body;
  let response, dbResults, dbProfile, ownerRef, budgets;

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
    console.log("List Budget API Response:\n", response);
    res.json(response);
    return;
  }
  (async () => {
    try {
      dbResults = await db.UserProfile.find({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbResults || dbResults.length == 0) throw new Error("Invalid sessionUUID");
      dbProfile = dbResults[0];
      ownerRef = dbProfile._id;

      budgets = await BudgetController.getFullBudget(ownerRef, yearMonth);
      response = {
        status: "OK",
        message: `Retreived ${budgets.length} budgets`,
        yearMonth: yearMonth,
        budget: budgets,
      };
    } catch (error) {
      response = { status: "ERROR", message: error.message };
      console.log(error);
    }
    console.log("List Budget API Response:\n", JSON.stringify(response, null, 2));
    res.json(response);
  })();
});

module.exports = router;
