  // ==================================
        // Weather App - Pro Level
       3 // ==================================
       4
       5 // API Key (Get free key from OpenWeatherMap)
       6 const API_KEY = '6229f6473df45e522ad61061a0a51c20'; // Get from: https://openweathermap.org/api
       7 const API_URL = 'https://api.openweathermap.org/data/2.5/';
       8
       9 // DOM Elements
      10 const cityInput = document.getElementById('cityInput');
      11 const searchBtn = document.getElementById('searchBtn');
      12 const locationBtn = document.getElementById('locationBtn');
      13 const themeToggle = document.getElementById('themeToggle');
      14 const loading = document.getElementById('loading');
      15 const errorMessage = document.getElementById('errorMessage');
      16 const weatherContent = document.getElementById('weatherContent');
      17 const forecastGrid = document.getElementById('forecastGrid');
      18
      19 // Weather Data Elements
      20 const tempEl = document.getElementById('temp');
      21 const descriptionEl = document.getElementById('description');
      22 const cityEl = document.getElementById('city');
      23 const dateEl = document.getElementById('date');
      24 const windEl = document.getElementById('wind');
      25 const humidityEl = document.getElementById('humidity');
      26 const pressureEl = document.getElementById('pressure');
      27 const visibilityEl = document.getElementById('visibility');
      28 const feelsLikeEl = document.getElementById('feelsLike');
      29 const uvIndexEl = document.getElementById('uvIndex');
      30 const sunriseEl = document.getElementById('sunrise');
      31 const sunsetEl = document.getElementById('sunset');
      32 const weatherIcon = document.getElementById('weatherIcon');
      33
      34 // ==================================
      35 // Initialize
      36 // ==================================
      37 document.addEventListener('DOMContentLoaded', () => {
      38   initTheme();
      39   loadDefaultCity();
      40 });
      41
      42 // ==================================
      43 // Theme Toggle
      44 // ==================================
      45 function initTheme() {
      46   const savedTheme = localStorage.getItem('weather-theme');
      47   if (savedTheme) {
      48     document.documentElement.setAttribute('data-theme', savedTheme);
      49     updateThemeIcon(savedTheme);
      50   }
      51 }
      52
      53 themeToggle.addEventListener('click', () => {
      54   const currentTheme = document.documentElement.getAttribute('data-theme');
      55   const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      56   document.documentElement.setAttribute('data-theme', newTheme);
      57   localStorage.setItem('weather-theme', newTheme);
      58   updateThemeIcon(newTheme);
      59 });
      60
      61 function updateThemeIcon(theme) {
      62   const icon = themeToggle.querySelector('i');
      63   if (theme === 'dark') {
      64     icon.className = 'fas fa-sun';
      65   } else {
      66     icon.className = 'fas fa-moon';
      67   }
      68 }
      69
      70 // ==================================
      71 // Search Functionality
      72 // ==================================
      73 searchBtn.addEventListener('click', () => {
      74   const city = cityInput.value.trim();
      75   if (city) {
      76     getWeather(city);
      77   }
      78 });
      79
      80 cityInput.addEventListener('keypress', (e) => {
      81   if (e.key === 'Enter') {
      82     const city = cityInput.value.trim();
      83     if (city) {
      84       getWeather(city);
      85     }
      86   }
      87 });
      88
      89 locationBtn.addEventListener('click', getCurrentLocation);
      90
      91 // ==================================
      92 // Get Weather Data
      93 // ==================================
      94 async function getWeather(city) {
      95   showLoading();
      96
      97   try {
      98     // Current Weather
      99     const weatherResponse = await fetch(
     100       `${API_URL}weather?q=${city}&units=metric&appid=${API_KEY}`
     101     );
     102
     103     if (!weatherResponse.ok) {
     104       throw new Error('City not found');
     105     }
     106
     107     const weatherData = await weatherResponse.json();
     108
     109     // 5-Day Forecast
     110     const forecastResponse = await fetch(
     111       `${API_URL}forecast?q=${city}&units=metric&appid=${API_KEY}`
     112     );
     113     const forecastData = await forecastResponse.json();
     114
     115     // Update UI
     116     updateCurrentWeather(weatherData);
     117     updateForecast(forecastData);
     118     updateBackground(weatherData.weather[0].main);
     119
     120     hideLoading();
     121     showWeather();
     122
     123   } catch (error) {
     124     console.error('Error:', error);
     125     showError();
     126     hideLoading();
     127   }
     128 }
     129
     130 // ==================================
     131 // Get Current Location
     132 // ==================================
     133 function getCurrentLocation() {
     134   if (navigator.geolocation) {
     135     showLoading();
     136     navigator.geolocation.getCurrentPosition(
     137       (position) => {
     138         const { latitude, longitude } = position.coords;
     139         getWeatherByCoords(latitude, longitude);
     140       },
     141       (error) => {
     142         console.error('Geolocation error:', error);
     143         showError('Unable to get location. Please search manually.');
     144       }
     145     );
     146   } else {
     147     showError('Geolocation not supported by your browser');
     148   }
     149 }
     150
     151 async function getWeatherByCoords(lat, lon) {
     152   try {
     153     const weatherResponse = await fetch(
     154       `${API_URL}weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
     155     );
     156     const weatherData = await weatherResponse.json();
     157
     158     const forecastResponse = await fetch(
     159       `${API_URL}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
     160     );
     161     const forecastData = await forecastResponse.json();
     162
     163     updateCurrentWeather(weatherData);
     164     updateForecast(forecastData);
     165     updateBackground(weatherData.weather[0].main);
     166
     167     hideLoading();
     168     showWeather();
     169
     170   } catch (error) {
     171     console.error('Error:', error);
     172     showError();
     173     hideLoading();
     174   }
     175 }
     176
     177 // ==================================
     178 // Update Current Weather UI
     179 // ==================================
     180 function updateCurrentWeather(data) {
     181   tempEl.textContent = Math.round(data.main.temp);
     182   descriptionEl.textContent = data.weather[0].description;
     183   cityEl.textContent = `${data.name}, ${data.sys.country}`;
     184   dateEl.textContent = getCurrentDate();
     185
     186   windEl.textContent = `${data.wind.speed} m/s`;
     187   humidityEl.textContent = `${data.main.humidity}%`;
     188   pressureEl.textContent = `${data.main.pressure} hPa`;
     189   visibilityEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
     190   feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°`;
     191
     192   // UV Index (simulated - real API requires different endpoint)
     193   uvIndexEl.textContent = getUVIndex(data.main.humidity);
     194
     195   // Sunrise & Sunset
     196   sunriseEl.textContent = formatTime(data.sys.sunrise);
     197   sunsetEl.textContent = formatTime(data.sys.sunset);
     198
     199   // Weather Icon
     200   weatherIcon.className = getWeatherIcon(data.weather[0].main);
     201 }
     202
     203 // ==================================
     204 // Update Forecast UI
     205 // ==================================
     206 function updateForecast(data) {
     207   forecastGrid.innerHTML = '';
     208
     209   // Get one forecast per day (at noon)
     210   const dailyForecasts = data.list.filter(item =>
     211     item.dt_txt.includes('12:00:00')
     212   ).slice(0, 5);
     213
     214   dailyForecasts.forEach(day => {
     215     const card = document.createElement('div');
     216     card.className = 'forecast-card glass';
     217     card.innerHTML = `
     218       <span class="forecast-day">${getDayName(day.dt)}</span>
     219       <i class="fas ${getWeatherIcon(day.weather[0].main)} forecast-icon"></i>
     220       <div class="forecast-temp">
     221         <span class="high">${Math.round(day.main.temp_max)}°</span>
     222         <span class="low">${Math.round(day.main.temp_min)}°</span>
     223       </div>
     224     `;
     225     forecastGrid.appendChild(card);
     226   });
     227 }
     228
     229 // ==================================
     230 // Update Background Based on Weather
     231 // ==================================
     232 function updateBackground(weather) {
     233   const app = document.querySelector('.weather-app');
     234   app.classList.remove('sunny', 'cloudy', 'rainy', 'night');
     235
     236   const hour = new Date().getHours();
     237   const isNight = hour < 6 || hour > 20;
     238
     239   if (isNight) {
     240     app.classList.add('night');
     241   } else {
     242     switch (weather.toLowerCase()) {
     243       case 'clear':
     244       case 'sunny':
     245         app.classList.add('sunny');
     246         break;
     247       case 'clouds':
     248       case 'cloudy':
     249         app.classList.add('cloudy');
     250         break;
     251       case 'rain':
     252       case 'drizzle':
     253       case 'thunderstorm':
     254         app.classList.add('rainy');
     255         break;
     256       default:
     257         app.classList.add('sunny');
     258     }
     259   }
     260 }
     261
     262 // ==================================
     263 // Helper Functions
     264 // ==================================
     265 function getCurrentDate() {
     266   const options = {
     267     weekday: 'long',
     268     year: 'numeric',
     269     month: 'long',
     270     day: 'numeric'
     271   };
     272   return new Date().toLocaleDateString('en-US', options);
     273 }
     274
     275 function getDayName(timestamp) {
     276   const date = new Date(timestamp * 1000);
     277   return date.toLocaleDateString('en-US', { weekday: 'short' });
     278 }
     279
     280 function formatTime(timestamp) {
     281   const date = new Date(timestamp * 1000);
     282   return date.toLocaleTimeString('en-US', {
     283     hour: '2-digit',
     284     minute: '2-digit'
     285   });
     286 }
     287
     288 function getWeatherIcon(weather) {
     289   const icons = {
     290     'Clear': 'fa-sun',
     291     'Clouds': 'fa-cloud',
     292     'Rain': 'fa-cloud-showers-heavy',
     293     'Drizzle': 'fa-cloud-rain',
     294     'Thunderstorm': 'fa-bolt',
     295     'Snow': 'fa-snowflake',
     296     'Mist': 'fa-smog',
     297     'Fog': 'fa-smog',
     298     'Haze': 'fa-smog'
     299   };
     300   return icons[weather] || 'fa-cloud-sun';
     301 }
     302
     303 function getUVIndex(humidity) {
     304   // Simulated UV index based on humidity
     305   if (humidity > 80) return 'Low';
     306   if (humidity > 60) return 'Moderate';
     307   if (humidity > 40) return 'High';
     308   return 'Very High';
     309 }
     310
     311 function loadDefaultCity() {
     312   getWeather('Karachi'); // Default city
     313 }
     314
     315 // ==================================
     316 // UI State Functions
     317 // ==================================
     318 function showLoading() {
     319   loading.classList.add('active');
     320   errorMessage.classList.remove('active');
     321   weatherContent.style.display = 'none';
     322 }
     323
     324 function hideLoading() {
     325   loading.classList.remove('active');
     326 }
     327
     328 function showError(message = 'City not found. Please try again.') {
     329   errorMessage.querySelector('span').textContent = message;
     330   errorMessage.classList.add('active');
     331   weatherContent.style.display = 'none';
     332 }
     333
     334 function showWeather() {
     335   weatherContent.style.display = 'block';
     336 }
