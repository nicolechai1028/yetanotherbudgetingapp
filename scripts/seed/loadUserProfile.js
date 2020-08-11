/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   +  Added this History section                                                      *
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

const mongoose = require("mongoose");
const db = require("../../models");
const Constants = require("../../constants");
const { v4 } = require("uuid");
const uuidv4 = v4;
const UserCategoryGroupController = require("../../controllers/userCategoryGroupController");
require("dotenv").config();
