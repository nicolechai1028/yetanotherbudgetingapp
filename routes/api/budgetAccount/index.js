/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +  Created                                                                         *
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   +  Tested /close, /create /list and /modify routes                                 *
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

/**
 * @see https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
 * @see https://codeforgeek.com/expressjs-router-tutorial/
 */

const router = require("express").Router();

const closeRoute = require("./close");
const createRoute = require("./create");
const listRoute = require("./list");
const modifyRoute = require("./modify");

router.use("/close", closeRoute);       // tested
router.use("/create", createRoute);     // tested
router.use("/list", listRoute);         // tested
router.use("/modify", modifyRoute);     // tested

module.exports = router;
