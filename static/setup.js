/* setup.js
* Created by: 
* Date:
* Event listeners and main functions to run simulator
* 
* Sources:
* 
* TODO:
* - Add comments on functionality
* - Store last successful editor value
*   - in qromp, treat blank editor as okay
*
* DONE:
* 
*/

$(document).ready(function() {
	// *** SETUP ***\\
	var $qubitsInput = $("#qubits-input"),
		editor = ace.edit("codeArea");

	// --- Visualizer --- \\
	vis.positionQubits([]);
	editor.getSession().setUseWrapMode(true);

	// *** EVENT LISTENERS ***\\

	$(".guide-label").click(function() {
		var $this = $(this);
		if (!$this.hasClass("open")){
			$(".open").removeClass("open").siblings().slideToggle();
			$this.addClass("open").siblings().slideToggle();
		}
	});

	// On editor or qubits-input change, run qromp with the values of both inputs and a callback to render the results

	editor.getSession().on('change', function() {
	    try {
	    	evaluate($qubitsInput.val(), editor.getValue(), function(a) {
		    	vis.positionQubits(a);
		    });
	    } catch (e) {
	    	//maybe put a little warning icon in the editor
	    }  
	});

	$qubitsInput.keyup(function() {
		try {
	    	evaluate($qubitsInput.val(), editor.getValue(), function(a) {
		    	vis.positionQubits(a);
		    });
	    } catch (e) {
	    	//maybe put a little warning icon in the editor
	    } 
	});
});
