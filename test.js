const { v4 } = require("uuid");
const uuidv4 = v4;
const Utilities = require("./utilities");
const nodemailer = require("nodemailer");
const { generateUUID } = require("./utilities");
// console.log(uuidv4());
// console.log(Utilities.generateUUID());

// console.log(Utilities.createSHA256Hash("chikeobi.njaka@gmail.com"));
// console.log(Utilities.createSHA256Hash("chikeobi.njaka@gmail.com"));
// console.log(Utilities.createHmacSHA256Hash("chikeobi.njaka@gmail.com","password"));
// console.log(Utilities.createHmacSHA256Hash("chikeobi.njaka@gmail.com","password"));
function doTest1() {
  let dbModel = {
    _id: uuidv4(),
    email: "john.doe@gmail.com",
    firstName: "John",
    lastName: "Doe",
    password: Utilities.createSHA256Hash("password1"),
    sessionUUID: Utilities.generateUUID(),
    isVerified: false,
    emailVerificationId: Utilities.generateUUID(),
    lastLoginTimestamp: Date.now(),
    lastTransactionTimestamp: Date.now(),
  };

  let sessionUuid = Utilities.generateUUID();
  let timestamp = dbModel.lastLoginTimestamp + 100;

  let statusMsg = {
    status: "OK",
    message: `Welcome ${dbModel.firstName} ${dbModel.lastName}!!`,
    sessionUUID: sessionUuid,
    lastLoginTimestamp: timestamp,
    lastTransactionTimestamp: timestamp,
  };
  // let { _id, email, isVerified, password,emailVerificationId, ...response } = { ...dbModel, ...statusMsg };
  let {
    _id,
    email,
    isVerified,
    password,
    emailVerificationId,
    lastLoginTimestamp,
    lastTransactionTimestamp,
    ...response
  } = { ...dbModel, ...statusMsg };

  console.log(dbModel);
  console.log(statusMsg);
  console.log(response);
  dbModel = {
    ...dbModel,
    lastLoginTimestamp: timestamp,
    lastTransactionTimestamp: timestamp,
    sessionUUID: statusMsg.sessionUUID,
  };
  console.log(dbModel);
}

function doTest2() {
  let oldObject = {
    firstName: "John",
    lastName: "Doe",
    age: 45,
    zodiac: "Capricorn",
    city: "San Clemente",
    state: "California",
  };

  // copy to new object (noybObject) while removing "age" and "zodiac" key and fields

  let { age, zodiac, ...noybObject } = oldObject;

  console.log("\nOriginal Object....:");
  console.log(oldObject);
  console.log("\nNew Object with fields removed...:");
  console.log(noybObject);

  // One mo' thang... if you want to add new fields, you can do it in one shot:
  let moData = { country: "USA", planet: "Earth" };
  // notice the paren around the line. Previous line MUST end with semi-colon.
  // Parens because the variables on the left hand side have already been declared.
  // Without it you'd have to declare new variables
  ({ age, zodiac, ...noybObject } = { ...oldObject, ...moData });
  console.log("\nNew Object with fields removed and new ones added...:");
  console.log(noybObject);
}

async function doTest3() {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bootcampyaba@gmail.com",
      pass: "YabaBootcamp2020",
    },
  });

  let { error, success } = await transporter.verify();
  if (error) {
    console.log("ERROR!!");
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
    console.log(success);
  }
}

async function doTest4() {
  let email = "njaka.family@gmail.com";
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bootcampyaba@gmail.com",
      pass: "YabaBootcamp2020",
    },
  });

  let targetUrl = `http://localhost:3001/api/verify/${generateUUID()}`;
  let styleTag = `<style> 
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
</style>`;
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
        href="https://www.google.com"
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

doTest4().catch(console.error);
