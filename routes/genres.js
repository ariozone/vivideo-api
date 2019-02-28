const express = require('express')

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
  { id: 3, name: "Thriller" }
]

app.get("/api/genres", (req, res) => {
  // to read query string parameters(for example: ?sortBy=name)
  // const sortBy = req.query.sortBy
  res.send(genres)
})

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  !genre
  ? res.status(404).send("Genre with the given ID does not exist.")
  : res.send(genre.name)
})

app.post("/api/genres", (req, res) => {

  const {error} = validateGenre(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres.push(genre)
  res.send(genre)
})

app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send("Genre with the given ID does not exist.")

  const {error} = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  genre.name = req.body.name
  res.send(genre)

})

app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id))

  if(!genre) return res.status(404).send("Genre with the given ID does not exist.")
  const index = genres.indexOf(genre)
  genres.splice(index, 1)
  res.send(genre)
})


function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(genre, schema)
}
