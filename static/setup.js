/* setup.js
* Created by: 
* Date:
* Event listeners and main functions to run simulator
* Perhaps other "pages" too in future
* 
* TODO:
* ---	General		---
* - Why isn't everything in $(document).ready()?
* - Add comments on functionality
* - Decouple ace
* ---	Visualizer	---
* 
* ---	Editor		---
* - Should text editor key functions be called on
* keypress instead in case they hold a key down?
* 
* 
*/

// ORIGINAL, ACE (fourth line down) :
// *** ? *** \\
// var evaluate = document.getElementById("evaluate"),
// 	$qubitsInput = $("#qubitsInput"),
// 	$qubitElements = $("#qubitElements"),
// 	editor = ace.edit("ace"),
// 	qubits = [],
// 	defaultQubit = {DOWN: {phase: 0, prob: 0}, UP: {phase: 0, prob: 1}},
// 	qubitAttr;

$(document).ready(function() {

	// ORIGINAL, ACE, ETC:
	// // *** VISULIZER *** \\
	// positionQubits($qubitsInput.val());
	// editor.getSession().setUseWrapMode(true);

	// KNOD:
	// *** TEXT EDITOR *** \\
	// Create the first editor row
	textEditor.firstRow();

	// *Has* to be .on, *has* to be delegation
	// Make a tutorial about that somewhere
	// Depending on what key is pressed in an input field
	$("#text-areas")
	.on("keydown", ".text-row", function (key) {

		// Identify this .text-row
		var $this = $(this);
		// Affect input fields
		textEditor.keyFilter(key, $this);
	})
	.on("keyup", ".text-row", function (key) {
		// Helps resizing after deleting section or pasting,
		// esp with clicking out of the area after
		// Not completely though
		textEditor.resizeRow($(this));
	})
	.on("focus", ".text-row", function () {
		// Color the focused row the active colors
		textEditor.activateRow($(this));
	})
	.on("blur", ".text-row", function () {
		// Remove the color from the unfocused rows
		textEditor.deactivateRow($(this));
	})
	;

	// Testing
	textEditor.updateNums();
});

// ORIGINAL, ACE, ETC:
// *** ? *** \\
// $qubitsInput.change(function() {
// 	positionQubits($qubitsInput.val());
// });
