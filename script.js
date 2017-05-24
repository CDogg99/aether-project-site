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
		position: { lat: parseFloat(locationData[0].latitude), lng: parseFloat(locationData[0].longitude) },
		title: "Landing position",
		map: map
	});
	//Places marker at initial location
	initialPosition = new google.maps.Marker({
		position: { lat: parseFloat(locationData[locationData.length-1].latitude), lng: parseFloat(locationData[locationData.length-1].longitude) },
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
	$.getJSON("data/spottrace_location_data.json", function(data){
		locationData = data;
		locationData.sort(function(a, b){
			return b.unix_time - a.unix_time;
		});
		initMap();
	});
	$.getJSON("data/aprs_location_data.json", function(data){
		altitudeData = data;
		altitudeData.sort(function(a, b){
			return b.unix_time - a.unix_time;
		});
	});
	$.getJSON("data/aprs_speed_data.json", function(data){
		speedData = data;
		speedData.sort(function(a, b){
			return b.unix_time - a.unix_time;
		});
	});
}

var view = null;
$(document).ready(function(){
	$("#imageLink").click(function(){
		if(view !== "images"){
			view = "images";
			clearView();
			$(this).addClass("selected");
			$("#imageContainer").show();
		}
	});
	$("#videoLink").click(function(){
		if(view !== "video"){
			view = "video";
			clearView();
			$(this).addClass("selected");
			$("#videoContainer").show();
		}
	});
	$("#dataLink").click(function(){
		if(view !== "data"){
			view = "data";
			clearView();
			$(this).addClass("selected");
			$("#dataContainer").css("display","flex")
		}
	});
	$("#locationLink").click(function(){
		if(view !== "location"){
			view = "location";
			clearView();
			$("#dataLink").addClass("selected");
			$(this).addClass("selected");
			$("#dataContainer").show();
		}
	});
	$("#speedLink").click(function(){
		if(view !== "speed"){
			view = "speed";
			clearView();
			$("#dataLink").addClass("selected");
			$(this).addClass("selected");
			$("#dataContainer").show();
		}
	});
	$("#altitudeLink").click(function(){
		if(view !== "altitude"){
			view = "altitude";
			clearView();
			$("#dataLink").addClass("selected");
			$(this).addClass("selected");
			$("#dataContainer").show();
		}
	});
	$("#mapLink").click(function(){
		if(view !== "map"){
			view = "map";
			clearView();
			$(this).addClass("selected");
			$("#mapContainer").show();
			google.maps.event.trigger(map, 'resize');
			map.setCenter({lat: parseFloat(locationData[0].latitude), lng: parseFloat(locationData[0].longitude)});
		}
	});
});

function clearView(){
	$("#imageContainer, #videoContainer, #dataContainer, #mapContainer").css("display","none")
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
function loadTable(tableContainerID, colNames, data){
	if(data==null)
		data=[];
	$(tableContainerID).html("");
	for(i=0;i<colNames.length;i++){
		var add="<div class='tableCol'><div class='tableHeader'>"+colNames[i]+"</div>";
		for(j=0;j<data.length;j++)
			add+="<div class='tableContent'>"+data[j][i]+"</div>";
		add+="</div>";
		$(tableContainerID).append(add);
	}
}

function roundToTenth(x) {
	return Math.max(Math.round(x * 10) / 10);
}