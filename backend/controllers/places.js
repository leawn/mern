const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const { validate } = require('../util/validate');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
    {
        _id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most popular sights of the world',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];

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
        user = await Place.find({ creator: userId });
    } catch (err) {
        return next(new HttpError('Could not find place for the provided user id.', 500))
    }

    if (!user || user.length === 0) {
        return next(new HttpError('Could not find a place for the provided user id.', 404));
    }
    res.json({ user: user.map(p => p.toObject({ getters: true })) });
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
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

    try {
        await createdPlace.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Creating place failed, please try again.', 500));
    }

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
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
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Could not find a place by provided id.', 500));
    }

    try {
        await place.remove();
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