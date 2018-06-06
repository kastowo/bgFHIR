var routesAccount = function(app, Account){
	//get method
	app.get('/:apikey/Account', Account.get.account);

	//post method
	app.post('/:apikey/Account', Account.post.account);
	app.post('/:apikey/Account/:account_id?/identifier', Account.post.identifier);
	app.post('/:apikey/Account/:account_id?/accountCoverage', Account.post.coverage);
	app.post('/:apikey/Account/:account_id?/accountGuarantor', Account.post.guarantor);

	//put method
	app.put('/:apikey/Account/:account_id?', Account.put.account);
	app.put('/:apikey/Account/:account_id?/identifier/:identifier_id?', Account.put.identifier);
	app.put('/:apikey/Account/:account_id?/accountCoverage/:account_coverage_id?', Account.put.coverage);
	app.put('/:apikey/Account/:account_id?/accountGuarantor/:account_guarantor_id?', Account.put.guarantor);

}
module.exports = routesAccount;