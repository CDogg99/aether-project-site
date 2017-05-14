var map, currentPosition, path;
function initMap() {
	map = new google.maps.Map(document.getElementById('mapContainer'), {
		zoom: 14,
		center: {
			//Centers on the most recent position
			lat: parseFloat(locationData[0].latitude),
			lng: parseFloat(locationData[0].longitude)
		},
		mapTypeId: 'roadmap',
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_RIGHT
		}
	});

	//Places marker at most recent location
	currentPosition = new google.maps.Marker({
		position: { lat: parseFloat(locationData[0].latitude), lng: parseFloat(locationData[0].longitude) },
		title: "Current Position",
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

var locationData = [];
var weatherData = [];
function retrieveData() {
	$.ajax({
		type: "GET",
		url: "api/data/location",
		success: function (data) {
			locationData = JSON.parse(data);
			initMap();
			$("#position").html("(" + locationData[0].latitude + ", " + locationData[0].longitude + ")");
			for (var i = 0; i < locationData.length; i++) {
				if (locationData[i].altitude) {
					$("#altitude").html(roundToTenth(locationData[i].altitude * 3.28084));
					break;
				}
			}
		}
	});
	$.ajax({
		type: "GET",
		url: "api/data/weather",
		success: function (data) {
			weatherData = JSON.parse(data);
			for (var x = 0; x < weatherData.length; x++) {
				if (weatherData[x].temperature && $("#temperature").html() == "temp") {
					$("#temperature").html(roundToTenth(weatherData[x].temperature * 1.8 + 32));
				}
				if (weatherData[x].pressure && $("#pressure").html() == "psr") {
					$("#pressure").html(roundToTenth(weatherData[x].pressure * 0.0145038));
				}
			}
		}
	});
}

var media;
$(document).ready(function () {
	$("#sidebar").css("display", "none");
	//Kind of a ratchet solution, but I don't know when twitter is done loading
	setTimeout(function () {
		$("#sidebar").css("display", "flex");
		document.getElementById("arrowIcon").innerHTML = "keyboard_arrow_right";
		toggleID("sidebar", true, 0);
		if ($(window).width() < 700) {
			document.getElementById("arrowIcon").innerHTML = "keyboard_arrow_right";
			toggleID("sidebar", true, 0);
		} else {
			document.getElementById("arrowIcon").innerHTML = "keyboard_arrow_left";
			toggleID("sidebar", false, 550);
		}
	}, 2000);
	$(window).resize(function () {
		if ($(window).width() < 700) {
			document.getElementById("arrowIcon").innerHTML = "keyboard_arrow_right";
			toggleID("sidebar", true, 0);
		}
	});
	$("#sidebarButton").on("click", function () {
		if (document.getElementById("arrowIcon").innerHTML == "keyboard_arrow_left") {
			document.getElementById("arrowIcon").innerHTML = "keyboard_arrow_right";
			toggleID("sidebar", true, 350);
		} else {
			document.getElementById("arrowIcon").innerHTML = "keyboard_arrow_left";
			toggleID("sidebar", false, 350);
		}
	});
	$.ajax({
		type: "GET",
		url: "api/tweets/recent",
		success: function (data) {
			var tweet = JSON.parse(data);
			var message = tweet.body;
			media = JSON.parse(tweet.media);

			message = message.substring(0, message.indexOf("http") - 1);
			$("#twitterText").html(message);
			$("#cheek").html("");
			for(var i = 0; i < media.length; i++){
				var afterElement="#tweetImg"+i+":hover:after{position:absolute;animation-duration: 0.7s;animation-name: slidein;left:0px;animation-fill-mode:forwards;height:100%;border-radius:5px;width:100%;content: '';background-image:url("+'"'+media[i]+'"'+");z-index:400;background-size: cover;background-repeat: no-repeat;background-position: center center;}";
			 	var li = $("<div id='tweetImg"+i+"' class='twitterImg' style='background-image:url("+'"'+media[i]+'"'+");'></div>");//.append($("<img src='" + media[i] + "'>"));
			 	$("#twitterImages").append(li);
				$("#cheek").append(afterElement);
			}
		}
	});
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