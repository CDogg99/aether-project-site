var map, initialPosition, finalPosition, path;
function initMap() {
	map = new google.maps.Map(document.getElementById('mapContainer'), {
		zoom: 10,
		center: {
			lat: parseFloat(locationData[0].latitude),
			lng: parseFloat(locationData[0].longitude)
		},
		mapTypeId: 'roadmap',
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_RIGHT
		}
	});

	//Places marker at last location
	finalPosition = new google.maps.Marker({
		position: { lat: parseFloat(locationData[0].latitude), lng: parseFloat(locationData[0].longitude) },
		title: "Final Position",
		map: map
	});
	//Places marker at initial location
	initialPosition = new google.maps.Marker({
		position: { lat: parseFloat(locationData[locationData.length-1].latitude), lng: parseFloat(locationData[locationData.length-1].longitude) },
		title: "Initial Position",
		map: map
	});

	//Loads positions into pathArray and displays balloon route
	var pathArray = [];
	for (var i = 0; i < locationData.length; i++) {
		pathArray[i] = { lat: parseFloat(locationData[i].latitude), lng: parseFloat(locationData[i].longitude) };
	}
	path = new google.maps.Polyline({
		path: pathArray,
		geodesic: true,
		strokeColor: '#ff0000',
		strokeOpacity: 1.0,
		strokeWeight: 2,
		map: map
	});
}

var locationData, aprsLocData;
var speedData;
//Should only be used for initialization
function retrieveData() {
	$.getJSON("data/spottrace_location_data.json", function(data){
		locationData = data;
		locationData.sort(function(a, b){
			return b.unix_time - a.unix_time;
		});
		initMap();
		// $.getJSON("data/aprs_location_data.json", function(data){
		// 	//aprsLocData = data;
		// 	locationData = spottraceLocData;
		// 	locationData.sort(function(a, b){
		// 		return b.unix_time-a.unix_time;
		// 	});
		// 	initMap();
		// });
	});
	$.getJSON("data/aprs_speed_data.json", function(data){
		speedData = data;
	});
}

$(document).ready(function () {
});

function toggleID(id, left, speed) {
	if (left)
		$("#" + id).animate({ left: '-' + $("#" + id).width() + "px" }, speed);
	else
		$("#" + id).animate({ left: "0px" }, speed);
}

function roundToTenth(x) {
	return Math.max(Math.round(x * 10) / 10);
}