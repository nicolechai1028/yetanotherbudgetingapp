const db = require("../models");

// Define methods for the UserProfile controller

module.exports = {
  findAll: async function () {
    this.findBy({});
  },
  findBySessionUUID: function (sessionUUID) {
    return this.findBy({ sessionUUID: sessionUUID });
  },
  findByEmailVerificationId: function (emailVerificationId) {
    return this.findBy({ emailVerificationId: emailVerificationId });
  },
  findByEmail: function (email) {
    return this.findBy({ email: email });
  },
  findById: function (id) {
    return this.findBy({ _id: id });
  },
  findBy: async function (query) {
    if (query == null) query = {};

    try {
      let dbResults = await db.UserProfile.find(query);
      return dbResults;
    } catch (err) {
      return [];
    }
  },
};
