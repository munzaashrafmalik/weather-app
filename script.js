// ===== API Configuration =====
const API_KEY = '6229f6473df45e522ad61061a0a51c20'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// ===== DOM Elements =====
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const themeToggle = document.getElementById('themeToggle');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const weatherContent = document.getElementById('weatherContent');

// ===== State =====
let currentCity = 'London';

// ===== Event Listeners =====
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
locationBtn.addEventListener('click', handleGetCurrentLocation);
themeToggle.addEventListener('click', toggleTheme);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadWeather(currentCity);
});

// ===== Functions =====

async function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        currentCity = city;
        await loadWeather(city);
        cityInput.value = '';
    }
}

async function handleGetCurrentLocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const weatherData = await fetchWeatherByCoords(latitude, longitude);
                    currentCity = weatherData.name;
                    await loadAllWeatherData(currentCity);
                } catch (error) {
                    showError('Failed to get weather for your location.');
                }
            },
            () => {
                showError('Location access denied. Please search for a city.');
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

async function loadWeather(city) {
    showLoading();
    try {
        await loadAllWeatherData(city);
    } catch (error) {
        showError('City not found. Please try another search.');
    }
}

async function loadAllWeatherData(city) {
    try {
        const [weatherData, forecastData] = await Promise.all([
            fetchWeather(city),
            fetchForecast(city)
        ]);
        
        hideError();
        displayCurrentWeather(weatherData);
        displayHourlyForecast(forecastData);
        displayDailyForecast(forecastData);
        showWeatherContent();
        
    } catch (error) {
        console.error('Error loading weather data:', error);
        throw error;
    }
}

// ===== API Calls =====

async function fetchWeather(city) {
    const response = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
        throw new Error('City not found');
    }
    
    return await response.json();
}

async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch weather');
    }
    
    return await response.json();
}

async function fetchForecast(city) {
    const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
        throw new Error('Forecast not available');
    }
    
    return await response.json();
}

async function searchCities(query) {
    const response = await fetch(
        `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
        throw new Error('Search failed');
    }
    
    return await response.json();
}

// ===== Display Functions =====

function displayCurrentWeather(data) {
    const weather = data.weather[0];
    
    // City & Country
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('countryName').textContent = data.sys.country;
    
    // Weather Icon & Temperature
    document.getElementById('weatherIcon').src = getWeatherIconUrl(weather.icon);
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weatherDesc').textContent = weather.description;
    document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like);
    
    // Temp Range
    document.getElementById('tempMax').textContent = Math.round(data.main.temp_max);
    document.getElementById('tempMin').textContent = Math.round(data.main.temp_min);
    
    // Weather Details
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed.toFixed(1)} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('clouds').textContent = `${data.clouds.all}%`;
    
    // Sun Times
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise, data.timezone);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset, data.timezone);
    
    // Update background based on weather
    updateBackground(weather.main);
}

function displayHourlyForecast(data) {
    const container = document.getElementById('hourlyForecast');
    const hourlyData = data.list.slice(0, 8);
    
    container.innerHTML = hourlyData.map(item => {
        const weather = item.weather[0];
        const time = formatHour(item.dt);
        const iconUrl = getWeatherIconUrl(weather.icon);
        const precipChance = item.pop ? Math.round(item.pop * 100) : 0;
        
        return `
            <div class="hourly-card">
                <div class="time">${time}</div>
                <img src="${iconUrl}" alt="${weather.description}">
                <div class="temp">${Math.round(item.main.temp)}°C</div>
                ${precipChance > 0 ? `<div class="precip">${precipChance}%</div>` : ''}
            </div>
        `;
    }).join('');
}

function displayDailyForecast(data) {
    const container = document.getElementById('dailyForecast');
    // Get one forecast per day (noon readings)
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 7);
    
    container.innerHTML = dailyData.map(item => {
        const weather = item.weather[0];
        const day = formatDate(item.dt);
        const iconUrl = getWeatherIconUrl(weather.icon);
        const precipChance = item.pop ? Math.round(item.pop * 100) : 0;
        
        return `
            <div class="daily-card">
                <div class="day">${day}</div>
                <div class="weather-info">
                    <img src="${iconUrl}" alt="${weather.description}">
                    <span class="description">${weather.description}</span>
                </div>
                ${precipChance > 0 ? `<div class="precip">${precipChance}%</div>` : ''}
                <div class="temp">${Math.round(item.main.temp)}°C</div>
            </div>
        `;
    }).join('');
}

// ===== Helper Functions =====

function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

function formatHour(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function updateBackground(weatherMain) {
    const weather = weatherMain.toLowerCase();
    const body = document.body;
    
    let gradient;
    
    if (weather.includes('clear')) {
        gradient = 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)';
    } else if (weather.includes('cloud')) {
        gradient = 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)';
    } else if (weather.includes('rain') || weather.includes('drizzle')) {
        gradient = 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)';
    } else if (weather.includes('thunderstorm')) {
        gradient = 'linear-gradient(135deg, #232526 0%, #414345 100%)';
    } else if (weather.includes('snow')) {
        gradient = 'linear-gradient(135deg, #e6dada 0%, #274046 100%)';
    } else if (weather.includes('mist') || weather.includes('fog') || weather.includes('haze')) {
        gradient = 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)';
    } else {
        gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    body.style.background = gradient;
}

// ===== UI Functions =====

function showLoading() {
    loading.classList.add('active');
    weatherContent.style.display = 'none';
    errorMessage.classList.remove('active');
}

function hideLoading() {
    loading.classList.remove('active');
}

function showError(message) {
    hideLoading();
    weatherContent.style.display = 'none';
    errorText.textContent = message;
    errorMessage.classList.add('active');
}

function hideError() {
    errorMessage.classList.remove('active');
}

function showWeatherContent() {
    hideLoading();
    weatherContent.style.display = 'flex';
}

// ===== Theme Functions =====

function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') !== 'light';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    
    const icon = themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    const icon = themeToggle.querySelector('i');
    icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}
