const mongoose = require("mongoose")
const genreSchema = require("./genre")
const Joi = require("joi")

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

const Movie = mongoose.model("Movie", movieSchema)

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .required()
      .min(2)
      .max(50),
    genre: Joi.string()
      .required()
      .min(3)
      .max(50),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(255),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(255)
  }
  return Joi.validate(movie, schema)
}
