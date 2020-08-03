/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *   +                                                                                  *
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
const { v4  } = require("uuid");
const uuidv4 = v4;

const TransactionSchema = new Schema({
  _id: { type: Schema.Types.String, default: uuidv4 },
  ownerRef: { type: Schema.Types.String, required: true }, // reference to the UserProfile._id
  accountRef: { type: Schema.Types.String, required: true }, // reference to the Account._id
  categoryGroupRef: { type: Schema.Types.String, required: true }, // reference to the UserBudgetCategoryGroup._id
  categoryRef: { type: Schema.Types.String, required: true }, // reference to the UserBudgetCategoryGroup.Category._id
  payee: { type: Schema.Types.String, required: true },
  memo: { type: Schema.Types.String },
  amount: { type: Schema.Types.Number, default: 0.0 },
  transactionType: { type: Schema.Types.String, default: "OUTFLOW", enum: ["OUTFLOW", "INFLOW"] },
  date: {
    year: Schema.Types.Number,
    month: Schema.Types.Number,
    day: Schema.Types.Number,
  },
});

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
