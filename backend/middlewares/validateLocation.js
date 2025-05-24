const { body } = require('express-validator');

module.exports = [
  body('locationName')
    .trim()
    .notEmpty()
    .withMessage('locationName is required')
];
