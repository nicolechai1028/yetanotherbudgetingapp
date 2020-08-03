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

const crypto = require("crypto");
const router = require("express").Router();
const Utilities = require("../../../utilities");
const db = require("../../../models");
const UserProfileController = require("../../../controllers/userProfileController");

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

  let sessionUUID = req.body.sessionUUID;

  if (sessionUUID == null) {
    res.json({ status: "ERROR", message: "Invalid or missing sessionUUID" });
    return;
  }

  UserProfileController.findBySessionUUID(sessionUUID)
    .then((dbResults) => {
      if (dbResults == null || dbResults.length != 1) {
        res.json({ status: "ERROR", message: "Associated account not found" });
        return;
      }
      let dbResult = dbResults[0];
      dbResult.lastLogoutTimestamp = Date.now();

      if (process.env.NODE_ENV === "production") dbResult.sessionUUID = undefined;
      
      dbResult.save((err) => {
        if (err) res.json({ status: "ERROR", message: err.message });
        else res.json({ status: "OK", message: `Successfully logged out ${dbResult.fullName}` });
      });
    })
    .catch((error) => {
      res.json({ status: "ERROR", message: error.message });
      return;
    });
});

module.exports = router;
