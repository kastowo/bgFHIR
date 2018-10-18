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

			//params from query string
			/*var medicationId = req.query._id;
			var category = req.query.category;
			var date=req.query.date;
			var location=req.query.location;
			var reaction=req.query.reaction;
			var recorder=req.query.recorder;
			var seriousness=req.query.seriousness;			
			var study=req.query.study;
			var subject=req.query.subject;
			var substance=req.query.substance;
			var type=req.query.type;

			if(typeof medicationId !== 'undefined'){
				if(!validator.isEmpty(medicationId)){
					qString.medicationId = medicationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Care Team Id is required."});
				}
			}

			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "Category is required."});
				}
			}

			if(typeof date !== 'undefined'){
				if(!validator.isEmpty(date)){
					qString.date = date; 
				}else{
					res.json({"err_code": 1, "err_msg": "Date is empty."});
				}
			}

			if(typeof location !== 'undefined'){
				if(!validator.isEmpty(location)){
					qString.location = location;
				}else{
					res.json({"err_code": 1, "err_msg": "Location is empty."});
				}
			}

			if(typeof reaction !== 'undefined'){
				if(!validator.isEmpty(reaction)){
					qString.reaction = reaction;
				}else{
					res.json({"err_code": 1, "err_msg": "Reaction is empty."});
				}
			}

			if(typeof seriousness !== 'undefined'){
				if(!validator.isEmpty(seriousness)){
					qString.seriousness = seriousness;
				}else{
					res.json({"err_code": 1, "err_msg": "Seriousness of is empty."});
				}
			}	

			if(typeof study !== 'undefined'){
				if(!validator.isEmpty(study)){
					qString.study = study;
				}else{
					res.json({"err_code": 1, "err_msg": "Study of is empty."});
				}
			}

			if(typeof subject !== 'undefined'){
				if(!validator.isEmpty(subject)){
					qString.subject = subject;
				}else{
					res.json({"err_code": 1, "err_msg": "Subject of is empty."});
				}
			}

			if(typeof substance !== 'undefined'){
				if(!validator.isEmpty(substance)){
					qString.substance = substance;
				}else{
					res.json({"err_code": 1, "err_msg": "Substance of is empty."});
				}
			}

			if(typeof type !== 'undefined'){
				if(!validator.isEmpty(type)){
					qString.type = type;
				}else{
					res.json({"err_code": 1, "err_msg": "Type of is empty."});
				}
			}*/

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
																newMedication[index] = objectMedication;
																
																/*if(index == countMedication -1 ){
																	res.json({"err_code": 0, "data":newMedication});				
																}
*/
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

																						/*if(index == countMedication -1 ){
																							res.json({"err_code": 0, "data":newMedication});				
																						}*/
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
																									var Package = {};
																									Package.id = medication.package.id;
																									Package.container = medication.package.container;
																									Package.content = medicationPackageContent.data;
																									objectMedication.package = Package;
															
																									newMedication[index] = objectMedication;
																									
																									/*if(index == countMedication -1 ){
																										res.json({"err_code": 0, "data":newMedication});				
																									}*/

																									myEmitter.once('getMedicationPackageBatch', function(medication, index, newMedication, countMedication){
																										qString = {};
																										qString.package_id = medication.package.id;
																										seedPhoenixFHIR.path.GET = {
																											"MedicationPackageBatch" : {
																												"location": "%(apikey)s/MedicationPackageBatch",
																												"query": qString
																											}
																										}	
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
																												Package.id = medication.package.id;
																												Package.container = medication.package.container;
																												Package.content = medication.package.content;
																												Package.batch = medicationPackageBatch.data;
																												objectMedication.package = Package;
															
																												

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
package.batch.expirationDate|packageBatchExpirationDate||
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
					if(validator.isInt(packageContentAmount)){
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
							var medicationPackage = 'mpa' + unicId;
							var medicationPackageContent = 'mpc' + unicId;
							var medicationPackageBatch = 'mpb' + unicId;

							dataMedication = {
								"medication_id" : medicationId,
								"code" : code,
								"status" : status,
								"is_brand" : isBrand,
								"is_over_the_counter" : isOverTheCounter,
								"manufacturer" : manufacturer,
								"form" : form
							}
							console.log(dataMedication);
							ApiFHIR.post('medication', {"apikey": apikey}, {body: dataMedication, json: true}, function(error, response, body){
								medication = body;
								if(medication.err_code > 0){
									res.json(medication);	
									console.log("ok");
								}
							});

							//identifier
							var identifierSystem = identifierId;
							dataIdentifier = {
																"id": identifierId,
																"use": identifierUseCode,
																"type": identifierTypeCode,
																"system": identifierSystem,
																"value": identifierValue,
																"period_start": identifierPeriodStart,
																"period_end": identifierPeriodEnd,
																"care_team_id": medicationId
															}

							ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
								identifier = body;
								if(identifier.err_code > 0){
									res.json(identifier);	
								}
							})
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
package.batch.expirationDate|packageBatchExpirationDate||
*/
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

							//MedicationDateCriterion
							dataMedicationPackage = {
								"package_id" : medicationPackage,
								"container" : packageContainer,
								"medication_id" : medicationId
							}
							ApiFHIR.post('medicationPackage', {"apikey": apikey}, {body: dataMedicationPackage, json: true}, function(error, response, body){
								medicationPackage = body;
								if(medicationPackage.err_code > 0){
									res.json(medicationPackage);	
									console.log("ok");
								}
							});
							
							//MedicationDateCriterion
							dataMedicationPackageContent = {
								"content_id" : medicationPackageContent,
								"item_codeable_concept" : packageContentItemItemCodeableConcept,
								"item_reference" : packageContentItemItemReference,
								"amount" : packageContentAmount,
								"package_id" : medicationPackage
							}
							ApiFHIR.post('medicationPackageContent', {"apikey": apikey}, {body: dataMedicationPackageContent, json: true}, function(error, response, body){
								medicationPackageContent = body;
								if(medicationPackageContent.err_code > 0){
									res.json(medicationPackageContent);	
									console.log("ok");
								}
							});
							
							//MedicationDateCriterion
							dataMedicationPackageBatch = {
								"batch_id" : medicationPackageBatch,
								"iot_number" : packageBatchLotNumber,
								"expiration_date" : packageBatchExpirationDate,
								"package_id" : medicationPackage
							}
							ApiFHIR.post('medicationPackageBatch', {"apikey": apikey}, {body: dataMedicationPackage, json: true}, function(error, response, body){
								medicationPackageBatch = body;
								if(medicationPackageBatch.err_code > 0){
									res.json(medicationPackageBatch);	
									console.log("ok");
								}
							});

							res.json({"err_code": 0, "err_msg": "Medication has been add.", "data": [{"_id": medicationId}]});
									
						});

						//cek code
						/*
						code|medication_codes
						status|medication
						form|medication_form_codes
						packageContainer|medication_package_form
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
										myEmitter.emit('checkPackageContainer');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Manufacturer id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPackageContainer');
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
		}
	},
	put: {
		medication : function putMedication(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataMedication = {};

			if(typeof medicationId !== 'undefined'){
				if(validator.isEmpty(medicationId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
			}

						if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				dataMedication.code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					err_code = 2;
					err_msg = "Medication code is required.";
				}else{
					dataMedication.code = code;
				}
			}else{
				code = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				dataMedication.status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Medication status is required.";
				}else{
					dataMedication.status = status;
				}
			}else{
				status = "";
			}

			if (typeof req.body.isBrand !== 'undefined' && req.body.isBrand !== "") {
			  dataMedication.isBrand = req.body.isBrand.trim().toLowerCase();
			  if(isBrand === "true" || isBrand === "false"){
					dataMedication.isBrand = isBrand;
			  } else {
			    err_code = 2;
			    err_msg = "Medication is brand is must be boolean.";
			  }
			} else {
			  isBrand = "";
			}

			if (typeof req.body.isOverTheCounter !== 'undefined' && req.body.isOverTheCounter !== "") {
			  dataMedication.isOverTheCounter = req.body.isOverTheCounter.trim().toLowerCase();
			  if(isOverTheCounter === "true" || isOverTheCounter === "false"){
					dataMedication.isOverTheCounter = isOverTheCounter;
			  } else {
			    err_code = 2;
			    err_msg = "Medication is over the counter is must be boolean.";
			  }
			} else {
			  isOverTheCounter = "";
			}

			if(typeof req.body.manufacturer !== 'undefined' && req.body.manufacturer !== ""){
				dataMedication.manufacturer =  req.body.manufacturer.trim().toLowerCase();
				if(validator.isEmpty(manufacturer)){
					err_code = 2;
					err_msg = "Medication manufacturer is required.";
				}else{
					dataMedication.manufacturer = manufacturer;
				}
			}else{
				manufacturer = "";
			}

			if(typeof req.body.form !== 'undefined' && req.body.form !== ""){
				dataMedication.form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					err_code = 2;
					err_msg = "Medication form is required.";
				}else{
					dataMedication.form = form;
				}
			}else{
				form = "";
			}

			if(typeof req.body.ingredient.item.itemCodeableConcept !== 'undefined' && req.body.ingredient.item.itemCodeableConcept !== ""){
				dataMedication.ingredientItemItemCodeableConcept =  req.body.ingredient.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "Medication ingredient item item codeable concept is required.";
				}else{
					dataMedication.ingredientItemItemCodeableConcept = ingredientItemItemCodeableConcept;
				}
			}else{
				ingredientItemItemCodeableConcept = "";
			}

			if(typeof req.body.ingredient.item.itemReference.substance !== 'undefined' && req.body.ingredient.item.itemReference.substance !== ""){
				dataMedication.ingredientItemItemReferenceSubstance =  req.body.ingredient.item.itemReference.substance.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemReferenceSubstance)){
					err_code = 2;
					err_msg = "Medication ingredient item item reference substance is required.";
				}else{
					dataMedication.ingredientItemItemReferenceSubstance = ingredientItemItemReferenceSubstance;
				}
			}else{
				ingredientItemItemReferenceSubstance = "";
			}

			if(typeof req.body.ingredient.item.itemReference.medication !== 'undefined' && req.body.ingredient.item.itemReference.medication !== ""){
				dataMedication.ingredientItemItemReferenceMedication =  req.body.ingredient.item.itemReference.medication.trim().toLowerCase();
				if(validator.isEmpty(ingredientItemItemReferenceMedication)){
					err_code = 2;
					err_msg = "Medication ingredient item item reference medication is required.";
				}else{
					dataMedication.ingredientItemItemReferenceMedication = ingredientItemItemReferenceMedication;
				}
			}else{
				ingredientItemItemReferenceMedication = "";
			}

			if (typeof req.body.ingredient.isActive !== 'undefined' && req.body.ingredient.isActive !== "") {
			  dataMedication.ingredientIsActive = req.body.ingredient.isActive.trim().toLowerCase();
			  if(ingredientIsActive === "true" || ingredientIsActive === "false"){
					dataMedication.ingredientIsActive = ingredientIsActive;
			  } else {
			    err_code = 2;
			    err_msg = "Medication ingredient is active is must be boolean.";
			  }
			} else {
			  ingredientIsActive = "";
			}

			if (typeof req.body.ingredient.amount !== 'undefined' && req.body.ingredient.amount !== "") {
			  var ingredientAmount = req.body.ingredient.amount;
			  if (ingredientAmount.indexOf("to") > 0) {
			    arrIngredientAmount = ingredientAmount.split("to");
			    dataMedication.ingredientAmountNumerator = arrIngredientAmount[0];
			    dataMedication.ingredientAmountDenominator = arrIngredientAmount[1];
				} else {
			  	err_code = 2;
			  	err_msg = "immunization ingredient amount invalid ratio format.";
				}
			} else {
			  ingredientAmount = "";
			}

			if(typeof req.body.package.container !== 'undefined' && req.body.package.container !== ""){
				dataMedication.packageContainer =  req.body.package.container.trim().toLowerCase();
				if(validator.isEmpty(packageContainer)){
					err_code = 2;
					err_msg = "Medication package container is required.";
				}else{
					dataMedication.packageContainer = packageContainer;
				}
			}else{
				packageContainer = "";
			}

			if(typeof req.body.package.content.item.itemCodeableConcept !== 'undefined' && req.body.package.content.item.itemCodeableConcept !== ""){
				dataMedication.packageContentItemItemCodeableConcept =  req.body.package.content.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(packageContentItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "Medication package content item item codeable concept is required.";
				}else{
					dataMedication.packageContentItemItemCodeableConcept = packageContentItemItemCodeableConcept;
				}
			}else{
				packageContentItemItemCodeableConcept = "";
			}

			if(typeof req.body.package.content.item.itemReference !== 'undefined' && req.body.package.content.item.itemReference !== ""){
				dataMedication.packageContentItemItemReference =  req.body.package.content.item.itemReference.trim().toLowerCase();
				if(validator.isEmpty(packageContentItemItemReference)){
					err_code = 2;
					err_msg = "Medication package content item item reference is required.";
				}else{
					dataMedication.packageContentItemItemReference = packageContentItemItemReference;
				}
			}else{
				packageContentItemItemReference = "";
			}

			if(typeof req.body.package.content.amount !== 'undefined' && req.body.package.content.amount !== ""){
				dataMedication.packageContentAmount =  req.body.package.content.amount.trim().toLowerCase();
				if(validator.isInt(packageContentAmount)){
					err_code = 2;
					err_msg = "Medication package content amount is required.";
				}else{
					dataMedication.packageContentAmount = packageContentAmount;
				}
			}else{
				packageContentAmount = "";
			}

			if(typeof req.body.package.batch.lotNumber !== 'undefined' && req.body.package.batch.lotNumber !== ""){
				dataMedication.packageBatchLotNumber =  req.body.package.batch.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(packageBatchLotNumber)){
					err_code = 2;
					err_msg = "Medication package batch lot number is required.";
				}else{
					dataMedication.packageBatchLotNumber = packageBatchLotNumber;
				}
			}else{
				packageBatchLotNumber = "";
			}

			if(typeof req.body.package.batch.expirationDate !== 'undefined' && req.body.package.batch.expirationDate !== ""){
				dataMedication.packageBatchExpirationDate =  req.body.package.batch.expirationDate;
				if(validator.isEmpty(packageBatchExpirationDate)){
					err_code = 2;
					err_msg = "immunization package batch expiration date is required.";
				}else{
					if(!regex.test(packageBatchExpirationDate)){
						err_code = 2;
						err_msg = "immunization package batch expiration date invalid date format.";	
					}
				}
			}else{
				packageBatchExpirationDate = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	

										//event emiter
										myEmitter.prependOnceListener('checkEndpointId', function() {
														//proses insert
														//set uniqe id
														var unicId = uniqid.time();
														var identifierId = 'ide' + unicId;
														var medicationId = 'ade' + unicId;

														dataMedication = {
															"adverse_event_id" : medicationId,
															"identifier_id" : identifierId,
															"category" : category,
															"type" : type,
															"subject_patient" : subjectPatient,
															"subject_research_subject" : subjectResearchSubject,
															"subject_research_subject" : subjectResearchSubject,
															"subject_device" : subjectDevice,
															"date" : date,
															"location" : location,
															"seriousness" : seriousness,
															"outcome" : outcome,
															"recorder_patient" : recorderPatient,
															"recorder_practitioner" : recorderPractitioner,
															"recorder_related_person" : recorderRelatedPerson,
															"event_participant_practitioner" : eventParticipantPractitioner,
															"event_participant_device" :eventParticipantDevice,
															"description" : description,
														}
														console.log(dataMedication);
														ApiFHIR.post('medication', {"apikey": apikey}, {body: dataMedication, json: true}, function(error, response, body){
															medication = body;
															if(medication.err_code > 0){
																res.json(medication);	
																console.log("ok");
															}
														});

														//identifier
														/*var identifierSystem = identifierId;
														dataIdentifier = {
																							"id": identifierId,
																							"use": identifierUseCode,
																							"type": identifierTypeCode,
																							"system": identifierSystem,
																							"value": identifierValue,
																							"period_start": identifierPeriodStart,
																							"period_end": identifierPeriodEnd,
																							"adverse_event_id": medicationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})*/

														res.json({"err_code": 0, "err_msg": "Care Team has been update.", "data": [{"_id": medicationId}]});

										});
										myEmitter.emit('checkEndpointId');

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