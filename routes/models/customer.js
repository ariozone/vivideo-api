// Customer modelconst customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  contact: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  isPrime: {
    type: Boolean,
    default: false
  }
})

function validateCustomer(customer) {
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
