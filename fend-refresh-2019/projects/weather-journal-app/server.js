const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors'); // Import CORS middleware

const app = express();
const port = 3000;

// Middleware setup
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use CORS middleware with specific origin
app.use(cors({
    origin: 'http://127.0.0.1:5501', // Replace with your actual client-side origin
    methods: ['GET', 'POST'], // Allow only GET and POST requests
    allowedHeaders: ['Content-Type'] // Allow only Content-Type header
}));

const apiKey = 'a8daa1ff3608ccdb0b375dd09bc04362';

// POST route for fetching weather data
app.post('/fetchWeather', async (req, res) => {
    const { zipCode } = req.body;

    if (!zipCode) {
        return res.status(400).json({ error: 'ZIP code is required' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const { temp: temperature, humidity } = response.data.main;
            const { speed: windSpeed } = response.data.wind;

            res.json({ temperature, humidity, windSpeed });
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data from external API' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
