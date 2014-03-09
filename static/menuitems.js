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
	// A way to toggle till I figure out how that works
	var count = 0;
	// Associate top menu options with panes
	$("#lessons-menu").data("pane", $("#lessons-pane"));
	$("#examples-menu").data("pane", $("#examples-pane"));


	// *** EVENT LISTENERS ***\\
	// -- All -- \\
	// Get rid of border?
	// Show panes on click
	$(".top-menu").not($(".menu-items"))
		.click(function (thisEv) {less.openLess($(this), $(thisEv.target));})
		// Highlight top menu items on hover
		.hover(function () {
	// *** This *seems* to be where the weird padding change is coming from *** \\
				$(this).find(".menu-items").show();  // Here
				$(this).css("background-color", props.activeNum);
			}
			, function () {
				$(this).find(".menu-items").hide();
				$(this).css("background-color", "none");
			}
		)
	;

	// This will go away
	// Highlight dropdown menu items on hover
	$("li").hover(
		function () {
			$(this).css({"background-color": props.activeText});
		}
		, function () {
			$(this).css("background-color", "inherit");
		}
	);

	// --- Examples --- \\
	// Make dropdown appear and disappear on click
	$(".top-menu").on("click", function(thisEv) {
		var $target = $(thisEv.target);
		$(this).children().attr("id");
		if ($(this).children().attr("id") == "examples-menu"
			&& $target.prop("tagName") != "LI") {
			$(".top-menu ul").toggle();
		}
	});
	// On-page version (though wouldn't be dropdown)
	$(".menu-items li").click(function() {ex.pasteEx($(this));});
	// Examples page version
	$(".examples li").click(function() {ex.pasteEx($(this));});

	// --- Lessons --- \\
	// // Bring in and take out lessons "pane"
	// $("#lessons-menu").click(function () {
	// 	// A way to toggle, since I couldn't figure out .toggle
	// 	// Change it, restore it, and allow the cycle to progress
	// 	if (count%2 == 0){less.openLess();}
	// 	else {less.closeLess();}
	// 	count++
	// });

	// // Show and hide references?
	// $("#reference").click(function () {})
	// // Make it bold when hovered over
	// .hover(function () {//$(this).toggleClass("bold");
	// });
});

var ex = {
	pasteEx: function ($thisElem) {
		/* ($ collection) -> None

		Copy the text in the $ collection, paste
		it into the editor, and evaluate
		*/

// !!! take delay off for dropdown !!!
		var simShowing = true;

		// if any non-sim is showing
		$(".not-sim").each(function () {
			if ($(this).css("left") == "0px") {
				console.log("--------");
				simShowing = false;
			}
		});

		// If
		if (!simShowing) {
			// Take away all the other panes
			$(".not-sim")
			.animate({"left": "100%"}, less.slideTime, "swing"
				, function () {
					setTimeout(function () {
						// Replace any text with new text, evaluate
						editor.getSession().setValue($thisElem.text());
						$("#evaluate").trigger("click");
						// Remove indication of active item
						$(".top-menu").css("border", props.inactiveBorder);
						}, 75);
				});
		}

		else {
			//Otherwise don't wait to do the stuff
			// Replace any text with new text, evaluate
			editor.getSession().setValue($thisElem.text());
			$("#evaluate").trigger("click");
			// Remove indication of active item
			$(".top-menu").css("border", props.inactiveBorder);
		}

		// // What I have already working
		// $(".not-sim")
		// .animate({"left": "100%"}, less.slideTime, "swing"
		// 	, function () {
		// 		setTimeout(function () {
		// 			// Replace any text with new text, evaluate
		// 			editor.getSession().setValue($thisElem.text());
		// 			$("#evaluate").trigger("click");
		// 			// Remove indication of active item
		// 			$(".top-menu").css("border", props.inactiveBorder);
		// 			}, 100);
		// 	});

		// // If the simulator isn't there, get it back
		// if (!less.isSim) {
		// 	less.closeLess();



			// // Reveal the simulator
			// $(".pane").css({"left": "100%"});
			// // Wait till animation is over, I think it's
			// // not pasting text while sim is hidden
			// setTimeout(function () {
			// 	// Replace any text with new text, evaluate
			// 	editor.getSession().setValue($thisElem.text());
			// 	$("#evaluate").trigger("click");
			// 	}
			// 	, less.slideTime + 100
			// );  // end of setTimeout



		// }  // end if
		// // Otherwise do it without delay
		// else {
		// 	// Replace any text with new text, evaluate
		// 	editor.getSession().setValue($thisElem.text());
		// 	$("#evaluate").trigger("click");
		// }  // end else
	}  // End pasteEx()
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

	openLess: function ($clickedItem, $thisTarget) {
		/* (None) -> None

		If less.closeLess is done animating, hide the
		ace editor and resize the visualizer to let
		the fake ace editor (just looks like it, with
		possibly a search bar) fill the width of the page.
		*/

		if (less.canToggle) {
			console.log("1 in less.canToggle");
			// Disallow toggling
			less.canToggle = false;
			// Get menu item's child (with the id)
			var $topMenuItem = $($clickedItem.children()[0]);
			// Get menu item's panel
			var $itemPane = $topMenuItem.data("pane");
			// Take the border off of every other item
			$(".top-menu").not($clickedItem).css("border", props.inactiveBorder);

			// Temporary till dropdown is gone make sure it's not a list item
			if ($thisTarget.prop("tagName") != "LI") {
				console.log("  2 in prop name LI");
				// If it has a "pane" data value
				if ($itemPane) {
					console.log("    3 in $itemPane");
					// If the pane is off screen
					if ($itemPane.css("left") != "0px") {
						console.log("      4 in 'left' not 0");
						// Indicate the item is active
						$clickedItem.css("border", props.activeBorder);
						// Put relevant pane on top and slide it left
						$(".not-sim").not($itemPane).css("z-index","50");
						$itemPane.css("z-index","100");
						$itemPane.animate({"left": "0"}, less.slideTime, "swing"
							, function () {
								// Slide the other panes right
								$(".not-sim").not($itemPane).css({"left": "100%"});
							});
						// Re-allow toggling now
						less.canToggle = true;
					}  // end of if $itemPane

					// If the pane is on screen
					else {
						console.log("      4 in else");
						// Remove indication of active item
						$clickedItem.css("border", props.inactiveBorder);
						// Hide the pane
						$itemPane.animate({"left": "100%"}, less.slideTime, "swing");
						// Re-allow toggling now
						less.canToggle = true;
					}
					console.log("      4 out of 'left' not 0");
				}  // end of if $itemPane
				// Don't know if I need these else's
				else {less.canToggle = true;}
				console.log("    3 out of $itemPane");
			}  // End of temporary target check
			else {less.canToggle = true;}
			console.log("  2 out of if prop name LI");
		}  // end of canToggle
		console.log("1 out of canToggle");
	},

	closeLess: function ($topMenuItem) {
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
			// Get menu item's panel
			$itemPane = $topMenuItem.data("pane");

			// Slide this element to the right again
			$itemPane.animate({"left": "100%"}, 400);
			// Restore menu item to unselected
			$topMenuItem.css("border", props.inactiveBorder);
			// Re-allow toggling now
			less.canToggle = true;

		}  // end of canToggle
	},
};

