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
	var slideTime = 600, simShowing = true;
	// $(".panel-about").hide();


	// --- FUNCTIONS --- \\
	var togglePanes = function () {
		/* (None) -> (None)

		Runs a slide animation to toggle which .panel displays.
		*/

		// Sources (1) Uses jQuery UI to do a slide animation for both
		$(".panel-app").toggle('slide', {direction: 'left'}, slideTime);
		$(".panel-about").toggle('slide', {direction: 'right'}, slideTime, function () {
			// If the simulator is visible, don't allow showSim() functions to run
			if($(".panel-app").is(':visible')){simShowing = true;}
			else {simShowing = false;}
		});
	};

	var showSim = function () {
		/* (None) -> (None)

		Makes sure the simulator is showing
		*/

		// Only do an animation if the sim is hidden
		if (!simShowing) {
			$(".panel-app").toggle('slide', {direction: 'left'}, slideTime);
			$(".panel-about").toggle('slide', {direction: 'right'}, slideTime);
		}

	};

	// --- EVENT LISTENERS --- \\
	// This has to come after so that the functions called  here exist first

	$("#about").on("click", togglePanes);
	$("#title").on("click", showSim);

});
