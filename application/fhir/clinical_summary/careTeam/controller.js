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
		careTeam : function getCareTeam(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			/*var careTeamId = req.query._id;
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

			if(typeof careTeamId !== 'undefined'){
				if(!validator.isEmpty(careTeamId)){
					qString.careTeamId = careTeamId; 
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
				"CareTeam" : {
					"location": "%(apikey)s/CareTeam",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('CareTeam', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var careTeam = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(careTeam.err_code == 0){
								//cek jumdata dulu
								if(careTeam.data.length > 0){
									newCareTeam = [];
									for(i=0; i < careTeam.data.length; i++){
										myEmitter.once("getIdentifier", function(careTeam, index, newCareTeam, countCareTeam){
											/*console.log(careTeam);*/
														//get identifier
														qString = {};
														qString.care_team_id = careTeam.id;
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
																var objectCareTeam = {};
																objectCareTeam.resourceType = careTeam.resourceType;
																objectCareTeam.id = careTeam.id;
																objectCareTeam.identifier = identifier.data;
																objectCareTeam.status = careTeam.status;
																objectCareTeam.category = careTeam.category;
																objectCareTeam.name = careTeam.name;
																objectCareTeam.subject = careTeam.subject;
																objectCareTeam.context = careTeam.context;
																objectCareTeam.period = careTeam.period;
																objectCareTeam.reasonCode = careTeam.reasonCode;
																
																newCareTeam[index] = objectCareTeam;
																
																/*if(index == countCareTeam -1 ){
																	res.json({"err_code": 0, "data":newCareTeam});				
																}
*/
																myEmitter.once('getCareTeamParticipant', function(careTeam, index, newCareTeam, countCareTeam){
																				qString = {};
																				qString.care_team_id = careTeam.id;
																				seedPhoenixFHIR.path.GET = {
																					"CareTeamParticipant" : {
																						"location": "%(apikey)s/CareTeamParticipant",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('CareTeamParticipant', {"apikey": apikey}, {}, function(error, response, body){
																					careTeamParticipant = JSON.parse(body);
																					if(careTeamParticipant.err_code == 0){
																						var objectCareTeam = {};
																						objectCareTeam.resourceType = careTeam.resourceType;
																						objectCareTeam.id = careTeam.id;
																						objectCareTeam.identifier = careTeam.identifier;
																						objectCareTeam.status = careTeam.status;
																						objectCareTeam.category = careTeam.category;
																						objectCareTeam.name = careTeam.name;
																						objectCareTeam.subject = careTeam.subject;
																						objectCareTeam.context = careTeam.context;
																						objectCareTeam.period = careTeam.period;
																						objectCareTeam.participant = careTeamParticipant.data;
																						objectCareTeam.reasonCode = careTeam.reasonCode;

																						newCareTeam[index] = objectCareTeam;

																						/*if(index == countCareTeam -1 ){
																							res.json({"err_code": 0, "data":newCareTeam});				
																						}*/
																						myEmitter.once('getReasonReference', function(careTeam, index, newCareTeam, countCareTeam){
																							qString = {};
																							qString.care_team_id = careTeam.id;
																							seedPhoenixFHIR.path.GET = {
																								"ReasonReference" : {
																									"location": "%(apikey)s/CareTeamCondition",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ReasonReference', {"apikey": apikey}, {}, function(error, response, body){
																								reasonReference = JSON.parse(body);
																								console.log(reasonReference);
																								if(reasonReference.err_code == 0){
																									var objectCareTeam = {};
															objectCareTeam.resourceType = careTeam.resourceType;
															objectCareTeam.id = careTeam.id;
															objectCareTeam.identifier = careTeam.identifier;
															objectCareTeam.status = careTeam.status;
															objectCareTeam.category = careTeam.category;
															objectCareTeam.name = careTeam.name;
															objectCareTeam.subject = careTeam.subject;
															objectCareTeam.context = careTeam.context;
															objectCareTeam.period = careTeam.period;
															objectCareTeam.participant = careTeam.participant;
															objectCareTeam.reasonCode = careTeam.reasonCode;								
															objectCareTeam.reasonReference = reasonReference.data;

																									newCareTeam[index] = objectCareTeam;

																									myEmitter.once('getManagingOrganization', function(careTeam, index, newCareTeam, countCareTeam){
																										qString = {};
																										qString.care_team_id = careTeam.id;
																										seedPhoenixFHIR.path.GET = {
																											"ManagingOrganization" : {
																												"location": "%(apikey)s/CareTeamOrganization",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('ManagingOrganization', {"apikey": apikey}, {}, function(error, response, body){
																											managingOrganization = JSON.parse(body);
																											if(managingOrganization.err_code == 0){
																												var objectCareTeam = {};
														objectCareTeam.resourceType = careTeam.resourceType;
														objectCareTeam.id = careTeam.id;
														objectCareTeam.identifier = careTeam.identifier;
														objectCareTeam.status = careTeam.status;
														objectCareTeam.category = careTeam.category;
														objectCareTeam.name = careTeam.name;
														objectCareTeam.subject = careTeam.subject;
														objectCareTeam.context = careTeam.context;
														objectCareTeam.period = careTeam.period;
														objectCareTeam.participant = careTeam.participant;
														objectCareTeam.reasonCode = careTeam.reasonCode;
														objectCareTeam.reasonReference = careTeam.reasonReference;
														objectCareTeam.managingOrganization = managingOrganization.data;

																												newCareTeam[index] = objectCareTeam;

																												myEmitter.once('getAnnotation', function(careTeam, index, newCareTeam, countCareTeam){
																													qString = {};
																													qString.care_team_id = careTeam.id;
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
																															var objectCareTeam = {};
																objectCareTeam.resourceType = careTeam.resourceType;
																objectCareTeam.id = careTeam.id;
																objectCareTeam.identifier = careTeam.identifier;
																objectCareTeam.status = careTeam.status;
																objectCareTeam.category = careTeam.category;
																objectCareTeam.name = careTeam.name;
																objectCareTeam.subject = careTeam.subject;
																objectCareTeam.context = careTeam.context;
																objectCareTeam.period = careTeam.period;
																objectCareTeam.participant = careTeam.participant;
																objectCareTeam.reasonCode = careTeam.reasonCode;
																objectCareTeam.reasonReference = careTeam.reasonReference;
																objectCareTeam.managingOrganization = careTeam.managingOrganization;
																objectCareTeam.note = note.data;

																															newCareTeam[index] = objectCareTeam;

																															if(index == countCareTeam -1 ){
																																res.json({"err_code": 0, "data":newCareTeam});				
																															}

																														}else{
																															res.json(note);			
																														}
																													})
																												})
																												myEmitter.emit('getAnnotation', objectCareTeam, index, newCareTeam, countCareTeam);			
																											}else{
																												res.json(managingOrganization);			
																											}
																										})
																									})
																									myEmitter.emit('getManagingOrganization', objectCareTeam, index, newCareTeam, countCareTeam);			
																								}else{
																									res.json(reasonReference);			
																								}
																							})
																						})
																						myEmitter.emit('getReasonReference', objectCareTeam, index, newCareTeam, countCareTeam);
																					}else{
																						res.json(careTeamParticipant);			
																					}
																				})
																			})
																myEmitter.emit('getCareTeamParticipant', objectCareTeam, index, newCareTeam, countCareTeam);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", careTeam.data[i], i, newCareTeam, careTeam.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Care Team is empty."});	
								}
							}else{
								res.json(careTeam);
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
		careTeam : function addCareTeam(req, res){
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

/*status|status||
category|category||
name|name||
subject.patient|subjectPatient||
subject.group|subjectGroup||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
period|period|period|
participant.role|participantRole||
participant.member.practitioner|participantMemberPractitioner||
participant.member.relatedPerson|participantMemberRelatedPerson||
participant.member.patient|participantMemberPatient||
participant.member.organization|participantMemberOrganization||
participant.member.careTeam|participantMemberCareTeam||
participant.onBehalfOf|participantOnBehalfOf||
participant.period|participantPeriod|period|
reasonCode|reasonCode||
reasonReference|reasonReference||
managingOrganization|managingOrganization||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||*/
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Care Plan request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Care Plan request.";
			}

			if(typeof req.body.name !== 'undefined'){
				var name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					name = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'name' in json Care Plan request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Care Plan request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Care Plan request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Care Plan request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Care Plan request.";
			}

			if (typeof req.body.period !== 'undefined') {
			  var period = req.body.period;
 				if(validator.isEmpty(period)) {
				  var periodStart = "";
				  var periodEnd = "";
				} else {
				  if (period.indexOf("to") > 0) {
				    arrPeriod = period.split("to");
				    var periodStart = arrPeriod[0];
				    var periodEnd = arrPeriod[1];
				    if (!regex.test(periodStart) && !regex.test(periodEnd)) {
				      err_code = 2;
				      err_msg = "Care Plan period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Care Plan period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'period' in json Care Plan request.";
			}

			if(typeof req.body.participant.role !== 'undefined'){
				var participantRole =  req.body.participant.role.trim().toLowerCase();
				if(validator.isEmpty(participantRole)){
					participantRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant role' in json Care Plan request.";
			}

			if(typeof req.body.participant.member.practitioner !== 'undefined'){
				var participantMemberPractitioner =  req.body.participant.member.practitioner.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPractitioner)){
					participantMemberPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member practitioner' in json Care Plan request.";
			}

			if(typeof req.body.participant.member.relatedPerson !== 'undefined'){
				var participantMemberRelatedPerson =  req.body.participant.member.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(participantMemberRelatedPerson)){
					participantMemberRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member related person' in json Care Plan request.";
			}

			if(typeof req.body.participant.member.patient !== 'undefined'){
				var participantMemberPatient =  req.body.participant.member.patient.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPatient)){
					participantMemberPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member patient' in json Care Plan request.";
			}

			if(typeof req.body.participant.member.organization !== 'undefined'){
				var participantMemberOrganization =  req.body.participant.member.organization.trim().toLowerCase();
				if(validator.isEmpty(participantMemberOrganization)){
					participantMemberOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member organization' in json Care Plan request.";
			}

			if(typeof req.body.participant.member.careTeam !== 'undefined'){
				var participantMemberCareTeam =  req.body.participant.member.careTeam.trim().toLowerCase();
				if(validator.isEmpty(participantMemberCareTeam)){
					participantMemberCareTeam = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member care team' in json Care Plan request.";
			}

			if(typeof req.body.participant.onBehalfOf !== 'undefined'){
				var participantOnBehalfOf =  req.body.participant.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(participantOnBehalfOf)){
					participantOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant on behalf of' in json Care Plan request.";
			}

			if (typeof req.body.participant.period !== 'undefined') {
			  var participantPeriod = req.body.participant.period;
 				if(validator.isEmpty(participantPeriod)) {
				  var participantPeriodStart = "";
				  var participantPeriodEnd = "";
				} else {
				  if (participantPeriod.indexOf("to") > 0) {
				    arrParticipantPeriod = participantPeriod.split("to");
				    var participantPeriodStart = arrParticipantPeriod[0];
				    var participantPeriodEnd = arrParticipantPeriod[1];
				    if (!regex.test(participantPeriodStart) && !regex.test(participantPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Care Plan participant period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Care Plan participant period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'participant period' in json Care Plan request.";
			}

			if(typeof req.body.reasonCode !== 'undefined'){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					reasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Care Plan request.";
			}

			if(typeof req.body.reasonReference !== 'undefined'){
				var reasonReference =  req.body.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(reasonReference)){
					reasonReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference' in json Care Plan request.";
			}

			if(typeof req.body.managingOrganization !== 'undefined'){
				var managingOrganization =  req.body.managingOrganization.trim().toLowerCase();
				if(validator.isEmpty(managingOrganization)){
					managingOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'managing organization' in json Care Plan request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Care Plan request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Care Plan request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Care Plan request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Care Plan request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Care Plan note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Care Plan request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Care Plan request.";
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
														var careTeamId = 'cte' + unicId;
														var careTeamParticipantId = 'ctp' + unicId;

														dataCareTeam = {
															"care_team_id" : careTeamId,
															"status" : status,
															"category" : category,
															"name" : name,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"period_start" : periodStart,
															"period_end" : periodEnd,
															"reason_code" : reasonCode
														}
														console.log(dataCareTeam);
														ApiFHIR.post('careTeam', {"apikey": apikey}, {body: dataCareTeam, json: true}, function(error, response, body){
															careTeam = body;
															if(careTeam.err_code > 0){
																res.json(careTeam);	
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
																							"care_team_id": careTeamId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})

														//CareTeamParticipant
														dataCareTeamParticipant = {
															"participant_id" : careTeamParticipantId,
															"role" : participantRole,
															"member_practitioner" : participantMemberPractitioner,
															"member_related_person" : participantMemberRelatedPerson,
															"member_patient" : participantMemberPatient,
															"member_organization" : participantMemberOrganization,
															"member_care_team" : participantMemberCareTeam,
															"on_behalf_of" : participantOnBehalfOf,
															"period_start" : participantPeriodStart,
															"period_end" : participantPeriodEnd,
															"care_team_id" : careTeamId

														}
														ApiFHIR.post('careTeamParticipant', {"apikey": apikey}, {body: dataCareTeamParticipant, json: true}, function(error, response, body){
															careTeamParticipant = body;
															if(careTeamParticipant.err_code > 0){
																res.json(careTeamParticipant);	
																console.log("ok");
															}
														});
														res.json({"err_code": 0, "err_msg": "Care Team has been add.", "data": [{"_id": careTeamId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
										status|CARE_TEAM_status
										category|CARE_TEAM_CATEGORY
										participantRole|PARTICIPANT_ROLE
										reasonCode|CLINICAL_FINDINGS
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'CARE_TEAM_STATUS', function (resStatusCode) {
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
												checkCode(apikey, category, 'CARE_TEAM_CATEGORY', function (resCategoryCode) {
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

										myEmitter.prependOnceListener('checkParticipantRole', function () {
											if (!validator.isEmpty(participantRole)) {
												checkCode(apikey, participantRole, 'PARTICIPANT_ROLE', function (resParticipantRoleCode) {
													if (resParticipantRoleCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant role code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkReasonCode', function () {
											if (!validator.isEmpty(reasonCode)) {
												checkCode(apikey, reasonCode, 'CLINICAL_FINDINGS', function (resReasonCodeCode) {
													if (resReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkParticipantRole');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkParticipantRole');
											}
										})


										//cek value
										/*
										subjectPatient|Patient
										subjectGroup|Group
										contextEncounter|Encounter
										contextEpisodeOfCare|Episode_Of_Care
										participantMemberPractitioner|Practitioner
										participantMemberRelatedPerson|Related_Person
										participantMemberPatient|Patient
										participantMemberOrganization|Organization
										participantMemberCareTeam|Care_Team
										reasonReference|Condition
										managingOrganization|Organization
										*/

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkSubjectGroup', function () {
											if (!validator.isEmpty(subjectGroup)) {
												checkUniqeValue(apikey, "GROUP_ID|" + subjectGroup, 'GROUP', function (resSubjectGroup) {
													if (resSubjectGroup.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject group id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkContextEncounter', function () {
											if (!validator.isEmpty(contextEncounter)) {
												checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounter, 'ENCOUNTER', function (resContextEncounter) {
													if (resContextEncounter.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context encounter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkContextEpisodeOfCare', function () {
											if (!validator.isEmpty(contextEpisodeOfCare)) {
												checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + contextEpisodeOfCare, 'EPISODE_OF_CARE', function (resContextEpisodeOfCare) {
													if (resContextEpisodeOfCare.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context episode of care id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkParticipantMemberPractitioner', function () {
											if (!validator.isEmpty(participantMemberPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + participantMemberPractitioner, 'PRACTITIONER', function (resParticipantMemberPractitioner) {
													if (resParticipantMemberPractitioner.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkParticipantMemberRelatedPerson', function () {
											if (!validator.isEmpty(participantMemberRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + participantMemberRelatedPerson, 'RELATED_PERSON', function (resParticipantMemberRelatedPerson) {
													if (resParticipantMemberRelatedPerson.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkParticipantMemberPatient', function () {
											if (!validator.isEmpty(participantMemberPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + participantMemberPatient, 'PATIENT', function (resParticipantMemberPatient) {
													if (resParticipantMemberPatient.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkParticipantMemberOrganization', function () {
											if (!validator.isEmpty(participantMemberOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + participantMemberOrganization, 'ORGANIZATION', function (resParticipantMemberOrganization) {
													if (resParticipantMemberOrganization.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkParticipantMemberCareTeam', function () {
											if (!validator.isEmpty(participantMemberCareTeam)) {
												checkUniqeValue(apikey, "CARE_TEAM_ID|" + participantMemberCareTeam, 'CARE_TEAM', function (resParticipantMemberCareTeam) {
													if (resParticipantMemberCareTeam.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member care team id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkReasonReference', function () {
											if (!validator.isEmpty(reasonReference)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + reasonReference, 'CONDITION', function (resReasonReference) {
													if (resReasonReference.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										if (!validator.isEmpty(managingOrganization)) {
											checkUniqeValue(apikey, "ORGANIZATION_ID|" + managingOrganization, 'ORGANIZATION', function (resManagingOrganization) {
												if (resManagingOrganization.err_code > 0) {
													myEmitter.emit('checkCategory');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Managing organization id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkCategory');
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
		careTeam : function putCareTeam(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var careTeamId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataCareTeam = {};

			if(typeof careTeamId !== 'undefined'){
				if(validator.isEmpty(careTeamId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				dataCarePlan.status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Care plan status is required.";
				}else{
					dataCarePlan.status = status;
				}
			}else{
				status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				dataCarePlan.category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					err_code = 2;
					err_msg = "Care plan category is required.";
				}else{
					dataCarePlan.category = category;
				}
			}else{
				category = "";
			}

			if(typeof req.body.name !== 'undefined' && req.body.name !== ""){
				dataCarePlan.name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					err_code = 2;
					err_msg = "Care plan name is required.";
				}else{
					dataCarePlan.name = name;
				}
			}else{
				name = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				dataCarePlan.subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					err_code = 2;
					err_msg = "Care plan subject patient is required.";
				}else{
					dataCarePlan.subjectPatient = subjectPatient;
				}
			}else{
				subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				dataCarePlan.subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					err_code = 2;
					err_msg = "Care plan subject group is required.";
				}else{
					dataCarePlan.subjectGroup = subjectGroup;
				}
			}else{
				subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				dataCarePlan.contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					err_code = 2;
					err_msg = "Care plan context encounter is required.";
				}else{
					dataCarePlan.contextEncounter = contextEncounter;
				}
			}else{
				contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				dataCarePlan.contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					err_code = 2;
					err_msg = "Care plan context episode of care is required.";
				}else{
					dataCarePlan.contextEpisodeOfCare = contextEpisodeOfCare;
				}
			}else{
				contextEpisodeOfCare = "";
			}

			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
			  var period = req.body.period;
			  if (period.indexOf("to") > 0) {
			    arrPeriod = period.split("to");
			    dataCarePlan.periodStart = arrPeriod[0];
			    dataCarePlan.periodEnd = arrPeriod[1];
			    if (!regex.test(periodStart) && !regex.test(periodEnd)) {
			      err_code = 2;
			      err_msg = "care plan period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "care plan period invalid date format.";
				}
			} else {
				period = "";
			}

			if(typeof req.body.participant.role !== 'undefined' && req.body.participant.role !== ""){
				dataCarePlan.participantRole =  req.body.participant.role.trim().toLowerCase();
				if(validator.isEmpty(participantRole)){
					err_code = 2;
					err_msg = "Care plan participant role is required.";
				}else{
					dataCarePlan.participantRole = participantRole;
				}
			}else{
				participantRole = "";
			}

			if(typeof req.body.participant.member.practitioner !== 'undefined' && req.body.participant.member.practitioner !== ""){
				dataCarePlan.participantMemberPractitioner =  req.body.participant.member.practitioner.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPractitioner)){
					err_code = 2;
					err_msg = "Care plan participant member practitioner is required.";
				}else{
					dataCarePlan.participantMemberPractitioner = participantMemberPractitioner;
				}
			}else{
				participantMemberPractitioner = "";
			}

			if(typeof req.body.participant.member.relatedPerson !== 'undefined' && req.body.participant.member.relatedPerson !== ""){
				dataCarePlan.participantMemberRelatedPerson =  req.body.participant.member.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(participantMemberRelatedPerson)){
					err_code = 2;
					err_msg = "Care plan participant member related person is required.";
				}else{
					dataCarePlan.participantMemberRelatedPerson = participantMemberRelatedPerson;
				}
			}else{
				participantMemberRelatedPerson = "";
			}

			if(typeof req.body.participant.member.patient !== 'undefined' && req.body.participant.member.patient !== ""){
				dataCarePlan.participantMemberPatient =  req.body.participant.member.patient.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPatient)){
					err_code = 2;
					err_msg = "Care plan participant member patient is required.";
				}else{
					dataCarePlan.participantMemberPatient = participantMemberPatient;
				}
			}else{
				participantMemberPatient = "";
			}

			if(typeof req.body.participant.member.organization !== 'undefined' && req.body.participant.member.organization !== ""){
				dataCarePlan.participantMemberOrganization =  req.body.participant.member.organization.trim().toLowerCase();
				if(validator.isEmpty(participantMemberOrganization)){
					err_code = 2;
					err_msg = "Care plan participant member organization is required.";
				}else{
					dataCarePlan.participantMemberOrganization = participantMemberOrganization;
				}
			}else{
				participantMemberOrganization = "";
			}

			if(typeof req.body.participant.member.careTeam !== 'undefined' && req.body.participant.member.careTeam !== ""){
				dataCarePlan.participantMemberCareTeam =  req.body.participant.member.careTeam.trim().toLowerCase();
				if(validator.isEmpty(participantMemberCareTeam)){
					err_code = 2;
					err_msg = "Care plan participant member care team is required.";
				}else{
					dataCarePlan.participantMemberCareTeam = participantMemberCareTeam;
				}
			}else{
				participantMemberCareTeam = "";
			}

			if(typeof req.body.participant.onBehalfOf !== 'undefined' && req.body.participant.onBehalfOf !== ""){
				dataCarePlan.participantOnBehalfOf =  req.body.participant.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(participantOnBehalfOf)){
					err_code = 2;
					err_msg = "Care plan participant on behalf of is required.";
				}else{
					dataCarePlan.participantOnBehalfOf = participantOnBehalfOf;
				}
			}else{
				participantOnBehalfOf = "";
			}

			if (typeof req.body.participant.period !== 'undefined' && req.body.participant.period !== "") {
			  var participantPeriod = req.body.participant.period;
			  if (participantPeriod.indexOf("to") > 0) {
			    arrParticipantPeriod = participantPeriod.split("to");
			    dataCarePlan.participantPeriodStart = arrParticipantPeriod[0];
			    dataCarePlan.participantPeriodEnd = arrParticipantPeriod[1];
			    if (!regex.test(participantPeriodStart) && !regex.test(participantPeriodEnd)) {
			      err_code = 2;
			      err_msg = "care plan participant period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "care plan participant period invalid date format.";
				}
			} else {
				participantPeriod = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				dataCarePlan.reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					err_code = 2;
					err_msg = "Care plan reason code is required.";
				}else{
					dataCarePlan.reasonCode = reasonCode;
				}
			}else{
				reasonCode = "";
			}

			if(typeof req.body.reasonReference !== 'undefined' && req.body.reasonReference !== ""){
				dataCarePlan.reasonReference =  req.body.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(reasonReference)){
					err_code = 2;
					err_msg = "Care plan reason reference is required.";
				}else{
					dataCarePlan.reasonReference = reasonReference;
				}
			}else{
				reasonReference = "";
			}

			if(typeof req.body.managingOrganization !== 'undefined' && req.body.managingOrganization !== ""){
				dataCarePlan.managingOrganization =  req.body.managingOrganization.trim().toLowerCase();
				if(validator.isEmpty(managingOrganization)){
					err_code = 2;
					err_msg = "Care plan managing organization is required.";
				}else{
					dataCarePlan.managingOrganization = managingOrganization;
				}
			}else{
				managingOrganization = "";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined' && req.body.note.author.authorReference.practitioner !== ""){
				dataCarePlan.noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					err_code = 2;
					err_msg = "Care plan note author author reference practitioner is required.";
				}else{
					dataCarePlan.noteAuthorPractitioner = noteAuthorPractitioner;
				}
			}else{
				noteAuthorPractitioner = "";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined' && req.body.note.author.authorReference.patient !== ""){
				dataCarePlan.noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					err_code = 2;
					err_msg = "Care plan note author author reference patient is required.";
				}else{
					dataCarePlan.noteAuthorPatient = noteAuthorPatient;
				}
			}else{
				noteAuthorPatient = "";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined' && req.body.note.author.authorReference.relatedPerson !== ""){
				dataCarePlan.noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					err_code = 2;
					err_msg = "Care plan note author author reference related person is required.";
				}else{
					dataCarePlan.noteAuthorRelatedPerson = noteAuthorRelatedPerson;
				}
			}else{
				noteAuthorRelatedPerson = "";
			}

			if(typeof req.body.note.author.authorString !== 'undefined' && req.body.note.author.authorString !== ""){
				dataCarePlan.noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					err_code = 2;
					err_msg = "Care plan note author author string is required.";
				}else{
					dataCarePlan.noteAuthorAuthorString = noteAuthorAuthorString;
				}
			}else{
				noteAuthorAuthorString = "";
			}

			if(typeof req.body.note.time !== 'undefined' && req.body.note.time !== ""){
				dataCarePlan.noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "care plan note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "care plan note time invalid date format.";	
					}
				}
			}else{
				noteTime = "";
			}

			if(typeof req.body.note.text !== 'undefined' && req.body.note.text !== ""){
				dataCarePlan.noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					err_code = 2;
					err_msg = "Care plan note text is required.";
				}else{
					dataCarePlan.noteText = noteText;
				}
			}else{
				noteText = "";
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
													var careTeamId = 'ade' + unicId;
													
													dataCareTeam = {
														"adverse_event_id" : careTeamId,
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
													console.log(dataCareTeam);
													ApiFHIR.post('careTeam', {"apikey": apikey}, {body: dataCareTeam, json: true}, function(error, response, body){
														careTeam = body;
														if(careTeam.err_code > 0){
															res.json(careTeam);	
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
																						"adverse_event_id": careTeamId
																					}

													ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
														identifier = body;
														if(identifier.err_code > 0){
															res.json(identifier);	
														}
													})*/

													res.json({"err_code": 0, "err_msg": "Care Team has been update.", "data": [{"_id": careTeamId}]});
												
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