const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=190a3d5c8f4239c73d6b38d896670514`

fetch(GEOCODING_API_URL)
.then(res => res.json())
.then(data => {
console.log(data)
})
.catch(() => {
alert("An error occurred while fetching the coordinates!");
});

}

searchButton,addEventListener("click", getCityCoordinates);