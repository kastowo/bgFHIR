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
		allergyIntolerance : function getAllergyIntolerance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			//params from query string
			var allergyIntoleranceId = req.query._id;
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

			var qString = {};

			if(typeof allergyIntoleranceId !== 'undefined'){
				if(!validator.isEmpty(allergyIntoleranceId)){
					qString.allergyIntoleranceId = allergyIntoleranceId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Adverse Event Id is required."});
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
			}

			seedPhoenixFHIR.path.GET = {
				"AllergyIntolerance" : {
					"location": "%(apikey)s/AllergyIntolerance",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('AllergyIntolerance', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var allergyIntolerance = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(allergyIntolerance.err_code == 0){
								//cek jumdata dulu
								if(allergyIntolerance.data.length > 0){
									newAllergyIntolerance = [];
									for(i=0; i < allergyIntolerance.data.length; i++){
										myEmitter.once("getIdentifier", function(allergyIntolerance, index, newAllergyIntolerance, countAllergyIntolerance){
														//get identifier
														qString = {};
														qString.allergy_intolerance_id = allergyIntolerance.id;
														seedPhoenixFHIR.path.GET = {
															"Identifier" : {
																"location": "%(apikey)s/Identifier",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('Identifier', {"apikey": apikey}, {}, function(error, response, body){
															identifier = JSON.parse(body);
															if(identifier.err_code == 0){
																var objectAllergyIntolerance = {};
																objectAllergyIntolerance.resourceType = allergyIntolerance.resourceType;
																objectAllergyIntolerance.id = allergyIntolerance.id;
																objectAllergyIntolerance.identifier = identifier.data;
																objectAllergyIntolerance.clinicalStatus = allergyIntolerance.clinicalStatus;
																objectAllergyIntolerance.verificationStatus = allergyIntolerance.verificationStatus;
																objectAllergyIntolerance.type = allergyIntolerance.type;
																objectAllergyIntolerance.category = allergyIntolerance.category;
																objectAllergyIntolerance.criticality = allergyIntolerance.criticality;
																objectAllergyIntolerance.code = allergyIntolerance.code;
																objectAllergyIntolerance.patient = allergyIntolerance.patient;
																objectAllergyIntolerance.onset = allergyIntolerance.onset;
																objectAllergyIntolerance.assertedDate = allergyIntolerance.assertedDate;
																objectAllergyIntolerance.recorder = allergyIntolerance.recorder;
																objectAllergyIntolerance.asserter = allergyIntolerance.asserter;
																objectAllergyIntolerance.lastOccurrence = allergyIntolerance.lastOccurrence;

																newAllergyIntolerance[index] = objectAllergyIntolerance;
																
																/*if(index == countAllergyIntolerance -1 ){
																	res.json({"err_code": 0, "data":newAllergyIntolerance});				
																}*/

																myEmitter.once('getAllergyIntoleranceReaction', function(allergyIntolerance, index, newAllergyIntolerance, countAllergyIntolerance){
																				qString = {};
																				qString.allergy_intolerance_id = allergyIntolerance.id;
																				seedPhoenixFHIR.path.GET = {
																					"AllergyIntoleranceReaction" : {
																						"location": "%(apikey)s/AllergyIntoleranceReaction",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('AllergyIntoleranceReaction', {"apikey": apikey}, {}, function(error, response, body){
																					allergyIntoleranceReaction = JSON.parse(body);
																					if(allergyIntoleranceReaction.err_code == 0){
																						var objectAllergyIntolerance = {};
																						objectAllergyIntolerance.resourceType = allergyIntolerance.resourceType;
																						objectAllergyIntolerance.id = allergyIntolerance.id;
																						objectAllergyIntolerance.identifier = allergyIntolerance.identifier;
																						objectAllergyIntolerance.clinicalStatus = allergyIntolerance.clinicalStatus;
																						objectAllergyIntolerance.verificationStatus = allergyIntolerance.verificationStatus;
																						objectAllergyIntolerance.type = allergyIntolerance.type;
																						objectAllergyIntolerance.category = allergyIntolerance.category;
																						objectAllergyIntolerance.criticality = allergyIntolerance.criticality;
																						objectAllergyIntolerance.code = allergyIntolerance.code;
																						objectAllergyIntolerance.patient = allergyIntolerance.patient;
																						objectAllergyIntolerance.onset = allergyIntolerance.onset;
																						objectAllergyIntolerance.assertedDate = allergyIntolerance.assertedDate;
																						objectAllergyIntolerance.recorder = allergyIntolerance.recorder;
																						objectAllergyIntolerance.asserter = allergyIntolerance.asserter;
																						objectAllergyIntolerance.lastOccurrence = allergyIntolerance.lastOccurrence;
																						objectAllergyIntolerance.reaction = allergyIntoleranceReaction.data;

																						newAllergyIntolerance[index] = objectAllergyIntolerance;

																						if(index == countAllergyIntolerance -1 ){
																							res.json({"err_code": 0, "data":newAllergyIntolerance});				
																						}			
																					}else{
																						res.json(allergyIntoleranceReaction);			
																					}
																				})
																			})
																myEmitter.emit('getAllergyIntoleranceReaction', objectAllergyIntolerance, index, newAllergyIntolerance, countAllergyIntolerance);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", allergyIntolerance.data[i], i, newAllergyIntolerance, allergyIntolerance.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Allergy Intolerance is empty."});	
								}
							}else{
								res.json(allergyIntolerance);
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
		allergyIntolerance : function addAllergyIntolerance(req, res){
			console.log("1");
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");

      var err_code = 0;
      var err_msg = "";
			
			if(typeof req.body.identifier.use !== 'undefined'){
				identifierUseCode =  req.body.identifier.use.trim().toLowerCase();
				if(validator.isEmpty(identifierUseCode)){
					err_code = 2;
					err_msg = "Identifier Use is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'use' in json identifier request.";
			} 

			//type code
			if(typeof req.body.identifier.type !== 'undefined'){
				identifierTypeCode =  req.body.identifier.type.trim().toUpperCase();
				if(validator.isEmpty(identifierTypeCode)){
					err_code = 2;
					err_msg = "Identifier Type is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json identifier request.";
			} 

			//identifier uniqe value
			if(typeof req.body.identifier.value !== 'undefined'){
				identifierValue =  req.body.identifier.value.trim();
				if(validator.isEmpty(identifierValue)){
					err_code = 2;
					err_msg = "Identifier Value is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value' in json identifier request.";
			}

			//identifier period start
			if(typeof req.body.identifier.period !== 'undefined'){
				period = req.body.identifier.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					identifierPeriodStart = arrPeriod[0];
					identifierPeriodEnd = arrPeriod[1];

					if(!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)){
						err_code = 2;
						err_msg = "Identifier Period invalid date format.";
					}	
				}

			}else{
				err_code = 1;
				err_msg = "Please add key 'period' in json identifier request.";
			}
			
			/*clinicalStatus|clinicalStatus|
verificationStatus|verificationStatus|
type|type|
category|category|
criticality|criticality|
code|code|
patient|patient|
onset.onsetDateTime|onsetOnsetDateTime|date
onset.onsetAge|onsetOnsetAge|
onset.onsetPeriod|onsetOnsetPeriod|period
onset.onsetRange|onsetOnsetRange|range
onset.onsetString|onsetOnsetString|
assertedDate|assertedDate|date
recorder.practitioner|recorderPractitioner|
recorder.patient|recorderPatient|
asserter.patient|asserterPatient
asserter.relatedPerson|asserterRelatedPerson
asserter.practitioner|asserterPractitioner
lastOccurrence|lastOccurrence|date
note|note|
reaction.substance|reactionSubstance|
reaction.manifestation|reactionManifestation|
reaction.description|reactionDescription|
reaction.onset|reactionOnset|date
reaction.severity|reactionSeverity|
reaction.exposureRoute|reactionExposureRoute|
reaction.note|reactionNote|*/
			
			if(typeof req.body.clinicalStatus !== 'undefined'){
				var clinicalStatus =  req.body.clinicalStatus.trim().toLowerCase();
				if(validator.isEmpty(clinicalStatus)){
					clinicalStatus = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'clinical status' in json Allergy Intolerance request.";
			}

			if(typeof req.body.verificationStatus !== 'undefined'){
				var verificationStatus =  req.body.verificationStatus.trim().toLowerCase();
				if(validator.isEmpty(verificationStatus)){
					err_code = 2;
					err_msg = "Allergy Intolerance verification status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'verification status' in json Allergy Intolerance request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					type = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Allergy Intolerance request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Allergy Intolerance request.";
			}

			if(typeof req.body.criticality !== 'undefined'){
				var criticality =  req.body.criticality.trim().toLowerCase();
				if(validator.isEmpty(criticality)){
					criticality = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'criticality' in json Allergy Intolerance request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Allergy Intolerance request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					err_code = 2;
					err_msg = "Allergy Intolerance patient is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.onset.onsetDateTime !== 'undefined'){
				var onsetOnsetDateTime =  req.body.onset.onsetDateTime;
				if(validator.isEmpty(onsetOnsetDateTime)){
					onsetOnsetDateTime = "";
				}else{
					if(!regex.test(onsetOnsetDateTime)){
						err_code = 2;
						err_msg = "Allergy Intolerance onset onset date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'onset onset date time' in json Allergy Intolerance request.";
			}

			if(typeof req.body.onset.onsetAge !== 'undefined'){
				var onsetOnsetAge =  req.body.onset.onsetAge.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetAge)){
					onsetOnsetAge = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'onset onset age' in json Allergy Intolerance request.";
			}

			if (typeof req.body.onset.onsetPeriod !== 'undefined') {
			  var onsetOnsetPeriod = req.body.onset.onsetPeriod;
				if (onsetOnsetPeriod !== ""){
					if (onsetOnsetPeriod.indexOf("to") > 0) {
						arrOnsetOnsetPeriod = onsetOnsetPeriod.split("to");
						var onsetOnsetPeriodStart = arrOnsetOnsetPeriod[0];
						var onsetOnsetPeriodEnd = arrOnsetOnsetPeriod[1];
						if (!regex.test(onsetOnsetPeriodStart) && !regex.test(onsetOnsetPeriodEnd)) {
							err_code = 2;
							err_msg = "Allergy Intolerance onset onset period invalid date format.";
						}
					} else {
						err_code = 2;
						err_msg = "Allergy Intolerance onset onset period invalid date format.";
					}	
				} else {
			  	onsetOnsetPeriodStart = "";
					onsetOnsetPeriodEnd = "";
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'onset onset period' in json Allergy Intolerance request.";
			}

			if (typeof req.body.onset.onsetRange !== 'undefined') {
			  var onsetOnsetRange = req.body.onset.onsetRange;
			  if (onsetOnsetRange.indexOf("to") > 0) {
			    arrOnsetOnsetRange = onsetOnsetRange.split("to");
			    var onsetOnsetRangeLow = arrOnsetOnsetRange[0];
			    var onsetOnsetRangeHigh = arrOnsetOnsetRange[1];
				} else {
			  	onsetOnsetRangeLow = "";
					onsetOnsetRangeHigh = "";
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'onset onset range' in json Allergy Intolerance request.";
			}

			if(typeof req.body.onset.onsetString !== 'undefined'){
				var onsetOnsetString =  req.body.onset.onsetString.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetString)){
					onsetOnsetString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'onset onset string' in json Allergy Intolerance request.";
			}

			if(typeof req.body.assertedDate !== 'undefined'){
				var assertedDate =  req.body.assertedDate;
				if(validator.isEmpty(assertedDate)){
					assertedDate = "";
				}else{
					if(!regex.test(assertedDate)){
						err_code = 2;
						err_msg = "Allergy Intolerance asserted date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserted date' in json Allergy Intolerance request.";
			}

			if(typeof req.body.recorder.practitioner !== 'undefined'){
				var recorderPractitioner =  req.body.recorder.practitioner.trim().toLowerCase();
				if(validator.isEmpty(recorderPractitioner)){
					recorderPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder practitioner' in json Allergy Intolerance request.";
			}

			if(typeof req.body.recorder.patient !== 'undefined'){
				var recorderPatient =  req.body.recorder.patient.trim().toLowerCase();
				if(validator.isEmpty(recorderPatient)){
					recorderPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.asserter.patient !== 'undefined'){
				var asserterPatient =  req.body.asserter.patient.trim().toLowerCase();
				if(validator.isEmpty(asserterPatient)){
					asserterPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserter patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.asserter.relatedPerson !== 'undefined'){
				var asserterRelatedPerson =  req.body.asserter.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(asserterRelatedPerson)){
					asserterRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserter related person' in json Allergy Intolerance request.";
			}

			if(typeof req.body.asserter.practitioner !== 'undefined'){
				var asserterPractitioner =  req.body.asserter.practitioner.trim().toLowerCase();
				if(validator.isEmpty(asserterPractitioner)){
					asserterPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserter practitioner' in json Allergy Intolerance request.";
			}

			if(typeof req.body.lastOccurrence !== 'undefined'){
				var lastOccurrence =  req.body.lastOccurrence;
				if(validator.isEmpty(lastOccurrence)){
					lastOccurrence = "";
				}else{
					if(!regex.test(lastOccurrence)){
						err_code = 2;
						err_msg = "Allergy Intolerance last occurrence invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'last occurrence' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note !== 'undefined'){
				var note =  req.body.note.trim().toLowerCase();
				if(validator.isEmpty(note)){
					note = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.substance !== 'undefined'){
				var reactionSubstance =  req.body.reaction.substance.trim().toLowerCase();
				if(validator.isEmpty(reactionSubstance)){
					reactionSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction substance' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.manifestation !== 'undefined'){
				var reactionManifestation =  req.body.reaction.manifestation.trim().toLowerCase();
				if(validator.isEmpty(reactionManifestation)){
					err_code = 2;
					err_msg = "Allergy Intolerance reaction manifestation is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction manifestation' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.description !== 'undefined'){
				var reactionDescription =  req.body.reaction.description.trim().toLowerCase();
				if(validator.isEmpty(reactionDescription)){
					reactionDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction description' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.onset !== 'undefined'){
				var reactionOnset =  req.body.reaction.onset;
				if(validator.isEmpty(reactionOnset)){
					reactionOnset = "";
				}else{
					if(!regex.test(reactionOnset)){
						err_code = 2;
						err_msg = "Allergy Intolerance reaction onset invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction onset' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.severity !== 'undefined'){
				var reactionSeverity =  req.body.reaction.severity.trim().toLowerCase();
				if(validator.isEmpty(reactionSeverity)){
					reactionSeverity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction severity' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.exposureRoute !== 'undefined'){
				var reactionExposureRoute =  req.body.reaction.exposureRoute.trim().toLowerCase();
				if(validator.isEmpty(reactionExposureRoute)){
					reactionExposureRoute = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction exposure route' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.note !== 'undefined'){
				var reactionNote =  req.body.reaction.note.trim().toLowerCase();
				if(validator.isEmpty(reactionNote)){
					reactionNote = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note' in json Allergy Intolerance request.";
			}


			console.log("2");
			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
						if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
								if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid	
									//event emiter
									myEmitter.prependOnceListener('checkIdentifierValue', function() {
										console.log("3");
											checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
												if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
													
													//proses insert

													//set uniqe id
													var unicId = uniqid.time();
													var identifierId = 'ide' + unicId;
													var allergyIntoleranceId = 'ade' + unicId;
													var suspectEntityId = 'sue' + unicId;

													dataAllergyIntolerance = {
														"allergy_intolerance_id" : allergyIntoleranceId,
														"clinical_status" : clinicalStatus,
														"verification_status" : verificationStatus,
														"type" : type,
														"category" : category,
														"criticality" : criticality,
														"code" : code,
														"patient" : patient,
														"onset_date_time" : onsetOnsetDateTime,
														"onset_age" : onsetOnsetAge,
														"onset_period_start" : onsetOnsetPeriodStart,
														"onset_period_end" : onsetOnsetPeriodEnd,
														"onset_range_low" : onsetOnsetRangeLow,
														"onset_range_high" : onsetOnsetRangeHigh,
														"onset_string" : onsetOnsetString,
														"asserted_date" : assertedDate,
														"recorder_practitioner" : recorderPractitioner,
														"recorder_patient" : recorderPatient,
														"asserter_patient" : asserterPatient,
														"asserter_related_person" : asserterRelatedPerson,
														"asserter_practitioner" : asserterPractitioner,
														"last_occurrence" : lastOccurrence
													}
													console.log(dataAllergyIntolerance);
													ApiFHIR.post('allergyIntolerance', {"apikey": apikey}, {body: dataAllergyIntolerance, json: true}, function(error, response, body){
														allergyIntolerance = body;
														if(allergyIntolerance.err_code > 0){
															res.json(allergyIntolerance);	
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
																						"allergy_intolerance_id": allergyIntoleranceId
																					}

													ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
														identifier = body;
														if(identifier.err_code > 0){
															res.json(identifier);	
														}
													})
													
													//AllergyIntoleranceReaction
													dataAllergyIntoleranceReaction = {
														"id" : allergyIntoleranceId,
														"substance" : reactionSubstance,
														"manifestation" : reactionManifestation,
														"description" : reactionDescription,
														"onset" : reactionOnset,
														"severity" : reactionSeverity,
														"exposureroute" : reactionExposureRoute,
														"allergy_intolerance_id" : allergyIntoleranceId
													}
													ApiFHIR.post('allergyIntoleranceReaction', {"apikey": apikey}, {body: dataAllergyIntoleranceReaction, json: true}, function(error, response, body){
														allergyIntoleranceReaction = body;
														if(allergyIntoleranceReaction.err_code > 0){
															res.json(allergyIntoleranceReaction);	
															console.log("ok");
														}
													});
// kurang reference note di allergy intolerance dan allergy intolerance reaction
													res.json({"err_code": 0, "err_msg": "Allergy Intolerance has been add.", "data": [{"_id": allergyIntoleranceId}]});
												}else{
													res.json({"err_code": 508, "err_msg": "Identifier value already exist."});		
												}
											})
									});
									
									myEmitter.prependOnceListener('checkClinicalStatus', function () {
										if (!validator.isEmpty(clinicalStatus)) {
											checkCode(apikey, clinicalStatus, 'ALLERGY_CLINICAL_STATUS', function (resClinicalStatusCode) {
												if (resClinicalStatusCode.err_code > 0) {
													myEmitter.emit('checkIdentifierValue');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Clinical Status code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkIdentifierValue');
										}
									})
									
									myEmitter.prependOnceListener('checkVerificationStatus', function () {
										if (!validator.isEmpty(verificationStatus)) {
											checkCode(apikey, verificationStatus, 'ALLERGY_VERIFICATION_STATUS', function (resVerificationStatusCode) {
												if (resVerificationStatusCode.err_code > 0) {
													myEmitter.emit('checkClinicalStatus');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Verification Status code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkClinicalStatus');
										}
									})
									
									myEmitter.prependOnceListener('checkType', function () {
										if (!validator.isEmpty(type)) {
											checkCode(apikey, type, 'ALLERGY_INTOLERANCE_TYPE', function (resTypeCode) {
												if (resTypeCode.err_code > 0) {
													myEmitter.emit('checkVerificationStatus');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Type code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkVerificationStatus');
										}
									})
									
									myEmitter.prependOnceListener('checkCategory', function () {
										if (!validator.isEmpty(category)) {
											checkCode(apikey, category, 'ALLERGY_INTOLERANCE_CATEGORY', function (resCategoryCode) {
												if (resCategoryCode.err_code > 0) {
													myEmitter.emit('checkType');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Category code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkType');
										}
									})
									
									myEmitter.prependOnceListener('checkCriticality', function () {
										if (!validator.isEmpty(criticality)) {
											checkCode(apikey, criticality, 'ALLERGY_INTOLERANCE_CRITICALITY', function (resCriticalityCode) {
												if (resCriticalityCode.err_code > 0) {
													myEmitter.emit('checkCategory');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Criticality code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkCategory');
										}
									})
									
									myEmitter.prependOnceListener('checkCode', function () {
										if (!validator.isEmpty(code)) {
											checkCode(apikey, code, 'ALLERGY_INTOLERANCE_CODE', function (resCodeCode) {
												if (resCodeCode.err_code > 0) {
													myEmitter.emit('checkCriticality');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Code code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkCriticality');
										}
									})
									
									myEmitter.prependOnceListener('checkReactionSubstance', function () {
										if (!validator.isEmpty(reactionSubstance)) {
											checkCode(apikey, reactionSubstance, 'SUBSTANCE_CODE', function (resReactionSubstanceCode) {
												if (resReactionSubstanceCode.err_code > 0) {
													myEmitter.emit('checkCode');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Reaction Substance code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkCode');
										}
									})
									
									myEmitter.prependOnceListener('checkReactionManifestation', function () {
										if (!validator.isEmpty(reactionManifestation)) {
											checkCode(apikey, reactionManifestation, 'CLINICAL_FINDINGS', function (resReactionManifestationCode) {
												if (resReactionManifestationCode.err_code > 0) {
													myEmitter.emit('checkReactionSubstance');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Reaction Manifestation code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkReactionSubstance');
										}
									})
									
									myEmitter.prependOnceListener('checkReactionSeverity', function () {
										if (!validator.isEmpty(reactionSeverity)) {
											checkCode(apikey, reactionSeverity, 'REACTION_EVENT_SEVERITY', function (resReactionSeverityCode) {
												if (resReactionSeverityCode.err_code > 0) {
													myEmitter.emit('checkReactionManifestation');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Reaction Severity code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkReactionManifestation');
										}
									})
									
									myEmitter.prependOnceListener('checkReactionExposureRoute', function () {
										if (!validator.isEmpty(reactionExposureRoute)) {
											checkCode(apikey, reactionExposureRoute, 'ROUTE_CODES', function (resReactionExposureRouteCode) {
												if (resReactionExposureRouteCode.err_code > 0) {
													myEmitter.emit('checkReactionSeverity');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Reaction Exposure Route code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkReactionSeverity');
										}
									})
									
									myEmitter.prependOnceListener('checkRecorderPractitioner', function () {
										if (!validator.isEmpty(recorderPractitioner)) {
											checkUniqeValue(apikey, "PRACTITIONER_ID|" + recorderPractitioner, 'PRACTITIONER', function (resRecorderPractitioner) {
												if (resRecorderPractitioner.err_code > 0) {
													myEmitter.emit('checkReactionExposureRoute');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Recorder Practitioner id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkReactionExposureRoute');
										}
									})
									
									myEmitter.prependOnceListener('checkRecorderPatient', function () {
										if (!validator.isEmpty(recorderPatient)) {
											checkUniqeValue(apikey, "PATIENT_ID|" + recorderPatient, 'PATIENT', function (resRecorderPatient) {
												if (resRecorderPatient.err_code > 0) {
													myEmitter.emit('checkRecorderPractitioner');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Recorder Patient id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkRecorderPractitioner');
										}
									})
									
									myEmitter.prependOnceListener('checkAsserterPatient', function () {
										if (!validator.isEmpty(asserterPatient)) {
											checkUniqeValue(apikey, "PATIENT_ID|" + asserterPatient, 'PATIENT', function (resAsserterPatient) {
												if (resAsserterPatient.err_code > 0) {
													myEmitter.emit('checkRecorderPatient');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Asserter Patient id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkRecorderPatient');
										}
									})
									
									myEmitter.prependOnceListener('checkAsserterRelatedPerson', function () {
										if (!validator.isEmpty(asserterRelatedPerson)) {
											checkUniqeValue(apikey, "RELATED_PERSON_ID|" + asserterRelatedPerson, 'RELATED_PERSON', function (resAsserterRelatedPerson) {
												if (resAsserterRelatedPerson.err_code > 0) {
													myEmitter.emit('checkAsserterPatient');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Asserter Related Person id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAsserterPatient');
										}
									})
									
									myEmitter.prependOnceListener('checkAsserterPractitioner', function () {
										if (!validator.isEmpty(asserterPractitioner)) {
											checkUniqeValue(apikey, "Practitioner_ID|" + asserterPractitioner, 'Practitioner', function (resAsserterPractitioner) {
												if (resAsserterPractitioner.err_code > 0) {
													myEmitter.emit('checkAsserterRelatedPerson');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Asserter Practitioner id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAsserterRelatedPerson');
										}
									})
									
									if (!validator.isEmpty(patient)) {
										checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
											if (resPatient.err_code > 0) {
												myEmitter.emit('checkAsserterPractitioner');
											} else {
												res.json({
													"err_code": "503",
													"err_msg": "Patient id not found"
												});
											}
										})
									} else {
										myEmitter.emit('checkAsserterPractitioner');
									}
									
									
								}else{
									res.json({"err_code": 502, "err_msg": "Identifier type code not found"});		
								}
							})
						}else{
							res.json({"err_code": 501, "err_msg": "Identifier use code not found"});
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
	put: {
		allergyIntolerance : function putAllergyIntolerance(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var allergyIntoleranceId = req.params.allergy_intolerance_id;

      var err_code = 0;
      var err_msg = "";
      var dataAllergyIntolerance = {};

      if (typeof allergyIntoleranceId !== 'undefined') {
        if (validator.isEmpty(allergyIntoleranceId)) {
          err_code = 2;
          err_msg = "Allergy Intolerance Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Allergy Intolerance Id is required.";
      }
			
			/*clinicalStatus|clinicalStatus|
verificationStatus|verificationStatus|
type|type|
category|category|
criticality|criticality|
code|code|
patient|patient|
onset.onsetDateTime|onsetOnsetDateTime|date
onset.onsetAge|onsetOnsetAge|
onset.onsetPeriod|onsetOnsetPeriod|period
onset.onsetRange|onsetOnsetRange|range
onset.onsetString|onsetOnsetString|
assertedDate|assertedDate|date
recorder.practitioner|recorderPractitioner|
recorder.patient|recorderPatient|
asserter.patient|asserterPatient
asserter.relatedPerson|asserterRelatedPerson
asserter.practitioner|asserterPractitioner
lastOccurrence|lastOccurrence|date
note|note|
reaction.substance|reactionSubstance|
reaction.manifestation|reactionManifestation|
reaction.description|reactionDescription|
reaction.onset|reactionOnset|date
reaction.severity|reactionSeverity|
reaction.exposureRoute|reactionExposureRoute|
reaction.note|reactionNote|*/
			
			if(typeof req.body.clinicalStatus !== 'undefined' && req.body.clinicalStatus !== ""){
				dataAllergyIntolerance.clinicalStatus =  req.body.clinicalStatus.trim().toLowerCase();
				if(validator.isEmpty(clinicalStatus)){
					err_code = 2;
					err_msg = "Allergy intolerance clinical status is required.";
				}else{
					dataAllergyIntolerance.clinicalStatus = clinicalStatus;
				}
			}else{
				clinicalStatus = "";
			}

			if(typeof req.body.verificationStatus !== 'undefined' && req.body.verificationStatus !== ""){
				dataAllergyIntolerance.verificationStatus =  req.body.verificationStatus.trim().toLowerCase();
				if(validator.isEmpty(verificationStatus)){
					err_code = 2;
					err_msg = "Allergy intolerance verification status is required.";
				}else{
					dataAllergyIntolerance.verificationStatus = verificationStatus;
				}
			}else{
				verificationStatus = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				dataAllergyIntolerance.type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					err_code = 2;
					err_msg = "Allergy intolerance type is required.";
				}else{
					dataAllergyIntolerance.type = type;
				}
			}else{
				type = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				dataAllergyIntolerance.category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					err_code = 2;
					err_msg = "Allergy intolerance category is required.";
				}else{
					dataAllergyIntolerance.category = category;
				}
			}else{
				category = "";
			}

			if(typeof req.body.criticality !== 'undefined' && req.body.criticality !== ""){
				dataAllergyIntolerance.criticality =  req.body.criticality.trim().toLowerCase();
				if(validator.isEmpty(criticality)){
					err_code = 2;
					err_msg = "Allergy intolerance criticality is required.";
				}else{
					dataAllergyIntolerance.criticality = criticality;
				}
			}else{
				criticality = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				dataAllergyIntolerance.code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					err_code = 2;
					err_msg = "Allergy intolerance code is required.";
				}else{
					dataAllergyIntolerance.code = code;
				}
			}else{
				code = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				dataAllergyIntolerance.patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					err_code = 2;
					err_msg = "Allergy intolerance patient is required.";
				}else{
					dataAllergyIntolerance.patient = patient;
				}
			}else{
				patient = "";
			}

			if(typeof req.body.onset.onsetDateTime !== 'undefined' && req.body.onset.onsetDateTime !== ""){
				dataAllergyIntolerance.onsetOnsetDateTime =  req.body.onset.onsetDateTime;
				if(validator.isEmpty(onsetOnsetDateTime)){
					err_code = 2;
					err_msg = "allergy intolerance onset onset date time is required.";
				}else{
					if(!regex.test(onsetOnsetDateTime)){
						err_code = 2;
						err_msg = "allergy intolerance onset onset date time invalid date format.";	
					}
				}
			}else{
				onsetOnsetDateTime = "";
			}

			if(typeof req.body.onset.onsetAge !== 'undefined' && req.body.onset.onsetAge !== ""){
				dataAllergyIntolerance.onsetOnsetAge =  req.body.onset.onsetAge.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetAge)){
					err_code = 2;
					err_msg = "Allergy intolerance onset onset age is required.";
				}else{
					dataAllergyIntolerance.onsetOnsetAge = onsetOnsetAge;
				}
			}else{
				onsetOnsetAge = "";
			}

			if (typeof req.body.onset.onsetPeriod !== 'undefined' && req.body.onset.onsetPeriod !== "") {
			  var onsetOnsetPeriod = req.body.onset.onsetPeriod;
			  if (onsetOnsetPeriod.indexOf("to") > 0) {
			    arrOnsetOnsetPeriod = onsetOnsetPeriod.split("to");
			    dataAllergyIntolerance.onsetOnsetPeriodStart = arrOnsetOnsetPeriod[0];
			    dataAllergyIntolerance.onsetOnsetPeriodEnd = arrOnsetOnsetPeriod[1];
			    if (!regex.test(onsetOnsetPeriodStart) && !regex.test(onsetOnsetPeriodEnd)) {
			      err_code = 2;
			      err_msg = "allergy intolerance onset onset period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "allergy intolerance onset onset period invalid date format.";
				}
			} else {
				onsetOnsetPeriod = "";
			}

			if (typeof req.body.onset.onsetRange !== 'undefined' && req.body.onset.onsetRange !== "") {
			  var onsetOnsetRange = req.body.onset.onsetRange;
			  if (onsetOnsetRange.indexOf("to") > 0) {
			    arrOnsetOnsetRange = onsetOnsetRange.split("to");
			    dataAllergyIntolerance.onsetOnsetRangeLow = arrOnsetOnsetRange[0];
			    dataAllergyIntolerance.onsetOnsetRangeHigh = arrOnsetOnsetRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "allergy intolerance onset onset range invalid range format.";
				}
			} else {
			  onsetOnsetRange = "";
			}

			if(typeof req.body.onset.onsetString !== 'undefined' && req.body.onset.onsetString !== ""){
				dataAllergyIntolerance.onsetOnsetString =  req.body.onset.onsetString.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetString)){
					err_code = 2;
					err_msg = "Allergy intolerance onset onset string is required.";
				}else{
					dataAllergyIntolerance.onsetOnsetString = onsetOnsetString;
				}
			}else{
				onsetOnsetString = "";
			}

			if(typeof req.body.assertedDate !== 'undefined' && req.body.assertedDate !== ""){
				dataAllergyIntolerance.assertedDate =  req.body.assertedDate;
				if(validator.isEmpty(assertedDate)){
					err_code = 2;
					err_msg = "allergy intolerance asserted date is required.";
				}else{
					if(!regex.test(assertedDate)){
						err_code = 2;
						err_msg = "allergy intolerance asserted date invalid date format.";	
					}
				}
			}else{
				assertedDate = "";
			}

			if(typeof req.body.recorder.practitioner !== 'undefined' && req.body.recorder.practitioner !== ""){
				dataAllergyIntolerance.recorderPractitioner =  req.body.recorder.practitioner.trim().toLowerCase();
				if(validator.isEmpty(recorderPractitioner)){
					err_code = 2;
					err_msg = "Allergy intolerance recorder practitioner is required.";
				}else{
					dataAllergyIntolerance.recorderPractitioner = recorderPractitioner;
				}
			}else{
				recorderPractitioner = "";
			}

			if(typeof req.body.recorder.patient !== 'undefined' && req.body.recorder.patient !== ""){
				dataAllergyIntolerance.recorderPatient =  req.body.recorder.patient.trim().toLowerCase();
				if(validator.isEmpty(recorderPatient)){
					err_code = 2;
					err_msg = "Allergy intolerance recorder patient is required.";
				}else{
					dataAllergyIntolerance.recorderPatient = recorderPatient;
				}
			}else{
				recorderPatient = "";
			}

			if(typeof req.body.asserter.patient !== 'undefined' && req.body.asserter.patient !== ""){
				dataAllergyIntolerance.asserterPatient =  req.body.asserter.patient.trim().toLowerCase();
				if(validator.isEmpty(asserterPatient)){
					err_code = 2;
					err_msg = "Allergy intolerance asserter patient is required.";
				}else{
					dataAllergyIntolerance.asserterPatient = asserterPatient;
				}
			}else{
				asserterPatient = "";
			}

			if(typeof req.body.asserter.relatedPerson !== 'undefined' && req.body.asserter.relatedPerson !== ""){
				dataAllergyIntolerance.asserterRelatedPerson =  req.body.asserter.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(asserterRelatedPerson)){
					err_code = 2;
					err_msg = "Allergy intolerance asserter related person is required.";
				}else{
					dataAllergyIntolerance.asserterRelatedPerson = asserterRelatedPerson;
				}
			}else{
				asserterRelatedPerson = "";
			}

			if(typeof req.body.asserter.practitioner !== 'undefined' && req.body.asserter.practitioner !== ""){
				dataAllergyIntolerance.asserterPractitioner =  req.body.asserter.practitioner.trim().toLowerCase();
				if(validator.isEmpty(asserterPractitioner)){
					err_code = 2;
					err_msg = "Allergy intolerance asserter practitioner is required.";
				}else{
					dataAllergyIntolerance.asserterPractitioner = asserterPractitioner;
				}
			}else{
				asserterPractitioner = "";
			}

			if(typeof req.body.lastOccurrence !== 'undefined' && req.body.lastOccurrence !== ""){
				dataAllergyIntolerance.lastOccurrence =  req.body.lastOccurrence;
				if(validator.isEmpty(lastOccurrence)){
					err_code = 2;
					err_msg = "allergy intolerance last occurrence is required.";
				}else{
					if(!regex.test(lastOccurrence)){
						err_code = 2;
						err_msg = "allergy intolerance last occurrence invalid date format.";	
					}
				}
			}else{
				lastOccurrence = "";
			}

			if(typeof req.body.note !== 'undefined' && req.body.note !== ""){
				dataAllergyIntolerance.note =  req.body.note.trim().toLowerCase();
				if(validator.isEmpty(note)){
					err_code = 2;
					err_msg = "Allergy intolerance note is required.";
				}else{
					dataAllergyIntolerance.note = note;
				}
			}else{
				note = "";
			}

			if(typeof req.body.reaction.substance !== 'undefined' && req.body.reaction.substance !== ""){
				dataAllergyIntolerance.reactionSubstance =  req.body.reaction.substance.trim().toLowerCase();
				if(validator.isEmpty(reactionSubstance)){
					err_code = 2;
					err_msg = "Allergy intolerance reaction substance is required.";
				}else{
					dataAllergyIntolerance.reactionSubstance = reactionSubstance;
				}
			}else{
				reactionSubstance = "";
			}

			if(typeof req.body.reaction.manifestation !== 'undefined' && req.body.reaction.manifestation !== ""){
				dataAllergyIntolerance.reactionManifestation =  req.body.reaction.manifestation.trim().toLowerCase();
				if(validator.isEmpty(reactionManifestation)){
					err_code = 2;
					err_msg = "Allergy intolerance reaction manifestation is required.";
				}else{
					dataAllergyIntolerance.reactionManifestation = reactionManifestation;
				}
			}else{
				reactionManifestation = "";
			}

			if(typeof req.body.reaction.description !== 'undefined' && req.body.reaction.description !== ""){
				dataAllergyIntolerance.reactionDescription =  req.body.reaction.description.trim().toLowerCase();
				if(validator.isEmpty(reactionDescription)){
					err_code = 2;
					err_msg = "Allergy intolerance reaction description is required.";
				}else{
					dataAllergyIntolerance.reactionDescription = reactionDescription;
				}
			}else{
				reactionDescription = "";
			}

			if(typeof req.body.reaction.onset !== 'undefined' && req.body.reaction.onset !== ""){
				dataAllergyIntolerance.reactionOnset =  req.body.reaction.onset;
				if(validator.isEmpty(reactionOnset)){
					err_code = 2;
					err_msg = "allergy intolerance reaction onset is required.";
				}else{
					if(!regex.test(reactionOnset)){
						err_code = 2;
						err_msg = "allergy intolerance reaction onset invalid date format.";	
					}
				}
			}else{
				reactionOnset = "";
			}

			if(typeof req.body.reaction.severity !== 'undefined' && req.body.reaction.severity !== ""){
				dataAllergyIntolerance.reactionSeverity =  req.body.reaction.severity.trim().toLowerCase();
				if(validator.isEmpty(reactionSeverity)){
					err_code = 2;
					err_msg = "Allergy intolerance reaction severity is required.";
				}else{
					dataAllergyIntolerance.reactionSeverity = reactionSeverity;
				}
			}else{
				reactionSeverity = "";
			}

			if(typeof req.body.reaction.exposureRoute !== 'undefined' && req.body.reaction.exposureRoute !== ""){
				dataAllergyIntolerance.reactionExposureRoute =  req.body.reaction.exposureRoute.trim().toLowerCase();
				if(validator.isEmpty(reactionExposureRoute)){
					err_code = 2;
					err_msg = "Allergy intolerance reaction exposure route is required.";
				}else{
					dataAllergyIntolerance.reactionExposureRoute = reactionExposureRoute;
				}
			}else{
				reactionExposureRoute = "";
			}

			if(typeof req.body.reaction.note !== 'undefined' && req.body.reaction.note !== ""){
				dataAllergyIntolerance.reactionNote =  req.body.reaction.note.trim().toLowerCase();
				if(validator.isEmpty(reactionNote)){
					err_code = 2;
					err_msg = "Allergy intolerance reaction note is required.";
				}else{
					dataAllergyIntolerance.reactionNote = reactionNote;
				}
			}else{
				reactionNote = "";
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
														var allergyIntoleranceId = 'ade' + unicId;

														dataAllergyIntolerance = {
															"adverse_event_id" : allergyIntoleranceId,
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
														console.log(dataAllergyIntolerance);
														ApiFHIR.post('allergyIntolerance', {"apikey": apikey}, {body: dataAllergyIntolerance, json: true}, function(error, response, body){
															allergyIntolerance = body;
															if(allergyIntolerance.err_code > 0){
																res.json(allergyIntolerance);	
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
																							"adverse_event_id": allergyIntoleranceId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})*/

														res.json({"err_code": 0, "err_msg": "Adverse Event has been update.", "data": [{"_id": allergyIntoleranceId}]});

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