import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import OtherDetails from "./components/OtherDetails";
import { useEffect, useState } from "react";

function App() {
  const [city, setCity] = useState("Jabalpur");
  const [weather, setWeather] = useState(null);
  const [bg, setBg] = useState(hotBg);

  const makeIconURL = (iconId) =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

  useEffect(() => {
    const getFormattedWeatherData = async (city) => {

      const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=32f9a469f42e9d8c6ffab7bfdafec7ea&units=metric`)
        .then((res) => res.json())
        .then((data) => data);
    
      const {
        weather,
        main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
        wind: { speed },
        sys: { country },
        name,
      } = data;
    
      const { description, icon } = weather[0];
    
      return {
        description,
        iconURL: makeIconURL(icon),
        temp,
        feels_like,
        temp_min,
        temp_max,
        pressure,
        humidity,
        speed,
        country,
        name,
      };
    };
    
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city);
      setWeather(data);

      // dynamic bg
      const threshold = 20;
      if (data.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);
    };

    fetchWeatherData();
  }, [city]);

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter City..."
              />
            </div>

            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °C`}</h1>
              </div>
            </div>

            {/* bottom description */}
            <OtherDetails weather={weather} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;