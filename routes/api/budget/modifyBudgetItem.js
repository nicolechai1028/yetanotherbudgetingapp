/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-05 ==                                                                    *
 *   +    Created                                                                       *
 *                                                                                      *
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
const crypto = require("crypto");
const router = require("express").Router();
const Utilities = require("../../../utilities");
const db = require("../../../models");

/**
 * Matches with /api/budget/modifyBudgetItem
 *
 */
router.route("/").post((req, res) => {
    const body = req.body;
    console.log(Utilities.getFullUrl(req));
    console.log(body);
  
    res.json({ status: "OK", message: `(${req.method}) ==> ${Utilities.getFullUrl(req)}` });
  });
  
  module.exports = router;
  