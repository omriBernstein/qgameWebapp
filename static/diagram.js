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
		, "utheta": "U&theta;"  // I believe this is the correct code
		, "cnot": "url"  // An image?
		, "swap": "url"  // An image?
		, "cphase": "url"  // Possible image?
		, "u2": "U"
		, "measure": "M"
		, "oracle": "O"
	};

	function Component(name, rows, columnNum) {
		this.sym = componentSymbols[name];
		this.rows = rows;
		this.columnNum = columnNum;
		return this;
	}

	function expressionToComponent(expression) {
		var fnName = expression._fn_meta._name,
			qubits = [];
			lineNum = expression._line_number;
		for(var i = 0; i < expression._qubits.lenth; i++){
			qubits[i] = expression._qubits[i]._value;
		};
		return new Component(fnName, qubits, lineNum);
	}

	this.render = function(numQubits, expressions){
		var containerHeight = parseInt(container.style("height"))
			// I think there needs to be a minimum row height with
			// overflow scroll, it gets pretty small. Maybe a steady
			// height based on rem?
			, rowHeight = containerHeight / numQubits
			, columnWidth = rowHeight;

		// // Other possibility - for absolute positioned rows
		// // if space is needed between rows
		// var sectionHeight = containerHeight / numQubits
		// , rowH = sectionHeight - 3;

		var rowData = []
		for(var i = 0; i < numQubits; i++) {
			rowData[i] = [ rowNums[i], "ABCDEFGHIJ"[i] ];
		};

		var wireData = [];
		for(var i = 0; i < numQubits; i++) {
			wireData[i] = rowNums[i];
		};

		// TESTING NON-COMPONENT STUFF
		// var componentData = [];
		// for(var i = 0; i < expressions.length; i++) {
		// 	componentData[i] = expressionToComponent(expressions[i]);
		// };

	// --- ROWS --- \\
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
			.style("background-color", "lightgreen")
		;

		// Animate existing rows?
		rows.transition()
			.duration(animTime)
			.style("margin", rowMargin + "px 0")
			// .attr("padding", "calc(50%-" + (wireHeight/2) + "em")  // needed? abs pos for contents?
			// .attr({"padding-right": "0", "padding-left": "0"})
			// Why does 2.5 work?
			.style("height", (rowHeight - (rowMargin * 2.5)) + "px")
			.style("background-color", "lightgreen")
		;

		rows.exit().transition()
			.duration(animTime)
			.remove();

	// --- ROW NAMES --- \\
		var labelRadius = rowHeight/3
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

		// Update label's stuff
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
			.attr("font-size", (labelRadius/10) + "em")
			.attr("dy", "0.38em")
			.attr("dx", "-0.35em")
		;



	// --- WIRES --- \\
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
		// var component = conatiner.selectAll(".component").data(componentData);

		// function positionComponent(cmpnt) {
		// 	return "translate("
		// 		cmpnt.columnNum * columnWidth + ","
		// 		Math.min(cmpnt.rows) * rowHeight + 
		// 	")"
		// }

		// component.enter().append("")
		// 	.attr("width", columnWidth)
		// 	.attr("height", rowHeight)
		// 	.attr("transform", positionComponent)
		// 	.attr("contents", function(d) {return d.sym});

		// component.exit()
		// 	.remove();
	}
}

// *** TESTS *** \\
$(document).on("ready", function () {
	var TESTING = true;
	diagram = new CircuitObject("diagram");
	diagram.render(3, "x")

	// Further tests
	// diagram.render(5, "x")
	// diagram.render(1, "x")
});
