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
var tweet, message, media;
//Should only be used for initialization
function retrieveData() {
	//Load location data
	$.ajax({
		type: "GET",
		url: "api/data/location",
		success: function (data) {
			locationData = JSON.parse(data);
			//If no data, center on THS
			if(locationData.length === 0){
				locationData[0] = {
					latitude: 29.776649,
					longitude: -95.730943
				};
			}
			initMap();
			$("#position").html("(" + locationData[0].latitude + ", " + locationData[0].longitude + ")");
			for (var i = 0; i < locationData.length; i++) {
				if (locationData[i].altitude) {
					$("#altitude").html(roundToTenth(locationData[i].altitude * 3.28084));
					break;
				}
			}
			//Load weather data
			$.ajax({
				type: "GET",
				url: "api/data/weather",
				success: function (data) {
					weatherData = JSON.parse(data);
					if(weatherData !== null){
						for (var x = 0; x < weatherData.length; x++) {
							if (weatherData[x].temperature && $("#temperature").html() == "temp") {
								$("#temperature").html(roundToTenth(weatherData[x].temperature * 1.8 + 32));
							}
							if (weatherData[x].pressure && $("#pressure").html() == "psr") {
								$("#pressure").html(roundToTenth(weatherData[x].pressure * 0.0145038));
							}
						}
					}
					//Load most recent Tweet
					$.ajax({
						type: "GET",
						url: "api/tweets/recent",
						success: function (data) {
							tweet = JSON.parse(data);
							message = tweet.body;
							media = JSON.parse(tweet.media);

							//Check to see if message has link and remove if it does
							if(message.indexOf("http") > -1){
								message = message.substring(0, message.indexOf("http") - 1);
							}
							$("#twitterText").html(message);

							$("#cheek").html("");

							if(media !== null){
								for(var i = 0; i < media.length; i++){
									var afterElement="#tweetImg"+i+":hover:after{box-shadow: 0 0 20px rgba(0,0,0,0.3);animation-duration: 0.5s;animation-name: slidein;animation-fill-mode:forwards;position:absolute;left:0px;height:100%;border-radius:5px;width:100%;content: '';background-image:url("+'"'+media[i]+'"'+");z-index:400;background-size: cover;background-repeat: no-repeat;background-position: center center;}";
									afterElement+="#tweetImg"+i+":after{height:0%;width:0%}";
									var li = $("<div id='tweetImg"+i+"' class='twitterImg' style='background-image:url("+'"'+media[i]+'"'+");'></div>");//.append($("<img src='" + media[i] + "'>"));
									$("#twitterImages").append(li);
									$("#cheek").append(afterElement);
								}
							}
						}
					});
				}
			});
		}
	});
}

function updateData(){
	console.log('Update');
	//Update location data
	$.ajax({
		type: "GET",
		url: "api/data/location",
		success: function (data) {
			//Update weather data
			$.ajax({
				type: "GET",
				url: "api/data/weather",
				success: function (data) {
					//Update most recent tweet
					$.ajax({
						type: "GET",
						url: "api/tweets/recent",
						success: function (data) {
							var tmpTweet = JSON.parse(data);
							var tmpMessage = tmpTweet.body;
							var tmpMedia = JSON.parse(tmpTweet.media);
							//Check to see if original Tweet bodies are the same
							if(tmpMessage != tweet.body){
								$("#twitterText").empty();
								$("#twitterImages").empty();

								tweet = tmpTweet;
								message = tmpMessage;
								media = tmpMedia;

								if(message.indexOf("http") > -1){
									message = message.substring(0, message.indexOf("http") - 1);
								}
								$("#twitterText").html(message);
								$("#cheek").html("");
								if(media !== null){
									for(var i = 0; i < media.length; i++){
										var afterElement="#tweetImg"+i+":hover:after{box-shadow: 0 0 20px rgba(0,0,0,0.3);animation-duration: 0.5s;animation-name: slidein;animation-fill-mode:forwards;position:absolute;left:0px;height:100%;border-radius:5px;width:100%;content: '';background-image:url("+'"'+media[i]+'"'+");z-index:400;background-size: cover;background-repeat: no-repeat;background-position: center center;}";
										afterElement+="#tweetImg"+i+":after{height:0%;width:0%}";
										var li = $("<div id='tweetImg"+i+"' class='twitterImg' style='background-image:url("+'"'+media[i]+'"'+");'></div>");//.append($("<img src='" + media[i] + "'>"));
										$("#twitterImages").append(li);
										$("#cheek").append(afterElement);
									}
								}
							}
							else{
								if(tmpMedia !== null && media !== null){
									var cnt = 0;
									for(var f = 0; f < tmpMedia.length; f++){
										if(tmpMedia[f] == media[f]){
											cnt++;
										}
									}
									if(cnt != tmpMedia.length){
										$("#twitterText").empty();
										$("#twitterImages").empty();

										tweet = tmpTweet;
										message = tmpMessage;
										media = tmpMedia;

										if(message.indexOf("http") > -1){
											message = message.substring(0, message.indexOf("http") - 1);
										}
										$("#twitterText").html(message);
										$("#cheek").html("");
										if(media !== null){
											for(var i = 0; i < media.length; i++){
												var afterElement="#tweetImg"+i+":hover:after{box-shadow: 0 0 20px rgba(0,0,0,0.3);animation-duration: 0.5s;animation-name: slidein;animation-fill-mode:forwards;position:absolute;left:0px;height:100%;border-radius:5px;width:100%;content: '';background-image:url("+'"'+media[i]+'"'+");z-index:400;background-size: cover;background-repeat: no-repeat;background-position: center center;}";
												afterElement+="#tweetImg"+i+":after{height:0%;width:0%}";
												var li = $("<div id='tweetImg"+i+"' class='twitterImg' style='background-image:url("+'"'+media[i]+'"'+");'></div>");//.append($("<img src='" + media[i] + "'>"));
												$("#twitterImages").append(li);
												$("#cheek").append(afterElement);
											}
										}
									}
								}
								else if(tmpMedia !== null || media !== null){
									$("#twitterText").empty();
									$("#twitterImages").empty();

									tweet = tmpTweet;
									message = tmpMessage;
									media = tmpMedia;

									if(message.indexOf("http") > -1){
										message = message.substring(0, message.indexOf("http") - 1);
									}
									$("#twitterText").html(message);
									$("#cheek").html("");
									if(media !== null){
										for(var i = 0; i < media.length; i++){
											var afterElement="#tweetImg"+i+":hover:after{box-shadow: 0 0 20px rgba(0,0,0,0.3);animation-duration: 0.5s;animation-name: slidein;animation-fill-mode:forwards;position:absolute;left:0px;height:100%;border-radius:5px;width:100%;content: '';background-image:url("+'"'+media[i]+'"'+");z-index:400;background-size: cover;background-repeat: no-repeat;background-position: center center;}";
											afterElement+="#tweetImg"+i+":after{height:0%;width:0%}";
											var li = $("<div id='tweetImg"+i+"' class='twitterImg' style='background-image:url("+'"'+media[i]+'"'+");'></div>");//.append($("<img src='" + media[i] + "'>"));
											$("#twitterImages").append(li);
											$("#cheek").append(afterElement);
										}
									}
								}
							}
						}
					});
					//If lengths are not same there must be new data
					if(JSON.parse(data).length != weatherData.length){
						weatherData = JSON.parse(data);
						var updateTemp, updatePressure = false;
						for (var x = 0; x < weatherData.length; x++) {
							if (weatherData[x].temperature && !updateTemp) {
								$("#temperature").html(roundToTenth(weatherData[x].temperature * 1.8 + 32));
								updateTemp = true;
							}
							if (weatherData[x].pressure && !updatePressure) {
								$("#pressure").html(roundToTenth(weatherData[x].pressure * 0.0145038));
								updatePressure = true;
							}
						}
					}
				}
			});
			//If lengths are not same there must be new data
			if(JSON.parse(data).length != locationData.length){
				locationData = JSON.parse(data);
				$("#position").html("(" + locationData[0].latitude + ", " + locationData[0].longitude + ")");
				for (var i = 0; i < locationData.length; i++) {
					if (locationData[i].altitude) {
						$("#altitude").html(roundToTenth(locationData[i].altitude * 3.28084));
						break;
					}
				}
				var pathArray = [];
				for (var e = 0; e < locationData.length; e++) {
					pathArray[e] = { lat: parseFloat(locationData[e].latitude), lng: parseFloat(locationData[e].longitude) };
				}
				path.setPath(pathArray);
				var center = {
					lat: parseFloat(locationData[0].latitude),
					lng: parseFloat(locationData[0].longitude)
				};
				map.setCenter(center);
				currentPosition.setPosition(center);
			}
		}
	});
}

$(document).ready(function () {
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
	//Updates data every 10 seconds
	setInterval(updateData, 5000);
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