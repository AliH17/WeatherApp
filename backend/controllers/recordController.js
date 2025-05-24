const Record = require('../models/Record');
const apiClient = require('../utils/apiClient');

exports.createRecord = async (req, res, next) => {
  try {
    const { locationName, lat, lon, startDate, endDate, notes } = req.body;
    const weatherData = await apiClient.fetchRangeForecast(lat, lon, startDate, endDate);
    const record = new Record({ locationName, lat, lon, startDate, endDate, weatherData, notes });
    await record.save();
    res.status(201).json(record);
  } catch (err) { next(err); }
};

exports.getAllRecords = async (_req, res, next) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) { next(err); }
};

exports.getRecordById = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found' });
    res.json(record);
  } catch (err) { next(err); }
};

exports.updateRecord = async (req, res, next) => {
  try {
    const updates = (({ endDate, notes }) => ({ endDate, notes }))(req.body);
    const record = await Record.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!record) return res.status(404).json({ error: 'Not found' });
    res.json(record);
  } catch (err) { next(err); }
};

exports.deleteRecord = async (req, res, next) => {
  try {
    const result = await Record.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
};
