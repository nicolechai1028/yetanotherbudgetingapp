/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   +  Added function to return JSON format of database returned object                *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 ****************************************************************************************
 */

const db = require("../models");
const Utilities = require("../utilities");
const Constants = require("../constants");

// Define methods for the BudgetAccount controller

module.exports = {
  getFullBudget: async (ownerRef, yearMonth) => {
    let response = [],
      query;
    try {
      if (!ownerRef || !yearMonth) throw new Error("Missing parameter(s)");
      if (isNaN(yearMonth) || yearMonth < 200001 || yearMonth > 205012) throw new Error("Invalid year-month parameter");
      let dbProfile = await db.UserProfile.findById(ownerRef);
      if (!dbProfile) throw `Unable to find User Profile for ${ownerRef}`;
      // get all the budgets for this user and key by categoryUUID. There should be only one document per
      // ownerRef/yyyymm/subCategoryUUID
      let dbBudgets = await db.Budget.find({ ownerRef: ownerRef, yearMonth: yearMonth });
      // arrange budgets into object with categoryUUID as key
      let dbBudgetKeyValues = {};
      if (dbBudgets && dbBudgets.length != 0) {
        dbBudgets.every((dbBudget) => {
          dbBudgetKeyValues[dbBudget.categoryRef] = dbBudget;
        });
      }
      // get all the UserCategoryGroup for this user
      query = { ownerRef: ownerRef, access: "User" };
      let dbUserCategories = await db.UserCategoryGroup.find(query);
      if (dbUserCategories && dbUserCategories.length != 0) {
        dbUserCategories.every((dbUserCategory) => {
          let categoryUUID = dbUserCategory._id;
          let category = {
            categoryUUID: categoryUUID,
            categoryName: dbUserCategory.categoryName,
            perspective: dbUserCategory.perspective,
          };
          let subCategories = [];
          dbUserCategory.subCategory.every((dbSubCategory) => {
            dbSubCategoryUUID = dbSubCategory._id;
            dbSubCategoryName = dbSubCategory.subCategoryName;
            let budgeted = 0.0;
            let activity = 0.0;
            let budgetCategory, budgetSubCategories;
            // check if there is a defined budget for this category and that subcategories exist
            // Then go through the subCategories of the budget and extract the values
            if (
              (budgetCategory = dbBudgetKeyValues[categoryUUID]) &&
              (budgetSubCategories = budgetCategory.subCategory)
            ) {
              budgetSubCategories.every((budgetSubCategory) => {
                if (budgetSubCategory.subCategoryRef == dbSubCategoryUUID) {
                  budgeted = budgetSubCategory.budgeted;
                  activity = budgetSubCategory.activity;
                  return false;
                }
                return true;
              });
            }
            subCategories.push({
              subCategoryName: dbSubCategoryName,
              subCategoryUUID: dbSubCategoryUUID,
              budgeted: budgeted,
              activity: activity,
            });
            return true;
          });
          category.subCategory = subCategories;
          response.push(category);
          return true;
        });
      }
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    return response;
  },
  /**
   * Creates a "model" ready for insertion into database.
   * Requires:
   *  - dbCategory - UserCategoryGroup object from the database
   * Optional:
   *  - yearMonth - 6 digit year-month. If absent, current year-month will be used
   * Returns:
   *  { status, message, model{}}
   */
  buildBudgetModel: (dbcategory, yearMonth) => {
    let response, dbSubCategory, dbSubCategories, categoryUUID, subCategoryUUID, subCategoryName;
    try {
      if (!dbcategory) throw new Error("Missing parameter");
      if (!yearMonth) yearMonth = Utilities.getYearMonth();
      let { ownerRef, categoryName, perspective } = dbcategory;
      if (!ownerRef || !categoryName || !perspective || !(dbSubCategories = dbcategory.subCategory))
        throw new Error("Parameter is not the righ type");
      categoryUUID = dbcategory._id;
      let subCatogory = [];
      for (let index = 0; index < dbSubCategories.length; index++) {
        dbSubCategory = dbSubCategories[index];
        subCategoryUUID = dbSubCategory._id;
        subCategoryName = dbSubCategory.subCategoryName;
        subCatogory.push({
          subCategoryUUID: subCategoryUUID,
          subCategoryName: subCategoryName,
          budgeted: 0.0,
          activity: 0.0,
        });
      }
      response = {
        status: "OK",
        message: `Budget with ${dbSubCategories.length} entries`,
        budget: {
          categoryUUID: categoryUUID,
          categoryName: categoryName,
          perspective: perspective,
          yearMonth: yearMonth,
          subCategory: subCatogory,
        },
      };
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    return response;
  },
  /**
   * Convert Budget Database object into JSON format. If dbCategory is passed and matches with the budget
   * categoryName,subCategoryName  and perspective will be included
   */
  toJSON: async (dbBudget, dbcategory) => {
    let response;
    try {
      if (!dbBudget || !dbBudget._id) throw new Error("Invalid dbBudget object");
      // make copy of budget object
      let budgetJSON = JSON.parse(JSON.stringify(dbBudget));
      delete budgetJSON._id;
      delete budgetJSON._v;
      let categoryUUID = budgetJSON.categoryRef;
      delete budgetJSON.categoryRef;
      budgetJSON.categoryUUID = categoryUUID;
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    return response;
  },
  getAPIResponseJSON: async (dbBudget, dbCategory) => {
    let response, yearMonth;
    try {
      if (!dbCategory) throw new Error("Category Object is missing dbBudget object");
      if (!dbBudget) yearMonth = Utilities.getYearMonth();
      else yearMonth = dbBudget.yearMonth;
      let budgetItem = {
        categoryUUID: dbCategory._id,
        categoryName: dbCategory.categoryName,
        perspective: dbCategory.perspective,
        yearMonth: yearMonth,
      };
      let subCategories = [];
      let subCatIdNameMap = dbCategory.getSubCategoryIdNameMap();
      if (dbBudget) {
        for (let index = 0; index < dbBudget.subCategory.length; index++) {
          let subBudget, dbSubId, subName, budgeted, activity;
          subBudget = dbBudget.subCategory[index];
          dbSubId = subBudget.subCategoryRef;
          subName = subCatIdNameMap[dbSubId];
          if (subName) {
            budgeted = subBudget.budgeted;
            activity = subBudget.activity;
            subCategories.push({
              subCategoryUUID: dbSubId,
              subCategoryName: subName,
              budgeted: budgeted,
              activity: activity,
            });
          }
          delete subCatIdNameMap[dbSubId];
        }
      }
      // go through remaining pairs and attach to budget
      for (let subId in subCatIdNameMap) {
        let subName = subCatIdNameMap[subId];
        subCategories.push({ subCategoryUUID: subId, subCategoryName: subName, budgeted: 0.0, activity: 0.0 });
      }
      budgetItem.subCategory = subCategories;
      response = { status: "OK", message: `Budget with ${subCategories.length} entries`, budgetItem: budgetItem };
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
    }
    return response;
  },
};
