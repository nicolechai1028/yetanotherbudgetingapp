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
 * Matches routes with /api/category/create
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
 *  - categoryName // must be unique in the user's realm
 *  - perspective
 *  - subCategory[] // array of names. Must be unique for this category
 *
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);
  let { sessionUUID = "", categoryName = "", perspective = "", subCategory = [] } = req.body;
  console.log(sessionUUID, categoryName, perspective, subCategory);

  let response, dbResults, dbProfile, dbCategory, dbSubScategory;

  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if (!categoryName || (categoryName = Utilities.multipleSpaceRemovedTrim(categoryName)).length == 0)
    response = { status: "ERROR", message: "Missing or invalid Category Name" };
  else if (!perspective || (perspective = Utilities.multipleSpaceRemovedTrim(perspective)).length == 0)
    response = { status: "ERROR", message: "Missing or invalid Perspective" };
  // make sure perspective is one of the valid values, case insensitive
  else if (!(perspective = checkPerspective(perspective)))
    response = { status: "ERROR", message: "Invalid Perspective" };
  else if (!Array.isArray(subCategory)) response = { status: "ERROR", message: "Invalid SubCategory" };
  else if (Utilities.findDuplicateInArrayTrimLC(subCategory))
    response = { status: "ERROR", message: "Duplicates in SubCategory" };

  if (response) {
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
    return;
  }

  (async () => {
    try {
      if (!(dbProfile = await db.UserProfile.findOne({ sessionUUID: sessionUUID }))) throw new Error("Invalid SessionUUID");

      let ownerRef = dbProfile._id;
      // check to see if there is a Category beloing to the user that has the "same" name
      let categoryName4Compare = Utilities.multipleSpaceRemovedTrimLC(categoryName);
      dbResults = await db.UserCategoryGroup.find({ ownerRef: ownerRef, categoryName4Compare: categoryName4Compare });
      if (dbResults && dbResults.length != 0)
        response = { status: "ERROR", message: `A Category Exists with name (${categoryName})` };
      else {
        // create Category. First make subCategory
        let subCat = [];
        subCategory.every((sub) => {
          subCat.push({ subCategoryName: Utilities.multipleSpaceRemovedTrim(sub) });
          return true;
        });
        let dbModel = {
          ownerRef: ownerRef,
          categoryName: categoryName,
          categoryName4Compare: categoryName4Compare,
          perspective: perspective,
          subCategory: subCat,
        };

        console.log("\n\ndbModel:\n", dbModel);

        dbCategory = await db.UserCategoryGroup.create(dbModel);
        console.log("\n\nSaved Category:\n", dbCategory);
        if (!dbCategory) {
          response = { status: "ERROR", message: `Unable to create Category: (${categoryName})` };
        } else {
          // make response
          subCat = [];
          for (let index = 0; index < dbCategory.subCategory.length; index++) {
            dbSubScategory = dbCategory.subCategory[index];
            subCat.push({ subCategoryName: dbSubScategory.subCategoryName, subCategoryUUID: dbSubScategory._id });
          }
          response = {
            status: "OK",
            message: `Category with ${dbCategory.subCategory.length} Sub Categories created`,
            categoryName: dbCategory.categoryName,
            perspective: dbCategory.perspective,
            categoryUUID: dbCategory._id,
            subCategory: subCat,
          };
        }
      }
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
    }
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
  })();
});

function checkPerspective(perspective) {
  let retval;
  let perspectiveLC = perspective.toLowerCase();
  let index = Constants.ACCOUNT_PERSPECTIVES.findIndex((ele) => {
    return Utilities.multipleSpaceRemovedTrimLC(ele) === perspectiveLC;
  });
  if (index != -1) retval = Constants.ACCOUNT_PERSPECTIVES[index];
  return retval;
}
module.exports = router;
