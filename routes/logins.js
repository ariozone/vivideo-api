const {User} = require('../models/user')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Joi = require('joi')
const bcrypt = require('bcrypt')

router.post('/', async(req, res) => {
  const {error} = validateLogin(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).send('Invalid Username or Password!')

  userValidPassword = await bcrypt.compare(req.body.password, user.password)



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
