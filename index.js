import express from 'express';
const rootRouter = require('./src/routes/index.js');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/', rootRouter);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong internally'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
