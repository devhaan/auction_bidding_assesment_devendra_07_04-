const mongoose = require('mongoose');
const Auction = require('../models/auction');
const Bid = require('../models/bid');

const placeBid = async ({ auction_id, user_id, amount }) => {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const now = new Date();

      const auction = await Auction.findById(auction_id).session(session);

      if (!auction) {
        const error = new Error('Auction not found');
        error.statusCode = 404;
        throw error;
      }

      if (auction.status !== 'open' || auction.endsAt <= now) {
        const error = new Error('Auction is closed');
        error.statusCode = 409;
        throw error;
      }

      if (auction.startsAt > now) {
        const error = new Error('Auction has not started yet');
        error.statusCode = 409;
        throw error;
      }

      if (auction.currentTopBidder === user_id) {
        const error = new Error('You are already the highest bidder');
        error.statusCode = 409;
        throw error;
      }

      if (amount <= auction.currentTopBid) {
        const error = new Error(
          'Bid amount must be higher than the current top bid'
        );
        error.statusCode = 409;
        throw error;
      }

      const updatedAuction = await Auction.findOneAndUpdate(
        {
          _id: auction_id,
          status: 'open',
          startsAt: { $lte: now },
          endsAt: { $gt: now },
          currentTopBid: { $lt: amount },
          currentTopBidder: { $ne: user_id }
        },
        {
          $set: {
            currentTopBid: amount,
            currentTopBidder: user_id,
            currentTopBidAt: now
          }
        },
        {
          new: true,
          session
        }
      );

      if (!updatedAuction) {
        const error = new Error(
          'Bid rejected because the auction state has changed'
        );
        error.statusCode = 409;
        throw error;
      }

      const [bid] = await Bid.create(
        [
          {
            auction_id,
            user_id,
            amount
          }
        ],
        { session }
      );

      result = {
        bid,
        auction: updatedAuction
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  placeBid
};