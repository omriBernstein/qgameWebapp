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
	var numQubits = this.length,
		$visualizer = $("#visualizer"),
		visHeight = $visualizer.height(),
		visWidth = $visualizer.width(),
		angle = 360 / numQubits;
	if(numQubits > 1){
		var percentOfVis = 0.8,
			C = Math.cos(Math.PI / 2 - Math.PI / numQubits),
			theta = Math.PI / 2 - (Math.PI / 2) / numQubits,
			sqrt2 = Math.sqrt(2),
			offsetHeight = visHeight * percentOfVis / ((numQubits % 2 === 0) ? (sqrt2 * C + 2) : (C * (Math.tan(theta) + sqrt2))),
			offsetWidth = visWidth * percentOfVis / ((numQubits % 2 === 0) ? (sqrt2 * C + 2) : (C * ((1 / Math.cos(theta)) + sqrt2))),
			offset = offsetWidth < offsetHeight ? offsetWidth : offsetHeight,
			size = sqrt2 * C * offset;
	} else {
		var offset = 0,
			size = visHeight / 2;
	}
	for (var i = 0; i < numQubits; i++){
		this[i].render(angle, offset, size, i);
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

Qubit.prototype.render = function(angle, offset, size, index) {
	this.$div.css({
		"width": size + "px",
		"height": size + "px",
		"-webkit-transform": "translate(-50%, -50%) rotate(" +
			(angle * index + 180) + "deg) translateY(" +
			offset + "px) rotate(-" +
			(angle * index + 180) + "deg)"
	}).children(".up-prob").css({"height": this.UP.prob * 100 + "%"});
}

Qubit.prototype.reset = function() {
	this.UP = {prob: 1, phase: 0};
	this.DOWN = {prob: 0, phase: 0};
}