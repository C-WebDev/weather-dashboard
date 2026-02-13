import { cities } from "./cities-config.js";
import { getWeather } from "./weather-api.js";
import { setWeatherBackground } from "./weather-api.js";

const citySelector = document.getElementById("citySelector");
const btn = document.getElementById("getWeather");
const weatherDiv = document.getElementById("weather");

cities.forEach((city) => {
  const option = document.createElement("option");
  option.value = `${city.lat},${city.lon}`;
  option.textContent = city.name;
  citySelector.appendChild(option);
});

btn.addEventListener("click", () => {
  const [lat, lon] = citySelector.value.split(",");
  weatherDiv.textContent = "Загрузка...";

  getWeather(lat, lon)
    .then(function (result) {
      setWeatherBackground(result.weathercode);

      weatherDiv.innerHTML = `<div class="weatherInnerDiv">
        <p> Temp: ${result.temp} °C</p>
        <p> Wind: ${result.windSpeed} m/s</p>
        <p> Precipitation: ${result.precipitation} mm</p>
        </div><div class="weatherInnerDiv">
        <p> Rain: ${result.rain} mm</p>
        <p> Showers: ${result.showers} mm</p>
        <p> Snowfall: ${result.snowfall} cm</p>
        </div>
        `;
    })
    .catch(function (error) {
      weatherDiv.textContent = error.message;
    });
});
