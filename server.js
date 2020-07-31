const express = require("express");
const mongoose = require("mongoose");
const Constants = require("./constants");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const routes = require("./routes");

//const routes = require("./routes");
const app = express();

//const DEV_MONGODB_URI = "mongodb://localhost/yetanotherbudgetingapp";
const PORT = process.env.PORT || 3001;
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Add routes, both API and view
app.use(routes);


// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || Constants.DEV_MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// Start the API server
app.listen(PORT, function () {
  console.log(`  API Server now listening on PORT ${PORT}!`);
});