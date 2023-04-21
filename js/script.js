//Preloader:
    $(window).on('load', function () {
        if ($('#preloader').length) {
        $('#preloader').delay(100).fadeOut('slow', function () {
            $(this).remove();
        });
        }
    });


//Creating the map
   
    
    var tiles = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', { 
        attribution:'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        attribution:'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 2,
        maxZoom: 20,
        ext: 'png'
    });

    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });



var mymap = L.map('map',{
    layers: [tiles]
  }).setView([54.5, -4], 6);
  
  var baseMaps = {
    "Satellite" : satellite,
    "Streets" : tiles
  
  };
  
  L.control.layers(baseMaps, null, {position: 'bottomright'}).addTo(mymap);
  


// var airports = 
// var airportIcon = L.ExtraMarkers.icon({
//   icon: 'fa-plane',
//   iconColor: 'black',
//   markerColor: 'white',
//   shape: 'square',
//   prefix: 'fa'
// });

// var cityIcon = L.ExtraMarkers.icon({
//   icon: 'fa-city',
//   markerColor: 'green',
//   shape: 'square',
//   prefix: 'fa'
// });






    //Creating icons using L.Icon library
    var MapleLeafIcon = new L.Icon({
        iconUrl: 'images/maple-leaf.svg',
        shadowUrl: 'images/markers_shadow.png',
        iconSize: [25, 35],
        iconAnchor: [12, 35],
        popupAnchor: [1, -34],
        shadowSize: [45, 45]
    })
    var myIcon = L.Icon.extend({
        options: {
            shadowUrl: 'images/markers_shadow.png',
            iconSize:     [25, 35],
            iconAnchor:   [12, 35],
            popupAnchor:  [1, -30],
            shadowSize:   [45, 45]
        }
    });

    var mapIcon = new myIcon({iconUrl: 'images/map-marker.svg'});
    
    mymap.addLayer(tiles);


    //Easy Buttons:
    //Info-
    infoButton = L.easyButton({
        id: 'infoLeaf',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-info',
          onClick: function(button, map){
            $("#infoModalScrollable").modal();
          },
          title: 'show country information',
          icon: "fa-globe"
        }]
      })
    mymap.addControl(infoButton);

      //Images-
      imagesButton = L.easyButton({
        id: 'imagesLeaf',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-images',
          onClick: function(button, map){
            $("#imagesModalScrollable").modal();
          },
          title: 'show country images',
          icon: "fa-camera-retro"
        }]
      });
     mymap.addControl(imagesButton);
    
    // Weather-
    
    weatherButton = L.easyButton({
        id: 'weatherLeaf',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-weather',
          onClick: function(button, map){
            $("#weatherModalScrollable").modal();
          },
          title: 'show the weather',
          icon: "fa-cloud-sun "
        }]
      })
    mymap.addControl(weatherButton);

    //News update
    newsButton = L.easyButton({
        id: 'News',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-news',
          onClick: function(button, map){
            $("#newsModalScrollable").modal();
          },
          title: 'news update',
          icon: "fa-bullhorn"
        }]
      });
     mymap.addControl(newsButton);

       //National Holidays 
    holidayButton = L.easyButton({
        id: 'holiday',
        position: 'topleft',
        type: 'animate',
        leafletClasses: true,
        states:[{
          stateName: 'show-news',
          onClick: function(button, map){
            $("#holidayModalScrollable").modal();
          },
          title: 'Holiday update',
          icon: "fa-umbrella"
        }]
      });
     mymap.addControl(holidayButton);


     //  Marker Cluster
    var markers = L.markerClusterGroup();


    //Function to remove map layers 
    function clearMap() {
    markers.eachLayer(function (layer) {
        mymap.removeLayer(layer);
    });
}

//To access user location 

    var latlong = [];
    var userLocation = [];

    

    mymap.locate({setView: false}).on('locationfound', function(e){

        userLocation = [e.latitude, e.longitude]
        // var userlocationMarker = L.marker(userLocation, {icon: mapIcon}).bindPopup('current location');
        // var reddot =L.circle([e.latitude, e.longitude], e.accuracy/2, {
        //     weight: 2,
        //     color: 'blue'
            
        // });
        

        mymap.addLayer(userlocationMarker);
        mymap.addLayer(reddot);


        //Weather:
        $.ajax({
            url: "php/openWeather.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: userLocation[0],
                lon: userLocation[1]
            },
            success: function(result) {
                //console.log(result);
                if (result.status.name == "ok" && result['data']['current'] != undefined) {

                    //Onload:
                    $('.weatherHide').show();
                    
                    $("#temp").empty();
                    $("#currentWeather").empty();
                    $("#wind").empty();
                    $("#sunrise").empty();
                    $("#sunset").empty();
                    $("#humidity").empty();
                    $('#temp').html(result['data']['current']['temp']+" ℃");
                    var icon = result['data']['current']['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['current']['weather']['0']['description']);
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    var calculated = Math.round(result['data']['current']['wind_speed'] * 3600 / 1610.3*1000)/1000;
                    $('#wind').html(calculated + ' mph ' + direction(result['data']['current']['wind_deg']));                        var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['current']['humidity'] + ' %');

                    $('#hour1').empty();
                    $('#hour2').empty();
                    $('#hour3').empty();
                    $('#hour4').empty();
                    var time1 = moment(result['data']['hourly']['3']['dt']*1000).format("HH:mm");
                    var time2 = moment(result['data']['hourly']['6']['dt']*1000).format("HH:mm");
                    var time3 = moment(result['data']['hourly']['9']['dt']*1000).format("HH:mm");
                    var time4 = moment(result['data']['hourly']['12']['dt']*1000).format("HH:mm");
                    var temp1 = result['data']['hourly']['3']['temp'];
                    var temp2 = result['data']['hourly']['6']['temp'];
                    var temp3 = result['data']['hourly']['9']['temp'];
                    var temp4 = result['data']['hourly']['12']['temp'];
                    $('#hour1').append(result['data']['hourly']['3']['weather']['0']['description'] + " and " + temp1 + " ℃ at " + time1);
                    $('#hour2').append(result['data']['hourly']['6']['weather']['0']['description'] + " and " + temp2 + " ℃ at " + time2);
                    $('#hour3').append(result['data']['hourly']['9']['weather']['0']['description'] + " and " + temp3 + " ℃ at " + time3);
                    $('#hour4').append(result['data']['hourly']['12']['weather']['0']['description'] + " and " + temp4 + " ℃ at " + time4);
                    var icon1 = result['data']['hourly']['3']['weather']['0']['icon'];
                    var icon2 = result['data']['hourly']['6']['weather']['0']['icon'];
                    var icon3 = result['data']['hourly']['9']['weather']['0']['icon'];
                    var icon4 = result['data']['hourly']['12']['weather']['0']['icon'];
                    var weatherUrl1 = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                    var weatherUrl2 = "https://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                    var weatherUrl3 = "https://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                    var weatherUrl4 = "https://openweathermap.org/img/wn/" + icon4 + "@2x.png";
                    $('#weatherIcon1').attr("src", weatherUrl1);
                    $('#weatherIcon2').attr("src", weatherUrl2);
                    $('#weatherIcon3').attr("src", weatherUrl3);
                    $('#weatherIcon4').attr("src", weatherUrl4);
                    

                    //Today
                    $("#day1").on('click', function(){
                        $('.weatherHide').show();
                        
                        $("#temp").empty();
                        $("#currentWeather").empty();
                        $("#wind").empty();
                        $("#sunrise").empty();
                        $("#sunset").empty();
                        $("#humidity").empty();
                        $('#temp').html(result['data']['current']['temp']+" ℃");
                        var icon = result['data']['current']['weather']['0']['icon'];
                        $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['current']['weather']['0']['description']);
                        var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                        $('#weatherIcon').attr("src", weatherUrl);
                        var calculated = Math.round(result['data']['current']['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['current']['wind_deg']));                        var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['current']['humidity'] + ' %');

                        $('#hour1').empty();
                        $('#hour2').empty();
                        $('#hour3').empty();
                        $('#hour4').empty();
                        
                        var time1 = moment(result['data']['hourly']['3']['dt']*1000).format("HH:mm");
                        var time2 = moment(result['data']['hourly']['6']['dt']*1000).format("HH:mm");
                        var time3 = moment(result['data']['hourly']['9']['dt']*1000).format("HH:mm");
                        var time4 = moment(result['data']['hourly']['12']['dt']*1000).format("HH:mm");
                        var temp1 = result['data']['hourly']['3']['temp'];
                        var temp2 = result['data']['hourly']['6']['temp'];
                        var temp3 = result['data']['hourly']['9']['temp'];
                        var temp4 = result['data']['hourly']['12']['temp'];
                        $('#hour1').append(result['data']['hourly']['3']['weather']['0']['description'] + " and " + temp1 + " ℃ at " + time1);
                        $('#hour2').append(result['data']['hourly']['6']['weather']['0']['description'] + " and " + temp2 + " ℃ at " + time2);
                        $('#hour3').append(result['data']['hourly']['9']['weather']['0']['description'] + " and " + temp3 + " ℃ at " + time3);
                        $('#hour4').append(result['data']['hourly']['12']['weather']['0']['description'] + " and " + temp4 + " ℃ at " + time4);
                        var icon1 = result['data']['hourly']['3']['weather']['0']['icon'];
                        var icon2 = result['data']['hourly']['6']['weather']['0']['icon'];
                        var icon3 = result['data']['hourly']['9']['weather']['0']['icon'];
                        var icon4 = result['data']['hourly']['12']['weather']['0']['icon'];
                        var weatherUrl1 = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                        var weatherUrl2 = "https://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                        var weatherUrl3 = "https://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                        var weatherUrl4 = "https://openweathermap.org/img/wn/" + icon4 + "@2x.png";
                        $('#weatherIcon1').attr("src", weatherUrl1);
                        $('#weatherIcon2').attr("src", weatherUrl2);
                        $('#weatherIcon3').attr("src", weatherUrl3);
                        $('#weatherIcon4').attr("src", weatherUrl4);
                    });
                
                
                    //Tomorrow
                    $("#day2").on('click', function(){
                        $("#currentWeather").empty();
                        $('.weatherHide').hide();
                        $('#temp').html("Max: " + result['data']['daily'][1]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][1]['temp']['min'] + " ℃");
                        var icon = result['data']['daily'][1]['weather']['0']['icon'];
                        $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][1]['weather']['0']['description']);
                        var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                        $('#weatherIcon').attr("src", weatherUrl);
                        var calculated = Math.round(result['data']['daily'][1]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][1]['wind_deg']));
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['daily'][1]['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['daily'][1]['humidity'] + ' %');
                    });

                    //Third Day
                    $("#day3").on('click', function(){
                        $("#currentWeather").empty();
                        $('.weatherHide').hide();
                        $('#temp').html("Max: " + result['data']['daily'][2]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][2]['temp']['min'] + " ℃");
                        var icon = result['data']['daily'][2]['weather']['0']['icon'];
                        $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][2]['weather']['0']['description']);
                        var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                        $('#weatherIcon').attr("src", weatherUrl);
                        var calculated = Math.round(result['data']['daily'][2]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][2]['wind_deg']));
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['daily'][2]['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['daily'][2]['humidity'] + ' %');
                    });

                    //Fourth Day
                    $("#day4").on('click', function(){
                        $("#currentWeather").empty();
                        $('.weatherHide').hide();
                        $('#temp').html("Max: " + result['data']['daily'][3]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][3]['temp']['min'] + " ℃");
                        var icon = result['data']['daily'][3]['weather']['0']['icon'];
                        $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][3]['weather']['0']['description']);
                        var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                        $('#weatherIcon').attr("src", weatherUrl);
                        var calculated = Math.round(result['data']['daily'][3]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][3]['wind_deg']));
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['daily'][3]['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['daily'][3]['humidity'] + ' %');
                    });                
                    
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert(jqXHR + " There has been an error! " + errorThrown)
            }
        });


        //change selectOption to users location:
        $.ajax({
            url: "php/getCountryCode.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: e.latitude,
                lng: e.longitude,
            },
            success: function(result) {

                // console.log(result);

                if (result.status.name == "ok") {
                    $("#selectOption").val(result['data']['countryCode']).change();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // console.warn(jqXHR.responseText + "   " + errorThrown);
            }
        }); 

    }). on('locationerror', function(e) {
        //console.log(e);
        alert("Location access denied.");
       
        var defaultLocation = [51.5074, -0.1278]; // London coordinates
        userLocation = defaultLocation;
        // var userlocationMarker = L.marker(userLocation, {icon: mapIcon}).bindPopup('default location: London');
        // var reddot = L.circle(userLocation, 1000, {
        //     weight: 1,
        //     color: 'blue'
           
        // });
        // mymap.addLayer(userlocationMarker);
        // mymap.addLayer(reddot);

    //change selectOption input to default location[London]:
    $.ajax({
        url: "php/getCountryCode.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: defaultLocation[0],
            lng: defaultLocation[1],
        },
        success: function(result) {

            //console.log(result);

            if (result.status.name == "ok") {
                $("#selectOption").val(result['data']['countryCode']).change();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // console.warn(jqXHR.responseText + "   " + errorThrown);
        }
    }); 

        
        //Weather:
        $.ajax({
            url: "php/openWeather.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: userLocation[0],
                lon: userLocation[1]
            },
            success: function(result) {
                //console.log(result);
                if (result.status.name == "ok" && result['data']['current'] != undefined) {

                    //Onload:
                    $('.weatherHide').show();
                    
                    $("#temp").empty();
                    $("#currentWeather").empty();
                    $("#wind").empty();
                    $("#sunrise").empty();
                    $("#sunset").empty();
                    $("#humidity").empty();
                    $('#temp').html(result['data']['current']['temp']+" ℃");
                    var icon = result['data']['current']['weather']['0']['icon'];
                    $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['current']['weather']['0']['description']);
                    var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                    $('#weatherIcon').attr("src", weatherUrl);
                    var calculated = Math.round(result['data']['current']['wind_speed'] * 3600 / 1610.3*1000)/1000;
                    $('#wind').html(calculated + ' mph ' + direction(result['data']['current']['wind_deg']));                        var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                    $('#sunrise').html(sunrise);
                    var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                    $('#sunset').html(sunset);
                    $('#humidity').html(result['data']['current']['humidity'] + ' %');

                    $('#hour1').empty();
                    $('#hour2').empty();
                    $('#hour3').empty();
                    $('#hour4').empty();
                    var time1 = moment(result['data']['hourly']['3']['dt']*1000).format("HH:mm");
                    var time2 = moment(result['data']['hourly']['6']['dt']*1000).format("HH:mm");
                    var time3 = moment(result['data']['hourly']['9']['dt']*1000).format("HH:mm");
                    var time4 = moment(result['data']['hourly']['12']['dt']*1000).format("HH:mm");
                    var temp1 = result['data']['hourly']['3']['temp'];
                    var temp2 = result['data']['hourly']['6']['temp'];
                    var temp3 = result['data']['hourly']['9']['temp'];
                    var temp4 = result['data']['hourly']['12']['temp'];
                    $('#hour1').append(result['data']['hourly']['3']['weather']['0']['description'] + " and " + temp1 + " ℃ at " + time1);
                    $('#hour2').append(result['data']['hourly']['6']['weather']['0']['description'] + " and " + temp2 + " ℃ at " + time2);
                    $('#hour3').append(result['data']['hourly']['9']['weather']['0']['description'] + " and " + temp3 + " ℃ at " + time3);
                    $('#hour4').append(result['data']['hourly']['12']['weather']['0']['description'] + " and " + temp4 + " ℃ at " + time4);
                    var icon1 = result['data']['hourly']['3']['weather']['0']['icon'];
                    var icon2 = result['data']['hourly']['6']['weather']['0']['icon'];
                    var icon3 = result['data']['hourly']['9']['weather']['0']['icon'];
                    var icon4 = result['data']['hourly']['12']['weather']['0']['icon'];
                    var weatherUrl1 = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                    var weatherUrl2 = "https://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                    var weatherUrl3 = "https://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                    var weatherUrl4 = "https://openweathermap.org/img/wn/" + icon4 + "@2x.png";
                    $('#weatherIcon1').attr("src", weatherUrl1);
                    $('#weatherIcon2').attr("src", weatherUrl2);
                    $('#weatherIcon3').attr("src", weatherUrl3);
                    $('#weatherIcon4').attr("src", weatherUrl4);
                    

                    //Today
                    $("#day1").on('click', function(){
                        $('.weatherHide').show();
                        
                        $("#temp").empty();
                        $("#currentWeather").empty();
                        $("#wind").empty();
                        $("#sunrise").empty();
                        $("#sunset").empty();
                        $("#humidity").empty();
                        $('#temp').html(result['data']['current']['temp']+" ℃");
                        var icon = result['data']['current']['weather']['0']['icon'];
                        $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['current']['weather']['0']['description']);
                        var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                        $('#weatherIcon').attr("src", weatherUrl);
                        var calculated = Math.round(result['data']['current']['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['current']['wind_deg']));                        var sunrise = moment(result['data']['current']['sunrise']*1000).format("HH:mm");
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['current']['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['current']['humidity'] + ' %');

                        $('#hour1').empty();
                        $('#hour2').empty();
                        $('#hour3').empty();
                        $('#hour4').empty();
                        
                        var time1 = moment(result['data']['hourly']['3']['dt']*1000).format("HH:mm");
                        var time2 = moment(result['data']['hourly']['6']['dt']*1000).format("HH:mm");
                        var time3 = moment(result['data']['hourly']['9']['dt']*1000).format("HH:mm");
                        var time4 = moment(result['data']['hourly']['12']['dt']*1000).format("HH:mm");
                        var temp1 = result['data']['hourly']['3']['temp'];
                        var temp2 = result['data']['hourly']['6']['temp'];
                        var temp3 = result['data']['hourly']['9']['temp'];
                        var temp4 = result['data']['hourly']['12']['temp'];
                        $('#hour1').append(result['data']['hourly']['3']['weather']['0']['description'] + " and " + temp1 + " ℃ at " + time1);
                        $('#hour2').append(result['data']['hourly']['6']['weather']['0']['description'] + " and " + temp2 + " ℃ at " + time2);
                        $('#hour3').append(result['data']['hourly']['9']['weather']['0']['description'] + " and " + temp3 + " ℃ at " + time3);
                        $('#hour4').append(result['data']['hourly']['12']['weather']['0']['description'] + " and " + temp4 + " ℃ at " + time4);
                        var icon1 = result['data']['hourly']['3']['weather']['0']['icon'];
                        var icon2 = result['data']['hourly']['6']['weather']['0']['icon'];
                        var icon3 = result['data']['hourly']['9']['weather']['0']['icon'];
                        var icon4 = result['data']['hourly']['12']['weather']['0']['icon'];
                        var weatherUrl1 = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
                        var weatherUrl2 = "https://openweathermap.org/img/wn/" + icon2 + "@2x.png";
                        var weatherUrl3 = "https://openweathermap.org/img/wn/" + icon3 + "@2x.png";
                        var weatherUrl4 = "https://openweathermap.org/img/wn/" + icon4 + "@2x.png";
                        $('#weatherIcon1').attr("src", weatherUrl1);
                        $('#weatherIcon2').attr("src", weatherUrl2);
                        $('#weatherIcon3').attr("src", weatherUrl3);
                        $('#weatherIcon4').attr("src", weatherUrl4);
                    });
                
                
                    //Tomorrow
                    $("#day2").on('click', function(){
                        $("#currentWeather").empty();
                        $('.weatherHide').hide();
                        $('#temp').html("Max: " + result['data']['daily'][1]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][1]['temp']['min'] + " ℃");
                        var icon = result['data']['daily'][1]['weather']['0']['icon'];
                        $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][1]['weather']['0']['description']);
                        var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                        $('#weatherIcon').attr("src", weatherUrl);
                        var calculated = Math.round(result['data']['daily'][1]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][1]['wind_deg']));
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['daily'][1]['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['daily'][1]['humidity'] + ' %');
                    });

                    //Third Day
                    $("#day3").on('click', function(){
                        $("#currentWeather").empty();
                        $('.weatherHide').hide();
                        $('#temp').html("Max: " + result['data']['daily'][2]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][2]['temp']['min'] + " ℃");
                        var icon = result['data']['daily'][2]['weather']['0']['icon'];
                        $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][2]['weather']['0']['description']);
                        var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                        $('#weatherIcon').attr("src", weatherUrl);
                        var calculated = Math.round(result['data']['daily'][2]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][2]['wind_deg']));
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['daily'][2]['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['daily'][2]['humidity'] + ' %');
                    });

                    //Fourth Day
                    $("#day4").on('click', function(){
                        $("#currentWeather").empty();
                        $('.weatherHide').hide();
                        $('#temp').html("Max: " + result['data']['daily'][3]['temp']['max'] +" ℃ \n" + "Min: "  + result['data']['daily'][3]['temp']['min'] + " ℃");
                        var icon = result['data']['daily'][3]['weather']['0']['icon'];
                        $('#currentWeather').append("<img id='weatherIcon' alt='weather icon' src=''></img>" + result['data']['daily'][3]['weather']['0']['description']);
                        var weatherUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                        $('#weatherIcon').attr("src", weatherUrl);
                        var calculated = Math.round(result['data']['daily'][3]['wind_speed'] * 3600 / 1610.3*1000)/1000;
                        $('#wind').html(calculated + ' mph ' + direction(result['data']['daily'][3]['wind_deg']));
                        $('#sunrise').html(sunrise);
                        var sunset = moment(result['data']['daily'][3]['sunset']*1000).format("HH:mm");
                        $('#sunset').html(sunset);
                        $('#humidity').html(result['data']['daily'][3]['humidity'] + ' %');
                    });                
                    
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert(jqXHR + " There has been an error! " + errorThrown)
            }
        });

        
        

    })
    









//Millseconds to Time
    function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
    
        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }


//Days:
    var thirdDay = moment().add(2, 'days').format('dddd');  
    var fourthDay = moment().add(3, 'days').format('dddd');   ;
    $("#day3").html(thirdDay);
    $("#day4").html(fourthDay);


//Direction:
    function direction(i) {
        if(i >= 349 && i <= 11){
                return +i + "°: N";
        } else if (i >= 12 && i <= 33) {
                return +i + "°: NNE";
        } else if (i >= 34 && i <= 56) {
                return +i + "°: NE";
        } else if (i >= 57 && i <= 78) {
                return +i + "°: ENE";
        } else if (i >= 79 && i <= 101) {
                return +i + "°: E";
        } else if (i >= 102 && i <= 123) {
                return +i + "°: ESE";
        } else if (i >= 124 && i <= 146) {
                return +i + "°: SE";
        } else if (i >= 147 && i <= 168) {
                return +i + "°: SSE";
        } else if (i >= 169 && i <= 191) {
                return +i + "°: S";
        } else if (i >= 192 && i <= 213) {
                return +i + "°: SSW";
        } else if (i >= 214 && i <= 236) {
                return +i + "°: SW";
        } else if (i >= 237 && i <= 258) {
                return +i + "°: WSW";
        } else if (i >= 259 && i <= 281) {
                return +i + "°: W";
        } else if (i >= 282 && i <= 303) {
                return +i + "°: WNW";
        } else if (i >= 304 && i <= 326) {
                return +i + "°: NW";
        } else if (i >= 327 && i <= 348) {
                return +i + "°: NNW";
        }
    };


//Fill countries-
$.ajax({
    url: "php/selectCountryNames.php",
    type: 'GET',
    dataType: 'json',

    success: function(result) {

        //console.log(result);

        if (result.status.name == "ok") {
            for (var j = 0; j < result.data.length; j++) {
                $('#selectOption').append("<option value=" + result['data'][j]['code'] + ">" + result['data'][j]['name'] + "</option>");
            }
        }
    
    },
});

// When a new country is selected
    $("#selectOption").change(function(){

        //Clear previous markers
        clearMap()

        //Apply border
        $.ajax({
            url: "php/getCountryBorders.php",
            type: "POST",
            dataType: "json",
            data: {
                code: $("#selectOption option:selected").val(),
            },

            success: function(result) {

                 //console.log(result);
        
                if (result.status.name == "ok") {
                    var bounds = result.data;
                    var borderStyle =  {
                        color: "#03ac13",
                        weight: 3,
                        opacity: 0.7,
                        fillOpacity: 0.0 
                    };
                    var border = L.geoJSON(bounds, borderStyle).addTo(mymap);
                    if (border){
                        $('#selectOption').change(function(){
                          border.clearLayers();
                        })
                      
                      }  
                    mymap.fitBounds(border.getBounds(), {
                        padding: [10, 10],
                        animate: true,
                        duration: 5,
                    });
                };
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // console.warn(errorThrown);
                //If location is denied

            }
        }); 
        
    

        //Country City Markers-
        $.ajax({
            url: "php/getGeoCities.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selectOption option:selected').val(),
            },
            success: function(result) {

                //console.log(result);

                //Added Country Layers and marker Cluster

                if (result.status.name == "ok") {
                    result['data']['data'].forEach(element => {
                        markers.addLayer(L.marker([element.latitude, element.longitude], {icon: MapleLeafIcon}).addTo(mymap).bindPopup("<h1>" + element.name + "</h1> </br>"));
                        
                
                        mymap.addLayer(markers);

                        //Function to remove marker clusters
                        if (markers){
                            $('#selectOption').change(function(){
                              markers.clearLayers();
                              mymap.removeLayer(markers)
                            })
                          
                          }  
                    });
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                 //console.warn(jqXHR.responseText);
            }
        }); 

       
         //TO fill the easy button modals

        //getCountryInfo-
        $.ajax({
            url: "php/getCountryInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selectOption').val(),
            },
            success: function(result) {

             //console.log(result);

                if (result.status.name == "ok") {
                

                    $("#countryName").html(result['data'][0]['countryName']);
                    $('#capital').html(result['data'][0]['capital']);
                    $('#currencycode').html(result['data'][0]['currencyCode']);
                    $('#continentname').html(result['data'][0]['continentName']);
                    const area = result['data'][0]['areaInSqKm'];
                    const areaFormatter = new Intl.NumberFormat('en-US');
                    const formattedArea = areaFormatter.format(area);
                    $('#area').html(formattedArea + " km<sup>2</sup>");
                    $('#population').html(Number(result['data'][0]['population']).toLocaleString());
                   
                    
                    
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        }); 

       
        //wikiApi-
        $.ajax({
            url: "php/wikiApi.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selectOption option:selected').text(),
            },
            success: function(result) {            
                 console.log(result);

                if (result.status.name == "ok") {
                    $("#sumTitle").empty();
                    $("#sumTitle").append(result['data']['0']['title']);
                    $("#summary").html(result['data']['0']['summary']);
                    $("#wikipediaUrl").attr('href', result['data']['0']['wikipediaUrl']);
                    
                     // Format Wikipedia URL as clickable link that opens in new tab
                     var wikipediaUrl = ('https://' + result['data']['0']['wikipediaUrl']);
                     var linkText = "Read more on Wikipedia";
                     var wikipediaLink = '<a href="' + wikipediaUrl + '" target="_blank">' + linkText + '</a>';
                        $("#wikipediaUrl").html(wikipediaLink);
                       
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                
            }
        }); 


        //News:
        $.ajax({
            url: "php/newsApi.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $('#selectOption').val(),
            },
            success: function(result) {

                  console.log(result.data.results[0]);
                
                if (result.status.name == "ok" && result['data']['results']['0'] !== undefined) {
                    $("#newsCountry").empty();

                    $("#newsCountry").append($('#selectOption option:selected').text());
                    $("#articleTitle").html(result['data']['results']['0']['title']);
                    $("#articleDescription").html(result['data']['results']['0']['description']);
                    $("#articleContent").html(result['data']['results']['0']['content']);
                    $("#articleImg").attr("src", result['data']['results']['0']['image_url']);
                    
                    var date = result['data']['results']['0']['publishedAt'];
                    $("#publishedAt").html(moment(date).format('DD-MM-YYYY'));
                    var articleUrl = result['data']['results']['0']['link'];
                    var linkText = "Read full article";
                    var articleLink = '<a href="' + articleUrl + '" target="_blank">' + linkText + '</a>';
                    $("#articleUrl").html(articleLink);
                }
                var i = 0;
                $("#nextArticle").on('click', function() {
                    if (result.status.name == "ok" && result['data']['results'][i] !== undefined && i<(result['data']['results'].length-1)) {
                        i++
                        // console.log(i)
                        $("#articleTitle").html(result['data']['results'][i]['title']);
                        $("#articleDescription").html(result['data']['results'][i]['description']);
                        $("#articleContent").html(result['data']['results'][i]['content']);
                        $("#articleImg").attr("src", result['data']['results'][i]['urlToImage']);
                        $("#articleAuthor").html(result['data']['results'][i]['author']);
                        var date = result['data']['results'][i]['publishedAt'];
                        $("#publishedAt").html(moment(date).format('DD-MM-YYYY'));
                        var articleUrl = result['data']['results']['i']['link'];
                        var linkText = "Read full article";
                        var articleLink = '<a href="' + articleUrl + '" target="_blank">' + linkText + '</a>';
                        $("#articleUrl").html(articleLink);
                        
                    }
                });
                
                $("#previousArticle").on('click', function() {
                    if (result.status.name == "ok" && result['data']['results'][i] !== undefined && i>0) {
                        i--;
                        // console.log(i)
                        $("#articleTitle").html(result['data']['results'][i]['title']);
                        $("#articleDescription").html(result['data']['results'][i]['description']);
                        $("#articleContent").html(result['data']['results'][i]['content']);
                        $("#articleImg").attr("src", result['data']['results'][i]['urlToImage']);
                        $("#articleAuthor").html(result['data']['results'][i]['author']);
                        var date = result['data']['results'][i]['publishedAt'];
                        $("#publishedAt").html(moment(date).format('DD-MM-YYYY'));
                        var articleUrl = result['data']['results']['i']['link'];
                        var linkText = "Read full article";
                        var articleLink = '<a href="' + articleUrl + '" target="_blank">' + linkText + '</a>';
                        $("#articleUrl").html(articleLink);
                    }
                });
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        });

         // National Holidasy
         $.ajax({
            url: 'php/getHolidays.php',
            type: 'POST',
            dataType: "JSON",
            data: {
              country: $('#selectOption').val(),
            },
            success: function(result){
                //console.log(result);
            //Using a for loop to retrieve the holidays from a given bordercode from the countryBorders.geo.json file. 
              const holiday = result.data;
              for (let i = 0; i < holiday.length; i++){
                const holidayname = result.data[i].name;
              const holidaydate = result.data[i].date;
              const dateslice = holidaydate.slice(5)
              var table = document.getElementById('holidayTable')
              var row = `<tr>
              <td class="holcol1">${holidayname}</td><td class="holcol2" >${dateslice}</td>
              </tr>`
              table.innerHTML += row;
                
              if (row){
                $('#countryselect').change(function(){
                  $('#holidayTable').empty();
                })
              }
            }
                
            },

            
            
            error: function(jqXHR, textStatus, errorThrown) {
                //console.warn("There has been an error " + errorThrown);
            }
          });


        //Location Images:
        $.ajax({
            url: "php/locationImages.php",
            type: 'POST',
            dataType: 'json',
            data: {
            query: $('#selectOption option:selected').text(),
            },
            success: function(result) {

                // console.log(result);
                $("#countryImages").empty();
                
                if (result.status.name == "ok") {
                    for(var i = 0; i<result['data']['results'].length; i++){
                        
                        $("#countryImages").append("<p style='color:white' id='description" + i +"'class='countryDescription'>")
                        $("#countryImages").append("<img src='' alt='' id='image" + i +"'class='countryImages'><br><br>")
                        $("#image" + i).attr('src', result['data']['results'][i]['urls']['regular']);
                        $("#image" + i).attr('alt', result['data']['results'][i]['alt_description']);
                        $("#description" + i).append(result['data']['results'][i]['alt_description'] + " -");
                    }
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // console.warn("There has been an error " + errorThrown);
            }
        });
    });
