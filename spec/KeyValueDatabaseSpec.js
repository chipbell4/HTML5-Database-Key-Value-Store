describe('KeyValueDatabase', function() {
	var kvdb;
	beforeEach(function() {
		// erase the existing database
		var db = window.openDatabase('appstate', '1.0', 'Application State', 2056);
		function dropTable(tx) {
			tx.executeSql('drop table if exists appstate');
		}
		var dropFinished = false;
		runs(function() {
			db.transaction(dropTable, function(){}, function(){ dropFinished=true; });
		});
		waitsFor(function() { return dropFinished; });

		runs(function() {
			kvdb = new KeyValueDatabase();
		});
	});

	it('Should initialize the first time without any errors', function() {
		var finishedInit = false;
		runs(function() {
			kvdb.initialize(function() {
				finishedInit = true;
			});
		});

		waitsFor(function() {
			return finishedInit;
		});

		runs(function() {
			expect(kvdb.error).toEqual('');
			expect(kvdb.ready).toEqual(true);
		});
	});

	it('Should initialize the following times without any errors', function() {
		var finishedInit = false;
		runs(function() {
			kvdb.initialize(function() {
				finishedInit = true;
			});
		});

		waitsFor(function() {
			return finishedInit;
		});

		runs(function() {
			finishedInit = false;
			kvdb.initialize(function() {
				finishedInit = true;
			});
		});

		waitsFor(function() {
			return finishedInit;
		});

		runs(function() {
			expect(kvdb.error).toEqual('');
			expect(kvdb.ready).toEqual(true);
		});
		
	});

	describe('After Initialization', function() {
		beforeEach(function() {
			runs(function() {
				kvdb.initialize(function(){});
			});
			waitsFor(function() { return kvdb.ready; });
		});
		it('Should save without any errors', function() {
			var finishedSave = false;
			runs(function() {
				kvdb.save('key', 'value', function() {
					finishedSave = true;
				});
			});
			
			waitsFor(function() {
				return finishedSave;
			});

			runs(function() {
				expect(kvdb.error).toEqual('');
			});
		});

		it('Should retrieve without any errors', function() {
			var finishedRetrieve = false
			var value = null;
			runs(function() {
				kvdb.retrieve('key', function(val) {
					value = value;
					finishedRetrieve = true;
				});
			});

			waitsFor(function() { return finishedRetrieve; });

			runs(function() {
				expect(kvdb.error).toEqual('');
			});
		});

		it('Should retrieve the value it saved', function() {
			var finishedSave = false, finishedRetrieve = false;
			var key_to_save = 'hello';
			var value_to_save = 'world';
			var retrieved_value;
			
			// save
			runs(function() {
				kvdb.save(key_to_save, value_to_save, function() {
					finishedSave = true;
				});
			});
			waitsFor(function() { return finishedSave; });

			// retrieve
			runs(function() {
				kvdb.retrieve(key_to_save, function(val) {
					retrieved_value = val;
					finishedRetrieve = true;
				});
			});
			waitsFor(function() { return finishedRetrieve; });

			// assert values
			runs(function() {
				expect(retrieved_value).toEqual(value_to_save);
			});
		});
		
		it('Should retrieve null for a missing key', function() {
			var finishedRetrieve = false;
			var retrieved_value;
			
			// retrieve
			runs(function() {
				kvdb.retrieve('dummy_key', function(val) {
					retrieved_value = val;
					finishedRetrieve = true;
				});
			});
			waitsFor(function() { return finishedRetrieve; });
			// assert values
			runs(function() {
				expect(retrieved_value).toEqual(null);
			});
		});

		// it should save JSON properly
		it('Should save JSON properly', function() {
			var finishedSave = false;
			var key_to_save = 'hello';
			var value_to_save = {
				'key1': [2,3,3],
				'key2': "Hello",
			};
			value_to_save = JSON.stringify(value_to_save);
			
			// save
			runs(function() {
				kvdb.save(key_to_save, value_to_save, function() {
					finishedSave = true;
				});
			});
			waitsFor(function() { return finishedSave; });

			// assert values
			runs(function() {
				expect(kvdb.error).toEqual('');
			});
		});

		// it should return null for a null object passed in (and not a null string)
		it('Should retrieve null for a null saved value', function() {
			var finishedSave = false, finishedRetrieve = false;
			var key_to_save = 'hello';
			var value_to_save = null;
			var retrieved_value;
			
			// save
			runs(function() {
				kvdb.save(key_to_save, value_to_save, function() {
					finishedSave = true;
				});
			});
			waitsFor(function() { return finishedSave; });

			// retrieve
			runs(function() {
				kvdb.retrieve(key_to_save, function(val) {
					retrieved_value = val;
					finishedRetrieve = true;
				});
			});
			waitsFor(function() { return finishedRetrieve; });

			// assert values
			runs(function() {
				expect(retrieved_value).toEqual(value_to_save);
			});
		});

		it('Should clear the database when clear() is called', function() {
			var finishedSave = false, finishedClear = false, finishedRetrieve = false;
			var key_to_save = 'hello';
			var value_to_save = 'world';
			var retrieved_value;
			
			// save
			runs(function() {
				kvdb.save(key_to_save, value_to_save, function() {
					finishedSave = true;
				});
			});
			waitsFor(function() { return finishedSave; });

			runs(function() {
				kvdb.clear(function() {
					finishedClear = true;
				});
			});
			waitsFor(function() { return finishedClear; });

			runs(function() {
				kvdb.retrieve(key_to_save, function(val) {
					retrieved_value = val;
					finishedRetrieve = true;
				});
			});
			waitsFor(function() { return finishedRetrieve; });

			runs(function() {
				expect(retrieved_value).toEqual(null);
			});

		});
	});
});
