/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   +    Added this History section                                                    *
 *        Defined Schema                                                                *
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
// const Types = mongoose.Schema.Types;

// import { v4 as uuidv4 } from "uuid";
// const { v4 } = require("uuid");
// const uuidv4 = v4;

const CurrencySchema = new Schema({
  _id: { type: Schema.Types.String, required: true },
  name: { type: Schema.Types.String, required: true },
  uniDec: { type: Schema.Types.String, required: true },
});

const Currency = mongoose.model("Currency", CurrencySchema);

module.exports = Currency;
