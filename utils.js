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
          console.log(`\n${results.length} Currency objects loaded into database\n\n`);
          //console.log(JSON.stringify(results,null,2));
        })();
        // ****************************************
      });
    });
  } catch (error) {
    console.log("\n\n***ERROR***\n", error.message);
  }
}

/**
 * Used to update budget. If dbXaction == null then it is a transaction delete. If oldXaction == null,
 * then it is a new (create) transaction. If neither is null, then it is an update transaction
 * @param {Tansaction Document} dbXaction // optional. "New" transaction Replace with null. If not present, then oldXaction must be
 * @param {Tansaction Document} oldXaction // optional. "Old" transaction. Replace with null. If not present, then dbXaction must be
 * @param {UserCategory Document} dbCategory
 * @param {string} subCategoryUUID // required. Sub Category UUID
 */
async function updateBudgetWithTransaction(dbXaction, oldXaction, dbCategory, subCategoryUUID) {
  try {
    let dbSubCategory, mode, ownerRef, amount, yearMonth;
    if (!dbCategory || !subCategoryUUID || !(dbSubCategory = dbCategory.getSubCategoryById(subCategoryUUID))) return;

    if (dbXaction && dbXaction == null) dbXaction = undefined;
    if (oldXaction && oldXaction == null) oldXaction = undefined;

    if (dbXaction && !oldXaction) {
      mode = "create";
      ownerRef = dbXaction.ownerRef;
      yearMonth = parseInt(dbXaction.date / 100);
      amount = dbXaction.amount;
    } else if (dbXaction && oldXaction) {
      mode = "modify";
      ownerRef = dbXaction.ownerRef;
      yearMonth = parseInt(dbXaction.date / 100);
      amount = oldXaction.amount * -1 + dbXaction.amount;
    } else if (!dbXaction && oldXaction) {
      mode = "delete";
      ownerRef = oldXaction.ownerRef;
      yearMonth = parseInt(oldXaction.date / 100);
      amount = oldXaction.amount * -1;
    } else return;

    if (Math.abs(amount) < 0.01) return; // rounding error
    console.log(`\n\n******** MODE *********** (${mode})**************`);
    // check if there is a budget for the transaction yearMonth
    if (yearMonth < Constants.MIN_YYYYMM || yearMonth > Constants.MAX_YYYYMM) return;
    // get budget, if it exists
    let categoryUUID = dbCategory._id;
    let query = { yearMonth: yearMonth, categoryRef: categoryUUID, ownerRef: ownerRef };
    let dbBudget = await db.Budget.findOne(query);
    if (!dbBudget) {
      let subModels = [];
      let idNamesMap = dbCategory.getSubCategoryIdNameMap();
      for (idKey in idNamesMap) {
        let model = { subCategoryRef: idKey, budgeted: 0.0, activity: 0.0 };
        if (idKey == subCategoryUUID) model["activity"] = amount;
        subModels.push(model);
      }
      // create budget
      let budgetModel = {
        yearMonth: yearMonth,
        ownerRef: ownerRef,
        categoryRef: categoryUUID,
        subCategory: subModels,
      };
      console.log("\n\n******** Creating Budget Item From Transaction *********:");
      console.log(`\n**** Model Data ****:\n${JSON.stringify(budgetModel, null, 2)}`);
      dbBudget = await db.Budget.create(budgetModel);
      console.log(`\n*** Saved Data ****:\n${JSON.stringify(dbBudget, null, 2)}\n\n`);
    } else {
      let subBudget = null;
      console.log("\n\n******** Updating Budget Item From Transaction *********:");
      console.log(`**** Previous Budget ****:\n${JSON.stringify(dbBudget, null, 2)}`);
      for (let index = 0; index < dbBudget.subCategory.length; index++) {
        subBudget = dbBudget.subCategory[index];
        if (subBudget.subCategoryRef == subCategoryUUID) {
          subBudget.activity += amount;
          subBudget = null;
          break;
        }
      }
      // budget found, but no entry for subCategory
      if (subBudget == null) {
        let model = { subCategoryRef: subCategoryUUID, budgeted: 0.0, activity: amount };
        dbBudget.subCategory.push(model);
        await dbBudget.save();
        console.log(`\n*** Updated Data ****:\n${JSON.stringify(dbBudget, null, 2)}\n\n`);
      }
    }
    return dbBudget;
  } catch (error) {
    console.log(error);
    return;
  }
}

module.exports = { startAndInitializeDatabase ,updateBudgetWithTransaction};
//startDatabase();
