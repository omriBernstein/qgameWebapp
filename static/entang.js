/* 
* visualizer.js
* Created by: knod
* Date created: 04/20/14
* Uses d3 to visualize entanglement.
* 
* Currently just creates a chord diagram with arbitrary
* values with one alteration - the chords that go back
* to the parent are hidden (opacity 0). It doesn't even
* show up yet.
*/

var entang = {

	/* (Array of arrays of ints, num, str) -> None

	In future matrix should be passed in.

	Creates a chord diagram with the number of sections and
	chords provided in matrix. Chords that refer to their own
	section are given an opacity of 0.
	*/
	createChord: function (matrix, outerRadius, center) {
		// From http://bl.ocks.org/mbostock/4062006
		// From http://mkweb.bcgsc.ca/circos/guide/tables/
		var matrix = [
		  [100, 20, 0, 0],
		  [0, 100, 0, 0],
		  [0, 0, 100, 0],
		  [0, 0, 0, 100]
		];

		var chord = d3.layout.chord()
		    .padding(.05)
		    .sortSubgroups(d3.descending)
		    .matrix(matrix);

		// var width = 960,
		//     height = 500,
		//     innerRadius = Math.min(width, height) * .41,
		//     outerRadius = innerRadius * 1.1;

		var innerRadius = outerRadius/1.1;

		var fill = d3.scale.ordinal()
		    .domain(d3.range(4))
		    // .range(["#000000", "#FFDD89", "#957244", "#F26223"]);
		    .range(["#9986b3"]);

		svg = d3.select("#qubit-svg")
		  .append("g")
		  	.attr("class", "entang")
		    .attr("transform", "translate(" + center + ")");

		svg.append("g").selectAll("path")
		    .data(chord.groups)
		  .enter().append("path")
		    .style("fill", function(d) { return fill(d.index); })
		    .style("stroke", function(d) { return fill(d.index); })
		    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
		    .on("mouseover", fade(.1))
		    .on("mouseout", fade(1));

		// var ticks = svg.append("g").selectAll("g")
		//     .data(chord.groups)
		//   .enter().append("g").selectAll("g")
		//     .data(groupTicks)
		//   .enter().append("g")
		//     .attr("transform", function(d) {
		//       return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		//           + "translate(" + outerRadius + ",0)";
		//     });

		// ticks.append("line")
		//     .attr("x1", 1)
		//     .attr("y1", 0)
		//     .attr("x2", 5)
		//     .attr("y2", 0)
		//     .style("stroke", "#000");

		// ticks.append("text")
		//     .attr("x", 8)
		//     .attr("dy", ".35em")
		//     .attr("transform", function(d) { 
		//			return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
		//		})
		//     .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
		//     .text(function(d) { return d.label; });

		svg.append("g")
		    .attr("class", "chord")
		  .selectAll("path")
		    .data(chord.chords)
		  .enter().append("path")
		    .attr("d", d3.svg.chord().radius(innerRadius))
		    .style("fill", function(d) { return fill(d.target.index); })
		    .style("opacity", 1);

		// // Returns an array of tick angles and labels, given a group.
		// function groupTicks(d) {
		//   var k = (d.endAngle - d.startAngle) / d.value;
		//   return d3.range(0, d.value, 1000).map(function(v, i) {
		//     return {
		//       angle: v * k + d.startAngle,
		//       label: i % 5 ? null : v / 1000 + "k"
		//     };
		//   });
		// }

		// Returns an event handler for fading a given chord group.
		function fade(opacity) {
		  return function(g, i) {
		    svg.selectAll(".chord path")
		        .filter(function(d) { return d.source.index != i && d.target.index != i
		        	// Added by knod to keep own chords hidden (for qromp)
		        	&& d.target.index != d.target.subindex; })
		      .transition()
		        .style("opacity", opacity);
		  };
		}

		/* Custom code for qromp */
		// When everything else is done
		hideOwn();

		function hideOwn() {
			// Unless the path crosses to somewhere, it's opacity will be 0
			svg.selectAll(".chord path")
				// Get the paths whose index and subindex match
				// (the path is refering to its own section)
				.filter(function(dsomething) {
					return dsomething.target.index == dsomething.target.subindex;
				})
				.style("opacity", 0);
		}
	},

	/* (?) -> None

	Shoud handle the animation from one chord state to
	another, not sure how yet.
	*/
	transChord: function () {

	},

}