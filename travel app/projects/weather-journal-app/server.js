const axios = require('axios'); // Add this line to import axios
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const getCoordinates = require('./geonames');
const getWeather = require('./weatherbit');
const getImage = require('./pixabay');
const getFlights = require('./amadeus');  // Import the Amadeus module
require('dotenv').config();

const app = express();
//	
const AVWX_API_KEY = 'LiskEOzRklnn2S-toqwGArxvaIF9wg4MhwrGPR_be5Y';

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/coordinates', async (req, res) => {
  const { location } = req.body;
  try {
    const coordinates = await getCoordinates(location);
    res.json(coordinates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get coordinates' });
  }
});

app.post('/weather', async (req, res) => {
  const { lat, lng, date } = req.body;
  try {
    const weather = await getWeather(lat, lng, date);
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get weather data' });
  }
});

app.post('/image', async (req, res) => {
  const { location } = req.body;
  try {
    const imageUrl = await getImage(location);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get image' });
  }
});

app.post('/flights', async (req, res) => {
  const { origin, destination, departDate, returnDate } = req.body;

  try {
    const flightsData = await getFlights(origin, destination, departDate, returnDate);
    res.json(flightsData);
  } catch (error) {
    console.error('Error getting flight data:', error.message);
    res.status(500).json({ error: 'Error getting flight data', details: error.message });
  }
});

app.get('/airports', (req, res) => {
  res.sendFile(path.join(__dirname, 'airports.json'));
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
