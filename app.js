/*** Main JavaScript logic for Weather Hub */
// API Key: appid=f20d0afcce1a8e9378946a0b3d0f107e
// Vane api: appid=f20d0afcce1a8e9378946a0b3d0f107e
// Map Box: pk.eyJ1IjoibmNhcnBlbnQiLCJhIjoiY2pzZG0zbzkwMGhtdzQzdGw1NXl3ZTZqaCJ9.tERAKAxtU9bUPifk1FprZQ
$(document).ready(function() {
    
    // Search button
    var wetObject, myMap;
    init();

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

                $.getJSON('https://api.openweathermap.org/data/2.5/forecast?q=' + data.name +'&appid=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial', function(content){
                    for (item in content){
                        $('5-weather').append('<div>' + item + '</div>');
                    }
                    $('5-weather').append('<div>' + content.name + '</div>');
                });

                console.log(Object.keys(data).length);
                document.getElementById('search-result').innerHTML = '<table class="table table-striped table-dark"><tbody><tr><td>Location: ' 
                + data.name + '</td></tr><tr><td>Temperature: ' + data.main.temp + '</td></tr><tr><td>Wind Speed: ' + data.wind.speed + '</td></tr></tbody></table>';
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

    var myMap = L.map('map').setView([46.87, -96.78], 6);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmNhcnBlbnQiLCJhIjoiY2pzZG0zbzkwMGhtdzQzdGw1NXl3ZTZqaCJ9.tERAKAxtU9bUPifk1FprZQ', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
		id: 'mapbox.streets'
    }).addTo(myMap);
    
    L.tileLayer('https://tile.openweathermap.org/map/{id}/{z}/{x}/{y}.png?appid={accessToken}', {
        maxZoom: 18,
        id: 'temp_new',
        accessToken: 'f20d0afcce1a8e9378946a0b3d0f107e'
    }).addTo(myMap);

    var marker = L.marker([46.87, -96.78]).addTo(myMap);
    console.log(myMap);


    /********* EVENTS ************/
    
    $( "#search-fld" ).click(function(){
        $(this).val('');
    });

    /****************************/

    function init(){
        //document.getElementById('city-1').innerHTML = 'Miami';
        $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=Fargo&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial", 
            function (data) {
                $('#city-1').html('<table class="table table-striped table-dark"><tbody><tr><td>Location: ' + data.name + '</td></tr><tr><td>Temperature: ' 
                + data.main.temp + ' F</td></tr><tr><td>Wind Speed: ' + data.wind.speed + '</td></tr></tbody></table>');
        });

        $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=Denver&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial", 
            function (data) {
                $('#city-2').html('<table class="table table-striped table-dark"><tbody><tr><td>Location: ' + data.name + '</td></tr><tr><td>Temperature: ' 
                + data.main.temp + ' F</td></tr><tr><td>Wind Speed: ' + data.wind.speed + '</td></tr></tbody></table>');
        });

        $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=Calgary&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial", 
            function (data) {
                $('#city-3').html('<table class="table table-striped table-dark"><tbody><tr><td>Location: ' + data.name + '</td></tr><tr><td>Temperature: ' 
                + data.main.temp + ' F</td></tr><tr><td>Wind Speed: ' + data.wind.speed + '</td></tr></tbody></table>');
        });

        $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=Miami&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial", 
            function (data) {
                $('#city-4').html('<table class="table table-striped table-dark"><tbody><tr><td>Location: ' + data.name + '</td></tr><tr><td>Temperature: ' 
                + data.main.temp + ' F</td></tr><tr><td>Wind Speed: ' + data.wind.speed + '</td></tr></tbody></table>');
        });
        
    }
});