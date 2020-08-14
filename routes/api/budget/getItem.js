/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-12 ==                                                                    *
 *   +  Created                                                                         *
 *                                                                                      *
 * == chikeobi-16 ==                                                                    *
 *   +  Complete route                                                                  *
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

const router = require("express").Router();
const Utilities = require("../../../utilities");
const Constants = require("../../../constants");
const db = require("../../../models");
const BudgetController = require("../../../controllers/budgetController");

/**
 * Matches with /api/budget/getItem
 * Used to get a Budget budget item (by category and subCategory UUID for a given Month and Year. It returns the budget
 * for the Category and the subCategory. If the subCategory is not passed, then all subcategories will be returned
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Budget Item for categoryUUID
 *  - yearMonth : YYYYMM
 *  - budgetItem { ... subCategory [{ ... }]}
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - categoryUUID
 *  - yearMonth //  optional. Use current year and month if not set or valid
 *
 * */

router.route("/").post((req, res) => {
  const body = req.body;
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let dbBudget, dbCategory, dbProfile, ownerRef, query, response;

  let { sessionUUID, yearMonth, categoryUUID } = req.body;
  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if (!categoryUUID || (categoryUUID = categoryUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid categoryUUID" };
  else if (
    !yearMonth ||
    (yearMonth = yearMonth.trim()).length == 0 ||
    isNaN(yearMonth) == true ||
    yearMonth < Constants.MIN_YYYYMM ||
    yearMonth > Constants.MAX_YYYYMM
  )
    yearMonth = Utilities.getYearMonth();

  // // check if subCategoryUUID is passed
  // if (subCategoryUUID && (subCategoryUUID = subCategoryUUID.trim()).length == 0)
  //   response = { status: "ERROR", message: "Invalid subCategoryUUID" };

  if (response) {
    console.log("Budget getItem API Response:\n", response);
    res.json(response);
    return;
  }

  (async () => {
    try {
      dbProfile = await db.UserProfile.findOne({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbProfile) throw "Invalid sessionUUID";
      ownerRef = dbProfile._id;
      // make sure such a category/subcategory combination exists
      query = { ownerRef: ownerRef, _id: categoryUUID };
      dbCategory = await db.UserCategoryGroup.findOne(query);
      if (!dbCategory) throw "Invalid categoryUUID";
      // search for the budget item. If not found, send an empty one back
      query = { yearMonth: yearMonth, categoryRef: categoryUUID, ownerRef: ownerRef };
      dbBudget = await db.Budget.findOne(query);

      response = await BudgetController.getAPIResponseJSON(dbBudget, dbCategory);
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    console.log("Create Transaction API Response:\n", JSON.stringify(response, null, 2));
    res.json(response);
  })();
});

module.exports = router;
