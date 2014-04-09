function CircuitObject(containerID) {
	var container = d3.select("#" + containerID),
		margin = .9,
		componentScale = .95,
		interwireScale = .1,
		textScale = .8
		animTime = 500;

	function Component(name, rows, columnNum) {
		this.name = name;
		this.rows = rows;
		this.columnNum = columnNum;
		return this;
	}

	function expressionToComponent(expression) {
		var fnName = expression._fn_meta._name,
			qubits = [];
			lineNum = expression._line_number;
		for(i=0;i<expression._qubits.lenth;i++){
			qubits[i]=expression._qubits[i]._value;
		};
		return new Component(fnName, qubits, lineNum);
	}

	this.render = function(numQubits, expressions){
		var containerHeight = parseInt(container.style("height")),
			dim = margin * containerHeight,
			rowHeight = dim / numQubits,
			componentWidth = componentScale * rowHeight,
			columnWidth = componentWidth * (1 + interwireScale);
			textDim = componentWidth * textScale;

		var components = [];
		for(i=0;i<expressions.length;i++) {
			components[i] = expressionToComponent(expressions[i]);
		};

		var wire = container.selectAll(".wire");

		wire.enter()
			.

		wire.transition()
			.duration(animTime)
			.attr("height", function() {return rowHeight;});

		var column = container.selectAll(".column").data(components);
}