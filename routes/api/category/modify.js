/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Added this History section                                                      *
 *                                                                                      *
 * == chikeobi-17 ==                                                                    *
 *   +  Completed route                                                                 *
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
const db = require("../../../models");
const Utilities = require("../../../utilities");
const Utils = require("../../../utils");
const Constants = require("../../../constants");
const e = require("express");

/**
 * Matches routes with /api/category/modify
 * Category modify route. 
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : World Currencies
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - categoryUUID/subCategoryUUID
 *  - newName
 */
router.route("/:mode?").post((req, res) => {
  const body = req.body;
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let { sessionUUID, categoryUUID, subCategoryUUID, newName } = req.body;
  let mode, response, query;

  // check mode
  if (!(mode = req.params.mode)) mode = "edit";
  if ((mode = mode.trim()).length == 0) response = { status: "ERROR", message: `Invalid "mode" URL parameter` };
  // name sure we have either sessionUUID and either categoryUUID or subCategoryUUID
  else if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: `Missing or invalid "sessionUUID"` };
  else if (
    (!categoryUUID || (categoryUUID = categoryUUID.trim()).length == 0) &&
    (!subCategoryUUID || (subCategoryUUID = subCategoryUUID.trim()).length == 0)
  )
    response = { status: "ERROR", message: `Must have either "categoryUUID" OR "subCategoryUUID"` };
  else if (categoryUUID && subCategoryUUID)
    response = { status: "ERROR", message: `Cannot have both "categoryUUID" AND "subCategoryUUID"` };
  else
    switch (mode.toLowerCase()) {
      case "edit":
        if (!newName || (newName = newName.trim()).length == 0)
          response = { status: "ERROR", message: `Missing or invalid "newName"` };
        break;
      case "delete":
        break;
      default:
        response = { status: "ERROR", message: `Invalid "mode" URL parameter` };
    }

  if (response) {
    console.log("Modify Category/SubCategory API Response:\n", response);
    res.json(response);
    return;
  }

  (async () => {
    try {
      let dbProfile = await db.UserProfile.findOne({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbProfile) throw "Invalid sessionUUID";
      let ownerRef = dbProfile._id;
      let dbCategory, dbSubCategory, dbSubCategoryParent, dbResult;
      // set Category if that is what is needed
      if (categoryUUID && !(dbCategory = await db.UserCategoryGroup.findOne({ ownerRef: ownerRef, _id: categoryUUID })))
        throw "Unable to find Category";
      else if (
        subCategoryUUID &&
        !(dbSubCategoryParent = await db.UserCategoryGroup.findOne({
          ownerRef: ownerRef,
          "subCategory._id": subCategoryUUID,
        }))
      )
        throw "Unable to find subCategoryUUID";
      // one or the other has been found
      if (dbCategory)
        console.log(
          `\n\n************** Found Category (ID = ${categoryUUID}):\n${JSON.stringify(dbCategory, null, 2)}\n`
        );
      if (dbSubCategoryParent)
        console.log(
          `\n\n************** Found SubCategory (ID = ${subCategoryUUID}):\n${JSON.stringify(
            dbSubCategoryParent,
            null,
            2
          )}\n`
        );
      let categoryName,
        subCategoryName = "";
      if (mode == "delete") {
        console.log("\n\n************* DELETE MODE ***********************");
        // check if the category/subCategory is in use in "Budget" or "Transaction"
        if (dbCategory) {
          // Transaction:
          categoryName = dbCategory.categoryName;
          query = { ownerRef: ownerRef, categoryRef: categoryUUID };
          dbResult = await db.Transaction.findOne(query);
          if (dbResult) {
            console.log(`\n\n******* Cannot Delete Category "${categoryName}" becase of attached Transaction:\n`);
            console.log(JSON.stringify(dbResult, null, 2));
            throw "Cannot delete Category because of attached Transaction";
          }
          // Budget
          query = { ownerRef: ownerRef, categoryRef: categoryUUID };
          dbResult = await db.Budget.findOne(query);
          if (dbResult) {
            console.log(`\n\n******* Cannot Delete Category "${categoryName}" becase of attached Budget:\n`);
            console.log(JSON.stringify(dbResult, null, 2));
            throw "Cannot delete Category because of attached Budget";
          }
          // no error, so delete Category
          await dbCategory.remove();
          response = { status: "OK", message: "Category Successfully removed" };
          //
        } else if (dbSubCategoryParent) {
          // Transaction
          query = { ownerRef: ownerRef, subCategoryRef: subCategoryUUID };
          dbResult = await db.Transaction.findOne(query);
          if (dbResult) {
            console.log(`\n\n******* Cannot Delete SubCategory "${subCategoryName}" becase of attached Transaction:\n`);
            console.log(JSON.stringify(dbResult, null, 2));
            throw "Cannot delete SubCategory because of attached Transaction";
          }
          // Budget
          query = { ownerRef: ownerRef, "subCategory._id": subCategoryUUID };
          dbResult = await db.Budget.findOne(query);
          if (dbResult) {
            console.log(`\n\n******* Cannot Delete SubCategory "${subCategoryName}" becase of attached Budget:\n`);
            console.log(JSON.stringify(dbResult, null, 2));
            throw "Cannot delete SubCategory because of attached Budget";
          }
          // no error, so delete SubCategory
          await dbSubCategoryParent.subCategory.id(subCategoryUUID).remove();
          await dbSubCategoryParent.save();
          response = { status: "OK", message: "SubCategory Successfully removed" };
        }
      } else if (mode == "edit") {
        console.log("\n\n************* EDIT/MODIFY MODE ***********************");
        if (dbCategory) {
          let oldName = dbCategory.categoryName;
          dbCategory.categoryName = newName;
          dbCategory.categoryName4Compare = Utilities.multipleSpaceRemovedTrimLC(newName);
          await dbCategory.save();
          response = { status: "OK", message: `Category Successfully renamed from "${oldName}" to "${newName}"` };
        } else if (dbSubCategoryParent) {
          for (let index = 0; index < dbSubCategoryParent.subCategory.length; index++) {
            if (dbSubCategoryParent.subCategory[index]._id == subCategoryUUID) {
              dbSubCategory = dbSubCategoryParent.subCategory[index];
              break;
            }
          }
          if (dbSubCategory) {
            let oldName = dbSubCategory.subCategoryName;
            dbSubCategory.subCategoryName = newName;
            await dbSubCategoryParent.save();
            response = { status: "OK", message: `SubCategory Successfully renamed from "${oldName}" to "${newName}"` };
          }
        }
      } else throw `Unknown MODE (${mode})`;
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
    }
    let jsonLog = JSON.stringify(response, null, 2);
    console.log(`Modify Category/SubCategory API Response (Mode = "${mode}"):\n ${jsonLog}\n`);
    res.json(response);
  })();
});

module.exports = router;
