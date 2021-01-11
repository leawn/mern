const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places');
const usersRoutes = require('./routes/users');
const HttpError = require('./models/http-error');

const MONGODB_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}localhost:27017/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    return next(error);
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred'});
});

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(3002);
    })
    .catch(err => {
        console.log(err);
    });