const validateBid = (req, res, next) => {
  const { auction_id, user_id, amount } = req.body || {};

  if (!auction_id || !require('mongoose').isValidObjectId(auction_id)) {
    return res.status(400).json({
      success: false,
      message: 'A valid auction_id is required'
    });
  }

  if (typeof user_id !== 'string' || !user_id.trim()) {
    return res.status(400).json({
      success: false,
      message: 'A valid user_id is required'
    });
  }

  if (
    typeof amount !== 'number' ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a positive number'
    });
  }

  req.body.user_id = user_id.trim();

  next();
};

module.exports = validateBid;