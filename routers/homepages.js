const { Router } = require("express");
const auth = require("../auth/middleware");
const Homepage = require("../models").homepage;
const Story = require("../models").story;

const router = new Router();

// GET products
router.get("/", async (req, res) => {
  //console.log("HI!");
  const allHomepages = await Homepage.findAll();
  console.log(allHomepages);
  res.status(200).json(allHomepages);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);
  if (isNaN(parseInt(id))) {
    return res.status(400).send({ message: "Homepage id is not a number" });
  }

  const homepage = await Homepage.findByPk(id, { include: [Story] });

  if (homepage === null) {
    return res.status(404).send({ message: "Homepage not found" });
  }

  res.status(200).send({ message: "ok", homepage });
});

router.patch("/:id", auth, async (req, res) => {
  const homepage = await Homepage.findByPk(req.params.id);
  if (!homepage.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { title, description, backgroundColor, color } = req.body;

  await homepage.update({ title, description, backgroundColor, color });

  return res.status(200).send({ homepage });
});

//post story

module.exports = router;
