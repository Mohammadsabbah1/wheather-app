$(document).ready(function() {
  const airports = [
    { id: 'AMM', text: 'Jordan' },
    { id: 'LAX', text: 'Los Angeles, United States' },
    { id: 'JFK', text: 'New York, United States' },
    { id: 'LHR', text: 'London, United Kingdom' },
    { id: 'NRT', text: 'Tokyo, Japan' },
    { id: 'CDG', text: 'Paris, France' },
    { id: 'DXB', text: 'Dubai, United Arab Emirates' },
    { id: 'FRA', text: 'Frankfurt, Germany' },
    { id: 'HND', text: 'Tokyo, Japan' },
    { id: 'SYD', text: 'Sydney, Australia' },
    // Add more airports as needed
  ];

  // Show/hide return date input based on trip type
  $('input[name="trip-type"]').on('change', function() {
    if ($(this).val() === 'round-trip') {
      $('#return-date-container').show();
      $('#return-date').prop('required', true);
    } else {
      $('#return-date-container').hide();
      $('#return-date').prop('required', false);
    }
  });

  // Suggestion logic for origin and destination
  function suggestAirports(inputId, suggestionsContainerId) {
    $(inputId).on('input', function() {
      const query = $(this).val().toLowerCase();
      const suggestions = airports.filter(airport => airport.text.toLowerCase().includes(query));
      const suggestionsList = suggestions.map(suggestion => `<li class="p-2 cursor-pointer hover:bg-gray-200" data-id="${suggestion.id}">${suggestion.text}</li>`).join('');
      $(suggestionsContainerId).html(suggestionsList).show();
    });

    $(document).on('click', `${suggestionsContainerId} li`, function() {
      const selectedText = $(this).text();
      const selectedId = $(this).data('id');
      $(inputId).val(`${selectedId} - ${selectedText}`);
      $(suggestionsContainerId).hide();
    });
  }

  suggestAirports('#origin', '#origin-suggestions');
  suggestAirports('#destination', '#destination-suggestions');

  // Hide suggestions when clicking outside
  $(document).on('click', function(event) {
    if (!$(event.target).closest('#origin, #destination, #origin-suggestions, #destination-suggestions').length) {
      $('#origin-suggestions, #destination-suggestions').hide();
    }
  });

  // Form submission event handler
  $('#travel-form').on('submit', async function(event) {
    event.preventDefault();

    const location = $('#location').val();
    const departDate = $('#depart-date').val();
    const returnDate = $('#return-date').val();
    const origin = $('#origin').val().split(' - ')[0];
    const destination = $('#destination').val().split(' - ')[0];
    const tripType = $('input[name="trip-type"]:checked').val();

    const loadingIndicator = $('#loading');
    loadingIndicator.show();

    try {
      // Fetch coordinates
      const coordinatesRes = await fetch('/coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      });
      if (!coordinatesRes.ok) throw new Error('Failed to fetch coordinates');
      const coordinates = await coordinatesRes.json();
      console.log('Coordinates:', coordinates);

      // Fetch weather
      const weatherRes = await fetch('/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: coordinates.lat, lng: coordinates.lng, date: departDate })
      });
      if (!weatherRes.ok) throw new Error('Failed to fetch weather');
      const weather = await weatherRes.json();
      console.log('Weather Response:', weather);

      // Ensure weather data is correctly parsed
      const weatherDescription = weather.data[0]?.weather?.description || 'No weather data available';

      // Fetch image
      const imageRes = await fetch('/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      });
      if (!imageRes.ok) throw new Error('Failed to fetch image');
      const imageData = await imageRes.json();
      const imageUrl = imageData.imageUrl;
      console.log('Image URL:', imageUrl);

      // Fetch flights
      const flightsRes = await fetch('/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, departDate, returnDate, tripType })
      });
      if (!flightsRes.ok) throw new Error('Failed to fetch flights');
      const flightsData = await flightsRes.json();
      console.log('Flights Data:', flightsData);

      // Filter flights to match the specified origin and destination
      const filteredFlights = flightsData.data.filter(flight => {
        const segment = flight.itineraries[0].segments[0];
        return segment.departure.iataCode === origin && segment.arrival.iataCode === destination;
      });

      // Format date for the booking URL
      const formattedDate = new Date(departDate).toISOString().split('T')[0];

      // Display trip info
      const tripInfoDiv = $('#trip-info');
      tripInfoDiv.html(`
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-800">Weather</h2>
          <p>${weatherDescription}</p>
        </div>
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-800">Image</h2>
          <img src="${imageUrl}" alt="${location}" class="w-full rounded-md shadow-md">
        </div>
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-800">Flights</h2>
          <div class="space-y-4">
            ${filteredFlights.map(flight => {
              const segment = flight.itineraries[0].segments[0];
              const airlineCode = segment.carrierCode;
              const airlineName = flight.validatingAirlineCodes[0];
              const bookingUrl = `https://www.kayak.com/flights/${segment.departure.iataCode}-${segment.arrival.iataCode}/${formattedDate}`;
              const airlineLogoUrl = `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${airlineCode}.svg`; // Replace with the correct Duffel logo URL structure
              return `
                <div class="p-4 border rounded-md shadow-md">
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="text-lg font-semibold">${segment.departure.iataCode} to ${segment.arrival.iataCode}</h3>
                      <p class="text-gray-600">${segment.departure.at} - ${segment.arrival.at}</p>
                      <p class="text-gray-600">Airline: ${airlineName}</p>
                      <img src="${airlineLogoUrl}" alt="${airlineName} logo" class="h-6 mt-1">
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-bold text-indigo-600">$${flight.price.total}</p>
                      <a href="${bookingUrl}" target="_blank" class="mt-2 bg-green-500 text-white py-1 px-2 rounded-md">Book</a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      loadingIndicator.hide();
    }
  });
});
