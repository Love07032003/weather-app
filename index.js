// const { async } = require("postcss-js");

// const { Container } = require("postcss");

// console.log("hello jee Love");

// const API_key = "2e47f0eec484191f0f24b3734951f893";

// // let API_key = "d1845658f92b31c64bd94f06f7188c9c";

// function renderWeatherInfo(data) {
//      let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)}  ºC`;

//     document.body.appendChild(newPara);
    
// }
// async function fetchWeatherDetails() {
//     // let latitude = 15.3333;
//     // let longitude = 74.0833;

//     try {
//     let city = "alwar";
   

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

//     const data = await response.json();

//     console.log("weather data:-> " , data);

//     // let newPara = document.createElement('p');
//     // newPara.textContent = `${data?.main?.temp.toFixed(2)}  ºC`;

//     // document.body.appendChild(newPara);
//     renderWeatherInfo(data);
//     }
//     catch (err) {
        
//     }

// }

// async function getWeatherDetails() {

//     try {
//         let latitude = 15.3333;
//         let longitude = 74.0833;

//         const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}&units=metric`)

//         const data = await result.json();
//         console.log("weather data:-> " , data);
//         renderWeatherInfo(data);


//     } catch (err) {
//         console.log("error found" , err);
//     }
    
// }


// function getLocation() {
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("geolocation not supported");
//     }
    
// }

// function showPosition(x) {

//     let lat = x.coords.latitude;
//     let longi = x.coords.longitude;

//     console.log(lat);
//     console.log(longi);
    
// }


const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-Container")

const grantAccessContainer= document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-conatiner");


const API_key = "2e47f0eec484191f0f24b3734951f893";

let currentTab = userTab;
currentTab.classList.add("current-tab");

getFromSessionStorage();

function switchTab(clickedTab) {
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //i am in search tab, visible ur weather tab

            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getFromSessionStorage();
        }
    }
}


userTab.addEventListener('click',() => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click',() => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
});


// check if coordinates are already present in session storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // local coordinate nhi mile to
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;

    // make grantConatainer invisible

    grantAccessContainer.classList.remove("active");

    // makeloader visible

    loadingScreen.classList.add("active");

    // api call

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);

        const data = await response.json();

        // loader hta do
        loadingScreen.classList.remove("active");

        // user info invisible
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        loadingScreen.classList.remove("active");
        console.log("error found", err);
    }
    
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");

    const countryIcon = document.querySelector("[data-countryIcon]");

    const desc = document.querySelector("[data-weatherDesc]");

    const weatherIcon = document.querySelector("[data-weatherIcon]");

    const temp = document.querySelector("[data-temp]");

    const windSpeed = document.querySelector("[data-windSpeed]");

    const humidity = document.querySelector("[data-humidity]");

    const cloudiness = document.querySelector("[data-cloudiness]");

        // fetch values from weatherInfo object and put in ui elemets
        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

        desc.innerText = weatherInfo?.weather?.[0]?.description;

        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity} %`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

const grantAccessButton = document.querySelector("[data-grantAccess]");

function getLocation() {

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('not supported');
    }
    
}


function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates);
    
}

grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");
const btn = document.querySelector("[search-btn]")

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if(searchForm.value === "")
        return;

    else
        fetchSearchWeatherInfo(searchInput.value);

        
});

async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    } catch (err) {
        alert('enter a city');
    }


    
}