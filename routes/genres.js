const express = require('express')
// Using router object instead of app when routes are in seperate modules.
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')
router.use(express.json())


const genreSchema = new mongoose.Schema({
  name: String,
})

const Genre = mongoose.model('Genre', genreSchema)
async function createGenre() {
  const genre = new Genre({
    name: 'Action'
  })
  const result = await genre.save()
  console.log(result)
}
createGenre()

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
  { id: 3, name: "Thriller" }
]

router.get("/", (req, res) => {
  // to read query string parameters(for example: ?sortBy=name)
  // const sortBy = req.query.sortBy
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
