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
		detectedIssue : function getDetectedIssue(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var detectedIssueId = req.query._id;
			var author = req.query.author;
			var category = req.query.category;
			var date = req.query.date;
			var identifier = req.query.identifier;
			var implicated = req.query.implicated;
			var patient = req.query.patient;
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
			
			if(typeof detectedIssueId !== 'undefined'){
				if(!validator.isEmpty(detectedIssueId)){
					qString._id = detectedIssueId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Detected Issue Id is required."});
				}
			}
			
			if(typeof author !== 'undefined'){
				if(!validator.isEmpty(author)){
					qString.author = author; 
				}else{
					res.json({"err_code": 1, "err_msg": "Author is empty."});
				}
			}

			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "Category is empty."});
				}
			}

			if(typeof date !== 'undefined'){
				if(!validator.isEmpty(date)){
					if(!regex.test(date)){
						res.json({"err_code": 1, "err_msg": "Date invalid format."});
					}else{
						qString.date = date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Date is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof implicated !== 'undefined'){
				if(!validator.isEmpty(implicated)){
					qString.implicated = implicated; 
				}else{
					res.json({"err_code": 1, "err_msg": "Implicated is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"DetectedIssue" : {
					"location": "%(apikey)s/DetectedIssue",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('DetectedIssue', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var detectedIssue = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(detectedIssue.err_code == 0){
								//cek jumdata dulu
								if(detectedIssue.data.length > 0){
									newDetectedIssue = [];
									for(i=0; i < detectedIssue.data.length; i++){
										myEmitter.once("getIdentifier", function(detectedIssue, index, newDetectedIssue, countDetectedIssue){
											/*console.log(detectedIssue);*/
											//get identifier
											qString = {};
											qString.detected_issue_id = detectedIssue.id;
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
													var objectDetectedIssue = {};
													objectDetectedIssue.resourceType = detectedIssue.resourceType;
													objectDetectedIssue.id = detectedIssue.id;
													objectDetectedIssue.identifier = identifier.data;
													objectDetectedIssue.status = detectedIssue.status;
													objectDetectedIssue.category = detectedIssue.category;
													objectDetectedIssue.severity = detectedIssue.severity;
													objectDetectedIssue.patient = detectedIssue.patient;
													objectDetectedIssue.date = detectedIssue.date;
													objectDetectedIssue.author = detectedIssue.author;
													objectDetectedIssue.implicated = detectedIssue.implicated;
													objectDetectedIssue.detail = detectedIssue.detail;
													objectDetectedIssue.reference = detectedIssue.reference;
												
													newDetectedIssue[index] = objectDetectedIssue;

													myEmitter.once('getDetectedIssueMitigation', function(detectedIssue, index, newDetectedIssue, countDetectedIssue){
														qString = {};
														qString.detected_issue_id = detectedIssue.id;
														seedPhoenixFHIR.path.GET = {
															"DetectedIssueMitigation" : {
																"location": "%(apikey)s/DetectedIssueMitigation",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('DetectedIssueMitigation', {"apikey": apikey}, {}, function(error, response, body){
															detectedIssueMitigation = JSON.parse(body);
															if(detectedIssueMitigation.err_code == 0){
																var objectDetectedIssue = {};
																objectDetectedIssue.resourceType = detectedIssue.resourceType;
																objectDetectedIssue.id = detectedIssue.id;
																objectDetectedIssue.identifier = detectedIssue.identifier;
																objectDetectedIssue.status = detectedIssue.status;
																objectDetectedIssue.category = detectedIssue.category;
																objectDetectedIssue.severity = detectedIssue.severity;
																objectDetectedIssue.patient = detectedIssue.patient;
																objectDetectedIssue.date = detectedIssue.date;
																objectDetectedIssue.author = detectedIssue.author;
																objectDetectedIssue.implicated = detectedIssue.implicated;
																objectDetectedIssue.detail = detectedIssue.detail;
																objectDetectedIssue.reference = detectedIssue.reference;
																objectDetectedIssue.mitigation = detectedIssueMitigation.data;
																newDetectedIssue[index] = objectDetectedIssue;
																if(index == countDetectedIssue -1 ){
																	res.json({"err_code": 0, "data":newDetectedIssue});
																}
															}else{
																res.json(detectedIssueMitigation);			
															}
														})
													})
													myEmitter.emit('getDetectedIssueMitigation', objectDetectedIssue, index, newDetectedIssue, countDetectedIssue);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", detectedIssue.data[i], i, newDetectedIssue, detectedIssue.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Detected Issue is empty."});	
								}
							}else{
								res.json(detectedIssue);
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
					var detectedIssueId = req.params.detected_issue_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "DETECTED_ISSUE_ID|" + detectedIssueId, 'DETECTED_ISSUE', function(resDetectedIssueID){
								if(resDetectedIssueID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.detected_issue_id = detectedIssueId;
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
						  			qString.detected_issue_id = detectedIssueId;
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
									res.json({"err_code": 501, "err_msg": "Detected Issue Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		detectedIssueMitigation: function getDetectedIssueMitigation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var detectedIssueId = req.params.detected_issue_id;
			var detectedIssueMitigationId = req.params.detected_issue_mitigation_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "DETECTED_ISSUE_ID|" + detectedIssueId, 'DETECTED_ISSUE', function(resDetectedIssue){
						if(resDetectedIssue.err_code > 0){
							if(typeof detectedIssueMitigationId !== 'undefined' && !validator.isEmpty(detectedIssueMitigationId)){
								checkUniqeValue(apikey, "MITIGATION_ID|" + detectedIssueMitigationId, 'DETECTED_ISSUE_MITIGATION', function(resDetectedIssueMitigationID){
									if(resDetectedIssueMitigationID.err_code > 0){
										//get detectedIssueMitigation
										qString = {};
										qString.detected_issue_id = detectedIssueId;
										qString._id = detectedIssueMitigationId;
										seedPhoenixFHIR.path.GET = {
											"DetectedIssueMitigation" : {
												"location": "%(apikey)s/DetectedIssueMitigation",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('DetectedIssueMitigation', {"apikey": apikey}, {}, function(error, response, body){
											detectedIssueMitigation = JSON.parse(body);
											if(detectedIssueMitigation.err_code == 0){
												res.json({"err_code": 0, "data":detectedIssueMitigation.data});	
											}else{
												res.json(detectedIssueMitigation);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Detected Issue Mitigation Id not found"});		
									}
								})
							}else{
								//get detectedIssueMitigation
								qString = {};
								qString.detected_issue_id = detectedIssueId;
								seedPhoenixFHIR.path.GET = {
									"DetectedIssueMitigation" : {
										"location": "%(apikey)s/DetectedIssueMitigation",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('DetectedIssueMitigation', {"apikey": apikey}, {}, function(error, response, body){
									detectedIssueMitigation = JSON.parse(body);
									if(detectedIssueMitigation.err_code == 0){
										res.json({"err_code": 0, "data":detectedIssueMitigation.data});	
									}else{
										res.json(detectedIssueMitigation);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Detected Issue Id not found"});		
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
		detectedIssue : function addDetectedIssue(req, res){
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
category|category||
severity|severity|||u
patient|patient||
date|date|date|
author.practitioner|authorPractitioner||
author.device|authorDevice||
implicated|implicated||
detail|detail||
reference|reference||
mitigation.action|mitigationAction||nn
mitigation.date|mitigationDate|date|
mitigation.author|mitigationAuthor||
*/
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Detected Issue status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Detected Issue request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Detected Issue request.";
			}

			if(typeof req.body.severity !== 'undefined'){
				var severity =  req.body.severity.trim().toUpperCase();
				if(validator.isEmpty(severity)){
					severity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'severity' in json Detected Issue request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Detected Issue request.";
			}

			if(typeof req.body.date !== 'undefined'){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					date = "";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "Detected Issue date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date' in json Detected Issue request.";
			}

			if(typeof req.body.author.practitioner !== 'undefined'){
				var authorPractitioner =  req.body.author.practitioner.trim().toLowerCase();
				if(validator.isEmpty(authorPractitioner)){
					authorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author practitioner' in json Detected Issue request.";
			}

			if(typeof req.body.author.device !== 'undefined'){
				var authorDevice =  req.body.author.device.trim().toLowerCase();
				if(validator.isEmpty(authorDevice)){
					authorDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author device' in json Detected Issue request.";
			}

			if(typeof req.body.implicated !== 'undefined'){
				var implicated =  req.body.implicated.trim().toLowerCase();
				if(validator.isEmpty(implicated)){
					implicated = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'implicated' in json Detected Issue request.";
			}

			if(typeof req.body.detail !== 'undefined'){
				var detail =  req.body.detail.trim().toLowerCase();
				if(validator.isEmpty(detail)){
					detail = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail' in json Detected Issue request.";
			}

			if(typeof req.body.reference !== 'undefined'){
				var reference =  req.body.reference.trim().toLowerCase();
				if(validator.isEmpty(reference)){
					reference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference' in json Detected Issue request.";
			}

			if(typeof req.body.mitigation.action !== 'undefined'){
				var mitigationAction =  req.body.mitigation.action.trim().toLowerCase();
				if(validator.isEmpty(mitigationAction)){
					err_code = 2;
					err_msg = "Detected Issue mitigation action is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'mitigation action' in json Detected Issue request.";
			}

			if(typeof req.body.mitigation.date !== 'undefined'){
				var mitigationDate =  req.body.mitigation.date;
				if(validator.isEmpty(mitigationDate)){
					mitigationDate = "";
				}else{
					if(!regex.test(mitigationDate)){
						err_code = 2;
						err_msg = "Detected Issue mitigation date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'mitigation date' in json Detected Issue request.";
			}

			if(typeof req.body.mitigation.author !== 'undefined'){
				var mitigationAuthor =  req.body.mitigation.author.trim().toLowerCase();
				if(validator.isEmpty(mitigationAuthor)){
					mitigationAuthor = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'mitigation author' in json Detected Issue request.";
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
														var detectedIssueId = 'dis' + unicId;
														var detectedIssueMitigationId = 'dim' + unicId;
/*status|status||nn
category|category||
severity|severity||
patient|patient||
date|date|date|
author.practitioner|authorPractitioner||
author.device|authorDevice||
implicated|implicated||
detail|detail||
reference|reference||
mitigation.action|mitigationAction||nn
mitigation.date|mitigationDate|date|
mitigation.author|mitigationAuthor||
*/														
														dataDetectedIssue = {
															"detected_issue_id" : detectedIssueId,
															"status" : status,
															"category" : category,
															"severity" : severity,
															"patient" : patient,
															"date" : date,
															"author_practitioner" : authorPractitioner,
															"author_device" : authorDevice,
															"implicated" : implicated,
															"detail" : detail,
															"reference" : reference
														}
														console.log(dataDetectedIssue);
														ApiFHIR.post('detectedIssue', {"apikey": apikey}, {body: dataDetectedIssue, json: true}, function(error, response, body){
															detectedIssue = body;
															if(detectedIssue.err_code > 0){
																res.json(detectedIssue);	
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
																							"detected_issue_id": detectedIssueId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														//DetectedIssueMitigation
														dataDetectedIssueMitigation = {
															"mitigation_id" : detectedIssueMitigationId,
															"action" : mitigationAction,
															"date" : mitigationDate,
															"author" : mitigationAuthor,
															"detected_issue_id" : detectedIssueId
														}
														ApiFHIR.post('detectedIssueMitigation', {"apikey": apikey}, {body: dataDetectedIssueMitigation, json: true}, function(error, response, body){
															detectedIssueMitigation = body;
															if(detectedIssueMitigation.err_code > 0){
																res.json(detectedIssueMitigation);	
																console.log("ok");
															}
														});
														
														res.json({"err_code": 0, "err_msg": "Detected Issue has been add.", "data": [{"_id": detectedIssueId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});
									
										//cek code
										/*
										status|observation_status
										category|detectedissue_category
										severity|detectedissue_severity
										mitigationAction|detectedissue_mitigation_action
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'OBSERVATION_STATUS', function (resStatusCode) {
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
												checkCode(apikey, category, 'DETECTEDISSUE_CATEGORY', function (resCategoryCode) {
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

										myEmitter.prependOnceListener('checkSeverity', function () {
											if (!validator.isEmpty(severity)) {
												checkCode(apikey, severity, 'DETECTEDISSUE_SEVERITY', function (resSeverityCode) {
													if (resSeverityCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Severity code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkMitigationAction', function () {
											if (!validator.isEmpty(mitigationAction)) {
												checkCode(apikey, mitigationAction, 'DETECTEDISSUE_MITIGATION_ACTION', function (resMitigationActionCode) {
													if (resMitigationActionCode.err_code > 0) {
														myEmitter.emit('checkSeverity');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Mitigation action code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSeverity');
											}
										})


										//cek value
										/*
										patient|patient
										authorPractitioner|Practitioner
										authorDevice|Device
										mitigationAuthor|Practitioner
										*/
										
										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkMitigationAction');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMitigationAction');
											}
										})

										myEmitter.prependOnceListener('checkAuthorPractitioner', function () {
											if (!validator.isEmpty(authorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + authorPractitioner, 'PRACTITIONER', function (resAuthorPractitioner) {
													if (resAuthorPractitioner.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkAuthorDevice', function () {
											if (!validator.isEmpty(authorDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + authorDevice, 'DEVICE', function (resAuthorDevice) {
													if (resAuthorDevice.err_code > 0) {
														myEmitter.emit('checkAuthorPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorPractitioner');
											}
										})

										if (!validator.isEmpty(mitigationAuthor)) {
											checkUniqeValue(apikey, "PRACTITIONER_ID|" + mitigationAuthor, 'PRACTITIONER', function (resMitigationAuthor) {
												if (resMitigationAuthor.err_code > 0) {
													myEmitter.emit('checkAuthorDevice');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Mitigation author id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAuthorDevice');
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
			var detectedIssueId = req.params.detected_issue_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof detectedIssueId !== 'undefined'){
				if(validator.isEmpty(detectedIssueId)){
					err_code = 2;
					err_msg = "Detected Issue id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Detected Issue id is required";
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
												checkUniqeValue(apikey, "DETECTED_ISSUE_ID|" + detectedIssueId, 'DETECTED_ISSUE', function(resDetectedIssueID){
													if(resDetectedIssueID.err_code > 0){
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
																							"detected_issue_id": detectedIssueId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Detected Issue.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Detected Issue Id not found"});		
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
		detectedIssueMitigation: function addDetectedIssueMitigation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var detectedIssueId = req.params.detected_issue_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof detectedIssueId !== 'undefined'){
				if(validator.isEmpty(detectedIssueId)){
					err_code = 2;
					err_msg = "Detected Issue id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Detected Issue id is required";
			}
			
			if(typeof req.body.action !== 'undefined'){
				var mitigationAction =  req.body.action.trim().toLowerCase();
				if(validator.isEmpty(mitigationAction)){
					err_code = 2;
					err_msg = "Detected Issue mitigation action is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'mitigation action' in json Detected Issue request.";
			}

			if(typeof req.body.date !== 'undefined'){
				var mitigationDate =  req.body.date;
				if(validator.isEmpty(mitigationDate)){
					mitigationDate = "";
				}else{
					if(!regex.test(mitigationDate)){
						err_code = 2;
						err_msg = "Detected Issue mitigation date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'mitigation date' in json Detected Issue request.";
			}

			if(typeof req.body.author !== 'undefined'){
				var mitigationAuthor =  req.body.author.trim().toLowerCase();
				if(validator.isEmpty(mitigationAuthor)){
					mitigationAuthor = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'mitigation author' in json Detected Issue request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkDetectedIssueID', function(){
							checkUniqeValue(apikey, "DETECTED_ISSUE_ID|" + detectedIssueId, 'DETECTED_ISSUE', function(resDetectedIssueID){
								if(resDetectedIssueID.err_code > 0){
									var unicId = uniqid.time();
									var detectedIssueMitigationId = 'dim' + unicId;
									//DetectedIssueMitigation
									dataDetectedIssueMitigation = {
										"mitigation_id" : detectedIssueMitigationId,
										"action" : mitigationAction,
										"date" : mitigationDate,
										"author" : mitigationAuthor,
										"detected_issue_id" : detectedIssueId
									}
									ApiFHIR.post('detectedIssueMitigation', {"apikey": apikey}, {body: dataDetectedIssueMitigation, json: true}, function(error, response, body){
										detectedIssueMitigation = body;
										if(detectedIssueMitigation.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Detected Issue Mitigation has been add in this Detected Issue.", "data": detectedIssueMitigation.data});
										}else{
											res.json(detectedIssueMitigation);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Detected Issue Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkMitigationAction', function () {
							if (!validator.isEmpty(mitigationAction)) {
								checkCode(apikey, mitigationAction, 'DETECTEDISSUE_MITIGATION_ACTION', function (resMitigationActionCode) {
									if (resMitigationActionCode.err_code > 0) {
										myEmitter.emit('checkDetectedIssueID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Mitigation action code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDetectedIssueID');
							}
						})
						
						if (!validator.isEmpty(mitigationAuthor)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + mitigationAuthor, 'PRACTITIONER', function (resMitigationAuthor) {
								if (resMitigationAuthor.err_code > 0) {
									myEmitter.emit('checkMitigationAction');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Mitigation author id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkMitigationAction');
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
	},
	put: {
		detectedIssue : function putDetectedIssue(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var detectedIssueId = req.params.detected_issue_id;

      var err_code = 0;
      var err_msg = "";
      var dataDetectedIssue = {};

			if(typeof detectedIssueId !== 'undefined'){
				if(validator.isEmpty(detectedIssueId)){
					err_code = 2;
					err_msg = "DetectedIssue id is required";
				}
			}else{
				err_code = 2;
				err_msg = "DetectedIssue id is required";
			}
			
			/*
			var status = req.body.status;
			var category = req.body.category;
			var severity = req.body.severity;
			var patient = req.body.patient;
			var date = req.body.date;
			var author_practitioner = req.body.author_practitioner;
			var author_device = req.body.author_device;
			var implicated = req.body.implicated;
			var detail = req.body.detail;
			var reference = req.body.reference;
			*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "detected issue status is required.";
				}else{
					dataDetectedIssue.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataDetectedIssue.category = "";
				}else{
					dataDetectedIssue.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.severity !== 'undefined' && req.body.severity !== ""){
				var severity =  req.body.severity.trim().toUpperCase();
				if(validator.isEmpty(severity)){
					dataDetectedIssue.severity = "";
				}else{
					dataDetectedIssue.severity = severity;
				}
			}else{
			  severity = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataDetectedIssue.patient = "";
				}else{
					dataDetectedIssue.patient = patient;
				}
			}else{
			  patient = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					err_code = 2;
					err_msg = "detected issue date is required.";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "detected issue date invalid date format.";	
					}else{
						dataDetectedIssue.date = date;
					}
				}
			}else{
			  date = "";
			}

			if(typeof req.body.author.practitioner !== 'undefined' && req.body.author.practitioner !== ""){
				var authorPractitioner =  req.body.author.practitioner.trim().toLowerCase();
				if(validator.isEmpty(authorPractitioner)){
					dataDetectedIssue.author_practitioner = "";
				}else{
					dataDetectedIssue.author_practitioner = authorPractitioner;
				}
			}else{
			  authorPractitioner = "";
			}

			if(typeof req.body.author.device !== 'undefined' && req.body.author.device !== ""){
				var authorDevice =  req.body.author.device.trim().toLowerCase();
				if(validator.isEmpty(authorDevice)){
					dataDetectedIssue.author_device = "";
				}else{
					dataDetectedIssue.author_device = authorDevice;
				}
			}else{
			  authorDevice = "";
			}

			if(typeof req.body.implicated !== 'undefined' && req.body.implicated !== ""){
				var implicated =  req.body.implicated.trim().toLowerCase();
				if(validator.isEmpty(implicated)){
					dataDetectedIssue.implicated = "";
				}else{
					dataDetectedIssue.implicated = implicated;
				}
			}else{
			  implicated = "";
			}

			if(typeof req.body.detail !== 'undefined' && req.body.detail !== ""){
				var detail =  req.body.detail.trim().toLowerCase();
				if(validator.isEmpty(detail)){
					dataDetectedIssue.detail = "";
				}else{
					dataDetectedIssue.detail = detail;
				}
			}else{
			  detail = "";
			}

			if(typeof req.body.reference !== 'undefined' && req.body.reference !== ""){
				var reference =  req.body.reference.trim().toLowerCase();
				if(validator.isEmpty(reference)){
					dataDetectedIssue.reference = "";
				}else{
					dataDetectedIssue.reference = reference;
				}
			}else{
			  reference = "";
			}
			

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkDetectedIssueId', function(){
						checkUniqeValue(apikey, "DETECTED_ISSUE_ID|" + detectedIssueId, 'DETECTED_ISSUE', function(resDetectedIssueId){
							if(resDetectedIssueId.err_code > 0){
								ApiFHIR.put('detectedIssue', {"apikey": apikey, "_id": detectedIssueId}, {body: dataDetectedIssue, json: true}, function(error, response, body){
									detectedIssue = body;
									if(detectedIssue.err_code > 0){
										res.json(detectedIssue);	
									}else{
										res.json({"err_code": 0, "err_msg": "Detected Issue has been update.", "data": [{"_id": detectedIssueId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Detected Issue Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'OBSERVATION_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkDetectedIssueId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDetectedIssueId');
						}
					})

					myEmitter.prependOnceListener('checkCategory', function () {
						if (!validator.isEmpty(category)) {
							checkCode(apikey, category, 'DETECTEDISSUE_CATEGORY', function (resCategoryCode) {
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

					myEmitter.prependOnceListener('checkSeverity', function () {
						if (!validator.isEmpty(severity)) {
							checkCode(apikey, severity, 'DETECTEDISSUE_SEVERITY', function (resSeverityCode) {
								if (resSeverityCode.err_code > 0) {
									myEmitter.emit('checkCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Severity code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCategory');
						}
					})
					
					myEmitter.prependOnceListener('checkPatient', function () {
						if (!validator.isEmpty(patient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
								if (resPatient.err_code > 0) {
									myEmitter.emit('checkSeverity');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSeverity');
						}
					})

					myEmitter.prependOnceListener('checkAuthorPractitioner', function () {
						if (!validator.isEmpty(authorPractitioner)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + authorPractitioner, 'PRACTITIONER', function (resAuthorPractitioner) {
								if (resAuthorPractitioner.err_code > 0) {
									myEmitter.emit('checkPatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Author practitioner id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPatient');
						}
					})

					if (!validator.isEmpty(authorDevice)) {
						checkUniqeValue(apikey, "DEVICE_ID|" + authorDevice, 'DEVICE', function (resAuthorDevice) {
							if (resAuthorDevice.err_code > 0) {
								myEmitter.emit('checkAuthorPractitioner');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Author device id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkAuthorPractitioner');
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
			var detectedIssueId = req.params.detected_issue_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof detectedIssueId !== 'undefined'){
				if(validator.isEmpty(detectedIssueId)){
					err_code = 2;
					err_msg = "Detected Issue id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Detected Issue id is required";
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
						myEmitter.prependOnceListener('checkDetectedIssueID', function(){
							checkUniqeValue(apikey, "DETECTED_ISSUE_ID|" + detectedIssueId, 'DETECTED_ISSUE', function(resDetectedIssueID){
								if(resDetectedIssueID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "DETECTED_ISSUE_ID|"+detectedIssueId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Detected Issue.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Detected Issue Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkDetectedIssueID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkDetectedIssueID');				
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
		detectedIssueMitigation: function updateDetectedIssueMitigation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var detectedIssueId = req.params.detected_issue_id;
			var detectedIssueMitigationId = req.params.detected_issue_mitigation_id;

			var err_code = 0;
			var err_msg = "";
			var dataDetectedIssue = {};
			//input check 
			if(typeof detectedIssueId !== 'undefined'){
				if(validator.isEmpty(detectedIssueId)){
					err_code = 2;
					err_msg = "DetectedIssue id is required";
				}
			}else{
				err_code = 2;
				err_msg = "DetectedIssue id is required";
			}

			if(typeof detectedIssueMitigationId !== 'undefined'){
				if(validator.isEmpty(detectedIssueMitigationId)){
					err_code = 2;
					err_msg = "DetectedIssue Stages id is required";
				}
			}else{
				err_code = 2;
				err_msg = "DetectedIssue Stages id is required";
			}
			
			if(typeof req.body.action !== 'undefined' && req.body.action !== ""){
				var mitigationAction =  req.body.action.trim().toLowerCase();
				if(validator.isEmpty(mitigationAction)){
					err_code = 2;
					err_msg = "detected issue mitigation action is required.";
				}else{
					dataDetectedIssue.action = mitigationAction;
				}
			}else{
			  mitigationAction = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var mitigationDate =  req.body.date;
				if(validator.isEmpty(mitigationDate)){
					err_code = 2;
					err_msg = "detected issue mitigation date is required.";
				}else{
					if(!regex.test(mitigationDate)){
						err_code = 2;
						err_msg = "detected issue mitigation date invalid date format.";	
					}else{
						dataDetectedIssue.date = mitigationDate;
					}
				}
			}else{
			  mitigationDate = "";
			}

			if(typeof req.body.author !== 'undefined' && req.body.author !== ""){
				var mitigationAuthor =  req.body.author.trim().toLowerCase();
				if(validator.isEmpty(mitigationAuthor)){
					dataDetectedIssue.author = "";
				}else{
					dataDetectedIssue.author = mitigationAuthor;
				}
			}else{
			  mitigationAuthor = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkDetectedIssueID', function(){
							checkUniqeValue(apikey, "DETECTED_ISSUE_ID|" + detectedIssueId, 'DETECTED_ISSUE', function(resDetectedIssueId){
								if(resDetectedIssueId.err_code > 0){
									checkUniqeValue(apikey, "MITIGATION_ID|" + detectedIssueMitigationId, 'DETECTED_ISSUE_MITIGATION', function(resDetectedIssueMitigationID){
										if(resDetectedIssueMitigationID.err_code > 0){
											ApiFHIR.put('detectedIssueMitigation', {"apikey": apikey, "_id": detectedIssueMitigationId, "dr": "DETECTED_ISSUE_ID|"+detectedIssueId}, {body: dataDetectedIssue, json: true}, function(error, response, body){
												detectedIssueMitigation = body;
												if(detectedIssueMitigation.err_code > 0){
													res.json(detectedIssueMitigation);	
												}else{
													res.json({"err_code": 0, "err_msg": "Detected Issue Stages has been update in this Detected Issue.", "data": detectedIssueMitigation.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Detected Issue Stages Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Detected Issue Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkMitigationAction', function () {
							if (!validator.isEmpty(mitigationAction)) {
								checkCode(apikey, mitigationAction, 'DETECTEDISSUE_MITIGATION_ACTION', function (resMitigationActionCode) {
									if (resMitigationActionCode.err_code > 0) {
										myEmitter.emit('checkDetectedIssueID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Mitigation action code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDetectedIssueID');
							}
						})
						
						if (!validator.isEmpty(mitigationAuthor)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + mitigationAuthor, 'PRACTITIONER', function (resMitigationAuthor) {
								if (resMitigationAuthor.err_code > 0) {
									myEmitter.emit('checkMitigationAction');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Mitigation author id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkMitigationAction');
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