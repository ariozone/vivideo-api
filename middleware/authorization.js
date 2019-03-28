const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token")
}
