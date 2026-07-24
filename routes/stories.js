const express = require("express");
const router = express.Router();

const { getDB } = require("../db/connect");
const { ObjectId } = require("mongodb");
const isAuthenticated = require("../middleware/auth");

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Get all stories
 *     description: Returns all stories stored in the Story Vault database.
 *     responses:
 *       200:
 *         description: List of stories
 *       500:
 *         description: Server error
 */
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


/**
 * @swagger
 * /stories/{id}:
 *   get:
 *     summary: Get a story by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story found
 *       404:
 *         description: Story not found
 *       500:
 *         description: Server error
 */
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


/**
 * @swagger
 * /stories:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Create a new story
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - genre
 *               - status
 *               - summary
 *               - wordCount
 *               - targetAudience
 *               - dateCreated
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               status:
 *                 type: string
 *               summary:
 *                 type: string
 *               wordCount:
 *                 type: integer
 *               targetAudience:
 *                 type: string
 *               dateCreated:
 *                 type: string
 *               favorite:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Story created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/", isAuthenticated, async (req, res) => {
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


/**
 * @swagger
 * /stories/{id}:
 *   put:
 *     security:
 *        - cookieAuth: []
 *     summary: Update a story
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Story updated
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.put("/:id", isAuthenticated, async (req, res) => {
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


/**
 * @swagger
 * /stories/{id}:
 *   delete:
 *     security:
 *        - cookieAuth: []
 *     summary: Delete a story
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", isAuthenticated, async (req, res) => {
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