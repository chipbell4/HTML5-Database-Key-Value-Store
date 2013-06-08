var KeyValueDatabase = function(size) {
	if(typeof(size) === 'undefined') {
		size = 1024*1024; // default to a Mb
	}
	var db = window.openDatabase('appState', '1.0', 'App State', size);
};

saveState = (function(state) {
	// save app state
	var db = window.openDatabase('appState', '1.0', 'App State', 512);
	db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS appState (key, value)');
		for(var key in state) {
			var value = state[key] || null;
		tx.executeSql('INSERT INTO appState VALUES ("' + key + '", "' + value + '")');
		}   
	}, noop, noop);
});

retrieveState = (function(newState) {
	newState = {};
	// retrieve app state
	var db = window.openDatabase('appState', '1.0', 'App State', 512);
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM appState', [], function(tx, result) {
			for(var i=0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			newState[row.key] = row.value;
			}   
			console.log(newState);
		},noop);
	}, noop);
});
