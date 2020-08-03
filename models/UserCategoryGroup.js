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
const { v4  } = require("uuid");
const uuidv4 = v4;


/**
 * Defines Catelog that holds the Categories and groups for each user. This is a nested document at will have an
 * array of subdocuments
 * @see https://mongoosejs.com/docs/schematypes.html#arrays
 */
const categorySchema = new Schema({
  _id: { type: Schema.Types.String, default: uuidv4 },
  categoryName: { type: Schema.Types.String, required: true },
});

const UserCategoryGroupSchema = new Schema({
  _id: { type: Schema.Types.String, default: uuidv4 },
  ownerRef: { type: Schema.Types.String, required: true }, // points to te ID of the owner in the UserProfile collection
  groupName: { type: Schema.Types.String, required: true },
  categories: [categorySchema],
});

const UserCategoryGroup = mongoose.model("UserCategoryGroup", UserCategoryGroupSchema);

module.exports = UserCategoryGroup;
