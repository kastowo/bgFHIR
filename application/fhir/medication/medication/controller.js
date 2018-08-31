var Apiclient = require('apiclient');
var sha1 = require('sha1');
var validator = require('validator');
var bytes = require('bytes');
var uniqid = require('uniqid');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

var host = configYaml.fhir.host;
var port = configYaml.fhir.port;

//event emitter
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

//phoenix
//query data melalui rest phoenix
var seedPhoenix = require(path.resolve('../../application/config/seed_phoenix.json'));
	seedPhoenix.base.hostname = configYaml.phoenix.host;
	seedPhoenix.base.port 		= configYaml.phoenix.port;
	
var Api = new Apiclient(seedPhoenix);

seedPhoenixFHIR = require(path.resolve('../../application/config/seed_phoenix_fhir.json'));
seedPhoenixFHIR.base.hostname = configYaml.phoenix.host;
seedPhoenixFHIR.base.port 	  = configYaml.phoenix.port;

var ApiFHIR  = new Apiclient(seedPhoenixFHIR);

var controller = {
	get: {
		medication : function getMedication(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			//params from query string
			var medicationId = req.query._id;
			var code = req.query.code;
			var container = req.query.container;
			var form = req.query.form;
			var ingredient = req.query.ingredient;
			var ingredient_code = req.query.ingredient_code;
			var manufacturer = req.query.manufacturer;
			var over_the_counter = req.query.over_the_counter;
			var package_item = req.query.package_item;
			var package_item_code = req.query.package_item_code;
			var status = req.query.status;
			
			var qString = {};
			if(typeof medicationId !== 'undefined'){
				if(!validator.isEmpty(medicationId)){
					qString._id = medicationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication id is required."});
				}
			}
			
			if(typeof code !== 'undefined'){
				if(!validator.isEmpty(code)){
					qString.code = code;
				}else{
					res.json({"err_code": 1, "err_msg": "Code is empty."});
				}
			}
			
			if(typeof container !== 'undefined'){
				if(!validator.isEmpty(container)){
					qString.container = container; 
				}else{
					res.json({"err_code": 1, "err_msg": "Ccontainer is empty."});
				}
			}
			
			if(typeof form !== 'undefined'){
				if(!validator.isEmpty(form)){
					qString.form = form; 
				}else{
					res.json({"err_code": 1, "err_msg": "Form is empty."});
				}
			}
			
			if(typeof ingredient !== 'undefined'){
				if(!validator.isEmpty(ingredient)){
					qString.ingredient = ingredient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Ingredient is empty."});
				}
			}
			
			if(typeof ingredient_code !== 'undefined'){
				if(!validator.isEmpty(ingredient_code)){
					qString.ingredient_code = ingredient_code; 
				}else{
					res.json({"err_code": 1, "err_msg": "Ingredient code is empty."});
				}
			}
			
			if(typeof manufacturer !== 'undefined'){
				if(!validator.isEmpty(manufacturer)){
					qString.manufacturer = manufacturer; 
				}else{
					res.json({"err_code": 1, "err_msg": "Manufacturer is empty."});
				}
			}
			
			if(typeof over_the_counter !== 'undefined'){
				if(!validator.isEmpty(over_the_counter)){
					qString.over_the_counter = over_the_counter; 
				}else{
					res.json({"err_code": 1, "err_msg": "Over the counter is empty."});
				}
			}
			
			if(typeof package_item !== 'undefined'){
				if(!validator.isEmpty(package_item)){
					qString.package_item = package_item; 
				}else{
					res.json({"err_code": 1, "err_msg": "Package item is empty."});
				}
			}
			
			if(typeof package_item_code !== 'undefined'){
				if(!validator.isEmpty(package_item_code)){
					qString.package_item_code = package_item_code; 
				}else{
					res.json({"err_code": 1, "err_msg": "Package item code is empty."});
				}
			}
			
			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "Status is empty."});
				}
			}
			
			seedPhoenixFHIR.path.GET = {
				"Medication" : {
					"location": "%(apikey)s/Medication",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Medication', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var medication = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(medication.err_code == 0){
								//cek jumdata dulu
								if(medication.data.length > 0){
									newMedication = [];
									for(i=0; i < medication.data.length; i++){
										myEmitter.once('getMedicationIngredient', function(medication, index, newMedication, countMedication){
												qString = {};
												qString.medication_id = medication.id;
												seedPhoenixFHIR.path.GET = {
													"MedicationIngredient" : {
														"location": "%(apikey)s/MedicationIngredient",
														"query": qString
													}
												}

												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

												ApiFHIR.get('MedicationIngredient', {"apikey": apikey}, {}, function(error, response, body){
													medicationIngredient = JSON.parse(body);
													if(medicationIngredient.err_code == 0){
														var objectMedication = {};
														objectMedication.resourceType = medication.resourceType;
														objectMedication.id = medication.id;
														objectMedication.identifier = identifier.data;
														objectMedication.code = medication.code;
														objectMedication.status = medication.status;
														objectMedication.isBrand = medication.isBrand;
														objectMedication.isOverTheCounter = medication.isOverTheCounter;
														objectMedication.manufacturer = medication.manufacturer;
														objectMedication.form = medication.form;
														objectMedication.ingredient = medicationIngredient.data;

														newMedication[index] = objectMedication;

														myEmitter.once('getMedicationPackage', function(medication, index, newMedication, countMedication){
															qString = {};
															qString.medication_id = medication.id;
															seedPhoenixFHIR.path.GET = {
																"MedicationPackage" : {
																	"location": "%(apikey)s/MedicationPackage",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('MedicationPackage', {"apikey": apikey}, {}, function(error, response, body){
																medicationPackage = JSON.parse(body);

																if(medicationPackage.err_code == 0){
																	var objectMedication = {};
																	objectMedication.resourceType = medication.resourceType;
																	objectMedication.id = medication.id;
																	objectMedication.code = medication.code;
																	objectMedication.status = medication.status;
																	objectMedication.isBrand = medication.isBrand;
																	objectMedication.isOverTheCounter = medication.isOverTheCounter;
																	objectMedication.manufacturer = medication.manufacturer;
																	objectMedication.form = medication.form;
																	objectMedication.ingredient = medication.ingredient;
																	objectMedication.package = medicationPackage.data;

																	newMedication[index] = objectMedication;

																	myEmitter.once('getMedicationPackageContent', function(medication, index, newMedication, countMedication){
																		qString = {};
																		qString.package_id = medication.package.id;
																		seedPhoenixFHIR.path.GET = {
																			"MedicationPackageContent" : {
																				"location": "%(apikey)s/MedicationPackageContent",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																		ApiFHIR.get('MedicationPackageContent', {"apikey": apikey}, {}, function(error, response, body){
																			medicationPackageContent = JSON.parse(body);

																			if(medicationPackageContent.err_code == 0){
																				var objectMedication = {};
																				objectMedication.resourceType = medication.resourceType;
																				objectMedication.id = medication.id;
																				objectMedication.code = medication.code;
																				objectMedication.status = medication.status;
																				objectMedication.isBrand = medication.isBrand;
																				objectMedication.isOverTheCounter = medication.isOverTheCounter;
																				objectMedication.manufacturer = medication.manufacturer;
																				objectMedication.form = medication.form;
																				objectMedication.ingredient = medication.ingredient;
																				objectMedication.package = medication.package;
																				objectMedication.package.content = medicationPackageContent.data;

																				newMedication[index] = objectMedication;

																				myEmitter.once('getMedicationPackageBatch', function(medication, index, newMedication, countMedication){
																					qString = {};
																					qString.package_id = medication.package.id;
																					seedPhoenixFHIR.path.GET = {
																						"MedicationPackageBatch" : {
																							"location": "%(apikey)s/MedicationPackageBatch",
																							"query": qString
																						}
																					}

																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																					ApiFHIR.get('MedicationPackageBatch', {"apikey": apikey}, {}, function(error, response, body){
																						medicationPackageBatch = JSON.parse(body);

																						if(medicationPackageBatch.err_code == 0){
																							var objectMedication = {};
																							objectMedication.resourceType = medication.resourceType;
																							objectMedication.id = medication.id;
																							objectMedication.code = medication.code;
																							objectMedication.status = medication.status;
																							objectMedication.isBrand = medication.isBrand;
																							objectMedication.isOverTheCounter = medication.isOverTheCounter;
																							objectMedication.manufacturer = medication.manufacturer;
																							objectMedication.form = medication.form;
																							objectMedication.ingredient = medication.ingredient;
																							objectMedication.package = medication.package;
																							objectMedication.package.batch = medicationPackageBatch.data;

																							newMedication[index] = objectMedication;

																							if(index == countMedication -1 ){
																								res.json({"err_code": 0, "data":newMedication});				
																							}

																						}else{
																							res.json(medicationPackageBatch);			
																						}
																					})
																				})
																				myEmitter.emit('getMedicationPackageBatch', objectMedication, index, newMedication, countMedication);

																			}else{
																				res.json(medicationPackageContent);			
																			}
																		})
																	})
																	myEmitter.emit('getMedicationPackageContent', objectMedication, index, newMedication, countMedication);
																}else{
																	res.json(medicationPackage);			
																}
															})
														})
														myEmitter.emit('getMedicationPackage', objectMedication, index, newMedication, countMedication);			
													}else{
														res.json(medicationIngredient);			
													}
												})
											})				
										myEmitter.emit("getMedicationIngredient", medication.data[i], i, newMedication, medication.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Medication is empty."});	
								}
							}else{
								res.json(medication);
							}
						}
					});
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		}
	},
	post: {
		medication: function postMedication(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var err_code = 0;
			var err_msg = "";
	//console.log(req.body);
			//input check 
			
			//set by sistem
			if(typeof req.body.code !== 'undefined'){
				var medicationCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(medicationCode)){
					err_code = 2;
					err_msg = "Medication code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Medication request.";
			}
			
			//medication status
			if(typeof req.body.status !== 'undefined'){
				var medicationStatus =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(medicationStatus)){
					err_code = 2;
					err_msg = "Medication status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication request.";
			}
			
			//medication isBrand
			if(typeof req.body.isBrand !== 'undefined'){
				var medicationIsBrand =  req.body.isBrand.trim().toLowerCase();
				if(medicationIsBrand !== 'true' || medicationIsBrand !== 'flase'){
					err_code = 3;
					err_msg = "Medication is brand is't boolean";
				}
				if(validator.isEmpty(medicationIsBrand)){
					err_code = 2;
					err_msg = "Medication is brand is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'is brand' in json Medication request.";
			}
			
			//medication isOverTheCounter
			if(typeof req.body.isOverTheCounter !== 'undefined'){
				var medicationIsOverTheCounter =  req.body.isOverTheCounter.trim().toLowerCase();
				if(medicationIsOverTheCounter !== 'true' || medicationIsOverTheCounter !== 'flase'){
					err_code = 3;
					err_msg = "Medication is over the counter is't boolean";
				}
				if(validator.isEmpty(medicationIsOverTheCounter)){
					err_code = 2;
					err_msg = "Medication is over the counter is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'is over the counter' in json Medication request.";
			}
			
			//medication manufacturer
			if(typeof req.body.manufacturer !== 'undefined'){
				var medicationManufacturer =  req.body.manufacturer.trim().toLowerCase();
				if(validator.isEmpty(medicationManufacturer)){
					medicationManufacturer = "";
				}
			}else{
				medicationManufacturer = "";
			}
			
			//medication form
			if(typeof req.body.form !== 'undefined'){
				var medicationForm =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(medicationForm)){
					err_code = 2;
					err_msg = "Medication form is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'form' in json Medication request.";
			}
			
			//medication reportOrigin
			if(typeof req.body.ingredient.item.itemCodeableConcept !== 'undefined'){
				var medicationIngredientItemItemCodeableConcept =  req.body.ingredient.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationIngredientItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "Medication item codeable concept is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item codeable concept' in json Medication ingredient request.";
			}

			if(typeof req.body.ingredient.item.itemReference !== 'undefined'){
				var medicationIngredientItemItemReference =  req.body.ingredient.item.itemReference.trim().toLowerCase();
				if(validator.isEmpty(medicationIngredientItemItemReference)){
					/*err_code = 2;
					err_msg = "Adverse Event subject is required";*/
					medicationIngredientItemItemReferenceSubstance = '';
					medicationIngredientItemItemReferenceMedication  = '';
				} else {
					var res = medicationIngredientItemItemReference.substring(0, 3);
					if(res == 'med'){
						medicationIngredientItemItemReferenceSubstance = '';
						medicationIngredientItemItemReferenceMedication  = medicationIngredientItemItemReference;
					} else {
						medicationIngredientItemItemReferenceSubstance = medicationIngredientItemItemReference
						medicationIngredientItemItemReferenceMedication  = '';
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item Reference' in json Medication ingredient request.";
			}
			
			if(typeof req.body.ingredient.isActive !== 'undefined'){
				var medicationIsActive =  req.body.ingredient.isActive.trim().toLowerCase();
				if(medicationIsActive !== 'true' || medicationIsActive !== 'flase'){
					err_code = 3;
					err_msg = "Medication is active is't boolean";
				}
				if(validator.isEmpty(medicationIsActive)){
					err_code = 2;
					err_msg = "Medication is active is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'is active' in json Medication request.";
			}
			
			if(typeof req.body.ingredient.amount !== 'undefined'){
				amount = req.body.ingredient.amount;
				if(amount.indexOf("to") > 0){
					arrAmount = amount.split("to");
					medicationAmountNumerator = arrAmount[0];
					medicationAmountDenominator = arrAmount[1];

					if(!regex.test(medicationAmountNumerator) && !regex.test(medicationAmountDenominator)){
						err_code = 2;
						err_msg = "ingredient amount invalid date format.";
					}	
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'amount' in json ingredient request.";
			}
			
			
			//medication package
			if(typeof req.body.package.container !== 'undefined'){
				var medicationPackageContainer =  req.body.package.container.trim().toLowerCase();
				if(validator.isEmpty(medicationPackageContainer)){
					err_code = 2;
					err_msg = "Medication  container is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key ' container' in json Medication request.";
			}
			
			if(typeof req.body.package.item.itemCodeableConcept !== 'undefined'){
				var medicationPackageItemItemCodeableConcept =  req.body.package.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationPackageItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "Medication package item codeable concept is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item codeable concept' in json Medication package request.";
			}

			if(typeof req.body.package.item.itemReference !== 'undefined'){
				var medicationPackageItemItemReference =  req.body.package.item.itemReference.trim().toLowerCase();
				if(validator.isEmpty(medicationPackageItemItemReference)){
					medicationPackageItemItemReference = "";
				}
			}else{
				medicationPackageItemItemReference = "";
			}
			
			if(typeof req.body.package.item.amount !== 'undefined'){
				var medicationPackageItemAmount =  req.body.package.item.amount.trim().toLowerCase();
				if(validator.isEmpty(medicationPackageItemAmount)){
					err_code = 2;
					err_msg = "Medication package amount is required";
				}
			}else{
				medicationPackageItemAmount = "";
			}
			
			if(typeof req.body.package.batch.lotNumber !== 'undefined'){
				var medicationPackageBatchLotNumber =  req.body.package.batch.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(medicationPackageBatchLotNumber)){
					err_code = 2;
					err_msg = "Medication package batch lot number is required";
				}
			}else{
				medicationPackageBatchLotNumber = "";
			}
			
			//date
			if(typeof req.body.package.batch.expirationDate !== 'undefined'){
				var medicationPackageBatchExpirationDate = req.body.package.batch.expirationDate;
				if(!regex.test(medicationPackageBatchExpirationDate)){
						err_code = 2;
						err_msg = "Medication package batch expiration date invalid date format.";
					}	
			}else{
				medicationPackageBatchExpirationDate = "";
			}
			
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, medicationCode, 'MEDICATION_CODES', function(resMedicationCode){
							if(resMedicationCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, medicationStatus, 'MEDICATION_STATUS', function(resMedicationStatusCode){
									if(resMedicationStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, medicationForm, 'MEDICATION_FORM_CODES', function(resMedicationForm){
											if(resMedicationForm.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, medicationPackageContainer, 'MEDICATION_PACKAGE_FORM', function(resMedicationPackageContainer){
													if(resMedicationPackageContainer.err_code > 0){
														checkCode(apikey, medicationPackageItemItemCodeableConcept, 'IMMUNIZATION_SITE', function(resMedicationPackageItemItemCodeableConcept){
															if(resMedicationPackageItemItemCodeableConcept.err_code > 0){
																		
				myEmitter.prependOnceListener('checkMedicationId', function() {
					//proses insert
					//set uniqe id
					var unicId = uniqid.time();
					var medicationId = 'med' + unicId;
					var medicationIngredientId = 'mei' + unicId;
					var medicationPackageId = 'mep' + unicId;
					var medicationPackageContentId = 'mpc' + unicId;
					var medicationPackageBatchId = 'mpb' + unicId;

					dataMedication = {
						"medication_id" : medicationId,
						"code" : medicationCode,
						"status" : medicationStatus,
						"is_brand" : medicationIsBrand,
						"is_over_the_counter" : medicationIsOverTheCounter,
						"manufacturer" : medicationManufacturer,
						"form" : medicationForm
					}
					ApiFHIR.post('Medication', {"apikey": apikey}, {body: dataMedication, json: true}, function(error, response, body){
						medication = body;
						if(medication.err_code > 0){
							res.json(medication);	
						}
					})
					

					dataMedicationIngredient = {
						"ingredient_id" : medicationIngredientId,
						"item_codeable_concept" : medicationIngredientItemItemCodeableConcept,
						"item_reference_substance" : medicationIngredientItemItemReferenceSubstance,
						"item_reference_medication" : medicationIngredientItemItemReferenceMedication,
						"is_active" : medicationIsActive,
						"amount_numerator" : medicationAmountNumerator,
						"amount_denominator" : medicationAmountDenominator,
						"medication_id" : medicationId
					}
					ApiFHIR.post('MedicationIngredient', {"apikey": apikey}, {body: dataMedicationIngredient, json: true}, function(error, response, body){
						medicationIngredient = body;
						if(medicationIngredient.err_code > 0){
							//console.log(medicationPractitioner);
							res.json(medicationIngredient);	
						}
					})

					//reason
					dataMedicationPackage = {
						"package_id" : medicationPackageId,
						"container" : medicationPackageContainer,
						"medication_id": medicationId
					}
					ApiFHIR.post('MedicationPackage', {"apikey": apikey}, {body: dataMedicationPackage, json: true}, function(error, response, body){
						medicationPackage = body;
						if(medicationPackage.err_code > 0){
							res.json(medicationPackage);	
						}
					})

					//human name
					dataMedicationPackageContent = {
						"content_id" : medicationPackageContentId,
						"item_codeable_concept" : medicationPackageItemItemCodeableConcept,
						"item_reference" : medicationPackageItemItemReference,
						"amount" : medicationPackageItemAmount,
						"package_id" : medicationPackageId
													}

					ApiFHIR.post('MedicationPackageContent', {"apikey": apikey}, {body: dataMedicationPackageContent, json: true}, function(error, response, body){
						medicationPackageContent = body;
						if(medicationPackageContent.err_code > 0){
							res.json(medicationPackageContentss);	
						}
					})

					dataMedicationPackageBatch = {
						"batch_id" : medicationPackageBatchId,
						"iot_number" : medicationPackageBatchLotNumber,
						"expiration_date" : medicationPackageBatchExpirationDate,
						"package_id" : medicationPackageId
					}

					ApiFHIR.post('MedicationPackageBatch', {"apikey": apikey}, {body: dataMedicationPackageBatch, json: true}, function(error, response, body){
						medicationPackageBatch = body;
						if(medicationPackageBatch.err_code > 0){
							res.json(medicationPackageBatch);	
						}
					})

					res.json({"err_code": 0, "err_msg": "Medication has been add.", "data": [{"_id": medicationId}]})
				});

				myEmitter.prependOnceListener('checkMedicationManufacturerId', function(){
					if(validator.isEmpty(medicationManufacturer)){
						myEmitter.emit('checkMedicationId');
					}else{
						checkUniqeValue(apikey, "ORGANIZATION_ID|" + medicationManufacturer, 'ORGANIZATION', function(resManufacturerID){
							if(resManufacturerID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationId');
							}else{
								res.json({"err_code": 503, "err_msg": "Manufaturer id not found."});	
							}
						})
					}
				})
																		
				myEmitter.prependOnceListener('checkItemReferenceSubstanceId', function(){
					if(validator.isEmpty(medicationIngredientItemItemReferenceSubstance)){
						myEmitter.emit('checkMedicationManufacturerId');
					}else{
						checkUniqeValue(apikey, "SUBSTANCE_ID|" + medicationIngredientItemItemReferenceSubstance, 'SUBSTANCE', function(resItemReferenceSubstanceId){
							if(resItemReferenceSubstanceId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationManufacturerId');
							}else{
								res.json({"err_code": 503, "err_msg": "Substance id not found."});	
							}
						})
					}
				})

				myEmitter.prependOnceListener('checkItemReferenceMedication', function(){
					if(validator.isEmpty(medicationIngredientItemItemReferenceMedication)){
						myEmitter.emit('checkItemReferenceSubstanceId');
					}else{
						checkUniqeValue(apikey, "MEDICATION_ID|" + medicationIngredientItemItemReferenceMedication, 'MEDICATION', function(resItemReferenceMedicationId){
							if(resItemReferenceMedicationId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkItemReferenceSubstanceId');
							}else{
								res.json({"err_code": 503, "err_msg": "Item Reference Substance id not found."});	
							}
						})
					}
				})

				if(validator.isEmpty(medicationPackageItemItemReference)){
					myEmitter.emit('checkItemReferenceMedication');
				}else{
					checkUniqeValue(apikey, "MEDICATION_ID|" + medicationPackageItemItemReference, 'MEDICATION', function(resPackageItemItemReference){
						if(resPackageItemItemReference.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							myEmitter.emit('checkItemReferenceMedication');
						}else{
							res.json({"err_code": 501, "err_msg": "Item Reference Medication id is not exist."});
						}
					})
				}	
																			
															
															}else{
																res.json({"err_code": 509, "err_msg": "Medication Package Item Item Codeable Concept Code not found"});
															}
														})
													}else{
														res.json({"err_code": 509, "err_msg": "Medication package container Code not found"});
													}
												})
											}else{
												res.json({"err_code": 508, "err_msg": "Medication form code not found"});
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Medication status code not found"});		
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Medication code not found"});
							}
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}	
		}
	},
	put:{
		medication: function putMedication(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			
			var medicationId = req.params.medication_id;
			var err_code = 0;
			var err_msg = "";

			var dataMedication = {};
			
			//input check 
			if(typeof medicationId !== 'undefined'){
				if(validator.isEmpty(medicationId)){
					err_code = 2;
					err_msg = "Medication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication id is required";
			}
			
			if(typeof req.body.active !== 'undefined'){
				active =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					err_code = 2;
					err_msg = "Active is required.";
				}else{
					dataMedication.active = active;
				}
			}else{
				active = "";
			}
			
			if(typeof req.body.type !== 'undefined'){
				type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					err_code = 2;
					err_msg = "Type is required.";
				}else{
					dataMedication.type = type;
				}
			}else{
				type = "";
			}
			
			if(typeof req.body.name !== 'undefined'){
				name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					err_code = 2;
					err_msg = "Name is required.";
				}else{
					dataMedication.name = name;
				}
			}else{
				name = "";
			}
			
			if(typeof req.body.alias !== 'undefined'){
				alias =  req.body.alias.trim().toLowerCase();
				if(validator.isEmpty(alias)){
					err_code = 2;
					err_msg = "Alias is required.";
				}else{
					dataMedication.alias = alias;
				}
			}else{
				alias = "";
			}			
			
			//Endpoint managingMedication
			if(typeof req.body.partOf !== 'undefined'){
				parentId =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(parentId)){
					err_code = 2;
					err_msg = "Managing Medication is required.";
				}else{
					dataMedication.parentId = parentId;
				}
			}else{
				parentId = "";
			}
			
			//Endpoint managingMedication
			if(typeof req.body.endpoint !== 'undefined'){
				endpointId =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpointId)){
					err_code = 2;
					err_msg = "Endpoint is required.";
				}else{
					dataMedication.endpointId = endpointId;
				}
			}else{
				endpointId = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkMedicationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + medicationId, 'IMMUNIZATION', function(resMedicationID){
								if(resMedicationID.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('medication', {"apikey": apikey, "_id": medicationId}, {body: dataMedication, json: true}, function(error, response, body){
											medication = body;
											if(medication.err_code > 0){
												res.json(medication);	
											}else{
												res.json({"err_code": 0, "err_msg": "Medication has been update.", "data": [{"_id": medicationId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkType', function(){
							if(validator.isEmpty(type)){
								myEmitter.emit('checkMedicationID');
							}else{
								checkCode(apikey, type, 'IMMUNIZATION_TYPE', function(resStatusCode){
									if(resStatusCode.err_code > 0){
										myEmitter.emit('checkMedicationID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Type Code not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkManagingMedication', function(){
							if(validator.isEmpty(parentId)){
								myEmitter.emit('checkType');
							}else{
								checkUniqeValue(apikey, "IMMUNIZATION_ID|" + parentId, 'IMMUNIZATION', function(resMedicationID){
									if(resMedicationID.err_code > 0){
										myEmitter.emit('checkType');				
									}else{
										res.json({"err_code": 503, "err_msg": "Parent Id Medication, medication id not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(endpointId)){
							myEmitter.emit('checkManagingMedication');	
						}else{
							checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
								if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkManagingMedication');
								}else{
									res.json({"err_code": 501, "err_msg": "Endpoint id not found"});
								}
							})
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}	
		}
	}
}

function checkApikey(apikey, ipAddress, callback){
	//method, endpoint, params, options, callback
	Api.get('check_apikey', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		//check user_role_id == 1 <-- admin/root
		  		if(user.data[0].user_role_id == 1){
		  			x({"err_code": 0, "status": "root", "user_role_id": user.data[0].user_role_id, "user_id": user.data[0].user_id});	
		  		}else{
			  		//cek apikey
				  	if(apikey == user.data[0].user_apikey){
				  		//ipaddress
					  	dataIpAddress = user.data[0].user_ip_address;
					  	if(dataIpAddress.indexOf(ipAddress) >= 0){
					  		//user is active
					  		if(user.data[0].user_is_active){
					  			//cek data user terpenuhi
					  			x({"err_code": 0, "status": "active", "user_role_id": user.data[0].user_role_id, "user_id": user.data[0].user_id});	
					  		}else{
					  			x({"err_code": 5, "err_msg": "User is not active"});	
					  		}
					  	}else{
					  		x({"err_code": 4, "err_msg": "Ip Address not registered"});
					  	}
				  	}else{
				  		x({"err_code": 3, "err_msg": "Wrong apikey"});
				  	}
		  		}
		  		
		  	}else{
		  			x({"err_code": 2, "err_msg": "Wrong apikey"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "checkApikey"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkId(apikey, tableId, tableName, callback){
	ApiFHIR.get('checkId', {"apikey": apikey, "id": tableId, "name": tableName}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	dataId = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(dataId.err_code == 0){
		  	//cek jumdata dulu
		  	if(dataId.data.length > 0){
		  			x({"err_code": 0, "err_msg": "Id is valid."})
		  	}else{
		  			x({"err_code": 2, "err_msg": "Id is not found."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": dataId.error, "application": "API FHIR", "function": "checkId"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkCode(apikey, code, tableName, callback){
	ApiFHIR.get('checkCode', {"apikey": apikey, "code": code, "name": tableName}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	dataId = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(dataId.err_code == 0){
		  	//cek jumdata dulu
		  	if(dataId.data.length > 0){
		  			x({"err_code": 2, "err_msg": "Code is already exist."})
		  	}else{
		  			x({"err_code": 0, "err_msg": "Code is available to used."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": dataId.error, "application": "API FHIR", "function": "checkCode"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkUniqeValue(apikey, fdValue, tableName, callback){
	ApiFHIR.get('checkUniqeValue', {"apikey": apikey, "fdvalue": fdValue, "tbname": tableName}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	dataId = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(dataId.err_code == 0){
		  	//cek jumdata dulu
		  	if(dataId.data.length > 0){
		  			x({"err_code": 2, "err_msg": "The value is already exist."})
		  	}else{
		  			x({"err_code": 0, "err_msg": "The value is available to insert."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": dataId.error, "application": "API FHIR", "function": "checkCode"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkGroupQouta(apikey, groupId, callback){
	ApiFHIR.get('checkGroupQouta', {"apikey": apikey, "group_id": groupId}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	quota = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(quota.err_code == 0){
		  	//cek jumdata dulu
		  	if(quota.data.length > 0){
		  		groupQuota = parseInt(quota.data[0].quantity);
		  		memberCount = parseInt(quota.data[0].total_member);

		  		if(memberCount <= groupQuota){
		  			x({"err_code": 0, "err_msg": "Group quota is ready"});	
		  		}else{
		  			x({"err_code": 1, "err_msg": "Group quota is full, total member "+ groupQuota});	
		  		}
		  	}else{
		  			x({"err_code": 0, "err_msg": "Group quota is ready"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": quota, "application": "API FHIR", "function": "checkGroupQouta"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkMemberEntityGroup(apikey, entityId, groupId, callback){
	ApiFHIR.get('checkMemberEntityGroup', {"apikey": apikey, "entity_id": entityId ,"group_id": groupId}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	entity = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(entity.err_code == 0){
		  	if(parseInt(entity.data.length) > 0){
		  		x({"err_code": 2, "err_msg": "Member entity already exist in this group."});	
		  	}else{
	  			x({"err_code": 0, "err_msg": "Member not found in this group."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": entity, "application": "API FHIR", "function": "checkMemberEntityGroup"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

module.exports = controller;