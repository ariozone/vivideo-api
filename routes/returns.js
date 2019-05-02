const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)
const { Rental } = require("../models/rental")
const { Movie } = require("../models/movie")
const express = require("express")
const router = express.Router()
const auth = require("../middleware/authorization")

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.sendStatus(400).send(error.details[0].message)

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId
  })

  if (!rental)
    return res.sendStatus(404).send("No rental exist for this customer/movie.")

  if (rental.dateBack)
    return res.sendStatus(400).send("Return already processed!")

  await rental.save()

  const movie = await Movie.findById(rental.movie._id)
  movie.numberInStock += 1
  await movie.save()

  return res.send(rental)
})
const schema = {
  customerId: Joi.string().required(),
  movieId: Joi.required()
}
const validate = function(requestBody) {
  return Joi.validate(requestBody, schema)
}

module.exports = router
