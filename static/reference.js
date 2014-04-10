/* 
* reference.js
* Created by: sethtoles
* Date created: 4/07/14
* Build a reference drawer to be linked to an ace editor
* REQUIRES: jQuery - jquery.com && ace - ace.c9.io
*/

function buildReferenceFor(editor){

// --- Toggle visibility of reference drawer --- \\
	$("#reference-handle").click(function() {
		var $this = $(this);
		if (!$this.hasClass("flip-h")){
			$this.addClass("flip-h").parent().addClass("open").siblings().addClass("narrow");
		} else {
			$this.removeClass("flip-h").parent().removeClass("open").siblings().removeClass("narrow");
		}
		var animate = setInterval(function() {editor.resize();}, 20);
		setTimeout(function() {clearInterval(animate); editor.resize();}, 450);
	});

	// --- Handle dragging of reference item --- \\
	$(".reference-item").mousedown(function(){
		var $this = $(this),
			$document = $(document),
			offset = $this.offset(),
			diffX = event.pageX - offset.left,
			diffY = event.pageY - offset.top,
			$dragged = $this.clone()
				.attr("id", "dragged")
				.css({"top": event.pageY - diffY, "left": event.pageX - diffX})
				.appendTo("#scroller")
				// when released
				.mouseup(function(){
					$document.off("mousemove.track");
					$dragged.remove();
				});
			// while dragging
			$document.on("mousemove.track", function(){
				$dragged.css({"top": event.pageY - diffY, "left": event.pageX - diffX});
			})
	});
}