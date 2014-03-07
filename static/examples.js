/* examples.js
* Created by: 
* Date: 03/06/14
* Examples, to be fleshed out later
* 
* TODO:
* - Add examples
* 
* DONE:
* 
*/

// Ok, this will be all the menu items right now

// Just so I don't have to keep copying and pasting examples goddamnit
$(document).ready(function() {
	// *** SETUP ***\\
	// --- Lessons --- \\
	less.resize();

	// *** EVENT LISTENERS ***\\
	$("#examples li").click(function() {ex.pasteEx($(this));});
	$("#lessons").click(function () {
		less.openLess();
	});
});

var ex = {
	pasteEx: function ($thisElem) {
		/* ($ collection) -> None

		Copy the text in the $ collection, paste
		it into the editor, and evaluate
		*/

		editor.getSession().setValue("");
		editor.insert($thisElem.text());
		$("#evaluate").trigger("click");
	}
};

var less = {
	resize: function () {
		/*
		*/
		// Same width and height as ace
		$("#scrollable-area").css("width", $("#editor").outerWidth());
		$("#scrollable-area").css("height", $(".ace_scroller").outerHeight());
		// Top ribbon height same
		$("#top-ribbon").css("height", $(".ace_active-line").outerHeight());
		// Corner height and width same
		$(".num-row").css("height", $(".ace_active-line").outerHeight());
		$(".num-row").css("width", $(".ace_gutter").outerWidth());
		// Gutter width same
		$("#num-gutter").css("width", $(".ace_gutter").outerWidth());
		
	},

	openLess: function () {
		/* (None) -> None

		Resize everything to let lessons fill the page
		Now crazy stuff, not sure how this will work
		*/

		editor.getSession().setValue("");
		less.resize();
		document.getElementsByClassName("ace_content")[0].style.width="100%";
		// Fade out ace fast
		// $("#ace").fadeOut(200, function () {
			$("#visualizer").animate({
	            "width":["toggle","swing"]
	            // to move it towards the right and, probably, off-screen.
	        	},1000, "linear", {progress: function () {
	        		$("#ace").css("width", $("#editor").innerWidth());
	        		// document.getElementsByClassName("ace_content")[0].style.width = "100px";
	        		// $($(".ace_content")[0]).css("width", $(".ace_scroller").innerWidth());
	        	}}
        	);
		// });

		// $('#ace').animate({

		// })

		// function resizeAce() {
		//   return $('#editor').height($().height());
		// };
		// //listen for changes
		// $(window).resize(resizeAce);
		// //set initially
		// resizeAce();
        //#scrollable-area width to 100%, linear?
	},

	closeLess: function () {


	},
};
