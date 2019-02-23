/*** Main JavaScript logic for Weather Hub */
// API Key: appid=f20d0afcce1a8e9378946a0b3d0f107e
// Vane api: appid=f20d0afcce1a8e9378946a0b3d0f107e
// Map Box: pk.eyJ1IjoibmNhcnBlbnQiLCJhIjoiY2pzZG0zbzkwMGhtdzQzdGw1NXl3ZTZqaCJ9.tERAKAxtU9bUPifk1FprZQ
$(document).ready(function() {
    
    // Search button
    var wetObject, myMap, globalCity, mapMarker;

    init();

    document.getElementById('search-btn').addEventListener('click', getResults);
    document.getElementById('search-fld').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) { getResults(); }
    });

    /********* EVENTS ************/
    
    $( "#search-fld" ).click(function(){
        $(this).val('');
    });

    /***************************************************************************************/
    /************************ Function Declarations ***************************************/

    function getResults(){

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
                $('#forecast').html('');
                globalCity = data.name;
                getForecast();

                myMap.setView([data.coord.lat, data.coord.lon], 4);
                mapMarker.setLatLng([data.coord.lat, data.coord.lon]);

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
    }

    function getForecast(){
        $.getJSON('https://api.openweathermap.org/data/2.5/forecast?q=' + globalCity +'&appid=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial', function(content){

                    /* Re structure so this anon function is updating forecast after search and have
                     * the forecast content populate to a defualt city when page loads
                     * content.list[0-7]: Day 1
                     * content.list[8-15]: Day 2
                     *  1) get highest and lowest of 7 values
                     *      - content.list[i].main.temp
                     *  2) get average weather type by looping through 40 elements and count each type
                     *      - content.list[i].weather[0].main 
                     *  3) get total precip during day looping and adding 
                     *      - content.list[i].rain if temp >=32
                     *      - else content.list[i].snow
                     *  4) get the date
                     *      - content.list[0].dt_txt -> "2019-02-22 00:03:00"
                     * */
            for (let i = 2; i<40; i+=8){
                    var date = content.list[i].dt_txt;
                    let image = weatherType(content.list[i].weather[0].main);
                    $('#forecast').append('<div class="col forecast-ctn numberFont border"><div class="forecast-date">' + date.substring(5, 10) +'</div><div class="forecast-high">' + Math.round(content.list[i+2].main.temp) + 
                    ' F</div><div class="forecast-low">' + Math.round(content.list[i].main.temp) + ' F</div><div class="forecast-img">' + content.list[i].weather[0].main + '</div></div>');
                }
            });
    }

    function init(){
        globalCity = "Fargo";
        myMap 
        var url = ['https://api.openweathermap.org/data/2.5/weather?q=Fargo&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial',
            'https://api.openweathermap.org/data/2.5/weather?q=Denver&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial',
            'https://api.openweathermap.org/data/2.5/weather?q=Banff&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial',
            'https://api.openweathermap.org/data/2.5/weather?q=Miami&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial'];
        
        for (let i = 1; i < 5; i++){
            $.getJSON(url[i-1], function (data) {
                $('#city-' + i).html('<div class="city-data city-name">' + data.name + '</div><div class="city-data city-temp ' + tempColor(data.main.temp) + '">' + data.main.temp 
                + ' F</div><div class="city-data">' + data.wind.speed + ' mph</div>');
            });
        }

        getForecast();

        /*****   Default Map Setup    *****/ 
        myMap = L.map('map').setView([46.87, -96.78], 4);
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
    
        mapMarker = L.marker([46.87, -96.78]).addTo(myMap);
        
    }

    function weatherType(weather){
        switch (weather){
            case 'Snow': return ""
        }
    }

    // Returns a color for the given temperature
    function tempColor(temp){
        let color;
        switch (true){
            case (temp < -15): 
                color = 'pink';
                break;
            case (temp < 0):
                color = 'purple';
                break;
            case (temp < 15):
                color = 'blue';
                break;
            case (temp < 32):
                color = 'light-blue';
                break;  
            case (temp < 50):
                color = 'green';
                break; 
            case (temp < 65):
                color = 'yellow-green';
                break;
            case (temp < 75):
                color = 'yellow';
                break;
            case (temp < 90):
                color = 'orange';
                break;
            default:
                color = 'red';
                break;
        }
        return color;
    }
     /************************* Function Declarations END ******************************************/
     /**********************************************************************************************/
});