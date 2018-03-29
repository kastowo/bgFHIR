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
		group: function getGroup(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			//params from query string
			var groupId = req.query._id;
			var groupActual = req.query.actual;
			var groupCharacteristic = req.query.characteristic;
			var groupCharacteristicValue = req.query.characteristic_value;
			var groupCode = req.query.code;
			var groupExclude = req.query.exclude;
			var groupMember = req.query.member;
			var groupType = req.query.type;
			var groupValue = req.query.value;


			var qString = {};
			if(typeof groupId !== 'undefined'){
				if(!validator.isEmpty(groupId)){
					qString._id = groupId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Group ID is required."})
				}
			}

			if(typeof groupActual !== 'undefined'){
				if(validator.isBoolean(groupActual)){
					qString.actual = groupActual; 
				}else{
					res.json({"err_code": 1, "err_msg": "Actual is boolean."});
				}
			}

			if(typeof groupCharacteristic !== 'undefined'){
				if(!validator.isEmpty(groupCharacteristic)){
					qString.characteristic = groupCharacteristic; 
				}else{
					res.json({"err_code": 1, "err_msg": "Characteristic is empty."});
				}
			}

			if(typeof groupCharacteristicValue !== 'undefined'){
				if(!validator.isEmpty(groupCharacteristicValue)){
					if(groupCharacteristicValue.indexOf(" ") > 0){
						qString.characteristicvalue = groupCharacteristicValue.replace(/ /g, "nonbreaking_space"); 
					}else{
						qString.characteristicvalue = groupCharacteristicValue; 	
					} 
				}else{
					res.json({"err_code": 1, "err_msg": "Characteristic value is empty."});
				}
			}

			if(typeof groupValue !== 'undefined'){
				if(!validator.isEmpty(groupValue)){
					if(groupValue.indexOf(" ") > 0){
						qString.value = groupValue.replace(/ /g, "nonbreaking_space"); 
					}else{
						qString.value = groupValue; 	
					} 
				}else{
					res.json({"err_code": 1, "err_msg": "Value is empty."});
				}
			}

			if(typeof groupCode !== 'undefined'){
				if(!validator.isEmpty(groupCode)){
					qString.code = groupCode; 
				}else{
					res.json({"err_code": 1, "err_msg": "Code is empty."});
				}
			}

			if(typeof groupExclude !== 'undefined'){
				if(validator.isBoolean(groupExclude)){
					qString.exclude = groupExclude; 
				}else{
					res.json({"err_code": 1, "err_msg": "Exclude is boolean."});
				}
			}

			if(typeof groupMember !== 'undefined'){
				if(!validator.isEmpty(groupMember)){
					qString.member = groupMember; 
				}else{
					res.json({"err_code": 1, "err_msg": "Member is empty."});
				}
			}

			if(typeof groupType !== 'undefined'){
				if(!validator.isEmpty(groupType)){
					qString.type = groupType; 
				}else{
					res.json({"err_code": 1, "err_msg": "Member is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"Group" : {
					"location": "%(apikey)s/Group_",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Group', {"apikey": apikey}, {}, function (error, response, body) {
					  if(error){
					  	res.json(error);
					  }else{
					  	var group = JSON.parse(body); //object
					  	//cek apakah ada error atau tidak
					  	if(group.err_code == 0){
						  	//cek jumdata dulu
						  	if(group.data.length > 0){
						  		newGroup = [];
						  		for(i=0; i < group.data.length; i++){
						  			myEmitter.once("getGroupCharacteristic", function(group, index, newGroup, countGroup){
							  			qString = {};
							  			qString.group_id = group.identifier;
								  		seedPhoenixFHIR.path.GET = {
												"GroupCharacteristic" : {
													"location": "%(apikey)s/GroupCharacteristic",
													"query": qString
												}
											}
											var ApiFHIR = new Apiclient(seedPhoenixFHIR);

											ApiFHIR.get("GroupCharacteristic", {"apikey": apikey}, {}, function(error, response, body){
												groupCharacteristic = JSON.parse(body);
												if(groupCharacteristic.err_code == 0){
													var objectGroup = {};
													objectGroup.resourceType = group.resourceType;
													objectGroup.identifier = group.identifier;
													objectGroup.active = group.active;
													objectGroup.type = group.type;
													objectGroup.actual = group.actual;
													objectGroup.code = group.code;
													objectGroup.name = group.name;
													objectGroup.quantity = group.quantity;
													objectGroup.characteristic = groupCharacteristic.data;

													newGroup[index] = objectGroup;

													myEmitter.once("getGroupMember", function(group, index, newGroup, countGroup){
														//get identifier
										  			qString = {};
										  			qString.group_id = group.identifier;
										  			
											  		seedPhoenixFHIR.path.GET = {
															"GroupMember" : {
																"location": "%(apikey)s/GroupMember",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('GroupMember', {"apikey": apikey}, {}, function(error, response, body){
															groupMember = JSON.parse(body);
															if(groupMember.err_code == 0){
																var objectGroup = {};
																objectGroup.resourceType = group.resourceType;
																objectGroup.identifier = group.identifier;
																objectGroup.active = group.active;
																objectGroup.type = group.type;
																objectGroup.actual = group.actual;
																objectGroup.code = group.code;
																objectGroup.name = group.name;
																objectGroup.quantity = group.quantity;
																objectGroup.characteristic = group.characteristic;
																objectGroup.member = groupMember.data;

																newGroup[index] = objectGroup;

																if(index == countGroup -1 ){
																	res.json({"err_code": 0, "data":newGroup});				
																}
															}else{
																res.json(groupMember);
															}
														})
													})
													myEmitter.emit("getGroupMember", objectGroup, index, newGroup, countGroup);
												}else{
													res.json(groupCharacteristic);
												}
											})
						  			})
										myEmitter.emit("getGroupCharacteristic", group.data[i], i, newGroup, group.data.length);
						  		}
						  	}else{
					  			res.json({"err_code": 2, "err_msg": "Group not found."});	
						  	}
					  	}else{
					  		res.json(person);
					  	}
					  }
					});
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		},
		member: function getGroupMember(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			//params from query string
			var groupId = req.params.group_id;
			var groupMemberId = req.params.member_id;
			

			var qString = {};
			if(typeof groupId !== 'undefined'){
				if(!validator.isEmpty(groupId)){
					qString._id = groupMemberId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Member ID is required."})
				}
			}

			if(typeof groupId !== 'undefined'){
				if(!validator.isEmpty(groupId)){
					qString.group_id = groupId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Group ID is required."})
				}
			}

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					seedPhoenixFHIR.path.GET = {
						"GroupMember" : {
							"location": "%(apikey)s/GroupMember",
							"query": qString
						}
					}

					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

					ApiFHIR.get('GroupMember', {"apikey": apikey}, {}, function(error, response, body){
						groupMember = JSON.parse(body);
						if(groupMember.err_code == 0){
							res.json({"err_code": 0, "data":groupMember.data});				
						}else{
							res.json(groupMember);
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		},
		characteristic: function getGroupCharacteristic(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			//params from query string
			var groupId = req.params.group_id;
			var groupCharacteristicId = req.params.characteristic_id;
			

			var qString = {};
			if(typeof groupId !== 'undefined'){
				if(!validator.isEmpty(groupId)){
					qString._id = groupCharacteristicId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Characteristic ID is required."})
				}
			}

			if(typeof groupId !== 'undefined'){
				if(!validator.isEmpty(groupId)){
					qString.group_id = groupId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Group ID is required."})
				}
			}

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					seedPhoenixFHIR.path.GET = {
						"GroupCharacteristic" : {
							"location": "%(apikey)s/GroupCharacteristic",
							"query": qString
						}
					}

					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

					ApiFHIR.get('GroupCharacteristic', {"apikey": apikey}, {}, function(error, response, body){
						groupCharacteristic = JSON.parse(body);
						if(groupCharacteristic.err_code == 0){
							res.json({"err_code": 0, "data":groupCharacteristic.data});				
						}else{
							res.json(groupCharacteristic);
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		}
	},
	post: {
		group: function addGroup(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var err_code = 0;
			var err_msg = "";

			//input check 
			//identifier
			if(typeof req.body.type !== 'undefined'){
				groupTypeCode =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(groupTypeCode)){
					err_code = 2;
					err_msg = "Type is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'type' in json request.";
			} 

			if(typeof req.body.actual !== 'undefined'){
				groupActual = req.body.actual;
				if(validator.isEmpty(groupActual)){
					err_code = 2;
					err_msg = "Actual is required";
				}else{
					if(!validator.isBoolean(groupActual)){
						err_code = 2;
						err_msg = "Actual is boolean";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'actual' in json request.";
			} 

			if(typeof req.body.code !== 'undefined'){
				groupCode = req.body.code;
				if(validator.isEmpty(groupCode)){
					err_code = 2;
					err_msg = "Code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'code' in json request.";
			} 

			if(typeof req.body.name !== 'undefined'){
				groupName = req.body.name;
				if(validator.isEmpty(groupName)){
					err_code = 2;
					err_msg = "Name is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'name' in json request.";
			}

			if(typeof req.body.quantity !== 'undefined'){
				groupQuantity = req.body.quantity;
				if(!validator.isInt(groupQuantity)){
					err_code = 2;
					err_msg = "Quantity must be number.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'quantity' in json request.";
			}

			if(typeof req.body.characteristic.code !== 'undefined'){
				characteristicCode = req.body.characteristic.code;
				if(validator.isEmpty(characteristicCode)){
					err_code = 2;
					err_msg = "Characteristic code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json characteristic request.";
			}

			if(typeof req.body.characteristic.value !== 'undefined'){
				characteristicValue = req.body.characteristic.value;
				if(validator.isEmpty(characteristicValue)){
					err_code = 2;
					err_msg = "Characteristic value is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value' in json characteristic request.";
			}

			if(typeof req.body.characteristic.exclude !== 'undefined'){
				characteristicExclude = req.body.characteristic.exclude;
				if(!validator.isBoolean(characteristicExclude)){
					err_code = 2;
					err_msg = "Characteristic exclude is boolean.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'exclude' in json characteristic request.";
			} 

			
			if(typeof req.body.characteristic.period !== 'undefined'){
				characteristicPeriod = req.body.characteristic.period;
				if(characteristicPeriod.indexOf("to") > 0){
					arrPeriod = characteristicPeriod.split("to");
					characteristicPeriodStart = arrPeriod[0];
					characteristicPeriodEnd = arrPeriod[1];
					
					if(!regex.test(characteristicPeriodStart) && !regex.test(characteristicPeriodEnd)){
						err_code = 2;
						err_msg = "Characteristic period invalid date format.";
					}	
				}else{
					err_code = 3;
					err_msg = "Period format request is not valid. format: date to date";
				}
			}else{
				characteristicPeriodStart = "";
				characteristicPeriodEnd = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, groupTypeCode, 'GROUP_TYPE', function(resGroupType){
							if(resGroupType.err_code > 0){
								checkUniqeValue(apikey, "GROUP_CODE|" + groupCode, 'GROUP_', function(resGroupCode){
									if(resGroupCode.err_code == 0){
										var groupId = 'grp' + uniqid.time();
										var groupCharacteristicId = 'gc' + uniqid.time();
										
										//group
										dataGroup = {
																	"id": groupId,
																	"active": "true",
																	"type": groupTypeCode,
																	"actual": groupActual,
																	"code": groupCode,
							  									"name": groupName,
							  									"quantity": groupQuantity
							  								}
							  		ApiFHIR.post('group', {"apikey": apikey}, {body: dataGroup, json: true}, function(error, response, body){
							  			var group = body;
							  			if(group.err_code > 0){
							  				res.json(group);
							  			}
							  		})
							  		
							  		//group_characteristic
							  		dataGroupCharacteristic = {
												  											"id": groupCharacteristicId,
										  													"code": characteristicCode,
										  													"value": characteristicValue,
										  													"exclude": characteristicExclude,
										  													"period_start": characteristicPeriodStart,
										  													"period_end": characteristicPeriodEnd,
										  													"group_id": groupId
										  												}
									
					  				ApiFHIR.post('groupCharacteristic', {"apikey": apikey}, {body: dataGroupCharacteristic, json: true}, function(error, response, body){
					  					groupCharacteristic = body;
					  					if(groupCharacteristic.err_code > 0){
					  						res.json(groupCharacteristic);	
					  					}
					  				})
					  				res.json({"err_code": 0, "err_msg": "Group has been add.", "data": [{"_id": groupId}]});
									}else{
										res.json({"err_code": 502, "err_msg": "Group code already exist."})
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Group Type not found"});		
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
		member: function addMember(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var groupId = req.params.group_id;

			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var err_code = 0;
			var err_msg = "";

			if(typeof groupId !== 'undefined'){
				if(validator.isEmpty(groupId)){
					err_code = 2;
					err_msg = "Group id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Parameter group id not found.";
			} 

			if(typeof req.body.entity.patient_id !== 'undefined'){
				memberEntityPatient = req.body.entity.patient_id;
				if(validator.isEmpty(memberEntityPatient)){
					memberEntityPatient = "";
				}
			}else{
				memberEntityPatient = "";
			}

			if(typeof req.body.entity.practitioner_id !== 'undefined'){
				memberEntityPractitioner = req.body.entity.practitioner_id;
				if(validator.isEmpty(memberEntityPractitioner)){
					memberEntityPractitioner = "";
				}
			}else{
				memberEntityPractitioner = "";
			}

			if(typeof req.body.entity.device_id !== 'undefined'){
				memberEntityDevice = req.body.entity.device_id;
				if(validator.isEmpty(memberEntityDevice)){
					memberEntityDevice = "";
				}
			}else{
				memberEntityDevice = "";
			}

			if(typeof req.body.entity.medication_id !== 'undefined'){
				memberEntityMedication = req.body.entity.medication_id;
				if(validator.isEmpty(memberEntityMedication)){
					memberEntityMedication = "";
				}
			}else{
				memberEntityMedication = "";
			}

			if(typeof req.body.entity.substance_id !== 'undefined'){
				memberEntitySubstance = req.body.entity.substance_id;
				if(validator.isEmpty(memberEntitySubstance)){
					memberEntitySubstance = "";
				}
			}else{
				memberEntitySubstance = "";
			}

			if(validator.isEmpty(memberEntityPatient) && validator.isEmpty(memberEntityPractitioner) && validator.isEmpty(memberEntityDevice) && validator.isEmpty(memberEntityMedication) && validator.isEmpty(memberEntitySubstance)){
				err_code = 2;
				err_msg = "Please fill in one of the entity";
			}

			if(typeof req.body.entity.period !== 'undefined'){
				memberPeriod = req.body.entity.period;
				if(memberPeriod.indexOf("to") > 0){
					arrPeriod = memberPeriod.split("to");
					memberPeriodStart = arrPeriod[0];
					memberPeriodEnd = arrPeriod[1];
					
					if(!regex.test(memberPeriodStart) && !regex.test(memberPeriodEnd)){
						err_code = 2;
						err_msg = "Member period invalid date format.";
					}	
				}else{
					err_code = 3;
					err_msg = "Period format request is not valid. format: date to date";
				}
			}else{
				memberPeriodStart = "";
				memberPeriodEnd = "";
			}


			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkUniqeValue(apikey, "GROUP_ID|" + groupId, 'GROUP_', function(resultCheckId){
							if(resultCheckId.err_code > 0){ //menunjukan data tersebut ada, 
								checkGroupQouta(apikey, groupId, function(resGroupQuota){
									if(resGroupQuota.err_code == 0){
										//local function, menggunakan emitter ada bug
										function addMember(groupId, dataGroupMember){
											ApiFHIR.post('groupMember', {"apikey": apikey, "group_id": groupId}, {body: dataGroupMember, json: true}, function(error, response, body){
								  			var groupMember = body;
								  			if(groupMember.err_code > 0){
								  				res.json(groupMember);
								  			}
								  		})
								  		res.json({"err_code": 0, "err_msg": "Member has been add in this group.", "data": [{"_id": groupMemberId}]});	
										}

										
											var groupMemberId = 'gm' + uniqid.time();
											//group
											var dataGroupMember = {
																					"id": groupMemberId,
																					"patient_id": memberEntityPatient,
																					"practitioner_id": memberEntityPractitioner,
																					"device_id": memberEntityDevice,
																					"medication_id": memberEntityMedication,
																					"substance_id": memberEntitySubstance,
																					"period_start": memberPeriodStart,
																					"period_end": memberPeriodEnd,
																					"inactive": false,
																					"group_id": groupId
											  								}

										//check member apakah sudah ada di group yang sama
										if(!validator.isEmpty(memberEntityPatient)){
											checkMemberEntityGroup(apikey, 'GROUP_MEMBER_ENTITY_PATIENT_ID|'+ memberEntityPatient, groupId, function(resMemberEntity){
												if(resMemberEntity.err_code == 0){
													checkUniqeValue(apikey, "PATIENT_ID|" + memberEntityPatient, 'PATIENT', function(resultCheckEntity){
														if(resultCheckEntity.err_code > 0){
															addMember(groupId, dataGroupMember);
														}else{
															res.json({"err_code": 502, "err_msg": "Patient id not found."});
														}
													})
												}else{
													res.json(resMemberEntity);
												}
											})
										}else if(!validator.isEmpty(memberEntityPractitioner)){
											checkMemberEntityGroup(apikey, 'GROUP_MEMBER_ENTITY_PRACTITIONER_ID|'+ memberEntityPractitioner, groupId, function(resMemberEntity){
												if(resMemberEntity.err_code == 0){
													checkUniqeValue(apikey, "PRACTITIONER_ID|" + memberEntityPractitioner, 'PRACTITIONER', function(resultCheckEntity){
														if(resultCheckEntity.err_code > 0){
															addMember(groupId, dataGroupMember)
														}else{
															res.json({"err_code": 502, "err_msg": "Practitioner id not found."});
														}
													})
												}else{
													res.json(resMemberEntity);
												}
											})
										}else if(!validator.isEmpty(memberEntityDevice)){
											checkMemberEntityGroup(apikey, 'GROUP_MEMBER_ENTITY_DEVICE_ID|'+ memberEntityDevice, groupId, function(resMemberEntity){
												if(resMemberEntity.err_code == 0){
													checkUniqeValue(apikey, "DEVICE_ID|" + memberEntityDevice, 'DEVICE', function(resultCheckEntity){
														if(resultCheckEntity.err_code > 0){
															addMember(groupId, dataGroupMember)
														}else{
															res.json({"err_code": 502, "err_msg": "Device id not found."});
														}
													})
												}else{
													res.json(resMemberEntity);
												}
											})
										}else if(!validator.isEmpty(memberEntityMedication)){
											checkMemberEntityGroup(apikey, 'GROUP_MEMBER_ENTITY_MEDICATION_ID|'+ memberEntityMedication, groupId, function(resMemberEntity){
												if(resMemberEntity.err_code == 0){
													checkUniqeValue(apikey, "MEDICATION_ID|" + memberEntityMedication, 'MEDICATION', function(resultCheckEntity){
														if(resultCheckEntity.err_code > 0){
															addMember(groupId, dataGroupMember);
														}else{
															res.json({"err_code": 502, "err_msg": "Medication id not found."});
														}
													})
												}else{
													res.json(resMemberEntity);
												}
											})
										}else if(!validator.isEmpty(memberEntitySubstance)){
											checkMemberEntityGroup(apikey, 'GROUP_MEMBER_ENTITY_SUBSTANCE_ID|'+ memberEntitySubstance, groupId, function(resMemberEntity){
												if(resMemberEntity.err_code == 0){
													checkUniqeValue(apikey, "SUBSTANCE_ID|" + memberEntitySubstance, 'SUBSTANCE', function(resultCheckEntity){
														if(resultCheckEntity.err_code > 0){
															addMember(groupId, dataGroupMember);
														}else{
															res.json({"err_code": 502, "err_msg": "Substance id not found."});
														}
													})
												}else{
													res.json(resMemberEntity);
												}
											})
										}else{
											addMember(groupId, dataGroupMember);
										}			
									}else{
										res.json(resGroupQuota);		
									}
								})	
							}else{
								res.json({"err_code": 501, "err_msg": "Group id not found."});
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
		characteristic: function addCharacteristic(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var groupId = req.params.group_id;

			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var err_code = 0;
			var err_msg = "";

			if(typeof groupId !== 'undefined'){
				if(validator.isEmpty(groupId)){
					err_code = 2;
					err_msg = "Group id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Parameter group id not found.";
			} 

			if(typeof req.body.characteristic.code !== 'undefined'){
				characteristicCode = req.body.characteristic.code;
				if(validator.isEmpty(characteristicCode)){
					err_code = 2;
					err_msg = "Characteristic code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json characteristic request.";
			}

			if(typeof req.body.characteristic.value !== 'undefined'){
				characteristicValue = req.body.characteristic.value;
				if(validator.isEmpty(characteristicValue)){
					err_code = 2;
					err_msg = "Characteristic value is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value' in json characteristic request.";
			}

			if(typeof req.body.characteristic.exclude !== 'undefined'){
				characteristicExclude = req.body.characteristic.exclude;
				if(!validator.isBoolean(characteristicExclude)){
					err_code = 2;
					err_msg = "Characteristic exclude is boolean.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'exclude' in json characteristic request.";
			} 

			
			if(typeof req.body.characteristic.period !== 'undefined'){
				characteristicPeriod = req.body.characteristic.period;
				if(characteristicPeriod.indexOf("to") > 0){
					arrPeriod = characteristicPeriod.split("to");
					characteristicPeriodStart = arrPeriod[0];
					characteristicPeriodEnd = arrPeriod[1];
					
					if(!regex.test(characteristicPeriodStart) && !regex.test(characteristicPeriodEnd)){
						err_code = 2;
						err_msg = "Characteristic period invalid date format.";
					}	
				}else{
					err_code = 3;
					err_msg = "Period format request is not valid. format: date to date";
				}
			}else{
				characteristicPeriodStart = "";
				characteristicPeriodEnd = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkUniqeValue(apikey, "GROUP_ID|" + groupId, 'GROUP_', function(resultCheckId){
							if(resultCheckId.err_code > 0){ //menunjukan data tersebut ada, 
								var groupCharacteristicId = 'gc' + uniqid.time();
					  		//group_characteristic
					  		dataGroupCharacteristic = {
										  											"id": groupCharacteristicId,
								  													"code": characteristicCode,
								  													"value": characteristicValue,
								  													"exclude": characteristicExclude,
								  													"period_start": characteristicPeriodStart,
								  													"period_end": characteristicPeriodEnd,
								  													"group_id": groupId
								  												}
							
			  				ApiFHIR.post('groupCharacteristic', {"apikey": apikey}, {body: dataGroupCharacteristic, json: true}, function(error, response, body){
			  					groupCharacteristic = body;
			  					if(groupCharacteristic.err_code == 0){
			  						res.json({"err_code": 0, "err_msg": "Characteristic has been add this group.", "data": groupCharacteristic.data});
			  					}else{
			  						res.json(groupCharacteristic);	
			  					}
			  				})
							}else{
								res.json({"err_code": 501, "err_msg": "Group id not found."});
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
		group: function updateGroup(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var groupId = req.params.group_id;

			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var err_code = 0;
			var err_msg = "";
			var dataGroup = {};

			if(typeof groupId !== 'undefined'){
				if(validator.isEmpty(groupId)){
					err_code = 2;
					err_msg = "Group id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Parameter group id not found.";
			}  

			//input check 
			
			if(typeof req.body.active !== 'undefined'){
				groupActive = req.body.active; 
				if(!validator.isBoolean(groupActive)){
					err_code = 2;
					err_msg = "Active is boolean";
				}else{
					dataGroup.active = groupActive;
				}
			}

			if(typeof req.body.type !== 'undefined'){
				groupTypeCode =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(groupTypeCode)){
					err_code = 2;
					err_msg = "Type is required";
				}else{
					dataGroup.type = groupTypeCode;
				}
			}else{
				groupTypeCode = ""
			} 

			if(typeof req.body.actual !== 'undefined'){
				groupActual = req.body.actual;	
				if(!validator.isBoolean(groupActual)){
					err_code = 2;
					err_msg = "Actual is boolean";
				}else{
					dataGroup.actual = groupActual;
				}
			} 

			if(typeof req.body.code !== 'undefined'){
				groupCode = req.body.code;
				if(validator.isEmpty(groupCode)){
					err_code = 2;
					err_msg = "Code is required";
				}else{
					dataGroup.code = groupCode;
				}
			}else{
				groupCode = "";
			} 

			if(typeof req.body.name !== 'undefined'){
				groupName = req.body.name;
				if(validator.isEmpty(groupName)){
					err_code = 2;
					err_msg = "Name is required";
				}else{
					dataGroup.name = groupName;
				}
			}

			if(typeof req.body.quantity !== 'undefined'){
				groupQuantity = req.body.quantity;
				if(!validator.isInt(groupQuantity)){
					err_code = 2;
					err_msg = "Quantity must be number.";
				}else{
					dataGroup.quantity = groupQuantity;
				}
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						myEmitter.prependListener('updateGroup', function(){
							checkUniqeValue(apikey, "GROUP_ID|" + groupId, 'GROUP_', function(resultCheckId){
								if(resultCheckId.err_code > 0){ //menunjukan data tersebut ada, 
									ApiFHIR.put('group', {"apikey": apikey, "_id": groupId}, {body: dataGroup, json: true}, function(error, response, body){
				  					group = body;
				  					if(group.err_code == 0){
				  						res.json({"err_code": 0, "err_msg": "Group has been update.", "data": [{"id": groupId}]});
				  					}else{
				  						res.json(group);	
				  					}
				  				})
								}else{
									res.json({"err_code": 501, "err_msg": "Group id not found."});
								}
							})
						})

						myEmitter.prependListener('checkGroupCode', function(){
							if(!validator.isEmpty(groupCode)){
								checkUniqeValue(apikey, "GROUP_CODE|" + groupCode, 'GROUP_', function(resGroupCode){
									if(resGroupCode.err_code == 0){
										myEmitter.emit('updateGroup');
									}else{
										res.json({"err_code": 503, "err_msg": "Group code already exist."});	
									}
								})
							}else{
								myEmitter.emit('updateGroup');
							}
						})

						if(!validator.isEmpty(groupTypeCode)){
							checkCode(apikey, groupTypeCode, 'GROUP_TYPE', function(resGroupType){
								if(resGroupType.err_code > 0){
									myEmitter.emit('checkGroupCode');
								}else{
									res.json({"err_code": 503, "err_msg": "Group type not found."});	
								}
							})
						}else{
							myEmitter.emit('checkGroupCode');
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
		member: function updateGroupMember(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var groupId = req.params.group_id;
			var groupMemberId = req.params.member_id;

			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var err_code = 0;
			var err_msg = "";
			var dataGroupMember = {};

			if(typeof groupId !== 'undefined'){
				if(validator.isEmpty(groupId)){
					err_code = 2;
					err_msg = "Group id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Parameter group id not found.";
			} 

			if(typeof groupMemberId !== 'undefined'){
				if(validator.isEmpty(groupMemberId)){
					err_code = 2;
					err_msg = "Member id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Parameter member id is not found.";
			} 

			if(typeof req.body.entity !== 'undefined'){
				if(typeof req.body.entity.patient_id !== 'undefined'){
					memberEntityPatient = req.body.entity.patient_id;
					if(validator.isEmpty(memberEntityPatient)){
						memberEntityPatient = "";
					}else{
						dataGroupMember.patient_id = memberEntityPatient;
					}
				}else{
					memberEntityPatient = "";
				}

				if(typeof req.body.entity.practitioner_id !== 'undefined'){
					memberEntityPractitioner = req.body.entity.practitioner_id;
					if(validator.isEmpty(memberEntityPractitioner)){
						memberEntityPractitioner = "";
					}else{
						dataGroupMember.practitioner_id = memberEntityPractitioner;
					}
				}else{
					memberEntityPractitioner = "";
				}

				if(typeof req.body.entity.device_id !== 'undefined'){
					memberEntityDevice = req.body.entity.device_id;
					if(validator.isEmpty(memberEntityDevice)){
						memberEntityDevice = "";
					}else{
						dataGroupMember.device_id = memberEntityDevice;	
					}
				}else{
					memberEntityDevice = "";
				}

				if(typeof req.body.entity.medication_id !== 'undefined'){
					memberEntityMedication = req.body.entity.medication_id;
					if(validator.isEmpty(memberEntityMedication)){
						memberEntityMedication = "";
					}else{
						dataGroupMember.medication_id = memberEntityMedication;		
					}
				}else{
					memberEntityMedication = "";
				}

				if(typeof req.body.entity.substance_id !== 'undefined'){
					memberEntitySubstance = req.body.entity.substance_id;
					if(validator.isEmpty(memberEntitySubstance)){
						memberEntitySubstance = "";
					}else{
						dataGroupMember.substance_id = memberEntitySubstance;		
					}
				}else{
					memberEntitySubstance = "";
				}

				if(typeof req.body.entity.period !== 'undefined'){
					memberPeriod = req.body.entity.period;
					if(memberPeriod.indexOf("to") > 0){
						arrPeriod = memberPeriod.split("to");
						memberPeriodStart = arrPeriod[0];
						memberPeriodEnd = arrPeriod[1];
						
						if(!regex.test(memberPeriodStart) && !regex.test(memberPeriodEnd)){
							err_code = 2;
							err_msg = "Member period invalid date format.";
						}else{
							dataGroupMember.period_start = memberPeriodStart;
							dataGroupMember.period_start = memberPeriodEnd;
						}	
					}else{
						err_code = 3;
						err_msg = "Period format request is not valid. format: date to date";
					}
				}else{
					memberPeriodStart = "";
					memberPeriodEnd = "";
				}

				//inactive
				if(typeof req.body.entity.inactive !== 'undefined'){
					inactive = req.body.entity.inactive;
					if(!validator.isBoolean(inactive)){
						err_code = 4;
						err_msg = "Member Entity must be boolean.";	
					}else{
						dataGroupMember.inactive = inactive;
					}
				}else{
					memberPeriodStart = "";
					memberPeriodEnd = "";
				}
			}else{
				err_code = 4;
				err_msg = "Cannot update, no request";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						myEmitter.prependListener('updateGroupMember', function(){
							checkUniqeValue(apikey, "GROUP_ID|" + groupId, 'GROUP_', function(resultCheckId){
								if(resultCheckId.err_code > 0){ //menunjukan data tersebut ada, 
									checkUniqeValue(apikey, "GROUP_MEMBER_ID|" + groupMemberId, 'GROUP_MEMBER', function(resGroupMemberId){
										if(resGroupMemberId.err_code > 0){ //menunjukan data tersebut ada, 
											ApiFHIR.put('groupMember', {"apikey": apikey, "_id": groupMemberId, "dr": "GROUP_ID|"+groupId}, {body: dataGroupMember, json: true}, function(error, response, body){
						  					groupMember = body;
						  					if(groupMember.err_code > 0){
						  						res.json(groupMember);	
						  					}else{
						  						res.json({"err_code": 0, "err_msg": "Member has been update in this group.", "data": groupMember.data});
						  					}
						  				})
										}else{
											res.json({"err_code": 504, "err_msg": "Member id not found."});		
										}
									})		
								}else{
									res.json({"err_code": 501, "err_msg": "Group id not found."});
								}
							})
						})

						if(!validator.isEmpty(memberEntityPatient)){
							checkUniqeValue(apikey, "PATIENT_ID|" + memberEntityPatient, 'PATIENT', function(resPatientID){
								if(resPatientID.err_code > 0){
									myEmitter.emit('updateGroupMember');
								}else{
									res.json({"err_code": 503, "err_msg": "Entity, patient id not found."});	
								}
							})
						}else if(!validator.isEmpty(memberEntityPractitioner)){
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + memberEntityPractitioner, 'PRACTITIONER', function(resPractitionerID){
								if(resPractitionerID.err_code > 0){
									myEmitter.emit('updateGroupMember');
								}else{
									res.json({"err_code": 503, "err_msg": "Entity, practitioner id not found."});	
								}
							})
						}else if(!validator.isEmpty(memberEntitySubstance)){
							checkUniqeValue(apikey, "SUBSTANCE_ID|" + memberEntitySubstance, 'SUBSTANCE', function(resSubstanceID){
								if(resSubstanceID.err_code > 0){
									myEmitter.emit('updateGroupMember');
								}else{
									res.json({"err_code": 503, "err_msg": "Entity, substance id not found."});	
								}
							})
						}else if(!validator.isEmpty(memberEntityMedication)){
							checkUniqeValue(apikey, "MEDICATION_ID|" + memberEntityMedication, 'MEDICATION', function(resMedicationID){
								if(resMedicationID.err_code > 0){
									myEmitter.emit('updateGroupMember');
								}else{
									res.json({"err_code": 503, "err_msg": "Entity, medication id not found."});	
								}
							})
						}else if(!validator.isEmpty(memberEntityDevice)){
							checkUniqeValue(apikey, "DEVICE_ID|" + memberEntityDevice, 'DEVICE', function(resDeviceID){
								if(resDeviceID.err_code > 0){
									myEmitter.emit('updateGroupMember');
								}else{
									res.json({"err_code": 503, "err_msg": "Entity, device id not found."});	
								}
							})
						}else{
							myEmitter.emit('updateGroupMember');
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
		characteristic: function updateGroupCharacteristic(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var groupId = req.params.group_id;
			var groupCharacteristicId = req.params.characteristic_id;

			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var err_code = 0;
			var err_msg = "";
			var dataGroupCharacteristic = {};

			if(typeof groupId !== 'undefined'){
				if(validator.isEmpty(groupId)){
					err_code = 2;
					err_msg = "Group id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Parameter group id not found.";
			} 

			if(typeof groupCharacteristicId !== 'undefined'){
				if(validator.isEmpty(groupCharacteristicId)){
					err_code = 2;
					err_msg = "Characteristic id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Parameter characteristic id is not found.";
			} 

			if(typeof req.body.characteristic !== 'undefined'){
				if(typeof req.body.characteristic.code !== 'undefined'){
					characteristicCode = req.body.characteristic.code;
					if(validator.isEmpty(characteristicCode)){
						err_code = 2;
						err_msg = "Characteristic code is required.";
					}else{
						dataGroupCharacteristic.code = characteristicCode;
					}
				}

				if(typeof req.body.characteristic.value !== 'undefined'){
					characteristicValue = req.body.characteristic.value;
					if(validator.isEmpty(characteristicValue)){
						err_code = 2;
						err_msg = "Characteristic value is required.";
					}else{
						dataGroupCharacteristic.value = characteristicValue;
					}
				}

				if(typeof req.body.characteristic.exclude !== 'undefined'){
					characteristicExclude = req.body.characteristic.exclude;
					if(!validator.isBoolean(characteristicExclude)){
						err_code = 2;
						err_msg = "Characteristic exclude is boolean.";
					}else{
						dataGroupCharacteristic.exclude = characteristicExclude;
					}
				}

				if(typeof req.body.characteristic.period !== 'undefined'){
					characteristicPeriod = req.body.characteristic.period;
					if(characteristicPeriod.indexOf("to") > 0){
						arrPeriod = characteristicPeriod.split("to");
						characteristicPeriodStart = arrPeriod[0];
						characteristicPeriodEnd = arrPeriod[1];
						
						if(!regex.test(characteristicPeriodStart) && !regex.test(characteristicPeriodEnd)){
							err_code = 2;
							err_msg = "Characteristic period invalid date format.";
						}else{
							dataGroupCharacteristic.period_start = characteristicPeriodStart;
							dataGroupCharacteristic.period_end = characteristicPeriodEnd;
						}	
					}else{
						err_code = 3;
						err_msg = "Period format request is not valid. format: date to date";
					}
				} 
			}else{
				err_code = 4;
				err_msg = "Cannot update, no request";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkUniqeValue(apikey, "GROUP_ID|" + groupId, 'GROUP_', function(resultCheckId){
							if(resultCheckId.err_code > 0){ //menunjukan data tersebut ada, 
								checkUniqeValue(apikey, "GROUP_CHARACTERISTIC_ID|" + groupCharacteristicId, 'GROUP_CHARACTERISTIC', function(resGroupCharacteristicId){
									if(resGroupCharacteristicId.err_code > 0){ //menunjukan data tersebut ada,
										ApiFHIR.put('groupCharacteristic', {"apikey": apikey, "_id": groupCharacteristicId, "dr": "GROUP_ID|"+groupId}, {body: dataGroupCharacteristic, json: true}, function(error, response, body){
					  					groupCharacteristic = body;
					  					if(groupCharacteristic.err_code > 0){
					  						res.json(groupCharacteristic);	
					  					}else{
					  						res.json({"err_code": 0, "err_msg": "Characteristic has been update in this group.", "data": groupCharacteristic.data});
					  					}
					  				})
									}else{
										res.json({"err_code": 504, "err_msg": "Characteristic id not found."});		
									}
								})		
							}else{
								res.json({"err_code": 501, "err_msg": "Group id not found."});
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