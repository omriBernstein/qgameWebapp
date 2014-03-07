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
	// -- All -- \\
	// Show menu items on hover
	// Get rid of border?
	$(".top-menu").hover(
		function () {
			$(this).children(".menu-items").show();
			$(this).css("background", colors.activeNum);
		}
		, function () {
			$(this).children(".menu-items").hide();
			$(this).css("background", "none");
		}
	);
	$("li").hover(
		function () {
			$(this).css("background", colors.activeText);
		},
		function () {
			$(this).css("background", "inherit");
		}
	);

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
	$("#reference").click(function () {
		if (!less.isSim) {less.closeLess();}
	});
});

var ex = {
	pasteEx: function ($thisElem) {
		/* ($ collection) -> None

		Copy the text in the $ collection, paste
		it into the editor, and evaluate
		*/

		// If the simulator isn't there, get it back
		if (!less.isSim) {
			less.closeLess();
			// Wait till animation is over, I think it's
			// not pasting stuff while sim is hidden
			setTimeout(function () {
				// Empty the text, insert new text, evaluate
				editor.getSession().setValue("");
				editor.insert($thisElem.text());
				$("#evaluate").trigger("click");
				}
				, less.slideTime + less.fadeTime + 5
			);
		}
		// Otherwise do it without delay
		else {
			// Empty the text, insert new text, evaluate
			editor.getSession().setValue("");
			editor.insert($thisElem.text());
			$("#evaluate").trigger("click");
		}
	}
};

var less = {
	// Is the simulator showing?
	isSim: true,
	// Has one toggle completed?
// [Something to do with "width",["toggle","swing"]] Why isn't this working?
	canToggle: true,
	// Animation times
	fadeTime: 200,
	slideTime: 900,

	// Remember the width of the visualizer
	visWidth: null,
	// Remember #reference's padding
	refPad: null,

	resize: function () {
		/*
		*/

		// Remember various starting measurements
		less.visWidth = $("#visualizer").width();
		less.refPad = $("#reference").css("padding");
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

// Maybe put queue to false

	openLess: function () {
		/* (None) -> None

		Resize everything to let lessons fill the page
		Now crazy stuff, not sure how this will work
		*/
		if (less.canToggle) {
			// Disallow toggling
			less.canToggle = false;
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
			$("#ace").fadeOut(less.fadeTime, function () {
				// Make fake ace relative
				$("#scrollable-area").css({position: "relative", width: "100%"});
				// $("#REPL").animate({"height": "930px"});
				// $("#editor").animate({"height": "100%"});
				// $("#scrollable-area").animate({"height": "100%"});
				// Narrow the width of visualizer till it's gone
				$("#visualizer").animate({"width":"0"}
					, less.slideTime, "swing", function () {
						// Re-allow toggling now
						less.canToggle = true;
						// For things that may want to get the simulator back
						less.isSim = false;
						// Reference will be an x to indicate closing
						$("#reference").text("X")
							.css({"padding-right": "5px"});
					});
			});
		}
	},

	closeLess: function () {
		/* (None) -> None
		
		*/

		if (less.canToggle) {
			// Disallow toggling
			less.canToggle = false;

			// Bring the visualizer back
			$("#visualizer").animate({"width":less.visWidth + "px"}
				, less.slideTime, "swing"
				, function () {
					// Then restore our fake to it's factory settings
					// so that ace won't be pushed of the page
					$("#scrollable-area").css({position: "absolute"});
					// Fade ace in
	        		$("#ace").fadeIn(less.fadeTime, function () {
						// Set the future "search bar" area to empty again
						$(".text-row").val("");
						// Re-allow toggling now
						less.canToggle = true;
						// For things that may want to get the simulator back
						less.isSim = true;
						// Restore reference to whatever it was
						$("#reference").text("tbd").css("padding", less.refPad);
	        		});
	        });
		}
	},
};
