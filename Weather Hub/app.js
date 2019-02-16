/*** Main JavaScript logic for Weather Hub */
// API Key: f20d0afcce1a8e9378946a0b3d0f107e
$(document).ready(function() {
    
    // Search button
    var wetObject;

    document.getElementById('search-btn').addEventListener('click', function(){

        let city = document.getElementById('search-fld').value;
        $.getJSON('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial', function(data) {
            if(Object.keys(data).length === 2){
                document.getElementById('cur-weather').textContent = 'City not found. Try again';
            } else {
                document.getElementById('cur-weather').textContent ='Location: ' + data.name + '\nTemperature: ' + data.main.temp + ' Degrees F' + '\nWind Speed: ' + data.wind.speed;
                wetObject = data;
            }
        });
    });
});