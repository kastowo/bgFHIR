var routesProcessResponse = function(app, ProcessResponse){
	app.get('/:apikey/ProcessResponse', ProcessResponse.get.processResponse);
	app.get('/:apikey/ProcessNote', ProcessResponse.get.processNote);
	
	app.post('/:apikey/ProcessResponse', ProcessResponse.post.processResponse);
	app.post('/:apikey/ProcessNote', ProcessResponse.post.processNote);
	
	app.put('/:apikey/ProcessResponse/:process_response_id', ProcessResponse.put.processResponse);
	app.put('/:apikey/ProcessNote/:process_note_id', ProcessResponse.put.processNote);
	
}
module.exports = routesProcessResponse;