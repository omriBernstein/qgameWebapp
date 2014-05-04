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
			, rowHeight = containerHeight / numQubits
			, columnWidth = rowHeight;

		// // Other possibility - for absolute positioned rows
		// // if space is needed between rows
		// var sectionHeight = containerHeight / numQubits
		// , rowH = sectionHeight - 3;

		var rowData = []
		for(var i = 0; i < numQubits; i++) {
			rowData[i] = rowNums[i];
		};

		var wireData = [];
		for(var i = 0; i < numQubits; i++) {
			wireData[i] = ["ABCDEFGHIJ"[i], rowNums[i]];
		};

		// TESTING NON-COMPONENT STUFF
		// var componentData = [];
		// for(var i = 0; i < expressions.length; i++) {
		// 	componentData[i] = expressionToComponent(expressions[i]);
		// };

	// --- ROWS --- \\
		var row = container.selectAll(".d-row").data(rowData);

		// Add a row if needed
		row.enter().append("div")
			.attr("class", "d-row")
			.style("margin", rowMargin + "px")
			// .attr("padding", "calc(50%-" + (wireHeight/2) + "em")  // needed? abs pos for contents?
			// .attr({"padding-right": "0", "padding-left": "0"})
			.style("height", (rowHeight - (rowMargin * 2)) + "px")
			.style("background-color", "red")
			.text("a;sldkjf");
		;

	// --- WIRES --- \\
		// // A wire is made up of a letter, a space, then a horizontal line
		// // It is vertically centered in row height

		// var wire = container.selectAll(".wire").data(wireData);

		// wire.enter().append("line")
		// 	.attr("class", "wire");

		// wire.attr("height", rowHeight)
		// 	.attr("width", columnWidth * Math.max(5, 0))
		// 		// componentData.length)
		// ;

		// wire.exit()
		// 	.remove();


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
