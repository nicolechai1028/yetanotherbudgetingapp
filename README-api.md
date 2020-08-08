# Yet-Another-Budgetting-App (YABA) API Documentation

## <span style="color:blue">Introduction</span>
YABA API is based on JSON principles. The follwoing documentation covers core resources that are used to access and manipulate data in the YABA server.

## <span style="color:blue">Reference</span>

- [User Route (/api/user)](#uuseru)
  - [login](#login)
  - [logout](#logout)
  - [register](#register)
  - [verify](#email-verification)
  - [profile](#user-profile)
  - [currency](#currency)
- [Budget Account Route(/api/budgetAccount)](#ubudget-accountu)
  - [close](#close)
  - [create](#create)
  - [list](#list)
  - [modify](#modify)

- [User API Examples](#user-register)
  - [Register](#user-register)
  - [Email Verification](#user-email-verification)
  - [Login](#user-login)
  - [Profile Query](#user-profile-query)
  - [Currency Query](#user-currency-query)
  - [Logout](#user-logout)

- [Budget Account API Examples](#budget-account-create)
  - [Budget Account Create](#budget-account-create)
  - [Budget Account Modify/Update](#budget-account-modify-update)
  - [Budget Account List](#budget-account-list)
  - [Budget Account Close](#budget-account-close)

### <u><span style="color:orange">User</span></u>
This is a section of resources related to user access to the application

See this [link](https://www.tablesgenerator.com/markdown_tables#) for how to generate markdown table
| <center>**Method**</center>   | <center>**Path**</center>     | <center>**Keys**</center>     | <center>**Return**</center>                           | <center>**Comment**</center>  |
|-----------------------------  |---------------------------    |---------------------------    |------------------------------------------------------ |------------------------------ |
| POST                          | /api/user/login               | {email, password}             | {status, message,[sessionUUID, firstName, lastname]}  |                               |
| POST                          | /api/user/logout              | {sessionUUID}                 | {status, message}                                     |                               |
| POST                          | /api/user/register            | {firstName, lastName, email, password,[currencyCode]} | {status, message}                            | Verification email is sent    |
| GET                           | /api/user/verify/:verifyCode  | { }                              | \<HTML response\>                                                | Verification email link       |
| POST                          | /api/user/profile             | {sessionUUID}                 | {status, message, [firstName,lastName,currency]]      |  Returns Profile for current user
| POST                          | /api/user/currency/:code?     |  {sessionUUID}                | {status, message, [currency]]                         |  Success returns array of Currency objects|
|                               |                               |                               |                                                       |                                |

#### Login

> Matches with /api/user/login
> Login route. Success will return the following object:
>
>  - status: OK
>  - message : \<User {email} successfully logged in\>
>  - sessionUUID : \<Unique session UUID for this login session. Used for every communication with server\>
>
> Error will return:
>  - status : ERROR
>  - message : \<Error message\>
>  - firstName: \<user first name\>
>  - lastName: \<user last name\>
>
> Expects:
>  - email : \<user login email ID\>
>  - password: \<user password\>

#### Logout
> Matches routes with /api/user/logout
> Logout route. Success will return the following object:
> 
>  - status: OK
>  - message : \<User {email} successfully logged out\>
>  - sessionUUID : \<Unique session UUID for this login session. Used for every communication with server\>
> 
> Error will return
>  - status : ERROR
>  - message : \<depends on condition\>
>
> Expects:
>  - SessionUUID : \<Unique session UUID for this login session\>

#### Register
  
> Matches routes with /api/user/register
> Register route. Success will return the following object:
>
>  - status: OK
>  - message : \<User {email} successfully registered in\>
>
> Error will return:
>  - status : ERROR
>  - message : \<Error message\>
> 
> Expects:
>  - firstName: \<user first name\>
>  - lastName: \<user last name\>
>  - email : \<user login email ID\>
>  - password: \<user password\>
>  - currencyCode: \<three character currency code\> // Optional. if not present or not among valid choice, "USD" is used

#### Email Verification

> Matches routes with /api/user/verify/:verifyCode
> Email Verification route route. Success or failure will result in sending of HTML page as
> response. GET method is processed and is designed to be launched from a browser
>
> Verification code in req.params.verifyCode. The verification code is the last element of the URL path

#### User Profile

> Matches routes with /api/user/profile
> Register route. Success will return the following object:
>
>  - status: OK
>  - message : User profile for {email}
>  - profile : { email, firstName, lastName,
>                currency : { code, name, uniDec }
>              }
>
> Error will return:
>  - status : ERROR
>  - message : \<Error message\>
> 
> Expects:
>  - sessionUUID: \<sessionUUID\>

#### Currency

> Matches routes with /api/user/currency/:code?
> Currency route. If the "code" param is not on the path, all currencies will be returned.
> More than one currency code separated with commas can be listed on the URL 
> 
> Success will return the following object:
>
>  - status: OK
>  - message : World Currencies
>  - currency : [{code,name,uniDec}]
>
> Error will return:
>  - status : ERROR
>  - message : <Error message>
> Expects:
>  - sessionUUID 

### <u><span style="color:orange">Budget Account</span></u>

This is a section of resources related to the management of Budget Accounts. Budget Accounts are simply accounts from which transactions are made. Examples of Budget Account are
* Savings
* Checking
* Credit Card
* Cash

A user can create an unlimited number of these accounts Money flows into and out of these accounts. In other words, Transactions are associated with these accounts. The image below shows how Budget Accounts are created at [YNAB](https://www.youneedabudget.com/).
![YNAB Budget Account Creation](./api-readme-images/ynab-create-budget-account.png "YNAB Create Budget Account")

| <center>**Method**</center>    | <center>**Path**</center> | <center>**Keys**</center>            | <center>**Return**</center>                                       | <center>**Comment**</center>                                                  |
|--------   |---------------------------    |-----------------------------------------------------  |-----------------------------------------------------------------  |---------------------------------------------------------------------------    |
| POST      | /api/budgetAccount/create     | {sessionUUID, name, accountType, [balance]}       | [status,message,[name,accountUUID,accountType,startingBalance]]   | Optional return keys/values return on "OK" status                             |
| POST      | /api/budgetAccount/modify     | {sessionUUID, accountUUID, [[name], [balance], [notes]]}  | {status, message, [name, balance, notes, [transaction]]}                         |                                                                               |
| POST      | /api/budgetAccount/close      | {sessionUUID, accountUUID}                                | {status, message}                                                 | If successfully close, status is "OK". The account is not deleted. Merely tagged as "closed"                                         |
| POST      | /api/budgetAccount/list       | {sessionUUID,[accountUUID]}                               | {status, message, [accounts(array{accountUUID, name, type, balance, isClosed})]}   | Success status is "OK". Return includes optional array of account objects     |

#### Close
> Matches with /api/budgetAccount/close
> Expects:
>  - sessionUUID
>  - accountUUID. Identifies the account to be "closed"
> Returns:
>  - status: [OK | ERROR]
>  - message: ["Invalid sessionUUID" | "No such Budget Account" | "Account <name> successfully closed"]

#### Create
> Matches with /api/budgetAccount/create
> Expects:
>  - sessionUUID
>  - name
>  - accountType // one of ["Checking", "Saving", "Cash", "Credit Card", "Line of Credit"]
>  - balance // default = 0.0
> Returns:
>  - status: [OK | ERROR]
>  - message: \`Account "${name}" created\` | \<Error Message\>
> 
> On status = "OK", the following fields are added:
>  - name: ${name}
>  - accountUUID
>  - accountType
>  - balance
> 
> If "balance" <> 0, the following transaction record will be returned:
>  - transaction: <br>
>  {
>     - id: \<transactionID\>
>     - accountUUID: \<id of created account\>
>     - categoryName: \<Name of category Group\>
>     - categoryUUID: \<UUID of category Group\>
>     - subCategoryName: \<Name of sub category\>
>     - subCcategoryUUID: \<UUID of sub category\>
>     - perspective: \<one of \["Inflow","Outflow"\]\>
>     - amount: \<transaction amount\>
>     - date: \<transaction date number in yyyymmdd\><br>
>  }
> 

#### List
> Matches with /api/budgetAccount/list
> Expects:
>  - sessionUUID
>  - accountUUID (optional)
>
> The "option" param (req.params.option) is optional. Values are ["all", "closed", "active"]
> Default is "all".
>
> Returns list of accounts (name, type, starting balance, accountUUID,)

#### Modify
> Matches with /api/budgetAccount/modify
> Used to edit the name of a Budget Account.
> Requires:
>  - sessionUUID
>  - accountUUID
>  - name
> Name will be checked to make sure it does not conflict with another account name (case insensitive, trimmed, multi-spaces removed)

### <u><span style="color:orange">Category</span></u>
Upon account verification, each user is given about eleven categories to work with. These categories may be edited or deleted (as long as there are no transactions or budgets that use them). Additionally there are two <b>System</b> categories that the user cannot edit or delete.
| <center>**Method**</center>    | <center>**Path**</center> | <center>**Keys**</center>            | <center>**Return**</center>                                       | <center>**Comment**</center>                                                  |
|--------   |---------------------------    |-----------------------------------------------------  |-----------------------------------------------------------------  |---------------------------------------------------------------------------    |
| POST      | /api/category/create          | {sessionUUID, categoryName, perspective,subCategory[array[subCategoryName]]}| {status, message,[categoryName,categoryUUID, perspective,subCategory[{subCategoryName,subCategoryUUID}]]  |                                                                               |
| POST      | /api/category/list            | {sessionUUID, [categoryName, categoryUUID]            | {status, message, [category[category[ ] ]}                                   |                                                                               |
|           |                               |                                                       |                                                                   |                                                                               |

### Category Create
> Matches routes with /api/category/create
> Create category route
>
> Success will return the following object:
>
>  - status: OK
>  - message : "Category with ${count} sub categories created"
>  - categoryName:
>  - categoryUUID
>  - perspective
>  - subCategory
>    ``[
>      {
>        subCategoryName,
>        subCategoryUUID
>      }
>    ]``
> 
> Error will return:
>  - status : ERROR
>  - message : <Error message>
>
> Expects:
>  - sessionUUID
>  - categoryName // must be unique in the user's realm
>  - perspective
>  - subCategory[ ] // array of names. Must be unique for this category
>

### <u><span style="color:orange">Budget</span></u>
| <center>**Method**</center>    | <center>**Path**</center> | <center>**Keys**</center>            | <center>**Return**</center>                                       | <center>**Comment**</center>                                                  |
|--------   |---------------------------    |-----------------------------------------------------  |-----------------------------------------------------------------  |---------------------------------------------------------------------------    |
|           |                               |                                                       |                                                                   |                                                                               |
|           |                               |                                                       |                                                                   |                                                                               |

### <u><span style="color:orange">Transaction</span></u>
| <center>**Method**</center>    | <center>**Path**</center> | <center>**Keys**</center>            | <center>**Return**</center>                                       | <center>**Comment**</center>                                                  |
|--------   |---------------------------    |-----------------------------------------------------  |-----------------------------------------------------------------  |---------------------------------------------------------------------------    |
|           |                               |                                                       |                                                                   |                                                                               |
|           |                               |                                                       |                                                                   |                                                                               |

## <span style="color:blue">API Examples</span> 

### User Register
- Request

Path: ``/api/user/register``

```json
{
  "firstName": "Yaba",
  "lastName": "Tester",
  "email": "bootcamp.yaba.project@gmail.com",
  "password": "yabatester2020" 
}
```

- Response

```json
{
  "status": "OK",
  "message": "Registation Successful",
  "firstName": "Yaba",
  "lastName": "Tester",
  "email": "bootcamp.yaba.project@gmail.com"
}
```

### User Email Verification
- Request

Path: ``/api/user/verify/:code``

User clicks on verification button in email sent after registration. Format of Email URL is as follows:

```html
 http://localhost:3001/api/user/verify/10d9f85b-7925-b42f-97b5-407a8f6639d5
 ```

- Response

User is redirected to the Login Page of the Application

### User Login
- Request

Path: ``/api/user/login``

```json
{
  "email": "bootcamp.yaba.project@gmail.com",
  "password": "yabatester2020" 
}
```

- Response

```json
{
  "status": "OK",
  "message": "Welcome Yaba Tester!!",
  "sessionUUID": "a3437aa2-2d4c-1b2a-1fdc-f805da2539ed",
  "firstName": "Yaba",
  "lastname": "Tester",
  "currency": {
    "code": "USD",
    "name": "United States Dollar",
    "uniDec": "&#36;"
  }
}
```

### User Profile Query
- Request

Path: ``/api/user/profile``

```json
{
  "sessionUUID": "e147b53c-7230-ba83-2e90-2a37dc25db36"
}
```

- Response

```json
{
  "status": "OK",
  "message": "User profile for bootcamp.yaba.project@gmail.com",
  "firstName": "Yaba",
  "lastName": "Tester",
  "currency": {
    "code": "USD",
    "name": "United States Dollar",
    "uniDec": "&#36;"
  },
  "registerationTimestamp": 1596777186289,
  "verificationTimestamp": 1596777194477
}
```

### User Currency Query
- Request

Path: ``/api/user/currency/:codes?

URL : ``http://localhost:3001/api/user/currency/usd,jpy,gbh``
The last element of the URL path indicates the currency codes for which information is sought. If that last path is omitted, then all the supported currencies will be returned.

```json
{
  "sessionUUID": "e147b53c-7230-ba83-2e90-2a37dc25db36"
}
```

- Response

```json
{
  "status": "OK",
  "message": "World Currencies",
  "currency": [
    {
      "code": "USD",
      "name": "United States Dollar",
      "uniDec": "&#36;"
    },
    {
      "code": "JPY",
      "name": "Japan Yen",
      "uniDec": "&#165;"
    }
  ]
}
```

### User Logout
- Request

Path: ``/api/user/logout``

```json
{
  "sessionUUID": "e147b53c-7230-ba83-2e90-2a37dc25db36" 
}
```

- Response

```json
{
  "status": "OK",
  "message": "Successfully logged out Yaba Tester"
}
```

### Budget Account Create
- Request

Path: ``/api/budgetAccount/create``

```json
{
  "sessionUUID": "e147b53c-7230-ba83-2e90-2a37dc25db36",
  "name": "Citi Visa",
  "accountType": "Credit Card",
  "balance": "-1254.36" 
}
```

- Response

```json
{
  "status": "OK",
  "message": "Account \"Citi Visa\" created",
  "name": "Citi Visa",
  "accountUUID": "3df8ddf6-6f5d-4d3f-ac2c-596cbce794e0",
  "accountType": "Credit Card",
  "balance": -1254.36,
  "transaction": {
    "id": "72126b3c-daa5-4df0-b484-089d7845e910",
    "payee": "Starting Balance",
    "accountUUID": "3df8ddf6-6f5d-4d3f-ac2c-596cbce794e0",
    "categoryName": "Outflow Adjustment",
    "categoryUUID": "f30059bf-a228-4636-84b3-1f987f267551",
    "subCategoryName": "To be budgeted",
    "subCategoryUUID": "9c4f1bbe-814e-4300-8b1b-26f6d9513829",
    "amount": -1254.36,
    "perspective": "Outflow"
  }
}
```

### Budget Account Modify (Update)

- Request

Path: ``/api/budgetAccount/modify``

The request below updates <b>ALL</b> the fields that are editable. Note that no two accounts can have the same name for user. The check is done by trimming the input, replacing two (2) or more spaces with one (1) and doing a <b><i>case-insensitive</i></b> compare. The original Account object did not have "note" optional field.

```json
{
  "sessionUUID": "e147b53c-7230-ba83-2e90-2a37dc25db36",
  "accountUUID": "88090449-f3aa-4386-8500-a218d1849ae4",
  "name": "Wife's CitiBank Visa ",
  "notes": "This is the wife's Visa Credit Card",
  "balance": "-254.36" 
}
```

- Response

```json
{
  "status": "OK",
  "message": "Updated Account Budget",
  "name": "Wife's CitiBank Visa",
  "balance": -254.36,
  "notes": "This is the wife's Visa Credit Card",
  "transaction": {
    "id": "dba925e7-80a4-45ca-9cd7-5f0b6313ab75",
    "payee": "Manual Adjustment",
    "accountUUID": "88090449-f3aa-4386-8500-a218d1849ae4",
    "categoryName": "Inflow Adjustment",
    "categoryUUID": "2e1a5abf-6ed3-4e39-bb3f-ffaa2efc3e33",
    "subCategoryName": "To be budgeted",
    "subCategoryUUID": "d77bc44f-9ff9-4a0a-b08a-c6aa8a3fa2e2",
    "amount": "1000.00",
    "perspective": "Inflow"
  }
}
```

### Budget Account List

- Request

Path: ``/api/budgetAccount/list``

<b><i>accountUUID</i></b> is optional. If not included, all Budget accounts for the user are returned.

```json
{
  "sessionUUID": "e147b53c-7230-ba83-2e90-2a37dc25db36",
  "accountUUID": "88090449-f3aa-4386-8500-a218d1849ae4" 
}
```

- Response

```json
{
  "status": "OK",
  "message": "1 Budget Accounts found",
  "accounts": [
    {
      "accountUUID": "88090449-f3aa-4386-8500-a218d1849ae4",
      "name": "Wife's CitiBank Visa",
      "type": "Credit Card",
      "balance": -254.36,
      "isClosed": false
    }
  ]
}
```

### Budget Account Close

- Request

Path: ``/api/budgetAccount/close/:option?``

The <b><i>option</i></b> query parameter is optional. It can be one of "<i>closed</i>" or "<i>active</i>". Default value of the option is <i>active</i>.

```json
{
  "sessionUUID": "e147b53c-7230-ba83-2e90-2a37dc25db36",
  "accountUUID": "88090449-f3aa-4386-8500-a218d1849ae4" 
}
```

- Response

```json
{
  "status": "OK",
  "message": "Account closed"
}
```

### Category Create Example

- Request

Path: ``/api/category/create``

```json
{
  "sessionUUID": "e147b53c-7230-ba83-2e90-2a37dc25db36",
  "categoryName": "Immediate Obligations",
  "perspective": "OutFlow",
  "subCategory": ["Rent/Mortgage","Electric","Water","Internet"]
}
```

- Response

```json
{
  "status": "OK",
  "message": "Category with 4 Sub Categories created",
  "categoryName": "Immediate Obligations",
  "perspective": "Outflow",
  "categoryUUID": "9e76583b-32b3-4341-bc95-2e34e647f178",
  "subCategory": [
    {
      "subCategoryName": "Rent/Mortgage",
      "subCategoryUUID": "b8b71b00-9361-41c8-888c-d329d260e1b5"
    },
    {
      "subCategoryName": "Electric",
      "subCategoryUUID": "615842a0-c268-40d5-8c0e-81cb49599e96"
    },
    {
      "subCategoryName": "Water",
      "subCategoryUUID": "88f9730a-4388-4ddf-8ec7-de1d0d069ae2"
    },
    {
      "subCategoryName": "Internet",
      "subCategoryUUID": "484213e1-12b6-432c-8b7d-0f787006f6f8"
    }
  ]
}
```

### Category List Example

- Request

Path: ``/api/category/list``

```json
{
  "sessionUUID": "e147b53c-7230-ba83-2e90-2a37dc25db36",
  "categoryName": "Saving" 
}
```

- Response:

```json
{
  "status": "OK",
  "message": "Found 1 Categories",
  "category": [
    {
      "categoryName": "Saving",
      "categoryUUID": "a9ab6d5f-d011-420e-b304-1674d85bc166",
      "perspective": "Outflow",
      "subCategory": [
        {
            "subCategoryUUID": "e4ec56d0-d4f9-4cc1-a15a-d76559dd2211",
            "subCategoryName": "Emergency Fund"
        },
        {
            "subCategoryUUID": "6355fcfd-564f-4174-ad64-10580ebe47a8",
            "subCategoryName": "Retirement"
        },
        {
            "subCategoryUUID": "2d1793c7-1b9c-4e02-aa2e-a939025861c8",
            "subCategoryName": "Travel/Vacation"
        },
        {
            "subCategoryUUID": "30c1d390-22b3-46a1-b3a1-b55bc34d4b0d",
            "subCategoryName": "Car Replacement"
        },
        {
            "subCategoryUUID": "db5d14af-4f4c-4c66-823d-88412e856318",
            "subCategoryName": "College Fund"
        },
        {
            "subCategoryUUID": "0c984966-910e-49f3-8081-fd5f3b69fe20",
            "subCategoryName": "Long Term Goals"
        },
        {
            "subCategoryUUID": "df5cff32-59bd-4218-b86b-0e0019ffd48b",
            "subCategoryName": "Short Term Goals"
        }
      ]
    }
  ]
}
```
