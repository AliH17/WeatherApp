const axios = require('axios');
const { OPENWEATHER_KEY } = process.env;

exports.fetchRangeForecast = async (lat, lon, start, end) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;
  const { data } = await axios.get(url);
  const startMs = new Date(start).setHours(0,0,0,0);
  const endMs   = new Date(end).setHours(23,59,59,999);
  return data.list.filter(item => {
    const t = new Date(item.dt_txt).getTime();
    return t >= startMs && t <= endMs;
  });
};
