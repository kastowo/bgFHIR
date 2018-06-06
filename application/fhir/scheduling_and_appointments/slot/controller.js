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
				slot: function getSlot(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var slotId = req.query._id;
					var scheduleId = req.query.schedule;
					var slotServiceType = req.query.slot_type;
					var slotStart = req.query.start;
					var slotStatus = req.query.status;
					
					var qString = {};
					if(typeof slotId !== 'undefined'){
						if(!validator.isEmpty(slotId)){
							qString._id = slotId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Slot ID is required."})
						}
					}

					if(typeof scheduleId !== 'undefined'){
						if(!validator.isEmpty(scheduleId)){
							qString.schedule_id = scheduleId; 
						}
					}

					if(typeof slotServiceType !== 'undefined'){
						if(!validator.isEmpty(slotServiceType)){
							qString.service_type = slotServiceType; 
						}else{
							res.json({"err_code": 1, "err_msg": "Actor is empty."});
						}
					}

					if(typeof slotStart !== 'undefined'){
						if(!validator.isEmpty(slotStart)){
							if(!regex.test(slotStart)){
								res.json({"err_code": 1, "err_msg": "Start date invalid format."});
							}else{
								qString.start = slotStart; 
							}	
						}else{
							res.json({"err_code": 1, "err_msg": "Start date is empty."});
						}
					}

					if(typeof slotStatus !== 'undefined'){
						if(!validator.isEmpty(slotStatus)){
							qString.status = slotStatus; 
						}else{
							res.json({"err_code": 1, "err_msg": "Status is empty."});
						}
					}
					
					seedPhoenixFHIR.path.GET = {
						"Slot" : {
							"location": "%(apikey)s/slot",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('Slot', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var slot = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(slot.err_code == 0){
								  	//cek jumdata dulu
								  	if(slot.data.length > 0){
								  		res.json({"err_code": 0, "data":slot.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Slot is empty."});	
								  	}
							  	}else{
							  		res.json(slot);
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
				slot: function addSlot(req, res){
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

					if(typeof req.body.schedule_id !== 'undefined'){
						scheduleId =  req.body.schedule_id;
						if(validator.isEmpty(scheduleId)){
							err_code = 2;
							err_msg = "Schedule ID is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'schedule_id' in json request.";
					}

					if(typeof req.body.status !== 'undefined'){
						slotStatus =  req.body.status;
						if(validator.isEmpty(slotStatus)){
							err_code = 2;
							err_msg = "Status is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'status' in json request.";
					} 

					if(typeof req.body.start !== 'undefined'){
						slotStart = req.body.start;
						if(!regex.test(slotStart)){
							err_code = 2;
							err_msg = "Start is invalid date time format. Exp : 2018-04-02 14:21";
						}	
					}else{
						err_code = 1;
						err_msg = "Please add key 'start' in json request.";
					}

					if(typeof req.body.end !== 'undefined'){
						slotEnd = req.body.end;
						if(!regex.test(slotEnd)){
							err_code = 2;
							err_msg = "End is invalid date time format. Exp : 2018-04-02 15:21";
						}	
					}else{
						err_code = 1;
						err_msg = "Please add key 'end' in json request.";
					}

					if(typeof req.body.overbooked !== 'undefined'){
						overbooked = req.body.overbooked;
						if(!validator.isBoolean(overbooked)){
							err_code = 2;
							err_msg = "Overbooked is boolean.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'comment' in json request.";
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
														checkCode(apikey, appointmentType, 'APPOINTMENT_REASON_CODE', function(resAppointmentTypeCode){
															if(resAppointmentTypeCode.err_code > 0){
																checkUniqeValue(apikey, "SCHEDULE_ID|" + scheduleId, 'SCHEDULE', function(resScheduleID){
																	if(resScheduleID.err_code > 0){
																		checkCode(apikey, slotStatus, 'SLOT_STATUS', function(resSlotStatusCode){
																			if(resSlotStatusCode.err_code > 0){
																				//add Slot
																				var slotId = 'slo' + uniqid.time();

																				var dataSlot = {
																													"id": slotId,
																													"service_category": serviceCategory,
																													"service_type": serviceType,
																													"specialty": specialty,
																													"appointment_type": appointmentType,
																													"schedule_id": scheduleId, 
																													"status": slotStatus, 
																													"start" : slotStart,
																													"end" : slotEnd,
																													"overbooked": overbooked,
																													"comment" : comment
																												}
																				
																				//method, endpoint, params, options, callback
																				ApiFHIR.post('slot', {"apikey": apikey}, {body: dataSlot, json:true}, function(error, response, body){	
																			  	var slot = body; //object
																			  	//cek apakah ada error atau tidak
																			  	if(slot.err_code == 0){
																			  		res.json({"err_code": 0, "err_msg": "Slot has been add.", "data": slot.data});
																			  	}else{
																			  		res.json(slot);
																			  	}
																				})
																			}else{
																				res.json({"err_code": 506, "err_msg": "Slot Status not found"});		
																			}
																		})
																	}else{
																		res.json({"err_code": 505, "err_msg": "Schedule Id not found"});		
																	}
																})
															}else{
																res.json({"err_code": 504, "err_msg": "Appointment Type not found"});		
															}
														})
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
				slot: function updateSlot(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var slotId = req.params.slot_id;

					var err_code = 0;
					var err_msg = "";
					var dataSlot = {};

					if(typeof slotId !== 'undefined'){
						if(validator.isEmpty(slotId)){
							err_code = 1;
							err_msg = "Slot Id is required.";
						}
					}else{
						err_code = 1;
						err_msg = "Slot Id is required.";
					}

					//input check 
					if(typeof req.body.service_category !== 'undefined'){
						serviceCategory =  req.body.service_category;
						if(!validator.isInt(serviceCategory)){
							err_code = 2;
							err_msg = "Service category is number";
						}else{
							dataSlot.service_category = serviceCategory;
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
							dataSlot.service_type = serviceType;
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
							dataSlot.specialty = specialty;
						}
					}else{
						specialty = "";
					}

					if(typeof req.body.appointment_type !== 'undefined'){
						appointmentType =  req.body.appointment_type;
						if(validator.isEmpty(appointmentType)){
							err_code = 2;
							err_msg = "Appointment Type is required";
						}else{
							dataSlot.appointment_type = appointmentType;
						}
					}else{
						appointmentType = "";
					} 

					if(typeof req.body.schedule_id !== 'undefined'){
						scheduleId =  req.body.schedule_id;
						if(validator.isEmpty(scheduleId)){
							err_code = 2;
							err_msg = "Schedule ID is required";
						}else{
							dataSlot.schedule_id = scheduleId;
						}
					}else{
						scheduleId = "";
					}

					if(typeof req.body.status !== 'undefined'){
						slotStatus =  req.body.status;
						if(validator.isEmpty(slotStatus)){
							err_code = 2;
							err_msg = "Status is required";
						}else{
							dataSlot.status = slotStatus;
						}
					}else{
						slotStatus = "";
					} 

					if(typeof req.body.start !== 'undefined'){
						slotStart = req.body.start;
						if(!regex.test(slotStart)){
							err_code = 2;
							err_msg = "Start is invalid date time format. Exp : 2018-04-02 14:21";
						}else{
							dataSlot.start = slotStart;
						}	
					}

					if(typeof req.body.end !== 'undefined'){
						slotEnd = req.body.end;
						if(!regex.test(slotEnd)){
							err_code = 2;
							err_msg = "End is invalid date time format. Exp : 2018-04-02 15:21";
						}else{
							dataSlot.end = slotEnd;
						}	
					}

					if(typeof req.body.overbooked !== 'undefined'){
						overbooked = req.body.overbooked;
						if(!validator.isBoolean(overbooked)){
							err_code = 2;
							err_msg = "Overbooked is boolean.";
						}else{
							dataSlot.overbooked = overbooked;
						}
					}

					if(typeof req.body.comment !== 'undefined'){
						comment = req.body.comment;
						dataSlot.comment = comment;
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								myEmitter.prependOnceListener('updateSlot', function(){
									checkUniqeValue(apikey, "SLOT_ID|" + slotId, 'SLOT', function(resSlotID){
										if(resSlotID.err_code > 0){
												ApiFHIR.put('slot', {"apikey": apikey, "_id": slotId}, {body: dataSlot, json: true}, function(error, response, body){
							  					slot = body;
							  					if(slot.err_code > 0){
							  						res.json(slot);	
							  					}else{
							  						res.json({"err_code": 0, "err_msg": "Slot has been update.", "data": slot.data});
							  					}
							  				})
										}else{
											res.json({"err_code": 504, "err_msg": "Slot Id not found"});		
										}
									})
								})

								//schedule
								myEmitter.prependOnceListener('checkScheduleID', function(){
									if(validator.isEmpty(scheduleId)){
										myEmitter.emit('updateSlot');
									}else{
										checkUniqeValue(apikey, "SCHEDULE_ID|" + scheduleId, 'SCHEDULE', function(resScheduleID){
											if(resScheduleID.err_code > 0){
												myEmitter.emit('updateSlot');	
											}else{
												res.json({"err_code": 506, "err_msg": "Schedule Id not found"});		
											}
										})
									}
								})

								//slot status
								myEmitter.prependOnceListener('checkSlotStatusCode', function(){
									if(validator.isEmpty(slotStatus)){
										myEmitter.emit('checkScheduleID');
									}else{
										checkCode(apikey, slotStatus, 'SLOT_STATUS', function(resSlotStatusCode){
											if(resSlotStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkScheduleID');
											}else{
												res.json({"err_code": 505, "err_msg": "Slot Status code not found"});
											}	
										})
									}
								})

								//appointment type
								myEmitter.prependOnceListener('checkAppointmentTypeCode', function(){
									if(validator.isEmpty(appointmentType)){
										myEmitter.emit('checkSlotStatusCode');
									}else{
										checkCode(apikey, appointmentType, 'APPOINTMENT_REASON_CODE', function(resAppointmentTypeCode){
											if(resAppointmentTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkSlotStatusCode');
											}else{
												res.json({"err_code": 504, "err_msg": "Appointment Type code not found"});
											}	
										})
									}
								})

								//specialty
								myEmitter.prependOnceListener('checkSpecialtyCode', function(){
									if(validator.isEmpty(specialty)){
										myEmitter.emit('checkAppointmentTypeCode');
									}else{
										checkCode(apikey, specialty, 'PRACTICE_CODE', function(resPracticeCode){
											if(resPracticeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkAppointmentTypeCode');
											}else{
												res.json({"err_code": 503, "err_msg": "Specialty code not found"});
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
												res.json({"err_code": 502, "err_msg": "Service type code not found"});
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