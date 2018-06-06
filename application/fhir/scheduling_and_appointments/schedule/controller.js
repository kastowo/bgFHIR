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
				schedule: function getSchedule(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var scheduleId = req.query._id;
					var scheduleActive = req.query.active;
					var scheduleActor = req.query.actor;
					var scheduleDate = req.query.date;
					var scheduleType = req.query.type;
					
					var qString = {};
					if(typeof scheduleId !== 'undefined'){
						if(!validator.isEmpty(scheduleId)){
							qString._id = scheduleId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Schedule ID is required."})
						}
					}

					if(typeof scheduleActive !== 'undefined'){
						if(validator.isBoolean(scheduleActive)){
							qString.active = scheduleActive; 
						}else{
							res.json({"err_code": 1, "err_msg": "Active is boolean."});
						}
					}

					if(typeof scheduleActor !== 'undefined'){
						if(!validator.isEmpty(scheduleActor)){
							qString.actor = scheduleActor; 
						}else{
							res.json({"err_code": 1, "err_msg": "Actor is empty."});
						}
					}

					if(typeof scheduleDate !== 'undefined'){
						if(!validator.isEmpty(scheduleDate)){
							if(!regex.test(scheduleDate)){
								res.json({"err_code": 1, "err_msg": "Schedule date invalid format."});
							}else{
								qString.date = scheduleDate; 
							}	
						}else{
							res.json({"err_code": 1, "err_msg": "Schedule date is empty."});
						}
					}
					
					seedPhoenixFHIR.path.GET = {
						"Schedule" : {
							"location": "%(apikey)s/schedule",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('Schedule', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var schedule = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(schedule.err_code == 0){
								  	//cek jumdata dulu
								  	if(schedule.data.length > 0){
								  		res.json({"err_code": 0, "data":schedule.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Schedule is empty."});	
								  	}
							  	}else{
							  		res.json(schedule);
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
				schedule: function addSchedule(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof req.body.service_category !== 'undefined'){
						serviceCategory =  req.body.service_category;
						if(!validator.isInt(serviceCategory)){
							err_code = 2;
							err_msg = "Service category is number";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'service_category' in json request.";
					}

					if(typeof req.body.service_type !== 'undefined'){
						serviceType =  req.body.service_type;
						if(!validator.isInt(serviceType)){
							err_code = 2;
							err_msg = "Service type is number";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'service_type' in json request.";
					}

					if(typeof req.body.specialty !== 'undefined'){
						specialty =  req.body.specialty;
						if(validator.isEmpty(specialty)){
							err_code = 2;
							err_msg = "Specialty is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'specialty' in json request.";
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

					if(typeof req.body.actor.practitioner_role_id !== 'undefined'){
						actorPractitionerRoleId =  req.body.actor.practitioner_role_id;
						if(validator.isEmpty(actorPractitionerRoleId)){
							actorPractitionerRoleId = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'practitioner_role_id' in json actor request.";
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

					if(typeof req.body.period !== 'undefined'){
						period = req.body.period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							periodStart = arrPeriod[0];
							periodEnd = arrPeriod[1];
							
							if(!regex.test(periodStart) && !regex.test(periodEnd)){
								err_code = 2;
								err_msg = "Period invalid date format.";
							}	
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'period' in json request.";
					}

					if(typeof req.body.comment !== 'undefined'){
						comment = req.body.comment;
						if(validator.isEmpty(comment)){
							comment = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'comment' in json request.";
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkCode(apikey, serviceCategory, 'SERVICE_CATEGORY', function(resServiceCategoryCode){
									if(resServiceCategoryCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, serviceType, 'SERVICE_TYPE', function(resServiceTypeCode){
											if(resServiceTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, specialty, 'PRACTICE_CODE', function(resPracticeCode){
													if(resPracticeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
														//add schedule
														myEmitter.prependOnceListener('addSchedule', function(){
															var scheduleId = 'sch' + uniqid.time();

															var dataSchedule = {
																										"id": scheduleId,
																										"active": "true",
																										"service_category": serviceCategory,
																										"service_type": serviceType,
																										"specialty": specialty,
																										"actor_patient_id": actorPatientId,  
																										"actor_practitioner_id": actorPractitionerId,  
																										"actor_practitioner_role_id": actorPractitionerRoleId,  
																										"actor_related_person_id": actorRelatedPersonId,  
																										"actor_device_id": actorDeviceId,  
																										"actor_healthcare_service_id": actorHealthcareServiceId,  
																										"actor_location_id": actorLocationId,  
																										"period_start" : periodStart,
																										"period_end" : periodEnd,
																										"comment" : comment
																									}
															
															//method, endpoint, params, options, callback
															ApiFHIR.post('schedule', {"apikey": apikey}, {body: dataSchedule, json:true}, function(error, response, body){	
														  	var schedule = body; //object
														  	//cek apakah ada error atau tidak
														  	if(schedule.err_code == 0){
														  		res.json({"err_code": 0, "err_msg": "Schedule has been add.", "data": schedule.data});
														  	}else{
														  		res.json(schedule);
														  	}
															})
														})


														//actor location
														myEmitter.prependOnceListener('checkActorLocationId', function(){
															if(validator.isEmpty(actorLocationId)){
																myEmitter.emit('addSchedule');
															}else{
																checkUniqeValue(apikey, "LOCATION_ID|" + actorLocationId, 'LOCATION', function(resLocationID){
																	if(resLocationID.err_code > 0){
																		myEmitter.emit('addSchedule');
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

														//actor practitioner role
														myEmitter.prependOnceListener('checkActorPractitionerRoleId', function(){
															if(validator.isEmpty(actorPractitionerRoleId)){
																myEmitter.emit('checkActorRelatedPersonId');
															}else{
																checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + actorPractitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
																	if(resPractitionerRoleID.err_code > 0){
																		myEmitter.emit('checkActorRelatedPersonId');
																	}else{
																		res.json({"err_code": 504, "err_msg": "Practitioner Role Id not found"});		
																	}
																})
															}
														})

														//actor practitioner
														myEmitter.prependOnceListener('checkActorPractitionerId', function(){
															if(validator.isEmpty(actorPractitionerId)){
																myEmitter.emit('checkActorPractitionerRoleId');
															}else{
																checkUniqeValue(apikey, "PRACTITIONER_ID|" + actorPractitionerId, 'PRACTITIONER', function(resPractitionerID){
																	if(resPractitionerID.err_code > 0){
																		myEmitter.emit('checkActorPractitionerRoleId');
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
														res.json({"err_code": 503, "err_msg": "Specialty code not found"});		
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Service type code not found"});		
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Service category code not found"});
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
				schedule: function updateSchedule(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var scheduleId = req.params.schedule_id;

					var err_code = 0;
					var err_msg = "";
					var dataSchedule = {};

					if(typeof scheduleId !== 'undefined'){
						if(validator.isEmpty(scheduleId)){
							err_code = 1;
							err_msg = "Schedule Id is required.";
						}
					}else{
						err_code = 1;
						err_msg = "Schedule Id is required.";
					}

					//input check 
					if(typeof req.body.active !== 'undefined'){
						active =  req.body.active;
						if(!validator.isBoolean(active)){
							err_code = 2;
							err_msg = "Active is boolean";
						}else{
							dataSchedule.active = active;
						}
					}

					if(typeof req.body.service_category !== 'undefined'){
						serviceCategory =  req.body.service_category;
						if(!validator.isInt(serviceCategory)){
							err_code = 2;
							err_msg = "Service category is number";
						}else{
							dataSchedule.service_category = serviceCategory;
						}
					}else{
						serviceCategory = "";
					}

					if(typeof req.body.service_type !== 'undefined'){
						serviceType =  req.body.service_type;
						if(!validator.isInt(serviceType)){
							err_code = 2;
							err_msg = "Service type is number";
						}else{
							dataSchedule.service_type = serviceType;
						}
					}else{
						serviceType = "";
					}

					if(typeof req.body.specialty !== 'undefined'){
						specialty =  req.body.specialty;
						if(validator.isEmpty(specialty)){
							err_code = 2;
							err_msg = "Specialty is required";
						}else{
							dataSchedule.specialty = specialty;
						}
					}else{
						specialty = "";
					} 

					if(typeof req.body.actor !== 'undefined'){
						if(typeof req.body.actor.patient_id !== 'undefined'){
							actorPatientId =  req.body.actor.patient_id;
							if(!validator.isEmpty(actorPatientId)){
								dataSchedule.actor_patient_id = actorPatientId;	
							}
						}else{
							actorPatientId = "";
						}

						if(typeof req.body.actor.practitioner_id !== 'undefined'){
							actorPractitionerId =  req.body.actor.practitioner_id;
							if(!validator.isEmpty(actorPractitionerId)){
								dataSchedule.actor_practitioner_id = actorPractitionerId;
							}
						}else{
							actorPractitionerId = "";
						}

						if(typeof req.body.actor.practitioner_role_id !== 'undefined'){
							actorPractitionerRoleId =  req.body.actor.practitioner_role_id;
							if(!validator.isEmpty(actorPractitionerRoleId)){
								dataSchedule.actor_practitioner_role_id = actorPractitionerRoleId;
								
							}
						}else{
							actorPractitionerRoleId = "";
						}

						if(typeof req.body.actor.related_person_id !== 'undefined'){
							actorRelatedPersonId =  req.body.actor.related_person_id;
							if(!validator.isEmpty(actorRelatedPersonId)){
								dataSchedule.actor_related_person_id = actorRelatedPersonId;
							}
						}else{
							actorRelatedPersonId = "";
						}

						if(typeof req.body.actor.device_id !== 'undefined'){
							actorDeviceId =  req.body.actor.device_id;
							if(!validator.isEmpty(actorDeviceId)){
								dataSchedule.actor_device_id = actorDeviceId;
							}
						}else{
							actorDeviceId = "";
						}

						if(typeof req.body.actor.healthcare_service_id !== 'undefined'){
							actorHealthcareServiceId =  req.body.actor.healthcare_service_id;
							if(!validator.isEmpty(actorHealthcareServiceId)){
								dataSchedule.actor_healthcare_service_id = actorHealthcareServiceId;
							}
						}else{
							actorHealthcareServiceId = "";
						}

						if(typeof req.body.actor.location_id !== 'undefined'){
							actorLocationId =  req.body.actor.location_id;
							if(!validator.isEmpty(actorLocationId)){
								dataSchedule.actor_location_id = actorLocationId;
							}
						}else{
							actorLocationId = "";
						}
					}else{
						actorPatientId = "";
						actorPractitionerId = "";
						actorPractitionerRoleId = "";
						actorRelatedPersonId = "";
						actorDeviceId = "";
						actorHealthcareServiceId = "";
						actorLocationId = "";
					}

					if(typeof req.body.period !== 'undefined'){
						period = req.body.period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							periodStart = arrPeriod[0];
							periodEnd = arrPeriod[1];
							
							if(!regex.test(periodStart) && !regex.test(periodEnd)){
								err_code = 2;
								err_msg = "Period invalid date format.";
							}else{
								dataSchedule.period_start = periodStart;
								dataSchedule.period_end = periodEnd;
							}	
						}
					}

					if(typeof req.body.comment !== 'undefined'){
						comment = req.body.comment;
						if(!validator.isEmpty(comment)){
							dataSchedule.comment = comment;		
						}
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								myEmitter.prependOnceListener('updateSchedule', function(){
									checkUniqeValue(apikey, "SCHEDULE_ID|" + scheduleId, 'SCHEDULE', function(resScheduleID){
										if(resScheduleID.err_code > 0){
												ApiFHIR.put('schedule', {"apikey": apikey, "_id": scheduleId}, {body: dataSchedule, json: true}, function(error, response, body){
							  					schedule = body;
							  					if(schedule.err_code > 0){
							  						res.json(schedule);	
							  					}else{
							  						res.json({"err_code": 0, "err_msg": "Schedule has been update.", "data": schedule.data});
							  					}
							  				})
										}else{
											res.json({"err_code": 504, "err_msg": "Schedule Id not found"});		
										}
									})
								})

								//actor location
								myEmitter.prependOnceListener('checkActorLocationId', function(){
									if(validator.isEmpty(actorLocationId)){
										myEmitter.emit('updateSchedule');
									}else{
										checkUniqeValue(apikey, "LOCATION_ID|" + actorLocationId, 'LOCATION', function(resLocationID){
											if(resLocationID.err_code > 0){
												myEmitter.emit('updateSchedule');
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

								//actor practitioner role
								myEmitter.prependOnceListener('checkActorPractitionerRoleId', function(){
									if(validator.isEmpty(actorPractitionerRoleId)){
										myEmitter.emit('checkActorRelatedPersonId');
									}else{
										checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + actorPractitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
											if(resPractitionerRoleID.err_code > 0){
												myEmitter.emit('checkActorRelatedPersonId');
											}else{
												res.json({"err_code": 504, "err_msg": "Practitioner Role Id not found"});		
											}
										})
									}
								})

								//actor practitioner
								myEmitter.prependOnceListener('checkActorPractitionerId', function(){
									if(validator.isEmpty(actorPractitionerId)){
										myEmitter.emit('checkActorPractitionerRoleId');
									}else{
										checkUniqeValue(apikey, "PRACTITIONER_ID|" + actorPractitionerId, 'PRACTITIONER', function(resPractitionerID){
											if(resPractitionerID.err_code > 0){
												myEmitter.emit('checkActorPractitionerRoleId');
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

								//specialty
								myEmitter.prependOnceListener('checkSpecialtyCode', function(){
									if(validator.isEmpty(specialty)){
										myEmitter.emit('checkActorPatientId');
									}else{
										checkCode(apikey, specialty, 'PRACTICE_CODE', function(resPracticeCode){
											if(resPracticeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkActorPatientId');
											}else{
												res.json({"err_code": 501, "err_msg": "Specialty code not found"});
											}	
										})
									}
								})

								//serviceType
								myEmitter.prependOnceListener('checkServiceTypeCode', function(){
									if(validator.isEmpty(serviceType)){
										myEmitter.emit('checkSpecialtyCode');
									}else{
										checkCode(apikey, serviceType, 'SERVICE_TYPE', function(resServiceTypeCode){
											if(resServiceTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkSpecialtyCode');
											}else{
												res.json({"err_code": 501, "err_msg": "Service type code not found"});
											}	
										})
									}	
								})
																
								//serviceCategory
								if(validator.isEmpty(serviceCategory)){
									myEmitter.emit('checkServiceTypeCode');
								}else{
									checkCode(apikey, serviceCategory, 'SERVICE_CATEGORY', function(resServiceCategoryCode){
										if(resServiceCategoryCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkServiceTypeCode');
										}else{
											res.json({"err_code": 501, "err_msg": "Service category code not found"});
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