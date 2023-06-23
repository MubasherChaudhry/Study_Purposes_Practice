const mongoose = require('mongoose');

reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, `review can't be empty`],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'tour',
      required: [true, `Review must belong to a tour.`],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, `Review must be belong to user`],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;