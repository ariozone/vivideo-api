const winston = require("winston")
require("winston-mongodb")
require("express-async-errors")

module.exports = function() {
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
    level: "info"
  })
}
