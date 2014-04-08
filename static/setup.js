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
		qubits = new QubitObject("qubitSVG"),
		$guideMenu = $("#guide-menu"),
		$guideDetail = $("#guide-detail");

	// *** INITIALIZATION *** \\
	editor.getSession().setUseWrapMode(true);
	qubits.inc();

	// *** EVENT LISTENERS ***\\

	function readSingleFile(evt) {
		if (window.File && window.FileReader && window.FileList) {
			var file = evt.target.files[0];
			if (file) {
				var reader = new FileReader();
				reader.onload = function(e) {
					var contents = e.target.result;
					editor.getSession().setValue(contents);
					$("#hiddenFileInput").off('change.file').val("");
					$("#hiddenFileInput").on('change.file',readSingleFile);
				}
				reader.readAsText(file);
			}
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
	};

	$("#hiddenFileInput").on('change.file',readSingleFile);

	$("#import").click(function(){
		$("#hiddenFileInput").click();
	});

	function exportProgram() {
		//do something here?
	};
	$("#export").on('click', exportProgram);

	// --- Open guide content --- \\
	$(".guide-link").click(function() {
		var $this = $(this);
		$guideMenu.addClass("hidden");
		$guideDetail.removeClass("hidden");
		$("#guide-item-title").text($this.text());
		$($this.data("target")).addClass("current");
	});
	
	// --- Close guide content --- \\
	$("#guide-back").click(function() {
		$guideMenu.removeClass("hidden");
		var $current = $guideDetail.addClass("hidden").children(".current");
		setTimeout(function() {$current.removeClass("current");}, 450)
	});
	
	// --- Toggle visibility of reference drawer --- \\
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

	// --- Handle dragging of reference item --- \\
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

	// --- Set editor to example text --- \\
	$(".example").on("click", function (evt) {
		editor.getSession().setValue($(this).text());
	});

	// --- Add empty qubit to visualizer --- \\
	$("#add-qubit").click(function() {
		qubits.inc();
	});

	// --- Remove an empty qubit from visualizer --- \\
	$("#remove-qubit").click(function() {
		qubits.dec();
	});

	// --- Evaluate the editor contents on change --- \\
	editor.getSession().on('change', safeEvaluate);

	// *** FUNCTIONS ***\\

	function safeEvaluate() {
		try {
	    	evaluate(editor.getValue(), function(qubitStates) {
		    	qubits.update(qubitStates);
		    });
	    } catch (e) {
	    	//maybe put a little warning icon in the editor
	    } 
	}
});
