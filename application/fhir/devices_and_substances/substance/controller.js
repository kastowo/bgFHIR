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
				substance: function getSubstance(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var substanceId = req.query._id;
					var substanceCategory = req.query.category;
					var substanceCode = req.query.code;
					var instanceId = req.query.instance;
					var instanceExpiry = req.query.expiry;
					var instanceQuantity = req.query.quantity;
					var substanceStatus = req.query.statue;
					var ingredientSubstance = req.query.substance_reference;
					
					
					var qString = {};
					if(typeof substanceId !== 'undefined'){
						if(!validator.isEmpty(substanceId)){
							qString._id = substanceId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Substance ID is required."})
						}
					}

					if(typeof substanceCategory !== 'undefined'){
						if(!validator.isEmpty(substanceCategory)){
							qString.category = substanceCategory; 
						}else{
							res.json({"err_code": 1, "err_msg": "Category is empty."});
						}
					}

					if(typeof substanceCode !== 'undefined'){
						if(!validator.isEmpty(substanceCode)){
							qString.code = substanceCode; 
						}else{
							res.json({"err_code": 1, "err_msg": "Substance Code is empty."});
						}
					}

					if(typeof instanceId !== 'undefined'){
						if(!validator.isEmpty(instanceId)){
							qString.instance = instanceId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Instance ID is empty."});
						}
					}

					if(typeof instanceExpiry !== 'undefined'){
						if(!validator.isEmpty(instanceExpiry)){
							qString.expiry = instanceExpiry; 
						}else{
							res.json({"err_code": 1, "err_msg": "Instance expiry is empty."});
						}
					}

					if(typeof instanceQuantity !== 'undefined'){
						if(!validator.isEmpty(instanceQuantity)){
							qString.quantity = instanceQuantity; 
						}else{
							res.json({"err_code": 1, "err_msg": "Instance quantity is empty."});
						}
					}

					if(typeof substanceStatus !== 'undefined'){
						if(!validator.isEmpty(substanceStatus)){
							qString.status = substanceStatus; 
						}else{
							res.json({"err_code": 1, "err_msg": "Substance status is empty."});
						}
					}

					seedPhoenixFHIR.path.GET = {
						"Substance" : {
							"location": "%(apikey)s/substance",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('Substance', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var substance = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(substance.err_code == 0){
								  	//cek jumdata dulu
								  	if(substance.data.length > 0){
								  		newSubstance = [];
								  		for(i=0; i < substance.data.length; i++){
								  			myEmitter.prependOnceListener("getInstance", function(substance, index, newSubstance, countSubstance){
									  			qString = {};
									  			qString.substance_id = substance.id;
										  		seedPhoenixFHIR.path.GET = {
														"SubstanceInstance" : {
															"location": "%(apikey)s/substance-instance",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get("SubstanceInstance", {"apikey": apikey}, {}, function(error, response, body){
														substanceInstance = JSON.parse(body);
														if(substanceInstance.err_code == 0){
															var objectSubstance = {};
															objectSubstance.resourceType = substance.resourceType;
															objectSubstance.id = substance.id;
															objectSubstance.status = substance.status;
															objectSubstance.category = substance.category;
															objectSubstance.code = substance.code;
															objectSubstance.description = substance.description;
															objectSubstance.instance = substanceInstance.data;
															
															newSubstance[index] = objectSubstance;

															myEmitter.prependOnceListener("getIngredient", function(substance, index, newSubstance, countSubstance){
																//get identifier
												  			qString = {};
												  			qString.substance_id = substance.id;
													  		seedPhoenixFHIR.path.GET = {
																	"SubstanceIngredient" : {
																		"location": "%(apikey)s/substance-ingredient",
																		"query": qString
																	}
																}
																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																ApiFHIR.get('SubstanceIngredient', {"apikey": apikey}, {}, function(error, response, body){
																	substanceIngredient = JSON.parse(body);
																	if(substanceIngredient.err_code == 0){
																		var objectSubstance = {};
																		objectSubstance.resourceType = substance.resourceType;
																		objectSubstance.id = substance.id;
																		objectSubstance.status = substance.status;
																		objectSubstance.category = substance.category;
																		objectSubstance.code = substance.code;
																		objectSubstance.description = substance.description;
																		objectSubstance.instance = substance.instance;
																		objectSubstance.ingredient = substanceIngredient.data;
																		
																		newSubstance[index] = objectSubstance;

																		if(index == countSubstance -1 ){
																			res.json({"err_code": 0, "data":newSubstance});				
																		}
																	}else{
																		res.json(substanceIngredient);
																	}
																})
															})
															myEmitter.emit("getIngredient", objectSubstance, index, newSubstance, countSubstance);
														}else{
															res.json(substanceInstance);
														}
													})
								  			})
												myEmitter.emit("getInstance", substance.data[i], i, newSubstance, substance.data.length);
								  		}
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Substance is empty."});	
								  	}
							  	}else{
							  		res.json(substance);
							  	}
							  }
							});
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				substanceInstance: function getSubstanceInstance(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					qString = {};
					//params from query string
					var substanceId = req.params.substance_id;
					var instanceId = req.params.instance_id;

					if(typeof substanceId !== 'undefined'){
						if(!validator.isEmpty(substanceId)){
							qString.substance_id = substanceId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Substance ID is required."})
						}
					}
					
					if(typeof instanceId !== 'undefined'){
						if(!validator.isEmpty(instanceId)){
							qString._id = instanceId; 
						}
					}
					
					

					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							seedPhoenixFHIR.path.GET = {
								"SubstanceInstance" : {
									"location": "%(apikey)s/substance-instance",
									"query": qString
								}
							}
							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

							ApiFHIR.get("SubstanceInstance", {"apikey": apikey}, {}, function(error, response, body){
								substanceInstance = JSON.parse(body);
								if(substanceInstance.err_code == 0){
									res.json({"err_code": 0, "data":substanceInstance.data});
								}else{
									res.json(substanceInstance);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				substanceIngredient: function getSubstanceIngredient(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					qString = {};
					//params from query string
					var substanceId = req.params.substance_id;
					var ingredientId = req.params.ingredient_id;

					if(typeof substanceId !== 'undefined'){
						if(!validator.isEmpty(substanceId)){
							qString.substance_id = substanceId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Substance ID is required."})
						}
					}
					
					if(typeof ingredientId !== 'undefined'){
						if(!validator.isEmpty(ingredientId)){
							qString._id = ingredientId; 
						}
					}
		
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							seedPhoenixFHIR.path.GET = {
								"SubstanceIngredient" : {
									"location": "%(apikey)s/substance-ingredient",
									"query": qString
								}
							}
							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

							ApiFHIR.get('SubstanceIngredient', {"apikey": apikey}, {}, function(error, response, body){
								substanceIngredient = JSON.parse(body);
								if(substanceIngredient.err_code == 0){
									res.json({"err_code": 0, "data":substanceIngredient.data});				
								}else{
									res.json(substanceIngredient);
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
				substance: function addSubstance(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";

					//input check
					if(typeof req.body.status !== 'undefined'){
						var substanceStatus = req.body.status;
						if(validator.isEmpty(req.body.status)){
							err_code = 2;
							err_msg = "Status is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'status' in json request."
					}

					if(typeof req.body.category !== 'undefined'){
						var substanceCategory = req.body.category;
						if(validator.isEmpty(req.body.category)){
							err_code = 2;
							err_msg = "Category is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'category' in json request."
					}

					if(typeof req.body.code !== 'undefined'){
						var substanceCode = req.body.code;
						if(validator.isEmpty(req.body.code)){
							err_code = 2;
							err_msg = "Substance code is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'code' in json request."
					}

					if(typeof req.body.description !== 'undefined'){
						var substanceDescription = req.body.description;
						if(validator.isEmpty(req.body.description)){
							err_code = 2;
							err_msg = "Description is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'description' in json request."
					}

					if(typeof req.body.instance !== 'undefined'){
						var instance = req.body.instance;
						if(typeof instance.expiry !== 'undefined'){
							var instanceExpiry = instance.expiry;
							if(validator.isEmpty(instance.expiry)){
								err_code = 2;
								err_msg = "Instance expiry is required."
							}else{
								if(!regex.test(instanceExpiry)){
									err_code = 2;
									err_msg = "Instance expiry invalid format date."
								}
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'expiry' in instance json request."
						}

						if(typeof instance.low !== 'undefined'){
							var quantityLow = instance.low;
							if(!validator.isInt(instance.low)){
								err_code = 2;
								err_msg = "Quanity low is number."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'low' in instance json request."
						}

						if(typeof instance.high !== 'undefined'){
							var quantityHigh = instance.high;
							if(!validator.isInt(instance.high)){
								err_code = 2;
								err_msg = "Quanity high is number."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'high' in instance json request."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'instance' in json request."
					}

					if(typeof req.body.ingredient !== 'undefined'){
						var ingredient = req.body.ingredient;
						if(typeof ingredient.numerator !== 'undefined'){
							var ingredientNumerator = ingredient.numerator;
							if(!validator.isInt(ingredient.numerator)){
								err_code = 2;
								err_msg = "Numerator is number."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'numerator' in ingredient json request."
						}

						if(typeof ingredient.denominator !== 'undefined'){
							var ingredientDenominator = ingredient.denominator;
							if(!validator.isInt(ingredient.denominator)){
								err_code = 2;
								err_msg = "Denominator is number."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'denominator' in ingredient json request."
						}

						if(typeof ingredient.code !== 'undefined'){
							var ingredientCode = ingredient.code;
							if(validator.isEmpty(ingredient.code)){
								err_code = 2;
								err_msg = "Ingredient code is required."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'code' in ingredient json request."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'ingredient' in json request."
					}
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkCode(apikey, substanceStatus, 'SUBSTANCE_STATUS', function(resSubstanceStatusCode){
									if(resSubstanceStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, substanceCategory, 'SUBSTANCE_CATEGORY', function(resSubstanceCategoryCode){
											if(resSubstanceCategoryCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, substanceCode, 'SUBSTANCE_CODE', function(resSubstanceCode){
													if(resSubstanceCode.err_code > 0){
														checkCode(apikey, ingredientCode, 'SUBSTANCE_CODE', function(resIngredientCode){
															if(resIngredientCode.err_code > 0){
																//add Substance
																var substanceId = 'sub' + uniqid.time();
																var instanceId = 'ins' + uniqid.time();
																var ingredientId = 'ing' + uniqid.time();

																var dataSubstance = {
																									"id": substanceId,
																									"status": substanceStatus,
																									"category": substanceCategory,
																									"code" : substanceCode,
																									"description" : substanceDescription
																								}
																
																//method, endpoint, params, options, callback
																ApiFHIR.post('substance', {"apikey": apikey}, {body: dataSubstance, json:true}, function(error, response, body){	
															  	var substance = body; //object
															  	//cek apakah ada error atau tidak
															  	if(substance.err_code > 0){
															  		res.json(substance);	
															  	}
																})

																var dataInstance = {
																											"id": instanceId,
																											"expiry": instanceExpiry,
																											"low": quantityLow,
																											"high": quantityHigh,
																											"substance_id": substanceId
																										}

																ApiFHIR.post('substanceInstance', {"apikey": apikey}, {body: dataInstance, json:true}, function(error, response, body){	
															  	var substanceInstance = body; //object
															  	//cek apakah ada error atau tidak
															  	if(substanceInstance.err_code > 0){
															  		res.json(substanceInstance);	
															  	}
																})

																var dataIngredient = {
																											"id": ingredientId,
																											"numerator": ingredientNumerator,
																											"denominator": ingredientDenominator,
																											"code": ingredientCode,
																											"substance_id": substanceId
																										}

																ApiFHIR.post('substanceIngredient', {"apikey": apikey}, {body: dataIngredient, json:true}, function(error, response, body){	
															  	var substanceIngredient = body; //object
															  	//cek apakah ada error atau tidak
															  	if(substanceIngredient.err_code > 0){
															  		res.json(substanceIngredient);	
															  	}
																})				

																res.json({"err_code": 0, "err_msg": "Substance has been add.", "data": [{"_id": substanceId}]});
															}else{
																res.json({"err_code": 508, "err_msg": "Ingredient code not found"});								
															}
														})
													}else{
														res.json({"err_code": 502, "err_msg": "Substance code not found"});		
													}
												})
											}else{
												res.json({"err_code": 501, "err_msg": "Substance Category code not found"});		
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Substance Status code not found"});		
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
				substanceInstance: function addSubstanceInstance(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var substanceId = req.params.substance_id;

					var err_code = 0;
					var err_msg = "";


					if(typeof substanceId !== 'undefined'){
						if(validator.isEmpty(substanceId)){
							err_code = 2;
							err_msg = "Substance ID is required."
						}
					}else{
						err_code = 1;
						err_msg = "Substance ID is required."
					}

					if(typeof req.body.expiry !== 'undefined'){
						var instanceExpiry = req.body.expiry;
						if(validator.isEmpty(req.body.expiry)){
							err_code = 2;
							err_msg = "Instance expiry is required."
						}else{
							if(!regex.test(instanceExpiry)){
								err_code = 2;
								err_msg = "Instance expiry invalid format date."
							}
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'expiry' in json request."
					}

					if(typeof req.body.low !== 'undefined'){
						var quantityLow = req.body.low;
						if(!validator.isInt(req.body.low)){
							err_code = 2;
							err_msg = "Quanity low is number."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'low' in json request."
					}

					if(typeof req.body.high !== 'undefined'){
						var quantityHigh = req.body.high;
						if(!validator.isInt(req.body.high)){
							err_code = 2;
							err_msg = "Quanity high is number."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'high' in json request."
					}

				
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkUniqeValue(apikey, "SUBSTANCE_ID|" + substanceId, 'SUBSTANCE', function(resSubstanceID){
									if(resSubstanceID.err_code > 0){
										var instanceId = 'ins' + uniqid.time();
										var dataInstance = {
																					"id": instanceId,
																					"expiry": instanceExpiry,
																					"low": quantityLow,
																					"high": quantityHigh,
																					"substance_id": substanceId
																				}

										ApiFHIR.post('substanceInstance', {"apikey": apikey}, {body: dataInstance, json:true}, function(error, response, body){	
									  	var substanceInstance = body; //object
									  	//cek apakah ada error atau tidak
									  	if(substanceInstance.err_code == 0){
									  		res.json({"err_code": 0, "err_msg": "Instance has been add.", "data": [{"_id": instanceId}]});
									  	}else{
									  		res.json(substanceInstance);	
									  	}
										})	
									}else{
										res.json({"err_code": 501, "err_msg": "Substance Id not found"});				
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
				substanceIngredient: function addSubstanceIngredient(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var substanceId = req.params.substance_id;

					var err_code = 0;
					var err_msg = "";


					if(typeof substanceId !== 'undefined'){
						if(validator.isEmpty(substanceId)){
							err_code = 2;
							err_msg = "Substance ID is required."
						}
					}else{
						err_code = 1;
						err_msg = "Substance ID is required."
					}
					
					
					if(typeof req.body.numerator !== 'undefined'){
						var ingredientNumerator = req.body.numerator;
						if(!validator.isInt(req.body.numerator)){
							err_code = 2;
							err_msg = "Numerator is number."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'numerator' in json request."
					}

					if(typeof req.body.denominator !== 'undefined'){
						var ingredientDenominator = req.body.denominator;
						if(!validator.isInt(req.body.denominator)){
							err_code = 2;
							err_msg = "Denominator is number."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'denominator' in json request."
					}

					if(typeof req.body.code !== 'undefined'){
						var ingredientCode = req.body.code;
						if(validator.isEmpty(req.body.code)){
							err_code = 2;
							err_msg = "Ingredient code is required."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'code' in json request."
					}
				
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkUniqeValue(apikey, "SUBSTANCE_ID|" + substanceId, 'SUBSTANCE', function(resSubstanceID){
									if(resSubstanceID.err_code > 0){
										checkCode(apikey, ingredientCode, 'SUBSTANCE_CODE', function(resIngredientCode){
											if(resIngredientCode.err_code > 0){
												var ingredientId = 'ing' + uniqid.time();
												var dataIngredient = {
																							"id": ingredientId,
																							"numerator": ingredientNumerator,
																							"denominator": ingredientDenominator,
																							"code": ingredientCode,
																							"substance_id": substanceId
																						}

												ApiFHIR.post('substanceIngredient', {"apikey": apikey}, {body: dataIngredient, json:true}, function(error, response, body){	
											  	var substanceIngredient = body; //object
											  	//cek apakah ada error atau tidak
											  	if(substanceIngredient.err_code == 0){
											  		res.json({"err_code": 0, "err_msg": "Ingredient has been add.", "data": [{"_id": ingredientId}]});
											  	}else{
											  		res.json(substanceIngredient);	
											  	}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Ingredient Code not found"});				
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Substance Id not found"});				
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
				substance: function updateSubstance(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var substanceId = req.params.substance_id;

					var err_code = 0;
					var err_msg = "";

					var dataSubstance = {};

					if(typeof substanceId !== 'undefined'){
						if(validator.isEmpty(substanceId)){
							err_code = 2;
							err_msg = "Substance id is required."
						}
					}else{
						err_code = 1;
						err_msg = "Substance id is required."
					}

					//input check
					if(typeof req.body.status !== 'undefined'){
						var substanceStatus = req.body.status;
						if(validator.isEmpty(req.body.status)){
							err_code = 2;
							err_msg = "Status is required."
						}else{
							dataSubstance.status = substanceStatus;
						}
					}else{
						substanceStatus = "";
					}

					if(typeof req.body.category !== 'undefined'){
						var substanceCategory = req.body.category;
						if(validator.isEmpty(req.body.category)){
							err_code = 2;
							err_msg = "Category is required."
						}else{
							dataSubstance.category = substanceCategory;
						}
					}else{
						substanceCategory = "";
					}

					if(typeof req.body.code !== 'undefined'){
						var substanceCode = req.body.code;
						if(validator.isEmpty(req.body.code)){
							err_code = 2;
							err_msg = "Substance code is required."
						}else{
							dataSubstance.code = substanceCode;
 						}
					}else{
						substanceCode = "";
					}

					if(typeof req.body.description !== 'undefined'){
						var substanceDescription = req.body.description;
						if(validator.isEmpty(req.body.description)){
							err_code = 2;
							err_msg = "Description is required."
						}else{
							dataSubstance.description = substanceDescription;
						}
					}
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	

								myEmitter.prependOnceListener('updateSubstance', function(){
									//method, endpoint, params, options, callback
									ApiFHIR.put('substance', {"apikey": apikey, "_id": substanceId}, {body: dataSubstance, json:true}, function(error, response, body){	
								  	var substance = body; //object
								  	//cek apakah ada error atau tidak
								  	if(substance.err_code == 0){
								  		res.json({"err_code": 0, "err_msg": "Substance has been update.", "data": [{"_id": substanceId}]});
								  	}else{
								  		res.json(substance);	
								  	}
									})
								})

								myEmitter.prependOnceListener('checkSubstanceID', function(){
									if(validator.isEmpty(substanceId)){
										myEmitter.emit('updateSubstance');
									}else{
										checkUniqeValue(apikey, "SUBSTANCE_ID|" + substanceId, 'SUBSTANCE', function(resSubstanceID){
											if(resSubstanceID.err_code > 0){
												myEmitter.emit('updateSubstance');
											}else{
												res.json({"err_code": 504, "err_msg": "Substance ID not found"});		
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkSubstanceCode', function(){
									if(validator.isEmpty(substanceCode)){
										myEmitter.emit('checkSubstanceID');
									}else{
										checkCode(apikey, substanceCode, 'SUBSTANCE_CODE', function(resSubstanceCode){
											if(resSubstanceCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkSubstanceID');
											}else{
												res.json({"err_code": 503, "err_msg": "Substance code not found"});
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkSubstanceCategoryCode', function(){
									if(validator.isEmpty(substanceCategory)){
										myEmitter.emit('checkSubstanceCode');
									}else{
										checkCode(apikey, substanceCategory, 'SUBSTANCE_CATEGORY', function(resSubstanceCategoryCode){
											if(resSubstanceCategoryCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkSubstanceCode');
											}else{
												res.json({"err_code": 502, "err_msg": "Category code not found"});
											}
										})
									}									
								})

								if(validator.isEmpty(substanceStatus)){
									myEmitter.emit('checkSubstanceCategoryCode');
								}else{
									checkCode(apikey, substanceStatus, 'SUBSTANCE_STATUS', function(resSubstanceStatusCode){
										if(resSubstanceStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkSubstanceCategoryCode');
										}else{
											res.json({"err_code": 501, "err_msg": "Status code not found"});
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
				substanceInstance: function updateSubstanceInstance(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var substanceId = req.params.substance_id;
					var instanceId = req.params.instance_id;

					var err_code = 0;
					var err_msg = "";

					var dataInstance = {};

					//input check 
					if(typeof substanceId !== 'undefined'){
						if(validator.isEmpty(substanceId)){
							err_code = 2;
							err_msg = "Substance id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Substance id is required";
					}

					if(typeof instanceId !== 'undefined'){
						if(validator.isEmpty(instanceId)){
							err_code = 2;
							err_msg = "Instance id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Instance id is required";
					}

					if(typeof req.body.expiry !== 'undefined'){
						var instanceExpiry = req.body.expiry;
						if(validator.isEmpty(req.body.expiry)){
							err_code = 2;
							err_msg = "Instance expiry is required."
						}else{
							if(!regex.test(instanceExpiry)){
								err_code = 2;
								err_msg = "Instance expiry invalid format date."
							}else{
								dataInstance.expiry = instanceExpiry;
							}
						}
					}

					if(typeof req.body.low !== 'undefined'){
						var quantityLow = req.body.low;
						if(!validator.isInt(req.body.low)){
							err_code = 2;
							err_msg = "Quanity low is number."
						}else{
							dataInstance.low = quantityLow;
						}
					}

					if(typeof req.body.high !== 'undefined'){
						var quantityHigh = req.body.high;
						if(!validator.isInt(req.body.high)){
							err_code = 2;
							err_msg = "Quanity high is number."
						}else{
							dataInstance.high = quantityHigh;
						}
					}
				
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkUniqeValue(apikey, "SUBSTANCE_ID|" + substanceId, 'SUBSTANCE', function(resSubstanceID){
									if(resSubstanceID.err_code > 0){
										checkUniqeValue(apikey, "SUBSTANCE_INSTANCE_ID|" + instanceId, 'SUBSTANCE_INSTANCE', function(resSubstanceInstanceID){
											if(resSubstanceInstanceID.err_code > 0){
												ApiFHIR.put('substanceInstance', {"apikey": apikey, "_id": instanceId, "dr": "SUBSTANCE_ID|"+substanceId}, {body: dataInstance, json:true}, function(error, response, body){	
											  	var substanceInstance = body; //object
											  	//cek apakah ada error atau tidak
											  	if(substanceInstance.err_code == 0){
											  		res.json({"err_code": 0, "err_msg": "Instance has been update.", "data": [{"_id": instanceId}]});
											  	}else{
											  		res.json(substanceInstance);	
											  	}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Instance ID not found"});				
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Substance ID not found"});				
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
				substanceIngredient: function updateSubstanceIngredient(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var substanceId = req.params.substance_id;
					var ingredientId = req.params.ingredient_id;

					var err_code = 0;
					var err_msg = "";

					var dataIngredient = {};

					//input check 
					if(typeof substanceId !== 'undefined'){
						if(validator.isEmpty(substanceId)){
							err_code = 2;
							err_msg = "Substance id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Substance id is required";
					}

					if(typeof ingredientId !== 'undefined'){
						if(validator.isEmpty(ingredientId)){
							err_code = 2;
							err_msg = "Ingredient id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Ingredient id is required";
					}

					if(typeof req.body.numerator !== 'undefined'){
						var ingredientNumerator = req.body.numerator;
						if(!validator.isInt(req.body.numerator)){
							err_code = 2;
							err_msg = "Numerator is number."
						}else{
							dataIngredient.numerator = ingredientNumerator;
						}
					}

					if(typeof req.body.denominator !== 'undefined'){
						var ingredientDenominator = req.body.denominator;
						if(!validator.isInt(req.body.denominator)){
							err_code = 2;
							err_msg = "Denominator is number."
						}else{
							dataIngredient.denominator = ingredientDenominator;
						}
					}

					if(typeof req.body.code !== 'undefined'){
						var ingredientCode = req.body.code;
						if(validator.isEmpty(req.body.code)){
							err_code = 2;
							err_msg = "Ingredient code is required."
						}else{
							dataIngredient.code = ingredientCode;
						}
					}else{
						ingredientCode = "";
					}
				
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkUniqeValue(apikey, "SUBSTANCE_ID|" + substanceId, 'SUBSTANCE', function(resSubstanceID){
									if(resSubstanceID.err_code > 0){
										checkUniqeValue(apikey, "SUBSTANCE_INGREDIENT_ID|" + ingredientId, 'SUBSTANCE_INGREDIENT', function(resSubstanceIngredientID){
											myEmitter.prependOnceListener('updateIngredient', function(){
													ApiFHIR.put('substanceIngredient', {"apikey": apikey, "_id": ingredientId, "dr": "SUBSTANCE_ID|"+substanceId}, {body: dataIngredient, json:true}, function(error, response, body){	
											  	var substanceIngredient = body; //object
											  	//cek apakah ada error atau tidak
											  	if(substanceIngredient.err_code == 0){
											  		res.json({"err_code": 0, "err_msg": "Ingredient has been update.", "data": [{"_id": ingredientId}]});
											  	}else{
											  		res.json(substanceIngredient);	
											  	}
												})
											})

											if(resSubstanceIngredientID.err_code > 0){
												if(validator.isEmpty(ingredientCode)){
													myEmitter.emit('updateIngredient');
												}else{
													checkCode(apikey, ingredientCode, 'SUBSTANCE_CODE', function(resIngredientCode){
														if(resIngredientCode.err_code > 0){
															myEmitter.emit('updateIngredient');
														}else{
															res.json({"err_code": 503, "err_msg": "Ingredient Code not found"});							
														}
													})
												}
											}else{
												res.json({"err_code": 502, "err_msg": "Ingredient ID not found"});				
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Substance ID not found"});				
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