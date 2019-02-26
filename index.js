const express = require("express")
const Joi = require('joi')
const app = express()
app.use(express.json())


const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
  { id: 3, name: "Thriller" }
]

app.get("/api/genres", (req, res) => {
  res.send(genres)
})

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  !genre
  ? res.status(404).send("Genre with the given ID does not exist.")
  : res.send(genre.name)
})

app.post("/api/genres", (req, res) => {
  const schema = {
    name: Joi.string().min(3).required()
  }
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres.push(genre)
  res.send(genre)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
