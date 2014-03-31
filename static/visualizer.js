/* visualizer.js
* Created by: sethtoles
* Date created: 3/11/14
* to render visual representation of qubits.
* 
* TODO:
*	Possibly put qubits[] and related methods in a closure 
*
* DONE:
* 
*/

var qubits = [];

qubits.push = function(qubit) {
	Array.prototype.push.call(this, qubit);
	this.arrange(function(){qubit.render()});
}

qubits.pop = function() {
	if (this.length >= 0){
		Array.prototype.pop.call(this).$div.remove();
		this.arrange();
	}
}

qubits.updateAll = function(qubitStates) {
	for (var i = 0, length = qubitStates.length; i < length; i++){
		if (!this[i]) {
			new Qubit(qubitStates[i]);
		} else {
			this[i].up.set(qubitStates[i].up.prob, qubitStates[i].up.phase, true);
			this[i].down.set(qubitStates[i].down.prob, qubitStates[i].down.phase);
		}
	}
}

qubits.resetAll = function() {
	for (var i = 0, length = this.length; i < length; i++){
		this[i].reset();
	}
}

qubits.arrange = function(callback) {
	var n = this.length,
		theta = 2 * Math.PI / n,
		T = Math.tan(theta / 2),
		size = Math.min($visualizer.height(), $visualizer.width()),
		radius = 0;
	if (n > 1) {
		if (n === 2) {
			var fullSize = size;
			size *= .5;
			radius = (fullSize - size) / 2;
		} else if (n % 2 === 0) {
			var fullSize = size;
			size *= T / (1 + 2 * T);
			radius = (fullSize - size) / 2;
		} else {
			var phi = theta * (n - 1) / 2,
				psi = phi / 2 - Math.PI / 4; 
			size *= 2 / (Math.SQRT2 * ((1 + 1 / T) * Math.sqrt(1 - Math.cos(phi)) + 2 * Math.cos(psi)));
			radius = size / 2 + (size / 2) / T;
			var yOffset = (radius + size * (1 / 2 - 1 / (2 * Math.sin(theta / 2)) - Math.cos(theta / 2))) / 2;
		}
	}
	this.size = size *= .8;
	$("#qubitElements").css({"margin-top": (yOffset || 0) / rem + "rem"});
	for (var i = 0, angle = 0; i < n; i++, angle += 360 / n){
		this[i].$div.css({
			"width": (size / rem) + "rem",
			"height": (size / rem) + "rem",
			"transform": "translate(-50%, -50%) rotate(" +
			angle + "deg) translateY(" +
			-radius / rem + "rem) rotate(" +
			-angle + "deg)"
		});
	}
	if (callback && typeof callback === "function") callback();
}

// used to costruct both the up and down objects for each qubit
function SubState(type, values, parent) {
	this.type = type;
	this.parent = parent;
	this.phase = values.phase;
	this.prob = values.prob;
	this.$subDiv = $("<div class='sub-div " + type + "'></div>");
}

SubState.prototype.set = function(prob, phase, skipRender) {
	if (phase !== undefined) {
		this.setProb(prob, true);
		this.setPhase(phase, skipRender);
	} else {
		this.setProb(prob, skipRender);
	}
}

SubState.prototype.setProb = function(prob, skipRender) {
	// constrain prob to allowed range (0-1), throw warning if constrained
	this.prob = (prob > 1) ? 1 : (prob < 0) ? 0 : prob;
	if (this.prob !== prob && console) console.warn("Tried to set qubit[" + this.parent.label + "]." + this.type + ".prob to " + prob + ", which is outside the allowed range (0 - 1). It has been set to " + this.prob);
	// make sure the two probabilities add up to one
	this.parent[this.type === "up" ? "down" : "up"].prob = 1 - this.prob;
	// render qubit
	if (!skipRender) this.parent.render();
}

SubState.prototype.setPhase = function(phase, skipRender) {
	// shift the phase into allowed range (-180 - 180)
	this.phase = (phase + 180) % 360 -180;
	// render qubit
	if (!skipRender) this.parent.render();
}

function Qubit(qubitState) {
	this.label = qubits.length;
	// set default values and create all of the empty divs for a qubit as jQuery objects
	// -- this will give us easy access to change them directly at any time
	this.$div = $("<div id='qubit-"+ this.label +"' class='qubit'></div>");
	this.$probRing = $("<div class='prob-ring'></div>");
	this.up = new SubState("up", qubitState ? qubitState.up : {prob: 1, phase: 0}, this);
	this.down = new SubState("down", qubitState ? qubitState.down : {prob: 0, phase: 0}, this);
	// stick the up and down $subDivs and $probRing into $div, and $div into "qubitElements"
	$("#qubitElements").append(this.$div.append(this.$probRing, this.up.$subDiv, this.down.$subDiv));
	// add this to the array of qubits
	qubits.push(this);
}

Qubit.prototype.reset = function() {
	// sets each property individually, so as not to overwrite important properties such as label and div objects
	this.up.prob = 1;
	this.up.phase = 0;
	this.down.prob = 0;
	this.down.phase = 0;
	this.render();
}

// renders all properties of the qubit
Qubit.prototype.render = function() {
	var ringSize = this.down.prob * 100;
	this.up.$subDiv.css({"height": "calc(" + this.up.prob * 50 + "% + .2rem)", "transform": "translate(-50%, -100%) rotate(" + this.up.phase + "deg) translateY(calc(" + -this.down.prob / this.up.prob * 100 + "% + .3rem))"});
	this.down.$subDiv.css({
		"height": this.down.prob * 50 + "%", "transform": "translate(-50%, -100%) rotate(" + this.down.phase + "deg)"
	});
	this.$probRing.css({"height": ringSize + "%", "width": ringSize + "%"});
}