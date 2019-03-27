const {User} = require('../models/user')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')

router.post('/', async(req, res) => {
  const {error} = validateLogin(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).send('Invalid Username!')

  userValidPassword = await bcrypt.compare(req.body.password, user.password)
  if (!userValidPassword) return res.status(400).send('Invalid Password!')

  const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'))
  res.send(token)

})

function validateLogin(login){
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(6).max(255).required()
  }
  return Joi.validate(login, schema)

}
module.exports = router
