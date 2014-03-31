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
	// *** VARIABLE DECLARATION ***\\
	var editor = ace.edit("codeArea"),
		$guideMenu = $("#guide-menu"),
		$guideDetail = $("#guide-detail");
	window.rem = parseInt($("html").css("font-size"));
	window.$visualizer = $("#visualizer");

	// --- Visualizer --- \\
	new Qubit;
	editor.getSession().setUseWrapMode(true);

	// *** EVENT LISTENERS ***\\

	$(".guide-link").click(function() {
		var $this = $(this);
		$guideMenu.addClass("hidden");
		$guideDetail.removeClass("hidden");
		$("#guide-item-title").text($this.text());
		$($this.data("target")).addClass("current");
	});
	
	$("#guide-back").click(function() {
		$guideMenu.removeClass("hidden");
		var $current = $guideDetail.addClass("hidden").children(".current");
		setTimeout(function() {$current.removeClass("current");}, 450)
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

	$(".reference-item").mousedown(function(){
		var $this = $(this),
			$document = $(document),
			offset = $this.offset(),
			diffX = event.pageX - offset.left,
			diffY = event.pageY - offset.top,
			$dragged = $this.clone().attr("id", "dragged").css({"top": event.pageY - diffY, "left": event.pageX - diffX}).appendTo("#scroller").mouseup(function(){
				// when released
				$document.off("mousemove.track");
				$dragged.remove();
			});
			// while dragging
			$document.on("mousemove.track", function(){
				$dragged.css({"top": event.pageY - diffY, "left": event.pageX - diffX});
			})
	});

	// Knod's addition, 03/25/14
	$(".example").on("click", function (evt) {
		editor.getSession().setValue($(this).text());
	});

	// On editor change or on adding/removing qubits, run qromp with the values of both inputs and a callback to render the results

	function safeEvaluate() {
		try {
	    	evaluate(editor.getValue(), function(qubitStates) {
		    	qubits.updateAll(qubitStates);
		    });
	    } catch (e) {
	    	qubits.resetAll();
	    	//maybe put a little warning icon in the editor
	    } 
	}

	editor.getSession().on('change', safeEvaluate);

	$("#add-qubit").click(function() {
		if (qubits.length < 10) new Qubit;
		safeEvaluate();
	});

	$("#remove-qubit").click(function() {
		qubits.pop();
		safeEvaluate();
	});
});
