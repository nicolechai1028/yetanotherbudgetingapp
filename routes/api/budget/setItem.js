/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-12 ==                                                                    *
 *   +  Created                                                                         *
 *                                                                                      *
 * == chikeobi-16 ==                                                                    *
 *   +  setItem is the same as modify item                                              *
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
const db = require("../../../models");
const Constants = require("../../../constants");

/**
 * Matches with /api/budget/setItem
 * Used to set a Budget budget item (by category and subCategory UUIDfor a given Month and Year. It returns the budget
 * for the Category and all the other subcategories under that category, even ones that have not been set. Those not
 * set are given a value of zero (0.0)
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Budget Item for categoryUUID <> subCategoryUUID <>
 *  - yearMonth : YYYYMM
 *  - budgetItem { ... subCategory { ... }}
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - categoryUUID
 *  - subCategoryUUID
 *  - budgetedAmount
 *  - yearMonth // NOT optional.
 * If a budget for the category/subCategory/yearMonth already exists, but the "activity" is zero(0.0), the existing
 * budget's "budgeted" value will be modified
 */
router.route("/").post((req, res) => {
  const body = req.body;
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let query,
    response,
    dbProfile,
    ownerRef,
    dbResults,
    dbCategory,
    dbSubCategory,
    dbSubCategories,
    budgetCategory,
    budgetSubCategories,
    dbBudgetCategory,
    dbBudgetSubCategories,
    dbBudgetSubCategory;

  let { sessionUUID, categoryUUID, subCategoryUUID, budgetedAmount, yearMonth } = req.body;
  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if (
    !yearMonth ||
    (yearMonth = yearMonth.trim()).length == 0 ||
    isNaN(yearMonth) == true ||
    yearMonth < Constants.MIN_YYYYMM ||
    yearMonth > Constants.MAX_YYYYMM
  )
    response = { status: "ERROR", message: "Missing or invalid Year-Month parameter" };
  else if (!categoryUUID || (categoryUUID = categoryUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid categoryUUID" };
  else if (!subCategoryUUID || (subCategoryUUID = subCategoryUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid subCategoryUUID" };
  else if (!budgetedAmount || isNaN(budgetedAmount))
    response = { status: "ERROR", message: "Missing or invalid budget amount value" };

  if (response) {
    console.log("Create Budget setItem API Response:\n", response);
    res.json(response);
    return;
  }

  budgetedAmount = Utilities.makePositive(budgetedAmount);
  (async () => {
    try {
      dbResults = await db.UserProfile.find({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbResults || dbResults.length == 0) throw "Invalid sessionUUID";
      dbProfile = dbResults[0];
      ownerRef = dbProfile._id;
      // make sure such a category/subcategory combination exists
      query = { ownerRef: ownerRef, _id: categoryUUID };
      dbCategory = await db.UserCategoryGroup.findOne(query);
      if (!dbCategory || !(dbSubCategories = dbCategory.subCategory))
        throw "Invalid categoryUUID and/or subCategoryUUID";
      for (let index = 0; index < dbSubCategories.length; index++) {
        if (dbSubCategories[index]._id == subCategoryUUID) {
          dbSubCategory = dbSubCategories[index];
          break;
        }
      }
      if (!dbSubCategory) throw "Invalid subCategoryUUID";
      // check if a budget already exists
      query = { yearMonth: yearMonth, ownerRef: ownerRef, categoryRef: categoryUUID };
      dbBudgetCategory = await db.Budget.findOne(query);
      let saved = false;
      if (dbBudgetCategory && (dbBudgetSubCategories = dbBudgetCategory.subCategory)) {
        for (let index = 0; index < dbBudgetSubCategories.length; index++) {
          if (dbBudgetSubCategories[index].subCategoryRef == subCategoryUUID) {
            dbBudgetSubCategory = dbBudgetSubCategories[index];
            break;
          }
        }
        if (dbBudgetSubCategory) {
          // one already exists. If it is zero, then set it. Otherwise throw exception
          // if (dbBudgetSubCategory.budgeted == 0) {
          dbBudgetSubCategory.budgeted = budgetedAmount;
          await dbBudgetCategory.save();
          saved = true;
          // }
        } else {
          // budgetCategory found but not budgetSubCategory
          dbBudgetSubCategory = { subCategoryRef: subCategoryUUID, budgeted: budgetedAmount, activity: 0.0 };
          dbBudgetCategory.subCategory.push(dbBudgetSubCategory);
          await dbBudgetCategory.save();
          saved = true;
        }
      } else {
        // budget not found. create one
        let subCategoryData = [{ subCategoryRef: subCategoryUUID, budgeted: budgetedAmount, activity: 0.0 }];
        let categoryData = {
          yearMonth: yearMonth,
          ownerRef: ownerRef,
          categoryRef: categoryUUID,
          subCategory: subCategoryData,
        };
        dbBudgetCategory = await db.Budget.create(categoryData);
        saved = true;
      }
      if (!dbBudgetCategory) {
        let message = `Unable to create budget item for categoryUUID "${categoryUUID}", `;
        message += `subCategoryUUID "${subCategoryUUID}" yearMonth "${yearMonth}" `;
        message += `budgeted amount "${budgetedAmount}"`;
        throw message;
      }
      if (saved == true) {
        let subData = {
          subCategoryName: dbSubCategory.subCategoryName,
          subCategoryUUID: subCategoryUUID,
          budgeted: budgetedAmount,
          activity: 0.0,
          yearMonth: yearMonth,
        };
        let data = {
          categoryUUID: categoryUUID,
          categoryName: dbCategory.categoryName,
          perspective: dbCategory.perspective,
          subCategory: subData,
        };
        response = {
          status: "OK",
          message: `Budget Item for categoryUUID ${categoryUUID} subCategoryUUID ${subCategoryUUID}`,
          budgetItem: data,
        };
      }
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    console.log("Buget setItem API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
