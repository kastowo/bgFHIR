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
		specimen : function getSpecimen(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var specimenId = req.query._id;
			var accession = req.query.accession;
			var bodysite = req.query.bodysite;
			var collected = req.query.collected;
			var collector = req.query.collector;
			var container = req.query.container;
			var container_id = req.query.containerId;
			var identifier = req.query.identifier;
			var parent = req.query.parent;
			var patient = req.query.patient;
			var status = req.query.status;
			var subject = req.query.subject;
			var type = req.query.type;
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
			
			if(typeof specimenId !== 'undefined'){
				if(!validator.isEmpty(specimenId)){
					qString._id = specimenId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Specimen Id is required."});
				}
			}
			
			if(typeof accession !== 'undefined'){
				if(!validator.isEmpty(accession)){
					qString.accession = accession; 
				}else{
					res.json({"err_code": 1, "err_msg": "Accession is empty."});
				}
			}

			if(typeof bodysite !== 'undefined'){
				if(!validator.isEmpty(bodysite)){
					qString.bodysite = bodysite; 
				}else{
					res.json({"err_code": 1, "err_msg": "Bodysite is empty."});
				}
			}

			if(typeof collected !== 'undefined'){
				if(!validator.isEmpty(collected)){
					if(!regex.test(collected)){
						res.json({"err_code": 1, "err_msg": "Collected invalid format."});
					}else{
						qString.collected = collected; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Collected is empty."});
				}
			}

			if(typeof collector !== 'undefined'){
				if(!validator.isEmpty(collector)){
					qString.collector = collector; 
				}else{
					res.json({"err_code": 1, "err_msg": "Collector is empty."});
				}
			}

			if(typeof container !== 'undefined'){
				if(!validator.isEmpty(container)){
					qString.container = container; 
				}else{
					res.json({"err_code": 1, "err_msg": "Container is empty."});
				}
			}

			if(typeof container_id !== 'undefined'){
				if(!validator.isEmpty(container_id)){
					qString.container_id = container_id; 
				}else{
					res.json({"err_code": 1, "err_msg": "Container id is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof parent !== 'undefined'){
				if(!validator.isEmpty(parent)){
					qString.parent = parent; 
				}else{
					res.json({"err_code": 1, "err_msg": "Parent is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}

			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "Status is empty."});
				}
			}

			if(typeof subject !== 'undefined'){
				if(!validator.isEmpty(subject)){
					qString.subject = subject; 
				}else{
					res.json({"err_code": 1, "err_msg": "Subject is empty."});
				}
			}

			if(typeof type !== 'undefined'){
				if(!validator.isEmpty(type)){
					qString.type = type; 
				}else{
					res.json({"err_code": 1, "err_msg": "Type is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"Specimen" : {
					"location": "%(apikey)s/Specimen",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Specimen', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var specimen = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(specimen.err_code == 0){
								//cek jumdata dulu
								if(specimen.data.length > 0){
									newSpecimen = [];
									for(i=0; i < specimen.data.length; i++){
										myEmitter.once("getIdentifier", function(specimen, index, newSpecimen, countSpecimen){
											/*console.log(specimen);*/
											//get identifier
											qString = {};
											qString.specimen_id = specimen.id;
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
													var objectSpecimen = {};
													objectSpecimen.resourceType = specimen.resourceType;
													objectSpecimen.id = specimen.id;
													objectSpecimen.identifier = identifier.data;
													objectSpecimen.accessionIdentifier = specimen.accessionIdentifier;
													objectSpecimen.status = specimen.status;
													objectSpecimen.type = specimen.type;
													objectSpecimen.subject = specimen.subject;
													objectSpecimen.receivedTime = specimen.receivedTime;
													objectSpecimen.collection = specimen.collection;
													objectSpecimen.processing = host + ':' + port + '/' + apikey + '/Specimen/' +  specimen.id + '/specimenProcessing';
												
													newSpecimen[index] = objectSpecimen;

													myEmitter.once('getSpecimenContainer', function(specimen, index, newSpecimen, countSpecimen){
														qString = {};
														qString.specimen_id = specimen.id;
														seedPhoenixFHIR.path.GET = {
															"SpecimenContainer" : {
																"location": "%(apikey)s/SpecimenContainer",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('SpecimenContainer', {"apikey": apikey}, {}, function(error, response, body){
															specimenContainer = JSON.parse(body);
															if(specimenContainer.err_code == 0){
																var objectSpecimen = {};
																objectSpecimen.resourceType = specimen.resourceType;
																objectSpecimen.id = specimen.id;
																objectSpecimen.identifier = specimen.identifier;
																objectSpecimen.accessionIdentifier = specimen.accessionIdentifier;
																objectSpecimen.status = specimen.status;
																objectSpecimen.type = specimen.type;
																objectSpecimen.subject = specimen.subject;
																objectSpecimen.receivedTime = specimen.receivedTime;
																objectSpecimen.collection = specimen.collection;
																objectSpecimen.processing = specimen.processing;
																objectSpecimen.container = specimenContainer.data;

																newSpecimen[index] = objectSpecimen;
																myEmitter.once('getSpecimenNote', function(specimen, index, newSpecimen, countSpecimen){
																	qString = {};
																	qString.specimen_id = specimen.id;
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
																			var objectSpecimen = {};
																			objectSpecimen.resourceType = specimen.resourceType;
																			objectSpecimen.id = specimen.id;
																			objectSpecimen.identifier = specimen.identifier;
																			objectSpecimen.accessionIdentifier = specimen.accessionIdentifier;
																			objectSpecimen.status = specimen.status;
																			objectSpecimen.type = specimen.type;
																			objectSpecimen.subject = specimen.subject;
																			objectSpecimen.receivedTime = specimen.receivedTime;
																			objectSpecimen.collection = specimen.collection;
																			objectSpecimen.processing = specimen.processing;
																			objectSpecimen.container = specimen.container;
																			objectSpecimen.note = annotation.data;

																			newSpecimen[index] = objectSpecimen;
																			myEmitter.once('getSpecimenParent', function(specimen, index, newSpecimen, countSpecimen){
																				qString = {};
																				qString.specimen_id = specimen.id;
																				seedPhoenixFHIR.path.GET = {
																					"SpecimenParent" : {
																						"location": "%(apikey)s/SpecimenParent",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('SpecimenParent', {"apikey": apikey}, {}, function(error, response, body){
																					specimenParent = JSON.parse(body);
																					if(specimenParent.err_code == 0){
																						var objectSpecimen = {};
																						objectSpecimen.resourceType = specimen.resourceType;
																						objectSpecimen.id = specimen.id;
																						objectSpecimen.identifier = specimen.identifier;
																						objectSpecimen.accessionIdentifier = specimen.accessionIdentifier;
																						objectSpecimen.status = specimen.status;
																						objectSpecimen.type = specimen.type;
																						objectSpecimen.subject = specimen.subject;
																						objectSpecimen.receivedTime = specimen.receivedTime;
																						objectSpecimen.parent = specimenParent.data;
																						objectSpecimen.collection = specimen.collection;
																						objectSpecimen.processing = specimen.processing;
																						objectSpecimen.container = specimen.container;
																						objectSpecimen.note = annotation.data;

																						newSpecimen[index] = objectSpecimen;

																						myEmitter.once('getSpecimenRequest', function(specimen, index, newSpecimen, countSpecimen){
																							qString = {};
																							qString.specimen_id = specimen.id;
																							seedPhoenixFHIR.path.GET = {
																								"SpecimenRequest" : {
																									"location": "%(apikey)s/SpecimenRequest",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('SpecimenRequest', {"apikey": apikey}, {}, function(error, response, body){
																								specimenRequest = JSON.parse(body);
																								if(specimenRequest.err_code == 0){
																									var objectSpecimen = {};
																									objectSpecimen.resourceType = specimen.resourceType;
																									objectSpecimen.id = specimen.id;
																									objectSpecimen.identifier = specimen.identifier;
																									objectSpecimen.accessionIdentifier = specimen.accessionIdentifier;
																									objectSpecimen.status = specimen.status;
																									objectSpecimen.type = specimen.type;
																									objectSpecimen.subject = specimen.subject;
																									objectSpecimen.receivedTime = specimen.receivedTime;
																									objectSpecimen.parent = specimen.parent;
																									objectSpecimen.request = specimenRequest.data;
																									objectSpecimen.collection = specimen.collection;
																									objectSpecimen.processing = specimen.processing;
																									objectSpecimen.container = specimen.container;
																									objectSpecimen.note = annotation.data;

																									newSpecimen[index] = objectSpecimen;
																									if(index == countSpecimen -1 ){
																										res.json({"err_code": 0, "data":newSpecimen});
																									}
																								}else{
																									res.json(specimenRequest);			
																								}
																							})
																						});
																						myEmitter.emit('getSpecimenRequest', objectSpecimen, index, newSpecimen, countSpecimen);																							
																					}else{
																						res.json(specimenParent);			
																					}
																				})
																			});
																			myEmitter.emit('getSpecimenParent', objectSpecimen, index, newSpecimen, countSpecimen);																							
																		}else{
																			res.json(annotation);			
																		}
																	})
																});
																myEmitter.emit('getSpecimenNote', objectSpecimen, index, newSpecimen, countSpecimen);
															}else{
																res.json(specimenContainer);			
															}
														})
													});
													myEmitter.emit('getSpecimenContainer', objectSpecimen, index, newSpecimen, countSpecimen);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", specimen.data[i], i, newSpecimen, specimen.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Specimen is empty."});	
								}
							}else{
								res.json(specimen);
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
					var specimenId = req.params.specimen_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenID){
								if(resSpecimenID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.specimen_id = specimenId;
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
						  			qString.specimen_id = specimenId;
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
									res.json({"err_code": 501, "err_msg": "Specimen Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		specimenProcessing: function getSpecimenProcessing(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var specimenId = req.params.specimen_id;
			var specimenProcessingId = req.params.specimen_processing_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimen){
						if(resSpecimen.err_code > 0){
							if(typeof specimenProcessingId !== 'undefined' && !validator.isEmpty(specimenProcessingId)){
								checkUniqeValue(apikey, "PROCESSING_ID|" + specimenProcessingId, 'SPECIMEN_PROCESSING', function(resSpecimenProcessingID){
									if(resSpecimenProcessingID.err_code > 0){
										//get specimenProcessing
										qString = {};
										qString.specimen_id = specimenId;
										qString._id = specimenProcessingId;
										seedPhoenixFHIR.path.GET = {
											"SpecimenProcessing" : {
												"location": "%(apikey)s/SpecimenProcessing",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('SpecimenProcessing', {"apikey": apikey}, {}, function(error, response, body){
											specimenProcessing = JSON.parse(body);
											if(specimenProcessing.err_code == 0){
												//res.json({"err_code": 0, "data":specimenProcessing.data});	
												if(specimenProcessing.data.length > 0){
													newSpecimenProcessing = [];
													for(i=0; i < specimenProcessing.data.length; i++){
														myEmitter.once('getSpecimenProcessingAdditive', function(specimenProcessing, index, newSpecimenProcessing, countSpecimenProcessing){
															qString = {};
															qString.specimen_id = specimenProcessing.id;
															seedPhoenixFHIR.path.GET = {
																"SpecimenProcessingAdditive" : {
																	"location": "%(apikey)s/SpecimenProcessingAdditive",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('SpecimenProcessingAdditive', {"apikey": apikey}, {}, function(error, response, body){
																specimenProcessingAdditive = JSON.parse(body);
																if(specimenProcessingAdditive.err_code == 0){
																	var objectSpecimenProcessing = {};
																	objectSpecimenProcessing.id = specimenProcessing.id;
																	objectSpecimenProcessing.description = specimenProcessing.description;
																	objectSpecimenProcessing.procedure = specimenProcessing.procedure;
																	objectSpecimenProcessing.additive = specimenProcessingAdditive.data;
																	objectSpecimenProcessing.time = specimenProcessing.time;

																	newSpecimenProcessing[index] = objectSpecimenProcessing;

																	if(index == countSpecimenProcessing -1 ){
																		res.json({"err_code": 0, "data":newSpecimenProcessing});	
																	}
																}else{
																	res.json(specimenProcessingAdditive);			
																}
															})
														})
														myEmitter.emit('getSpecimenProcessingAdditive', specimenProcessing.data[i], i, newSpecimenProcessing, specimenProcessing.data.length);

													}
												}else{
													res.json({"err_code": 2, "err_msg": "specimen processing is empty."});	
												}
											}else{
												res.json(specimenProcessing);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Specimen Processing Id not found"});		
									}
								})
							}else{
								//get specimenProcessing
								qString = {};
								qString.specimen_id = specimenId;
								seedPhoenixFHIR.path.GET = {
									"SpecimenProcessing" : {
										"location": "%(apikey)s/SpecimenProcessing",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('SpecimenProcessing', {"apikey": apikey}, {}, function(error, response, body){
									specimenProcessing = JSON.parse(body);
									if(specimenProcessing.err_code == 0){
										//res.json({"err_code": 0, "data":specimenProcessing.data});	
										if(specimenProcessing.data.length > 0){
											newSpecimenProcessing = [];
											for(i=0; i < specimenProcessing.data.length; i++){
												myEmitter.once('getSpecimenProcessingAdditive', function(specimenProcessing, index, newSpecimenProcessing, countSpecimenProcessing){
													qString = {};
													qString.specimen_id = specimenProcessing.id;
													seedPhoenixFHIR.path.GET = {
														"SpecimenProcessingAdditive" : {
															"location": "%(apikey)s/SpecimenProcessingAdditive",
															"query": qString
														}
													}

													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get('SpecimenProcessingAdditive', {"apikey": apikey}, {}, function(error, response, body){
														specimenProcessingAdditive = JSON.parse(body);
														if(specimenProcessingAdditive.err_code == 0){
															var objectSpecimenProcessing = {};
															objectSpecimenProcessing.id = specimenProcessing.id;
															objectSpecimenProcessing.description = specimenProcessing.description;
															objectSpecimenProcessing.procedure = specimenProcessing.procedure;
															objectSpecimenProcessing.additive = specimenProcessingAdditive.data;
															objectSpecimenProcessing.time = specimenProcessing.time;
															
															newSpecimenProcessing[index] = objectSpecimenProcessing;

															if(index == countSpecimenProcessing -1 ){
																res.json({"err_code": 0, "data":newSpecimenProcessing});	
															}
														}else{
															res.json(specimenProcessingAdditive);			
														}
													})
												})
												myEmitter.emit('getSpecimenProcessingAdditive', specimenProcessing.data[i], i, newSpecimenProcessing, specimenProcessing.data.length);

											}
										}else{
											res.json({"err_code": 2, "err_msg": "specimen processing is empty."});	
										}
									}else{
										res.json(specimenProcessing);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Specimen Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		specimenContainer: function getSpecimenContainer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var specimenId = req.params.specimen_id;
			var specimenContainerId = req.params.specimen_container_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimen){
						if(resSpecimen.err_code > 0){
							if(typeof specimenContainerId !== 'undefined' && !validator.isEmpty(specimenContainerId)){
								checkUniqeValue(apikey, "CONTAINER_ID|" + specimenContainerId, 'SPECIMEN_CONTAINER', function(resSpecimenContainerID){
									if(resSpecimenContainerID.err_code > 0){
										//get specimenContainer
										qString = {};
										qString.specimen_id = specimenId;
										qString._id = specimenContainerId;
										seedPhoenixFHIR.path.GET = {
											"SpecimenContainer" : {
												"location": "%(apikey)s/SpecimenContainer",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('SpecimenContainer', {"apikey": apikey}, {}, function(error, response, body){
											specimenContainer = JSON.parse(body);
											if(specimenContainer.err_code == 0){
												res.json({"err_code": 0, "data":specimenContainer.data});	
											}else{
												res.json(specimenContainer);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Specimen Container Id not found"});		
									}
								})
							}else{
								//get specimenContainer
								qString = {};
								qString.specimen_id = specimenId;
								seedPhoenixFHIR.path.GET = {
									"SpecimenContainer" : {
										"location": "%(apikey)s/SpecimenContainer",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('SpecimenContainer', {"apikey": apikey}, {}, function(error, response, body){
									specimenContainer = JSON.parse(body);
									if(specimenContainer.err_code == 0){
										res.json({"err_code": 0, "data":specimenContainer.data});	
									}else{
										res.json(specimenContainer);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Specimen Id not found"});		
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
		specimen : function addSpecimen(req, res){
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
accessionIdentifier|accessionIdentifier|||
status|status|||
type|type|||U
subject.patient|subjectPatient|||
subject.group|subjectGroup|||
subject.device|subjectDevice|||
subject.substance|subjectSubstance|||
receivedTime|receivedTime|date||
parent|parent|||
request|request|||
collection.collector|collectionCollector|||
collection.collected.collectedDateTime|collectionCollectedCollectedDateTime|date||
collection.collected.collectedPeriod|collectionCollectedCollectedPeriod|period||
collection.quantity|collectionQuantity|range||
collection.method|collectionMethod|||
collection.bodySite|collectionBodySite|||
processing.description|processingDescription|||
processing.procedure|processingProcedure|||U
processing.additive|processingAdditive|||
processing.time.timeDateTime|processingTimeTimeDateTime|date||
processing.time.timePeriod|processingTimeTimePeriod|period||
container.identifier.use|containerIdentifierUse|||
container.identifier.type|containerIdentifierType|||U
container.identifier.value|containerIdentifierValue|||
container.identifier.period|containerIdentifierPeriod|period||
container.description|containerDescription|||
container.type|containerType|||
container.capacity|containerCapacity|||
container.specimenQuantity|containerSpecimenQuantity|||
container.additive.additiveCodeableConcept|containerAdditiveAdditiveCodeableConcept|||U
container.additive.additiveReference|containerAdditiveAdditiveReference|||
note.author.authorReference.practitioner|noteAuthorAuthorReferencePractitioner|||
note.author.authorReference.patient|noteAuthorAuthorReferencePatient|||
note.author.authorReference.relatedPerson|noteAuthorAuthorReferenceRelatedPerson|||
note.author.authorString|noteAuthorAuthorString|||
note.time|noteTime|date||
note.Text|noteText|||
*/
			if(typeof req.body.accessionIdentifier !== 'undefined'){
				var accessionIdentifier =  req.body.accessionIdentifier.trim().toLowerCase();
				if(validator.isEmpty(accessionIdentifier)){
					accessionIdentifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accession identifier' in json Specimenrequest.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Specimenrequest.";
			}

			if(typeof req.body.type !== 'undefined'){
				var type =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(type)){
					type = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Specimenrequest.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Specimenrequest.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Specimenrequest.";
			}

			if(typeof req.body.subject.device !== 'undefined'){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					subjectDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject device' in json Specimenrequest.";
			}

			if(typeof req.body.subject.substance !== 'undefined'){
				var subjectSubstance =  req.body.subject.substance.trim().toLowerCase();
				if(validator.isEmpty(subjectSubstance)){
					subjectSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject substance' in json Specimenrequest.";
			}

			if(typeof req.body.receivedTime !== 'undefined'){
				var receivedTime =  req.body.receivedTime;
				if(validator.isEmpty(receivedTime)){
					receivedTime = "";
				}else{
					if(!regex.test(receivedTime)){
						err_code = 2;
						err_msg = "Sequence received time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'received time' in json Specimenrequest.";
			}

			if(typeof req.body.parent !== 'undefined'){
				var parent =  req.body.parent.trim().toLowerCase();
				if(validator.isEmpty(parent)){
					parent = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'parent' in json Specimenrequest.";
			}

			if(typeof req.body.request !== 'undefined'){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					request = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request' in json Specimenrequest.";
			}

			if(typeof req.body.collection.collector !== 'undefined'){
				var collectionCollector =  req.body.collection.collector.trim().toLowerCase();
				if(validator.isEmpty(collectionCollector)){
					collectionCollector = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'collection collector' in json Specimenrequest.";
			}

			if(typeof req.body.collection.collected.collectedDateTime !== 'undefined'){
				var collectionCollectedCollectedDateTime =  req.body.collection.collected.collectedDateTime;
				if(validator.isEmpty(collectionCollectedCollectedDateTime)){
					collectionCollectedCollectedDateTime = "";
				}else{
					if(!regex.test(collectionCollectedCollectedDateTime)){
						err_code = 2;
						err_msg = "Sequence collection collected collected date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'collection collected collected date time' in json Specimenrequest.";
			}

			if (typeof req.body.collection.collected.collectedPeriod !== 'undefined') {
			  var collectionCollectedCollectedPeriod = req.body.collection.collected.collectedPeriod;
 				if(validator.isEmpty(collectionCollectedCollectedPeriod)) {
				  var collectionCollectedCollectedPeriodStart = "";
				  var collectionCollectedCollectedPeriodEnd = "";
				} else {
				  if (collectionCollectedCollectedPeriod.indexOf("to") > 0) {
				    arrCollectionCollectedCollectedPeriod = collectionCollectedCollectedPeriod.split("to");
				    var collectionCollectedCollectedPeriodStart = arrCollectionCollectedCollectedPeriod[0];
				    var collectionCollectedCollectedPeriodEnd = arrCollectionCollectedCollectedPeriod[1];
				    if (!regex.test(collectionCollectedCollectedPeriodStart) && !regex.test(collectionCollectedCollectedPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Sequence collection collected collected period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Sequence collection collected collected period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'collection collected collected period' in json Specimenrequest.";
			}

			if (typeof req.body.collection.quantity !== 'undefined') {
			  var collectionQuantity = req.body.collection.quantity;
 				if(validator.isEmpty(collectionQuantity)){
				  var collectionQuantityLow = "";
				  var collectionQuantityHigh = "";
				} else {
				  if (collectionQuantity.indexOf("to") > 0) {
				    arrCollectionQuantity = collectionQuantity.split("to");
				    var collectionQuantityLow = arrCollectionQuantity[0];
				    var collectionQuantityHigh = arrCollectionQuantity[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Sequence collection quantity invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'collection quantity' in json Specimenrequest.";
			}

			if(typeof req.body.collection.method !== 'undefined'){
				var collectionMethod =  req.body.collection.method.trim().toLowerCase();
				if(validator.isEmpty(collectionMethod)){
					collectionMethod = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'collection method' in json Specimenrequest.";
			}

			if(typeof req.body.collection.bodySite !== 'undefined'){
				var collectionBodySite =  req.body.collection.bodySite.trim().toLowerCase();
				if(validator.isEmpty(collectionBodySite)){
					collectionBodySite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'collection body site' in json Specimenrequest.";
			}

			if(typeof req.body.processing.description !== 'undefined'){
				var processingDescription =  req.body.processing.description.trim().toLowerCase();
				if(validator.isEmpty(processingDescription)){
					processingDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'processing description' in json Specimenrequest.";
			}

			if(typeof req.body.processing.procedure !== 'undefined'){
				var processingProcedure =  req.body.processing.procedure.trim().toUpperCase();
				if(validator.isEmpty(processingProcedure)){
					processingProcedure = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'processing procedure' in json Specimenrequest.";
			}

			if(typeof req.body.processing.additive !== 'undefined'){
				var processingAdditive =  req.body.processing.additive.trim().toLowerCase();
				if(validator.isEmpty(processingAdditive)){
					processingAdditive = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'processing additive' in json Specimenrequest.";
			}

			if(typeof req.body.processing.time.timeDateTime !== 'undefined'){
				var processingTimeTimeDateTime =  req.body.processing.time.timeDateTime;
				if(validator.isEmpty(processingTimeTimeDateTime)){
					processingTimeTimeDateTime = "";
				}else{
					if(!regex.test(processingTimeTimeDateTime)){
						err_code = 2;
						err_msg = "Sequence processing time time date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'processing time time date time' in json Specimenrequest.";
			}

			if (typeof req.body.processing.time.timePeriod !== 'undefined') {
			  var processingTimeTimePeriod = req.body.processing.time.timePeriod;
 				if(validator.isEmpty(processingTimeTimePeriod)) {
				  var processingTimeTimePeriodStart = "";
				  var processingTimeTimePeriodEnd = "";
				} else {
				  if (processingTimeTimePeriod.indexOf("to") > 0) {
				    arrProcessingTimeTimePeriod = processingTimeTimePeriod.split("to");
				    var processingTimeTimePeriodStart = arrProcessingTimeTimePeriod[0];
				    var processingTimeTimePeriodEnd = arrProcessingTimeTimePeriod[1];
				    if (!regex.test(processingTimeTimePeriodStart) && !regex.test(processingTimeTimePeriodEnd)) {
				      err_code = 2;
				      err_msg = "Sequence processing time time period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Sequence processing time time period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'processing time time period' in json Specimenrequest.";
			}

			if(typeof req.body.container.identifier.use !== 'undefined'){
				var containerIdentifierUse =  req.body.container.identifier.use.trim().toLowerCase();
				if(validator.isEmpty(containerIdentifierUse)){
					containerIdentifierUse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container identifier use' in json Specimenrequest.";
			}

			if(typeof req.body.container.identifier.type !== 'undefined'){
				var containerIdentifierType =  req.body.container.identifier.type.trim().toUpperCase();
				if(validator.isEmpty(containerIdentifierType)){
					containerIdentifierType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container identifier type' in json Specimenrequest.";
			}

			if(typeof req.body.container.identifier.value !== 'undefined'){
				var containerIdentifierValue =  req.body.container.identifier.value.trim().toLowerCase();
				if(validator.isEmpty(containerIdentifierValue)){
					containerIdentifierValue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container identifier value' in json Specimenrequest.";
			}

			if (typeof req.body.container.identifier.period !== 'undefined') {
			  var containerIdentifierPeriod = req.body.container.identifier.period;
 				if(validator.isEmpty(containerIdentifierPeriod)) {
				  var containerIdentifierPeriodStart = "";
				  var containerIdentifierPeriodEnd = "";
				} else {
				  if (containerIdentifierPeriod.indexOf("to") > 0) {
				    arrContainerIdentifierPeriod = containerIdentifierPeriod.split("to");
				    var containerIdentifierPeriodStart = arrContainerIdentifierPeriod[0];
				    var containerIdentifierPeriodEnd = arrContainerIdentifierPeriod[1];
				    if (!regex.test(containerIdentifierPeriodStart) && !regex.test(containerIdentifierPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Sequence container identifier period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Sequence container identifier period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'container identifier period' in json Specimenrequest.";
			}

			if(typeof req.body.container.description !== 'undefined'){
				var containerDescription =  req.body.container.description.trim().toLowerCase();
				if(validator.isEmpty(containerDescription)){
					containerDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container description' in json Specimenrequest.";
			}

			if(typeof req.body.container.type !== 'undefined'){
				var containerType =  req.body.container.type.trim().toLowerCase();
				if(validator.isEmpty(containerType)){
					containerType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container type' in json Specimenrequest.";
			}

			if(typeof req.body.container.capacity !== 'undefined'){
				var containerCapacity =  req.body.container.capacity.trim().toLowerCase();
				if(validator.isEmpty(containerCapacity)){
					containerCapacity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container capacity' in json Specimenrequest.";
			}

			if(typeof req.body.container.specimenQuantity !== 'undefined'){
				var containerSpecimenQuantity =  req.body.container.specimenQuantity.trim().toLowerCase();
				if(validator.isEmpty(containerSpecimenQuantity)){
					containerSpecimenQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container specimen quantity' in json Specimenrequest.";
			}

			if(typeof req.body.container.additive.additiveCodeableConcept !== 'undefined'){
				var containerAdditiveAdditiveCodeableConcept =  req.body.container.additive.additiveCodeableConcept.trim().toUpperCase();
				if(validator.isEmpty(containerAdditiveAdditiveCodeableConcept)){
					containerAdditiveAdditiveCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container additive additive codeable concept' in json Specimenrequest.";
			}

			if(typeof req.body.container.additive.additiveReference !== 'undefined'){
				var containerAdditiveAdditiveReference =  req.body.container.additive.additiveReference.trim().toLowerCase();
				if(validator.isEmpty(containerAdditiveAdditiveReference)){
					containerAdditiveAdditiveReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container additive additive reference' in json Specimenrequest.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Specimenrequest.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Specimenrequest.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Specimenrequest.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Specimenrequest.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Sequence note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Specimenrequest.";
			}

			if(typeof req.body.note.Text !== 'undefined'){
				var noteText =  req.body.note.Text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note.Text' in json Specimenrequest.";
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
														var specimenId = 'spe' + unicId;
														var specimenProcessingId = 'spr' + unicId;
														var specimenContainerId = 'sco' + unicId;
														var noteId = 'ann' + unicId;
														var identifierContaninerId = 'idc' + unicId;
											
														dataSpecimen = {
															"specimen_id" : specimenId,
															"accession_identifier" : accessionIdentifier,
															"status" : status,
															"type" : type,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"subject_device" : subjectDevice,
															"subject_substance" : subjectSubstance,
															"received_time" : receivedTime,
															"collector" : collectionCollector,
															"collected_date_time" : collectionCollectedCollectedDateTime,
															"collected_period_start" : collectionCollectedCollectedPeriodStart,
															"collected_period_end" : collectionCollectedCollectedPeriodEnd,
															"quantity_low" : collectionQuantityLow,
															"quantity_high" : collectionQuantityHigh,
															"method" : collectionMethod,
															"body_site" : collectionBodySite,
															"parent" : parent
														}
														console.log(dataSpecimen);
														ApiFHIR.post('specimen', {"apikey": apikey}, {body: dataSpecimen, json: true}, function(error, response, body){
															specimen = body;
															if(specimen.err_code > 0){
																res.json(specimen);	
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
																							"specimen_id": specimenId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})									
														//SpecimenProcessing
														dataSpecimenProcessing = {
															"processing_id" : specimenProcessingId,
															"desciption" : processingDescription,
															"procedur" : processingProcedure,
															"time_date_time" : processingTimeTimeDateTime,
															"time_period_start" : processingTimeTimePeriodStart,
															"time_period_end" : processingTimeTimePeriodEnd,
															"specimen_id" : specimenId
														};
														ApiFHIR.post('specimenProcessing', {"apikey": apikey}, {body: dataSpecimenProcessing, json: true}, function(error, response, body){
															specimenProcessing = body;
															if(specimenProcessing.err_code > 0){
																res.json(specimenProcessing);	
																console.log("ok");
															}
														});
														
														//SpecimenContaniner
														dataSpecimenContaniner = {
															"container_id" : specimenContainerId,
															"desciption" : containerDescription,
															"type" : containerType,
															"capacity" : containerCapacity,
															"specimen_quantity" : containerSpecimenQuantity,
															"additive_codeable_concept" : containerAdditiveAdditiveCodeableConcept,
															"additive_reference" : containerAdditiveAdditiveReference,
															"specimen_id" : specimenId
														};
														ApiFHIR.post('specimenContainer', {"apikey": apikey}, {body: dataSpecimenContaniner, json: true}, function(error, response, body){
															specimenContaniner = body;
															if(specimenContaniner.err_code > 0){
																res.json(specimenContaniner);	
																console.log("ok");
															}
														});
														
														var identifierSystemContaniner = identifierId;
														dataIdentifier = {
																							"id": identifierContaninerId,
																							"use": containerIdentifierUse,
																							"type": containerIdentifierType,
																							"system": identifierSystemContaniner,
																							"value": containerIdentifierValue,
																							"period_start": containerIdentifierPeriodStart,
																							"period_end": containerIdentifierPeriodEnd,
																							"specimen_contaniner_id": specimenContainerId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifierContaniner = body;
															if(identifierContaniner.err_code > 0){
																res.json(identifierContaniner);	
															}
														})
														
														var dataNote = {
															"id": noteId,
															"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
															"author_ref_patient": noteAuthorAuthorReferencePatient,
															"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
															"author_string": noteAuthorAuthorString,
															"time": noteTime,
															"text": noteText,
															"specimen_id" : specimenId
														}

														//method, endpoint, params, options, callback
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNote, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
																console.log("ok");
															}
														});
														
														if(parent !== ""){
															dataParent = {
																"_id" : parent,
																"parent" : specimenId
															}
															ApiFHIR.put('specimen', {"apikey": apikey, "_id": parent}, {body: dataParent, json: true}, function(error, response, body){
																returnParent = body;
																if(returnParent.err_code > 0){
																	res.json(returnParent);	
																	console.log("add reference parent : " + parent);
																}
															});
														}
														
														if(request !== ""){
															dataRequest = {
																"_id" : request,
																"specimen_id" : specimenId
															}
															ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": request}, {body: dataRequest, json: true}, function(error, response, body){
																returnRequest = body;
																if(returnRequest.err_code > 0){
																	res.json(returnRequest);	
																	console.log("add reference request : " + request);
																}
															});
														}
														
														if(processingAdditive !== ""){
															dataProcessingAdditive = {
																"_id" : processingAdditive,
																"specimen_processing_id" : specimenId
															}
															ApiFHIR.put('substance', {"apikey": apikey, "_id": processingAdditive}, {body: dataProcessingAdditive, json: true}, function(error, response, body){
																returnProcessingAdditive = body;
																if(returnProcessingAdditive.err_code > 0){
																	res.json(returnProcessingAdditive);	
																	console.log("add reference processing additive : " + processingAdditive);
																}
															});
														}
														
														res.json({"err_code": 0, "err_msg": "Specimen has been add.", "data": [{"_id": specimenId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*

status|specimen-status
type|specimen-type
collectionMethod|specimen-collection-method
collectionBodySite|body-site
processingProcedure|specimen-processing-procedure
containerType|specimen-container-type
containerAdditiveAdditiveCodeableConcept|preservative
containerIdentifierUse|IDENTIFIER_USE
containerIdentifierType|IDENTIFIER_TYPE


										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'SPECIMEN_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkType', function () {
											if (!validator.isEmpty(type)) {
												checkCode(apikey, type, 'SPECIMEN_TYPE', function (resTypeCode) {
													if (resTypeCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkCollectionMethod', function () {
											if (!validator.isEmpty(collectionMethod)) {
												checkCode(apikey, collectionMethod, 'SPECIMEN_COLLECTION_METHOD', function (resCollectionMethodCode) {
													if (resCollectionMethodCode.err_code > 0) {
														myEmitter.emit('checkType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Collection method code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkType');
											}
										})

										myEmitter.prependOnceListener('checkCollectionBodySite', function () {
											if (!validator.isEmpty(collectionBodySite)) {
												checkCode(apikey, collectionBodySite, 'BODY_SITE', function (resCollectionBodySiteCode) {
													if (resCollectionBodySiteCode.err_code > 0) {
														myEmitter.emit('checkCollectionMethod');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Collection body site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCollectionMethod');
											}
										})

										myEmitter.prependOnceListener('checkProcessingProcedure', function () {
											if (!validator.isEmpty(processingProcedure)) {
												checkCode(apikey, processingProcedure, 'SPECIMEN_PROCESSING_PROCEDURE', function (resProcessingProcedureCode) {
													if (resProcessingProcedureCode.err_code > 0) {
														myEmitter.emit('checkCollectionBodySite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Processing procedure code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCollectionBodySite');
											}
										})

										myEmitter.prependOnceListener('checkContainerType', function () {
											if (!validator.isEmpty(containerType)) {
												checkCode(apikey, containerType, 'SPECIMEN_CONTAINER_TYPE', function (resContainerTypeCode) {
													if (resContainerTypeCode.err_code > 0) {
														myEmitter.emit('checkProcessingProcedure');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Container type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcessingProcedure');
											}
										})

										myEmitter.prependOnceListener('checkContainerAdditiveAdditiveCodeableConcept', function () {
											if (!validator.isEmpty(containerAdditiveAdditiveCodeableConcept)) {
												checkCode(apikey, containerAdditiveAdditiveCodeableConcept, 'PRESERVATIVE', function (resContainerAdditiveAdditiveCodeableConceptCode) {
													if (resContainerAdditiveAdditiveCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkContainerType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Container additive additive codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContainerType');
											}
										})

										myEmitter.prependOnceListener('checkContainerIdentifierUse', function () {
											if (!validator.isEmpty(containerIdentifierUse)) {
												checkCode(apikey, containerIdentifierUse, 'IDENTIFIER_USE', function (resContainerIdentifierUseCode) {
													if (resContainerIdentifierUseCode.err_code > 0) {
														myEmitter.emit('checkContainerAdditiveAdditiveCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Container identifier use code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContainerAdditiveAdditiveCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkContainerIdentifierType', function () {
											if (!validator.isEmpty(containerIdentifierType)) {
												checkCode(apikey, containerIdentifierType, 'IDENTIFIER_TYPE', function (resContainerIdentifierTypeCode) {
													if (resContainerIdentifierTypeCode.err_code > 0) {
														myEmitter.emit('checkContainerIdentifierUse');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Container identifier type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContainerIdentifierUse');
											}
										})
										
										
										//cek value
										/*
containerIdentifierValue|Identifier
accessionIdentifier|Identifier
subjectPatient|Patient
subjectGroup|Group
subjectDevice|device
subjectSubstance|Substance
parent|specimen
request|ProcedureRequest
collectionCollector|Practitioner
processingAdditive|Substance
containerAdditiveAdditiveReference|Substance
noteAuthorAuthorReferencePractitioner|Practitioner
noteAuthorAuthorReferencePatient|patient
noteAuthorAuthorReferenceRelatedPerson|RelatedPerson

*/
										myEmitter.prependOnceListener('checkContainerIdentifierValue', function () {
											if (!validator.isEmpty(containerIdentifierValue)) {
												checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + containerIdentifierValue, 'IDENTIFIER', function (resContainerIdentifierValue) {
													if (resContainerIdentifierValue.err_code > 0) {
														myEmitter.emit('checkContainerIdentifierType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Container identifier value id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContainerIdentifierType');
											}
										})

										myEmitter.prependOnceListener('checkAccessionIdentifier', function () {
											if (!validator.isEmpty(accessionIdentifier)) {
												checkUniqeValue(apikey, "IDENTIFIER_ID|" + accessionIdentifier, 'IDENTIFIER', function (resAccessionIdentifier) {
													if (resAccessionIdentifier.err_code > 0) {
														myEmitter.emit('checkContainerIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accession identifier id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContainerIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkAccessionIdentifier');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAccessionIdentifier');
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

										myEmitter.prependOnceListener('checkSubjectDevice', function () {
											if (!validator.isEmpty(subjectDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + subjectDevice, 'DEVICE', function (resSubjectDevice) {
													if (resSubjectDevice.err_code > 0) {
														myEmitter.emit('checkSubjectGroup');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectGroup');
											}
										})

										myEmitter.prependOnceListener('checkSubjectSubstance', function () {
											if (!validator.isEmpty(subjectSubstance)) {
												checkUniqeValue(apikey, "SUBSTANCE_ID|" + subjectSubstance, 'SUBSTANCE', function (resSubjectSubstance) {
													if (resSubjectSubstance.err_code > 0) {
														myEmitter.emit('checkSubjectDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject substance id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectDevice');
											}
										})

										myEmitter.prependOnceListener('checkParent', function () {
											if (!validator.isEmpty(parent)) {
												checkUniqeValue(apikey, "SPECIMEN_ID|" + parent, 'SPECIMEN', function (resParent) {
													if (resParent.err_code > 0) {
														myEmitter.emit('checkSubjectSubstance');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Parent id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectSubstance');
											}
										})

										myEmitter.prependOnceListener('checkRequest', function () {
											if (!validator.isEmpty(request)) {
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + request, 'PROCEDURE_REQUEST', function (resRequest) {
													if (resRequest.err_code > 0) {
														myEmitter.emit('checkParent');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkParent');
											}
										})

										myEmitter.prependOnceListener('checkCollectionCollector', function () {
											if (!validator.isEmpty(collectionCollector)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + collectionCollector, 'PRACTITIONER', function (resCollectionCollector) {
													if (resCollectionCollector.err_code > 0) {
														myEmitter.emit('checkRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Collection collector id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequest');
											}
										})

										myEmitter.prependOnceListener('checkProcessingAdditive', function () {
											if (!validator.isEmpty(processingAdditive)) {
												checkUniqeValue(apikey, "SUBSTANCE_ID|" + processingAdditive, 'SUBSTANCE', function (resProcessingAdditive) {
													if (resProcessingAdditive.err_code > 0) {
														myEmitter.emit('checkCollectionCollector');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Processing additive id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCollectionCollector');
											}
										})

										myEmitter.prependOnceListener('checkContainerAdditiveAdditiveReference', function () {
											if (!validator.isEmpty(containerAdditiveAdditiveReference)) {
												checkUniqeValue(apikey, "SUBSTANCE_ID|" + containerAdditiveAdditiveReference, 'SUBSTANCE', function (resContainerAdditiveAdditiveReference) {
													if (resContainerAdditiveAdditiveReference.err_code > 0) {
														myEmitter.emit('checkProcessingAdditive');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Container additive additive reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcessingAdditive');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkContainerAdditiveAdditiveReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContainerAdditiveAdditiveReference');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePatient', function () {
											if (!validator.isEmpty(noteAuthorAuthorReferencePatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorAuthorReferencePatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
													if (resNoteAuthorAuthorReferencePatient.err_code > 0) {
														myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
											}
										})

										if (!validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)) {
											checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
												if (resNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
													myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Note author author reference related person id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
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
			var specimenId = req.params.specimen_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof specimenId !== 'undefined'){
				if(validator.isEmpty(specimenId)){
					err_code = 2;
					err_msg = "Specimen id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen id is required";
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
												checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenID){
													if(resSpecimenID.err_code > 0){
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
																							"specimen_id": specimenId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Specimen.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Specimen Id not found"});		
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
		specimenProcessing: function addSpecimenProcessing(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var specimenId = req.params.specimen_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof specimenId !== 'undefined'){
				if(validator.isEmpty(specimenId)){
					err_code = 2;
					err_msg = "Specimen id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen id is required";
			}

			if(typeof req.body.description !== 'undefined'){
				var processingDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(processingDescription)){
					processingDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'processing description' in json Specimenrequest.";
			}

			if(typeof req.body.procedure !== 'undefined'){
				var processingProcedure =  req.body.procedure.trim().toUpperCase();
				if(validator.isEmpty(processingProcedure)){
					processingProcedure = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'processing procedure' in json Specimenrequest.";
			}

			if(typeof req.body.time.timeDateTime !== 'undefined'){
				var processingTimeTimeDateTime =  req.body.time.timeDateTime;
				if(validator.isEmpty(processingTimeTimeDateTime)){
					processingTimeTimeDateTime = "";
				}else{
					if(!regex.test(processingTimeTimeDateTime)){
						err_code = 2;
						err_msg = "Sequence processing time time date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'processing time time date time' in json Specimenrequest.";
			}

			if (typeof req.body.time.timePeriod !== 'undefined') {
			  var processingTimeTimePeriod = req.body.time.timePeriod;
 				if(validator.isEmpty(processingTimeTimePeriod)) {
				  var processingTimeTimePeriodStart = "";
				  var processingTimeTimePeriodEnd = "";
				} else {
				  if (processingTimeTimePeriod.indexOf("to") > 0) {
				    arrProcessingTimeTimePeriod = processingTimeTimePeriod.split("to");
				    var processingTimeTimePeriodStart = arrProcessingTimeTimePeriod[0];
				    var processingTimeTimePeriodEnd = arrProcessingTimeTimePeriod[1];
				    if (!regex.test(processingTimeTimePeriodStart) && !regex.test(processingTimeTimePeriodEnd)) {
				      err_code = 2;
				      err_msg = "Sequence processing time time period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Sequence processing time time period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'processing time time period' in json Specimenrequest.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSpecimenID', function(){
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenID){
								if(resSpecimenID.err_code > 0){
									var unicId = uniqid.time();
									var specimenProcessingId = 'spr' + unicId;
									//SpecimenProcessing
									dataSpecimenProcessing = {
										"processing_id" : specimenProcessingId,
										"desciption" : processingDescription,
										"procedur" : processingProcedure,
										"time_date_time" : processingTimeTimeDateTime,
										"time_period_start" : processingTimeTimePeriodStart,
										"time_period_end" : processingTimeTimePeriodEnd,
										"specimen_id" : specimenId
									}
									ApiFHIR.post('specimenProcessing', {"apikey": apikey}, {body: dataSpecimenProcessing, json: true}, function(error, response, body){
										specimenProcessing = body;
										if(specimenProcessing.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Specimen Processing has been add in this Specimen.", "data": specimenProcessing.data});
										}else{
											res.json(specimenProcessing);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Specimen Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(processingProcedure)) {
							checkCode(apikey, processingProcedure, 'SPECIMEN_PROCESSING_PROCEDURE', function (resProcessingProcedureCode) {
								if (resProcessingProcedureCode.err_code > 0) {
									myEmitter.emit('checkSpecimenID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Processing procedure code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSpecimenID');
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
		specimenContainer: function addSpecimenContainer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var specimenId = req.params.specimen_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof specimenId !== 'undefined'){
				if(validator.isEmpty(specimenId)){
					err_code = 2;
					err_msg = "Specimen id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen id is required";
			}
			
			if(typeof req.body.description !== 'undefined'){
				var containerDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(containerDescription)){
					containerDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container description' in json Specimenrequest.";
			}

			if(typeof req.body.type !== 'undefined'){
				var containerType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(containerType)){
					containerType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container type' in json Specimenrequest.";
			}

			if(typeof req.body.capacity !== 'undefined'){
				var containerCapacity =  req.body.capacity.trim().toLowerCase();
				if(validator.isEmpty(containerCapacity)){
					containerCapacity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container capacity' in json Specimenrequest.";
			}

			if(typeof req.body.specimenQuantity !== 'undefined'){
				var containerSpecimenQuantity =  req.body.specimenQuantity.trim().toLowerCase();
				if(validator.isEmpty(containerSpecimenQuantity)){
					containerSpecimenQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container specimen quantity' in json Specimenrequest.";
			}

			if(typeof req.body.additive.additiveCodeableConcept !== 'undefined'){
				var containerAdditiveAdditiveCodeableConcept =  req.body.additive.additiveCodeableConcept.trim().toUpperCase();
				if(validator.isEmpty(containerAdditiveAdditiveCodeableConcept)){
					containerAdditiveAdditiveCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container additive additive codeable concept' in json Specimenrequest.";
			}

			if(typeof req.body.additive.additiveReference !== 'undefined'){
				var containerAdditiveAdditiveReference =  req.body.additive.additiveReference.trim().toLowerCase();
				if(validator.isEmpty(containerAdditiveAdditiveReference)){
					containerAdditiveAdditiveReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'container additive additive reference' in json Specimenrequest.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSpecimenID', function(){
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenID){
								if(resSpecimenID.err_code > 0){
									var unicId = uniqid.time();
									var specimenContainerId = 'sco' + unicId;
									//SpecimenContainer
									dataSpecimenContainer = {
										"container_id" : specimenContainerId,
										"desciption" : containerDescription,
										"type" : containerType,
										"capacity" : containerCapacity,
										"specimen_quantity" : containerSpecimenQuantity,
										"additive_codeable_concept" : containerAdditiveAdditiveCodeableConcept,
										"additive_reference" : containerAdditiveAdditiveReference,
										"specimen_id" : specimenId
									}
									ApiFHIR.post('specimenContainer', {"apikey": apikey}, {body: dataSpecimenContainer, json: true}, function(error, response, body){
										specimenContainer = body;
										if(specimenContainer.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Specimen Container has been add in this Specimen.", "data": specimenContainer.data});
										}else{
											res.json(specimenContainer);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Specimen Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkContainerType', function () {
							if (!validator.isEmpty(containerType)) {
								checkCode(apikey, containerType, 'SPECIMEN_CONTAINER_TYPE', function (resContainerTypeCode) {
									if (resContainerTypeCode.err_code > 0) {
										myEmitter.emit('checkSpecimenID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Container type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSpecimenID');
							}
						})

						myEmitter.prependOnceListener('checkContainerAdditiveAdditiveCodeableConcept', function () {
							if (!validator.isEmpty(containerAdditiveAdditiveCodeableConcept)) {
								checkCode(apikey, containerAdditiveAdditiveCodeableConcept, 'PRESERVATIVE', function (resContainerAdditiveAdditiveCodeableConceptCode) {
									if (resContainerAdditiveAdditiveCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkContainerType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Container additive additive codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkContainerType');
							}
						})
						
						if (!validator.isEmpty(containerAdditiveAdditiveReference)) {
							checkUniqeValue(apikey, "_ID|" + containerAdditiveAdditiveReference, '', function (resContainerAdditiveAdditiveReference) {
								if (resContainerAdditiveAdditiveReference.err_code > 0) {
									myEmitter.emit('checkContainerAdditiveAdditiveCodeableConcept');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Container additive additive reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkContainerAdditiveAdditiveCodeableConcept');
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
		specimenNote: function addSpecimenNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var specimenId = req.params.specimen_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof specimenId !== 'undefined'){
				if(validator.isEmpty(specimenId)){
					err_code = 2;
					err_msg = "Specimen id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Specimenrequest.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Specimenrequest.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Specimenrequest.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Specimenrequest.";
			}

			if(typeof req.body.time !== 'undefined'){
				var noteTime =  req.body.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Sequence note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Specimenrequest.";
			}

			if(typeof req.body.string !== 'undefined'){
				var noteText =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note.Text' in json Specimenrequest.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSpecimenID', function(){
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenID){
								if(resSpecimenID.err_code > 0){
									var unicId = uniqid.time();
									var specimenNoteId = 'ann' + unicId;
									//SpecimenNote
									dataSpecimenNote = {
										"id": specimenNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteText,
										"specimen_id" : specimenId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataSpecimenNote, json: true}, function(error, response, body){
										specimenNote = body;
										if(specimenNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Specimen Note has been add in this Specimen.", "data": specimenNote.data});
										}else{
											res.json(specimenNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Specimen Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkSpecimenID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSpecimenID');
							}
						})

						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePatient', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorAuthorReferencePatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
									if (resNoteAuthorAuthorReferencePatient.err_code > 0) {
										myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
							}
						})

						if (!validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)) {
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
								if (resNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
									myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Note author author reference related person id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
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
		specimen : function putSpecimen(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var specimenId = req.params.specimen_id;

      var err_code = 0;
      var err_msg = "";
      var dataSpecimen = {};

			if(typeof specimenId !== 'undefined'){
				if(validator.isEmpty(specimenId)){
					err_code = 2;
					err_msg = "Specimen id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen id is required";
			}

			/*
			var accession_identifier  = req.body.accession_identifier;
			var status  = req.body.status;
			var type  = req.body.type;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_device  = req.body.subject_device;
			var subject_substance  = req.subject_substance;
			var received_time  = req.body.received_time;
			var collector  = req.body.collector;
			var collected_date_time  = req.body.collected_date_time;
			var collected_period_start  = req.body.collected_period_start;
			var collected_period_end  = req.body.collected_period_end;
			var quantity_low  = req.body.quantity_low;
			var quantity_high  = req.body.quantity_high;
			var method  = req.body.method;
			var body_site  = req.body.body_site;
			var parent = req.body.parent;
			*/
			
			if(typeof req.body.accessionIdentifier !== 'undefined' && req.body.accessionIdentifier !== ""){
				var accessionIdentifier =  req.body.accessionIdentifier.trim().toLowerCase();
				if(validator.isEmpty(accessionIdentifier)){
					dataSequence.accession_identifier = "";
				}else{
					dataSequence.accession_identifier = accessionIdentifier;
				}
			}else{
			  accessionIdentifier = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataSequence.status = "";
				}else{
					dataSequence.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var type =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(type)){
					dataSequence.type = "";
				}else{
					dataSequence.type = type;
				}
			}else{
			  type = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataSequence.subject_patient = "";
				}else{
					dataSequence.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataSequence.subject_group = "";
				}else{
					dataSequence.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.subject.device !== 'undefined' && req.body.subject.device !== ""){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					dataSequence.subject_device = "";
				}else{
					dataSequence.subject_device = subjectDevice;
				}
			}else{
			  subjectDevice = "";
			}

			if(typeof req.body.subject.substance !== 'undefined' && req.body.subject.substance !== ""){
				var subjectSubstance =  req.body.subject.substance.trim().toLowerCase();
				if(validator.isEmpty(subjectSubstance)){
					dataSequence.subject_substance = "";
				}else{
					dataSequence.subject_substance = subjectSubstance;
				}
			}else{
			  subjectSubstance = "";
			}

			if(typeof req.body.receivedTime !== 'undefined' && req.body.receivedTime !== ""){
				var receivedTime =  req.body.receivedTime;
				if(validator.isEmpty(receivedTime)){
					err_code = 2;
					err_msg = "Specimen received time is required.";
				}else{
					if(!regex.test(receivedTime)){
						err_code = 2;
						err_msg = "Specimen received time invalid date format.";	
					}else{
						dataSequence.received_time = receivedTime;
					}
				}
			}else{
			  receivedTime = "";
			}

			if(typeof req.body.parent !== 'undefined' && req.body.parent !== ""){
				var parent =  req.body.parent.trim().toLowerCase();
				if(validator.isEmpty(parent)){
					dataSequence.parent = "";
				}else{
					dataSequence.parent = parent;
				}
			}else{
			  parent = "";
			}

			/*if(typeof req.body.request !== 'undefined' && req.body.request !== ""){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					dataSequence.request = "";
				}else{
					dataSequence.request = request;
				}
			}else{
			  request = "";
			}*/
			
			if(typeof req.body.collection.collector !== 'undefined' && req.body.collection.collector !== ""){
				var collectionCollector =  req.body.collection.collector.trim().toLowerCase();
				if(validator.isEmpty(collectionCollector)){
					dataSequence.collector = "";
				}else{
					dataSequence.collector = collectionCollector;
				}
			}else{
			  collectionCollector = "";
			}

			if(typeof req.body.collection.collected.collectedDateTime !== 'undefined' && req.body.collection.collected.collectedDateTime !== ""){
				var collectionCollectedCollectedDateTime =  req.body.collection.collected.collectedDateTime;
				if(validator.isEmpty(collectionCollectedCollectedDateTime)){
					err_code = 2;
					err_msg = "Specimen collection collected collected date time is required.";
				}else{
					if(!regex.test(collectionCollectedCollectedDateTime)){
						err_code = 2;
						err_msg = "Specimen collection collected collected date time invalid date format.";	
					}else{
						dataSequence.collected_date_time = collectionCollectedCollectedDateTime;
					}
				}
			}else{
			  collectionCollectedCollectedDateTime = "";
			}

			if (typeof req.body.collection.collected.collectedPeriod !== 'undefined' && req.body.collection.collected.collectedPeriod !== "") {
			  var collectionCollectedCollectedPeriod = req.body.collection.collected.collectedPeriod;
			  if (collectionCollectedCollectedPeriod.indexOf("to") > 0) {
			    arrCollectionCollectedCollectedPeriod = collectionCollectedCollectedPeriod.split("to");
			    dataSequence.collected_period_start = arrCollectionCollectedCollectedPeriod[0];
			    dataSequence.collected_period_end = arrCollectionCollectedCollectedPeriod[1];
			    if (!regex.test(collectionCollectedCollectedPeriodStart) && !regex.test(collectionCollectedCollectedPeriodEnd)) {
			      err_code = 2;
			      err_msg = "Specimen collection collected collected period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "Specimen collection collected collected period invalid date format.";
				}
			} else {
			  collectionCollectedCollectedPeriod = "";
			}

			if (typeof req.body.collection.quantity !== 'undefined' && req.body.collection.quantity !== "") {
			  var collectionQuantity = req.body.collection.quantity;
			  if (collectionQuantity.indexOf("to") > 0) {
			    arrCollectionQuantity = collectionQuantity.split("to");
			    dataSequence.quantity_low = arrCollectionQuantity[0];
			    dataSequence.quantity_high = arrCollectionQuantity[1];
				} else {
			  	err_code = 2;
			  	err_msg = "Specimen collection quantity invalid range format.";
				}
			} else {
			  collectionQuantity = "";
			}

			if(typeof req.body.collection.method !== 'undefined' && req.body.collection.method !== ""){
				var collectionMethod =  req.body.collection.method.trim().toLowerCase();
				if(validator.isEmpty(collectionMethod)){
					dataSequence.method = "";
				}else{
					dataSequence.method = collectionMethod;
				}
			}else{
			  collectionMethod = "";
			}

			if(typeof req.body.collection.bodySite !== 'undefined' && req.body.collection.bodySite !== ""){
				var collectionBodySite =  req.body.collection.bodySite.trim().toLowerCase();
				if(validator.isEmpty(collectionBodySite)){
					dataSequence.body_site = "";
				}else{
					dataSequence.body_site = collectionBodySite;
				}
			}else{
			  collectionBodySite = "";
			}

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkSpecimenId', function(){
						checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenId){
							if(resSpecimenId.err_code > 0){
								ApiFHIR.put('specimen', {"apikey": apikey, "_id": specimenId}, {body: dataSpecimen, json: true}, function(error, response, body){
									specimen = body;
									if(specimen.err_code > 0){
										res.json(specimen);	
									}else{
										res.json({"err_code": 0, "err_msg": "Specimen has been update.", "data": [{"_id": specimenId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Specimen Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'SPECIMEN_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkSpecimenId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSpecimenId');
						}
					})

					myEmitter.prependOnceListener('checkType', function () {
						if (!validator.isEmpty(type)) {
							checkCode(apikey, type, 'SPECIMEN_TYPE', function (resTypeCode) {
								if (resTypeCode.err_code > 0) {
									myEmitter.emit('checkStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStatus');
						}
					})

					myEmitter.prependOnceListener('checkCollectionMethod', function () {
						if (!validator.isEmpty(collectionMethod)) {
							checkCode(apikey, collectionMethod, 'SPECIMEN_COLLECTION_METHOD', function (resCollectionMethodCode) {
								if (resCollectionMethodCode.err_code > 0) {
									myEmitter.emit('checkType');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Collection method code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkType');
						}
					})

					myEmitter.prependOnceListener('checkCollectionBodySite', function () {
						if (!validator.isEmpty(collectionBodySite)) {
							checkCode(apikey, collectionBodySite, 'BODY_SITE', function (resCollectionBodySiteCode) {
								if (resCollectionBodySiteCode.err_code > 0) {
									myEmitter.emit('checkCollectionMethod');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Collection body site code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCollectionMethod');
						}
					})
					
					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "_ID|" + subjectPatient, '', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkCollectionBodySite');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCollectionBodySite');
						}
					})

					myEmitter.prependOnceListener('checkSubjectGroup', function () {
						if (!validator.isEmpty(subjectGroup)) {
							checkUniqeValue(apikey, "_ID|" + subjectGroup, '', function (resSubjectGroup) {
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

					myEmitter.prependOnceListener('checkSubjectDevice', function () {
						if (!validator.isEmpty(subjectDevice)) {
							checkUniqeValue(apikey, "_ID|" + subjectDevice, '', function (resSubjectDevice) {
								if (resSubjectDevice.err_code > 0) {
									myEmitter.emit('checkSubjectGroup');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject device id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubjectGroup');
						}
					})

					myEmitter.prependOnceListener('checkSubjectSubstance', function () {
						if (!validator.isEmpty(subjectSubstance)) {
							checkUniqeValue(apikey, "_ID|" + subjectSubstance, '', function (resSubjectSubstance) {
								if (resSubjectSubstance.err_code > 0) {
									myEmitter.emit('checkSubjectDevice');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject substance id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubjectDevice');
						}
					})

					if (!validator.isEmpty(parent)) {
						checkUniqeValue(apikey, "_ID|" + parent, '', function (resParent) {
							if (resParent.err_code > 0) {
								myEmitter.emit('checkSubjectSubstance');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Parent id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkSubjectSubstance');
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
			var specimenId = req.params.specimen_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof specimenId !== 'undefined'){
				if(validator.isEmpty(specimenId)){
					err_code = 2;
					err_msg = "Specimen id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen id is required";
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
						myEmitter.prependOnceListener('checkSpecimenID', function(){
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenID){
								if(resSpecimenID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "SPECIMEN_ID|"+specimenId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Specimen.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Specimen Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkSpecimenID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkSpecimenID');				
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
		specimenProcessing: function updateSpecimenProcessing(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var specimenId = req.params.specimen_id;
			var specimenProcessingId = req.params.specimen_processing_id;

			var err_code = 0;
			var err_msg = "";
			var dataSpecimen = {};
			//input check 
			if(typeof specimenId !== 'undefined'){
				if(validator.isEmpty(specimenId)){
					err_code = 2;
					err_msg = "Specimen id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen id is required";
			}

			if(typeof specimenProcessingId !== 'undefined'){
				if(validator.isEmpty(specimenProcessingId)){
					err_code = 2;
					err_msg = "Specimen Processing id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen Processing id is required";
			}
			
			/*
			var desciption  = req.body.desciption;
			var procedur  = req.body.procedur;
			var time_date_time  = req.body.time_date_time;
			var time_period_start  = req.body.time_period_start;
			var time_period_end  = req.body.time_period_end;
			*/
						
			

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var processingDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(processingDescription)){
					dataSequence.description = "";
				}else{
					dataSequence.description = processingDescription;
				}
			}else{
			  processingDescription = "";
			}

			if(typeof req.body.procedure !== 'undefined' && req.body.procedure !== ""){
				var processingProcedure =  req.body.procedure.trim().toUpperCase();
				if(validator.isEmpty(processingProcedure)){
					dataSequence.procedure = "";
				}else{
					dataSequence.procedure = processingProcedure;
				}
			}else{
			  processingProcedure = "";
			}

			/*if(typeof req.body.additive !== 'undefined' && req.body.additive !== ""){
				var processingAdditive =  req.body.additive.trim().toLowerCase();
				if(validator.isEmpty(processingAdditive)){
					dataSequence.additive = "";
				}else{
					dataSequence.additive = processingAdditive;
				}
			}else{
			  processingAdditive = "";
			}*/

			if(typeof req.body.time.timeDateTime !== 'undefined' && req.body.time.timeDateTime !== ""){
				var processingTimeTimeDateTime =  req.body.time.timeDateTime;
				if(validator.isEmpty(processingTimeTimeDateTime)){
					err_code = 2;
					err_msg = "Specimen processing time time date time is required.";
				}else{
					if(!regex.test(processingTimeTimeDateTime)){
						err_code = 2;
						err_msg = "Specimen processing time time date time invalid date format.";	
					}else{
						dataSequence.time_date_time = processingTimeTimeDateTime;
					}
				}
			}else{
			  processingTimeTimeDateTime = "";
			}

			if (typeof req.body.time.timePeriod !== 'undefined' && req.body.time.timePeriod !== "") {
			  var processingTimeTimePeriod = req.body.time.timePeriod;
			  if (processingTimeTimePeriod.indexOf("to") > 0) {
			    arrProcessingTimeTimePeriod = processingTimeTimePeriod.split("to");
			    dataSequence.time_period_start = arrProcessingTimeTimePeriod[0];
			    dataSequence.time_period_end = arrProcessingTimeTimePeriod[1];
			    if (!regex.test(processingTimeTimePeriodStart) && !regex.test(processingTimeTimePeriodEnd)) {
			      err_code = 2;
			      err_msg = "Specimen processing time time period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "Specimen processing time time period invalid date format.";
				}
			} else {
			  processingTimeTimePeriod = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSpecimenID', function(){
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenId){
								if(resSpecimenId.err_code > 0){
									checkUniqeValue(apikey, "PROCESSING_ID|" + specimenProcessingId, 'SPECIMEN_PROCESSING', function(resSpecimenProcessingID){
										if(resSpecimenProcessingID.err_code > 0){
											ApiFHIR.put('specimenProcessing', {"apikey": apikey, "_id": specimenProcessingId, "dr": "SPECIMEN_ID|"+specimenId}, {body: dataSpecimen, json: true}, function(error, response, body){
												specimenProcessing = body;
												if(specimenProcessing.err_code > 0){
													res.json(specimenProcessing);	
												}else{
													res.json({"err_code": 0, "err_msg": "Specimen Processing has been update in this Specimen.", "data": specimenProcessing.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Specimen Processing Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Specimen Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(processingProcedure)) {
							checkCode(apikey, processingProcedure, 'SPECIMEN_PROCESSING_PROCEDURE', function (resProcessingProcedureCode) {
								if (resProcessingProcedureCode.err_code > 0) {
									myEmitter.emit('checkSpecimenID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Processing procedure code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSpecimenID');
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
		},
		specimenContainer: function updateSpecimenContainer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var specimenId = req.params.specimen_id;
			var specimenContainerId = req.params.specimen_container_id;

			var err_code = 0;
			var err_msg = "";
			var dataSpecimen = {};
			//input check 
			if(typeof specimenId !== 'undefined'){
				if(validator.isEmpty(specimenId)){
					err_code = 2;
					err_msg = "Specimen id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen id is required";
			}

			if(typeof specimenContainerId !== 'undefined'){
				if(validator.isEmpty(specimenContainerId)){
					err_code = 2;
					err_msg = "Specimen Container id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen Prediction id is required";
			}
			
			/*
			var desciption  = req.body.desciption;
			var type  = req.body.type;
			var capacity  = req.body.capacity;
			var specimen_quantity  = req.body.specimen_quantity;
			var additive_codeable_concept  = req.body.additive_codeable_concept;
			var additive_reference  = req.body.additive_reference;
			*/

			/*if(typeof req.body.container.identifier.use !== 'undefined' && req.body.container.identifier.use !== ""){
				var containerIdentifierUse =  req.body.container.identifier.use.trim().toLowerCase();
				if(validator.isEmpty(containerIdentifierUse)){
					dataSequence.use = "";
				}else{
					dataSequence.use = containerIdentifierUse;
				}
			}else{
			  containerIdentifierUse = "";
			}

			if(typeof req.body.container.identifier.type !== 'undefined' && req.body.container.identifier.type !== ""){
				var containerIdentifierType =  req.body.container.identifier.type.trim().toUpperCase();
				if(validator.isEmpty(containerIdentifierType)){
					dataSequence.type = "";
				}else{
					dataSequence.type = containerIdentifierType;
				}
			}else{
			  containerIdentifierType = "";
			}

			if(typeof req.body.container.identifier.value !== 'undefined' && req.body.container.identifier.value !== ""){
				var containerIdentifierValue =  req.body.container.identifier.value.trim().toLowerCase();
				if(validator.isEmpty(containerIdentifierValue)){
					dataSequence.value = "";
				}else{
					dataSequence.value = containerIdentifierValue;
				}
			}else{
			  containerIdentifierValue = "";
			}

			if (typeof req.body.container.identifier.period !== 'undefined' && req.body.container.identifier.period !== "") {
			  var containerIdentifierPeriod = req.body.container.identifier.period;
			  if (containerIdentifierPeriod.indexOf("to") > 0) {
			    arrContainerIdentifierPeriod = containerIdentifierPeriod.split("to");
			    dataSequence.period_start = arrContainerIdentifierPeriod[0];
			    dataSequence.period_end = arrContainerIdentifierPeriod[1];
			    if (!regex.test(containerIdentifierPeriodStart) && !regex.test(containerIdentifierPeriodEnd)) {
			      err_code = 2;
			      err_msg = "Specimen container identifier period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "Specimen container identifier period invalid date format.";
				}
			} else {
			  containerIdentifierPeriod = "";
			}*/

			if(typeof req.body.container.description !== 'undefined' && req.body.container.description !== ""){
				var containerDescription =  req.body.container.description.trim().toLowerCase();
				if(validator.isEmpty(containerDescription)){
					dataSequence.description = "";
				}else{
					dataSequence.description = containerDescription;
				}
			}else{
			  containerDescription = "";
			}

			if(typeof req.body.container.type !== 'undefined' && req.body.container.type !== ""){
				var containerType =  req.body.container.type.trim().toLowerCase();
				if(validator.isEmpty(containerType)){
					dataSequence.type = "";
				}else{
					dataSequence.type = containerType;
				}
			}else{
			  containerType = "";
			}

			if(typeof req.body.container.capacity !== 'undefined' && req.body.container.capacity !== ""){
				var containerCapacity =  req.body.container.capacity.trim().toLowerCase();
				if(validator.isEmpty(containerCapacity)){
					dataSequence.capacity = "";
				}else{
					dataSequence.capacity = containerCapacity;
				}
			}else{
			  containerCapacity = "";
			}

			if(typeof req.body.container.specimenQuantity !== 'undefined' && req.body.container.specimenQuantity !== ""){
				var containerSpecimenQuantity =  req.body.container.specimenQuantity.trim().toLowerCase();
				if(validator.isEmpty(containerSpecimenQuantity)){
					dataSequence.specimen_quantity = "";
				}else{
					dataSequence.specimen_quantity = containerSpecimenQuantity;
				}
			}else{
			  containerSpecimenQuantity = "";
			}

			if(typeof req.body.container.additive.additiveCodeableConcept !== 'undefined' && req.body.container.additive.additiveCodeableConcept !== ""){
				var containerAdditiveAdditiveCodeableConcept =  req.body.container.additive.additiveCodeableConcept.trim().toUpperCase();
				if(validator.isEmpty(containerAdditiveAdditiveCodeableConcept)){
					dataSequence.additive_codeable_concept = "";
				}else{
					dataSequence.additive_codeable_concept = containerAdditiveAdditiveCodeableConcept;
				}
			}else{
			  containerAdditiveAdditiveCodeableConcept = "";
			}

			if(typeof req.body.container.additive.additiveReference !== 'undefined' && req.body.container.additive.additiveReference !== ""){
				var containerAdditiveAdditiveReference =  req.body.container.additive.additiveReference.trim().toLowerCase();
				if(validator.isEmpty(containerAdditiveAdditiveReference)){
					dataSequence.additive_reference = "";
				}else{
					dataSequence.additive_reference = containerAdditiveAdditiveReference;
				}
			}else{
			  containerAdditiveAdditiveReference = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSpecimenID', function(){
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenId){
								if(resSpecimenId.err_code > 0){
									checkUniqeValue(apikey, "CONTAINER_ID|" + specimenContainerId, 'SPECIMEN_CONTAINER', function(resSpecimenContainerID){
										if(resSpecimenContainerID.err_code > 0){
											ApiFHIR.put('specimenContainer', {"apikey": apikey, "_id": specimenContainerId, "dr": "SPECIMEN_ID|"+specimenId}, {body: dataSpecimen, json: true}, function(error, response, body){
												specimenContainer = body;
												if(specimenContainer.err_code > 0){
													res.json(specimenContainer);	
												}else{
													res.json({"err_code": 0, "err_msg": "Specimen Container has been update in this Specimen.", "data": specimenContainer.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Specimen Container Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Specimen Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkContainerType', function () {
							if (!validator.isEmpty(containerType)) {
								checkCode(apikey, containerType, 'SPECIMEN_CONTAINER_TYPE', function (resContainerTypeCode) {
									if (resContainerTypeCode.err_code > 0) {
										myEmitter.emit('checkSpecimenID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Container type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSpecimenID');
							}
						})

						myEmitter.prependOnceListener('checkContainerAdditiveAdditiveCodeableConcept', function () {
							if (!validator.isEmpty(containerAdditiveAdditiveCodeableConcept)) {
								checkCode(apikey, containerAdditiveAdditiveCodeableConcept, 'PRESERVATIVE', function (resContainerAdditiveAdditiveCodeableConceptCode) {
									if (resContainerAdditiveAdditiveCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkContainerType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Container additive additive codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkContainerType');
							}
						})
						
						if (!validator.isEmpty(containerAdditiveAdditiveReference)) {
							checkUniqeValue(apikey, "_ID|" + containerAdditiveAdditiveReference, '', function (resContainerAdditiveAdditiveReference) {
								if (resContainerAdditiveAdditiveReference.err_code > 0) {
									myEmitter.emit('checkContainerAdditiveAdditiveCodeableConcept');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Container additive additive reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkContainerAdditiveAdditiveCodeableConcept');
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
		},
		specimenNote: function updateSpecimenNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var specimenId = req.params.specimen_id;
			var specimenNoteId = req.params.specimen_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataSpecimen = {};
			//input check 
			if(typeof specimenId !== 'undefined'){
				if(validator.isEmpty(specimenId)){
					err_code = 2;
					err_msg = "Specimen id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen id is required";
			}

			if(typeof specimenNoteId !== 'undefined'){
				if(validator.isEmpty(specimenNoteId)){
					err_code = 2;
					err_msg = "Specimen Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Specimen Note id is required";
			}
			
			/*
			"id": specimenNoteId,
			"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
			"author_ref_patient": noteAuthorAuthorReferencePatient,
			"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
			"author_string": noteAuthorAuthorString,
			"time": noteTime,
			"text": noteText,
			*/
			
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined' && req.body.author.authorReference.practitioner !== ""){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					dataSequence.author_ref_practitioner = "";
				}else{
					dataSequence.author_ref_practitioner = noteAuthorAuthorReferencePractitioner;
				}
			}else{
			  noteAuthorAuthorReferencePractitioner = "";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined' && req.body.author.authorReference.patient !== ""){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					dataSequence.author_ref_patient = "";
				}else{
					dataSequence.author_ref_patient = noteAuthorAuthorReferencePatient;
				}
			}else{
			  noteAuthorAuthorReferencePatient = "";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined' && req.body.author.authorReference.relatedPerson !== ""){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					dataSequence.author_ref_related_person = "";
				}else{
					dataSequence.author_ref_related_person = noteAuthorAuthorReferenceRelatedPerson;
				}
			}else{
			  noteAuthorAuthorReferenceRelatedPerson = "";
			}

			if(typeof req.body.author.authorString !== 'undefined' && req.body.author.authorString !== ""){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					dataSequence.author_string = "";
				}else{
					dataSequence.author_string = noteAuthorAuthorString;
				}
			}else{
			  noteAuthorAuthorString = "";
			}

			if(typeof req.body.time !== 'undefined' && req.body.time !== ""){
				var noteTime =  req.body.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "Specimen note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Specimen note time invalid date format.";	
					}else{
						dataSequence.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.string !== 'undefined' && req.body.string !== ""){
				var noteText =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					dataSequence.text = "";
				}else{
					dataSequence.text = noteText;
				}
			}else{
			  noteText = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSpecimenID', function(){
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimenId, 'SPECIMEN', function(resSpecimenId){
								if(resSpecimenId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + specimenNoteId, 'NOTE', function(resSpecimenNoteID){
										if(resSpecimenNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": specimenNoteId, "dr": "SPECIMEN_ID|"+specimenId}, {body: dataSpecimen, json: true}, function(error, response, body){
												specimenNote = body;
												if(specimenNote.err_code > 0){
													res.json(specimenNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Specimen Note has been update in this Specimen.", "data": specimenNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Specimen Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Specimen Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkSpecimenID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSpecimenID');
							}
						})

						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePatient', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorAuthorReferencePatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
									if (resNoteAuthorAuthorReferencePatient.err_code > 0) {
										myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
							}
						})

						if (!validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)) {
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
								if (resNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
									myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Note author author reference related person id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
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