const express = require('express')
// Using router object instead of app when routes are in seperate modules.
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')
router.use(express.json())

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
})

const Genre = mongoose.model('Genre', genreSchema)

async function createGenre(genreName) {
  const genre = new Genre({
    name: genreName
  })
  const result = await genre.save()
  console.log(result)
}
// createGenre("Action")
// createGenre("Comedy")
// createGenre("Thriller")



router.get("/", async(req, res) => {
  const genres = await Genre.find().sort({name: 1})
  res.send(genres)
})

router.get("/:id", (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  !genre
  ? res.status(404).send("Genre with the given ID does not exist.")
  : res.send(genre.name)
})

router.post("/", (req, res) => {
  const {error} = validateGenre(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres.push(genre)
  res.send(genre)
})

router.put('/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send("Genre with the given ID does not exist.")

  const {error} = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  genre.name = req.body.name
  res.send(genre)

})

router.delete('/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id))

  if(!genre) return res.status(404).send("Genre with the given ID does not exist.")
  const index = genres.indexOf(genre)
  genres.splice(index, 1)
  res.send(genre)
})


function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(genre, schema)
}

module.exports = router
