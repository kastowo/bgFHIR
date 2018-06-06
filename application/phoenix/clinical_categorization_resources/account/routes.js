var routesAccount = function(app, Account){
	app.get('/:apikey/account', Account.get.account);
	app.get('/:apikey/accountGuarantor', Account.get.guarantor);
	app.get('/:apikey/accountCoverage', Account.get.coverage);
	
	app.post('/:apikey/account', Account.post.account);
	app.post('/:apikey/account-guarantor', Account.post.guarantor);
	app.post('/:apikey/account-coverage', Account.post.coverage); 
	
	app.put('/:apikey/account/:_id?', Account.put.account);
	app.put('/:apikey/account-guarantor/:_id?/:dr?', Account.put.guarantor);
	app.put('/:apikey/account-coverage/:_id?/:dr?', Account.put.coverage);
	
}
module.exports = routesAccount;