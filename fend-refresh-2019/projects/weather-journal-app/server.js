const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://127.0.0.1:5501', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
const apiKey = 'a8daa1ff3608ccdb0b375dd09bc04362';
let projectData = {};
app.post('/fetchWeather', async (req, res) => {
    const { zipCode } = req.body;
    if (!zipCode) {
        return res.status(400).json({ error: 'ZIP code is required' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            const { temp: temperature, humidity } = data.main;
            const { speed: windSpeed } = data.wind;

            projectData = { temperature, humidity, windSpeed }; // Save data to projectData

            res.json({ temperature, humidity, windSpeed });
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data from external API' });
    }
});


app.get('/all', (req, res) => {
    res.send(projectData);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
