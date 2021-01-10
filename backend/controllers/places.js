const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');

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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const places = DUMMY_PLACES.filter(p => {
        return p._id === placeId;
    });
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find place for the provided id', 404));
    }
    res.json({ places });
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_PLACES.find(u => {
        return u.creator === userId;
    });

    if (!user) {
        return next(new HttpError('Could not find a place for the provided user id.', 404));
    }
    res.json({ user });
}

const createPlace = (req, res, next) => {
    const { title, description, location, address, creator } = req.body;
    const createdPlace = {
        _id: uuid(),
        title,
        description,
        location,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({ place: createdPlace })
}

const updatePlace = (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatePlace = { ...DUMMY_PLACES.find(p => p._id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p._id === placeId);
    updatePlace.title = title;
    updatePlace.description = description;

    DUMMY_PLACES[placeIndex] = updatePlace;

    res.status(200).json({ place: updatePlace });
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p._id !== placeId);

    res.status(200).json({ message: 'Deleted place.'});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;