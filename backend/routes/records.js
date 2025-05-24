// backend/routes/records.js

const express             = require('express');
const { body, validationResult } = require('express-validator');
const rc                  = require('../controllers/recordController');
const validateDateRange   = require('../middlewares/validateDateRange');
const validateLocation    = require('../middlewares/validateLocation');
const exportRouter        = require('./export');      // <— import the export router

const router = express.Router();

// Handle query validation errors
const handleValidation = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(400).json({ errors: errs.array() });
  }
  next();
};

// 1) Mount export route first so "/records/export" is handled here
router.use('/export', exportRouter);

// 2) CRUD routes
router.post(
  '/',
  [
    body('locationName').notEmpty(),
    body('lat').isFloat(),
    body('lon').isFloat(),
    validateDateRange,
    validateLocation
  ],
  handleValidation,
  rc.createRecord
);

router.get('/',       rc.getAllRecords);
router.get('/:id',    rc.getRecordById);
router.put('/:id',    rc.updateRecord);
router.delete('/:id', rc.deleteRecord);

module.exports = router;
