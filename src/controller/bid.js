const bidService = require('../services/bid');

const createBid = async (req, res) => {
  try {
    const result = await bidService.placeBid(req.body);

    return res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: {
        bid: result.bid,
        currentTopBid: result.auction.currentTopBid,
        currentTopBidder: result.auction.currentTopBidder,
        currentTopBidAt: result.auction.currentTopBidAt
      }
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createBid
};