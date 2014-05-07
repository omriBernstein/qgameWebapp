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
	// Temporary till in css
	// !!! PROBLEM - vertical overlow is caused as well
	// when components are added
	$("#diagram").css("overflow-x", "auto");
	$("#diagram").css("overflow-y", "hidden");

	// *** VARIABLE DECLARATION ***\\
	var // Keep track of qubit states and count
		userNum = 1,
		numQubits = 1,
		computedStates = [],
		defaultQubit = {up: {prob: 1, phase: 0}, down: {prob: 0, phase: 0}},
		// Instantiate editor and visualizer
		editor = ace.edit("code-area"),
		visualizer = new VisualizerObject("qubit-svg"),
		diagram = new CircuitObject("diagram"),
		// Store often-used elements
		$guideMenu = $("#guide-menu"),
		$guideDetail = $("#guide-detail");


	var default_EntangMatrix = [[1,0],[0,1]];
	var default_PaddingArray = [0,0];
	var default_Expressions = [];

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

	function buildQubitArray(newStates, newEntangMatrix, newPaddingArray, newExpressions) {
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
		default_Expressions = newExpressions || default_Expressions;
		visualizer.render(fullStates, fullEntangMatrix, fullPaddingArray);
		diagram.render(numQubits, default_Expressions);
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

	$(document).on("mouseenter","#highlight-editor", function() {
		$("#editor").addClass("highlight");
	});
	$(document).on("mouseleave","#highlight-editor", function() {
		$("#editor").removeClass("highlight");
	});

	$(document).on("mouseenter","#highlight-visualizer", function() {
		$("#visualizer").addClass("highlight");
	});
	$(document).on("mouseleave","#highlight-visualizer", function() {
		$("#visualizer").removeClass("highlight");
	});

	$(document).on("mouseenter","#highlight-diagram", function() {
		$("#diagram").addClass("highlight");
	});
	$(document).on("mouseleave","#highlight-diagram", function() {
		$("#diagram").removeClass("highlight");
	});

	$(document).on("mouseenter","#highlight-reference", function() {
		$("#reference-handle").click();
		$("#reference").addClass("highlight");
	});
	$(document).on("mouseleave","#highlight-reference", function() {
		$("#reference-handle").click();
		$("#reference").removeClass("highlight");
	});
});
