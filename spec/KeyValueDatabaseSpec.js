describe('KeyValueDatabase', function() {
	var kvdb = new KeyValueDatabase();
	it('Should retrieve the values that are saved', function() {
		var D = {'hello': 'world', 'chip': 'bell'};
		var saveDone = false;
		var actual = null;
		for(var k in D) {
			// run function
			runs(function() {
				kvdb.save(k, D[k], function(){ saveDone = true; });
			});
			waitsFor(function() { return saveDone; });
		}
	});
	// check that the key-values saved are the ones that get retrieved
	// check that calling reset cleans the table of old state
	// check that retrieving before a save is called returns a null
	// check that saving a value with an empty string as a key returns an error
	// check that saving a JSON string is successful and can be retrieved successfully
});
