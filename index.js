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

  const result = validateGenre(req.body)
  if(result.error) return res.status(400).send(result.error.details[0].message)
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres.push(genre)
  res.send(genre)
})

app.put('/api/genres/:id', (req, res) => {

  let result = ""
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  !genre
  ? res.status(404).send("Genre with the given ID does not exist.")
  : result = validateGenre(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  genre.name = req.body.name
  res.send(genre)

})

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(genre, schema)
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
