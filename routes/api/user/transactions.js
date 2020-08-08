const router = require("express").Router();
const { Transaction } = require("../../../models");
const axios = require("axios");

router.get("/:uid?", async (req, res) => {
  //once db is set up with transaction data
  //   Transaction.find({ ownerRef: req.params.uid }).then(transactions =>
  //     console.log(transactions)
  //   );

  //placeholder dummy api data
  const URL = "https://jsonplaceholder.typicode.com/users";
  const { data } = await axios.get(URL);
  res.json(data);
});

module.exports = router;
