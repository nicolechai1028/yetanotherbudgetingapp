/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-08 ==                                                                    *
 *   +  Added this History section                                                      *
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

const mongoose = require("mongoose");
const db = require("../../models");
const Constants = require("../../constants");
const { v4 } = require("uuid");
const uuidv4 = v4;
const axios = require("axios");
require("dotenv").config();

const userCount = 20;
const reqSeed = "dqWjEPGIf"; // use this seed and you'll get the same result all the time?

/**
 * @see https://randomuser.me/documentation#intro
 */
const excludeFields = ["registered", "location", "gender", "dob", "phone", "cell", "id", "picture"];
const nationalities = ["au", "br", "ca", "ch", "de", "dk", "es", "fi", "fr", "gb", "ie", "no", "nl", "nz", "us"];
let URL = `https://randomuser.me/api/?seed=${reqSeed}&results=${userCount}&password=upper,lower,8-10`;
URL += `&exc=${excludeFields}&noinfo&nat=${nationalities}`;


const config = {
  method: "get",
  url: URL,
  headers: {
    // Cookie: "__cfduid=d9a7d053713d8e118fe453d26e33f43721597364564",
  },
};
(async () => {
  let response = await axios(config);
  if (response) {
    console.log(JSON.stringify(response.data,null,2));
  }
})();
