/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *   +    Moved file to route/api/user                                                  *
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
const router = require("express").Router();

const currencyRoute = require("./currency");
const loginRoute = require("./login");
const logoutRoute = require("./logout");
const profileRoute = require("./profile");
const registerRoute = require("./register");
const verifyRoute = require("./verify");
const transactionRoute = require("./transactions");

router.use("/currency", currencyRoute); // tested
router.use("/login", loginRoute); // tested
router.use("/logout", logoutRoute); // tested
router.use("/profile", profileRoute); // tested
router.use("/register", registerRoute); // tested
router.use("/verify", verifyRoute); // tested
router.use("/transactions", transactionRoute); //not tested

module.exports = router;
