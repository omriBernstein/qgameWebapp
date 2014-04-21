/* 
* visualizer.js
* Created by: sethtoles
* Date created: 3/11/14
* Uses d3 to visualize qubits.
*/

function VisualizerObject(containerID) {
	var container = d3.select("#" + containerID),
		margin = .9,
		qubitScale = .4,
		animTime = 500;

	this.render = function(qubitStates) {
			// Environment info
		var containerWidth = parseInt(container.style("width")),
			containerHeight = parseInt(container.style("height")),
			containerMin = Math.min(containerWidth, containerHeight),
			dim = margin * containerMin,
			// Qubit properties
			numQubits = qubitStates.length,
			qubitRadius = qubitScale * dim / 2,
			arrangeRadius = 0,
			yOffset = 0;

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

	// --- QUBITS --- //
		var qubits = container.selectAll(".qubit").data(qubitStates);
		
		// Add qubits if necessary
		qubits.enter().append("g")
			.attr("class", "qubit")
			.attr("transform", function(d, i) { return positionQubit(i) + "scale(0)"})
		  .append("circle")
			.attr("class", "qubit-back");

		// Update qubit arrangement
		qubits.transition()
			.duration(animTime)
			.attr("transform", function(d, i) { return positionQubit(i) + "scale(1)" });

		// Update each qubit-back
		qubits.select(".qubit-back").transition()
			.duration(animTime)
			.attr("r", qubitRadius);
		
		// Remove qubits if necessary
		qubits.exit().transition()
			.duration(animTime)
			.attr("transform", function(d, i) { return positionQubit(i, true) + "scale(0)" })
			.remove();

		// Return a string with all of the appropriate transformations
			// "remove" is a boolean used to indicate whether the transformed qubit is being removed
		function positionQubit(index, remove) {
			var realNumQubits = (remove) ? index + 1 : numQubits,
				rotateDeg = 360 / realNumQubits,
				center = "translate(" + (containerWidth / 2) + ", " + ((containerHeight / 2) + yOffset / 2) + ")",
				rotate = "rotate(" + (rotateDeg * index) + ")",
				translate = "translate(0, -" + arrangeRadius + ")"
				straighten = "rotate(-" + (rotateDeg * index) + ")";

			return center + rotate + translate + straighten;
		}


	// --- SUBSTATE GROUPS --- //
		var substates = qubits.selectAll(".substate").data(function(d) { return [d.up, d.down] });
		
		// Add substate groups if necessary	
		substates.enter().append("g")
			.attr("class", "substate")
			.attr("transform", "rotate(180)");

		// Update substate groups
		substates.transition()
			.duration(animTime)
			.attr("transform", function(d) { return "rotate(" + (180 + d.phase) + ")" });

		// Used to set the data for prob-rings and bars
		function substateData(d, i) {
			return [{
				substate: (i % 2 === 0) ? "up" : "down",
				value: d.prob
			}]; 
		}

	// --- PROB-RINGS --- //
		var probRing = substates.selectAll(".prob-ring").data(substateData);

		// Add prob-rings if necessary
		probRing.enter().append("circle")
			.attr("class", function(d) { return "prob-ring " + d.substate; })
			.call(setRingRadius);

		// Update prob-ring size
		probRing.transition()
		  	.duration(animTime)
			.call(setRingRadius);

		// Sets the radius of each prob-ring, called on creation and update
		function setRingRadius(selection) {
			selection
				.attr("r", function(d) {
					var radius = (d.substate === "up") ? (1 - d.value) * qubitRadius + 1 : d.value * qubitRadius - 1;
					return (radius < 0) ? 0 : radius;
				});
		}


	// --- BARS --- //
		var bar = substates.selectAll(".bar").data(substateData);

		// Add bars if necessary
		bar.enter().append("rect")
			.attr("class", function(d) { return "bar " + d.substate; })
			.attr("width", 5)
			.attr("x", - 2.5)
			.attr("y", - .5)
			.call(setBars);
		
		// Update bar attributes	
		bar.transition()
		  	.duration(animTime)
			.call(setBars);

		// Sets the length and offset of each bar, called on creation and update
		function setBars(selection) {
			selection
				.attr("height", function(d) { return ((d.value < 0) ? 0 : d.value) * qubitRadius })
				.attr("transform", function(d) {
					return (d.substate === "up") ? "translate(0, " + ((1 - d.value) * qubitRadius) + ")" : "";
				});
		}

	// --- ENTANGLEMENT --- //
	// Need to wait till here so have correct values
	// For some reason odd amounts of qubits put the whole thing off center

		// // console.log(qubits);
		// // console.log(qubits.selectAll(".qubit").indexOf());
		// // var stupidArray = qubits.selectAll(".qubit");
		// // stupidArray.forEach(function (qubit) {console.log(this);});
		// $(".qubit").each(function () {
		// 	$this = $(this);
		// 	// $this.data("entang", []);
		// 	console.log($this.index());
		// 	// 1 qb got me: 0
		// 	// 2 qb got me: 0 and 1
		// 	// 3 qb got me: 0, 1, and 3
		// 	// 4 qb got me: 0, 1, 2, and 4
		// 	// etc.
		// });

		// Make my own for loop because what is up with those index numbers?
		// Hope the qubits come in the right order to line up with the matrix,
		// probably won't know till later
		// Give the right starting matrix values for each qubit
		// Sure, this needs to be more dynamic later, we'll figure
		// it out then.
		for (var indx = 0; indx < $(".qubit").length; indx++) {
			var qbtMatrix = [];
			// Populate with enough 0's
			for (var indx2 = 0; indx2 < $(".qubit").length; indx2++) {
				qbtMatrix.push(0);
			}
			// Fill this qubit up with it's own ammount
			qbtMatrix[indx] = 100;
			$($(".qubit")[indx]).data("qbt-matrix", qbtMatrix);
			// console.log(qbtMatrix);
			// console.log($($(".qubit")[indx]).data("qbt-matrix"));
		}

		var matrix = [];
		for (var indx = 0; indx < $(".qubit").length; indx++) {
			matrix.push($($(".qubit")[indx]).data("qbt-matrix"));
		}

		var matrixRow = 0;
		// Let's try with d3 again
		d3.selectAll(".qubit").each(function (dat, indx) {
			// Assign an array to the qubit object without destroying
			// the previous data object (entang.js)
			d3.select(this).data()[0].entang = entang.createRow(indx, numQubits);
			
			console.log(d3.select(this).data()[0].entang);



			// d3.select(this).data([0123]); // console.log gets [83]
		});

		function createMatrix (dat, index) {}


		function createEntang () {
		// Need to wait till the qubits are done animating, animTime. How?
			// Ideally, if the diagram already exists, just transition it...
			// but for now, destroy the old one and make a new one
			$(".entang").remove();

			setTimeout(function () {
				var center = containerWidth/2 + ", " + (containerHeight + yOffset)/2;
				entang.createChord(matrix, arrangeRadius-qubitRadius, center);}
				, animTime);
		}

		if (numQubits > 1) {
			createEntang();
		}
		else {$(".entang").remove();}

	}  // end this.render()
}
