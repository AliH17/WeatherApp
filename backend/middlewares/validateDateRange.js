const { body } = require('express-validator');

module.exports = [
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  body().custom(({ startDate, endDate }) => {
    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('startDate must be ≤ endDate');
    }
    return true;
  })
];
