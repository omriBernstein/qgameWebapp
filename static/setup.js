var evaluate = document.getElementById("evaluate"),
	$qubitsInput = $("#qubitsInput"),
	$qubitElements = $("#qubitElements"),
	editor = ace.edit("ace"),
	qubits = [],
	defaultQubit = {DOWN: {phase: 0, prob: 0}, UP: {phase: 0, prob: 1}},
	qubitAttr;

$(document).ready(function() {
	positionQubits($qubitsInput.val());
	editor.getSession().setUseWrapMode(true);
});

$qubitsInput.change(function() {
	positionQubits($qubitsInput.val());
});