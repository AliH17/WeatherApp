const express = require('express');
const { query, validationResult } = require('express-validator');
const wc = require('../controllers/weatherController');
const router = express.Router();

const validate = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
  next();
};

router.get('/current',
  [ query('lat').isFloat(), query('lon').isFloat() ], validate,
  wc.getCurrentWeather
);

router.get('/forecast',
  [ query('lat').isFloat(), query('lon').isFloat() ], validate,
  wc.getForecast
);

module.exports = router;
