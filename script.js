// API key and endpoint URLs
const apiKey = "1a3471ac6b3f5328b95df3c90092ca9a";
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en";
const hourlyForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=en";

// Function to get weather data by city name
function getWeatherDataByCity(city) {
  if (!city.trim()) {
    alert("Please enter a city name.");
    return;
  }

  const currentWeatherRequestUrl = `${currentWeatherUrl}&q=${city}&appid=${apiKey}`;
  const hourlyForecastRequestUrl = `${hourlyForecastUrl}&q=${city}&appid=${apiKey}`;

  fetch(currentWeatherRequestUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      displayWeatherData(data);
      fetch(hourlyForecastRequestUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error("Hourly forecast data not available");
          }
          return response.json();
        })
        .then(hourlyData => {
          displayHourlyForecast(hourlyData);
        })
        .catch(error => {
          handleRequestError(error);
        });
    })
    .catch(error => {
      handleRequestError(error);
    });
}

// Function to get weather data by geolocation
function getWeatherDataByGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const currentWeatherRequestUrl = `${currentWeatherUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      const hourlyForecastRequestUrl = `${hourlyForecastUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

      fetch(currentWeatherRequestUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error("Weather data not available");
          }
          return response.json();
        })
        .then(data => {
          displayWeatherData(data);
          fetch(hourlyForecastRequestUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error("Hourly forecast data not available");
              }
              return response.json();
            })
            .then(hourlyData => {
              displayHourlyForecast(hourlyData);
            })
            .catch(error => {
              handleRequestError(error);
            });
        })
        .catch(error => {
          handleRequestError(error);
        });
    }, error => {
      handleRequestError(error);
    });
  } else {
    alert("Geolocation is not supported by your browser");
  }
}

// Function to handle request errors
function handleRequestError(error) {
  alert("An error occurred. Please try again later.");
  console.error("Error:", error);
}

// Function to display current weather data
// Function to display current weather data
function displayWeatherData(data) {
  console.log(data);

  // Get city name and weather details
  const cityName = data.name;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const description = data.weather[0].description;
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN');
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN');

  // Display city name and weather details
  document.getElementById('city-name').textContent = cityName;
  document.getElementById('temperature').textContent = `Temperature: ${temperature} °C`;
  document.getElementById('humidity').textContent = `Humidity: ${humidity} %`;
  document.getElementById('description').textContent = `Description: ${description}`;
  document.getElementById('sunrise').textContent = `Sunrise: ${sunrise}`;
  document.getElementById('sunset').textContent = `Sunset: ${sunset}`;
}

// Function to display hourly forecast data
function displayHourlyForecast(hourlyData) {
    console.log(hourlyData);
    const forecastContainer = document.getElementById('hourly-forecast');
  
    // Clear previous forecast data
    forecastContainer.innerHTML = '';
  
    // Display hourly forecast
    for (let i = 0; i < 5; i++) {
      const forecast = hourlyData.list[i];
      const forecastTime = new Date(forecast.dt * 1000).toLocaleTimeString('en-IN');
      const forecastTemperature = forecast.main.temp;
      const forecastDescription = forecast.weather[0].description;
  
      const forecastElement = document.createElement('div');
      forecastElement.classList.add('forecast-item');
      forecastElement.innerHTML = `
        <p>${forecastTime}</p>
        <p>Temperature: ${forecastTemperature} °C</p>
        <p>Description: ${forecastDescription}</p>
      `;
      forecastContainer.appendChild(forecastElement);
    }
   
  }
  

// Event listener for search button
document.getElementById('search-button').addEventListener('click', function() {
  const city = document.getElementById('search-box').value;
  getWeatherDataByCity(city);
});

// Event listener for geolocation button
document.getElementById('geolocation-button').addEventListener('click', function() {
  getWeatherDataByGeolocation();
});
