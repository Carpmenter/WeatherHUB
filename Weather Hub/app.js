/*** Main JavaScript logic for Weather Hub */
// API Key: f20d0afcce1a8e9378946a0b3d0f107e
$(document).ready(function() {
    
    // Search button
var wData;

    $.getJSON('https://api.openweathermap.org/data/2.5/weather?q=Fargo&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial', function(data) {
        wData = data;
        //wData = data;
    });
    document.getElementById('test').addEventListener('click', function(){
        document.getElementById('cur-weather').textContent ='Location: ' + wData.name + '\nTemperature: ' + wData.main.temp + ' Degrees F' + '\nWind Speed: ' + wData.wind.speed;
    });

});