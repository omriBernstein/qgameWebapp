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
* Notes:
* - Creates a chord diagram that animates when changed and shows the
* difference between potential entanglement and full entanglement (I think)
* (or at least it has potential to once values are plugged in dynamically)
* - I think because of the order this puts the connections in,
* there are straight lines going across the middle sometimes.
* I'm not sure how, but I believe adjusting the indexes somehow
* will fix it (it can't just be shifted one spot over)
* - Maybe how to give chord data custom properties:
* jsl6906		before line 29 you can do: var chordData =
* newPartLayout.chords().forEach(function(d) { //assign d.something; }));
* (I think: d.something = otherthing)
*/

var entang = {

	firstOuterRadius: null
	, animTime: null
	// , arcForGroups: null
	// , pathForChords: null
	, fullEntangElem: null
	, partEntangElem: null
	, oldFullLayout: null
	, oldPartLayout: null

	/* (int) -> Array of Arrays of ints

	Creates a matrix with numQubits arrays filled with numQubit values,
	all equal to each other.
	*/
	, newFullEntangMatrix: function (numQubits) {
		var newMatrix = [], newRow = [];
		// Every row is the same, filled with the right number of 1's
		for (var indx = 0; indx < numQubits; indx++) {newRow.push(1);}
		// Fill the matrix with the right number of those rows
		for (var indx = 0; indx < numQubits; indx++) {newMatrix.push(newRow);}
		return newMatrix;
	}

	/* (int) -> Array of ints

	Creates an array of length numQubits all filled with the number
	denoted by padding (to keep info format consistent for setupChords()).
	*/
	, setupFullPadding: function (numQubits, padding) {
		var paddingArray = []
		for (var indx = 0; indx < numQubits; indx++) {paddingArray.push(padding);}
		return paddingArray;
	}

	/* (str) -> d3 element?

	Adds a chord to the svg element. This is very specific to the current
	setup, not very general
	*/
	, attachChord: function (classNames, center, rotation) {
		return d3.select("#qubit-svg")
			.append("g")
				// Unique class for scaling the size of the whole thing
				.attr("class", classNames)
				.attr("transform", "translate(" + center
					+ ") rotate(" + rotation + ")"
				)
		;
	}

	/* (d3 collection?) -> None

	Update (and animate?) removal of elements. Can this be
	outside of update?
	*/
	, removeElems: function (groupOfElems) {
		groupOfElems.exit()
			.transition()
				.duration(entang.animTime)
				.attr("opacity", 0)
				.remove(); //remove after transitions are complete
	}

	/* (str, num, int) -> None

	Creates a placeholder for the chord diagram centered at center
	("num, num") with an outer radius of firstOuterRadius, and assigns
	the animation time animTime passed to it. (After this, the script
	calling this will call the update function pasing it the matrix)

	It gives values to a some of the entang properties.

	It will start things off with a scale of 1 and adjustments will
	be made from using outerRadius to calculate the new scale.
	*/
	, initChord: function (center, firstOuterRadius, animTime) {
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
		entang.pathForChords = d3.svg.chord().radius(innerRadius);

	// *** PARTIAL ENTANGLEMENT (this one has paths) *** \\
		// Element that will show partial entanglement and the "bridges"/chords
		entang.partEntangElem = entang.attachChord("entang part-entang", center, 0);

	// *** FULL ENTANGLEMENT OUTLINE (no paths) *** \\
		// Element that will show full entanglement. On top for debugging visibility
		entang.fullEntangElem = entang.attachChord("entang full-entang", center, 0);
	}  // end initChord()

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
		// end testing

		// Bring some things (that will be used repeatedly) into scope
		var animTime = entang.animTime
			, fullEntangElem = entang.fullEntangElem
			, partEntangElem = entang.partEntangElem
		;

		var newNumQubits = newEntangMatrix.length
			// Padding between the full entanglement arcs
			, fullPadding = newNumQubits/(newNumQubits/0.5)
			// // Turn that into an array so setupChords() can process it
			, fullPadArray = entang.setupFullPadding(newNumQubits, fullPadding)
			// Radians of the outlined part of the full entang arcs
			// (to get a percentage from for the partial entang arcs)
			, fullArcRad = (2 * Math.PI)/newNumQubits - fullPadding
			// To help calculate rotation, which is given in degrees
			, fullPaddingDeg = fullPadding * (180/Math.PI);

		// To rotate the diagram to line it up with the qubits
		var rotation = -(360/newNumQubits - fullPaddingDeg)/2
			// Size of diagram so it's relative to qubits
			, scale = newRadius/entang.firstOuterRadius
		;

		// Color for potential and full entanglement arcs(/groups?)
		var partArcColor = "#9986b3";
		var fullArcFill = "none", fullArcStroke = "gray";
		// An array of colors for bridges/chords
		var bridgeColors = ["#9986b3", "red", "green", "blue", "purple", "pink"];


	// *** FULL ENTANGLEMENT *** \\
		updateFull();

		function updateFull () {
			var newFullMatrix = entang.newFullEntangMatrix(newNumQubits);
			// (need this var later)
			var newFullLayout = entang.setupChords(newFullMatrix, fullPadArray);

			// Container's new elements: create data. Also get all elements?
			var groupG = fullEntangElem.selectAll(".full-entang .group")
				//use a key function in case the groups are
				// sorted differently between updates
				.data(newFullLayout.groups(), function (d) {return d.index;});

			// Animate removal of paths
			entang.removeElems(groupG);

			// Add new top-level items with class
			var newGroups = groupG.enter().append("g").attr("class", "group");
			// Add next-level items with index id
			newGroups.append("path");
			// Color paths
			newGroups.style("fill", fullArcFill)
				.style("stroke", fullArcStroke);

			// Animate addition of paths
			groupG.select("path").transition()  // groupOfArcs.transition() works too
					.duration(animTime)
				.attrTween("d", entang.arcTween( entang.oldFullLayout ))
			;

			entang.oldFullLayout = newFullLayout; //save for next update
		}  // end updateFull()

	// *** PARTIAL ENTANGLEMENT *** \\
		updatePart();

		function updatePart () {
			// Make and store a new layout.chord() with the new matrix that
			// we'll transition to (from oldPartLayout) (need this var later)
			// This is a test amount - it is meant to be a percentage
			// Percent entanglement potential that is unavailable to the qubit
			var percentCantEntang = 0.1;
			var cantEntangRad = (percentCantEntang * fullArcRad) + fullPadding;
			var cantEntangArray = entang.setupFullPadding(newNumQubits, cantEntangRad);
			cantEntangArray[1] += 0.5;
			var newPartLayout = entang.setupChords(newEntangMatrix, cantEntangArray);

		// *** GROUPS(?), creation *** \\
			// Container's new elements: create data. Also get all elements?
			var groupG = partEntangElem.selectAll(".part-entang .group")
				//use a key function in case the groups are
				// sorted differently between updates
				.data(newPartLayout.groups(), function (d) {return d.index;});

			// Animate removal of paths
			entang.removeElems(groupG);

			// Add new top-level items with class
			var newGroups = groupG.enter().append("g").attr("class", "group");

			// Add next-level items with index id
			newGroups.append("path");
			// Color paths
			newGroups.style("fill", partArcColor)
				.style("stroke", partArcColor);

			// Animate addition of paths
			groupG.select("path").transition()  // groupOfArcs.transition() works too
					.duration(animTime)
				.attrTween("d", entang.arcTween( entang.oldPartLayout ))
			;

		// *** CHORD PATHS, creation, entrance, exit, animation *** \\
			// Container's new elements: create data. Also get all elements?
			var chordPaths = partEntangElem.selectAll("path.chord")
				// I don't understand what this does
				.data(newPartLayout.chords(), entang.chordKey );

			// Animate removal of paths
			entang.removeElems(chordPaths);

			// Add new top-level items with class
			var newChords = chordPaths.enter().append("path").attr("class", "chord");

			// Color paths - changing the colors before anim fixes the black!
			chordPaths
				.style("fill", function(dat) {return bridgeColors[(dat.target.index * 10 + dat.target.subindex) % 6]; })
				.style("stroke", function(dat) {return bridgeColors[(dat.target.index * 10 + dat.target.subindex) % 6]; })
				// Hide the paths that don't go anywhere (blank space
				// to indicate un-entangled area)
				.filter(function (dat) {return dat.target.index == dat.target.subindex;})
					.style("opacity", 0)
			;

			// Animate addition/shape change of paths
			chordPaths.transition()
				.duration(animTime)
				.attrTween("d", entang.chordTween( entang.oldPartLayout ))
			;

			entang.oldPartLayout = newPartLayout; //save for next update
		}  // end updatePart()

	// *** Final Size Change *** \\
		// At the very end, since I don't know where else to put it that
		// it won't get overriden, animate the size and pos change
		d3.selectAll(".entang")
			.transition()
			.duration(animTime)
			.attr("transform", "translate(" + newCenter
				+ ") rotate(" + rotation
				+ ") scale(" + scale + ")")
			;

		// *** EVENT HANDLERS *** \\
		//add the mouseover/fade out behaviour to the groups
		//this is reset on every update, so it will use the latest
		//chordPaths selection
		// The previous example's version of fade, theirs was too complex
		// partEntangElem.selectAll(".part-entang .group") takes a while to
		// have the correct values
		partEntangElem.selectAll(".part-entang .group").on("mouseover", entang.fade(.1))
			.on("mouseout", entang.fade(1))
		;
	}  // end updateChord()

	/* (Array of Arrays of ints) -> None

	Creates a new chord layout with matrix as it's
	matrix.
	Just breaking things up in to smaller chunks
	*/
	, setupChords: function (matrix, arcPadding) {
		var arcPadding = arcPadding || 1;
		return d3.layout.chord()
			// padding between sections
			.padding(arcPadding)
			.sortSubgroups(d3.descending)
			.sortChords(d3.ascending)
			.matrix(matrix)
		;
	}

	// Sources (3)
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
	    //create a key that will represent the relationship
	    //between these two groups *regardless*
	    //of which group is called 'source' and which 'target'
	    return (data.source.index < data.target.index) ?
	        data.source.index  + "-" + data.target.index:
	        data.target.index  + "-" + data.source.index;
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
}


/* Compare update procedures for arcs vs. bridges
// (easier to see when in color)
// --- Both --- \\
// Container's new elements: create data. Also get all elements?
// Animate removal of paths
// Add new top-level items with class
// (Add next-level items with index id not included, that's just for Arcs)
// Color paths
// Animate transition of paths (addition and, if needed, shape change)

// --- Arcs --- \\
// Specific vars needed:
// - Collection of arcs in group (groupG)
// - Div that has arc groups (partEntangElem)
// - Selectors to select just the arcs (".part-entang .group")
// - layout.chord() established for these arcs (newPartLayout)
// - What to get from teh layout.chord() (.groups())
// - How to create the index (function (d) {return d.index;})

// - Collection of new arcs (newGroups)
// - Class for new arcs ("group")

// - id starter to append to paths in the new arcs ("part-group")
	// not sure of it's function, don't think it's needed for qromp

// - Colors for fill and stroke (partArcColor, partArcColor) or ("none", "black")
// - Animation Time (animTime)

// - Previous layout.chord()

// Container's new elements: create data. Also get all elements?
var groupG = partEntangElem.selectAll(".part-entang .group")  // this is groupG
				//use a key function in case the groups are
				// sorted differently between updates
				.data(newPartLayout.groups(), function (d) {return d.index;});

// Animate removal of paths
removeElems(groupG);

// Add new top-level items with class
var newGroups = groupG.enter().append("g").attr("class", "group");

// Add next-level items with index id
newGroups.append("path")
				// //using dat.index and not i to maintain consistency
				// //even if groups are sorted (knod: huh?
				// // not sure of it's function, don't think it's needed for qromp
				// .attr("id", function (dat) {return "part-group" + dat.index;})
				;

// Color paths
// newGroups.select("path") works too (this may be because all colored the same)
newGroups.style("fill", partArcColor)
				.style("stroke", partArcColor)
			;

// Animate addition of paths
groupG.select("path").transition()  // groupG.transition() works too
					.duration(animTime)
				.attrTween("d", entang.arcTween( oldPartLayout ))
			;

// --- Bridges --- \\
// Specific vars needed:
// - Collection of bridges in group (chordPaths)
// - Div that has bridge groups (partEntangElem)
// - Selectors to select just the bridges ("path.chord")
// - layout.chord() established for these bridges (newPartLayout)
// - What to get from teh layout.chord() (.chords())
// - How to create the index (entang.chordKey)

// - Collection of new bridges (newChords)
// - *Class* to append to bridges ("chord")

// - Colors for fill and stroke (partArcColor, partArcColor) or ("none", "black")
// - Animation Time (animTime)

// Container's new elements: create data. Also get all elements?
var chordPaths = partEntangElem.selectAll("path.chord")
				// I don't understand what this does
				.data( newPartLayout.chords(), entang.chordKey );

// Animate removal of paths
removeElems(chordPaths);

// Add new top-level items with class
var newChords = chordPaths.enter().append("path").attr("class", "chord");

// Color paths
chordPaths
				// Changing the colors here doesn't fix the black
				.style("fill", function(d) { return bridgeColors[d.source.index]; })
				.style("stroke", function(d) { return bridgeColors[d.source.index]; })

// Animate addition/shape change of paths
chordPaths.transition()
				.duration(animTime)
				.attrTween("d", entang.chordTween( oldPartLayout ))
			;
		}
*/

/* For testing (Not really robust enough to be considered a testing suite)
Create a matrix:
var numQubits = 10;
var xx = [];
var row = [];
for (var indx = 0; indx < numQubits; indx ++) {
	for (var indx2 = 0; indx2 < numQubits; indx2 ++) {
		row.push(Math.round(Math.random() * 100));
	}
	console.log(row);
	xx.push(row);
	row = []
}
console.log("matrix: " + xx);

To put in inspector once chord dia. is visible (test):
Test 1:
matrix = [[100, 50, 10, 30],
	[50, 200, 30, 10],
  	[10, 30, 500, 0],
  	[0, 10, 30, 70]]
entang.updateChord(center, radius, matrix)

Test 2:
matrix = [[100, 10, 30],
	[10, 130, 0],
	[30, 0, 120]]
entang.updateChord(center, radius, matrix)

Test 3
// console.log("[65, 2, 61, 54, 66, 51, 45, 59, 22, 2]" + ((65+2+61+54+66+51+45+59+22+2)-520));
// console.log("[51, 52, 74, 98, 35, 41, 29, 28, 99, 28]" + ((51+52+74+98+35+41+29+28+99+28)-520));
// console.log("[64, 15, 11, 30, 76, 8, 14, 73, 59, 55]" + ((64+15+11+30+76+8+14+73+59+55)-520));
// console.log("[20, 40, 48, 70, 43, 79, 38, 37, 52, 68]" + ((20+40+48+70+43+79+38+37+52+68)-520));
// console.log("[46, 34, 72, 73, 28, 49, 30, 46, 86, 71]" + ((46+34+72+73+28+49+30+46+86+71)-520));
// console.log("[87, 35, 40, 81, 3, 22, 52, 25, 30, 13]" + ((87+35+40+81+3+22+52+25+30+13)-520));
// console.log("[51, 55, 88, 6, 92, 17, 5, 68, 60, 98]" + ((51+55+88+6+92+17+5+68+60+98)-520));
// console.log("[79, 53, 89, 94, 68, 73, 96, 37, 83, 63]" + ((79+53+89+94+68+73+96+37+83+63)-520));
// console.log("[80, 21, 45, 9, 65, 98, 70, 53, 95, 93]" + ((80+21+45+9+65+98+70+53+95+93)-520));
// console.log("[18, 78, 83, 43, 56, 32, 50, 45, 68, 46]" + ((18+78+83+43+56+32+50+45+68+46)-520));
// console.log("-------------------------");
// console.log("[65, 2, 61, 54, 66, 51, 45, 59, 22, 95]" + ((65+2+61+54+66+51+45+59+22+95)-520));
// console.log("[51, 52, 74, 98, 20, 41, 29, 28, 99, 28]" + ((51+52+74+98+20+41+29+28+99+28)-520));
// console.log("[64, 15, 11, 45, 76, 108, 14, 73, 59, 55]" + ((64+15+11+45+76+108+14+73+59+55)-520));
// console.log("[45, 40, 48, 70, 43, 79, 38, 37, 52, 68]" + ((45+40+48+70+43+79+38+37+52+68)-520));
// console.log("[31, 34, 72, 73, 28, 49, 15, 31, 86, 71]" + ((46+34+72+73+28+49+15+46+86+71)-520));
// console.log("[87, 35, 40, 81, 103, 22, 52, 25, 62, 13]" + ((87+35+40+81+103+22+52+25+62+13)-520));
// console.log("[51, 55, 88, 6, 92, 17, 5, 68, 60, 78]" + ((51+55+88+6+92+17+5+68+60+78)-520));
// console.log("[64, 3, 89, 44, 68, 73, 46, 37, 83, 13]" + ((64+3+89+44+68+73+46+37+83+13)-520));
// console.log("[80, 21, 45, 9, 65, 89, 70, 53, 45, 43]" + ((80+21+45+9+65+89+70+53+45+43)-520));
// console.log("[18, 78, 83, 43, 56, 32, 50, 45, 68, 47]" + ((18+78+83+43+56+32+50+45+68+47)-520));

// console.log(((65+2+61+54+66+51+45+59+22+2) + (51+52+74+98+35+41+29+28+99+28)
// + (64+15+11+30+76+8+14+73+59+55) + (20+40+48+70+43+79+38+37+52+68)
// + (46+34+72+73+28+49+30+46+86+71) + (87+35+40+81+3+22+52+25+30+13)
// + (51+55+88+6+92+17+5+68+60+98) + (79+53+89+94+68+73+96+37+83+63)
// + (80+21+45+9+65+98+70+53+95+93) + (18+78+83+43+56+32+50+45+68+46))/10); // 520.8

matrix = [[65, 2, 61, 54, 66, 51, 45, 59, 22, 95],
[51, 52, 74, 98, 20, 41, 29, 28, 99, 28],
[64, 15, 11, 45, 76, 108, 14, 73, 59, 55],
[45, 40, 48, 70, 43, 79, 38, 37, 52, 68],
[31, 34, 72, 73, 28, 49, 15, 31, 86, 71],
[87, 35, 40, 81, 103, 22, 52, 25, 62, 13],
[51, 55, 88, 6, 92, 17, 5, 68, 60, 78],
[64, 3, 89, 44, 68, 73, 46, 37, 83, 13],
[80, 21, 45, 9, 65, 89, 70, 53, 45, 43],
[18, 78, 83, 43, 56, 32, 50, 45, 68, 47]]
entang.updateChord(center, radius, matrix)
*/
//
