/* visualizer.js
* Created by: 
* Date created: 
* Uses http:////cdnjs.cloudflare.com/ajax/libs/Chart.js/0.2.0/Chart.min.js
* to render visual representation of qubits.
* 
* TODO:
* change center coordinates of visualizer
* probably rewrite EVERYTHING... this was made on very little sleep, and seems unstable
* 
* DONE:
* 
*/

var vis = {
	defaultQubit: {DOWN: {phase: 0, prob: 0}, UP: {phase: 0, prob: 1}},
	qubitAttr: null,


	positionQubits: function (qubits){
		var numQubits = qubits.length ? qubits.length : 1,
			$qubitElements = $("#qubitElements"),
			qubitChildren = $qubitElements.children(),
			oldNum = qubitChildren.length,
			change = numQubits - oldNum;
		if (change){
			qubitAttr = {
				scale: Math.pow((14/15), numQubits - 1),
				translate: 95 * Math.pow(numQubits - 1, 1/4),
				rotate: 360 / numQubits
			};
			if (change < 0){
				for (var ii = 0; ii > change; ii--){
					qubitChildren[ii + oldNum - 1].remove();
				}
			} else {
				for (var ii = 0; ii < change; ii++){
					$qubitElements.append("<div><canvas class='qubit' />" +
						"<canvas class='upP' /><canvas class='downP' /></div>");
				}
			}
		}
		vis.renderQubits(qubits);
	},

	renderQubits: function (qubits){
		var inputNum = $("#qubits-input").val(),
			qubitChildren = $("#qubitElements").children();

		for (var ii = 0; ii < inputNum; ii++){
			var $thisChild = $(qubitChildren[ii]);

			$thisChild.css({
				"-webkit-transform": "translate(-50%, -50%) rotate(" +
					qubitAttr.rotate * ii + "deg) translateY(" +
					qubitAttr.translate + "px) rotate(-" +
					qubitAttr.rotate * ii + "deg) rotate(90deg) scale(" +
					qubitAttr.scale + ")"
			});
			vis.renderQubit(qubits, ii, $thisChild.children(".qubit"), $thisChild.children(".upP"), $thisChild.children(".downP")
			);
		}
	},

	renderQubit: function (qubits, qubitID, $qubitCanvas, $upPhaseCanvas, $downPhaseCanvas){
		var qubit = qubits[qubitID] ? qubits[qubitID] : vis.defaultQubit,
			ctxQ = $qubitCanvas[0].getContext('2d'),
			ctxUpP = $upPhaseCanvas[0].getContext('2d'),
			ctxDownP = $downPhaseCanvas[0].getContext('2d');
		new Chart(ctxQ).Pie( [{value: qubit.DOWN.prob, color: "#9a3535"},
			{value: qubit.UP.prob, color: "#3e3e97"}],
			{animation: false, segmentShowStroke: false} );
		vis.phaseCircle(ctxUpP, "#3e3e97");
		vis.phaseCircle(ctxDownP, "#9a3535");

		$upPhaseCanvas.css({
			"-webkit-transform": "rotate(-" + qubit.UP.phase +
				"deg) translateY(-82px) rotate(" + qubit.UP.phase + "deg)"
		});
		$downPhaseCanvas.css({
			"-webkit-transform": "rotate(-" + qubit.DOWN.phase +
				"deg) translateY(-82px) rotate(" + qubit.DOWN.phase + "deg)"
		});
	},

	phaseCircle: function (ctx, color) {
		ctx.beginPath();
		ctx.arc(150, 75, 10, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
	}
};