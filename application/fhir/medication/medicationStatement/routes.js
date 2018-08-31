var routesMedicationStatement = function(app, MedicationStatement){
	app.get('/:apikey/MedicationStatement', MedicationStatement.get.medicationStatement);
	
	app.post('/:apikey/MedicationStatement', MedicationStatement.post.medicationStatement);
	
	app.put('/:apikey/MedicationStatement/:medicationStatement_id?', MedicationStatement.put.medicationStatement);
	
}
module.exports = routesMedicationStatement