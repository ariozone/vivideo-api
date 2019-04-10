const express = require("express")
require("express-async-errors")
const winston = require("winston")
require("winston-mongodb")
const config = require("config")
const mongoose = require("mongoose")
const app = express()
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)
require("./startup/routes")(app)

winston.handleExceptions(
  // does not work with rejected promises
  new winston.transports.File({ filename: "uncaught-exceptions.log" }),
  new winston.transports.Console({ prettyPrint: true, colorize: true })
)

process.on("unhandledRejection", ex => {
  throw ex // winston gets it, logs it and terminates the process.
})

winston.add(winston.transports.File, { filename: "logs.log" })
winston.add(winston.transports.MongoDB, {
  db: "mongodb://localhost/vivideo",
  level: "error"
})

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

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
