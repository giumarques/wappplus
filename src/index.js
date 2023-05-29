let apiKey = "b9ba0314a93083136d968577c718e31d";
let celsiusTemperature = null;

function displayTemperature(response) {
  let cityName = response.data.name;
  let temperature = response.data.main.temp;
  let weatherDescription = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = parseInt(Math.round(response.data.wind.speed * 3.6));
  let weatherIcon = response.data.weather[0].icon;

  let cityHeading = document.querySelector("#city");
  cityHeading.textContent = cityName;

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(temperature);

  let weatherDescriptionElement = document.querySelector(".description");
  weatherDescriptionElement.textContent =
    capitalizeFirstLetter(weatherDescription);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.textContent = `Humidity: ${humidity}%`;

  let windElement = document.querySelector("#wind");
  windElement.textContent = `Wind: ${wind} km/h`;

  let weatherIconElement = document.querySelector("#icon");
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherIcon}.png`
  );

  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  celsiusTemperature = temperature;

  celsiusLink.addEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

  updateTemperatureUnits();
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function updateTemperatureUnits() {
  let temperatureElement = document.querySelector("#temperature");
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(function (position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(displayTemperature);
  });
}

function loadTemperatureFromLocation() {
  getCurrentPosition();
}

loadTemperatureFromLocation();

let form = document.querySelector(".search-form");
let currentButton = document.querySelector("#current-button");
let currentDateTimeElement = document.querySelector("#current-date-time");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let cityInput = document.querySelector(".form-control");
  let cityName = cityInput.value.trim();

  if (cityName.length === 0) {
    alert("Please enter a city name.");
  } else {
    searchCity(cityName);
    cityInput.value = "";
  }
});

function formatDateTime(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDay = days[date.getDay()];

  let options = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  let formattedTime = date.toLocaleTimeString(undefined, options);

  let formattedDateTime = `${currentDay}, ${formattedTime}`;

  return formattedDateTime;
}

currentButton.addEventListener("click", loadTemperatureFromLocation);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let currentTime = new Date();
let formattedDateTime = formatDateTime(currentTime);
currentDateTimeElement.textContent = formattedDateTime;
