$(document).ready(function(){
    $("#infoBtn").hover(
        function(){
            $(this).css("color","blue");
            $("#info").toggle();
        },
        function(){
            $(this).css("color","black");
            $("#info").toggle();
        });
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



function updateInfo(JSON_obj){
	
}