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
 * Used to get a Budget budget item (by category and subCategory UUID for a given Month and Year. It returns the budget
 * for the Category and the subCategory. If the subCategory is not passed, then all subcategories will be returned
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Budget Item for categoryUUID <> subCategoryUUID <>
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
 *  - subCategoryUUID // optional
 *  - yearMonth //  optional. Use current year and month if not set or valid
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

  let { sessionUUID, yearMonth, categoryUUID, subCategoryUUID } = req.body;
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

  if (response) {
    console.log("Budget getItem API Response:\n", response);
    res.json(response);
    return;
  }

  (async () => {
    try {
      dbResults = await db.UserProfile.find({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbResults || dbResults.length == 0) throw "Invalid sessionUUID";
      dbProfile = dbResults[0];
      ownerRef = dbProfile._id;
      // make sure such a category/subcategory combination exists
      query = { ownerRef: ownerRef, _id: categoryUUID };
      dbCategory = await db.UserCategoryGroup.findOne(query);
      if (!dbCategory) throw "Invalid categoryUUID";
      // make sure subCategory exists if set
      if (subCategoryUUID){
        let found = false;
        for (let index = 0; index < dbCategory.dbSubCategory.length; index++){
          
        }
      }
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    console.log("Create Transaction API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
