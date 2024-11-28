const apiKey = '4ff547d0e0204170c4b48ea3818faefa';

let map; // Declare the map variable globally

$(document).ready(function () {
    // Initialize the map if it doesn't exist
    initializeMap();
});

// Function to initialize the map
function initializeMap() {
    if (!map) { // Check if the map is already initialized
        map = L.map('map').setView([20, 0], 2); // Center at [latitude, longitude] and zoom level 2

        // Add a tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Event listener for map clicks
        map.on('click', function (e) {
            const { lat, lng } = e.latlng;
            fetchWeather(lat, lng); // Fetch weather data for the clicked location
        });
    } else {
        console.warn('Map is already initialized.');
    }
}

// Function to fetch weather data by coordinates
function fetchWeather(lat, lng) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

    // Fetch current weather
    $.ajax({
        url: weatherUrl,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            displayWeather(data);
            changeBackground(data.weather[0].main);
        },
        error: function () {
            alert('Unable to fetch weather data.');
        }
    });

    // Fetch 5-day forecast
    $.ajax({
        url: forecastUrl,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            displayForecast(data);
        },
        error: function () {
            alert('Unable to fetch forecast data.');
        }
    });
}

// Function to display current weather
function displayWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    $('#weatherResult').html(`
        <h2>${cityName}</h2>
        <img src="${icon}" alt="Weather Icon">
        <p>Temperature: ${temperature} °</p>
        <p>Feels Like: ${feelsLike} °</p>
        <p>Condition: ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `);
}

// Function to display 5-day forecast
function displayForecast(data) {
    let forecastHTML = '<h3>5-Day Forecast</h3>';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const temp = forecast.main.temp;
        const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        const description = forecast.weather[0].description;

        forecastHTML += `
            <div class="forecast-item">
                <h4>${date}</h4>
                <img src="${icon}" alt="${description}">
                <p>${temp} °</p>
                <p>${description}</p>
            </div>
        `;
    }
    $('#forecast').html(forecastHTML);
}

// Function to change background based on weather condition
function changeBackground(condition) {
    let backgroundImage = '';
    switch (condition.toLowerCase()) {
        case 'clear':
            backgroundImage = 'url(https://i.gifer.com/CZx.gif)';
            break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            backgroundImage = 'url(https://wallpapers-clan.com/wp-content/uploads/2024/08/man-dark-city-in-the-rain-gif-desktop-wallpaper-preview.gif)';
            break;
        case 'clouds':
            backgroundImage = 'url(https://i.makeagif.com/media/8-26-2023/cjaI99.gif)';
            break;
        case 'snow':
            backgroundImage = 'url(https://i.pinimg.com/originals/a2/e7/0e/a2e70ee9920b35d55f9fc6d4b5af21aa.gif)';
            break;
        default:
            backgroundImage = 'url(https://source.unsplash.com/1600x900/?weather)';
    }
    $('body').css('background-image', backgroundImage);
}
