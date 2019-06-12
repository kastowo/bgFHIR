var routesPaymentReconciliation = function(app, PaymentReconciliation){
	app.get('/:apikey/PaymentReconciliation', PaymentReconciliation.get.paymentReconciliation);
	app.get('/:apikey/PaymentReconciliationDetail', PaymentReconciliation.get.paymentReconciliationDetail);
	app.get('/:apikey/PaymentReconciliationProcessNote', PaymentReconciliation.get.paymentReconciliationProcessNote);
	
	app.post('/:apikey/PaymentReconciliation', PaymentReconciliation.post.paymentReconciliation);
	app.post('/:apikey/PaymentReconciliationDetail', PaymentReconciliation.post.paymentReconciliationDetail);
	app.post('/:apikey/PaymentReconciliationProcessNote', PaymentReconciliation.post.paymentReconciliationProcessNote);
	
	app.put('/:apikey/PaymentReconciliation/:_id?', PaymentReconciliation.put.paymentReconciliation);
	app.put('/:apikey/PaymentReconciliationDetail/:_id?/:dr?', PaymentReconciliation.put.paymentReconciliationDetail);
	app.put('/:apikey/PaymentReconciliationProcessNote/:_id?/:dr?', PaymentReconciliation.put.paymentReconciliationProcessNote);
}
module.exports = routesPaymentReconciliation;
