var routesCoverage = function(app, Coverage){
	app.get('/:apikey/Coverage', Coverage.get.coverage);
	app.get('/:apikey/CoveragePayorOrganization', Coverage.get.coveragePayorOrganization);
	app.get('/:apikey/CoveragePayorPatient', Coverage.get.coveragePayorPatient);
	app.get('/:apikey/CoveragePayorRelatedPerson', Coverage.get.coveragePayorRelatedPerson);
	
	app.post('/:apikey/Coverage', Coverage.post.coverage);
	
	app.put('/:apikey/Coverage/:_id?', Coverage.put.coverage);
	
}
module.exports = routesCoverage;
