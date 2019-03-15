const mongoose = require('mongoose')

const rentalSchema = new mongoose.Schema({
  customer: {
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
    })
  }

})
