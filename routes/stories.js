const express = require("express");
const router = express.Router();

const { getDB } = require("../db/connect");
const { ObjectId } = require("mongodb");

// GET all stories
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const stories = await db
      .collection("stories")
      .find()
      .toArray();

    res.json(stories);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// GET one story by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();

    const story = await db
      .collection("stories")
      .findOne({
        _id: new ObjectId(req.params.id)
      });

    if (!story) {
      return res.status(404).json({
        message: "Story not found"
      });
    }

    res.json(story);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// POST create story
router.post("/", async (req, res) => {
  try {
    const db = getDB();

    const story = {
      title: req.body.title,
      genre: req.body.genre,
      status: req.body.status,
      summary: req.body.summary,
      wordCount: req.body.wordCount,
      targetAudience: req.body.targetAudience,
      dateCreated: req.body.dateCreated,
      favorite: req.body.favorite
    };


    // Validation
    if (
      !story.title ||
      !story.genre ||
      !story.status ||
      !story.summary ||
      !story.wordCount ||
      !story.targetAudience ||
      !story.dateCreated
    ) {
      return res.status(400).json({
        message: "All required fields must be provided."
      });
    }


    const result = await db
      .collection("stories")
      .insertOne(story);


    res.status(201).json({
      id: result.insertedId
    });


  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// PUT update story
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();


    const updateStory = {
      title: req.body.title,
      genre: req.body.genre,
      status: req.body.status,
      summary: req.body.summary,
      wordCount: req.body.wordCount,
      targetAudience: req.body.targetAudience,
      dateCreated: req.body.dateCreated,
      favorite: req.body.favorite
    };


    if (
      !updateStory.title ||
      !updateStory.genre ||
      !updateStory.status ||
      !updateStory.summary ||
      !updateStory.wordCount ||
      !updateStory.targetAudience ||
      !updateStory.dateCreated
    ) {
      return res.status(400).json({
        message: "All required fields must be provided."
      });
    }


    const result = await db
      .collection("stories")
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        updateStory
      );


    res.status(200).json(result);


  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// DELETE story
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();


    const result = await db
      .collection("stories")
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