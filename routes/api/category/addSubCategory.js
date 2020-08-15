/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Added this History section                                                      *
 *                                                                                      *
 * == chikeobi-14 ==                                                                    *
 *   +  Modified it so you can reate a Category without subCategories.                  *
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
const Constants = require("../../../constants");

/**
 * Matches routes with /api/category/addSubCategory
 * Create category route
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : "Category with ${count} sub categories created"
 *  - categoryName:
 *  - categoryUUID
 *  - perspective
 *  - subCategory
 *    [
 *      {
 *        subCategoryName,
 *        subCategoryUUID
 *      }
 *    ]
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - categoryUUID // must be unique in the user's realm
 *  - subCategory[] // MUST be array of names. Only those that are unique will be created. Others will be ignored.
 *
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let { sessionUUID, categoryUUID, subCategory } = req.body;

  let response, dbProfile, dbCategory;

  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if (!categoryUUID || (categoryUUID = categoryUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid categoryUUID" };
  else if (!subCategory || !Array.isArray(subCategory) || subCategory.length == 0)
    response = { status: "ERROR", message: "Missing or invalid subCategory" };

  if (response) {
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
    return;
  }

  (async () => {
    try {
      if (!(dbProfile = await db.UserProfile.findOne({ sessionUUID: sessionUUID }))) throw new Error("Invalid SessionUUID");
      let ownerRef = dbProfile._id;

      let subCategoryNames = Utilities.removeDuplicateInArrayTrimLC(subCategory);
      console.log("\n\nSubCategoryNames:\n", subCategoryNames, "\n\n");
      // get Category
      dbCategory = await db.UserCategoryGroup.findById(categoryUUID);
      let uniqueSubCategoryNames = [];
      if (!dbCategory) throw new Error("Invalid categoryUUID");
      for (let index = 0; index < subCategoryNames.length; index++) {
        let subCategoryName = subCategoryNames[index];
        name4compare = Utilities.multipleSpaceRemovedTrimLC(subCategoryName);
        console.log(`\nInput subCategory Name: ${subCategoryName}\tName4Compare: ${name4compare}`);
        let found = false;
        for (let count = 0; count < dbCategory.subCategory.length; count++) {
          let dbSub = dbCategory.subCategory[count];
          console.log(
            `dbSubCategory Name: ${dbSub.subCategoryName}\tName4Compare: ${Utilities.multipleSpaceRemovedTrimLC(
              dbSub.subCategoryName
            )}`
          );
          if (name4compare == Utilities.multipleSpaceRemovedTrimLC(dbSub.subCategoryName)) {
            found = true;
            break;
          }
        }
        if (found == false) uniqueSubCategoryNames.push(subCategoryName);
      }
      if (uniqueSubCategoryNames.length == 0) throw new Error("No Sub Category added");

      console.log("\n\nUnique Names:\n", uniqueSubCategoryNames);

      for (let index = 0; index < uniqueSubCategoryNames.length; index++)
        dbCategory.subCategory.push({ subCategoryName: uniqueSubCategoryNames[index] });
      await dbCategory.save();
      let subResp = [];
      console.log("\n\nSaved Category:\n", JSON.stringify(dbCategory, null, 2));
      for (let index = 0; index < dbCategory.subCategory.length; index++) {
        let dbSub = dbCategory.subCategory[index];
        subResp.push({ subCategoryName: dbSub.subCategoryName, subCategoryUUID: dbSub._id });
      }
      response = {
        status: "OK",
        message: `Added ${uniqueSubCategoryNames.length} Sub Categories to ${dbCategory.categoryName}`,
        categoryName: dbCategory.categoryName,
        categoryUUID: categoryUUID,
        perspective: dbCategory.perspective,
        subCategory: subResp,
      };
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
    }
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
  })();
});

module.exports = router;
