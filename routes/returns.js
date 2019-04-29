const { User } = require("../models/user")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

router.post("/", async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("Customer Id not provided.")
  if (!req.body.movieId) return res.status(400).send("Movie Id is not valid.")
  res.status(401).send("Not authorized")
})

module.exports = router
