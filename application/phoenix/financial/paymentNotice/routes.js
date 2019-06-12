var routesPaymentNotice = function(app, PaymentNotice){
	app.get('/:apikey/PaymentNotice', PaymentNotice.get.paymentNotice);
	
	app.post('/:apikey/PaymentNotice', PaymentNotice.post.paymentNotice);
	
	app.put('/:apikey/PaymentNotice/:_id?', PaymentNotice.put.paymentNotice);
	
}
module.exports = routesPaymentNotice;
