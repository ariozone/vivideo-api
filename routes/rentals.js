const {Rental, validate} = require('../models/rental')
const {Movie} = require('../models/movie')
const {Customer} = require('../models/customer')
const express = require('express')
const router = express.Router()

router.get('/', async(req, res) => {
  const rentals = await Rental.find().sort({dateOut: -1})
  res.send(rentals)
})

router.post('/', async(req, res) => {
  const {error} = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const customer = await Customer.findById(req.body.customerId)
  if (!customer) return res.status(400).send('Invalid Customer!')

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(400).send('Invalid Movie!')

  if (movie.numberInStock === 0) return res.status(400).send('Movie is not in stock')


})
