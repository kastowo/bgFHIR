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
		sequence : function getSequence(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var sequenceId = req.query._id;
			var chromosome = req.query.chromosome;
			var coordinate = req.query.coordinate;
			var end = req.query.end;
			var identifier = req.query.identifier;
			var patient = req.query.patient;
			var start = req.query.start;
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
			
			if(typeof sequenceId !== 'undefined'){
				if(!validator.isEmpty(sequenceId)){
					qString._id = sequenceId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Sequence Id is required."});
				}
			}
			
			if(typeof chromosome !== 'undefined'){
				if(!validator.isEmpty(chromosome)){
					qString.chromosome = chromosome; 
				}else{
					res.json({"err_code": 1, "err_msg": "Chromosome is empty."});
				}
			}

			if(typeof coordinate !== 'undefined'){
				if(!validator.isEmpty(coordinate)){
					if(isInt(coordinate)){
						qString.coordinate = coordinate;
					}else{
						res.json({"err_code": 1, "err_msg": "Coordinate is not number."});
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Coordinate is empty."});
				}
			}

			if(typeof end !== 'undefined'){
				if(!validator.isEmpty(end)){
					if(isInt(end)){
						qString.end = end;
					}else{
						res.json({"err_code": 1, "err_msg": "End is not number."});
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "End is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}

			if(typeof start !== 'undefined'){
				if(!validator.isEmpty(start)){
					if(isInt(start)){
						qString.start = start;
					}else{
						res.json({"err_code": 1, "err_msg": "Start is not number."});
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Start is empty."});
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
				"Sequence" : {
					"location": "%(apikey)s/Sequence",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Sequence', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var sequence = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(sequence.err_code == 0){
								//cek jumdata dulu
								if(sequence.data.length > 0){
									newSequence = [];
									for(i=0; i < sequence.data.length; i++){
										myEmitter.once("getIdentifier", function(sequence, index, newSequence, countSequence){
											/*console.log(sequence);*/
											//get identifier
											qString = {};
											qString.sequence_id = sequence.id;
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
													var objectSequence = {};
													objectSequence.resourceType = sequence.resourceType;
													objectSequence.id = sequence.id;
													objectSequence.identifier = identifier.data;
													objectSequence.type = sequence.type;
													objectSequence.coordinateSystem = sequence.coordinateSystem;
													objectSequence.code = sequence.code;
													objectSequence.patient = sequence.patient;
													objectSequence.specimen = sequence.specimen;
													objectSequence.device = sequence.device;
													objectSequence.performer = sequence.performer;
													objectSequence.quantity = sequence.quantity;
													objectSequence.referenceSeq = sequence.referenceSeq;
													objectSequence.observedSeq = sequence.observedSeq;
													objectSequence.readCoverage = sequence.readCoverage;
												
													newSequence[index] = objectSequence;

													myEmitter.once('getSequenceRepository', function(sequence, index, newSequence, countSequence){
														qString = {};
														qString.sequence_id = sequence.id;
														seedPhoenixFHIR.path.GET = {
															"SequenceRepository" : {
																"location": "%(apikey)s/SequenceRepository",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('SequenceRepository', {"apikey": apikey}, {}, function(error, response, body){
															sequenceRepository = JSON.parse(body);
															if(sequenceRepository.err_code == 0){
																var objectSequence = {};
																objectSequence.resourceType = sequence.resourceType;
																objectSequence.id = sequence.id;
																objectSequence.identifier = sequence.identifier;
																objectSequence.type = sequence.type;
																objectSequence.coordinateSystem = sequence.coordinateSystem;
																objectSequence.code = sequence.code;
																objectSequence.patient = sequence.patient;
																objectSequence.specimen = sequence.specimen;
																objectSequence.device = sequence.device;
																objectSequence.performer = sequence.performer;
																objectSequence.quantity = sequence.quantity;
																objectSequence.referenceSeq = sequence.referenceSeq;
																objectSequence.observedSeq = sequence.observedSeq;
																objectSequence.readCoverage = sequence.readCoverage;
																objectSequence.repository = sequenceRepository.data;
																
																newSequence[index] = objectSequence;
																	myEmitter.once('getSequenceVariant', function(sequence, index, newSequence, countSequence){
																		qString = {};
																		qString.sequence_id = sequence.id;
																		seedPhoenixFHIR.path.GET = {
																			"SequenceVariant" : {
																				"location": "%(apikey)s/SequenceVariant",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																		ApiFHIR.get('SequenceVariant', {"apikey": apikey}, {}, function(error, response, body){
																			sequenceVariant = JSON.parse(body);
																			if(sequenceVariant.err_code == 0){
																				var objectSequence = {};
																				objectSequence.resourceType = sequence.resourceType;
																				objectSequence.id = sequence.id;
																				objectSequence.identifier = sequence.identifier;
																				objectSequence.type = sequence.type;
																				objectSequence.coordinateSystem = sequence.coordinateSystem;
																				objectSequence.code = sequence.code;
																				objectSequence.patient = sequence.patient;
																				objectSequence.specimen = sequence.specimen;
																				objectSequence.device = sequence.device;
																				objectSequence.performer = sequence.performer;
																				objectSequence.quantity = sequence.quantity;
																				objectSequence.referenceSeq = sequence.referenceSeq;
																				objectSequence.variant = sequenceVariant.data;
																				objectSequence.observedSeq = sequence.observedSeq;
																				objectSequence.readCoverage = sequence.readCoverage;
																				objectSequence.repository = sequence.repository;

																				newSequence[index] = objectSequence;
																				
																				myEmitter.once('getSequenceQuality', function(sequence, index, newSequence, countSequence){
																					qString = {};
																					qString.sequence_id = sequence.id;
																					seedPhoenixFHIR.path.GET = {
																						"SequenceQuality" : {
																							"location": "%(apikey)s/SequenceQuality",
																							"query": qString
																						}
																					}

																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																					ApiFHIR.get('SequenceQuality', {"apikey": apikey}, {}, function(error, response, body){
																						sequenceQuality = JSON.parse(body);
																						if(sequenceQuality.err_code == 0){
																							var objectSequence = {};
																							objectSequence.resourceType = sequence.resourceType;
																							objectSequence.id = sequence.id;
																							objectSequence.identifier = sequence.identifier;
																							objectSequence.type = sequence.type;
																							objectSequence.coordinateSystem = sequence.coordinateSystem;
																							objectSequence.code = sequence.code;
																							objectSequence.patient = sequence.patient;
																							objectSequence.specimen = sequence.specimen;
																							objectSequence.device = sequence.device;
																							objectSequence.performer = sequence.performer;
																							objectSequence.quantity = sequence.quantity;
																							objectSequence.referenceSeq = sequence.referenceSeq;
																							objectSequence.variant = sequence.variant;
																							objectSequence.observedSeq = sequence.observedSeq;
																							objectSequence.quality = sequenceQuality.data;
																							objectSequence.readCoverage = sequence.readCoverage;
																							objectSequence.repository = sequence.repository;

																							newSequence[index] = objectSequence;
																							myEmitter.once('getSequencePointer', function(sequence, index, newSequence, countSequence){
																								qString = {};
																								qString.sequence_id = sequence.id;
																								seedPhoenixFHIR.path.GET = {
																									"SequencePointer" : {
																										"location": "%(apikey)s/SequencePointer",
																										"query": qString
																									}
																								}

																								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																								ApiFHIR.get('SequencePointer', {"apikey": apikey}, {}, function(error, response, body){
																									sequencePointer = JSON.parse(body);
																									if(sequencePointer.err_code == 0){
																										var objectSequence = {};
																										objectSequence.resourceType = sequence.resourceType;
																										objectSequence.id = sequence.id;
																										objectSequence.identifier = sequence.identifier;
																										objectSequence.type = sequence.type;
																										objectSequence.coordinateSystem = sequence.coordinateSystem;
																										objectSequence.code = sequence.code;
																										objectSequence.patient = sequence.patient;
																										objectSequence.specimen = sequence.specimen;
																										objectSequence.device = sequence.device;
																										objectSequence.performer = sequence.performer;
																										objectSequence.quantity = sequence.quantity;
																										objectSequence.referenceSeq = sequence.referenceSeq;
																										objectSequence.variant = sequence.variant;
																										objectSequence.observedSeq = sequence.observedSeq;
																										objectSequence.quality = sequence.quality;
																										objectSequence.readCoverage = sequence.readCoverage;
																										objectSequence.repository = sequence.repository;
																										objectSequence.pointer = sequencePointer.data;

																										newSequence[index] = objectSequence;
																										if(index == countSequence -1 ){
																											res.json({"err_code": 0, "data":newSequence});
																										}
																									}else{
																										res.json(sequencePointer);			
																									}
																								})
																							});
																							myEmitter.emit('getSequencePointer', objectSequence, index, newSequence, countSequence);
																						}else{
																							res.json(sequenceQuality);			
																						}
																					})
																				});
																				myEmitter.emit('getSequenceQuality', objectSequence, index, newSequence, countSequence);
																			}else{
																				res.json(sequenceVariant);			
																			}
																		})
																	});
																	myEmitter.emit('getSequenceVariant', objectSequence, index, newSequence, countSequence);
															}else{
																res.json(sequenceRepository);			
															}
														})
													})
													myEmitter.emit('getSequenceRepository', objectSequence, index, newSequence, countSequence);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", sequence.data[i], i, newSequence, sequence.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Sequence is empty."});	
								}
							}else{
								res.json(sequence);
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
					var sequenceId = req.params.sequence_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceID){
								if(resSequenceID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.sequence_id = sequenceId;
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
						  			qString.sequence_id = sequenceId;
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
									res.json({"err_code": 501, "err_msg": "Sequence Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		sequenceRepository: function getSequenceRepository(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var sequenceId = req.params.sequence_id;
			var sequenceRepositoryId = req.params.sequence_repository_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequence){
						if(resSequence.err_code > 0){
							if(typeof sequenceRepositoryId !== 'undefined' && !validator.isEmpty(sequenceRepositoryId)){
								checkUniqeValue(apikey, "REPOSITORY_ID|" + sequenceRepositoryId, 'SEQUENCE_REPOSITORY', function(resSequenceRepositoryID){
									if(resSequenceRepositoryID.err_code > 0){
										//get sequenceRepository
										qString = {};
										qString.sequence_id = sequenceId;
										qString._id = sequenceRepositoryId;
										seedPhoenixFHIR.path.GET = {
											"SequenceRepository" : {
												"location": "%(apikey)s/SequenceRepository",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('SequenceRepository', {"apikey": apikey}, {}, function(error, response, body){
											sequenceRepository = JSON.parse(body);
											if(sequenceRepository.err_code == 0){
												res.json({"err_code": 0, "data":sequenceRepository.data});	
											}else{
												res.json(sequenceRepository);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Sequence Repository Id not found"});		
									}
								})
							}else{
								//get sequenceRepository
								qString = {};
								qString.sequence_id = sequenceId;
								seedPhoenixFHIR.path.GET = {
									"SequenceRepository" : {
										"location": "%(apikey)s/SequenceRepository",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('SequenceRepository', {"apikey": apikey}, {}, function(error, response, body){
									sequenceRepository = JSON.parse(body);
									if(sequenceRepository.err_code == 0){
										res.json({"err_code": 0, "data":sequenceRepository.data});	
									}else{
										res.json(sequenceRepository);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Sequence Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		sequenceVariant: function getSequenceVariant(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var sequenceId = req.params.sequence_id;
			var sequenceVariantId = req.params.sequence_variant_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequence){
						if(resSequence.err_code > 0){
							if(typeof sequenceVariantId !== 'undefined' && !validator.isEmpty(sequenceVariantId)){
								checkUniqeValue(apikey, "VARIANT_ID|" + sequenceVariantId, 'SEQUENCE_VARIANT', function(resSequenceVariantID){
									if(resSequenceVariantID.err_code > 0){
										//get sequenceVariant
										qString = {};
										qString.sequence_id = sequenceId;
										qString._id = sequenceVariantId;
										seedPhoenixFHIR.path.GET = {
											"SequenceVariant" : {
												"location": "%(apikey)s/SequenceVariant",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('SequenceVariant', {"apikey": apikey}, {}, function(error, response, body){
											sequenceVariant = JSON.parse(body);
											if(sequenceVariant.err_code == 0){
												res.json({"err_code": 0, "data":sequenceVariant.data});	
											}else{
												res.json(sequenceVariant);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Sequence Variant Id not found"});		
									}
								})
							}else{
								//get sequenceVariant
								qString = {};
								qString.sequence_id = sequenceId;
								seedPhoenixFHIR.path.GET = {
									"SequenceVariant" : {
										"location": "%(apikey)s/SequenceVariant",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('SequenceVariant', {"apikey": apikey}, {}, function(error, response, body){
									sequenceVariant = JSON.parse(body);
									if(sequenceVariant.err_code == 0){
										res.json({"err_code": 0, "data":sequenceVariant.data});	
									}else{
										res.json(sequenceVariant);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Sequence Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		sequenceQuality: function getSequenceQuality(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var sequenceId = req.params.sequence_id;
			var sequenceQualityId = req.params.sequence_quality_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequence){
						if(resSequence.err_code > 0){
							if(typeof sequenceQualityId !== 'undefined' && !validator.isEmpty(sequenceQualityId)){
								checkUniqeValue(apikey, "QUALITY_ID|" + sequenceQualityId, 'SEQUENCE_QUALITY', function(resSequenceQualityID){
									if(resSequenceQualityID.err_code > 0){
										//get sequenceQuality
										qString = {};
										qString.sequence_id = sequenceId;
										qString._id = sequenceQualityId;
										seedPhoenixFHIR.path.GET = {
											"SequenceQuality" : {
												"location": "%(apikey)s/SequenceQuality",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('SequenceQuality', {"apikey": apikey}, {}, function(error, response, body){
											sequenceQuality = JSON.parse(body);
											if(sequenceQuality.err_code == 0){
												res.json({"err_code": 0, "data":sequenceQuality.data});	
											}else{
												res.json(sequenceQuality);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Sequence Quality Id not found"});		
									}
								})
							}else{
								//get sequenceQuality
								qString = {};
								qString.sequence_id = sequenceId;
								seedPhoenixFHIR.path.GET = {
									"SequenceQuality" : {
										"location": "%(apikey)s/SequenceQuality",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('SequenceQuality', {"apikey": apikey}, {}, function(error, response, body){
									sequenceQuality = JSON.parse(body);
									if(sequenceQuality.err_code == 0){
										res.json({"err_code": 0, "data":sequenceQuality.data});	
									}else{
										res.json(sequenceQuality);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Sequence Id not found"});		
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
		sequence : function addSequence(req, res){
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
type|type||
coordinateSystem|coordinateSystem|integer|nn
patient|patient||
specimen|specimen||
device|device||
performer|performer||
quantity.value|quantityValue|integer|
quantity.comparator|quantityComparator||
quantity.unit|quantityUnit||
quantity.system|quantitySystem||
quantity.code|quantityCode||
referenceSeq.chromosome|referenceSeqChromosome||
referenceSeq.genomeBuild|referenceSeqGenomeBuild||
referenceSeq.referenceSeqId|referenceSeqReferenceSeqId||
referenceSeq.referenceSeqPointer|referenceSeqReferenceSeqPointer||
referenceSeq.referenceSeqString|referenceSeqReferenceSeqString||
referenceSeq.strand|referenceSeqStrand|integer|
referenceSeq.windowStart|referenceSeqWindowStart|integer|
referenceSeq.windowEnd|referenceSeqWindowEnd|integer|
variant.start|variantStart|integer|
variant.end|variantEnd|integer|
variant.observedAllele|variantObservedAllele||
variant.referenceAllele|variantReferenceAllele||
variant.cigar|variantCigar||
variant.variantPointer|variantVariantPointer||
observedSeq|observedSeq||
quality.type|qualityType||
quality.standardSequence|qualityStandardSequence||
quality.start|qualityStart|integer|
quality.end|qualityEnd|integer|
quality.score.value|qualityScoreValue|integer|
quality.score.comparator|qualityScoreComparator||
quality.score.unit|qualityScoreUnit||
quality.score.system|qualityScoreSystem||
quality.score.code|qualityScoreCode||
quality.method|qualityMethod||
quality.truthTP|qualityTruthTP|integer|
quality.queryTP|qualityQueryTP|integer|
quality.truthFN|qualityTruthFN|integer|
quality.queryFP|qualityQueryFP|integer|
quality.gtFP|qualityGtFP|integer|
quality.precision|qualityPrecision|integer|
quality.recall|qualityRecall|integer|
quality.fScore|qualityFScore|integer|
readCoverage|readCoverage|integer|
repository.type|repositoryType||
repository.url|repositoryUrl||
repository.name|repositoryName||
repository.datasetId|repositoryDatasetId||
repository.variantsetId|repositoryVariantsetId||
repository.readsetId|repositoryReadsetId||
pointer|pointer|||
*/
			if(typeof req.body.type !== 'undefined'){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					type = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Sequence request.";
			}

			if(typeof req.body.coordinateSystem !== 'undefined'){
				var coordinateSystem =  req.body.coordinateSystem;
				if(validator.isEmpty(coordinateSystem)){
					err_code = 2;
					err_msg = "Sequence coordinate system is required.";
				}else{
					if(!validator.isInt(coordinateSystem)){
						err_code = 2;
						err_msg = "Sequence coordinate system is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'coordinate system' in json Sequence request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Sequence request.";
			}

			if(typeof req.body.specimen !== 'undefined'){
				var specimen =  req.body.specimen.trim().toLowerCase();
				if(validator.isEmpty(specimen)){
					specimen = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'specimen' in json Sequence request.";
			}

			if(typeof req.body.device !== 'undefined'){
				var device =  req.body.device.trim().toLowerCase();
				if(validator.isEmpty(device)){
					device = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'device' in json Sequence request.";
			}

			if(typeof req.body.performer !== 'undefined'){
				var performer =  req.body.performer.trim().toLowerCase();
				if(validator.isEmpty(performer)){
					performer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer' in json Sequence request.";
			}

			if(typeof req.body.quantity.value !== 'undefined'){
				var quantityValue =  req.body.quantity.value;
				if(validator.isEmpty(quantityValue)){
					quantityValue = "";
				}else{
					if(!validator.isInt(quantityValue)){
						err_code = 2;
						err_msg = "Sequence quantity value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quantity value' in json Sequence request.";
			}

			if(typeof req.body.quantity.comparator !== 'undefined'){
				var quantityComparator =  req.body.quantity.comparator.trim().toLowerCase();
				if(validator.isEmpty(quantityComparator)){
					quantityComparator = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quantity comparator' in json Sequence request.";
			}

			if(typeof req.body.quantity.unit !== 'undefined'){
				var quantityUnit =  req.body.quantity.unit.trim().toLowerCase();
				if(validator.isEmpty(quantityUnit)){
					quantityUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quantity unit' in json Sequence request.";
			}

			if(typeof req.body.quantity.system !== 'undefined'){
				var quantitySystem =  req.body.quantity.system.trim().toLowerCase();
				if(validator.isEmpty(quantitySystem)){
					quantitySystem = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quantity system' in json Sequence request.";
			}

			if(typeof req.body.quantity.code !== 'undefined'){
				var quantityCode =  req.body.quantity.code.trim().toLowerCase();
				if(validator.isEmpty(quantityCode)){
					quantityCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quantity code' in json Sequence request.";
			}

			if(typeof req.body.referenceSeq.chromosome !== 'undefined'){
				var referenceSeqChromosome =  req.body.referenceSeq.chromosome.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqChromosome)){
					referenceSeqChromosome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference seq chromosome' in json Sequence request.";
			}

			if(typeof req.body.referenceSeq.genomeBuild !== 'undefined'){
				var referenceSeqGenomeBuild =  req.body.referenceSeq.genomeBuild.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqGenomeBuild)){
					referenceSeqGenomeBuild = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference seq genome build' in json Sequence request.";
			}

			if(typeof req.body.referenceSeq.referenceSeqId !== 'undefined'){
				var referenceSeqReferenceSeqId =  req.body.referenceSeq.referenceSeqId.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqReferenceSeqId)){
					referenceSeqReferenceSeqId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference seq reference seq id' in json Sequence request.";
			}

			if(typeof req.body.referenceSeq.referenceSeqPointer !== 'undefined'){
				var referenceSeqReferenceSeqPointer =  req.body.referenceSeq.referenceSeqPointer.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqReferenceSeqPointer)){
					referenceSeqReferenceSeqPointer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference seq reference seq pointer' in json Sequence request.";
			}

			if(typeof req.body.referenceSeq.referenceSeqString !== 'undefined'){
				var referenceSeqReferenceSeqString =  req.body.referenceSeq.referenceSeqString.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqReferenceSeqString)){
					referenceSeqReferenceSeqString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference seq reference seq string' in json Sequence request.";
			}

			if(typeof req.body.referenceSeq.strand !== 'undefined'){
				var referenceSeqStrand =  req.body.referenceSeq.strand;
				if(validator.isEmpty(referenceSeqStrand)){
					referenceSeqStrand = "";
				}else{
					if(!validator.isInt(referenceSeqStrand)){
						err_code = 2;
						err_msg = "Sequence reference seq strand is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference seq strand' in json Sequence request.";
			}

			if(typeof req.body.referenceSeq.windowStart !== 'undefined'){
				var referenceSeqWindowStart =  req.body.referenceSeq.windowStart;
				if(validator.isEmpty(referenceSeqWindowStart)){
					referenceSeqWindowStart = "";
				}else{
					if(!validator.isInt(referenceSeqWindowStart)){
						err_code = 2;
						err_msg = "Sequence reference seq window start is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference seq window start' in json Sequence request.";
			}

			if(typeof req.body.referenceSeq.windowEnd !== 'undefined'){
				var referenceSeqWindowEnd =  req.body.referenceSeq.windowEnd;
				if(validator.isEmpty(referenceSeqWindowEnd)){
					referenceSeqWindowEnd = "";
				}else{
					if(!validator.isInt(referenceSeqWindowEnd)){
						err_code = 2;
						err_msg = "Sequence reference seq window end is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference seq window end' in json Sequence request.";
			}

			if(typeof req.body.variant.start !== 'undefined'){
				var variantStart =  req.body.variant.start;
				if(validator.isEmpty(variantStart)){
					variantStart = "";
				}else{
					if(!validator.isInt(variantStart)){
						err_code = 2;
						err_msg = "Sequence variant start is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant start' in json Sequence request.";
			}

			if(typeof req.body.variant.end !== 'undefined'){
				var variantEnd =  req.body.variant.end;
				if(validator.isEmpty(variantEnd)){
					variantEnd = "";
				}else{
					if(!validator.isInt(variantEnd)){
						err_code = 2;
						err_msg = "Sequence variant end is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant end' in json Sequence request.";
			}

			if(typeof req.body.variant.observedAllele !== 'undefined'){
				var variantObservedAllele =  req.body.variant.observedAllele.trim().toLowerCase();
				if(validator.isEmpty(variantObservedAllele)){
					variantObservedAllele = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant observed allele' in json Sequence request.";
			}

			if(typeof req.body.variant.referenceAllele !== 'undefined'){
				var variantReferenceAllele =  req.body.variant.referenceAllele.trim().toLowerCase();
				if(validator.isEmpty(variantReferenceAllele)){
					variantReferenceAllele = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant reference allele' in json Sequence request.";
			}

			if(typeof req.body.variant.cigar !== 'undefined'){
				var variantCigar =  req.body.variant.cigar.trim().toLowerCase();
				if(validator.isEmpty(variantCigar)){
					variantCigar = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant cigar' in json Sequence request.";
			}

			if(typeof req.body.variant.variantPointer !== 'undefined'){
				var variantVariantPointer =  req.body.variant.variantPointer.trim().toLowerCase();
				if(validator.isEmpty(variantVariantPointer)){
					variantVariantPointer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant variant pointer' in json Sequence request.";
			}

			if(typeof req.body.observedSeq !== 'undefined'){
				var observedSeq =  req.body.observedSeq.trim().toLowerCase();
				if(validator.isEmpty(observedSeq)){
					observedSeq = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'observed seq' in json Sequence request.";
			}

			if(typeof req.body.quality.type !== 'undefined'){
				var qualityType =  req.body.quality.type.trim().toLowerCase();
				if(validator.isEmpty(qualityType)){
					qualityType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality type' in json Sequence request.";
			}

			if(typeof req.body.quality.standardSequence !== 'undefined'){
				var qualityStandardSequence =  req.body.quality.standardSequence.trim().toLowerCase();
				if(validator.isEmpty(qualityStandardSequence)){
					qualityStandardSequence = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality standard sequence' in json Sequence request.";
			}

			if(typeof req.body.quality.start !== 'undefined'){
				var qualityStart =  req.body.quality.start;
				if(validator.isEmpty(qualityStart)){
					qualityStart = "";
				}else{
					if(!validator.isInt(qualityStart)){
						err_code = 2;
						err_msg = "Sequence quality start is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality start' in json Sequence request.";
			}

			if(typeof req.body.quality.end !== 'undefined'){
				var qualityEnd =  req.body.quality.end;
				if(validator.isEmpty(qualityEnd)){
					qualityEnd = "";
				}else{
					if(!validator.isInt(qualityEnd)){
						err_code = 2;
						err_msg = "Sequence quality end is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality end' in json Sequence request.";
			}

			if(typeof req.body.quality.score.value !== 'undefined'){
				var qualityScoreValue =  req.body.quality.score.value;
				if(validator.isEmpty(qualityScoreValue)){
					qualityScoreValue = "";
				}else{
					if(!validator.isInt(qualityScoreValue)){
						err_code = 2;
						err_msg = "Sequence quality score value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score value' in json Sequence request.";
			}

			if(typeof req.body.quality.score.comparator !== 'undefined'){
				var qualityScoreComparator =  req.body.quality.score.comparator.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreComparator)){
					qualityScoreComparator = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score comparator' in json Sequence request.";
			}

			if(typeof req.body.quality.score.unit !== 'undefined'){
				var qualityScoreUnit =  req.body.quality.score.unit.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreUnit)){
					qualityScoreUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score unit' in json Sequence request.";
			}

			if(typeof req.body.quality.score.system !== 'undefined'){
				var qualityScoreSystem =  req.body.quality.score.system.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreSystem)){
					qualityScoreSystem = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score system' in json Sequence request.";
			}

			if(typeof req.body.quality.score.code !== 'undefined'){
				var qualityScoreCode =  req.body.quality.score.code.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreCode)){
					qualityScoreCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score code' in json Sequence request.";
			}

			if(typeof req.body.quality.method !== 'undefined'){
				var qualityMethod =  req.body.quality.method.trim().toLowerCase();
				if(validator.isEmpty(qualityMethod)){
					qualityMethod = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality method' in json Sequence request.";
			}

			if(typeof req.body.quality.truthTP !== 'undefined'){
				var qualityTruthTP =  req.body.quality.truthTP;
				if(validator.isEmpty(qualityTruthTP)){
					qualityTruthTP = "";
				}else{
					if(!validator.isInt(qualityTruthTP)){
						err_code = 2;
						err_msg = "Sequence quality truth t p is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality truth t p' in json Sequence request.";
			}

			if(typeof req.body.quality.queryTP !== 'undefined'){
				var qualityQueryTP =  req.body.quality.queryTP;
				if(validator.isEmpty(qualityQueryTP)){
					qualityQueryTP = "";
				}else{
					if(!validator.isInt(qualityQueryTP)){
						err_code = 2;
						err_msg = "Sequence quality query t p is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality query t p' in json Sequence request.";
			}

			if(typeof req.body.quality.truthFN !== 'undefined'){
				var qualityTruthFN =  req.body.quality.truthFN;
				if(validator.isEmpty(qualityTruthFN)){
					qualityTruthFN = "";
				}else{
					if(!validator.isInt(qualityTruthFN)){
						err_code = 2;
						err_msg = "Sequence quality truth f n is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality truth f n' in json Sequence request.";
			}

			if(typeof req.body.quality.queryFP !== 'undefined'){
				var qualityQueryFP =  req.body.quality.queryFP;
				if(validator.isEmpty(qualityQueryFP)){
					qualityQueryFP = "";
				}else{
					if(!validator.isInt(qualityQueryFP)){
						err_code = 2;
						err_msg = "Sequence quality query f p is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality query f p' in json Sequence request.";
			}

			if(typeof req.body.quality.gtFP !== 'undefined'){
				var qualityGtFP =  req.body.quality.gtFP;
				if(validator.isEmpty(qualityGtFP)){
					qualityGtFP = "";
				}else{
					if(!validator.isInt(qualityGtFP)){
						err_code = 2;
						err_msg = "Sequence quality gt f p is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality gt f p' in json Sequence request.";
			}

			if(typeof req.body.quality.precision !== 'undefined'){
				var qualityPrecision =  req.body.quality.precision;
				if(validator.isEmpty(qualityPrecision)){
					qualityPrecision = "";
				}else{
					if(!validator.isInt(qualityPrecision)){
						err_code = 2;
						err_msg = "Sequence quality precision is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality precision' in json Sequence request.";
			}

			if(typeof req.body.quality.recall !== 'undefined'){
				var qualityRecall =  req.body.quality.recall;
				if(validator.isEmpty(qualityRecall)){
					qualityRecall = "";
				}else{
					if(!validator.isInt(qualityRecall)){
						err_code = 2;
						err_msg = "Sequence quality recall is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality recall' in json Sequence request.";
			}

			if(typeof req.body.quality.fScore !== 'undefined'){
				var qualityFScore =  req.body.quality.fScore;
				if(validator.isEmpty(qualityFScore)){
					qualityFScore = "";
				}else{
					if(!validator.isInt(qualityFScore)){
						err_code = 2;
						err_msg = "Sequence quality f score is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality f score' in json Sequence request.";
			}

			if(typeof req.body.readCoverage !== 'undefined'){
				var readCoverage =  req.body.readCoverage;
				if(validator.isEmpty(readCoverage)){
					readCoverage = "";
				}else{
					if(!validator.isInt(readCoverage)){
						err_code = 2;
						err_msg = "Sequence read coverage is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'read coverage' in json Sequence request.";
			}

			if(typeof req.body.repository.type !== 'undefined'){
				var repositoryType =  req.body.repository.type.trim().toLowerCase();
				if(validator.isEmpty(repositoryType)){
					repositoryType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository type' in json Sequence request.";
			}

			if(typeof req.body.repository.url !== 'undefined'){
				var repositoryUrl =  req.body.repository.url.trim().toLowerCase();
				if(validator.isEmpty(repositoryUrl)){
					repositoryUrl = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository url' in json Sequence request.";
			}

			if(typeof req.body.repository.name !== 'undefined'){
				var repositoryName =  req.body.repository.name.trim().toLowerCase();
				if(validator.isEmpty(repositoryName)){
					repositoryName = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository name' in json Sequence request.";
			}

			if(typeof req.body.repository.datasetId !== 'undefined'){
				var repositoryDatasetId =  req.body.repository.datasetId.trim().toLowerCase();
				if(validator.isEmpty(repositoryDatasetId)){
					repositoryDatasetId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository dataset id' in json Sequence request.";
			}

			if(typeof req.body.repository.variantsetId !== 'undefined'){
				var repositoryVariantsetId =  req.body.repository.variantsetId.trim().toLowerCase();
				if(validator.isEmpty(repositoryVariantsetId)){
					repositoryVariantsetId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository variantset id' in json Sequence request.";
			}

			if(typeof req.body.repository.readsetId !== 'undefined'){
				var repositoryReadsetId =  req.body.repository.readsetId.trim().toLowerCase();
				if(validator.isEmpty(repositoryReadsetId)){
					repositoryReadsetId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository readset id' in json Sequence request.";
			}

			if(typeof req.body.pointer !== 'undefined'){
				var pointer =  req.body.pointer.trim().toLowerCase();
				if(validator.isEmpty(pointer)){
					pointer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'pointer' in json Sequence request.";
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
														var sequenceId = 'seq' + unicId;
														var sequenceRepositoryId = 'sre' + unicId;
														var sequenceVariantId = 'sva' + unicId;
														var sequenceQualityId = 'squ' + unicId;
														var sequenceQuantityId = 'qus' + unicId;
														var QualityQuantityId = 'quq' + unicId;

/*
pointer|pointer|||
*/														
														dataSequence = {
															"sequence_id" : sequenceId,
															"type" : type,
															"coordinate_system" : coordinateSystem,
															"patient" : patient,
															"specimen" : specimen,
															"device" : device,
															"performer" : performer,
															"quantity" : sequenceQuantityId,
															"reference_seq_chromosome" : referenceSeqChromosome,
															"reference_seq_genome_bui" : referenceSeqGenomeBuild,
															"reference_seq_reference_seq_id" : referenceSeqReferenceSeqId,
															"reference_seq_pointer" : referenceSeqReferenceSeqPointer,
															"reference_seq_string" : referenceSeqReferenceSeqString,
															"reference_seq_strand" : referenceSeqStrand,
															"reference_seq_window_start" : referenceSeqWindowStart,
															"reference_seq_window_end" : referenceSeqWindowEnd,
															"observed_seq" : observedSeq,
															"read_coverage" : readCoverage
														}
														console.log(dataSequence);
														ApiFHIR.post('sequence', {"apikey": apikey}, {body: dataSequence, json: true}, function(error, response, body){
															sequence = body;
															if(sequence.err_code > 0){
																res.json(sequence);	
																console.log("ok");
															}
														});
														
														var dataSequenceQuantity = {
															"quantity_id" : sequenceQuantityId,
															"valuee" : quantityValue,
															"comparator" : quantityComparator,
															"unit" : quantityUnit,
															"system" : quantitySystem,
															"code" : quantityCode,
															"sequence_id" : sequenceId
														}
														//method, endpoint, params, options, callback
														ApiFHIR.post('quantity', {"apikey": apikey}, {body: dataSequenceQuantity, json:true}, function(error, response, body){
															sequenceQuantity = body;
															if(sequenceQuantity.err_code > 0){
																res.json(sequenceQuantity);	
																console.log("ok");
															}
														});	
														
														//identifier
														var identifierSystem = identifierId;
														/*dataIdentifier = {
																							"id": identifierId,
																							"use": identifierUseCode,
																							"type": identifierTypeCode,
																							"system": identifierSystem,
																							"value": identifierValue,
																							"period_start": identifierPeriodStart,
																							"period_end": identifierPeriodEnd,
																							"sequence_id": sequenceId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
										*/
														//SequenceRepository
														dataSequenceRepository = {
															"repository_id" : sequenceRepositoryId,
															"type" : repositoryType,
															"url" : repositoryUrl,
															"name" : repositoryName,
															"dataset_id" : repositoryDatasetId,
															"varianset_id" : repositoryVariantsetId,
															"readset_id" : repositoryReadsetId,
															"sequence_id" : sequenceId
														};
														ApiFHIR.post('sequenceRepository', {"apikey": apikey}, {body: dataSequenceRepository, json: true}, function(error, response, body){
															sequenceRepository = body;
															if(sequenceRepository.err_code > 0){
																res.json(sequenceRepository);	
																console.log("ok");
															}
														});
														
														//SequenceImage
														dataSequenceVariant = {										
															"variant_id" : sequenceVariantId,
															"start" : variantStart,
															"end" : variantEnd,
															"observed_allele" : variantObservedAllele,
															"reference_allele" : variantReferenceAllele,
															"cigar" : variantCigar,
															"variant_pointer" : variantVariantPointer,
															"sequence_id" : sequenceId
														};
														ApiFHIR.post('sequenceVariant', {"apikey": apikey}, {body: dataSequenceVariant, json: true}, function(error, response, body){
															sequenceImage = body;
															if(sequenceImage.err_code > 0){
																res.json(sequenceImage);	
																console.log("ok");
															}
														});
														
														var dataSequenceQuality = {
															"quality_id" : sequenceId,
															"type" : qualityType,
															"standard_sequence" : qualityStandardSequence,
															"start" : qualityStart,
															"end" : qualityEnd,
															"score" : QualityQuantityId,
															"method" : qualityMethod,
															"truth_tp" : qualityTruthTP,
															"query_tp" : qualityQueryTP,
															"truth_fn" : qualityTruthFN,
															"query_fp" : qualityQueryFP,
															"gt_fp" : qualityGtFP,
															"precision" : qualityPrecision,
															"recall" : qualityRecall,
															"f_score" : qualityFScore,
															"sequence_id" : sequenceId
														}

														//method, endpoint, params, options, callback
														ApiFHIR.post('sequenceQuality', {"apikey": apikey}, {body: dataSequenceQuality, json:true}, function(error, response, body){
															sequenceQuality = body;
															if(sequenceQuality.err_code > 0){
																res.json(sequenceQuality);	
																console.log("ok");
															}
														});
														
														var dataQualityQuantity = {
															"quantity_id" : QualityQuantityId,
															"valuee" : qualityScoreValue,
															"comparator" : qualityScoreComparator,
															"unit" : qualityScoreUnit,
															"system" : qualityScoreSystem,
															"code" : qualityScoreCode,
															"sequence_id" : sequenceId
														}

														//method, endpoint, params, options, callback
														ApiFHIR.post('quantity', {"apikey": apikey}, {body: dataQualityQuantity, json:true}, function(error, response, body){
															qualityQuantity = body;
															if(qualityQuantity.err_code > 0){
																res.json(qualityQuantity);	
																console.log("ok");
															}
														});
														
														if(pointer !== ""){
															dataPointer = {
																"_id" : pointer,
																"pointer" : sequenceId
															}
															ApiFHIR.put('sequence', {"apikey": apikey, "_id": pointer}, {body: dataPointer, json: true}, function(error, response, body){
																returnPointer = body;
																if(returnPointer.err_code > 0){
																	res.json(returnPointer);	
																	console.log("add reference pointer : " + pointer);
																}
															});
														}	

														
														
														res.json({"err_code": 0, "err_msg": "Sequence has been add.", "data": [{"_id": sequenceId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
type|sequence-type
referenceSeqChromosome|chromosome-human
referenceSeqReferenceSeqId|sequence-referenceSeq
qualityType|quality-type
repositoryType|repository-type
quantityComparator|quantity-comparator
qualityScoreComparator|quantity-comparator
										*/
										
										myEmitter.prependOnceListener('checkType', function () {
											if (!validator.isEmpty(type)) {
												checkCode(apikey, type, 'SEQUENCE_TYPE', function (resTypeCode) {
													if (resTypeCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkReferenceSeqChromosome', function () {
											if (!validator.isEmpty(referenceSeqChromosome)) {
												checkCode(apikey, referenceSeqChromosome, 'CHROMOSOME_HUMAN', function (resReferenceSeqChromosomeCode) {
													if (resReferenceSeqChromosomeCode.err_code > 0) {
														myEmitter.emit('checkType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reference seq chromosome code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkType');
											}
										})

										myEmitter.prependOnceListener('checkReferenceSeqReferenceSeqId', function () {
											if (!validator.isEmpty(referenceSeqReferenceSeqId)) {
												checkCode(apikey, referenceSeqReferenceSeqId, 'SEQUENCE_REFERENCESEQ', function (resReferenceSeqReferenceSeqIdCode) {
													if (resReferenceSeqReferenceSeqIdCode.err_code > 0) {
														myEmitter.emit('checkReferenceSeqChromosome');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reference seq reference seq id code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReferenceSeqChromosome');
											}
										})

										myEmitter.prependOnceListener('checkQualityType', function () {
											if (!validator.isEmpty(qualityType)) {
												checkCode(apikey, qualityType, 'QUALITY_TYPE', function (resQualityTypeCode) {
													if (resQualityTypeCode.err_code > 0) {
														myEmitter.emit('checkReferenceSeqReferenceSeqId');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Quality type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReferenceSeqReferenceSeqId');
											}
										})

										myEmitter.prependOnceListener('checkRepositoryType', function () {
											if (!validator.isEmpty(repositoryType)) {
												checkCode(apikey, repositoryType, 'REPOSITORY_TYPE', function (resRepositoryTypeCode) {
													if (resRepositoryTypeCode.err_code > 0) {
														myEmitter.emit('checkQualityType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Repository type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkQualityType');
											}
										})

										myEmitter.prependOnceListener('checkQuantityComparator', function () {
											if (!validator.isEmpty(quantityComparator)) {
												checkCode(apikey, quantityComparator, 'QUANTITY_COMPARATOR', function (resQuantityComparatorCode) {
													if (resQuantityComparatorCode.err_code > 0) {
														myEmitter.emit('checkRepositoryType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Quantity comparator code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRepositoryType');
											}
										})

										myEmitter.prependOnceListener('checkQualityScoreComparator', function () {
											if (!validator.isEmpty(qualityScoreComparator)) {
												checkCode(apikey, qualityScoreComparator, 'QUANTITY_COMPARATOR', function (resQualityScoreComparatorCode) {
													if (resQualityScoreComparatorCode.err_code > 0) {
														myEmitter.emit('checkQuantityComparator');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Quality score comparator code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkQuantityComparator');
											}
										})
										
										/*
patient|patient
specimen|specimen
device|device
performer|organization
referenceSeqReferenceSeqPointer|sequence
variantVariantPointer|Observation
pointer|Sequence
										*/
										
										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkQualityScoreComparator');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkQualityScoreComparator');
											}
										})

										myEmitter.prependOnceListener('checkSpecimen', function () {
											if (!validator.isEmpty(specimen)) {
												checkUniqeValue(apikey, "SPECIMEN_ID|" + specimen, 'SPECIMEN', function (resSpecimen) {
													if (resSpecimen.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Specimen id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkDevice', function () {
											if (!validator.isEmpty(device)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + device, 'DEVICE', function (resDevice) {
													if (resDevice.err_code > 0) {
														myEmitter.emit('checkSpecimen');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSpecimen');
											}
										})

										myEmitter.prependOnceListener('checkPerformer', function () {
											if (!validator.isEmpty(performer)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + performer, 'ORGANIZATION', function (resPerformer) {
													if (resPerformer.err_code > 0) {
														myEmitter.emit('checkDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDevice');
											}
										})

										myEmitter.prependOnceListener('checkReferenceSeqReferenceSeqPointer', function () {
											if (!validator.isEmpty(referenceSeqReferenceSeqPointer)) {
												checkUniqeValue(apikey, "SEQUENCE_ID|" + referenceSeqReferenceSeqPointer, 'SEQUENCE', function (resReferenceSeqReferenceSeqPointer) {
													if (resReferenceSeqReferenceSeqPointer.err_code > 0) {
														myEmitter.emit('checkPerformer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reference seq reference seq pointer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformer');
											}
										})

										myEmitter.prependOnceListener('checkVariantVariantPointer', function () {
											if (!validator.isEmpty(variantVariantPointer)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + variantVariantPointer, 'OBSERVATION', function (resVariantVariantPointer) {
													if (resVariantVariantPointer.err_code > 0) {
														myEmitter.emit('checkReferenceSeqReferenceSeqPointer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Variant variant pointer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReferenceSeqReferenceSeqPointer');
											}
										})

										if (!validator.isEmpty(pointer)) {
											checkUniqeValue(apikey, "SEQUENCE_ID|" + pointer, 'SEQUENCES', function (resPointer) {
												if (resPointer.err_code > 0) {
													myEmitter.emit('checkVariantVariantPointer');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Pointer id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkVariantVariantPointer');
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
			var sequenceId = req.params.sequence_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof sequenceId !== 'undefined'){
				if(validator.isEmpty(sequenceId)){
					err_code = 2;
					err_msg = "Sequence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence id is required";
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
												checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceID){
													if(resSequenceID.err_code > 0){
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
																							"sequence_id": sequenceId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Sequence.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Sequence Id not found"});		
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
		sequenceRepository: function addSequenceRepository(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var sequenceId = req.params.sequence_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof sequenceId !== 'undefined'){
				if(validator.isEmpty(sequenceId)){
					err_code = 2;
					err_msg = "Sequence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence id is required";
			}
			
			if(typeof req.body.type !== 'undefined'){
				var repositoryType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(repositoryType)){
					repositoryType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository type' in json Sequence request.";
			}

			if(typeof req.body.url !== 'undefined'){
				var repositoryUrl =  req.body.url.trim().toLowerCase();
				if(validator.isEmpty(repositoryUrl)){
					repositoryUrl = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository url' in json Sequence request.";
			}

			if(typeof req.body.name !== 'undefined'){
				var repositoryName =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(repositoryName)){
					repositoryName = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository name' in json Sequence request.";
			}

			if(typeof req.body.datasetId !== 'undefined'){
				var repositoryDatasetId =  req.body.datasetId.trim().toLowerCase();
				if(validator.isEmpty(repositoryDatasetId)){
					repositoryDatasetId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository dataset id' in json Sequence request.";
			}

			if(typeof req.body.variantsetId !== 'undefined'){
				var repositoryVariantsetId =  req.body.variantsetId.trim().toLowerCase();
				if(validator.isEmpty(repositoryVariantsetId)){
					repositoryVariantsetId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository variantset id' in json Sequence request.";
			}

			if(typeof req.body.readsetId !== 'undefined'){
				var repositoryReadsetId =  req.body.readsetId.trim().toLowerCase();
				if(validator.isEmpty(repositoryReadsetId)){
					repositoryReadsetId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repository readset id' in json Sequence request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSequenceID', function(){
							checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceID){
								if(resSequenceID.err_code > 0){
									var unicId = uniqid.time();
									var sequenceRepositoryId = 'sre' + unicId;
									//SequenceRepository
									dataSequenceRepository = {
										"repository_id" : sequenceRepositoryId,
										"type" : repositoryType,
										"url" : repositoryUrl,
										"name" : repositoryName,
										"dataset_id" : repositoryDatasetId,
										"varianset_id" : repositoryVariantsetId,
										"readset_id" : repositoryReadsetId,
										"sequence_id" : sequenceId
									}
									ApiFHIR.post('sequenceRepository', {"apikey": apikey}, {body: dataSequenceRepository, json: true}, function(error, response, body){
										sequenceRepository = body;
										if(sequenceRepository.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Sequence Repository has been add in this Sequence.", "data": sequenceRepository.data});
										}else{
											res.json(sequenceRepository);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Sequence Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(repositoryType)) {
							checkCode(apikey, repositoryType, 'REPOSITORY_TYPE', function (resRepositoryTypeCode) {
								if (resRepositoryTypeCode.err_code > 0) {
									myEmitter.emit('checkSequenceID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Repository type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSequenceID');
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
		sequenceVariant: function addSequenceVariant(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var sequenceId = req.params.sequence_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof sequenceId !== 'undefined'){
				if(validator.isEmpty(sequenceId)){
					err_code = 2;
					err_msg = "Sequence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence id is required";
			}
			
			if(typeof req.body.start !== 'undefined'){
				var variantStart =  req.body.start;
				if(validator.isEmpty(variantStart)){
					variantStart = "";
				}else{
					if(!validator.isInt(variantStart)){
						err_code = 2;
						err_msg = "Sequence variant start is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant start' in json Sequence request.";
			}

			if(typeof req.body.end !== 'undefined'){
				var variantEnd =  req.body.end;
				if(validator.isEmpty(variantEnd)){
					variantEnd = "";
				}else{
					if(!validator.isInt(variantEnd)){
						err_code = 2;
						err_msg = "Sequence variant end is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant end' in json Sequence request.";
			}

			if(typeof req.body.observedAllele !== 'undefined'){
				var variantObservedAllele =  req.body.observedAllele.trim().toLowerCase();
				if(validator.isEmpty(variantObservedAllele)){
					variantObservedAllele = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant observed allele' in json Sequence request.";
			}

			if(typeof req.body.referenceAllele !== 'undefined'){
				var variantReferenceAllele =  req.body.referenceAllele.trim().toLowerCase();
				if(validator.isEmpty(variantReferenceAllele)){
					variantReferenceAllele = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant reference allele' in json Sequence request.";
			}

			if(typeof req.body.cigar !== 'undefined'){
				var variantCigar =  req.body.cigar.trim().toLowerCase();
				if(validator.isEmpty(variantCigar)){
					variantCigar = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant cigar' in json Sequence request.";
			}

			if(typeof req.bodyPointer !== 'undefined'){
				var variantVariantPointer =  req.bodyPointer.trim().toLowerCase();
				if(validator.isEmpty(variantVariantPointer)){
					variantVariantPointer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'variant variant pointer' in json Sequence request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSequenceID', function(){
							checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceID){
								if(resSequenceID.err_code > 0){
									var unicId = uniqid.time();
									var sequenceVariantId = 'sva' + unicId;
									//SequenceVariant
									dataSequenceVariant = {
										"variant_id" : sequenceVariantId,
										"start" : variantStart,
										"end" : variantEnd,
										"observed_allele" : variantObservedAllele,
										"reference_allele" : variantReferenceAllele,
										"cigar" : variantCigar,
										"variant_pointer" : variantVariantPointer,
										"sequence_id" : sequenceId
									}
									ApiFHIR.post('sequenceVariant', {"apikey": apikey}, {body: dataSequenceVariant, json: true}, function(error, response, body){
										sequenceVariant = body;
										if(sequenceVariant.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Sequence Variant has been add in this Sequence.", "data": sequenceVariant.data});
										}else{
											res.json(sequenceVariant);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Sequence Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(variantVariantPointer)) {
							checkUniqeValue(apikey, "OBSERVATION_ID|" + variantVariantPointer, 'OBSERVATION', function (resVariantVariantPointer) {
								if (resVariantVariantPointer.err_code > 0) {
									myEmitter.emit('checkSequenceID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Variant variant pointer id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSequenceID');
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
		sequenceQuality: function addSequenceQuality(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var sequenceId = req.params.sequence_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof sequenceId !== 'undefined'){
				if(validator.isEmpty(sequenceId)){
					err_code = 2;
					err_msg = "Sequence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence id is required";
			}
			
			if(typeof req.body.type !== 'undefined'){
				var qualityType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(qualityType)){
					qualityType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality type' in json Sequence request.";
			}

			if(typeof req.body.standardSequence !== 'undefined'){
				var qualityStandardSequence =  req.body.standardSequence.trim().toLowerCase();
				if(validator.isEmpty(qualityStandardSequence)){
					qualityStandardSequence = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality standard sequence' in json Sequence request.";
			}

			if(typeof req.body.start !== 'undefined'){
				var qualityStart =  req.body.start;
				if(validator.isEmpty(qualityStart)){
					qualityStart = "";
				}else{
					if(!validator.isInt(qualityStart)){
						err_code = 2;
						err_msg = "Sequence quality start is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality start' in json Sequence request.";
			}

			if(typeof req.body.end !== 'undefined'){
				var qualityEnd =  req.body.end;
				if(validator.isEmpty(qualityEnd)){
					qualityEnd = "";
				}else{
					if(!validator.isInt(qualityEnd)){
						err_code = 2;
						err_msg = "Sequence quality end is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality end' in json Sequence request.";
			}

			if(typeof req.body.score.value !== 'undefined'){
				var qualityScoreValue =  req.body.score.value;
				if(validator.isEmpty(qualityScoreValue)){
					qualityScoreValue = "";
				}else{
					if(!validator.isInt(qualityScoreValue)){
						err_code = 2;
						err_msg = "Sequence quality score value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score value' in json Sequence request.";
			}

			if(typeof req.body.score.comparator !== 'undefined'){
				var qualityScoreComparator =  req.body.score.comparator.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreComparator)){
					qualityScoreComparator = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score comparator' in json Sequence request.";
			}

			if(typeof req.body.score.unit !== 'undefined'){
				var qualityScoreUnit =  req.body.score.unit.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreUnit)){
					qualityScoreUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score unit' in json Sequence request.";
			}

			if(typeof req.body.score.system !== 'undefined'){
				var qualityScoreSystem =  req.body.score.system.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreSystem)){
					qualityScoreSystem = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score system' in json Sequence request.";
			}

			if(typeof req.body.score.code !== 'undefined'){
				var qualityScoreCode =  req.body.score.code.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreCode)){
					qualityScoreCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality score code' in json Sequence request.";
			}

			if(typeof req.body.method !== 'undefined'){
				var qualityMethod =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(qualityMethod)){
					qualityMethod = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality method' in json Sequence request.";
			}

			if(typeof req.body.truthTP !== 'undefined'){
				var qualityTruthTP =  req.body.truthTP;
				if(validator.isEmpty(qualityTruthTP)){
					qualityTruthTP = "";
				}else{
					if(!validator.isInt(qualityTruthTP)){
						err_code = 2;
						err_msg = "Sequence quality truth t p is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality truth t p' in json Sequence request.";
			}

			if(typeof req.body.queryTP !== 'undefined'){
				var qualityQueryTP =  req.body.queryTP;
				if(validator.isEmpty(qualityQueryTP)){
					qualityQueryTP = "";
				}else{
					if(!validator.isInt(qualityQueryTP)){
						err_code = 2;
						err_msg = "Sequence quality query t p is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality query t p' in json Sequence request.";
			}

			if(typeof req.body.truthFN !== 'undefined'){
				var qualityTruthFN =  req.body.truthFN;
				if(validator.isEmpty(qualityTruthFN)){
					qualityTruthFN = "";
				}else{
					if(!validator.isInt(qualityTruthFN)){
						err_code = 2;
						err_msg = "Sequence quality truth f n is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality truth f n' in json Sequence request.";
			}

			if(typeof req.body.queryFP !== 'undefined'){
				var qualityQueryFP =  req.body.queryFP;
				if(validator.isEmpty(qualityQueryFP)){
					qualityQueryFP = "";
				}else{
					if(!validator.isInt(qualityQueryFP)){
						err_code = 2;
						err_msg = "Sequence quality query f p is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality query f p' in json Sequence request.";
			}

			if(typeof req.body.gtFP !== 'undefined'){
				var qualityGtFP =  req.body.gtFP;
				if(validator.isEmpty(qualityGtFP)){
					qualityGtFP = "";
				}else{
					if(!validator.isInt(qualityGtFP)){
						err_code = 2;
						err_msg = "Sequence quality gt f p is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality gt f p' in json Sequence request.";
			}

			if(typeof req.body.precision !== 'undefined'){
				var qualityPrecision =  req.body.precision;
				if(validator.isEmpty(qualityPrecision)){
					qualityPrecision = "";
				}else{
					if(!validator.isInt(qualityPrecision)){
						err_code = 2;
						err_msg = "Sequence quality precision is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality precision' in json Sequence request.";
			}

			if(typeof req.body.recall !== 'undefined'){
				var qualityRecall =  req.body.recall;
				if(validator.isEmpty(qualityRecall)){
					qualityRecall = "";
				}else{
					if(!validator.isInt(qualityRecall)){
						err_code = 2;
						err_msg = "Sequence quality recall is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality recall' in json Sequence request.";
			}

			if(typeof req.body.fScore !== 'undefined'){
				var qualityFScore =  req.body.fScore;
				if(validator.isEmpty(qualityFScore)){
					qualityFScore = "";
				}else{
					if(!validator.isInt(qualityFScore)){
						err_code = 2;
						err_msg = "Sequence quality f score is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'quality f score' in json Sequence request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSequenceID', function(){
							checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceID){
								if(resSequenceID.err_code > 0){
									var unicId = uniqid.time();
									var sequenceQualityId = 'sqa' + unicId;
									var QualityQuantityId = 'quq' + unicId;
									//SequenceQuality
									
									var dataQualityQuantity = {
										"quantity_id" : QualityQuantityId,
										"valuee" : qualityScoreValue,
										"comparator" : qualityScoreComparator,
										"unit" : qualityScoreUnit,
										"system" : qualityScoreSystem,
										"code" : qualityScoreCode,
										"quality_id" : sequenceQualityId
									};

									//method, endpoint, params, options, callback
									ApiFHIR.post('quantity', {"apikey": apikey}, {body: dataQualityQuantity, json:true}, function(error, response, body){
										qualityQuantity = body;
										if(qualityQuantity.err_code > 0){
											res.json(qualityQuantity);	
											console.log("ok");
										}
									});
									
									dataSequenceQuality = {
										"quantity_id" : QualityQuantityId,
										"valuee" : qualityScoreValue,
										"comparator" : qualityScoreComparator,
										"unit" : qualityScoreUnit,
										"system" : qualityScoreSystem,
										"code" : qualityScoreCode,
										"quality_id" : sequenceQualityId
									};
									ApiFHIR.post('sequenceQuality', {"apikey": apikey}, {body: dataSequenceQuality, json: true}, function(error, response, body){
										sequenceQuality = body;
										if(sequenceQuality.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Sequence Quality has been add in this Sequence.", "data": sequenceQuality.data});
										}else{
											res.json(sequenceQuality);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Sequence Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkQualityType', function () {
							if (!validator.isEmpty(qualityType)) {
								checkCode(apikey, qualityType, 'QUALITY_TYPE', function (resQualityTypeCode) {
									if (resQualityTypeCode.err_code > 0) {
										myEmitter.emit('checkSequenceID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Quality type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSequenceID');
							}
						})
						
						if (!validator.isEmpty(qualityScoreComparator)) {
							checkCode(apikey, qualityScoreComparator, 'QUANTITY_COMPARATOR', function (resQualityScoreComparatorCode) {
								if (resQualityScoreComparatorCode.err_code > 0) {
									myEmitter.emit('checkQualityType');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Quality score comparator code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkQualityType');
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
		sequence : function putSequence(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var sequenceId = req.params.sequence_id;

      var err_code = 0;
      var err_msg = "";
      var dataSequence = {};

			if(typeof sequenceId !== 'undefined'){
				if(validator.isEmpty(sequenceId)){
					err_code = 2;
					err_msg = "Sequence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence id is required";
			}

			/*
			var type  = req.body.type;
			var coordinate_system  = req.body.coordinate_system;
			var patient  = req.body.patient;
			var specimen  = req.body.specimen;
			var device  = req.body.device;
			var performer  = req.body.performer;
			var quantity  = req.body.quantity;
			var reference_seq_chromosome  = req.body.reference_seq_chromosome;
			var reference_seq_genome_bui  = req.body.reference_seq_genome_bui;
			var reference_seq_reference_seq_id  = req.body.reference_seq_reference_seq_id;
			var reference_seq_pointer  = req.body.reference_seq_pointer;
			var reference_seq_string  = req.body.reference_seq_string;
			var reference_seq_strand  = req.body.reference_seq_strand;
			var reference_seq_window_start  = req.body.reference_seq_window_start;
			var reference_seq_window_end  = req.body.reference_seq_window_end;
			var observed_seq  = req.body.observed_seq;
			var read_coverage  = req.body.read_coverage;
			*/
			
			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					dataSequence.type = "";
				}else{
					dataSequence.type = type;
				}
			}else{
			  type = "";
			}

			if(typeof req.body.coordinateSystem !== 'undefined' && req.body.coordinateSystem !== ""){
				var coordinateSystem =  req.body.coordinateSystem;
				if(validator.isEmpty(coordinateSystem)){
					err_code = 2;
					err_msg = "sequence coordinate system is required.";
				}else{
					if(!validator.isInt(coordinateSystem)){
						err_code = 2;
						err_msg = "sequence coordinate system is must be number.";
					}else{
						dataSequence.coordinate_system = coordinateSystem;
					}
				}
			}else{
			  coordinateSystem = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataSequence.patient = "";
				}else{
					dataSequence.patient = patient;
				}
			}else{
			  patient = "";
			}

			if(typeof req.body.specimen !== 'undefined' && req.body.specimen !== ""){
				var specimen =  req.body.specimen.trim().toLowerCase();
				if(validator.isEmpty(specimen)){
					dataSequence.specimen = "";
				}else{
					dataSequence.specimen = specimen;
				}
			}else{
			  specimen = "";
			}

			if(typeof req.body.device !== 'undefined' && req.body.device !== ""){
				var device =  req.body.device.trim().toLowerCase();
				if(validator.isEmpty(device)){
					dataSequence.device = "";
				}else{
					dataSequence.device = device;
				}
			}else{
			  device = "";
			}

			if(typeof req.body.performer !== 'undefined' && req.body.performer !== ""){
				var performer =  req.body.performer.trim().toLowerCase();
				if(validator.isEmpty(performer)){
					dataSequence.performer = "";
				}else{
					dataSequence.performer = performer;
				}
			}else{
			  performer = "";
			}

			i/*f(typeof req.body.quantity.value !== 'undefined' && req.body.quantity.value !== ""){
				var quantityValue =  req.body.quantity.value;
				if(validator.isEmpty(quantityValue)){
					dataSequence.value = "";
				}else{
					if(!validator.isInt(quantityValue)){
						err_code = 2;
						err_msg = "sequence quantity value is must be number.";
					}else{
						dataSequence.value = quantityValue;
					}
				}
			}else{
			  quantityValue = "";
			}

			if(typeof req.body.quantity.comparator !== 'undefined' && req.body.quantity.comparator !== ""){
				var quantityComparator =  req.body.quantity.comparator.trim().toLowerCase();
				if(validator.isEmpty(quantityComparator)){
					dataSequence.comparator = "";
				}else{
					dataSequence.comparator = quantityComparator;
				}
			}else{
			  quantityComparator = "";
			}

			if(typeof req.body.quantity.unit !== 'undefined' && req.body.quantity.unit !== ""){
				var quantityUnit =  req.body.quantity.unit.trim().toLowerCase();
				if(validator.isEmpty(quantityUnit)){
					dataSequence.unit = "";
				}else{
					dataSequence.unit = quantityUnit;
				}
			}else{
			  quantityUnit = "";
			}

			if(typeof req.body.quantity.system !== 'undefined' && req.body.quantity.system !== ""){
				var quantitySystem =  req.body.quantity.system.trim().toLowerCase();
				if(validator.isEmpty(quantitySystem)){
					dataSequence.system = "";
				}else{
					dataSequence.system = quantitySystem;
				}
			}else{
			  quantitySystem = "";
			}

			if(typeof req.body.quantity.code !== 'undefined' && req.body.quantity.code !== ""){
				var quantityCode =  req.body.quantity.code.trim().toLowerCase();
				if(validator.isEmpty(quantityCode)){
					dataSequence.code = "";
				}else{
					dataSequence.code = quantityCode;
				}
			}else{
			  quantityCode = "";
			}*/

			if(typeof req.body.referenceSeq.chromosome !== 'undefined' && req.body.referenceSeq.chromosome !== ""){
				var referenceSeqChromosome =  req.body.referenceSeq.chromosome.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqChromosome)){
					dataSequence.reference_seq_chromosome = "";
				}else{
					dataSequence.reference_seq_chromosome = referenceSeqChromosome;
				}
			}else{
			  referenceSeqChromosome = "";
			}

			if(typeof req.body.referenceSeq.genomeBuild !== 'undefined' && req.body.referenceSeq.genomeBuild !== ""){
				var referenceSeqGenomeBuild =  req.body.referenceSeq.genomeBuild.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqGenomeBuild)){
					dataSequence.reference_seq_genome_build = "";
				}else{
					dataSequence.reference_seq_genome_build = referenceSeqGenomeBuild;
				}
			}else{
			  referenceSeqGenomeBuild = "";
			}

			if(typeof req.body.referenceSeq.referenceSeqId !== 'undefined' && req.body.referenceSeq.referenceSeqId !== ""){
				var referenceSeqReferenceSeqId =  req.body.referenceSeq.referenceSeqId.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqReferenceSeqId)){
					dataSequence.reference_seq_id = "";
				}else{
					dataSequence.reference_seq_id = referenceSeqReferenceSeqId;
				}
			}else{
			  referenceSeqReferenceSeqId = "";
			}

			if(typeof req.body.referenceSeq.referenceSeqPointer !== 'undefined' && req.body.referenceSeq.referenceSeqPointer !== ""){
				var referenceSeqReferenceSeqPointer =  req.body.referenceSeq.referenceSeqPointer.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqReferenceSeqPointer)){
					dataSequence.reference_seq_pointer = "";
				}else{
					dataSequence.reference_seq_pointer = referenceSeqReferenceSeqPointer;
				}
			}else{
			  referenceSeqReferenceSeqPointer = "";
			}

			if(typeof req.body.referenceSeq.referenceSeqString !== 'undefined' && req.body.referenceSeq.referenceSeqString !== ""){
				var referenceSeqReferenceSeqString =  req.body.referenceSeq.referenceSeqString.trim().toLowerCase();
				if(validator.isEmpty(referenceSeqReferenceSeqString)){
					dataSequence.reference_seq_string = "";
				}else{
					dataSequence.reference_seq_string = referenceSeqReferenceSeqString;
				}
			}else{
			  referenceSeqReferenceSeqString = "";
			}

			if(typeof req.body.referenceSeq.strand !== 'undefined' && req.body.referenceSeq.strand !== ""){
				var referenceSeqStrand =  req.body.referenceSeq.strand;
				if(validator.isEmpty(referenceSeqStrand)){
					dataSequence.reference_seq_strand = "";
				}else{
					if(!validator.isInt(referenceSeqStrand)){
						err_code = 2;
						err_msg = "sequence reference seq strand is must be number.";
					}else{
						dataSequence.reference_seq_strand = referenceSeqStrand;
					}
				}
			}else{
			  referenceSeqStrand = "";
			}

			if(typeof req.body.referenceSeq.windowStart !== 'undefined' && req.body.referenceSeq.windowStart !== ""){
				var referenceSeqWindowStart =  req.body.referenceSeq.windowStart;
				if(validator.isEmpty(referenceSeqWindowStart)){
					dataSequence.reference_seq_window_start = "";
				}else{
					if(!validator.isInt(referenceSeqWindowStart)){
						err_code = 2;
						err_msg = "sequence reference seq window start is must be number.";
					}else{
						dataSequence.reference_seq_window_start = referenceSeqWindowStart;
					}
				}
			}else{
			  referenceSeqWindowStart = "";
			}

			if(typeof req.body.referenceSeq.windowEnd !== 'undefined' && req.body.referenceSeq.windowEnd !== ""){
				var referenceSeqWindowEnd =  req.body.referenceSeq.windowEnd;
				if(validator.isEmpty(referenceSeqWindowEnd)){
					dataSequence.reference_seq_window_end = "";
				}else{
					if(!validator.isInt(referenceSeqWindowEnd)){
						err_code = 2;
						err_msg = "sequence reference seq window end is must be number.";
					}else{
						dataSequence.reference_seq_window_end = referenceSeqWindowEnd;
					}
				}
			}else{
			  referenceSeqWindowEnd = "";
			}

			if(typeof req.body.observedSeq !== 'undefined' && req.body.observedSeq !== ""){
				var observedSeq =  req.body.observedSeq.trim().toLowerCase();
				if(validator.isEmpty(observedSeq)){
					dataSequence.observed_seq = "";
				}else{
					dataSequence.observed_seq = observedSeq;
				}
			}else{
			  observedSeq = "";
			}

			if(typeof req.body.readCoverage !== 'undefined' && req.body.readCoverage !== ""){
				var readCoverage =  req.body.readCoverage;
				if(validator.isEmpty(readCoverage)){
					dataSequence.read_coverage = "";
				}else{
					if(!validator.isInt(readCoverage)){
						err_code = 2;
						err_msg = "sequence read coverage is must be number.";
					}else{
						dataSequence.read_coverage = readCoverage;
					}
				}
			}else{
			  readCoverage = "";
			}

			if(typeof req.body.pointer !== 'undefined' && req.body.pointer !== ""){
				var pointer =  req.body.pointer.trim().toLowerCase();
				if(validator.isEmpty(pointer)){
					dataSequence.pointer = "";
				}else{
					dataSequence.pointer = pointer;
				}
			}else{
			  pointer = "";
			}

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkSequenceId', function(){
						checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceId){
							if(resSequenceId.err_code > 0){
								ApiFHIR.put('sequence', {"apikey": apikey, "_id": sequenceId}, {body: dataSequence, json: true}, function(error, response, body){
									sequence = body;
									if(sequence.err_code > 0){
										res.json(sequence);	
									}else{
										res.json({"err_code": 0, "err_msg": "Sequence has been update.", "data": [{"_id": sequenceId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Sequence Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkType', function () {
						if (!validator.isEmpty(type)) {
							checkCode(apikey, type, 'SEQUENCE_TYPE', function (resTypeCode) {
								if (resTypeCode.err_code > 0) {
									myEmitter.emit('checkSequenceId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSequenceId');
						}
					})

					myEmitter.prependOnceListener('checkReferenceSeqChromosome', function () {
						if (!validator.isEmpty(referenceSeqChromosome)) {
							checkCode(apikey, referenceSeqChromosome, 'CHROMOSOME_HUMAN', function (resReferenceSeqChromosomeCode) {
								if (resReferenceSeqChromosomeCode.err_code > 0) {
									myEmitter.emit('checkType');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reference seq chromosome code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkType');
						}
					})

					myEmitter.prependOnceListener('checkReferenceSeqReferenceSeqId', function () {
						if (!validator.isEmpty(referenceSeqReferenceSeqId)) {
							checkCode(apikey, referenceSeqReferenceSeqId, 'SEQUENCE_REFERENCESEQ', function (resReferenceSeqReferenceSeqIdCode) {
								if (resReferenceSeqReferenceSeqIdCode.err_code > 0) {
									myEmitter.emit('checkReferenceSeqChromosome');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reference seq reference seq id code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReferenceSeqChromosome');
						}
					})
					
					myEmitter.prependOnceListener('checkPatient', function () {
						if (!validator.isEmpty(patient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
								if (resPatient.err_code > 0) {
									myEmitter.emit('checkReferenceSeqReferenceSeqId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReferenceSeqReferenceSeqId');
						}
					})

					myEmitter.prependOnceListener('checkSpecimen', function () {
						if (!validator.isEmpty(specimen)) {
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimen, 'SPECIMEN', function (resSpecimen) {
								if (resSpecimen.err_code > 0) {
									myEmitter.emit('checkPatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Specimen id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPatient');
						}
					})

					myEmitter.prependOnceListener('checkDevice', function () {
						if (!validator.isEmpty(device)) {
							checkUniqeValue(apikey, "DEVICE_ID|" + device, 'DEVICE', function (resDevice) {
								if (resDevice.err_code > 0) {
									myEmitter.emit('checkSpecimen');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Device id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSpecimen');
						}
					})

					myEmitter.prependOnceListener('checkPerformer', function () {
						if (!validator.isEmpty(performer)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + performer, 'ORGANIZATION', function (resPerformer) {
								if (resPerformer.err_code > 0) {
									myEmitter.emit('checkDevice');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDevice');
						}
					})

					if (!validator.isEmpty(referenceSeqReferenceSeqPointer)) {
						checkUniqeValue(apikey, "SEQUENCE_ID|" + referenceSeqReferenceSeqPointer, 'SEQUENCES', function (resReferenceSeqReferenceSeqPointer) {
							if (resReferenceSeqReferenceSeqPointer.err_code > 0) {
								myEmitter.emit('checkPerformer');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Reference seq reference seq pointer id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkPerformer');
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
			var sequenceId = req.params.sequence_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof sequenceId !== 'undefined'){
				if(validator.isEmpty(sequenceId)){
					err_code = 2;
					err_msg = "Sequence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence id is required";
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
						myEmitter.prependOnceListener('checkSequenceID', function(){
							checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceID){
								if(resSequenceID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "SEQUENCE_ID|"+sequenceId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Sequence.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Sequence Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkSequenceID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkSequenceID');				
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
		sequenceRepository: function updateSequenceRepository(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var sequenceId = req.params.sequence_id;
			var sequenceRepositoryId = req.params.sequence_repository_id;

			var err_code = 0;
			var err_msg = "";
			var dataSequence = {};
			//input check 
			if(typeof sequenceId !== 'undefined'){
				if(validator.isEmpty(sequenceId)){
					err_code = 2;
					err_msg = "Sequence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence id is required";
			}

			if(typeof sequenceRepositoryId !== 'undefined'){
				if(validator.isEmpty(sequenceRepositoryId)){
					err_code = 2;
					err_msg = "Sequence Repository id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence Repository id is required";
			}
			
			/*
			var role  = req.body.role;
			var actor_practitioner  = req.body.actor_practitioner;
			var actor_organization  = req.body.actor_organization;
			*/
			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var repositoryType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(repositoryType)){
					dataSequence.type = "";
				}else{
					dataSequence.type = repositoryType;
				}
			}else{
			  repositoryType = "";
			}

			if(typeof req.body.url !== 'undefined' && req.body.url !== ""){
				var repositoryUrl =  req.body.url.trim().toLowerCase();
				if(validator.isEmpty(repositoryUrl)){
					dataSequence.url = "";
				}else{
					dataSequence.url = repositoryUrl;
				}
			}else{
			  repositoryUrl = "";
			}

			if(typeof req.body.name !== 'undefined' && req.body.name !== ""){
				var repositoryName =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(repositoryName)){
					dataSequence.name = "";
				}else{
					dataSequence.name = repositoryName;
				}
			}else{
			  repositoryName = "";
			}

			if(typeof req.body.datasetId !== 'undefined' && req.body.datasetId !== ""){
				var repositoryDatasetId =  req.body.datasetId.trim().toLowerCase();
				if(validator.isEmpty(repositoryDatasetId)){
					dataSequence.dataset_id = "";
				}else{
					dataSequence.dataset_id = repositoryDatasetId;
				}
			}else{
			  repositoryDatasetId = "";
			}

			if(typeof req.body.variantsetId !== 'undefined' && req.body.variantsetId !== ""){
				var repositoryVariantsetId =  req.body.variantsetId.trim().toLowerCase();
				if(validator.isEmpty(repositoryVariantsetId)){
					dataSequence.variantset_id = "";
				}else{
					dataSequence.variantset_id = repositoryVariantsetId;
				}
			}else{
			  repositoryVariantsetId = "";
			}

			if(typeof req.body.readsetId !== 'undefined' && req.body.readsetId !== ""){
				var repositoryReadsetId =  req.body.readsetId.trim().toLowerCase();
				if(validator.isEmpty(repositoryReadsetId)){
					dataSequence.readset_id = "";
				}else{
					dataSequence.readset_id = repositoryReadsetId;
				}
			}else{
			  repositoryReadsetId = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSequenceID', function(){
							checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceId){
								if(resSequenceId.err_code > 0){
									checkUniqeValue(apikey, "REPOSITORY_ID|" + sequenceRepositoryId, 'SEQUENCE_REPOSITORY', function(resSequenceRepositoryID){
										if(resSequenceRepositoryID.err_code > 0){
											ApiFHIR.put('sequenceRepository', {"apikey": apikey, "_id": sequenceRepositoryId, "dr": "SEQUENCE_ID|"+sequenceId}, {body: dataSequence, json: true}, function(error, response, body){
												sequenceRepository = body;
												if(sequenceRepository.err_code > 0){
													res.json(sequenceRepository);	
												}else{
													res.json({"err_code": 0, "err_msg": "Sequence Repository has been update in this Sequence.", "data": sequenceRepository.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Sequence Repository Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Sequence Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(repositoryType)) {
							checkCode(apikey, repositoryType, 'REPOSITORY_TYPE', function (resRepositoryTypeCode) {
								if (resRepositoryTypeCode.err_code > 0) {
									myEmitter.emit('checkSequenceID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Repository type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSequenceID');
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
		sequenceVariant: function updateSequenceVariant(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var sequenceId = req.params.sequence_id;
			var sequenceVariantId = req.params.sequence_variant_id;

			var err_code = 0;
			var err_msg = "";
			var dataSequence = {};
			//input check 
			if(typeof sequenceId !== 'undefined'){
				if(validator.isEmpty(sequenceId)){
					err_code = 2;
					err_msg = "Sequence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence id is required";
			}

			if(typeof sequenceVariantId !== 'undefined'){
				if(validator.isEmpty(sequenceVariantId)){
					err_code = 2;
					err_msg = "Sequence Variant id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence Prediction id is required";
			}
			
			/*
			var comment  = req.body.comment;
			var link  = req.body.link;
			*/
			
			if(typeof req.body.start !== 'undefined' && req.body.start !== ""){
				var variantStart =  req.body.start;
				if(validator.isEmpty(variantStart)){
					dataSequence.start = "";
				}else{
					if(!validator.isInt(variantStart)){
						err_code = 2;
						err_msg = "sequence variant start is must be number.";
					}else{
						dataSequence.start = variantStart;
					}
				}
			}else{
			  variantStart = "";
			}

			if(typeof req.body.end !== 'undefined' && req.body.end !== ""){
				var variantEnd =  req.body.end;
				if(validator.isEmpty(variantEnd)){
					dataSequence.end = "";
				}else{
					if(!validator.isInt(variantEnd)){
						err_code = 2;
						err_msg = "sequence variant end is must be number.";
					}else{
						dataSequence.end = variantEnd;
					}
				}
			}else{
			  variantEnd = "";
			}

			if(typeof req.body.observedAllele !== 'undefined' && req.body.observedAllele !== ""){
				var variantObservedAllele =  req.body.observedAllele.trim().toLowerCase();
				if(validator.isEmpty(variantObservedAllele)){
					dataSequence.observed_allele = "";
				}else{
					dataSequence.observed_allele = variantObservedAllele;
				}
			}else{
			  variantObservedAllele = "";
			}

			if(typeof req.body.referenceAllele !== 'undefined' && req.body.referenceAllele !== ""){
				var variantReferenceAllele =  req.body.referenceAllele.trim().toLowerCase();
				if(validator.isEmpty(variantReferenceAllele)){
					dataSequence.reference_allele = "";
				}else{
					dataSequence.reference_allele = variantReferenceAllele;
				}
			}else{
			  variantReferenceAllele = "";
			}

			if(typeof req.body.cigar !== 'undefined' && req.body.cigar !== ""){
				var variantCigar =  req.body.cigar.trim().toLowerCase();
				if(validator.isEmpty(variantCigar)){
					dataSequence.cigar = "";
				}else{
					dataSequence.cigar = variantCigar;
				}
			}else{
			  variantCigar = "";
			}

			if(typeof req.bodyPointer !== 'undefined' && req.bodyPointer !== ""){
				var variantVariantPointer =  req.bodyPointer.trim().toLowerCase();
				if(validator.isEmpty(variantVariantPointer)){
					dataSequence_pointer = "";
				}else{
					dataSequence_pointer = variantVariantPointer;
				}
			}else{
			  variantVariantPointer = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSequenceID', function(){
							checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceId){
								if(resSequenceId.err_code > 0){
									checkUniqeValue(apikey, "VARIANT_ID|" + sequenceVariantId, 'SEQUENCE_VARIANT', function(resSequenceVariantID){
										if(resSequenceVariantID.err_code > 0){
											ApiFHIR.put('sequenceVariant', {"apikey": apikey, "_id": sequenceVariantId, "dr": "SEQUENCE_ID|"+sequenceId}, {body: dataSequence, json: true}, function(error, response, body){
												sequenceVariant = body;
												if(sequenceVariant.err_code > 0){
													res.json(sequenceVariant);	
												}else{
													res.json({"err_code": 0, "err_msg": "Sequence Variant has been update in this Sequence.", "data": sequenceVariant.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Sequence Variant Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Sequence Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(variantVariantPointer)) {
							checkUniqeValue(apikey, "OBSERVATION_ID|" + variantVariantPointer, 'OBSERVATION', function (resVariantVariantPointer) {
								if (resVariantVariantPointer.err_code > 0) {
									myEmitter.emit('checkSequenceID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Variant variant pointer id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSequenceID');
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
		sequenceQuality: function updateSequenceQuality(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var sequenceId = req.params.sequence_id;
			var sequenceQualityId = req.params.sequence_quality_id;

			var err_code = 0;
			var err_msg = "";
			var dataSequence = {};
			//input check 
			if(typeof sequenceId !== 'undefined'){
				if(validator.isEmpty(sequenceId)){
					err_code = 2;
					err_msg = "Sequence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence id is required";
			}

			if(typeof sequenceQualityId !== 'undefined'){
				if(validator.isEmpty(sequenceQualityId)){
					err_code = 2;
					err_msg = "Sequence Quality id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Sequence Prediction id is required";
			}
			
			/*
			var comment  = req.body.comment;
			var link  = req.body.link;
			*/
			
			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var qualityType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(qualityType)){
					dataSequence.type = "";
				}else{
					dataSequence.type = qualityType;
				}
			}else{
			  qualityType = "";
			}

			if(typeof req.body.standardSequence !== 'undefined' && req.body.standardSequence !== ""){
				var qualityStandardSequence =  req.body.standardSequence.trim().toLowerCase();
				if(validator.isEmpty(qualityStandardSequence)){
					dataSequence.standard_sequence = "";
				}else{
					dataSequence.standard_sequence = qualityStandardSequence;
				}
			}else{
			  qualityStandardSequence = "";
			}

			if(typeof req.body.start !== 'undefined' && req.body.start !== ""){
				var qualityStart =  req.body.start;
				if(validator.isEmpty(qualityStart)){
					dataSequence.start = "";
				}else{
					if(!validator.isInt(qualityStart)){
						err_code = 2;
						err_msg = "sequence quality start is must be number.";
					}else{
						dataSequence.start = qualityStart;
					}
				}
			}else{
			  qualityStart = "";
			}

			if(typeof req.body.end !== 'undefined' && req.body.end !== ""){
				var qualityEnd =  req.body.end;
				if(validator.isEmpty(qualityEnd)){
					dataSequence.end = "";
				}else{
					if(!validator.isInt(qualityEnd)){
						err_code = 2;
						err_msg = "sequence quality end is must be number.";
					}else{
						dataSequence.end = qualityEnd;
					}
				}
			}else{
			  qualityEnd = "";
			}

			if(typeof req.body.score.value !== 'undefined' && req.body.score.value !== ""){
				var qualityScoreValue =  req.body.score.value;
				if(validator.isEmpty(qualityScoreValue)){
					dataSequence.value = "";
				}else{
					if(!validator.isInt(qualityScoreValue)){
						err_code = 2;
						err_msg = "sequence quality score value is must be number.";
					}else{
						dataSequence.value = qualityScoreValue;
					}
				}
			}else{
			  qualityScoreValue = "";
			}

			if(typeof req.body.score.comparator !== 'undefined' && req.body.score.comparator !== ""){
				var qualityScoreComparator =  req.body.score.comparator.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreComparator)){
					dataSequence.comparator = "";
				}else{
					dataSequence.comparator = qualityScoreComparator;
				}
			}else{
			  qualityScoreComparator = "";
			}

			if(typeof req.body.score.unit !== 'undefined' && req.body.score.unit !== ""){
				var qualityScoreUnit =  req.body.score.unit.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreUnit)){
					dataSequence.unit = "";
				}else{
					dataSequence.unit = qualityScoreUnit;
				}
			}else{
			  qualityScoreUnit = "";
			}

			if(typeof req.body.score.system !== 'undefined' && req.body.score.system !== ""){
				var qualityScoreSystem =  req.body.score.system.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreSystem)){
					dataSequence.system = "";
				}else{
					dataSequence.system = qualityScoreSystem;
				}
			}else{
			  qualityScoreSystem = "";
			}

			if(typeof req.body.score.code !== 'undefined' && req.body.score.code !== ""){
				var qualityScoreCode =  req.body.score.code.trim().toLowerCase();
				if(validator.isEmpty(qualityScoreCode)){
					dataSequence.code = "";
				}else{
					dataSequence.code = qualityScoreCode;
				}
			}else{
			  qualityScoreCode = "";
			}

			if(typeof req.body.method !== 'undefined' && req.body.method !== ""){
				var qualityMethod =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(qualityMethod)){
					dataSequence.method = "";
				}else{
					dataSequence.method = qualityMethod;
				}
			}else{
			  qualityMethod = "";
			}

			if(typeof req.body.truthTP !== 'undefined' && req.body.truthTP !== ""){
				var qualityTruthTP =  req.body.truthTP;
				if(validator.isEmpty(qualityTruthTP)){
					dataSequence.truth_t_p = "";
				}else{
					if(!validator.isInt(qualityTruthTP)){
						err_code = 2;
						err_msg = "sequence quality truth t p is must be number.";
					}else{
						dataSequence.truth_t_p = qualityTruthTP;
					}
				}
			}else{
			  qualityTruthTP = "";
			}

			if(typeof req.body.queryTP !== 'undefined' && req.body.queryTP !== ""){
				var qualityQueryTP =  req.body.queryTP;
				if(validator.isEmpty(qualityQueryTP)){
					dataSequence.query_t_p = "";
				}else{
					if(!validator.isInt(qualityQueryTP)){
						err_code = 2;
						err_msg = "sequence quality query t p is must be number.";
					}else{
						dataSequence.query_t_p = qualityQueryTP;
					}
				}
			}else{
			  qualityQueryTP = "";
			}

			if(typeof req.body.truthFN !== 'undefined' && req.body.truthFN !== ""){
				var qualityTruthFN =  req.body.truthFN;
				if(validator.isEmpty(qualityTruthFN)){
					dataSequence.truth_f_n = "";
				}else{
					if(!validator.isInt(qualityTruthFN)){
						err_code = 2;
						err_msg = "sequence quality truth f n is must be number.";
					}else{
						dataSequence.truth_f_n = qualityTruthFN;
					}
				}
			}else{
			  qualityTruthFN = "";
			}

			if(typeof req.body.queryFP !== 'undefined' && req.body.queryFP !== ""){
				var qualityQueryFP =  req.body.queryFP;
				if(validator.isEmpty(qualityQueryFP)){
					dataSequence.query_f_p = "";
				}else{
					if(!validator.isInt(qualityQueryFP)){
						err_code = 2;
						err_msg = "sequence quality query f p is must be number.";
					}else{
						dataSequence.query_f_p = qualityQueryFP;
					}
				}
			}else{
			  qualityQueryFP = "";
			}

			if(typeof req.body.gtFP !== 'undefined' && req.body.gtFP !== ""){
				var qualityGtFP =  req.body.gtFP;
				if(validator.isEmpty(qualityGtFP)){
					dataSequence.gt_f_p = "";
				}else{
					if(!validator.isInt(qualityGtFP)){
						err_code = 2;
						err_msg = "sequence quality gt f p is must be number.";
					}else{
						dataSequence.gt_f_p = qualityGtFP;
					}
				}
			}else{
			  qualityGtFP = "";
			}

			if(typeof req.body.precision !== 'undefined' && req.body.precision !== ""){
				var qualityPrecision =  req.body.precision;
				if(validator.isEmpty(qualityPrecision)){
					dataSequence.precision = "";
				}else{
					if(!validator.isInt(qualityPrecision)){
						err_code = 2;
						err_msg = "sequence quality precision is must be number.";
					}else{
						dataSequence.precision = qualityPrecision;
					}
				}
			}else{
			  qualityPrecision = "";
			}

			if(typeof req.body.recall !== 'undefined' && req.body.recall !== ""){
				var qualityRecall =  req.body.recall;
				if(validator.isEmpty(qualityRecall)){
					dataSequence.recall = "";
				}else{
					if(!validator.isInt(qualityRecall)){
						err_code = 2;
						err_msg = "sequence quality recall is must be number.";
					}else{
						dataSequence.recall = qualityRecall;
					}
				}
			}else{
			  qualityRecall = "";
			}

			if(typeof req.body.fScore !== 'undefined' && req.body.fScore !== ""){
				var qualityFScore =  req.body.fScore;
				if(validator.isEmpty(qualityFScore)){
					dataSequence.f_score = "";
				}else{
					if(!validator.isInt(qualityFScore)){
						err_code = 2;
						err_msg = "sequence quality f score is must be number.";
					}else{
						dataSequence.f_score = qualityFScore;
					}
				}
			}else{
			  qualityFScore = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkSequenceID', function(){
							checkUniqeValue(apikey, "SEQUENCE_ID|" + sequenceId, 'SEQUENCES', function(resSequenceId){
								if(resSequenceId.err_code > 0){
									checkUniqeValue(apikey, "QUALITY_ID|" + sequenceQualityId, 'SEQUENCE_QUALITY', function(resSequenceQualityID){
										if(resSequenceQualityID.err_code > 0){
											ApiFHIR.put('sequenceQuality', {"apikey": apikey, "_id": sequenceQualityId, "dr": "SEQUENCE_ID|"+sequenceId}, {body: dataSequence, json: true}, function(error, response, body){
												sequenceQuality = body;
												if(sequenceQuality.err_code > 0){
													res.json(sequenceQuality);	
												}else{
													res.json({"err_code": 0, "err_msg": "Sequence Quality has been update in this Sequence.", "data": sequenceQuality.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Sequence Quality Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Sequence Id not found"});		
								}
							})
						})
						
						
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