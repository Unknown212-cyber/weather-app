const apiKey = '4ff547d0e0204170c4b48ea3818faefa';

$(document).ready(function () {
    console.log('jQuery and script.js are working!');

    // Event listener for the search button
    $('#searchBtn').click(function () {
        const city = $('#cityInput').val();
        if (city) {
            getWeather(city);
            getForecast(city);
        } else {
            alert('Please enter a city name');
        }
    });

    // Toggle between Celsius and Fahrenheit
    $('#toggleTemp').click(function () {
        const currentUnit = $('#toggleTemp').text();
        const city = $('#cityInput').val();
        if (city) {
            if (currentUnit === 'Show in °F') {
                $('#toggleTemp').text('Show in °C');
                getWeather(city, 'imperial');
                getForecast(city, 'imperial');
            } else {
                $('#toggleTemp').text('Show in °F');
                getWeather(city, 'metric');
                getForecast(city, 'metric');
            }
        }
    });
});

// Function to fetch current weather data
function getWeather(city, units = 'metric') {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            displayWeather(data);
            changeBackground(data.weather[0].main);
        },
        error: function () {
            alert('City not found. Please try again.');
        }
    });
}

// Function to fetch 5-day weather forecast
function getForecast(city, units = 'metric') {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

    $.ajax({
        url: apiUrl,
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
            backgroundImage = 'url(https://media1.giphy.com/media/yLrLQPkyz7dLYshVhO/200.gif?cid=6c09b952hus3aipp0hplnqruj7fy9p6bbcyjyjfstka7c0nj&ep=v1_internal_gif_by_id&rid=200.gif&ct=g)';
            break;
        case 'snow':
            backgroundImage = 'url(https://i.pinimg.com/originals/a2/e7/0e/a2e70ee9920b35d55f9fc6d4b5af21aa.gif)';
            break;
        default:
            backgroundImage = 'url(https://source.unsplash.com/1600x900/?weather)';
    }
    $('body').css('background-image', backgroundImage);
}
