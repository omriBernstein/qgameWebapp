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


	var default_EntangMatrix = [[1,0],[0,1]];
	var default_PaddingArray = [0,0];

	// *** INITIALIZATION *** \\
	editor.getSession().setUseWrapMode(true);
	buildQubitArray();

	// *** EVENT LISTENERS ***\\

	$("#hidden-file-input").on('change.file',readSingleFile);

	$("#import").click(function(){
		$("#hidden-file-input").click();
	});

	$("#export").on("click", exportProgram);

	// --- Open guide content --- \\
	$(".guide-link").click(function() {
		var $this = $(this);
		// This means the text won't disappear when guide item is closed
		// (won't need a delay before removing) and yet will have the
		// correct text
		$(".guide-item").removeClass("current");
		$guideMenu.addClass("hidden");
		$guideDetail.removeClass("hidden");
		$(".guide-item-title").text($this.text());
		$($this.data("target")).addClass("current");
	});
	
	// --- Close guide content --- \\
	$("#guide-back").click(function() {
		$guideMenu.removeClass("hidden");
		var $current = $guideDetail.addClass("hidden").children(".current");
		// setTimeout(function() {$current.removeClass("current");}, 450)
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
		editor.focus();
	});

	// --- Handle dragging of reference item (take two) --- \\
	var referenceItems = document.querySelectorAll(".reference-item");
	[].forEach.call(referenceItems, function(refItem) {
		var prevBackgroundColor = refItem.style.backgroundColor,
			prevColor = refItem.style.color;
		refItem.addEventListener("dragstart", function(evt) {
			evt.dataTransfer.setData("text/html", $(this).text().trim());
			this.style.backgroundColor = "rgba(0,0,0,0)";
			this.style.color = "#000";
			var icons = this.querySelectorAll(".icon");
			[].forEach.call(icons, function(icon) {
				icon.style.opacity = "0";
			});
		}, false);
		refItem.addEventListener("dragend", function() {
			this.style.backgroundColor = prevBackgroundColor;
			this.style.color = prevColor;
			var icons = this.querySelectorAll(".icon");
			[].forEach.call(icons, function(icon) {
				icon.style.opacity = "1";
			});
			editor.focus();
		}, false);
	});

	// Hovering over code area with dragged referenced item, changes cursor row
	document.getElementById("code-area").addEventListener("dragover", function(evt) {
		evt.preventDefault();
		var pos = editor.renderer.screenToTextCoordinates(evt.x, evt.y);
		editor.navigateTo(pos.row, 0);
	}, false);

	// Dropping into code area inserts at beginning of hovered line, followed by a line break if line is non-empty
	document.getElementById("code-area").addEventListener("drop", function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var currentLine = editor.getSession().getLine(editor.getCursorPosition().row),
			toInsert =  evt.dataTransfer.getData("text/html") + (currentLine ? "\n" : "");
		editor.insert(toInsert);
		if(currentLine){editor.navigateLeft();}
		editor.focus();
	}, false);

	// Double clicking reference item loads it into next line
	$(".reference-item").dblclick(function() {
		var currentLine = editor.getSession().getLine(editor.getCursorPosition().row),
			toInsert = (currentLine ? "\n" : "") + $(this).text().trim();
		editor.navigateLineEnd();
		editor.insert(toInsert);
		editor.focus();
	});
	
	// --- Open guide documentation content with ref "?" button --- \\
	$(".reference-button").on("click", function () {
		// We already have something to handle this. Use it.
		$(".guide-item, " + $(this).data("target")).trigger("click");
	})

	// --- Set editor to example text --- \\
	$(document).on("click", ".example", function (evt) {
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
	    	evaluate(editor.getValue(), buildQubitArray);
	    } catch (e) {
	    	//console.log(e);
	    	//maybe put a little warning icon in the editor
	    } 
	}

	function buildQubitArray(newStates, newEntangMatrix, newPaddingArray) {
		var fullEntangMatrix = newEntangMatrix || default_EntangMatrix,
			fullPaddingArray = newPaddingArray || default_PaddingArray;
		if (newStates) {
			computedStates = newStates;
			numQubits = (computedStates.length < userNum) ? userNum : computedStates.length;
		}
		for (var fullStates = computedStates.slice(0), i = computedStates.length; i < numQubits; i++) {
			fullStates.push(defaultQubit);
		}
		for (var j = fullEntangMatrix.length; j < numQubits; j++) {
			fullPaddingArray.push(0);
			var lastRow = [];
			for (var k = 0; k < fullEntangMatrix.length; k++) {
				fullEntangMatrix[k].push(0);
				lastRow.push(0);
			}
			lastRow.push(1);
			fullEntangMatrix.push(lastRow);
		}

		if (numQubits > 1 && fullPaddingArray.length > numQubits) {
			var newLastIndex = fullPaddingArray.length - numQubits;
			fullPaddingArray = fullPaddingArray.slice(0, numQubits);
			console.log(fullPaddingArray);
			// Array to loop through
			fullEntangMatrix = fullEntangMatrix.slice(0, numQubits);
			// Array to change
			var tempEntangMatrix = [];
			for (var indx = 0; indx < fullEntangMatrix.length; indx++) {
				// Array to loop through
				var currentRow = fullEntangMatrix[indx];
				// Array to change
				var tempRow = fullEntangMatrix[indx];
				tempRow = currentRow.slice(0, numQubits);
				// Build temp array one row at a time
				tempEntangMatrix.push(tempRow);
			} // end for fullEntangMatrix.length
			// Replace the old array with the array just built
			fullEntangMatrix = tempEntangMatrix;
		}

		numQubits = i;//why is this line here?
		default_EntangMatrix = fullEntangMatrix;
		default_PaddingArray = fullPaddingArray;
		visualizer.render(fullStates, fullEntangMatrix, fullPaddingArray);
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

	// *** GUIDE HTML *** \\
	guide.loadHTML();
	/*
	$(".guide-item.l-start").html("Welcome to qromp, a quantum programming environment designed to help you learn about what that even means. This area over here is the guide. Directly to the right is the code editor where you may write quantum algorithms. You can click the its purple bar on the left to see the function reference. The reference shows not only which functions you can use, but also what type of arugments they take. Continuing right we arrive at the visualizer. This area visually represents the simulated quantum computer itself. Each circle is what's called a qubit. Down below is where the circuit diagram will go once it's built."
		+ "<br/><br/>If you've made it this far, you're probably wondering what quantum programming is. It's the kind of computer programming that applies to quantum computers. A quantum computer is a very strange type of computer that is very different from an ordinary computer (most likely, you've only ever interacted with ordinary computers). The idea of quantum computing stems from the question: what if you built a computer that is based on quantum physics (as opposed to classical physics)?"
		+ "<br/><br/>But to learn quantum computer programming, you don't need to know quantum mechanics--for the same reasons that you do not need to know electrical dynamics to be an ordinary-computer programmer. Of course, the whole field is quite young (certainly no more than 35 years old), so getting acquainted with quantum programming often involves getting your hands dirty (or clean, some may argue) with physics."
		+ "<br/><br/>Well anyways, if you want to get started, feel free to click any of the examples below, or just try some stuff out yourself by typing in the code area (again, the list of possible functions can be seen by clicking that purple bar on the right of the editor)."
		+ "\n<div class='example-list'>"
		+ "\nClick on an example:"
		+ "\n<ul>"
			+ "\n<li class='example'>qnot A</li>"
			+ "\n<li class='example'>hadamard A</li>"
			+ "\n<li class='example'>hadamard B</li>"
			+ "\n<li class='example'>u2 A 0 0 0 PI/2</li>"
		+ "\n</ul>"
	);  // end #l-start.html

	$(".guide-item.l-quantcomp").html("As we've said, quantum computers are strange. But really."
		+ "<br><br>Let's start with something less bizarre. Ordinary computers perform operations by changing bits of information--where each bit can be either ON or OFF. We say it has two states. If you were a computer with only one bit, it would be like being able to hear only YES or NO, and being able to say only YES or NO--that's it."
		+ "<br><br>With two bits, a computer has four states: ON+ON, ON+OFF, OFF+ON, or OFF+OFF. That's a little more interesting (well, to me at least). As you scale up, the number of possible states grows exponentially--with three bits there are eight states, with four bits there are sixteen states. On the other hand, the computer can only ever be in one of these states at a single time."
		+ "<br><br>Well that's not completely the case for a quantum computer. Quantum computers can exist in what's called a superposition of states. When superposed, multiple possible states are represented simultaneously. For example, let's consider a quantum computer with one qubit (quantum bit)."
		+"<br><br>This quantum computer can be in the state UP or the state DOWN, or it can be in some combination: half-UP and half-DOWN; one-third-UP and two-thirds-DOWN.");  // end .l-quantcomp.html
	$(".guide-item.l-qubits").html("Stuff about qubits"); // end .l-qubits.html
	$(".guide-item.l-gates").html("Stuff about gates"); // end .l-gates.html
	$(".guide-item.l-oracles").html("Stuff about oracles"); // end .l-oracles.html
	$(".guide-item.l-grovers").html("Stuff about grovers"); // end .l-grovers.html
	$(".guide-item.e-deutschjozsa").html("Stuff about deutsch-jozsa"); // end .e-deutschjozsa.html
	$(".guide-item.e-grovers").html("Stuff about grovers"); // end .e-grovers.html
	$(".guide-item.e-shors").html("Stuff about shors"); // end .e-shors.html
	$(".guide-item.d-qnot").html("Stuff about qnot"); // end .d-qnot.html
	$(".guide-item.d-cnot").html("Stuff about cnot"); // end .d-cnot.html
	$(".guide-item.d-srn").html("Stuff about srn"); // end .d-srn.html
	$(".guide-item.d-nand").html("Stuff about nand"); // end .d-nand.html
	$(".guide-item.d-hadamard").html("Stuff about hadamard"); // end .d-hadamard.html
	$(".guide-item.d-utheta").html("Stuff about utheta"); // end .d-utheta.html
	$(".guide-item.d-cphase").html("Stuff about cphase"); // end .d-cphase.html
	$(".guide-item.d-u2").html("Stuff about u2"); // end .d-u2.html
	$(".guide-item.d-swap").html("Stuff about swap"); // end .d-swap.html
	$(".guide-item.d-measure").html("Stuff about measure"); // end .d-measure.html
	$(".guide-item.d-end").html("Stuff about end"); // end .d-end.html
	$(".guide-item.d-oracle").html("Stuff about oracle"); // end .d-oracle.html
	*/
});
