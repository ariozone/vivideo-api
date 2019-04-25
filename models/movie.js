const mongoose = require("mongoose")
const { genreSchema } = require("./genre")
const Joi = require("joi")

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  genre: {
    type: genreSchema,
    required: true
  },
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
    max: 255
  }
})

const Movie = mongoose.model("Movie", movieSchema)

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .required()
      .min(2)
      .max(50),
    genreId: Joi.objectId() // User will send us genreId only, not genre name.
      .required(),
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

module.exports.Movie = Movie
module.exports.validate = validateMovie
