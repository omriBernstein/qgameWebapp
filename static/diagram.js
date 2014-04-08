function CircuitObject(containerID) {
	var compiledExpressions = [],
		defaultWire = {components:[]},
		container = d3.select("#" + containerID),
		margin = .9,
		componentScale = .95,
		interwireScale = .1,
		textScale = .8
		animTime = 500;

	this.render = function(numQubits, expressions){
		var containerHeight = parseInt(container.style("height")),
			dim = margin * containerHeight,
			rowHeight = dim / numQubits,
			componentDim = componentScale * rowHeight,
			columnWidth = componentDim * (1 + interwireScale);
			textDim = componentDim * textScale;
	}
}