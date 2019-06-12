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
				appointment: function getAppointment(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var appointmentId = req.query._id;
					var appointmentActor = req.query.actor;
					var appointmentType = req.query.appointment_type;
					var appointmentDate = req.query.date;
					var appointmentReferralRequest = req.query.incoming_referral;
					var appointmentActorLocation = req.query.location;
					var appointmentParticipantStatus = req.query.part_status;
					var appointmentActorPatient = req.query.patient;
					var appointmentActorPractitioner = req.query.practitioner;
					var appointmentServiceType = req.query.service_type;
					var appointmentStatus = req.query.status;
					var offset = req.query.offset;
					var limit = req.query.limit;
					
					var qString = {};
					if(typeof appointmentId !== 'undefined'){
						if(!validator.isEmpty(appointmentId)){
							qString._id = appointmentId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Appointment ID is required."})
						}
					}

					if(typeof appointmentActor !== 'undefined'){
						if(!validator.isEmpty(appointmentActor)){
							qString.actor = appointmentActor; 
						}else{
							res.json({"err_code": 1, "err_msg": "Actor is empty."});
						}
					}

					if(typeof appointmentType !== 'undefined'){
						if(!validator.isEmpty(appointmentType)){
							qString.appointment_type = appointmentType; 
						}else{
							res.json({"err_code": 1, "err_msg": "Appointment Type is empty."});
						}
					}

					if(typeof appointmentDate !== 'undefined'){
						if(!validator.isEmpty(appointmentDate)){
							if(!regex.test(appointmentDate)){
								res.json({"err_code": 1, "err_msg": "Date invalid format."});
							}else{
								qString.date = appointmentDate; 
							}	
						}else{
							res.json({"err_code": 1, "err_msg": "Date is empty."});
						}
					}

					if(typeof appointmentReferralRequest !== 'undefined'){
						if(!validator.isEmpty(appointmentReferralRequest)){
							qString.referral_request = appointmentReferralRequest; 
						}else{
							res.json({"err_code": 1, "err_msg": "Referral Request is empty."});
						}
					}

					if(typeof appointmentActorLocation !== 'undefined'){
						if(!validator.isEmpty(appointmentActorLocation)){
							qString.location = appointmentActorLocation; 
						}else{
							res.json({"err_code": 1, "err_msg": "Location is empty."});
						}
					}

					if(typeof appointmentActorPatient !== 'undefined'){
						if(!validator.isEmpty(appointmentActorPatient)){
							qString.patient = appointmentActorPatient; 
						}else{
							res.json({"err_code": 1, "err_msg": "Patient is empty."});
						}
					}

					if(typeof appointmentActorPractitioner !== 'undefined'){
						if(!validator.isEmpty(appointmentActorPractitioner)){
							qString.practitioner = appointmentActorPractitioner; 
						}else{
							res.json({"err_code": 1, "err_msg": "Practitioner is empty."});
						}
					}

					if(typeof appointmentParticipantStatus !== 'undefined'){
						if(!validator.isEmpty(appointmentParticipantStatus)){
							qString.participant_status = appointmentParticipantStatus; 
						}else{
							res.json({"err_code": 1, "err_msg": "Participant Status is empty."});
						}
					}

					if(typeof appointmentServiceType !== 'undefined'){
						if(!validator.isEmpty(appointmentServiceType)){
							qString.service_type = appointmentServiceType; 
						}else{
							res.json({"err_code": 1, "err_msg": "Service Type is empty."});
						}
					}

					if(typeof appointmentStatus !== 'undefined'){
						if(!validator.isEmpty(appointmentStatus)){
							qString.status = appointmentStatus; 
						}else{
							res.json({"err_code": 1, "err_msg": "Status is empty."});
						}
					}
					
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
					
					seedPhoenixFHIR.path.GET = {
						"Appointment" : {
							"location": "%(apikey)s/Appointment",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('Appointment', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var appointment = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(appointment.err_code == 0){
								  	//cek jumdata dulu
								  	if(appointment.data.length > 0){
								  		newAppointment = [];
								  		for(i=0; i < appointment.data.length; i++){
								  			myEmitter.prependOnceListener("getAppointmentParticipant", function(appointment, index, newAppointment, countAppointment){
									  			qString = {};
									  			qString.appointment_id = appointment.id;
										  		seedPhoenixFHIR.path.GET = {
														"AppointmentParticipant" : {
															"location": "%(apikey)s/AppointmentParticipant",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get("AppointmentParticipant", {"apikey": apikey}, {}, function(error, response, body){
														appointmentParticipant = JSON.parse(body);
														if(appointmentParticipant.err_code == 0){
															var objectAppointment = {};
															objectAppointment.resourceType = appointment.resourceType;
															objectAppointment.id = appointment.id;
															objectAppointment.status = appointment.status;
															objectAppointment.serviceCategory = appointment.serviceCategory;
															objectAppointment.serviceType = appointment.serviceType;
															objectAppointment.specialty = appointment.specialty;
															objectAppointment.appointmentType = appointment.appointmentType;
															objectAppointment.reason = appointment.reason;
															objectAppointment.indication = appointment.indication;
															objectAppointment.priority = appointment.priority;
															objectAppointment.description = appointment.description;
															objectAppointment.supportingInformation = appointment.supportingInformation;
															objectAppointment.start = appointment.start;
															objectAppointment.end = appointment.end;
															objectAppointment.minutesDuration = appointment.minutesDuration;
															objectAppointment.slot = appointment.slot;
															objectAppointment.created = appointment.created;
															objectAppointment.comment = appointment.comment;
															objectAppointment.incomingReferral = appointment.incomingReferral;
															objectAppointment.participant = appointmentParticipant.data;
															objectAppointment.requestedPeriod = appointment.requestedPeriod;
										          
															newAppointment[index] = objectAppointment;

															if(index == countAppointment -1 ){
																res.json({"err_code": 0, "data":newAppointment});				
															}
															// myEmitter.prependOnceListener("getIdentifier", function(person, index, newPerson, countPerson){
															// 	//get identifier
												  	// 		qString = {};
												  	// 		qString.person_id = person.id;
													  // 		seedPhoenixFHIR.path.GET = {
															// 		"Identifier" : {
															// 			"location": "%(apikey)s/Identifier",
															// 			"query": qString
															// 		}
															// 	}
															// 	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															// 	ApiFHIR.get('Identifier', {"apikey": apikey}, {}, function(error, response, body){
															// 		identifier = JSON.parse(body);
															// 		if(identifier.err_code == 0){
															// 			var objectPerson = {};
															// 			objectPerson.resourceType = person.resourceType;
															// 			objectPerson.id = person.id;
															// 			objectPerson.identifier = identifier.data;
															// 			objectPerson.gender = person.gender;
															// 			objectPerson.birthDate = person.birthDate;
															// 			objectPerson.photo = person.photo;
															// 			objectPerson.active = person.active;

															// 			newPerson[index] = objectPerson

															// 			//human_name
															// 			myEmitter.prependOnceListener('getHumanName', function(person, index, newPerson, countPerson){
															// 				qString = {};
															//   			qString.person_id = person.id;
															// 	  		seedPhoenixFHIR.path.GET = {
															// 					"HumanName" : {
															// 						"location": "%(apikey)s/HumanName",
															// 						"query": qString
															// 					}
															// 				}

															// 				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															// 				ApiFHIR.get('HumanName', {"apikey": apikey}, {}, function(error, response, body){
															// 					humanName = JSON.parse(body);
															// 					if(humanName.err_code == 0){
															// 						var objectPerson = {};
															// 						objectPerson.resourceType = person.resourceType;
															// 						objectPerson.id = person.id;
															// 						objectPerson.identifier = person.identifier;
															// 						objectPerson.name = humanName.data;
															// 						objectPerson.gender = person.gender;
															// 						objectPerson.birthDate = person.birthDate;
															// 						objectPerson.photo = person.photo;
															// 						objectPerson.active = person.active;


															// 						newPerson[index] = objectPerson;
																					
															// 						myEmitter.prependOnceListener('getContactPoint', function(person, index, newPerson, countPerson){
															// 							qString = {};
															// 			  			qString.person_id = person.id;
															// 				  		seedPhoenixFHIR.path.GET = {
															// 								"ContactPoint" : {
															// 									"location": "%(apikey)s/ContactPoint",
															// 									"query": qString
															// 								}
															// 							}

															// 							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															// 							ApiFHIR.get('ContactPoint', {"apikey": apikey}, {}, function(error, response, body){
															// 								contactPoint = JSON.parse(body);
															// 								if(contactPoint.err_code == 0){
															// 									var objectPerson = {};
															// 									objectPerson.resourceType = person.resourceType;
															// 									objectPerson.id = person.id;
															// 									objectPerson.identifier = person.identifier;
															// 									objectPerson.name = person.name;
															// 									objectPerson.telecom = contactPoint.data;
															// 									objectPerson.gender = person.gender;
															// 									objectPerson.birthDate = person.birthDate;
															// 									objectPerson.photo = person.photo;
															// 									objectPerson.active = person.active;

															// 									newPerson[index] = objectPerson;
																								
															// 									myEmitter.prependOnceListener('getAddress', function(person, index, newPerson, countPerson){
															// 										qString = {};
															// 						  			qString.person_id = person.id;
															// 							  		seedPhoenixFHIR.path.GET = {
															// 											"Address" : {
															// 												"location": "%(apikey)s/Address",
															// 												"query": qString
															// 											}
															// 										}

															// 										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															// 										ApiFHIR.get('Address', {"apikey": apikey}, {}, function(error, response, body){
															// 											address = JSON.parse(body);
																										
															// 											if(address.err_code == 0){
															// 												var objectPerson = {};
															// 												objectPerson.resourceType = person.resourceType;
															// 												objectPerson.id = person.id;
															// 												objectPerson.identifier = person.identifier;
															// 												objectPerson.name = person.name;
															// 												objectPerson.telecom = person.telecom;
															// 												objectPerson.gender = person.gender;
															// 												objectPerson.birthDate = person.birthDate;
															// 												objectPerson.address = address.data;
															// 												objectPerson.photo = person.photo;
															// 												objectPerson.active = person.active;

															// 												newPerson[index] = objectPerson;

															// 												myEmitter.prependOnceListener('getPersonLink', function(person, index, newPerson, countPerson){
															// 													qString = {};
															// 									  			qString.person_id = person.id;
															// 										  		seedPhoenixFHIR.path.GET = {
															// 														"PersonLink" : {
															// 															"location": "%(apikey)s/PersonLink",
															// 															"query": qString
															// 														}
															// 													}

															// 													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															// 													ApiFHIR.get('PersonLink', {"apikey": apikey}, {}, function(error, response, body){
															// 														personLink = JSON.parse(body);
																													
															// 														if(personLink.err_code == 0){
															// 															var objectPerson = {};
															// 															objectPerson.resourceType = person.resourceType;
															// 															objectPerson.id = person.id;
															// 															objectPerson.identifier = person.identifier;
															// 															objectPerson.name = person.name;
															// 															objectPerson.telecom = person.telecom;
															// 															objectPerson.gender = person.gender;
															// 															objectPerson.birthDate = person.birthDate;
															// 															objectPerson.address = person.address;
															// 															objectPerson.photo = person.photo;
															// 															objectPerson.active = person.active;
															// 															objectPerson.link = personLink.data;

															// 															newPerson[index] = objectPerson;
															// 															if(index == countPerson -1 ){
															// 																res.json({"err_code": 0, "data":newPerson});				
															// 															}
															// 														}else{
															// 															res.json(personLink);			
															// 														}
															// 													})
															// 												})

															// 												myEmitter.emit('getPersonLink', objectPerson, index, newPerson, countPerson);	
															// 											}else{
															// 												res.json(address);			
															// 											}
															// 										})
															// 									})
															// 									myEmitter.emit('getAddress', objectPerson, index, newPerson, countPerson);			
															// 								}else{
															// 									res.json(contactPoint);			
															// 								}
															// 							})
															// 						})
															// 						myEmitter.emit('getContactPoint', objectPerson, index, newPerson, countPerson);
															// 					}else{
															// 						res.json(humanName);			
															// 					}
															// 				})
															// 			})
															// 			myEmitter.emit('getHumanName', objectPerson, index, newPerson, countPerson);
															// 		}else{
															// 			res.json(identifier);
															// 		}
															// 	})
															// })
															// myEmitter.emit("getIdentifier", objectPerson, index, newPerson, countPerson);
														}else{
															res.json(appointmentParticipant);
														}
													})
								  			})
												myEmitter.emit("getAppointmentParticipant", appointment.data[i], i, newAppointment, appointment.data.length);
								  		}
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Appointment is empty."});	
								  	}
							  	}else{
							  		res.json(appointment);
							  	}
							  }
							});
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				appointmentParticipant: function getAppointmentParticipant(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var appointmentId = req.params.appointment_id;
					var participantId = req.params.participant_id;
					
					var qString = {};
					if(typeof appointmentId !== 'undefined'){
						if(!validator.isEmpty(appointmentId)){
							qString.appointment_id = appointmentId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Appointment ID is required."})
						}
					}

					if(typeof participantId !== 'undefined'){
						if(!validator.isEmpty(participantId)){
							qString._id = participantId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Appointment ID is required."})
						}
					}
					
					seedPhoenixFHIR.path.GET = {
						"AppointmentParticipant" : {
							"location": "%(apikey)s/AppointmentParticipant",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('AppointmentParticipant', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var appointmentParticipant = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(appointmentParticipant.err_code == 0){
								  	//cek jumdata dulu
								  	if(appointmentParticipant.data.length > 0){
								  		res.json({"err_code": 0, "data": appointmentParticipant.data});	
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Participant is empty."});	
								  	}
							  	}else{
							  		res.json(appointmentParticipant);
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
				appointment: function addAppointment(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof req.body.status !== 'undefined'){
						appointmentStatus =  req.body.status;
						if(validator.isEmpty(appointmentStatus)){
							err_code = 2;
							err_msg = "Appointment Status is required.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'status' in json request.";
					}

					if(typeof req.body.service_category !== 'undefined'){
						appointmentServiceCategory =  req.body.service_category;
						if(!validator.isInt(appointmentServiceCategory)){
							err_code = 2;
							err_msg = "Service category is number";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'service_category' in json request.";
					}

					if(typeof req.body.service_type !== 'undefined'){
						appointmentServiceType =  req.body.service_type;
						if(!validator.isInt(appointmentServiceType)){
							err_code = 2;
							err_msg = "Service type is number";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'service_type' in json request.";
					}

					if(typeof req.body.specialty !== 'undefined'){
						appointmentSpecialty =  req.body.specialty;
						if(validator.isEmpty(appointmentSpecialty)){
							err_code = 2;
							err_msg = "Specialty is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'specialty' in json request.";
					} 
					
					if(typeof req.body.appointment_type !== 'undefined'){
						appointmentType =  req.body.appointment_type;
						if(validator.isEmpty(appointmentType)){
							err_code = 2;
							err_msg = "Appointment Type is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'appointment_type' in json request.";
					} 

					if(typeof req.body.reason !== 'undefined'){
						appointmentReason =  req.body.reason;
						if(!validator.isInt(appointmentReason)){
							err_code = 2;
							err_msg = "Reason Code is number.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'reason' in json request.";
					}

					if(typeof req.body.indication !== 'undefined'){
						indicationConditionId = req.body.indication.condition_id;
						indicationProcedureId = req.body.indication.procedure_id;

						if(validator.isEmpty(indicationConditionId)){
							indicationConditionId = "";	
						}

						if(validator.isEmpty(indicationProcedureId)){
							indicationProcedureId = "";	
						}
					}else{
						indicationConditionId = "";
						indicationProcedureId = "";
					} 

					if(typeof req.body.priority !== 'undefined'){
						appointmentPriority = req.body.priority;
						if(!validator.isInt(appointmentPriority)){
							err_code = 2;
							err_msg = "Priority is number.";
						}						
					}else{
						err_code = 1;
						err_msg = "Please add key 'priority' in json request.";
					}

					if(typeof req.body.description !== 'undefined'){
						appointmentDescription = req.body.description;
						if(validator.isEmpty(appointmentDescription)){
							err_code = 2;
							err_msg = "Description is required.";
						}						
					}else{
						err_code = 1;
						err_msg = "Please add key 'description' in json request.";
					}

					if(typeof req.body.supporting_information !== 'undefined'){
						supportingInformation = req.body.supporting_information;
						if(validator.isEmpty(supportingInformation)){
							supportingInformation = "";
						}						
					}else{
						supportingInformation = "";
					}

					if(typeof req.body.start !== 'undefined'){
						appointmentStart = req.body.start;
						if(validator.isEmpty(appointmentStart)){
							err_code = 2;
							err_msg = "Start is required.";
						}else{
							if(!regex.test(appointmentStart)){
								err_code = 2;
								err_msg = "Appointment Start invalid date time format.";
							}
						}						
					}else{
						err_code = 1;
						err_msg = "Please add key 'start' in json request.";
					}

					if(typeof req.body.end !== 'undefined'){
						appointmentEnd = req.body.end;
						if(validator.isEmpty(appointmentEnd)){
							err_code = 2;
							err_msg = "End is required.";
						}else{
							if(!regex.test(appointmentEnd)){
								err_code = 2;
								err_msg = "Appointment End invalid date time format.";
							}
						}						
					}else{
						err_code = 1;
						err_msg = "Please add key 'end' in json request.";
					}

					if(typeof req.body.minutes_duration !== 'undefined'){
						minutesDuration = req.body.minutes_duration;
						if(!validator.isInt(minutesDuration)){
							err_code = 2;
							err_msg = "Minutes duration is number.";
						}						
					}else{
						err_code = 1;
						err_msg = "Please add key 'minutes_duration' in json request.";
					}

					if(typeof req.body.slot_id !== 'undefined'){
						slotId = req.body.slot_id;
						if(validator.isEmpty(slotId)){
							slotId = "";
						}						
					}else{
						slotId = "";
					}

					if(typeof req.body.referral_request_id !== 'undefined'){
						referralRequestId = req.body.referral_request_id;
						if(validator.isEmpty(referralRequestId)){
							referralRequestId = "";
						}						
					}else{
						referralRequestId = "";
					}

					if(typeof req.body.comment !== 'undefined'){
						appointmentComment = req.body.comment;
						if(validator.isEmpty(appointmentComment)){
							err_code = 2;
							err_msg = "Comment is required.";
						}						
					}else{
						err_code = 1;
						err_msg = "Please add key 'comment' in json request.";	
					}

					if(typeof req.body.participant !== 'undefined'){
						if(typeof req.body.participant.type !== 'undefined'){
							participantType = req.body.participant.type;
							if(validator.isEmpty(participantType)){
								err_code = 2;
								err_msg = "Participant type is empty.";		
							}
						}else{
							err_code = 1;
							err_msg = "Please add sub-key 'type' in participant json request.";	
						}

						if(typeof req.body.participant.actor.patient_id !== 'undefined'){
							participantActorPatientId = req.body.participant.actor.patient_id;
							if(validator.isEmpty(participantActorPatientId)){
								participantActorPatientId = "";
							}
						}else{
							err_code = 1;
							err_msg = "Please add sub-key 'actor.patient_id' in participant json request.";	
						}

						if(typeof req.body.participant.actor.practitioner_id !== 'undefined'){
							participantActorPractitionerId = req.body.participant.actor.practitioner_id;
							if(validator.isEmpty(participantActorPractitionerId)){
								participantActorPractitionerId = "";
							}
						}else{
							err_code = 1;
							err_msg = "Please add sub-key 'actor.practitioner_id' in participant json request.";	
						}

						if(typeof req.body.participant.actor.related_person_id !== 'undefined'){
							participantActorRelatedPersonId = req.body.participant.actor.related_person_id;
							if(validator.isEmpty(participantActorRelatedPersonId)){
								participantActorRelatedPersonId = "";
							}
						}else{
							err_code = 1;
							err_msg = "Please add sub-key 'actor.related_person_id' in participant json request.";	
						}

						if(typeof req.body.participant.actor.device_id !== 'undefined'){
							participantActorDeviceId = req.body.participant.actor.device_id;
							if(validator.isEmpty(participantActorDeviceId)){
								participantActorDeviceId = "";
							}
						}else{
							err_code = 1;
							err_msg = "Please add sub-key 'actor.device_id' in participant json request.";	
						}

						if(typeof req.body.participant.actor.healthcare_service_id !== 'undefined'){
							participantActorHealthcareServiceId = req.body.participant.actor.healthcare_service_id;
							if(validator.isEmpty(participantActorHealthcareServiceId)){
								participantActorHealthcareServiceId = "";
							}
						}else{
							err_code = 1;
							err_msg = "Please add sub-key 'actor.healthcare_service_id' in participant json request.";	
						}

						if(typeof req.body.participant.actor.location_id !== 'undefined'){
							participantActorLocationId = req.body.participant.actor.location_id;
							if(validator.isEmpty(participantActorLocationId)){
								participantActorLocationId = "";
							}
						}else{
							err_code = 1;
							err_msg = "Please add sub-key 'actor.location_id' in participant json request.";	
						}

						if(validator.isEmpty(participantActorPatientId) && validator.isEmpty(participantActorPractitionerId) && validator.isEmpty(participantActorRelatedPersonId) && validator.isEmpty(participantActorDeviceId) && validator.isEmpty(participantActorHealthcareServiceId) && validator.isEmpty(participantActorLocationId)){
							err_code = 2;
							err_msg = "Please fill in one of participant actor.";		
						}

						if(typeof req.body.participant.required !== 'undefined'){
							participantRequired = req.body.participant.required;
							if(validator.isEmpty(participantRequired)){
								err_code = 2;
								err_msg = "Participant required code is empty.";			
							}
						}else{
							err_code = 1;
							err_msg = "Please add sub-key 'required' in participant json request.";	
						}

						if(typeof req.body.participant.status !== 'undefined'){
							participantStatus = req.body.participant.status;
							if(validator.isEmpty(participantStatus)){
								err_code = 2;
								err_msg = "Participant status code is empty.";			
							}
						}else{
							err_code = 1;
							err_msg = "Please add sub-key 'status' in participant json request.";	
						}

					}else{
						err_code = 1;
						err_msg = "Please add key 'participant' in json request.";
					}

					if(typeof req.body.requested_period !== 'undefined'){
						period = req.body.requested_period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							requestedPeriodStart = arrPeriod[0];
							requestedPeriodEnd = arrPeriod[1];
							
							if(!regex.test(requestedPeriodStart) && !regex.test(requestedPeriodEnd)){
								err_code = 2;
								err_msg = "Requeste Period invalid date format.";
							}	
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'requested_period' in json request.";
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkCode(apikey, appointmentStatus, 'APPOINTMENT_STATUS', function(resAppointmentStatusCode){
									if(resAppointmentStatusCode.err_code > 0){
										checkCode(apikey, appointmentServiceCategory, 'SERVICE_CATEGORY', function(resServiceCategoryCode){
											if(resServiceCategoryCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, appointmentServiceType, 'SERVICE_TYPE', function(resServiceTypeCode){
													if(resServiceTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
														checkCode(apikey, appointmentSpecialty, 'PRACTICE_CODE', function(resPracticeCode){
															if(resPracticeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																checkCode(apikey, appointmentType, 'APPOINTMENT_REASON_CODE', function(resAppointmentTypeCode){
																	if(resAppointmentTypeCode.err_code > 0){
																		checkCode(apikey, appointmentReason, 'ENCOUNTER_REASON', function(resReasonCode){
																			if(resReasonCode.err_code > 0){
																				//add schedule
																				myEmitter.prependOnceListener('addAppointment', function(){
																					var appointmentId = 'app' + uniqid.time();
																					var appointmentParticipantId = 'ap' + uniqid.time();

																					var dataAppointment = {
																																"id": appointmentId,
																																"status": appointmentStatus,
																																"service_category": appointmentServiceCategory,
																																"service_type": appointmentServiceType,
																																"specialty": appointmentSpecialty,
																																"appointment_type": appointmentType,
																																"reason": appointmentReason,
																																// "condition_id": indicationConditionId, perlu update ke condition id
																																// "procedure_id": indicationProcedureId, perlu update ke procedure id 
																																"priority": appointmentPriority,
																																"description": appointmentDescription,
																																// "supporting_information": supportingInformation, perlu explore supaya bisa dinamis
																																"star": appointmentStart,
																																"end": appointmentEnd,
																																"minutes_duration": minutesDuration,
																																// "slot_id": slotId, perlu update ke slot id
																																"created": getFormattedDate(),
																																"comment": appointmentComment,
																																// "referral_request_id": referralRequestId, perlu update ke referral request id
																																"requested_period_start": requestedPeriodStart,
																																"requested_period_end": requestedPeriodEnd,
																															}

																					var dataAppointmentParticipant = {
																																						"id": appointmentParticipantId,
																																						"type": participantType,
																																						"actor_patient_id": participantActorPatientId,
																																						"actor_practitioner_id": participantActorPractitionerId,
																																						"actor_related_person_id": participantActorRelatedPersonId,
																																						"actor_device_id": participantActorDeviceId,
																																						"actor_healthcare_service_id": participantActorHealthcareServiceId,
																																						"actor_location_id": participantActorLocationId,
																																						"required": participantRequired,
																																						"status": participantStatus,
																																						"appointment_id": appointmentId
																																					}
																					
																					//method, endpoint, params, options, callback
																					ApiFHIR.post('appointment', {"apikey": apikey}, {body: dataAppointment, json:true}, function(error, response, body){	
																				  	var appointment = body; //object
																				  	//cek apakah ada error atau tidak
																				  	if(appointment.err_code > 0){
																				  		res.json(appointment);
																				  	}
																					})

																					ApiFHIR.post('appointmentParticipant', {"apikey": apikey}, {body: dataAppointmentParticipant, json:true}, function(error, response, body){	
																				  	var appointmentParticipant = body; //object
																				  	//cek apakah ada error atau tidak
																				  	if(appointmentParticipant.err_code > 0){
																				  		res.json(appointment);
																				  	}
																					})

																					res.json({"err_code": 0, "err_msg": "Appointment has been add.", "data": [{"_id": appointmentId}]});
																				})

																				//participation status
																				myEmitter.prependOnceListener('checkParticipantStatusCode', function(){
																					checkCode(apikey, participantStatus, 'PARTICIPATION_STATUS', function(resParticipantRequiredCode){
																						if(resParticipantRequiredCode.err_code > 0){
																							myEmitter.emit('addAppointment');
																						}else{
																							res.json({"err_code": 517, "err_msg": "Participant Required code not found"});		
																						}
																					})	
																				})

																				//participant required
																				myEmitter.prependOnceListener('checkParticipantRequiredCode', function(){
																					checkCode(apikey, participantRequired, 'PARTICIPANT_REQUIRED', function(resParticipantRequiredCode){
																						if(resParticipantRequiredCode.err_code > 0){
																							myEmitter.emit('checkParticipantStatusCode');
																						}else{
																							res.json({"err_code": 517, "err_msg": "Participant Required code not found"});		
																						}
																					})	
																				})

																				//participant type
																				myEmitter.prependOnceListener('checkParticipantTypeCode', function(){
																					checkCode(apikey, participantType, 'ENCOUNTER_PARTICIPANT_TYPE', function(resParticipantTypeCode){
																						if(resParticipantTypeCode.err_code > 0){
																							myEmitter.emit('checkParticipantRequiredCode');
																						}else{
																							res.json({"err_code": 517, "err_msg": "Participant Type code not found"});		
																						}
																					})	
																				})

																				//actor location
																				myEmitter.prependOnceListener('checkActorLocationId', function(){
																					if(validator.isEmpty(participantActorLocationId)){
																						myEmitter.emit('checkParticipantTypeCode');
																					}else{
																						checkUniqeValue(apikey, "LOCATION_ID|" + participantActorLocationId, 'LOCATION', function(resLocationID){
																							if(resLocationID.err_code > 0){
																								myEmitter.emit('checkParticipantTypeCode');
																							}else{
																								res.json({"err_code": 516, "err_msg": "Location Id not found"});		
																							}
																						})
																					}
																				})

																				//actor healthcare service
																				myEmitter.prependOnceListener('checkActorHealthcareServiceId', function(){
																					if(validator.isEmpty(participantActorHealthcareServiceId)){
																						myEmitter.emit('checkActorLocationId');
																					}else{
																						checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + participantActorHealthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealtcareServiceID){
																							if(resHealtcareServiceID.err_code > 0){
																								myEmitter.emit('checkActorLocationId');
																							}else{
																								res.json({"err_code": 515, "err_msg": "Healthcare Service Id not found"});		
																							}
																						})
																					}
																				})

																				//actor device
																				myEmitter.prependOnceListener('checkActorDeviceId', function(){
																					if(validator.isEmpty(participantActorDeviceId)){
																						myEmitter.emit('checkActorHealthcareServiceId');
																					}else{
																						checkUniqeValue(apikey, "DEVICE_ID|" + participantActorDeviceId, 'DEVICE', function(resDeviceID){
																							if(resDeviceID.err_code > 0){
																								myEmitter.emit('checkActorHealthcareServiceId');
																							}else{
																								res.json({"err_code": 514, "err_msg": "Device Id not found"});		
																							}
																						})
																					}
																				})

																				//actor related person
																				myEmitter.prependOnceListener('checkActorRelatedPersonId', function(){
																					if(validator.isEmpty(participantActorRelatedPersonId)){
																						myEmitter.emit('checkActorDeviceId');
																					}else{
																						checkUniqeValue(apikey, "RELATED_PERSON_ID|" + participantActorRelatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
																							if(resRelatedPersonID.err_code > 0){
																								myEmitter.emit('checkActorDeviceId');
																							}else{
																								res.json({"err_code": 513, "err_msg": "Related Person Id not found"});		
																							}
																						})
																					}
																				})

																				//actor practitioner
																				myEmitter.prependOnceListener('checkActorPractitionerId', function(){
																					if(validator.isEmpty(participantActorPractitionerId)){
																						myEmitter.emit('checkActorRelatedPersonId');
																					}else{
																						checkUniqeValue(apikey, "PRACTITIONER_ID|" + participantActorPractitionerId, 'PRACTITIONER', function(resPractitionerID){
																							if(resPractitionerID.err_code > 0){
																								myEmitter.emit('checkActorRelatedPersonId');
																							}else{
																								res.json({"err_code": 512, "err_msg": "Practitioner Id not found"});		
																							}
																						})
																					}
																				})

																				//actor patient
																				myEmitter.prependOnceListener('checkActorPatientId', function(){
																					if(validator.isEmpty(participantActorPatientId)){
																						myEmitter.emit('checkActorPractitionerId');
																					}else{
																						checkUniqeValue(apikey, "PATIENT_ID|" + participantActorPatientId, 'PATIENT', function(resPatientID){
																							if(resPatientID.err_code > 0){
																								myEmitter.emit('checkActorPractitionerId');
																							}else{
																								res.json({"err_code": 511, "err_msg": "Patient Id not found"});		
																							}
																						})
																					}
																				})

																				//referral request
																				myEmitter.prependOnceListener('checkReferralRequestId', function(){
																					if(validator.isEmpty(referralRequestId)){
																						myEmitter.emit('checkActorPatientId');
																					}else{
																						checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + referralRequestId, 'REFERRAL_REQUEST', function(resReferralRequestID){
																							if(resReferralRequestID.err_code > 0){
																								myEmitter.emit('checkActorPatientId');
																							}else{
																								res.json({"err_code": 510, "err_msg": "Referral Request Id not found"});		
																							}
																						})
																					}
																				})

																				//slot 
																				myEmitter.prependOnceListener('checkSlotId', function(){
																					if(validator.isEmpty(slotId)){
																						myEmitter.emit('checkReferralRequestId');
																					}else{
																						checkUniqeValue(apikey, "SLOT_ID|" + slotId, 'SLOT', function(resSlotID){
																							if(resSlotID.err_code > 0){
																								myEmitter.emit('checkReferralRequestId');
																							}else{
																								res.json({"err_code": 509, "err_msg": "Slot Id not found"});		
																							}
																						})
																					}
																				})

																				//procedure
																				myEmitter.prependOnceListener('checkIndicationProcedureId', function(){
																					if(validator.isEmpty(indicationProcedureId)){
																						myEmitter.emit('checkSlotId');
																					}else{
																						checkUniqeValue(apikey, "PROCEDURE_ID|" + actorPatientId, 'PROCEDURE', function(resProcedureID){
																							if(resProcedureID.err_code > 0){
																								myEmitter.emit('checkSlotId');
																							}else{
																								res.json({"err_code": 508, "err_msg": "Procedure Id not found"});		
																							}
																						})
																					}
																				})
																				
																				//condition
																				if(validator.isEmpty(indicationConditionId)){
																					myEmitter.emit('checkIndicationProcedureId');
																				}else{
																					checkUniqeValue(apikey, "CONDITION_ID|" + indicationConditionId, 'CONDITION', function(resConditionID){
																						if(resConditionID.err_code > 0){
																							myEmitter.emit('checkIndicationProcedureId');
																						}else{
																							res.json({"err_code": 507, "err_msg": "Condition Id not found"});		
																						}
																					})
																				}
																			}else{
																				res.json({"err_code": 506, "err_msg": "Reason code not found"});				
																			}
																		})
																	}else{
																		res.json({"err_code": 505, "err_msg": "Appointment type code not found"});		
																	}
																})
															}else{
																res.json({"err_code": 504, "err_msg": "Specialty code not found"});		
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Service type code not found"});		
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Service category code not found"});
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Appointment status code not found"});
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
				appointmentParticipant: function addAppointmentParticipant(req, res){
					var appointmentId = req.params.appointment_id;
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";

					if(typeof req.body.type !== 'undefined'){
						participantType = req.body.type;
						if(validator.isEmpty(participantType)){
							err_code = 2;
							err_msg = "Participant type is empty.";		
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'type' in json request.";	
					}

					if(typeof req.body.actor.patient_id !== 'undefined'){
						participantActorPatientId = req.body.actor.patient_id;
						if(validator.isEmpty(participantActorPatientId)){
							participantActorPatientId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'patient_id' in actor json request.";	
					}

					if(typeof req.body.actor.practitioner_id !== 'undefined'){
						participantActorPractitionerId = req.body.actor.practitioner_id;
						if(validator.isEmpty(participantActorPractitionerId)){
							participantActorPractitionerId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'practitioner_id' in actor json request.";	
					}

					if(typeof req.body.actor.related_person_id !== 'undefined'){
						participantActorRelatedPersonId = req.body.actor.related_person_id;
						if(validator.isEmpty(participantActorRelatedPersonId)){
							participantActorRelatedPersonId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'related_person_id' in actor json request.";	
					}

					if(typeof req.body.actor.device_id !== 'undefined'){
						participantActorDeviceId = req.body.actor.device_id;
						if(validator.isEmpty(participantActorDeviceId)){
							participantActorDeviceId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'device_id' in actor json request.";	
					}

					if(typeof req.body.actor.healthcare_service_id !== 'undefined'){
						participantActorHealthcareServiceId = req.body.actor.healthcare_service_id;
						if(validator.isEmpty(participantActorHealthcareServiceId)){
							participantActorHealthcareServiceId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'healthcare_service_id' in actor json request.";	
					}

					if(typeof req.body.actor.location_id !== 'undefined'){
						participantActorLocationId = req.body.actor.location_id;
						if(validator.isEmpty(participantActorLocationId)){
							participantActorLocationId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'location_id' in actor json request.";	
					}

					if(validator.isEmpty(participantActorPatientId) && validator.isEmpty(participantActorPractitionerId) && validator.isEmpty(participantActorRelatedPersonId) && validator.isEmpty(participantActorDeviceId) && validator.isEmpty(participantActorHealthcareServiceId) && validator.isEmpty(participantActorLocationId)){
						err_code = 2;
						err_msg = "Please fill in one of participant actor.";		
					}

					if(typeof req.body.required !== 'undefined'){
						participantRequired = req.body.required;
						if(validator.isEmpty(participantRequired)){
							err_code = 2;
							err_msg = "Participant required code is empty.";			
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'required' in json request.";	
					}

					if(typeof req.body.status !== 'undefined'){
						participantStatus = req.body.status;
						if(validator.isEmpty(participantStatus)){
							err_code = 2;
							err_msg = "Participant status code is empty.";			
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'status' in json request.";	
					}


					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								//add schedule
								myEmitter.prependOnceListener('addAppointmentParticipant', function(){
									checkUniqeValue(apikey, "APPOINTMENT_ID|" + appointmentId, 'APPOINTMENT', function(resAppointmentID){
										if(resAppointmentID.err_code > 0){
											var appointmentParticipantId = 'ap' + uniqid.time();
											var dataAppointmentParticipant = {
																												"id": appointmentParticipantId,
																												"type": participantType,
																												"actor_patient_id": participantActorPatientId,
																												"actor_practitioner_id": participantActorPractitionerId,
																												"actor_related_person_id": participantActorRelatedPersonId,
																												"actor_device_id": participantActorDeviceId,
																												"actor_healthcare_service_id": participantActorHealthcareServiceId,
																												"actor_location_id": participantActorLocationId,
																												"required": participantRequired,
																												"status": participantStatus,
																												"appointment_id": appointmentId
																											}
											
											//method, endpoint, params, options, callback
											ApiFHIR.post('appointmentParticipant', {"apikey": apikey}, {body: dataAppointmentParticipant, json:true}, function(error, response, body){	
										  	var appointmentParticipant = body; //object
										  	//cek apakah ada error atau tidak
										  	if(appointmentParticipant.err_code == 0){
										  		res.json({"err_code": 0, "err_msg": "Participant has been add in this apppointment.", "data": [{"_id": appointmentParticipantId}]});
										  	}else{
										  		res.json(appointmentParticipant);
										  	}
											})
										}else{
											res.json({"err_code": 517, "err_msg": "Appointment Id not found"});		
										}
									})
								})


								//actor location
								myEmitter.prependOnceListener('checkActorLocationId', function(){
									if(validator.isEmpty(participantActorLocationId)){
										myEmitter.emit('addAppointmentParticipant');
									}else{
										checkUniqeValue(apikey, "LOCATION_ID|" + participantActorLocationId, 'LOCATION', function(resLocationID){
											if(resLocationID.err_code > 0){
												myEmitter.emit('addAppointmentParticipant');
											}else{
												res.json({"err_code": 516, "err_msg": "Location Id not found"});		
											}
										})
									}
								})

								//actor healthcare service
								myEmitter.prependOnceListener('checkActorHealthcareServiceId', function(){
									if(validator.isEmpty(participantActorHealthcareServiceId)){
										myEmitter.emit('checkActorLocationId');
									}else{
										checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + participantActorHealthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealtcareServiceID){
											if(resHealtcareServiceID.err_code > 0){
												myEmitter.emit('checkActorLocationId');
											}else{
												res.json({"err_code": 508, "err_msg": "Healthcare Service Id not found"});		
											}
										})
									}
								})

								//actor device
								myEmitter.prependOnceListener('checkActorDeviceId', function(){
									if(validator.isEmpty(participantActorDeviceId)){
										myEmitter.emit('checkActorHealthcareServiceId');
									}else{
										checkUniqeValue(apikey, "DEVICE_ID|" + participantActorDeviceId, 'DEVICE', function(resDeviceID){
											if(resDeviceID.err_code > 0){
												myEmitter.emit('checkActorHealthcareServiceId');
											}else{
												res.json({"err_code": 507, "err_msg": "Device Id not found"});		
											}
										})
									}
								})

								//actor related person
								myEmitter.prependOnceListener('checkActorRelatedPersonId', function(){
									if(validator.isEmpty(participantActorRelatedPersonId)){
										myEmitter.emit('checkActorDeviceId');
									}else{
										checkUniqeValue(apikey, "RELATED_PERSON_ID|" + participantActorRelatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
											if(resRelatedPersonID.err_code > 0){
												myEmitter.emit('checkActorDeviceId');
											}else{
												res.json({"err_code": 506, "err_msg": "Related Person Id not found"});		
											}
										})
									}
								})

								//actor practitioner
								myEmitter.prependOnceListener('checkActorPractitionerId', function(){
									if(validator.isEmpty(participantActorPractitionerId)){
										myEmitter.emit('checkActorRelatedPersonId');
									}else{
										checkUniqeValue(apikey, "PRACTITIONER_ID|" + participantActorPractitionerId, 'PRACTITIONER', function(resPractitionerID){
											if(resPractitionerID.err_code > 0){
												myEmitter.emit('checkActorRelatedPersonId');
											}else{
												res.json({"err_code": 505, "err_msg": "Practitioner Id not found"});		
											}
										})
									}
								})

								//actor patient
								myEmitter.prependOnceListener('checkActorPatientId', function(){
									if(validator.isEmpty(participantActorPatientId)){
										myEmitter.emit('checkActorPractitionerId');
									}else{
										checkUniqeValue(apikey, "PATIENT_ID|" + participantActorPatientId, 'PATIENT', function(resPatientID){
											if(resPatientID.err_code > 0){
												myEmitter.emit('checkActorPractitionerId');
											}else{
												res.json({"err_code": 504, "err_msg": "Patient Id not found"});		
											}
										})
									}
								})
								
								//participant type	
								checkCode(apikey, participantType, 'ENCOUNTER_PARTICIPANT_TYPE', function(resParticipantTypeCode){
									if(resParticipantTypeCode.err_code > 0){
										checkCode(apikey, participantRequired, 'PARTICIPANT_REQUIRED', function(resParticipantRequiredCode){
											if(resParticipantRequiredCode.err_code > 0){
												checkCode(apikey, participantStatus, 'PARTICIPATION_STATUS', function(resParticipantRequiredCode){
													if(resParticipantRequiredCode.err_code > 0){
														myEmitter.emit('checkActorPatientId');						
													}else{
														res.json({"err_code": 503, "err_msg": "Participant Status code not found"});		
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Participant Required code not found"});		
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Participant Type code not found"});		
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
				appointment: function updateAppointment(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var appointmentId = req.params.appointment_id;
					var dataAppointment = {};

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof appointmentId !== 'undefined'){
						if(validator.isEmpty(appointmentId)){
							err_code = 2;
							err_msg = "Appointment Id is required.";
						}
					}else{
						err_code = 1;
						err_msg = "Appointment Id is required.";
					}


					if(typeof req.body.status !== 'undefined'){
						appointmentStatus =  req.body.status;
						if(validator.isEmpty(appointmentStatus)){
							err_code = 2;
							err_msg = "Appointment Status is required.";
						}else{
							dataAppointment.status = appointmentStatus;
						}
					}else{
						appointmentStatus = "";	
					}

					if(typeof req.body.service_category !== 'undefined'){
						appointmentServiceCategory =  req.body.service_category;
						if(!validator.isInt(appointmentServiceCategory)){
							err_code = 2;
							err_msg = "Service category is number";
						}else{
							dataAppointment.service_category = appointmentServiceCategory;
						}
					}else{
						appointmentServiceCategory = "";
					}

					if(typeof req.body.service_type !== 'undefined'){
						appointmentServiceType =  req.body.service_type;
						if(!validator.isInt(appointmentServiceType)){
							err_code = 2;
							err_msg = "Service type is number";
						}else{
							dataAppointment.service_type = appointmentServiceType;
						}
					}else{
						appointmentServiceType = "";
					}

					if(typeof req.body.specialty !== 'undefined'){
						appointmentSpecialty =  req.body.specialty;
						if(validator.isEmpty(appointmentSpecialty)){
							err_code = 2;
							err_msg = "Specialty is required";
						}else{
							dataAppointment.specialty = appointmentSpecialty;
						}
					}else{
						appointmentSpecialty = "";
					} 
					
					if(typeof req.body.appointment_type !== 'undefined'){
						appointmentType =  req.body.appointment_type;
						if(validator.isEmpty(appointmentType)){
							err_code = 2;
							err_msg = "Appointment Type is required";
						}else{
							dataAppointment.appointment_type = appointmentType;
						}
					}else{
						appointmentType = "";
					} 

					if(typeof req.body.reason !== 'undefined'){
						appointmentReason =  req.body.reason;
						if(!validator.isInt(appointmentReason)){
							err_code = 2;
							err_msg = "Reason Code is number.";
						}else{
							dataAppointment.appointment_reason = appointmentReason;
						}
					}else{
						appointmentReason = "";
					}

					if(typeof req.body.indication !== 'undefined'){
						indicationConditionId = req.body.indication.condition_id;
						indicationProcedureId = req.body.indication.procedure_id;

						if(validator.isEmpty(indicationConditionId)){
							indicationConditionId = "";	
						}

						if(validator.isEmpty(indicationProcedureId)){
							indicationProcedureId = "";	
						}
					}else{
						indicationConditionId = "";
						indicationProcedureId = "";
					} 

					if(typeof req.body.priority !== 'undefined'){
						appointmentPriority = req.body.priority;
						if(!validator.isInt(appointmentPriority)){
							err_code = 2;
							err_msg = "Priority is number.";
						}else{
							dataAppointment.priority = appointmentPriority;
						}						
					}

					if(typeof req.body.description !== 'undefined'){
						appointmentDescription = req.body.description;
						if(validator.isEmpty(appointmentDescription)){
							err_code = 2;
							err_msg = "Description is required.";
						}else{
							dataAppointment.description = appointmentDescription;
						}						
					}

					if(typeof req.body.supporting_information !== 'undefined'){
						supportingInformation = req.body.supporting_information;
						if(validator.isEmpty(supportingInformation)){
							supportingInformation = "";
						}						
					}else{
						supportingInformation = "";
					}

					if(typeof req.body.start !== 'undefined'){
						appointmentStart = req.body.start;
						if(validator.isEmpty(appointmentStart)){
							err_code = 2;
							err_msg = "Start is required.";
						}else{
							if(!regex.test(appointmentStart)){
								err_code = 2;
								err_msg = "Appointment Start invalid date time format.";
							}else{
								dataAppointment.start = appointmentStart;
							}
						}						
					}

					if(typeof req.body.end !== 'undefined'){
						appointmentEnd = req.body.end;
						if(validator.isEmpty(appointmentEnd)){
							err_code = 2;
							err_msg = "End is required.";
						}else{
							if(!regex.test(appointmentEnd)){
								err_code = 2;
								err_msg = "Appointment End invalid date time format.";
							}else{
								dataAppointment.end = appointmentEnd;
							}
						}							
					}

					if(typeof req.body.minutes_duration !== 'undefined'){
						minutesDuration = req.body.minutes_duration;
						if(!validator.isInt(minutesDuration)){
							err_code = 2;
							err_msg = "Minutes duration is number.";
						}else{
							dataAppointment.minutes_duration = minutesDuration;
						}						
					}

					if(typeof req.body.slot_id !== 'undefined'){
						slotId = req.body.slot_id;
						if(validator.isEmpty(slotId)){
							slotId = "";
						}						
					}else{
						slotId = "";
					}

					if(typeof req.body.referral_request_id !== 'undefined'){
						referralRequestId = req.body.referral_request_id;
						if(validator.isEmpty(referralRequestId)){
							referralRequestId = "";
						}						
					}else{
						referralRequestId = "";
					}

					if(typeof req.body.comment !== 'undefined'){
						appointmentComment = req.body.comment;
						if(validator.isEmpty(appointmentComment)){
							err_code = 2;
							err_msg = "Comment is required.";
						}else{
							dataAppointment.comment = appointmentComment;
						}						
					}else{
						err_code = 1;
						err_msg = "Please add key 'comment' in json request.";	
					}

					if(typeof req.body.requested_period !== 'undefined'){
						period = req.body.requested_period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							requestedPeriodStart = arrPeriod[0];
							requestedPeriodEnd = arrPeriod[1];
							
							if(!regex.test(requestedPeriodStart) && !regex.test(requestedPeriodEnd)){
								err_code = 2;
								err_msg = "Requeste Period invalid date format.";
							}else{
								dataAppointment.requested_period_start = requestedPeriodStart;
								dataAppointment.requested_period_end = requestedPeriodEnd;
							}	
						}
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								myEmitter.prependOnceListener('checkReference', function(){
									//updateAppointment
									myEmitter.prependOnceListener('updateAppointment', function(){
										checkUniqeValue(apikey, "APPOINTMENT_ID|" + appointmentId, 'APPOINTMENT', function(resAppointmentID){
											if(resAppointmentID.err_code > 0){
													ApiFHIR.put('appointment', {"apikey": apikey, "_id": appointmentId}, {body: dataAppointment, json: true}, function(error, response, body){
								  					appointment = body;
								  					if(appointment.err_code > 0){
								  						res.json(appointment);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Appointment has been update.", "data": [{"_id": appointmentId}]});
								  					}
								  				})	
											}else{
												res.json({"err_code": 510, "err_msg": "Appointment Id not found"});		
											}
										})
									})


									//referral request
									myEmitter.prependOnceListener('checkReferralRequestId', function(){
										if(validator.isEmpty(referralRequestId)){
											myEmitter.emit('updateAppointment');
										}else{
											checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + referralRequestId, 'REFERRAL_REQUEST', function(resReferralRequestID){
												if(resReferralRequestID.err_code > 0){
													myEmitter.emit('updateAppointment');
												}else{
													res.json({"err_code": 510, "err_msg": "Referral Request Id not found"});		
												}
											})
										}
									})

									//slot 
									myEmitter.prependOnceListener('checkSlotId', function(){
										if(validator.isEmpty(slotId)){
											myEmitter.emit('checkReferralRequestId');
										}else{
											checkUniqeValue(apikey, "SLOT_ID|" + slotId, 'SLOT', function(resSlotID){
												if(resSlotID.err_code > 0){
													myEmitter.emit('checkReferralRequestId');
												}else{
													res.json({"err_code": 509, "err_msg": "Slot Id not found"});		
												}
											})
										}
									})

									//procedure
									myEmitter.prependOnceListener('checkIndicationProcedureId', function(){
										if(validator.isEmpty(indicationProcedureId)){
											myEmitter.emit('checkSlotId');
										}else{
											checkUniqeValue(apikey, "PROCEDURE_ID|" + actorPatientId, 'PROCEDURE', function(resProcedureID){
												if(resProcedureID.err_code > 0){
													myEmitter.emit('checkSlotId');
												}else{
													res.json({"err_code": 508, "err_msg": "Procedure Id not found"});		
												}
											})
										}
									})
									
									//condition
									if(validator.isEmpty(indicationConditionId)){
										myEmitter.emit('checkIndicationProcedureId');
									}else{
										checkUniqeValue(apikey, "CONDITION_ID|" + indicationConditionId, 'CONDITION', function(resConditionID){
											if(resConditionID.err_code > 0){
												myEmitter.emit('checkIndicationProcedureId');
											}else{
												res.json({"err_code": 507, "err_msg": "Condition Id not found"});		
											}
										})
									}
								})

								//appointment reason
								myEmitter.prependOnceListener('checkAppointmentReasonCode', function(){
									if(validator.isEmpty(appointmentReason)){
										myEmitter.emit('checkReference');
									}else{
										checkCode(apikey, appointmentReason, 'ENCOUNTER_REASON', function(resReasonCode){
											if(resReasonCode.err_code > 0){
												myEmitter.emit('checkReference');
											}else{
												res.json({"err_code": 506, "err_msg": "Appointment reason code not found"});
											}
										})
									}			
								})

								//appointment type
								myEmitter.prependOnceListener('checkAppointmentTypeCode', function(){
									if(validator.isEmpty(appointmentType)){
										myEmitter.emit('checkAppointmentReasonCode');
									}else{
										checkCode(apikey, appointmentType, 'APPOINTMENT_REASON_CODE', function(resAppointmentTypeCode){
											if(resAppointmentTypeCode.err_code > 0){
												myEmitter.emit('checkAppointmentReasonCode');
											}else{
												res.json({"err_code": 505, "err_msg": "Appointment type code not found"});
											}
										})
									}			
								})

								//appointment specialty
								myEmitter.prependOnceListener('checkSpecialtyCode', function(){
									if(validator.isEmpty(appointmentSpecialty)){
										myEmitter.emit('checkAppointmentTypeCode');
									}else{
										checkCode(apikey, appointmentSpecialty, 'PRACTICE_CODE', function(resPracticeCode){
											if(resPracticeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkAppointmentTypeCode');
											}else{
												res.json({"err_code": 504, "err_msg": "Specialty code not found"});
											}
										})
									}			
								})

								//appointment service type
								myEmitter.prependOnceListener('checkAppointmentServiceTypeCode', function(){
									if(validator.isEmpty(appointmentServiceType)){
										myEmitter.emit('checkSpecialtyCode');
									}else{
										checkCode(apikey, appointmentServiceType, 'SERVICE_TYPE', function(resServiceTypeCode){
											if(resServiceTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkSpecialtyCode');
											}else{
												res.json({"err_code": 503, "err_msg": "Service type code not found"});
											}
										})
									}			
								})

								//appointment service category
								myEmitter.prependOnceListener('checkAppointmentServiceCategoryCode', function(){
									if(validator.isEmpty(appointmentServiceCategory)){
										myEmitter.emit('checkAppointmentServiceTypeCode');
									}else{
										checkCode(apikey, appointmentServiceCategory, 'SERVICE_CATEGORY', function(resServiceCategoryCode){
											if(resServiceCategoryCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkAppointmentServiceTypeCode');
											}else{
												res.json({"err_code": 502, "err_msg": "Service category code not found"});
											}
										})
									}			
								})
								
								//appointment status
								if(validator.isEmpty(appointmentStatus)){
									myEmitter.emit('checkAppointmentServiceCategoryCode');
								}else{
									checkCode(apikey, appointmentStatus, 'APPOINTMENT_STATUS', function(resAppointmentStatusCode){
										if(resAppointmentStatusCode.err_code > 0){
											myEmitter.emit('checkAppointmentServiceCategoryCode');
										}else{
											res.json({"err_code": 501, "err_msg": "Appointment status code not found"});
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
				appointmentParticipant: function updateAppointmentParticipant(req, res){
					var appointmentId = req.params.appointment_id;
					var appointmentParticipantId = req.params.participant_id;

					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";
					var dataAppointmentParticipant = {};


					if(typeof appointmentId !== 'undefined'){
						if(validator.isEmpty(appointmentId)){
							err_code = 2;
							err_msg = "Appointment ID is required.";		
						}
					}else{
						err_code = 1;
						err_msg = "Appointment ID is required.";
					}

					if(typeof appointmentParticipantId !== 'undefined'){
						if(validator.isEmpty(appointmentParticipantId)){
							err_code = 2;
							err_msg = "Participant ID is required.";		
						}
					}else{
						err_code = 1;
						err_msg = "Participant ID is required.";
					}

					if(typeof req.body.type !== 'undefined'){
						participantType = req.body.type;
						if(validator.isEmpty(participantType)){
							err_code = 2;
							err_msg = "Participant type is empty.";		
						}else{
							dataAppointmentParticipant.type = participantType;
						}
					}else{
						participantType = "";
					}


					if(typeof req.body.actor !== 'undefined'){
						if(typeof req.body.actor.patient_id !== 'undefined'){
							participantActorPatientId = req.body.actor.patient_id;
							if(validator.isEmpty(participantActorPatientId)){
								participantActorPatientId = "";
							}else{
								dataAppointmentParticipant.actor_patient_id = participantActorPatientId;
							}
						}else{
							participantActorPatientId = "";
						}

						if(typeof req.body.actor.practitioner_id !== 'undefined'){
							participantActorPractitionerId = req.body.actor.practitioner_id;
							if(validator.isEmpty(participantActorPractitionerId)){
								participantActorPractitionerId = "";
							}else{
								dataAppointmentParticipant.actor_practitioner_id = participantActorPractitionerId;
							}
						}else{
							participantActorPractitionerId = "";
						}

						if(typeof req.body.actor.related_person_id !== 'undefined'){
							participantActorRelatedPersonId = req.body.actor.related_person_id;
							if(validator.isEmpty(participantActorRelatedPersonId)){
								participantActorRelatedPersonId = "";
							}else{
								dataAppointmentParticipant.actor_related_person_id = participantActorRelatedPersonId;
							}
						}else{
							participantActorRelatedPersonId = "";
						}

						if(typeof req.body.actor.device_id !== 'undefined'){
							participantActorDeviceId = req.body.actor.device_id;
							if(validator.isEmpty(participantActorDeviceId)){
								participantActorDeviceId = "";
							}else{
								dataAppointmentParticipant.actor_device_id = participantActorDeviceId;
							}
						}else{
							participantActorDeviceId = "";
						}

						if(typeof req.body.actor.healthcare_service_id !== 'undefined'){
							participantActorHealthcareServiceId = req.body.actor.healthcare_service_id;
							if(validator.isEmpty(participantActorHealthcareServiceId)){
								participantActorHealthcareServiceId = "";
							}else{
								dataAppointmentParticipant.actor_healthcare_service_id = participantActorHealthcareServiceId;
							}
						}else{
							participantActorHealthcareServiceId = "";
						}

						if(typeof req.body.actor.location_id !== 'undefined'){
							participantActorLocationId = req.body.actor.location_id;
							if(validator.isEmpty(participantActorLocationId)){
								participantActorLocationId = "";
							}else{
								dataAppointmentParticipant.actor_location_id = participantActorLocationId;
							}
						}else{
							participantActorLocationId = "";
						}
					}else{
						participantActorPatientId = "";
						participantActorPractitionerId = "";
						participantActorRelatedPersonId = "";
						participantActorDeviceId = "";
						participantActorHealthcareServiceId = "";
						participantActorLocationId = "";
					}

					if(typeof req.body.required !== 'undefined'){
						participantRequired = req.body.required;
						if(validator.isEmpty(participantRequired)){
							err_code = 2;
							err_msg = "Participant required code is empty.";			
						}else{
							dataAppointmentParticipant.required = participantRequired;
						}
					}else{
						participantRequired = "";
					}

					if(typeof req.body.status !== 'undefined'){
						participantStatus = req.body.status;
						if(validator.isEmpty(participantStatus)){
							err_code = 2;
							err_msg = "Participant status code is empty.";			
						}else{
							dataAppointmentParticipant.status = participantStatus;
						}
					}else{
						participantStatus = "";
					}


					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								//add schedule
								myEmitter.prependOnceListener('updateAppointmentParticipant', function(){
									checkUniqeValue(apikey, "APPOINTMENT_ID|" + appointmentId, 'APPOINTMENT', function(resAppointmentID){
										if(resAppointmentID.err_code > 0){
											checkUniqeValue(apikey, "APPOINTMENT_PARTICIPANT_ID|" + appointmentParticipantId, 'APPOINTMENT_PARTICIPANT', function(resAppointmentParticipantID){
												if(resAppointmentParticipantID.err_code > 0){
													ApiFHIR.put('appointmentParticipant', {"apikey": apikey, "_id": appointmentParticipantId, "dr": "APPOINTMENT_ID|"+appointmentId}, {body: dataAppointmentParticipant, json: true}, function(error, response, body){
								  					appointmentParticipant = body;
								  					if(appointmentParticipant.err_code > 0){
								  						res.json(appointmentParticipant);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Participant has been update in this appointment.", "data": [{"_id": appointmentParticipantId}]});
								  					}
								  				})				
												}else{
													res.json({"err_code": 517, "err_msg": "Participant Id not found"});		
												}
											})		
										}else{
											res.json({"err_code": 517, "err_msg": "Appointment Id not found"});		
										}
									})
								})

								//actor location
								myEmitter.prependOnceListener('checkActorLocationId', function(){
									if(validator.isEmpty(participantActorLocationId)){
										myEmitter.emit('updateAppointmentParticipant');
									}else{
										checkUniqeValue(apikey, "LOCATION_ID|" + participantActorLocationId, 'LOCATION', function(resLocationID){
											if(resLocationID.err_code > 0){
												myEmitter.emit('updateAppointmentParticipant');
											}else{
												res.json({"err_code": 516, "err_msg": "Location Id not found"});		
											}
										})
									}
								})

								//actor healthcare service
								myEmitter.prependOnceListener('checkActorHealthcareServiceId', function(){
									if(validator.isEmpty(participantActorHealthcareServiceId)){
										myEmitter.emit('checkActorLocationId');
									}else{
										checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + participantActorHealthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealtcareServiceID){
											if(resHealtcareServiceID.err_code > 0){
												myEmitter.emit('checkActorLocationId');
											}else{
												res.json({"err_code": 508, "err_msg": "Healthcare Service Id not found"});		
											}
										})
									}
								})

								//actor device
								myEmitter.prependOnceListener('checkActorDeviceId', function(){
									if(validator.isEmpty(participantActorDeviceId)){
										myEmitter.emit('checkActorHealthcareServiceId');
									}else{
										checkUniqeValue(apikey, "DEVICE_ID|" + participantActorDeviceId, 'DEVICE', function(resDeviceID){
											if(resDeviceID.err_code > 0){
												myEmitter.emit('checkActorHealthcareServiceId');
											}else{
												res.json({"err_code": 507, "err_msg": "Device Id not found"});		
											}
										})
									}
								})

								//actor related person
								myEmitter.prependOnceListener('checkActorRelatedPersonId', function(){
									if(validator.isEmpty(participantActorRelatedPersonId)){
										myEmitter.emit('checkActorDeviceId');
									}else{
										checkUniqeValue(apikey, "RELATED_PERSON_ID|" + participantActorRelatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
											if(resRelatedPersonID.err_code > 0){
												myEmitter.emit('checkActorDeviceId');
											}else{
												res.json({"err_code": 506, "err_msg": "Related Person Id not found"});		
											}
										})
									}
								})

								//actor practitioner
								myEmitter.prependOnceListener('checkActorPractitionerId', function(){
									if(validator.isEmpty(participantActorPractitionerId)){
										myEmitter.emit('checkActorRelatedPersonId');
									}else{
										checkUniqeValue(apikey, "PRACTITIONER_ID|" + participantActorPractitionerId, 'PRACTITIONER', function(resPractitionerID){
											if(resPractitionerID.err_code > 0){
												myEmitter.emit('checkActorRelatedPersonId');
											}else{
												res.json({"err_code": 505, "err_msg": "Practitioner Id not found"});		
											}
										})
									}
								})

								//actor patient
								myEmitter.prependOnceListener('checkActorPatientId', function(){
									if(validator.isEmpty(participantActorPatientId)){
										myEmitter.emit('checkActorPractitionerId');
									}else{
										checkUniqeValue(apikey, "PATIENT_ID|" + participantActorPatientId, 'PATIENT', function(resPatientID){
											if(resPatientID.err_code > 0){
												myEmitter.emit('checkActorPractitionerId');
											}else{
												res.json({"err_code": 504, "err_msg": "Patient Id not found"});		
											}
										})
									}
								})		

								myEmitter.prependOnceListener('checkParticipantStatusCode', function(){
									if(validator.isEmpty(participantStatus)){
										myEmitter.emit('checkActorPatientId');	
									}else{
										checkCode(apikey, participantStatus, 'PARTICIPATION_STATUS', function(resParticipantRequiredCode){
											if(resParticipantRequiredCode.err_code > 0){
												myEmitter.emit('checkActorPatientId');	
											}else{
												res.json({"err_code": 503, "err_msg": "Participant Status code not found"});
											}
										})
									}
								})

								myEmitter.prependOnceListener('checkParticipantRequiredCode', function(){
									if(validator.isEmpty(participantRequired)){
										myEmitter.emit('checkParticipantStatusCode');	
									}else{
										checkCode(apikey, participantRequired, 'PARTICIPANT_REQUIRED', function(resParticipantRequiredCode){
											if(resParticipantRequiredCode.err_code > 0){
												myEmitter.emit('checkParticipantStatusCode');	
											}else{
												res.json({"err_code": 502, "err_msg": "Participant Required code not found"});		
											}
										})
									}
								})		

								if(validator.isEmpty(participantType)){
									myEmitter.emit('checkParticipantRequiredCode');	
								}else{
									checkCode(apikey, participantType, 'ENCOUNTER_PARTICIPANT_TYPE', function(resParticipantTypeCode){
										if(resParticipantTypeCode.err_code > 0){
											myEmitter.emit('checkParticipantRequiredCode');	
										}else{
											res.json({"err_code": 501, "err_msg": "Participant Type code not found"});
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