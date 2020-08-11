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
    let response = [], query;
    try {
      if (!ownerRef || !yearMonth) throw "Missing parameter(s)";
      if (isNaN(yearMonth) || yearMonth < 200001 || yearMonth > 205012) throw "Invalid year-month parameter";
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
};
