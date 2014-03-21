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
	var editor = ace.edit("codeArea"),
		$guideMenu = $("#guide-menu"),
		$guideItem = $("#guide-item");
	window.rem = parseInt($("html").css("font-size"));
	window.$visualizer = $("#visualizer");

	// --- Visualizer --- \\
	new Qubit;
	editor.getSession().setUseWrapMode(true);

	// *** EVENT LISTENERS ***\\

	$(".guide-link").click(function() {
		var $target = $($(this).attr("data-href"));
		$guideMenu.addClass("hidden");
		$guideItem.removeClass("hidden");
	});
	
	$("#guide-back").click(function() {
		$guideMenu.removeClass("hidden");
		$guideItem.addClass("hidden");
	});

	// On editor change or on adding/removing qubits, run qromp with the values of both inputs and a callback to render the results

	function safeEvaluate() {
		try {
	    	evaluate(qubits.length, editor.getValue(), function(qubitStates) {
		    	qubits.update(qubitStates);
		    });
		    $("#qubitElements").css({"opacity": 1});
	    } catch (e) {
	    	$("#qubitElements").css({"opacity": .25});
	    	qubits.reset();
	    	qubits.arrange();
	    	//maybe put a little warning icon in the editor
	    } 
	}

	editor.getSession().on('change', safeEvaluate);

	$("#add-qubit").click(function() {
		new Qubit;
		safeEvaluate();
	});

	$("#remove-qubit").click(function() {
		qubits.pop();
		safeEvaluate();
	});
});
