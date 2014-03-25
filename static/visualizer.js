/* visualizer.js
* Created by: 
* Date created: 
* Uses http:////cdnjs.cloudflare.com/ajax/libs/Chart.js/0.2.0/Chart.min.js
* to render visual representation of qubits.
* 
* TODO:
*	Possibly put qubits[] and related methods in a closure 
*
* DONE:
* 
*/

var qubits = [];

qubits.render = function() {
	var n = this.length,
		theta = 2 * Math.PI / n,
		T = Math.tan(theta / 2),
		radius = 0,
		visSpace = Math.min($visualizer.height(), $visualizer.width()),
		size = visSpace;
	if (n > 1) {
		if (n === 2) {
			size = visSpace / 2;
			radius = (visSpace - size) / 2;
		} else if (n % 2 === 0) {
			size = visSpace * T / (1 + 2 * T);
			radius = (visSpace - size) / 2;
		} else {
			var phi = theta * (n - 1) / 2,
				psi = phi / 2 - Math.PI / 4; 
			size = 2 * visSpace / (Math.SQRT2 * ((1 + 1 / T) * Math.sqrt(1 - Math.cos(phi)) + 2 * Math.cos(psi)));
			radius = size / 2 + (size / 2) / T;
			var yOffset = (radius + size * (1 / 2 - 1 / (2 * Math.sin(theta / 2)) - Math.cos(theta / 2))) / 2;
		}
	}
	$("#qubitElements").css({"margin-top": (yOffset || 0) / rem + "rem"});
	for (var i = 0, angle = 180; i < n; i++, angle += 360 / n){
		this[i].render(.8 * size).css({
			"-webkit-transform": "translate(-50%, -50%) rotate(" +
			angle + "deg) translateY(" +
			radius / rem + "rem)"
		});
	}
}

qubits.update = function(qubitStates) {
	for (var i = 0; i < qubitStates.length; i++){
		if (!this[i]) {
			new Qubit(qubitStates[i]);
		} else {
			this[i].UP = qubitStates[i].UP;
			this[i].DOWN = qubitStates[i].DOWN;
			this.render();
		}
	}
}

qubits.pop = function() {
	if (this.length > 1){
		this[this.length - 1].$div.remove();
		Array.prototype.pop.call(this);
		this.render();
	}
}

qubits.reset = function() {
	for (var i = 0; i < this.length; i++){
		this[i].reset();
	}
}

function Qubit(qubitState) {
	if (qubits.length < 10) {
		if(qubitState){
			this.UP = qubitState.UP;
			this.DOWN = qubitState.DOWN;
		} else {
			this.UP = {prob: 1, phase: 0};
			this.DOWN = {prob: 0, phase: 0};
		}
		this.label = qubits.length;
		this.$div = $("<div id='qubit-"+ this.label +"' class='qubit'><div class='up-prob'></div><div class='down-prob'></div></div>");
		$("#qubitElements").append(this.$div);
		qubits.push(this);
		qubits.render();
	}
}

Qubit.prototype.render = function(size) {
	this.$div.css({
		"width": (size / rem) + "rem",
		"height": (size / rem) + "rem",
		"-webkit-transform": "translate(-50%, -50%)"
	}).children(".up-prob").css({"height": this.UP.prob * 100 + "%"});
	return this.$div;
}

Qubit.prototype.reset = function() {
	this.UP = {prob: 1, phase: 0};
	this.DOWN = {prob: 0, phase: 0};
}