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
* - Currently just creates a chord diagram with arbitrary
* values with one alteration - the chords that go back
* to the parent are hidden (opacity 0). It is animated,
* but doesn't show partial potential for entanglement.
* - Arcs don't look pixelated when large, unlike last attempt
* - I think because of the order this puts the connections in,
* there are straight lines going across the middle sometimes.
* I'm not sure how, but I believe adjusting the indexes somehow
* will fix it (it can't just be shifted one spot over)
*/

var entang = {

	firstOuterRadius: null
	, animTime: null
	, arcForGroups: null
	, pathForChords: null
	, fullEntangElem: null
	, partEntangElem: null
	, oldFullLayout: null
	, oldPartLayout: null

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
					+ ") rotate(" + rotation
					//To help pixelation when big
					+ ")"
				// + " scale(0.5)"
				)
		;
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
		entang.partEntangElem = entang.attachChord("entang part-entang", center, rotation);

	// *** FULL ENTANGLEMENT OUTLINE (no paths) *** \\
		// Place the element that will have the diagram
		entang.fullEntangElem = entang.attachChord("entang full-entang", center, rotation);

		// Call the function that will animate the diagram's appearance
		entang.updateChord(center, firstOuterRadius, entangMatrix);
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
			, fullEntangElem = entang.fullEntangElem
			, partEntangElem = entang.partEntangElem
			, oldFullLayout = entang.oldFullLayout
			, oldPartLayout = entang.oldPartLayout
		;

		// Color for potential
		var partArcColor = "#9986b3";
		var fullArcFill = "none", fullArcStroke = "gray";
		// Just an array of colors now
		var bridgeColors = ["#9986b3", "red", "green", "blue"];
		// // I'm not sure why this isn't just an array, but afraid to change
		// var bridgeColors = d3.scale.ordinal()
		// 	.domain(d3.range(4))
		// 	.range(["#9986b3", "red", "green", "blue"])
		// ;

	// *** FUNCTIONS *** \\

	// --- ALL --- \\
		/* (d3 collection?) -> None

		Update (and animate?) removal of elements. Can this be
		outside of update?
		*/
		function removeElems (groupOfElems) {
			groupOfElems.exit()
				.transition()
					.duration(animTime)
					.attr("opacity", 0)
					.remove(); //remove after transitions are complete
		}

	// --- ARCS --- \\
		/* (?, str, layout.chord()?) -> d3 collection of objects?

		Creates new arcs (those outside sections) for chord diagram.
		Can this be outside of update?
		*/
		function createArcs (thisDiv, thisSelector, thisLayout) {
			// Maybe we can do d3.selectAll() instead of thisDiv.selectAll()
			var groupOfArcs = thisDiv.selectAll(thisSelector)
				.data(thisLayout.groups(), function (d) {
					return d.index; //use a key function in case the 
					//groups are sorted differently between updates
			});
			return groupOfArcs;
		}

// May be better to add paths the regular way, then make an
// append function for arcs then make a color function?

		/* (d3 collection?, str) -> d3 collection?

		Updates arcs that are added. Can this be outside of update?
		*/
		function addArcs (groupOfArcs, selector) {
			// Add a new element to the DOM
			var newGroups = groupOfArcs.enter().append("g")
				.attr("class", "group");

			//create the arc paths and set the constant attributes
			//(those based on the group index, not on the value)
			// ~~ id's and colors
			newGroups.append("path")
				.attr("id", function (dat) {
					return selector + dat.index;
					//using dat.index and not i to maintain consistency
					//even if groups are sorted (knod: huh?)
				})
				;

			newGroups
				// ~~~ qromp color versions
				.style("fill", function (dat) {
					// Color for arcs indicating entanglement potential
					if (selector == "part-group") {return  partArcColor; }
					// Color for showing full entanglement
					else {return "none";}
				})
				.style("stroke", function (dat) {
					// Same
					if (selector == "part-group") {return  partArcColor;}
					else {return "black";}
				})
			;

			return newGroups;
		}  // end addArcs()

		/* (d3 collection?, layout.chord?) -> None

		I think this only takes care of the animation for arcs that
		have been added, I think removal of arcs anims itself.
		*/
		function animAddedArcs (groupOfArcs, thisLayout) {
			groupOfArcs.select("path") 
				.transition()
					.duration(animTime)
				.attrTween("d", entang.arcTween( thisLayout ))
			;
		}

	// *** FULL ENTANGLEMENT *** \\
		var newFullMatrix = entang.newFullEntangMatrix(newEntangMatrix.length);
		// (need this var later)
		var newFullLayout = entang.newChord(newFullMatrix);

		updateFull();

		function updateFull () {
			// Container's new elements: create data. Also get all elements?
			var groupG = fullEntangElem.selectAll(".full-entang .group")
				//use a key function in case the groups are
				// sorted differently between updates
				.data(newFullLayout.groups(), function (d) {return d.index;});

			// Animate removal of paths
			removeElems(groupG);

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
				.attrTween("d", entang.arcTween( oldFullLayout ))
			;
		}  // end updateFull()

	// *** PARTIAL ENTANGLEMENT *** \\
		// Make and store a new layout.chord() with the new matrix that
		// we'll transition to (from oldPartLayout) (need this var later)
		var newPartLayout = entang.newChord(newEntangMatrix, 0.5);

		updatePart();

		function updatePart () {
		// *** GROUPS(?), creation *** \\
			// Container's new elements: create data. Also get all elements?
			var groupG = partEntangElem.selectAll(".part-entang .group")
				//use a key function in case the groups are
				// sorted differently between updates
				.data(newPartLayout.groups(), function (d) {return d.index;});

			// Animate removal of paths
			removeElems(groupG);

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
				.attrTween("d", entang.arcTween( oldPartLayout ))
			;

		// *** CHORD PATHS, creation, entrance, exit, animation *** \\
			// Doesn't need as much automation - not reused
			// Container's new elements: create data. Also get all elements?
			var chordPaths = partEntangElem.selectAll("path.chord")
				// ~~~ I don't understand what this does
				.data(newPartLayout.chords(), entang.chordKey )
					//specify a key function to match chords
					//between updates
				;

			// Animate removal of paths
			removeElems(chordPaths);

			// Add new top-level items with class
			var newChords = chordPaths.enter().append("path").attr("class", "chord");
			// Before they're animated, hide paths that don't go anywhere
			// (blank space to indicate un-entangled area)
			entang.hideOwn();
			// Color paths - changing the colors before anim fixes the black!
			chordPaths
				.style("fill", function(d) { return bridgeColors[d.source.index]; })
				.style("stroke", function(d) { return bridgeColors[d.source.index]; })
			;

			// Animate addition/shape change of paths
			chordPaths.transition()
				.duration(animTime)
				.attrTween("d", entang.chordTween( oldPartLayout ))
			;
		}  // end updatePart()

		// *** EVENT HANDLERS *** \\
		//add the mouseover/fade out behaviour to the groups
		//this is reset on every update, so it will use the latest
		//chordPaths selection
		// ~~~ Our own version of fade, theirs was too complex
		// partEntangElem.selectAll(".part-entang .group") takes a while to
		// have the correct values
		console.log("Wait, and then the code from which groupG is derived:");
		console.log(partEntangElem.selectAll(".part-entang .group"));
		partEntangElem.selectAll(".part-entang .group").on("mouseover", entang.fade(.1))
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

		entang.oldFullLayout = newFullLayout; //save for next update
		entang.oldPartLayout = newPartLayout; //save for next update

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
				// ~~~ I don't understand what this does
				.data( newPartLayout.chords(), entang.chordKey );

// Animate removal of paths
removeElems(chordPaths);

// Add new top-level items with class
var newChords = chordPaths.enter().append("path").attr("class", "chord");

// Color paths
chordPaths
				// ~~~ Changing the colors here doesn't fix the black
				.style("fill", function(d) { return bridgeColors[d.source.index]; })
				.style("stroke", function(d) { return bridgeColors[d.source.index]; })

// Animate addition/shape change of paths
chordPaths.transition()
				.duration(animTime)
				.attrTween("d", entang.chordTween( oldPartLayout ))
			;
		}
*/
