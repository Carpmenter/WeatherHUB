/*** Main JavaScript logic for Weather Hub */
// API Key: appid=f20d0afcce1a8e9378946a0b3d0f107e
// Vane api: appid=f20d0afcce1a8e9378946a0b3d0f107e
$(document).ready(function() {
    
    // Search button
    var wetObject, myMap;

    document.getElementById('search-btn').addEventListener('click', function(){

        let city = document.getElementById('search-fld').value;

        /*************** Attempting 404 Error Handling for invalid Cities 
        ******* have some sort of autofill/search for cities to eliminate invalid page (404)*/
        $.ajax({
            url : "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial",
            method: 'GET',
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Text Status: ' + textStatus + ' Error: ' + errorThrown);
                document.getElementById('search-result').textContent = 'City not found. Try again';
            },
            success: function(data, textStatus, jqXHR){

                console.log(Object.keys(data).length);
                document.getElementById('search-result').innerHTML = '<table class="table table-striped table-dark"><tbody><tr><td>Location: ' + data.name + '</td></tr><tr><td>Temperature: ' + data.main.temp + '</td></tr><tr><td>Wind Speed: ' + data.wind.speed + '</td></tr></tbody></table>';
                wetObject = data;
            },
            statusCode: {
                404: function() {
                  console.log( "page not found" );
                }
            }
            
        });
        /*****************************************************************/
        /* weather layer
        $.get("https://tile.openweathermap.org/map/temp_new/3/4/5.png?appid=f20d0afcce1a8e9378946a0b3d0f107e", data,
            function (data, textStatus, jqXHR) {
                $('#map-weather').innerHTML = data;
            }
        );//sat.owm.io/sql/9/143/218?select=b4,b3,b2&order=best&appid=f20d0afcce1a8e9378946a0b3d0f107e
        $.get("https://sat.owm.io/sql/3/96/48?appid=f20d0afcce1a8e9378946a0b3d0f107e", data,
            function (data, textStatus, jqXHR) {
                $('#map-weather').innerHTML = data;
            }
        );*/

    });

    //https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}

    var myMap = L.map('map').setView([46.87, 96.78], 2);
    L.tileLayer('https://tile.openweathermap.org/map/{id}/{z}/{x}/{y}.png?appid={accessToken}', {
        maxZoom: 18,
        id: 'wind_new',
        accessToken: 'f20d0afcce1a8e9378946a0b3d0f107e'
    }).addTo(myMap);
    var marker = L.marker([46.87, 96.78]).addTo(mymap);
    console.log(myMap);
});