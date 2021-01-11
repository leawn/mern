const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = '';

const getCoordsForAddress = async (address) => {
    /*return {
        lat: 40.7484474,
        lng: -73.9871516
    };*/
    const response = await axios.get(`${encodeURIComponent(address)}${API_KEY}`);

    const data = response.data;

    if (!data || data.status === 'ZERO_RESULTS') {
        throw new HttpError('Could not find location for the specified address', 422);
    }

    return data.results[0].geometry.location
}

module.exports = getCoordsForAddress;