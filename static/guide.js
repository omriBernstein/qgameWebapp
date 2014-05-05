// *** GUIDE HTML *** \\

var guide = {
	loadHTML : function(){
		$(".guide-item.l-start").html("Welcome to qromp, a quantum programming environment designed to help you learn about what that even means. The website is still very much under construction. This area over here is the guide. Directly to the right is the code editor where you may write quantum algorithms. You can click its purple bar on the left to see the function reference. The reference shows not only which functions you can use, but also what type of arugments they take. Continuing right we arrive at the visualizer. This area visually represents the simulated quantum computer. Each circle is what's called a qubit. Down below is where the circuit diagram will go once it's built."
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

$(".guide-item.l-quantcomp").html("As we've said, quantum computers are strange. But really."
	+ "<br><br>Let's start with something less bizarre. Ordinary computers perform operations by changing bits of information--where each bit has two possible states, ON or OFF. If you were a computer with only one bit, it would be like being able to hear only YES or NO, and being able to say only YES or NO--that's it."
	+ "<br><br>With two bits, a computer has four states: ON+ON, ON+OFF, OFF+ON, or OFF+OFF. That's a little more interesting (well, to me at least). As you scale up, the number of possible states grows exponentially--with three bits there are eight states, with four bits there are sixteen states. On the other hand, the computer can only ever be in one of these states at a single time. This seems to make sense: if something is ON it can't also be OFF."
	+ "<br><br>Well that's not completely the case for a quantum computer. Quantum computers can exist in what's called a superposition of states. When superposed, multiple possible states are represented simultaneously. For example, let's consider a quantum computer with one quantum bit, called a qubit."
		+"<br><br>This quantum computer can be in the state UP or the state DOWN, or it can be in some combination. It can be half-UP and half-DOWN; one-third-UP and two-thirds-DOWN.");  // end .l-quantcomp.html

		$(".guide-item.l-qubits").html("A quantum bit is called a qubit. That won't do you any good unless you know what a bit is, though."
		+ "<br><br>BLAH BLAH"); // end .l-qubits.html

		$(".guide-item.l-gates").html("Stuff about gates"); // end .l-gates.html

		$(".guide-item.l-oracles").html("Stuff about oracles"); // end .l-oracles.html

		$(".guide-item.l-grovers").html("Stuff about grovers"); // end .l-grovers.html

		$(".guide-item.e-deutschjozsa").html("Stuff about deutsch-jozsa"); // end .e-deutschjozsa.html

		$(".guide-item.e-grovers").html("Stuff about grovers"); // end .e-grovers.html

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

			$(".guide-item.d-srn").html("Stuff about srn"); // end .d-srn.html

			$(".guide-item.d-nand").html("Stuff about nand"); // end .d-nand.html

			$(".guide-item.d-hadamard").html("Stuff about hadamard"); // end .d-hadamard.html

			$(".guide-item.d-utheta").html("Stuff about utheta"); // end .d-utheta.html

			$(".guide-item.d-cphase").html("Stuff about cphase"); // end .d-cphase.html

			$(".guide-item.d-u2").html("Stuff about u2"); // end .d-u2.html

			$(".guide-item.d-swap").html("Stuff about swap"); // end .d-swap.html

			$(".guide-item.d-oracle").html("Stuff about oracle"); // end .d-oracle.html

			$(".guide-item.d-measure").html("Stuff about measure"); // end .d-measure.html

			$(".guide-item.d-else").html("Stuff about else"); // end .d-measure.html

			$(".guide-item.d-end").html("Stuff about end"); // end .d-end.html
		}
	}
