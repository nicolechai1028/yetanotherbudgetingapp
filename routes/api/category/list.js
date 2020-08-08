/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Added this History section                                                      *
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
 * Matches routes with /api/category/list
 * Category list route. 
 * 
 * 
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Found ${count} Categories
 *  - category:
 *   [ {categoryName, categoryUUID,}
 *   ]
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>

 * Expects:
 *  - sessionUUID
 *  - categoryUUID // optional. If present, search for and return category with this UUID
 *  - categoryName // optional. If present, search for and return category with this name
 * If categoryUUID and categoryName are absent, return all categories belonging to this user
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);
  let { sessionUUID = "", categoryName = "", categoryUUID = "" } = req.body;
  let categoryName4Compare, response, dbResults, dbProfile, perspective;

  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else {
    if ((categoryName4Compare = Utilities.multipleSpaceRemovedTrimLC(categoryName)).length == 0)
      categoryName4Compare = undefined;
    if ((categoryUUID = categoryUUID.trim()).length == 0) categoryUUID = undefined;
  }
  if (response) {
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
    return;
  }

  (async () => {
    try {
      dbResults = await db.UserProfile.find({ sessionUUID: sessionUUID });
      if (dbResults != null && dbResults.length != 0) dbProfile = dbResults[0];
      if (dbProfile && dbProfile.isVerified == true) {
        let ownerRef = dbProfile._id;
        let query = { ownerRef: ownerRef };
        if (categoryUUID) query["_id"] = categoryUUID;
        if (categoryName4Compare) query["categoryName4Compare"] = categoryName4Compare;
        console.log(query);
        dbResults = await db.UserCategoryGroup.find(query);
        if (!dbResults) response = { status: "ERROR", message: "No Category found" };
        else {
          response = { status: "OK", message: `Found ${dbResults.length} Categories` };
          let categories = [];
          dbResults.map((dbCategory) => {
            categoryName = dbCategory.categoryName;
            categoryUUID = dbCategory._id;
            perspective = dbCategory.perspective;
            let subCategories = [];
            if (dbCategory.subCategory) {
              dbCategory.subCategory.map((dbSubCategory) => {
                subCategories.push({
                  subCategoryUUID: dbSubCategory._id,
                  subCategoryName: dbSubCategory.subCategoryName,
                });
              });
            }
            categories.push({
              categoryName: categoryName,
              categoryUUID: categoryUUID,
              perspective: perspective,
              subCategory: subCategories,
            });
          });
          response["category"] = categories;
        }
      } else {
        response = { status: "ERROR", message: "Invalid sessionUUID. Unable to find profile" };
      }
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
    }
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, response);
    res.json(response);
  })();
});

module.exports = router;
