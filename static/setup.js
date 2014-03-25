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
		var $this = $(this);
		$guideMenu.addClass("hidden");
		$guideItem.removeClass("hidden");
		$("#guide-item-title").text($this.text());
		$($("#" + $this.parent().data("section")).children()[$this.prevAll().length]).addClass("current");
	});
	
	$("#guide-back").click(function() {
		$guideMenu.removeClass("hidden");
		$guideItem.addClass("hidden").find(".current").removeClass("current");
	});
	
	$("#reference-handle").click(function() {
		var $this = $(this);
		if (!$this.hasClass("flip-h")){
			$this.addClass("flip-h").parent().addClass("open").siblings().addClass("narrow");
		} else {
			$this.removeClass("flip-h").parent().removeClass("open").siblings().removeClass("narrow");
		}
		var animate = setInterval(function() {editor.resize();}, 20);
		setTimeout(function() {clearInterval(animate); editor.resize();}, 450);
	});

	// On editor change or on adding/removing qubits, run qromp with the values of both inputs and a callback to render the results

	function safeEvaluate() {
		try {
	    	evaluate(qubits.length, editor.getValue(), function(qubitStates) {
		    	qubits.update(qubitStates);
		    });
		    $("#qubitElements").css({"opacity": 1});
	    } catch (e) {
	    	$("#qubitElements").css({"opacity": .5});
	    	qubits.reset();
	    	qubits.render();
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
