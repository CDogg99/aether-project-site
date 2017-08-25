var map, initialPosition, finalPosition, path;
function initMap() {
	map = new google.maps.Map(document.getElementById('mapContainer'), {
		zoom: 12,
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
		position: { lat: parseFloat(locationData[locationData.length -1].latitude), lng: parseFloat(locationData[locationData.length -1].longitude) },
		title: "Landing position",
		map: map
	});
	//Places marker at initial location
	initialPosition = new google.maps.Marker({
		position: { lat: parseFloat(locationData[0].latitude), lng: parseFloat(locationData[0].longitude) },
		title: "Launch position",
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

var locationData, altitudeData, speedData;
//Should only be used for initialization
function retrieveData() {
	$.getJSON("data/spottrace_location_data.json", function (data) {
		locationData = data;
		locationData.sort(function (a, b) {
			return a.unix_time - b.unix_time;
		});
		initMap();
	});
	$.getJSON("data/aprs_location_data.json", function (data) {
		altitudeData = data;
		altitudeData.sort(function (a, b) {
			return a.unix_time - b.unix_time;
		});
	});
	$.getJSON("data/aprs_speed_data.json", function (data) {
		speedData = data;
		speedData.sort(function (a, b) {
			return a.unix_time - b.unix_time;
		});
	});
}

var view = null;
$(document).ready(function () {
	for(var i = 1; i <= 12; i++){
		var imgStr = '<img class="display-image" src="images/balloon/' + i + '.JPG">';
		$("#imageContainer").append(imgStr);
	}
	$("#imageLink").click(function () {
		if (view !== "images") {
			view = "images";
			clearView();
			$(this).addClass("selected");
			$("#imageContainer").show();
		}
	});
	$("#videoLink").click(function () {
		if (view !== "video") {
			view = "video";
			clearView();
			$(this).addClass("selected");
			$("#videoContainer").show();
		}
	});
	$("#dataLink").click(function () {
		if (view !== "data") {
			view = "data";
			clearView();
			$(this).addClass("selected");
			$("#dataContainer").css("display", "flex");
            $("#locationLink").trigger('click');
		}
	});
    $("#homeLink").click(function(){
        if (view !== "home") {
			view = "home";
			clearView();
			$("#homeContainer").show();
		}
    });
	$("#locationLink").click(function () {
		if (view !== "location") {
			view = "location";
			clearView();
			$("#dataLink").addClass("selected");
			$(this).addClass("selected");
			$("#dataContainer").show();
			var cols = ["Time (CST)", "Latitude", "Longitude"];
			var data = [];
			var time = [];
			var lat = [];
			var lng = [];
			for (var i = 0; i < locationData.length; i++) {
				var cur = locationData[i];
				time.push(unixToStr(cur.unix_time));
				lat.push(cur.latitude);
				lng.push(cur.longitude);
			}
			data[0] = time;
			data[1] = lat;
			data[2] = lng;
			loadTable("#dataTable", cols, data);
		}
	});
    
    $(".video-thumbnail").click(function(){
        $("#playback-container").css("display","flex");
    });
    
    $("#playback-container").click(function(){
        $("#playback-container").css("display","none");
    });
    
	$("#speedLink").click(function () {
		if (view !== "speed") {
			view = "speed";
			clearView();
			$("#dataLink").addClass("selected");
			$(this).addClass("selected");
			$("#dataContainer").show();
			var cols = ["Time (CST)", "Speed (mph)"];
			var data = [];
			var time = [];
			var speed = [];
			for (var i = 0; i < speedData.length; i++) {
				var cur = speedData[i];
				time.push(unixToStr(cur.unix_time));
				speed.push(roundToTenth(cur.speed * 0.621371));
			}
			data[0] = time;
			data[1] = speed;
			loadTable("#dataTable", cols, data);
		}
	});
	$("#altitudeLink").click(function () {
		if (view !== "altitude") {
			view = "altitude";
			clearView();
			$("#dataLink").addClass("selected");
			$(this).addClass("selected");
			$("#dataContainer").show();
			var cols = ["Time (CST)", "Altitude (ft)"];
			var data = [];
			var time = [];
			var altitude = [];
			for (var i = 0; i < altitudeData.length; i++) {
				var cur = altitudeData[i];
				time.push(unixToStr(cur.unix_time));
				altitude.push(roundToTenth(cur.altitude * 3.28084));
			}
			data[0] = time;
			data[1] = altitude;
			loadTable("#dataTable", cols, data);
		}
	});
	$("#mapLink").click(function () {
		if (view !== "map") {
			view = "map";
			clearView();
			$(this).addClass("selected");
			$("#mapContainer").show();
			google.maps.event.trigger(map, 'resize');
			map.setCenter({ lat: parseFloat(locationData[0].latitude), lng: parseFloat(locationData[0].longitude) });
		}
	});
    $('#homeLink').trigger('click');
});

function clearView() {
	$("#imageContainer, #videoContainer, #dataContainer, #mapContainer, #homeContainer").css("display", "none");
	$("#nav a").removeClass("selected");
	$("#dataNav a").removeClass("selected");
	$("#dataTable").html("");
}

/*
Makes a table
tableContainerID - ID of tableContainer
colNames - String array of column names
data - 2D array holding the data you wish to display
*/
function loadTable(tableContainerID, colNames, data) {
	if (data === null)
		data = [];
	$(tableContainerID).html("");
	for (i = 0; i < colNames.length; i++) {
		var add = "<div class='tableCol'><div class='tableHeader'>" + colNames[i] + "</div>";
		for (j = 0; j < data[i].length; j++)
			add += "<div class='tableContent'>" + data[i][j] + "</div>";
		add += "</div>";
		$(tableContainerID).append(add);
	}
}

function roundToTenth(x) {
	return Math.max(Math.round(x * 10) / 10);
}

function unixToStr(unix_time) {
	var date = new Date(unix_time * 1000);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var pm = false;
	var ret = "";
	if (hours >= 13) {
		hours -= 12;
		pm = true;
	}
	else if(hours == 12){
		pm = true;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (pm) {
		ret = hours + ":" + minutes + " PM";
	}
	else {
		ret = hours + ":" + minutes + " AM";
	}
	return ret;
}