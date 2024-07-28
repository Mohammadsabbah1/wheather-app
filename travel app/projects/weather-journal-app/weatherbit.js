const axios = require('axios');

const getWeather = async (lat, lng, date) => {
  const apiKey = 'cdb4bcdccffe4e19ae272a683e21ab20'; // Replace with your Weatherbit API key
  const currentUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${apiKey}`;
  const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${apiKey}`;
  const now = new Date();
  const tripDate = new Date(date);
  const diffTime = Math.abs(tripDate - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const url = diffDays <= 7 ? currentUrl : forecastUrl;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting weather data:', error);
    throw error;
  }
};

module.exports = getWeather;
