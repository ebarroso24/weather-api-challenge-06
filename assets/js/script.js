const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeather = document.querySelector(".current-weather");
const weatherCards = document.querySelector(".weather-cards");
// delete below if it sucks
const separator = document.querySelector(".separator");
const storageKey = 'weatherSearchResults';
// delete above if it sucks
const createWeatherCard = (cityName, weatherItem, index) => {

if (index ===0) {
return `<div class="details">
<h2> ${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
<h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>
</div>`;

}else{
    return `  <li class="card">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
</li>`;
}

    
};

// delete below if it does not work
// Function to save search result to local storage
function saveToLocalStorage(city, data) {
    let searchResults = JSON.parse(localStorage.getItem(storageKey)) || {};
    searchResults[city] = data;
    localStorage.setItem(storageKey, JSON.stringify(searchResults));
}

// Function to display search results from local storage
function displaySearchResults() {
    const searchResults = JSON.parse(localStorage.getItem(storageKey)) || {};
    separator.innerHTML = ''; // Clear existing search results

    for (const city in searchResults) {
        const result = searchResults[city];

        // Create a container for each result
        const resultElement = document.createElement('div');
        resultElement.classList.add('search-result');

        // Display city name
        const cityNameElement = document.createElement('strong');
        cityNameElement.textContent = `${city}: `;
        resultElement.appendChild(cityNameElement);

        // Display weather description and temperature
        const weatherInfoElement = document.createElement('span');
        weatherInfoElement.textContent = `${result.weather[0].description}, ${result.main.temp}°C`;
        resultElement.appendChild(weatherInfoElement);

        separator.appendChild(resultElement);
    }
}

// Function to handle the search button click
// Function to fetch weather data from OpenWeatherMap API
async function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function searchWeather() {
    const cityName = cityInput.value.trim();

    if (cityName === '') {
        alert('Please enter a city name');
        return;
    }

    const weatherData = await getWeather(cityName);

    if (weatherData) {
        // Save search result to local storage
        saveToLocalStorage(cityName, weatherData);

        // Display search results
        displaySearchResults();

        // Reset input value after search
        cityInput.value = '';
    } else {
        alert('Failed to fetch weather data. Please try again.');
    }
}

// Add an event listener to the search button
searchButton.addEventListener('click', searchWeather);

// Add an event listener to the city input for Enter key
cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Display stored search results when the page loads
displaySearchResults();

// delete above if it does not work
const API_KEY = "190a3d5c8f4239c73d6b38d896670514";

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    fetch(WEATHER_API_URL)
.then(res => res.json()).then(data => {
    
    const uniqueForecastDays = [];
    
    const fiveDayForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate);
        }
    })

    cityInput.value = "";
    currentWeather.innerHTML = "";
weatherCards.innerHTML = "";

console.log(fiveDayForecast);

fiveDayForecast.forEach((weatherItem, index) => {
if (index ===0){
    currentWeather.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
}else{

    weatherCards.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));}
});

}).catch(() => {
    alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

fetch(GEOCODING_API_URL)
.then(res => res.json())
.then(data => {
if(!data.length) return alert(`No coordinates found for ${cityName}`);
const { name, lat, lon } = data [0];
getWeatherDetails(name, lat, lon);
})
.catch(() => {
alert("An error occurred while fetching the coordinates!");
});

}

searchButton,addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());