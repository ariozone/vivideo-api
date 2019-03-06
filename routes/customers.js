const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

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
    type: boolean,
    default: false
  }
})
