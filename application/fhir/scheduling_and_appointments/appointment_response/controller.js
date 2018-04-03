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
				appointmentResponse: function getAppointmentResponse(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var appointmentResponseId = req.query._id;
					var appointmentResponseActor = req.query.actor;
					var appointmentId = req.query.appointment;
					var appointmentResponseActorLocation = req.query.location;
					var appointmentResponseActorParticipantStatus = req.query.part_status;
					var appointmentResponseActorPatient = req.query.patient;
					var appointmentResponseActorPractitioner = req.query.practitioner;
					
					var qString = {};
					if(typeof appointmentResponseId !== 'undefined'){
						if(!validator.isEmpty(appointmentResponseId)){
							qString._id = appointmentResponseId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Appointment Response ID is required."})
						}
					}

					if(typeof appointmentResponseActor !== 'undefined'){
						if(!validator.isEmpty(appointmentResponseActor)){
							qString.actor = appointmentResponseActor; 
						}else{
							res.json({"err_code": 1, "err_msg": "Actor is empty."});
						}
					}

					if(typeof appointmentId !== 'undefined'){
						if(!validator.isEmpty(appointmentId)){
							qString.appointment_id = appointmentId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Actor is empty."});
						}
					}

					if(typeof appointmentResponseActorLocation !== 'undefined'){
						if(!validator.isEmpty(appointmentResponseActorLocation)){
							qString.location = appointmentResponseActorLocation; 
						}else{
							res.json({"err_code": 1, "err_msg": "Location is empty."});
						}
					}

					if(typeof appointmentResponseActorPatient !== 'undefined'){
						if(!validator.isEmpty(appointmentResponseActorPatient)){
							qString.patient = appointmentResponseActorPatient; 
						}else{
							res.json({"err_code": 1, "err_msg": "Patient is empty."});
						}
					}

					if(typeof appointmentResponseActorPractitioner !== 'undefined'){
						if(!validator.isEmpty(appointmentResponseActorPractitioner)){
							qString.practitioner = appointmentResponseActorPractitioner; 
						}else{
							res.json({"err_code": 1, "err_msg": "Practitioner is empty."});
						}
					}

					if(typeof appointmentResponseActorParticipantStatus !== 'undefined'){
						if(!validator.isEmpty(appointmentResponseActorParticipantStatus)){
							qString.part_status = appointmentResponseActorParticipantStatus; 
						}else{
							res.json({"err_code": 1, "err_msg": "Participant Status is empty."});
						}
					}
					
					seedPhoenixFHIR.path.GET = {
						"AppointmentResponse" : {
							"location": "%(apikey)s/appointment-response",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('AppointmentResponse', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var appointmentResponse = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(appointmentResponse.err_code == 0){
								  	//cek jumdata dulu
								  	if(appointmentResponse.data.length > 0){
								  		res.json({"err_code": 0, "data":appointmentResponse.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Appointment Response is empty."});	
								  	}
							  	}else{
							  		res.json(appointmentResponse);
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
				appointmentResponse: function addAppointmentResponse(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof req.body.appointment_id !== 'undefined'){
						appointmentId =  req.body.appointment_id;
						if(validator.isEmpty(appointmentId)){
							err_code = 2;
							err_msg = "Appointment ID is required.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'appointment_id' in json request.";
					}

					if(typeof req.body.start !== 'undefined'){
						appointmentResponseStart = req.body.start;
						if(!regex.test(appointmentResponseStart)){
							err_code = 2;
							err_msg = "Start invalid date time format.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'start' in json request.";
					}

					if(typeof req.body.end !== 'undefined'){
						appointmentResponseEnd = req.body.end;
						if(!regex.test(appointmentResponseEnd)){
							err_code = 2;
							err_msg = "End invalid date time format.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'end' in json request.";
					}

					if(typeof req.body.participant_type !== 'undefined'){
						participantType = req.body.participant_type;
						if(validator.isEmpty(participantType)){
							err_code = 2;
							err_msg = "Participant Type is required.";	
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'participant_type' in json request.";
					}

					if(typeof req.body.actor.patient_id !== 'undefined'){
						actorPatientId =  req.body.actor.patient_id;
						if(validator.isEmpty(actorPatientId)){
							actorPatientId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'patient_id' in json actor request.";
					}

					if(typeof req.body.actor.practitioner_id !== 'undefined'){
						actorPractitionerId =  req.body.actor.practitioner_id;
						if(validator.isEmpty(actorPractitionerId)){
							actorPractitionerId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'practitioner_id' in json actor request.";
					}

					if(typeof req.body.actor.related_person_id !== 'undefined'){
						actorRelatedPersonId =  req.body.actor.related_person_id;
						if(validator.isEmpty(actorRelatedPersonId)){
							actorRelatedPersonId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'related_person_id' in json actor request.";
					}

					if(typeof req.body.actor.device_id !== 'undefined'){
						actorDeviceId =  req.body.actor.device_id;
						if(validator.isEmpty(actorDeviceId)){
							actorDeviceId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'device_id' in json actor request.";
					}

					if(typeof req.body.actor.healthcare_service_id !== 'undefined'){
						actorHealthcareServiceId =  req.body.actor.healthcare_service_id;
						if(validator.isEmpty(actorHealthcareServiceId)){
							actorHealthcareServiceId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'healthcare_service_id' in json actor request.";
					}

					if(typeof req.body.actor.location_id !== 'undefined'){
						actorLocationId =  req.body.actor.location_id;
						if(validator.isEmpty(actorLocationId)){
							actorLocationId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'location_id' in json actor request.";
					}

					if(typeof req.body.participant_status !== 'undefined'){
						participantStatus = req.body.participant_status;
						if(validator.isEmpty(participantStatus)){
							err_code = 2;
							err_msg = "Participant Status is required.";	
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'participant_status' in json request.";
					}

					if(typeof req.body.comment !== 'undefined'){
						comment = req.body.comment;
						if(validator.isEmpty(comment)){
							err_code = 2;
							err_msg = "Comment is required.";	
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'comment' in json request.";
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkUniqeValue(apikey, "APPOINTMENT_ID|" + appointmentId, 'APPOINTMENT', function(resAppointmentID){
									if(resAppointmentID.err_code > 0){
										checkCode(apikey, participantType, 'ENCOUNTER_PARTICIPANT_TYPE', function(resParticipantTypeCode){
											if(resParticipantTypeCode.err_code > 0){
												checkCode(apikey, participantStatus, 'PARTICIPATION_STATUS', function(resParticipationStatusCode){
													if(resParticipationStatusCode.err_code > 0){
														//add AppointmentResponse
														myEmitter.prependOnceListener('addAppointmentResponse', function(){
															var appointmentResponseId = 'ar' + uniqid.time();

															var dataAppointmentResponse = {
																															"id": appointmentResponseId,
																															"appointment_id": appointmentId,
																															"start": appointmentResponseStart,
																															"end": appointmentResponseEnd,
																															"participant_type": participantType,  
																															"actor_patient_id": actorPatientId,  
																															"actor_practitioner_id": actorPractitionerId,
																															"actor_related_person_id": actorRelatedPersonId,  
																															"actor_device_id": actorDeviceId,  
																															"actor_healthcare_service_id": actorHealthcareServiceId,  
																															"actor_location_id": actorLocationId,  
																															"participant_status": participantStatus,
																															"comment" : comment
																														}
															
															//method, endpoint, params, options, callback
															ApiFHIR.post('appointmentResponse', {"apikey": apikey}, {body: dataAppointmentResponse, json:true}, function(error, response, body){	
														  	var appointmentResponse = body; //object
														  	//cek apakah ada error atau tidak
														  	if(appointmentResponse.err_code == 0){
														  		res.json({"err_code": 0, "err_msg": "Appointment Response has been add.", "data": appointmentResponse.data});
														  	}else{
														  		res.json(appointmentResponse);
														  	}
															})
														})


														//actor location
														myEmitter.prependOnceListener('checkActorLocationId', function(){
															if(validator.isEmpty(actorLocationId)){
																myEmitter.emit('addAppointmentResponse');
															}else{
																checkUniqeValue(apikey, "LOCATION_ID|" + actorLocationId, 'LOCATION', function(resLocationID){
																	if(resLocationID.err_code > 0){
																		myEmitter.emit('addAppointmentResponse');
																	}else{
																		res.json({"err_code": 504, "err_msg": "Location Id not found"});		
																	}
																})
															}
														})

														//actor healthcare service
														myEmitter.prependOnceListener('checkActorHealthcareServiceId', function(){
															if(validator.isEmpty(actorHealthcareServiceId)){
																myEmitter.emit('checkActorLocationId');
															}else{
																checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + actorHealthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealtcareServiceID){
																	if(resHealtcareServiceID.err_code > 0){
																		myEmitter.emit('checkActorLocationId');
																	}else{
																		res.json({"err_code": 504, "err_msg": "Healthcare Service Id not found"});		
																	}
																})
															}
														})

														//actor device
														myEmitter.prependOnceListener('checkActorDeviceId', function(){
															if(validator.isEmpty(actorDeviceId)){
																myEmitter.emit('checkActorHealthcareServiceId');
															}else{
																checkUniqeValue(apikey, "DEVICE_ID|" + actorDeviceId, 'DEVICE', function(resDeviceID){
																	if(resDeviceID.err_code > 0){
																		myEmitter.emit('checkActorHealthcareServiceId');
																	}else{
																		res.json({"err_code": 504, "err_msg": "Device Id not found"});		
																	}
																})
															}
														})

														//actor related person
														myEmitter.prependOnceListener('checkActorRelatedPersonId', function(){
															if(validator.isEmpty(actorRelatedPersonId)){
																myEmitter.emit('checkActorDeviceId');
															}else{
																checkUniqeValue(apikey, "RELATED_PERSON_ID|" + actorRelatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
																	if(resRelatedPersonID.err_code > 0){
																		myEmitter.emit('checkActorDeviceId');
																	}else{
																		res.json({"err_code": 504, "err_msg": "Related Person Id not found"});		
																	}
																})
															}
														})

														//actor practitioner
														myEmitter.prependOnceListener('checkActorPractitionerId', function(){
															if(validator.isEmpty(actorPractitionerId)){
																myEmitter.emit('checkActorRelatedPersonId');
															}else{
																checkUniqeValue(apikey, "PRACTITIONER_ID|" + actorPractitionerId, 'PRACTITIONER', function(resPractitionerID){
																	if(resPractitionerID.err_code > 0){
																		myEmitter.emit('checkActorRelatedPersonId');
																	}else{
																		res.json({"err_code": 504, "err_msg": "Practitioner Id not found"});		
																	}
																})
															}
														})

														//actor patient
														myEmitter.prependOnceListener('checkActorPatientId', function(){
															if(validator.isEmpty(actorPatientId)){
																myEmitter.emit('checkActorPractitionerId');
															}else{
																checkUniqeValue(apikey, "PATIENT_ID|" + actorPatientId, 'PATIENT', function(resPatientID){
																	if(resPatientID.err_code > 0){
																		myEmitter.emit('checkActorPractitionerId');
																	}else{
																		res.json({"err_code": 504, "err_msg": "Patient Id not found"});		
																	}
																})
															}
														})
														myEmitter.emit('checkActorPatientId');

													}else{
														res.json({"err_code": 503, "err_msg": "Participation Status Code not found"});				
													}
												})	
											}else{
												res.json({"err_code": 502, "err_msg": "Participant Type Code not found"});		
											}
										})										
									}else{
										res.json({"err_code": 501, "err_msg": "Appointment ID not found"});
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
				appointmentResponse: function updateAppointmentResponse(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var appointmentResponseId = req.params.appointment_response_id;

					var err_code = 0;
					var err_msg = "";
					var dataAppointmentResponse = {};

					if(typeof appointmentResponseId !== 'undefined'){
						if(validator.isEmpty(appointmentResponseId)){
							err_code = 1;
							err_msg = "Appointment Response Id is required.";
						}
					}else{
						err_code = 1;
						err_msg = "Appointment Response Id is required.";
					}

					if(typeof req.body.appointment_id !== 'undefined'){
						appointmentId =  req.body.appointment_id;
						if(!validator.isEmpty(appointmentId)){
							dataAppointmentResponse.appointment_id = appointmentId;
						}
					}else{
						appointmentId = "";
					}

					if(typeof req.body.start !== 'undefined'){
						appointmentResponseStart = req.body.start;
						if(!regex.test(appointmentResponseStart)){
							err_code = 2;
							err_msg = "Start invalid date time format.";
						}else{
							dataAppointmentResponse.start = appointmentResponseStart;
						}
					}

					if(typeof req.body.end !== 'undefined'){
						appointmentResponseEnd = req.body.end;
						if(!regex.test(appointmentResponseEnd)){
							err_code = 2;
							err_msg = "End invalid date time format.";
						}else{
							dataAppointmentResponse.end = appointmentResponseEnd;
						}
					}

					if(typeof req.body.participant_type !== 'undefined'){
						participantType = req.body.participant_type;
						if(!validator.isEmpty(participantType)){
							dataAppointmentResponse.participant_type = participantType;
						}
					}else{
						participantType = "";
					}

					if(typeof req.body.actor !== 'undefined'){
						if(typeof req.body.actor.patient_id !== 'undefined'){
							actorPatientId =  req.body.actor.patient_id;
							if(!validator.isEmpty(actorPatientId)){
								dataAppointmentResponse.actor_patient_id = actorPatientId;	
							}
						}else{
							actorPatientId = "";
						}

						if(typeof req.body.actor.practitioner_id !== 'undefined'){
							actorPractitionerId =  req.body.actor.practitioner_id;
							if(!validator.isEmpty(actorPractitionerId)){
								dataAppointmentResponse.actor_practitioner_id = actorPractitionerId;
							}
						}else{
							actorPractitionerId = "";
						}

						if(typeof req.body.actor.related_person_id !== 'undefined'){
							actorRelatedPersonId =  req.body.actor.related_person_id;
							if(!validator.isEmpty(actorRelatedPersonId)){
								dataAppointmentResponse.actor_related_person_id = actorRelatedPersonId;
							}
						}else{
							actorRelatedPersonId = "";
						}

						if(typeof req.body.actor.device_id !== 'undefined'){
							actorDeviceId =  req.body.actor.device_id;
							if(!validator.isEmpty(actorDeviceId)){
								dataAppointmentResponse.actor_device_id = actorDeviceId;
							}
						}else{
							actorDeviceId = "";
						}

						if(typeof req.body.actor.healthcare_service_id !== 'undefined'){
							actorHealthcareServiceId =  req.body.actor.healthcare_service_id;
							if(!validator.isEmpty(actorHealthcareServiceId)){
								dataAppointmentResponse.actor_healthcare_service_id = actorHealthcareServiceId;
							}
						}else{
							actorHealthcareServiceId = "";
						}

						if(typeof req.body.actor.location_id !== 'undefined'){
							actorLocationId =  req.body.actor.location_id;
							if(!validator.isEmpty(actorLocationId)){
								dataAppointmentResponse.actor_location_id = actorLocationId;
							}
						}else{
							actorLocationId = "";
						}
					}else{
						actorPatientId = "";
						actorPractitionerId = "";
						actorRelatedPersonId = "";
						actorDeviceId = "";
						actorHealthcareServiceId = "";
						actorLocationId = "";
					}

					if(typeof req.body.participant_status !== 'undefined'){
						participantStatus = req.body.participant_status;
						if(validator.isEmpty(participantStatus)){
							err_code = 2;
							err_msg = "Participant Status is required.";	
						}else{
							dataAppointmentResponse.participant_status = participantStatus;
						}
					}else{
						participantStatus = "";
					}


					if(typeof req.body.comment !== 'undefined'){
						comment = req.body.comment;
						if(!validator.isEmpty(comment)){
							dataAppointmentResponse.comment = comment;		
						}
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								myEmitter.prependListener('updateAppointmentResponse', function(){
									checkUniqeValue(apikey, "APPOINTMENT_RESPONSE_ID|" + appointmentResponseId, 'APPOINTMENT_RESPONSE', function(resAppointmentResponseID){
										if(resAppointmentResponseID.err_code > 0){
												ApiFHIR.put('appointmentResponse', {"apikey": apikey, "_id": appointmentResponseId}, {body: dataAppointmentResponse, json: true}, function(error, response, body){
							  					appointmentResponse = body;
							  					if(appointmentResponse.err_code > 0){
							  						res.json(appointmentResponse);	
							  					}else{
							  						res.json({"err_code": 0, "err_msg": "Appointment Response has been update.", "data": appointmentResponse.data});
							  					}
							  				})
										}else{
											res.json({"err_code": 504, "err_msg": "Appointment Response Id not found"});		
										}
									})
								})

								//participant status
								myEmitter.prependOnceListener('checkParticipantStatusCode', function(){
									if(validator.isEmpty(participantType)){
										myEmitter.emit('updateAppointmentResponse');
									}else{
										checkCode(apikey, participantStatus, 'PARTICIPATION_STATUS', function(resParticipationStatusCode){
											if(resParticipationStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('updateAppointmentResponse');
											}else{
												res.json({"err_code": 502, "err_msg": "Participation Status code not found"});
											}	
										})
									}	
								})

								//actor location
								myEmitter.prependOnceListener('checkActorLocationId', function(){
									if(validator.isEmpty(actorLocationId)){
										myEmitter.emit('checkParticipantStatusCode');
									}else{
										checkUniqeValue(apikey, "LOCATION_ID|" + actorLocationId, 'LOCATION', function(resLocationID){
											if(resLocationID.err_code > 0){
												myEmitter.emit('checkParticipantStatusCode');
											}else{
												res.json({"err_code": 504, "err_msg": "Location Id not found"});		
											}
										})
									}
								})

								//actor healthcare service
								myEmitter.prependOnceListener('checkActorHealthcareServiceId', function(){
									if(validator.isEmpty(actorHealthcareServiceId)){
										myEmitter.emit('checkActorLocationId');
									}else{
										checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + actorHealthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealtcareServiceID){
											if(resHealtcareServiceID.err_code > 0){
												myEmitter.emit('checkActorLocationId');
											}else{
												res.json({"err_code": 504, "err_msg": "Healthcare Service Id not found"});		
											}
										})
									}
								})

								//actor device
								myEmitter.prependOnceListener('checkActorDeviceId', function(){
									if(validator.isEmpty(actorDeviceId)){
										myEmitter.emit('checkActorHealthcareServiceId');
									}else{
										checkUniqeValue(apikey, "DEVICE_ID|" + actorDeviceId, 'DEVICE', function(resDeviceID){
											if(resDeviceID.err_code > 0){
												myEmitter.emit('checkActorHealthcareServiceId');
											}else{
												res.json({"err_code": 504, "err_msg": "Device Id not found"});		
											}
										})
									}
								})

								//actor related person
								myEmitter.prependOnceListener('checkActorRelatedPersonId', function(){
									if(validator.isEmpty(actorRelatedPersonId)){
										myEmitter.emit('checkActorDeviceId');
									}else{
										checkUniqeValue(apikey, "RELATED_PERSON_ID|" + actorRelatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
											if(resRelatedPersonID.err_code > 0){
												myEmitter.emit('checkActorDeviceId');
											}else{
												res.json({"err_code": 504, "err_msg": "Related Person Id not found"});		
											}
										})
									}
								})

								//actor practitioner
								myEmitter.prependOnceListener('checkActorPractitionerId', function(){
									if(validator.isEmpty(actorPractitionerId)){
										myEmitter.emit('checkActorRelatedPersonId');
									}else{
										checkUniqeValue(apikey, "PRACTITIONER_ID|" + actorPractitionerId, 'PRACTITIONER', function(resPractitionerID){
											if(resPractitionerID.err_code > 0){
												myEmitter.emit('checkActorRelatedPersonId');
											}else{
												res.json({"err_code": 504, "err_msg": "Practitioner Id not found"});		
											}
										})
									}
								})

								//actor patient
								myEmitter.prependOnceListener('checkActorPatientId', function(){
									if(validator.isEmpty(actorPatientId)){
										myEmitter.emit('checkActorPractitionerId');
									}else{
										checkUniqeValue(apikey, "PATIENT_ID|" + actorPatientId, 'PATIENT', function(resPatientID){
											if(resPatientID.err_code > 0){
												myEmitter.emit('checkActorPractitionerId');
											}else{
												res.json({"err_code": 504, "err_msg": "Patient Id not found"});		
											}
										})
									}
								})

								//participant type
								myEmitter.prependOnceListener('checkParticipantTypeCode', function(){
									if(validator.isEmpty(participantType)){
										myEmitter.emit('checkActorPatientId');
									}else{
										checkCode(apikey, participantType, 'ENCOUNTER_PARTICIPANT_TYPE', function(resParticipantTypeCode){
											if(resParticipantTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkActorPatientId');
											}else{
												res.json({"err_code": 502, "err_msg": "Participant Type code not found"});
											}	
										})
									}	
								})
																
								//appointment
								if(validator.isEmpty(appointmentId)){
									myEmitter.emit('checkParticipantTypeCode');
								}else{
									checkUniqeValue(apikey, "APPOINTMENT_ID|" + appointmentId, 'APPOINTMENT', function(resAppointmentID){
									if(resAppointmentID.err_code > 0){
											myEmitter.emit('checkParticipantTypeCode');
										}else{
											res.json({"err_code": 501, "err_msg": "Appointment ID not found"});
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