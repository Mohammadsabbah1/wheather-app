document.getElementById('travel-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
  
    try {
      const coordinatesResponse = await fetch('/coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });
      const { lat, lng } = await coordinatesResponse.json();
  
      const weatherResponse = await fetch('/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, date }),
      });
      const weather = await weatherResponse.json();
  
      const imageResponse = await fetch('/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });
      const { imageUrl } = await imageResponse.json();
  
      document.getElementById('trip-info').innerHTML = `
        <h2 class="text-xl font-semibold">Trip to ${location}</h2>
        <p class="text-gray-700">Weather: ${weather.data[0].weather.description}</p>
        <p class="text-gray-700">Temperature: ${weather.data[0].temp}°C</p>
        <img src="${imageUrl}" alt="${location}" class="mt-4 rounded-md shadow-md">
      `;
    } catch (error) {
      console.error('Error fetching trip info:', error);
    }
  });
  