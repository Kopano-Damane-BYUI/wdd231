// Fetch the members data from the JSON file and display it
async function loadDirectory() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();
        const directorySection = document.getElementById('directory');
        directorySection.innerHTML = '';

        members.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.classList.add('directory-item');

            memberCard.innerHTML = `
                <div class="card-heading">
                    <h3>${member.name}</h3>
                    <p>Business tag line name</p>
                </div>
                <div class="card-body">
                    <div class="card-image">
                        <img src="images/${member.image}" alt="${member.name}" />
                    </div>
                    <div class="card-content">
                        <p>${member.address}</p>
                        <p><strong>Phone:</strong> ${member.phone}</p>
                        <p><a href="${member.website}" target="_blank">${member.website}</a></p>
                    </div>
                </div>
            `;

            directorySection.appendChild(memberCard);
        });
    } catch (error) {
        console.error('Error loading member data:', error);
    }
}

// Fetch current weather
async function loadCurrentWeather() {
    const apiKey = '4d31b69405641592c0c633743b6e1ffe'; 
    const city = 'Timbuktu';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const weatherStatus = document.getElementById('weather-status');

        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const tempMin = data.main.temp_min;
        const tempMax = data.main.temp_max;
        const humidity = data.main.humidity;
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        
        weatherStatus.innerHTML = `
            <div class="current-weather" style="display: flex; gap: 20px;">
                <div class="weather-icon">
                    <img src="images/icon-cloudy-color.png" alt="Cloudy Icon" />
                </div>
                <div class="weather-content">
                    <div class="current-temp">
                        <h3>${temperature}°C</h3>
                        <p>${description}</p>
                    </div>
                    <div class="weather-details">
                        <p><strong>High:</strong> ${tempMax}°C</p>
                        <p><strong>Low:</strong> ${tempMin}°C</p>
                        <p><strong>Humidity:</strong> ${humidity}%</p>
                        <p><strong>Sunrise:</strong> ${sunrise}</p>
                        <p><strong>Sunset:</strong> ${sunset}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading weather data:', error);
        document.getElementById('weather-status').innerText = 'Failed to load weather data.';
    }
}

// Forecast: show ONLY temperature or "Data not available"
async function loadWeatherForecast() {
    const apiKey = '4d31b69405641592c0c633743b6e1ffe';
    const city = 'Timbuktu';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        const forecastList = document.getElementById('forecast-list');
        forecastList.innerHTML = '';

        const desiredDays = ['Today', 'Wednesday', 'Thursday'];
        const daysData = {};

        const todayName = new Date().toLocaleDateString('en', { weekday: 'long' });

        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en', { weekday: 'long' });

            const label = (dayName === todayName) ? 'Today' : dayName;

            if (desiredDays.includes(label) && !daysData[label]) {
                daysData[label] = forecast.main.temp;
            }
        });

        desiredDays.forEach(day => {
            if (daysData[day] !== undefined) {
                forecastList.innerHTML += `
                    <div class="forecast-item">
                        <h4>${day}: <strong>${daysData[day].toFixed(1)}°C</strong></h4>
                    </div>
                `;
            } else {
                forecastList.innerHTML += `
                    <div class="forecast-item">
                        <h4>${day}: <strong>Data not available</strong></h4>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error('Error loading weather forecast:', error);
        document.getElementById('forecast-list').innerText = 'Failed to load forecast.';
    }
}

// Set year and last modified
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Call functions
loadDirectory();
loadCurrentWeather();
loadWeatherForecast();

// Toggle views
document.getElementById("grid-btn").addEventListener("click", () => {
    const directory = document.getElementById("directory");
    directory.classList.add("grid");
    directory.classList.remove("list");
});

document.getElementById("list-btn").addEventListener("click", () => {
    const directory = document.getElementById("directory");
    directory.classList.add("list");
    directory.classList.remove("grid");
});

// Responsive menu toggle
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    menuToggle.textContent = navMenu.classList.contains("show") ? "✖" : "☰";
});
