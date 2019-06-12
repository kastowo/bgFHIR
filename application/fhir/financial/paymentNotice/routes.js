var routesPaymentNotice = function(app, PaymentNotice){
	
	//get method
	app.get('/:apikey/PaymentNotice', PaymentNotice.get.paymentNotice);
	//post method
	app.post('/:apikey/PaymentNotice', PaymentNotice.post.paymentNotice);
	//put method
	app.put('/:apikey/PaymentNotice/:payment_notice_id?', PaymentNotice.put.paymentNotice);
	
	app.get('/:apikey/PaymentNotice/:payment_notice_id?/identifier/:identifier_id?', PaymentNotice.get.identifier);
	app.post('/:apikey/PaymentNotice/:payment_notice_id?/identifier', PaymentNotice.post.identifier);
	app.put('/:apikey/PaymentNotice/:payment_notice_id?/identifier/:identifier_id?', PaymentNotice.put.identifier);
}
module.exports = routesPaymentNotice;
