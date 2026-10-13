const express = require('express');
const bidRoutes = require('./bid');

const router = express.Router();

router.use('/bid', bidRoutes);

module.exports = router;