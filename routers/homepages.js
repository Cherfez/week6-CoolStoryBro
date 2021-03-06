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

// /:id
router.patch("/other", auth, async (req, res) => {
  const homepage = await Homepage.findByPk(req.user.id); //req.params.id
  if (!homepage.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { title, description, backgroundColor, color } = req.body;

  await homepage.update({ title, description, backgroundColor, color });

  return res.status(200).send({ homepage });
});

router.delete("/other/:storyId", auth, async (req, res, next) => {
  const { storyId } = req.params;
  console.log("id from router", storyId);
  try {
    const story = await Story.findByPk(storyId);

    if (!story) {
      return res.status(404).send("Story not found");
    }

    const result = await story.destroy();
    console.log("result", result);

    res.json({ storyId });
  } catch (e) {
    next(e);
  }
});

//post story
router.post("/stories", auth, async (req, res) => {
  const homepage = await Homepage.findByPk(req.user.id);
  console.log(homepage);

  if (homepage === null) {
    return res.status(404).send({ message: "This homepage does not exist" });
  }

  if (!homepage.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { name, imageUrl, content } = req.body;

  if (!name) {
    return res.status(400).send({ message: "A story must have a name" });
  }

  const story = await Story.create({
    name,
    imageUrl,
    content,
    homepageId: homepage.id
  });

  return res.status(201).send({ message: "Story created", story });
});

router.get("/", async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const homepages = await Homepage.findAndCountAll({
    limit,
    offset,
    include: [Story]
  });
  res.status(200).send({ message: "ok", homepages });
});

module.exports = router;
