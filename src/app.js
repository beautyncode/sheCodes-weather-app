function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
            <div class="weather-forecast-date">${formatDay(
              forecastDay.time
            )}</div>
              <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                forecastDay.condition.icon
              }.png" alt="" width="42" />
              <div class="weather-forecast-temperature">
                <span class="weather-forecast-temperature-max">
                  ${Math.round(forecastDay.temperature.maximum)}°
                </span>
                <span class="weather-forecast-temperature-min">
                  ${Math.round(forecastDay.temperature.minimum)}°
                </span>
                </div>
              </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "dcbe9afdd9023a013ceaof19ted4923f";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#date").innerHTML = formatDate(
    response.data.time * 1000
  );
  let iconElement = document.querySelector("#icon");

  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.icon);

  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "dcbe9afdd9023a013ceaof19ted4923f";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  document.querySelector("#temperature").innerHTML = Math.round(
    (celsiusTemperature * 9) / 5 + 32
  );
}
function getPosition(position) {
  console.log(position);
  let apiKey = "dcbe9afdd9023a013ceaof19ted4923f";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}
function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let button = document.querySelector("button");
button.addEventListener("click", currentLocation);

search("New York");
