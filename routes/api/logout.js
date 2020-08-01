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

const db = require("../../models");
const crypto = require("crypto");
const Utilities = require("../../utilities");
const router = require("express").Router();

/**
 * Matches routes with /api/logout
   * Logout route. Success will return the following object:
   * 
   *  - status: OK
   *  - message : <User {email} successfully logged out>
   *  - sessionUUID : <Unique session UUID for this login session. Used for every communication with server>
   * 
   * Error will return
   *  - status : ERROR
   *  - message : <depends on condition>
   * Expects:
   *  - SessionUUID : <Unique session UUID for this login session>
 */
router.route("/").post((req, res) => {
  console.log(req.body);
});

module.exports = router;