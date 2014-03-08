/* menuitems.js
* Created by: 
* Date: 03/07/14
* Menu item functionality
* 
* TODO:
* - If we really do completely separate "panes" for
* each menu item, make a data value for each thing's
* "pane" so they can all be called the same way
* 
* DONE:
* 
*/

// Just so I don't have to keep copying and pasting examples goddamnit
$(document).ready(function() {
	// *** SETUP ***\\
	// --- Lessons --- \\
	// A way to toggle till I figure out how that works
	var count = 0;

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
		}
		, function () {
			$(this).css("background", "inherit");
		}
	);

	// --- Examples --- \\
	// Bring in and take out examples "pane"
	$($("#examples-menu").children()[0]).on("click", function() {
		// $("#examples-menu").children("ul").toggle();
	});
	// Keeping these here because *soooo* much more convenient
	$("#examples-menu li").click(function() {ex.pasteEx($(this));});

	// --- Lessons --- \\
	// Bring in and take out lessons "pane"
	$("#lessons-menu").click(function () {
		// A way to toggle, since I couldn't figure out .toggle
		// Change it, restore it, and allow the cycle to progress
		if (count%2 == 0){less.openLess();}
		else {less.closeLess();}
		count++
	});

	// Show and hide references?
	$("#reference").click(function () {})
	// Make it bold when hovered over
	.hover(function () {//$(this).toggleClass("bold");
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
	isSim: true
	// Has one toggle animation completed?
// [Something to do with "width",["toggle","swing"]] Why isn't this working?
	, canToggle: true
	// Animation times
	, fadeTime: 200
	, slideTime: 900
	// Remember the width of the visualizer
	, visWidth: null
	// Remember #reference's padding
	, refPad: null,

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

			// Show that "lessons" is active
			$("#lessons-menu").css("border", props.activeBorder);

			// Hide #examples (if it's open)
			$("#examples-pane").animate({"right": "100%"}, 400);
			$("#lessons-pane").animate({"left": "0"}, 400);
			// Re-allow toggling now
			less.canToggle = true;
			// For things that may want to get the simulator back
			less.isSim = false;
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

			// Slide this element to the right again
			$("#lessons-pane").animate({"left": "100%"}, 400);
			// Restore menu item to unselected
			$("#lessons-menu").css("border", props.inactiveBorder);
			// Re-allow toggling now
			less.canToggle = true;

		}  // end of canToggle
	},
};

