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
 *
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
      dbProfile = await db.UserProfile.findOne({ sessionUUID: sessionUUID });
      if (!dbProfile) throw new Error("Invalid sessionUUID");
      if (dbProfile.isVerified != true) throw new Error("Account is not verified");
      let ownerRef = dbProfile._id;
      let query = { ownerRef: ownerRef };
      if (categoryUUID) query["_id"] = categoryUUID;
      if (categoryName4Compare) query["categoryName4Compare"] = categoryName4Compare;
      console.log(query);
      dbResults = await db.UserCategoryGroup.find(query);
      if (!dbResults) throw new Error("No Category found");
      response = { status: "OK", message: `Found ${dbResults.length} Categories` };
      let categories = [];
      dbResults.every((dbCategory) => {
        categoryName = dbCategory.categoryName;
        categoryUUID = dbCategory._id;
        perspective = dbCategory.perspective;
        let subCategories = [];
        if (dbCategory.subCategory) {
          dbCategory.subCategory.every((dbSubCategory) => {
            subCategories.push({
              subCategoryUUID: dbSubCategory._id,
              subCategoryName: dbSubCategory.subCategoryName,
            });
            return true;
          });
        }
        categories.push({
          categoryName: categoryName,
          categoryUUID: categoryUUID,
          perspective: perspective,
          subCategory: subCategories,
        });
        return true;
      });
      response["category"] = categories;
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
    }
    console.log(`\nResponse for ${Utilities.getFullUrl(req)}:\n`, JSON.stringify(response, null, 2));
    res.json(response);
  })();
});

module.exports = router;
