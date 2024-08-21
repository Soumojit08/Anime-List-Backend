const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Planning', 'Watched'],
    required: true
  }
});

module.exports = mongoose.model('Anime', animeSchema);
