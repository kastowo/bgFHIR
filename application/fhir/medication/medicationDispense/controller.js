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
		medicationDispense : function getMedicationDispense(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var medicationDispenseId = req.query._id;
			var code = req.query.code;
			var context = req.query.context;
			var destination = req.query.destination;
			var identifier = req.query.identifier;
			var medication = req.query.medication;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var prescription = req.query.prescription;
			var receiver = req.query.receiver;
			var responsibleparty = req.query.responsibleparty;
			var status = req.query.status;
			var subject = req.query.subject;
			var type = req.query.type;
			var whenhandedover = req.query.whenhandedover;
			var whenprepared = req.query.whenprepared;
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

			if(typeof medicationDispenseId !== 'undefined'){
				if(!validator.isEmpty(medicationDispenseId)){
					qString.medicationDispenseId = medicationDispenseId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Medication Dispense Id is required."});
				}
			}
			
			if(typeof code !== 'undefined'){
				if(!validator.isEmpty(code)){
					qString.code = code; 
				}else{
					res.json({"err_code": 1, "err_msg": "code is empty."});
				}
			}

			if(typeof context !== 'undefined'){
				if(!validator.isEmpty(context)){
					qString.context = context; 
				}else{
					res.json({"err_code": 1, "err_msg": "context is empty."});
				}
			}

			if(typeof destination !== 'undefined'){
				if(!validator.isEmpty(destination)){
					qString.destination = destination; 
				}else{
					res.json({"err_code": 1, "err_msg": "destination is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "identifier is empty."});
				}
			}

			if(typeof medication !== 'undefined'){
				if(!validator.isEmpty(medication)){
					qString.medication = medication; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "patient is empty."});
				}
			}

			if(typeof performer !== 'undefined'){
				if(!validator.isEmpty(performer)){
					qString.performer = performer; 
				}else{
					res.json({"err_code": 1, "err_msg": "performer is empty."});
				}
			}

			if(typeof prescription !== 'undefined'){
				if(!validator.isEmpty(prescription)){
					qString.prescription = prescription; 
				}else{
					res.json({"err_code": 1, "err_msg": "prescription is empty."});
				}
			}

			if(typeof receiver !== 'undefined'){
				if(!validator.isEmpty(receiver)){
					qString.receiver = receiver; 
				}else{
					res.json({"err_code": 1, "err_msg": "receiver is empty."});
				}
			}

			if(typeof responsibleparty !== 'undefined'){
				if(!validator.isEmpty(responsibleparty)){
					qString.responsibleparty = responsibleparty; 
				}else{
					res.json({"err_code": 1, "err_msg": "responsibleparty is empty."});
				}
			}

			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "status is empty."});
				}
			}

			if(typeof subject !== 'undefined'){
				if(!validator.isEmpty(subject)){
					qString.subject = subject; 
				}else{
					res.json({"err_code": 1, "err_msg": "subject is empty."});
				}
			}

			if(typeof type !== 'undefined'){
				if(!validator.isEmpty(type)){
					qString.type = type; 
				}else{
					res.json({"err_code": 1, "err_msg": "type is empty."});
				}
			}

			if(typeof whenhandedover !== 'undefined'){
				if(!validator.isEmpty(whenhandedover)){
					if(!regex.test(whenhandedover)){
						res.json({"err_code": 1, "err_msg": "whenhandedover invalid format."});
					}else{
						qString.whenhandedover = whenhandedover; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "whenhandedover is empty."});
				}
			}

			if(typeof whenprepared !== 'undefined'){
				if(!validator.isEmpty(whenprepared)){
					if(!regex.test(whenprepared)){
						res.json({"err_code": 1, "err_msg": "whenprepared invalid format."});
					}else{
						qString.whenprepared = whenprepared; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "whenprepared is empty."});
				}
			}


			

			seedPhoenixFHIR.path.GET = {
				"MedicationDispense" : {
					"location": "%(apikey)s/MedicationDispense",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('MedicationDispense', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var medicationDispense = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(medicationDispense.err_code == 0){
								//cek jumdata dulu
								if(medicationDispense.data.length > 0){
									newMedicationDispense = [];
									for(i=0; i < medicationDispense.data.length; i++){
										myEmitter.once("getIdentifier", function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
											/*console.log(medicationDispense);*/
														//get identifier
														qString = {};
														qString.medication_dispense_id = medicationDispense.id;
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
																var objectMedicationDispense = {};
																objectMedicationDispense.resourceType = medicationDispense.resourceType;
																objectMedicationDispense.id = medicationDispense.id;
																objectMedicationDispense.identifier = identifier.data;
																objectMedicationDispense.status = medicationDispense.status;
																objectMedicationDispense.category = medicationDispense.category;
																objectMedicationDispense.medication = medicationDispense.medication;
																objectMedicationDispense.subject = medicationDispense.subject;
																objectMedicationDispense.context = medicationDispense.context;
																objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
																objectMedicationDispense.type = medicationDispense.type;
																objectMedicationDispense.quantity = medicationDispense.quantity;
																objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
																objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
																objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
																objectMedicationDispense.destination = medicationDispense.destination;
																objectMedicationDispense.notDone = medicationDispense.notDone;
																objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;
																
																newMedicationDispense[index] = objectMedicationDispense;
																
																myEmitter.once('getMedicationDispensePerformer', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
																				qString = {};
																				qString.medication_dispense_id = medicationDispense.id;
																				seedPhoenixFHIR.path.GET = {
																					"MedicationDispensePerformer" : {
																						"location": "%(apikey)s/MedicationDispensePerformer",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('MedicationDispensePerformer', {"apikey": apikey}, {}, function(error, response, body){
																					medicationDispensePerformer = JSON.parse(body);
																					if(medicationDispensePerformer.err_code == 0){
																						var objectMedicationDispense = {};
																						objectMedicationDispense.resourceType = medicationDispense.resourceType;
																						objectMedicationDispense.id = medicationDispense.id;
																						objectMedicationDispense.identifier = medicationDispense.identifier;
																						objectMedicationDispense.status = medicationDispense.status;
																						objectMedicationDispense.category = medicationDispense.category;
																						objectMedicationDispense.medication = medicationDispense.medication;
																						objectMedicationDispense.subject = medicationDispense.subject;
																						objectMedicationDispense.context = medicationDispense.context;
																						objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
																						objectMedicationDispense.performer = medicationDispensePerformer.data;
																						objectMedicationDispense.type = medicationDispense.type;
																						objectMedicationDispense.quantity = medicationDispense.quantity;
																						objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
																						objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
																						objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
																						objectMedicationDispense.destination = medicationDispense.destination;
																						objectMedicationDispense.notDone = medicationDispense.notDone;
																						objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;
																						
																						newMedicationDispense[index] = objectMedicationDispense;

																						myEmitter.once('getMedicationDispenseSubstitution', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
																							qString = {};
																							qString.medication_dispense_id = medicationDispense.id;
																							seedPhoenixFHIR.path.GET = {
																								"MedicationDispenseSubstitution" : {
																									"location": "%(apikey)s/MedicationDispenseSubstitution",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('MedicationDispenseSubstitution', {"apikey": apikey}, {}, function(error, response, body){
																								medicationDispenseSubstitution = JSON.parse(body);
																								if(medicationDispenseSubstitution.err_code == 0){
																									var objectMedicationDispense = {};
																									objectMedicationDispense.resourceType = medicationDispense.resourceType;
																									objectMedicationDispense.id = medicationDispense.id;
																									objectMedicationDispense.identifier = medicationDispense.identifier;
																									objectMedicationDispense.status = medicationDispense.status;
																									objectMedicationDispense.category = medicationDispense.category;
																									objectMedicationDispense.medication = medicationDispense.medication;
																									objectMedicationDispense.subject = medicationDispense.subject;
																									objectMedicationDispense.context = medicationDispense.context;
																									objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
																									objectMedicationDispense.performer = medicationDispense.performer;
																									objectMedicationDispense.type = medicationDispense.type;
																									objectMedicationDispense.quantity = medicationDispense.quantity;
																									objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
																									objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
																									objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
																									objectMedicationDispense.destination = medicationDispense.destination;
																									objectMedicationDispense.substitution = medicationDispenseSubstitution.data;
																									objectMedicationDispense.notDone = medicationDispense.notDone;
																									objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;
															
																									newMedicationDispense[index] = objectMedicationDispense;
																									/*if(index == countMedicationDispense -1 ){
				res.json({"err_code": 0, "data":newMedicationDispense});				
			}*/
																									myEmitter.once('getMedicationDispensePartOf', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
																										qString = {};
																										qString.medication_dispense_id = medicationDispense.id;
																										seedPhoenixFHIR.path.GET = {
																											"MedicationDispensePartOf" : {
																												"location": "%(apikey)s/MedicationDispensePartOf",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('MedicationDispensePartOf', {"apikey": apikey}, {}, function(error, response, body){
																											medicationDispensePartOf = JSON.parse(body);
																											if(medicationDispensePartOf.err_code == 0){
																												var objectMedicationDispense = {};
																												objectMedicationDispense.resourceType = medicationDispense.resourceType;
																												objectMedicationDispense.id = medicationDispense.id;
																												objectMedicationDispense.identifier = medicationDispense.identifier;
																												objectMedicationDispense.partOf = medicationDispensePartOf.data;
																												objectMedicationDispense.status = medicationDispense.status;
																												objectMedicationDispense.category = medicationDispense.category;
																												objectMedicationDispense.medication = medicationDispense.medication;
																												objectMedicationDispense.subject = medicationDispense.subject;
																												objectMedicationDispense.context = medicationDispense.context;
																												objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
																												objectMedicationDispense.performer = medicationDispense.performer;
																												objectMedicationDispense.type = medicationDispense.type;
																												objectMedicationDispense.quantity = medicationDispense.quantity;
																												objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
																												objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
																												objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
																												objectMedicationDispense.destination = medicationDispense.destination;
																												objectMedicationDispense.substitution = medicationDispense.substitution;
																												objectMedicationDispense.notDone = medicationDispense.notDone;
																												objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;

																												newMedicationDispense[index] = objectMedicationDispense;

																												myEmitter.once('getMedicationDispenseAuthorizingPrescription', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
																													qString = {};
																													qString.medication_dispense_id = medicationDispense.id;
																													seedPhoenixFHIR.path.GET = {
																														"MedicationDispenseAuthorizingPrescription" : {
																															"location": "%(apikey)s/MedicationDispenseAuthorizingPrescription",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('MedicationDispenseAuthorizingPrescription', {"apikey": apikey}, {}, function(error, response, body){
																														medicationDispenseAuthorizingPrescription = JSON.parse(body);
																														if(medicationDispenseAuthorizingPrescription.err_code == 0){
																															var objectMedicationDispense = {};
																															objectMedicationDispense.resourceType = medicationDispense.resourceType;
																															objectMedicationDispense.id = medicationDispense.id;
																															objectMedicationDispense.identifier = medicationDispense.identifier;
																															objectMedicationDispense.partOf = medicationDispense.partOf;
																															objectMedicationDispense.status = medicationDispense.status;
																															objectMedicationDispense.category = medicationDispense.category;
																															objectMedicationDispense.medication = medicationDispense.medication;
																															objectMedicationDispense.subject = medicationDispense.subject;
																															objectMedicationDispense.context = medicationDispense.context;
																															objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
																															objectMedicationDispense.performer = medicationDispense.performer;
																															objectMedicationDispense.authorizingPrescription = medicationDispenseAuthorizingPrescription.data;
																															objectMedicationDispense.type = medicationDispense.type;
																															objectMedicationDispense.quantity = medicationDispense.quantity;
																															objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
																															objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
																															objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
																															objectMedicationDispense.destination = medicationDispense.destination;
																															objectMedicationDispense.substitution = medicationDispense.substitution;
																															objectMedicationDispense.notDone = medicationDispense.notDone;
																															objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;

																															newMedicationDispense[index] = objectMedicationDispense;

																															myEmitter.once('getMedicationDispenseReceiverPatient', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
																																qString = {};
																																qString.medication_dispense_id = medicationDispense.id;
																																seedPhoenixFHIR.path.GET = {
																																	"MedicationDispenseReceiverPatient" : {
																																		"location": "%(apikey)s/MedicationDispenseReceiverPatient",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('MedicationDispenseReceiverPatient', {"apikey": apikey}, {}, function(error, response, body){
																																	medicationDispenseReceiverPatient = JSON.parse(body);
																																	if(medicationDispenseReceiverPatient.err_code == 0){
																																		var objectMedicationDispense = {};
																																		objectMedicationDispense.resourceType = medicationDispense.resourceType;
																																		objectMedicationDispense.id = medicationDispense.id;
																																		objectMedicationDispense.identifier = medicationDispense.identifier;
																																		objectMedicationDispense.partOf = medicationDispense.partOf;
																																		objectMedicationDispense.status = medicationDispense.status;
																																		objectMedicationDispense.category = medicationDispense.category;
																																		objectMedicationDispense.medication = medicationDispense.medication;
																																		objectMedicationDispense.subject = medicationDispense.subject;
																																		objectMedicationDispense.context = medicationDispense.context;
																																		objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
																																		objectMedicationDispense.performer = medicationDispense.performer;
																																		objectMedicationDispense.authorizingPrescription = medicationDispense.authorizingPrescription;
																																		objectMedicationDispense.type = medicationDispense.type;
																																		objectMedicationDispense.quantity = medicationDispense.quantity;
																																		objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
																																		objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
																																		objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
																																		objectMedicationDispense.destination = medicationDispense.destination;
																																		var Receiver = {};
																																		Receiver.patient = medicationDispenseReceiverPatient.data;
																																		objectMedicationDispense.receiver = Receiver;
																																		objectMedicationDispense.substitution = medicationDispense.substitution;
																																		objectMedicationDispense.notDone = medicationDispense.notDone;
																																		objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;

																																		newMedicationDispense[index] = objectMedicationDispense;

																																		myEmitter.once('getMedicationDispenseReceiverPratitioner', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
																																			qString = {};
																																			qString.medication_dispense_id = medicationDispense.id;
																																			seedPhoenixFHIR.path.GET = {
																																				"MedicationDispenseReceiverPratitioner" : {
																																					"location": "%(apikey)s/MedicationDispenseReceiverPratitioner",
																																					"query": qString
																																				}
																																			}

																																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																			ApiFHIR.get('MedicationDispenseReceiverPratitioner', {"apikey": apikey}, {}, function(error, response, body){
																																				medicationDispenseReceiverPratitioner = JSON.parse(body);
																																				if(medicationDispenseReceiverPratitioner.err_code == 0){
																																					var objectMedicationDispense = {};
																																					objectMedicationDispense.resourceType = medicationDispense.resourceType;
																																					objectMedicationDispense.id = medicationDispense.id;
																																					objectMedicationDispense.identifier = medicationDispense.identifier;
																																					objectMedicationDispense.partOf = medicationDispense.partOf;
																																					objectMedicationDispense.status = medicationDispense.status;
																																					objectMedicationDispense.category = medicationDispense.category;
																																					objectMedicationDispense.medication = medicationDispense.medication;
																																					objectMedicationDispense.subject = medicationDispense.subject;
																																					objectMedicationDispense.context = medicationDispense.context;
																																					objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
																																					objectMedicationDispense.performer = medicationDispense.performer;
																																					objectMedicationDispense.authorizingPrescription = medicationDispense.authorizingPrescription;
																																					objectMedicationDispense.type = medicationDispense.type;
																																					objectMedicationDispense.quantity = medicationDispense.quantity;
																																					objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
																																					objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
																																					objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
																																					objectMedicationDispense.destination = medicationDispense.destination;
																																					var Receiver = {};
																																					Receiver.patient = medicationDispense.receiver.patient;
																																					Receiver.practitioner = medicationDispenseReceiverPratitioner.data;
																																					objectMedicationDispense.receiver = Receiver;
																																					objectMedicationDispense.substitution = medicationDispense.substitution;
																																					objectMedicationDispense.notDone = medicationDispense.notDone;
																																					objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;

																																					newMedicationDispense[index] = objectMedicationDispense;

myEmitter.once('getMedicationDispenseDetectedIssue', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
				qString = {};
				qString.medication_dispense_id = medicationDispense.id;
				seedPhoenixFHIR.path.GET = {
					"MedicationDispenseDetectedIssue" : {
						"location": "%(apikey)s/MedicationDispenseDetectedIssue",
						"query": qString
					}
				}

				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

				ApiFHIR.get('MedicationDispenseDetectedIssue', {"apikey": apikey}, {}, function(error, response, body){
					medicationDispenseDetectedIssue = JSON.parse(body);
					if(medicationDispenseDetectedIssue.err_code == 0){
						var objectMedicationDispense = {};
						objectMedicationDispense.resourceType = medicationDispense.resourceType;
						objectMedicationDispense.id = medicationDispense.id;
						objectMedicationDispense.identifier = medicationDispense.identifier;
						objectMedicationDispense.partOf = medicationDispense.partOf;
						objectMedicationDispense.status = medicationDispense.status;
						objectMedicationDispense.category = medicationDispense.category;
						objectMedicationDispense.medication = medicationDispense.medication;
						objectMedicationDispense.subject = medicationDispense.subject;
						objectMedicationDispense.context = medicationDispense.context;
						objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
						objectMedicationDispense.performer = medicationDispense.performer;
						objectMedicationDispense.authorizingPrescription = medicationDispense.authorizingPrescription;
						objectMedicationDispense.type = medicationDispense.type;
						objectMedicationDispense.quantity = medicationDispense.quantity;
						objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
						objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
						objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
						objectMedicationDispense.destination = medicationDispense.destination;
						objectMedicationDispense.receiver = medicationDispense.receiver;
						objectMedicationDispense.substitution = medicationDispense.substitution;
						objectMedicationDispense.detectedIssue = medicationDispenseDetectedIssue.data;
						objectMedicationDispense.notDone = medicationDispense.notDone;
						objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;

						newMedicationDispense[index] = objectMedicationDispense;
						myEmitter.once('getMedicationDispenseProvenance', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
							qString = {};
							qString.medication_dispense_id = medicationDispense.id;
							seedPhoenixFHIR.path.GET = {
								"MedicationDispenseProvenance" : {
									"location": "%(apikey)s/MedicationDispenseProvenance",
									"query": qString
								}
							}

							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

							ApiFHIR.get('MedicationDispenseProvenance', {"apikey": apikey}, {}, function(error, response, body){
								medicationDispenseProvenance = JSON.parse(body);
								if(medicationDispenseProvenance.err_code == 0){
									var objectMedicationDispense = {};
									objectMedicationDispense.resourceType = medicationDispense.resourceType;
									objectMedicationDispense.id = medicationDispense.id;
									objectMedicationDispense.identifier = medicationDispense.identifier;
									objectMedicationDispense.partOf = medicationDispense.partOf;
									objectMedicationDispense.status = medicationDispense.status;
									objectMedicationDispense.category = medicationDispense.category;
									objectMedicationDispense.medication = medicationDispense.medication;
									objectMedicationDispense.subject = medicationDispense.subject;
									objectMedicationDispense.context = medicationDispense.context;
									objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
									objectMedicationDispense.performer = medicationDispense.performer;
									objectMedicationDispense.authorizingPrescription = medicationDispense.authorizingPrescription;
									objectMedicationDispense.type = medicationDispense.type;
									objectMedicationDispense.quantity = medicationDispense.quantity;
									objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
									objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
									objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
									objectMedicationDispense.destination = medicationDispense.destination;
									objectMedicationDispense.receiver = medicationDispense.receiver;
									objectMedicationDispense.substitution = medicationDispense.substitution;
									objectMedicationDispense.detectedIssue = medicationDispense.detectedIssue;
									objectMedicationDispense.notDone = medicationDispense.notDone;
									objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;
									objectMedicationDispense.eventHistory = medicationDispenseProvenance.data;
									newMedicationDispense[index] = objectMedicationDispense;

									myEmitter.once('getMedicationDispenseDosage', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
										qString = {};
										qString.medication_dispense_id = medicationDispense.id;
										seedPhoenixFHIR.path.GET = {
											"MedicationDispenseDosage" : {
												"location": "%(apikey)s/MedicationDispenseDosage",
												"query": qString
											}
										}

										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('MedicationDispenseDosage', {"apikey": apikey}, {}, function(error, response, body){
											medicationDispenseDosage = JSON.parse(body);
											if(medicationDispenseDosage.err_code == 0){
												var objectMedicationDispense = {};
												objectMedicationDispense.resourceType = medicationDispense.resourceType;
												objectMedicationDispense.id = medicationDispense.id;
												objectMedicationDispense.identifier = medicationDispense.identifier;
												objectMedicationDispense.partOf = medicationDispense.partOf;
												objectMedicationDispense.status = medicationDispense.status;
												objectMedicationDispense.category = medicationDispense.category;
												objectMedicationDispense.medication = medicationDispense.medication;
												objectMedicationDispense.subject = medicationDispense.subject;
												objectMedicationDispense.context = medicationDispense.context;
												objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
												objectMedicationDispense.performer = medicationDispense.performer;
												objectMedicationDispense.authorizingPrescription = medicationDispense.authorizingPrescription;
												objectMedicationDispense.type = medicationDispense.type;
												objectMedicationDispense.quantity = medicationDispense.quantity;
												objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
												objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
												objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
												objectMedicationDispense.destination = medicationDispense.destination;
												objectMedicationDispense.receiver = medicationDispense.receiver;
												objectMedicationDispense.dosageInstruction = medicationDispenseDosage.data;
												objectMedicationDispense.substitution = medicationDispense.substitution;
												objectMedicationDispense.detectedIssue = medicationDispense.detectedIssue;
												objectMedicationDispense.notDone = medicationDispense.notDone;
												objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;
												objectMedicationDispense.eventHistory = medicationDispense.eventHistory;
												newMedicationDispense[index] = objectMedicationDispense;

												myEmitter.once('getMedicationDispenseNote', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
													qString = {};
													qString.medication_dispense_id = medicationDispense.id;
													seedPhoenixFHIR.path.GET = {
														"Annotation" : {
															"location": "%(apikey)s/Annotation",
															"query": qString
														}
													}

													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get('Annotation', {"apikey": apikey}, {}, function(error, response, body){
														annotation = JSON.parse(body);
														if(annotation.err_code == 0){
															var objectMedicationDispense = {};
															objectMedicationDispense.resourceType = medicationDispense.resourceType;
															objectMedicationDispense.id = medicationDispense.id;
															objectMedicationDispense.identifier = medicationDispense.identifier;
															objectMedicationDispense.partOf = medicationDispense.partOf;
															objectMedicationDispense.status = medicationDispense.status;
															objectMedicationDispense.category = medicationDispense.category;
															objectMedicationDispense.medication = medicationDispense.medication;
															objectMedicationDispense.subject = medicationDispense.subject;
															objectMedicationDispense.context = medicationDispense.context;
															objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
															objectMedicationDispense.performer = medicationDispense.performer;
															objectMedicationDispense.authorizingPrescription = medicationDispense.authorizingPrescription;
															objectMedicationDispense.type = medicationDispense.type;
															objectMedicationDispense.quantity = medicationDispense.quantity;
															objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
															objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
															objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
															objectMedicationDispense.destination = medicationDispense.destination;
															objectMedicationDispense.receiver = medicationDispense.receiver;
															objectMedicationDispense.note = annotation.data;
															objectMedicationDispense.dosageInstruction = medicationDispense.dosageInstruction;
															objectMedicationDispense.substitution = medicationDispense.substitution;
															objectMedicationDispense.detectedIssue = medicationDispense.detectedIssue;
															objectMedicationDispense.notDone = medicationDispense.notDone;
															objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;
															objectMedicationDispense.eventHistory = medicationDispense.eventHistory;
															newMedicationDispense[index] = objectMedicationDispense;

															
myEmitter.once('getMedicationDispenseResponsibleParty', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
	qString = {};
	qString.medication_dispense_id = medicationDispense.id;
	seedPhoenixFHIR.path.GET = {
		"MedicationDispenseResponsibleParty" : {
			"location": "%(apikey)s/MedicationDispenseResponsibleParty",
			"query": qString
		}
	}

	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

	ApiFHIR.get('MedicationDispenseResponsibleParty', {"apikey": apikey}, {}, function(error, response, body){
		medicationDispenseResponsibleParty = JSON.parse(body);
		if(medicationDispenseResponsibleParty.err_code == 0){
			var objectMedicationDispense = {};
			objectMedicationDispense.resourceType = medicationDispense.resourceType;
			objectMedicationDispense.id = medicationDispense.id;
			objectMedicationDispense.identifier = medicationDispense.identifier;
			objectMedicationDispense.partOf = medicationDispense.partOf;
			objectMedicationDispense.status = medicationDispense.status;
			objectMedicationDispense.category = medicationDispense.category;
			objectMedicationDispense.medication = medicationDispense.medication;
			objectMedicationDispense.subject = medicationDispense.subject;
			objectMedicationDispense.context = medicationDispense.context;
			objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
			objectMedicationDispense.performer = medicationDispense.performer;
			objectMedicationDispense.authorizingPrescription = medicationDispense.authorizingPrescription;
			objectMedicationDispense.type = medicationDispense.type;
			objectMedicationDispense.quantity = medicationDispense.quantity;
			objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
			objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
			objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
			objectMedicationDispense.destination = medicationDispense.destination;
			objectMedicationDispense.receiver = medicationDispense.receiver;
			console.log("hcs : " + medicationDispense.substitution.length);
			var arrSubstitution = [];
			if (medicationDispense.substitution.length == '0') {
				arrSubstitution = [];
			} else {
				var Substitution = {};
				Substitution.id = medicationDispense.substitution[0].id;
				Substitution.wasSubstituted = medicationDispense.substitution[0].wasSubstituted;
				Substitution.type = medicationDispense.substitution[0].type;
				Substitution.reason = medicationDispense.substitution[0].reason;
				Substitution.responsibleParty = medicationDispenseResponsibleParty.data;
				//objectMedicationDispense.substitution = Substitution;
				console.log(medicationDispense.substitution[0].id);
				console.log(Substitution);
				arrSubstitution[0] = Substitution;
			}
			objectMedicationDispense.substitution = arrSubstitution;
			//objectMedicationDispense.substitution = medicationDispense.substitution;
			objectMedicationDispense.notDone = medicationDispense.notDone;
			objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;

			newMedicationDispense[index] = objectMedicationDispense;

			if(index == countMedicationDispense -1 ){
				res.json({"err_code": 0, "data":newMedicationDispense});				
			}
		}else{
			res.json(medicationDispenseResponsibleParty);			
		}
	})
})
myEmitter.emit('getMedicationDispenseResponsibleParty', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);															
														}else{
															res.json(annotation);			
														}
													})
												})
												myEmitter.emit('getMedicationDispenseNote', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);																																					

											}else{
												res.json(medicationDispenseDosage);			
											}
										})
									})
									myEmitter.emit('getMedicationDispenseDosage', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);																																					

								}else{
									res.json(medicationDispenseProvenance);			
								}
							})
						})
						myEmitter.emit('getMedicationDispenseProvenance', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);								
					}else{
						res.json(medicationDispenseDetectedIssue);			
					}
				})
			})
			myEmitter.emit('getMedicationDispenseDetectedIssue', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);																																					
																																					
																																				}else{
																																					res.json(medicationDispenseReceiverPratitioner);			
																																				}
																																			})
																																		})
																																		myEmitter.emit('getMedicationDispenseReceiverPratitioner', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);																																			
																																	}else{
																																		res.json(medicationDispenseReceiverPatient);			
																																	}
																																})
																															})
																															myEmitter.emit('getMedicationDispenseReceiverPatient', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);																																																
																														}else{
																															res.json(medicationDispenseAuthorizingPrescription);			
																														}
																													})
																												})
																												myEmitter.emit('getMedicationDispenseAuthorizingPrescription', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);																									

																											}else{
																												res.json(medicationDispensePartOf);			
																											}
																										})
																									})
																									myEmitter.emit('getMedicationDispensePartOf', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);																									
																								}else{
																									res.json(medicationDispenseSubstitution);			
																								}
																							})
																						})
																						myEmitter.emit('getMedicationDispenseSubstitution', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);
																					}else{
																						res.json(medicationDispensePerformer);			
																					}
																				})
																			})
																myEmitter.emit('getMedicationDispensePerformer', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", medicationDispense.data[i], i, newMedicationDispense, medicationDispense.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Medication Dispense is empty."});	
								}
							}else{
								res.json(medicationDispense);
							}
						}
					});
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		},
		identifier: function getIdentifier(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var medicationDispenseId = req.params.medication_dispense_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.medication_dispense_id = medicationDispenseId;
								  			qString._id = identifierId;
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
														res.json({"err_code": 0, "data":identifier.data});	
													}else{
														res.json(identifier);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Identifier Id not found"});		
											}
										})
									}else{
										//get identifier
						  			qString = {};
						  			qString.medication_dispense_id = medicationDispenseId;
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
												res.json({"err_code": 0, "data":identifier.data});	
											}else{
												res.json(identifier);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		medicationDispensePerformer: function getMedicationDispensePerformer(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var medicationDispenseId = req.params.medication_dispense_id;
					var medicationDispensePerformerId = req.params.medication_dispense_performer_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									if(typeof medicationDispensePerformerId !== 'undefined' && !validator.isEmpty(medicationDispensePerformerId)){
										checkUniqeValue(apikey, "PERFORMER_ID|" + medicationDispensePerformerId, 'MEDICATION_DISPENCE_PERFORMER', function(resMedicationDispensePerformerID){
											if(resMedicationDispensePerformerID.err_code > 0){
												//get medicationDispensePerformer
								  			qString = {};
								  			qString.medication_dispense_id = medicationDispenseId;
								  			qString._id = medicationDispensePerformerId;
									  		seedPhoenixFHIR.path.GET = {
													"MedicationDispensePerformer" : {
														"location": "%(apikey)s/MedicationDispensePerformer",
														"query": qString
													}
												}
												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

												ApiFHIR.get('MedicationDispensePerformer', {"apikey": apikey}, {}, function(error, response, body){
													medicationDispensePerformer = JSON.parse(body);
													if(medicationDispensePerformer.err_code == 0){
														res.json({"err_code": 0, "data":medicationDispensePerformer.data});	
													}else{
														res.json(medicationDispensePerformer);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Medication Dispense Ingredient Id not found"});		
											}
										})
									}else{
										//get medicationDispensePerformer
						  			qString = {};
						  			qString.medication_dispense_id = medicationDispenseId;
							  		seedPhoenixFHIR.path.GET = {
											"MedicationDispensePerformer" : {
												"location": "%(apikey)s/MedicationDispensePerformer",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('MedicationDispensePerformer', {"apikey": apikey}, {}, function(error, response, body){
											medicationDispensePerformer = JSON.parse(body);
											if(medicationDispensePerformer.err_code == 0){
												res.json({"err_code": 0, "data":medicationDispensePerformer.data});	
											}else{
												res.json(medicationDispensePerformer);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		medicationDispenseSubstitution: function getMedicationDispenseSubstitution(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var medicationDispenseId = req.params.medication_dispense_id;
					var medicationDispenseSubstitutionId = req.params.medication_dispense_performer_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									if(typeof medicationDispenseSubstitutionId !== 'undefined' && !validator.isEmpty(medicationDispenseSubstitutionId)){
										checkUniqeValue(apikey, "SUBSTITUTION_ID|" + medicationDispenseSubstitutionId, 'MEDICATION_DISPENSE_SUBSTITUTION', function(resMedicationDispenseSubstitutionID){
											if(resMedicationDispenseSubstitutionID.err_code > 0){
												//get medicationDispenseSubstitution
								  			qString = {};
								  			qString.medication_dispense_id = medicationDispenseId;
								  			qString._id = medicationDispenseSubstitutionId;
									  		seedPhoenixFHIR.path.GET = {
													"MedicationDispenseSubstitution" : {
														"location": "%(apikey)s/MedicationDispenseSubstitution",
														"query": qString
													}
												}
												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

												ApiFHIR.get('MedicationDispenseSubstitution', {"apikey": apikey}, {}, function(error, response, body){
													medicationDispenseSubstitution = JSON.parse(body);
													if(medicationDispenseSubstitution.err_code == 0){
														res.json({"err_code": 0, "data":medicationDispenseSubstitution.data});	
													}else{
														res.json(medicationDispenseSubstitution);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Medication Dispense Ingredient Id not found"});		
											}
										})
									}else{
										//get medicationDispenseSubstitution
						  			qString = {};
						  			qString.medication_dispense_id = medicationDispenseId;
							  		seedPhoenixFHIR.path.GET = {
											"MedicationDispenseSubstitution" : {
												"location": "%(apikey)s/MedicationDispenseSubstitution",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('MedicationDispenseSubstitution', {"apikey": apikey}, {}, function(error, response, body){
											medicationDispenseSubstitution = JSON.parse(body);
											if(medicationDispenseSubstitution.err_code == 0){
												res.json({"err_code": 0, "data":medicationDispenseSubstitution.data});	
											}else{
												res.json(medicationDispenseSubstitution);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		medicationDispenseDosage: function getMedicationDispenseDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationDispenseId = req.params.medication_dispense_id;
			var medicationDispenseDosageId = req.params.dosage_id;
			console.log("12345");
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resPatientID){
						if(resPatientID.err_code > 0){
							if(typeof medicationDispenseDosageId !== 'undefined' && !validator.isEmpty(medicationDispenseDosageId)){
								console.log("1");
								checkUniqeValue(apikey, "DOSAGE_ID|" + medicationDispenseDosageId, 'DOSAGE', function(resMedicationDispenseDosageID){
									if(resMedicationDispenseDosageID.err_code > 0){
										//get medicationDispenseDosage
										qString = {};
										qString.medication_dispense_id = medicationDispenseId;
										qString._id = medicationDispenseDosageId;
										seedPhoenixFHIR.path.GET = {
											"MedicationDispenseDosage" : {
												"location": "%(apikey)s/Dosage",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('MedicationDispenseDosage', {"apikey": apikey}, {}, function(error, response, body){
											medicationDispenseDosage = JSON.parse(body);
											console.log(medicationDispenseDosage);
											if(medicationDispenseDosage.err_code == 0){
														//res.json({"err_code": 0, "data":medicationDispenseDosage.data});
														if(medicationDispenseDosage.data.length > 0){
															newMedicationDispenseDosage = [];
															for(i=0; i < medicationDispenseDosage.data.length; i++){
																myEmitter.once('getTiming', function(medicationDispenseDosage, index, newMedicationDispenseDosage, countImmunizationRecommendation){
																	qString = {};
																	qString.recommendation_id = medicationDispenseDosage.id;
																	seedPhoenixFHIR.path.GET = {
																		"Timing" : {
																			"location": "%(apikey)s/Timing",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('Timing', {"apikey": apikey}, {}, function(error, response, body){
																		medicationDispenseDosageTiming = JSON.parse(body);
																		if(medicationDispenseDosageTiming.err_code == 0){
																			var objectMedicationDispenseDosage = {};
																			objectMedicationDispenseDosage.id = medicationDispenseDosage.id;
																			objectMedicationDispenseDosage.sequence = medicationDispenseDosage.sequence;
																			objectMedicationDispenseDosage.text = medicationDispenseDosage.text;
																			objectMedicationDispenseDosage.additionalInstruction = medicationDispenseDosage.additionalInstruction;
																			objectMedicationDispenseDosage.patientInstruction = medicationDispenseDosage.patientInstruction;
																			objectMedicationDispenseDosage.timing = medicationDispenseDosageTiming.data;
																			objectMedicationDispenseDosage.asNeeded = medicationDispenseDosage.asNeeded;
																			objectMedicationDispenseDosage.site = medicationDispenseDosage.site;
																			objectMedicationDispenseDosage.route = medicationDispenseDosage.route;
																			objectMedicationDispenseDosage.method = medicationDispenseDosage.method;
																			objectMedicationDispenseDosage.dose = medicationDispenseDosage.dose;
																			objectMedicationDispenseDosage.maxDosePerPeriod = medicationDispenseDosage.maxDosePerPeriod;
																			objectMedicationDispenseDosage.maxDosePerAdministration = medicationDispenseDosage.maxDosePerAdministration;
																			objectMedicationDispenseDosage.maxDoseLerLifetime = medicationDispenseDosage.maxDoseLerLifetime;
																			objectMedicationDispenseDosage.rate = medicationDispenseDosage.rate;

																			newMedicationDispenseDosage[index] = objectMedicationDispenseDosage;
																			if(index == countImmunizationRecommendation -1 ){
																				res.json({"err_code": 0, "data":newMedicationDispenseDosage});	
																			}
																		}else{
																			res.json(medicationDispenseDosageTiming);			
																		}
																	})
																})
																myEmitter.emit('getTiming', medicationDispenseDosage.data[i], i, newMedicationDispenseDosage, medicationDispenseDosage.data.length);
															}
															//res.json({"err_code": 0, "data":organization.data});
														}else{
															res.json({"err_code": 2, "err_msg": "Medication Dispense is empty."});	
														}
													/*-------------*/
													}else{
														res.json(medicationDispenseDosage);
													}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Medication Dispense Recommendation Id not found"});		
									}
								})
							}else{
								console.log("2");
								//get medicationDispenseDosage
								qString = {};
								qString.medication_dispense_id = medicationDispenseId;
								seedPhoenixFHIR.path.GET = {
									"MedicationDispenseDosage" : {
										"location": "%(apikey)s/Dosage",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('MedicationDispenseDosage', {"apikey": apikey}, {}, function(error, response, body){
									medicationDispenseDosage = JSON.parse(body);
									console.log(medicationDispenseDosage);
									if(medicationDispenseDosage.err_code == 0){
												//res.json({"err_code": 0, "data":medicationDispenseDosage.data});
												if(medicationDispenseDosage.data.length > 0){
													newMedicationDispenseDosage = [];
													for(i=0; i < medicationDispenseDosage.data.length; i++){
														myEmitter.once('getTiming', function(medicationDispenseDosage, index, newMedicationDispenseDosage, countImmunizationRecommendation){
															qString = {};
															qString.recommendation_id = medicationDispenseDosage.id;
															seedPhoenixFHIR.path.GET = {
																"Timing" : {
																	"location": "%(apikey)s/Timing",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('Timing', {"apikey": apikey}, {}, function(error, response, body){
																medicationDispenseDosageTiming = JSON.parse(body);
																if(medicationDispenseDosageTiming.err_code == 0){
																	var objectMedicationDispenseDosage = {};
																	objectMedicationDispenseDosage.id = medicationDispenseDosage.id;
																	objectMedicationDispenseDosage.sequence = medicationDispenseDosage.sequence;
																	objectMedicationDispenseDosage.text = medicationDispenseDosage.text;
																	objectMedicationDispenseDosage.additionalInstruction = medicationDispenseDosage.additionalInstruction;
																	objectMedicationDispenseDosage.patientInstruction = medicationDispenseDosage.patientInstruction;
																	objectMedicationDispenseDosage.timing = medicationDispenseDosageTiming.data;
																	objectMedicationDispenseDosage.asNeeded = medicationDispenseDosage.asNeeded;
																	objectMedicationDispenseDosage.site = medicationDispenseDosage.site;
																	objectMedicationDispenseDosage.route = medicationDispenseDosage.route;
																	objectMedicationDispenseDosage.method = medicationDispenseDosage.method;
																	objectMedicationDispenseDosage.dose = medicationDispenseDosage.dose;
																	objectMedicationDispenseDosage.maxDosePerPeriod = medicationDispenseDosage.maxDosePerPeriod;
																	objectMedicationDispenseDosage.maxDosePerAdministration = medicationDispenseDosage.maxDosePerAdministration;
																	objectMedicationDispenseDosage.maxDoseLerLifetime = medicationDispenseDosage.maxDoseLerLifetime;
																	objectMedicationDispenseDosage.rate = medicationDispenseDosage.rate;
																	
																	newMedicationDispenseDosage[index] = objectMedicationDispenseDosage;
																	if(index == countImmunizationRecommendation -1 ){
																		res.json({"err_code": 0, "data":newMedicationDispenseDosage});	
																	}
																}else{
																	res.json(medicationDispenseDosageTiming);			
																}
															})
														})
														myEmitter.emit('getTiming', medicationDispenseDosage.data[i], i, newMedicationDispenseDosage, medicationDispenseDosage.data.length);
													}
													//res.json({"err_code": 0, "data":organization.data});
												}else{
													res.json({"err_code": 2, "err_msg": "Medication Dispense is empty."});	
												}
											/*-------------*/
											}else{
												res.json(medicationDispenseDosage);
											}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Medication Dispense Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
	},
	post: {
		medicationDispense : function addMedicationDispense(req, res){
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
/*
partOf|partOf|||
status|status|||
category|category|||
medication.medicationCodeableConcept|medicationMedicationCodeableConcept||nn|
medication.medicationReference|medicationMedicationReference|||
subject.patient|subjectPatient|||
subject.group|subjectGroup|||
context.encounter|contextEncounter|||
context.episodeOfCare|contextEpisodeOfCare|||
supportingInformation|supportingInformation|||
performer.actor.practitioner|performerActorPractitioner|||
performer.actor.organization|performerActorOrganization|||
performer.actor.patient|performerActorPatient|||
performer.actor.device|performerActorDevice|||
performer.actor.relatedPerson|performerActorRelatedPerson|||
performer.onBehalfOf|performerOnBehalfOf|||
authorizingPrescription|authorizingPrescription|||
type|type|||u
quantity|quantity|integer||
daysSupply|daysSupply|integer||
whenPrepared|whenPrepared|date||
whenHandedOver|whenHandedOver|date||
destination|destination|||
receiver.patient|receiverPatient|||
receiver.practitioner|receiverPractitioner|||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||
dosageInstruction|dosageInstruction|||
substitution.wasSubstituted|substitutionWasSubstituted|boolean|nn|
substitution.type|substitutionType||||u
substitution.reason|substitutionReason|||u
substitution.responsibleParty|substitutionResponsibleParty|||
detectedIssue|detectedIssue|||
notDone|notDone|boolean||
notDoneReason.notDoneReasonCodeableConcept|notDoneReasonNotDoneReasonCodeableConcept|||
notDoneReason.notDoneReasonReference|notDoneReasonNotDoneReasonReference||
eventHistory|eventHistory|||
*/
			if(typeof req.body.partOf !== 'undefined'){
				var partOf =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(partOf)){
					partOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of' in json Medication Dispense request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication Dispense request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Medication Dispense request.";
			}

			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined'){
				var medicationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "Medication Dispense medication medication codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication medication codeable concept' in json Medication Dispense request.";
			}

			if(typeof req.body.medication.medicationReference !== 'undefined'){
				var medicationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationReference)){
					medicationMedicationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication medication reference' in json Medication Dispense request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Medication Dispense request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Medication Dispense request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Medication Dispense request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Medication Dispense request.";
			}

			if(typeof req.body.supportingInformation !== 'undefined'){
				var supportingInformation =  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(supportingInformation)){
					supportingInformation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'supporting information' in json Medication Dispense request.";
			}

			if(typeof req.body.performer.actor.practitioner !== 'undefined'){
				var performerActorPractitioner =  req.body.performer.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					performerActorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor practitioner' in json Medication Dispense request.";
			}

			if(typeof req.body.performer.actor.organization !== 'undefined'){
				var performerActorOrganization =  req.body.performer.actor.organization.trim().toLowerCase();
				if(validator.isEmpty(performerActorOrganization)){
					performerActorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor organization' in json Medication Dispense request.";
			}

			if(typeof req.body.performer.actor.patient !== 'undefined'){
				var performerActorPatient =  req.body.performer.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					performerActorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor patient' in json Medication Dispense request.";
			}

			if(typeof req.body.performer.actor.device !== 'undefined'){
				var performerActorDevice =  req.body.performer.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					performerActorDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor device' in json Medication Dispense request.";
			}

			if(typeof req.body.performer.actor.relatedPerson !== 'undefined'){
				var performerActorRelatedPerson =  req.body.performer.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					performerActorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor related person' in json Medication Dispense request.";
			}

			if(typeof req.body.performer.onBehalfOf !== 'undefined'){
				var performerOnBehalfOf =  req.body.performer.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					performerOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer on behalf of' in json Medication Dispense request.";
			}

			if(typeof req.body.authorizingPrescription !== 'undefined'){
				var authorizingPrescription =  req.body.authorizingPrescription.trim().toLowerCase();
				if(validator.isEmpty(authorizingPrescription)){
					authorizingPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'authorizing prescription' in json Medication Dispense request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var type =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(type)){
					type = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Medication Dispense request.";
			}

			if(typeof req.body.quantity !== 'undefined'){
				var quantity =  req.body.quantity.trim();
				if(validator.isEmpty(quantity)){
					quantity = "";
				}else{
					if(!validator.isInt(quantity)){
						err_code = 2;
						err_msg = "Medication Dispense quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quantity' in json Medication Dispense request.";
			}

			if(typeof req.body.daysSupply !== 'undefined'){
				var daysSupply =  req.body.daysSupply.trim();
				if(validator.isEmpty(daysSupply)){
					daysSupply = "";
				}else{
					if(!validator.isInt(daysSupply)){
						err_code = 2;
						err_msg = "Medication Dispense days supply is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'days supply' in json Medication Dispense request.";
			}

			if(typeof req.body.whenPrepared !== 'undefined'){
				var whenPrepared =  req.body.whenPrepared;
				if(validator.isEmpty(whenPrepared)){
					whenPrepared = "";
				}else{
					if(!regex.test(whenPrepared)){
						err_code = 2;
						err_msg = "Medication Dispense when prepared invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'when prepared' in json Medication Dispense request.";
			}

			if(typeof req.body.whenHandedOver !== 'undefined'){
				var whenHandedOver =  req.body.whenHandedOver;
				if(validator.isEmpty(whenHandedOver)){
					whenHandedOver = "";
				}else{
					if(!regex.test(whenHandedOver)){
						err_code = 2;
						err_msg = "Medication Dispense when handed over invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'when handed over' in json Medication Dispense request.";
			}

			if(typeof req.body.destination !== 'undefined'){
				var destination =  req.body.destination.trim().toLowerCase();
				if(validator.isEmpty(destination)){
					destination = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'destination' in json Medication Dispense request.";
			}

			if(typeof req.body.receiver.patient !== 'undefined'){
				var receiverPatient =  req.body.receiver.patient.trim().toLowerCase();
				if(validator.isEmpty(receiverPatient)){
					receiverPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'receiver patient' in json Medication Dispense request.";
			}

			if(typeof req.body.receiver.practitioner !== 'undefined'){
				var receiverPractitioner =  req.body.receiver.practitioner.trim().toLowerCase();
				if(validator.isEmpty(receiverPractitioner)){
					receiverPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'receiver practitioner' in json Medication Dispense request.";
			}
			
			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Medication Dispense request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Medication Dispense request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Medication Dispense request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Medication Dispense request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Medication Administration note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Medication Dispense request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Medication Dispense request.";
			}
			
			if(typeof req.body.dosageInstruction !== 'undefined'){
				var dosageInstruction =  req.body.dosageInstruction.trim().toLowerCase();
				if(validator.isEmpty(dosageInstruction)){
					dosageInstruction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage instruction' in json Medication Dispense request.";
			}

			if (typeof req.body.substitution.wasSubstituted !== 'undefined') {
				var substitutionWasSubstituted = req.body.substitution.wasSubstituted.trim().toLowerCase();
				if(substitutionWasSubstituted === "true" || substitutionWasSubstituted === "false"){
					substitutionWasSubstituted = substitutionWasSubstituted;
				} else {
					err_code = 2;
					err_msg = "Medication Dispense substitution was substituted is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'substitution was substituted' in json Medication Dispense request.";
			}

			if(typeof req.body.substitution.type !== 'undefined'){
				var substitutionType =  req.body.substitution.type.trim().toLowerCase();
				if(validator.isEmpty(substitutionType)){
					substitutionType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'substitution type' in json Medication Dispense request.";
			}

			if(typeof req.body.substitution.reason !== 'undefined'){
				var substitutionReason =  req.body.substitution.reason.trim().toUpperCase();
				if(validator.isEmpty(substitutionReason)){
					substitutionReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'substitution reason' in json Medication Dispense request.";
			}

			if(typeof req.body.substitution.responsibleParty !== 'undefined'){
				var substitutionResponsibleParty =  req.body.substitution.responsibleParty.trim().toLowerCase();
				if(validator.isEmpty(substitutionResponsibleParty)){
					substitutionResponsibleParty = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'substitution responsible party' in json Medication Dispense request.";
			}

			if(typeof req.body.detectedIssue !== 'undefined'){
				var detectedIssue =  req.body.detectedIssue.trim().toLowerCase();
				if(validator.isEmpty(detectedIssue)){
					detectedIssue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detected issue' in json Medication Dispense request.";
			}

			if (typeof req.body.notDone !== 'undefined') {
				var notDone = req.body.notDone.trim().toLowerCase();
					if(validator.isEmpty(notDone)){
						notDone = "false";
					}
				if(notDone === "true" || notDone === "false"){
					notDone = notDone;
				} else {
					err_code = 2;
					err_msg = "Medication Dispense not done is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'not done' in json Medication Dispense request.";
			}

			if(typeof req.body.notDoneReason.notDoneReasonCodeableConcept !== 'undefined'){
				var notDoneReasonNotDoneReasonCodeableConcept =  req.body.notDoneReason.notDoneReasonCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(notDoneReasonNotDoneReasonCodeableConcept)){
					notDoneReasonNotDoneReasonCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not done reason not done reason codeable concept' in json Medication Dispense request.";
			}

			if(typeof req.body.notDoneReason.notDoneReasonReference !== 'undefined'){
				var notDoneReasonNotDoneReasonReference =  req.body.notDoneReason.notDoneReasonReference.trim().toLowerCase();
				if(validator.isEmpty(notDoneReasonNotDoneReasonReference)){
					notDoneReasonNotDoneReasonReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not done reason not done reason reference' in json Medication Dispense request.";
			}
			
			
			if(typeof req.body.eventHistory !== 'undefined'){
				var eventHistory =  req.body.eventHistory.trim().toLowerCase();
				if(validator.isEmpty(eventHistory)){
					eventHistory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'event history' in json Medication Dispense request.";
			}

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

												checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
													if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada

														//proses insert

														//set uniqe id
														var unicId = uniqid.time();
														var identifierId = 'ide' + unicId;
														var medicationDispenseId = 'mdi' + unicId;
														var medicationDispensePerformerId = 'mdp' + unicId;
														var medicationDispenseSubstitutionId = 'mds' + unicId;
														var AnnotationId = 'ann' + unicId;

														dataMedicationDispense = {
															"medication_dispense_id" : medicationDispenseId,
															"status" : status,
															"category" : category,
															"medication_codeable_concept" : medicationMedicationCodeableConcept,
															"medication_reference" : medicationMedicationReference,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"supporting_information" : supportingInformation,
															"type" : type,
															"quantity" : quantity,
															"days_supply" : daysSupply,
															"when_prepared" : whenPrepared,
															"when_handed_over" : whenHandedOver,
															"destination" : destination,
															"not_done" : notDone,
															"not_done_reason_codeable_concept" : notDoneReasonNotDoneReasonCodeableConcept,
															"not_done_reason_reference" : notDoneReasonNotDoneReasonReference
														}
														console.log(dataMedicationDispense);
														ApiFHIR.post('medicationDispense', {"apikey": apikey}, {body: dataMedicationDispense, json: true}, function(error, response, body){
															medicationDispense = body;
															if(medicationDispense.err_code > 0){
																res.json(medicationDispense);	
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
																							"medication_dispense_id": medicationDispenseId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
													
														//MedicationDispenseRecommendation
														dataMedicationDispensePerformer = {
															"performer_id" : medicationDispensePerformerId,
															"actor_practitioner" : performerActorPractitioner,
															"actor_organization" : performerActorOrganization	,														
															"actor_patient" : performerActorPatient,
															"actor_related_person" : performerActorRelatedPerson,
															"actor_device" : performerActorDevice,
															"on_behalf_of" : performerOnBehalfOf,
															"medication_dispense_id" : medicationDispenseId
														}
														ApiFHIR.post('medicationDispensePerformer', {"apikey": apikey}, {body: dataMedicationDispensePerformer, json: true}, function(error, response, body){
															medicationDispensePerformer = body;
															if(medicationDispensePerformer.err_code > 0){
																res.json(medicationDispensePerformer);	
																console.log("ok");
															}
														});
														
														//MedicationDispenseDateCriterion
														dataMedicationDispenseSubstitution = {
															"substitution_id" : medicationDispenseSubstitutionId,
															"was_substituted" : substitutionWasSubstituted,
															"type" : substitutionType,
															"reason" : substitutionReason,
															"medication_dispense_id" : medicationDispenseId
														}
														ApiFHIR.post('medicationDispenseSubstitution', {"apikey": apikey}, {body: dataMedicationDispenseSubstitution, json: true}, function(error, response, body){
															medicationDispenseSubstitution = body;
															if(medicationDispenseSubstitution.err_code > 0){
																res.json(medicationDispenseSubstitution);	
																console.log("ok");
															}
														});
														
														dataAnnotation = {
															"id" : AnnotationId,
															"author_ref_practitioner" : noteAuthorPractitioner,
															"author_ref_patient" : noteAuthorPatient,
															"author_ref_relatedPerson" : noteAuthorRelatedPerson,
															"author_string" : noteAuthorAuthorString,
															"time" : noteTime,
															"text" : noteText,
															"medication_dispense_id" : medicationDispenseId
														}
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataAnnotation, json: true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
																console.log("ok");
															}
														});	
														
														
														//ref
														if(partOf !== ""){
															dataPartOf = {
																"_id" : partOf,
																"medication_dispense_id" : medicationDispenseId
															}
															ApiFHIR.put('procedure', {"apikey": apikey, "_id": partOf}, {body: dataPartOf, json: true}, function(error, response, body){
																returnPartOf = body;
																if(returnPartOf.err_code > 0){
																	res.json(returnPartOf);	
																	console.log("add reference part of : " + partOf);
																}
															});
														}

														if(authorizingPrescription !== ""){
															dataAuthorizingPrescription = {
																"_id" : authorizingPrescription,
																"medication_dispense_id" : medicationDispenseId
															}
															ApiFHIR.put('medication_request', {"apikey": apikey, "_id": authorizingPrescription}, {body: dataAuthorizingPrescription, json: true}, function(error, response, body){
																returnAuthorizingPrescription = body;
																if(returnAuthorizingPrescription.err_code > 0){
																	res.json(returnAuthorizingPrescription);	
																	console.log("add reference authorizing prescription : " + authorizingPrescription);
																}
															});
														}

														if(receiverPatient !== ""){
															dataReceiverPatient = {
																"_id" : receiverPatient,
																"medication_dispense_id" : medicationDispenseId
															}
															ApiFHIR.put('patient', {"apikey": apikey, "_id": receiverPatient}, {body: dataReceiverPatient, json: true}, function(error, response, body){
																returnReceiverPatient = body;
																if(returnReceiverPatient.err_code > 0){
																	res.json(returnReceiverPatient);	
																	console.log("add reference receiver patient : " + receiverPatient);
																}
															});
														}

														if(receiverPractitioner !== ""){
															dataReceiverPractitioner = {
																"_id" : receiverPractitioner,
																"medication_dispense_id" : medicationDispenseId
															}
															ApiFHIR.put('practitioner', {"apikey": apikey, "_id": receiverPractitioner}, {body: dataReceiverPractitioner, json: true}, function(error, response, body){
																returnReceiverPractitioner = body;
																if(returnReceiverPractitioner.err_code > 0){
																	res.json(returnReceiverPractitioner);	
																	console.log("add reference receiver practitioner : " + receiverPractitioner);
																}
															});
														}														

														if(substitutionResponsibleParty !== ""){
															dataSubstitutionResponsibleParty = {
																"_id" : substitutionResponsibleParty,
																"medication_dispense_substitution_id" : medicationDispenseId
															}
															ApiFHIR.put('practitioner', {"apikey": apikey, "_id": substitutionResponsibleParty}, {body: dataSubstitutionResponsibleParty, json: true}, function(error, response, body){
																returnSubstitutionResponsibleParty = body;
																if(returnSubstitutionResponsibleParty.err_code > 0){
																	res.json(returnSubstitutionResponsibleParty);	
																	console.log("add reference substitution responsible party : " + substitutionResponsibleParty);
																}
															});
														}				

														if(detectedIssue !== ""){
															dataDetectedIssue = {
																"_id" : detectedIssue,
																"medication_dispense_id" : medicationDispenseId
															}
															ApiFHIR.put('detectedIssue', {"apikey": apikey, "_id": detectedIssue}, {body: dataDetectedIssue, json: true}, function(error, response, body){
																returnDetectedIssue = body;
																if(returnDetectedIssue.err_code > 0){
																	res.json(returnDetectedIssue);	
																	console.log("add reference detected issue : " + detectedIssue);
																}
															});
														}

														if(eventHistory !== ""){
															dataEventHistory = {
																"_id" : eventHistory,
																"medication_dispense_id" : medicationDispenseId
															}
															ApiFHIR.put('provenance', {"apikey": apikey, "_id": eventHistory}, {body: dataEventHistory, json: true}, function(error, response, body){
																returnEventHistory = body;
																if(returnEventHistory.err_code > 0){
																	res.json(returnEventHistory);	
																	console.log("add reference event history : " + eventHistory);
																}
															});
														}

														/*if(dosageInstruction !== ""){
															dataDosageInstruction = {
																"dosage_id" : dosageInstruction,
																"medication_dispense_id" : medicationDispenseId
															}
															ApiFHIR.put('dosage', {"apikey": apikey, "_id": dosageInstruction}, {body: dataDosageInstruction, json: true}, function(error, response, body){
																returnDosageInstruction = body;
																if(returnDosageInstruction.err_code > 0){
																	res.json(returnDosageInstruction);	
																	console.log("add reference dosage instruction : " + dosageInstruction);
																}
															});
														}				*/										

														/*----*/
														
														
														res.json({"err_code": 0, "err_msg": "Medication Dispense has been add.", "data": [{"_id": medicationDispenseId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
										status|medication_dispense_status
										category|medication_dispense_category
										medicationMedicationCodeableConcept|medication_codes
										type|ACT_PHARMACY_SUPPLY_TYPE
										substitutionType|ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE
										substitutionReason|SUBSTANCE_ADMIN_SUBSTITUTION_REASON
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'MEDICATION_DISPENSE_STATUS', function (resStatusCode) {
													if (resStatusCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkCategory', function () {
											if (!validator.isEmpty(category)) {
												checkCode(apikey, category, 'MEDICATION_DISPENSE_CATEGORY', function (resCategoryCode) {
													if (resCategoryCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkMedicationMedicationCodeableConcept', function () {
											if (!validator.isEmpty(medicationMedicationCodeableConcept)) {
												checkCode(apikey, medicationMedicationCodeableConcept, 'MEDICATION_CODES', function (resMedicationMedicationCodeableConceptCode) {
													if (resMedicationMedicationCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Medication medication codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkType', function () {
											if (!validator.isEmpty(type)) {
												checkCode(apikey, type, 'ACT_PHARMACY_SUPPLY_TYPE', function (resTypeCode) {
													if (resTypeCode.err_code > 0) {
														myEmitter.emit('checkMedicationMedicationCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMedicationMedicationCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkSubstitutionType', function () {
											if (!validator.isEmpty(substitutionType)) {
												checkCode(apikey, substitutionType, 'ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE', function (resSubstitutionTypeCode) {
													if (resSubstitutionTypeCode.err_code > 0) {
														myEmitter.emit('checkType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Substitution type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkType');
											}
										})

										myEmitter.prependOnceListener('checkSubstitutionReason', function () {
											if (!validator.isEmpty(substitutionReason)) {
												checkCode(apikey, substitutionReason, 'SUBSTANCE_ADMIN_SUBSTITUTION_REASON', function (resSubstitutionReasonCode) {
													if (resSubstitutionReasonCode.err_code > 0) {
														myEmitter.emit('checkSubstitutionType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Substitution reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubstitutionType');
											}
										})


										//cek value
										/*
										partOf|Procedure
										medicationMedicationReference|Medication
										subjectPatient|Patient
										subjectGroup|Group
										contextEncounter|Encounter
										contextEpisodeOfCare|Episode_Of_Care
										performerActorPractitioner|Practitioner
										performerActorOrganization|Organization
										performerActorPatient|Patient
										performerActorDevice|Device
										performerActorRelatedPerson|Related_Person
										performerOnBehalfOf|Organization
										authorizingPrescription|Medication_Request
										destination|Location
										receiverPatient|Patient
										receiverPractitioner|Practitioner
										dosageInstruction|dosage
										substitutionResponsibleParty|Practitioner
										detectedIssue|DetectedIssue
										notDoneReasonNotDoneReasonReference|DetectedIssue
										eventHistory|Provenance

										*/

										myEmitter.prependOnceListener('checkPartOf', function () {
											if (!validator.isEmpty(partOf)) {
												checkUniqeValue(apikey, "PROCEDURE_ID|" + partOf, 'PROCEDURE', function (resPartOf) {
													if (resPartOf.err_code > 0) {
														myEmitter.emit('checkSubstitutionReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubstitutionReason');
											}
										})

										myEmitter.prependOnceListener('checkMedicationMedicationReference', function () {
											if (!validator.isEmpty(medicationMedicationReference)) {
												checkUniqeValue(apikey, "MEDICATION_ID|" + medicationMedicationReference, 'MEDICATION', function (resMedicationMedicationReference) {
													if (resMedicationMedicationReference.err_code > 0) {
														myEmitter.emit('checkPartOf');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Medication medication reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOf');
											}
										})

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkMedicationMedicationReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMedicationMedicationReference');
											}
										})

										myEmitter.prependOnceListener('checkSubjectGroup', function () {
											if (!validator.isEmpty(subjectGroup)) {
												checkUniqeValue(apikey, "GROUP_ID|" + subjectGroup, 'GROUP', function (resSubjectGroup) {
													if (resSubjectGroup.err_code > 0) {
														myEmitter.emit('checkSubjectPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject group id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectPatient');
											}
										})

										myEmitter.prependOnceListener('checkContextEncounter', function () {
											if (!validator.isEmpty(contextEncounter)) {
												checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounter, 'ENCOUNTER', function (resContextEncounter) {
													if (resContextEncounter.err_code > 0) {
														myEmitter.emit('checkSubjectGroup');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context encounter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectGroup');
											}
										})

										myEmitter.prependOnceListener('checkContextEpisodeOfCare', function () {
											if (!validator.isEmpty(contextEpisodeOfCare)) {
												checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + contextEpisodeOfCare, 'EPISODE_OF_CARE', function (resContextEpisodeOfCare) {
													if (resContextEpisodeOfCare.err_code > 0) {
														myEmitter.emit('checkContextEncounter');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context episode of care id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEncounter');
											}
										})

										myEmitter.prependOnceListener('checkPerformerActorPractitioner', function () {
											if (!validator.isEmpty(performerActorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerActorPractitioner, 'PRACTITIONER', function (resPerformerActorPractitioner) {
													if (resPerformerActorPractitioner.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkPerformerActorOrganization', function () {
											if (!validator.isEmpty(performerActorOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerActorOrganization, 'ORGANIZATION', function (resPerformerActorOrganization) {
													if (resPerformerActorOrganization.err_code > 0) {
														myEmitter.emit('checkPerformerActorPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkPerformerActorPatient', function () {
											if (!validator.isEmpty(performerActorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + performerActorPatient, 'PATIENT', function (resPerformerActorPatient) {
													if (resPerformerActorPatient.err_code > 0) {
														myEmitter.emit('checkPerformerActorOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorOrganization');
											}
										})

										myEmitter.prependOnceListener('checkPerformerActorDevice', function () {
											if (!validator.isEmpty(performerActorDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + performerActorDevice, 'DEVICE', function (resPerformerActorDevice) {
													if (resPerformerActorDevice.err_code > 0) {
														myEmitter.emit('checkPerformerActorPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorPatient');
											}
										})

										myEmitter.prependOnceListener('checkPerformerActorRelatedPerson', function () {
											if (!validator.isEmpty(performerActorRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + performerActorRelatedPerson, 'RELATED_PERSON', function (resPerformerActorRelatedPerson) {
													if (resPerformerActorRelatedPerson.err_code > 0) {
														myEmitter.emit('checkPerformerActorDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorDevice');
											}
										})

										myEmitter.prependOnceListener('checkPerformerOnBehalfOf', function () {
											if (!validator.isEmpty(performerOnBehalfOf)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerOnBehalfOf, 'ORGANIZATION', function (resPerformerOnBehalfOf) {
													if (resPerformerOnBehalfOf.err_code > 0) {
														myEmitter.emit('checkPerformerActorRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer on behalf of id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkAuthorizingPrescription', function () {
											if (!validator.isEmpty(authorizingPrescription)) {
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + authorizingPrescription, 'MEDICATION_REQUEST', function (resAuthorizingPrescription) {
													if (resAuthorizingPrescription.err_code > 0) {
														myEmitter.emit('checkPerformerOnBehalfOf');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Authorizing prescription id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerOnBehalfOf');
											}
										})

										myEmitter.prependOnceListener('checkDestination', function () {
											if (!validator.isEmpty(destination)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + destination, 'LOCATION', function (resDestination) {
													if (resDestination.err_code > 0) {
														myEmitter.emit('checkAuthorizingPrescription');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Destination id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorizingPrescription');
											}
										})

										myEmitter.prependOnceListener('checkReceiverPatient', function () {
											if (!validator.isEmpty(receiverPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + receiverPatient, 'PATIENT', function (resReceiverPatient) {
													if (resReceiverPatient.err_code > 0) {
														myEmitter.emit('checkDestination');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Receiver patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDestination');
											}
										})

										myEmitter.prependOnceListener('checkReceiverPractitioner', function () {
											if (!validator.isEmpty(receiverPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + receiverPractitioner, 'PRACTITIONER', function (resReceiverPractitioner) {
													if (resReceiverPractitioner.err_code > 0) {
														myEmitter.emit('checkReceiverPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Receiver practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReceiverPatient');
											}
										})
										
										myEmitter.prependOnceListener('checkDosageInstruction', function () {
											if (!validator.isEmpty(dosageInstruction)) {
												checkUniqeValue(apikey, "DOSAGE_ID|" + dosageInstruction, 'DOSAGE', function (resDosageInstruction) {
													if (resDosageInstruction.err_code > 0) {
														myEmitter.emit('checkReceiverPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dosage instruction id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReceiverPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkSubstitutionResponsibleParty', function () {
											if (!validator.isEmpty(substitutionResponsibleParty)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + substitutionResponsibleParty, 'PRACTITIONER', function (resSubstitutionResponsibleParty) {
													if (resSubstitutionResponsibleParty.err_code > 0) {
														myEmitter.emit('checkDosageInstruction');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Substitution responsible party id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDosageInstruction');
											}
										})

										myEmitter.prependOnceListener('checkDetectedIssue', function () {
											if (!validator.isEmpty(detectedIssue)) {
												checkUniqeValue(apikey, "DETECTEDISSUE_ID|" + detectedIssue, 'DETECTEDISSUE', function (resDetectedIssue) {
													if (resDetectedIssue.err_code > 0) {
														myEmitter.emit('checkSubstitutionResponsibleParty');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Detected issue id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubstitutionResponsibleParty');
											}
										})

										myEmitter.prependOnceListener('checkNotDoneReasonNotDoneReasonReference', function () {
											if (!validator.isEmpty(notDoneReasonNotDoneReasonReference)) {
												checkUniqeValue(apikey, "DETECTEDISSUE_ID|" + notDoneReasonNotDoneReasonReference, 'DETECTEDISSUE', function (resNotDoneReasonNotDoneReasonReference) {
													if (resNotDoneReasonNotDoneReasonReference.err_code > 0) {
														myEmitter.emit('checkDetectedIssue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Not done reason not done reason reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDetectedIssue');
											}
										})

										if (!validator.isEmpty(eventHistory)) {
											checkUniqeValue(apikey, "PROVENANCE_ID|" + eventHistory, 'PROVENANCE', function (resEventHistory) {
												if (resEventHistory.err_code > 0) {
													myEmitter.emit('checkNotDoneReasonNotDoneReasonReference');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Event history id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkNotDoneReasonNotDoneReasonReference');
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
		},
		identifier: function addIdentifier(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationDispenseId = req.params.medication_dispense_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Medication Dispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense id is required";
			}

			//identifier
			if(typeof req.body.use !== 'undefined'){
				identifierUseCode =  req.body.use.trim().toLowerCase();
				if(validator.isEmpty(identifierUseCode)){
					err_code = 2;
					err_msg = "Identifier Use is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'use' in json request.";
			} 

			//type code
			if(typeof req.body.type !== 'undefined'){
				identifierTypeCode =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(identifierTypeCode)){
					err_code = 2;
					err_msg = "Identifier Type is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'type' in json request.";
			} 

			//identifier uniqe value
			if(typeof req.body.value !== 'undefined'){
				identifierValue =  req.body.value.trim();
				if(validator.isEmpty(identifierValue)){
					err_code = 2;
					err_msg = "Identifier Value is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'value' in json request.";
			}

			//identifier period start
			if(typeof req.body.period !== 'undefined'){
				period = req.body.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					identifierPeriodStart = arrPeriod[0];
					identifierPeriodEnd = arrPeriod[1];

					if(!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)){
						err_code = 2;
						err_msg = "Identifier Period invalid date format.";
					}	
				}else{
					err_code = 1;
					err_msg = "Identifier Period format is wrong, `ex: start to end` ";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'period' in json identifier request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
							if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
											if(resUniqeValue.err_code == 0){
												checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
													if(resMedicationDispenseID.err_code > 0){
														var identifierId = 'ide' + uniqid.time();
														//set by sistem
														var identifierSystem = identifierId;

														dataIdentifier = {
																							"id": identifierId,
																							"use": identifierUseCode,
																							"type": identifierTypeCode,
																							"system": identifierSystem,
																							"value": identifierValue,
																							"period_start": identifierPeriodStart,
																							"period_end": identifierPeriodEnd,
																							"medication_dispense_id": medicationDispenseId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Medication Dispense.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Medication Dispense Id not found"});		
													}
												})
											}else{
												res.json({"err_code": 504, "err_msg": "Identifier value already exist."});	
											}
										})

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
		},
		medicationDispensePerformer: function addMedicationDispensePerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationDispenseId = req.params.medication_dispense_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Medication Dispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense id is required";
			}
			
			if(typeof req.body.actor.practitioner !== 'undefined'){
				var performerActorPractitioner =  req.body.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					performerActorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor practitioner' in json Medication Dispense request.";
			}

			if(typeof req.body.actor.organization !== 'undefined'){
				var performerActorOrganization =  req.body.actor.organization.trim().toLowerCase();
				if(validator.isEmpty(performerActorOrganization)){
					performerActorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor organization' in json Medication Dispense request.";
			}

			if(typeof req.body.actor.patient !== 'undefined'){
				var performerActorPatient =  req.body.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					performerActorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor patient' in json Medication Dispense request.";
			}

			if(typeof req.body.actor.device !== 'undefined'){
				var performerActorDevice =  req.body.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					performerActorDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor device' in json Medication Dispense request.";
			}

			if(typeof req.body.actor.relatedPerson !== 'undefined'){
				var performerActorRelatedPerson =  req.body.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					performerActorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor related person' in json Medication Dispense request.";
			}

			if(typeof req.body.onBehalfOf !== 'undefined'){
				var performerOnBehalfOf =  req.body.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					performerOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer on behalf of' in json Medication Dispense request.";
			}			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationDispenseID', function(){
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									var unicId = uniqid.time();
									var medicationDispensePerformeId = 'map' + unicId;
									//MedicationDispensePerformer
									dataMedicationDispensePerformer = {
										"performer_id" : medicationDispensePerformerId,
										"actor_practitioner" : performerActorPractitioner,
										"actor_organization" : performerActorOrganization	,														
										"actor_patient" : performerActorPatient,
										"actor_related_person" : performerActorRelatedPerson,
										"actor_device" : performerActorDevice,
										"on_behalf_of" : performerOnBehalfOf,
										"medication_dispense_id" : medicationDispenseId
									};
							
									ApiFHIR.post('medicationDispensePerformer', {"apikey": apikey}, {body: dataMedicationDispensePerformer, json: true}, function(error, response, body){
										medicationDispensePerformer = body;
										
										if(medicationDispensePerformer.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Performer has been add in this Medication Dispense.", "data": medicationDispensePerformer.data});
										}else{
											res.json(medicationDispensePerformer);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Substitution Performer Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkPerformerActorPractitioner', function () {
							if (!validator.isEmpty(performerActorPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerActorPractitioner, 'PRACTITIONER', function (resPerformerActorPractitioner) {
									if (resPerformerActorPractitioner.err_code > 0) {
										myEmitter.emit('checkMedicationDispenseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationDispenseID');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorOrganization', function () {
							if (!validator.isEmpty(performerActorOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerActorOrganization, 'ORGANIZATION', function (resPerformerActorOrganization) {
									if (resPerformerActorOrganization.err_code > 0) {
										myEmitter.emit('checkPerformerActorPractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorPatient', function () {
							if (!validator.isEmpty(performerActorPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + performerActorPatient, 'PATIENT', function (resPerformerActorPatient) {
									if (resPerformerActorPatient.err_code > 0) {
										myEmitter.emit('checkPerformerActorOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorOrganization');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorDevice', function () {
							if (!validator.isEmpty(performerActorDevice)) {
								checkUniqeValue(apikey, "DEVICE_ID|" + performerActorDevice, 'DEVICE', function (resPerformerActorDevice) {
									if (resPerformerActorDevice.err_code > 0) {
										myEmitter.emit('checkPerformerActorPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor device id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorPatient');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorRelatedPerson', function () {
							if (!validator.isEmpty(performerActorRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + performerActorRelatedPerson, 'RELATED_PERSON', function (resPerformerActorRelatedPerson) {
									if (resPerformerActorRelatedPerson.err_code > 0) {
										myEmitter.emit('checkPerformerActorDevice');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorDevice');
							}
						})

						if (!validator.isEmpty(performerOnBehalfOf)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerOnBehalfOf, 'ORGANIZATION', function (resPerformerOnBehalfOf) {
								if (resPerformerOnBehalfOf.err_code > 0) {
									myEmitter.emit('checkPerformerActorRelatedPerson');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer on behalf of id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerActorRelatedPerson');
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
		medicationDispenseSubstitution: function addMedicationDispenseSubstitution(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationDispenseId = req.params.medication_dispense_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Medication Dispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense id is required";
			}
			
			if (typeof req.body.wasSubstituted !== 'undefined') {
				var substitutionWasSubstituted = req.body.wasSubstituted.trim().toLowerCase();
				if(substitutionWasSubstituted === "true" || substitutionWasSubstituted === "false"){
					substitutionWasSubstituted = substitutionWasSubstituted;
				} else {
					err_code = 2;
					err_msg = "Imaging Manifest substitution was substituted is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'substitution was substituted' in json Medication Dispense request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var substitutionType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(substitutionType)){
					substitutionType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'substitution type' in json Medication Dispense request.";
			}

			if(typeof req.body.reason !== 'undefined'){
				var substitutionReason =  req.body.reason.trim().toUpperCase();
				if(validator.isEmpty(substitutionReason)){
					substitutionReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'substitution reason' in json Medication Dispense request.";
			}

			/*if(typeof req.body.responsibleParty !== 'undefined'){
				var substitutionResponsibleParty =  req.body.responsibleParty.trim().toLowerCase();
				if(validator.isEmpty(substitutionResponsibleParty)){
					substitutionResponsibleParty = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'substitution responsible party' in json Medication Dispense request.";
			}*/

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationDispenseID', function(){
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									var unicId = uniqid.time();
									var medicationDispensePerformeId = 'map' + unicId;
									//MedicationDispenseSubstitution
									dataMedicationDispenseSubstitution = {
										"substitution_id" : medicationDispenseSubstitutionId,
										"was_substituted" : substitutionWasSubstituted,
										"type" : substitutionType,
										"reason" : substitutionReason,
										"medication_dispense_id" : medicationDispenseId
									};
									
							
									ApiFHIR.post('medicationDispenseSubstitution', {"apikey": apikey}, {body: dataMedicationDispenseSubstitution, json: true}, function(error, response, body){
										medicationDispenseSubstitution = body;
										
										if(medicationDispenseSubstitution.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Substitution has been add in this Medication Dispense.", "data": medicationDispenseSubstitution.data});
										}else{
											res.json(medicationDispenseSubstitution);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Dispense Substitution Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkSubstitutionType', function () {
							if (!validator.isEmpty(substitutionType)) {
								checkCode(apikey, substitutionType, 'ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE', function (resSubstitutionTypeCode) {
									if (resSubstitutionTypeCode.err_code > 0) {
										myEmitter.emit('checkMedicationDispenseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Substitution type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationDispenseID');
							}
						})
						
						if (!validator.isEmpty(substitutionReason)) {
							checkCode(apikey, substitutionReason, 'SUBSTANCE_ADMIN_SUBSTITUTION_REASON', function (resSubstitutionReasonCode) {
								if (resSubstitutionReasonCode.err_code > 0) {
									myEmitter.emit('checkSubstitutionType');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Substitution reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubstitutionType');
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
		dosage : function addDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationDispenseId = req.params.medication_dispense_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Medication Dispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined'){
				var sequence =  req.body.sequence.trim();
				if(validator.isEmpty(sequence)){
					sequence = "";
				}else{
					if(!validator.isInt(sequence)){
						err_code = 2;
						err_msg = "Dosage sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'sequence' in json Dosage dispense.";
			}

			if(typeof req.body.text !== 'undefined'){
				var text =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(text)){
					text = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'text' in json Dosage dispense.";
			}

			if(typeof req.body.additionalInstruction !== 'undefined'){
				var additionalInstruction =  req.body.additionalInstruction.trim().toLowerCase();
				if(validator.isEmpty(additionalInstruction)){
					additionalInstruction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'additional instruction' in json Dosage dispense.";
			}

			if(typeof req.body.patientInstruction !== 'undefined'){
				var patientInstruction =  req.body.patientInstruction.trim().toLowerCase();
				if(validator.isEmpty(patientInstruction)){
					patientInstruction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient instruction' in json Dosage dispense.";
			}

			/*if(typeof req.body.timing !== 'undefined'){
				var timing =  req.body.timing.trim().toLowerCase();
				if(validator.isEmpty(timing)){
					timing = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'timing' in json Dosage dispense.";
			}*/
			
			if(typeof req.body.timing.event !== 'undefined'){
				var event =  req.body.timing.event;
				if(validator.isEmpty(event)){
					event = "";
				}else{
					if(!regex.test(event)){
						err_code = 2;
						err_msg = "Timing event invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'event' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.bounds.boundsDuration !== 'undefined'){
				var repeatBoundsBoundsDuration =  req.body.timing.repeat.bounds.boundsDuration.trim();
				if(validator.isEmpty(repeatBoundsBoundsDuration)){
					repeatBoundsBoundsDuration = "";
				}else{
					if(!validator.isInt(repeatBoundsBoundsDuration)){
						err_code = 2;
						err_msg = "Timing repeat bounds bounds duration is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat bounds bounds duration' in json Timing dispense.";
			}

			if (typeof req.body.timing.repeat.bounds.boundsRange !== 'undefined') {
			  var repeatBoundsBoundsRange = req.body.timing.repeat.bounds.boundsRange;
 				if(validator.isEmpty(repeatBoundsBoundsRange)){
				  var repeatBoundsBoundsRangeLow = "";
				  var repeatBoundsBoundsRangeHigh = "";
				} else {
				  if (repeatBoundsBoundsRange.indexOf("to") > 0) {
				    arrRepeatBoundsBoundsRange = repeatBoundsBoundsRange.split("to");
				    var repeatBoundsBoundsRangeLow = arrRepeatBoundsBoundsRange[0];
				    var repeatBoundsBoundsRangeHigh = arrRepeatBoundsBoundsRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Timing repeat bounds bounds range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'repeat bounds bounds range' in json Timing dispense.";
			}

			if (typeof req.body.timing.repeat.bounds.boundsPeriod !== 'undefined') {
			  var repeatBoundsBoundsPeriod = req.body.timing.repeat.bounds.boundsPeriod;
 				if(validator.isEmpty(repeatBoundsBoundsPeriod)) {
				  var repeatBoundsBoundsPeriodStart = "";
				  var repeatBoundsBoundsPeriodEnd = "";
				} else {
				  if (repeatBoundsBoundsPeriod.indexOf("to") > 0) {
				    arrRepeatBoundsBoundsPeriod = repeatBoundsBoundsPeriod.split("to");
				    var repeatBoundsBoundsPeriodStart = arrRepeatBoundsBoundsPeriod[0];
				    var repeatBoundsBoundsPeriodEnd = arrRepeatBoundsBoundsPeriod[1];
				    if (!regex.test(repeatBoundsBoundsPeriodStart) && !regex.test(repeatBoundsBoundsPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Timing repeat bounds bounds period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Timing repeat bounds bounds period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'repeat bounds bounds period' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.count !== 'undefined'){
				var repeatCount =  req.body.timing.repeat.count.trim();
				if(validator.isEmpty(repeatCount)){
					repeatCount = "";
				}else{
					if(!validator.isInt(repeatCount)){
						err_code = 2;
						err_msg = "Timing repeat count is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat count' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.countMax !== 'undefined'){
				var repeatCountMax =  req.body.timing.repeat.countMax.trim();
				if(validator.isEmpty(repeatCountMax)){
					repeatCountMax = "";
				}else{
					if(!validator.isInt(repeatCountMax)){
						err_code = 2;
						err_msg = "Timing repeat count max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat count max' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.duration !== 'undefined'){
				var repeatDuration =  req.body.timing.repeat.duration.trim();
				if(validator.isEmpty(repeatDuration)){
					repeatDuration = "";
				}else{
					if(!validator.isInt(repeatDuration)){
						err_code = 2;
						err_msg = "Timing repeat duration is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat duration' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.durationMax !== 'undefined'){
				var repeatDurationMax =  req.body.timing.repeat.durationMax.trim();
				if(validator.isEmpty(repeatDurationMax)){
					repeatDurationMax = "";
				}else{
					if(!validator.isInt(repeatDurationMax)){
						err_code = 2;
						err_msg = "Timing repeat duration max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat duration max' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.durationUnit !== 'undefined'){
				var repeatDurationUnit =  req.body.timing.repeat.durationUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatDurationUnit)){
					repeatDurationUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat duration unit' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.frequency !== 'undefined'){
				var repeatFrequency =  req.body.timing.repeat.frequency.trim();
				if(validator.isEmpty(repeatFrequency)){
					repeatFrequency = "";
				}else{
					if(!validator.isInt(repeatFrequency)){
						err_code = 2;
						err_msg = "Timing repeat frequency is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat frequency' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.frequencyMax !== 'undefined'){
				var repeatFrequencyMax =  req.body.timing.repeat.frequencyMax.trim();
				if(validator.isEmpty(repeatFrequencyMax)){
					repeatFrequencyMax = "";
				}else{
					if(!validator.isInt(repeatFrequencyMax)){
						err_code = 2;
						err_msg = "Timing repeat frequency max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat frequency max' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.period !== 'undefined'){
				var repeatPeriod =  req.body.timing.repeat.period.trim();
				if(validator.isEmpty(repeatPeriod)){
					repeatPeriod = "";
				}else{
					if(!validator.isInt(repeatPeriod)){
						err_code = 2;
						err_msg = "Timing repeat period is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat period' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.periodMax !== 'undefined'){
				var repeatPeriodMax =  req.body.timing.repeat.periodMax.trim();
				if(validator.isEmpty(repeatPeriodMax)){
					repeatPeriodMax = "";
				}else{
					if(!validator.isInt(repeatPeriodMax)){
						err_code = 2;
						err_msg = "Timing repeat period max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat period max' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.periodUnit !== 'undefined'){
				var repeatPeriodUnit =  req.body.timing.repeat.periodUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatPeriodUnit)){
					repeatPeriodUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat period unit' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.dayOfWeek !== 'undefined'){
				var repeatDayOfWeek =  req.body.timing.repeat.dayOfWeek.trim().toLowerCase();
				if(validator.isEmpty(repeatDayOfWeek)){
					repeatDayOfWeek = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat day of week' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.timeOfDay !== 'undefined'){
				var repeatTimeOfDay =  req.body.timing.repeat.timeOfDay.trim();
				if(validator.isEmpty(repeatTimeOfDay)){
					repeatTimeOfDay = "";
				}else{
					if(!validator.isInt(repeatTimeOfDay)){
						err_code = 2;
						err_msg = "Timing repeat time of day is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat time of day' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.when !== 'undefined'){
				var repeatWhen =  req.body.timing.repeat.when.trim().toUpperCase();
				if(validator.isEmpty(repeatWhen)){
					repeatWhen = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat when' in json Timing dispense.";
			}

			if(typeof req.body.timing.repeat.offset !== 'undefined'){
				var repeatOffset =  req.body.timing.repeat.offset.trim();
				if(validator.isEmpty(repeatOffset)){
					repeatOffset = "";
				}else{
					if(!validator.isInt(repeatOffset)){
						err_code = 2;
						err_msg = "Timing repeat offset is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat offset' in json Timing dispense.";
			}

			if(typeof req.body.timing.code !== 'undefined'){
				var code =  req.body.timing.code.trim().toUpperCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Timing dispense.";
			}

			if (typeof req.body.asNeeded.asNeededBoolean !== 'undefined') {
				var asNeededAsNeededBoolean = req.body.asNeeded.asNeededBoolean.trim().toLowerCase();
					if(validator.isEmpty(asNeededAsNeededBoolean)){
						asNeededAsNeededBoolean = "false";
					}
				if(asNeededAsNeededBoolean === "true" || asNeededAsNeededBoolean === "false"){
					asNeededAsNeededBoolean = asNeededAsNeededBoolean;
				} else {
					err_code = 2;
					err_msg = "Dosage as needed as needed boolean is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'as needed as needed boolean' in json Dosage dispense.";
			}

			if(typeof req.body.asNeeded.asNeededCodeableConcept !== 'undefined'){
				var asNeededAsNeededCodeableConcept =  req.body.asNeeded.asNeededCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(asNeededAsNeededCodeableConcept)){
					asNeededAsNeededCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'as needed as needed codeable concept' in json Dosage dispense.";
			}

			if(typeof req.body.site !== 'undefined'){
				var site =  req.body.site.trim().toLowerCase();
				if(validator.isEmpty(site)){
					site = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Dosage dispense.";
			}

			if(typeof req.body.route !== 'undefined'){
				var route =  req.body.route.trim().toLowerCase();
				if(validator.isEmpty(route)){
					route = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Dosage dispense.";
			}

			if(typeof req.body.method !== 'undefined'){
				var method =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(method)){
					method = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'method' in json Dosage dispense.";
			}

			if (typeof req.body.dose.doseRange !== 'undefined') {
			  var doseDoseRange = req.body.dose.doseRange;
 				if(validator.isEmpty(doseDoseRange)){
				  var doseDoseRangeLow = "";
				  var doseDoseRangeHigh = "";
				} else {
				  if (doseDoseRange.indexOf("to") > 0) {
				    arrDoseDoseRange = doseDoseRange.split("to");
				    var doseDoseRangeLow = arrDoseDoseRange[0];
				    var doseDoseRangeHigh = arrDoseDoseRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Dosage dose dose range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'dose dose range' in json Dosage dispense.";
			}

			if(typeof req.body.dose.doseQuantity !== 'undefined'){
				var doseDoseQuantity =  req.body.dose.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(doseDoseQuantity)){
					doseDoseQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose dose quantity' in json Dosage dispense.";
			}

			if (typeof req.body.maxDosePerPeriod !== 'undefined') {
			  var maxDosePerPeriod = req.body.maxDosePerPeriod;
 				if(validator.isEmpty(maxDosePerPeriod)){
				  var maxDosePerPeriodNumerator = "";
				  var maxDosePerPeriodDenominator = "";
				} else {
				  if (maxDosePerPeriod.indexOf("to") > 0) {
				    arrMaxDosePerPeriod = maxDosePerPeriod.split("to");
				    var maxDosePerPeriodNumerator = arrMaxDosePerPeriod[0];
				    var maxDosePerPeriodDenominator = arrMaxDosePerPeriod[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Dosage max dose per period invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'max dose per period' in json Dosage dispense.";
			}

			if(typeof req.body.maxDosePerAdministration !== 'undefined'){
				var maxDosePerAdministration =  req.body.maxDosePerAdministration.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerAdministration)){
					maxDosePerAdministration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'max dose per administration' in json Dosage dispense.";
			}

			if(typeof req.body.maxDosePerLifetime !== 'undefined'){
				var maxDosePerLifetime =  req.body.maxDosePerLifetime.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerLifetime)){
					maxDosePerLifetime = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'max dose per lifetime' in json Dosage dispense.";
			}

			if (typeof req.body.rate.rateRatio !== 'undefined') {
			  var rateRateRatio = req.body.rate.rateRatio;
 				if(validator.isEmpty(rateRateRatio)){
				  var rateRateRatioNumerator = "";
				  var rateRateRatioDenominator = "";
				} else {
				  if (rateRateRatio.indexOf("to") > 0) {
				    arrRateRateRatio = rateRateRatio.split("to");
				    var rateRateRatioNumerator = arrRateRateRatio[0];
				    var rateRateRatioDenominator = arrRateRateRatio[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Dosage rate rate ratio invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'rate rate ratio' in json Dosage dispense.";
			}

			if (typeof req.body.rate.rateRange !== 'undefined') {
			  var rateRateRange = req.body.rate.rateRange;
 				if(validator.isEmpty(rateRateRange)){
				  var rateRateRangeLow = "";
				  var rateRateRangeHigh = "";
				} else {
				  if (rateRateRange.indexOf("to") > 0) {
				    arrRateRateRange = rateRateRange.split("to");
				    var rateRateRangeLow = arrRateRateRange[0];
				    var rateRateRangeHigh = arrRateRateRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Dosage rate rate range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'rate rate range' in json Dosage dispense.";
			}

			if(typeof req.body.rate.rateQuantity !== 'undefined'){
				var rateRateQuantity =  req.body.rate.rateQuantity.trim();
				if(validator.isEmpty(rateRateQuantity)){
					rateRateQuantity = "";
				}else{
					if(!validator.isInt(rateRateQuantity)){
						err_code = 2;
						err_msg = "Dosage rate rate quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rate rate quantity' in json Dosage dispense.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						myEmitter.prependOnceListener('checkMedicationDispenseId', function() {
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									//set uniqe id
									var unicId = uniqid.time();
									var dosageId = 'dos' + unicId;
									var timingId = 'tim' + unicId;

									dataDosage = {
										"dosage_id" : dosageId,
										"sequence" : sequence,
										"text" : text,
										"additional_instruction" : additionalInstruction,
										"patient_instruction" : patientInstruction,
										"timing_id" : timingId,
										"as_needed_boolean" : asNeededAsNeededBoolean,
										"as_needed_codeable_concept" : asNeededAsNeededCodeableConcept,
										"site" : site,
										"route" : route,
										"method" : method,
										"dose_range_low" : doseDoseRangeLow,
										"dose_range_high" : doseDoseRangeHigh,
										"dose_quantity" : doseDoseQuantity,
										"max_dose_per_period_numerator" : maxDosePerPeriodNumerator,
										"max_dose_per_period_denominator" : maxDosePerPeriodDenominator,
										"max_dose_per_administration" : maxDosePerAdministration,
										"max_dose_per_lifetime" : maxDosePerLifetime,
										"rate_ratio_numerator" : rateRateRatioNumerator,
										"rate_ratio_denominator" : rateRateRatioDenominator,
										"rate_range_low" : rateRateRangeLow,
										"rate_range_high" : rateRateRangeHigh,
										"rate_quantity" : rateRateQuantity,
										"medication_dispense_id" : medicationDispenseId
									}
									console.log(dataDosage);
									ApiFHIR.post('dosage', {"apikey": apikey}, {body: dataDosage, json: true}, function(error, response, body){
										dosage = body;
										console.log(dosage);
										if(dosage.err_code > 0){
											res.json(dosage);	
											console.log("ok");
										}
									});

									dataTiming = {
										"timing_id" : timingId,
										"event" : event,
										"repeat_bounds_duration" : repeatBoundsBoundsDuration,
										"repeat_bounds_range_low" : repeatBoundsBoundsRangeLow,
										"repeat_bounds_range_high" : repeatBoundsBoundsRangeHigh,
										"repeat_bounds_period_start" : repeatBoundsBoundsPeriodStart,
										"repeat_bounds_period_end" : repeatBoundsBoundsPeriodEnd,
										"count" : repeatCount,
										"count_max" : repeatCountMax,
										"duration" : repeatDuration,
										"duration_max" : repeatDurationMax,
										"duration_unit" : repeatDurationUnit,
										"frequency" : repeatFrequency,
										"frequency_max" : repeatFrequencyMax,
										"period" : repeatPeriod,
										"period_max" : repeatPeriodMax,
										"period_unit" : repeatPeriodUnit,
										"day_of_week" : repeatDayOfWeek,
										"time_of_day" : repeatTimeOfDay,
										"when" : repeatWhen,
										"offset" : repeatOffset,
										"code" : code,
										"dosage_id": dosageId
									}
									console.log(dataTiming);
									ApiFHIR.post('timing', {"apikey": apikey}, {body: dataTiming, json: true}, function(error, response, body){
										timing = body;
										console.log(timing);
										if(timing.err_code > 0){
											res.json(timing);	
											console.log("ok");
										}
									});

									res.json({"err_code": 0, "err_msg": "Medication Dispense dosage has been add.", "data": [{"_id": dosageId}]});
								}else{
									res.json({"err_code": 503, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						});
						
						myEmitter.prependOnceListener('checkAdditionalInstruction', function () {
							if (!validator.isEmpty(additionalInstruction)) {
								checkCode(apikey, additionalInstruction, 'ADDITIONAL_INSTRUCTION_CODES', function (resAdditionalInstructionCode) {
									if (resAdditionalInstructionCode.err_code > 0) {
										myEmitter.emit('checkIdentifierValue');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Additional instruction code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkIdentifierValue');
							}
						})

						myEmitter.prependOnceListener('checkAsNeededAsNeededCodeableConcept', function () {
							if (!validator.isEmpty(asNeededAsNeededCodeableConcept)) {
								checkCode(apikey, asNeededAsNeededCodeableConcept, 'MEDICATION_AS_NEEDED_REASON', function (resAsNeededAsNeededCodeableConceptCode) {
									if (resAsNeededAsNeededCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkAdditionalInstruction');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "As needed as needed codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAdditionalInstruction');
							}
						})

						myEmitter.prependOnceListener('checkSite', function () {
							if (!validator.isEmpty(site)) {
								checkCode(apikey, site, 'APPROACH_SITE_CODES', function (resSiteCode) {
									if (resSiteCode.err_code > 0) {
										myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkRoute', function () {
							if (!validator.isEmpty(route)) {
								checkCode(apikey, route, 'ROUTE_CODES', function (resRouteCode) {
									if (resRouteCode.err_code > 0) {
										myEmitter.emit('checkSite');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Route code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSite');
							}
						})

						myEmitter.prependOnceListener('checkMethod', function () {
							if (!validator.isEmpty(method)) {
								checkCode(apikey, method, 'ADMINISTRATION_METHOD_CODES', function (resMethodCode) {
									if (resMethodCode.err_code > 0) {
										myEmitter.emit('checkRoute');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Method code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRoute');
							}
						})
						
						myEmitter.prependOnceListener('checkRepeatDurationUnit', function () {
							if (!validator.isEmpty(repeatDurationUnit)) {
								checkCode(apikey, repeatDurationUnit, 'UNITS_OF_TIME', function (resRepeatDurationUnitCode) {
									if (resRepeatDurationUnitCode.err_code > 0) {
										myEmitter.emit('checkMedicationDispenseId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat duration unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationDispenseId');
							}
						})

						myEmitter.prependOnceListener('checkRepeatPeriodUnit', function () {
							if (!validator.isEmpty(repeatPeriodUnit)) {
								checkCode(apikey, repeatPeriodUnit, 'UNITS_OF_TIME', function (resRepeatPeriodUnitCode) {
									if (resRepeatPeriodUnitCode.err_code > 0) {
										myEmitter.emit('checkRepeatDurationUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat period unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatDurationUnit');
							}
						})

						myEmitter.prependOnceListener('checkRepeatDayOfWeek', function () {
							if (!validator.isEmpty(repeatDayOfWeek)) {
								checkCode(apikey, repeatDayOfWeek, 'DAYS_OF_WEEK', function (resRepeatDayOfWeekCode) {
									if (resRepeatDayOfWeekCode.err_code > 0) {
										myEmitter.emit('checkRepeatPeriodUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat day of week code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatPeriodUnit');
							}
						})

						myEmitter.prependOnceListener('checkRepeatWhen', function () {
							if (!validator.isEmpty(repeatWhen)) {
								checkCode(apikey, repeatWhen, 'EVENT_TIMING', function (resRepeatWhenCode) {
									if (resRepeatWhenCode.err_code > 0) {
										myEmitter.emit('checkRepeatDayOfWeek');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat when code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatDayOfWeek');
							}
						})

						if (!validator.isEmpty(code)) {
							checkCode(apikey, code, 'TIMING_ABBREVIATION', function (resCodeCode) {
								if (resCodeCode.err_code > 0) {
									myEmitter.emit('checkRepeatWhen');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Code Timing code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRepeatWhen');
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
	},
	put: {
		medicationDispense : function putMedicationDispense(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationDispenseId = req.params.medication_dispense_id;

      var err_code = 0;
      var err_msg = "";
      var dataMedicationDispense = {};

			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Immunization Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation id is required";
			}
			
			/*
			var status = req.body.status;
			var category = req.body.category;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var supporting_information = req.body.supporting_information;
			var type = req.body.type;
			var quantity = req.body.quantity;
			var days_supply = req.body.days_supply;
			var when_prepared = req.body.when_prepared;
			var when_handed_over = req.body.when_handed_over;
			var destination = req.body.destination;
			var not_done = req.body.not_done;
			var not_done_reason_codeable_concept = req.body.not_done_reason_codeable_concept;
			var not_done_reason_reference = req.body.not_done_reason_reference;
			*/

			/*if(typeof req.body.partOf !== 'undefined' && req.body.partOf !== ""){
				var partOf =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(partOf)){
					dataMedicationDispense.part_of = "";
				}else{
					dataMedicationDispense.part_of = partOf;
				}
			}else{
			  partOf = "";
			}*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataMedicationDispense.status = "";
				}else{
					dataMedicationDispense.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataMedicationDispense.category = "";
				}else{
					dataMedicationDispense.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined' && req.body.medication.medicationCodeableConcept !== ""){
				var medicationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "medication dispense medication medication codeable concept is required.";
				}else{
					dataMedicationDispense.medication_codeable_concept = medicationMedicationCodeableConcept;
				}
			}else{
			  medicationMedicationCodeableConcept = "";
			}

			if(typeof req.body.medication.medicationReference !== 'undefined' && req.body.medication.medicationReference !== ""){
				var medicationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationReference)){
					dataMedicationDispense.medication_reference = "";
				}else{
					dataMedicationDispense.medication_reference = medicationMedicationReference;
				}
			}else{
			  medicationMedicationReference = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataMedicationDispense.subject_patient = "";
				}else{
					dataMedicationDispense.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataMedicationDispense.subject_group = "";
				}else{
					dataMedicationDispense.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataMedicationDispense.context_encounter = "";
				}else{
					dataMedicationDispense.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataMedicationDispense.context_episode_of_care = "";
				}else{
					dataMedicationDispense.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.supportingInformation !== 'undefined' && req.body.supportingInformation !== ""){
				var supportingInformation =  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(supportingInformation)){
					dataMedicationDispense.supporting_information = "";
				}else{
					dataMedicationDispense.supporting_information = supportingInformation;
				}
			}else{
			  supportingInformation = "";
			}

			/*if(typeof req.body.authorizingPrescription !== 'undefined' && req.body.authorizingPrescription !== ""){
				var authorizingPrescription =  req.body.authorizingPrescription.trim().toLowerCase();
				if(validator.isEmpty(authorizingPrescription)){
					dataMedicationDispense.authorizing_prescription = "";
				}else{
					dataMedicationDispense.authorizing_prescription = authorizingPrescription;
				}
			}else{
			  authorizingPrescription = "";
			}*/

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var type =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(type)){
					dataMedicationDispense.type = "";
				}else{
					dataMedicationDispense.type = type;
				}
			}else{
			  type = "";
			}

			if(typeof req.body.quantity !== 'undefined' && req.body.quantity !== ""){
				var quantity =  req.body.quantity.trim();
				if(validator.isEmpty(quantity)){
					dataMedicationDispense.quantity = "";
				}else{
					if(!validator.isInt(quantity)){
						err_code = 2;
						err_msg = "medication dispense quantity is must be number.";
					}else{
						dataMedicationDispense.quantity = quantity;
					}
				}
			}else{
			  quantity = "";
			}

			if(typeof req.body.daysSupply !== 'undefined' && req.body.daysSupply !== ""){
				var daysSupply =  req.body.daysSupply.trim();
				if(validator.isEmpty(daysSupply)){
					dataMedicationDispense.days_supply = "";
				}else{
					if(!validator.isInt(daysSupply)){
						err_code = 2;
						err_msg = "medication dispense days supply is must be number.";
					}else{
						dataMedicationDispense.days_supply = daysSupply;
					}
				}
			}else{
			  daysSupply = "";
			}

			if(typeof req.body.whenPrepared !== 'undefined' && req.body.whenPrepared !== ""){
				var whenPrepared =  req.body.whenPrepared;
				if(validator.isEmpty(whenPrepared)){
					err_code = 2;
					err_msg = "medication dispense when prepared is required.";
				}else{
					if(!regex.test(whenPrepared)){
						err_code = 2;
						err_msg = "medication dispense when prepared invalid date format.";	
					}else{
						dataMedicationDispense.when_prepared = whenPrepared;
					}
				}
			}else{
			  whenPrepared = "";
			}

			if(typeof req.body.whenHandedOver !== 'undefined' && req.body.whenHandedOver !== ""){
				var whenHandedOver =  req.body.whenHandedOver;
				if(validator.isEmpty(whenHandedOver)){
					err_code = 2;
					err_msg = "medication dispense when handed over is required.";
				}else{
					if(!regex.test(whenHandedOver)){
						err_code = 2;
						err_msg = "medication dispense when handed over invalid date format.";	
					}else{
						dataMedicationDispense.when_handed_over = whenHandedOver;
					}
				}
			}else{
			  whenHandedOver = "";
			}

			if(typeof req.body.destination !== 'undefined' && req.body.destination !== ""){
				var destination =  req.body.destination.trim().toLowerCase();
				if(validator.isEmpty(destination)){
					dataMedicationDispense.destination = "";
				}else{
					dataMedicationDispense.destination = destination;
				}
			}else{
			  destination = "";
			}

			/*if(typeof req.body.receiver.patient !== 'undefined' && req.body.receiver.patient !== ""){
				var receiverPatient =  req.body.receiver.patient.trim().toLowerCase();
				if(validator.isEmpty(receiverPatient)){
					dataMedicationDispense.patient = "";
				}else{
					dataMedicationDispense.patient = receiverPatient;
				}
			}else{
			  receiverPatient = "";
			}

			if(typeof req.body.receiver.practitioner !== 'undefined' && req.body.receiver.practitioner !== ""){
				var receiverPractitioner =  req.body.receiver.practitioner.trim().toLowerCase();
				if(validator.isEmpty(receiverPractitioner)){
					dataMedicationDispense.practitioner = "";
				}else{
					dataMedicationDispense.practitioner = receiverPractitioner;
				}
			}else{
			  receiverPractitioner = "";
			}

			if(typeof req.body.detectedIssue !== 'undefined' && req.body.detectedIssue !== ""){
				var detectedIssue =  req.body.detectedIssue.trim().toLowerCase();
				if(validator.isEmpty(detectedIssue)){
					dataMedicationDispense.detected_issue = "";
				}else{
					dataMedicationDispense.detected_issue = detectedIssue;
				}
			}else{
			  detectedIssue = "";
			}*/

			if (typeof req.body.notDone !== 'undefined' && req.body.notDone !== "") {
			  var notDone = req.body.notDone.trim().toLowerCase();
					if(validator.isEmpty(notDone)){
						notDone = "false";
					}
			  if(notDone === "true" || notDone === "false"){
					dataMedicationDispense.not_done = notDone;
			  } else {
			    err_code = 2;
			    err_msg = "Medication dispense not done is must be boolean.";
			  }
			} else {
			  notDone = "";
			}

			if(typeof req.body.notDoneReason.notDoneReasonCodeableConcept !== 'undefined' && req.body.notDoneReason.notDoneReasonCodeableConcept !== ""){
				var notDoneReasonNotDoneReasonCodeableConcept =  req.body.notDoneReason.notDoneReasonCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(notDoneReasonNotDoneReasonCodeableConcept)){
					dataMedicationDispense.not_done_reason_codeable_concept = "";
				}else{
					dataMedicationDispense.not_done_reason_codeable_concept = notDoneReasonNotDoneReasonCodeableConcept;
				}
			}else{
			  notDoneReasonNotDoneReasonCodeableConcept = "";
			}

			if(typeof req.body.notDoneReason.notDoneReasonReference !== 'undefined' && req.body.notDoneReason.notDoneReasonReference !== ""){
				var notDoneReasonNotDoneReasonReference =  req.body.notDoneReason.notDoneReasonReference.trim().toLowerCase();
				if(validator.isEmpty(notDoneReasonNotDoneReasonReference)){
					dataMedicationDispense.not_done_reason_reference = "";
				}else{
					dataMedicationDispense.not_done_reason_reference = notDoneReasonNotDoneReasonReference;
				}
			}else{
			  notDoneReasonNotDoneReasonReference = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						//event emiter
						myEmitter.prependOnceListener('checkMedicationDispenseId', function(){
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									//console.log(dataImmunization);
									ApiFHIR.put('medicationDispense', {"apikey": apikey, "_id": medicationDispenseId}, {body: dataMedicationDispense, json: true}, function(error, response, body){
										medicationDispense = body;
										if(medicationDispense.err_code > 0){
											res.json(medicationDispense);	
										}else{
											res.json({"err_code": 0, "err_msg": "Medication Dispense has been update.", "data": [{"_id": medicationDispenseId}]});
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'MEDICATION_DISPENSE_STATUS', function (resStatusCode) {
									if (resStatusCode.err_code > 0) {
										myEmitter.emit('checkIdentifierValue');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkIdentifierValue');
							}
						})

						myEmitter.prependOnceListener('checkCategory', function () {
							if (!validator.isEmpty(category)) {
								checkCode(apikey, category, 'MEDICATION_DISPENSE_CATEGORY', function (resCategoryCode) {
									if (resCategoryCode.err_code > 0) {
										myEmitter.emit('checkStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkStatus');
							}
						})

						myEmitter.prependOnceListener('checkMedicationMedicationCodeableConcept', function () {
							if (!validator.isEmpty(medicationMedicationCodeableConcept)) {
								checkCode(apikey, medicationMedicationCodeableConcept, 'MEDICATION_CODES', function (resMedicationMedicationCodeableConceptCode) {
									if (resMedicationMedicationCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Medication medication codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCategory');
							}
						})

						myEmitter.prependOnceListener('checkType', function () {
							if (!validator.isEmpty(type)) {
								checkCode(apikey, type, 'ACT_PHARMACY_SUPPLY_TYPE', function (resTypeCode) {
									if (resTypeCode.err_code > 0) {
										myEmitter.emit('checkMedicationMedicationCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationMedicationCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkMedicationMedicationReference', function () {
							if (!validator.isEmpty(medicationMedicationReference)) {
								checkUniqeValue(apikey, "MEDICATION_ID|" + medicationMedicationReference, 'MEDICATION', function (resMedicationMedicationReference) {
									if (resMedicationMedicationReference.err_code > 0) {
										myEmitter.emit('checkType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Medication medication reference id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkType');
							}
						})

						myEmitter.prependOnceListener('checkSubjectPatient', function () {
							if (!validator.isEmpty(subjectPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
									if (resSubjectPatient.err_code > 0) {
										myEmitter.emit('checkMedicationMedicationReference');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Subject patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationMedicationReference');
							}
						})

						myEmitter.prependOnceListener('checkSubjectGroup', function () {
							if (!validator.isEmpty(subjectGroup)) {
								checkUniqeValue(apikey, "GROUP_ID|" + subjectGroup, 'GROUP', function (resSubjectGroup) {
									if (resSubjectGroup.err_code > 0) {
										myEmitter.emit('checkSubjectPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Subject group id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjectPatient');
							}
						})

						myEmitter.prependOnceListener('checkContextEncounter', function () {
							if (!validator.isEmpty(contextEncounter)) {
								checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounter, 'ENCOUNTER', function (resContextEncounter) {
									if (resContextEncounter.err_code > 0) {
										myEmitter.emit('checkSubjectGroup');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Context encounter id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjectGroup');
							}
						})

						myEmitter.prependOnceListener('checkContextEpisodeOfCare', function () {
							if (!validator.isEmpty(contextEpisodeOfCare)) {
								checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + contextEpisodeOfCare, 'EPISODE_OF_CARE', function (resContextEpisodeOfCare) {
									if (resContextEpisodeOfCare.err_code > 0) {
										myEmitter.emit('checkContextEncounter');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Context episode of care id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkContextEncounter');
							}
						})
						
						if (!validator.isEmpty(destination)) {
							checkUniqeValue(apikey, "LOCATION_ID|" + destination, 'LOCATION', function (resDestination) {
								if (resDestination.err_code > 0) {
									myEmitter.emit('checkContextEpisodeOfCare');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Destination id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkContextEpisodeOfCare');
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
		identifier: function updateIdentifier(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationDispenseId = req.params.medication_dispense_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Medication Dispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense id is required";
			}

			if(typeof identifierId !== 'undefined'){
				if(validator.isEmpty(identifierId)){
					err_code = 2;
					err_msg = "Identifier id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Identifier id is required";
			}

			//identifier
			if(typeof req.body.use !== 'undefined'){
				identifierUseCode =  req.body.use.trim().toLowerCase();
				if(validator.isEmpty(identifierUseCode)){
					err_code = 2;
					err_msg = "Identifier Use is empty";
				}else{
					dataIdentifier.use = identifierUseCode;
				}
			}else{
				identifierUseCode = "";
			} 

			//type code
			if(typeof req.body.type !== 'undefined'){
				identifierTypeCode =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(identifierTypeCode)){
					err_code = 2;
					err_msg = "Identifier Type is empty";
				}else{
					dataIdentifier.type = identifierTypeCode;
				}
			}else{
				identifierTypeCode = "";
			} 

			//identifier uniqe value
			if(typeof req.body.value !== 'undefined'){
				identifierValue =  req.body.value.trim();
				if(validator.isEmpty(identifierValue)){
					err_code = 2;
					err_msg = "Identifier Value is empty";
				}else{
					dataIdentifier.value = identifierValue;
				}
			}else{
				identifierValue = "";
			}

			//identifier period start
			if(typeof req.body.period !== 'undefined'){
				period = req.body.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					identifierPeriodStart = arrPeriod[0];
					identifierPeriodEnd = arrPeriod[1];

					if(!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)){
						err_code = 2;
						err_msg = "Identifier Period invalid date format.";
					}else{
						dataIdentifier.period_start = identifierPeriodStart;
						dataIdentifier.period_end = identifierPeriodEnd;
					}	
				}else{
					err_code = 1;
					err_msg = "Period request format is wrong, `ex: start to end` ";
				}
			}else{
				identifierPeriodStart = "";
				identifierPeriodEnd = "";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkMedication DispenseID', function(){
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "MEDICATION_DISPENSE_ID|"+medicationDispenseId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Medication Dispense.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkMedication DispenseID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkMedication DispenseID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Identifier value already exist."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkIdentifierType', function(){
							if(validator.isEmpty(identifierTypeCode)){
								myEmitter.emit('checkIdentifierValue');
							}else{
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkIdentifierValue');
									}else{
										res.json({"err_code": 502, "err_msg": "Identifier type code not found"});		
									}
								})
							}
						})

						if(validator.isEmpty(identifierUseCode)){
							myEmitter.emit('checkIdentifierType');	
						}else{
							checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
								if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkIdentifierType');
								}else{
									res.json({"err_code": 501, "err_msg": "Identifier use code not found"});
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
		medicationDispensePerformer: function updateMedicationDispensePerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationDispenseId = req.params.medication_dispense_id;
			var medicationDispensePerformerId = req.params.medication_dispense_performer_id;

			var err_code = 0;
			var err_msg = "";
			var dataMedicationDispensePerformer = {};
			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Medication Dispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense id is required";
			}

			if(typeof medicationDispensePerformerId !== 'undefined'){
				if(validator.isEmpty(medicationDispensePerformerId)){
					err_code = 2;
					err_msg = "Medication Dispense Performer id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense Performer id is required";
			}
			
			/*
			var actor_practitioner = req.body.actor_practitioner;
			var actor_organization = req.body.actor_organization;
			var actor_patient = req.body.actor_patient;
			var actor_related_person = req.body.actor_related_person;
			var actor_device = req.body.actor_device;
			var on_behalf_of = req.body.on_behalf_of;
			*/
			if(typeof req.body.actor.practitioner !== 'undefined' && req.body.actor.practitioner !== ""){
				var performerActorPractitioner =  req.body.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					dataMedicationDispensePerformer.actor_practitioner = "";
				}else{
					dataMedicationDispensePerformer.actor_practitioner = performerActorPractitioner;
				}
			}else{
			  performerActorPractitioner = "";
			}

			if(typeof req.body.actor.organization !== 'undefined' && req.body.actor.organization !== ""){
				var performerActorOrganization =  req.body.actor.organization.trim().toLowerCase();
				if(validator.isEmpty(performerActorOrganization)){
					dataMedicationDispensePerformer.actor_organization = "";
				}else{
					dataMedicationDispensePerformer.actor_organization = performerActorOrganization;
				}
			}else{
			  performerActorOrganization = "";
			}

			if(typeof req.body.actor.patient !== 'undefined' && req.body.actor.patient !== ""){
				var performerActorPatient =  req.body.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					dataMedicationDispensePerformer.actor_patient = "";
				}else{
					dataMedicationDispensePerformer.actor_patient = performerActorPatient;
				}
			}else{
			  performerActorPatient = "";
			}

			if(typeof req.body.actor.device !== 'undefined' && req.body.actor.device !== ""){
				var performerActorDevice =  req.body.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					dataMedicationDispensePerformer.actor_device = "";
				}else{
					dataMedicationDispensePerformer.actor_device = performerActorDevice;
				}
			}else{
			  performerActorDevice = "";
			}

			if(typeof req.body.actor.relatedPerson !== 'undefined' && req.body.actor.relatedPerson !== ""){
				var performerActorRelatedPerson =  req.body.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					dataMedicationDispensePerformer.actor_related_person = "";
				}else{
					dataMedicationDispensePerformer.actor_related_person = performerActorRelatedPerson;
				}
			}else{
			  performerActorRelatedPerson = "";
			}

			if(typeof req.body.onBehalfOf !== 'undefined' && req.body.onBehalfOf !== ""){
				var performerOnBehalfOf =  req.body.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					dataMedicationDispensePerformer.on_behalf_of = "";
				}else{
					dataMedicationDispensePerformer.on_behalf_of = performerOnBehalfOf;
				}
			}else{
			  performerOnBehalfOf = "";
			}	 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationDispenseID', function(){
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									checkUniqeValue(apikey, "PERFORMER_ID|" + medicationDispensePerformerId, 'MEDICATION_DISPENCE_PERFORMER', function(resMedicationDispensePerformerID){
										if(resMedicationDispensePerformerID.err_code > 0){
											ApiFHIR.put('medicationDispensePerformer', {"apikey": apikey, "_id": medicationDispensePerformerId, "dr": "MEDICATION_DISPENSE_ID|"+medicationDispenseId}, {body: dataMedicationDispensePerformer, json: true}, function(error, response, body){
												medicationDispensePerformer = body;
												if(medicationDispensePerformer.err_code > 0){
													res.json(medicationDispensePerformer);	
												}else{
													res.json({"err_code": 0, "err_msg": "Medication Dispense Performer has been update in this Medication Dispense.", "data": medicationDispensePerformer.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Medication Dispense Performer Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkPerformerActorPractitioner', function () {
							if (!validator.isEmpty(performerActorPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerActorPractitioner, 'PRACTITIONER', function (resPerformerActorPractitioner) {
									if (resPerformerActorPractitioner.err_code > 0) {
										myEmitter.emit('checkMedicationDispenseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationDispenseID');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorOrganization', function () {
							if (!validator.isEmpty(performerActorOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerActorOrganization, 'ORGANIZATION', function (resPerformerActorOrganization) {
									if (resPerformerActorOrganization.err_code > 0) {
										myEmitter.emit('checkPerformerActorPractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorPatient', function () {
							if (!validator.isEmpty(performerActorPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + performerActorPatient, 'PATIENT', function (resPerformerActorPatient) {
									if (resPerformerActorPatient.err_code > 0) {
										myEmitter.emit('checkPerformerActorOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorOrganization');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorDevice', function () {
							if (!validator.isEmpty(performerActorDevice)) {
								checkUniqeValue(apikey, "DEVICE_ID|" + performerActorDevice, 'DEVICE', function (resPerformerActorDevice) {
									if (resPerformerActorDevice.err_code > 0) {
										myEmitter.emit('checkPerformerActorPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor device id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorPatient');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorRelatedPerson', function () {
							if (!validator.isEmpty(performerActorRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + performerActorRelatedPerson, 'RELATED_PERSON', function (resPerformerActorRelatedPerson) {
									if (resPerformerActorRelatedPerson.err_code > 0) {
										myEmitter.emit('checkPerformerActorDevice');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorDevice');
							}
						})

						if (!validator.isEmpty(performerOnBehalfOf)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerOnBehalfOf, 'ORGANIZATION', function (resPerformerOnBehalfOf) {
								if (resPerformerOnBehalfOf.err_code > 0) {
									myEmitter.emit('checkPerformerActorRelatedPerson');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer on behalf of id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerActorRelatedPerson');
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
		medicationDispenseSubstitution: function updateMedicationDispenseSubstitution(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationDispenseId = req.params.medication_dispense_id;
			var medicationDispenseSubstitutionId = req.params.medication_dispense_substitution_id;

			var err_code = 0;
			var err_msg = "";
			var dataMedicationDispenseSubstitution = {};
			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Medication Dispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense id is required";
			}

			if(typeof medicationDispenseSubstitutionId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseSubstitutionId)){
					err_code = 2;
					err_msg = "Medication Dispense Performer id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense Performer id is required";
			}
			
			/*
			var was_substituted  = req.body.was_substituted;
			var type  = req.body.type;
			var reason  = req.body.reason;
			*/
			if (typeof req.body.wasSubstituted !== 'undefined' && req.body.wasSubstituted !== "") {
			  var substitutionWasSubstituted = req.body.wasSubstituted.trim().toLowerCase();
			  if(substitutionWasSubstituted === "true" || substitutionWasSubstituted === "false"){
					dataMedicationDispenseSubstitution.was_substituted = substitutionWasSubstituted;
			  } else {
			    err_code = 2;
			    err_msg = "Medication dispense substitution was substituted is must be boolean.";
			  }
			} else {
			  substitutionWasSubstituted = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var substitutionType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(substitutionType)){
					dataMedicationDispenseSubstitution.type = "";
				}else{
					dataMedicationDispenseSubstitution.type = substitutionType;
				}
			}else{
			  substitutionType = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var substitutionReason =  req.body.reason.trim().toUpperCase();
				if(validator.isEmpty(substitutionReason)){
					dataMedicationDispenseSubstitution.reason = "";
				}else{
					dataMedicationDispenseSubstitution.reason = substitutionReason;
				}
			}else{
			  substitutionReason = "";
			}

			/*if(typeof req.body.responsibleParty !== 'undefined' && req.body.responsibleParty !== ""){
				var substitutionResponsibleParty =  req.body.responsibleParty.trim().toLowerCase();
				if(validator.isEmpty(substitutionResponsibleParty)){
					dataMedicationDispenseSubstitution.responsible_party = "";
				}else{
					dataMedicationDispenseSubstitution.responsible_party = substitutionResponsibleParty;
				}
			}else{
			  substitutionResponsibleParty = "";
			}*/

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationDispenseID', function(){
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									checkUniqeValue(apikey, "SUBSTITUTION_ID|" + medicationDispenseSubstitutionId, 'MEDICATION_DISPENSE_SUBSTITUTION', function(resMedicationDispenseSubstitutionID){
										if(resMedicationDispenseSubstitutionID.err_code > 0){
											ApiFHIR.put('medicationDispenseSubstitution', {"apikey": apikey, "_id": medicationDispenseSubstitutionId, "dr": "MEDICATION_DISPENSE_ID|"+medicationDispenseId}, {body: dataMedicationDispenseSubstitution, json: true}, function(error, response, body){
												medicationDispenseSubstitution = body;
												if(medicationDispenseSubstitution.err_code > 0){
													res.json(medicationDispenseSubstitution);	
												}else{
													res.json({"err_code": 0, "err_msg": "Medication Dispense Performer has been update in this Medication Dispense.", "data": medicationDispenseSubstitution.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Medication Dispense Performer Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkSubstitutionType', function () {
							if (!validator.isEmpty(substitutionType)) {
								checkCode(apikey, substitutionType, 'ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE', function (resSubstitutionTypeCode) {
									if (resSubstitutionTypeCode.err_code > 0) {
										myEmitter.emit('checkMedicationDispenseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Substitution type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationDispenseID');
							}
						})
						
						if (!validator.isEmpty(substitutionReason)) {
							checkCode(apikey, substitutionReason, 'SUBSTANCE_ADMIN_SUBSTITUTION_REASON', function (resSubstitutionReasonCode) {
								if (resSubstitutionReasonCode.err_code > 0) {
									myEmitter.emit('checkSubstitutionType');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Substitution reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubstitutionType');
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
		timing : function putTiming(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var timingId = req.params.timing_id;
			var medicationDispenseId = req.params.medication_dispense_id;
			var dosageId = req.params.dosage_id;

			var err_code = 0;
			var err_msg = "";
			var dataTiming = {};
			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Medication Dispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense id is required";
			}
			
			if(typeof dosageId !== 'undefined'){
				if(validator.isEmpty(dosageId)){
					err_code = 2;
					err_msg = "Medication Dispense Dosage id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense Dosage id is required";
			}
			
			if(typeof timingId !== 'undefined'){
				if(validator.isEmpty(timingId)){
					err_code = 2;
					err_msg = "Timing id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Timing id is required";
			}

			if(typeof req.body.event !== 'undefined' && req.body.event !== ""){
				var event =  req.body.event;
				if(validator.isEmpty(event)){
					err_code = 2;
					err_msg = "timing event is required.";
				}else{
					if(!regex.test(event)){
						err_code = 2;
						err_msg = "timing event invalid date format.";	
					}else{
						dataTiming.event = event;
					}
				}
			}else{
			  event = "";
			}

			if(typeof req.body.repeat.bounds.boundsDuration !== 'undefined' && req.body.repeat.bounds.boundsDuration !== ""){
				var repeatBoundsBoundsDuration =  req.body.repeat.bounds.boundsDuration.trim();
				if(validator.isEmpty(repeatBoundsBoundsDuration)){
					dataTiming.repeat_bounds_duration = "";
				}else{
					if(!validator.isInt(repeatBoundsBoundsDuration)){
						err_code = 2;
						err_msg = "timing repeat bounds bounds duration is must be number.";
					}else{
						dataTiming.repeat_bounds_duration = repeatBoundsBoundsDuration;
					}
				}
			}else{
			  repeatBoundsBoundsDuration = "";
			}

			if (typeof req.body.repeat.bounds.boundsRange !== 'undefined' && req.body.repeat.bounds.boundsRange !== "") {
			  var repeatBoundsBoundsRange = req.body.repeat.bounds.boundsRange;
			  if (repeatBoundsBoundsRange.indexOf("to") > 0) {
			    arrRepeatBoundsBoundsRange = repeatBoundsBoundsRange.split("to");
			    dataTiming.repeat_bounds_range_low = arrRepeatBoundsBoundsRange[0];
			    dataTiming.repeat_bounds_range_high = arrRepeatBoundsBoundsRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "timing repeat bounds bounds range invalid range format.";
				}
			} else {
			  repeatBoundsBoundsRange = "";
			}

			if (typeof req.body.repeat.bounds.boundsPeriod !== 'undefined' && req.body.repeat.bounds.boundsPeriod !== "") {
			  var repeatBoundsBoundsPeriod = req.body.repeat.bounds.boundsPeriod;
			  if (repeatBoundsBoundsPeriod.indexOf("to") > 0) {
			    arrRepeatBoundsBoundsPeriod = repeatBoundsBoundsPeriod.split("to");
			    dataTiming.repeat_bounds_period_start = arrRepeatBoundsBoundsPeriod[0];
			    dataTiming.repeat_bounds_period_end = arrRepeatBoundsBoundsPeriod[1];
			    if (!regex.test(repeatBoundsBoundsPeriodStart) && !regex.test(repeatBoundsBoundsPeriodEnd)) {
			      err_code = 2;
			      err_msg = "timing repeat bounds bounds period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "timing repeat bounds bounds period invalid date format.";
				}
			} else {
			  repeatBoundsBoundsPeriod = "";
			}

			if(typeof req.body.repeat.count !== 'undefined' && req.body.repeat.count !== ""){
				var repeatCount =  req.body.repeat.count.trim();
				if(validator.isEmpty(repeatCount)){
					dataTiming.count = "";
				}else{
					if(!validator.isInt(repeatCount)){
						err_code = 2;
						err_msg = "timing repeat count is must be number.";
					}else{
						dataTiming.count = repeatCount;
					}
				}
			}else{
			  repeatCount = "";
			}

			if(typeof req.body.repeat.countMax !== 'undefined' && req.body.repeat.countMax !== ""){
				var repeatCountMax =  req.body.repeat.countMax.trim();
				if(validator.isEmpty(repeatCountMax)){
					dataTiming.count_max = "";
				}else{
					if(!validator.isInt(repeatCountMax)){
						err_code = 2;
						err_msg = "timing repeat count max is must be number.";
					}else{
						dataTiming.count_max = repeatCountMax;
					}
				}
			}else{
			  repeatCountMax = "";
			}

			if(typeof req.body.repeat.duration !== 'undefined' && req.body.repeat.duration !== ""){
				var repeatDuration =  req.body.repeat.duration.trim();
				if(validator.isEmpty(repeatDuration)){
					dataTiming.duration = "";
				}else{
					if(!validator.isInt(repeatDuration)){
						err_code = 2;
						err_msg = "timing repeat duration is must be number.";
					}else{
						dataTiming.duration = repeatDuration;
					}
				}
			}else{
			  repeatDuration = "";
			}

			if(typeof req.body.repeat.durationMax !== 'undefined' && req.body.repeat.durationMax !== ""){
				var repeatDurationMax =  req.body.repeat.durationMax.trim();
				if(validator.isEmpty(repeatDurationMax)){
					dataTiming.duration_max = "";
				}else{
					if(!validator.isInt(repeatDurationMax)){
						err_code = 2;
						err_msg = "timing repeat duration max is must be number.";
					}else{
						dataTiming.duration_max = repeatDurationMax;
					}
				}
			}else{
			  repeatDurationMax = "";
			}

			if(typeof req.body.repeat.durationUnit !== 'undefined' && req.body.repeat.durationUnit !== ""){
				var repeatDurationUnit =  req.body.repeat.durationUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatDurationUnit)){
					dataTiming.duration_unit = "";
				}else{
					dataTiming.duration_unit = repeatDurationUnit;
				}
			}else{
			  repeatDurationUnit = "";
			}

			if(typeof req.body.repeat.frequency !== 'undefined' && req.body.repeat.frequency !== ""){
				var repeatFrequency =  req.body.repeat.frequency.trim();
				if(validator.isEmpty(repeatFrequency)){
					dataTiming.frequency = "";
				}else{
					if(!validator.isInt(repeatFrequency)){
						err_code = 2;
						err_msg = "timing repeat frequency is must be number.";
					}else{
						dataTiming.frequency = repeatFrequency;
					}
				}
			}else{
			  repeatFrequency = "";
			}

			if(typeof req.body.repeat.frequencyMax !== 'undefined' && req.body.repeat.frequencyMax !== ""){
				var repeatFrequencyMax =  req.body.repeat.frequencyMax.trim();
				if(validator.isEmpty(repeatFrequencyMax)){
					dataTiming.frequency_max = "";
				}else{
					if(!validator.isInt(repeatFrequencyMax)){
						err_code = 2;
						err_msg = "timing repeat frequency max is must be number.";
					}else{
						dataTiming.frequency_max = repeatFrequencyMax;
					}
				}
			}else{
			  repeatFrequencyMax = "";
			}

			if(typeof req.body.repeat.period !== 'undefined' && req.body.repeat.period !== ""){
				var repeatPeriod =  req.body.repeat.period.trim();
				if(validator.isEmpty(repeatPeriod)){
					dataTiming.period = "";
				}else{
					if(!validator.isInt(repeatPeriod)){
						err_code = 2;
						err_msg = "timing repeat period is must be number.";
					}else{
						dataTiming.period = repeatPeriod;
					}
				}
			}else{
			  repeatPeriod = "";
			}

			if(typeof req.body.repeat.periodMax !== 'undefined' && req.body.repeat.periodMax !== ""){
				var repeatPeriodMax =  req.body.repeat.periodMax.trim();
				if(validator.isEmpty(repeatPeriodMax)){
					dataTiming.period_max = "";
				}else{
					if(!validator.isInt(repeatPeriodMax)){
						err_code = 2;
						err_msg = "timing repeat period max is must be number.";
					}else{
						dataTiming.period_max = repeatPeriodMax;
					}
				}
			}else{
			  repeatPeriodMax = "";
			}

			if(typeof req.body.repeat.periodUnit !== 'undefined' && req.body.repeat.periodUnit !== ""){
				var repeatPeriodUnit =  req.body.repeat.periodUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatPeriodUnit)){
					dataTiming.period_unit = "";
				}else{
					dataTiming.period_unit = repeatPeriodUnit;
				}
			}else{
			  repeatPeriodUnit = "";
			}

			if(typeof req.body.repeat.dayOfWeek !== 'undefined' && req.body.repeat.dayOfWeek !== ""){
				var repeatDayOfWeek =  req.body.repeat.dayOfWeek.trim().toLowerCase();
				if(validator.isEmpty(repeatDayOfWeek)){
					dataTiming.day_of_week = "";
				}else{
					dataTiming.day_of_week = repeatDayOfWeek;
				}
			}else{
			  repeatDayOfWeek = "";
			}

			if(typeof req.body.repeat.timeOfDay !== 'undefined' && req.body.repeat.timeOfDay !== ""){
				var repeatTimeOfDay =  req.body.repeat.timeOfDay.trim();
				if(validator.isEmpty(repeatTimeOfDay)){
					dataTiming.time_of_day = "";
				}else{
					if(!validator.isInt(repeatTimeOfDay)){
						err_code = 2;
						err_msg = "timing repeat time of day is must be number.";
					}else{
						dataTiming.time_of_day = repeatTimeOfDay;
					}
				}
			}else{
			  repeatTimeOfDay = "";
			}

			if(typeof req.body.repeat.when !== 'undefined' && req.body.repeat.when !== ""){
				var repeatWhen =  req.body.repeat.when.trim().toUpperCase();
				if(validator.isEmpty(repeatWhen)){
					dataTiming.when = "";
				}else{
					dataTiming.when = repeatWhen;
				}
			}else{
			  repeatWhen = "";
			}

			if(typeof req.body.repeat.offset !== 'undefined' && req.body.repeat.offset !== ""){
				var repeatOffset =  req.body.repeat.offset.trim();
				if(validator.isEmpty(repeatOffset)){
					dataTiming.offset = "";
				}else{
					if(!validator.isInt(repeatOffset)){
						err_code = 2;
						err_msg = "timing repeat offset is must be number.";
					}else{
						dataTiming.offset = repeatOffset;
					}
				}
			}else{
			  repeatOffset = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toUpperCase();
				if(validator.isEmpty(code)){
					dataTiming.code = "";
				}else{
					dataTiming.code = code;
				}
			}else{
			  code = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						myEmitter.prependOnceListener('checkMedicationDispenseId', function () {
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									checkUniqeValue(apikey, "DOSAGE_ID|" + dosageId, 'DOSAGE', function(resMedicationDispenseID){
										if(resMedicationDispenseID.err_code > 0){
									
											//console.log(dataImmunization);
											ApiFHIR.put('timing', {"apikey": apikey, "_id": timingId,"dr": "DOSAGE_ID|"+dosageId}, {body: dataTiming, json: true}, function(error, response, body){
												timing = body;
												if(timing.err_code > 0){
													res.json(timing);	
												}else{
													res.json({"err_code": 0, "err_msg": "Medication Dispense Timing has been update.", "data": [{"_id": timingId}]});
												}
											})
										}else{
											res.json({"err_code": 501, "err_msg": "Medication Dispense Dosage Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 501, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkRepeatDurationUnit', function () {
							if (!validator.isEmpty(repeatDurationUnit)) {
								checkCode(apikey, repeatDurationUnit, 'UNITS_OF_TIME', function (resRepeatDurationUnitCode) {
									if (resRepeatDurationUnitCode.err_code > 0) {
										myEmitter.emit('checkMedicationDispenseId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat duration unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationDispenseId');
							}
						})

						myEmitter.prependOnceListener('checkRepeatPeriodUnit', function () {
							if (!validator.isEmpty(repeatPeriodUnit)) {
								checkCode(apikey, repeatPeriodUnit, 'UNITS_OF_TIME', function (resRepeatPeriodUnitCode) {
									if (resRepeatPeriodUnitCode.err_code > 0) {
										myEmitter.emit('checkRepeatDurationUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat period unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatDurationUnit');
							}
						})

						myEmitter.prependOnceListener('checkRepeatDayOfWeek', function () {
							if (!validator.isEmpty(repeatDayOfWeek)) {
								checkCode(apikey, repeatDayOfWeek, 'DAYS_OF_WEEK', function (resRepeatDayOfWeekCode) {
									if (resRepeatDayOfWeekCode.err_code > 0) {
										myEmitter.emit('checkRepeatPeriodUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat day of week code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatPeriodUnit');
							}
						})

						myEmitter.prependOnceListener('checkRepeatWhen', function () {
							if (!validator.isEmpty(repeatWhen)) {
								checkCode(apikey, repeatWhen, 'EVENT_TIMING', function (resRepeatWhenCode) {
									if (resRepeatWhenCode.err_code > 0) {
										myEmitter.emit('checkRepeatDayOfWeek');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat when code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatDayOfWeek');
							}
						})

						if (!validator.isEmpty(code)) {
							checkCode(apikey, code, 'TIMING_ABBREVIATION', function (resCodeCode) {
								if (resCodeCode.err_code > 0) {
									myEmitter.emit('checkRepeatWhen');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Code Timing code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRepeatWhen');
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
		dosage : function putDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var dosageId = req.params.dosage_id;
			var medicationDispenseId = req.params.medication_dispense_id;

			var err_code = 0;
			var err_msg = "";
			var dataDosage = {};
			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "Medication Dispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Dispense id is required";
			}
			if(typeof dosageId !== 'undefined'){
				if(validator.isEmpty(dosageId)){
					err_code = 2;
					err_msg = "Dosage id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Dosage id is required";
			}

			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var sequence =  req.body.sequence.trim();
				if(validator.isEmpty(sequence)){
					dataDosage.sequence = "";
				}else{
					if(!validator.isInt(sequence)){
						err_code = 2;
						err_msg = "dosage sequence is must be number.";
					}else{
						dataDosage.sequence = sequence;
					}
				}
			}else{
			  sequence = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var text =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(text)){
					dataDosage.text = "";
				}else{
					dataDosage.text = text;
				}
			}else{
			  text = "";
			}

			if(typeof req.body.additionalInstruction !== 'undefined' && req.body.additionalInstruction !== ""){
				var additionalInstruction =  req.body.additionalInstruction.trim().toLowerCase();
				if(validator.isEmpty(additionalInstruction)){
					dataDosage.additional_instruction = "";
				}else{
					dataDosage.additional_instruction = additionalInstruction;
				}
			}else{
			  additionalInstruction = "";
			}

			if(typeof req.body.patientInstruction !== 'undefined' && req.body.patientInstruction !== ""){
				var patientInstruction =  req.body.patientInstruction.trim().toLowerCase();
				if(validator.isEmpty(patientInstruction)){
					dataDosage.patient_instruction = "";
				}else{
					dataDosage.patient_instruction = patientInstruction;
				}
			}else{
			  patientInstruction = "";
			}

			/*if(typeof req.body.timing !== 'undefined' && req.body.timing !== ""){
				var timing =  req.body.timing.trim().toLowerCase();
				if(validator.isEmpty(timing)){
					dataDosage.timing_id = "";
				}else{
					dataDosage.timing_id = timing;
				}
			}else{
			  timing = "";
			}*/

			if (typeof req.body.asNeeded.asNeededBoolean !== 'undefined' && req.body.asNeeded.asNeededBoolean !== "") {
			  var asNeededAsNeededBoolean = req.body.asNeeded.asNeededBoolean.trim().toLowerCase();
					if(validator.isEmpty(asNeededAsNeededBoolean)){
						asNeededAsNeededBoolean = "false";
					}
			  if(asNeededAsNeededBoolean === "true" || asNeededAsNeededBoolean === "false"){
					dataDosage.as_needed_boolean = asNeededAsNeededBoolean;
			  } else {
			    err_code = 2;
			    err_msg = "Dosage as needed as needed boolean is must be boolean.";
			  }
			} else {
			  asNeededAsNeededBoolean = "";
			}

			if(typeof req.body.asNeeded.asNeededCodeableConcept !== 'undefined' && req.body.asNeeded.asNeededCodeableConcept !== ""){
				var asNeededAsNeededCodeableConcept =  req.body.asNeeded.asNeededCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(asNeededAsNeededCodeableConcept)){
					dataDosage.as_needed_codeable_concept = "";
				}else{
					dataDosage.as_needed_codeable_concept = asNeededAsNeededCodeableConcept;
				}
			}else{
			  asNeededAsNeededCodeableConcept = "";
			}

			if(typeof req.body.site !== 'undefined' && req.body.site !== ""){
				var site =  req.body.site.trim().toLowerCase();
				if(validator.isEmpty(site)){
					dataDosage.site = "";
				}else{
					dataDosage.site = site;
				}
			}else{
			  site = "";
			}

			if(typeof req.body.route !== 'undefined' && req.body.route !== ""){
				var route =  req.body.route.trim().toLowerCase();
				if(validator.isEmpty(route)){
					dataDosage.route = "";
				}else{
					dataDosage.route = route;
				}
			}else{
			  route = "";
			}

			if(typeof req.body.method !== 'undefined' && req.body.method !== ""){
				var method =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(method)){
					dataDosage.method = "";
				}else{
					dataDosage.method = method;
				}
			}else{
			  method = "";
			}

			if (typeof req.body.dose.doseRange !== 'undefined' && req.body.dose.doseRange !== "") {
			  var doseDoseRange = req.body.dose.doseRange;
			  if (doseDoseRange.indexOf("to") > 0) {
			    arrDoseDoseRange = doseDoseRange.split("to");
			    dataDosage.dose_range_low = arrDoseDoseRange[0];
			    dataDosage.dose_range_high = arrDoseDoseRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "dosage dose dose range invalid range format.";
				}
			} else {
			  doseDoseRange = "";
			}

			if(typeof req.body.dose.doseQuantity !== 'undefined' && req.body.dose.doseQuantity !== ""){
				var doseDoseQuantity =  req.body.dose.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(doseDoseQuantity)){
					dataDosage.dose_quantity = "";
				}else{
					dataDosage.dose_quantity = doseDoseQuantity;
				}
			}else{
			  doseDoseQuantity = "";
			}

			if (typeof req.body.maxDosePerPeriod !== 'undefined' && req.body.maxDosePerPeriod !== "") {
			  var maxDosePerPeriod = req.body.maxDosePerPeriod;
			  if (maxDosePerPeriod.indexOf("to") > 0) {
			    arrMaxDosePerPeriod = maxDosePerPeriod.split("to");
			    dataDosage.max_dose_per_period_numerator = arrMaxDosePerPeriod[0];
			    dataDosage.max_dose_per_period_denominator = arrMaxDosePerPeriod[1];
				} else {
			  	err_code = 2;
			  	err_msg = "dosage max dose per period invalid ratio format.";
				}
			} else {
			  maxDosePerPeriod = "";
			}

			if(typeof req.body.maxDosePerAdministration !== 'undefined' && req.body.maxDosePerAdministration !== ""){
				var maxDosePerAdministration =  req.body.maxDosePerAdministration.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerAdministration)){
					dataDosage.max_dose_per_administration = "";
				}else{
					dataDosage.max_dose_per_administration = maxDosePerAdministration;
				}
			}else{
			  maxDosePerAdministration = "";
			}

			if(typeof req.body.maxDosePerLifetime !== 'undefined' && req.body.maxDosePerLifetime !== ""){
				var maxDosePerLifetime =  req.body.maxDosePerLifetime.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerLifetime)){
					dataDosage.max_dose_per_lifetime = "";
				}else{
					dataDosage.max_dose_per_lifetime = maxDosePerLifetime;
				}
			}else{
			  maxDosePerLifetime = "";
			}

			if (typeof req.body.rate.rateRatio !== 'undefined' && req.body.rate.rateRatio !== "") {
			  var rateRateRatio = req.body.rate.rateRatio;
			  if (rateRateRatio.indexOf("to") > 0) {
			    arrRateRateRatio = rateRateRatio.split("to");
			    dataDosage.rate_ratio_numerator = arrRateRateRatio[0];
			    dataDosage.rate_ratio_denominator = arrRateRateRatio[1];
				} else {
			  	err_code = 2;
			  	err_msg = "dosage rate rate ratio invalid ratio format.";
				}
			} else {
			  rateRateRatio = "";
			}

			if (typeof req.body.rate.rateRange !== 'undefined' && req.body.rate.rateRange !== "") {
			  var rateRateRange = req.body.rate.rateRange;
			  if (rateRateRange.indexOf("to") > 0) {
			    arrRateRateRange = rateRateRange.split("to");
			    dataDosage.rate_range_low = arrRateRateRange[0];
			    dataDosage.rate_range_high = arrRateRateRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "dosage rate rate range invalid range format.";
				}
			} else {
			  rateRateRange = "";
			}

			if(typeof req.body.rate.rateQuantity !== 'undefined' && req.body.rate.rateQuantity !== ""){
				var rateRateQuantity =  req.body.rate.rateQuantity.trim();
				if(validator.isEmpty(rateRateQuantity)){
					dataDosage.rate_quantity = "";
				}else{
					if(!validator.isInt(rateRateQuantity)){
						err_code = 2;
						err_msg = "dosage rate rate quantity is must be number.";
					}else{
						dataDosage.rate_quantity = rateRateQuantity;
					}
				}
			}else{
			  rateRateQuantity = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkMedicationDispenseId', function() {
							checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + medicationDispenseId, 'MEDICATION_DISPENSE', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
										//console.log(dataImmunization);
										ApiFHIR.put('dosage', {"apikey": apikey, "_id": dosageId,"dr": "MEDICATION_DISPENSE_ID|"+medicationDispenseId}, {body: dataDosage, json: true}, function(error, response, body){
											dosage = body;
											if(dosage.err_code > 0){
												res.json(dosage);	
											}else{
												res.json({"err_code": 0, "err_msg": "Medication Dispense Dosage has been update.", "data": [{"_id": dosageId}]});
											}
										})
									}else{
									res.json({"err_code": 501, "err_msg": "Medication Dispense Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAdditionalInstruction', function () {
							if (!validator.isEmpty(additionalInstruction)) {
								checkCode(apikey, additionalInstruction, 'ADDITIONAL_INSTRUCTION_CODES', function (resAdditionalInstructionCode) {
									if (resAdditionalInstructionCode.err_code > 0) {
										myEmitter.emit('checkMedicationDispenseId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Additional instruction code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationDispenseId');
							}
						})

						myEmitter.prependOnceListener('checkAsNeededAsNeededCodeableConcept', function () {
							if (!validator.isEmpty(asNeededAsNeededCodeableConcept)) {
								checkCode(apikey, asNeededAsNeededCodeableConcept, 'MEDICATION_AS_NEEDED_REASON', function (resAsNeededAsNeededCodeableConceptCode) {
									if (resAsNeededAsNeededCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkAdditionalInstruction');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "As needed as needed codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAdditionalInstruction');
							}
						})

						myEmitter.prependOnceListener('checkSite', function () {
							if (!validator.isEmpty(site)) {
								checkCode(apikey, site, 'APPROACH_SITE_CODES', function (resSiteCode) {
									if (resSiteCode.err_code > 0) {
										myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkRoute', function () {
							if (!validator.isEmpty(route)) {
								checkCode(apikey, route, 'ROUTE_CODES', function (resRouteCode) {
									if (resRouteCode.err_code > 0) {
										myEmitter.emit('checkSite');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Route code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSite');
							}
						})

						if (!validator.isEmpty(method)) {
							checkCode(apikey, method, 'ADMINISTRATION_METHOD_CODES', function (resMethodCode) {
								if (resMethodCode.err_code > 0) {
									myEmitter.emit('checkRoute');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Method code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRoute');
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