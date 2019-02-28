/*** Main JavaScript logic for Weather Hub */
// API Key: appid=f20d0afcce1a8e9378946a0b3d0f107e
// Vane api: appid=f20d0afcce1a8e9378946a0b3d0f107e
// Map Box: pk.eyJ1IjoibmNhcnBlbnQiLCJhIjoiY2pzZG0zbzkwMGhtdzQzdGw1NXl3ZTZqaCJ9.tERAKAxtU9bUPifk1FprZQ
$(document).ready(function() {
    
    // Search button
    var myMap, globalCity, mapMarker;
    var mapLayers = [];
    
    //State//
    var layerState, currentColor;

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

    // Handling layer selection for map
    $('#layer-1').click(function(){
        if(layerState !== undefined){
            mapLayers[layerState].remove();
            $('#layer-' + layerState).toggleClass('active-layer');
        }
        $(this).toggleClass('active-layer');
        mapLayers[1].addTo(myMap);
        layerState = 1;
    });
    $('#layer-0').click(function(){
        if(layerState !== undefined){
            mapLayers[layerState].remove();
            $('#layer-' + layerState).toggleClass('active-layer');
        }
        $(this).toggleClass('active-layer');
        mapLayers[0].addTo(myMap);
        layerState = 0;
    });
    $('#layer-3').click(function(){
        if(layerState !== undefined){
            mapLayers[layerState].remove();
            $('#layer-' + layerState).toggleClass('active-layer');
        }
        $(this).toggleClass('active-layer');
        mapLayers[3].addTo(myMap);
        layerState = 3;
    });
    $('#layer-2').click(function(){
        if(layerState !== undefined){
            mapLayers[layerState].remove();
            $('#layer-' + layerState).toggleClass('active-layer');
        }
        $(this).toggleClass('active-layer');
        mapLayers[2].addTo(myMap);
        layerState = 2;
    });

    // handling click events for city banner
    $('#city-1').click(function(){
        $('#search-fld').val($('#cityname-1').html());
        getResults();
    });
    $('#city-2').click(function(){
        $('#search-fld').val($('#cityname-2').html());
        getResults();
    });
    $('#city-3').click(function(){
        $('#search-fld').val($('#cityname-3').html());
        getResults();
    });
    $('#city-4').click(function(){
        $('#search-fld').val($('#cityname-4').html());
        getResults();
    });

    /***************************************************************************************/
    /************************ Function Declarations ***************************************/

    function getResults(city){
        // change so this method can be called from seperate links on page
        var initLoad = true;
        var defColor = currentColor;
        if(city === undefined){
            city = document.getElementById('search-fld').value;
            initLoad = false;
        }

        /*************** Attempting 404 Error Handling for invalid Cities 
        ******* have some sort of autofill/search for cities to eliminate invalid page (404)*/
        $.ajax({
            url : "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial",
            method: 'GET',
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Text Status: ' + textStatus + ' Error: ' + errorThrown);
                document.getElementById('search-fld').value = 'City not found. Try again'; //Uncaught TypeError: Cannot set property 'textContent' of null
            },
            success: function(data, textStatus, jqXHR){
                $('#forecast').html('');
                globalCity = data.name;
                currentColor = tempColor(data.main.temp);
                getForecast();

                myMap.setView([data.coord.lat, data.coord.lon], 4);
                mapMarker.setLatLng([data.coord.lat, data.coord.lon]);

                $('#location-main').html(data.name);
                $('#temp-main-val').html(Math.round(data.main.temp) + '° F');
                $('#temp-main-val').removeClass(defColor);
                $('#temp-main-val').addClass(currentColor);
                $('#prec-main').html(data.weather[0].description);
                $('#wind-main').html(Math.round(data.wind.speed) + ' mph');
                $('#temp-main-img').css('background-image', "url('images/Weather-Icons/" + data.weather[0].main + ".png')");
                
                if(!initLoad){ document.getElementById('main-row').scrollIntoView(); }
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
           
            $('#forecast').html('');
            var count = 0;

            // loop through 5-day array (content.list[40]) and get high/low for each day
            for (let i=0; i<5; i++){
                var highs = [];
                var lows = [];

                for (let j=0; j<8; j++){
                    if(count === content.cnt){
                        highs.push(content.list[count-1].main.temp);
                        lows.push(content.list[count-1].main.temp);
                        count--;
                    } else{
                        highs.push(content.list[count].main.temp);
                        lows.push(content.list[count].main.temp);
                    }
                    count++;
                }

                $('#forecast-hdr').html(globalCity + ' 5-day Forecast');
                $('#forecast').append('<div class="col forecast-ctn numberFont"><div class="forecast-date">' 
                 + content.list[count-1].dt_txt.substring(5, 10) +'</div><div class="forecast-high">' + Math.round(Math.max(...highs)) 
                 + ' F</div><div class="forecast-low">' + Math.round(Math.min(...lows)) + ' F</div><div class="forecast-img ' 
                 + content.list[count-1].weather[0].main + '-img">' + content.list[count-1].weather[0].main + '</div></div>');
            }

           // dailyHighs[0] = Math.max(content.list[0].main.temp, content.list[1].main.temp, content.list[2].main.temp, content.list[3].main.temp, content.list[4].main.temp, content.list[5].main.temp, content.list[6].main.temp, content.list[7].main.temp);
           // dailyLows[0] = Math.min(content.list[0].main.temp, content.list[1].main.temp, content.list[2].main.temp, content.list[3].main.temp, content.list[4].main.temp, content.list[5].main.temp, content.list[6].main.temp, content.list[7].main.temp);
                     /*  2) get average weather type by looping through 40 elements and count each type
                     *      - content.list[i].weather[0].main 
                     *  3) get total precip during day looping and adding 
                     *      - content.list[i].rain if temp >=32
                     *      - else content.list[i].snow
                     *  4) get the date
                     *      - content.list[0].dt_txt -> "2019-02-22 00:03:00"
                     * */
            });
    }

    function init(){
        globalCity = "Fargo";
        myMap 
        var url = ['https://api.openweathermap.org/data/2.5/weather?q=Nashville&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial',
            'https://api.openweathermap.org/data/2.5/weather?q=Denver&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial',
            'https://api.openweathermap.org/data/2.5/weather?q=Banff&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial',
            'https://api.openweathermap.org/data/2.5/weather?q=Miami&APPID=f20d0afcce1a8e9378946a0b3d0f107e&units=imperial'];
        
        for (let i = 1; i < 5; i++){
            $.getJSON(url[i-1], function (data) {
                $('#city-' + i).html('<div class="city-data city-name" id="cityname-' + i +'">' + data.name + '</div><div class="city-data city-temp ' + tempColor(data.main.temp) + '">' + Math.round(data.main.temp)
                + ' F</div><div class="city-data">' + Math.round(data.wind.speed) + ' mph</div>');
            });
        }

        getForecast();
        getResults(globalCity);

        /*****   Default Map Setup    *****/ 
        myMap = L.map('map').setView([46.87, -96.78], 4);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmNhcnBlbnQiLCJhIjoiY2pzZG0zbzkwMGhtdzQzdGw1NXl3ZTZqaCJ9.tERAKAxtU9bUPifk1FprZQ', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(myMap);
        
        mapLayers.push(L.tileLayer('https://tile.openweathermap.org/map/{id}/{z}/{x}/{y}.png?appid={accessToken}', {id: 'temp_new', accessToken: 'f20d0afcce1a8e9378946a0b3d0f107e'}));
        mapLayers.push(L.tileLayer('https://tile.openweathermap.org/map/{id}/{z}/{x}/{y}.png?appid={accessToken}', {id: 'wind_new', accessToken: 'f20d0afcce1a8e9378946a0b3d0f107e'}));
        mapLayers.push(L.tileLayer('https://tile.openweathermap.org/map/{id}/{z}/{x}/{y}.png?appid={accessToken}', {id: 'clouds_new', accessToken: 'f20d0afcce1a8e9378946a0b3d0f107e'}));
        mapLayers.push(L.tileLayer('https://tile.openweathermap.org/map/{id}/{z}/{x}/{y}.png?appid={accessToken}', {id: 'precipitation_new', accessToken: 'f20d0afcce1a8e9378946a0b3d0f107e'}));
    
        mapMarker = L.marker([46.87, -96.78]).addTo(myMap);

        console.log('Window Size: ' + $(window).width() + ' x ' + $(window).height());
        
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