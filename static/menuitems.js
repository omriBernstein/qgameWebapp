/* menuitems.js
* Created by: 
* Date: 03/07/14
* Menu item functionality
* 
* Sources:
* 1. http://stackoverflow.com/questions/3086068/how-do-i-check-whether-a-jquery-element-is-in-the-dom
* 	Ended up not being used right now
* 
* TODO:
* 
* DONE:
* - [DONE] Get alt to remove alt
* - [DONE] Get pane additions to remove alt
* - [DONE] Get rid of .not($(".menu-items") (was for dropdowns)
* - [DONE] Make clicking on examples pane work properly
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
		// Get the starting left position in a way
		// that can be turned into a percent
		var thisLeft = Math.round($this.position().left/
			$this.parent().innerWidth());
		// Set it as a data value
		$(this).data("left", thisLeft);
	});


	// *** EVENT LISTENERS ***\\
	// -- All -- \\
	// Show or hide panes on click
	$(".tm-item")
	.on("click", function (thisEv) {
		// Toggle active menu item decoration
		$(this).toggleClass("tm-active");
		// Toggle the appropriate pane
		mItems.togglePanes($(this));
	})

	// Highlight list items on hover
	$("body").on("mouseenter", "li", function () {
			$(this).css({"background-color": props.activeText});
		})
	.on("mouseleave", "li", function () {
			$(this).css("background-color", "inherit");
		}
	);

	// --- Examples --- \\
	// Make alt appear (examples appear over text editor)
	$("#alt-menu").on("click", function () {ex.toggleAlt();});

	// Any .examples li shows the sim and
	// evaluates it's text value
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

	, togglePanes: function ($clickedItem) {
		/* ($, $) -> None

		If previous pane toggles are finished, puts a
		border around $clickedItem, slides the pane
		associated with $thisTarget into or out of view,
		moves the other panes off screen if needed.
		*/

		if (mItems.canToggle) {
			// Disallow toggling
			mItems.canToggle = false;
			// Deactivate all other menu items
			$(".tm-item").not($clickedItem).removeClass("tm-active");
			// The toggle in click takes care of the rest

			// Get menu item's panel
			$itemPane = $clickedItem.data("pane");
			// If it has a "pane" data value
			if ($itemPane) {				
				// Because of binary math, can't have pretty
				// spaces between divs and %'s without
				// being much trickier, they all go back
				// to 100%

				// Left position of this pane
				var thisLeft = Math.round(
					$itemPane.position().left/
					$itemPane.parent().outerWidth());

				// If the linked pane is already showing
				// Close all the panes
				if (thisLeft == 0) {mItems.closePanes();}

				// If the pane isn't visible
				else {
					// subract its "left" for every pane
					$(".pane").each(function () {
						var $this = $(this);
						// Current pane's left
						var currentLeft = Math.round(
							$this.position().left/
							$this.parent().outerWidth());

						var newLeft = (currentLeft - thisLeft) * 100;
						// Slide them all to new spots
						$this.animate({"left": newLeft + "%"}
							, mItems.slideTime, "swing",
							function () {
								// If not alt, remove alt
								// Incase of future (I know, I know)
								// Think this will work...
								if ($this.not("#alt-menu")[0]){
									$("#examples-box").remove();
								}
							// Let the buttons be pressed again!
								mItems.canToggle = true;
						});
					});  // end each
				}  // end else
			}  // end if $itemPane
			// If it doesn't have a pane, close all the panes and
			else {
				// If it's not #alt-menu remove alt
				if ($clickedItem.not("#alt-menu")[0]){
					$("#examples-box").remove();
				}
				// let the buttons be pressed again!
				mItems.closePanes();
			}
		}  // end of canToggle
	},  // End togglePanes()

	closePanes: function ($topMenuItem) {
		/* (None) -> None
		
		Goes back to #app
		*/

		// Slide everything to its original pos
		$(".pane").each(function () {
			var $this = $(this);
			var oldLeft = $this.data("left");
			// Slide everything to it's original position
			$this.animate({"left": (oldLeft * 100) + "%"}
				, mItems.slideTime, "swing",
				function () {
					// Let the buttons be pressed again!
					mItems.canToggle = true;
			});  // end animate
		});  // end each
	},  // End closeLess()
};  // End mItems

var ex = {
	toggleAlt: function () {
		/* (None) -> None

		A demo of an alternative to the examples pane.
		Instantiate or remove an examples div on the
		same page as the simulator
		*/

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

		Show sim, copy the text in the $ collection,
		paste it into the editor, and evaluate.
		*/

		// Make sure sim is showing
		mItems.closePanes();

		// Replace any text with new text, evaluate
		editor.getSession().setValue($thisElem.text());
		$("#evaluate").trigger("click");
		// Remove indication of active item
		$(".top-menu").css("border", props.inactiveBorder);

	}  // End pasteEx()
};
