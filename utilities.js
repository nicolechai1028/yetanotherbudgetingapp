/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +  Added this History section                                                      *
 *   +  Replaced SMTP configurations with values derived from .env file                 *
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   +  Moved Database connection and initialization from server.js to here             *
 *                                                                                      *
 * == chikeobi-11 ==                                                                    *
 *   +  Added getYearMonth function                                                     *
 *   +                                                                                  *
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

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const SMTPConnection = require("nodemailer/lib/smtp-connection");
const mongoose = require("mongoose");

const Constants = require("./constants");
const db = require("./models");

/**
 * Returns the full URL used to hit the route
 * @param  {object} req Request object
 * @return {string} The full URL or undefined
 */
function getFullUrl(req) {
  let retval;
  if (req != null) {
    retval = req.protocol + "://" + req.get("host") + req.originalUrl;
  }
  return retval;
}

/**
 * Returns the protocol and host portion of the full URL used to hit the route
 * @param  {object} req Request object
 * @return {string}  <protocol>://<hostname>[:port] portion of the URL
 */
function getProtocolHostUrl(req) {
  let retval;
  if (req != null) {
    retval = req.protocol + "://" + req.get("host");
  }
  return retval;
}

function generateUUID(numberOfBytes) {
  if (numberOfBytes == null || isNaN(numberOfBytes)) numberOfBytes = 16;
  let uuid = crypto.randomBytes(numberOfBytes).toString("hex");
  if (numberOfBytes == 16)
    return (
      uuid.slice(0, 8) +
      "-" +
      uuid.slice(8, 12) +
      "-" +
      uuid.slice(12, 16) +
      "-" +
      uuid.slice(16, 20) +
      "-" +
      uuid.slice(20)
    );
  else return uuid;
}

/**
 *  Creates a 256 byte hash using a key. The comnination of input data and key will always result in the same hash.
 * @see https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/
 * @param {string} dataToHash
 * @param {string} hashKey
 * @returns {string} Hashed  version of dataToHash.
 */
function createHmacSHA256Hash(dataToHash, hashKey) {
  let retval;
  if (dataToHash && hashKey) {
    retval = crypto.createHmac("sha256", hashKey).update(dataToHash).digest("hex");
  }
  return retval;
}

/**
 *  Creates a 256 byte hash of input string
 * @see https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/
 * @param {string} dataToHash
 * @returns {string} Hashed version of dataToHash
 */
function createSHA256Hash(dataToHash) {
  let retval;
  if (dataToHash) retval = crypto.createHash("sha256").update(dataToHash).digest("hex");

  return retval;
}

async function sendConfirmationEmail(req, email, emailVerificationId) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // "smtp.gmail.com",
    port: process.env.SMTP_PORT, // 465,
    secure: process.env.SMTP_IS_SECURE, // true,
    auth: {
      user: process.env.SMTP_USER, // "bootcampyaba@gmail.com",
      pass: process.env.SMTP_PASS, // "YabaBootcamp2020",
    },
  });

  let targetUrl = `${getProtocolHostUrl(req)}/api/user/verify/${emailVerificationId}`;
  console.log(`Verification email URL: ${targetUrl}`);
  let html = `
  <div
  style="
    margin: 1em 5em;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #008dd5;
    padding: 2em 0;
    width: 100%;
  "
>
  <table style="width: 100%;">
    <tr style="text-align: center;">
      <h1>Confirm Your Email</h1>
    </tr>
    <tr style="text-align: center;">
      <h3>Thanks for signing up for Y.A.B.A.</h3>
    </tr>
    <tr style="text-align: center;">
      <h4>Please take a moment to confirm your email</h4>
    </tr>
    <tr style="text-align: center;">
      <h4>Just hit the button below and you'll be all set</h4>
    </tr>
    <tr style="text-align: center;">
      <a
        style="
          border: 1px white solid;
          border-radius: 10px;
          padding: 1em;
          margin-top: 1em;
          background-color: #19ceb3;
          text-decoration: none;
        "
        target="_blank"
        href="${targetUrl}"
      >
        CONFIRM EMAIL
      </a>
    </tr>
  </table>
</div>

`;

  let emailInfo = await transporter.sendMail({
    from: '"YABA Bootcamp" <bootcampyaba@gmail.com>',
    to: email,
    subject: "Email Confirmation/Verification",
    text: "Verify/Confirm your email",
    html: html,
  });

  return emailInfo;
}

function emailValidationPage({ header, message, intro, text, btnLabel, targetUrl }) {
  //let targetUrl = `${getProtocolHostUrl(req)}/register`;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Confirma your email</title>
    <style> 
      a {
        border: 1px white solid;
        border-radius: 10px;
        padding: 1em;
        margin-top: 1em;
        background-color: #19CEB3;
      }
      .content-div {
        margin: 1em 5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color:  #008DD5;
        padding: 2em 0;
      } 
      .content-div a {
        text-decoration: none
      }
    </style>
  </head>
  <body>
    <div class="content-div">
      <h1 style="color: red;">	${header} </h2>
      <h2>${intro}:</h2>
      <h3 style="color:red"> ${message} </h3>
      <p> ${text}</p>
       <a target="_blank" href="${targetUrl}"> ${btnLabel} </a> 
    </div>
    </script>
  </body>
  </html>`;
}

function multipleSpaceRemovedTrim(inputString) {
  let retval = inputString;
  if (inputString != null && typeof inputString == "string") {
    retval = inputString.trim().replace(/ +/g, " ");
  }
  return retval;
}

function multipleSpaceRemovedTrimLC(inputObj) {
  let retval = inputObj;
  if (inputObj) {
    if (typeof inputObj == "string") {
      retval = inputObj.trim().replace(/ +/g, " ").toLowerCase();
    } else if (Array.isArray(inputObj)) {
      retval = [];
      inputObj.every((ele) => {
        if (typeof ele == "string") retval.push(ele.trim().replace(/ +/g, " ").toLowerCase());
        else retval.push(ele);
        return true;
      });
    }
  }
  return retval;
}

function startAndInitializeDatabase() {
  // Connect to the Mongo DB
  mongoose.connect(process.env.MONGODB_URI || Constants.DEV_MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  const dropDb = process.env.DROP_DATABASE || false;
  const connection = mongoose.connection;
  try {
    connection.once("open", function () {
      console.log("*** MongoDB got connected ***");
      console.log(`Our Current Database Name : ${connection.db.databaseName}`);
      if (dropDb == true) connection.db.dropDatabase(console.log(`${connection.db.databaseName} database dropped.`));
      connection.db.dropCollection("currencies", function (err, res) {
        if (err) console.log("ERR:", err.message);
        else console.log('Collection "currencies" dropped.');

        // ************ Load Currencies ***********
        (async () => {
          let results = [];
          console.log("Loading Currencies into currencies collection");
          for (let index = 0; index < Constants.CURRENCIES.length; index++) {
            let currencyModel = Constants.CURRENCIES[index];
            let dbResult = await db.Currency.create(currencyModel);
            if (dbResult == null || !dbResult._id) {
              console.log(`\nUnable to save Currency object:\n`, currencyModel);
            } else results.push(dbResult);
          }
          console.log(`\n${results.length} Currency objects loaded into database\n`);
          // console.log(JSON.stringify(results,null,2));
        })();
        // ****************************************
      });
    });
  } catch (error) {
    console.log("\n\n***ERROR***\n", error.message);
  }
}

/**
 * Formats the optional UTC input into a number derived from YYYYMMDD of the UTC time input.
 * If the utcTime input is "null" or not a number, then the current UTC time is used
 * @param {Number} utcTime
 */
function formatTransactionDateFromUTC(utcTime) {
  if (!utcTime || utcTime == null || isNaN(utcTime) == true) utcTime = Date.now();
  let today = new Date(utcTime);
  let value = "" + today.getFullYear();
  let val = today.getMonth() + 1;
  if (val < 10) value += "0";
  value += val;
  if ((val = today.getDate()) < 10) value += "0";
  value += val;

  return parseInt(value);
}

function getYearMonth(utcTime) {
  return `${formatTransactionDateFromUTC(utcTime)}`.slice(0, 6);
}
function roundToOneHundredthFin(x) {
  return (Math.round(100 * x) / 100).toFixed(2);
}

function findDuplicateInArrayTrimLC(inputArray) {
  let object = {};
  let result = [];

  inputArray.forEach(function (item) {
    item = multipleSpaceRemovedTrimLC(item);
    if (!object[item]) object[item] = 0;
    object[item] += 1;
  });

  for (let prop in object) {
    if (object[prop] >= 2) {
      result.push(prop);
    }
  }
  if (result.length == 0) return;
  return result;
}

function makePositive(input) {
  let retval = Math.abs(input);
  console.log(`Typeof Input: ${typeof input}\tInput: ${input}\tOutput: ${retval}`);
  return retval;
}

function makeNegative(input) {
  let retval = -Math.abs(input);
  console.log(`Typeof Input: ${typeof input}\tInput: ${input}\tOutput: ${retval}`);
  return retval;
}

function flipSign(input) {
  let retval;
  if (isNaN(input) == false) {
    retval = input < 0 ? makePositive(input) : makeNegative(input);
  }
  return retval;
}

module.exports = {
  createHmacSHA256Hash,
  createSHA256Hash,
  emailValidationPage,
  findDuplicateInArrayTrimLC,
  flipSign,
  formatTransactionDateFromUTC,
  generateUUID,
  getFullUrl,
  getProtocolHostUrl,
  getYearMonth,
  makeNegative,
  makePositive,
  multipleSpaceRemovedTrim,
  multipleSpaceRemovedTrimLC,
  roundToOneHundredthFin,
  sendConfirmationEmail,
  startAndInitializeDatabase,
};
