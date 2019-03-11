const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const {Customer, validate} = require('../models/customer')
router.use(express.json())

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 })
  res.send(customers)
})

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  if (!customer)
    return res.status(404).send("Customer with given ID does not exist!")
  res.send(customer)
})

router.post("/", async (req, res) => {
  const {error} = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  let customer = new Customer(
    {
      name: req.body.name,
      contact: req.body.contact,
      isPrime: req.body.isPrime
    }
  )
  customer = await customer.save()
  res.send(customer)
})

router.put("/:id", async (req, res) => {
  const {error} = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    contact: req.body.contact,
    isPrime: req.body.isPrime
  },
  { new: true })
  if(!customer) return res.status(404).send('Customer with given ID does not exist!')
  res.send(customer)
})

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id)
  if (!customer)
    return res.status(404).send("Customer with given ID does not exist!")
  res.send(customer)
})

function validate(customer) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(25)
      .required(),
    contact: Joi.string()
      .min(5)
      .max(100)
      .required(),
    isPrime: Joi.boolean()
  }
  return Joi.validate(customer, schema)
}

module.exports = router
