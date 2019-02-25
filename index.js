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
  res.send(req.params.id)
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
