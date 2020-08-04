const db = require("../models");

// Define methods for the UserProfile controller

module.exports = {
  findAll: function () {
    return this.findBy({});
  },
  findBySessionUUID: async function (sessionUUID) {
    let retval = null;
    let dbResults = this.findBy({ sessionUUID: sessionUUID });
    if (dbResults.length != 0) retval = dbResults[0];
    return retval;
  },
  findByEmailVerificationId: function (emailVerificationId) {
    let retval = null;
    let dbResults = this.findBy({ emailVerificationId: emailVerificationId });
    if (dbResults.length != 0) retval = dbResults[0];
    return retval;
  },
  findByEmail: function (email) {
    let retval = null;
    let dbResults = this.findBy({ email: email });
    if (dbResults.length != 0) retval = dbResults[0];
    return retval;
  },
  findById: function (id) {
    let retval = null;
    let dbResults = this.findBy({ _id: id });
    if (dbResults.length != 0) retval = dbResults[0];
    return retval;
  },
  findBy: async function (query) {
    let retval = [];
    try {
      if (query == null) query = {};
      retval = await db.UserProfile.find(query);
      console.log(retval);
      return retval;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};
