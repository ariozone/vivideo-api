const { User, validate, validatePassword } = require("../models/user")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const config = require("config")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/authorization")

// Getting the current user
router.get("/me", auth, async (req, res) => {
  const user = User.findById(req.user._id).select("-password")
  res.send(user)
})

router.post("/", async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send("User is already registered!")
  const result = validatePassword(req.body.password)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  const salt = await bcrypt.genSalt(10)

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
  // assigning a hashed password to user
  user.password = await bcrypt.hash(user.password, salt)

  await user.save()

  const token = user.generateToken()
  // Sending header along with body of the response.
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]))
})

module.exports = router
