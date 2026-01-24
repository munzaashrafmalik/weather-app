const apiKey = "6229f6473df45e522ad61061a0a51c20";

const weatherBox = document.getElementById("weatherBox");
const forecastBox = document.getElementById("forecast");
const modeBtn = document.getElementById("modeBtn");

modeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  modeBtn.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
};

function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("City likho!");

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then(res => res.json())
    .then(showWeather);

  fetchForecast(city);
}

function showWeather(data) {
  weatherBox.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <div class="temp">${Math.round(data.main.temp)}°C</div>
    <p>${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
  `;
}

function fetchForecast(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  )
    .then(res => res.json())
    .then(data => {
      forecastBox.innerHTML = "";
      for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        forecastBox.innerHTML += `
          <div class="day">
            <p>${day.dt_txt.split(" ")[0]}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
            <p>${Math.round(day.main.temp)}°C</p>
          </div>
        `;
      }
    });
}

function getLocationWeather() {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    )
      .then(res => res.json())
      .then(showWeather);
  });
}
