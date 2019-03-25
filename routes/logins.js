const {User} = require('../models/user')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Joi = require('joi')

router.post('/', async(req, res) => {
  const {error} = validateLogin(req.body)
  if (error) return res.status(400).send(error.details[0].message)

})

function validateLogin(login){
  const schema = {
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024
    }
  }
  return Joi.validate(login, schema)

}
