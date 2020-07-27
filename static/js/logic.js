var myMap = L.map("map", {
    center: [35.7125, -117.57],
    zoom: 3
});


// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
}).addTo(myMap);

const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

d3.json(url, function(response) {
  
  //console.log(response);
  
  for(i=0; i<response.features.length; i++) {
    
    var location = response.features[i].geometry.coordinates;
    var lat = location[1];
    var lng = location[0];

    var properties = response.features[i].properties;
    var mag = properties.mag;
    var place = properties.place;


    //This function changes color of each earthquake marker based on a quake's magnitude
    function changeColor(mag) {
      switch(true) {
        case mag > 5:
          return '#c70000';
        case mag > 4:
          return '#ff9924';
        case mag > 3:
          return '#ffcc00';
        case mag > 2:
          return '#99ff66';
        case mag > 1:
          return '#00ffcc';
        default:
          return '#86CAC6';
      }
    }
  
    //This function size color of each earthquake marker based on a quake's magnitude
    function changeRadius(mag) {
      if (mag === 0) {
        return 1;
      }
      return mag * 40000;
    }

    //Placing the circles on the map
    L.circle([lat, lng], {
      fillColor: changeColor(mag),
      fillOpacity: 0.85,
      color: changeColor(mag),
      radius: changeRadius(mag)
    }).bindPopup(`<h3> Location: ${place}
    Magnitude: ${mag}`).addTo(myMap);
  }
});

//adding the legend
var legend = L.control({position:'bottomright'});
    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend'),
          labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"],
          colors = ['#86CAC6','#00ffcc', '#99ff66', '#ffcc00', '#ff9924','#c70000'];
        
      for(var i=0; i<colors.length; i++) {
          div.innerHTML +=
          '<li style="background-color:' + colors[i] + '">' + labels[i] + '</li>'; 
        }
        return div;
    }
    legend.addTo(myMap);

