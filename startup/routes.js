module.exports = function() {
  app.use(express.json())
  app.use("/api/genres", genres)
  app.use("/api/customers", customers)
  app.use("/api/movies", movies)
  app.use("/api/rentals", rentals)
  app.use("/api/users", users)
  app.use("/api/logins", logins)
  app.use(error)
}
