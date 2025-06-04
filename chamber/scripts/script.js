// Fetch the members data from the JSON file and display it
async function loadDirectory() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();
        const directorySection = document.getElementById('directory');
        if (!directorySection) return;
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
        if (!weatherStatus) return;

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
        const weatherStatus = document.getElementById('weather-status');
        if (weatherStatus) {
            weatherStatus.innerText = 'Failed to load weather data.';
        }
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
        if (!forecastList) return;
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
        const forecastList = document.getElementById('forecast-list');
        if (forecastList) {
            forecastList.innerText = 'Failed to load forecast.';
        }
    }
}

// Set year and last modified
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const lastModifiedEl = document.getElementById('lastModified');
if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;

// Call functions
document.addEventListener('DOMContentLoaded', () => {
    loadDirectory();
    loadCurrentWeather();
    loadWeatherForecast();
    loadSpotlightData();

    const gridBtn = document.getElementById("grid-btn");
    const listBtn = document.getElementById("list-btn");
    const directory = document.getElementById("directory");

    if (gridBtn && listBtn && directory) {
        gridBtn.addEventListener("click", () => {
            directory.classList.add("grid");
            directory.classList.remove("list");
        });

        listBtn.addEventListener("click", () => {
            directory.classList.add("list");
            directory.classList.remove("grid");
        });
    }

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("show");
            menuToggle.textContent = navMenu.classList.contains("show") ? "✖" : "☰";
        });
    }
});

// SPOTLIGHT SECTION
async function loadSpotlightData() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();

        const spotlightContainer = document.getElementById('spotlight-container');
        if (!spotlightContainer) return;

        const spotlightMembers = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
        const shuffled = spotlightMembers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        selected.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('directory-item');

            card.innerHTML = `
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
                        <p><strong>Membership:</strong> ${member.membershipLevel === 3 ? 'Gold' : 'Silver'}</p>
                    </div>
                </div>
            `;

            spotlightContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading spotlight data:', error);
    }
}

// This is the join page!
document.addEventListener("DOMContentLoaded", () => {
    const timestampInput = document.getElementById("timestamp");
    if (timestampInput) {
      const now = new Date();
      timestampInput.value = now.toISOString();
    }
});
 
// Modal functionality
document.querySelectorAll('.membership-card a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const modalId = link.getAttribute('href').replace('#', '');
      document.getElementById(modalId).style.display = 'block';
    });
  });
  
  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }

// Show submitted form data on thankyou.html
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("thankyou.html")) {
      const params = new URLSearchParams(window.location.search);
      const data = {
        "First Name": params.get("fname"),
        "Last Name": params.get("lname"),
        "Email": params.get("email"),
        "Phone": params.get("phone"),
        "Organization": params.get("organization"),
        "Description": params.get("description"),
        "Submitted At": params.get("timestamp")
      };
  
      const card = document.querySelector(".thankyou-card");
      if (card) {
        const details = document.createElement("div");
        details.classList.add("submitted-details");
  
        for (let [key, value] of Object.entries(data)) {
          const p = document.createElement("p");
          p.innerHTML = `<strong>${key}:</strong> ${value || "(not provided)"}`;
          details.appendChild(p);
        }
  
        card.appendChild(details);
      }
    }
  });
  