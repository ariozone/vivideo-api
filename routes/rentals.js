const {Rental, validate} = require('../models/rental')
const {Movie} = require('../models/movie')
const {Customer} = require('../models/customer')
const express = require('express')
const router = express.Router()

router.get('/', async(req, res) => {
  const rentals = await Rental.find().sort({dateOut: -1})
  res.send(rentals)
})
