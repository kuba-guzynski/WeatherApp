'use strict';

const API_KEY_WEATHERAPP = '92dde5e534957dbb06ed47a155d30ad2';
const API_KEY_GOOGLEMAPS = 'AIzaSyDADIAxXPFEOeOZt1O0F68PSv51ZrgwDvI';

const weatherContainer = document.querySelector('main');
const inputField = document.querySelector('.search-field');
const buttonSearch = document.querySelector('.button-search')
const sectionContainer = document.querySelector('section');



// PObieranie pogody dla konkretnego miasta:

// Użyj API pogodowego, np. OpenWeatherMap (https://api.openweathermap.org/data/2.5/weather?q={miasto}&appid={twój_klucz_api}), aby pobrać informacje o aktualnej pogodzie. Zadanie polega na wyświetleniu temperatury, opisu pogody i wilgotności dla wybranego miasta.


const getYourPosition = async function () {
    try {
        const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));

        if (!position.ok)
            throw new Error(`Nie udało się pobrać Twojej lokalizacji.`);

        return position;


    } catch (error) {
        console.error(`wystąpił błąd `, error);
    }
}
// getYourPosition()
//     .then(position => {

//     })
//     .catch(err => console.log(err));






//-----------------LOCATION-----------------


//funkcja tworząca zapytanie do API Google Maps która zwraca nam informację o danej miejscowości, funkcja asynchroniczna zwraca nam dane o tej miejscowości 
const getPosition = async function (location) {
    try {
        const position = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY_GOOGLEMAPS}`);
        if (!position.ok) {
            throw new Error(`Nie udało się pobrać danych o lokalizacji`);
        }
        const dataPosition = await position.json();
        return dataPosition;
    } catch (error) {
        console.error("Błąd zapytania", error);
    }

}

//-----------------TIME-----------------

//funkcja która zwraca dzień 

const createDate = function () {
    return new Date();
}

const getNameOfDay = function () {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const today = createDate()
    const todayNameOfDay = daysOfWeek[today.getDay()];
    return todayNameOfDay;
}

const getTime = function () {
    const now = createDate()
    const nowHour = now.getHours();
    const nowMinutes = now.getMinutes();
    if (nowMinutes < 10) {
        return `${nowHour}:0${nowMinutes}`;
    }
    else {
        return `${nowHour}:${nowMinutes}`;
    }
}




//generuje kod html na podstawie danych zwróconych przez funkcję asynchroniczną getWeather();
const getDataWeather = function (data, day, time) {
    const html = `
    
    <div class="section-left">
        <div>
        <div class="name-of-city">${data.name} <a></br>${((data.main?.temp ?? null) - 273.15).toFixed(1)}ºC</a></div>
        <div class="wind">
            <img src="./images/svgItem/air-icon.svg" alt="wind-icon">
            <a>wind speed: ${data.wind.speed} km/h</a>
        </div>
        <div class="weather-condition">${data.weather?.[0]?.main ?? null}</div>
        </div>
        <div>
        <div class="date-and-hours">${day} : ${time}</div>
    </div>
    </div>
    <div class="section-right">
        <div class="weather-icon">
            <img src="./images/svgItem/${data.weather?.[0]?.icon ?? null}.svg" alt="weather-icon">
        </div>
    </div>

`;
    sectionContainer.innerHTML = "";
    sectionContainer.insertAdjacentHTML('afterBegin', html);
    sectionContainer.classList.remove('hidden');
}

//funkcja pobiera w argumencie informację o miejscu następnie miejsce jest przekazywane do funkcji asynchronicznej która zwraca nam długość i szerokość geograficzną wyszukanego miejsca a następnie tworzy zapytanie do API OpenWeatherMap i uruchamia funkcje która dodaje kod html do index.html 
const getWeather = async function (place) {
    const position = await getPosition(place);
    const lat = position.results?.[0]?.geometry?.location?.lat ?? null
    const lng = position.results?.[0]?.geometry?.location?.lng ?? null

    try {
        const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY_WEATHERAPP}`);
        if (!weather.ok) {
            throw new Error(`Nie udało się osiągnąć wyniku ządania`);
        }
        const data = await weather.json();

        //wywołanie funkcji która daje nam nazwe dnia
        const nameOfDay = getNameOfDay();

        //wywołanie funkcji która daje nam aktualną godzinę 

        const time = getTime();


        getDataWeather(data, nameOfDay, time)
    } catch (error) {
        console.error("Błąd podczas pobierania aktualnej pogody ", error);
    }


}


//eventListener do pobierania danych z pola input po naciśnięciu enter + (po naciśnięciu search w późniejszej implementacji)
inputField.addEventListener('change', function (e) {
    const place = e.target.value;
    getWeather(place);
})

buttonSearch.addEventListener('click', function () {
    getWeather(inputField.value);
})







// getPosition('roczyny');

// getPositionAsync();

// getWeather();
// getYourPosition();
// console.log(inputField);


