const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// import { v4 as uuidv4 } from "uuid";
const { v4 } = require("uuid");
const uuidv4 = v4;

const UserProfileSchema = new Schema({
  _id: { type: Schema.Types.String, default: uuidv4 },
  email: { type: Schema.Types.String, required: true },
  firstName: { type: Schema.Types.String, required: true },
  lastName: { type: Schema.Types.String, required: true },
  password: { type: Schema.Types.String, required: true }, // hashed password
  sessionUUID: { type: Schema.Types.String }, // session ID generated when the user logs in. Removed when the user logs off
  isVerified: { type: Schema.Types.Boolean, default: false },
  emailVerificationId: { type: Schema.Types.String },
  lastLoginTimestamp: { type: Schema.Types.Number }, // Date.now()
  lastTransactionTimestamp: { type: Schema.Types.Number }, // Date.now(). Last time the server was accessed
});

UserProfileSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName})`;
});
const UserProfile = mongoose.model("UserProfile", UserProfileSchema);

module.exports = UserProfile;