const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: String
})
