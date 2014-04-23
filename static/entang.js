/* 
* visualizer.js
* Created by: knod
* Date created: 04/20/14
* Uses d3 to visualize entanglement.
* 
* Sources:
* (1) http://bl.ocks.org/mbostock/4062006
* (2) http://mkweb.bcgsc.ca/circos/guide/tables/
* (3) http://stackoverflow.com/questions/21813723/change-and-transition-dataset-in-chord-diagram-with-d3
* 
* Currently just creates a chord diagram with arbitrary
* values with one alteration - the chords that go back
* to the parent are hidden (opacity 0). It doesn't even
* show up yet.
*/

var entang = {

	firstOuterRadius: null
	, animTime: null
	, arcForGroups: null
	, pathForChords: null
	, entangSVG: null


	/* (num, num, Array of Array of ints, int) -> None

	Creates a placeholder for the chord diagram centered at
	center with an outer radius of outerRadius, matrix values of
	matrix and assigns the animation time animTime passed to it.

	It gives values to a lot of the entang properties.

	It will start things off with a scale of 1 and adjustments will
	be made from using outerRadius to calculate the new scale.
	*/
	, initChord: function (center, outerRadius, entangMatrix, animTime) {

		// --- SETUP --- \\
		// *** All this stuff will only be calculated once
		// * Establishing object variables
		// This will be used to get the scale in future when there
		// are new outer radii
		entang.firstOuterRadius = outerRadius;
		entang.animTime = animTime;
		// * This is used to establish the next object variable
		var innerRadius = outerRadius/1.1;
		// *** These initial values will only be calculated once,
		// but later on the function will be used.
		// Why make a function not look like a function? I don't know.
		// * Still establishing object variables
		// It's a pain that this doesn't look like a function, but later
		// looks like a function later, but I think it's just changing
		// values.
		// Sources (3): create the arc path data generator for the groups
		// What are the groups? There are lots of groups! Are these groups
		// of bridges? Or sections around the circle? What?
		entang.arcForGroups = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);

		// Sources (3): create the chord path data generator for the chords
		// What are we calling chords? Seen chord used for different things
		entang.pathForChords = d3.svg.chord()
		    .radius(innerRadius)
	    ;

	    // Rotate the diagram to line it up with the qubits
		var rotation = -(360/matrix.length)/2;

		// Place the element that will have the diagram
	    entang.entangSVG = d3.select("#qubit-svg")
			.append("g")
				// Unique class for scaling the size of the whole thing
				.attr("class", "entang")
				.attr("transform", "translate(" + center + ") rotate(" + rotation + ")")
		;

		// Call the function that will animate the diagram's appearance
		entang.updateChord(center, outerRadius, matrix);
	}

	/* (num, num, Array of Arrays of ints) -> None

	Handles animating the creation of and changes to the chord
	diagram. Uses newCenter to animate the move to the new
	centerpoint (I hope), newRadius (and entang.firstOuterRadius)
	to get the new scale of the object
	(scale = newRadius/entang.outerRadius; perhaps?), and
	newEntangMatrix to move the various paths to correct locations.
	*/
	, updateChord: function (newCenter, newRadius, newEntangMatrix) {

		// *** SETUP *** \\
		// Bring some things (that will be used repeatedly) into scope
		var animTime = entang.animTime
			, scale = newRadius/entang.outerRadius
			, arcForGroups = entang.arcForGroups
			, pathForChords = entang.pathForChords
			, entangSVG = entang.entangSVG
		;

		// This is just for testing purposes
		var newEntangMatrix = newEntangMatrix || 
			[
			  [100, 20, 30, 0],
			  [20, 100, 0, 0],
			  [30, 0, 100, 0],
			  [0, 0, 0, 0],
			]
		;

		// I'm not sure why this isn't just an array, but afraid to change
		var entangColors = d3.scale.ordinal()
			.domain(d3.range(4))
			.range(["#9986b3", "red", "green", "blue"])
		;

		// Make and store a new layout.chord() with the new matrix that
		// we'll transition to (from oldLayoutChord)
		var newLayoutChord = newChord(newEntangMatrix);


		// At the very end, since I don't know where else to put it that
		// it won't get overriden, animate the size change

	}

	/* (Array of Arrays of ints) -> None

	Creates a new chord layout with matrix as it's
	matrix.
	Just breaking things up in to smaller chunks
	*/
	, newChord: function (matrix) {
		return d3.layout.chord()
			// padding between sections
			.padding(0.03)
			.sortSubgroups(d3.descending)
			.sortChords(d3.ascending)
			.matrix(matrix)
		;

	}

	/* (num) -> No idea

	Uses a number between 0 and 1 (opacity) to animate the fading
	out (or in) the filtered paths. I don't know what kind of thing
	it returns.
	*/
	, fade: function (opacity) {
	  return function(g, indx) {
	    svg.selectAll(".chord path")
	        .filter(function(dat) { return dat.source.index != indx && dat.target.index != indx
	        	// Added by knod to keep own chords hidden (for qromp)
	        	&& dat.target.index != dat.target.subindex; })
	      .transition()
	        .style("opacity", opacity);
	  };
	}

	/* Custom code for qromp */
	/* (None) -> None

	Hides non-pairwise paths - paths that don't make a bridge
	between one section or another. I'm not sure how else to do
	this, so I've just decided to put a barnacle on this ship.
	*/
	, hideOwn: function () {
		// Unless the path crosses to somewhere, it's opacity will be 0
		svg.selectAll(".chord path")
			// Get the paths whose index and subindex match
			// (the path is refering to its own section)
			.filter(function (dat) {
				return dat.target.index == dat.target.subindex;
			})
			.style("opacity", 0);
	}

	// /* (int, int) -> array of ints

	// Create one row of the matrix for the qubit
	// */
	// createRow: function (indx, numQubits) {

	// 	// Make one array for reach qubit with the right number of 0's
	// 	var newRow = [];
	// 	for (var indx2 = 0; indx2 < numQubits; indx2++) {
	// 		newRow.push(0);
	// 	}
	// 	// Give it some starting value for itself
	// 	newRow[indx] = 100;

	// 	return newRow;
	// },

	// /* 

	// Create the initial matrix for the qubits
	// */

	// /* (Array of arrays of ints, num, str) -> None

	// In future matrix should be passed in.

	// Creates a chord diagram with the number of sections and
	// chords provided in matrix. Chords that refer to their own
	// section are given an opacity of 0.
	// */
	// createChord: function (matrix, outerRadius, center) {
	// 	// From http://bl.ocks.org/mbostock/4062006
	// 	// From http://mkweb.bcgsc.ca/circos/guide/tables/
	// 	var matrix = matrix || [
	// 	  [100, 20, 0, 0],
	// 	  [0, 100, 0, 0],
	// 	  [0, 0, 100, 0],
	// 	  [0, 0, 0, 100]
	// 	];

	// 	var rotation = -(360/matrix.length)/2;

	// 	var chord = d3.layout.chord()
	// 	    .padding(.05)
	// 	    .sortSubgroups(d3.descending)
	// 	    .matrix(matrix);

	// 	// var width = 960,
	// 	//     height = 500,
	// 	//     innerRadius = Math.min(width, height) * .41,
	// 	//     outerRadius = innerRadius * 1.1;

	// 	var innerRadius = outerRadius/1.1;

	// 	var fill = d3.scale.ordinal()
	// 	    .domain(d3.range(4))
	// 	    // .range(["#000000", "#FFDD89", "#957244", "#F26223"]);
	// 	    .range(["#9986b3", "red", "green", "blue"]);

	// 	svg = d3.select("#qubit-svg")
	// 	  .append("g")
	// 	  	.attr("class", "entang")
	// 	    .attr("transform", "translate(" + center + ") rotate(" + rotation + ")");

	// 	svg.append("g").selectAll("path")
	// 	    .data(chord.groups)
	// 	  .enter().append("path")
	// 	    .style("fill", function(d) { return fill(d.index); })
	// 	    .style("stroke", function(d) { return fill(d.index); })
	// 	    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
	// 	    .on("mouseover", fade(.1))
	// 	    .on("mouseout", fade(1));

	// 	// var ticks = svg.append("g").selectAll("g")
	// 	//     .data(chord.groups)
	// 	//   .enter().append("g").selectAll("g")
	// 	//     .data(groupTicks)
	// 	//   .enter().append("g")
	// 	//     .attr("transform", function(d) {
	// 	//       return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
	// 	//           + "translate(" + outerRadius + ",0)";
	// 	//     });

	// 	// ticks.append("line")
	// 	//     .attr("x1", 1)
	// 	//     .attr("y1", 0)
	// 	//     .attr("x2", 5)
	// 	//     .attr("y2", 0)
	// 	//     .style("stroke", "#000");

	// 	// ticks.append("text")
	// 	//     .attr("x", 8)
	// 	//     .attr("dy", ".35em")
	// 	//     .attr("transform", function(d) { 
	// 	//			return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
	// 	//		})
	// 	//     .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	// 	//     .text(function(d) { return d.label; });

	// 	svg.append("g")
	// 	    .attr("class", "chord")
	// 	  .selectAll("path")
	// 	    .data(chord.chords)
	// 	  .enter().append("path")
	// 	    .attr("d", d3.svg.chord().radius(innerRadius))
	// 	    .style("fill", function(d) { return fill(d.target.index); })
	// 	    .style("opacity", 1);

	// 	// // Returns an array of tick angles and labels, given a group.
	// 	// function groupTicks(d) {
	// 	//   var k = (d.endAngle - d.startAngle) / d.value;
	// 	//   return d3.range(0, d.value, 1000).map(function(v, i) {
	// 	//     return {
	// 	//       angle: v * k + d.startAngle,
	// 	//       label: i % 5 ? null : v / 1000 + "k"
	// 	//     };
	// 	//   });
	// 	// }

	// 	// Returns an event handler for fading a given chord group.
	// 	function fade(opacity) {
	// 	  return function(g, indx) {
	// 	    svg.selectAll(".chord path")
	// 	        .filter(function(dat) { return dat.source.index != indx && dat.target.index != indx
	// 	        	// Added by knod to keep own chords hidden (for qromp)
	// 	        	&& dat.target.index != dat.target.subindex; })
	// 	      .transition()
	// 	        .style("opacity", opacity);
	// 	  };
	// 	}

	// // 	/* Custom code for qromp */

	// 	function hideOwn() {
	// 		// Unless the path crosses to somewhere, it's opacity will be 0
	// 		svg.selectAll(".chord path")
	// 			// Get the paths whose index and subindex match
	// 			// (the path is refering to its own section)
	// 			.filter(function (dat) {
	// 				return dat.target.index == dat.target.subindex;
	// 			})
	// 			.style("opacity", 0);
	// 	}
	// },

	// /* (?) -> None

	// Shoud handle the animation from one chord state to
	// another, not sure how yet.
	// */
	// transChord: function () {

	// },

}
