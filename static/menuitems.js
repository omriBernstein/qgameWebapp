/* menuitems.js
* Created by: 
* Date: 03/07/14
* Menu items
* 
* TODO:
* 
* 
* DONE:
* 
*/

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
// *** This *seems* to be where the weird padding change is coming from *** \\
			$(this).children(".menu-items").show();  // Here
			$(this).css("background-color", props.activeNum);
		}
		, function () {
			$(this).children(".menu-items").hide();
			$(this).css("background-color", "none");
		}
	);
	$("li").hover(
		function () {
			$(this).css({"background": props.activeText});
		},
		function () {
			$(this).css("background", "inherit");
		}
	);

	// --- Examples --- \\
	$($("#examples").children()[0]).on("click", function() {$("#examples").children("ul").toggle();});
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
	// If the sim isn't showing, clicking reference (now an "X")
	// should animate it to be shown
	$("#reference").click(function () {
		if (!less.isSim) {less.closeLess();}
	})
	// Make it bold when hovered over
	.hover(function () {
		if (!less.isSim) {$(this).toggleClass("bold");}
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
			// not pasting text while sim is hidden
			setTimeout(function () {
				// Replace any text with new text, evaluate
				editor.getSession().setValue($thisElem.text());
				$("#evaluate").trigger("click");
				}
				, less.slideTime + less.fadeTime + 5 // Need +5?
			);  // end of setTimeout
		}  // end if
		// Otherwise do it without delay
		else {
			// Replace any text with new text, evaluate
			editor.getSession().setValue($thisElem.text());
			$("#evaluate").trigger("click");
		}  // end else
	}
};

var less = {
	// Is the simulator showing?
	isSim: true,
	// Has one toggle animation completed?
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
		/* (None) -> None

		Stores some dimension variables (perhaps move that)
		and sizes the fake ace editor to match the real one
		*/

		// Set the various properties that need remembering
		less.visWidth = $("#visualizer").width();
		less.refPad = $("#reference").css("padding");

		// Elements to same dimensions as ace
		// Whole area and #top-ribbon height same
		$("#scrollable-area").css("height", $(".ace_scroller").outerHeight());
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

		If less.closeLess is done animating, hide the
		ace editor and resize the visualizer to let
		the fake ace editor (just looks like it, with
		possibly a search bar) fill the width of the page.
		*/

		if (less.canToggle) {
			// Disallow toggling
			less.canToggle = false;
			// Get rid of any text in there
			// Hiding it gets rid of the text anyway
			// editor.getSession().setValue("");

			// Don't know what could have happened between then and now, resize
			// Wish I could put some kind of delay here...
			// less.resize();

			// Show that "lessons" is active
			$("#lessons").css("border", props.activeBorder);

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
				// Make fake ace relative and flexible width
				$("#scrollable-area").css({position: "relative"});
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
						// Reference will be an X to indicate closing
						$("#reference").text("X")
							.css({"padding-right": "5px"});
				});  // end of visualizer animate contraction
			});  // end of ace fadeOut
		}  // end of canToggle
	},

	closeLess: function () {
		/* (None) -> None
		
		If less.openLess() is done animating, undo what
		that function did.
		*/

		if (less.canToggle) {
			// Disallow toggling
			less.canToggle = false;
			// For things that may want to get the simulator back
			// and to prevent #reference from becoming bold
			// though that doesn't work if it's right at the beginning
			less.isSim = true;

			// Restore reference to whatever it was
			$("#reference").text("tbd")
				.css("padding", less.refPad)
				// Make sure this is removed, otherwise if it was
				// hovered over, it waits till part way through
				// the animation
				.removeClass("bold");
			// Bring the visualizer back
			$("#visualizer").animate({"width":less.visWidth + "px"}
				, less.slideTime, "swing"
				, function () {
					// Then restore our fake to it's factory settings
					// so that ace won't be pushed of the page
					$("#scrollable-area").css({position: "absolute"});
					// Fade ace in, then
	        		$("#ace").fadeIn(less.fadeTime, function () {
						// Set the future "search bar" area to empty again
						$(".text-row").val("");
						// Show that "lessons" is inactive
						$("#lessons").css("border", props.inactiveBorder);
						// Re-allow toggling now
						less.canToggle = true;
	        		});  // end of ace fadeIn
	        });  // end of visualizer animate expansion
		}  // end of canToggle
	},
};

