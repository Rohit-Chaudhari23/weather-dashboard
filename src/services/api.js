import axios from "axios";

// Weather
export const getWeatherByCoords = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,windspeed_10m&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,precipitation,visibility,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`
    );
    return res.data;
  } catch (err) {
    console.error("Weather API Error:", err);
    return null;
  }
};

// Air Quality
export const getAirQuality = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide`
    );
    return res.data;
  } catch (err) {
    console.error("Air Quality API Error:", err);
    return null;
  }
};

// History
export const getHistoryWeather = async (lat, lon, start, end) => {
  try {
    const res = await axios.get(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=temperature_2m,windspeed_10m,winddirection_10m,precipitation,relativehumidity_2m,pm10,pm2_5&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant&timezone=auto`
    );
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};