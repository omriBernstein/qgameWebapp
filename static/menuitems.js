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
