/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *   +    Created function to initialize GenericCategoryGroup                                                                              *
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

// This file empties the Books collection and inserts the books below

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || Constants.DEV_MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const dropDb = process.env.DROP_DATABASE || false;
const connection = mongoose.connection;
try {
  connection.once("open", function () {
    console.log("*** MongoDB got connected ***");
    console.log(`Our Current Database Name : ${connection.db.databaseName}`);
    if (dropDb == true) connection.db.dropDatabase(console.log(`${connection.db.databaseName} database dropped.`));
  });
} catch (error) {
  console.log(error.message);
  process.exit();
}

try {
  //UserCategoryGroupController.InitializeUserCategoryGroup("bootcamp.yaba.project@gmail.com");
} catch (error) {
  console.log(error.message);
  process.exit();
}
