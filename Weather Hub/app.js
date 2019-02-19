/*** Main JavaScript logic for Weather Hub */
// API Key: f20d0afcce1a8e9378946a0b3d0f107e
$(document).ready(function() {
    
    // Search button
    var wetObject;

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
    
    });
});