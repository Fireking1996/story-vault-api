const express = require("express");
const router = express.Router();

const { getDB } = require("../db/connect");
const { ObjectId } = require("mongodb");


// GET all ideas
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const ideas = await db
      .collection("ideas")
      .find()
      .toArray();

    res.json(ideas);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// GET one idea by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();

    const idea = await db
      .collection("ideas")
      .findOne({
        _id: new ObjectId(req.params.id)
      });

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found"
      });
    }

    res.json(idea);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// POST create idea
router.post("/", async (req, res) => {
  try {
    const db = getDB();

    const idea = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      priority: req.body.priority
    };


    if (
      !idea.title ||
      !idea.category ||
      !idea.description ||
      !idea.priority
    ) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }


    const result = await db
      .collection("ideas")
      .insertOne(idea);


    res.status(201).json({
      id: result.insertedId
    });


  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// PUT update idea
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();


    const idea = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      priority: req.body.priority
    };


    if (
      !idea.title ||
      !idea.category ||
      !idea.description ||
      !idea.priority
    ) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }


    const result = await db
      .collection("ideas")
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        idea
      );


    res.status(200).json(result);


  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// DELETE idea
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();


    const result = await db
      .collection("ideas")
      .deleteOne({
        _id: new ObjectId(req.params.id)
      });


    res.status(200).json(result);


  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


module.exports = router;