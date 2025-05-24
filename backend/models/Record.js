const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  lat:          { type: Number, required: true },
  lon:          { type: Number, required: true },
  startDate:    { type: Date,   required: true },
  endDate:      { type: Date,   required: true },
  weatherData:  { type: Array,  required: true },
  notes:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Record', RecordSchema);
