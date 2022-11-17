const express = require('express')
const errorMiddleware = require('./middleware/error')

const app = express();

app.use(express.json());

// Route imports
const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoute');
app.use('/api/v1',productRoute);
app.use('/api/v1', userRoute);


// Middleware for errors

app.use(errorMiddleware);

module.exports = app;