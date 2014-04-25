/* 
* visualizer.js
* Created by: knod
* Date created: 04/20/14
* Uses d3 to visualize entanglement.
* 
* Sources:
* (1) http://bl.ocks.org/mbostock/4062006
* (2) http://fleetinbeing.net/d3e/chord.html
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
	, oldLayoutChord: null

	// Just for testing
	/* (int, int) -> array of ints

	Create one row of the matrix for the qubit
	*/
	, createRow: function (indx, numQubits) {

		// Make one array for reach qubit with the right number of 0's
		var newRow = [];
		for (var indx2 = 0; indx2 < numQubits; indx2++) {
			newRow.push(0);
		}
		// Give it some starting value for itself
		newRow[indx] = 100;

		return newRow;
	}

	/* (int) -> Array of Arrays of ints

	Creates a matrix of numQubits size with no pair-wise paths
	*/
	, newFullEntangMatrix: function (numQubits) {
		var newMatrix = [], newRow = [];
		// Every row is the same, filled with the right number of 1's
		for (var indx = 0; indx < numQubits; indx++) {newRow.push(1);}
		// Fill the matrix with the right number of those rows
		for (var indx = 0; indx < numQubits; indx++) {newMatrix.push(newRow);}
		return newMatrix;
	}

// !!! This only takes care of entanglement that shows that things
// when they can be fully entangled. !!!
// Should there be separate functions for updating outer sections and
// connecting paths?

	/* (str, num, Array of Array of ints, int) -> None

	Creates a placeholder for the chord diagram centered at center
	("num, num") with an outer radius of firstOuterRadius, matrix
	values of entangMatrix and assigns the animation time animTime
	passed to it.

	It gives values to a lot of the entang properties.

	It will start things off with a scale of 1 and adjustments will
	be made from using outerRadius to calculate the new scale.
	*/
	, initChord: function (center, firstOuterRadius, entangMatrix, animTime) {

		// --- SETUP --- \\
		// *** All this stuff will only be calculated once
		// * Establishing object variables
		// This will be used to get the scale in future when there
		// are new outer radii
		entang.firstOuterRadius = firstOuterRadius;
		entang.animTime = animTime;
		// * This is used to establish the next object variable
		var innerRadius = firstOuterRadius/1.1;
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
			.outerRadius(firstOuterRadius);

		// Sources (3): create the chord path data generator for the chords
		// What are we calling chords? Seen chord used for different things
		entang.pathForChords = d3.svg.chord()
		    .radius(innerRadius)
	    ;

		// This is just for testing purposes
		var entangMatrix = entangMatrix || 
			[
			  [100, 20, 30],
			  [20, 130, 0],
			  [30, 0, 120],
			]
		;

	    // Rotate the diagram to line it up with the qubits
		var rotation = -(360/entangMatrix.length)/2;
		;

	// *** PARTIAL ENTANGLEMENT (this one has paths) *** \\
		// Place the element that will have the diagram
	    entang.entangSVG = d3.select("#qubit-svg")
			.append("g")
				// Unique class for scaling the size of the whole thing
				.attr("class", "entang part-entang")
				.attr("transform", "translate(" + center + ") rotate(" + rotation + ")")
		;

	// *** FULL ENTANGLEMENT OUTLINE (no paths) *** \\
		// Place the element that will have the diagram
	    entang.entangSVG = d3.select("#qubit-svg")
			.append("g")
				// Unique class for scaling the size of the whole thing
				.attr("class", "entang full-entang")
				.attr("transform", "translate(" + center + ") rotate(" + rotation + ")")

		// Call the function that will animate the diagram's appearance
		entang.updateChord(center, firstOuterRadius, entangMatrix);
	}

	/* (str, num, Array of Arrays of ints) -> None

	Handles animating the creation of and changes to the chord
	diagram. Uses newCenter ("num, num") to animate the move to the new
	centerpoint (I hope), newRadius (and entang.firstOuterRadius)
	to get the new scale of the object, and newEntangMatrix to move
	the various paths to correct locations.
	*/
	, updateChord: function (newCenter, newRadius, newEntangMatrix) {
		// *** SETUP *** \\

		// Temp for testing
		var newEntangMatrix = newEntangMatrix || 
			[
			  [100, 20, 30],
			  [20, 130, 0],
			  [30, 0, 120],
			]
		;
		center = newCenter
		radius = newRadius
		/* To put in inspector once chord dia. is visible (test)
		matrix = [[100, 0, 10, 30], [0, 100, 30, 10],
		  [10, 30, 100, 0], [0, 10, 30, 100],]
		entang.updateChord(center, radius, matrix)*/
		// end testing

		// To rotate the diagram to line it up with the qubits
		var rotation = -(360/newEntangMatrix.length)/2
			, scale = newRadius/entang.firstOuterRadius
		;

		// Bring some things (that will be used repeatedly) into scope
		var animTime = entang.animTime
			, arcForGroups = entang.arcForGroups
			, pathForChords = entang.pathForChords
			, entangSVG = entang.entangSVG
			, oldLayoutChord = entang.oldLayoutChord
		;

		// I'm not sure why this isn't just an array, but afraid to change
		var entangColors = d3.scale.ordinal()
			.domain(d3.range(4))
			.range(["#9986b3", "red", "green", "blue"])
		;

	// *** FULL ENTANGLEMENT *** \\
		var newFullMatrix = entang.newFullEntangMatrix(newEntangMatrix.length);
		var newFullEntangLayout = entang.newChord(newFullMatrix);

	// *** PARTIAL ENTANGLEMENT *** \\
		// Make and store a new layout.chord() with the new matrix that
		// we'll transition to (from oldLayoutChord)
		var newLayoutChord = entang.newChord(newEntangMatrix, 0.5);

		// --- SOURCES (3) --- \\
		// *** GROUPS(?), creation, exit (removal), entrance (added), animation *** \\
		// I don't really understand this. And what's considered a group?
		// ~~~ Changed some names among other things
		/* Create/update "group" elements */
		var groupG = entangSVG.selectAll("g.group")
			.data(newLayoutChord.groups(), function (d) {
				return d.index; 
				//use a key function in case the 
				//groups are sorted differently between updates
		});

		// ~~~ When groupG is destroyed? Or perhaps when data of groupG
		// is taken out?
		groupG.exit()
			.transition()
				.duration(animTime)
				.attr("opacity", 0)
				.remove(); //remove after transitions are complete

		// ~~~ When new data is added, add a new element with the same
		// class
		var newGroups = groupG.enter().append("g")
			.attr("class", "group");
		//the enter selection is stored in a variable so we can
		//enter the <path>, <text>, and <title> elements as well
		// ~~~ (qromp skips this part, wouldn't work as our labels)

		//create the arc paths and set the constant attributes
		//(those based on the group index, not on the value)
		// ~~ id's and colors
		newGroups.append("path")
			.attr("id", function (d) {
				return "group" + d.index;
				//using d.index and not i to maintain consistency
				//even if groups are sorted
			})
			// ~~~ qromp color versions
			.style("fill", function(d) { return entangColors(d.index); })
			.style("stroke", function(d) { return entangColors(d.index); })
			;

		//update the paths to match the layout
		// ~~~ Got rid of opacity change to uncomplicate the hide stuff
		groupG.select("path") 
			.transition()
				.duration(animTime)
			// ~~~ arcTween is homemade in here
			.attrTween("d", entang.arcTween( oldLayoutChord ))
			;

		// ~~~ Skip ticks/labels

		// *** CHORD PATHS, creation, entrance, exit, animation *** \\
		// *** Also event handler for fading *** \\

		/* Create/update the chord paths */
		var chordPaths = entangSVG.selectAll("path.chord")
			// ~~~ I don't understand what this does
			.data(newLayoutChord.chords(), entang.chordKey );
				//specify a key function to match chords
				//between updates

		//create the new chord paths
		var newChords = chordPaths.enter()
			.append("path")
			.attr("class", "chord");

		//handle exiting paths:

		chordPaths.exit().transition()
			.duration(animTime)
			.attr("opacity", 0)
			.remove();

		// Can't get this function to work. Wanted to remove repetition.
		// chordPaths.exit().call(removeElements(this));

		// function removeElements (thisElement) {
		// 	console.log(thisElement);
		// 	thisElement.transition()
		// 	// Uncaught TypeError: undefined is not a function
		// 		.duration(animTime)
		// 		.attr("opacity", 0)
		// 		.remove(); //remove after transitions are complete
		// }

		// ~~~ Hide stuff here instead? Need to test.
		entang.hideOwn();

// ~~~ !!! This is what's causing the black in the transition somehow !!!
		//update the path shape
		chordPaths.transition()
			.duration(animTime)
			// ~~~ Changing the colors here doesn't fix the black
			.style("fill", function(d) { return entangColors(d.source.index); })
			.style("stroke", function(d) { return entangColors(d.source.index); })
			.attrTween("d", entang.chordTween( oldLayoutChord ))
		;

		// *** EVENT HANDLERS *** \\
// ~~~ !!! Make this not in a function in future !!!
		//add the mouseover/fade out behaviour to the groups
		//this is reset on every update, so it will use the latest
		//chordPaths selection
		// ~~~ Our own version of fade, theirs was too complex
		// ~~~ Could possibly do the whole thing in CSS?
		groupG.on("mouseover", entang.fade(.1))
			.on("mouseout", entang.fade(1))
		;

		// ~~~ At the very end, since I don't know where else to put it that
		// ~~~ it won't get overriden, animate the size and pos change
		d3.selectAll(".entang")
			.transition()
			.duration(animTime)
			.attr("transform", "translate(" + newCenter
				+ ") rotate(" + rotation
				+ ") scale(" + scale + ")")
			;

		entang.oldLayoutChord = newLayoutChord; //save for next update

		// --- END SOURCES (3) --- \\

// For hide, maybe on the fill function use a filter to hide stuff then?
	}  // end updateChord()

	/* (Array of Arrays of ints) -> None

	Creates a new chord layout with matrix as it's
	matrix.
	Just breaking things up in to smaller chunks
	*/
	, newChord: function (matrix, arcPadding) {
		var arcPadding = arcPadding || 0.03;
		return d3.layout.chord()
			// padding between sections
			.padding(arcPadding)
			.sortSubgroups(d3.descending)
			.sortChords(d3.ascending)
			.matrix(matrix)
		;
	}

	// ~~~ Sources (3)
	, arcTween: function (oldLayout) {
	    //this function will be called once per update cycle
	    
	    //Create a key:value version of the old layout's groups array
	    //so we can easily find the matching group 
	    //even if the group index values don't match the array index
	    //(because of sorting)
	    var oldGroups = {};
	    if (oldLayout) {
	        oldLayout.groups().forEach( function(groupData) {
	            oldGroups[ groupData.index ] = groupData;
	        });
	    }
	    
	    return function (d, i) {
	        var tween;
	        var old = oldGroups[d.index];
	        if (old) { //there's a matching old group
	            tween = d3.interpolate(old, d);
	        }
	        else {
	            //create a zero-width arc object
	            var emptyArc = {startAngle:d.startAngle,
	                            endAngle:d.startAngle};
	            tween = d3.interpolate(emptyArc, d);
	        }
	        
	        return function (t) {
	            return entang.arcForGroups( tween(t) );
	        };
	    };
	}  // end arcTween()

	, chordKey: function (data) {
	    return (data.source.index < data.target.index) ?
	        data.source.index  + "-" + data.target.index:
	        data.target.index  + "-" + data.source.index;
	    
	    //create a key that will represent the relationship
	    //between these two groups *regardless*
	    //of which group is called 'source' and which 'target'
	}

	, chordTween: function (oldLayout) {
	    //this function will be called once per update cycle
	    
	    //Create a key:value version of the old layout's chords array
	    //so we can easily find the matching chord 
	    //(which may not have a matching index)
	    
	    var oldChords = {};
	    
	    if (oldLayout) {
	        oldLayout.chords().forEach( function(chordData) {
	            oldChords[ entang.chordKey(chordData) ] = chordData;
	        });
	    }
	    
	    return function (d, i) {
	        //this function will be called for each active chord
	        
	        var tween;
	        var old = oldChords[ entang.chordKey(d) ];
	        if (old) {
	            //old is not undefined, i.e.
	            //there is a matching old chord value
	            
	            //check whether source and target have been switched:
	            if (d.source.index != old.source.index ){
	                //swap source and target to match the new data
	                old = {
	                    source: old.target,
	                    target: old.source
	                };
	            }
	            
	            tween = d3.interpolate(old, d);
	        }
	        else {
	            //create a zero-width chord object
	            var emptyChord = {
	                source: { startAngle: d.source.startAngle,
	                         endAngle: d.source.startAngle},
	                target: { startAngle: d.target.startAngle,
	                         endAngle: d.target.startAngle}
	            };
	            tween = d3.interpolate( emptyChord, d );
	        }

	        return function (t) {
	            //this function calculates the intermediary shapes
	            return entang.pathForChords(tween(t));
	        };
	    };
	}  // end chordTween()

	// ~~~ end Sources (3)

	/* (num) -> No idea

	Uses a number between 0 and 1 (opacity) to animate the fading
	out (or in) the filtered paths. I don't know what kind of thing
	it returns. Sources (1) (I think says "Returns an event handler
	for fading a given chord group.")
	*/
	, fade: function (opacity) {
	  return function(g, indx) {
	    d3.selectAll(".chord")
	        .filter(function(dat) {
	        	return dat.source.index != indx && dat.target.index != indx
	        	// Added by knod to keep own chords hidden (for qromp)
	        	&& dat.target.index != dat.target.subindex; 
	        })
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
		d3.selectAll(".chord")
			// Get the paths whose index and subindex match
			// (the path is refering to its own section)
			.filter(function (dat) {
				return dat.target.index == dat.target.subindex;
			})
			.style("opacity", 0);
	}
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

// }
