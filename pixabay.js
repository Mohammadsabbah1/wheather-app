const axios = require('axios');

const getImage = async (location) => {
  const apiKey = 'YOUR_PIXABAY_API_KEY'; // Replace with your Pixabay API key
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(location)}&image_type=photo`;
  try {
    const response = await axios.get(url);
    return response.data.hits[0].webformatURL;
  } catch (error) {
    console.error('Error getting image:', error);
    throw error;
  }
};

module.exports = getImage;
