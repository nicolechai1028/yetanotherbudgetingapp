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
 *                                                                                      *
 *                                                                                      *
 ****************************************************************************************
 */
const router = require("express").Router();



const createRoute = require("./create");
const listRoute = require("./list");
const modifyRoute = require("./modify");
// const Route = require("./");

router.use("/create", createRoute); // tested
router.use("/list", listRoute);     // tested
router.use("/modify", modifyRoute); // 
// router.use("/", Route);

module.exports = router;
