const express = require('express')
const errorMiddleware = require('./middleware/error')
const cookieParser = require('cookie-parser')

const app = express();

app.use(express.json());
app.use(cookieParser());

// Route imports
const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
app.use('/api/v1',productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);


// Middleware for errors

app.use(errorMiddleware);

module.exports = app;