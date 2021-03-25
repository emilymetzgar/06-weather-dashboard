$(document).ready(function () {
    //store variables for weather data to display on html and apis
    var historyContainer = $('#old-searches');
    var formSearch = $('#search');
    var todayContainer = $('#today');
    var forecastContainer = $('#forecast');
    var apiKey = 'd52bfbcfacc4ca103f3cb67d31cb1af6';
    var baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';
    var baseUrl2 = 'https://api.openweathermap.org/data/2.5/forecast?';
    var iconUrl = 'http://openweathermap.org/img/w/';
    var baseUviURL = 'https://api.openweathermap.org/data/2.5/onecall?';
    var historySearches = [];
    // when a user searches for a city, run this function
        formSearch.submit(function (event) {
        event.preventDefault();

        // this = this form that was submitted
        var values = $(this).serializeArray();
        var cities = values[0].value;
        //create element w/jQuery selector
        var searchDiv = $('<button type = "button" class= "btn search-div">');
        searchDiv.click(function (event) {
            event.preventDefault();
        });
        historySearches.push(cities); //push user city search with actual cities from api
        localStorage.setItem('historySearches', JSON.stringify(historySearches));
        searchDiv.text(cities);
        //historyContainer.append(searchDiv);

        //actual data retreived from user in form to run search functions 
        //for todays weather and 5 day forecast
        searchWeather(cities);
        searchForecast(cities);

    });
    //function to search weather data based on city
    //fetches url 
    function searchWeather(cities) {
        var wholeUrl = baseUrl + "q=" + cities + "&appid=" + apiKey;

        fetch(wholeUrl)
            //then JSON

            .then(function (response) {
                return response.json();
            }) //and then fetch data with specific data
            .then(function (data) {

                var wind = data.wind;
                var humid = data.main.humidity;
                var citiesNames = data.name;
                var temperatures = data.main.temp;
                var weather = data.weather;
                var iconUrlArr = iconUrl + weather[0].icon + '.png';
                var namesDiv = $("<div class = 'display-cities-names'>"); //show on html
                var humidDiv = $("<div class = 'display-humid'>"); //show on html
                var tempsDiv = $("<div class = 'display-temps'>"); //show on html
                var windyDiv = $("<div class = 'display-windy'>"); //show on html
                var weatherImg = $("<img class = 'icon-name' />"); //show on html
                weatherImg.attr('src', iconUrlArr); //show on html
                namesDiv.text(citiesNames); //show on html
                tempsDiv.text("Temperature: " + temperatures); //show on html
                humidDiv.text("Humidity: " + humid + "%"); //show on html
                windyDiv.text("Wind Speeds: " + wind.speed + "MPH"); //show on html
                todayContainer.append(weatherImg); //append to today container on html
                todayContainer.append(namesDiv); //append to today container on html
                todayContainer.append(tempsDiv); //append to today container on html
                todayContainer.append(humidDiv); //append to today container on html
                todayContainer.append(windyDiv); //append to today container on html

            });
    }
    //search future weather, 5 day forecast
    function searchForecast(cities) {
        var forecastBaseUrl2 = baseUrl2 + "q=" + cities + "&appid=" + apiKey;
        fetch(forecastBaseUrl2).then(function (rawResponse) {
            return rawResponse.json()
        }).then(function (data) {
            var coordinates = data.city.coord;
            getUVI(coordinates.lat, coordinates.lon);
            //array that collects data for 5 day forecast

            for (var i = 0; i < data.list.length; i++) {
                //update at specific time and use moment for date
                var timeThreeOClock = data.list[i].dt_txt.search('15:00:00');
                var cityName = data.city.name;
                if (timeThreeOClock > -1) {
                    var forecastTime = data.list[i];
                    var temp = forecastTime.main.temp;
                    var wind = forecastTime.wind;
                    var humid = forecastTime.main.humidity;
                    var day = moment(forecastTime.dt_txt).format('dddd, MMMM Do');
                    var weather = forecastTime.weather;
                    var iconUrlArr = iconUrl + weather[0].icon + '.png';

                    var rows = $("<div class='col-2'>")
                    var dayDiv = $("<div class = 'display-day'>");
                    var humidDiv = $("<div class = 'display-humid'>");
                    var tempsDiv = $("<div class = 'display-temps'>");
                    var windyDiv = $("<div class = 'display-windy'>");
                    var weatherImg = $("<img class = 'icon-name' />")
                    weatherImg.attr('src', iconUrlArr)
                    dayDiv.text(day);
                    tempsDiv.text("Temperature: " + temp);
                    humidDiv.text("Humidity: " + humid + "%");
                    windyDiv.text("Wind Speeds: " + wind.speed + "MPH");
                    rows.append(weatherImg);
                    rows.append(dayDiv);
                    rows.append(humidDiv);
                    rows.append(tempsDiv);
                    rows.append(windyDiv);
                    forecastContainer.append(rows);
                }
            }
        });

        function clearResults() {
            $('#forecast').html('');
            $('#today').html('');
        }




        function getUVI(lat, lon) {
            //lat=33.441792&lon=-94.037689&exclude=hourly,daily&appid={API key}
            var UviURL = baseUviURL + 'lat=' + lat + '&lon=' + lon + '&exclude=hourly,daily&appid=' + apiKey;
            fetch(UviURL).then(function (response) {
                return response.json();
            }).then(function (data) {
                var uviInfo = data.current.uvi;
                todayContainer.append("UV Index: " + uviInfo);
            });
        } //store in local storage, get from local storage, display on html
        function getHistorySearches() {
            if (localStorage.getItem('historySearches')) {
                historySearches = JSON.parse(localStorage.getItem('historySearches'));
                for (var i = 0; i < historySearches.length; i++) {
                    var searchDiv = $('<button type = "button" class= "btn search-div">');
                    searchDiv.click(function (event) {
                        event.preventDefault();
                        var $this = $(event.target);
                        var city = $this.text();
                        searchWeather(city);
                        searchForecast(city);

                    });
                    searchDiv.text(historySearches[i]);
                    historyContainer.append(searchDiv);

                }
            }
        }

        getHistorySearches();
        clearResults();
    }
});