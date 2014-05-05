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
			, "cphase": "cphase"  // Possible image?
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
		var containerHeight = parseInt(container.style("height"))
			// I think there needs to be a minimum row height with
			// overflow scroll, it gets pretty small. Maybe a steady
			// height based on rem?
			, rowHeight = containerHeight / numQubits
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
			.style("fill", "lightblue")
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
			.style("fill", "lightblue")
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
			, wireWidth = $(".d-row").innerWidth(), labelSectionWidth = labelRadius * 2 + 10;

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

		$(".d-col").remove();

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

		var colXPos = columnWidth;

		for (var columnNum = 0; columnNum < numCols; columnNum++) {
			var rowYCoord = $($(".d-row")[0]).position().top;
			var thisID = "#d-col" + columnNum;
			var comptSymb = componentData[columnNum].sym
				// The row with the lowest index
				, comptStartRow = componentData[columnNum].rows.start
				, comptControlRow = componentData[columnNum].rows.control
				, comptTargetRow = componentData[columnNum].rows.target
			;
			var comptLineWidth = "2px";

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
			var compRowTop = $($(".d-row")[comptStartRow]).position().top
				, compHeight = colRealWidth;
			;

			// Not sure if we need to make a group
			var thisComp = thisCol.append("g").attr("class", "comp-group")
				.attr("transform", "translate(0, " + compRowTop + ")")
			;

			// Draw different components differently
			if (singeLineCompArray.indexOf(comptSymb) > -1) {
				singleLine(thisComp);
			}
			else if(comptSymb == "cnot") {
				cnotCompt(thisComp);
			}

			// These don't work inside the functinos for some reason
			// even though they print correctly
			var colXCenter = colRealWidth/2, colYCenter = compHeight/2;

			function singleLine (parent) {
				// Add square
				parent.append("rect").attr("class", "comp-backer")
					.attr({ "width": colRealWidth + "px"
						, "height": compHeight + "px"
					})
					.style({"stroke": "gray", "fill": "#FFFFCC"})
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
						+ colXCenter
					, targetCY = $($(".d-row")[comptTargetRow]).position().top
						+ colXCenter
					, lineTop = Math.min(controlCY, targetCY)
					, lineBottom = Math.max(controlCY, targetCY)
				;

				// Control y position
				parent.append("circle").attr("class", "component-symbol cnot-control")
					.attr("cy", controlCY)
				;
				// Target y position
				parent.append("circle").attr("class", "component-symbol cnot-target")
					.attr("cy", targetCY)
				;
				// Connecting line start and end
				parent.append("line").attr("class", "component-symbol cnot-line")
					.attr("y1", lineTop)
					.attr("y2", lineBottom)
					// add a line here coming from the bottom
				;

			}

			// These should be added to css stuff? Hmm, not sure of "y"
			// Well, at least some of these should

			// Center everything
			d3.selectAll(".component-symbol")
				// "50%" doesn't work with y for some reason
				.attr({"x": "50%", "y":  colXCenter, "cx": "50%"})
			;
			// Size and x pos of component control
			d3.selectAll(".cnot-control")
				.attr("r", labelRadius/2)
				.style("fill", "black")
			;

			// Size and y pos of component target
			d3.selectAll(".cnot-target")
				.attr("r", labelRadius)
				.attr({"fill": "none", "stroke-width": "2px", "stroke": "black"})
			;

			// Width and x pos of cnot connecting line
			d3.selectAll(".cnot-line")
				.attr("x1", colXCenter)
				.attr("x2", colXCenter)
				.attr("stroke-width", comptLineWidth)
				.attr("stroke", "black")
			;

		}  // end for columns

	// --- Drawing components --- \\

		// var colEnter = cols.enter().append("svg")
		// 	.attr("class", "d-col")
		// 	.style({"position": "absolute", "top": "0"})
		// 	.style("left", function (dat) {
		// 		return (dat + 0.97) * columnWidth + dat * 1;
		// 	})
		// 	.style("margin", rowMargin + "px 0")
		// 	.style("width", (rowHeight - (rowMargin * 2.5)) + "px")
		// 	// Don't know how this will fare with size change
		// 	.style("height", "98%")
		// 	.style({"background-color": "lightgray", "stroke": "black"})
		// ;

		// // Animate existing rows?
		// cols.transition()
		// 	.duration(animTime)
		// 	.style({"position": "absolute", "top": "0"})
		// 	.style("left", function (dat) {
		// 		return (dat + 0.97) * columnWidth + dat * 1;
		// 	})
		// 	.style("margin", rowMargin + "px 0")
		// 	.style("width", (rowHeight - (rowMargin * 2.5)) + "px")
		// 	// Don't know how this will fare with size change
		// 	.style("height", "98%")
		// 	.style({"background-color": "lightgray", "stroke": "black"})
		// ;

		// // Remove cols whose data no longer exists
		// cols.exit().transition()
		// 	.duration(animTime)
		// 	.remove();

	// --- (old) COMPONENTS --- \\
		// var actualRowHeight = $(".d-row").innerHeight()  // Should be smaller to give space for padding
		// , padding = 3;


		// var grid = [], gridRow = [];
		// for (var row = 0; row < numQubits; row++) {
		// 	for (var col = 0; col < numCols; col++) {
		// 		// Add column values to row till row is full
		// 		gridRow.push(col);
		// 		// really gridRow.push([row * whatever, col * whatever]);
		// 	}
		// 	// Add row to grid
		// 	grid.push[gridRow];
		// 	// Reset the row to blank
		// 	gridRow = [];
		// }

		// var componentData = [];
		// for(var i = 0; i < expressions.length; i++) {
		// 	componentData[i] = expressionToComponent(expressions[i]);
		// };

		// var component = container.selectAll(".component").data(componentData);

		// component.enter().call(function (compts) {
		// 	console.log(compts[0]);
		// })
		// // component.enter().append("rect")
		// // 	.attr("width", columnWidth)
		// // 	.attr("height", rowHeight)
		// // 	.attr("transform", positionComponent)
		// // 	.attr("contents", function(d) {return d.sym});

		// // component.exit()
		// // 	.remove();

		// function doubleLine (name) {

		// }

		// function oracleLines (numLines, lastQubit) {

		// }

		// function positionComponent(cmpnt) {
		// 	return "translate("
		// 		cmpnt.columnNum * columnWidth + ","
		// 		Math.min(cmpnt.rows) * rowHeight + 
		// 	")"
		// }
	}  // end this.render()
}  // End CircuitObject()

// *** TESTS *** \\
$(document).on("ready", function () {
	var TESTING = true;
	if (TESTING) {
		diagram = new CircuitObject("diagram");

		// Tests without components:
		// diagram.render(3, "x");
		// diagram.render(5, "x");
		// diagram.render(1, "x");

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
		];
		diagram.render(2, compData)
		// singleRowComponent(d3.select(".d-col"), componentSymbols.qnot);
	}
});
