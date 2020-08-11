
/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Created                                                                       *
 *   +                                                                                  *
 * == chikeobi-03 ==                                                                    *
 *   +  Changed route paths to match new names. Added "listBudget" and                  *
 *        "modifyBudgetItem" routes                                                     *
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

const getItemRoute = require("./getItem");
const listRoute = require("./list");
const modifyItemRoute = require("./modifyItem");
const setItemRoute = require("./setItem");

router.use("/getItem", getItemRoute);
router.use("/list", listRoute);
router.use("/modifyItem", modifyItemRoute);
router.use("/setItem", setItemRoute);

module.exports = router;
