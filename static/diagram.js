/*
Notes:
1 line high: qnot, srn, hadamard, utheta, u2, measure
2 lines high: cnot, swap, cphase
n lines high: oracle
*/

function CircuitObject(containerID) {
	var container = d3.select("#" + containerID)
	, wireHeight = 0.5, rowNums = [1, 2, 3, 4, 5 ,6, 7, 8, 9, 10]
	, rowMargin = 3
	, animTime = 500;

	var componentSymbols = {
			"qnot": "X"
			, "srn": "S"
			, "hadamard": "H"
			, "utheta": "U\u03B8"  // I believe this is the correct code
			, "cnot": "cnot"  // An image?
			, "swap": "swap"  // An image?
			, "cphase": "R"  // Possible image?
			, "u2": "U"
			, "measure": "M"
			, "oracle": "O"  // I don't even know
		}
		, singeLineCompArray = ["X", "S", "H", "U\u03B8", "U", "M"]
	;



	function Component(name, qubitsArray, hasTarget, columnNum) {
		this.sym = componentSymbols[name];
		this.rows = {
			start: Math.min.apply( null, qubitsArray )
			, end: Math.max.apply( null, qubitsArray )
			, control: hasTarget == true ? qubitsArray[0] : false
			, target: hasTarget == true ? qubitsArray[qubitsArray.length - 1] : false
		};
		this.columnNum = columnNum;
		return this;
	}

	function expressionToComponent(expression) {
		var fnName = expression._fn_meta._name,
			qubits = [],
			hasTarget = expression._has_target,
			lineNum = expression._line_number;
		for(var i = 0; i < expression._qubits.length; i++){
			qubits[i] = expression._qubits[i]._value;
		};


		return new Component(fnName, qubits, hasTarget, lineNum);
	}

	this.render = function(numQubits, expressions){
		var adjustedContainerHeight = parseInt(container.style("height")) - 2
			// I think there needs to be a minimum row height with
			// overflow scroll, it gets pretty small. Maybe a steady
			// height based on rem?
			, rowHeight = adjustedContainerHeight / numQubits
			, columnWidth = rowHeight;

		var rowData = []
		for(var i = 0; i < numQubits; i++) {
			rowData[i] = [ rowNums[i], "ABCDEFGHIJ"[i] ];
		};

		var wireData = [];
		for(var i = 0; i < numQubits; i++) {
			wireData[i] = rowNums[i];
		};

	// --- ROWS --- \\ They contain the row label and the wire
		// container should have padding on the left and right = rowMargin or something
		var rows = container.selectAll(".d-row").data(rowData);

		// Add a row if needed (variable will be used to add labels and wires)
		var rowEnter = rows.enter().append("svg")
			.attr("class", "d-row")
			.style("margin", rowMargin + "px 0")
			// .attr("padding", "calc(50%-" + (wireHeight/2) + "em")  // needed? abs pos for contents?
			// .attr({"padding-right": "0", "padding-left": "0"})
			// Why does 2.5 work?
			.style("height", (rowHeight - (rowMargin * 2.5)) + "px")
			// .style("background-color", "lightgreen")
		;

		// Animate existing rows?
		rows.transition()
			.duration(animTime)
			.style("margin", rowMargin + "px 0")
			// .attr("padding", "calc(50%-" + (wireHeight/2) + "em")  // needed? abs pos for contents?
			// .attr({"padding-right": "0", "padding-left": "0"})
			// Why does 2.5 work?
			.style("height", (rowHeight - (rowMargin * 2.5)) + "px")
			// .style("background-color", "lightgreen")
		;

		// This removes all the contents as well
		rows.exit().transition()
			.duration(animTime)
			.remove();

	// --- Row Names --- \\
		var labelRadius = rowHeight/3
		, fontSize = labelRadius/10
		// What to subtract from height?
		, labelX = labelRadius + 3, labelY = rowHeight/2 - 4;

		// When a new row enters, 
		var rowLabel = rowEnter.append("g")
			.attr("class", "row-label")
			.attr("transform", "translate(" + labelX + ", " + labelY + ")")
		;
		// it gets a label with a background...
		rowLabel.append("circle")
			.attr("class", "label-backer")
			.style("fill", "none")
		;
		// ...and text
		rowLabel.append("text")
			.attr("class", "label-text")
		;

		// Update label's stuff to new dimensions
		container.selectAll(".row-label").transition()
			.duration(animTime)
			.attr("transform", "translate(" + labelX + ", " + labelY + ")")
		;
		container.selectAll(".label-backer")
			.style("fill", "none")
			.attr("r", labelRadius)
		;
		container.selectAll(".label-text")
			.data(rowData)
			.text(function (dat) { return dat[1]; })
			.attr("fill", "black")
			.attr("font-size", fontSize + "em")
			.attr("dy", "0.38em")
			.attr("dx", "-0.35em")
		;

	// --- Wires --- \\
		// A wire is vertically centered in row height
		var strokeWidth = 2, wireY = rowHeight/2 - strokeWidth
			, wireWidth = $(".d-row").innerWidth()
			, labelSectionWidth = labelRadius * 2 + 10;

		// When a new row enters, it gets a wire
		rowEnter.append("line")
			.attr("class", "wire")
		;

		// All wires are updated to new dimensions
		container.selectAll(".wire").transition()
			.duration(animTime)
			.attr("x1", labelSectionWidth)
			.attr("x2", wireWidth - labelSectionWidth/2)
			.attr("y1", wireY)
			.attr("y2", wireY)
			.attr("stroke-width", strokeWidth)
			.attr("stroke", "black")
		;

	// --- COMPONENTS --- \\
		// Remove everything so it doesn't look weird during transition
		$(".d-col").remove();

		// Wait till rows are in the right place before using their
		// positions to place components
		setTimeout( function () {
			var componentData = [];
			for(var i = 0; i < expressions.length; i++) {
				componentData[i] = expressionToComponent(expressions[i]);
				// console.log(componentData[i]);
			};

			// Maybe make list of components for each column and then use *that*
			// to make numCols


		// --- COLUMNS --- \\
	// Other possibility
	// remove all columns
	// column1.append(component1 at the right place) (ask for y pos of relevant row);
	// column2.append(component2 at the right place) (ask for y pos of relevant row);
	// remove all

			// What we'd see if we gave columns a background
			var colRealWidth = $(".d-row").innerHeight();
			// Space that has the column in it, gives a gap between columns
			var colAreaWidth = columnWidth;
			// Works because no negative numbers. -1 to give gap for labels at start
			// Use number of components instead?
			// var numCols = (Math.floor($(".d-row").innerWidth()/columnWidth) - 1);
			var numCols = componentData.length;
			var colColor = "lightgray";

			var colData = []  // I'm not always sure what data is for
			for(var ii = 0; ii < numCols; ii++) { colData[ii] = ii; };

			var cols = container.selectAll(".d-col").data(colData);

			// $(".d-col").attr({
			// 	"position": "absolute", "top": "0"
			// 	, "width": colRealWidth + "px"
			// 	// , "height": "100%"  // Not sure if we need height anymore
			// 	, "background-color": "lightgray", "border": "1px solid black"
			// });

			var colXPos = columnWidth * 1.2;

			for (var columnNum = 0; columnNum < numCols; columnNum++) {
				var rowYCoord = $($(".d-row")[0]).position().top;
				var thisID = "#d-col" + columnNum;
				var comptSymb = componentData[columnNum].sym
					// The row with the lowest index
					, comptStartRow = componentData[columnNum].rows.start
					, comptEndRow = componentData[columnNum].rows.end
					, comptControlRow = componentData[columnNum].rows.control
					, comptTargetRow = componentData[columnNum].rows.target
				;
				var comptLineWidth = 2;

				var thisCol = container.append("svg").attr("class", "d-col")
					.attr("id", thisID)
					// .data("index", columnNum)  // Needed?
					// .data()  // Needed?
					.style({
						"position": "absolute", "top": "0"
						, "left": (colXPos + (columnWidth * columnNum)) + "px"
						, "margin": rowMargin + "px 0" // Space from top
						, "width": colRealWidth + "px"
						// , "height": "100%"  // Not sure if we need height anymore
						// , "background-color": "lightgray", "border": "1px solid black"
					})
				;
				// The top of this component's top row
				var compRowTop = $($(".d-row")[comptStartRow]).position().top;
				console.log(comptStartRow);

				// Not sure if we need to make a group
				var thisComp = thisCol.append("g").attr("class", "comp-group")
					.attr("transform", "translate(0, " + compRowTop + ")")
				;

				// These don't work inside the functinos for some reason
				// even though they print correctly
				var colXCenter = colRealWidth/2, colYCenter = colRealWidth/2;

				// Draw different components differently
				if (singeLineCompArray.indexOf(comptSymb) > -1) {
					singleLine(thisComp);
				}
				else if (comptSymb == "cnot") {cnotCompt(thisComp);}
				else if (comptSymb == "swap") {swapCompt(thisComp);}
				// "R" is used for cphase to get that letter in the box
				else if (comptSymb == "R") {cphaseCompt(thisComp);}
				else if (comptSymb == "O") {oracleCompt(thisComp);}

				else {console.log("Unrecognized component symbol: " + comptSymb)}

				function singleLine (parent) {
					// Add square
					parent.append("rect").attr("class", "comp-backer")
						.attr({ "width": colRealWidth + "px"
							, "height": colRealWidth + "px"
						})
						.style({"stroke": "black", "fill": "white"})
					;
					// Add text
					parent.append("text").attr("class", "component-symbol compt-text")
						.text(comptSymb)
						.attr("fill", "black")
						.attr("font-size", fontSize + "em")
						// Makes x and y represent the middle point of the text
						.attr("text-anchor", "middle")
						// It's not exactly vertically middle
						.attr("dy", "0.3em")
					;
				}

				function cnotCompt (parent) {
					var controlCY = $($(".d-row")[comptControlRow]).position().top
							- compRowTop
							+ colXCenter
						, targetCY = $($(".d-row")[comptTargetRow]).position().top
							- compRowTop
							+ colXCenter
						, higherRowYCenter = Math.min(controlCY, targetCY)
						, lowerRowYCenter = Math.max(controlCY, targetCY)
					;

					// Control y position
					parent.append("circle").attr("class", "component-symbol compt-control")
						.attr("cy", controlCY + 1)
					;
					// Target y position
					parent.append("circle").attr("class", "component-symbol compt-target")
						.attr("cy", targetCY)
					;
					// Crossing lines
					parent.append("line").attr("class", "component-symbol compt-line cnot-cross-vert")
						.attr("y1", targetCY-labelRadius)
						.attr("y2", targetCY+labelRadius)
					;
					parent.append("line").attr("class", "component-symbol compt-line cnot-cross-horiz")
						.attr("y1", targetCY+1)
						.attr("y2", targetCY+1)
					;
					// Connecting line start and end
					parent.append("line").attr("class", "component-symbol compt-line connecting-vert-line")
						.attr("y1", higherRowYCenter)
						.attr("y2", lowerRowYCenter)
					;

				}  // end cnotCompt()

				// Very similar to cnotCompt()
				function cphaseCompt (parent) {
					var controlCY = $($(".d-row")[comptControlRow]).position().top
							- compRowTop
							+ colXCenter
						, targetCY = $($(".d-row")[comptTargetRow]).position().top
							- compRowTop
							+ colXCenter
						, higherRowYCenter = Math.min(controlCY, targetCY)
						, lowerRowYCenter = Math.max(controlCY, targetCY)
					;
					// SPECIAL FOR cphase, need top of target row
					var targetRowTop = $($(".d-row")[comptTargetRow]).position().top;

					// Control y position
					parent.append("circle").attr("class", "component-symbol compt-control")
						.attr("cy", controlCY + 1)
					;

					// Connecting line start and end
					parent.append("line").attr("class", "component-symbol compt-line connecting-vert-line")
						.attr("y1", higherRowYCenter)
						.attr("y2", lowerRowYCenter)
					;

					// Add single line component with "R" in it
					var cphaseSquareGroup = parent.append("g")
						.attr("class", "component-symbol cphase-square-group")
						.attr("transform", "translate(0, " + (targetRowTop - compRowTop) + ")")
					;
					singleLine(cphaseSquareGroup);
				}  // end cphaseCompt()

				function swapCompt (parent) {
					var controlCY = $($(".d-row")[comptControlRow]).position().top
							- compRowTop
							+ colXCenter
						, targetCY = $($(".d-row")[comptTargetRow]).position().top
							- compRowTop
							+ colXCenter
						, higherRowYCenter = Math.min(controlCY, targetCY)
						, lowerRowYCenter = Math.max(controlCY, targetCY)
					;

					// Center both the x's and the line
					var swapGroup = parent.append("g").attr("class", "component-symbol swap-group")
						.attr("transform", "translate(" + colXCenter + ", "
							+ 0 + ")")
					;
					// Connecting line start and end
					swapGroup.append("line").attr("class", "component-symbol compt-line swap-connecting-line")
						.attr("y1", higherRowYCenter + 1)
						.attr("y2", lowerRowYCenter + 1)
					;

					var xLength = colXCenter/3.5;

					// Get the topX to the right place
					var topX = swapGroup.append("g").attr("class", "component-symbol topX")
						.attr("transform", "translate(" + 0 + ", "
							+ (colXCenter + 1) + ")")
					;
					// Slash from top left to bottom right (tLbR)
					topX.append("line").attr("class", "component-symbol compt-line XtLbR");
					// Slash from top right to bottom left (tRbL)
					topX.append("line").attr("class", "component-symbol compt-line XtRbL");

					var bottomX = swapGroup.append("g").attr("class", "component-symbol bottomX")
						.attr("transform", "translate(" + 0 + ", "
							+ (lowerRowYCenter + 1) + ")")
					;
					// Slash from top left to bottom right (tLbR)
					bottomX.append("line").attr("class", "component-symbol compt-line XtLbR");
					// Slash from top right to bottom left (tRbL)
					bottomX.append("line").attr("class", "component-symbol compt-line XtRbL");

					// Get the x slashes at the right angles
					d3.selectAll(".XtLbR")
						.attr({"y1": -xLength, "y2": xLength})
						.attr({"x1": -xLength, "x2": xLength})
					;
					d3.selectAll(".XtRbL")
						.attr({"y1": -xLength, "y2": xLength})
						.attr({"x1": xLength, "x2": -xLength})
					;
				}  // end swapCompt()

				function oracleCompt(parent) {
					// This gets the top of the last row of the oracle,
					// then adds a row width to it to get it to fill that last row
					var bottomRowBottom = $($(".d-row")[comptEndRow]).position().top + colRealWidth
						, topRowTop = $($(".d-row")[comptStartRow]).position().top
						oracleHeight = bottomRowBottom - topRowTop
					;

					// Add square
					parent.append("rect").attr("class", "comp-backer")
						.attr({ "width": colRealWidth + "px"
							, "height": (oracleHeight) + "px"
						})
						.style({"stroke": "black", "fill": "white"})
					;
					// Add text (add "component-symbol" back later when we've figured out
						// a way for it to not interfere)
					parent.append("text").attr("class", // "component-symbol
							"compt-text oracle-symbol")
						.text(comptSymb)
						.attr("fill", "black")
						.attr("font-size", fontSize + "em")
						.attr({"x": "50%", "y":  oracleHeight/2})
						// Makes x and y represent the middle point of the text
						.attr("text-anchor", "middle")
						// It's not exactly vertically middle
						.attr("dy", "0.3em")
					;
				}  // end oracleCompt()


				// Target and control should be their own functions? Maybe the
				// class attributes below are enough.
				function comptTarget(parent) {}

				function comptControl(parent) {}


				// These should be added to css stuff? Hmm, not sure of "y"
				// Well, at least some of these should
				// Center everything
				d3.selectAll(".component-symbol")
					// "50%" doesn't work with y for some reason
					.attr({"x": "50%", "y":  colXCenter, "cx": "50%"})
				;
				// Size and x pos of component control
				d3.selectAll(".compt-control")
					.attr("r", labelRadius/2)
					.style("fill", "black")
				;

				// Size and y pos of component target
				d3.selectAll(".compt-target")
					.attr("r", labelRadius)
					.attr({"fill": "none", "stroke-width": "2px", "stroke": "black"})
				;

				// Width and x pos of cnot crossing lines
				d3.selectAll(".cnot-cross-vert")
					.attr("x1", colXCenter)
					.attr("x2", colXCenter)
					.attr("stroke-width", 2*comptLineWidth)
					.attr("stroke", "black")
				;
				d3.selectAll(".cnot-cross-horiz")
					.attr("x1", colXCenter-labelRadius)
					.attr("x2", colXCenter+labelRadius)
					.attr("stroke-width", 2*comptLineWidth)
					.attr("stroke", "black")
				;

				// Width and x pos of cnot connecting line
				d3.selectAll(".connecting-vert-line")
					.attr("x1", colXCenter)
					.attr("x2", colXCenter)
					.attr("stroke-width", comptLineWidth)
					.attr("stroke", "black")
				;

				d3.selectAll(".compt-line")
					.attr("stroke-width", comptLineWidth)
					.attr("stroke", "black")
				;

			}  // end for columns
		}, animTime + 5);  // end setTimeout for components
	}  // end this.render()
}  // End CircuitObject()

// *** TESTS *** \\
/*
$(document).on("ready", function () {
	var TESTING = true;
	if (TESTING) {
		diagram = new CircuitObject("diagram");

		// Tests with comoponents
		compData = 
		[
			{
				_fn_meta : {_name : "hadamard"}
				, _line_number : 0
				, _qubits : [{_value: 0}]
				, _has_target : false
			}
			, {
				_fn_meta : {_name : "cnot"}
				, _line_number : 1
				, _qubits : [{_value: 0}, {_value: 1}]
				, _has_target : true
			}
			, {
				_fn_meta : {_name : "cphase"}
				, _line_number : 2
				, _qubits : [{_value: 2}, {_value: 0}]
				, _has_target : true
			}
			, {
				_fn_meta : {_name : "oracle"}
				, _line_number : 3
				, _qubits : [{_value: 3}, {_value: 0}, {_value: 2}]
				, _has_target : false
			}
			, {
				_fn_meta : {_name : "oracle"}
				, _line_number : 3
				, _qubits : [{_value: 1}, {_value: 2}]
				, _has_target : false
			}
		];
		diagram.render(4, compData)
	}
});
*/
