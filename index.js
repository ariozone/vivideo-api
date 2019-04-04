const express = require("express")
require("express-async-errors")
const winston = require("winston")
require("winston-mongodb")
const config = require("config")
const genres = require("./routes/genres")
const customers = require("./routes/customers")
const movies = require("./routes/movies")
const rentals = require("./routes/rentals")
const users = require("./routes/users")
const logins = require("./routes/logins")
const mongoose = require("mongoose")
const app = express()
const error = require("./middleware/error")
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaught-exceptions.log" })
)

process.on("unhandledRejection", ex => {
  console.log("UNHANDLED REJECTION!")
  winston.error(ex.message, ex)
  process.exit(1)
})

winston.add(winston.transports.File, { filename: "logs.log" })
winston.add(winston.transports.MongoDB, {
  db: "mongodb://localhost/vivideo",
  level: "error"
})

throw new Error("UNCAUGHT EXCEPTION!")

// Creating a rejected promise to test unhandled rejections.
// const rejectedPromise = Promise.reject(new Error("FAILED!"))
// rejectedPromise.then(() => console.log("DONE!"))

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined.")
  process.exit(1)
}

mongoose
  .connect("mongodb://localhost/vivideo", {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(error => console.error("Could not connect to MongoDB...", error))

// Middlewares
app.use(express.json())
app.use("/api/genres", genres)
app.use("/api/customers", customers)
app.use("/api/movies", movies)
app.use("/api/rentals", rentals)
app.use("/api/users", users)
app.use("/api/logins", logins)
app.use(error)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
