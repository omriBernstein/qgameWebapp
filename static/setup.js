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
	var // Keep track of qubit states and count
		userNum = 1,
		numQubits = 1,
		computedStates = [],
		defaultQubit = {up: {prob: 1, phase: 0}, down: {prob: 0, phase: 0}},
		// Instantiate editor and visualizer
		editor = ace.edit("code-area"),
		visualizer = new VisualizerObject("qubit-svg"),
		// Store often-used elements
		$guideMenu = $("#guide-menu"),
		$guideDetail = $("#guide-detail");

	// *** INITIALIZATION *** \\
	editor.getSession().setUseWrapMode(true);
	buildQubitArray();

	// *** EVENT LISTENERS ***\\

	$("#hidden-file-input").on('change.file',readSingleFile);

	$("#import").click(function(){
		$("#hidden-file-input").click();
	});

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
			$dragged = $this.clone()
				.attr("id", "dragged")
				.css({"top": event.pageY - diffY, "left": event.pageX - diffX})
				.appendTo("#scroller")
				// when released
				.mouseup(function(){
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
		if (numQubits < 10) {
			userNum = ++numQubits;
			buildQubitArray();
		}
	});

	// --- Remove an empty qubit from visualizer --- \\
	$("#remove-qubit").click(function() {
		if (numQubits > 0 && numQubits > computedStates.length) {
			userNum = --numQubits;
			buildQubitArray();
		}
	});

	// --- Evaluate the editor contents on change --- \\
	editor.getSession().on('change', safeEvaluate);

	// *** FUNCTIONS ***\\

	function safeEvaluate() {
		try {
	    	evaluate(editor.getValue(), function(qubitStates) {
		    	buildQubitArray(qubitStates);
		    });
	    } catch (e) {
	    	//maybe put a little warning icon in the editor
	    } 
	}

	function buildQubitArray(newStates) {
		if (newStates) {
			computedStates = newStates;
			numQubits = (computedStates.length < userNum) ? userNum : computedStates.length;
		}
		for (var fullStates = computedStates.slice(0), i = computedStates.length; i < numQubits; i++) {
			fullStates.push(defaultQubit);
		}
		numQubits = i;
		visualizer.render(fullStates);
	}

	function readSingleFile(evt) {
		if (window.File && window.FileReader && window.FileList) {
			var file = evt.target.files[0];
			if (file) {
				var reader = new FileReader();
				reader.onload = function(e) {
					var contents = e.target.result;
					editor.getSession().setValue(contents);
					$("#hidden-file-input").off('change.file').val("");
					$("#hidden-file-input").on('change.file',readSingleFile);
				}
				reader.readAsText(file);
			}
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
	}

	function exportProgram() {
		var textToWrite = editor.getValue(),
			textFileAsBlob = new Blob([textToWrite], {type:'text/plain'}),
			fileNameToSaveAs = "qromp_program",
			downloadLink = document.createElement("a");

		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		if (window.webkitURL != null) {
			// Chrome allows the link to be clicked
			// without actually adding it to the DOM.
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		} else {
			// Firefox requires the link to be added to the DOM
			// before it can be clicked.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = function(event) {
				document.body.removeChild(event.target);
			};
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		}
		downloadLink.click();
	}

	// *** GUIDE DATA *** \\
	// <a class="guide-link button" data-target="#l-start">getting started</a>
	// <a class="guide-link button" data-target="#l-quantum-computers">on quantum computers</a>
	// <a class="guide-link button" data-target="#l-qubits">on qubits</a>
	// <a class="guide-link button" data-target="#l-gates">on quantum gates</a>
	// <a class="guide-link button" data-target="#l-oracles">on oracles</a>
	// <a class="guide-link button" data-target="#l-grovers">Grover's algorithm</a>
	// <h1>examples</h1>
	// <a class="guide-link button" data-target="#e-deutsch-jozsa">Deutsch-Jozsa algorithm</a>
	// <a class="guide-link button" data-target="#e-grovers">Grover's algorithm</a>
	// <a class="guide-link button" data-target="#e-shors">Shor's algorithm</a>
	// <h1>documentation</h1>
	// <a class="guide-link button" data-target="#d-qnot">qnot</a>
	// <a class="guide-link button" data-target="#d-cnot">cnot</a>
	// <a class="guide-link button" data-target="#d-srn">srn</a>
	// <a class="guide-link button" data-target="#d-nand">nand</a>
	// <a class="guide-link button" data-target="#d-hadamard">hadamard</a>
	// <a class="guide-link button" data-target="#d-utheta">utheta</a>
	// <a class="guide-link button" data-target="#d-cphase">cphase</a>
	// <a class="guide-link button" data-target="#d-u2">u2</a>
	// <a class="guide-link button" data-target="#d-swap">swap</a>
	// <a class="guide-link button" data-target="#d-measure">measure</a>
	// <a class="guide-link button" data-target="#d-end">end</a>
	// <a class="guide-link button" data-target="#d-oracle">oracle</a>
});
