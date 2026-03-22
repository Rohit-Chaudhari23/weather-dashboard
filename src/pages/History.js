import { useState } from "react";
import { getHistoryWeather } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush,
  Legend
} from "recharts";

function History() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

 const handleFetch = () => {
  const diff =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

  if (diff > 730) {
    alert("Max 2 years allowed");
    return;
  }

  setLoading(true);
  setError(null);

  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const res = await getHistoryWeather(
        pos.coords.latitude,
        pos.coords.longitude,
        startDate,
        endDate
      );
      setData(res);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  });
};
  // TEMP 
  const tempData =
    data?.daily?.time?.map((t, i) => ({
      date: t,
      min: data.daily.temperature_2m_min[i],
      max: data.daily.temperature_2m_max[i],
      mean:
        (data.daily.temperature_2m_min[i] +
          data.daily.temperature_2m_max[i]) /
        2
    })) || [];

  // SUN
  const sunData =
    data?.daily?.time?.map((t, i) => ({
      date: t,
      sunrise: new Date(data.daily.sunrise[i]).getHours(),
      sunset: new Date(data.daily.sunset[i]).getHours()
    })) || [];

  // wind
  const windData =
    data?.daily?.time?.map((t, i) => ({
      date: t,
      wind: data.daily.windspeed_10m_max[i],
      direction: data.daily.winddirection_10m_dominant[i]
    })) || [];

  // pm
 const pmData =
  data?.hourly?.time
    ?.map((t, i) => {
      const pm10 = data.hourly.pm10?.[i];
      const pm2 = data.hourly.pm2_5?.[i];

      return {
        time: t.slice(11, 16),
        pm10: pm10 ?? null,
        pm2_5: pm2 ?? null
      };
    })
    ?.filter(d => d.pm10 !== null || d.pm2_5 !== null) || [];

  const totalRain =
    data?.daily?.precipitation_sum?.reduce((a, b) => a + b, 0) || 0;

  return (
    <div className="container">
      <div className="history-box">
        <h2> Weather History</h2>

        <div className="history-filter">
          <input type="date" onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" onChange={(e) => setEndDate(e.target.value)} />
          <button className="btn fetch-btn" onClick={handleFetch}>
              Fetch Data
            </button>
        </div>
       

       {/*  Loading */}
        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && tempData.length === 0 && (
          <p>No data found. Please select a valid range.</p>
        )}


        {tempData.length > 0 && (
          <>
            {/* TEMP */}
            <h3>Temperature</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tempData}>
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#ccc" />
                <Line dataKey="min" stroke="#00bcd4" />
                <Line dataKey="max" stroke="#ff5722" />
                <Line dataKey="mean" stroke="#4caf50" />
                <Brush dataKey="date"  height={30} stroke="#8884d8" travellerWidth={10}/>
              </LineChart>
            </ResponsiveContainer>

            {/* SUN */}
            <h3>Sunrise & Sunset</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sunData}>
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#ccc" />
                <Line dataKey="sunrise" stroke="#f59e0b" />
                <Line dataKey="sunset" stroke="#6366f1" />
                <Brush />
              </LineChart>
            </ResponsiveContainer>

            {/* WIND */}
            <h3>Wind Speed & Direction</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={windData}>
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#ccc" />
                <Line dataKey="wind" stroke="#8884d8" />
                <Line dataKey="direction" stroke="#ff9800" />
                <Brush />
              </LineChart>
            </ResponsiveContainer>

            {/* PM */}
          <h3>PM10 & PM2.5</h3>

          {pmData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pmData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#ccc" />

                <Line dataKey="pm10" stroke="#8884d8" />
                <Line dataKey="pm2_5" stroke="#82ca9d" />

                <Brush dataKey="time" height={30} travellerWidth={10} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="card">PM data not available for this location</div>
          )}
            {/* PRECIP */}
            <h3>Total Precipitation</h3>
            <div className="card">{totalRain.toFixed(2)} mm</div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button className="btn">Load More Data</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default History;