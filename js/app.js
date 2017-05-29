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
	{name: 'Smart Kitchen', location: {lat:-36.738642, lng: 174.717706}, style: 'chinese', area: 'northshore', marker: null},
	{name: 'Shaolin Kung Fu Noodles', location: {lat:-36.744025, lng: 174.693630}, style: 'chinese', area: 'northshore', marker: null},
	{name: 'Asian Work', location: {lat:-36.714350, lng: 174.747421}, style: 'chinese', area: 'northshore', marker: null},
	{name: "Bushman's Grill", location: {lat:-36.790714, lng: 174.749119}, style: 'western', area: 'northshore', marker: null},
	{name: "Galbraith's Alehouse", location: {lat:-36.865644, lng: 174.761184}, style: 'western', area: 'city', marker: null},
	{name: "Pen Pen Xian", location: {lat:-36.867522, lng: 174.776866}, style: 'chinese', area: 'city', marker: null},
	{name: "Bian Sushi & Donburi", location: {lat:-36.863015, lng: 174.760968}, style: 'japnese', area: 'city', marker: null},
	{name: "Seoul Restaurant", location: {lat:-36.855832, lng: 174.762400}, style: 'korean', area: 'city', marker: null},
];

// Model: Define the favorite place module
var Place = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
	this.style = ko.observable(data.style);
	this.area = ko.observable(data.area);
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

	this.styleFilter = ko.observable("all");
	this.areaFilter = ko.observable("all");

	// Computed the current showing places(markers) depending on the filters
	this.curPlaceList = ko.computed(function() {
		return ko.utils.arrayFilter(self.placeList(), function(place) {
			if (self.styleFilter() == "all" && self.areaFilter() == "all") {
				return (true);
			} else if (self.areaFilter() == "all") { // styleFilter is not "all"
				return (place.style() == self.styleFilter());
			} else if (self.styleFilter() == "all") { // areaFilter is not "all"
				return (place.area() == self.areaFilter());
			} else { // Both styleFilter and areaFilter are not "all"
				return (place.style() == self.styleFilter() && place.area() == self.areaFilter());
			}
		});
	});

	this.toggle = new Toggle();
	this.toggleMenu = function() {
		self.toggle.isClicked(!self.toggle.isClicked());
	};

	this.curPlace = ko.observable(this.placeList()[0]);

	// Define two event binding functions for placeList
	this.setCurIcon = function() {
		var icon = self.makeMarkerIcon('f49541');

		// "this" here means the Place object
		this.marker.setIcon(icon);
	};
	this.setDefaultIcon = function() {
		var icon = self.makeMarkerIcon('42c2f4');
		this.marker.setIcon(icon);
	};

	/*
	-- Google Maps Control
	*/
	var map;
	var markers = [];

	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = function() {
		 return self.makeMarkerIcon('42c2f4');
	};
	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = function() {
		return self.makeMarkerIcon('f49541');
	};

	// Function to initialize the map within the map div
	this.initMap = function() {
		console.log("initMap");
		map = new google.maps.Map($("#map")[0], {
			center: {lat: -36.745779, lng: 174.746269},
			styles: styles,
			zoom: 13,
			mapTypeControl: false
		});

		showMarkers();

	};

	var showMarkers = function() {
		// Define the bounds for all the markers
		var bounds = new google.maps.LatLngBounds();

		// The following group uses the filtered location array to create an array of markers on initialize.
		for (var i = 0; i<self.curPlaceList().length; i++) {
		  // Get the position from the location array.
		  var position = self.curPlaceList()[i].location();
		  var title = self.curPlaceList()[i].name();

		  // Create a marker per location, and put into markers array.
		  var marker = new google.maps.Marker({
		    position: position,
		    title: title,
		    animation: google.maps.Animation.DROP,
		    //icon: "img/restaurant-icon-small.png",
		    icon: defaultIcon(),
		    id: i
		  });
		  self.curPlaceList()[i].marker = marker;
		  marker.setMap(map);

		  // Extend bound for new marker's position
		  bounds.extend(position);

		  // Push the marker to our array of markers
		  markers.push(marker);
		  // Two event listeners - one for mouseover, one for mouseout,
		  // to change the colors back and forth.
		  marker.addListener('mouseover', function() {
		    this.setIcon(highlightedIcon());
		  });
		  marker.addListener('mouseout', function() {
		    this.setIcon(defaultIcon());
		  });
		}

		// Set all the markers inside the bounds
		map.fitBounds(bounds);

		// Add listener once to avoid zooming too big after bound changed
		google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
		  if (this.getZoom() > 15) {
		    this.setZoom(15);
		  }
		});
	};

	this.refreshMarkers = function() {
		// Clear all markers on the map
		for (var i = 0; i < markers.length; i++) {
		  markers[i].setMap(null);
		}

		// Empty the markers array
		markers = [];

		if (this.curPlaceList().length > 0) {
			// Show all the new markers depending on the filters
			showMarkers();
		}
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

};

var vm = new ViewModel();

ko.applyBindings(vm);
