/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +    Added this History section                                                    *
 *   +    Changed format of how constants are exported. Now they can't be edited at all *
 *   +    Added "perspective" to Category.                                              *
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
module.exports = Object.freeze({
  DEV_MONGODB_URI: "mongodb://localhost/yetanotherbudgetingapp",
  BUDGET_ACCOUNT_TYPES: ["Checking", "Saving", "Cash", "Credit Card", "Line of Credit"],
  BUDGET_ACCOUNT_PERSPECTIVES: ["Outflow", "Inflow"],
  DEFAULT_PERSPECTIVE : "Outflow",
  // https://girltalkwithfo.com/budget-categories/
  GENERIC_BUDGET_CATEGORIES: [
    {
      groupName: "Inflow",
      categories: [
        "To be budgeted",
        "Weekly Income",
        "Bi-Weekly Income",
        "Monthly Income",
        "Dividend",
        "Interest",
        "Refund",
      ],
      perspective: "Inflow",
    },
    {
      groupName: "Utilities",
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
      groupName: "Food",
      categories: ["Groceries", "Fast Food", "Dining Out", "Pet Food"],
    },
    {
      groupName: "Housing",
      categories: [
        "Mortgage/Rent",
        "Repairs/Maintenance",
        "HOA Dues",
        "Property Taxes",
        "Decor/Furniture",
        "Lawn care",
      ],
    },
    {
      groupName: "Transportation",
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
      groupName: "Giving",
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
      groupName: "Recreation/Fun",
      categories: ["Entertainment", "Subscriptions", "Sporting Events", "Concerts", "Hobbies"],
    },
    {
      groupName: "Debt Payments",
      categories: ["Student Loan", "Auto Loan", "Personal Loan"],
    },
    {
      groupName: "Medical/Health",
      categories: ["Medications", "Doctor Bills", "Dentist", "Optometrist", "Vitamins", "Gym Membership"],
    },
    {
      groupName: "Insurance",
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
      groupName: "Saving",
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
  ],
});
//module.exports = { DEV_MONGODB_URI, BUDGET_ACCOUNT_TYPES, GENERIC_BUDGET_CATEGORIES, BUDGET_ACCOUNT_PERSPECTIVES };
