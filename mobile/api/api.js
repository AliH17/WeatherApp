// mobile/api/api.js
import axios from 'axios';

const WEATHERAPI_KEY = '97739c904c6b49a4b27105355252405';
const WEATHER_BASE   = 'http://api.weatherapi.com/v1';
const BACKEND_BASE   = 'http://192.168.0.127:4000'; // or your deployed backend

/**
 * Fetch current + 10-day forecast from WeatherAPI
 */
export async function getWeather(location) {
  const { data } = await axios.get(`${WEATHER_BASE}/forecast.json`, {
    params: {
      key:    WEATHERAPI_KEY,
      q:      location,
      days:   10,
      aqi:    'no',
      alerts: 'no',
    },
  });
  return data;
}

/**
 * Create a new record in Mongo via backend
 * Payload must include:
 *  - locationName: string
 *  - lat: number
 *  - lon: number
 *  - startDate: string (YYYY-MM-DD)
 *  - endDate: string (YYYY-MM-DD)
 *  - notes: string
 */
export function createRecord(record) {
  return axios
    .post(`${BACKEND_BASE}/records`, record)
    .then(res => res.data);
}

/**
 * Get all saved records
 */
export function getAllRecords() {
  return axios
    .get(`${BACKEND_BASE}/records`)
    .then(res => res.data);
}

/**
 * Get a single record by its Mongo ID
 */
export function getRecordById(id) {
  return axios
    .get(`${BACKEND_BASE}/records/${id}`)
    .then(res => res.data);
}

/**
 * Update a record's endDate and/or notes
 */
export function updateRecord(id, updates) {
  // updates = { endDate?: string, notes?: string }
  return axios
    .put(`${BACKEND_BASE}/records/${id}`, updates)
    .then(res => res.data);
}

/**
 * Delete a record by ID
 */
export function deleteRecord(id) {
  return axios
    .delete(`${BACKEND_BASE}/records/${id}`)
    .then(res => res.data);
}

export function getAdvice({ locationName, temp, description, lat, lon }) {
  return axios
    .post(`${BACKEND_BASE}/assistant`, {
      locationName, temp, description, lat, lon
    })
    .then(res => res.data.advice);
}