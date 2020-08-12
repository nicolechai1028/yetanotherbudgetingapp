/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   + Created
 *   +  Added function to return JSON format of database returned object                *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 *                                                                                      *
 ****************************************************************************************
 */

const db = require("../models");
const utilities = require("../utilities");

module.exports = {
  getJSON: function (dbTransaction) {
    let retval;
    if (dbTransaction) {
      retval = {
        transactionUUID: dbTransaction._id,
        ownerRef: dbTransaction.ownerRef,
        payee: dbTransaction.payee,
        accountUUID: dbTransaction.accountRef,
        categoryUUID: dbTransaction.categoryRef,
        subCategoryUUID: dbTransaction.subCategoryRef,
        memo: dbTransaction.memo,
        amount: dbTransaction.amount,
        date: dbTransaction.date,
      };
    }
    return retval;
  },
};
