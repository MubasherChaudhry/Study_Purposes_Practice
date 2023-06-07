const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour Must Have a name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour Must Have a Duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour Must Have a Group Size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour Must Have a Difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,

  summary: {
    type: String,
    trim: true,
    required: [true, 'A Tour Must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A Tour must have a cover Image'],
  },
  images: [String], 
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
