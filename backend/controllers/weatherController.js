const axios = require('axios');
const { OPENWEATHER_KEY } = process.env;

exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) { next(err); }
};

exports.getForecast = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;
    const { data } = await axios.get(url);
    res.json(data.list);
  } catch (err) { next(err); }
};
