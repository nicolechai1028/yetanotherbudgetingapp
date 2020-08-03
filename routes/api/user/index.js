
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

const loginRoute = require("./login");
const logoutRoute = require("./logout");
const registerRoute = require("./register");
const verifyRoute = require("./verify");

router.use("/login", loginRoute);
router.use("/logout", logoutRoute);
router.use("/register", registerRoute);
router.use("/verify", verifyRoute);

module.exports = router;
