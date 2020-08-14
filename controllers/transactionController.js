/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   + Created                                                                          *
 *   +  Added function to return JSON format of database returned object                *
 *                                                                                      *
 * == chikeobi-19 ==                                                                    *
 *   +  Added JSON generator to standardize what will be sent out in the API            *
 *   +                                                                                  *
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
  getAPIJSON: async function (dbTransaction, dbCategory) {
    let retval, perspective;
    if (dbTransaction) {
      if (!dbCategory) {
        if (dbTransaction.populated("categoryRef")) perspective = dbTransaction.categoryRef.perspective;
        else {
          // get category from database
          try {
            dbCategory = await db.UserCategoryGroup.findById(dbTransaction.categoryRef);
            if (dbCategory) perspective = dbCategory.perspective;
          } catch (error) {
            console.log(error);
          }
        }
      } else perspective = dbCategory.perspective;
      retval = {
        transactionUUID: dbTransaction._id,
        payee: dbTransaction.payee,
        accountUUID: dbTransaction.accountRef,
        categoryUUID: dbTransaction.categoryRef,
        subCategoryUUID: dbTransaction.subCategoryRef,
        perspective: perspective,
        memo: dbTransaction.memo,
        amount: dbTransaction.amount,
        date: dbTransaction.date,
      };
    }
    return retval;
  },
};
