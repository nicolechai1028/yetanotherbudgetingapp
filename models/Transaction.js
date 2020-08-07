/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   + Added reference ("ref") option to "ownerRef", "accountRef" and                   *
 *      "categoryGroupRef" fields                                                       *
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   + Removed "transactionType" field. Transaction type is defined in the              *
 *       "perspective" field of the category group                                      *
 *   + Changed format of transaction date from a sub document to a number in yyyymmdd   *
 *       format. Minimum value is 20000101 (Jan. 1, 2000)                               *
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

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//import { v4 as uuidv4 } from "uuid";
const { v4 } = require("uuid");
const uuidv4 = v4;
const Utilities = require("../utilities");

const TransactionSchema = new Schema({
  _id: { type: Schema.Types.String, default: uuidv4 },
  payee: { type: Schema.Types.String, required: true },
  ownerRef: { type: Schema.Types.String, required: true, ref: "UserProfile" }, // reference to the UserProfile._id
  accountRef: { type: Schema.Types.String, required: true, ref: "BudgetAccount" }, // reference to the Account._id
  categoryRef: { type: Schema.Types.String, required: true, ref: "UserCategoryGroup" }, // reference to the UserBudgetCategoryGroup._id
  subCategoryRef: { type: Schema.Types.String, required: true, ref: "UserCategoryGroup.categories" }, // reference to the UserBudgetCategoryGroup.Category._id
  memo: { type: Schema.Types.String },
  amount: { type: Schema.Types.Number, default: 0.0 },
  // transactionType: { type: Schema.Types.String, default: "OUTFLOW", enum: ["OUTFLOW", "INFLOW"] },
  // date: {
  //   year: Schema.Types.Number,
  //   month: Schema.Types.Number,
  //   day: Schema.Types.Number,
  // },
  date: {
    type: Schema.Types.Number,
    required: true,
    min: [20000101, "Minimum transaction date is January 01, 2000"],
    default: Utilities.formatTransactionDateFromUTC,
  },
});

function formatTransactionDateFromUTC() {
  let today = new Date();
  let value = "" + today.getFullYear();
  let val = today.getMonth() + 1;
  if (val < 10) value += "0";
  value += val;
  if ((val = today.getDate) < 10) value += "0";
  value += val;
  return Number.parseInt(value);
}
// setup virtual field "dateStamp" @see https://futurestud.io/tutorials/understanding-virtuals-in-mongoose
TransactionSchema.virtual("dateStamp").get(function () {
  if (this.date.year == null || this.date.month == null || this.date.day == null) return 0;

  let value = "" + this.date.year;
  if (this.date.month < 10) value += "0";
  value += this.date.month;
  if (this.date.day < 10) value += "0";
  value += this.date.day;
  return Number.parseInt(value);
});
// may not have to implement this...
TransactionSchema.virtual("dateStamp").set(function (value) {});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
