// *** GUIDE HTML *** \\

var guide = {
	loadHTML : function(){
		$(".guide-item.l-start").html("Welcome to qromp, a quantum programming environment designed to help you learn about what that even means. The website is still very much under construction. This area over here is the guide. Directly to the right is the <span id='highlight-editor' class='highlighter'>code editor</span> where you may write quantum algorithms. You can click its purple bar on the left to see the <span id='highlight-reference' class='highlighter'>function reference</span>. The reference shows not only which functions you can use, but also what type of arguments they take. Continuing right we arrive at the <span id='highlight-visualizer' class='highlighter'>visualizer</span>. This area visually represents the simulated quantum computer. Each circle is what's called a qubit. Down below is the <span id='highlight-diagram' class='highlighter'>circuit diagram</span>, which is constructed from your program and is an alternate (but largely equivalent) visual diagram of the current program."
			+ "<br/><br/>If you've made it this far, you're probably wondering what quantum programming is. It's the kind of computer programming that applies to quantum computers. A quantum computer is a very strange type of computer that is very different from an ordinary computer (most likely, you've only ever interacted with ordinary computers). The idea of quantum computing stems from the question: what if you built a computer that is based on quantum physics (as opposed to classical physics)?"
			+ "<br/><br/>But to learn quantum computer programming, you don't need to know quantum mechanics--for the same reasons that you do not need to know electrical dynamics to be an ordinary-computer programmer. Of course, the whole field is quite young (certainly no more than 35 years old), so getting acquainted with quantum programming often involves getting your hands dirty (or clean, some may argue) with physics."
			+ "<br/><br/>Well anyways, if you want to get started, feel free to click any of the examples below, or just try some stuff out yourself by typing in the code area (again, the list of possible functions can be seen by clicking that purple bar on the right of the editor). Or you may go to the next lesson."
			+ "\n<div class='example-list'>"
			+ "\nClick on an example:"
			+ "\n<ul>"
			+ "\n<li class='example'>qnot A</li>"
			+ "\n<li class='example'>hadamard A</li>"
			+ "\n<li class='example'>hadamard B</li>"
			+ "\n<li class='example'>u2 A 0 0 0 PI/2</li>"
			+ "\n</ul>");  // end #l-start.html

		$(".guide-item.l-quantcomp").html("A quantum computer is essentially a computer that is grounded in quantum mechanics. Think about a card game versus a video game. If you are inventing a card game, you have different limitations than if you are inventing a video game. In fact, if you are inventing a video game, you can theoretically make any card game, just virtualized, though the opposite (trying to make any video game into a card game) is impractical at best."
		+ "<br><br>With a quantum computer, it is theoretically possible to do anything you can already do with an ordinary computer, and more. But 'theoretically' is the key word here. Actual quantum computers are still quite limited. I believe it was big news last year when a real quantum computer could finally show, using Shor's algorithm that 21 could be decomposed into 3 * 7. Which is not to diminish the extraordinary effort and brilliance that went into this breakthrough--but honestly, quantum computers have little practical significance yet."
		+ "<br><br>Still, the field shows promise, and with the expectation that the hardware will advance, quantum computing could become really important. It has been shows that certain things, like factoring numbers and searching through an unsorted database, can be done much faster on quantum computers than on ordinary computers. What other quantum algorithms exist is still a pretty open question, and that's part of the reason this website exists.");  // end .l-quantcomp.html

		$(".guide-item.l-aqubit").html("Let's start with ordinary bits. A bit is a piece of information with two possible states, ON or OFF. Ordinary computers (such as this one) perform all of their operations by changing bits of information. If you were a computer with only one bit, it would be like being able to hear only YES or NO, and being able to say only YES or NO--that's it. A bit can only ever be ON or OFF."
		+ "<br><br>Well that's not completely the case for a quantum bit, called a qubit. A qubit can exist in what's called a superposition of states. When superposed, a qubit represents two states simultaneously. This qubit can be half ON and half OFF--in which case we would say it is fully superposed. There are other combinations. For example, it could be one-third ON and two-thirds OFF, or five-eighths ON and three-eighths OFF, or it could even be completely ON and not-at-all OFF."
		+ "<br><br>Notice that these two numbers must always add up to one. This is no coincidence. Although a qubit represents two states simultaneously, each substate (ON or OFF) partially exists, sharing a piece of the 'whole existence' with the other substate."
		+ "<br><br>Also notice that an ordinary bit is a particular kind of quantum bit, much like a square is a particular kind of rectangle. A qubit can be 100% ON and 0% OFF, in which case it is the same as a bit that is ON. This is like a rectangle just happening to have equal sides--it is technically also a square."
		+ "<br><br>In the visualizer, each qubit has a line representing its ON percentage (the purple line) and a line representing its OFF percentage (the white line). The magnitude of each percentage is given by its line's length--as a portion of the encompassing circle's radius. For example, if a line takes up the entirety of the radius, then that substate is 100% and the other substate is 0%."); // end .l-aqubit.html

		//Measurement: maybe use picture of a vase/two-faces thing as metaphor?
		$(".guide-item.l-measurement").html("The so called partial existences, these superpositions, correspond to probabilities. If a qubit is 25% ON (and 75% OFF) then it has a 25% chance of being measured as ON. So 25% of the time, the result will be 100% ON and 75% of the time the result will be 100% OFF."
			+ "<br><br>In an ordinary computer, measuring is simple. You simply read the state, and that's that. In a quantum computer, the act of measurement is not passive. Measuring a qubit will aftewards leave it in a definite state: 100% ON or 100% OFF. In that sense, it destroys the superposition. This is also known as collapse."
			+ "<br><br>As you may imagine, measuring the system is crucial. If you want to get an answer from it, you must measure it. Note this is also the case in an ordinary computer--but an ordinary computer is already collapsed (i.e. not superposed), so measurement isn't a big deal."
		+ "<br><br>This points to a very important limitation for quantum computers. Though they can indeed represent multiple states at once, in order to get any answer, it is necessary to measure and consequently collapse the system to a single definite state. Furthermore, this answer is probabilistic: its outcome may be random!"
		+ "<br><br>You may be wondering how a quantum computer could still be useful given such a constraint. The answer is that quantum computers must use their runtime superposition to manipulate the probabilities of various outcomes. By making one (or a small subset) of possibilities more probabilistically prominent, the final result can still be meaningful."); // end .l-measurement.html

		$(".guide-item.l-manyqubits").html("The magic of quantum computing really happens when there is more than one qubit. Let's go back to the ordinary case again. A computer with two bits has four possible states: ON+ON, ON+OFF, OFF+ON, and ON+ON. Once again, it can only be in one of these states at any given time."
		+ "<br><br>Yet a quantum computer with two qubits will be in some combination of all of the states at the same time. For example, it could be 50% ON+ON and 50% OFF+OFF. This means that the system as a whole half exists as ON+ON and half exists as OFF+OFF. Like before, these partial existences must sum to 100%, which means that the system is 0% ON+OFF and 0% OFF+ON."
		+ "<br><br>This may or may not at first strike you as odd. Consider each qubit separately. The first qubit, let's call it A, is 50% ON and 50% OFF. If we were to measure it, there would be a 50% chance it'd be ON, and a 50% chance it'd be OFF. We can see this by paying attention to just the first substate: 50% <b>ON</b>+ON and 50% <b>OFF</b>+OFF. The second qubit, let's call it B, is 50% ON and 50% OFF for the same reasons."
		+ "<br><br>But there's something else that's weird. If you measure one qubit, the other one collapses in the same manner. Think about it, when you measure A it will come out as ON or OFF. If A comes out as ON, then qubit B will also come out as ON, because there's only one possible situation in which A is ON, the one in which B is also ON. If A comes out as OFF, then qubit B will also come out as OFF, because there's only one possible situation in which A is OFF, the one in which B is also OFF."
		+ "<br><br>Here, the combined qubits have no existence as ON+OFF or as ON+OFF, those states are both 0%. This is very different than having two independent qubits that are each separately superposed. When one is ON the other is also ON, when one is OFF the other is also OFF: these qubits are codependent! This is called entanglement, and is a big part of what makes quantum computers seem strange."); // end .l-manyqubits.html

		$(".guide-item.l-phase").html("You may be wondering why the qubit lines in the visualizer rotate. Well, that's because each qubit actually has more information than just a probability. A qubit also has what's called a phase, and which we here represent with angles."
		+ "<br><br>Phase is a very slippery concept. Certain operations will behave differently given different phases. These phases, these angles, only have meaning relative to one another. So, for example, srn behaves differently when the ON and OFF lines are pointing away from each other than it does when they are pointing in the same direction."); //end .l-phase.html

		$(".guide-item.l-gates").html("In quantum computers the operations are often called gates. A quantum gate will take as input a qubit or multiple qubits, and must return as output as many qubits as it takes. "); // end .l-gates.html

		$(".guide-item.l-oracles").html("Stuff about oracles"); // end .l-oracles.html

		$(".guide-item.l-grovers").html("Stuff about grovers"); // end .l-grovers.html

		$(".guide-item.e-deutschjozsa").html("Stuff about deutsch-jozsa"); // end .e-deutschjozsa.html

		$(".guide-item.e-grovers").html("Grover's search algorithm can find an item in an unsorted database faster than any ordinary algorithm. For example, say you had a phone book and were given a telephone number. Well if you wanted to look up whose number that is, ordinarily you'd have to just keep trying until you get one right. That would take on average about half as many tries as total items in the database."
			+ "<br><br>With a quantum algorithm, specifically Grover's, you could find that name with many fewer tries. The number of tries would be the square root of the number of items in the database. For a phonebook with a million names that's the difference between five hundred thousand tries and simply one thousand tries."
			+ "<br><br>Well, here's an example of Grover's working on a four-item database, where what we're looking for is the position of that 1 following the with_oracle. Pay attention to final output of qubits B and C:"
			+ "<br><div class='example'>#change the input below\n"
			+ "<br>#to see the output change\n"
			+ "<br>#the input is given by the\n"
			+ "<br>#position of the 1 following with_oracle\n"
			+ "<br>with_oracle 0 0 0 1\n"
			+ "<br>hadamard C\n"
			+ "<br>hadamard B\n"
			+ "<br>utheta A PI/4\n"
			+ "<br>oracle C B A\n"
			+ "<br>hadamard C\n"
			+ "<br>cnot C B\n"
			+ "<br>hadamard C\n"
			+ "<br>utheta C PI/2\n"
			+ "<br>utheta B PI/2</div>"
			+ "<br>Both B and C are fully purple, so they are both fully ON, which corresponds to the binary digit 11, which is the decimal digit 3, which is the zero-indexed position of the 1 in the original with_oracle invocation. Now if we change the position of the 1 we'll get a different answer. If the 1 is in the first position:"
			+ "<br><div class='example'>with_oracle 1 0 0 0\n"
			+ "<br>hadamard C\n"
			+ "<br>hadamard B\n"
			+ "<br>utheta A PI/4\n"
			+ "<br>oracle C B A\n"
			+ "<br>hadamard C\n"
			+ "<br>cnot C B\n"
			+ "<br>hadamard C\n"
			+ "<br>utheta C PI/2\n"
			+ "<br>utheta B PI/2</div>"
			+ "Both B and C are fully OFF, which corresponds to the binary digit 00, which is the decimal digit 0, which is the zero-indexed position of the 1. Go ahead and try putting the 1 in the other two positions. See that B and C, taken together, will give you the position of that 1."); // end .e-grovers.html

		$(".guide-item.e-shors").html("Stuff about shors"); // end .e-shors.html

		$(".guide-item.d-qnot").html("The qnot operation flips a single qubit. It will swap that qubit's UP and DOWN lines. This is called qnot because it is like an ordinary not operation, but quantum. For example:"
			+ "<br><div class='example'>qnot A</div>"
			+ "<br>Notice that flipping can have no effect, if the UP and DOWN states happen to be the same:"
			+ "<br><div class='example'>hadamard A\n"
			+ "<br>qnot A</div>"
			+ "<br>On the other hand, remember that even if the UP and DOWN states have the same probability (line length), qnot will swap their phase (angle), e.g.:"
			+ "<br><div class='example'>qnot A\n"
			+ "<br>hadamard A\n"
			+ "<br>qnot A</div>"
			+ "<br>Notice also that order of operations is really important. As in:"
			+ "<br><div class='example'>hadamard A\n"
			+ "<br>qnot A</div>"
			+ "Is not the same as:"
			+ "<br><div class='example'>qnot A\n"
			+ "<br>hadamard A</div>"); // end .d-qnot.html

		$(".guide-item.d-cnot").html("cnot, a.k.a controlled not, takes two qubits, the first of which we'll call the control, and the second we'll call the target. cnot state-flips the target based on the DOWN probability of the control. If the control has 0% DOWN probability, the target is not at all flipped (in other words, nothing happens--its value doesn't change):"
			+ "<br><div class='example'>#qubit A is 0% DOWN by default\n"
			+ "<br>cnot A B</div>"
			+ "<br>If, on the other hand, the control has 100% DOWN probability, the target is completely flipped--which you may notice is equivalent to calling qnot on the target:"
			+ "<br><div class='example'>qnot A\n"
			+ "<br>cnot A B</div>"
			+ "<br>Here's the neat part. If the control qubit is 50% DOWN, it half-flips the target:"
			+ "<br><div class='example'>hadamard A\n"
			+ "<br>cnot A B</div>"
			+ "In this case, where the control is 50% DOWN, the target will always end up fully superposed, i.e. 50% DOWN and 50% UP (what happens to phase is more complicated). This is because half-flipping any qubit state will put the UP and DOWN probabilities both smack dab in the middle."
			+ "<br><br>When the target is already fully superposed, cnot will only ever affect phase (though sometimes it will affect neither). No matter how much or how little you flip a fully superposed target, it always ends up fully superposed again. For example, consider this superposed state:"
			+ "<br><div class='example'>qnot A\n"
			+ "<br>qnot B\n"
			+ "<br>hadamard B</div>"
			+ "Now if we controlled not at the end like so:"
			+ "<br><div class='example'>qnot A\n"
			+ "<br>qnot B\n"
			+ "<br>hadamard B\n"
			+ "<br>cnot A B</div>"
			+ "The UP and DOWN phases of qubit B get swapped."); // end .d-cnot.html

			$(".guide-item.d-srn").html("Square-root-of-not, or srn, is so named because calling srn twice in a row is equivalent to qnot."
				+ "<br><div class='example'>srn A\n"
				+ "<br>srn A</div>"); // end .d-srn.html

			$(".guide-item.d-nand").html("The nand operation is the quantum equivalent of a boolean not-and."); // end .d-nand.html

			$(".guide-item.d-hadamard").html("Hadamard may at first appear to be like srn, but actually two successive hadamards will not flip a qubit, but rather have no effect on the original state."); // end .d-hadamard.html

			$(".guide-item.d-utheta").html("You can use the utheta gate to mimic a number of single-qubit gates. It takes a qubit and an angle. The angle is used to give form to the gate it is supposed to mimic. On the other hand, unlike u2, it cannot mimic any single-qubit operation because it cannot rotate a qubit arbitrarily."); // end .d-utheta.html

			$(".guide-item.d-cphase").html("cphase is a lot like cnot, only the target does not flip, but instead is rotated by the given angle."); // end .d-cphase.html

			$(".guide-item.d-u2").html("u2 is the catch-all single-qubit gate. In addition to taking a qubit, it takes four angles. These angles will parameterize the gate, specifying which form it should take. It is possible to mimic any other single qubit gate using u2."); // end .d-u2.html

			$(".guide-item.d-swap").html("As its name suggest, swap swaps two qubits' states."); // end .d-swap.html

			$(".guide-item.d-oracle").html("oracle is a gate that can operate on any number of qubits. Each oracle gate is specified by its most upstream proximal with_oracle. In general, an oracle gate will represent a quantum version of any binary truth table."); // end .d-oracle.html

			$(".guide-item.d-measure").html("The measure instruction will collapse the state of the given qubit, performing different operations on each possible collapsed state."); // end .d-measure.html

			$(".guide-item.d-else").html("else specifies where the else clause of a measure operation begins."); // end .d-measure.html

			$(".guide-item.d-end").html("end connotes the end of a measure operation. All subsequent operations will get run 'simultaneously' on both possible collapsed states."); // end .d-end.html
		}
	}

/*into setup, in the future, something like this...
$(document).on("mouseenter", ".qromp-div-reference", function(evt) {$("#"+evt.currentTarget.innerHtml).addClass("highlight")});
$(document).on("mouseleave", ".qromp-div-reference", function(evt) {$("#"+evt.currentTarget.innerHtml).removeClass("highlight")});
*/