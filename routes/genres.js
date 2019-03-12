const express = require("express")
// Using router object instead; Because routes are in seperate modules.
const router = express.Router()
const Joi = require("joi")
const mongoose = require("mongoose")
router.use(express.json())

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 })
  res.send(genres)
})

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  !genre
    ? res.status(404).send("Genre with the given ID does not exist.")
    : res.send(genre)
})

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let genre = new Genre({ name: req.body.name })
  genre = await genre.save() //Reassigning genre to be able to return it to the client
  res.send(genre)
})

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body)
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

router.delete("/:id", async(req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)

  if (!genre)
    return res.status(400).send("Genre with the given ID does not exist.")
  res.send(genre)
})

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  }
  return Joi.validate(genre, schema)
}

module.exports = router
