  var styles = [
    {
      "featureType": "administrative",
      "elementType": "labels.text",
      "stylers": [
        {
          "weight": "0.45"
        },
        {
          "color": "#1985a4"
        }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        {
          "hue": "#5e00ff"
        },
        {
          "saturation": -79
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
            "saturation": -78
        },
        {
            "hue": "#6600ff"
        },
        {
            "lightness": -47
        },
        {
            "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
            "lightness": 22
        }
      ]
    },
    {
      "featureType": "landscape",
      "stylers": [
        {
            "hue": "#6600ff"
        },
        {
            "saturation": -11
        }
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {
            "saturation": -65
        },
        {
            "hue": "#1900ff"
        },
        {
            "lightness": 8
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
            "weight": 1.3
        },
        {
            "lightness": 30
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
            "visibility": "simplified"
        },
        {
            "hue": "#5e00ff"
        },
        {
            "saturation": -16
        }
      ]
    },
    {
      "featureType": "transit.line",
      "stylers": [
        {
            "saturation": -72
        }
      ]
    },
    {}
  ];


// Function to initialize the map within the map div
function initMap() {
	console.log("initMap");
	map = new google.maps.Map(document.getElementById('map'), {
	center: {lat: -36.745779, lng: 174.746269},
	styles: styles,
	zoom: 13,
	mapTypeControl: false
	});
}

var isClicked = false;
function toggleMenu() {
	isClicked = !isClicked;
	var obj = document.getElementById("options");
	if (isClicked) {
	  obj.className += "open";
	} else {
	  obj.className = "";
	}
}