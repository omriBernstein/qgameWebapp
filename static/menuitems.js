/* menuitems.js
* Created by: 
* Date: 03/07/14
* Menu item functionality
* 
* TODO:
* - Make clicking on examples pane work properly
* 
* DONE:
* - [DONE] Make alt work properly
* - [DONE] Make a version of examples that's on the same page
* - [DONE] Take out the dropdown menu
* - Try adding a top bar above the app
* - (Possibly) separate the toggle function into 3
* parts: toggle, open, close
* - [DONE and discarded] Make a version that pushes
* what's on top to the right as well as brings things
* out from the left (basically has multiple layers
* and top layers are removed first when appropriate)
* - [DONE] If we really do completely separate "panes" for
* each menu item, make a data value for each thing's
* "pane" so they can all be called the same way.
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
	// Associate let values with their panes
	$(".pane").each(function () {
		$this = $(this);

		var thisLeft = Math.ceil( ($this.position().left/
			$this.parent().innerWidth()) * 100 );

		console.log(($this.position().left/
			$this.parent().innerWidth()) * 100);
		console.log(thisLeft);
		$(this).data("left", thisLeft);
		console.log($(this).data("left"));
	});


	// *** EVENT LISTENERS ***\\
	// -- All -- \\
	// Get rid of border?
	// Show panes on click
	$(".top-menu").not($(".menu-items"))
		.on("click", function (thisEv) {mItems.togglePanes($(this), $(thisEv.target));})

	// This will go away
	// Highlight dropdown menu items on hover
	$("body").on("mouseenter", "li", function () {
			$(this).css({"background-color": props.activeText});
		})
	.on("mouseleave", "li", function () {
			$(this).css("background-color", "inherit");
		}
	);

	// --- Examples --- \\
	// Make dropdown appear and disappear on click
	$(".top-menu").on("click", function (thisEv) {
		// If "alt" is pressed
		if ($(this).children().attr("id") == "alt-menu") {
			// Do the alternate examples stuff
			ex.toggleAlt();
		}
	});

	// Examples page version
	$("body").on("click", ".examples li", function() {ex.pasteEx($(this));});

	// --- Lessons --- \\
	// // Show and hide references?
	// $("#reference").click(function () {})
	// // Make it bold when hovered over
	// .hover(function () {//$(this).toggleClass("bold");
	// });
});

var mItems = {
	// Is the simulator showing?
	isSim: true
	// Has one toggle animation completed?
// [Something to do with "width",["toggle","swing"]] Why isn't this working?
	, canToggle: true
	// // Animation times
	// , fadeTime: 200
	, slideTime: 600
	// // Remember the width of the visualizer
	// , visWidth: null
	// // Remember #reference's padding
	// , refPad: null

	, togglePanes: function ($clickedItem, $thisTarget) {
		/* ($, $) -> None

		If previous pane toggles are finished, puts a
		border around $clickedItem, slides the pane
		associated with $thisTarget into or out of view,
		moves the other panes off screen if needed.
		*/

		if (mItems.canToggle) {
			// console.log("1 in mItems.canToggle");
			// Disallow toggling
			mItems.canToggle = false;
			// Get menu item's child (with the id)
			var $topMenuItem = $($clickedItem.children()[0]);
			// Get menu item's panel
			$itemPane = $topMenuItem.data("pane");
			// Somehow indicate other items are inactive
			// ??

			// If it has a "pane" data value
			if ($itemPane) {
				
				// Because of binary math, can't have pretty
				// spaces between divs and %'s without
				// being much trickier, they all go back
				// to 100%

				// Left position of this pane
				var thisLeft = Math.ceil(
					($itemPane.position().left/
					$itemPane.parent().outerWidth()) * 100);

				// If the linked pane is already showing
				if (thisLeft == 0) {
					// Close all the panes
					mItems.closePanes();
				}  // end if left == 0

				// If the pane isn't visible
				else {
					// subract its "left" for every pane
					$(".pane").each(function () {
						var $this = $(this);
						// Current pane's left
						var currentLeft = Math.ceil(
							($this.position().left/
							$this.parent().outerWidth()) * 100);

						var newLeft = currentLeft - thisLeft;
						// Slide them all to new spots
						$this.animate({"left": newLeft + "%"}
							, mItems.slideTime, "swing",
							// Let the buttons be pressed again!
							function () {mItems.canToggle = true;});
					});  // end each
				}  // end else
			}  // end if $itemPane

			// If it doesn't have a pane
			// Let the buttons be pressed again!
			else {
				// Close all the panes
				mItems.closePanes();
				// mItems.canToggle = true;
			}
		}  // end of canToggle
	},  // End togglePanes()

	closePanes: function ($topMenuItem) {
		/* (None) -> None
		
		Goes back to #app
		*/
		$(".pane").each(function () {
						var $this = $(this);
						var oldLeft = $this.data("left");
						// Slide everything to it's original position
						$this.animate({"left": oldLeft + "%"}
							, mItems.slideTime, "swing",
							// Let the buttons be pressed again!
							function () {mItems.canToggle = true;});
					});  // end each

		// if (mItems.canToggle) {
		// 	// Disallow toggling
		// 	mItems.canToggle = false;
		// 	// For things that may want to get the simulator back
		// 	// and to prevent #reference from becoming bold
		// 	// though that doesn't work if it's right at the beginning
		// 	mItems.isSim = true;
		// 	// Get menu item's panel
		// 	var $itemPane = $topMenuItem.data("pane");

		// 	// Slide this element to the right again
		// 	$itemPane.animate({"left": "100%"}, 400);
		// 	// Restore menu item to unselected
		// 	$topMenuItem.css("border", props.inactiveBorder);
		// 	// Re-allow toggling now
		// 	mItems.canToggle = true;

		// }  // end of canToggle
	},  // End closeLess()
};  // End mItems

var ex = {
	toggleAlt: function () {
		/* (None) -> None

		A demo of an alternative to the examples pane.
		Instantiate or remove an examples div on the
		same page as the simulator
		*/
// http://stackoverflow.com/questions/3086068/how-do-i-check-whether-a-jquery-element-is-in-the-dom

		// If the example box exists, remove it
		if ( $("#examples-box")[0] ) {
			$("#examples-box").remove();
		}
		// Otherwise, generate the code for it
		else {
			// Make the div
			var $examplesBox = $("<div id='examples-box'>"
				+ "Some words of explaination about stuff:"
		    	+ "<br><ul class='examples'>"
				+ "<li>((u-theta 0.6 0))</li>"
				+ "<li>((u-theta 0.8 0))</li>"
				+ "<li>((u-theta 1.6 0))</li>"
				+ "<li>((u-theta 2.3 0))</li></ul></div>");

			// Put it in the DOM
			$("#editor").append($examplesBox);

			// Give it it's properties
			$("#examples-box").css({position:"absolute"
				, left:"0", top:"0", "z-index":"250"
				,"background-color":"white", width: "100%"
				, height: "100%", "font-size":"17px"
				, padding:"10px"
				, "-webkit-box-sizing": "border-box"
				, "-moz-box-sizing": "border-box"
				, "box-sizing": "border-box"});
			$("#examples-box .examples").css({padding:"10px"
				, margin: "10px 0"});
			$("#examples-box .examples li").css({
				margin: "5px", padding: "5px", border: props.activeBorder
			});
		}
	}

	, pasteEx: function ($thisElem) {
		/* ($ collection) -> None

		Copy the text in the $ collection, paste
		it into the editor, and evaluate. If needed,
		reveal the simulator first.
		*/

		var simShowing = true;

		// if any non-sim is showing
		$(".not-sim").each(function () {
			if ($(this).css("left") == "0px") {
				simShowing = false;
			}
		});

		// If there's a pane covering the sim
		if (!simShowing) {
			// Slide away all the panes
			$(".not-sim")
			.animate({"left": "100%"}, mItems.slideTime, "swing"
				, function () {
					// After that and a 75 ms delay
					setTimeout(function () {
						// Replace any text with new text, evaluate
						editor.getSession().setValue($thisElem.text());
						$("#evaluate").trigger("click");
						// Remove indication of active item
						$(".top-menu").css("border", props.inactiveBorder);
						}, 75);  // end setTimeout
			});  // end .animate
		}  // end if !simShowing

		//Otherwise don't wait to do the stuff
		else {
			// Replace any text with new text, evaluate
			editor.getSession().setValue($thisElem.text());
			$("#evaluate").trigger("click");
			// Remove indication of active item
			$(".top-menu").css("border", props.inactiveBorder);
		}
	}  // End pasteEx()
};
