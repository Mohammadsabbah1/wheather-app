const axios = require('axios');

const getAmadeusAccessToken = async () => {
  const apiKey = process.env.AMADEUS_API_KEY;
  const apiSecret = process.env.AMADEUS_API_SECRET;
  const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';

  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', apiKey);
  data.append('client_secret', apiSecret);

  try {
    const response = await axios.post(url, data.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Amadeus access token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const getFlights = async (origin, destination, departureDate, returnDate) => {
  const accessToken = await getAmadeusAccessToken();
  let url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1`;

  if (returnDate) {
    url += `&returnDate=${returnDate}`;
  }

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting flight data:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = getFlights;
