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
	{name: 'Smart Kitchen', location: {lat:-36.738642, lng: 174.717706}, zomatoId: '7006828', style: 'chinese', area: 'northshore', marker: null},
	{name: 'Shaolin Kung Fu Noodles', location: {lat:-36.744025, lng: 174.693630}, zomatoId: '7005869', style: 'chinese', area: 'northshore', marker: null},
	{name: 'Asian Work', location: {lat:-36.714350, lng: 174.747421}, zomatoId: '7000861', style: 'chinese', area: 'northshore', marker: null},
	{name: "Bushman's Grill", location: {lat:-36.790714, lng: 174.749119}, zomatoId: '7003899', style: 'western', area: 'northshore', marker: null},
	{name: "Galbraith's Alehouse", location: {lat:-36.865644, lng: 174.761184}, zomatoId: '7000713', style: 'western', area: 'city', marker: null},
	{name: "Pen Pen Xian", location: {lat:-36.867522, lng: 174.776866}, zomatoId: '7000703', style: 'chinese', area: 'city', marker: null},
	{name: "Bian Sushi & Donburi", location: {lat:-36.863015, lng: 174.760968}, zomatoId: '7000585', style: 'japnese', area: 'city', marker: null},
	{name: "Nuna Restaurant", location: {lat:-36.8557640816, lng: 174.7622469440}, zomatoId: '7006543', style: 'korean', area: 'city', marker: null},
];

// Model: 
// --Define the favorite place module
var Place = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
	this.style = ko.observable(data.style);
	this.area = ko.observable(data.area);
	this.zomatoId = ko.observable(data.zomatoId);
};

// --Define the toggle btn object
var Toggle = function() {
	this.isClicked = ko.observable(false);
};

// View Model: Define the VM
// -- control all the information changing for Models and showing the results on the View
var ViewModel = function() {
	var self = this; 

	self.placeList = ko.observableArray([]);

	// Save the init places in placeList
	initPlaces.forEach(function(place) {
		self.placeList.push(new Place(place));
	});

	self.styleFilter = ko.observable("all");
	self.areaFilter = ko.observable("all");

	// Computed the current showing places(markers) depending on the filters
	self.curPlaceList = ko.computed(function() {
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

	// Use toggle object to conrtol open/close the toggle menu
	self.toggle = new Toggle();
	self.toggleMenu = function() {
		self.toggle.isClicked(!self.toggle.isClicked());
	};

	// curPlace is what has been clicked in markers or curPlaceList
	self.curPlace = ko.observable(self.placeList()[0]);

	// Define two event binding functions for placeList
	self.setCurIcon = function() {
		var icon = makeMarkerIcon('f49541');

		// "this" here means the Place object
		this.marker.setIcon(icon);
	};
	self.setDefaultIcon = function() {
		var icon = makeMarkerIcon('42c2f4');
		this.marker.setIcon(icon);
	};

	// Bind to curPlaceList click event
	// --- Update curPlace then pop up the infoWindow in right marker
	self.getPlaceMarker = function(place) {
		self.curPlace(place);
		populateInfoWindow(place.marker);
	};

	// Bind to style & area filter change
	self.refreshMarkers = function() {
		// Clear all markers on the map
		for (var i = 0; i < markers.length; i++) {
		  markers[i].setMap(null);
		}

		// Empty the markers array
		markers = [];

		if (self.curPlaceList().length > 0) {
			// Show all the new markers depending on the filters
			showMarkers();
		}
	};

	/*
	-- Google Maps Control
	*/
	var map;
	var markers = [];

	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = function() {
		 return makeMarkerIcon('42c2f4');
	};
	// Create a "highlighted location" marker color for when the user mouses over the marker.
	var highlightedIcon = function() {
		return makeMarkerIcon('f49541');
	};

	// Function to initialize the map within the map div
	self.initMap = function() {
		map = new google.maps.Map($("#map")[0], {
			center: {lat: -36.745779, lng: 174.746269},
			styles: styles,
			zoom: 13,
			mapTypeControl: false
		});

		showMarkers();
	};

	// Define this closure return function to make sure add the right listener for each marker 
	var selectPlace = function(marker, place) {
		return function() {
			self.curPlace(place);
			populateInfoWindow(marker);
		};
	}

	// Loop to show all the markers in curPlaceList
	var showMarkers = function() {
		// Define the bounds for all the markers
		var bounds = new google.maps.LatLngBounds();

		var res_id = "";

		// The following group uses the filtered location array to create an array of markers on initialize.
		for (var i = 0; i<self.curPlaceList().length; i++) {
		  // Get the position from the location array.
		  var position = self.curPlaceList()[i].location();
		  var title = self.curPlaceList()[i].name();
		  var place = self.curPlaceList()[i];

		  // Create a marker per location, and put into markers array.
		  var marker = new google.maps.Marker({
		    position: position,
		    title: title,
		    animation: google.maps.Animation.DROP,
		    //icon: "img/restaurant-icon-small.png",
		    icon: defaultIcon(),
		    id: self.curPlaceList()[i].zomatoId()
		  });
		  self.curPlaceList()[i].marker = marker;
		  marker.setMap(map);

		  // Extend bound for new marker's position
		  bounds.extend(position);

		  // Push the marker to our array of markers
		  markers.push(marker);

		  // Create an onclick event to open the large infoWindow at each marker
		  marker.addListener('click', selectPlace(marker, place));

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

	var infoWindow = null;

	// Function to show place detail in infoWindow
	var populateInfoWindow = function (marker) {
		// Test console to make sure already get the right current place
		//console.log(self.curPlace().name());

		// Create new infoWindow only when click marker/place at the first time
		infoWindow = (infoWindow != null) ? infoWindow : new google.maps.InfoWindow();

		// If condition will avoid open multiple infoWindow when click the same marker again
		if (infoWindow.marker != marker) {
			infoWindow.marker = marker;
			infoWindow.setContent('');
			infoWindow.addListener('closeclick', function() {
		    	infoWindow.marker = null;
			});

			var streetViewService = new google.maps.StreetViewService();
			var radius = 40;

			// Function to get streetView, Zomato info (by ajax)
			function getStreetView(data, status) {
				var resId = self.curPlace().zomatoId();
				var result = {
					rating: "",
					averageCostForTwo: "",
					currency: "",
					errMsg: ""
				};

				// Use ajax to get the Zomato restaurant info
				$.ajax ({
					url: "https://developers.zomato.com/api/v2.1/restaurant?",
					data: {
						'res_id': resId
					},
					headers: {
						'user-key': "8efa773100b432e426e7816bfeaef2af"
					},
					dataType: "json",
					success: function(re) {
						result.rating = (re.user_rating.aggregate_rating == "0")? re.user_rating.rating_text : re.user_rating.aggregate_rating;
						result.averageCostForTwo = re.average_cost_for_two;
						result.currency = re.currency;
					},
					error: function() {
						result.errMsg = "Can't find Zomato info.";
					},
					complete: function() {
						var content = "";
						if (status == google.maps.StreetViewStatus.OK) {
							content = '<div>' + marker.title + '</div><div id="pano"></div>';

							content = checkZomatoInfo(result, content);

							infoWindow.setContent(content);

							var nearLocation = data.location.latLng;
							var heading = google.maps.geometry.spherical.computeHeading(nearLocation, marker.position);
							var panoramaOptions = {
								position: nearLocation,
								pov: {
									heading: heading,
									pitch: 30
								}
							};

							// Id: #pano will be added automaticely within each infoWindow when click the marker
							var panorama = new google.maps.StreetViewPanorama($('#pano')[0], panoramaOptions);
						} else {
							content = '<div>' + marker.title + '</div>' + '<div>No Street View Found</div>';
							content = checkZomatoInfo(result, content);
							infoWindow.setContent(content);
						}
					}
				}); //End of $.ajax
	    	} // End of function getStreetView

	    	// Function to make sure content contains proper Zomato info
	    	function checkZomatoInfo(result, content) {
	    		if (result.errMsg != "") {
	    			content += '<div>' + result.errMsg + '</div>';
	    		} else {
	    			content += '<div>Zomato rating: ' + result.rating + '</div>' +
	    					   '<div>Average cost (for 2): ' + result.averageCostForTwo + " " + result.currency + '</div>';
	    		}
	    		return content;
	    	}

			// Open infoWindow and show the streetView & Zomato info
			streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
			infoWindow.open(map, marker);
		}
	};

	// This function takes in a COLOR, and then creates a new marker
	// icon of that color. The icon will be 21 px wide by 34 high, have an origin
	// of 0, 0 and be anchored at 10, 34).
	var makeMarkerIcon = function(markerColor) {
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
