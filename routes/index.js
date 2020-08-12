/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +  Added this History section                                                      *
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   +  Added Transaction (/api/transaction/*) route                                    *
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
const apiRoutesCategory = require("./api/category");
const apiRoutesTransaction = require("./api/transaction");

// @see https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
// API Routes
router.use("/api/user", apiRoutesUser);
router.use("/api/budget", apiRoutesBudget);
router.use("/api/budgetAccount", apiRoutesBudgetAccount);
router.use("/api/category", apiRoutesCategory);
router.use("/api/transaction", apiRoutesTransaction);

// If no API routes are hit, send the React app
router.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

module.exports = router;
