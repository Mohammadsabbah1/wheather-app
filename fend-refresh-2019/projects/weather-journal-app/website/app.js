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
                throw new Error('Error fetching weather data');
            }

            const data = await response.json();
            const temperature = data.temperature;
            const date = new Date().toLocaleDateString();

            // Update UI with weather data and user feelings
            dateElement.innerHTML = `Date: ${date}`;
            tempElement.innerHTML = `Temperature: ${temperature}°C`;
            contentElement.innerHTML = `Feelings: ${feelings}`;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('An error occurred while fetching weather data. Please try again later.');
        }
    });
});
