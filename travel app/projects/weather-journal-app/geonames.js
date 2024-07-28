const axios = require('axios');

const getCoordinates = async (location) => {
  const username = 'shathraghadwajeeh200'; // Replace with your Geonames username
  const url = `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${username}`;
  try {
    const response = await axios.get(url);
    const { lat, lng } = response.data.geonames[0];
    return { lat, lng };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
};

module.exports = getCoordinates;
