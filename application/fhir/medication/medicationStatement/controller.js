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
		medicationStatement : function getMedicationStatement(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var medicationStatementId = req.query._id;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var effective = req.query.effective;
			var identifier = req.query.identifier;
			var medication = req.query.medication;
			var part_of = req.query.partOf;
			var patient = req.query.patient;
			var source = req.query.source;
			var status = req.query.status;
			var subject = req.query.subject;
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

			if(typeof medicationStatementId !== 'undefined'){
				if(!validator.isEmpty(medicationStatementId)){
					qString.medicationStatementId = medicationStatementId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Medication Statement Id is required."});
				}
			}
			
			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "category is empty."});
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

			if(typeof effective !== 'undefined'){
				if(!validator.isEmpty(effective)){
					if(!regex.test(effective)){
						res.json({"err_code": 1, "err_msg": "effective invalid format."});
					}else{
						qString.effective = effective; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "effective is empty."});
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

			if(typeof part_of !== 'undefined'){
				if(!validator.isEmpty(part_of)){
					qString.part_of = part_of; 
				}else{
					res.json({"err_code": 1, "err_msg": "part of is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "patient is empty."});
				}
			}

			if(typeof source !== 'undefined'){
				if(!validator.isEmpty(source)){
					qString.source = source; 
				}else{
					res.json({"err_code": 1, "err_msg": "source is empty."});
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


			seedPhoenixFHIR.path.GET = {
				"MedicationStatement" : {
					"location": "%(apikey)s/MedicationStatement",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('MedicationStatement', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var medicationStatement = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(medicationStatement.err_code == 0){
								//cek jumdata dulu
								if(medicationStatement.data.length > 0){
									newMedicationStatement = [];
									for(i=0; i < medicationStatement.data.length; i++){
										myEmitter.once("getIdentifier", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
											qString = {};
											qString.medication_statement_id = medicationStatement.id;
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
													var objectMedicationStatement = {};
													objectMedicationStatement.resourceType = medicationStatement.resourceType;
													objectMedicationStatement.id = medicationStatement.id;
													objectMedicationStatement.identifier = identifier.data;
													objectMedicationStatement.context = medicationStatement.context;
													objectMedicationStatement.status = medicationStatement.status;
													objectMedicationStatement.category = medicationStatement.category;
													objectMedicationStatement.medication = medicationStatement.medication;
													objectMedicationStatement.effective = medicationStatement.effective;
													objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
													objectMedicationStatement.informationSource = medicationStatement.informationSource;
													objectMedicationStatement.subject = medicationStatement.subject;
													objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
													objectMedicationStatement.taken = medicationStatement.taken;
													objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
													objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

													newMedicationStatement[index] = objectMedicationStatement;

													myEmitter.once("getMedicationStatementBasedOnCarePlan", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
														qString = {};
														qString.medication_statement_id = medicationStatement.id;
														seedPhoenixFHIR.path.GET = {
															"MedicationStatementBasedOnCarePlan" : {
																"location": "%(apikey)s/MedicationStatementBasedOnCarePlan",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('MedicationStatementBasedOnCarePlan', {"apikey": apikey}, {}, function(error, response, body){
															medicationStatementBasedOnCarePlan = JSON.parse(body);
															if(medicationStatementBasedOnCarePlan.err_code == 0){
																var objectMedicationStatement = {};
																objectMedicationStatement.resourceType = medicationStatement.resourceType;
																objectMedicationStatement.id = medicationStatement.id;
																objectMedicationStatement.identifier = medicationStatement.identifier;
																var BasedOn = {};
																BasedOn.carePlan = medicationStatementBasedOnCarePlan.data;
																objectMedicationStatement.basedOn = BasedOn;
																objectMedicationStatement.context = medicationStatement.context;
																objectMedicationStatement.status = medicationStatement.status;
																objectMedicationStatement.category = medicationStatement.category;
																objectMedicationStatement.medication = medicationStatement.medication;
																objectMedicationStatement.effective = medicationStatement.effective;
																objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																objectMedicationStatement.informationSource = medicationStatement.informationSource;
																objectMedicationStatement.subject = medicationStatement.subject;
																objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																objectMedicationStatement.taken = medicationStatement.taken;
																objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

																newMedicationStatement[index] = objectMedicationStatement;

																myEmitter.once("getMedicationStatementBasedOnProcedureRequest", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																	qString = {};
																	qString.medication_statement_id = medicationStatement.id;
																	seedPhoenixFHIR.path.GET = {
																		"MedicationStatementBasedOnProcedureRequest" : {
																			"location": "%(apikey)s/MedicationStatementBasedOnProcedureRequest",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('MedicationStatementBasedOnProcedureRequest', {"apikey": apikey}, {}, function(error, response, body){
																		medicationStatementBasedOnProcedureRequest = JSON.parse(body);
																		if(medicationStatementBasedOnProcedureRequest.err_code == 0){
																			var objectMedicationStatement = {};
																			objectMedicationStatement.resourceType = medicationStatement.resourceType;
																			objectMedicationStatement.id = medicationStatement.id;
																			objectMedicationStatement.identifier = medicationStatement.identifier;
																			var BasedOn = {};
																			BasedOn.carePlan = medicationStatement.basedOn.carePlan;
																			BasedOn.procedureRequest = medicationStatementBasedOnProcedureRequest.data;
																			objectMedicationStatement.basedOn = BasedOn;
																			objectMedicationStatement.context = medicationStatement.context;
																			objectMedicationStatement.status = medicationStatement.status;
																			objectMedicationStatement.category = medicationStatement.category;
																			objectMedicationStatement.medication = medicationStatement.medication;
																			objectMedicationStatement.effective = medicationStatement.effective;
																			objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																			objectMedicationStatement.informationSource = medicationStatement.informationSource;
																			objectMedicationStatement.subject = medicationStatement.subject;
																			objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																			objectMedicationStatement.taken = medicationStatement.taken;
																			objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																			objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

																			newMedicationStatement[index] = objectMedicationStatement;

																			myEmitter.once("getMedicationStatementBasedOnReferralRequest", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																				qString = {};
																				qString.medication_statement_id = medicationStatement.id;
																				seedPhoenixFHIR.path.GET = {
																					"MedicationStatementBasedOnReferralRequest" : {
																						"location": "%(apikey)s/MedicationStatementBasedOnReferralRequest",
																						"query": qString
																					}
																				}
																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																				ApiFHIR.get('MedicationStatementBasedOnReferralRequest', {"apikey": apikey}, {}, function(error, response, body){
																					medicationStatementBasedOnReferralRequest = JSON.parse(body);
																					if(medicationStatementBasedOnReferralRequest.err_code == 0){
																						var objectMedicationStatement = {};
																						objectMedicationStatement.resourceType = medicationStatement.resourceType;
																						objectMedicationStatement.id = medicationStatement.id;
																						objectMedicationStatement.identifier = medicationStatement.identifier;
																						var BasedOn = {};
																						BasedOn.carePlan = medicationStatement.basedOn.carePlan;
																						BasedOn.procedureRequest = medicationStatement.basedOn.procedureRequest;
																						BasedOn.referralRequest = medicationStatementBasedOnReferralRequest.data;
																						objectMedicationStatement.basedOn = BasedOn;
																						objectMedicationStatement.context = medicationStatement.context;
																						objectMedicationStatement.status = medicationStatement.status;
																						objectMedicationStatement.category = medicationStatement.category;
																						objectMedicationStatement.medication = medicationStatement.medication;
																						objectMedicationStatement.effective = medicationStatement.effective;
																						objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																						objectMedicationStatement.informationSource = medicationStatement.informationSource;
																						objectMedicationStatement.subject = medicationStatement.subject;
																						objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																						objectMedicationStatement.taken = medicationStatement.taken;
																						objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																						objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

																						newMedicationStatement[index] = objectMedicationStatement;

																						myEmitter.once("getMedicationStatementBasedOnMedicationRequest", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																							qString = {};
																							qString.medication_statement_id = medicationStatement.id;
																							seedPhoenixFHIR.path.GET = {
																								"MedicationStatementBasedOnMedicationRequest" : {
																									"location": "%(apikey)s/MedicationStatementBasedOnMedicationRequest",
																									"query": qString
																								}
																							}
																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																							ApiFHIR.get('MedicationStatementBasedOnMedicationRequest', {"apikey": apikey}, {}, function(error, response, body){
																								medicationStatementBasedOnMedicationRequest = JSON.parse(body);
																								if(medicationStatementBasedOnMedicationRequest.err_code == 0){
																									var objectMedicationStatement = {};
																									objectMedicationStatement.resourceType = medicationStatement.resourceType;
																									objectMedicationStatement.id = medicationStatement.id;
																									objectMedicationStatement.identifier = medicationStatement.identifier;
																									var BasedOn = {};
																									BasedOn.carePlan = medicationStatement.basedOn.carePlan;
																									BasedOn.procedureRequest = medicationStatement.basedOn.procedureRequest;
																									BasedOn.referralRequest = medicationStatement.basedOn.referralRequest;
																									BasedOn.medicationRequest = medicationStatementBasedOnMedicationRequest.data;
																									objectMedicationStatement.basedOn = BasedOn;
																									objectMedicationStatement.context = medicationStatement.context;
																									objectMedicationStatement.status = medicationStatement.status;
																									objectMedicationStatement.category = medicationStatement.category;
																									objectMedicationStatement.medication = medicationStatement.medication;
																									objectMedicationStatement.effective = medicationStatement.effective;
																									objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																									objectMedicationStatement.informationSource = medicationStatement.informationSource;
																									objectMedicationStatement.subject = medicationStatement.subject;
																									objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																									objectMedicationStatement.taken = medicationStatement.taken;
																									objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																									objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

																									newMedicationStatement[index] = objectMedicationStatement;

																									myEmitter.once("getMedicationStatementPartOfMedicationAdministration", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																										qString = {};
																										qString.medication_statement_id = medicationStatement.id;
																										seedPhoenixFHIR.path.GET = {
																											"MedicationStatementPartOfMedicationAdministration" : {
																												"location": "%(apikey)s/MedicationStatementPartOfMedicationAdministration",
																												"query": qString
																											}
																										}
																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																										ApiFHIR.get('MedicationStatementPartOfMedicationAdministration', {"apikey": apikey}, {}, function(error, response, body){
																											medicationStatementPartOfMedicationAdministration = JSON.parse(body);
																											if(medicationStatementPartOfMedicationAdministration.err_code == 0){
																												var objectMedicationStatement = {};
																												objectMedicationStatement.resourceType = medicationStatement.resourceType;
																												objectMedicationStatement.id = medicationStatement.id;
																												objectMedicationStatement.identifier = medicationStatement.identifier;
																												objectMedicationStatement.basedOn = medicationStatement.basedOn;
																												var PartOf = {};
																												PartOf.medicationAdministration = medicationStatementPartOfMedicationAdministration.data;
																												objectMedicationStatement.partOf = PartOf;
																												objectMedicationStatement.context = medicationStatement.context;
																												objectMedicationStatement.status = medicationStatement.status;
																												objectMedicationStatement.category = medicationStatement.category;
																												objectMedicationStatement.medication = medicationStatement.medication;
																												objectMedicationStatement.effective = medicationStatement.effective;
																												objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																												objectMedicationStatement.informationSource = medicationStatement.informationSource;
																												objectMedicationStatement.subject = medicationStatement.subject;
																												objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																												objectMedicationStatement.taken = medicationStatement.taken;
																												objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																												objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

																												newMedicationStatement[index] = objectMedicationStatement;

																												myEmitter.once("getMedicationStatementPartOfMedicationDispense", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																													qString = {};
																													qString.medication_statement_id = medicationStatement.id;
																													seedPhoenixFHIR.path.GET = {
																														"MedicationStatementPartOfMedicationDispense" : {
																															"location": "%(apikey)s/MedicationStatementPartOfMedicationDispense",
																															"query": qString
																														}
																													}
																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																													ApiFHIR.get('MedicationStatementPartOfMedicationDispense', {"apikey": apikey}, {}, function(error, response, body){
																														medicationStatementPartOfMedicationDispense = JSON.parse(body);
																														if(medicationStatementPartOfMedicationDispense.err_code == 0){
																															var objectMedicationStatement = {};
																															objectMedicationStatement.resourceType = medicationStatement.resourceType;
																															objectMedicationStatement.id = medicationStatement.id;
																															objectMedicationStatement.identifier = medicationStatement.identifier;
																															objectMedicationStatement.basedOn = medicationStatement.basedOn;
																															var PartOf = {};
																															PartOf.medicationAdministration = medicationStatement.partOf.medicationAdministration;
																															PartOf.medicationDispense = medicationStatementPartOfMedicationDispense.data;
																															objectMedicationStatement.partOf = PartOf;
																															objectMedicationStatement.context = medicationStatement.context;
																															objectMedicationStatement.status = medicationStatement.status;
																															objectMedicationStatement.category = medicationStatement.category;
																															objectMedicationStatement.medication = medicationStatement.medication;
																															objectMedicationStatement.effective = medicationStatement.effective;
																															objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																															objectMedicationStatement.informationSource = medicationStatement.informationSource;
																															objectMedicationStatement.subject = medicationStatement.subject;
																															objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																															objectMedicationStatement.taken = medicationStatement.taken;
																															objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																															objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

																															newMedicationStatement[index] = objectMedicationStatement;

																															myEmitter.once("getMedicationStatementPartOfMedicationStatement", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																																qString = {};
																																qString.medication_statement_id = medicationStatement.id;
																																seedPhoenixFHIR.path.GET = {
																																	"MedicationStatementPartOfMedicationStatement" : {
																																		"location": "%(apikey)s/MedicationStatementPartOfMedicationStatement",
																																		"query": qString
																																	}
																																}
																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																ApiFHIR.get('MedicationStatementPartOfMedicationStatement', {"apikey": apikey}, {}, function(error, response, body){
																																	medicationStatementPartOfMedicationStatement = JSON.parse(body);
																																	if(medicationStatementPartOfMedicationStatement.err_code == 0){
																																		var objectMedicationStatement = {};
																																		objectMedicationStatement.resourceType = medicationStatement.resourceType;
																																		objectMedicationStatement.id = medicationStatement.id;
																																		objectMedicationStatement.identifier = medicationStatement.identifier;
																																		objectMedicationStatement.basedOn = medicationStatement.basedOn;
																																		var PartOf = {};
																																		PartOf.medicationAdministration = medicationStatement.partOf.medicationAdministration;
																																		PartOf.medicationDispense = medicationStatement.partOf.medicationDispense;
																																		PartOf.medicationStatement = medicationStatementPartOfMedicationStatement.data;
																																		objectMedicationStatement.partOf = PartOf;
																																		objectMedicationStatement.context = medicationStatement.context;
																																		objectMedicationStatement.status = medicationStatement.status;
																																		objectMedicationStatement.category = medicationStatement.category;
																																		objectMedicationStatement.medication = medicationStatement.medication;
																																		objectMedicationStatement.effective = medicationStatement.effective;
																																		objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																																		objectMedicationStatement.informationSource = medicationStatement.informationSource;
																																		objectMedicationStatement.subject = medicationStatement.subject;
																																		objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																																		objectMedicationStatement.taken = medicationStatement.taken;
																																		objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																																		objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

																																		newMedicationStatement[index] = objectMedicationStatement;

																																		myEmitter.once("getMedicationStatementPartOfProcedure", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																																			qString = {};
																																			qString.medication_statement_id = medicationStatement.id;
																																			seedPhoenixFHIR.path.GET = {
																																				"MedicationStatementPartOfProcedure" : {
																																					"location": "%(apikey)s/MedicationStatementPartOfProcedure",
																																					"query": qString
																																				}
																																			}
																																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																			ApiFHIR.get('MedicationStatementPartOfProcedure', {"apikey": apikey}, {}, function(error, response, body){
																																				medicationStatementPartOfProcedure = JSON.parse(body);
																																				if(medicationStatementPartOfProcedure.err_code == 0){
																																					var objectMedicationStatement = {};
																																					objectMedicationStatement.resourceType = medicationStatement.resourceType;
																																					objectMedicationStatement.id = medicationStatement.id;
																																					objectMedicationStatement.identifier = medicationStatement.identifier;
																																					objectMedicationStatement.basedOn = medicationStatement.basedOn;
																																					var PartOf = {};
																																					PartOf.medicationAdministration = medicationStatement.partOf.medicationAdministration;
																																					PartOf.medicationDispense = medicationStatement.partOf.medicationDispense;
																																					PartOf.medicationStatement = medicationStatement.partOf.medicationStatement;
																																					PartOf.procedure = medicationStatementPartOfProcedure.data;
																																					objectMedicationStatement.partOf = PartOf;
																																					objectMedicationStatement.context = medicationStatement.context;
																																					objectMedicationStatement.status = medicationStatement.status;
																																					objectMedicationStatement.category = medicationStatement.category;
																																					objectMedicationStatement.medication = medicationStatement.medication;
																																					objectMedicationStatement.effective = medicationStatement.effective;
																																					objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																																					objectMedicationStatement.informationSource = medicationStatement.informationSource;
																																					objectMedicationStatement.subject = medicationStatement.subject;
																																					objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																																					objectMedicationStatement.taken = medicationStatement.taken;
																																					objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																																					objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

																																					newMedicationStatement[index] = objectMedicationStatement;

																																					myEmitter.once("getMedicationStatementPartOfObservation", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																																						qString = {};
																																						qString.medication_statement_id = medicationStatement.id;
																																						seedPhoenixFHIR.path.GET = {
																																							"MedicationStatementPartOfObservation" : {
																																								"location": "%(apikey)s/MedicationStatementPartOfObservation",
																																								"query": qString
																																							}
																																						}
																																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																						ApiFHIR.get('MedicationStatementPartOfObservation', {"apikey": apikey}, {}, function(error, response, body){
																																							medicationStatementPartOfObservation = JSON.parse(body);
																																							if(medicationStatementPartOfObservation.err_code == 0){
																																								var objectMedicationStatement = {};
																																								objectMedicationStatement.resourceType = medicationStatement.resourceType;
																																								objectMedicationStatement.id = medicationStatement.id;
																																								objectMedicationStatement.identifier = medicationStatement.identifier;
																																								objectMedicationStatement.basedOn = medicationStatement.basedOn;
																																								var PartOf = {};
																																								PartOf.medicationAdministration = medicationStatement.partOf.medicationAdministration;
																																								PartOf.medicationDispense = medicationStatement.partOf.medicationDispense;
																																								PartOf.medicationStatement = medicationStatement.partOf.medicationStatement;
																																								PartOf.procedure = medicationStatement.partOf.procedure;
																																								PartOf.observation = medicationStatementPartOfObservation.data;
																																								objectMedicationStatement.partOf = PartOf;
																																								objectMedicationStatement.context = medicationStatement.context;
																																								objectMedicationStatement.status = medicationStatement.status;
																																								objectMedicationStatement.category = medicationStatement.category;
																																								objectMedicationStatement.medication = medicationStatement.medication;
																																								objectMedicationStatement.effective = medicationStatement.effective;
																																								objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																																								objectMedicationStatement.informationSource = medicationStatement.informationSource;
																																								objectMedicationStatement.subject = medicationStatement.subject;
																																								objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																																								objectMedicationStatement.taken = medicationStatement.taken;
																																								objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																																								objectMedicationStatement.reasonCode = medicationStatement.reasonCode;

																																								newMedicationStatement[index] = objectMedicationStatement;

																																								myEmitter.once("getMedicationStatementReasonReferenceCondition", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																																									qString = {};
																																									qString.medication_statement_id = medicationStatement.id;
																																									seedPhoenixFHIR.path.GET = {
																																										"MedicationStatementReasonReferenceCondition" : {
																																											"location": "%(apikey)s/MedicationStatementReasonReferenceCondition",
																																											"query": qString
																																										}
																																									}
																																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																									ApiFHIR.get('MedicationStatementReasonReferenceCondition', {"apikey": apikey}, {}, function(error, response, body){
																																										medicationStatementReasonReferenceCondition = JSON.parse(body);
																																										if(medicationStatementReasonReferenceCondition.err_code == 0){
																																											var objectMedicationStatement = {};
																																											objectMedicationStatement.resourceType = medicationStatement.resourceType;
																																											objectMedicationStatement.id = medicationStatement.id;
																																											objectMedicationStatement.identifier = medicationStatement.identifier;
																																											objectMedicationStatement.basedOn = medicationStatement.basedOn;
																																											objectMedicationStatement.partOf = medicationStatement.partOf;
																																											objectMedicationStatement.context = medicationStatement.context;
																																											objectMedicationStatement.status = medicationStatement.status;
																																											objectMedicationStatement.category = medicationStatement.category;
																																											objectMedicationStatement.medication = medicationStatement.medication;
																																											objectMedicationStatement.effective = medicationStatement.effective;
																																											objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																																											objectMedicationStatement.informationSource = medicationStatement.informationSource;
																																											objectMedicationStatement.subject = medicationStatement.subject;
																																											objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																																											objectMedicationStatement.taken = medicationStatement.taken;
																																											objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																																											objectMedicationStatement.reasonCode = medicationStatement.reasonCode;
																																											var ReasonReference = {};
																																											ReasonReference.condition = medicationStatementReasonReferenceCondition.data;
																																											objectMedicationStatement.reasonReference = ReasonReference;

																																											newMedicationStatement[index] = objectMedicationStatement;

																																											myEmitter.once("getMedicationStatementReasonReferenceObservation", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																																												qString = {};
																																												qString.medication_statement_id = medicationStatement.id;
																																												seedPhoenixFHIR.path.GET = {
																																													"MedicationStatementReasonReferenceObservation" : {
																																														"location": "%(apikey)s/MedicationStatementReasonReferenceObservation",
																																														"query": qString
																																													}
																																												}
																																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																												ApiFHIR.get('MedicationStatementReasonReferenceObservation', {"apikey": apikey}, {}, function(error, response, body){
																																													medicationStatementReasonReferenceObservation = JSON.parse(body);
																																													if(medicationStatementReasonReferenceObservation.err_code == 0){
																																														var objectMedicationStatement = {};
																																														objectMedicationStatement.resourceType = medicationStatement.resourceType;
																																														objectMedicationStatement.id = medicationStatement.id;
																																														objectMedicationStatement.identifier = medicationStatement.identifier;
																																														objectMedicationStatement.basedOn = medicationStatement.basedOn;
																																														objectMedicationStatement.partOf = medicationStatement.partOf;
																																														objectMedicationStatement.context = medicationStatement.context;
																																														objectMedicationStatement.status = medicationStatement.status;
																																														objectMedicationStatement.category = medicationStatement.category;
																																														objectMedicationStatement.medication = medicationStatement.medication;
																																														objectMedicationStatement.effective = medicationStatement.effective;
																																														objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																																														objectMedicationStatement.informationSource = medicationStatement.informationSource;
																																														objectMedicationStatement.subject = medicationStatement.subject;
																																														objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																																														objectMedicationStatement.taken = medicationStatement.taken;
																																														objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																																														objectMedicationStatement.reasonCode = medicationStatement.reasonCode;
																																														var ReasonReference = {};
																																														ReasonReference.condition = medicationStatement.reasonReference.condition;
																																														ReasonReference.observation = medicationStatementReasonReferenceObservation.data;
																																														objectMedicationStatement.reasonReference = ReasonReference;

																																														newMedicationStatement[index] = objectMedicationStatement;

																																														myEmitter.once("getNote", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																																															qString = {};
																																															qString.medication_statement_id = medicationStatement.id;
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
																																																	var objectMedicationStatement = {};
																																																	objectMedicationStatement.resourceType = medicationStatement.resourceType;
																																																	objectMedicationStatement.id = medicationStatement.id;
																																																	objectMedicationStatement.identifier = medicationStatement.identifier;
																																																	objectMedicationStatement.basedOn = medicationStatement.basedOn;
																																																	objectMedicationStatement.partOf = medicationStatement.partOf;
																																																	objectMedicationStatement.context = medicationStatement.context;
																																																	objectMedicationStatement.status = medicationStatement.status;
																																																	objectMedicationStatement.category = medicationStatement.category;
																																																	objectMedicationStatement.medication = medicationStatement.medication;
																																																	objectMedicationStatement.effective = medicationStatement.effective;
																																																	objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																																																	objectMedicationStatement.informationSource = medicationStatement.informationSource;
																																																	objectMedicationStatement.subject = medicationStatement.subject;
																																																	objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																																																	objectMedicationStatement.taken = medicationStatement.taken;
																																																	objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																																																	objectMedicationStatement.reasonCode = medicationStatement.reasonCode;
																																																	objectMedicationStatement.reasonReference = medicationStatement.reasonReference;
																																																	objectMedicationStatement.note = annotation.data;

																																																	newMedicationStatement[index] = objectMedicationStatement;

																																																	myEmitter.once("getDosage", function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
																																																		qString = {};
																																																		qString.medication_statement_id = medicationStatement.id;
																																																		seedPhoenixFHIR.path.GET = {
																																																			"Dosage" : {
																																																				"location": "%(apikey)s/Dosage",
																																																				"query": qString
																																																			}
																																																		}
																																																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																																		ApiFHIR.get('Dosage', {"apikey": apikey}, {}, function(error, response, body){
																																																			dosage = JSON.parse(body);
																																																			if(dosage.err_code == 0){
																																																				var objectMedicationStatement = {};
																																																				objectMedicationStatement.resourceType = medicationStatement.resourceType;
																																																				objectMedicationStatement.id = medicationStatement.id;
																																																				objectMedicationStatement.identifier = medicationStatement.identifier;
																																																				objectMedicationStatement.basedOn = medicationStatement.basedOn;
																																																				objectMedicationStatement.partOf = medicationStatement.partOf;
																																																				objectMedicationStatement.context = medicationStatement.context;
																																																				objectMedicationStatement.status = medicationStatement.status;
																																																				objectMedicationStatement.category = medicationStatement.category;
																																																				objectMedicationStatement.medication = medicationStatement.medication;
																																																				objectMedicationStatement.effective = medicationStatement.effective;
																																																				objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																																																				objectMedicationStatement.informationSource = medicationStatement.informationSource;
																																																				objectMedicationStatement.subject = medicationStatement.subject;
																																																				objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																																																				objectMedicationStatement.taken = medicationStatement.taken;
																																																				objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																																																				objectMedicationStatement.reasonCode = medicationStatement.reasonCode;
																																																				objectMedicationStatement.reasonReference = medicationStatement.reasonReference;
																																																				objectMedicationStatement.note = medicationStatement.note;
																																																				objectMedicationStatement.dosage = dosage.data;

																																																				newMedicationStatement[index] = objectMedicationStatement;

																																																				if(index == countMedicationStatement -1 ){
																																																					res.json({"err_code": 0, "data":newMedicationStatement});				
																																																				}
																																																			}else{
																																																				res.json(dosage);
																																																			}
																																																		})
																																																	})
																																																	myEmitter.emit("getDosage", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																																																}else{
																																																	res.json(annotation);
																																																}
																																															})
																																														})
																																														myEmitter.emit("getNote", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																																													}else{
																																														res.json(medicationStatementReasonReferenceObservation);
																																													}
																																												})
																																											})
																																											myEmitter.emit("getMedicationStatementReasonReferenceObservation", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																																										}else{
																																											res.json(medicationStatementReasonReferenceCondition);
																																										}
																																									})
																																								})
																																								myEmitter.emit("getMedicationStatementReasonReferenceCondition", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																																							}else{
																																								res.json(medicationStatementPartOfObservation);
																																							}
																																						})
																																					})
																																					myEmitter.emit("getMedicationStatementPartOfObservation", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																																				}else{
																																					res.json(medicationStatementPartOfProcedure);
																																				}
																																			})
																																		})
																																		myEmitter.emit("getMedicationStatementPartOfProcedure", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																																	}else{
																																		res.json(medicationStatementPartOfMedicationStatement);
																																	}
																																})
																															})
																															myEmitter.emit("getMedicationStatementPartOfMedicationStatement", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																														}else{
																															res.json(medicationStatementPartOfMedicationDispense);
																														}
																													})
																												})
																												myEmitter.emit("getMedicationStatementPartOfMedicationDispense", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																											}else{
																												res.json(medicationStatementPartOfMedicationAdministration);
																											}
																										})
																									})
																									myEmitter.emit("getMedicationStatementPartOfMedicationAdministration", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																								}else{
																									res.json(medicationStatementBasedOnMedicationRequest);
																								}
																							})
																						})
																						myEmitter.emit("getMedicationStatementBasedOnMedicationRequest", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																					}else{
																						res.json(medicationStatementBasedOnReferralRequest);
																					}
																				})
																			})
																			myEmitter.emit("getMedicationStatementBasedOnReferralRequest", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
																		}else{
																			res.json(medicationStatementBasedOnProcedureRequest);
																		}
																	})
																})
																myEmitter.emit("getMedicationStatementBasedOnProcedureRequest", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
															}else{
																res.json(medicationStatementBasedOnCarePlan);
															}
														})
													})
													myEmitter.emit("getMedicationStatementBasedOnCarePlan", objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", medicationStatement.data[i], i, newMedicationStatement, medicationStatement.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Medication Statement is empty."});	
								}
							}else{
								res.json(medicationStatement);
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
					var medicationStatementId = req.params.medication_statement_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + medicationStatementId, 'MEDICATION_STATEMENT', function(resMedicationStatementID){
								if(resMedicationStatementID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.medication_statement_id = medicationStatementId;
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
						  			qString.medication_statement_id = medicationStatementId;
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
									res.json({"err_code": 501, "err_msg": "Medication Statement Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		/*timing : function getTiming(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var timingId = req.query._id;
			var activityDetail = req.query.activityDetailId;
			var dosage = req.query.dosageId;
			var procedureRequest = req.query.procedureRequestId;
			
			if(typeof timingId !== 'undefined'){
				if(!validator.isEmpty(timingId)){
					qString._id = timingId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Timing Id is required."});
				}
			}
			
			if(typeof activityDetail !== 'undefined'){
				if(!validator.isEmpty(activityDetail)){
					qString.activityDetail = activityDetail; 
				}else{
					res.json({"err_code": 1, "err_msg": "activity detail is empty."});
				}
			}

			if(typeof dosage !== 'undefined'){
				if(!validator.isEmpty(dosage)){
					qString.dosage = dosage; 
				}else{
					res.json({"err_code": 1, "err_msg": "dosage is empty."});
				}
			}

			if(typeof procedureRequest !== 'undefined'){
				if(!validator.isEmpty(procedureRequest)){
					qString.procedureRequest = procedureRequest; 
				}else{
					res.json({"err_code": 1, "err_msg": "procedure request is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"Timing" : {
					"location": "%(apikey)s/Timing",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Timing', {"apikey": apikey}, {}, function (error, response, body) {
						timing = JSON.parse(body);
						if(timing.err_code == 0){
							res.json({"err_code": 0, "data":timing.data});	
						}else{
							res.json(timing);
						}
					});
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		},*/
		/*dosage : function getDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var dosageId = req.query._id;
			var medication_statement_id = req.query.medicationStatementId;
			var medication_dispense_id = req.query.medicationDispenseId;
			var medication_request_id = req.query.medicationRequestId;
			
			if(typeof dosageId !== 'undefined'){
				if(!validator.isEmpty(dosageId)){
					qString._id = dosageId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Dosage Id is required."});
				}
			}
			
			if(typeof medication_statement_id !== 'undefined'){
				if(!validator.isEmpty(medication_statement_id)){
					qString.medication_statement_id = medication_statement_id; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication statement id is empty."});
				}
			}

			if(typeof medication_dispense_id !== 'undefined'){
				if(!validator.isEmpty(medication_dispense_id)){
					qString.medication_dispense_id = medication_dispense_id; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication dispense id is empty."});
				}
			}

			if(typeof medication_request_id !== 'undefined'){
				if(!validator.isEmpty(medication_request_id)){
					qString.medication_request_id = medication_request_id; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication request id is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"Dosage" : {
					"location": "%(apikey)s/Dosage",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Dosage', {"apikey": apikey}, {}, function (error, response, body) {
						dosage = JSON.parse(body);
						if(dosage.err_code == 0){
							res.json({"err_code": 0, "data":dosage.data});	
						}else{
							res.json(dosage);
						}
					});
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		},*/
		medicationStatementDosage: function getMedicationStatementDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationStatementId = req.params.medication_statement_id;
			var medicationStatementDosageId = req.params.dosage_id;
			console.log("12345");
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + medicationStatementId, 'MEDICATION_STATEMENT', function(resPatientID){
						if(resPatientID.err_code > 0){
							if(typeof medicationStatementDosageId !== 'undefined' && !validator.isEmpty(medicationStatementDosageId)){
								console.log("1");
								checkUniqeValue(apikey, "DOSAGE_ID|" + medicationStatementDosageId, 'DOSAGE', function(resMedicationStatementDosageID){
									if(resMedicationStatementDosageID.err_code > 0){
										//get medicationStatementDosage
										qString = {};
										qString.medication_statement_id = medicationStatementId;
										qString._id = medicationStatementDosageId;
										seedPhoenixFHIR.path.GET = {
											"MedicationStatementDosage" : {
												"location": "%(apikey)s/Dosage",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('MedicationStatementDosage', {"apikey": apikey}, {}, function(error, response, body){
											medicationStatementDosage = JSON.parse(body);
											console.log(medicationStatementDosage);
											if(medicationStatementDosage.err_code == 0){
														//res.json({"err_code": 0, "data":medicationStatementDosage.data});
														if(medicationStatementDosage.data.length > 0){
															newMedicationStatementDosage = [];
															for(i=0; i < medicationStatementDosage.data.length; i++){
																myEmitter.once('getTiming', function(medicationStatementDosage, index, newMedicationStatementDosage, countImmunizationRecommendation){
																	qString = {};
																	qString.recommendation_id = medicationStatementDosage.id;
																	seedPhoenixFHIR.path.GET = {
																		"Timing" : {
																			"location": "%(apikey)s/Timing",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('Timing', {"apikey": apikey}, {}, function(error, response, body){
																		medicationStatementDosageTiming = JSON.parse(body);
																		if(medicationStatementDosageTiming.err_code == 0){
																			var objectMedicationStatementDosage = {};
																			objectMedicationStatementDosage.id = medicationStatementDosage.id;
																			objectMedicationStatementDosage.sequence = medicationStatementDosage.sequence;
																			objectMedicationStatementDosage.text = medicationStatementDosage.text;
																			objectMedicationStatementDosage.additionalInstruction = medicationStatementDosage.additionalInstruction;
																			objectMedicationStatementDosage.patientInstruction = medicationStatementDosage.patientInstruction;
																			objectMedicationStatementDosage.timing = medicationStatementDosageTiming.data;
																			objectMedicationStatementDosage.asNeeded = medicationStatementDosage.asNeeded;
																			objectMedicationStatementDosage.site = medicationStatementDosage.site;
																			objectMedicationStatementDosage.route = medicationStatementDosage.route;
																			objectMedicationStatementDosage.method = medicationStatementDosage.method;
																			objectMedicationStatementDosage.dose = medicationStatementDosage.dose;
																			objectMedicationStatementDosage.maxDosePerPeriod = medicationStatementDosage.maxDosePerPeriod;
																			objectMedicationStatementDosage.maxDosePerAdministration = medicationStatementDosage.maxDosePerAdministration;
																			objectMedicationStatementDosage.maxDoseLerLifetime = medicationStatementDosage.maxDoseLerLifetime;
																			objectMedicationStatementDosage.rate = medicationStatementDosage.rate;

																			newMedicationStatementDosage[index] = objectMedicationStatementDosage;
																			if(index == countImmunizationRecommendation -1 ){
																				res.json({"err_code": 0, "data":newMedicationStatementDosage});	
																			}
																		}else{
																			res.json(medicationStatementDosageTiming);			
																		}
																	})
																})
																myEmitter.emit('getTiming', medicationStatementDosage.data[i], i, newMedicationStatementDosage, medicationStatementDosage.data.length);
															}
															//res.json({"err_code": 0, "data":organization.data});
														}else{
															res.json({"err_code": 2, "err_msg": "Medication Statement is empty."});	
														}
													/*-------------*/
													}else{
														res.json(medicationStatementDosage);
													}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Medication Statement Recommendation Id not found"});		
									}
								})
							}else{
								console.log("2");
								//get medicationStatementDosage
								qString = {};
								qString.medication_statement_id = medicationStatementId;
								seedPhoenixFHIR.path.GET = {
									"MedicationStatementDosage" : {
										"location": "%(apikey)s/Dosage",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('MedicationStatementDosage', {"apikey": apikey}, {}, function(error, response, body){
									medicationStatementDosage = JSON.parse(body);
									console.log(medicationStatementDosage);
									if(medicationStatementDosage.err_code == 0){
												//res.json({"err_code": 0, "data":medicationStatementDosage.data});
												if(medicationStatementDosage.data.length > 0){
													newMedicationStatementDosage = [];
													for(i=0; i < medicationStatementDosage.data.length; i++){
														myEmitter.once('getTiming', function(medicationStatementDosage, index, newMedicationStatementDosage, countImmunizationRecommendation){
															qString = {};
															qString.recommendation_id = medicationStatementDosage.id;
															seedPhoenixFHIR.path.GET = {
																"Timing" : {
																	"location": "%(apikey)s/Timing",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('Timing', {"apikey": apikey}, {}, function(error, response, body){
																medicationStatementDosageTiming = JSON.parse(body);
																if(medicationStatementDosageTiming.err_code == 0){
																	var objectMedicationStatementDosage = {};
																	objectMedicationStatementDosage.id = medicationStatementDosage.id;
																	objectMedicationStatementDosage.sequence = medicationStatementDosage.sequence;
																	objectMedicationStatementDosage.text = medicationStatementDosage.text;
																	objectMedicationStatementDosage.additionalInstruction = medicationStatementDosage.additionalInstruction;
																	objectMedicationStatementDosage.patientInstruction = medicationStatementDosage.patientInstruction;
																	objectMedicationStatementDosage.timing = medicationStatementDosageTiming.data;
																	objectMedicationStatementDosage.asNeeded = medicationStatementDosage.asNeeded;
																	objectMedicationStatementDosage.site = medicationStatementDosage.site;
																	objectMedicationStatementDosage.route = medicationStatementDosage.route;
																	objectMedicationStatementDosage.method = medicationStatementDosage.method;
																	objectMedicationStatementDosage.dose = medicationStatementDosage.dose;
																	objectMedicationStatementDosage.maxDosePerPeriod = medicationStatementDosage.maxDosePerPeriod;
																	objectMedicationStatementDosage.maxDosePerAdministration = medicationStatementDosage.maxDosePerAdministration;
																	objectMedicationStatementDosage.maxDoseLerLifetime = medicationStatementDosage.maxDoseLerLifetime;
																	objectMedicationStatementDosage.rate = medicationStatementDosage.rate;
																	
																	newMedicationStatementDosage[index] = objectMedicationStatementDosage;
																	if(index == countImmunizationRecommendation -1 ){
																		res.json({"err_code": 0, "data":newMedicationStatementDosage});	
																	}
																}else{
																	res.json(medicationStatementDosageTiming);			
																}
															})
														})
														myEmitter.emit('getTiming', medicationStatementDosage.data[i], i, newMedicationStatementDosage, medicationStatementDosage.data.length);
													}
													//res.json({"err_code": 0, "data":organization.data});
												}else{
													res.json({"err_code": 2, "err_msg": "Medication Statement is empty."});	
												}
											/*-------------*/
											}else{
												res.json(medicationStatementDosage);
											}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Medication Statement Id not found"});		
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
		medicationStatement : function addMedicationStatement(req, res){
			console.log(req.body);
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
basedOn.medicationRequest|basedOnMedicationRequest||
basedOn.carePlan|basedOnCarePlan||
basedOn.procedureRequest|basedOnProcedureRequest||
basedOn.referralRequest|basedOnReferralRequest||
partOf.medicationAdministration|partOfMedicationAdministration||
partOf.medicationDispense|partOfMedicationDispense||
partOf.medicationStatement|partOfMedicationStatement||
partOf.procedure|partOfProcedure||
partOf.observation|partOfObservation||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
status|status||nn
category|category||
medication.medicationCodeableConcept|medicationMedicationCodeableConcept||nn
medication.medicationReference|medicationMedicationReference||
effective.effectiveDateTime|effectiveEffectiveDateTime|date|
effective.effectivePeriod|effectiveEffectivePeriod|period|
dateAsserted|dateAsserted|date|
informationSource.patient|informationSourcePatient||
informationSource.practitioner|informationSourcePractitioner||
informationSource.relatedPerson|informationSourceRelatedPerson||
informationSource.organization|informationSourceOrganization||
subject.patient|subjectPatient||
subject.group|subjectGroup||
derivedFrom|derivedFrom||
taken|taken||nn
reasonNotTaken|reasonNotTaken||
reasonCode|reasonCode||
reasonReference.condition|reasonReferenceCondition||
reasonReference.observation|reasonReferenceObservation||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||
dosage|dosage||
*/
			if(typeof req.body.basedOn.medicationRequest !== 'undefined'){
				var basedOnMedicationRequest =  req.body.basedOn.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnMedicationRequest)){
					basedOnMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on medication request' in json Medication Statement request.";
			}

			if(typeof req.body.basedOn.carePlan !== 'undefined'){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					basedOnCarePlan = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on care plan' in json Medication Statement request.";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined'){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					basedOnProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on procedure request' in json Medication Statement request.";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined'){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					basedOnReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on referral request' in json Medication Statement request.";
			}

			if(typeof req.body.partOf.medicationAdministration !== 'undefined'){
				var partOfMedicationAdministration =  req.body.partOf.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationAdministration)){
					partOfMedicationAdministration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of medication administration' in json Medication Statement request.";
			}

			if(typeof req.body.partOf.medicationDispense !== 'undefined'){
				var partOfMedicationDispense =  req.body.partOf.medicationDispense.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationDispense)){
					partOfMedicationDispense = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of medication dispense' in json Medication Statement request.";
			}

			if(typeof req.body.partOf.medicationStatement !== 'undefined'){
				var partOfMedicationStatement =  req.body.partOf.medicationStatement.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationStatement)){
					partOfMedicationStatement = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of medication statement' in json Medication Statement request.";
			}

			if(typeof req.body.partOf.procedure !== 'undefined'){
				var partOfProcedure =  req.body.partOf.procedure.trim().toLowerCase();
				if(validator.isEmpty(partOfProcedure)){
					partOfProcedure = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of procedure' in json Medication Statement request.";
			}

			if(typeof req.body.partOf.observation !== 'undefined'){
				var partOfObservation =  req.body.partOf.observation.trim().toLowerCase();
				if(validator.isEmpty(partOfObservation)){
					partOfObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of observation' in json Medication Statement request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Medication Statement request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Medication Statement request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Medication Statement status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication Statement request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Medication Statement request.";
			}

			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined'){
				var medicationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "Medication Statement medication medication codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication medication codeable concept' in json Medication Statement request.";
			}

			if(typeof req.body.medication.medicationReference !== 'undefined'){
				var medicationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationReference)){
					medicationMedicationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication medication reference' in json Medication Statement request.";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined'){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					effectiveEffectiveDateTime = "";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "Medication Statement effective effective date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'effective effective date time' in json Medication Statement request.";
			}

			if (typeof req.body.effective.effectivePeriod !== 'undefined') {
			  var effectiveEffectivePeriod = req.body.effective.effectivePeriod;
 				if(validator.isEmpty(effectiveEffectivePeriod)) {
				  var effectiveEffectivePeriodStart = "";
				  var effectiveEffectivePeriodEnd = "";
				} else {
				  if (effectiveEffectivePeriod.indexOf("to") > 0) {
				    arrEffectiveEffectivePeriod = effectiveEffectivePeriod.split("to");
				    var effectiveEffectivePeriodStart = arrEffectiveEffectivePeriod[0];
				    var effectiveEffectivePeriodEnd = arrEffectiveEffectivePeriod[1];
				    if (!regex.test(effectiveEffectivePeriodStart) && !regex.test(effectiveEffectivePeriodEnd)) {
				      err_code = 2;
				      err_msg = "Medication Statement effective effective period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Medication Statement effective effective period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'effective effective period' in json Medication Statement request.";
			}

			if(typeof req.body.dateAsserted !== 'undefined'){
				var dateAsserted =  req.body.dateAsserted;
				if(validator.isEmpty(dateAsserted)){
					dateAsserted = "";
				}else{
					if(!regex.test(dateAsserted)){
						err_code = 2;
						err_msg = "Medication Statement date asserted invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date asserted' in json Medication Statement request.";
			}

			if(typeof req.body.informationSource.patient !== 'undefined'){
				var informationSourcePatient =  req.body.informationSource.patient.trim().toLowerCase();
				if(validator.isEmpty(informationSourcePatient)){
					informationSourcePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information source patient' in json Medication Statement request.";
			}

			if(typeof req.body.informationSource.practitioner !== 'undefined'){
				var informationSourcePractitioner =  req.body.informationSource.practitioner.trim().toLowerCase();
				if(validator.isEmpty(informationSourcePractitioner)){
					informationSourcePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information source practitioner' in json Medication Statement request.";
			}

			if(typeof req.body.informationSource.relatedPerson !== 'undefined'){
				var informationSourceRelatedPerson =  req.body.informationSource.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(informationSourceRelatedPerson)){
					informationSourceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information source related person' in json Medication Statement request.";
			}

			if(typeof req.body.informationSource.organization !== 'undefined'){
				var informationSourceOrganization =  req.body.informationSource.organization.trim().toLowerCase();
				if(validator.isEmpty(informationSourceOrganization)){
					informationSourceOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information source organization' in json Medication Statement request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Medication Statement request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Medication Statement request.";
			}

			if(typeof req.body.derivedFrom !== 'undefined'){
				var derivedFrom =  req.body.derivedFrom.trim().toLowerCase();
				if(validator.isEmpty(derivedFrom)){
					derivedFrom = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'derived from' in json Medication Statement request.";
			}

			if(typeof req.body.taken !== 'undefined'){
				var taken =  req.body.taken.trim().toLowerCase();
				if(validator.isEmpty(taken)){
					err_code = 2;
					err_msg = "Medication Statement taken is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'taken' in json Medication Statement request.";
			}

			if(typeof req.body.reasonNotTaken !== 'undefined'){
				var reasonNotTaken =  req.body.reasonNotTaken.trim().toLowerCase();
				if(validator.isEmpty(reasonNotTaken)){
					reasonNotTaken = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason not taken' in json Medication Statement request.";
			}

			if(typeof req.body.reasonCode !== 'undefined'){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					reasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Medication Statement request.";
			}

			if(typeof req.body.reasonReference.condition !== 'undefined'){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					reasonReferenceCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference condition' in json Medication Statement request.";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined'){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					reasonReferenceObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference observation' in json Medication Statement request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Medication Statement request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Medication Statement request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Medication Statement request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Medication Statement request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Medication Statement note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Medication Statement request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Medication Statement request.";
			}
			
			if(typeof req.body.dosage !== 'undefined'){
				var dosage =  req.body.dosage.trim().toLowerCase();
				if(validator.isEmpty(dosage)){
					dosage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage' in json Medication Statement request.";
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
														var medicationStatementId = 'mst' + unicId;
														var AnnotationId = 'ann' + unicId;

														dataMedicationStatement = {
															"medication_statement_id" : medicationStatementId,
															"part_of" : partOfMedicationStatement,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"status" : status,
															"category" : category,
															"medication_codeable_concept" : medicationMedicationCodeableConcept,
															"medication_reference" : medicationMedicationReference,
															"effective_date_time" : effectiveEffectiveDateTime,
															"effective_period_start" : effectiveEffectivePeriodStart,
															"effective_period_end" : effectiveEffectivePeriodEnd,
															"date_asserted" : dateAsserted,
															"information_source_patient" : informationSourcePatient,
															"information_source_practitioner" : informationSourcePractitioner,
															"information_source_related_person" : informationSourceRelatedPerson,
															"information_source_organization" : informationSourceOrganization,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"derived_from" : derivedFrom,
															"taken" : taken,
															"reason_not_taken" : reasonNotTaken,
															"reason_code" : reasonCode
														}
														console.log(dataMedicationStatement);
														ApiFHIR.post('medicationStatement', {"apikey": apikey}, {body: dataMedicationStatement, json: true}, function(error, response, body){
															medicationStatement = body;
															if(medicationStatement.err_code > 0){
																res.json(medicationStatement);	
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
																							"medication_statement_id": medicationStatementId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														dataAnnotation = {
															"id" : AnnotationId,
															"author_ref_practitioner" : noteAuthorPractitioner,
															"author_ref_patient" : noteAuthorPatient,
															"author_ref_relatedPerson" : noteAuthorRelatedPerson,
															"author_string" : noteAuthorAuthorString,
															"time" : noteTime,
															"text" : noteText,
															"medication_statement_id": medicationStatementId
														}
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataAnnotation, json: true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
																console.log("ok");
															}
														});
														
														if(basedOnMedicationRequest !== ""){
															dataBasedOnMedicationRequest = {
																"_id" : basedOnMedicationRequest,
																"medication_statement_id": medicationStatementId
															}
															ApiFHIR.put('medicationRequest', {"apikey": apikey, "_id": basedOnMedicationRequest}, {body: dataBasedOnMedicationRequest, json: true}, function(error, response, body){
																returnBasedOnMedicationRequest = body;
																if(returnBasedOnMedicationRequest.err_code > 0){
																	res.json(returnBasedOnMedicationRequest);	
																	console.log("add reference based on medication request : " + basedOnMedicationRequest);
																}
															});
														}
														
														if(basedOnCarePlan !== ""){
															dataBasedOnCarePlan = {
																"_id" : basedOnCarePlan,
																"medication_statement_id": medicationStatementId
															}
															ApiFHIR.put('carePlan', {"apikey": apikey, "_id": basedOnCarePlan}, {body: dataBasedOnCarePlan, json: true}, function(error, response, body){
																returnBasedOnCarePlan = body;
																if(returnBasedOnCarePlan.err_code > 0){
																	res.json(returnBasedOnCarePlan);	
																	console.log("add reference based on care plan : " + basedOnCarePlan);
																}
															});
														}
														
														if(basedOnProcedureRequest !== ""){
															dataBasedOnProcedureRequest = {
																"_id" : basedOnProcedureRequest,
																"medication_statement_id": medicationStatementId
															}
															ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": basedOnProcedureRequest}, {body: dataBasedOnProcedureRequest, json: true}, function(error, response, body){
																returnBasedOnProcedureRequest = body;
																if(returnBasedOnProcedureRequest.err_code > 0){
																	res.json(returnBasedOnProcedureRequest);	
																	console.log("add reference based on procedure request : " + basedOnProcedureRequest);
																}
															});
														}
														
														if(basedOnReferralRequest !== ""){
															dataBasedOnReferralRequest = {
																"_id" : basedOnReferralRequest,
																"medication_statement_id": medicationStatementId
															}
															ApiFHIR.put('referralRequest', {"apikey": apikey, "_id": basedOnReferralRequest}, {body: dataBasedOnReferralRequest, json: true}, function(error, response, body){
																returnBasedOnReferralRequest = body;
																if(returnBasedOnReferralRequest.err_code > 0){
																	res.json(returnBasedOnReferralRequest);	
																	console.log("add reference based on referral request : " + basedOnReferralRequest);
																}
															});
														}
														
														if(partOfMedicationAdministration !== ""){
															dataPartOfMedicationAdministration = {
																"_id" : partOfMedicationAdministration,
																"medication_statement_id": medicationStatementId
															}
															ApiFHIR.put('medicationAdministration', {"apikey": apikey, "_id": partOfMedicationAdministration}, {body: dataPartOfMedicationAdministration, json: true}, function(error, response, body){
																returnPartOfMedicationAdministration = body;
																if(returnPartOfMedicationAdministration.err_code > 0){
																	res.json(returnPartOfMedicationAdministration);	
																	console.log("add reference part of medication administration : " + partOfMedicationAdministration);
																}
															});
														}
														
														if(partOfMedicationDispense !== ""){
															dataPartOfMedicationDispense = {
																"_id" : partOfMedicationDispense,
																"medication_statement_id": medicationStatementId
															}
															ApiFHIR.put('medicationDispense', {"apikey": apikey, "_id": partOfMedicationDispense}, {body: dataPartOfMedicationDispense, json: true}, function(error, response, body){
																returnPartOfMedicationDispense = body;
																if(returnPartOfMedicationDispense.err_code > 0){
																	res.json(returnPartOfMedicationDispense);	
																	console.log("add reference part of medication dispense : " + partOfMedicationDispense);
																}
															});
														}
														
														if(partOfProcedure !== ""){
															dataPartOfProcedure = {
																"_id" : partOfProcedure,
																"medication_statement_id": medicationStatementId
															}
															ApiFHIR.put('procedure', {"apikey": apikey, "_id": partOfProcedure}, {body: dataPartOfProcedure, json: true}, function(error, response, body){
																returnPartOfProcedure = body;
																if(returnPartOfProcedure.err_code > 0){
																	res.json(returnPartOfProcedure);	
																	console.log("add reference part of procedure : " + partOfProcedure);
																}
															});
														}
														
														if(partOfObservation !== ""){
															dataPartOfObservation = {
																"_id" : partOfObservation,
																"medication_statement_part_of_id": medicationStatementId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": dataPartOfObservation}, {body: dataPartOfObservation, json: true}, function(error, response, body){
																returnPartOfObservation = body;
																if(returnPartOfObservation.err_code > 0){
																	res.json(returnPartOfObservation);	
																	console.log("add reference part of observation : " + partOfObservation);
																}
															});
														}
														
														if(reasonReferenceObservation !== ""){
															dataReasonReferenceObservation = {
																"_id" : reasonReferenceObservation,
																"medication_statement_reason_reference_id": medicationStatementId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": reasonReferenceObservation}, {body: dataReasonReferenceObservation, json: true}, function(error, response, body){
																returnReasonReferenceObservation = body;
																if(returnReasonReferenceObservation.err_code > 0){
																	res.json(returnReasonReferenceObservation);	
																	console.log("add reference reason reference observation : " + reasonReferenceObservation);
																}
															});
														}
														
														if(reasonReferenceCondition !== ""){
															dataReasonReferenceCondition = {
																"_id" : reasonReferenceCondition,
																"medication_statement_id": medicationStatementId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": reasonReferenceCondition}, {body: dataReasonReferenceCondition, json: true}, function(error, response, body){
																returnReasonReferenceCondition = body;
																if(returnReasonReferenceCondition.err_code > 0){
																	res.json(returnReasonReferenceCondition);	
																	console.log("add reference reason reference condition : " + reasonReferenceCondition);
																}
															});
														}
														
														if(dosage !== ""){
															dataReasonReferenceCondition = {
																"dosage_id" : dosage,
																"medication_statement_id": medicationStatementId
															}
															ApiFHIR.put('dosage', {"apikey": apikey, "_id": dosage}, {body: dataReasonReferenceCondition, json: true}, function(error, response, body){
																returnReasonReferenceCondition = body;
																if(returnReasonReferenceCondition.err_code > 0){
																	res.json(returnReasonReferenceCondition);	
																	console.log("add reference dosage : " + dosage);
																}
															});
														}
														
														res.json({"err_code": 0, "err_msg": "Medication Statement has been add.", "data": [{"_id": medicationStatementId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});
										//cek code
										/*
										status|medication_statement_status
										category|medication_statement_category
										medicationMedicationCodeableConcept|medication_codes
										taken|medication_statement_taken
										reasonNotTaken|reason_medication_not_taken_codes
										reasonCode|condition_code
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'MEDICATION_STATEMENT_STATUS', function (resStatusCode) {
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
												checkCode(apikey, category, 'MEDICATION_STATEMENT_CATEGORY', function (resCategoryCode) {
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

										myEmitter.prependOnceListener('checkTaken', function () {
											if (!validator.isEmpty(taken)) {
												checkCode(apikey, taken, 'MEDICATION_STATEMENT_TAKEN', function (resTakenCode) {
													if (resTakenCode.err_code > 0) {
														myEmitter.emit('checkMedicationMedicationCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Taken code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMedicationMedicationCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkReasonNotTaken', function () {
											if (!validator.isEmpty(reasonNotTaken)) {
												checkCode(apikey, reasonNotTaken, 'REASON_MEDICATION_NOT_TAKEN_CODES', function (resReasonNotTakenCode) {
													if (resReasonNotTakenCode.err_code > 0) {
														myEmitter.emit('checkTaken');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason not taken code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkTaken');
											}
										})

										myEmitter.prependOnceListener('checkReasonCode', function () {
											if (!validator.isEmpty(reasonCode)) {
												checkCode(apikey, reasonCode, 'CONDITION_CODE', function (resReasonCodeCode) {
													if (resReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkReasonNotTaken');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonNotTaken');
											}
										})

										/*---------------------------*/
										/*check value*/
/*
dosage|dosage
basedOnMedicationRequest|Medication_Request
basedOnCarePlan|CarePlan
basedOnProcedureRequest|Procedure_Request
basedOnReferralRequest|Referral_Request
partOfMedicationAdministration|Medication_Administration
partOfMedicationDispense|Medication_Dispense
partOfMedicationStatement|Medication_Statement
partOfProcedure|Procedure
partOfObservation|Observation
contextEncounter|Encounter
contextEpisodeOfCare|Episode_Of_Care
medicationMedicationReference|Medication
informationSourcePatient|Patient
informationSourcePractitioner|Practitioner
informationSourceRelatedPerson|Related_Person
informationSourceOrganization|Organization
subjectPatient|Patient
subjectGroup|Group
reasonReferenceCondition|Condition
reasonReferenceObservation|Observation
noteAuthorPractitioner|Practitioner
noteAuthorPatient|Patient
noteAuthorRelatedPerson|Related_Person
*/
										myEmitter.prependOnceListener('checkDosage', function () {
											if (!validator.isEmpty(dosage)) {
												checkUniqeValue(apikey, "dosage_ID|" + dosage, 'dosage', function (resDosage) {
													if (resDosage.err_code > 0) {
														myEmitter.emit('checkReasonCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dosage id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonCode');
											}
										})
										
										myEmitter.prependOnceListener('checkBasedOnMedicationRequest', function () {
											if (!validator.isEmpty(basedOnMedicationRequest)) {
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + basedOnMedicationRequest, 'MEDICATION_REQUEST', function (resBasedOnMedicationRequest) {
													if (resBasedOnMedicationRequest.err_code > 0) {
														myEmitter.emit('checkDosage');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on medication request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDosage');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnCarePlan', function () {
											if (!validator.isEmpty(basedOnCarePlan)) {
												checkUniqeValue(apikey, "CAREPLAN_ID|" + basedOnCarePlan, 'CAREPLAN', function (resBasedOnCarePlan) {
													if (resBasedOnCarePlan.err_code > 0) {
														myEmitter.emit('checkBasedOnMedicationRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on care plan id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnMedicationRequest');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnProcedureRequest', function () {
											if (!validator.isEmpty(basedOnProcedureRequest)) {
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + basedOnProcedureRequest, 'PROCEDURE_REQUEST', function (resBasedOnProcedureRequest) {
													if (resBasedOnProcedureRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnCarePlan');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on procedure request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnCarePlan');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnReferralRequest', function () {
											if (!validator.isEmpty(basedOnReferralRequest)) {
												checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + basedOnReferralRequest, 'REFERRAL_REQUEST', function (resBasedOnReferralRequest) {
													if (resBasedOnReferralRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnProcedureRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on referral request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnProcedureRequest');
											}
										})

										myEmitter.prependOnceListener('checkPartOfMedicationAdministration', function () {
											if (!validator.isEmpty(partOfMedicationAdministration)) {
												checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + partOfMedicationAdministration, 'MEDICATION_ADMINISTRATION', function (resPartOfMedicationAdministration) {
													if (resPartOfMedicationAdministration.err_code > 0) {
														myEmitter.emit('checkBasedOnReferralRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of medication administration id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnReferralRequest');
											}
										})

										myEmitter.prependOnceListener('checkPartOfMedicationDispense', function () {
											if (!validator.isEmpty(partOfMedicationDispense)) {
												checkUniqeValue(apikey, "MEDICATION_DISPENSE_ID|" + partOfMedicationDispense, 'MEDICATION_DISPENSE', function (resPartOfMedicationDispense) {
													if (resPartOfMedicationDispense.err_code > 0) {
														myEmitter.emit('checkPartOfMedicationAdministration');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of medication dispense id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfMedicationAdministration');
											}
										})

										myEmitter.prependOnceListener('checkPartOfMedicationStatement', function () {
											if (!validator.isEmpty(partOfMedicationStatement)) {
												checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + partOfMedicationStatement, 'MEDICATION_STATEMENT', function (resPartOfMedicationStatement) {
													if (resPartOfMedicationStatement.err_code > 0) {
														myEmitter.emit('checkPartOfMedicationDispense');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of medication statement id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfMedicationDispense');
											}
										})

										myEmitter.prependOnceListener('checkPartOfProcedure', function () {
											if (!validator.isEmpty(partOfProcedure)) {
												checkUniqeValue(apikey, "PROCEDURE_ID|" + partOfProcedure, 'PROCEDURE', function (resPartOfProcedure) {
													if (resPartOfProcedure.err_code > 0) {
														myEmitter.emit('checkPartOfMedicationStatement');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of procedure id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfMedicationStatement');
											}
										})

										myEmitter.prependOnceListener('checkPartOfObservation', function () {
											if (!validator.isEmpty(partOfObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + partOfObservation, 'OBSERVATION', function (resPartOfObservation) {
													if (resPartOfObservation.err_code > 0) {
														myEmitter.emit('checkPartOfProcedure');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfProcedure');
											}
										})

										myEmitter.prependOnceListener('checkContextEncounter', function () {
											if (!validator.isEmpty(contextEncounter)) {
												checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounter, 'ENCOUNTER', function (resContextEncounter) {
													if (resContextEncounter.err_code > 0) {
														myEmitter.emit('checkPartOfObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context encounter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfObservation');
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

										myEmitter.prependOnceListener('checkMedicationMedicationReference', function () {
											if (!validator.isEmpty(medicationMedicationReference)) {
												checkUniqeValue(apikey, "MEDICATION_ID|" + medicationMedicationReference, 'MEDICATION', function (resMedicationMedicationReference) {
													if (resMedicationMedicationReference.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Medication medication reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkInformationSourcePatient', function () {
											if (!validator.isEmpty(informationSourcePatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + informationSourcePatient, 'PATIENT', function (resInformationSourcePatient) {
													if (resInformationSourcePatient.err_code > 0) {
														myEmitter.emit('checkMedicationMedicationReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Information source patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMedicationMedicationReference');
											}
										})

										myEmitter.prependOnceListener('checkInformationSourcePractitioner', function () {
											if (!validator.isEmpty(informationSourcePractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + informationSourcePractitioner, 'PRACTITIONER', function (resInformationSourcePractitioner) {
													if (resInformationSourcePractitioner.err_code > 0) {
														myEmitter.emit('checkInformationSourcePatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Information source practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInformationSourcePatient');
											}
										})

										myEmitter.prependOnceListener('checkInformationSourceRelatedPerson', function () {
											if (!validator.isEmpty(informationSourceRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + informationSourceRelatedPerson, 'RELATED_PERSON', function (resInformationSourceRelatedPerson) {
													if (resInformationSourceRelatedPerson.err_code > 0) {
														myEmitter.emit('checkInformationSourcePractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Information source related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInformationSourcePractitioner');
											}
										})

										myEmitter.prependOnceListener('checkInformationSourceOrganization', function () {
											if (!validator.isEmpty(informationSourceOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + informationSourceOrganization, 'ORGANIZATION', function (resInformationSourceOrganization) {
													if (resInformationSourceOrganization.err_code > 0) {
														myEmitter.emit('checkInformationSourceRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Information source organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInformationSourceRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkInformationSourceOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInformationSourceOrganization');
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

										myEmitter.prependOnceListener('checkReasonReferenceCondition', function () {
											if (!validator.isEmpty(reasonReferenceCondition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + reasonReferenceCondition, 'CONDITION', function (resReasonReferenceCondition) {
													if (resReasonReferenceCondition.err_code > 0) {
														myEmitter.emit('checkSubjectGroup');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectGroup');
											}
										})

										myEmitter.prependOnceListener('checkReasonReferenceObservation', function () {
											if (!validator.isEmpty(reasonReferenceObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + reasonReferenceObservation, 'OBSERVATION', function (resReasonReferenceObservation) {
													if (resReasonReferenceObservation.err_code > 0) {
														myEmitter.emit('checkReasonReferenceCondition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReferenceCondition');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorPractitioner', function () {
											if (!validator.isEmpty(noteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorPractitioner, 'PRACTITIONER', function (resNoteAuthorPractitioner) {
													if (resNoteAuthorPractitioner.err_code > 0) {
														myEmitter.emit('checkReasonReferenceObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReferenceObservation');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorPatient', function () {
											if (!validator.isEmpty(noteAuthorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorPatient, 'PATIENT', function (resNoteAuthorPatient) {
													if (resNoteAuthorPatient.err_code > 0) {
														myEmitter.emit('checkNoteAuthorPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorPractitioner');
											}
										})

										if (!validator.isEmpty(noteAuthorRelatedPerson)) {
											checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorRelatedPerson) {
												if (resNoteAuthorRelatedPerson.err_code > 0) {
													myEmitter.emit('checkNoteAuthorPatient');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Note author related person id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkNoteAuthorPatient');
										}


										
										
										/*------*/
											
										


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
			var medicationStatementId = req.params.medication_statement_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationStatementId !== 'undefined'){
				if(validator.isEmpty(medicationStatementId)){
					err_code = 2;
					err_msg = "Medication Statement id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Statement id is required";
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
												checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + medicationStatementId, 'MEDICATION_STATEMENT', function(resMedicationStatementID){
													if(resMedicationStatementID.err_code > 0){
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
																							"medication_statement_id": medicationStatementId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Medication Statement.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Medication Statement Id not found"});		
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
		dosage : function addDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationStatementId = req.params.medication_statement_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationStatementId !== 'undefined'){
				if(validator.isEmpty(medicationStatementId)){
					err_code = 2;
					err_msg = "Medication Statement id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Statement id is required";
			}
			
/*
sequence|sequence|integer||
text|text|||
additionalInstruction|additionalInstruction|||
patientInstruction|patientInstruction|||
timing.event|event|date||
timing.repeat.bounds.boundsDuration|repeatBoundsBoundsDuration|integer||
timing.repeat.bounds.boundsRange|repeatBoundsBoundsRange|range||
timing.repeat.bounds.boundsPeriod|repeatBoundsBoundsPeriod|period||
timing.repeat.count|repeatCount|integer||
timing.repeat.countMax|repeatCountMax|integer||
timing.repeat.duration|repeatDuration|integer||
timing.repeat.durationMax|repeatDurationMax|integer||
timing.repeat.durationUnit|repeatDurationUnit|||
timing.repeat.frequency|repeatFrequency|integer||
timing.repeat.frequencyMax|repeatFrequencyMax|integer||
timing.repeat.period|repeatPeriod|integer||
timing.repeat.periodMax|repeatPeriodMax|integer||
timing.repeat.periodUnit|repeatPeriodUnit|||
timing.repeat.dayOfWeek|repeatDayOfWeek|||
timing.repeat.timeOfDay|repeatTimeOfDay|integer||
timing.repeat.when|repeatWhen|||u
timing.repeat.offset|repeatOffset|integer||
timing.code|code|||u
asNeeded.asNeededBoolean|asNeededAsNeededBoolean|boolean||
asNeeded.asNeededCodeableConcept|asNeededAsNeededCodeableConcept|||
site|site|||
route|route|||
method|method|||
dose.doseRange|doseDoseRange|range||
dose.doseQuantity|doseDoseQuantity|||
maxDosePerPeriod|maxDosePerPeriod|ratio||
maxDosePerAdministration|maxDosePerAdministration|||
maxDosePerLifetime|maxDosePerLifetime|||
rate.rateRatio|rateRateRatio|ratio||
rate.rateRange|rateRateRange|range||
rate.rateQuantity|rateRateQuantity|integer
*/			
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
				err_msg = "Please add sub-key 'sequence' in json Dosage request.";
			}

			if(typeof req.body.text !== 'undefined'){
				var text =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(text)){
					text = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'text' in json Dosage request.";
			}

			if(typeof req.body.additionalInstruction !== 'undefined'){
				var additionalInstruction =  req.body.additionalInstruction.trim().toLowerCase();
				if(validator.isEmpty(additionalInstruction)){
					additionalInstruction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'additional instruction' in json Dosage request.";
			}

			if(typeof req.body.patientInstruction !== 'undefined'){
				var patientInstruction =  req.body.patientInstruction.trim().toLowerCase();
				if(validator.isEmpty(patientInstruction)){
					patientInstruction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient instruction' in json Dosage request.";
			}

			/*if(typeof req.body.timing !== 'undefined'){
				var timing =  req.body.timing.trim().toLowerCase();
				if(validator.isEmpty(timing)){
					timing = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'timing' in json Dosage request.";
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
				err_msg = "Please add sub-key 'event' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat bounds bounds duration' in json Timing request.";
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
			  err_msg = "Please add key 'repeat bounds bounds range' in json Timing request.";
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
			  err_msg = "Please add key 'repeat bounds bounds period' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat count' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat count max' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat duration' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat duration max' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.durationUnit !== 'undefined'){
				var repeatDurationUnit =  req.body.timing.repeat.durationUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatDurationUnit)){
					repeatDurationUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat duration unit' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat frequency' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat frequency max' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat period' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat period max' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.periodUnit !== 'undefined'){
				var repeatPeriodUnit =  req.body.timing.repeat.periodUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatPeriodUnit)){
					repeatPeriodUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat period unit' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.dayOfWeek !== 'undefined'){
				var repeatDayOfWeek =  req.body.timing.repeat.dayOfWeek.trim().toLowerCase();
				if(validator.isEmpty(repeatDayOfWeek)){
					repeatDayOfWeek = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat day of week' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat time of day' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.when !== 'undefined'){
				var repeatWhen =  req.body.timing.repeat.when.trim().toUpperCase();
				if(validator.isEmpty(repeatWhen)){
					repeatWhen = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat when' in json Timing request.";
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
				err_msg = "Please add sub-key 'repeat offset' in json Timing request.";
			}

			if(typeof req.body.timing.code !== 'undefined'){
				var code =  req.body.timing.code.trim().toUpperCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Timing request.";
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
				err_msg = "Please add sub-key 'as needed as needed boolean' in json Dosage request.";
			}

			if(typeof req.body.asNeeded.asNeededCodeableConcept !== 'undefined'){
				var asNeededAsNeededCodeableConcept =  req.body.asNeeded.asNeededCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(asNeededAsNeededCodeableConcept)){
					asNeededAsNeededCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'as needed as needed codeable concept' in json Dosage request.";
			}

			if(typeof req.body.site !== 'undefined'){
				var site =  req.body.site.trim().toLowerCase();
				if(validator.isEmpty(site)){
					site = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Dosage request.";
			}

			if(typeof req.body.route !== 'undefined'){
				var route =  req.body.route.trim().toLowerCase();
				if(validator.isEmpty(route)){
					route = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Dosage request.";
			}

			if(typeof req.body.method !== 'undefined'){
				var method =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(method)){
					method = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'method' in json Dosage request.";
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
			  err_msg = "Please add key 'dose dose range' in json Dosage request.";
			}

			if(typeof req.body.dose.doseQuantity !== 'undefined'){
				var doseDoseQuantity =  req.body.dose.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(doseDoseQuantity)){
					doseDoseQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose dose quantity' in json Dosage request.";
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
			  err_msg = "Please add key 'max dose per period' in json Dosage request.";
			}

			if(typeof req.body.maxDosePerAdministration !== 'undefined'){
				var maxDosePerAdministration =  req.body.maxDosePerAdministration.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerAdministration)){
					maxDosePerAdministration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'max dose per administration' in json Dosage request.";
			}

			if(typeof req.body.maxDosePerLifetime !== 'undefined'){
				var maxDosePerLifetime =  req.body.maxDosePerLifetime.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerLifetime)){
					maxDosePerLifetime = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'max dose per lifetime' in json Dosage request.";
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
			  err_msg = "Please add key 'rate rate ratio' in json Dosage request.";
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
			  err_msg = "Please add key 'rate rate range' in json Dosage request.";
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
				err_msg = "Please add sub-key 'rate rate quantity' in json Dosage request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						myEmitter.prependOnceListener('checkMedicationStatementId', function() {
							checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + medicationStatementId, 'MEDICATION_STATEMENT', function(resMedicationStatementID){
								if(resMedicationStatementID.err_code > 0){
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
										"medication_statement_id" : medicationStatementId
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

									res.json({"err_code": 0, "err_msg": "Medication Statement dosage has been add.", "data": [{"_id": dosageId}]});
								}else{
									res.json({"err_code": 503, "err_msg": "Medication Statement Id not found"});		
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
										myEmitter.emit('checkMedicationStatementId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat duration unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationStatementId');
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
		medicationStatement : function putMedicationStatement(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationStatementId = req.params.medication_statement_id;

      var err_code = 0;
      var err_msg = "";
      var dataMedicationStatement = {};

			if(typeof medicationStatementId !== 'undefined'){
				if(validator.isEmpty(medicationStatementId)){
					err_code = 2;
					err_msg = "Medication Statement id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Statement id is required";
			}
			
			/*if(typeof req.body.basedOn.medicationRequest !== 'undefined' && req.body.basedOn.medicationRequest !== ""){
				var basedOnMedicationRequest =  req.body.basedOn.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnMedicationRequest)){
					dataMedicationStatement.medication_request = "";
				}else{
					dataMedicationStatement.medication_request = basedOnMedicationRequest;
				}
			}else{
			  basedOnMedicationRequest = "";
			}

			if(typeof req.body.basedOn.carePlan !== 'undefined' && req.body.basedOn.carePlan !== ""){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					dataMedicationStatement.care_plan = "";
				}else{
					dataMedicationStatement.care_plan = basedOnCarePlan;
				}
			}else{
			  basedOnCarePlan = "";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined' && req.body.basedOn.procedureRequest !== ""){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					dataMedicationStatement.procedure_request = "";
				}else{
					dataMedicationStatement.procedure_request = basedOnProcedureRequest;
				}
			}else{
			  basedOnProcedureRequest = "";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined' && req.body.basedOn.referralRequest !== ""){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					dataMedicationStatement.referral_request = "";
				}else{
					dataMedicationStatement.referral_request = basedOnReferralRequest;
				}
			}else{
			  basedOnReferralRequest = "";
			}

			if(typeof req.body.partOf.medicationAdministration !== 'undefined' && req.body.partOf.medicationAdministration !== ""){
				var partOfMedicationAdministration =  req.body.partOf.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationAdministration)){
					dataMedicationStatement.medication_administration = "";
				}else{
					dataMedicationStatement.medication_administration = partOfMedicationAdministration;
				}
			}else{
			  partOfMedicationAdministration = "";
			}

			if(typeof req.body.partOf.medicationDispense !== 'undefined' && req.body.partOf.medicationDispense !== ""){
				var partOfMedicationDispense =  req.body.partOf.medicationDispense.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationDispense)){
					dataMedicationStatement.medication_dispense = "";
				}else{
					dataMedicationStatement.medication_dispense = partOfMedicationDispense;
				}
			}else{
			  partOfMedicationDispense = "";
			}

			if(typeof req.body.partOf.medicationStatement !== 'undefined' && req.body.partOf.medicationStatement !== ""){
				var partOfMedicationStatement =  req.body.partOf.medicationStatement.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationStatement)){
					dataMedicationStatement.medication_statement = "";
				}else{
					dataMedicationStatement.medication_statement = partOfMedicationStatement;
				}
			}else{
			  partOfMedicationStatement = "";
			}

			if(typeof req.body.partOf.procedure !== 'undefined' && req.body.partOf.procedure !== ""){
				var partOfProcedure =  req.body.partOf.procedure.trim().toLowerCase();
				if(validator.isEmpty(partOfProcedure)){
					dataMedicationStatement.procedure = "";
				}else{
					dataMedicationStatement.procedure = partOfProcedure;
				}
			}else{
			  partOfProcedure = "";
			}

			if(typeof req.body.partOf.observation !== 'undefined' && req.body.partOf.observation !== ""){
				var partOfObservation =  req.body.partOf.observation.trim().toLowerCase();
				if(validator.isEmpty(partOfObservation)){
					dataMedicationStatement.observation = "";
				}else{
					dataMedicationStatement.observation = partOfObservation;
				}
			}else{
			  partOfObservation = "";
			}*/

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataMedicationStatement.encounter = "";
				}else{
					dataMedicationStatement.encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataMedicationStatement.episode_of_care = "";
				}else{
					dataMedicationStatement.episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "medication statement status is required.";
				}else{
					dataMedicationStatement.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataMedicationStatement.category = "";
				}else{
					dataMedicationStatement.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined' && req.body.medication.medicationCodeableConcept !== ""){
				var medicationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "medication statement medication medication codeable concept is required.";
				}else{
					dataMedicationStatement.medication_codeable_concept = medicationMedicationCodeableConcept;
				}
			}else{
			  medicationMedicationCodeableConcept = "";
			}

			if(typeof req.body.medication.medicationReference !== 'undefined' && req.body.medication.medicationReference !== ""){
				var medicationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationReference)){
					dataMedicationStatement.medication_reference = "";
				}else{
					dataMedicationStatement.medication_reference = medicationMedicationReference;
				}
			}else{
			  medicationMedicationReference = "";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined' && req.body.effective.effectiveDateTime !== ""){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					err_code = 2;
					err_msg = "medication statement effective effective date time is required.";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "medication statement effective effective date time invalid date format.";	
					}else{
						dataMedicationStatement.effective_date_time = effectiveEffectiveDateTime;
					}
				}
			}else{
			  effectiveEffectiveDateTime = "";
			}

			if (typeof req.body.effective.effectivePeriod !== 'undefined' && req.body.effective.effectivePeriod !== "") {
			  var effectiveEffectivePeriod = req.body.effective.effectivePeriod;
			  if (effectiveEffectivePeriod.indexOf("to") > 0) {
			    arrEffectiveEffectivePeriod = effectiveEffectivePeriod.split("to");
			    dataMedicationStatement.effective_period_start = arrEffectiveEffectivePeriod[0];
			    dataMedicationStatement.effective_period_end = arrEffectiveEffectivePeriod[1];
			    if (!regex.test(effectiveEffectivePeriodStart) && !regex.test(effectiveEffectivePeriodEnd)) {
			      err_code = 2;
			      err_msg = "medication statement effective effective period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "medication statement effective effective period invalid date format.";
				}
			} else {
			  effectiveEffectivePeriod = "";
			}

			if(typeof req.body.dateAsserted !== 'undefined' && req.body.dateAsserted !== ""){
				var dateAsserted =  req.body.dateAsserted;
				if(validator.isEmpty(dateAsserted)){
					err_code = 2;
					err_msg = "medication statement date asserted is required.";
				}else{
					if(!regex.test(dateAsserted)){
						err_code = 2;
						err_msg = "medication statement date asserted invalid date format.";	
					}else{
						dataMedicationStatement.date_asserted = dateAsserted;
					}
				}
			}else{
			  dateAsserted = "";
			}

			if(typeof req.body.informationSource.patient !== 'undefined' && req.body.informationSource.patient !== ""){
				var informationSourcePatient =  req.body.informationSource.patient.trim().toLowerCase();
				if(validator.isEmpty(informationSourcePatient)){
					dataMedicationStatement.patient = "";
				}else{
					dataMedicationStatement.patient = informationSourcePatient;
				}
			}else{
			  informationSourcePatient = "";
			}

			if(typeof req.body.informationSource.practitioner !== 'undefined' && req.body.informationSource.practitioner !== ""){
				var informationSourcePractitioner =  req.body.informationSource.practitioner.trim().toLowerCase();
				if(validator.isEmpty(informationSourcePractitioner)){
					dataMedicationStatement.practitioner = "";
				}else{
					dataMedicationStatement.practitioner = informationSourcePractitioner;
				}
			}else{
			  informationSourcePractitioner = "";
			}

			if(typeof req.body.informationSource.relatedPerson !== 'undefined' && req.body.informationSource.relatedPerson !== ""){
				var informationSourceRelatedPerson =  req.body.informationSource.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(informationSourceRelatedPerson)){
					dataMedicationStatement.related_person = "";
				}else{
					dataMedicationStatement.related_person = informationSourceRelatedPerson;
				}
			}else{
			  informationSourceRelatedPerson = "";
			}

			if(typeof req.body.informationSource.organization !== 'undefined' && req.body.informationSource.organization !== ""){
				var informationSourceOrganization =  req.body.informationSource.organization.trim().toLowerCase();
				if(validator.isEmpty(informationSourceOrganization)){
					dataMedicationStatement.organization = "";
				}else{
					dataMedicationStatement.organization = informationSourceOrganization;
				}
			}else{
			  informationSourceOrganization = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataMedicationStatement.patient = "";
				}else{
					dataMedicationStatement.patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataMedicationStatement.group = "";
				}else{
					dataMedicationStatement.group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.derivedFrom !== 'undefined' && req.body.derivedFrom !== ""){
				var derivedFrom =  req.body.derivedFrom.trim().toLowerCase();
				if(validator.isEmpty(derivedFrom)){
					dataMedicationStatement.derived_from = "";
				}else{
					dataMedicationStatement.derived_from = derivedFrom;
				}
			}else{
			  derivedFrom = "";
			}

			if(typeof req.body.taken !== 'undefined' && req.body.taken !== ""){
				var taken =  req.body.taken.trim().toLowerCase();
				if(validator.isEmpty(taken)){
					err_code = 2;
					err_msg = "medication statement taken is required.";
				}else{
					dataMedicationStatement.taken = taken;
				}
			}else{
			  taken = "";
			}

			if(typeof req.body.reasonNotTaken !== 'undefined' && req.body.reasonNotTaken !== ""){
				var reasonNotTaken =  req.body.reasonNotTaken.trim().toLowerCase();
				if(validator.isEmpty(reasonNotTaken)){
					dataMedicationStatement.reason_not_taken = "";
				}else{
					dataMedicationStatement.reason_not_taken = reasonNotTaken;
				}
			}else{
			  reasonNotTaken = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					dataMedicationStatement.reason_code = "";
				}else{
					dataMedicationStatement.reason_code = reasonCode;
				}
			}else{
			  reasonCode = "";
			}

			/*if(typeof req.body.reasonReference.condition !== 'undefined' && req.body.reasonReference.condition !== ""){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					dataMedicationStatement.condition = "";
				}else{
					dataMedicationStatement.condition = reasonReferenceCondition;
				}
			}else{
			  reasonReferenceCondition = "";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined' && req.body.reasonReference.observation !== ""){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					dataMedicationStatement.observation = "";
				}else{
					dataMedicationStatement.observation = reasonReferenceObservation;
				}
			}else{
			  reasonReferenceObservation = "";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined' && req.body.note.author.authorReference.practitioner !== ""){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					dataMedicationStatement.practitioner = "";
				}else{
					dataMedicationStatement.practitioner = noteAuthorPractitioner;
				}
			}else{
			  noteAuthorPractitioner = "";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined' && req.body.note.author.authorReference.patient !== ""){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					dataMedicationStatement.patient = "";
				}else{
					dataMedicationStatement.patient = noteAuthorPatient;
				}
			}else{
			  noteAuthorPatient = "";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined' && req.body.note.author.authorReference.relatedPerson !== ""){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					dataMedicationStatement.related_person = "";
				}else{
					dataMedicationStatement.related_person = noteAuthorRelatedPerson;
				}
			}else{
			  noteAuthorRelatedPerson = "";
			}

			if(typeof req.body.note.author.authorString !== 'undefined' && req.body.note.author.authorString !== ""){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					dataMedicationStatement.author_string = "";
				}else{
					dataMedicationStatement.author_string = noteAuthorAuthorString;
				}
			}else{
			  noteAuthorAuthorString = "";
			}

			if(typeof req.body.note.time !== 'undefined' && req.body.note.time !== ""){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "medication statement note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "medication statement note time invalid date format.";	
					}else{
						dataMedicationStatement.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.note.text !== 'undefined' && req.body.note.text !== ""){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					dataMedicationStatement.text = "";
				}else{
					dataMedicationStatement.text = noteText;
				}
			}else{
			  noteText = "";
			}*/
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	

										//event emiter
						myEmitter.prependOnceListener('checkMedicationStatementId', function(){
							checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + medicationStatementId, 'MEDICATION_STATEMENT', function(resMedicationStatementId){
								if(resMedicationStatementId.err_code > 0){
									//console.log(dataImmunization);
									ApiFHIR.put('medicationStatement', {"apikey": apikey, "_id": medicationStatementId}, {body: dataMedicationStatement, json: true}, function(error, response, body){
										medicationStatement = body;
										if(medicationStatement.err_code > 0){
											res.json(medicationStatement);	
										}else{
											res.json({"err_code": 0, "err_msg": "Medication Statement has been update.", "data": [{"_id": medicationStatementId}]});
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Statement Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'MEDICATION_STATEMENT_STATUS', function (resStatusCode) {
									if (resStatusCode.err_code > 0) {
										myEmitter.emit('checkMedicationStatementId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationStatementId');
							}
						})

						myEmitter.prependOnceListener('checkCategory', function () {
							if (!validator.isEmpty(category)) {
								checkCode(apikey, category, 'MEDICATION_STATEMENT_CATEGORY', function (resCategoryCode) {
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

						myEmitter.prependOnceListener('checkTaken', function () {
							if (!validator.isEmpty(taken)) {
								checkCode(apikey, taken, 'MEDICATION_STATEMENT_TAKEN', function (resTakenCode) {
									if (resTakenCode.err_code > 0) {
										myEmitter.emit('checkMedicationMedicationCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Taken code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationMedicationCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkReasonNotTaken', function () {
							if (!validator.isEmpty(reasonNotTaken)) {
								checkCode(apikey, reasonNotTaken, 'REASON_MEDICATION_NOT_TAKEN_CODES', function (resReasonNotTakenCode) {
									if (resReasonNotTakenCode.err_code > 0) {
										myEmitter.emit('checkTaken');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reason not taken code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkTaken');
							}
						})

						myEmitter.prependOnceListener('checkReasonCode', function () {
							if (!validator.isEmpty(reasonCode)) {
								checkCode(apikey, reasonCode, 'CONDITION_CODE', function (resReasonCodeCode) {
									if (resReasonCodeCode.err_code > 0) {
										myEmitter.emit('checkReasonNotTaken');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reason code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReasonNotTaken');
							}
						})

						myEmitter.prependOnceListener('checkContextEncounter', function () {
							if (!validator.isEmpty(contextEncounter)) {
								checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounter, 'ENCOUNTER', function (resContextEncounter) {
									if (resContextEncounter.err_code > 0) {
										myEmitter.emit('checkReasonCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Context encounter id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReasonCode');
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

						myEmitter.prependOnceListener('checkMedicationMedicationReference', function () {
							if (!validator.isEmpty(medicationMedicationReference)) {
								checkUniqeValue(apikey, "MEDICATION_ID|" + medicationMedicationReference, 'MEDICATION', function (resMedicationMedicationReference) {
									if (resMedicationMedicationReference.err_code > 0) {
										myEmitter.emit('checkContextEpisodeOfCare');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Medication medication reference id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkContextEpisodeOfCare');
							}
						})

						myEmitter.prependOnceListener('checkInformationSourcePatient', function () {
							if (!validator.isEmpty(informationSourcePatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + informationSourcePatient, 'PATIENT', function (resInformationSourcePatient) {
									if (resInformationSourcePatient.err_code > 0) {
										myEmitter.emit('checkMedicationMedicationReference');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Information source patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationMedicationReference');
							}
						})

						myEmitter.prependOnceListener('checkInformationSourcePractitioner', function () {
							if (!validator.isEmpty(informationSourcePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + informationSourcePractitioner, 'PRACTITIONER', function (resInformationSourcePractitioner) {
									if (resInformationSourcePractitioner.err_code > 0) {
										myEmitter.emit('checkInformationSourcePatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Information source practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInformationSourcePatient');
							}
						})

						myEmitter.prependOnceListener('checkInformationSourceRelatedPerson', function () {
							if (!validator.isEmpty(informationSourceRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + informationSourceRelatedPerson, 'RELATED_PERSON', function (resInformationSourceRelatedPerson) {
									if (resInformationSourceRelatedPerson.err_code > 0) {
										myEmitter.emit('checkInformationSourcePractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Information source related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInformationSourcePractitioner');
							}
						})

						myEmitter.prependOnceListener('checkInformationSourceOrganization', function () {
							if (!validator.isEmpty(informationSourceOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + informationSourceOrganization, 'ORGANIZATION', function (resInformationSourceOrganization) {
									if (resInformationSourceOrganization.err_code > 0) {
										myEmitter.emit('checkInformationSourceRelatedPerson');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Information source organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInformationSourceRelatedPerson');
							}
						})

						myEmitter.prependOnceListener('checkSubjectPatient', function () {
							if (!validator.isEmpty(subjectPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
									if (resSubjectPatient.err_code > 0) {
										myEmitter.emit('checkInformationSourceOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Subject patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInformationSourceOrganization');
							}
						})

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
			var medicationStatementId = req.params.medication_statement_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof medicationStatementId !== 'undefined'){
				if(validator.isEmpty(medicationStatementId)){
					err_code = 2;
					err_msg = "Medication Statement id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Statement id is required";
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
						myEmitter.prependOnceListener('checkMedication StatementID', function(){
							checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + medicationStatementId, 'MEDICATION_STATEMENT', function(resMedicationStatementID){
								if(resMedicationStatementID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "MEDICATION_STATEMENT_ID|"+medicationStatementId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Medication Statement.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Statement Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkMedication StatementID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkMedication StatementID');				
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
		timing : function putTiming(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var timingId = req.params.timing_id;
			var medicationStatementId = req.params.medication_statement_id;
			var dosageId = req.params.dosage_id;

			var err_code = 0;
			var err_msg = "";
			var dataTiming = {};
			//input check 
			if(typeof medicationStatementId !== 'undefined'){
				if(validator.isEmpty(medicationStatementId)){
					err_code = 2;
					err_msg = "Medication Statement id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Statement id is required";
			}
			
			if(typeof dosageId !== 'undefined'){
				if(validator.isEmpty(dosageId)){
					err_code = 2;
					err_msg = "Medication Statement Dosage id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Statement Dosage id is required";
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
						myEmitter.prependOnceListener('checkMedicationStatementId', function () {
							checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + medicationStatementId, 'MEDICATION_STATEMENT', function(resMedicationStatementID){
								if(resMedicationStatementID.err_code > 0){
									checkUniqeValue(apikey, "DOSAGE_ID|" + dosageId, 'DOSAGE', function(resMedicationStatementID){
										if(resMedicationStatementID.err_code > 0){
									
											//console.log(dataImmunization);
											ApiFHIR.put('timing', {"apikey": apikey, "_id": timingId,"dr": "DOSAGE_ID|"+dosageId}, {body: dataTiming, json: true}, function(error, response, body){
												timing = body;
												if(timing.err_code > 0){
													res.json(timing);	
												}else{
													res.json({"err_code": 0, "err_msg": "Medication Statement Timing has been update.", "data": [{"_id": timingId}]});
												}
											})
										}else{
											res.json({"err_code": 501, "err_msg": "Medication Statement Dosage Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 501, "err_msg": "Medication Statement Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkRepeatDurationUnit', function () {
							if (!validator.isEmpty(repeatDurationUnit)) {
								checkCode(apikey, repeatDurationUnit, 'UNITS_OF_TIME', function (resRepeatDurationUnitCode) {
									if (resRepeatDurationUnitCode.err_code > 0) {
										myEmitter.emit('checkMedicationStatementId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat duration unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationStatementId');
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
			var medicationStatementId = req.params.medication_statement_id;

			var err_code = 0;
			var err_msg = "";
			var dataDosage = {};
			//input check 
			if(typeof medicationStatementId !== 'undefined'){
				if(validator.isEmpty(medicationStatementId)){
					err_code = 2;
					err_msg = "Medication Statement id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Statement id is required";
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
						myEmitter.prependOnceListener('checkMedicationStatementId', function() {
							checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + medicationStatementId, 'MEDICATION_STATEMENT', function(resMedicationStatementID){
								if(resMedicationStatementID.err_code > 0){
										//console.log(dataImmunization);
										ApiFHIR.put('dosage', {"apikey": apikey, "_id": dosageId,"dr": "MEDICATION_STATEMENT_ID|"+medicationStatementId}, {body: dataDosage, json: true}, function(error, response, body){
											dosage = body;
											if(dosage.err_code > 0){
												res.json(dosage);	
											}else{
												res.json({"err_code": 0, "err_msg": "Medication Statement Dosage has been update.", "data": [{"_id": dosageId}]});
											}
										})
									}else{
									res.json({"err_code": 501, "err_msg": "Medication Statement Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAdditionalInstruction', function () {
							if (!validator.isEmpty(additionalInstruction)) {
								checkCode(apikey, additionalInstruction, 'ADDITIONAL_INSTRUCTION_CODES', function (resAdditionalInstructionCode) {
									if (resAdditionalInstructionCode.err_code > 0) {
										myEmitter.emit('checkMedicationStatementId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Additional instruction code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationStatementId');
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