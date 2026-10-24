const mongoose = require('mongoose');

const listItemSchema = new mongoose.Schema(
  {
    // Key format: "anime:Title" or "drama:Title" (e.g., "anime:Steins;Gate")
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    mediaType: {
      type: String,
      enum: ['anime', 'drama'],
      required: true,
    },
    // 'w' = Watched, 't' = To-Watch
    status: {
      type: String,
      enum: ['w', 't'],
      required: true,
    },
    // Rating given by user (1 to 10)
    rating: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },
    // Priority: 0 = High, 1 = Med, 2 = Low
    priority: {
      type: Number,
      enum: [0, 1, 2],
      default: 1,
    },
    watchedDate: {
      type: String,
      default: null,
    },
    // Cached metadata snapshot for offline / fast listing
    titleSnapshot: {
      title: { type: String, required: true },
      year: { type: Number },
      score: { type: Number },
      episodes: { type: Number },
      genre: { type: String },
      synopsis: { type: String },
      studioOrNetwork: { type: String },
      hue: [{ type: Number }], // Color gradient hues from prototype [h1, h2]
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ListItem', listItemSchema);