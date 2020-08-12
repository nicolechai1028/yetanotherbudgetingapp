/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Added this History section                                                      *
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Added "addSubCategory" route                                                    *
 *   +                                                                                  *
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
const addSubCategoryRoute = require("./addSubCategory");
// const Route = require("./");

router.use("/addSubCategory", addSubCategoryRoute); 
router.use("/create", createRoute); // tested
router.use("/list", listRoute);     // tested
router.use("/modify", modifyRoute); // 
// router.use("/", Route);

module.exports = router;
