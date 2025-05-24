// backend/routes/export.js

const express = require('express');
const { Parser: Json2CsvParser } = require('json2csv');
const jsontoxml = require('jsontoxml');
const Record = require('../models/Record');      // ← use the mongoose model

const router = express.Router();

// GET /records/export?format=(json|csv|md|xml)
router.get('/', async (req, res, next) => {
    // … inside router.get('/', async (req, res, next) => { …
console.log('EXPORT ROUTE CALLED, format=', req.query.format);

  try {
    // 1) Fetch all records directly
    const records = await Record.find().sort({ createdAt: -1 });

    // 2) Export logic unchanged...
    const format = (req.query.format || 'json').toLowerCase();
    switch (format) {
      case 'csv': {
        const fields = [
          '_id', 'locationName', 'lat', 'lon',
          'startDate', 'endDate', 'weatherData.length', 'notes'
        ];
        const parser = new Json2CsvParser({ fields });
        const csv = parser.parse(
          records.map(r => ({
            _id: r._id,
            locationName:   r.locationName,
            lat:            r.lat,
            lon:            r.lon,
            startDate:      r.startDate,
            endDate:        r.endDate,
            'weatherData.length': r.weatherData.length,
            notes:          r.notes
          }))
        );
        res.header('Content-Type', 'text/csv');
        res.attachment('records.csv');
        return res.send(csv);
      }

      case 'md': {
        const header = [
          'ID','Location','Lat','Lon',
          'Start','End','Entries','Notes'
        ];
        const rows = records.map(r => [
          r._id,
          r.locationName,
          r.lat,
          r.lon,
          r.startDate,
          r.endDate,
          r.weatherData.length,
          r.notes.replace(/\r?\n/g, ' ')
        ]);
        const table = [
          `| ${header.join(' | ')} |`,
          `| ${header.map(()=>'---').join(' | ')} |`,
          ...rows.map(cols => `| ${cols.join(' | ')} |`)
        ].join('\n');
        res.header('Content-Type', 'text/markdown');
        res.attachment('records.md');
        return res.send(table);
      }

      case 'xml': {
        const xml = jsontoxml({ records });
        res.header('Content-Type', 'application/xml');
        res.attachment('records.xml');
        return res.send(xml);
      }

      case 'json':
      default: {
        res.header('Content-Type', 'application/json');
        res.attachment('records.json');
        return res.send(JSON.stringify(records, null, 2));
      }
    }
    


  } catch (err) {
    next(err);
  }
});

module.exports = router;
