/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   +    Added this History section                                                    *
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

/**
 * @see https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
 * @see https://codeforgeek.com/expressjs-router-tutorial/
 */

const crypto = require("crypto");
const router = require("express").Router();
const db = require("../../../models");
const Utilities = require("../../../utilities");
const Constants = require("../../../constants");
const AccountController = require("../../../controllers/budgetAccountController");

/**
 * Matches routes with /api/transaction/delete
 *
 * Success will return the following object:
 *
 *  - status: OK
 *  - message : Transaction {UUID} Deleted. Account {UUID} Updated
 *  - transactionUUID
 *  - account { ... }
 *
 * Error will return:
 *  - status : ERROR
 *  - message : <Error message>
 *
 * Expects:
 *  - sessionUUID
 *  - transactionUUID
 */
router.route("/").post((req, res) => {
  console.log(Utilities.getFullUrl(req));
  console.log(req.body);

  let response, dbProfile, ownerRef, dbAccount, dbResults, dbXaction, dbCategory, subCategoryUUID, debugLog, amount;

  let { sessionUUID, transactionUUID } = req.body;

  if (!sessionUUID || (sessionUUID = sessionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid sessionUUID" };
  else if (!transactionUUID || (transactionUUID = transactionUUID.trim()).length == 0)
    response = { status: "ERROR", message: "Missing or invalid transactionUUID" };
  if (process.env.YET_DEBUG == true) {
    debugLog += "\n\n********************* DEBUG LOG ************************";
    debugLog += "\n**************** Delete Transaction ********************\n";
  }
  (async () => {
    try {
      dbResults = await db.UserProfile.find({ sessionUUID }).lean(); // use "lean" because we just want "_id"; no virtuals, etc
      if (!dbResults || dbResults.length == 0) throw "Invalid sessionUUID";
      dbProfile = dbResults[0];
      ownerRef = dbProfile._id;
      // get the transaction
      dbXaction = await db.Transaction.findById(transactionUUID).populate("accountRef").populate("categoryRef");
      if (!dbXaction) throw "Invalid or incorrect Transaction";
      // make sure this transaction is owned by the correct user.
      if (dbXaction.ownerRef != ownerRef) throw "Transaction is not owned by user";
      console.log(JSON.stringify(dbXaction, null, 2));
      dbAccount = dbXaction.accountRef;
      amount = dbXaction.amount;
      dbCategory = dbXaction.categoryRef;
      subCategoryUUID = dbXaction.subCategoryRef;
      if (process.env.YET_DEBUG) debugLog += "\n****** Original Transaction:\n" + JSON.stringify(dbAccount, null, 2);

      let result = await db.Transaction.findByIdAndDelete(transactionUUID);
      if (process.env.YET_DEBUG) {
        debugLog += "Transaction Removed:\n" + result + "\n";
        debugLog += "\n**** Old Account:\n" + AccountController.getJSON(dbAccount);
      }
      response = { status: "OK", message: `Transaction (${transactionUUID}) Removed` };
      if (process.env.YET_DEBUG) debugLog += "\nResponse:\n" + JSON.stringify(response, null, 2);

      // update account. Since the transaction is being reversed, multiply the amount by -1 and add to the account balance
      let balance = new Number(dbAccount.balance) + Utilities.flipSign(amount);
      dbAccount.balance = Utilities.roundToOneHundredthFin(balance);
      dbAccount = await dbAccount.save();
      if (process.env.YET_DEBUG) {
        debugLog += `\n**** Updated Account:\n` + AccountController.getJSON(dbAccount) + "\n\n";
      }
      let accountJSON = {
        accountUUID: dbAccount._id,
        name: dbAccount.name,
        accountType: dbAccount.accountType,
        balance: dbAccount.balance,
        isClosed: dbAccount.isClosed,
        notes: dbXaction.notes,
      };
      response = {
        status: "OK",
        message: `Transaction (${transactionUUID}) Deleted. Account ${dbAccount._id} Updated`,
        transactionUUID: transactionUUID,
        account: accountJSON,
      };
    } catch (error) {
      response = { status: "ERROR", message: error.message };
    }
    console.log(debugLog);
    console.log("Delete Transaction API Response:\n", response);
    res.json(response);
  })();
});

module.exports = router;
