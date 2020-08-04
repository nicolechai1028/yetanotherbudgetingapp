/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *   +                                                                                  *
 *   +                                                                                  *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 ****************************************************************************************
 */

const path = require("path");
const router = require("express").Router();
const apiRoutesUser = require("./api/user");
const apiRoutesBudget = require("./api/budget");
const apiRoutesBudgetAccount = require("./api/budgetAccount");

// @see https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
// API Routes
router.use("/api/user", apiRoutesUser);
router.use("/api/budget", apiRoutesBudget);
router.use("/api/budgetAccount", apiRoutesBudgetAccount);

// If no API routes are hit, send the React app
router.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

module.exports = router;
