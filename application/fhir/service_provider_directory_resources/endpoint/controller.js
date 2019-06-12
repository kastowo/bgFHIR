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
		endpoint : function getEndpoint(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
		
		//params from query string
		var endpointId = req.query._id;
		var endpointConnectionType = req.query.connection_type;
		var endpointIdentifier=req.query.identifier;
		var endpointName=req.query.name;
		var organizationId=req.query.organization;
		var endpointPayloadType=req.query.payload_type;
		var endpointStatus=req.query.status;			
		var offset = req.query.offset;
		var limit = req.query.limit;

		var qString = {};
		
		if(typeof organizationId !== 'undefined'){
			if(!validator.isEmpty(organizationId)){
				qString.organizationId = organizationId; 
			}else{
				res.json({"err_code": 1, "err_msg": "organization id is required."});
			}
		}
		
		if(typeof endpointId !== 'undefined'){
			if(!validator.isEmpty(endpointId)){
				qString._id = endpointId; 
			}else{
				res.json({"err_code": 1, "err_msg": "Endpoint id is required."});
			}
		}

		if(typeof endpointConnectionType !== 'undefined'){
			if(!validator.isEmpty(endpointConnectionType)){
				qString.endpoint_connection_type = endpointConnectionType; 
			}else{
				res.json({"err_code": 1, "err_msg": "endpoint connection type is empty."});
			}
		}

		if(typeof endpointIdentifier !== 'undefined'){
			if(!validator.isEmpty(endpointIdentifier)){
				qString.identifier = endpointIdentifier;
			}else{
				res.json({"err_code": 1, "err_msg": "Identifier is empty."});
			}
		}

		if(typeof endpointName !== 'undefined'){
			if(!validator.isEmpty(endpointName)){
				if(endpointName.indexOf(" ") > 0){
					qString.name = endpointName.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.name = endpointName;
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Name is empty."});
			}
		}

		if(typeof endpointPayloadType !== 'undefined'){
			if(!validator.isEmpty(endpointPayloadType)){
				qString.endpoint_payload_type = endpointPayloadType;
			}else{
				res.json({"err_code": 1, "err_msg": "Endpoint Payload Type is empty."});
			}
		}

		if(typeof endpointStatus !== 'undefined'){
			if(!validator.isEmpty(endpointStatus)){
				qString.status = endpointStatus;
			}else{
				res.json({"err_code": 1, "err_msg": "Endpoint Status of is empty."});
			}
		}	
			
		/*if(typeof offset !== 'undefined'){
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
		}	*/
		
		seedPhoenixFHIR.path.GET = {
			"Endpoint" : {
				"location": "%(apikey)s/Endpoint",
				"query": qString
			}
		}
		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

		checkApikey(apikey, ipAddres, function(result){
			if(result.err_code == 0){
				ApiFHIR.get('Endpoint', {"apikey": apikey}, {}, function (error, response, body) {
					if(error){
						res.json(error);
					}else{
						var endpoint = JSON.parse(body); //object
						//cek apakah ada error atau tidak
						if(endpoint.err_code == 0){
							//cek jumdata dulu
							if(endpoint.data.length > 0){
								newEndpoint = [];
								for(i=0; i < endpoint.data.length; i++){
									myEmitter.once("getIdentifier", function(endpoint, index, newEndpoint, countEndpoint){
													//get identifier
													qString = {};
													qString.endpoint_id = endpoint.id;
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
															var objectEndpoint = {};
															objectEndpoint.resourceType = endpoint.resourceType;
															objectEndpoint.id = endpoint.id;
															objectEndpoint.identifier = identifier.data;
															objectEndpoint.status = endpoint.status;
															objectEndpoint.connectionType = endpoint.connectionType;
															objectEndpoint.name = endpoint.name;
															var managingOrganization;
															if(endpoint.managingOrganization !== 'null'){
																managingOrganization = host + ":" + port + "/" + apikey + "/Organization?_id=" + endpoint.managingOrganization;
															} else {
																managingOrganization = endpoint.managingOrganization;
															}
															objectEndpoint.managingOrganization = managingOrganization;
															objectEndpoint.period = endpoint.period;
															objectEndpoint.payloadType = endpoint.payloadType;
															objectEndpoint.payloadMimeType = endpoint.payloadMimeType;
															objectEndpoint.address = endpoint.address;
															objectEndpoint.header = endpoint.header;
															
															newEndpoint[index] = objectEndpoint

															myEmitter.once('getContactPoint', function(endpoint, index, newEndpoint, countEndpoint){
																			qString = {};
																			qString.endpoint_id = endpoint.id;
																			seedPhoenixFHIR.path.GET = {
																				"ContactPoint" : {
																					"location": "%(apikey)s/ContactPoint",
																					"query": qString
																				}
																			}

																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																			ApiFHIR.get('ContactPoint', {"apikey": apikey}, {}, function(error, response, body){
																				contactPoint = JSON.parse(body);
																				if(contactPoint.err_code == 0){
																					var objectEndpoint = {};
																					objectEndpoint.resourceType = endpoint.resourceType;
																					objectEndpoint.id = endpoint.id;
																					objectEndpoint.identifier = endpoint.identifier;
																					objectEndpoint.status = endpoint.status;
																					objectEndpoint.connectionType = endpoint.connectionType;
																					objectEndpoint.name = endpoint.name;
																					objectEndpoint.managingOrganization = endpoint.managingOrganization;
																					objectEndpoint.contact = contactPoint.data;
																					objectEndpoint.period = endpoint.period;
																					objectEndpoint.payloadType = endpoint.payloadType;
																					objectEndpoint.payloadMimeType = endpoint.payloadMimeType;
																					objectEndpoint.address = endpoint.address;
																					objectEndpoint.header = endpoint.header;
																					
																					newEndpoint[index] = objectEndpoint;

																					if(index == countEndpoint -1 ){
																						res.json({"err_code": 0, "data":newEndpoint});				
																					}			
																				}else{
																					res.json(contactPoint);			
																				}
																			})
																		})
															myEmitter.emit('getContactPoint', objectEndpoint, index, newEndpoint, countEndpoint);
														}else{
															res.json(identifier);
														}
													})
												})
									myEmitter.emit("getIdentifier", endpoint.data[i], i, newEndpoint, endpoint.data.length);
									//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
								}
								 //res.json({"err_code": 0, "data":organization.data});
							}else{
								res.json({"err_code": 2, "err_msg": "endpoint is empty."});	
							}
						}else{
							res.json(endpoint);
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
			var endpointId = req.params.endpoint_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
						if(resEndpointID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.endpoint_id = endpointId;
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
								qString.endpoint_id = endpointId;
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
							res.json({"err_code": 501, "err_msg": "Endpoint Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		telecom: function getTelecom(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var endpointId = req.params.endpoint_id;
			var contactPointId = req.params.contact_point_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
						if(resEndpointID.err_code > 0){
							if(typeof contactPointId !== 'undefined' && !validator.isEmpty(contactPointId)){
								checkUniqeValue(apikey, "CONTACT_POINT_ID|" + contactPointId, 'CONTACT_POINT', function(resTelecomID){
									if(resTelecomID.err_code > 0){
										qString = {};
										qString.endpoint_id = endpointId;
										qString._id = contactPointId;
										seedPhoenixFHIR.path.GET = {
											"ContactPoint" : {
												"location": "%(apikey)s/ContactPoint",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ContactPoint', {"apikey": apikey}, {}, function(error, response, body){
											contactPoint = JSON.parse(body);
											if(contactPoint.err_code == 0){
												res.json({"err_code": 0, "data":contactPoint.data});	
											}else{
												res.json(contactPoint);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Telecom Id not found"});		
									}
								})
							}else{
								qString = {};
								qString.endpoint_id = endpointId;

								seedPhoenixFHIR.path.GET = {
									"ContactPoint" : {
										"location": "%(apikey)s/ContactPoint",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ContactPoint', {"apikey": apikey}, {}, function(error, response, body){
									contactPoint = JSON.parse(body);
									if(contactPoint.err_code == 0){
										res.json({"err_code": 0, "data":contactPoint.data});	
									}else{
										res.json(contactPoint);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Endpoint Id not found"});		
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
		endpoint :function postEndpoint(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

		var err_code = 0;
		var err_msg = "";
		
		//input check 
		//identifier
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

		//Endpoint active
		if(typeof req.body.status !== 'undefined'){
			endpointStatusCode =  req.body.status.trim().toLowerCase();
			if(validator.isEmpty(endpointStatusCode)){
				err_code = 2;
				err_msg = "Endpoint Status is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'status' in json Endpoint request.";
		}
		//Endpoint type
		if(typeof req.body.connectionType !== 'undefined'){
			EndpointConnectionTypeCode =  req.body.connectionType.trim().toLowerCase();
			if(validator.isEmpty(EndpointConnectionTypeCode)){
				err_code = 2;
				err_msg = "Enpoint type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'Connection Type' in json Endpoint request.";
		}
		//Endpoint name
		if(typeof req.body.name !== 'undefined'){
			endpointNameCode =  req.body.name.trim().toLowerCase();
			if(validator.isEmpty(endpointNameCode)){
				err_code = 2;
				err_msg = "Enpoint name is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'name' in json Enpoint request.";
		}
		//Endpoint alias	
		if(typeof req.body.managingOrganization !== 'undefined'){
			managingOrganizationCode =  req.body.managingOrganization.trim().toLowerCase();
			if(validator.isEmpty(managingOrganizationCode)){
				/*err_code = 2;
				err_msg = "Managing Organization is required.";*/
				managingOrganizationCode = "";
			} 
		}else{
			managingOrganizationCode = "";
		}
			
		//endpoint payloadType
		if(typeof req.body.payloadType !== 'undefined'){
			endpointPayloadTypeCode =  req.body.payloadType.trim().toLowerCase();
			if(validator.isEmpty(endpointPayloadTypeCode)){
				err_code = 2;
				err_msg = "Endpoint Payload Type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'payload type' in json Endpoint request.";
		}
		
		//endpoint payloadMimeType
		if(typeof req.body.payloadMimeType !== 'undefined'){
			endpointPayloadMimeTypeCode =  req.body.payloadMimeType.trim().toLowerCase();
			if(validator.isEmpty(endpointPayloadMimeTypeCode)){
				err_code = 2;
				err_msg = "Endpoint Payload Mime Type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'payload mime type' in json Endpoint request.";
		}
		
		//endpoint period
		if(typeof req.body.period !== 'undefined'){
			var period = req.body.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				endpointPeriodStart = arrPeriod[0];
				endpointPeriodEnd = arrPeriod[1];

				if(!regex.test(endpointPeriodStart) && !regex.test(endpointPeriodEnd)){
					err_code = 2;
					err_msg = "Endpoint Period invalid date format.";
				}	
			}
		}else{
			err_code = 1;
			err_msg = "Please add key 'period' in json endpoint request.";
		}
		
		//endpoint address
		if(typeof req.body.address !== 'undefined'){
			endpointAddressCode =  req.body.address.trim().toLowerCase();
			if(validator.isEmpty(endpointAddressCode)){
				err_code = 2;
				err_msg = "Endpoint Address is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'address' in json Endpoint request.";
		}
		
		//endpoint header
		if(typeof req.body.header !== 'undefined'){
			endpointHeaderCode =  req.body.header.trim().toLowerCase();
			if(validator.isEmpty(endpointHeaderCode)){
				err_code = 2;
				err_msg = "Endpoint Header is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'header' in json Endpoint request.";
		}
		
		//contact point system
		if(typeof req.body.contact.system !== 'undefined'){
			contactPointSystemCode =  req.body.contact.system.trim().toLowerCase();
			if(validator.isEmpty(contactPointSystemCode)){
				err_code = 2;
				err_msg = "Contact Point System is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'system' in json telecom request.";
		}

		//contact point value
		if(typeof req.body.contact.value !== 'undefined'){
			contactPointValue =  req.body.contact.value;
			if(validator.isEmpty(contactPointValue)){
				err_code = 2;
				err_msg = "Contact Point Value is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'value' in json telecom request.";
		}

		//contact poin use
		if(typeof req.body.contact.use !== 'undefined'){
			contactPointUseCode =  req.body.contact.use.trim().toLowerCase();
			if(validator.isEmpty(contactPointUseCode)){
				err_code = 2;
				err_msg = "Telecom Use Code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'use' in json telecom request.";
		} 

		//contact poin rank
		if(typeof req.body.contact.rank !== 'undefined'){
			contactPointRank =  req.body.contact.rank;
			if(!validator.isInt(contactPointRank)){
				err_code = 2;
				err_msg = "Telecom Rank must be number";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'rank' in json telecom request.";
		} 

		//contact point period
		if(typeof req.body.contact.period !== 'undefined'){
			var period = req.body.contact.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				contactPointPeriodStart = arrPeriod[0];
				contactPointPeriodEnd = arrPeriod[1];

				if(!regex.test(contactPointPeriodStart) && !regex.test(contactPointPeriodEnd)){
					err_code = 2;
					err_msg = "Telecom Period invalid date format.";
				}	
			}else{
				contactPointPeriodStart = "";
				contactPointPeriodEnd = "";
			}
		}else{
			contactPointPeriodStart = "";
			contactPointPeriodEnd = "";
		}
		
		if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
						if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
								if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									checkCode(apikey, endpointStatusCode, 'ENDPOINT_STATUS', function(resEndpointStatusCode){
										if(resEndpointStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											checkCode(apikey, EndpointConnectionTypeCode, 'ENDPOINT_CONNECTION_TYPE', function(resEndpointConnectionTypeCode){
												if(resEndpointConnectionTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
													checkCode(apikey, endpointPayloadTypeCode , 'ENDPOINT_PAYLOAD_TYPE', function(resEndpointPayloadTypeCode){
														if(resEndpointPayloadTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
															checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
																if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																	checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
																		if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									
																			//event emiter
																			myEmitter.prependOnceListener('checkEndpointId', function() {
																					checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																						if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
																							checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
																								if(resContactPointValue.err_code == 0){
																									//proses insert

																									//set uniqe id
																									var unicId = uniqid.time();
																									//var organizationId = 'org' + unicId;
																									var identifierId = 'ide' + unicId;
																									var contactPointId = 'cop' + unicId;
																									var endpointId = 'enp' + unicId;

																									dataEnpoint = {
																										"id" : endpointId,
																										"status" : endpointStatusCode,
																										"connectionType" : EndpointConnectionTypeCode,
																										"name" : endpointNameCode,
																										"managingOrganization" : managingOrganizationCode,
																										"period_start": endpointPeriodStart,
																										"period_end": endpointPeriodEnd,
																										"payloadType": endpointPayloadTypeCode,
																										"payloadMimeType": endpointPayloadMimeTypeCode,
																										"address": endpointAddressCode,
																										"header": endpointHeaderCode
																									}
																									//console.log(dataEnpoint);
																									ApiFHIR.post('endpoint', {"apikey": apikey}, {body: dataEnpoint, json: true}, function(error, response, body){
																										endpoint = body;
																										if(endpoint.err_code > 0){
																											res.json(endpoint);	
																										}
																									})

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
																																		"endpoint_id": endpointId
																																	}

																									ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
																										identifier = body;
																										if(identifier.err_code > 0){
																											res.json(identifier);	
																										}
																									})

																									//contact_point
																									dataContactPoint = {
																																			"id": contactPointId,
																																			"system": contactPointSystemCode,
																																			"value": contactPointValue,
																																			"use": contactPointUseCode,
																																			"rank": contactPointRank,
																																			"period_start": contactPointPeriodStart,
																																			"period_end": contactPointPeriodEnd,
																																			"endpoint_id": endpointId
																																		}

																									//post to contact point
																									ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
																										contactPoint = body;
																										if(contactPoint.err_code > 0){
																											res.json(contactPoint);	
																										}
																									})

																									res.json({"err_code": 0, "err_msg": "Endpoint has been add.", "data": [{"_id": endpointId}]});											
																								}else{
																									res.json({"err_code": 509, "err_msg": "Telecom value already exist."});			
																								}
																							})
																						}else{
																							res.json({"err_code": 508, "err_msg": "Identifier value already exist."});		
																						}
																					})
																			});
																			
																			if(validator.isEmpty(managingOrganizationCode)){
																				myEmitter.emit('checkEndpointId');
																			}else{
																				checkUniqeValue(apikey, "ORGANIZATION_ID|" + managingOrganizationCode, 'ORGANIZATION', function(resPartOfValue){
																					if(resPartOfValue.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																						myEmitter.emit('checkEndpointId');
																					}else{
																						res.json({"err_code": 501, "err_msg": "Organization id is not exist."});
																					}
																				})
																			}
									
														
																		}else{
																			res.json({"err_code": 507, "err_msg": "Contact Point Use Code not found"});
																		}
																	})
																}else{
																	res.json({"err_code": 506, "err_msg": "Contact Point System Code not found"});		
																}
															})
														}else{
															res.json({"err_code": 505, "err_msg": "Endpoint payload type code not found"});		
														}
													})
												}else{
													res.json({"err_code": 504, "err_msg": "Endpoint connection type code not found"});		
												}
											})
										}else{
											res.json({"err_code": 503, "err_msg": "Endpoint status code not found"});		
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
		identifier: function addIdentifier(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var endpointId = req.params.endpoint_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof endpointId !== 'undefined'){
				if(validator.isEmpty(endpointId)){
					err_code = 2;
					err_msg = "Endpoint id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Endpoint id is required";
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
												checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointId){
													if(resEndpointId.err_code > 0){
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
																							"endpoint_id": endpointId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this endpoint.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Endpoint Id not found"});		
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
		telecom: function addTelecom(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var endpointId = req.params.endpoint_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof endpointId !== 'undefined'){
				if(validator.isEmpty(endpointId)){
					err_code = 2;
					err_msg = "Endpoint id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Endpoint id is required";
			}

			//telecom
			if(typeof req.body.system !== 'undefined'){
				contactPointSystemCode =  req.body.system.trim().toLowerCase();
				if(validator.isEmpty(contactPointSystemCode)){
					err_code = 2;
					err_msg = "Contact Point System is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'system' in json request.";
			}

			//telecom value
			if(typeof req.body.value !== 'undefined'){
				contactPointValue =  req.body.value;
				if(contactPointSystemCode == 'email'){
					if(!validator.isEmail(contactPointValue)){
						err_code = 2;
						err_msg = "Contact Point Value is invalid email format";
					}
				}else{
					if(validator.isEmpty(contactPointValue)){
						err_code = 2;
						err_msg = "Contact Point Value is required";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'value' in json request.";
			}

			//telecom use code
			if(typeof req.body.use !== 'undefined'){
				contactPointUseCode =  req.body.use.trim().toLowerCase();
				if(validator.isEmpty(contactPointUseCode)){
					err_code = 2;
					err_msg = "Telecom Use Code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'use' in json request.";
			} 

			//contact poin rank
			if(typeof req.body.rank !== 'undefined'){
				contactPointRank =  req.body.rank;
				if(!validator.isInt(contactPointRank)){
					err_code = 2;
					err_msg = "Telecom Rank must be number";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'rank' in json request.";
			} 

			//contact point period
			if(typeof req.body.period !== 'undefined'){
				var period = req.body.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					contactPointPeriodStart = arrPeriod[0];
					contactPointPeriodEnd = arrPeriod[1];

					if(!regex.test(contactPointPeriodStart) && !regex.test(contactPointPeriodEnd)){
						err_code = 2;
						err_msg = "Telecom Period invalid date format.";
					}	
				}else{
					err_code = 1;
					err_msg = "Telecom Period request format is wrong, `ex: start to end` ";
				}
			}else{
				contactPointPeriodStart = "";
				contactPointPeriodEnd = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointId){
							if(resEndpointId.err_code > 0){
								checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
									if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
											if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
													if(resContactPointValue.err_code == 0){
														//contact_point
														var contactPointId = 'cp' + uniqid.time();
														dataContactPoint = {
																								"id": contactPointId,
																								"system": contactPointSystemCode,
																								"value": contactPointValue,
																								"use": contactPointUseCode,
																								"rank": contactPointRank,
																								"period_start": contactPointPeriodStart,
																								"period_end": contactPointPeriodEnd,
																								"endpoint_id": endpointId
																							}

														ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
															contactPoint = body;
															if(contactPoint.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Telecom has been add in this endpoint.", "data": contactPoint.data});
															}else{
																res.json(contactPoint);	
															}
														})
													}else{
														res.json({"err_code": 501, "err_msg": "Telecom value already exist."});			
													}
												})	
											}else{
												res.json({"err_code": 504, "err_msg": "Contact Point Use Code not found"});
											}
										})
									}else{
										res.json({"err_code": 504, "err_msg": "Contact Point System Code not found"});		
									}
								})
							}else{
								res.json({"err_code": 503, "err_msg": "Endpoint Id not found"});	
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
		endpoint: function putEndpoint(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			
			var endpointId = req.params.endpoint_id;
			var err_code = 0;
			var err_msg = "";

			var dataEndpoint = {};
			
			//input check 
			if(typeof endpointId !== 'undefined'){
				if(validator.isEmpty(endpointId)){
					err_code = 1;
					err_msg = "Endpoint id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Endpoint id is required";
			}
			
			if(typeof req.body.status !== 'undefined'){
				status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Status is required.";
				}else{
					dataEndpoint.status = status;
				}
			}else{
				status = "";
			}
			
			if(typeof req.body.connectionType !== 'undefined'){
				connectionType =  req.body.connectionType.trim().toLowerCase();
				if(validator.isEmpty(connectionType)){
					err_code = 2;
					err_msg = "Connection Type is required.";
				}else{
					dataEndpoint.connectionType = connectionType;
				}
			}else{
				connectionType = "";
			}
			
			if(typeof req.body.name !== 'undefined'){
				name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					err_code = 2;
					err_msg = "Name is required.";
				}else{
					dataEndpoint.name = name;
				}
			}else{
				name = "";
			}
			
			
			//Endpoint managingOrganization
			if(typeof req.body.managingOrganization !== 'undefined'){
				managingOrganization =  req.body.managingOrganization.trim().toLowerCase();
				if(validator.isEmpty(managingOrganization)){
					err_code = 2;
					err_msg = "Managing Organization is required.";
				}else{
					dataEndpoint.managingOrganization = managingOrganization;
				}
			}else{
				managingOrganization = "";
			}
			
			//endpoint payloadType
			if(typeof req.body.payloadType !== 'undefined'){
				payloadType =  req.body.payloadType.trim().toLowerCase();
				if(validator.isEmpty(payloadType)){
					err_code = 2;
					err_msg = "Payload Type is required.";
				}else{
					dataEndpoint.payloadType = payloadType;
				}
			}else{
				payloadType = "";
			}

			//endpoint payloadMimeType
			if(typeof req.body.payloadMimeType !== 'undefined'){
				payloadMimeType =  req.body.payloadMimeType.trim().toLowerCase();
				if(validator.isEmpty(payloadMimeType)){
					err_code = 2;
					err_msg = "Payload Mime Type is required.";
				}else{
					dataEndpoint.payloadMimeType = payloadMimeType;
				}
			}else{
				payloadMimeType = "";
			}

			//endpoint period
			if(typeof req.body.period !== 'undefined'){
				period = req.body.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					PeriodStart = arrPeriod[0];
					PeriodEnd = arrPeriod[1];

					if(!regex.test(PeriodStart) && !regex.test(PeriodEnd)){
						err_code = 2;
						err_msg = "Period invalid date format.";
					}else{
						dataEndpoint.period_start = PeriodStart;
						dataEndpoint.period_end = PeriodEnd;
					}	
				}else{
					err_code = 1;
					err_msg = "Period request format is wrong, `ex: start to end` ";
				}
			}else{
				PeriodStart = "";
				PeriodEnd = "";
			}

			//endpoint address
			if(typeof req.body.address !== 'undefined'){
				address =  req.body.address.trim().toLowerCase();
				if(validator.isEmpty(address)){
					err_code = 2;
					err_msg = "Address is required.";
				}else{
					dataEndpoint.address = address;
				}
			}else{
				address = "";
			}			

			//endpoint header
			if(typeof req.body.header !== 'undefined'){
				header =  req.body.header.trim().toLowerCase();
				if(validator.isEmpty(header)){
					err_code = 2;
					err_msg = "Header is required.";
				}else{
					dataEndpoint.header = header;
				}
			}else{
				header = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkEndpointID', function(){
							checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
								if(resEndpointID.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('endpoint', {"apikey": apikey, "_id": endpointId}, {body: dataEndpoint, json: true}, function(error, response, body){
											endpoint = body;
											if(endpoint.err_code > 0){
												res.json(endpoint);	
											}else{
												res.json({"err_code": 0, "err_msg": "Endpoint has been update.", "data": [{"_id": endpointId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "Endpoint Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkStatus', function(){
							if(validator.isEmpty(status)){
								myEmitter.emit('checkEndpointID');
							}else{
								checkCode(apikey, status, 'ENDPOINT_STATUS', function(resStatusCode){
									if(resStatusCode.err_code > 0){
										myEmitter.emit('checkEndpointID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Status Code not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkConnectionType', function(){
							if(validator.isEmpty(connectionType)){
								myEmitter.emit('checkStatus');
							}else{
								checkCode(apikey, connectionType, 'ENDPOINT_CONNECTION_TYPE', function(resConnectionType){
									if(resConnectionType.err_code > 0){
										myEmitter.emit('checkStatus');				
									}else{
										res.json({"err_code": 503, "err_msg": "Connection Type Code not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkManagingOrganization', function(){
							if(validator.isEmpty(managingOrganization)){
								myEmitter.emit('checkConnectionType');
							}else{
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + managingOrganization, 'ORGANIZATION', function(resOrganizationID){
									if(resOrganizationID.err_code > 0){
										myEmitter.emit('checkConnectionType');				
									}else{
										res.json({"err_code": 503, "err_msg": "Managing Organization, organization id not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(payloadType)){
							myEmitter.emit('checkManagingOrganization');	
						}else{
							checkCode(apikey, payloadType, 'ENDPOINT_PAYLOAD_TYPE', function(resPayloadType){
								if(resPayloadType.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkManagingOrganization');
								}else{
									res.json({"err_code": 501, "err_msg": "Payload Type not found"});
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
		identifier: function updateIdentifier(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var endpointId = req.params.endpoint_id;
					var identifierId = req.params.identifier_id;

					var err_code = 0;
					var err_msg = "";
					var dataIdentifier = {};
					//input check 
					if(typeof endpointId !== 'undefined'){
						if(validator.isEmpty(endpointId)){
							err_code = 2;
							err_msg = "Endpoint id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Endpoint id is required";
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
								myEmitter.prependOnceListener('checkEndpointID', function(){
									checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointId){
										if(resEndpointId.err_code > 0){
											checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
												if(resIdentifierID.err_code > 0){
													ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "ENDPOINT_ID|"+endpointId}, {body: dataIdentifier, json: true}, function(error, response, body){
								  					identifier = body;
								  					if(identifier.err_code > 0){
								  						res.json(identifier);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Identifier has been update in this endpoint.", "data": identifier.data});
								  					}
								  				})
												}else{
													res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
												}
											})
										}else{
											res.json({"err_code": 504, "err_msg": "Endpoint Id not found"});		
										}
									})
								})

								myEmitter.prependOnceListener('checkIdentifierValue', function(){
									if(validator.isEmpty(identifierValue)){
										myEmitter.emit('checkEndpointID');
									}else{
										checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
											if(resIdentifierValue.err_code == 0){
												myEmitter.emit('checkEndpointID');				
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
		telecom: function updateTelecom(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var endpointId = req.params.endpoint_id;
					var contactPointId = req.params.contact_point_id;

					var err_code = 0;
					var err_msg = "";
					var dataContactPoint = {};

					//input check 
					if(typeof endpointId !== 'undefined'){
						if(validator.isEmpty(endpointId)){
							err_code = 2;
							err_msg = "Endpoint id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Endpoint id is required";
					}

					if(typeof contactPointId !== 'undefined'){
						if(validator.isEmpty(contactPointId)){
							err_code = 2;
							err_msg = "Telecom id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Telecom id is required";
					}

					//telecom
					if(typeof req.body.system !== 'undefined'){
						contactPointSystemCode =  req.body.system.trim().toLowerCase();
						if(validator.isEmpty(contactPointSystemCode)){
							err_code = 2;
							err_msg = "Contact Point System is required";
						}else{
							dataContactPoint.system = contactPointSystemCode;
						}
					}else{
						contactPointSystemCode = "";
					}

					//telecom value
					if(typeof req.body.value !== 'undefined'){
						contactPointValue =  req.body.value;
						if(contactPointSystemCode == 'email'){
							if(!validator.isEmail(contactPointValue)){
								err_code = 2;
								err_msg = "Contact Point Value is invalid email format";
							}else{
								dataContactPoint.value = contactPointValue;
							}
						}else{
							if(validator.isEmpty(contactPointValue)){
								err_code = 2;
								err_msg = "Contact Point Value is required";
							}else{
								dataContactPoint.value = contactPointValue;
							}
						}
					}else{
						contactPointValue = "";
					}

					//telecom use code
					if(typeof req.body.use !== 'undefined'){
						contactPointUseCode =  req.body.use.trim().toLowerCase();
						if(validator.isEmpty(contactPointUseCode)){
							err_code = 2;
							err_msg = "Telecom Use Code is required";
						}else{
							dataContactPoint.use = contactPointUseCode;
						}
					}else{
						contactPointUseCode = "";
					} 

					//contact poin rank
					if(typeof req.body.rank !== 'undefined'){
						contactPointRank =  req.body.rank;
						if(!validator.isInt(contactPointRank)){
							err_code = 2;
							err_msg = "Telecom Rank must be number";
						}else{
							dataContactPoint.rank = contactPointRank;
						}
					}

					//contact point period
					if(typeof req.body.period !== 'undefined'){
						var period = req.body.period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							contactPointPeriodStart = arrPeriod[0];
							contactPointPeriodEnd = arrPeriod[1];
							
							if(!regex.test(contactPointPeriodStart) && !regex.test(contactPointPeriodEnd)){
								err_code = 2;
								err_msg = "Telecom Period invalid date format.";
							}else{
								dataContactPoint.period_start = contactPointPeriodStart;
								dataContactPoint.period_end = contactPointPeriodEnd;
							}	
						}else{
							contactPointPeriodStart = "";
							contactPointPeriodEnd = "";
						}
					} 

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								myEmitter.prependOnceListener('checkEndpointId', function(){
									checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointId){
										if(resEndpointId.err_code > 0){
											checkUniqeValue(apikey, "CONTACT_POINT_ID|" + contactPointId, 'CONTACT_POINT', function(resContactPointID){
												if(resContactPointID.err_code > 0){
													ApiFHIR.put('contactPoint', {"apikey": apikey, "_id": contactPointId, "dr": "ENDPOINT_ID|"+endpointId}, {body: dataContactPoint, json: true}, function(error, response, body){
								  					contactPoint = body;
								  					if(contactPoint.err_code > 0){
								  						res.json(contactPoint);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Telecom has been update in this endpoint.", "data": contactPoint.data});
								  					}
								  				})
												}else{
													res.json({"err_code": 505, "err_msg": "Telecom Id not found"});		
												}
											})
										}else{
											res.json({"err_code": 504, "err_msg": "Endpoint Id not found"});		
										}
									})
								})

								myEmitter.prependOnceListener('checkContactPointValue', function(){
									if(validator.isEmpty(contactPointValue)){
										myEmitter.emit('checkEndpointId');
									}else{
										checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
											if(resContactPointValue.err_code == 0){
												myEmitter.emit('checkEndpointId');				
											}else{
												res.json({"err_code": 503, "err_msg": "Identifier value already exist."});	
											}
										})
									}
								})

								myEmitter.prependOnceListener('checkContactPointUse', function(){
									if(validator.isEmpty(contactPointUseCode)){
										myEmitter.emit('checkContactPointValue');
									}else{
										checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
											if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkContactPointValue');
											}else{
												res.json({"err_code": 502, "err_msg": "Contact Point Use Code not found"});		
											}
										})
									}
								})

								if(validator.isEmpty(contactPointSystemCode)){
									myEmitter.emit('checkContactPointUse');	
								}else{
									checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
										if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkContactPointUse');
										}else{
											res.json({"err_code": 501, "err_msg": "Contact Point System Code not found"});
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