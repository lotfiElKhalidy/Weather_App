const notificationElt = document.querySelector(".notification")
const weatherIconElt = document.querySelector(".weather-icon")
const temperatureElt = document.querySelector(".temperature-value p")
const descriptionElt = document.querySelector(".temperature-description p")
const locationElt = document.querySelector(".location p")

//Data
const weather = {}

weather.temperature = {
    unit: "celsius"
}

const KELVIN = 273
//API key
const key = "82005d27a116c2880c8f0fcb866998a0"

// Verify is geolocation is enabled or not
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError)
}
else {
    notificationElt.style.display = "block"
    notificationElt.innerHTML = "<p>Your browser doesn't support geolocation</p>"
}

function setPosition(position) {
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
    getWeather(latitude, longitude)
}

function showError(error) {
    notificationElt.style.display = "block"
    notificationElt.innerHTML = `<p>${error.message}</p>`
}

function displayWeather() {
    weatherIconElt.innerHTML = `<img src="icons/${weather.iconId}.png"/>`
    temperatureElt.innerHTML = `${weather.temperature.value} ° C`
    descriptionElt.innerHTML = weather.description
    locationElt.innerHTML = `${weather.city}, ${weather.country}`
}

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`

    fetch(api)
        .then(function(response) {
            let data = response.json()
            console.log(data)
            return data
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN)
            weather.description = data.weather[0].description
            weather.iconId = data.weather[0].icon
            weather.city = data.name
            weather.country = data.sys.country
        })
        .then(function() {
            displayWeather()
        })
}


function celsiusToFahrenheit(temperature) {
    tempInFhrenheit = (temperature * 9/5 ) + 32
    return tempInFhrenheit
}

function fahrenheitToCelsius(temperature) {
    tempInClesius = (temperature - 32) * 5/9
    return tempInCelsius
}

temperatureElt.addEventListener("click", function() {
    // To prevent errors when the user clicks and we have not collected any data
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit === "celsius") {
        let tempInFahrenheit = celsiusToFahrenheit(weather.temperature.value)

        // To dislay our value temperature as an integer
        tempInFahrenheit = Math.floor(tempInFahrenheit)
        temperatureElt.innerHTML = `${tempInFahrenheit}° F`
        weather.temperature.unit = "fahrenheit"
    }
    else if (weather.temperature.unit === "fahrenheit") {
        temperatureElt.innerHTML = `${weather.temperature.value}° C`
        weather.temperature.unit = "celsius"
    }
})



