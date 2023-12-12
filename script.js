'use strict';

const API_KEY_WEATHERAPP = '92dde5e534957dbb06ed47a155d30ad2';
const API_KEY_GOOGLEMAPS = 'AIzaSyDADIAxXPFEOeOZt1O0F68PSv51ZrgwDvI';

const weatherContainer = document.querySelector('main');

// PObieranie pogody dla konkretnego miasta:

// Użyj API pogodowego, np. OpenWeatherMap (https://api.openweathermap.org/data/2.5/weather?q={miasto}&appid={twój_klucz_api}), aby pobrać informacje o aktualnej pogodzie. Zadanie polega na wyświetleniu temperatury, opisu pogody i wilgotności dla wybranego miasta.







//funkcja tworząca zapytanie do API Google Maps która zwraca nam informację o danej miejscowości, funkcja asynchroniczna zwraca nam dane o tej miejscowości 


const getPosition = async function (location) {
    try {
        const position = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY_GOOGLEMAPS}`);
        if (!position.ok) {
            throw new Error(`Nie udało się pobrać danych o lokalizacji`);
        }
        const dataPosition = await position.json();

        // const resultArrayLat = dataPosition.results?.[0]?.geometry?.location?.lat ?? null
        return dataPosition;
    } catch (error) {
        console.error("Błąd zapytania", error);
    }

}

const getDataWeather = function (data) {


    const html = `
    <section>
    <div class="section-left">
        <div class="name-of-city">${data.name} <a>${((data.main?.temp ?? null) - 273.15).toFixed(1)}ºC</a></div>
        <div class="wind">
            <img src="./images/svgItem/air-icon.svg" alt="wind-icon">
            <a>wind speed: ${data.wind.speed} km/h</a>
        </div>
        <div class="weather-condition">${data.weather?.[0]?.main ?? null}</div>
        <div class="date-and-hours">Tuesday : 19:52</div>
    </div>
    <div class="section-right">
        <div class="weather-icon">
            <img src="./images/svgItem/${data.weather?.[0]?.icon ?? null}.svg" alt="weather-icon">
        </div>
    </div>
</section> 
`;

    weatherContainer.insertAdjacentHTML('afterend', html);
    // weatherContainer.style.opacity = 1;




}

const getWeather = async function () {
    const position = await getPosition('roczyny');
    const lat = position.results?.[0]?.geometry?.location?.lat ?? null
    const lng = position.results?.[0]?.geometry?.location?.lng ?? null

    try {
        const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY_WEATHERAPP}`);
        if (!weather.ok) {
            throw new Error(`Nie udało się osiągnąć wyniku ządania`);
        }
        const data = await weather.json();
        console.log(data);
        getDataWeather(data)
    } catch (error) {
        console.error("Błąd podczas pobierania aktualnej pogody ", error);
    }


}

// getPosition('roczyny');

// getPositionAsync();

getWeather();