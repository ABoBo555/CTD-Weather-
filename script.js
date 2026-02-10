// Default loc: NY
const DEFAULT_LOCATION = {
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    country: 'United States',
    timezone: 'America/New_York'
};

// Get current location from localStorage or use default
function getCurrentLocation() {
    const stored = localStorage.getItem('weatherLocation');
    if (stored) {
        return JSON.parse(stored);
    }
    return DEFAULT_LOCATION;
}

// Save location to localStorage
function saveLocation(location) {
    localStorage.setItem('weatherLocation', JSON.stringify(location));
}

// Weather code descriptions
const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
};


 // Search for a location using Open-Meteo Geocoding API
 
async function searchLocation() {
    const searchInput = document.getElementById('location-search');
    const searchResults = document.getElementById('search-results');
    const query = searchInput.value.trim();

    if (!query) {
        alert('Please enter a city name');
        return;
    }

    try {
        searchResults.innerHTML = '<div class="loading-small">Searching...</div>';
        searchResults.classList.remove('hidden');

        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No locations found. Try another city.</div>';
            return;
        }

        searchResults.innerHTML = '';
        data.results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <strong>${result.name}</strong>, ${result.country}
                ${result.admin1 ? `<br><small>${result.admin1}</small>` : ''}
            `;
            resultItem.onclick = () => selectLocation(result);
            searchResults.appendChild(resultItem);
        });

    } catch (error) {
        console.error('Error searching location:', error);
        searchResults.innerHTML = '<div class="error-small">Search failed. Please try again.</div>';
    }
}


// Select location from search bar
 
function selectLocation(result) {
    const location = {
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        timezone: result.timezone || 'auto'
    };

    saveLocation(location);

    document.getElementById('current-location').textContent = `${location.name}, ${location.country}`;
    document.getElementById('location-search').value = '';
    document.getElementById('search-results').classList.add('hidden');

    // Reload data
    if (typeof fetchCurrentWeather === 'function') {
        fetchCurrentWeather();
    } else if (typeof fetch7DayForecast === 'function') {
        fetch7DayForecast();
    }
}


//Initialize location display on page load
 
function initializeLocation() {
    const location = getCurrentLocation();
    const locationEl = document.getElementById('current-location');
    if (locationEl) {
        locationEl.textContent = `${location.name}, ${location.country}`;
    }
}


//Fetch current weather data from Open-Meteo API
 
async function fetchCurrentWeather() {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('weather-content');
    const errorEl = document.getElementById('error');

    try {
        loadingEl.classList.remove('hidden');
        contentEl.classList.add('hidden');
        errorEl.classList.add('hidden');

        const location = getCurrentLocation();

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&timezone=${encodeURIComponent(location.timezone || 'auto')}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const currentWeather = data.current_weather;

        // Update DOM with weather data
        document.getElementById('temperature').textContent = `${currentWeather.temperature}°C`;
        document.getElementById('windspeed').textContent = `${currentWeather.windspeed} km/h`;
        document.getElementById('conditions').textContent = weatherCodes[currentWeather.weathercode] || 'Unknown';
        document.getElementById('time').textContent = formatDateTime(currentWeather.time);
        
        // Display timezone if available
        if (data.timezone) {
            document.getElementById('timezone').textContent = data.timezone;
        }

        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');

    } catch (error) {
        console.error('Error fetching current weather:', error);
        
        loadingEl.classList.add('hidden');
        errorEl.textContent = `Failed to load weather data. ${error.message}`;
        errorEl.classList.remove('hidden');
    }
}


 // Fetch 7-day forecast data from Open-Meteo API
 
async function fetch7DayForecast() {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('forecast-content');
    const errorEl = document.getElementById('error');

    try {
        loadingEl.classList.remove('hidden');
        contentEl.classList.add('hidden');
        errorEl.classList.add('hidden');

        const location = getCurrentLocation();

        // API endpoint for 7-day forecast with timezone
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=${encodeURIComponent(location.timezone || 'auto')}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const daily = data.daily;

        contentEl.innerHTML = '';

        // Create forecast items for each day
        for (let i = 0; i < daily.time.length; i++) {
            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';

            const date = document.createElement('div');
            date.className = 'date';
            date.textContent = formatDate(daily.time[i]);

            const tempMax = document.createElement('div');
            tempMax.className = 'temp-max';
            tempMax.textContent = `High: ${daily.temperature_2m_max[i]}°C`;

            const tempMin = document.createElement('div');
            tempMin.className = 'temp-min';
            tempMin.textContent = `Low: ${daily.temperature_2m_min[i]}°C`;

            forecastDay.appendChild(date);
            forecastDay.appendChild(tempMax);
            forecastDay.appendChild(tempMin);

            contentEl.appendChild(forecastDay);
        }

        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');

    } catch (error) {
        console.error('Error fetching forecast:', error);
        
        loadingEl.classList.add('hidden');
        errorEl.textContent = `Failed to load forecast data. ${error.message}`;
        errorEl.classList.remove('hidden');
    }
}


function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


function formatDateTime(isoDateTime) {
    const date = new Date(isoDateTime);
    const options = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-US', options);
}
