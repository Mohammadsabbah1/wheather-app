document.addEventListener("DOMContentLoaded", () => {
    const generateButton = document.getElementById('generate');
    const zipInput = document.getElementById('zip');
    const feelingsInput = document.getElementById('feelings');
    const dateElement = document.getElementById('date');
    const tempElement = document.getElementById('temp');
    const contentElement = document.getElementById('content');

    generateButton.addEventListener('click', async () => {
        const zipCode = zipInput.value;
        const feelings = feelingsInput.value;

        if (!zipCode) {
            alert('Please enter a ZIP code.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/fetchWeather', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ zipCode })
            });

            if (!response.ok) {
                return res.status(404).json({ error: 'Location not found' });
            }
            const data = await response.json();
            const temperature = data.temperature;
            const date = new Date().toLocaleDateString();
            dateElement.innerHTML = `Date: ${date}`;
            tempElement.innerHTML = `Temperature: ${temperature}°C`;
            contentElement.innerHTML = `Feelings: ${feelings}`;
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    });
});
