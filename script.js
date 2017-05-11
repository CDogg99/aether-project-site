var map, currentPosition, path;
function initMap() {
	map = new google.maps.Map(document.getElementById('mapContainer'), {
		zoom: 14,
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

var mapData = [];
//Temporary
mapData[0] = {
	latitude: 29.7858,
	longitude: -95.8244,
	//meters
	altitude: 500,
	//Celsius
	temperature: -32,
	//mbar
	pressure: 813.25
};
function retrieveMapData(){
	$.ajax({
		type: "GET",
		url: "api/data",
		success: function(data){
			//mapData = JSON.parse(data);
			initMap();
			var recentPoint = mapData[0];
			$("#position").html("("+ recentPoint.latitude + ", " + recentPoint.longitude + ")");
			$("#altitude").html(roundToTenth(recentPoint.altitude * 3.28084));
			$("#temperature").html(roundToTenth(recentPoint.temperature * 1.8 + 32));
			$("#pressure").html(roundToTenth(recentPoint.pressure * 0.0145038));
		}
	});
}

$(document).ready(function(){
	//This looks bad
	/*$("#twitterContainer").hover(
		//enter
		function(){
			$(this).css("overflow-y","scroll");
		},
		//exit
		function(){
			$(this).css("overflow-y","hidden");
		}
	);*/
	$("#sidebar").css("display","none");
	//Kind of a ratchet solution, but I don't know when twitter is done loading
	setTimeout(function(){
		$("#sidebar").css("display","flex");
		document.getElementById("arrowIcon").innerHTML="keyboard_arrow_right";
		toggleID("sidebar",true,0);
		if($(window).width()<700){
		document.getElementById("arrowIcon").innerHTML="keyboard_arrow_right";
		toggleID("sidebar",true,0);
		}else{
			document.getElementById("arrowIcon").innerHTML="keyboard_arrow_left";
			toggleID("sidebar",false,550);
		}
	},2000);
	$( window ).resize(function() {
		if($(window).width()<700){
		document.getElementById("arrowIcon").innerHTML="keyboard_arrow_right";
		toggleID("sidebar",true,0);
	}
	});
	$("#sidebarButton").on("click",function(){
		if(document.getElementById("arrowIcon").innerHTML=="keyboard_arrow_left"){
			document.getElementById("arrowIcon").innerHTML="keyboard_arrow_right";
			toggleID("sidebar",true,350);
		}else{
			document.getElementById("arrowIcon").innerHTML="keyboard_arrow_left";
			toggleID("sidebar",false,350);
		}
		/*setTimeout(function(){
			google.maps.event.trigger(map, 'resize');
		}, 500);*/
	});
});

function toggleID(id, left, speed){
	if(left)
		$("#"+id).animate({left:'-'+$("#"+id).width()+"px"},speed);
	else
		$("#"+id).animate({left:"0px"},speed);
}

function roundToTenth(x){
	return Math.max(Math.round(x * 10) / 10);
}