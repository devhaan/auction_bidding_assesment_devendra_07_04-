const express = require('express');
const bidController = require('../controller/bid');
const validateBid = require('../validations/bid');

const router = express.Router();

router.post('/', validateBid, bidController.createBid);

module.exports = router;