import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./HomePage.css";

let cityName,
  cityDetails = "";

function HomePage() {
  const [data, setData] = useState({});

  const [location, setLocation] = useState("");

  const apiKey = "gTCwk0F6YzLEPsU4HvzCu7cIAKD2yfLA";

  const cityURL = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${location}`;

  const iconPath = "https://developer.accuweather.com/sites/default/files/";

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios
        .get(cityURL)
        .then((response) => {
          if (!response.data) {
            toast.dark("🤷‍♀️ Please enter a city!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else if (!response.data.length) {
            toast.dark("🤷‍♀️ Couldn't find such a city!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          setData(response.data);
          let locationKey = "";
          response.data.length
            ? (locationKey = response.data[0].Key)
            : (locationKey = "");

          const weatherURL = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}&details=true&metric=true`;
          return axios.get(weatherURL);
        })
        .then((response) => {
          if (response.data) setData(response.data);
        });
    }
  };

  let dayIconNumber = data.DailyForecasts
    ? data.DailyForecasts[0].Day.Icon
    : "";
  let nightIconNumber = data.DailyForecasts
    ? data.DailyForecasts[0].Night.Icon
    : "";

  if (data.length) {
    cityName = data[0].EnglishName;
    cityDetails = `(${data[0].Country.EnglishName}, ${data[0].AdministrativeArea.EnglishName})`;
  }

  function card() {
    if (location) {
      return <h1>loc yes</h1>;
    } else {
      return <h1>loc no</h1>;
    }
  }

  return (
    <div className="HomePage">
      <ToastContainer />
      <div className="Search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter city..."
          type="text"
        />
      </div>
      {card}
      <div className="Card">
        <div className="City">{cityName}</div>
        <div className="Details">{cityDetails}</div>
        <div className="Image">
          <figure>
            <img
              src={
                data.DailyForecasts && dayIconNumber >= 10
                  ? `${iconPath}${data.DailyForecasts[0].Day.Icon}-s.png`
                  : ""
              }
            />
            <figcaption>
              {data.DailyForecasts && dayIconNumber >= 10
                ? "Max: " +
                  data.DailyForecasts[0].Temperature.Maximum.Value +
                  " °C"
                : ""}
            </figcaption>
          </figure>
          <figure>
            <img
              src={
                data.DailyForecasts && dayIconNumber < 10
                  ? `${iconPath}0${data.DailyForecasts[0].Day.Icon}-s.png`
                  : ""
              }
            />
            <figcaption>
              {data.DailyForecasts && dayIconNumber < 10
                ? "Max: " +
                  data.DailyForecasts[0].Temperature.Maximum.Value +
                  " °C"
                : ""}
            </figcaption>
          </figure>
          <figure>
            <img
              src={
                data.DailyForecasts && nightIconNumber >= 10
                  ? `${iconPath}${data.DailyForecasts[0].Night.Icon}-s.png`
                  : ""
              }
            />
            <figcaption>
              {data.DailyForecasts && nightIconNumber >= 10
                ? "Min: " +
                  data.DailyForecasts[0].Temperature.Minimum.Value +
                  " °C"
                : ""}
            </figcaption>
          </figure>
          <figure>
            <img
              src={
                data.DailyForecasts && nightIconNumber < 10
                  ? `${iconPath}0${data.DailyForecasts[0].Night.Icon}-s.png`
                  : ""
              }
            />
            <figcaption>
              {data.DailyForecasts && nightIconNumber < 10
                ? "Min: " +
                  data.DailyForecasts[0].Temperature.Minimum.Value +
                  " °C"
                : ""}
            </figcaption>
          </figure>

          <div className="Text">
            <p>
              {data.DailyForecasts
                ? "Real feel Max: " +
                  data.DailyForecasts[0].RealFeelTemperature.Maximum.Value +
                  " °C"
                : ""}

              <br />
              {data.DailyForecasts
                ? "Real feel Min: " +
                  data.DailyForecasts[0].RealFeelTemperature.Minimum.Value +
                  " °C"
                : ""}
            </p>
          </div>
          <div className="Text">
            <p>{data.Headline ? data.Headline.Text : ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
