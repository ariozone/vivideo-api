const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 50
  }
})
