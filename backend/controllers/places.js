const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Something went wrong, could not find place.', 500));
    }
    if (!place || place.length === 0) {
        return next(new HttpError('Could not find place for the provided id', 404));
    }
    res.json({ place: place.toObject({ getters: true }) });
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let user;
    try {
        user = await User.findById(userId).populate('places');
    } catch (err) {
        return next(new HttpError('Could not find place for the provided user id.', 500))
    }

    if (!user || user.length === 0) {
        return next(new HttpError('Could not find a place for the provided user id.', 404));
    }
    res.json({ places: user.places.map(p => p.toObject({ getters: true })) });
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed.', 422));
    }

    const { title, description, address, creator } = req.body;
    let location;
    try {
        location = await getCoordsForAddress(address);
    } catch (err) {
        return next(err);
    }
    const createdPlace = new Place({
        title,
        description,
        address,
        location,
        image: 'linktotheimage',
        creator
    });

    let user;

    try {
        user = await User.findById(creator);
    } catch (err) {
        return next(new HttpError('Creating place failed, try again.', 500))
    }

    if (!user) {
        return next(new HttpError('We could not find a user for provided id.', 404))
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction(); // here want to add more try/catch blocks to understand the problem if something goes wrong
    } catch (err) {
        console.log(err);
        return next(new HttpError('Creating place failed, please try again.', 500));
    }

    res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed.', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Could not find update place by the provided id.', 500));
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        return next(new HttpError('Could not save the updated place.', 500));
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        return next(new HttpError('Could not find a place by provided id.', 500));
    }

    if (!place) {
        return next(new HttpError('Could not find a place by provided id.', 404))
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess});
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new HttpError('Could not delete a place by provided id.', 500));
    }

    res.status(200).json({ message: 'Deleted place.'});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;