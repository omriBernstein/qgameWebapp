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
	var count = 0;
	less.resize();

	// *** EVENT LISTENERS ***\\
	// --- Examples --- \\
	$("#examples li").click(function() {ex.pasteEx($(this));});

	// --- Lessons --- \\
	// Make it look like the editor is expanding to fill the page
	$("#lessons").click(function () {
		// A way to toggle, since I couldn't figure out .toggle
		// Change it, restore it, and allow the cycle to progress
		if (count%2 == 0){less.openLess();}
		else {less.closeLess();}
		count++
	});
});

var ex = {
	pasteEx: function ($thisElem) {
		/* ($ collection) -> None

		Copy the text in the $ collection, paste
		it into the editor, and evaluate
		*/

		// If the simulator isn't there, get it back
		if (!less.isSim) {less.closeLess();}

		editor.getSession().setValue("");
		editor.insert($thisElem.text());
		$("#evaluate").trigger("click");
	}
};

var less = {
	isSim: true,

	resize: function () {
		/*
		*/
		// Same width and height as ace
		$("#scrollable-area").css("width", $("#editor").outerWidth());
		$("#scrollable-area").css("height", $(".ace_scroller").outerHeight());
		// Top ribbon and textarea height same
		$("#top-ribbon").css("height", $(".ace_active-line").outerHeight());
		// Corner and textrow height and width same
		$(".num-row").css("height", $(".ace_active-line").outerHeight());
		$(".num-row").css("width", "100%");
		$(".text-row").css("height", $(".ace_active-line").outerHeight());
		$(".text-row").css("width", "100%");
		// Gutter width same
		$("#num-gutter").css("width", $(".ace_gutter").outerWidth());
		
	},

	openLess: function () {
		/* (None) -> None

		Resize everything to let lessons fill the page
		Now crazy stuff, not sure how this will work
		*/

		// Get rid of any text in there
		editor.getSession().setValue("");
		// Wish I could put some kind of delay here...
		// Don't know what could have happened between then and now
		// less.resize();

		// // Changing ace editor (as soon as you type text
		// // it gets small again)
		// editor.setShowPrintMargin(false);
		// $($(".ace_content")[0]).css("width","100%");
		// $("#visualizer").animate(
		// 	{"width":["toggle","swing"]},1000, "linear",
		// 	{progress: function () {$("#ace").css("width", $("#editor").innerWidth());}}
		// );
		
		// Fade out ace fast
		$("#ace").fadeOut(200, function () {
			// Make fake ace relative
			$("#scrollable-area").css({position: "relative", width: "100%"});
			// $("#REPL").animate({"height": "930px"});
			// $("#editor").animate({"height": "100%"});
			// $("#scrollable-area").animate({"height": "100%"});
			// Narrow the width of visualizer till it's gone
			$("#visualizer").animate({"width":["toggle","swing"]}
				, 900, "linear");
		});

		// For things that may want to get the simulator back
		less.isSim = false;
	},

	closeLess: function () {
		/* (None) -> None
		
		*/

		// Bring the visualizer back
		$("#visualizer").animate({"width":["toggle","swing"]}
			, 900, "linear"
			, function () {
				// Then restore our fake to it's factory settings
				// so that ace won't be pushed of the page
				$("#scrollable-area").css({position: "absolute"});
				// Fade ace in
        		$("#ace").fadeIn(200);
        });

		// Set the future "search bar" area to empty again
		$("#scrollable-area").val("");
		// For things that may want to get the simulator back
		less.isSim = true;
	},
};
