// Define the init datas
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
	}
];
var initPlaces = [
	{name: 'Smart Kitchen', location: {lat:-36.738642, lng: 174.717706}, style: 'chinese', Area: 'northshore'},
	{name: 'Asian Work', location: {lat:-36.714350, lng: 174.747421}, style: 'chinese', Area: 'northshore'},
	{name: "Bushman's Grill", location: {lat:-36.790714, lng: 174.749119}, style: 'western', Area: 'northshore'},
];

// Model: Define the favorite place module
var Place = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
	this.style = ko.observable(data.style);
	this.area = ko.observable(data.Area);
};

// View Model: Define the VM, control all the information chaing for Model
var ViewModel = function() {
	var self = this; 
	this.placeList = ko.observableArray([]);
	initPlaces.forEach(function(place) {
		self.placeList.push(new Place(place));
	});
};

ko.applyBindings(new ViewModel());

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

// TODO: Make the toggle button control by KnockoutJS
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