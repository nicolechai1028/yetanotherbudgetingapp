/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
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

// Define methods for the UserProfile controller

module.exports = {
  findByOwnerAndName: function (ownerRef, name) {
    if (ownerRef != null && (name = utilities.multipleSpaceRemovedTrimLC(name)) != null && name.length != 0) {
      let query = { ownerRef: ownerRef, accountName4Compare: name };
      let dbResults = this.findBy({ query });
      if (dbResults == null || dbResults.length == 0) return null;
      else return dbResults[0];
    }
  },
  findAllByOwner: function (ownerRef, isClosed) {
    if (ownerRef == null || (ownerRef = ownerRef.trim()).length == 0) {
      return [];
    }
    let query = { ownerRef: ownerRef };
    if (isClosed == true) query = { ownerRef: ownerRef, isClosed: true };
    else if (isClosed == false) query = { ownerRef: ownerRef, isClosed: false };
    let dbResults = this.findBy(query);
    if (dbResults == null || dbResults.length == 0) return null;
    else return dbResults;
  },
  findAllClosed: function (ownerRef) {
    return this.findAllByOwner(ownerRef, true);
  },
  findById: function (id) {
    let retval = null;
    let dbResults = this.findBy({ _id: id });
    if (dbResults != null && dbResults.length != 0) {
      retval = dbResults[0];
    }
    return retval;
  },
  findBy: async function (query) {
    let retval = [];
    try {
      if (query == null) query = {};
      retval = await db.UserProfile.find(query);
      return retval;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  getJSON: function (dbAccount) {
    let retval;
    if (dbAccount) {
      retval = {
        accountUUID: dbAccount._id,
        name: dbAccount.name,
        ownerRef: dbAccount.ownerRef,
        type: dbAccount.accountType,
        balance: dbAccount.balance,
        isClosed: dbAccount.isClosed,
        notes: dbAccount.notes,
      };
    } else return;
    return JSON.stringify(retval,null,2);
  },
};
