/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   +    Added "Currency" collection                                                   *
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
  Currency: require("./Currency"),
  Budget: require("./Budget"),
};
