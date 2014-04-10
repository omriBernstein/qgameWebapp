/* panels.js
* Created by: knod
* Date: 04/10/14
* Getting between the "about" section and the simulator section
* 
* Sources:
* 1. http://jsfiddle.net/QDUQk/1/
* 
* TODO:
*
* DONE:
* 
*/

$(document).ready(function() {
	// --- SETUP --- \\
	var slideTime = 600, simShowing = true, canToggle = true;
	// $(".panel-about").toggle('slide', {direction: 'right'}, 0);

	// --- FUNCTIONS --- \\
	var togglePanes = function () {
		/* (None) -> (None)

		Runs a slide animation to toggle which .panel is visible.
		Hides .panel-about when it's not visible.
		*/

		// Sources (1)
		// if($(".panel-app").is(':visible')){
			$(".panel-app").toggle('slide', {direction: 'left'}, slideTime);
		// }

		// if($(".panel-about").is(':visible')){
			$(".panel-about").toggle('slide', {direction: 'right'}, slideTime);
		// }

		// if (canToggle) {
		// 	// Don't allow more panel toggling till this one is done
		// 	canToggle = false;

		// 	if (simShowing) {
		// 		$(".panel-app").css({"left": "calc(-100% - 2em)", width: "0"});
		// 		$(".panel-about").css({"left": "0", width: "100%"});
		// 		simShowing = false;
		// 	}

		// 	else {
		// 		$(".panel-app").css({"left": "0", width: "100%"});
		// 		$(".panel-about").css({"left": "calc(100% + 2em)", width: "0"});
		// 		simShowing = true;
		// 	}

		// 	// $(".panel-app").toggleClass("panel-left");
		// 	// $(".panel-about").toggleClass("panel-center")

		// 	// // Toggle simShowing (for showSim to an unneeded animation)
		// 	// if ($(".panel-app").hasClass("panel-left")) {
		// 	// 	simShowing = false;
		// 	// }
		// 	// else {simShowing = true;}

		// 	canToggle = true;
		// }
	};

	var showSim = function () {
		/* (None) -> (None)

		Makes sure the simulator is showing
		*/

		// Only do an animation if the sim is hidden
		if (!simShowing) {
			$(".panel-app").removeClass("panel-left");
			$(".panel-about").removeClass("panel-center");
		}

	};

	// --- EVENT LISTENERS --- \\
	// This has to come after so that the functions called  here exist first

	$("#about").on("click", togglePanes);
	$("#title").on("click", showSim);

});
