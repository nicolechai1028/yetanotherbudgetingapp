/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *   +                                                                                  *
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
const Constants = require("../constants");

/**
 * Defines Collection that holds the Categories and subCategories for each user. This is a nested document at will have an
 * array of subdocuments
 * @see https://mongoosejs.com/docs/schematypes.html#arrays
 */
const SubCategorySchema = new Schema({
  _id: { type: Schema.Types.String, default: uuidv4 },
  subCategoryName: { type: Schema.Types.String, required: true },
});

const UserCategoryGroupSchema = new Schema({
  _id: { type: Schema.Types.String, default: uuidv4 },
  ownerRef: { type: Schema.Types.String, required: true, ref: "UserProfile" }, // points to te ID of the owner in the UserProfile collection
  categoryName: { type: Schema.Types.String, required: true },
  categoryName4Compare: { type: Schema.Types.String, required: true },
  subCategory: [SubCategorySchema],
  perspective: {
    // defines if transaction is INFLOW or OUTFLOW type
    type: Schema.Types.String,
    required: true,
    enum: Constants.BUDGET_ACCOUNT_PERSPECTIVES,
    default: Constants.DEFAULT_PERSPECTIVE,
  },
  access: {
    type: Schema.Types.String,
    enum: Constants.BUDGET_ACCOUNT_ACCESS_LEVELS,
    required: true,
    default: Constants.BUDGET_ACCOUNT_ACCESS_DEFAULT,
  },
});

const UserCategoryGroup = mongoose.model("UserCategoryGroup", UserCategoryGroupSchema);

module.exports = UserCategoryGroup;
