const { User } = require("../models/user")
const express = require("express")
const router = express.Router()
const Joi = require("joi")
const bcrypt = require("bcrypt")
const auth = require("../middleware/authorization")

// This is log-in; We log out users by deleting token on client's side.
router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("Invalid Username or Password!")

  // comparing plain text password with hashed password
  userValidPassword = await bcrypt.compare(req.body.password, user.password)
  if (!userValidPassword)
    return res.status(400).send("Invalid Username or Password!")

  const token = user.generateToken()
  res.send(token)
})

function validateLogin(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  }
  return Joi.validate(req, schema)
}
module.exports = router
