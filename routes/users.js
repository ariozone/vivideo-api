const { User, validate, validatePassword } = require("../models/user")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const auth = require("../middleware/authorization")

// Getting the current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password")
  res.send(user)
})

router.get("/", async (req, res) => {
  const users = await User.find().sort("name")
  res.send(users)
})

router.post("/", async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send("User is already registered!")

  const result = validatePassword(req.body.password)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  })

  const salt = await bcrypt.genSalt(10)
  // assigning a hashed password to user
  user.password = await bcrypt.hash(user.password, salt)

  await user.save()

  const token = user.generateToken()
  // Sending header along with body of the response.
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]))
})

module.exports = router
