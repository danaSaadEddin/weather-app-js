class Forecast {
    constructor() {
        this.key = 'NPGxcmknBNywBjwGMKQniehjKY273Han';
        this.forecastResource = 'http://dataservice.accuweather.com/currentconditions/v1/';
        this.cityResource = 'http://dataservice.accuweather.com/locations/v1/cities/search';
    }
    //get current city forCast info
    async getForecast(cityKey) {
        const query = `${cityKey}?apikey=${this.key}`;
        const response = await fetch(this.forecastResource + query);
        const data = await response.json();
        return data[0];
    }
    // get city info
    async getcity(city) {
        const query = `?apikey=${this.key}&q=${city}`;
        const response = await fetch(this.cityResource + query);
        const data = await response.json();
        return data[0];
    };
    async cityUpdate(city) {
        const cityDetails = await this.getcity(city);
        const forecastupdate = await this.getForecast(cityDetails.Key);
        console.log(cityDetails, forecastupdate);
        return {
            cityDetails: cityDetails,
            forecastupdate: forecastupdate
        };
    };
}


//DOM ELEMENTS
const formWrapper = document.querySelector('.form-wrapper');
const weatherForm = document.querySelector('form');
const cityName = document.querySelector('.cityname h4');
const cityWeather = document.querySelector('.weather-condition h2');
const cityDegree = document.querySelector('.weather-deg .display-3 p');
const dayName = document.querySelector('.day h5');
const weatherIcon = document.querySelector('.wether-icon img');
// creat a forecast object
const forecast = new Forecast();

//showing results on screen
const showDetails = (data) => {
    // background form image changing according to api weather icons
    const iconNum = data.forecastupdate.WeatherIcon;
    if (iconNum < 6) {
        formWrapper.style.backgroundImage = "url('img/sunny2-g.png')";
    } else if (iconNum == 32) {
        formWrapper.style.backgroundImage = "url('img/windy-g.png')";
    } else if (iconNum > 23 && iconNum < 29) {
        formWrapper.style.backgroundImage = "url('img/cold-g.png')";
    } else {
        formWrapper.style.backgroundImage = "url('img/rainy-g.png')";
    }

    // display the weather icons
    weatherIcon.setAttribute('src', `img/icons/${iconNum}.svg`);
    //dispaly text wrapper items on UI
    cityName.textContent = data.cityDetails.EnglishName;
    cityWeather.textContent = data.forecastupdate.WeatherText;
    cityDegree.textContent = data.forecastupdate.Temperature.Metric.Value + ' c';
    //change the temperature degree on click
    cityDegree.addEventListener('click', e => {
        cityDegree.textContent = data.forecastupdate.Temperature.Imperial.Value + ' F';
    })
    dayName.textContent = day[now.getDay()];
    if (data.forecastupdate.IsDayTime) {
        dayName.textContent += "  morning";
    }
    else {
        dayName.textContent += "  night";
    }

}
weatherForm.addEventListener('submit', e => {
    e.preventDefault();
    const city = weatherForm.cityInput.value.trim();
    console.log(city);
    weatherForm.reset();
    forecast.cityUpdate(city)
        .then(data => showDetails(data))
        .catch(err => console.log(err));
    localStorage.setItem('city', city);

});
if (localStorage.getItem('city')) {
    forecast.cityUpdate(localStorage.getItem('city'))
        .then(data => showDetails(data))
        .catch(err => console.log(err));
}

//grap the current day name
const now = new Date();
const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
