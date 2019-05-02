const { User } = require("../models/user")
const { Rental } = require("../models/rental")
const { Movie } = require("../models/movie")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const auth = require("../middleware/authorization")
const moment = require("moment")

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.sendStatus(400).send("Customer Id not provided.")
  if (!req.body.movieId)
    return res.sendStatus(400).send("Movie Id is not valid.")

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId
  })

  if (!rental)
    return res.sendStatus(404).send("No rental exist for this customer/movie.")

  if (rental.dateBack)
    return res.sendStatus(400).send("Return already processed!")

  rental.dateBack = new Date()
  const daysInRent = moment().diff(rental.dateOut, "days")
  rental.rentalFee = daysInRent * rental.movie.dailyRentalRate
  await rental.save()

  const movie = await Movie.findById(rental.movie._id)
  movie.numberInStock += 1
  await movie.save()

  return res.send(rental)
})

module.exports = router
