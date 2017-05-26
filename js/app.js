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
	{name: 'Smart Kitchen', location: {lat:-36.738642, lng: 174.717706}, style: 'chinese', Area: 'northshore', marker: null},
	{name: 'Asian Work', location: {lat:-36.714350, lng: 174.747421}, style: 'chinese', Area: 'northshore', marker: null},
	{name: "Bushman's Grill", location: {lat:-36.790714, lng: 174.749119}, style: 'western', Area: 'northshore', marker: null},
	{name: "Galbraith's Alehouse", location: {lat:-36.865644, lng: 174.761184}, style: 'western', Area: 'city', marker: null},
	{name: "Pen Pen Xian", location: {lat:-36.867522, lng: 174.776866}, style: 'chinese', Area: 'city', marker: null},
	{name: "Bian Sushi & Donburi", location: {lat:-36.863015, lng: 174.760968}, style: 'japnese', Area: 'city', marker: null},
	{name: "Seoul Restaurant", location: {lat:-36.855832, lng: 174.762400}, style: 'korean', Area: 'city', marker: null},
];

// Model: Define the favorite place module
var Place = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
	this.style = ko.observable(data.style);
	this.area = ko.observable(data.Area);
};

var Toggle = function() {
	this.isClicked = ko.observable(false);
};

// View Model: Define the VM, control all the information changing for Models
var ViewModel = function() {
	var self = this; 
	this.placeList = ko.observableArray([]);
	initPlaces.forEach(function(place) {
		self.placeList.push(new Place(place));
	});

	this.toggle = new Toggle();
	this.toggleMenu = function() {
		self.toggle.isClicked(!self.toggle.isClicked());
	};

	this.curPlace = ko.observable(this.placeList()[0]);

	/*
	-- Google Maps Control
	*/
	var map;
	var markers = [];

	// Function to initialize the map within the map div
	this.initMap = function() {
		console.log("initMap");
		map = new google.maps.Map($("#map")[0], {
			center: {lat: -36.745779, lng: 174.746269},
			styles: styles,
			zoom: 13,
			mapTypeControl: false
		});

		// Style the markers a bit. This will be our listing marker icon.
		var defaultIcon = self.makeMarkerIcon('42c2f4');
		// Create a "highlighted location" marker color for when the user
		// mouses over the marker.
		var highlightedIcon = self.makeMarkerIcon('f49541');

		// Define the bounds for all the markers
		var bounds = new google.maps.LatLngBounds();
		
		// The following group uses the location array to create an array of markers on initialize.
		for (var i = 0; i<initPlaces.length; i++) {
		  // Get the position from the location array.
		  var position = initPlaces[i].location;
		  var title = initPlaces[i].name;

		  // Create a marker per location, and put into markers array.
		  var marker = new google.maps.Marker({
		    position: position,
		    title: title,
		    animation: google.maps.Animation.DROP,
		    //icon: "img/restaurant-icon-small.png",
		    icon: defaultIcon,
		    id: i
		  });
		  self.placeList()[i].marker = marker;
		  marker.setMap(map);

		  // Extend bound for new marker's position
		  bounds.extend(position);

		  // Push the marker to our array of markers
		  markers.push(marker);
		  // Two event listeners - one for mouseover, one for mouseout,
		  // to change the colors back and forth.
		  marker.addListener('mouseover', function() {
		    this.setIcon(highlightedIcon);
		  });
		  marker.addListener('mouseout', function() {
		    this.setIcon(defaultIcon);
		  });
		}

		// Set all the markers inside the bounds
		map.fitBounds(bounds);
	};

	// This function takes in a COLOR, and then creates a new marker
	// icon of that color. The icon will be 21 px wide by 34 high, have an origin
	// of 0, 0 and be anchored at 10, 34).
	this.makeMarkerIcon = function(markerColor) {
		var image = {
			url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
			size: new google.maps.Size(21, 34),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(10, 34),
			scaledSize: new google.maps.Size(21, 34)
		};
	  	return image;
	};

	// Define two event binding functions for placeList
	this.setCurIcon = function() {
		console.log(this);
		var icon = self.makeMarkerIcon('f49541');
		this.marker.setIcon(icon);
	};
	this.setDefaultIcon = function() {
		var icon = self.makeMarkerIcon('42c2f4');
		this.marker.setIcon(icon);
	};
};

var vm = new ViewModel();

ko.applyBindings(vm);
