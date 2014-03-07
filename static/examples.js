/* examples.js
* Created by: 
* Date: 03/06/14
* Examples, to be fleshed out later
* 
* TODO:
* - Add examples
* 
* DONE:
* 
*/

// Just so I don't have to keep copying and pasting examples goddamnit
$(document).ready(function() {
	// *** SETUP ***\\

	// *** EVENT LISTENERS ***\\
	$("#examples li").click(function() {ex.pasteEx($(this));});
});

var ex = {
	pasteEx: function ($this) {
		/* 

		Copy the text in the $ collection, paste
		it into the editor, and evaluate
		*/

		editor.getSession().setValue("");
		editor.insert($this.text());
		$("#evaluate").trigger("click");
	}
}
