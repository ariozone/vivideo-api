const { Movie, validate } = require("../models/movie")
const express = require("express")
const router = express.Router()
router.use(express.json())

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name")
  res.send(movies)
})

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  if (!movie)
    return res.status(404).send("Movie with the given ID does not exist!")
  res.send(movie)
})

router.post("/", async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  const genre = Genre.findById(req.body.genreId)
  if (!genre) res.status(400).send('Genre ID is invalid!')
  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: req.body.genreId._id,
      name: req.body.genreId.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  })
  movie = await movie.save()
  res.send(movie)
})

router.put('/:id', async(req, res) => {
  const {error} = validate(req.body)
  if (error) res.status(400).send(error.details[0].message)
  const genre = Genre.findById(req.body.genreId)
  if (!genre) res.status(400).send('Genre ID is invalid!')
  let movie = await Movie.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    genre: {
      _id: req.body.genreId._id,
      name: req.body.genreId.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  })
  movie= await movie.save()
  res.send(movie)
})
