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
		immunization : function getImmunization(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			/*var immunizationId = req.query._id;
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

			if(typeof immunizationId !== 'undefined'){
				if(!validator.isEmpty(immunizationId)){
					qString.immunizationId = immunizationId; 
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
				"Immunization" : {
					"location": "%(apikey)s/Immunization",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Immunization', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var immunization = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(immunization.err_code == 0){
								//cek jumdata dulu
								if(immunization.data.length > 0){
									newImmunization = [];
									for(i=0; i < immunization.data.length; i++){
										myEmitter.once("getIdentifier", function(immunization, index, newImmunization, countImmunization){
											/*console.log(immunization);*/
														//get identifier
														qString = {};
														qString.care_team_id = immunization.id;
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
																var objectImmunization = {};
																objectImmunization.resourceType = immunization.resourceType;
																objectImmunization.id = immunization.id;
																objectImmunization.identifier = identifier.data;
																objectImmunization.status = immunization.status;
																objectImmunization.category = immunization.category;
																objectImmunization.name = immunization.name;
																objectImmunization.subject = immunization.subject;
																objectImmunization.context = immunization.context;
																objectImmunization.period = immunization.period;
																objectImmunization.reasonCode = immunization.reasonCode;
																
																newImmunization[index] = objectImmunization;
																
																/*if(index == countImmunization -1 ){
																	res.json({"err_code": 0, "data":newImmunization});				
																}
*/
																myEmitter.once('getImmunizationParticipant', function(immunization, index, newImmunization, countImmunization){
																				qString = {};
																				qString.care_team_id = immunization.id;
																				seedPhoenixFHIR.path.GET = {
																					"ImmunizationParticipant" : {
																						"location": "%(apikey)s/ImmunizationParticipant",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('ImmunizationParticipant', {"apikey": apikey}, {}, function(error, response, body){
																					immunizationParticipant = JSON.parse(body);
																					if(immunizationParticipant.err_code == 0){
																						var objectImmunization = {};
																						objectImmunization.resourceType = immunization.resourceType;
																						objectImmunization.id = immunization.id;
																						objectImmunization.identifier = immunization.identifier;
																						objectImmunization.status = immunization.status;
																						objectImmunization.category = immunization.category;
																						objectImmunization.name = immunization.name;
																						objectImmunization.subject = immunization.subject;
																						objectImmunization.context = immunization.context;
																						objectImmunization.period = immunization.period;
																						objectImmunization.participant = immunizationParticipant.data;
																						objectImmunization.reasonCode = immunization.reasonCode;

																						newImmunization[index] = objectImmunization;

																						/*if(index == countImmunization -1 ){
																							res.json({"err_code": 0, "data":newImmunization});				
																						}*/
																						myEmitter.once('getReasonReference', function(immunization, index, newImmunization, countImmunization){
																							qString = {};
																							qString.care_team_id = immunization.id;
																							seedPhoenixFHIR.path.GET = {
																								"ReasonReference" : {
																									"location": "%(apikey)s/Condition",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ReasonReference', {"apikey": apikey}, {}, function(error, response, body){
																								reasonReference = JSON.parse(body);
																								console.log(reasonReference);
																								if(reasonReference.err_code == 0){
																									var objectImmunization = {};
															objectImmunization.resourceType = immunization.resourceType;
															objectImmunization.id = immunization.id;
															objectImmunization.identifier = immunization.identifier;
															objectImmunization.status = immunization.status;
															objectImmunization.category = immunization.category;
															objectImmunization.name = immunization.name;
															objectImmunization.subject = immunization.subject;
															objectImmunization.context = immunization.context;
															objectImmunization.period = immunization.period;
															objectImmunization.participant = immunization.participant;
															objectImmunization.reasonCode = immunization.reasonCode;
															var reasonReference;															
															if(typeof reasonReference.data.id !== 'undefined' && reasonReference.data.id !== "null"){
																reasonReference = host + ":" + port + "/" + apikey + "/Condition?_id=" + reasonReference.data.id;
															} else {
																reasonReference = [];
															}									
															objectImmunization.reasonReference = reasonReference;

																									newImmunization[index] = objectImmunization;

																									myEmitter.once('getManagingOrganization', function(immunization, index, newImmunization, countImmunization){
																										qString = {};
																										qString.care_team_id = immunization.id;
																										seedPhoenixFHIR.path.GET = {
																											"ManagingOrganization" : {
																												"location": "%(apikey)s/Organization",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('ManagingOrganization', {"apikey": apikey}, {}, function(error, response, body){
																											managingOrganization = JSON.parse(body);
																											if(managingOrganization.err_code == 0){
																												var objectImmunization = {};
														objectImmunization.resourceType = immunization.resourceType;
														objectImmunization.id = immunization.id;
														objectImmunization.identifier = immunization.identifier;
														objectImmunization.status = immunization.status;
														objectImmunization.category = immunization.category;
														objectImmunization.name = immunization.name;
														objectImmunization.subject = immunization.subject;
														objectImmunization.context = immunization.context;
														objectImmunization.period = immunization.period;
														objectImmunization.participant = immunization.participant;
														objectImmunization.reasonCode = immunization.reasonCode;
														objectImmunization.reasonReference = immunization.reasonReference;
														var managingOrganization;															
														if(typeof managingOrganization.data.id !== 'undefined' && managingOrganization.data.id !== "null"){
															managingOrganization = host + ":" + port + "/" + apikey + "/Condition?_id=" + managingOrganization.data.id;
														} else {
															managingOrganization = [];
														}
														objectImmunization.managingOrganization = managingOrganization;

																												newImmunization[index] = objectImmunization;

																												myEmitter.once('getAnnotation', function(immunization, index, newImmunization, countImmunization){
																													qString = {};
																													qString.care_team_id = immunization.id;
																													seedPhoenixFHIR.path.GET = {
																														"Annotation" : {
																															"location": "%(apikey)s/Annotation",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('Annotation', {"apikey": apikey}, {}, function(error, response, body){
																														note = JSON.parse(body);
																														if(note.err_code == 0){
																															var objectImmunization = {};
																objectImmunization.resourceType = immunization.resourceType;
																objectImmunization.id = immunization.id;
																objectImmunization.identifier = immunization.identifier;
																objectImmunization.status = immunization.status;
																objectImmunization.category = immunization.category;
																objectImmunization.name = immunization.name;
																objectImmunization.subject = immunization.subject;
																objectImmunization.context = immunization.context;
																objectImmunization.period = immunization.period;
																objectImmunization.participant = immunization.participant;
																objectImmunization.reasonCode = immunization.reasonCode;
																objectImmunization.reasonReference = immunization.reasonReference;
																objectImmunization.managingOrganization = immunization.managingOrganization;
																objectImmunization.note = note.data;

																															newImmunization[index] = objectImmunization;

																															if(index == countImmunization -1 ){
																																res.json({"err_code": 0, "data":newImmunization});				
																															}

																														}else{
																															res.json(note);			
																														}
																													})
																												})
																												myEmitter.emit('getAnnotation', objectImmunization, index, newImmunization, countImmunization);			
																											}else{
																												res.json(managingOrganization);			
																											}
																										})
																									})
																									myEmitter.emit('getManagingOrganization', objectImmunization, index, newImmunization, countImmunization);			
																								}else{
																									res.json(reasonReference);			
																								}
																							})
																						})
																						myEmitter.emit('getReasonReference', objectImmunization, index, newImmunization, countImmunization);
																					}else{
																						res.json(immunizationParticipant);			
																					}
																				})
																			})
																myEmitter.emit('getImmunizationParticipant', objectImmunization, index, newImmunization, countImmunization);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", immunization.data[i], i, newImmunization, immunization.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Immunization is empty."});	
								}
							}else{
								res.json(immunization);
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
		immunization : function addImmunization(req, res){
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

/*status|status||nn
notGiven|notGiven||nn
vaccineCode|vaccineCode||nn
patient|patient||
encounter|encounter||
date|date|date|
primarySource|primarySource|boolean|nn
reportOrigin|reportOrigin||
location|location||
manufacturer|manufacturer||
lotNumber|lotNumber||
expirationDate|expirationDate|date|
site|site||
route|route||
doseQuantity|doseQuantity||
practitioner.role|practitionerRole||
practitioner.actor|practitionerActor||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||
explanation.reason|explanationReason||
explanation.reasonNotGiven|explanationReasonNotGiven||
reaction.date|reactionDate|date|
reaction.detail|reactionDetail|||
reaction.reported|reactionReported|boolean|
vaccinationProtocol.doseSequence|vaccinationProtocolDoseSequence|integer|
vaccinationProtocol.description|vaccinationProtocolDescription||
vaccinationProtocol.authority|vaccinationProtocolAuthority||
vaccinationProtocol.series|vaccinationProtocolSeries||
vaccinationProtocol.seriesDoses|vaccinationProtocolSeriesDoses|integer|
vaccinationProtocol.targetDisease|vaccinationProtocolTargetDisease||
vaccinationProtocol.doseStatus|vaccinationProtocolDoseStatus||
vaccinationProtocol.doseStatusReason|vaccinationProtocolDoseStatusReason||*/
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Immunization status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Immunization request.";
			}

			if(typeof req.body.notGiven !== 'undefined'){
				var notGiven =  req.body.notGiven.trim().toLowerCase();
				if(validator.isEmpty(notGiven)){
					err_code = 2;
					err_msg = "Immunization not given is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not given' in json Immunization request.";
			}

			if(typeof req.body.vaccineCode !== 'undefined'){
				var vaccineCode =  req.body.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(vaccineCode)){
					err_code = 2;
					err_msg = "Immunization vaccine code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccine code' in json Immunization request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Immunization request.";
			}

			if(typeof req.body.encounter !== 'undefined'){
				var encounter =  req.body.encounter.trim().toLowerCase();
				if(validator.isEmpty(encounter)){
					encounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'encounter' in json Immunization request.";
			}

			if(typeof req.body.date !== 'undefined'){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					date = "";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "Immunization date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date' in json Immunization request.";
			}

			if (typeof req.body.primarySource !== 'undefined') {
				var primarySource = req.body.primarySource.trim().toLowerCase();
				if(primarySource === "true" || primarySource === "false"){
					primarySource = primarySource;
				} else {
					err_code = 2;
					err_msg = "Immunization primary source is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'primary source' in json Immunization request.";
			}

			if(typeof req.body.reportOrigin !== 'undefined'){
				var reportOrigin =  req.body.reportOrigin.trim().toLowerCase();
				if(validator.isEmpty(reportOrigin)){
					reportOrigin = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'report origin' in json Immunization request.";
			}

			if(typeof req.body.location !== 'undefined'){
				var location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					location = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'location' in json Immunization request.";
			}

			if(typeof req.body.manufacturer !== 'undefined'){
				var manufacturer =  req.body.manufacturer.trim().toLowerCase();
				if(validator.isEmpty(manufacturer)){
					manufacturer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'manufacturer' in json Immunization request.";
			}

			if(typeof req.body.lotNumber !== 'undefined'){
				var lotNumber =  req.body.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(lotNumber)){
					lotNumber = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'lot number' in json Immunization request.";
			}

			if(typeof req.body.expirationDate !== 'undefined'){
				var expirationDate =  req.body.expirationDate;
				if(validator.isEmpty(expirationDate)){
					expirationDate = "";
				}else{
					if(!regex.test(expirationDate)){
						err_code = 2;
						err_msg = "Immunization expiration date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'expiration date' in json Immunization request.";
			}

			if(typeof req.body.site !== 'undefined'){
				var site =  req.body.site.trim().toUpperCase();
				if(validator.isEmpty(site)){
					site = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Immunization request.";
			}

			if(typeof req.body.route !== 'undefined'){
				var route =  req.body.route.trim().toUpperCase();
				if(validator.isEmpty(route)){
					route = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Immunization request.";
			}

			if(typeof req.body.doseQuantity !== 'undefined'){
				var doseQuantity =  req.body.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(doseQuantity)){
					doseQuantity = "";
				} else {
					if(validator.isInt(doseQuantity)){
						err_code = 2;
						err_msg = "Immunization dose quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose quantity' in json Immunization request.";
			}

			if(typeof req.body.practitioner.role !== 'undefined'){
				var practitionerRole =  req.body.practitioner.role.trim().toUpperCase();
				if(validator.isEmpty(practitionerRole)){
					practitionerRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'practitioner role' in json Immunization request.";
			}

			if(typeof req.body.practitioner.actor !== 'undefined'){
				var practitionerActor =  req.body.practitioner.actor.trim().toLowerCase();
				if(validator.isEmpty(practitionerActor)){
					practitionerActor = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'practitioner actor' in json Immunization request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Immunization request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Immunization request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Immunization request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Immunization request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Immunization note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Immunization request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Immunization request.";
			}

			if(typeof req.body.explanation.reason !== 'undefined'){
				var explanationReason =  req.body.explanation.reason.trim().toLowerCase();
				if(validator.isEmpty(explanationReason)){
					explanationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'explanation reason' in json Immunization request.";
			}

			if(typeof req.body.explanation.reasonNotGiven !== 'undefined'){
				var explanationReasonNotGiven =  req.body.explanation.reasonNotGiven.trim().toUpperCase();
				if(validator.isEmpty(explanationReasonNotGiven)){
					explanationReasonNotGiven = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'explanation reason not given' in json Immunization request.";
			}

			if(typeof req.body.reaction.date !== 'undefined'){
				var reactionDate =  req.body.reaction.date;
				if(validator.isEmpty(reactionDate)){
					reactionDate = "";
				}else{
					if(!regex.test(reactionDate)){
						err_code = 2;
						err_msg = "Immunization reaction date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction date' in json Immunization request.";
			}

			if(typeof req.body.reaction.detail !== 'undefined'){
				var reactionDetail =  req.body.reaction.detail.trim().toLowerCase();
				if(validator.isEmpty(reactionDetail)){
					reactionDetail = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction detail' in json Immunization request.";
			}

			if (typeof req.body.reaction.reported !== 'undefined') {
				var reactionReported = req.body.reaction.reported.trim().toLowerCase();
					if(validator.isEmpty(reactionReported)){
						reactionReported = "false";
					}
				if(reactionReported === "true" || reactionReported === "false"){
					reactionReported = reactionReported;
				} else {
					err_code = 2;
					err_msg = "Immunization reaction reported is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'reaction reported' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.doseSequence !== 'undefined'){
				var vaccinationProtocolDoseSequence =  req.body.vaccinationProtocol.doseSequence;
				if(validator.isEmpty(vaccinationProtocolDoseSequence)){
					vaccinationProtocolDoseSequence = "";
				}else{
					if(validator.isInt(vaccinationProtocolDoseSequence)){
						err_code = 2;
						err_msg = "Immunization vaccination protocol dose sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol dose sequence' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.description !== 'undefined'){
				var vaccinationProtocolDescription =  req.body.vaccinationProtocol.description.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDescription)){
					vaccinationProtocolDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol description' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.authority !== 'undefined'){
				var vaccinationProtocolAuthority =  req.body.vaccinationProtocol.authority.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolAuthority)){
					vaccinationProtocolAuthority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol authority' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.series !== 'undefined'){
				var vaccinationProtocolSeries =  req.body.vaccinationProtocol.series.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolSeries)){
					vaccinationProtocolSeries = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol series' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.seriesDoses !== 'undefined'){
				var vaccinationProtocolSeriesDoses =  req.body.vaccinationProtocol.seriesDoses;
				if(validator.isEmpty(vaccinationProtocolSeriesDoses)){
					vaccinationProtocolSeriesDoses = "";
				}else{
					if(validator.isInt(vaccinationProtocolSeriesDoses)){
						err_code = 2;
						err_msg = "Immunization vaccination protocol series doses is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol series doses' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.targetDisease !== 'undefined'){
				var vaccinationProtocolTargetDisease =  req.body.vaccinationProtocol.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolTargetDisease)){
					vaccinationProtocolTargetDisease = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol target disease' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.doseStatus !== 'undefined'){
				var vaccinationProtocolDoseStatus =  req.body.vaccinationProtocol.doseStatus.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatus)){
					vaccinationProtocolDoseStatus = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol dose status' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.doseStatusReason !== 'undefined'){
				var vaccinationProtocolDoseStatusReason =  req.body.vaccinationProtocol.doseStatusReason.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatusReason)){
					vaccinationProtocolDoseStatusReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol dose status reason' in json Immunization request.";
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
														var immunizationId = 'imm' + unicId;
														var immunizationPractitionerId = 'imp' + unicId;
														var immunizationReactionId = 'imr' + unicId;
														var immunizationVaccinationProtocolId = 'ivp' + unicId;

														dataImmunization = {
															"immunization_id" : immunizationId,
															"status" : status,
															"not_given" : notGiven,
															"veccine_code" : vaccineCode,
															"patient" : patient,
															"encounter" : encounter,
															"date" : date,
															"primary_source" : primarySource,
															"report_origin" : reportOrigin,
															"location" : location,
															"manufacturer" : manufacturer,
															"lot_number" : lotNumber,
															"expiration_date" : expirationDate,
															"site" : site,
															"route" : route,
															"dose_quantity" : doseQuantity,
															"explanation_reason" : explanationReason,
															"explanation_reason_not_given" : explanationReasonNotGiven
														}
														console.log(dataImmunization);
														ApiFHIR.post('immunization', {"apikey": apikey}, {body: dataImmunization, json: true}, function(error, response, body){
															immunization = body;
															if(immunization.err_code > 0){
																res.json(immunization);	
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
																							"care_team_id": immunizationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})

														//ImmunizationPractitioner
														dataImmunizationPractitioner = {
															"practitioner_id" : immunizationPractitionerId,
															"role" : practitionerRole,
															"actor" : practitionerActor,
															"immunization_id" : immunizationId

														}
														ApiFHIR.post('immunizationPractitioner', {"apikey": apikey}, {body: dataImmunizationPractitioner, json: true}, function(error, response, body){
															immunizationPractitioner = body;
															if(immunizationPractitioner.err_code > 0){
																res.json(immunizationPractitioner);	
																console.log("ok");
															}
														});
														
														//ImmunizationReaction
														dataImmunizationReaction = {
															"reaction_id" : immunizationReactionId,
															"date" : reactionDate,
															"detail" : reactionDetail,
															"reported" : reactionReported,
															"immunization_id" : immunizationId

														}
														ApiFHIR.post('immunizationReaction', {"apikey": apikey}, {body: dataImmunizationReaction, json: true}, function(error, response, body){
															immunizationReaction = body;
															if(immunizationReaction.err_code > 0){
																res.json(immunizationReaction);	
																console.log("ok");
															}
														});
														
														//ImmunizationVaccinationProtocol
														dataImmunizationVaccinationProtocol = {
															"vaccination_protocol_id" : immunizationVaccinationProtocolId,
															"dose_sequence" : vaccinationProtocolDoseSequence,
															"description" : vaccinationProtocolDescription,
															"authority" : vaccinationProtocolAuthority,
															"series" : vaccinationProtocolSeries,
															"series_doses" : vaccinationProtocolSeriesDoses,
															"target_disease" : vaccinationProtocolTargetDisease,
															"dose_status" : vaccinationProtocolDoseStatus,
															"dose_status_reason" : vaccinationProtocolDoseStatusReason,
															"immunization_id" : immunizationId

														}
														ApiFHIR.post('immunizationVaccinationProtocol', {"apikey": apikey}, {body: dataImmunizationVaccinationProtocol, json: true}, function(error, response, body){
															immunizationVaccinationProtocol = body;
															if(immunizationVaccinationProtocol.err_code > 0){
																res.json(immunizationVaccinationProtocol);	
																console.log("ok");
															}
														});
														
														res.json({"err_code": 0, "err_msg": "Immunization has been add.", "data": [{"_id": immunizationId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
										status|immunization_status
										vaccineCode|vaccine_code
										reportOrigin|immunization_origin
										site|immunization_site
										route|immunization_route
										practitionerRole|immunization_role
										explanationReason|immunization_reason
										explanationReasonNotGiven|no_immunization_reason
										targetDisease|vaccination_protocol_dose_target
										vaccinationProtocolDoseStatus|vaccination_protocol_dose_status
										vaccinationProtocolDoseStatusReason|vaccination_protocol_dose_status_reason
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'IMMUNIZATION_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkVaccineCode', function () {
											if (!validator.isEmpty(vaccineCode)) {
												checkCode(apikey, vaccineCode, 'VACCINE_CODE', function (resVaccineCodeCode) {
													if (resVaccineCodeCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Vaccine code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkReportOrigin', function () {
											if (!validator.isEmpty(reportOrigin)) {
												checkCode(apikey, reportOrigin, 'IMMUNIZATION_ORIGIN', function (resReportOriginCode) {
													if (resReportOriginCode.err_code > 0) {
														myEmitter.emit('checkVaccineCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Report origin code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkVaccineCode');
											}
										})

										myEmitter.prependOnceListener('checkSite', function () {
											if (!validator.isEmpty(site)) {
												checkCode(apikey, site, 'IMMUNIZATION_SITE', function (resSiteCode) {
													if (resSiteCode.err_code > 0) {
														myEmitter.emit('checkReportOrigin');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReportOrigin');
											}
										})

										myEmitter.prependOnceListener('checkRoute', function () {
											if (!validator.isEmpty(route)) {
												checkCode(apikey, route, 'IMMUNIZATION_ROUTE', function (resRouteCode) {
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

										myEmitter.prependOnceListener('checkPractitionerRole', function () {
											if (!validator.isEmpty(practitionerRole)) {
												checkCode(apikey, practitionerRole, 'IMMUNIZATION_ROLE', function (resPractitionerRoleCode) {
													if (resPractitionerRoleCode.err_code > 0) {
														myEmitter.emit('checkRoute');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Practitioner role code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRoute');
											}
										})

										myEmitter.prependOnceListener('checkExplanationReason', function () {
											if (!validator.isEmpty(explanationReason)) {
												checkCode(apikey, explanationReason, 'IMMUNIZATION_REASON', function (resExplanationReasonCode) {
													if (resExplanationReasonCode.err_code > 0) {
														myEmitter.emit('checkPractitionerRole');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Explanation reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPractitionerRole');
											}
										})

										myEmitter.prependOnceListener('checkExplanationReasonNotGiven', function () {
											if (!validator.isEmpty(explanationReasonNotGiven)) {
												checkCode(apikey, explanationReasonNotGiven, 'NO_IMMUNIZATION_REASON', function (resExplanationReasonNotGivenCode) {
													if (resExplanationReasonNotGivenCode.err_code > 0) {
														myEmitter.emit('checkExplanationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Explanation reason not given code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkExplanationReason');
											}
										})

										myEmitter.prependOnceListener('checkTargetDisease', function () {
											if (!validator.isEmpty(vaccinationProtocolTargetDisease)) {
												checkCode(apikey, vaccinationProtocolTargetDisease, 'VACCINATION_PROTOCOL_DOSE_TARGET', function (resTargetDiseaseCode) {
													if (resTargetDiseaseCode.err_code > 0) {
														myEmitter.emit('checkExplanationReasonNotGiven');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Target disease code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkExplanationReasonNotGiven');
											}
										})

										myEmitter.prependOnceListener('checkDoseStatus', function () {
											if (!validator.isEmpty(vaccinationProtocolDoseStatus)) {
												checkCode(apikey, vaccinationProtocolDoseStatus, 'VACCINATION_PROTOCOL_DOSE_STATUS', function (resDoseStatusCode) {
													if (resDoseStatusCode.err_code > 0) {
														myEmitter.emit('checkTargetDisease');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dose status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkTargetDisease');
											}
										})

										myEmitter.prependOnceListener('checkDoseStatusReason', function () {
											if (!validator.isEmpty(vaccinationProtocolDoseStatusReason)) {
												checkCode(apikey, vaccinationProtocolDoseStatusReason, 'VACCINATION_PROTOCOL_DOSE_STATUS_REASON', function (resDoseStatusReasonCode) {
													if (resDoseStatusReasonCode.err_code > 0) {
														myEmitter.emit('checkDoseStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dose status reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDoseStatus');
											}
										})

										//cek value
										/*
										patient|Patient
										encounter|Encounter
										location|location
										manufacturer|Organization
										practitionerActor|Practtioner
										reactionDetail|Observation
										vaccinationProtocolAuthority|Organization
										*/

										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkDoseStatusReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDoseStatusReason');
											}
										})

										myEmitter.prependOnceListener('checkEncounter', function () {
											if (!validator.isEmpty(encounter)) {
												checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounter, 'ENCOUNTER', function (resEncounter) {
													if (resEncounter.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Encounter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkLocation', function () {
											if (!validator.isEmpty(location)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + location, 'LOCATION', function (resLocation) {
													if (resLocation.err_code > 0) {
														myEmitter.emit('checkEncounter');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Location id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkEncounter');
											}
										})

										myEmitter.prependOnceListener('checkManufacturer', function () {
											if (!validator.isEmpty(manufacturer)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + manufacturer, 'ORGANIZATION', function (resManufacturer) {
													if (resManufacturer.err_code > 0) {
														myEmitter.emit('checkLocation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Manufacturer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkLocation');
											}
										})

										myEmitter.prependOnceListener('checkActor', function () {
											if (!validator.isEmpty(practitionerActor)) {
												checkUniqeValue(apikey, "PRACTTIONER_ID|" + practitionerActor, 'PRACTTIONER', function (resActor) {
													if (resActor.err_code > 0) {
														myEmitter.emit('checkManufacturer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Actor id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkManufacturer');
											}
										})

										myEmitter.prependOnceListener('checkDetail', function () {
											if (!validator.isEmpty(reactionDetail)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + reactionDetail, 'OBSERVATION', function (resDetail) {
													if (resDetail.err_code > 0) {
														myEmitter.emit('checkActor');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Detail id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActor');
											}
										})

										if (!validator.isEmpty(vaccinationProtocolAuthority)) {
											checkUniqeValue(apikey, "ORGANIZATION_ID|" + vaccinationProtocolAuthority, 'ORGANIZATION', function (resAuthority) {
												if (resAuthority.err_code > 0) {
													myEmitter.emit('checkDetail');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Authority id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkDetail');
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
		immunization : function putImmunization(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var immunizationId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataImmunization = {};

			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				dataImmunization.status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Immunization status is required.";
				}else{
					dataImmunization.status = status;
				}
			}else{
				status = "";
			}

			if(typeof req.body.notGiven !== 'undefined' && req.body.notGiven !== ""){
				dataImmunization.notGiven =  req.body.notGiven.trim().toLowerCase();
				if(validator.isEmpty(notGiven)){
					err_code = 2;
					err_msg = "Immunization not given is required.";
				}else{
					dataImmunization.notGiven = notGiven;
				}
			}else{
				notGiven = "";
			}

			if(typeof req.body.vaccineCode !== 'undefined' && req.body.vaccineCode !== ""){
				dataImmunization.vaccineCode =  req.body.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(vaccineCode)){
					err_code = 2;
					err_msg = "Immunization vaccine code is required.";
				}else{
					dataImmunization.vaccineCode = vaccineCode;
				}
			}else{
				vaccineCode = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				dataImmunization.patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					err_code = 2;
					err_msg = "Immunization patient is required.";
				}else{
					dataImmunization.patient = patient;
				}
			}else{
				patient = "";
			}

			if(typeof req.body.encounter !== 'undefined' && req.body.encounter !== ""){
				dataImmunization.encounter =  req.body.encounter.trim().toLowerCase();
				if(validator.isEmpty(encounter)){
					err_code = 2;
					err_msg = "Immunization encounter is required.";
				}else{
					dataImmunization.encounter = encounter;
				}
			}else{
				encounter = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				dataImmunization.date =  req.body.date;
				if(validator.isEmpty(date)){
					err_code = 2;
					err_msg = "immunization date is required.";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "immunization date invalid date format.";	
					}
				}
			}else{
				date = "";
			}

			if (typeof req.body.primarySource !== 'undefined' && req.body.primarySource !== "") {
			        dataImmunization.primarySource = req.body.primarySource.trim().toLowerCase();
			        if(primarySource === "true" || primarySource === "false"){
								dataImmunization.primarySource = primarySource;
			        } else {
			          err_code = 2;
			          err_msg = "Immunization primary source is must be boolean.";
			        }
			      } else {
			        primarySource = "";
			      }

			if(typeof req.body.reportOrigin !== 'undefined' && req.body.reportOrigin !== ""){
				dataImmunization.reportOrigin =  req.body.reportOrigin.trim().toLowerCase();
				if(validator.isEmpty(reportOrigin)){
					err_code = 2;
					err_msg = "Immunization report origin is required.";
				}else{
					dataImmunization.reportOrigin = reportOrigin;
				}
			}else{
				reportOrigin = "";
			}

			if(typeof req.body.location !== 'undefined' && req.body.location !== ""){
				dataImmunization.location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					err_code = 2;
					err_msg = "Immunization location is required.";
				}else{
					dataImmunization.location = location;
				}
			}else{
				location = "";
			}

			if(typeof req.body.manufacturer !== 'undefined' && req.body.manufacturer !== ""){
				dataImmunization.manufacturer =  req.body.manufacturer.trim().toLowerCase();
				if(validator.isEmpty(manufacturer)){
					err_code = 2;
					err_msg = "Immunization manufacturer is required.";
				}else{
					dataImmunization.manufacturer = manufacturer;
				}
			}else{
				manufacturer = "";
			}

			if(typeof req.body.lotNumber !== 'undefined' && req.body.lotNumber !== ""){
				dataImmunization.lotNumber =  req.body.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(lotNumber)){
					err_code = 2;
					err_msg = "Immunization lot number is required.";
				}else{
					dataImmunization.lotNumber = lotNumber;
				}
			}else{
				lotNumber = "";
			}

			if(typeof req.body.expirationDate !== 'undefined' && req.body.expirationDate !== ""){
				dataImmunization.expirationDate =  req.body.expirationDate;
				if(validator.isEmpty(expirationDate)){
					err_code = 2;
					err_msg = "immunization expiration date is required.";
				}else{
					if(!regex.test(expirationDate)){
						err_code = 2;
						err_msg = "immunization expiration date invalid date format.";	
					}
				}
			}else{
				expirationDate = "";
			}

			if(typeof req.body.site !== 'undefined' && req.body.site !== ""){
				dataImmunization.site =  req.body.site.trim().toUpperCase();
				if(validator.isEmpty(site)){
					err_code = 2;
					err_msg = "Immunization site is required.";
				}else{
					dataImmunization.site = site;
				}
			}else{
				site = "";
			}

			if(typeof req.body.route !== 'undefined' && req.body.route !== ""){
				dataImmunization.route =  req.body.route.trim().toUpperCase();
				if(validator.isEmpty(route)){
					err_code = 2;
					err_msg = "Immunization route is required.";
				}else{
					dataImmunization.route = route;
				}
			}else{
				route = "";
			}

			if(typeof req.body.doseQuantity !== 'undefined' && req.body.doseQuantity !== ""){
				dataImmunization.doseQuantity =  req.body.doseQuantity.trim().toLowerCase();
				if(validator.isInt(doseQuantity)){
					err_code = 2;
					err_msg = "Immunization dose quantity is required.";
				}else{
					dataImmunization.doseQuantity = doseQuantity;
				}
			}else{
				doseQuantity = "";
			}

			if(typeof req.body.practitioner.role !== 'undefined' && req.body.practitioner.role !== ""){
				dataImmunization.practitionerRole =  req.body.practitioner.role.trim().toUpperCase();
				if(validator.isEmpty(practitionerRole)){
					err_code = 2;
					err_msg = "Immunization practitioner role is required.";
				}else{
					dataImmunization.practitionerRole = practitionerRole;
				}
			}else{
				practitionerRole = "";
			}

			if(typeof req.body.practitioner.actor !== 'undefined' && req.body.practitioner.actor !== ""){
				dataImmunization.practitionerActor =  req.body.practitioner.actor.trim().toLowerCase();
				if(validator.isEmpty(practitionerActor)){
					err_code = 2;
					err_msg = "Immunization practitioner actor is required.";
				}else{
					dataImmunization.practitionerActor = practitionerActor;
				}
			}else{
				practitionerActor = "";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined' && req.body.note.author.authorReference.practitioner !== ""){
				dataImmunization.noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					err_code = 2;
					err_msg = "Immunization note author author reference practitioner is required.";
				}else{
					dataImmunization.noteAuthorPractitioner = noteAuthorPractitioner;
				}
			}else{
				noteAuthorPractitioner = "";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined' && req.body.note.author.authorReference.patient !== ""){
				dataImmunization.noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					err_code = 2;
					err_msg = "Immunization note author author reference patient is required.";
				}else{
					dataImmunization.noteAuthorPatient = noteAuthorPatient;
				}
			}else{
				noteAuthorPatient = "";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined' && req.body.note.author.authorReference.relatedPerson !== ""){
				dataImmunization.noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					err_code = 2;
					err_msg = "Immunization note author author reference related person is required.";
				}else{
					dataImmunization.noteAuthorRelatedPerson = noteAuthorRelatedPerson;
				}
			}else{
				noteAuthorRelatedPerson = "";
			}

			if(typeof req.body.note.author.authorString !== 'undefined' && req.body.note.author.authorString !== ""){
				dataImmunization.noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					err_code = 2;
					err_msg = "Immunization note author author string is required.";
				}else{
					dataImmunization.noteAuthorAuthorString = noteAuthorAuthorString;
				}
			}else{
				noteAuthorAuthorString = "";
			}

			if(typeof req.body.note.time !== 'undefined' && req.body.note.time !== ""){
				dataImmunization.noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "immunization note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "immunization note time invalid date format.";	
					}
				}
			}else{
				noteTime = "";
			}

			if(typeof req.body.note.text !== 'undefined' && req.body.note.text !== ""){
				dataImmunization.noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					err_code = 2;
					err_msg = "Immunization note text is required.";
				}else{
					dataImmunization.noteText = noteText;
				}
			}else{
				noteText = "";
			}

			if(typeof req.body.explanation.reason !== 'undefined' && req.body.explanation.reason !== ""){
				dataImmunization.explanationReason =  req.body.explanation.reason.trim().toLowerCase();
				if(validator.isEmpty(explanationReason)){
					err_code = 2;
					err_msg = "Immunization explanation reason is required.";
				}else{
					dataImmunization.explanationReason = explanationReason;
				}
			}else{
				explanationReason = "";
			}

			if(typeof req.body.explanation.reasonNotGiven !== 'undefined' && req.body.explanation.reasonNotGiven !== ""){
				dataImmunization.explanationReasonNotGiven =  req.body.explanation.reasonNotGiven.trim().toUpperCase();
				if(validator.isEmpty(explanationReasonNotGiven)){
					err_code = 2;
					err_msg = "Immunization explanation reason not given is required.";
				}else{
					dataImmunization.explanationReasonNotGiven = explanationReasonNotGiven;
				}
			}else{
				explanationReasonNotGiven = "";
			}

			if(typeof req.body.reaction.date !== 'undefined' && req.body.reaction.date !== ""){
				dataImmunization.reactionDate =  req.body.reaction.date;
				if(validator.isEmpty(reactionDate)){
					err_code = 2;
					err_msg = "immunization reaction date is required.";
				}else{
					if(!regex.test(reactionDate)){
						err_code = 2;
						err_msg = "immunization reaction date invalid date format.";	
					}
				}
			}else{
				reactionDate = "";
			}

			if(typeof req.body.reaction.detail !== 'undefined' && req.body.reaction.detail !== ""){
				dataImmunization.reactionDetail =  req.body.reaction.detail.trim().toLowerCase();
				if(validator.isEmpty(reactionDetail)){
					err_code = 2;
					err_msg = "Immunization reaction detail is required.";
				}else{
					dataImmunization.reactionDetail = reactionDetail;
				}
			}else{
				reactionDetail = "";
			}

			if (typeof req.body.reaction.reported !== 'undefined' && req.body.reaction.reported !== "") {
				dataImmunization.reactionReported = req.body.reaction.reported.trim().toLowerCase();
				if(reactionReported === "true" || reactionReported === "false"){
					dataImmunization.reactionReported = reactionReported;
				} else {
					err_code = 2;
					err_msg = "Immunization reaction reported is must be boolean.";
				}
			} else {
				reactionReported = "";
			}

			if(typeof req.body.vaccinationProtocol.doseSequence !== 'undefined' && req.body.vaccinationProtocol.doseSequence !== ""){
				dataImmunization.vaccinationProtocolDoseSequence =  req.body.vaccinationProtocol.doseSequence;
				if(validator.isInt(vaccinationProtocolDoseSequence)){
					err_code = 2;
					err_msg = "immunization vaccination protocol dose sequence is must be number.";
				}
			}else{
				vaccinationProtocolDoseSequence = "";
			}

			if(typeof req.body.vaccinationProtocol.description !== 'undefined' && req.body.vaccinationProtocol.description !== ""){
				dataImmunization.vaccinationProtocolDescription =  req.body.vaccinationProtocol.description.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDescription)){
					err_code = 2;
					err_msg = "Immunization vaccination protocol description is required.";
				}else{
					dataImmunization.vaccinationProtocolDescription = vaccinationProtocolDescription;
				}
			}else{
				vaccinationProtocolDescription = "";
			}

			if(typeof req.body.vaccinationProtocol.authority !== 'undefined' && req.body.vaccinationProtocol.authority !== ""){
				dataImmunization.vaccinationProtocolAuthority =  req.body.vaccinationProtocol.authority.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolAuthority)){
					err_code = 2;
					err_msg = "Immunization vaccination protocol authority is required.";
				}else{
					dataImmunization.vaccinationProtocolAuthority = vaccinationProtocolAuthority;
				}
			}else{
				vaccinationProtocolAuthority = "";
			}

			if(typeof req.body.vaccinationProtocol.series !== 'undefined' && req.body.vaccinationProtocol.series !== ""){
				dataImmunization.vaccinationProtocolSeries =  req.body.vaccinationProtocol.series.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolSeries)){
					err_code = 2;
					err_msg = "Immunization vaccination protocol series is required.";
				}else{
					dataImmunization.vaccinationProtocolSeries = vaccinationProtocolSeries;
				}
			}else{
				vaccinationProtocolSeries = "";
			}

			if(typeof req.body.vaccinationProtocol.seriesDoses !== 'undefined' && req.body.vaccinationProtocol.seriesDoses !== ""){
				dataImmunization.vaccinationProtocolSeriesDoses =  req.body.vaccinationProtocol.seriesDoses;
				if(validator.isInt(vaccinationProtocolSeriesDoses)){
					err_code = 2;
					err_msg = "immunization vaccination protocol series doses is must be number.";
				}
			}else{
				vaccinationProtocolSeriesDoses = "";
			}

			if(typeof req.body.vaccinationProtocol.targetDisease !== 'undefined' && req.body.vaccinationProtocol.targetDisease !== ""){
				dataImmunization.vaccinationProtocolTargetDisease =  req.body.vaccinationProtocol.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolTargetDisease)){
					err_code = 2;
					err_msg = "Immunization vaccination protocol target disease is required.";
				}else{
					dataImmunization.vaccinationProtocolTargetDisease = vaccinationProtocolTargetDisease;
				}
			}else{
				vaccinationProtocolTargetDisease = "";
			}

			if(typeof req.body.vaccinationProtocol.doseStatus !== 'undefined' && req.body.vaccinationProtocol.doseStatus !== ""){
				dataImmunization.vaccinationProtocolDoseStatus =  req.body.vaccinationProtocol.doseStatus.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatus)){
					err_code = 2;
					err_msg = "Immunization vaccination protocol dose status is required.";
				}else{
					dataImmunization.vaccinationProtocolDoseStatus = vaccinationProtocolDoseStatus;
				}
			}else{
				vaccinationProtocolDoseStatus = "";
			}

			if(typeof req.body.vaccinationProtocol.doseStatusReason !== 'undefined' && req.body.vaccinationProtocol.doseStatusReason !== ""){
				dataImmunization.vaccinationProtocolDoseStatusReason =  req.body.vaccinationProtocol.doseStatusReason.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatusReason)){
					err_code = 2;
					err_msg = "Immunization vaccination protocol dose status reason is required.";
				}else{
					dataImmunization.vaccinationProtocolDoseStatusReason = vaccinationProtocolDoseStatusReason;
				}
			}else{
				vaccinationProtocolDoseStatusReason = "";
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
														var immunizationId = 'ade' + unicId;

														dataImmunization = {
															"adverse_event_id" : immunizationId,
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
														console.log(dataImmunization);
														ApiFHIR.post('immunization', {"apikey": apikey}, {body: dataImmunization, json: true}, function(error, response, body){
															immunization = body;
															if(immunization.err_code > 0){
																res.json(immunization);	
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
																							"adverse_event_id": immunizationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})*/

														res.json({"err_code": 0, "err_msg": "Care Team has been update.", "data": [{"_id": immunizationId}]});

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