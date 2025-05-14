/*
Name: Ferguson, Macy
Assignment: Week 17 - Final Exam Q4
Description: Displays temperature and weather results based on user's input (city name)
Date: May 13, 2025
*/

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // in case you add CSS later

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const apiKey = "3c769d392d44007cf6bbd26b5782c1f5";
  const units = "imperial";

  const city = req.body.cityInput;
  const lat = req.body.latInput;
  const lon = req.body.lonInput;

  let url = "";

  if (lat && lon) {
    // Use Latitude and Longitude if provided
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  } else if (city) {
    // Use City name if no coordinates
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  } else {
    return res.send(
      "<h3>Please enter either a city name or latitude and longitude.</h3>"
    );
  }

  https.get(url, function (response) {
    if (response.statusCode !== 200) {
      res.send(
        `<h3>Error fetching weather data. Status Code: ${response.statusCode}</h3>`
      );
      return;
    }

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const clouds = weatherData.clouds.all;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write(`<h1>Weather: ${description}</h1>`);
      res.write(`<h2>Temperature: ${temp} °F</h2>`);
      res.write(`<img src="${imageURL}" alt="Weather Icon">`);
      res.write(`<h3>Humidity: ${humidity}%</h3>`);
      res.write(`<h3>Wind Speed: ${windSpeed} m/s</h3>`);
      res.write(`<h3>Cloudiness: ${clouds}%</h3>`);
      res.send();
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
