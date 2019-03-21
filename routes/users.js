const { User, validate, validatePassword } = require("../models/user")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require("express")
const router = express.Router()


router.post("/", async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  const result = validatePassword(req.body.password)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send("User is already registered!")


  const salt = await bcrypt.genSalt(10)


  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  user.password = await bcrypt.hash(user.password, salt)

  await user.save()
  res.send(_.pick(user, ['_id','name', 'email']))
})

module.exports = router
