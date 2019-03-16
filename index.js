const express = require("express")
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const mongoose = require('mongoose')
const app = express()

mongoose.connect('mongodb://localhost/vivideo', { useNewUrlParser: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(error => console.error('Could not connect to MongoDB...', error))

// Middlewares
app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
