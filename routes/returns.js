const { User } = require("../models/user")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

router.post("/", async (req, res) => {
  res.status(401).send("Not authorized")
})
module.exports = router
