const crypto = require("crypto");
const router = require("express").Router();
const db = require("../../../models");
const Utilities = require("../../../utilities");
const Utils = require("../../../utils");
const Constants = require("../../../constants");
const e = require("express");

/**
 * Matches routes with /api/category/modify
 * Category modify route. 
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : World Currencies
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - fromAccountUUID
 *  - toAccountUUID
 *  - amount
 */
router.route("/").post((req, res) => {
  const body = req.body;
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let { sessionUUID, categoryUUID, subCategoryUUID, newName } = req.body;
  let mode, response, query;


});

module.exports = router;
