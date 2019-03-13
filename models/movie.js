const mongoose = require('mongoose')
const genreSchema = require('./genre')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  genre: genreSchema,
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
})

const Movie = mongoose.model('Movie', movieSchema)
