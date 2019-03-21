const mongoose = require("mongoose")
const Joi = require('joi')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
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
    minlength: 5,
    maxlength: 1024 // To be able to hash the password later.
  }
})

const User = mongoose.model('User', userSchema)

function validateUser(user) {
  const schema = {
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required(). min(5).max(255).email(),
    password: Joi.string().required().min(5).max(255)
  }
  return Joi.validate(user, schema)

}

module.exports.validate = validateUser
module.exports.User = User
