const express = require("express");
const router = express.Router();

const { getDB } = require("../db/connect");
const { ObjectId } = require("mongodb");


/**
 * @swagger
 * /ideas:
 *   get:
 *     summary: Get all ideas
 *     description: Returns all writing ideas stored in the database.
 *     responses:
 *       200:
 *         description: List of ideas
 *       500:
 *         description: Server error
 */
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


/**
 * @swagger
 * /ideas/{id}:
 *   get:
 *     summary: Get an idea by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Idea found
 *       404:
 *         description: Idea not found
 *       500:
 *         description: Server error
 */
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


/**
 * @swagger
 * /ideas:
 *   post:
 *     summary: Create a new idea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - description
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Idea created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
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


/**
 * @swagger
 * /ideas/{id}:
 *   put:
 *     summary: Update an idea
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
 *         description: Idea updated
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
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


/**
 * @swagger
 * /ideas/{id}:
 *   delete:
 *     summary: Delete an idea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Idea deleted
 *       500:
 *         description: Server error
 */
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