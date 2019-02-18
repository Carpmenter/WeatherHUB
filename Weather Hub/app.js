/*** Main JavaScript logic for Weather Hub */
// API Key: f20d0afcce1a8e9378946a0b3d0f107e
$(document).ready(function() {
    
    // Search button
    var wetObject;

    document.getElementById('search-btn').addEventListener('click', function(){

        let city = document.getElementById('search-fld').value;
/*
        for(let s in city){
            if (city[s] === ' '){
                city[s] = '%20';
            }
        }*/
        //console.log(city);

        /*************** Attempting 404 Error Handling for invalid Cities 
        var req = $.ajax({
            url : "https://api.openweathermap.org/data/2.5/weather?q=Fa&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial",
            dataType : "jsonp",
            timeout : 10000
        });
       
        var test = $.get("https://api.openweathermap.org/data/2.5/weather?q=Fa&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial", function(){
            console.log('success');
        }
        );

        console.log(req);
        req.success(function(data){
            console.log(data);
        });
        
        req.fail(function() {
            console.log('Error!');
        });
        /*****************************************************************/

        $.getJSON('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial', function(data) {

            console.log(Object.keys(data).length);
            if(Object.keys(data).length === 2){
                document.getElementById('search-result').textContent = 'City not found. Try again';
            } else {
               // document.getElementById('search-result').textContent ='Location: ' + data.name + '\nTemperature: ' + data.main.temp + ' Degrees F' + '\nWind Speed: ' + data.wind.speed;
                document.getElementById('search-result').innerHTML = '<table><tbody><tr><td>Location: ' + data.name + '</td></tr><tr><td>Temperature: ' + data.main.temp + '</td></tr><tr><td>Wind Speed: ' + data.wind.speed + '</td></tr></tbody></table>';
                wetObject = data;
                
            }
        });
    
    });
});