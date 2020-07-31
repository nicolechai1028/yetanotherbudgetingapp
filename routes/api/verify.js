/**
 * @see https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
 * @see https://codeforgeek.com/expressjs-router-tutorial/
 */
const db = require("../../models");
const crypto = require("crypto");
const Utilities = require("../../utilities");
const router = require("express").Router();

/**
 * Matches routes with /api/verify/:verifyCode
 * Verification code in req.params.verifyCode
 */
router.route("/:verifyCode").get((req, res) => {
  console.log(req.params);
});

module.exports = router;
