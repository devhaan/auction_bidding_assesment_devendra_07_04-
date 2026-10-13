require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();