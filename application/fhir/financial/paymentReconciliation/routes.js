var routesPaymentReconciliation = function(app, PaymentReconciliation){
	
	//get method
	app.get('/:apikey/PaymentReconciliation', PaymentReconciliation.get.paymentReconciliation);
	//post method
	app.post('/:apikey/PaymentReconciliation', PaymentReconciliation.post.paymentReconciliation);
	app.post('/:apikey/PaymentReconciliation/:payment_reconciliation_id?/PaymentReconciliationDetail', PaymentReconciliation.post.paymentReconciliationDetail);
	app.post('/:apikey/PaymentReconciliation/:payment_reconciliation_id?/PaymentReconciliationProcessNote', PaymentReconciliation.post.paymentReconciliationProcessNote);
	//put method
	app.put('/:apikey/PaymentReconciliation/:payment_reconciliation_id?', PaymentReconciliation.put.paymentReconciliation);
	app.put('/:apikey/PaymentReconciliation/:payment_reconciliation_id?/PaymentReconciliationDetail/:payment_reconciliation_detail_id?', PaymentReconciliation.put.paymentReconciliationDetail);
	app.put('/:apikey/PaymentReconciliation/:payment_reconciliation_id?/PaymentReconciliationProcessNote/:payment_reconciliation_process_note_id?', PaymentReconciliation.put.paymentReconciliationProcessNote);
	
	app.get('/:apikey/PaymentReconciliation/:payment_reconciliation_id?/identifier/:identifier_id?', PaymentReconciliation.get.identifier);
	app.post('/:apikey/PaymentReconciliation/:payment_reconciliation_id?/identifier', PaymentReconciliation.post.identifier);
	app.put('/:apikey/PaymentReconciliation/:payment_reconciliation_id?/identifier/:identifier_id?', PaymentReconciliation.put.identifier);
}
module.exports = routesPaymentReconciliation;
