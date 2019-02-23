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

app.listen(3000, () => console.log(`Listening on port 3000...`))
