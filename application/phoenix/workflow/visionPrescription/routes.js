var routesVisionPrescription = function(app, VisionPrescription){
	app.get('/:apikey/VisionPrescription', VisionPrescription.get.visionPrescription);
	app.get('/:apikey/VisionPrescriptionDispense', VisionPrescription.get.visionPrescriptionDispense);
	
	app.post('/:apikey/VisionPrescription', VisionPrescription.post.visionPrescription);
	app.post('/:apikey/VisionPrescriptionDispense', VisionPrescription.post.visionPrescriptionDispense);
	
	app.put('/:apikey/VisionPrescription/:vision_prescription_id', VisionPrescription.put.visionPrescription);
	app.put('/:apikey/VisionPrescriptionDispense/:dispense_id', VisionPrescription.put.visionPrescriptionDispense);
	
}
module.exports = routesVisionPrescription;