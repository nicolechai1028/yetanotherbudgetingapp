const crypto = require("crypto");
const router = require("express").Router();
const db = require("../../../models");
const Utilities = require("../../../utilities");
const Utils = require("../../../utils");
const Constants = require("../../../constants");
const e = require("express");

/**
 * 
 * Matches routes with /api/budgetAccount/transfer
 * Budget Account transfer route.
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Successfully Transfered {amount} from "sourceName" to "destName"
 *  - transfer: { 
 *                source{ ... }, destination{ ... } 
 *              },
 *  - transaction: [ { ... }, { ... } ]
 *                   
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - sourceAccountUUID
 *  - destAccountUUID
 *  - amount
 * 
 */
router.route("/").post((req, res) => {
  const body = req.body;
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let { sessionUUID, sourceAccountUUID, destAccountUUID, amount } = req.body;
  let mode, response, query, dbSourceAccount, dbDestAccount;

  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: `Missing or invalid "sessionUUID"` };
  else if (!sourceAccountUUID || (sourceAccountUUID = sourceAccountUUID.trim()).length == 0)
    response = { status: "ERROR", message: `Missing or invalid "sourceAccountUUID"` };
  else if (!destAccountUUID || (destAccountUUID = destAccountUUID.trim()).length == 0)
    response = { status: "ERROR", message: `Missing or invalid "destAccountUUID"` };
  else if (!amount || (amount = amount.trim()).length == 0 || isNaN(amount))
    response = { status: "ERROR", message: `Missing or invalid "amount"` };

  if (response) {
    console.log("Modify Category/SubCategory API Response:\n", response);
    res.json(response);
    return;
  }

  (async () => {
    try {
      let dbProfile = await db.UserProfile.findOne({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbProfile) throw new Error("Invalid sessionUUID");
      let ownerRef = dbProfile._id;
      // get Budget Accounts
      if (!(dbSourceAccount = await db.BudgetAccount.findOne({ ownerRef: ownerRef, _id: sourceAccountUUID })))
        throw new Error("Unable to find transfer source account");
      if (dbSourceAccount.isClosed == "true")
        throw new Error(`Transfer Source account "${dbSourceAccount.name}" is Closed`);
      if (!(dbDestAccount = await db.BudgetAccount.findOne({ ownerRef: ownerRef, _id: destAccountUUID })))
        throw new Error("Unable to find transfer destination account");
      if (dbDestAccount.isClosed == "true")
        throw new Error(`Transfer Destination account "${dbDestAccount.name}" is Closed`);
      let oldSourceBal = dbSourceAccount.balance;
      let oldDestBal = dbDestAccount.balance;
      let sourceName = dbSourceAccount.name;
      let destName = dbDestAccount.name;
      let sourceBalance = new Number(oldSourceBal) - new Number(amount);
      let destBalance = new Number(oldDestBal) + new Number(amount);

      dbSourceAccount.balance = Utilities.roundToOneHundredthFin(sourceBalance);
      dbDestAccount.balance = Utilities.roundToOneHundredthFin(destBalance);

      await dbSourceAccount.save();
      await dbDestAccount.save();

      let message = `Transfered ${amount}:\n\tFrom: "${sourceName}" `;
      message += `(${sourceAccountUUID}) \n\tTo  : "${destName} (${destAccountUUID})"`;
      message += `\n\tOriginal Source Balance:      ${oldSourceBal}`;
      message += `\n\tOriginal Destination Balance: ${oldDestBal}`;

      message += `\n\tNew Source Balance:      ${dbSourceAccount.balance}`;
      message += `\n\tNew Destination Balance: ${dbDestAccount.balance}`;
      console.log(message);
      // create transactions
      // first get "Account Inflow" and "Account Outflow" "System" Categories
      let outFlowCategory = await db.UserCategoryGroup.findOne({
        ownerRef: ownerRef,
        categoryName: "Account Outflow",
        access: "System",
      });
      if (!outFlowCategory) throw new Error("Unable to load Outflow Transfer Category");
      let outFlowSubCategory = outFlowCategory.subCategory[0];
      let inFlowCategory = await db.UserCategoryGroup.findOne({
        ownerRef: ownerRef,
        categoryName: "Account Inflow",
        access: "System",
      });
      if (!inFlowCategory) throw new Error("Unable to load Inflow Transfer Category");
      let inFlowSubCategory = inFlowCategory.subCategory[0];

      // create Transaction for the Source Account (outflow)
      console.log(`\n\n************* Creating Transaction for Source Account **************`);
      let dbModel = {
        ownerRef: ownerRef,
        payee: `Transfer:Outflow to '${destName}'`,
        accountRef: sourceAccountUUID,
        categoryRef: outFlowCategory._id,
        subCategoryRef: outFlowSubCategory._id,
        memo: `Transfer:Outflow to '${destName}'`,
        amount: amount,
        date: Utilities.formatTransactionDateFromUTC(),
      };
      let transactionJSON = [];

      let dbSourceTransaction = await db.Transaction.create(dbModel);
      if (dbSourceTransaction) {
        console.log(`\n\n**** Created Source Account Transaction:\n${JSON.stringify(dbSourceTransaction, null, 2)}`);

        console.log(`\n\n************* Creating Transaction for Destination Account **************`);
        dbModel = {
          ownerRef: ownerRef,
          payee: `Transfer:Inflow from '${sourceName}'`,
          accountRef: destAccountUUID,
          categoryRef: inFlowCategory._id,
          subCategoryRef: inFlowSubCategory._id,
          memo: `Transfer:Inflow from '${sourceName}'`,
          amount: new Number(amount) * -1,
          date: Utilities.formatTransactionDateFromUTC(),
        };
        let dbDestTransaction = await db.Transaction.create(dbModel);
        if (dbDestTransaction) {
          console.log(
            `\n\n**** Created Destination Account Transaction:\n${JSON.stringify(dbDestTransaction, null, 2)}`
          );
          transactionJSON.push({
            transactionUUID: dbSourceTransaction._id,
            payee: `Transfer:Outflow to '${destName}'`,
            accountUUID: sourceAccountUUID,
            categoryUUID: outFlowCategory._id,
            subCategoryUUID: outFlowSubCategory._id,
            perspective: outFlowCategory.perspective,
            memo: `Transfer:Outflow to '${destName}'`,
            amount: amount,
            date: Utilities.formatTransactionDateFromUTC(),
          });
          transactionJSON.push({
            transactionUUID: dbDestTransaction._id,
            payee: `Transfer:Inflow from '${sourceName}'`,
            accountUUID: destAccountUUID,
            categoryUUID: inFlowCategory._id,
            subCategoryUUID: inFlowSubCategory._id,
            perspective: inFlowCategory.perspective,
            memo: `Transfer:Inflow from '${sourceName}'`,
            amount: new Number(amount) * -1,
            date: Utilities.formatTransactionDateFromUTC(),
          });
        }
      }
      let transferData = {
        source: { accountUUID: sourceAccountUUID, balance: dbSourceAccount.balance },
        destination: { accountUUID: destAccountUUID, balance: dbDestAccount.balance },
      };
      response = {
        status: "OK",
        message: `Successfully Transfered ${amount} from "${sourceName}" to "${destName}`,
        transfer: transferData,
        transaction: transactionJSON,
      };
    } catch (error) {
      console.log(error);
      response = { status: "ERROR", message: error.message };
    }
    let jsonLog = JSON.stringify(response, null, 2);
    console.log(`Budget Account Transfer API Response:\n ${jsonLog}\n`);
    res.json(response);
  })();
});

module.exports = router;
