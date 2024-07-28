const express = require('express');
const app = express();
const path = require('path');
const getCoordinates = require('./geonames');
const getWeather = require('./weatherbit');
const getImage = require('./pixabay');

app.use(express.static('public'));
app.use(express.json());

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
