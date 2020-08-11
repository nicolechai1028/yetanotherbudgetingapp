/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   +    Added this History section                                                    *
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
const deleteRoute = require("./delete");
const modifyRoute = require("./modify");
const listRoute = require("./list");
const findRoute = require("./find");
// const Route = require("./");

router.use("/create", createRoute);
router.use("/delete", deleteRoute);
router.use("/modify", modifyRoute);
router.use("/list", listRoute);
router.use("/find", findRoute);
// router.use("/", Route);

module.exports = router;
