const mongoose = require("mongoose");
const Constants = require("../constants");
const Schema = mongoose.Schema;

//import { v4 as uuidv4 } from "uuid";
const { v4 } = require("uuid");
const uuidv4 = v4;

const AccountSchema = new Schema({
  _id: { type: Schema.Types.String, default: uuidv4 },
  name: { type: Schema.Types.String, required: true },
  ownerRef: { type: Schema.Types.String, required: true }, // reference to the UserProfile._id
  accountType: {
    type: Schema.Types.String,
    enum: Constants.ACCOUNT_TYPES,
    required: true,
  },
  startingBalance: { type: Schema.Types.Number, default: 0.0 },
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
