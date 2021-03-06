const auth = require("../middleware/authorization")
const admin = require("../middleware/admin")
const express = require("express")
const mongoose = require("mongoose")
const { Genre, validate } = require("../models/genre")
const validateObjectId = require("../middleware/validateObjectId")
// Using router object instead; Because routes are in seperate modules.
const router = express.Router()

router.use(express.json())

router.get("/", async (req, res) => {
  // throw new Error("Something is wrong!") // to test

  const genres = await Genre.find().sort({ name: 1 })
  res.send(genres)
})

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  !genre
    ? res.status(404).send("Genre with the given ID does not exist.")
    : res.send(genre)
})

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = new Genre({ name: req.body.name })
  await genre.save()
  res.send(genre)
})

router.put("/:id", [validateObjectId, auth], async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  )
  if (!genre)
    return res.status(404).send("Genre with the given ID does not exist.")

  res.send(genre)
})

router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)

  if (!genre)
    return res.status(404).send("Genre with the given ID does not exist.")
  res.send(genre)
})

module.exports = router
