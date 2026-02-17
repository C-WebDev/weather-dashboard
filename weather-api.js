export async function getWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,rain,showers,wind_speed_10m,snowfall,weather_code&forecast_days=1`,
    );

    if (!res.ok) {
      throw new Error("Data loading error");
    }

    const data = await res.json();

    console.log(data);

    return {
      temp: data.current.temperature_2m,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
      rain: data.current.rain,
      showers: data.current.showers,
      snowfall: data.current.snowfall,
      weathercode: data.current.weather_code,
    };
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
}

export function setWeatherBackground(code) {
  // let file = "default.gif";
  // if (code === 0 || code === 1 || code === 2) {
  //   file = "sunny.gif";
  // } else if (code === 3) {
  //   file = "cloudy.gif";
  // } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
  //   file = "rainy.gif";
  // } else if ([71, 73, 75].includes(code)) {
  //   file = "snowy.gif";
  // } else if ([95, 96, 99].includes(code)) {
  //   file = "thunder.gif";
  // }
  // document.body.style.backgroundImage = `url("media-content/${file}")`;
  // document.body.style.backgroundSize = "cover";
  // document.body.style.backgroundPosition = "center";
}
