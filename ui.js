import { getWeather, setWeatherBackground } from "./weather-api.js";

const cityInput = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");
const btn = document.getElementById("getWeather");
const weatherDiv = document.getElementById("weather");

const GEO_API_KEY = "81763622ecbca2680b1eb1ecadf01e91";


let debounceTimer;
let selectedCity = null;

//suggestions for user


cityInput.addEventListener("input", () => {
  const query = cityInput.value.trim();

  clearTimeout(debounceTimer);
  selectedCity = null;

  if (!query) {
    suggestions.innerHTML = "";
    return;
  }

  debounceTimer = setTimeout(() => {
    fetchCitySuggestions(query);
  }, 400);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btn.click();
  }
});

async function fetchCitySuggestions(query) {
  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      query
    )}&limit=5&appid=${GEO_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    renderSuggestions(data);
  } catch (error) {
    suggestions.innerHTML = "";
  }
}

async function fetchFirstCity(query) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    query
  )}&limit=1&appid=${GEO_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("City not found. Choose from suggestions or specify the name.");
  }

  return data[0];
}

// hints

function renderSuggestions(list) {
  suggestions.innerHTML = "";

  list.forEach((city) => {
    const item = document.createElement("div");
    item.textContent = `${city.name}, ${city.country}`;

    item.addEventListener("click", () => {
      cityInput.value = `${city.name}, ${city.country}`;
      selectedCity = city;
      suggestions.innerHTML = "";
    });

    suggestions.appendChild(item);
  });
}

//getting info
btn.addEventListener("click", async () => {
  const query = cityInput.value.trim();

  if (!selectedCity) {
    if (!query) {
      weatherDiv.textContent = "Enter city name";
      return;
    }

    weatherDiv.textContent = "Searching for city...";

    try {
      selectedCity = await fetchFirstCity(query);
      cityInput.value = `${selectedCity.name}, ${selectedCity.country}`;
      suggestions.innerHTML = "";
    } catch (error) {
      weatherDiv.textContent = error.message;
      return;
    }
  }

  weatherDiv.textContent = "Loading...";

  try {
    const result = await getWeather(selectedCity.lat, selectedCity.lon);

    setWeatherBackground(result.weathercode);

    weatherDiv.innerHTML = `
      <div class="weatherInnerDiv">
        <p>Temp: ${result.temp} °C</p>
        <p>Wind: ${result.windSpeed} m/s</p>
        <p>Precipitation: ${result.precipitation} mm</p>
      </div>
      <div class="weatherInnerDiv">
        <p>Rain: ${result.rain} mm</p>
        <p>Showers: ${result.showers} mm</p>
        <p>Snowfall: ${result.snowfall} cm</p>
      </div>
    `;
  } catch (error) {
    weatherDiv.textContent = error.message;
  }
});