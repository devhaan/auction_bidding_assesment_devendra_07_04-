const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    auction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: true,
      index: true
    },
    user_id: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

bidSchema.index({ auction_id: 1, createdAt: -1 });

module.exports = mongoose.model('Bid', bidSchema);