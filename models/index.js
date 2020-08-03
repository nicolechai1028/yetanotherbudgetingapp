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
 *                                                                                      *
 ****************************************************************************************
 */

// Exporting an object containing all of our models

module.exports = {
  BudgetAccount: require("./BudgetAccount"),
  GenericCategoryGroup: require("./GenericCategoryGroup"),
  Transaction: require("./Transaction"),
  UserCategoryGroup: require("./UserCategoryGroup"),
  UserProfile: require("./UserProfile"),
};
