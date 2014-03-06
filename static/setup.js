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
* - Evaluate then refocus
* - Take away error message on empty editor? (not
* crucial, doesn't stop functionality)
* - Experiment with moving script calls around till we find
* the culprit
* - Retry enclosing the generated code
* - Everything happens on one page (no need for link to
* "home page", instead can press 'x' or 'back')
* 
* ---	Visualizer	---
* 
* DONE:
* 
*/

// Elements requested before document ready may not
// always be found, but I see that you wanted global
// vars. There's another way to do that, and I'll
// implement it, but it can be better to keep vars
// out of global scope for human readability

// Also because var names like "evaluate"
// could very easily be accidentally overriden.
// I can do it another way with an initializing
// function or something if they're not used in
// other scripts

// *** SETUP *** \\
// --- Visualizer? --- \\
// - Global vars - \\
// qromp.js uses these, can't have a namespace atm
// evaluate must be a DOM object, not a $ collection
var evaluate = document.getElementById("evaluate"),
	// $qubitsInput = $("#qubitsInput"),
	// Only visualizer.js needed this, it can fetch it
	// $qubitElements = $("#qubitElements"),
	editor = ace.edit("ace"),
	qubits = [] // used in qrompsimple.js, I believe
	//,
	// Moved to visualizer.js enclosure vis
	// defaultQubit = {DOWN: {phase: 0, prob: 0}, UP: {phase: 0, prob: 1}},
	// qubitAttr;
	;

$(document).ready(function() {
	// *** SETUP ***\\

	// We will temporarily solve this by also putting this
	// in here so it actually get defined on doc ready
	evaluate = document.getElementById("evaluate");
	var $qubitsInput = $("#qubitsInput");

	// --- Visualizer --- \\
	vis.positionQubits($qubitsInput.val());
	editor.getSession().setUseWrapMode(true);

	// *** EVENT LISTENERS ***\\

	// Display the images for the changed number of qubits
	$qubitsInput.change(function() {
		vis.positionQubits($qubitsInput.val());
	});
});
