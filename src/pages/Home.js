import { useEffect, useState } from "react";
import { getWeatherByCoords, getAirQuality } from "../services/api";
import WeatherCard from "../components/WeatherCard";
import ChartComponent from "../components/ChartComponent";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush  
} from "recharts";

// ✅ AQI Logic
const getAQI = (pm25) => {
  if (pm25 <= 50) return "Good";
  if (pm25 <= 100) return "Moderate";
  return "Poor";
};

function Home() {
  const [data, setData] = useState(null);
  const [aqi, setAqi] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const weather = await getWeatherByCoords(lat, lon);
        const air = await getAirQuality(lat, lon);

        setData(weather);
        setAqi(air);
      },
      () => {
        const lat = 12.9716;
        const lon = 77.5946;

        getWeatherByCoords(lat, lon).then(setData);
        getAirQuality(lat, lon).then(setAqi);
      }
    );
  }, []);

  if (!data || !aqi) return <h2>Loading...</h2>;

  const current = data.current;
  const daily = data.daily;
  const air = aqi.hourly;

  // ✅ SAFE VALUES (FINAL FIX)
  const windNow =
    current.windspeed_10m ??
    data.hourly.windspeed_10m?.[0] ??
    "--";

  const precipNow =
    data.hourly.precipitation_probability?.find(
      (v) => v !== null && v !== undefined
    ) ?? "--";

  // ✅ FORMAT FUNCTION
  const format = (arr, key) =>
    data?.hourly?.time?.map((t, i) => ({
      time: t.slice(11, 16),
      [key]: arr?.[i] ?? 0
    })) || [];

  const tempData = format(data.hourly.temperature_2m, "temp");
  const humidityData = format(data.hourly.relativehumidity_2m, "humidity");
  const windData = format(data.hourly.windspeed_10m, "wind");
  const visibilityData = format(data.hourly.visibility, "visibility");
  const rainData = format(data.hourly.precipitation, "rain");

  // ✅ PM COMBINED
  const pmData =
    data?.hourly?.time?.map((t, i) => ({
      time: t.slice(11, 16),
      pm10: air?.pm10?.[i] ?? 0,
      pm2_5: air?.pm2_5?.[i] ?? 0
    })) || [];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <h2>🌤 Weather Dashboard</h2>
   <p className="subtitle">Live weather insights based on your location</p>
      {/* ================== CARDS ================== */}
      <div className="cards">
        <WeatherCard title="Temp" value={(current.temperature_2m ?? "--") + "°C"} />
        <WeatherCard title="Min" value={(daily.temperature_2m_min?.[0] ?? "--") + "°C"} />
        <WeatherCard title="Max" value={(daily.temperature_2m_max?.[0] ?? "--") + "°C"} />
        <WeatherCard title="Humidity" value={(current.relativehumidity_2m ?? "--") + "%"} />
        <WeatherCard title="UV" value={daily.uv_index_max?.[0] ?? "--"} />
        <WeatherCard title="Sunrise" value={daily.sunrise?.[0]?.slice(11, 16) ?? "--"} />
        <WeatherCard title="Sunset" value={daily.sunset?.[0]?.slice(11, 16) ?? "--"} />

        <WeatherCard title="PM10" value={(air?.pm10?.[0] ?? "--") + " µg/m³"} />
        <WeatherCard title="PM2.5" value={(air?.pm2_5?.[0] ?? "--") + " µg/m³"} />
        <WeatherCard title="CO" value={air?.carbon_monoxide?.[0] ?? "--"} />
        <WeatherCard title="NO2" value={air?.nitrogen_dioxide?.[0] ?? "--"} />
        <WeatherCard title="SO2" value={air?.sulphur_dioxide?.[0] ?? "--"} />

        <WeatherCard title="AQI" value={getAQI(air?.pm2_5?.[0] ?? 0)} />
        <WeatherCard title="CO2" value={air?.carbon_dioxide?.[0] ?? "N/A"} />

        <WeatherCard title="Precip %" value={precipNow + "%"} />
        <WeatherCard title="Precipitation"  value={(data.hourly.precipitation?.[0] ?? "--") + " mm"}/>
        <WeatherCard title="Wind" value={windNow + " km/h"} />
      </div>

      {/* ================== GRAPHS ================== */}
      <h3>Temperature</h3>
      <ChartComponent data={tempData} dataKey="temp" />

      <h3>Humidity</h3>
      <ChartComponent data={humidityData} dataKey="humidity" />

      <h3>Wind Speed</h3>
      <ChartComponent data={windData} dataKey="wind" />

      <h3>Visibility</h3>
      <ChartComponent data={visibilityData} dataKey="visibility" />

      <h3>Precipitation</h3>
      {rainData.some((d) => d.rain > 0) ? (
        <ChartComponent data={rainData} dataKey="rain" />
      ) : (
        <p>No Rain Today</p>
      )}

      {/* ================== PM GRAPH ================== */}
      <h3>Air Quality (PM10 & PM2.5)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={pmData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />

          <Line dataKey="pm10" stroke="#8884d8" dot={false} />
          <Line dataKey="pm2_5" stroke="#82ca9d" dot={false} />
          <Brush dataKey="date"  height={30} stroke="#8884d8" travellerWidth={10}/>
        </LineChart>
      </ResponsiveContainer>

      {/* ================== BUTTON ================== */}
      <button className="btn" onClick={() => navigate("/history")}>
        View History
      </button>
    </div>
  );
}

export default Home;