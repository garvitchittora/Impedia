const {
    sign,
    verify
} = require('jsonwebtoken');
const {
    key
} = require('../strings');

module.exports = {
    key,
    sign,
    verify
};