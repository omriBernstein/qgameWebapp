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
			for (var i = 0; i > change; i --){
				$qubitElements.children()[i + oldNum - 1].remove();
			}
		} else {
			for (var i = 0; i < change; i++){
				$qubitElements.append("<div><canvas class='qubit' /><canvas class='upP' /><canvas class='downP' /></div>");
			}
		}
	renderQubits();
	}
}

function renderQubits(){
	for (var i = 0; i < $qubitsInput.val(); i++){
			$($qubitElements.children()[i]).css({
				"-webkit-transform": "translate(-50%, -50%) rotate(" + qubitAttr.rotate * i + "deg) translateY(" + qubitAttr.translate + "px) rotate(-" + qubitAttr.rotate * i + "deg) rotate(90deg) scale(" + qubitAttr.scale + ")"
			});
			renderQubit(i, $($qubitElements.children()[i]).children(".qubit"), $($qubitElements.children()[i]).children(".upP"), $($qubitElements.children()[i]).children(".downP"));
		}
}

function renderQubit(qubitID, $qubitCanvas, $upPhaseCanvas, $downPhaseCanvas){
	var qubit = qubits[qubitID] ? qubits[qubitID] : defaultQubit,
		ctxQ = $qubitCanvas[0].getContext('2d'),
		ctxUpP = $upPhaseCanvas[0].getContext('2d'),
		ctxDownP = $downPhaseCanvas[0].getContext('2d');
	new Chart(ctxQ).Pie([{value: qubit.DOWN.prob, color: "#9a3535"}, {value: qubit.UP.prob, color: "#3e3e97"}], {animation: false, segmentShowStroke: false});
	phaseCircle(ctxUpP, "#3e3e97");
	phaseCircle(ctxDownP, "#9a3535");

	$upPhaseCanvas.css({
		"-webkit-transform": "rotate(-" + qubit.UP.phase + "deg) translateY(-82px) rotate(" + qubit.UP.phase + "deg)"
	});
	$downPhaseCanvas.css({
		"-webkit-transform": "rotate(-" + qubit.DOWN.phase + "deg) translateY(-82px) rotate(" + qubit.DOWN.phase + "deg)"
	});
}

function phaseCircle(ctx, color) {
	ctx.beginPath();
	ctx.arc(150, 75, 10, 0, 2*Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}