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
const Types = mongoose.Schema.Types;

const { v4 } = require("uuid");
const uuidv4 = v4;

const SubCategoryValuesSchema = new Schema({
  _id: { type: Types.String, default: uuidv4 },
  subCategoryRef: { type: Types.String, required: true },
  budgeted: { type: Types.Number, required: true, default: 0.0 },
  activity: { type: Types.Number, required: true, default: 0.0 },
});

const BudgetSchema = new Schema({
  _id: { type: Types.String, default: uuidv4 },
  yearMonth: { type: Types.Number, required: true, min: 200001, max: 205012 },
  ownerRef: { type: Types.String, required: true, ref: "UserProfile" },
  categoryRef: { type: Types.String, required: true, ref: "UserCategoryGroup" },
  subCategoryValues: [SubCategoryValuesSchema],
});

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
