const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeather = document.querySelector(".current-weather");
const weatherCards = document.querySelector(".weather-cards");

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