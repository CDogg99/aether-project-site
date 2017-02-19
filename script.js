$(document).ready(function(){
	$("#sidebarButton").on("click",function(){
		toggleID("sidebar");
		if(document.getElementById("arrowIcon").innerHTML=="keyboard_arrow_left")
			document.getElementById("arrowIcon").innerHTML="keyboard_arrow_right";
		else
			document.getElementById("arrowIcon").innerHTML="keyboard_arrow_left";
	});
});

function toggleID(id){
	$("#"+id).animate({width:'toggle'},350);
}
