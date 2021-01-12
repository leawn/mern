const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places');
const usersRoutes = require('./routes/users');
const HttpError = require('./models/http-error');

const MONGODB_URI = `mongodb://localhost:27017/mern`;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type', 'Accept', 'Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'PATCH', 'DELETE');
    next();
});

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
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3002);
    })
    .catch(err => {
        console.log(err);
    });