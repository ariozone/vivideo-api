const { User } = require("../models/user")
const { Rental } = require("../models/rental")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const auth = require("../middleware/authorization")

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("Customer Id not provided.")
  if (!req.body.movieId) return res.status(400).send("Movie Id is not valid.")

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId
  })
  if (!rental)
    return res.status(404).send("No rental exist for this customer/movie.")
  if (rental.dateBack) return res.status(400).send("Return already processed!")
  rental.dateBack = new Date()
  await rental.save()
  return res.status(200).send(rental.dateBack)
})

module.exports = router
