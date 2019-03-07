const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  contact: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  isPrime: {
    type: Boolean,
    default: false
  }
})

const Customer = mongoose.model('Customer', customerSchema)

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort({name: 1})
  res.send(customers)
})
