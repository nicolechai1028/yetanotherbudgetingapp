const express = require("express");
const mongoose = require("mongoose");
const Constants = require("./constants");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const routes = require("./routes");
const db = require("./models");
const Utilities = require("./utilities");
require("dotenv").config();

function startAndInitializeDatabase() {
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
      connection.db.dropCollection("currencies", function (err, res) {
        if (err) console.log("ERR (drop collection):", err.message);
        else console.log('Collection "currencies" dropped.');

        // ************ Load Currencies ***********
        (async () => {
          let results = [];
          console.log("Loading Currencies into currencies collection");
          for (let index = 0; index < Constants.CURRENCIES.length; index++) {
            let currencyModel = Constants.CURRENCIES[index];
            let dbResult = await db.Currency.create(currencyModel);
            if (dbResult == null || !dbResult._id) {
              console.log(`\nUnable to save Currency object:\n`, currencyModel);
            } else results.push(dbResult);
          }
          console.log(`\n${results.length} Currency objects loaded into database\n`);
          //console.log(JSON.stringify(results,null,2));
        })();
        // ****************************************
      });
    });
  } catch (error) {
    console.log("\n\n***ERROR***\n", error.message);
  }
}

module.exports = {startAndInitializeDatabase};
//startDatabase();
