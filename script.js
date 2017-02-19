$(document).ready(function(){
	$("#sidebarButton").on("click",function(){
		toggleID("sidebar");
		if(document.getElementById("arrowIcon").innerHTML=="keyboard_arrow_left")
			document.getElementById("arrowIcon").innerHTML="keyboard_arrow_right";
		else
			document.getElementById("arrowIcon").innerHTML="keyboard_arrow_left";
	});
	//checkForUpdate();
	//Queries API to check for new status updates every 60 seconds
	//setInterval(checkForUpdate, 60000);
});

var map, currentPosition, path;
function initMap() {
	map = new google.maps.Map(document.getElementById('mapContainer'), {
		zoom: 12,
		center: {
			//Centers on the most recent position
			lat: parseFloat(mapData[0].latitude),
			lng: parseFloat(mapData[0].longitude)
		},
		mapTypeId: 'roadmap',
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_RIGHT
		}
	});
	//Places marker at most recent location
	currentPosition = new google.maps.Marker({
		position: {lat: parseFloat(mapData[0].latitude), lng: parseFloat(mapData[0].longitude)},
		animation: google.maps.Animation.BOUNCE,
		title: "Current Position",
		map: map
	});
	//Loads positions into pathArray and displays balloon route
	var pathArray = [];
	for(var i = 0; i < mapData.length; i++){
		pathArray[i] = {lat: parseFloat(mapData[i].latitude), lng: parseFloat(mapData[i].longitude)};
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

var mapData;
function retrieveMapData(){
	$.ajax({
		type: "GET",
		url: "api/data",
		success: function(data){
			mapData = JSON.parse(data);
			initMap();
		}
	});
}

function checkForUpdate(){
	console.log("Update");
	$.ajax({
		type: "GET",
		url: "api/data/update",
		success: function(data){
			console.log(JSON.parse(data));
		}
	});
}

function toggleID(id){
	$("#"+id).animate({width:'toggle'},350);
}
