/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   + Changed file name from Account.js to BudgetAccount.js.                           *
 *   + Renamed Schema from  AccountSchema to BudgetAccountSchema. Module export name    *
 *     changed from Account to BudgetAccount. Collection name changed from Account to   *
 *     BudgetAccount                                                                    *
 *   + Added "isClosed" field.                                                          *
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   + Added reference ("ref") option to "ownerRef" field                               *
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   + Added "notes" field                                                              *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 ****************************************************************************************
 */
const mongoose = require("mongoose");
const Constants = require("../constants");
const Schema = mongoose.Schema;
const Utilities = require("../utilities");

//import { v4 as uuidv4 } from "uuid";
const { v4 } = require("uuid");
const uuidv4 = v4;

const BudgetAccountSchema = new Schema({
  _id: { type: Schema.Types.String, default: uuidv4 },
  name: { type: Schema.Types.String, required: true },
  // consider index of this field, since this is how we check for duplicate names
  accountName4Compare: { type: Schema.Types.String, required: true },
  // consider index of this field
  ownerRef: { type: Schema.Types.String, required: true, ref: "UserProfile" }, // reference to the UserProfile._id
  accountType: {
    type: Schema.Types.String,
    enum: Constants.ACCOUNT_TYPES,
    required: true,
  },
  balance: { type: Schema.Types.Number, default: 0.0 },
  isClosed: { type: Schema.Types.Boolean, default: false },
  notes: { type: Schema.Types.String },
});

const BudgetAccount = mongoose.model("BudgetAccount", BudgetAccountSchema);

module.exports = BudgetAccount;
