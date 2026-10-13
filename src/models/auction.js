const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      required: true
    },
    startsAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    endsAt: {
      type: Date,
      required: true
    },
    currentTopBid: {
      type: Number,
      default: 0,
      min: 0,
      required: true
    },
    currentTopBidder: {
      type: String,
      default: null
    },
    currentTopBidAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Auction', auctionSchema);