const { Router } = require("express");
const Homepage = require("../models").homepage;

const router = new Router();

// GET products
router.get("/", async (req, res) => {
  //console.log("HI!");
  const allHomepages = await Homepage.findAll();
  console.log(allHomepages);
  res.status(200).json(allHomepages);
});

module.exports = router;
