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

const SubCategorySchema = new Schema({
  _id: { type: Types.String, default: uuidv4 },
  subCategoryRef: { type: Types.String, required: true },
  budgeted: { type: Types.Number, required: true, default: 0.0 },
  activity: { type: Types.Number, required: true, default: 0.0 },
});

const BudgetSchema = new Schema({
  _id: { type: Types.String, default: uuidv4 },
  // consider creating unique compound index of the next three fields
  yearMonth: { type: Types.Number, required: true, min: 200001, max: 205012 },
  // consider separate index of this field
  ownerRef: { type: Types.String, required: true, ref: "UserProfile" },
  categoryRef: { type: Types.String, required: true, ref: "UserCategoryGroup" },
  subCategory: [SubCategorySchema],
});

BudgetSchema.methods.getSubCategoryDocumentById = function (subCategoryUUID) {
  let retval;
  for (let index = 0; index < this.subCategory.length; index++) {
    if (this.subCategory[index].subCategoryRef == subCategoryUUID) {
      retval = this.subCategory[index];
      break;
    }
  }
  return retval;
};

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
