const { Rental, validate } = require("../models/rental")
const { Movie } = require("../models/movie")
const { Customer } = require("../models/customer")
const auth = require("../middleware/authorization")
const mongoose = require("mongoose")
const Fawn = require("fawn")
const express = require("express")
const router = express.Router()

Fawn.init(mongoose)

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort({ dateOut: -1 })
  res.send(rentals)
})

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const customer = await Customer.findById(req.body.customerId)
  if (!customer) return res.status(400).send("Invalid Customer!")

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(400).send("Invalid Movie!")

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie is not in stock!")

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      contact: customer.contact
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  })
  try {
    const task = Fawn.Task()
    task
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run()
    res.send(rental)
  } catch (ex) {
    res.status(500).send("Could not complete the task!")
  }
})

module.exports = router
