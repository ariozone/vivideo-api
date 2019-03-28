const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token")
  if (!token)
    return res
      .status(401)
      .send("User is not authorized to access! No token provided.")
}
