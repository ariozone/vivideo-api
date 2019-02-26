const express = require('express')
const app = express()

const genres = [
  {id: 1, name: 'Action'},
  {id: 2, name: 'Comedy'},
  {id: 3, name: 'Thriller'}
]
app.get('/api/genres', (req, res) => {
  res.send(genres)
})

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  !genre ? res.status(404).send('Genre with the given ID does not exist.') :
  res.send(genre.name)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
