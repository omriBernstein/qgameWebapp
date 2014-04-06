/* 
* visualizer.js
* Created by: sethtoles
* Date created: 3/11/14
* Uses d3 to visualize qubits.
*/

var defaultQubit =  [{up: {prob: 1, phase: 0}, down: {prob: 0, phase: 0}}],
	qubits = d3.select("#qubitSVG")
		.attr("width", "100%")
		.attr("height", "100%");

function updateQubits(qubitStates) {
		// General settings
	var margin = .9,
		qubitScale = .9,
		animTime = 1000,
		// Environment info
		numQubits = qubitStates.length,
		svgWidth = parseInt(qubits.style("width")),
		svgHeight = parseInt(qubits.style("height")),
		containerMin = Math.min(svgWidth, svgHeight),
		dim = margin * containerMin,
		// Qubit properties
		qubitRadius = qubitScale * dim / 2,
		arrangeRadius = 0,
		yOffset = 0,
		rotateDeg = 360 / numQubits;

	if (numQubits > 1) {
		var theta = 2 * Math.PI / numQubits,
			p = qubitScale * Math.sin(theta / 2);
		if (numQubits % 2 === 0) {
			arrangeRadius = dim / (2 * (p + 1));
			qubitRadius = dim / 2 - arrangeRadius;
		} else {
			var phi = theta * (numQubits - 1) / 2;
			arrangeRadius = dim / (2 * p + Math.sqrt(2 * (1 - Math.cos(phi))));
			qubitRadius = arrangeRadius * p;
			yOffset = arrangeRadius * (1 - Math.cos(theta / 2));
		}
	}


	function qubitTransform(index, c, r, t, s) {
		var center = c || "translate(" + (svgWidth / 2) + ", " + ((svgHeight / 2) + yOffset / 2) + ")",
			rotate = r || "rotate(" + (rotateDeg * index) + ")",
			translate = t || "translate(0, -" + arrangeRadius + ")"
			straighten = s || "rotate(-" + (rotateDeg * index) + ")";

		return center + rotate + translate + straighten;
	}

	// --- QUBITS --- //
	var qubit = qubits.selectAll(".qubit").data(qubitStates);
	
	// Add qubits if necessary
	qubit.enter().append("g")
		.attr("class", "qubit")
		.attr("transform", function(d, i) { return qubitTransform(i, false, "", "", "") });

	// Remove qubits if necessary
	qubit.exit().transition()
		.duration(animTime)
		.attr("transform", "scale(0)")
		.remove();

	// Update qubit arrangement
	qubit.transition()
		.duration(animTime)
		.attr("transform", function(d, i) { return qubitTransform(i) });	
	

	// --- QUBIT BACK --- //
	var qubitBack = qubit.selectAll(".qubit-back").data([qubitRadius]);

	// Add qubit-back if necessary
	qubitBack.enter().append("circle")
		.attr("class", "qubit-back")
		.attr("r", qubitRadius);

	// Update qubit-back
	qubitBack.transition()
		.duration(animTime)
		.attr("r", qubitRadius);


	// --- SUBSTATES --- //
	var substate = qubit.selectAll(".substate").data(function(d) { return [d.up, d.down] });
	
	// Add substates if necessary	
	substate.enter().append("g")
		.attr("class", "substate")
		.attr("transform", "rotate(180)");

	// Update substates
	substate.transition()
		.duration(animTime)
		.attr("transform", function(d) { return "rotate(" + (180 + d.phase) + ")" });

	// --- PROB-RINGS --- //
	var probRing = substate.selectAll(".prob-ring").data(function(d, i) {
		return [{
			substate: (i % 2 === 0) ? "up" : "down",
			value: d.prob
		}]; 
	});

	// Add prob-rings if necessary
	probRing.enter().append("circle")
		.attr("class", function(d) { return "prob-ring " + d.substate; })
		.attr("r", function(d) {
			var radius = (d.substate === "up") ? (1 - d.value) * qubitRadius + 1 : d.value * qubitRadius - 1;
			return (radius < 0) ? 0 : radius;
		});

	// Update prob-ring size
	probRing.transition()
	  	.duration(animTime)
		.attr("r", function(d) {
			var radius = (d.substate === "up") ? (1 - d.value) * qubitRadius + 1 : d.value * qubitRadius - 1;
			return (radius < 0) ? 0 : radius;
		});

	// --- BARS --- //
	var bar = substate.selectAll(".bar").data(function(d, i) {
		return [{
			substate: (i % 2 === 0) ? "up" : "down",
			prob: d.prob,
			phase: d.phase
		}];
	});

	// Add bars if necessary
	bar.enter().append("rect")
		.attr("class", function(d) { return "bar " + d.substate; })
		.attr("width", 5)
		.attr("height", function(d) { return ((d.prob < 0) ? 0 : d.prob) * qubitRadius })
		.attr("x", - 2.5)
		.attr("y", - .5)
		.attr("transform", function(d) {
			return (d.substate === "up") ? "translate(0, " + ((1 - d.prob) * qubitRadius) + ")" : "";
		});;
	
	// Update bar attributes	
	bar.transition()
	  	.duration(animTime)
		.attr("height", function(d) { return ((d.prob < 0) ? 0 : d.prob) * qubitRadius })
		.attr("transform", function(d) {
			return (d.substate === "up") ? "translate(0, " + ((1 - d.prob) * qubitRadius) + ")" : "";
		});
}
