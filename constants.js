/****************************************************************************************
 *                                    HISTORY                                           *
 ****************************************************************************************
 *                                                                                      *
 * == chikeobi-03 ==                                                                    *
 *   +  Added this History section                                                      *
 *   +  Changed format of how constants are exported. Now they can't be edited at all   *
 *   +  Added "perspective" to Category.                                                *
 *                                                                                      *
 * == chikeobi-06 ==                                                                    *
 *   +  Added Currency definitions                                                      *
 *                                                                                      *
 * == chikeobi-07 ==                                                                    *
 *   +  Added Special Budget Categories and Groups                                      *
 *                                                                                      *
 * == chikeobi-10 ==                                                                    *
 *   + Added Account Transfer Categories                                                *
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
  ACCOUNT_TYPES: ["Checking", "Saving", "Cash", "Credit Card", "Line of Credit"],
  ACCOUNT_PERSPECTIVES: ["Outflow", "Inflow"],
  DEFAULT_PERSPECTIVE: "Outflow",
  // https://girltalkwithfo.com/budget-categories/
  ACCOUNT_ACCESS_DEFAULT: "User",
  ACCOUNT_ACCESS_SPECIAL: "System",
  MIN_YYYYMMDD: 20000101, // January 1, 2000
  MAX_YYYYMMDD: 20501231, // December 31, 2050
  MIN_YYYYMM: 200001,
  MAX_YYYYMM: 205012,
  ACCOUNT_ACCESS_LEVELS: [
    "System", // this means the Budget Category cannot be edited by the user
    "User",
  ],
  SPECIAL_BUDGET_CATEGORIES: [
    {
      groupName: "Inflow Adjustment",
      categories: ["To be budgeted"],
      perspective: "Inflow",
    },
    {
      groupName: "Outflow Adjustment",
      categories: ["To be budgeted"],
      perspective: "Outflow",
    },
    { groupName: "Account Inflow", categories: ["Transfer"], perspective: "Inflow", access: "System" },
    { groupName: "Account Outflow", categories: ["Transfer"], perspective: "Outflow", access: "System" },
  ],
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
  // name:"Country and Currency", _id: "Currency Code",uniDec: "Unicode: Decimal"},
  CURRENCIES: [
    { name: "Albania Lek", _id: "ALL", uniDec: "&#76;&#101;&#107;" },
    { name: "Afghanistan Afghani", _id: "AFN", uniDec: "&#1547;" },
    { name: "Argentina Peso", _id: "ARS", uniDec: "&#36;" },
    { name: "Aruba Guilder", _id: "AWG", uniDec: "&#402;" },
    { name: "Australia Dollar", _id: "AUD", uniDec: "&#36;" },
    { name: "Azerbaijan Manat", _id: "AZN", uniDec: "&#8380;" },
    { name: "Bahamas Dollar", _id: "BSD", uniDec: "&#36;" },
    { name: "Barbados Dollar", _id: "BBD", uniDec: "&#36;" },
    { name: "Belarus Ruble", _id: "BYN", uniDec: "&#66;&#114;" },
    { name: "Belize Dollar", _id: "BZD", uniDec: "&#66;&#90;&#36;" },
    { name: "Bermuda Dollar", _id: "BMD", uniDec: "&#36;" },
    { name: "Bolivia Bolíviano", _id: "BOB", uniDec: "&#36;&#98;" },
    { name: "Bosnia and Herzegovina Convertible Mark", _id: "BAM", uniDec: "&#75;&#77;" },
    { name: "Botswana Pula", _id: "BWP", uniDec: "&#80;" },
    { name: "Bulgaria Lev", _id: "BGN", uniDec: "&#1083;&#1074;" },
    { name: "Brazil Real", _id: "BRL", uniDec: "&#82;&#36;" },
    { name: "Brunei Darussalam Dollar", _id: "BND", uniDec: "&#36;" },
    { name: "Cambodia Riel", _id: "KHR", uniDec: "&#6107;" },
    { name: "Canada Dollar", _id: "CAD", uniDec: "&#36;" },
    { name: "Cayman Islands Dollar", _id: "KYD", uniDec: "&#36;" },
    { name: "Chile Peso", _id: "CLP", uniDec: "&#36;" },
    { name: "China Yuan Renminbi", _id: "CNY", uniDec: "&#165;" },
    { name: "Colombia Peso", _id: "COP", uniDec: "&#36;" },
    { name: "Costa Rica Colon", _id: "CRC", uniDec: "&#8353;" },
    { name: "Croatia Kuna", _id: "HRK", uniDec: "&#107;&#110;" },
    { name: "Cuba Peso", _id: "CUP", uniDec: "&#8369;" },
    { name: "Czech Republic Koruna", _id: "CZK", uniDec: "&#75;&#269;" },
    { name: "Denmark Krone", _id: "DKK", uniDec: "&#107;&#114;" },
    { name: "Dominican Republic Peso", _id: "DOP", uniDec: "&#82;&#68;&#36;" },
    { name: "East Caribbean Dollar", _id: "XCD", uniDec: "&#36;" },
    { name: "Egypt Pound", _id: "EGP", uniDec: "&#163;" },
    { name: "El Salvador Colon", _id: "SVC", uniDec: "&#36;" },
    { name: "Euro Member Countries", _id: "EUR", uniDec: "&#8364;" },
    { name: "Falkland Islands (Malvinas) Pound", _id: "FKP", uniDec: "&#163;" },
    { name: "Fiji Dollar", _id: "FJD", uniDec: "&#36;" },
    { name: "Ghana Cedi", _id: "GHS", uniDec: "&#162;" },
    { name: "Gibraltar Pound", _id: "GIP", uniDec: "&#163;" },
    { name: "Guatemala Quetzal", _id: "GTQ", uniDec: "&#81;" },
    { name: "Guernsey Pound", _id: "GGP", uniDec: "&#163;" },
    { name: "Guyana Dollar", _id: "GYD", uniDec: "&#36;" },
    { name: "Honduras Lempira", _id: "HNL", uniDec: "&#76;" },
    { name: "Hong Kong Dollar", _id: "HKD", uniDec: "&#36;" },
    { name: "Hungary Forint", _id: "HUF", uniDec: "&#70;&#116;" },
    { name: "Iceland Krona", _id: "ISK", uniDec: "&#107;&#114;" },
    { name: "India Rupee", _id: "INR", uniDec: "&#8377;" },
    { name: "Indonesia Rupiah", _id: "IDR", uniDec: "&#82;&#112;" },
    { name: "Iran Rial", _id: "IRR", uniDec: "&#65020;" },
    { name: "Isle of Man Pound", _id: "IMP", uniDec: "&#163;" },
    { name: "Israel Shekel", _id: "ILS", uniDec: "&#8362;" },
    { name: "Jamaica Dollar", _id: "JMD", uniDec: "&#74;&#36;" },
    { name: "Japan Yen", _id: "JPY", uniDec: "&#165;" },
    { name: "Jersey Pound", _id: "JEP", uniDec: "&#163;" },
    { name: "Kazakhstan Tenge", _id: "KZT", uniDec: "&#1083;&#1074;" },
    { name: "Korea (North) Won", _id: "KPW", uniDec: "&#8361;" },
    { name: "Korea (South) Won", _id: "KRW", uniDec: "&#8361;" },
    { name: "Kyrgyzstan Som", _id: "KGS", uniDec: "&#1083;&#1074;" },
    { name: "Laos Kip", _id: "LAK", uniDec: "&#8365;" },
    { name: "Lebanon Pound", _id: "LBP", uniDec: "&#163;" },
    { name: "Liberia Dollar", _id: "LRD", uniDec: "&#36;" },
    { name: "Macedonia Denar", _id: "MKD", uniDec: "&#1076;&#1077;&#1085;" },
    { name: "Malaysia Ringgit", _id: "MYR", uniDec: "&#82;&#77;" },
    { name: "Mauritius Rupee", _id: "MUR", uniDec: "&#8360;" },
    { name: "Mexico Peso", _id: "MXN", uniDec: "&#36;" },
    { name: "Mongolia Tughrik", _id: "MNT", uniDec: "&#8366;" },
    { name: "Mozambique Metical", _id: "MZN", uniDec: "&#77;&#84;" },
    { name: "Namibia Dollar", _id: "NAD", uniDec: "&#36;" },
    { name: "Nepal Rupee", _id: "NPR", uniDec: "&#8360;" },
    { name: "Netherlands Antilles Guilder", _id: "ANG", uniDec: "&#402;" },
    { name: "New Zealand Dollar", _id: "NZD", uniDec: "&#36;" },
    { name: "Nicaragua Cordoba", _id: "NIO", uniDec: "&#67;&#36;" },
    { name: "Nigeria Naira", _id: "NGN", uniDec: "&#8358;" },
    { name: "Norway Krone", _id: "NOK", uniDec: "&#107;&#114;" },
    { name: "Oman Rial", _id: "OMR", uniDec: "&#65020;" },
    { name: "Pakistan Rupee", _id: "PKR", uniDec: "&#8360;" },
    { name: "Panama Balboa", _id: "PAB", uniDec: "&#66;&#47;&#46;" },
    { name: "Paraguay Guarani", _id: "PYG", uniDec: "&#71;&#115;" },
    { name: "Peru Sol", _id: "PEN", uniDec: "&#83;&#47;&#46;" },
    { name: "Philippines Peso", _id: "PHP", uniDec: "&#8369;" },
    { name: "Poland Zloty", _id: "PLN", uniDec: "&#122;&#322;" },
    { name: "Qatar Riyal", _id: "QAR", uniDec: "&#65020;" },
    { name: "Romania Leu", _id: "RON", uniDec: "&#108;&#101;&#105;" },
    { name: "Russia Ruble", _id: "RUB", uniDec: "&#8381;" },
    { name: "Saint Helena Pound", _id: "SHP", uniDec: "&#163;" },
    { name: "Saudi Arabia Riyal", _id: "SAR", uniDec: "&#65020;" },
    { name: "Serbia Dinar", _id: "RSD", uniDec: "&#1044;&#1080;&#1085;&#46;" },
    { name: "Seychelles Rupee", _id: "SCR", uniDec: "&#8360;" },
    { name: "Singapore Dollar", _id: "SGD", uniDec: "&#36;" },
    { name: "Solomon Islands Dollar", _id: "SBD", uniDec: "&#36;" },
    { name: "Somalia Shilling", _id: "SOS", uniDec: "&#83;" },
    { name: "South Africa Rand", _id: "ZAR", uniDec: "&#82;" },
    { name: "Sri Lanka Rupee", _id: "LKR", uniDec: "&#8360;" },
    { name: "Sweden Krona", _id: "SEK", uniDec: "&#107;&#114;" },
    { name: "Switzerland Franc", _id: "CHF", uniDec: "&#67;&#72;&#70;" },
    { name: "Suriname Dollar", _id: "SRD", uniDec: "&#36;" },
    { name: "Syria Pound", _id: "SYP", uniDec: "&#163;" },
    { name: "Taiwan New Dollar", _id: "TWD", uniDec: "&#78;&#84;&#36;" },
    { name: "Thailand Baht", _id: "THB", uniDec: "&#3647;" },
    { name: "Trinidad and Tobago Dollar", _id: "TTD", uniDec: "&#84;&#84;&#36;" },
    { name: "Turkey Lira", _id: "TRY", uniDec: "&#8378;" },
    { name: "Tuvalu Dollar", _id: "TVD", uniDec: "&#36;" },
    { name: "Ukraine Hryvnia", _id: "UAH", uniDec: "&#8372;" },
    { name: "United Kingdom Pound", _id: "GBP", uniDec: "&#163;" },
    { name: "United States Dollar", _id: "USD", uniDec: "&#36;" },
    { name: "Uruguay Peso", _id: "UYU", uniDec: "&#36;&#85;" },
    { name: "Uzbekistan Som", _id: "UZS", uniDec: "&#1083;&#1074;" },
    { name: "Venezuela Bolívar", _id: "VEF", uniDec: "&#66;&#115;" },
    { name: "Viet Nam Dong", _id: "VND", uniDec: "&#8363;" },
    { name: "Yemen Rial", _id: "YER", uniDec: "&#65020;" },
    { name: "Zimbabwe Dollar", _id: "ZWD", uniDec: "&#90;&#36;" },
  ],
});
//module.exports = { DEV_MONGODB_URI, ACCOUNT_TYPES, GENERIC_BUDGET_CATEGORIES, ACCOUNT_PERSPECTIVES };
