const APP_ID = '21a3286d73cdf9dd407b720554bdd7ba';
const COORDS = 'coords';
const weather = document.querySelector(".weather");

function saveLocation(locationObj) {
  localStorage.setItem(COORDS, JSON.stringify(locationObj));
}

function getWeather(lat, lon) {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APP_ID}&units=metric`,
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
        const name = json.name;
        const weatherName = json.weather[0].main;
        const temperature = json.main.temp;
        weather.innerText = `${weatherName}, ${temperature}°C @ ${name}`;
    });
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const locationObj = {
    lat,
    lon,
  };
  saveLocation(locationObj);
}

function error() {
  console.log('위치정보를 가져올 수 없습니다.');
}
function getLocation() {
  navigator.geolocation.getCurrentPosition(success, error);
}

function paintLocation() {
  const curruentLocation = localStorage.getItem(COORDS);
  if (curruentLocation === null) {
    getLocation();
  } else {
    const parsedLocationObj = JSON.parse(localStorage.getItem(COORDS));
    getWeather(parsedLocationObj.lat, parsedLocationObj.lon);
  }
}

function init() {
  paintLocation();
}

init();
