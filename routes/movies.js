const {Movie, validate} = require('../models/movie')
const {Genre} = require('../models/genre')
const express = require('express')
const router = express.Router()


router.get('/', async(req, res) => {
  const movies = await Movie.find().sort('name')
  res.send(movies)
})

router.get('/:id', async(rep, res) => {
  const movie = await Movie.findById(req.params.id)
  if (!movie) return res.status(404).send('Movie with the given ID does not exist!')
  res.send(movie)
})
