var routesMedicationStatement = function(app, MedicationStatement){
	app.get('/:apikey/MedicationStatement', MedicationStatement.get.medicationStatement);
	app.get('/:apikey/MedicationStatement/:medication_statement_id?/identifier/:identifier_id?', MedicationStatement.get.identifier);
	app.get('/:apikey/MedicationStatement/:medication_statement_id?/dosage/:dosage_id?', MedicationStatement.get.medicationStatementDosage);

	app.post('/:apikey/MedicationStatement', MedicationStatement.post.medicationStatement);
	app.post('/:apikey/MedicationStatement/:medication_statement_id?/identifier', MedicationStatement.post.identifier);
	app.post('/:apikey/MedicationStatement/:medication_statement_id?/Dosage', MedicationStatement.post.dosage);

	app.put('/:apikey/MedicationStatement/:medication_statement_id?', MedicationStatement.put.medicationStatement);
	app.put('/:apikey/MedicationStatement/:medication_statement_id?/identifier/:identifier_id?', MedicationStatement.put.identifier);
	app.put('/:apikey/MedicationStatement/:medication_statement_id?/Dosage/:dosage_id?', MedicationStatement.put.dosage);
	app.put('/:apikey/MedicationStatement/:medication_statement_id?/Dosage/:dosage_id?/timing/:timing_id?', MedicationStatement.put.timing);
}
module.exports = routesMedicationStatement