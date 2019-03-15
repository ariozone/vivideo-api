const mongoose = require("mongoose")
const Joi = require('joi')

const rentalSchema = new mongoose.Schema({
  customer: {
    // Creating a custom schema because we don't need all customer proterties.
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
      },
      isPrime: {
        type: Boolean,
        default: false
      },
      contact: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
      }
    }),
    required: true
  },
  movie: {
    // Creating a custom schema because we don't need all movie proterties.
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
      },
      dailyRentalRate: {// Embedded this to avoid additional query
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateBack: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
})

const schema = {
  customerId: Joi.string().required(),
  movieId: Joi.string().required()
}
