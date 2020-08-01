/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *   +                                                                                  *
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
import { v4 as uuidv4 } from "uuid";

// This file empties the Books collection and inserts the books below

mongoose.connect(process.env.MONGODB_URI || Constants.DEV_MONGODB_URI);

// https://girltalkwithfo.com/budget-categories/
const genericBudgetCategory = [
  {
    group: "Utilities",
    categories: [
      "Electricity",
      "Heat/Gas",
      "Water",
      "Trash",
      "Phone/Mobile",
      "Internet",
      "Cable",
      "Sewage",
      "Alarm System",
    ],
  },
  {
    group: "Food",
    categories: ["Groceries", "Fast Food", "Dining Out", "Pet Food"],
  },
  {
    group: "Housing",
    categories: ["Mortgage/Rent", "Repairs/Maintenance", "HOA Dues", "Property Taxes", "Decor/Furniture", "Lawn care"],
  },
  {
    group: "Transportation",
    categories: [
      "Fuel",
      "Oil Changes",
      "Repairs/Maintenance",
      "Tires",
      "License/Taxes/Registration",
      "Toll Fees",
      "Parking Fees",
      "Public Transportation",
    ],
  },
  {
    group: "Giving",
    categories: [
      "Tithes",
      "Offerings",
      "Charity",
      "Miscellaneous",
      "Giving",
      "Gifts",
      "Birthdays",
      "Wedding",
      "Baby Showers",
      "Christmas",
      "Other holidays/occasions",
    ],
  },
  {
    group: "Recreation/Fun",
    categories: ["Entertainment", "Subscriptions", "Sporting Events", "Concerts", "Hobbies"],
  },
  {
    group: "Debt Payments",
    categories: ["Student Loan", "Auto Loan", "Personal Loan"],
  },
  {
    group: "Medical/Health",
    categories: ["Medications", "Doctor Bills", "Dentist", "Optometrist", "Vitamins", "Gym Membership"],
  },
  {
    group: "Insurance",
    categories: [
      "Life Insurance",
      "Health Insurance",
      "Homeowner/Renters",
      "Auto Insurance",
      "Disability Insurance",
      "Identity Theft",
      "Long-Term Care",
      "Pet Insurance",
    ],
  },
  {
    group: "Saving",
    categories: [
      "Emergency Fund",
      "Retirement",
      "Travel/Vacation",
      "Car Replacement",
      "College Fund",
      "Long Term Goals",
      "Short Term Goals",
    ],
  },
//   {
//     group: "",
//     categories: [],
//   },
];

// @see https://usefulangle.com/post/248/javascript-async-anonymous-function-iife
(async ()=>{

})();
db.GenericCategoryGroup.findOneAndUpdate()