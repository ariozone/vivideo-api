const mongoose = require("mongoose")
const Joi = require("joi")
const moment = require("moment")

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
      dailyRentalRate: {
        // Embedded this to avoid additional query
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

rentalSchema.methods.calculateReturn = function() {
  this.dateBack = new Date()
  const daysInRent = moment().diff(this.dateOut, "days")
  this.rentalFee = daysInRent * this.movie.dailyRentalRate
}

const Rental = mongoose.model("Rental", rentalSchema)

function validateRental(rental) {
  const schema = {
    //string() replaced by objectId()
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  }
  return Joi.validate(rental, schema)
}

module.exports.validate = validateRental
module.exports.Rental = Rental
