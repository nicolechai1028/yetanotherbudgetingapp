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
const crypto = require("crypto");
const router = require("express").Router();
const Utilities = require("../../../utilities");
const db = require("../../../models");

/**
 * Matches with /api/budget/modifyItem
 *
 */
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

  let { sessionUUID ,yearMonth} = req.body;
  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
  response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
else if (
  !yearMonth ||
  (yearMonth = yearMonth.trim()).length == 0 ||
  isNaN(yearMonth) == true ||
  yearMonth < Constants.MIN_YYYYMM ||
  yearMonth > Constants.MAX_YYYYMM
)
  yearMonth = Utilities.getYearMonth();

  if (response) {
    console.log("Create Budget modifyItem API Response:\n", response);
    res.json(response);
    return;
  }

  response = { status: "ERROR", message: "Not yet implemented... sorry..." };
  (async () => {
    try {
      dbResults = await db.UserProfile.find({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbResults || dbResults.length == 0) throw "Invalid sessionUUID";
      dbProfile = dbResults[0];
      ownerRef = dbProfile._id;
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    console.log("Create Transaction API Response:\n", response);
    res.json(response);
  })();
  });
  
  module.exports = router;
  