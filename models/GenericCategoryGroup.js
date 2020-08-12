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
const { v4  } = require("uuid");
const uuidv4 = v4;

/**
 * Defines Catelog that holds the default Categories and groups that will be assigned to each user upon account creation
 */
const GenericCategoryGroupSchema = new Schema({
    _id:{type:Schema.Types.String,default:uuidv4},
    group:{type: Schema.Types.String},
    categories: [Schema.Types.String]
});

const GenericCategoryGroup = mongoose.model("GenericCategoryGroup",GenericCategoryGroupSchema);

module.exports = GenericCategoryGroup;