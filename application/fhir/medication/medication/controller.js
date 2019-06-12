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
			var qString = {};
console.log(req.query);
			//params from query string
			var medicationId = req.query._id;
			var code = req.query.code;
			var container = req.query.container;
			var form = req.query.form;
			var ingredient = req.query.ingredient;
			var ingredientCode = req.query.ingredientCode;
			var manufacturer = req.query.manufacturer;
			var overTheCounter = req.query.overTheCounter;
			var packageItem = req.query.packageItem;
			var packageItemCode = req.query.packageItemCode;
			var status = req.query.status;
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if(typeof offset !== 'undefined'){
				if(!validator.isEmpty(offset)){
					qString.offset = offset; 
				}else{
					res.json({"err_code": 1, "err_msg": "offset id is empty."});
				}
			}

			if(typeof limit !== 'undefined'){
				if(!validator.isEmpty(limit)){
					if(!validator.isInt(limit)){
						err_code = 2;
						err_msg = "limit must be number";
					} else{
						qString.limit = limit; 	
					}
				}else{
					res.json({"err_code": 1, "err_msg": "limit is empty."});
				}
			}

			if(typeof medicationId !== 'undefined'){
				if(!validator.isEmpty(medicationId)){
					qString.medicationId = medicationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Medication Id is required."});
				}
			}

			if(typeof code !== 'undefined'){
				if(!validator.isEmpty(code)){
					qString.code = code; 
				}else{
					res.json({"err_code": 1, "err_msg": "code is empty."});
				}
			}

			if(typeof container !== 'undefined'){
				if(!validator.isEmpty(container)){
					qString.container = container; 
				}else{
					res.json({"err_code": 1, "err_msg": "container is empty."});
				}
			}

			if(typeof form !== 'undefined'){
				if(!validator.isEmpty(form)){
					qString.form = form; 
				}else{
					res.json({"err_code": 1, "err_msg": "form is empty."});
				}
			}

			if(typeof ingredient !== 'undefined'){
				if(!validator.isEmpty(ingredient)){
					qString.ingredient = ingredient; 
				}else{
					res.json({"err_code": 1, "err_msg": "ingredient is empty."});
				}
			}

			if(typeof ingredientCode !== 'undefined'){
				if(!validator.isEmpty(ingredientCode)){
					qString.ingredientCode = ingredientCode; 
				}else{
					res.json({"err_code": 1, "err_msg": "ingredient code is empty."});
				}
			}

			if(typeof manufacturer !== 'undefined'){
				if(!validator.isEmpty(manufacturer)){
					qString.manufacturer = manufacturer; 
				}else{
					res.json({"err_code": 1, "err_msg": "manufacturer is empty."});
				}
			}

			if(typeof overTheCounter !== 'undefined'){
				if(!validator.isEmpty(overTheCounter)){
					qString.overTheCounter = overTheCounter; 
				}else{
					res.json({"err_code": 1, "err_msg": "over the counter is empty."});
				}
			}

			if(typeof packageItem !== 'undefined'){
				if(!validator.isEmpty(packageItem)){
					qString.packageItem = packageItem; 
				}else{
					res.json({"err_code": 1, "err_msg": "package item is empty."});
				}
			}

			if(typeof packageItemCode !== 'undefined'){
				if(!validator.isEmpty(packageItemCode)){
					qString.packageItemCode = packageItemCode; 
				}else{
					res.json({"err_code": 1, "err_msg": "package item code is empty."});
				}
			}

			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "status is empty."});
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
										myEmitter.once("getMedicationIngredient", function(medication, index, newMedication, countMedication){
											/*console.log(medication);*/
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
																objectMedication.code = medication.code;
																objectMedication.status = medication.status;
																objectMedication.isBrand = medication.isBrand;
																objectMedication.isOverTheCounter = medication.isOverTheCounter;
																objectMedication.manufacturer = medication.manufacturer;
																objectMedication.form = medication.form;
																objectMedication.ingredient = medicationIngredient.data;
																var Package = {};
																Package.container = medication.container;
																objectMedication.package = Package;
																newMedication[index] = objectMedication;
																
																myEmitter.once('getMedicationPackageContent', function(medication, index, newMedication, countMedication){
																	qString = {};
																	qString.medication_id = medication.id;
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
																			var Package = {};
																			Package.container = medication.package.container;
																			Package.content = medicationPackageContent.data;
																			objectMedication.package = Package;

																			newMedication[index] = objectMedication;

																			/*if(index == countMedication -1 ){
																				res.json({"err_code": 0, "data":newMedication});				
																			}*/
																			myEmitter.once('getMedicationPackageBatch', function(medication, index, newMedication, countMedication){
																				qString = {};
																				qString.medication_id = medication.id;
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
																						var Package = {};
																						Package.container = medication.package.container;
																						Package.content = medication.package.content;
																						Package.batch = medicationPackageBatch.data;
																						objectMedication.package = Package;

																						newMedication[index] = objectMedication;

																						myEmitter.once('getImage', function(medication, index, newMedication, countMedication){
																							qString = {};
																							qString.medication_id = medication.id;
																							seedPhoenixFHIR.path.GET = {
																								"Attachment" : {
																									"location": "%(apikey)s/Attachment",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
																								attachment = JSON.parse(body);
																								if(attachment.err_code == 0){
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
																									objectMedication.image = attachment.data;
																									

																									newMedication[index] = objectMedication;

																									if(index == countMedication -1 ){
																										res.json({"err_code": 0, "data":newMedication});				
																									}


																								}else{
																									res.json(attachment);			
																								}
																							})
																						})
																						myEmitter.emit('getImage', objectMedication, index, newMedication, countMedication);
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
																res.json(medicationIngredient);
															}
														})
													})
										myEmitter.emit("getMedicationIngredient", medication.data[i], i, newMedication, medication.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Medication Recommendation is empty."});	
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
		},
		medicationIngredient: function getMedicationIngredient(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var medicationId = req.params.medication_id;
					var medicationIngredientId = req.params.medication_ingredient_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resMedicationID){
								if(resMedicationID.err_code > 0){
									if(typeof medicationIngredientId !== 'undefined' && !validator.isEmpty(medicationIngredientId)){
										checkUniqeValue(apikey, "INGREDIENT_ID|" + medicationIngredientId, 'MEDICATION_INGREDIENT', function(resMedicationIngredientID){
											if(resMedicationIngredientID.err_code > 0){
												//get medicationIngredient
								  			qString = {};
								  			qString.medication_id = medicationId;
								  			qString._id = medicationIngredientId;
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
														res.json({"err_code": 0, "data":medicationIngredient.data});	
													}else{
														res.json(medicationIngredient);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Medication Ingredient Id not found"});		
											}
										})
									}else{
										//get medicationIngredient
						  			qString = {};
						  			qString.medication_id = medicationId;
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
												res.json({"err_code": 0, "data":medicationIngredient.data});	
											}else{
												res.json(medicationIngredient);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Medication Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		attachment: function getAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationId = req.params.medication_id;
			var attachmentId = req.params.attachment_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resMedicationID){
						if(resMedicationID.err_code > 0){
							if(typeof attachmentId !== 'undefined' && !validator.isEmpty(attachmentId)){
								checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
									if(resAttachmentID.err_code > 0){
										qString = {};
										qString.medication_id = medicationId;
										qString._id = attachmentId;
										seedPhoenixFHIR.path.GET = {
											"Attachment" : {
												"location": "%(apikey)s/Attachment",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
											attachment = JSON.parse(body);
											if(attachment.err_code == 0){
												res.json({"err_code": 0, "data":attachment.data});	
											}else{
												res.json(address);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Attachment Id not found"});		
									}
								})
							}else{
								qString = {};
								qString.medication_id = medicationId;

								seedPhoenixFHIR.path.GET = {
									"Attachment" : {
										"location": "%(apikey)s/Attachment",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
									attachment = JSON.parse(body);
									if(attachment.err_code == 0){
										res.json({"err_code": 0, "data":attachment.data});	
									}else{
										res.json(attachment);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Medication Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		} 
	},
	post: {
		medication : function addMedication(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");

      var err_code = 0;
      var err_msg = "";
			
			/*
			code|code||
status|status||
isBrand|isBrand|boolean|
isOverTheCounter|isOverTheCounter|boolean|
manufacturer|manufacturer||
form|form||
ingredient.item.itemCodeableConcept|ingredientItemItemCodeableConcept||nn
ingredient.item.itemReference.substance|ingredientItemItemReferenceSubstance||
ingredient.item.itemReference.medication|ingredientItemItemReferenceMedication||
ingredient.isActive|ingredientIsActive|boolean|
ingredient.amount|ingredientAmount|ratio|
package.container|packageContainer||
package.content.item.itemCodeableConcept|packageContentItemItemCodeableConcept||
package.content.item.itemReference|packageContentItemItemReference||
package.content.amount|packageContentAmount||
package.batch.lotNumber|packageBatchLotNumber||
package.batch.expirationDate|packageBatchExpirationDate|date|
*/
			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Medication request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication request.";
			}

			if (typeof req.body.isBrand !== 'undefined') {
				var isBrand = req.body.isBrand.trim().toLowerCase();
					if(validator.isEmpty(isBrand)){
						isBrand = "false";
					}
				if(isBrand === "true" || isBrand === "false"){
					isBrand = isBrand;
				} else {
					err_code = 2;
					err_msg = "Medication is brand is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'is brand' in json Medication request.";
			}

			if (typeof req.body.isOverTheCounter !== 'undefined') {
				var isOverTheCounter = req.body.isOverTheCounter.trim().toLowerCase();
					if(validator.isEmpty(isOverTheCounter)){
						isOverTheCounter = "false";
					}
				if(isOverTheCounter === "true" || isOverTheCounter === "false"){
					isOverTheCounter = isOverTheCounter;
				} else {
					err_code = 2;
					err_msg = "Medication is over the counter is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'is over the counter' in json Medication request.";
			}

			if(typeof req.body.manufacturer !== 'undefined'){
				var manufacturer =  req.body.manufacturer.trim().toLowerCase();
				if(validator.isEmpty(manufacturer)){
					manufacturer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'manufacturer' in json Medication request.";
			}

			if(typeof req.body.form !== 'undefined'){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					form = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'form' in json Medication request.";
			}

			if(typeof req.body.ingredient.item.itemCodeableConcept !== 'undefined'){
				var ingredientItemItemCodeableConcept =  req.body.ingredient.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "Medication ingredient item item codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'ingredient item item codeable concept' in json Medication request.";
			}

			if(typeof req.body.ingredient.item.itemReference.substance !== 'undefined'){
				var ingredientItemItemReferenceSubstance =  req.body.ingredient.item.itemReference.substance.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemReferenceSubstance)){
					ingredientItemItemReferenceSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'ingredient item item reference substance' in json Medication request.";
			}

			if(typeof req.body.ingredient.item.itemReference.medication !== 'undefined'){
				var ingredientItemItemReferenceMedication =  req.body.ingredient.item.itemReference.medication.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemReferenceMedication)){
					ingredientItemItemReferenceMedication = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'ingredient item item reference medication' in json Medication request.";
			}

			if (typeof req.body.ingredient.isActive !== 'undefined') {
				var ingredientIsActive = req.body.ingredient.isActive.trim().toLowerCase();
					if(validator.isEmpty(ingredientIsActive)){
						ingredientIsActive = "false";
					}
				if(ingredientIsActive === "true" || ingredientIsActive === "false"){
					ingredientIsActive = ingredientIsActive;
				} else {
					err_code = 2;
					err_msg = "Medication ingredient is active is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'ingredient is active' in json Medication request.";
			}

			if (typeof req.body.ingredient.amount !== 'undefined') {
			  var ingredientAmount = req.body.ingredient.amount;
 				if(validator.isEmpty(ingredientAmount)){
				  var ingredientAmountNumerator = "";
				  var ingredientAmountDenominator = "";
				} else {
				  if (ingredientAmount.indexOf("to") > 0) {
				    arrIngredientAmount = ingredientAmount.split("to");
				    var ingredientAmountNumerator = arrIngredientAmount[0];
				    var ingredientAmountDenominator = arrIngredientAmount[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Medication ingredient amount invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'ingredient amount' in json Medication request.";
			}

			if(typeof req.body.package.container !== 'undefined'){
				var packageContainer =  req.body.package.container.trim().toLowerCase();
				if(validator.isEmpty(packageContainer)){
					packageContainer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package container' in json Medication request.";
			}

			if(typeof req.body.package.content.item.itemCodeableConcept !== 'undefined'){
				var packageContentItemItemCodeableConcept =  req.body.package.content.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(packageContentItemItemCodeableConcept)){
					packageContentItemItemCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package content item item codeable concept' in json Medication request.";
			}

			if(typeof req.body.package.content.item.itemReference !== 'undefined'){
				var packageContentItemItemReference =  req.body.package.content.item.itemReference.trim().toLowerCase();
				if(validator.isEmpty(packageContentItemItemReference)){
					packageContentItemItemReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package content item item reference' in json Medication request.";
			}

			if(typeof req.body.package.content.amount !== 'undefined'){
				var packageContentAmount =  req.body.package.content.amount.trim().toLowerCase();
				if(validator.isEmpty(packageContentAmount)){
					packageContentAmount = "";
				} else {
					if(!validator.isInt(packageContentAmount)){
						err_code = 2;
						err_msg = "Medication package content amount is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package content amount' in json Medication request.";
			}

			if(typeof req.body.package.batch.lotNumber !== 'undefined'){
				var packageBatchLotNumber =  req.body.package.batch.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(packageBatchLotNumber)){
					packageBatchLotNumber = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package batch lot number' in json Medication request.";
			}

			if(typeof req.body.package.batch.expirationDate !== 'undefined'){
				var packageBatchExpirationDate =  req.body.package.batch.expirationDate;
				if(validator.isEmpty(packageBatchExpirationDate)){
					packageBatchExpirationDate = "";
				}else{
					if(!regex.test(packageBatchExpirationDate)){
						err_code = 2;
						err_msg = "Medication package batch expiration date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package batch expiration date' in json Medication request.";
			}
			
			if(typeof req.body.image.language !== 'undefined'){
				attachmentLanguageCode =  req.body.image.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					/*err_code = 2;
					err_msg = "Language is required";*/
					attachmentLanguageCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'language' in json request.";
			}

			//photo data
			if(typeof req.body.image.data !== 'undefined'){
				attachmentData =  req.body.image.data;
				if(validator.isEmpty(attachmentData)){
					/*err_code = 2;
					err_msg = "Attachment Data is required";*/
					attachmentData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'data' in json request.";
			}

			//photo size
			if(typeof req.body.image.size !== 'undefined'){
				attachmentSize =  req.body.image.size;
				if(validator.isEmpty(attachmentSize)){
					/*err_code = 2;
					err_msg = "Attachment Size is required";*/
					attachmentSize = "";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'size' in json request.";
			}

			//photo title
			if(typeof req.body.image.title !== 'undefined'){
				attachmentTitle =  req.body.image.title;
				if(validator.isEmpty(attachmentTitle)){
					/*err_code = 2;
					err_msg = "Title photo is required";*/
					attachmentTitle = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'title' in json request.";
			}

			//photo content_type
			if(typeof req.body.image.content_type !== 'undefined'){
				attachmentContentType =  req.body.image.content_type;
				if(validator.isEmpty(attachmentContentType)){
					/*err_code = 2;
					err_msg = "Attachment Content-Type is required";*/
					attachmentContentType = "";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'content_type' in json request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						//event emiter
						myEmitter.prependOnceListener('processPost', function() {
							//proses insert
							//set uniqe id
							var unicId = uniqid.time();
							var identifierId = 'ide' + unicId;
							var medicationId = 'med' + unicId;
							var medicationIngredientId = 'mei' + unicId;
							var medicationPackageContent = 'mpc' + unicId;
							var medicationPackageBatch = 'mpb' + unicId;

							dataMedication = {
								"medication_id" : medicationId,
								"code" : code,
								"status" : status,
								"is_brand" : isBrand,
								"is_over_the_counter" : isOverTheCounter,
								"manufacturer" : manufacturer,
								"form" : form,
								"container" : packageContainer
							}
							console.log(dataMedication);
							ApiFHIR.post('medication', {"apikey": apikey}, {body: dataMedication, json: true}, function(error, response, body){
								medication = body;
								if(medication.err_code > 0){
									res.json(medication);	
									console.log("ok");
								}
							});
							
							//MedicationIngredient
							dataMedicationIngredient = {
								"ingredient_id" : medicationIngredientId,
								"item_codeable_concept" : ingredientItemItemCodeableConcept,
								"item_reference_substance" : ingredientItemItemReferenceSubstance,
								"item_reference_medication" : ingredientItemItemReferenceMedication,
								"is_active" : ingredientIsActive,
								"amount_numerator" : ingredientAmountNumerator,
								"amount_denominator" : ingredientAmountDenominator,
								"medication_id" : medicationId
							}
							ApiFHIR.post('medicationIngredient', {"apikey": apikey}, {body: dataMedicationIngredient, json: true}, function(error, response, body){
								medicationIngredient = body;
								if(medicationIngredient.err_code > 0){
									res.json(medicationIngredient);	
									console.log("ok");
								}
							});
							
							//MedicationPackageContent
							dataMedicationPackageContent = {
								"content_id" : medicationPackageContent,
								"item_codeable_concept" : packageContentItemItemCodeableConcept,
								"item_reference" : packageContentItemItemReference,
								"amount" : packageContentAmount,
								"medication_id" : medicationId
							}
							ApiFHIR.post('medicationPackageContent', {"apikey": apikey}, {body: dataMedicationPackageContent, json: true}, function(error, response, body){
								medicationPackageContent = body;
								if(medicationPackageContent.err_code > 0){
									res.json(medicationPackageContent);	
									console.log("ok");
								}
							});
							
							//MedicationPackageBatch
							dataMedicationPackageBatch = {
								"batch_id" : medicationPackageBatch,
								"iot_number" : packageBatchLotNumber,
								"expiration_date" : packageBatchExpirationDate,
								"medication_id" : medicationId
							}
							ApiFHIR.post('medicationPackageBatch', {"apikey": apikey}, {body: dataMedicationPackageBatch, json: true}, function(error, response, body){
								medicationPackageBatch = body;
								if(medicationPackageBatch.err_code > 0){
									res.json(medicationPackageBatch);	
								}
							});
							
							//medicationImage
							var attachmentId = 'att' + uniqid.time();
							var dataAttachment = {
								"id": attachmentId,
								"content_type": attachmentContentType,
								"language": attachmentLanguageCode,
								"data": attachmentData,
								"size": attachmentSize,
								"hash": sha1(attachmentData),
								"title": attachmentTitle,
								"creation": getFormattedDate(),
								"url": host + ':' + port + '/' + apikey + '/medication/'+medicationId+'/Photo/' + attachmentId,
								"medication_id": medicationId
							}

							//method, endpoint, params, options, callback
							ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
								console.log(dataAttachment);
								//cek apakah ada error atau tidak
								var attachment = body; //object
								console.log(attachment);
								//cek apakah ada error atau tidak
								if(attachment.err_code > 0){
									res.json(attachment);		
								}
							})

							res.json({"err_code": 0, "err_msg": "Medication has been add.", "data": [{"_id": medicationId}]});
									
						});

						//cek code
						/*
						code|medication_codes
						status|medication
						form|medication_form_codes
						packageContainer|medication_package_form
						attachmentLanguageCode|languages
						*/
						myEmitter.prependOnceListener('checkCode', function () {
							if (!validator.isEmpty(code)) {
								checkCode(apikey, code, 'MEDICATION_CODES', function (resCodeCode) {
									if (resCodeCode.err_code > 0) {
										myEmitter.emit('processPost');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('processPost');
							}
						})

						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'MEDICATION_STATUS', function (resStatusCode) {
									if (resStatusCode.err_code > 0) {
										myEmitter.emit('checkCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCode');
							}
						})

						myEmitter.prependOnceListener('checkForm', function () {
							if (!validator.isEmpty(form)) {
								checkCode(apikey, form, 'MEDICATION_FORM_CODES', function (resFormCode) {
									if (resFormCode.err_code > 0) {
										myEmitter.emit('checkStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Form code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkStatus');
							}
						})

						myEmitter.prependOnceListener('checkPackageContainer', function () {
							if (!validator.isEmpty(packageContainer)) {
								checkCode(apikey, packageContainer, 'MEDICATION_PACKAGE_FORM', function (resPackageContainerCode) {
									if (resPackageContainerCode.err_code > 0) {
										myEmitter.emit('checkForm');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Package container code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkForm');
							}
						})
						
						myEmitter.prependOnceListener('checkAttachmentLanguage', function () {
							if (!validator.isEmpty(attachmentLanguageCode)) {
								checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguage){
									if (resLanguage.err_code > 0) {
										myEmitter.emit('checkPackageContainer');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "attachment language code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPackageContainer');
							}
						})
						
						

						//cek value
						/*
						manufacturer|Organization
						ingredientItemItemReferenceSubstance|Substance
						ingredientItemItemReferenceMedication|Medication
						packageContentItemItemReference|Medication
						
						*/
						myEmitter.prependOnceListener('checkManufacturer', function () {
							if (!validator.isEmpty(manufacturer)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + manufacturer, 'ORGANIZATION', function (resManufacturer) {
									if (resManufacturer.err_code > 0) {
										myEmitter.emit('checkAttachmentLanguage');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Manufacturer id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAttachmentLanguage');
							}
						})

						myEmitter.prependOnceListener('checkIngredientItemItemReferenceSubstance', function () {
							if (!validator.isEmpty(ingredientItemItemReferenceSubstance)) {
								checkUniqeValue(apikey, "SUBSTANCE_ID|" + ingredientItemItemReferenceSubstance, 'SUBSTANCE', function (resIngredientItemItemReferenceSubstance) {
									if (resIngredientItemItemReferenceSubstance.err_code > 0) {
										myEmitter.emit('checkManufacturer');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Ingredient item item reference substance id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkManufacturer');
							}
						})

						myEmitter.prependOnceListener('checkIngredientItemItemReferenceMedication', function () {
							if (!validator.isEmpty(ingredientItemItemReferenceMedication)) {
								checkUniqeValue(apikey, "MEDICATION_ID|" + ingredientItemItemReferenceMedication, 'MEDICATION', function (resIngredientItemItemReferenceMedication) {
									if (resIngredientItemItemReferenceMedication.err_code > 0) {
										myEmitter.emit('checkIngredientItemItemReferenceSubstance');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Ingredient item item reference medication id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkIngredientItemItemReferenceSubstance');
							}
						})

						if (!validator.isEmpty(packageContentItemItemReference)) {
							checkUniqeValue(apikey, "MEDICATION_ID|" + packageContentItemItemReference, 'MEDICATION', function (resPackageContentItemItemReference) {
								if (resPackageContentItemItemReference.err_code > 0) {
									myEmitter.emit('checkIngredientItemItemReferenceMedication');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Package content item item reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkIngredientItemItemReferenceMedication');
						}

					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		medicationIngredient: function addMedicationIngredient(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationId = req.params.medication_id;

			var err_code = 0;
			var err_msg = "";

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
			
			if(typeof req.body.item.itemCodeableConcept !== 'undefined'){
				var ingredientItemItemCodeableConcept =  req.body.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "Medication ingredient item item codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'ingredient item item codeable concept' in json Medication request.";
			}

			if(typeof req.body.item.itemReference.substance !== 'undefined'){
				var ingredientItemItemReferenceSubstance =  req.body.item.itemReference.substance.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemReferenceSubstance)){
					ingredientItemItemReferenceSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'ingredient item item reference substance' in json Medication request.";
			}

			if(typeof req.body.item.itemReference.medication !== 'undefined'){
				var ingredientItemItemReferenceMedication =  req.body.item.itemReference.medication.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemReferenceMedication)){
					ingredientItemItemReferenceMedication = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'ingredient item item reference medication' in json Medication request.";
			}

			if (typeof req.body.isActive !== 'undefined') {
				var ingredientIsActive = req.body.isActive.trim().toLowerCase();
					if(validator.isEmpty(ingredientIsActive)){
						ingredientIsActive = "false";
					}
				if(ingredientIsActive === "true" || ingredientIsActive === "false"){
					ingredientIsActive = ingredientIsActive;
				} else {
					err_code = 2;
					err_msg = "Medication ingredient is active is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'ingredient is active' in json Medication request.";
			}

			if (typeof req.body.amount !== 'undefined') {
			  var ingredientAmount = req.body.amount;
 				if(validator.isEmpty(ingredientAmount)){
				  var ingredientAmountNumerator = "";
				  var ingredientAmountDenominator = "";
				} else {
				  if (ingredientAmount.indexOf("to") > 0) {
				    arrIngredientAmount = ingredientAmount.split("to");
				    var ingredientAmountNumerator = arrIngredientAmount[0];
				    var ingredientAmountDenominator = arrIngredientAmount[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Medication ingredient amount invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'ingredient amount' in json Medication request.";
			}
 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationID', function(){
							checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									var unicId = uniqid.time();
									var medicationIngredientId = 'mei' + unicId;
									//MedicationIngredient
									dataMedicationIngredient = {
										"ingredient_id" : medicationIngredientId,
										"item_codeable_concept" : ingredientItemItemCodeableConcept,
										"item_reference_substance" : ingredientItemItemReferenceSubstance,
										"item_reference_medication" : ingredientItemItemReferenceMedication,
										"is_active" : ingredientIsActive,
										"amount_numerator" : ingredientAmountNumerator,
										"amount_denominator" : ingredientAmountDenominator,
										"medication_id" : medicationId
									};
							
									ApiFHIR.post('medicationIngredient', {"apikey": apikey}, {body: dataMedicationIngredient, json: true}, function(error, response, body){
										medicationIngredient = body;
										
										if(medicationIngredient.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Ingredient has been add in this medication.", "data": medicationIngredient.data});
										}else{
											res.json(medicationIngredient);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Ingredient Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIngredientItemItemReferenceSubstance', function () {
							if (!validator.isEmpty(ingredientItemItemReferenceSubstance)) {
								checkUniqeValue(apikey, "SUBSTANCE_ID|" + ingredientItemItemReferenceSubstance, 'SUBSTANCE', function (resIngredientItemItemReferenceSubstance) {
									if (resIngredientItemItemReferenceSubstance.err_code > 0) {
										myEmitter.emit('checkMedicationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Ingredient item item reference substance id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationID');
							}
						})

						if (!validator.isEmpty(ingredientItemItemReferenceMedication)) {
							checkUniqeValue(apikey, "MEDICATION_ID|" + ingredientItemItemReferenceMedication, 'MEDICATION', function (resIngredientItemItemReferenceMedication) {
								if (resIngredientItemItemReferenceMedication.err_code > 0) {
									myEmitter.emit('checkIngredientItemItemReferenceSubstance');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Ingredient item item reference medication id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkIngredientItemItemReferenceSubstance');
						}
						
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		medicationPackageContent: function addMedicationPackageContent(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationId = req.params.medication_id;
			var packageId = req.params.package_id;

			var err_code = 0;
			var err_msg = "";

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
			
			if(typeof req.body.item.itemCodeableConcept !== 'undefined'){
				var packageContentItemItemCodeableConcept =  req.body.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(packageContentItemItemCodeableConcept)){
					packageContentItemItemCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package content item item codeable concept' in json Medication request.";
			}

			if(typeof req.body.item.itemReference !== 'undefined'){
				var packageContentItemItemReference =  req.body.item.itemReference.trim().toLowerCase();
				if(validator.isEmpty(packageContentItemItemReference)){
					packageContentItemItemReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package content item item reference' in json Medication request.";
			}

			if(typeof req.body.amount !== 'undefined'){
				var packageContentAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(packageContentAmount)){
					packageContentAmount = "";
				} else {
					if(!validator.isInt(packageContentAmount)){
						err_code = 2;
						err_msg = "Medication package content amount is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package content amount' in json Medication request.";
			}
 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationID', function(){
							checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									var unicId = uniqid.time();
									var medicationPackageContent = 'mpc' + unicId;
									//MedicationPackageContent
									dataMedicationPackageContent = {
										"content_id" : medicationPackageContent,
										"item_codeable_concept" : packageContentItemItemCodeableConcept,
										"item_reference" : packageContentItemItemReference,
										"amount" : packageContentAmount,
										"medication_id" : medicationId
									};
							
									ApiFHIR.post('medicationPackageContent', {"apikey": apikey}, {body: dataMedicationPackageContent, json: true}, function(error, response, body){
										medicationPackageContent = body;
										
										if(medicationPackageContent.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Package Content has been add in this medication.", "data": medicationPackageContent.data});
										}else{
											res.json(medicationPackageContent);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Id not found"});		
								}
							})
						})

						if (!validator.isEmpty(packageContentItemItemReference)) {
							checkUniqeValue(apikey, "MEDICATION_ID|" + packageContentItemItemReference, 'MEDICATION', function (resPackageContentItemItemReference) {
								if (resPackageContentItemItemReference.err_code > 0) {
									myEmitter.emit('checkMedicationID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Package content item item reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkMedicationID');
						}
						
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		medicationPackageBatch: function addMedicationPackageBatch(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationId = req.params.medication_id;
			
			var err_code = 0;
			var err_msg = "";

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
			
			if(typeof req.body.lotNumber !== 'undefined'){
				var packageBatchLotNumber =  req.body.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(packageBatchLotNumber)){
					packageBatchLotNumber = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package batch lot number' in json Medication request.";
			}

			if(typeof req.body.expirationDate !== 'undefined'){
				var packageBatchExpirationDate =  req.body.expirationDate;
				if(validator.isEmpty(packageBatchExpirationDate)){
					packageBatchExpirationDate = "";
				}else{
					if(!regex.test(packageBatchExpirationDate)){
						err_code = 2;
						err_msg = "Medication package batch expiration date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'package batch expiration date' in json Medication request.";
			}
 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resImmunizationID){
							if(resImmunizationID.err_code > 0){
								var unicId = uniqid.time();
								var medicationPackageBatch = 'mpb' + unicId;
								//MedicationPackageBatch
								dataMedicationPackageBatch = {
									"batch_id" : medicationPackageBatch,
									"iot_number" : packageBatchLotNumber,
									"expiration_date" : packageBatchExpirationDate,
									"package_id" : medicationPackage
								};

								ApiFHIR.post('medicationPackageBatch', {"apikey": apikey}, {body: dataMedicationPackageBatch, json: true}, function(error, response, body){
									medicationPackageBatch = body;

									if(medicationPackageBatch.err_code == 0){
										res.json({"err_code": 0, "err_msg": "Package Batch has been add in this medication.", "data": medicationPackageBatch.data});
									}else{
										res.json(medicationPackageBatch);	
									}
								});
							}else{
								res.json({"err_code": 504, "err_msg": "Medication Id not found"});		
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
		},
		attachment: function addAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationId = req.params.medication_id;

			var err_code = 0;
			var err_msg = "";

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

			if(typeof req.body.language !== 'undefined'){
				attachmentLanguageCode =  req.body.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'language' in json request.";
			}

			//photo data
			if(typeof req.body.data !== 'undefined'){
				attachmentData =  req.body.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'data' in json request.";
			}

			//photo size
			if(typeof req.body.size !== 'undefined'){
				attachmentSize =  req.body.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'size' in json request.";
			}

			//photo title
			if(typeof req.body.title !== 'undefined'){
				attachmentTitle =  req.body.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'title' in json request.";
			}

			//photo content_type
			if(typeof req.body.content_type !== 'undefined'){
				attachmentContentType =  req.body.content_type;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'content_type' in json request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resMedicationID){
							if(resMedicationID.err_code > 0){
								checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguage){
									if(resLanguage.err_code > 0){
										// attachment
										var attachmentId = 'att' + uniqid.time();
										var dataAttachment = {
											"id": attachmentId,
											"content_type": attachmentContentType,
											"language": attachmentLanguageCode,
											"data": attachmentData,
											"size": attachmentSize,
											"hash": sha1(attachmentData),
											"title": attachmentTitle,
											"creation": getFormattedDate(),
											"url": host + ':' + port + '/' + apikey + '/medication/'+medicationId+'/Photo/' + attachmentId,
											"medication_id": medicationId
										}

										//method, endpoint, params, options, callback
										ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
											//cek apakah ada error atau tidak
											var attachment = body; //object
											//cek apakah ada error atau tidak
											if(attachment.err_code == 0){
												res.json({"err_code": 0, "err_msg": "Photo has been add in this medication.", "data": attachment.data});
											}else{
												res.json(attachment);		
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Language code not found"});			
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Medication Id not found"});	
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
		},
	},
	put: {
		medication : function putMedication(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationId = req.params.medication_id;

      var err_code = 0;
      var err_msg = "";
      var dataMedication = {};

			if(typeof medicationId !== 'undefined'){
				if(validator.isEmpty(medicationId)){
					err_code = 2;
					err_msg = "Medication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication id is required";
			}
			
			/*
			var medication_id = req.params._id;
			var code = req.body.medication_id;
			var status = req.body.medication_id;
			var is_brand = req.body.medication_id;
			var is_over_the_counter = req.body.medication_id;
			var manufacturer = req.body.medication_id;
			var form = req.body.medication_id;
			*/

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					dataMedication.code = "";
				}else{
					dataMedication.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataMedication.status = "";
				}else{
					dataMedication.status = status;
				}
			}else{
			  status = "";
			}

			if (typeof req.body.isBrand !== 'undefined' && req.body.isBrand !== "") {
			  var isBrand = req.body.isBrand.trim().toLowerCase();
					if(validator.isEmpty(isBrand)){
						isBrand = "false";
					}
			  if(isBrand === "true" || isBrand === "false"){
					dataMedication.is_brand = isBrand;
			  } else {
			    err_code = 2;
			    err_msg = "Immunization recommendation is brand is must be boolean.";
			  }
			} else {
			  isBrand = "";
			}

			if (typeof req.body.isOverTheCounter !== 'undefined' && req.body.isOverTheCounter !== "") {
			  var isOverTheCounter = req.body.isOverTheCounter.trim().toLowerCase();
					if(validator.isEmpty(isOverTheCounter)){
						isOverTheCounter = "false";
					}
			  if(isOverTheCounter === "true" || isOverTheCounter === "false"){
					dataMedication.is_over_the_counter = isOverTheCounter;
			  } else {
			    err_code = 2;
			    err_msg = "Immunization recommendation is over the counter is must be boolean.";
			  }
			} else {
			  isOverTheCounter = "";
			}

			if(typeof req.body.manufacturer !== 'undefined' && req.body.manufacturer !== ""){
				var manufacturer =  req.body.manufacturer.trim().toLowerCase();
				if(validator.isEmpty(manufacturer)){
					dataMedication.manufacturer = "";
				}else{
					dataMedication.manufacturer = manufacturer;
				}
			}else{
			  manufacturer = "";
			}

			if(typeof req.body.form !== 'undefined' && req.body.form !== ""){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					dataMedication.form = "";
				}else{
					dataMedication.form = form;
				}
			}else{
			  form = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						//event emiter
						myEmitter.prependOnceListener('checkMedicationId', function() {
							console.log(dataMedication);
							ApiFHIR.put('medication', {"apikey": apikey}, {body: dataMedication, json: true}, function(error, response, body){
								medication = body;
								if(medication.err_code > 0){
									res.json(medication);	
									console.log("ok");
								}
							});
							res.json({"err_code": 0, "err_msg": "Medication has been update.", "data": [{"_id": medicationId}]});
						});
						
						myEmitter.prependOnceListener('checkCode', function () {
							if (!validator.isEmpty(code)) {
								checkCode(apikey, code, 'MEDICATION_CODES', function (resCodeCode) {
									if (resCodeCode.err_code > 0) {
										myEmitter.emit('checkMedicationId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationId');
							}
						})

						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'MEDICATION_STATUS', function (resStatusCode) {
									if (resStatusCode.err_code > 0) {
										myEmitter.emit('checkCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCode');
							}
						})

						myEmitter.prependOnceListener('checkForm', function () {
							if (!validator.isEmpty(form)) {
								checkCode(apikey, form, 'MEDICATION_FORM_CODES', function (resFormCode) {
									if (resFormCode.err_code > 0) {
										myEmitter.emit('checkStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Form code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkStatus');
							}
						})
						
						if (!validator.isEmpty(manufacturer)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + manufacturer, 'ORGANIZATION', function (resManufacturer) {
								if (resManufacturer.err_code > 0) {
									myEmitter.emit('checkForm');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Manufacturer id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkForm');
						}

					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}	
			
		},
		medicationIngredient: function updateMedicationIngredient(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationId = req.params.medication_id;
			var medicationIngredientId = req.params.medication_ingredient_id;

			var err_code = 0;
			var err_msg = "";
			var dataMedicationIngredient = {};
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

			if(typeof medicationIngredientId !== 'undefined'){
				if(validator.isEmpty(medicationIngredientId)){
					err_code = 2;
					err_msg = "Medication ingredient id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication ingredient id is required";
			}
			
			/*
			var item_codeable_concept = req.body.item_codeable_concept;
			var item_reference_substance = req.body.item_reference_substance;
			var item_reference_medication = req.body.item_reference_medication;
			var is_active = req.body.is_active;
			var amount_numerator = req.body.amount_numerator;
			var amount_denominator = req.body.amount_denominator;
			*/
			if(typeof req.body.item.itemCodeableConcept !== 'undefined' && req.body.item.itemCodeableConcept !== ""){
				var ingredientItemItemCodeableConcept =  req.body.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "immunization recommendation ingredient item item codeable concept is required.";
				}else{
					dataMedicationIngredient.item_codeable_concept = ingredientItemItemCodeableConcept;
				}
			}else{
			  ingredientItemItemCodeableConcept = "";
			}

			if(typeof req.body.item.itemReference.substance !== 'undefined' && req.body.item.itemReference.substance !== ""){
				var ingredientItemItemReferenceSubstance =  req.body.item.itemReference.substance.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemReferenceSubstance)){
					dataMedicationIngredient.item_reference_substance = "";
				}else{
					dataMedicationIngredient.item_reference_substance = ingredientItemItemReferenceSubstance;
				}
			}else{
			  ingredientItemItemReferenceSubstance = "";
			}

			if(typeof req.body.item.itemReference.medication !== 'undefined' && req.body.item.itemReference.medication !== ""){
				var ingredientItemItemReferenceMedication =  req.body.item.itemReference.medication.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemReferenceMedication)){
					dataMedicationIngredient.item_reference_medication = "";
				}else{
					dataMedicationIngredient.item_reference_medication = ingredientItemItemReferenceMedication;
				}
			}else{
			  ingredientItemItemReferenceMedication = "";
			}

			if (typeof req.body.isActive !== 'undefined' && req.body.isActive !== "") {
			  var ingredientIsActive = req.body.isActive.trim().toLowerCase();
				if(validator.isEmpty(ingredientIsActive)){
					ingredientIsActive = "false";
				}
			  if(ingredientIsActive === "true" || ingredientIsActive === "false"){
					dataMedicationIngredient.is_active = ingredientIsActive;
			  } else {
			    err_code = 2;
			    err_msg = "Immunization recommendation ingredient is active is must be boolean.";
			  }
			} else {
			  ingredientIsActive = "";
			}

			if (typeof req.body.amount !== 'undefined' && req.body.amount !== "") {
			  var ingredientAmount = req.body.amount;
			  if (ingredientAmount.indexOf("to") > 0) {
			    arrIngredientAmount = ingredientAmount.split("to");
			    dataMedicationIngredient.amount_numerator = arrIngredientAmount[0];
			    dataMedicationIngredient.amount_denominator = arrIngredientAmount[1];
				} else {
			  	err_code = 2;
			  	err_msg = "immunization recommendation ingredient amount invalid ratio format.";
				}
			} else {
			  ingredientAmount = "";
			}			 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationID', function(){
							checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resMedicationID){
								if(resMedicationID.err_code > 0){
									checkUniqeValue(apikey, "INGREDIENT_ID|" + medicationIngredientId, 'MEDICATION_INGREDIENT', function(resMedicationIngredientID){
										if(resMedicationIngredientID.err_code > 0){
											ApiFHIR.put('medicationIngredient', {"apikey": apikey, "_id": medicationIngredientId, "dr": "MEDICATION_ID|"+medicationId}, {body: dataMedicationIngredient, json: true}, function(error, response, body){
												medicationIngredient = body;
												if(medicationIngredient.err_code > 0){
													res.json(medicationIngredient);	
												}else{
													res.json({"err_code": 0, "err_msg": "Medication Ingredient has been update in this Medication.", "data": medicationIngredient.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Medication Ingredient Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkIngredientItemItemReferenceSubstance', function () {
							if (!validator.isEmpty(ingredientItemItemReferenceSubstance)) {
								checkUniqeValue(apikey, "SUBSTANCE_ID|" + ingredientItemItemReferenceSubstance, 'SUBSTANCE', function (resIngredientItemItemReferenceSubstance) {
									if (resIngredientItemItemReferenceSubstance.err_code > 0) {
										myEmitter.emit('checkMedicationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Ingredient item item reference substance id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationID');
							}
						})

						if (!validator.isEmpty(ingredientItemItemReferenceMedication)) {
							checkUniqeValue(apikey, "MEDICATION_ID|" + ingredientItemItemReferenceMedication, 'MEDICATION', function (resIngredientItemItemReferenceMedication) {
								if (resIngredientItemItemReferenceMedication.err_code > 0) {
									myEmitter.emit('checkIngredientItemItemReferenceSubstance');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Ingredient item item reference medication id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkIngredientItemItemReferenceSubstance');
						}
						

						/*---------*/
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		medicationPackageContent: function updateMedicationPackageContent(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationId = req.params.medication_id;
			var medicationPackageContentId = req.params.medication_package_content_id;

			var err_code = 0;
			var err_msg = "";
			var dataMedicationPackageContent = {};
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
			
			if(typeof medicationPackageContentId !== 'undefined'){
				if(validator.isEmpty(medicationPackageContentId)){
					err_code = 2;
					err_msg = "Medication Package Content id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Package Content id is required";
			}
			
			/*
			var item_codeable_concept = req.body.item_codeable_concept;
			var item_reference = req.body.item_reference;
			var amount = req.body.amount;
			*/
			if(typeof req.body.content.item.itemCodeableConcept !== 'undefined' && req.body.content.item.itemCodeableConcept !== ""){
				var packageContentItemItemCodeableConcept =  req.body.content.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(packageContentItemItemCodeableConcept)){
					dataMedicationPackageContent.item_codeable_concept = "";
				}else{
					dataMedicationPackageContent.item_codeable_concept = packageContentItemItemCodeableConcept;
				}
			}else{
			  packageContentItemItemCodeableConcept = "";
			}

			if(typeof req.body.content.item.itemReference !== 'undefined' && req.body.content.item.itemReference !== ""){
				var packageContentItemItemReference =  req.body.content.item.itemReference.trim().toLowerCase();
				if(validator.isEmpty(packageContentItemItemReference)){
					dataMedicationPackageContent.item_reference = "";
				}else{
					dataMedicationPackageContent.item_reference = packageContentItemItemReference;
				}
			}else{
			  packageContentItemItemReference = "";
			}

			if(typeof req.body.content.amount !== 'undefined' && req.body.content.amount !== ""){
				var packageContentAmount =  req.body.content.amount.trim().toLowerCase();
				if(validator.isEmpty(packageContentAmount)){
					dataMedicationPackageContent.amount = "";
				}else{
					dataMedicationPackageContent.amount = packageContentAmount;
				}
			}else{
			  packageContentAmount = "";
			}	 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationID', function(){
							checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resMedicationID){
								if(resMedicationID.err_code > 0){
									checkUniqeValue(apikey, "CONTENT_ID|" + medicationPackageContentId, 'MEDICATION_PACKAGE_CONTENT', function(resMedicationPackageContentId){
									if(resMedicationPackageContentId.err_code > 0){
										ApiFHIR.put('medicationPackageContent', {"apikey": apikey, "_id": medicationPackageContentId, "dr": "MEDICATION_ID|"+medicationId}, {body: dataMedicationPackageContent, json: true}, function(error, response, body){
										medicationPackageContent = body;
										if(medicationPackageContent.err_code > 0){
											res.json(medicationPackageContent);	
										}else{
											res.json({"err_code": 0, "err_msg": "Medication Ingredient has been update in this Medication.", "data": medicationPackageContent.data});
										}
									})
									}else{
											res.json({"err_code": 505, "err_msg": "Medication Package Content Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(packageContentItemItemReference)) {
							checkUniqeValue(apikey, "MEDICATION_ID|" + packageContentItemItemReference, 'MEDICATION', function (resPackageContentItemItemReference) {
								if (resPackageContentItemItemReference.err_code > 0) {
									myEmitter.emit('checkMedicationID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Package content item item reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkMedicationID');
						}
						
						/*---------*/
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		medicationPackageBatch: function updateMedicationPackageBatch(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationId = req.params.medication_id;
			var medicationPackageBatchId = req.params.medication_package_batch_id;

			var err_code = 0;
			var err_msg = "";
			var dataMedicationPackageBatch = {};
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
			
			if(typeof medicationPackageBatchId !== 'undefined'){
				if(validator.isEmpty(medicationPackageBatchId)){
					err_code = 2;
					err_msg = "Medication Package Batch id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Package Batch id is required";
			}
			
			if(typeof req.body.batch.lotNumber !== 'undefined' && req.body.batch.lotNumber !== ""){
				var packageBatchLotNumber =  req.body.batch.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(packageBatchLotNumber)){
					dataMedicationPackageBatch.lot_number = "";
				}else{
					dataMedicationPackageBatch.lot_number = packageBatchLotNumber;
				}
			}else{
			  packageBatchLotNumber = "";
			}

			if(typeof req.body.batch.expirationDate !== 'undefined' && req.body.batch.expirationDate !== ""){
				var packageBatchExpirationDate =  req.body.batch.expirationDate.trim().toLowerCase();
				if(validator.isEmpty(packageBatchExpirationDate)){
					dataMedicationPackageBatch.expiration_date = "";
				}else{
					dataMedicationPackageBatch.expiration_date = packageBatchExpirationDate;
				}
			}else{
			  packageBatchExpirationDate = "";
			}	
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resMedicationID){
							if(resMedicationID.err_code > 0){
								checkUniqeValue(apikey, "BATCH_ID|" + medicationPackageBatchId, 'MEDICATION_PACKAGE_BATCH', function(resMedicationPackageBatchID){
									if(resMedicationPackageBatchID.err_code > 0){
										ApiFHIR.put('medicationPackageBatch', {"apikey": apikey, "_id": medicationPackageBatchId, "dr": "MEDICATION_ID|"+medicationId}, {body: dataMedicationPackageBatch, json: true}, function(error, response, body){
											medicationPackageBatch = body;
											if(medicationPackageBatch.err_code > 0){
												res.json(medicationPackageBatch);	
											}else{
												res.json({"err_code": 0, "err_msg": "Medication Ingredient has been update in this Medication.", "data": medicationPackageBatch.data});
											}
										})
									}else{
										res.json({"err_code": 505, "err_msg": "Medication Package Batch Id not found"});		
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Medication Id not found"});		
							}
						})
						/*---------*/
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		attachment: function updateAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationId = req.params.medication_id;
			var attachmentId = req.params.attachment_id;

			var err_code = 0;
			var err_msg = "";
			var dataAttachment = {};

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

			if(typeof attachmentId !== 'undefined'){
				if(validator.isEmpty(attachmentId)){
					err_code = 2;
					err_msg = "Photo id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Photo id is required";
			}

			if(typeof req.body.language !== 'undefined'){
				attachmentLanguageCode =  req.body.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}else{
					dataAttachment.language = attachmentLanguageCode;
				}
			}else{
				attachmentLanguageCode = "";
			}

			//photo data
			if(typeof req.body.data !== 'undefined'){
				attachmentData =  req.body.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}else{
					dataAttachment.data = attachmentData;
				}
			}else{
				attachmentData = "";
			}

			//photo size
			if(typeof req.body.size !== 'undefined'){
				attachmentSize =  req.body.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
					dataAttachment.size = attachmentSize;
				}
			}

			//photo title
			if(typeof req.body.title !== 'undefined'){
				attachmentTitle =  req.body.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}else{
					dataAttachment.title = attachmentTitle;
				}
			}

			//photo content_type
			if(typeof req.body.content_type !== 'undefined'){
				attachmentContentType =  req.body.content_type;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
					dataAttachment.content_type = attachmentContentType;
				}
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkMedicationID', function(){
							checkUniqeValue(apikey, "MEDICATION_ID|" + medicationId, 'MEDICATION', function(resMedicationID){
								if(resMedicationID.err_code > 0){
									checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
										if(resAttachmentID.err_code > 0){
											ApiFHIR.put('attachment', {"apikey": apikey, "_id": attachmentId, "dr": "MEDICATION_ID|"+medicationId}, {body: dataAttachment, json: true}, function(error, response, body){
												attachment = body;
												if(attachment.err_code > 0){
													res.json(attachment);	
												}else{
													res.json({"err_code": 0, "err_msg": "Photo has been update in this medication.", "data": attachment.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Photo Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Id not found"});		
								}
							})
						})

						if(validator.isEmpty(attachmentLanguageCode)){
							myEmitter.emit('checkMedicationID');	
						}else{
							checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguageCode){
								if(resLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkMedicationID');
								}else{
									res.json({"err_code": 501, "err_msg": "Language Code not found"});
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
		},
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