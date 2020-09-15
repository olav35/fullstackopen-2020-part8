const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 4,
    unique: true,
    required: true
  },
  favoriteGenre: {
    type: String,
    minlength: 4,
    required: true
  }
})

module.exports =  mongoose.model('User', schema)