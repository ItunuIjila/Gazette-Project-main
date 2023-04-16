//Preloader:
$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
    });
    }
});


//Creating a map:
var London = [52, -0.09];
var mymap = L.map('map');
var tileUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
var tiles = L.tileLayer(tileUrl, { 
    attribution:'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    attribution:'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 2,
    maxZoom: 20,
    ext: 'png'
});
var redIcon = new L.Icon({
    iconUrl: 'images/maple-leaf.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    //shadowUrl: 'images\markers_shadow.png',

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})
var PinIcon = L.Icon.extend({
    options: {
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        //shadowUrl: 'images\markers_shadow.png',

        iconSize:     [25, 41],
        shadowSize:   [41, 41],
        iconAnchor:   [12, 41],
        popupAnchor:  [1, -34]
    }
});
var greenIcon = new PinIcon({iconUrl: 'images/map-marker.svg'});

mymap.addLayer(tiles);
mymap.setView(London, 4);
   //  Marker Cluster
var markers = L.markerClusterGroup();

function clearMap() {
    markers.eachLayer(function (layer) {
        mymap.removeLayer(layer);
    });
}

 
//    if(markers){
//       $('#SelectOption').change(function(){
//         markers.eachLayer(function(layer){
//           markers.removeLayer(layer)
//         })
//       })
//     }
  
//To access user location 
//topojsonSrc: '../data/world.json'
var latlong = [];
var userLocation = [];
var miniMap = new L.Control.GlobeMiniMap({     
    land:'#03ac13',
    water:'#0195d0',
    marker:'#000',
    topojsonSrc: 'data/world.json'
}).addTo(mymap);

mymap.locate({setView: false}).on('locationfound', function(e){

    userLocation = [e.latitude, e.longitude]
    var locationMarker = L.marker(userLocation, {icon: greenIcon}).bindPopup('current location');
    var circle =L.circle([e.latitude, e.longitude], e.accuracy/2, {
        weight: 1,
        color: 'red',
        fillColor: '#cacaca',
        fillOpacity: 0.2
    });


    mymap.addLayer(locationMarker);
    mymap.addLayer(circle);


    

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
    console.log(e);
    alert("Location access denied.");
});








//Fill countries-
$.ajax({
url: "php/countryNames.php",
type: 'GET',
dataType: 'json',

success: function(result) {

    //console.log(result);

    if (result.status.name == "ok") {
        for (var i = 0; i < result.data.length; i++) {
            $('#selectOption').append("<option value=" + result['data'][i]['code'] + ">" + result['data'][i]['name'] + "</option>");
        }
    }

},
});


$("#selectOption").change(function(){
    clearMap()

    //Apply border
    $.ajax({
        url: "php/countryBorders.php",
        type: "POST",
        dataType: "json",
        data: {
            code: $('#selectOption option:selected').val()
        },

        success: function(result) {

            // console.log(result);
    
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
        }
    }); 
    
 
    //Country City Markers-
    $.ajax({
        url: "php/geoDBCities.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selectOption option:selected').val(),
        },
        success: function(result) {

             //console.log(result.data.data[0]);

            if (result.status.name == "ok") {
                result['data']['data'].forEach(element => {
                    markers.addLayer(L.marker([element.latitude, element.longitude], {icon: redIcon}).addTo(mymap).bindPopup("<h1>" + element.name + "</h1> </br>"));
                    
            
                    mymap.addLayer(markers);

                    if (markers){
                        $('#selectOption').change(function(){
                          markers.clearLayers();
                        })
                      
                      }  
                    
                });
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // console.warn(jqXHR.responseText);
        }
    }); 

    //Country City Clusters

    

  
    




    
    
       
});
