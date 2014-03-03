/* visualizer.js
* Created by: 
* Date created: 
* Uses http:////cdnjs.cloudflare.com/ajax/libs/Chart.js/0.2.0/Chart.min.js
* to render visual representation of qubits.
* 
* TODO:
* - Comment
* - qubitAttr - misspelled?
* - Create an enclosure
* - Change var i to ii
* - Create jQuery vars in for loops
* 
*/

function positionQubits(newNum){
	var oldNum = $qubitElements.children().length,
		change = newNum - oldNum;
	if (change){
		qubitAttr = {
				scale: Math.pow((14/15), newNum - 1),
				translate: 95 * Math.pow(newNum - 1, 1/4),
				rotate: 360 / newNum
			};
		if (change < 0){
			for (var ii = 0; ii > change; ii--){
				$qubitElements.children()[ii + oldNum - 1].remove();
			}
		} else {
			for (var ii = 0; ii < change; ii++){
				$qubitElements.append("<div><canvas class='qubit' />" +
					"<canvas class='upP' /><canvas class='downP' /></div>");
			}
		}
	renderQubits();
	}
}

function renderQubits(){
	for (var ii = 0; ii < $qubitsInput.val(); ii++){
			$($qubitElements.children()[ii]).css({
				"-webkit-transform": "translate(-50%, -50%) rotate(" +
					qubitAttr.rotate * ii + "deg) translateY(" +
					qubitAttr.translate + "px) rotate(-" +
					qubitAttr.rotate * ii + "deg) rotate(90deg) scale("
					+ qubitAttr.scale + ")"
			});
			renderQubit(
				ii, $($qubitElements.children()[ii]).children(".qubit"),
				$($qubitElements.children()[ii]).children(".upP"),
				$($qubitElements.children()[ii]).children(".downP")
			);
		}
}

function renderQubit(qubitID, $qubitCanvas, $upPhaseCanvas, $downPhaseCanvas){
	var qubit = qubits[qubitID] ? qubits[qubitID] : defaultQubit,
		ctxQ = $qubitCanvas[0].getContext('2d'),
		ctxUpP = $upPhaseCanvas[0].getContext('2d'),
		ctxDownP = $downPhaseCanvas[0].getContext('2d');
	new Chart(ctxQ).Pie([{value: qubit.DOWN.prob, color: "#9a3535"},
		{value: qubit.UP.prob, color: "#3e3e97"}],
		{animation: false, segmentShowStroke: false});
	phaseCircle(ctxUpP, "#3e3e97");
	phaseCircle(ctxDownP, "#9a3535");

	$upPhaseCanvas.css({
		"-webkit-transform": "rotate(-" + qubit.UP.phase +
			"deg) translateY(-82px) rotate(" + qubit.UP.phase + "deg)"
	});
	$downPhaseCanvas.css({
		"-webkit-transform": "rotate(-" + qubit.DOWN.phase +
			"deg) translateY(-82px) rotate(" + qubit.DOWN.phase + "deg)"
	});
}

function phaseCircle(ctx, color) {
	ctx.beginPath();
	ctx.arc(150, 75, 10, 0, 2*Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}