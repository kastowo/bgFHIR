var routesMedicationStatement = function(app, MedicationStatement){
	app.get('/:apikey/MedicationStatement', MedicationStatement.get.medicationStatement);
	app.get('/:apikey/MedicationStatementDosage', MedicationStatement.get.medicationStatementDosage);
	
	app.post('/:apikey/MedicationStatement', MedicationStatement.post.medicationStatement);
	app.post('/:apikey/MedicationStatementDosage', MedicationStatement.post.medicationStatementDosage);
	
	app.put('/:apikey/MedicationStatement/:medication_statement_id', MedicationStatement.put.medicationStatement);
	app.put('/:apikey/MedicationStatementDosage/:dosage_id', MedicationStatement.put.medicationStatementDosage);
	
}
module.exports = routesMedicationStatement;