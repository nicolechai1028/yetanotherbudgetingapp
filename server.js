/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   +    Upon connection to the database, drop Currency collection if it exists        *
 *   +      and load it with data from Constsnts.CURRENCIES                             *
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

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
require("dotenv").config();

const Constants = require("./constants");
const routes = require("./routes");
const db = require("./models");
const Utilities = require("./utilities");

//const routes = require("./routes");
const app = express();

//const DEV_MONGODB_URI = "mongodb://localhost/yetanotherbudgetingapp";
const PORT = process.env.PORT || 3001;
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Add routes, both API and view
app.use(routes);

const Utils = require ("./utils");
Utils.startAndInitializeDatabase();
// Utilities.startAndInitializeDatabase();

// Start the API server
app.listen(PORT, function () {
  console.log(`  API Server now listening on PORT ${PORT}!`);
});
