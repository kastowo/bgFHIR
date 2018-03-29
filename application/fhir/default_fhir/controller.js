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
		get:{
			identityAssuranceLevel: function getIdentityAssuranceLevel(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('identityAssuranceLevel', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getIdentityAssuranceLevel"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var assuranceLevel = JSON.parse(body); 
								  	//cek apakah ada error atau tidak
								  	if(assuranceLevel.err_code == 0){
									  	//cek jumdata dulu
									  	if(assuranceLevel.data.length > 0){
									  		res.json({"err_code": 0, "data":assuranceLevel.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Identity Assurance Level is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": assuranceLevel.error, "application": "Api FHIR", "function": "getIdentityAssuranceLevel"});
								  	}
								  }
							})
						}else{
							if(validator.isInt(_id)){
								//method, endpoint, params, options, callback
								ApiFHIR.get('identityAssuranceLevel', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getIdentityAssuranceLevel"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var assuranceLevel = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(assuranceLevel.err_code == 0){
										  	//cek jumdata dulu
										  	if(assuranceLevel.data.length > 0){
										  		res.json({"err_code": 0, "data":assuranceLevel.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Identity Assurance Level is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": assuranceLevel.error, "application": "Api FHIR", "function": "getIdentityAssuranceLevel"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});	
							}
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			identityAssuranceLevelCode: function getIdentityAssuranceLevelCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Code is required."});		
				}else{
					checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){			
						//method, endpoint, params, options, callback
						ApiFHIR.get('identityAssuranceLevelCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getIdentityAssuranceLevelCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var assuranceLevel = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(assuranceLevel.err_code == 0){
								  	//cek jumdata dulu
								  	if(assuranceLevel.data.length > 0){
								  		res.json({"err_code": 0, "data":assuranceLevel.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Identity Assurance Level Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": assuranceLevel.error, "application": "Api FHIR", "function": "getIdentityAssuranceLevelCode"});
							  	}
							  }
						})
					
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
				}
			},
			administrativeGender: function getAdministrativeGender(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('administrativeGender', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAdministrativeGender"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var administrativeGender = JSON.parse(body); 
								  	//cek apakah ada error atau tidak
								  	if(administrativeGender.err_code == 0){
									  	//cek jumdata dulu
									  	if(administrativeGender.data.length > 0){
									  		res.json({"err_code": 0, "data":administrativeGender.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Administrative Gender is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": administrativeGender.error, "application": "Api FHIR", "function": "getAdministrativeGender"});
								  	}
								  }
							})
						}else{
							if(validator.isInt(_id)){
								//method, endpoint, params, options, callback
								ApiFHIR.get('administrativeGender', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAdministrativeGender"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var administrativeGender = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(administrativeGender.err_code == 0){
										  	//cek jumdata dulu
										  	if(administrativeGender.data.length > 0){
										  		res.json({"err_code": 0, "data":administrativeGender.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Administrative Gender is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": administrativeGender.error, "application": "Api FHIR", "function": "getAdministrativeGender"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});	
							}
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			administrativeGenderCode: function getAdministrativeGenderCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//method, endpoint, params, options, callback
							ApiFHIR.get('administrativeGenderCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAdministrativeGenderCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var administrativeGender = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(administrativeGender.err_code == 0){
									  	//cek jumdata dulu
									  	if(administrativeGender.data.length > 0){
									  		res.json({"err_code": 0, "data":administrativeGender.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Administrative Gender Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": administrativeGender.error, "application": "Api FHIR", "function": "getAdministrativeGender"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			maritalStatus: function getMaritalStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('maritalStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMaritalStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var maritalStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(maritalStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(maritalStatus.data.length > 0){
									  		for(i=0; i < maritalStatus.data.length; i++ ){
									  			maritalStatus.data[i].system = host+ ':' + port + '/' + apikey + '/' + maritalStatus.data[i].system;
									  		}
									  		res.json({"err_code": 0, "data":maritalStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Marital Status is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": maritalStatus.error, "application": "Api FHIR", "function": "getMaritalStatus"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('maritalStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMaritalStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var maritalStatus = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(maritalStatus.err_code == 0){
										  	//cek jumdata dulu
										  	if(maritalStatus.data.length > 0){
										  		maritalStatus.data[0].system = host+ ':' + port + '/' + apikey + '/' + maritalStatus.data[0].system;
										  		res.json({"err_code": 0, "data":maritalStatus.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Marital Status is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": maritalStatus.error, "application": "Api FHIR", "function": "getMaritalStatus"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			maritalStatusCode: function getMaritalStatusCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});			
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('maritalStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMaritalStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var maritalStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(maritalStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(maritalStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":maritalStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Marital Status Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": maritalStatus.error, "application": "Api FHIR", "function": "getMaritalStatus"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}	
			},
			contactRole: function getContactRole(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('contactRole', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactRole"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var contactRole = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(contactRole.err_code == 0){
									  	//cek jumdata dulu
									  	if(contactRole.data.length > 0){
									  		res.json({"err_code": 0, "data":contactRole.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Contact Role is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": contactRole.error, "application": "Api FHIR", "function": "getContactRole"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('contactRole', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactRole"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var contactRole = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(contactRole.err_code == 0){
										  	//cek jumdata dulu
										  	if(contactRole.data.length > 0){
										  		res.json({"err_code": 0, "data":contactRole.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Contact Role is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": contactRole.error, "application": "Api FHIR", "function": "getContactRole"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			contactRoleCode: function getContactRoleCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('contactRoleCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactRoleCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var contactRole = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(contactRole.err_code == 0){
									  	//cek jumdata dulu
									  	if(contactRole.data.length > 0){
									  		res.json({"err_code": 0, "data":contactRole.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Contact Role Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": contactRole.error, "application": "Api FHIR", "function": "getContactRole"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			animalSpecies: function getAnimalSpecies(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('animalSpecies', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAnimalSpecies"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var animalSpecies = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(animalSpecies.err_code == 0){
									  	//cek jumdata dulu
									  	if(animalSpecies.data.length > 0){
									  		res.json({"err_code": 0, "data":animalSpecies.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Animal Species is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": animalSpecies.error, "application": "Api FHIR", "function": "getAnimalSpecies"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('animalSpecies', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAnimalSpecies"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var animalSpecies = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(animalSpecies.err_code == 0){
										  	//cek jumdata dulu
										  	if(animalSpecies.data.length > 0){
										  		res.json({"err_code": 0, "data":animalSpecies.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Animal Species is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": animalSpecies.error, "application": "Api FHIR", "function": "getAnimalSpecies"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			animalSpeciesCode: function getAnimalSpeciesCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('animalSpeciesCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAnimalSpeciesCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var animalSpecies = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(animalSpecies.err_code == 0){
									  	//cek jumdata dulu
									  	if(animalSpecies.data.length > 0){
									  		res.json({"err_code": 0, "data":animalSpecies.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Animal Species Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": animalSpecies.error, "application": "Api FHIR", "function": "getAnimalSpeciesCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			animalBreeds: function getAnimalBreeds(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('animalBreeds', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAnimalBreeds"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var animalBreeds = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(animalBreeds.err_code == 0){
									  	//cek jumdata dulu
									  	if(animalBreeds.data.length > 0){
									  		res.json({"err_code": 0, "data":animalBreeds.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Animal Breeds is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": animalBreeds.error, "application": "Api FHIR", "function": "getAnimalBreeds"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('animalBreeds', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAnimalBreeds"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var animalBreeds = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(animalBreeds.err_code == 0){
										  	//cek jumdata dulu
										  	if(animalBreeds.data.length > 0){
										  		res.json({"err_code": 0, "data":animalBreeds.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Animal Breeds is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": animalBreeds.error, "application": "Api FHIR", "function": "getAnimalBreeds"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			animalBreedsCode: function getAnimalBreedsCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('animalBreedsCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAnimalBreedsCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var animalBreeds = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(animalBreeds.err_code == 0){
									  	//cek jumdata dulu
									  	if(animalBreeds.data.length > 0){
									  		res.json({"err_code": 0, "data":animalBreeds.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Animal Breeds Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": animalBreeds.error, "application": "Api FHIR", "function": "getAnimalBreedsCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			animalGenderStatus: function getAnimalGenderStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('animalGenderStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAnimalGenderStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var animalGenderStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(animalGenderStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(animalGenderStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":animalGenderStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Animal Gender Status is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": animalGenderStatus.error, "application": "Api FHIR", "function": "getAnimalGenderStatus"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('animalGenderStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAnimalGenderStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var animalGenderStatus = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(animalGenderStatus.err_code == 0){
										  	//cek jumdata dulu
										  	if(animalGenderStatus.data.length > 0){
										  		res.json({"err_code": 0, "data":animalGenderStatus.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Animal Gender Status is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": animalGenderStatus.error, "application": "Api FHIR", "function": "getAnimalGenderStatus"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			animalGenderStatusCode: function getAnimalGenderStatusCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('animalGenderStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAnimalGenderStatusCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var animalGenderStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(animalGenderStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(animalGenderStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":animalGenderStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Animal Gender Status Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": animalGenderStatus.error, "application": "Api FHIR", "function": "getAnimalGenderStatusCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			languages: function getLanguages(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('languages', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLanguages"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var languages = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(languages.err_code == 0){
									  	//cek jumdata dulu
									  	if(languages.data.length > 0){
									  		res.json({"err_code": 0, "data":languages.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Languages is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": languages.error, "application": "Api FHIR", "function": "getLanguages"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('languages', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLanguages"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var languages = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(languages.err_code == 0){
										  	//cek jumdata dulu
										  	if(languages.data.length > 0){
										  		res.json({"err_code": 0, "data":languages.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Languages is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": languages.error, "application": "Api FHIR", "function": "getLanguages"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			languagesCode: function getLanguagesCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('languagesCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLanguagesCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var languages = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(languages.err_code == 0){
									  	//cek jumdata dulu
									  	if(languages.data.length > 0){
									  		res.json({"err_code": 0, "data":languages.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Languages code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": languages.error, "application": "Api FHIR", "function": "getLanguagesCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			linkType: function getLinkType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('linkType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLinkType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var linkType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(linkType.err_code == 0){
									  	//cek jumdata dulu
									  	if(linkType.data.length > 0){
									  		res.json({"err_code": 0, "data":linkType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Link Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": linkType.error, "application": "Api FHIR", "function": "getLinkType"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('linkType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLinkType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var linkType = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(linkType.err_code == 0){
										  	//cek jumdata dulu
										  	if(linkType.data.length > 0){
										  		res.json({"err_code": 0, "data":linkType.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Link Type is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": linkType.error, "application": "Api FHIR", "function": "getLinkType"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			linkTypeCode: function getLinkTypeCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('linkTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLinkTypeCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var linkType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(linkType.err_code == 0){
									  	//cek jumdata dulu
									  	if(linkType.data.length > 0){
									  		res.json({"err_code": 0, "data":linkType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Link Type code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": linkType.error, "application": "Api FHIR", "function": "getLinkTypeCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			relatedPersonRelationshipType: function getRelatedPersonRelationshipType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('relatedPersonRelationshipType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getRelatedPersonRelationshipType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var relatedPersonRelationshipType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(relatedPersonRelationshipType.err_code == 0){
									  	//cek jumdata dulu
									  	if(relatedPersonRelationshipType.data.length > 0){
									  		for(i=0; i < relatedPersonRelationshipType.data.length; i++ ){
									  			relatedPersonRelationshipType.data[i].system = host+ ':' + port + '/' + apikey + '/' + relatedPersonRelationshipType.data[i].system;
									  		}

									  		res.json({"err_code": 0, "data":relatedPersonRelationshipType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Related Person Relationship Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": relatedPersonRelationshipType.error, "application": "Api FHIR", "function": "getRelatedPersonRelationshipType"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('relatedPersonRelationshipType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getRelatedPersonRelationshipType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var relatedPersonRelationshipType = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(relatedPersonRelationshipType.err_code == 0){
										  	//cek jumdata dulu
										  	if(relatedPersonRelationshipType.data.length > 0){

									  			relatedPersonRelationshipType.data[0].system = host+ ':' + port + '/' + apikey + '/' + relatedPersonRelationshipType.data[0].system;
										  		
										  		res.json({"err_code": 0, "data":relatedPersonRelationshipType.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Related Person Relationship Type is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": relatedPersonRelationshipType.error, "application": "Api FHIR", "function": "getRelatedPersonRelationshipType"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			relatedPersonRelationshipTypeCode: function getRelatedPersonRelationshipTypeCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('relatedPersonRelationshipTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getRelatedPersonRelationshipTypeCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var relatedPersonRelationshipType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(relatedPersonRelationshipType.err_code == 0){
									  	//cek jumdata dulu
									  	if(relatedPersonRelationshipType.data.length > 0){
									  		res.json({"err_code": 0, "data":relatedPersonRelationshipType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Related Person Relationship Type Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": relatedPersonRelationshipType.error, "application": "Api FHIR", "function": "getRelatedPersonRelationshipTypeCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			groupType: function getGroupType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('groupType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getGroupType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var groupType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(groupType.err_code == 0){
									  	//cek jumdata dulu
									  	if(groupType.data.length > 0){
									  		res.json({"err_code": 0, "data":groupType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Group Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": groupType.error, "application": "Api FHIR", "function": "getGroupType"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('groupType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getGroupType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var groupType = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(groupType.err_code == 0){
										  	//cek jumdata dulu
										  	if(groupType.data.length > 0){
										  		res.json({"err_code": 0, "data":groupType.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Group Type is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": groupType.error, "application": "Api FHIR", "function": "getGroupType"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			groupTypeCode: function getGroupTypeCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('groupTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getGroupTypeCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var groupType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(groupType.err_code == 0){
									  	//cek jumdata dulu
									  	if(groupType.data.length > 0){
									  		res.json({"err_code": 0, "data":groupType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Group Type Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": groupType.error, "application": "Api FHIR", "function": "getGroupTypeCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			identifierUse: function getIdentifierUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('identifierUse', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getIdentifierUse"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var identifierUse = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(identifierUse.err_code == 0){
									  	//cek jumdata dulu
									  	if(identifierUse.data.length > 0){
									  		res.json({"err_code": 0, "data":identifierUse.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Identifier Use is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": identifierUse.error, "application": "Api FHIR", "function": "getIdentifierUse"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('identifierUse', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getIdentifierUse"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var identifierUse = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(identifierUse.err_code == 0){
										  	//cek jumdata dulu
										  	if(identifierUse.data.length > 0){
										  		res.json({"err_code": 0, "data":identifierUse.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Identifier Use is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": identifierUse.error, "application": "Api FHIR", "function": "getIdentifierUse"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			identifierUseCode: function getIdentifierUseCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('identifierUseCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getIdentifierUseCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var identifierUse = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(identifierUse.err_code == 0){
									  	//cek jumdata dulu
									  	if(identifierUse.data.length > 0){
									  		res.json({"err_code": 0, "data":identifierUse.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Identifier Use Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": identifierUse.error, "application": "Api FHIR", "function": "getIdentifierUseCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			identifierType: function getIdentifierType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('identifierType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getIdentifierType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var identifierType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(identifierType.err_code == 0){
									  	//cek jumdata dulu
									  	if(identifierType.data.length > 0){
									  		res.json({"err_code": 0, "data":identifierType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Identifier Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": identifierType.error, "application": "Api FHIR", "function": "getIdentifierType"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('identifierType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getIdentifierUse"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var identifierType = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(identifierType.err_code == 0){
										  	//cek jumdata dulu
										  	if(identifierType.data.length > 0){
										  		res.json({"err_code": 0, "data":identifierType.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Identifier Type is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": identifierType.error, "application": "Api FHIR", "function": "getIdentifierType"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			identifierTypeCode: function getIdentifierTypeCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').toUpperCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('identifierTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getIdentifierTypeCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var identifierType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(identifierType.err_code == 0){
									  	//cek jumdata dulu
									  	if(identifierType.data.length > 0){
									  		res.json({"err_code": 0, "data":identifierType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Identifier Type Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": identifierType.error, "application": "Api FHIR", "function": "getIdentifierTypeCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			nameUse: function getNameUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('nameUse', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getNameUse"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var nameUse = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(nameUse.err_code == 0){
									  	//cek jumdata dulu
									  	if(nameUse.data.length > 0){
									  		res.json({"err_code": 0, "data":nameUse.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Name Use is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": nameUse.error, "application": "Api FHIR", "function": "getNameUse"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('nameUse', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getNameUse"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var nameUse = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(nameUse.err_code == 0){
										  	//cek jumdata dulu
										  	if(nameUse.data.length > 0){
										  		res.json({"err_code": 0, "data":nameUse.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Name Use is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": nameUse.error, "application": "Api FHIR", "function": "getNameUse"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			nameUseCode: function getNameUseCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('nameUseCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getNameUseCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var nameUse = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(nameUse.err_code == 0){
									  	//cek jumdata dulu
									  	if(nameUse.data.length > 0){
									  		res.json({"err_code": 0, "data":nameUse.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Name Use Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": nameUse.error, "application": "Api FHIR", "function": "getNameUseCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			contactPointSystem: function getContactPointSystem(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('contactPointSystem', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactPointSystem"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var contactPointSystem = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(contactPointSystem.err_code == 0){
									  	//cek jumdata dulu
									  	if(contactPointSystem.data.length > 0){
									  		res.json({"err_code": 0, "data":contactPointSystem.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Contact Point System is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": contactPointSystem.error, "application": "Api FHIR", "function": "getContactPointSystem"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('contactPointSystem', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactPointSystem"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var contactPointSystem = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(contactPointSystem.err_code == 0){
										  	//cek jumdata dulu
										  	if(contactPointSystem.data.length > 0){
										  		res.json({"err_code": 0, "data":contactPointSystem.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Contact Point System is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": contactPointSystem.error, "application": "Api FHIR", "function": "getContactPointSystem"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			contactPointSystemCode: function getContactPointSystemCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('contactPointSystemCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactPointSystemCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var contactPointSystem = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(contactPointSystem.err_code == 0){
									  	//cek jumdata dulu
									  	if(contactPointSystem.data.length > 0){
									  		res.json({"err_code": 0, "data":contactPointSystem.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Contact Point System Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": contactPointSystem.error, "application": "Api FHIR", "function": "getContactPointSystemCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			contactPointUse: function getContactPointUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('contactPointUse', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactPointUse"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var contactPointUse = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(contactPointUse.err_code == 0){
									  	//cek jumdata dulu
									  	if(contactPointUse.data.length > 0){
									  		res.json({"err_code": 0, "data":contactPointUse.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Contact Point Use is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": contactPointUse.error, "application": "Api FHIR", "function": "getContactPointUse"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('contactPointUse', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactPointUse"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var contactPointUse = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(contactPointUse.err_code == 0){
										  	//cek jumdata dulu
										  	if(contactPointUse.data.length > 0){
										  		res.json({"err_code": 0, "data":contactPointUse.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Contact Point Use is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": contactPointUse.error, "application": "Api FHIR", "function": "getContactPointUse"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			contactPointUseCode: function getContactPointUseCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('contactPointUseCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactPointUseCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var contactPointUse = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(contactPointUse.err_code == 0){
									  	//cek jumdata dulu
									  	if(contactPointUse.data.length > 0){
									  		res.json({"err_code": 0, "data":contactPointUse.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Contact Point Use Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": contactPointUse.error, "application": "Api FHIR", "function": "getContactPointUseCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			addressUse: function getAddressUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('addressUse', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAddressUse"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var addressUse = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(addressUse.err_code == 0){
									  	//cek jumdata dulu
									  	if(addressUse.data.length > 0){
									  		res.json({"err_code": 0, "data":addressUse.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Address Use is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": addressUse.error, "application": "Api FHIR", "function": "getAddressUse"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('addressUse', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAddressUse"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var addressUse = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(addressUse.err_code == 0){
										  	//cek jumdata dulu
										  	if(addressUse.data.length > 0){
										  		res.json({"err_code": 0, "data":addressUse.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Address Use is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": addressUse.error, "application": "Api FHIR", "function": "getAddressUse"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			addressUseCode: function getAddressUseCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('addressUseCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAddressUseCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var addressUse = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(addressUse.err_code == 0){
									  	//cek jumdata dulu
									  	if(addressUse.data.length > 0){
									  		res.json({"err_code": 0, "data":addressUse.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Address Use Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": addressUse.error, "application": "Api FHIR", "function": "getAddressUseCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			addressType: function getAddressType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('addressType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAddressType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var addressType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(addressType.err_code == 0){
									  	//cek jumdata dulu
									  	if(addressType.data.length > 0){
									  		res.json({"err_code": 0, "data":addressType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Address Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": addressType.error, "application": "Api FHIR", "function": "getAddressType"});
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('addressType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAddressType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var addressType = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(addressType.err_code == 0){
										  	//cek jumdata dulu
										  	if(addressType.data.length > 0){
										  		res.json({"err_code": 0, "data":addressType.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Address Type is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 3, "err_msg": addressType.error, "application": "Api FHIR", "function": "getAddressType"});
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			addressTypeCode: function getAddressTypeCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('addressTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAddressTypeCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var addressType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(addressType.err_code == 0){
									  	//cek jumdata dulu
									  	if(addressType.data.length > 0){
									  		res.json({"err_code": 0, "data":addressType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Address Type Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": addressType.error, "application": "Api FHIR", "function": "getAddressTypeCode"});
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			appointmentReasonCode: function getAppointmentReasonCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('appointmentReasonCode', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAppointmentReasonCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var appointmentReasonCode = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(appointmentReasonCode.err_code == 0){
									  	//cek jumdata dulu
									  	if(appointmentReasonCode.data.length > 0){
									  		res.json({"err_code": 0, "data":appointmentReasonCode.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Appointment Reason Code is not found"});	
									  	}
								  	}else{
								  		res.json(appointmentReasonCode);
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('appointmentReasonCode', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAppointmentReasonCode"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var appointmentReasonCode = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(appointmentReasonCode.err_code == 0){
										  	//cek jumdata dulu
										  	if(appointmentReasonCode.data.length > 0){
										  		res.json({"err_code": 0, "data":appointmentReasonCode.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Appointment Reason Code is not found"});	
										  	}
									  	}else{
									  		res.json(appointmentReasonCode);
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			appointmentReasonCodeCode: function getAppointmentReasonCodeCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('appointmentReasonCodeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAddressTypeCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var appointmentReasonCode = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(appointmentReasonCode.err_code == 0){
									  	//cek jumdata dulu
									  	if(appointmentReasonCode.data.length > 0){
									  		res.json({"err_code": 0, "data":appointmentReasonCode.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Appointment Reason Code is not found"});	
									  	}
								  	}else{
								  		res.json(appointmentReasonCode);
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			slotStatus: function getSlotStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('slotStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSlotStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var slotStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(slotStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(slotStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":slotStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Slot Status is not found"});	
									  	}
								  	}else{
								  		res.json(slotStatus);
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('slotStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSlotStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var slotStatus = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(slotStatus.err_code == 0){
										  	//cek jumdata dulu
										  	if(slotStatus.data.length > 0){
										  		res.json({"err_code": 0, "data":slotStatus.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Slot Status is not found"});	
										  	}
									  	}else{
									  		res.json(slotStatus);
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			slotStatusCode: function getSlotStatusCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('slotStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSlotStatusCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var slotStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(slotStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(slotStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":slotStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Slot Status Code is not found"});	
									  	}
								  	}else{
								  		res.json(slotStatus);
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			appointmentStatus: function getAppointmentStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('appointmentStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAppointmentStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var appointmentStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(appointmentStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(appointmentStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":appointmentStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Appointment Status is not found"});	
									  	}
								  	}else{
								  		res.json(appointmentStatus);
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('appointmentStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAppointmentStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var appointmentStatus = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(appointmentStatus.err_code == 0){
										  	//cek jumdata dulu
										  	if(appointmentStatus.data.length > 0){
										  		res.json({"err_code": 0, "data":appointmentStatus.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Appointment Status is not found"});	
										  	}
									  	}else{
									  		res.json(appointmentStatus);
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			appointmentStatusCode: function getAppointmentStatusCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('appointmentStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAppointmentStatusCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var appointmentStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(appointmentStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(appointmentStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":appointmentStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Appointment Status Code is not found"});	
									  	}
								  	}else{
								  		res.json(appointmentStatus);
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			participantRequired: function getParticipantRequired(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('participantRequired', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getParticipantRequired"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var participantRequired = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(participantRequired.err_code == 0){
									  	//cek jumdata dulu
									  	if(participantRequired.data.length > 0){
									  		res.json({"err_code": 0, "data":participantRequired.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Participant Required is not found"});	
									  	}
								  	}else{
								  		res.json(participantRequired);
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('participantRequired', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getParticipantRequired"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var participantRequired = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(participantRequired.err_code == 0){
										  	//cek jumdata dulu
										  	if(participantRequired.data.length > 0){
										  		res.json({"err_code": 0, "data":participantRequired.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Participant Required is not found"});	
										  	}
									  	}else{
									  		res.json(participantRequired);
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			participantRequiredCode: function getParticipantRequiredCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('appointmentStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getAppointmentStatusCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var appointmentStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(appointmentStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(appointmentStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":appointmentStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Participant Required Code is not found"});	
									  	}
								  	}else{
								  		res.json(appointmentStatus);
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			},
			participationStatus: function getParticipationStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(_id == "" || typeof _id == 'undefined'){
							//method, endpoint, params, options, callback
							ApiFHIR.get('participationStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getParticipationStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var participationStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(participationStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(participationStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":participationStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Participation Status is not found"});	
									  	}
								  	}else{
								  		res.json(participationStatus);
								  	}
								  }
							})	
						}else{
							if(validator.isInt(_id)){
								ApiFHIR.get('participationStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getParticipationStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var participationStatus = JSON.parse(body); 
									  	
									  	//cek apakah ada error atau tidak
									  	if(participationStatus.err_code == 0){
										  	//cek jumdata dulu
										  	if(participationStatus.data.length > 0){
										  		res.json({"err_code": 0, "data":participationStatus.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Participation Status is not found"});	
										  	}
									  	}else{
									  		res.json(participationStatus);
									  	}
									  }
								})
							}else{
								res.json({"err_code": 4, "err_msg": "Id must be a number."});
							}
							
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			},
			participationStatusCode: function getparticipationStatusCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

				if(code == "" || typeof code == 'undefined'){
					res.json({"err_code": 4, "err_msg": "Code is required."});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							ApiFHIR.get('participationStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getParticipationStatusCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var participationStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(participationStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(participationStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":participationStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Participant Status Code is not found"});	
									  	}
								  	}else{
								  		res.json(participationStatus);
								  	}
								  }
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
			}
		},
		post: {
			identityAssuranceLevel: function addIdentityAssuranceLevel(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 3;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'IDENTITY_ASSURANCE_LEVEL', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataAssuranceLevel = {
																"code": code,	
																"display": display,
																"definition": definition
															};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('identityAssuranceLevel', {"apikey": apikey}, {body: dataAssuranceLevel, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addIdentityAssuranceLevel"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var assuranceLevel = body; //object
										  	//cek apakah ada error atau tidak
										  	if(assuranceLevel.err_code == 0){  	
										  		res.json({"err_code": 0, "err_msg": "Identity assurance level has been add.", "data":assuranceLevel.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": assuranceLevel.error, "application": "Api FHIR", "function": "addIdentityAssuranceLevel"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			administrativeGender: function addAdministrativeGender(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 3;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'ADMINISTRATIVE_GENDER', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataAdministrativeGender = {
																"code": code,	
																"display": display,
																"definition": definition
															};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('administrativeGender', {"apikey": apikey}, {body: dataAdministrativeGender, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addAdministrativeGender"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var administrativeGender = body; //object
										  	//cek apakah ada error atau tidak
										  	if(administrativeGender.err_code == 0){  	
										  		res.json({"err_code": 0, "err_msg": "Administrative Gender has been add.", "data":administrativeGender.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": administrativeGender.error, "application": "Api FHIR", "function": "addAdministrativeGender"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			maritalStatus: function addMaritalStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toUpperCase();
				var display = req.body.display;
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				
				if(code == 'UNK'){
					var maritalSystem = 'null-flavor';	
				}else{
					var maritalSystem = 'marital-status';
				}
				

				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 3;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'MARITAL_STATUS', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataMaritalStatus = {
																"code": code,	
																"display": display,
																"definition": definition,
																"system": maritalSystem
															};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('maritalStatus', {"apikey": apikey}, {body: dataMaritalStatus, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addMaritalStatus"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var maritalStatus = body; //object
										  	//cek apakah ada error atau tidak
										  	if(maritalStatus.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Marital Status has been add.", "data":maritalStatus.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": maritalStatus.error, "application": "Api FHIR", "function": "addMaritalStatus"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			contactRole: function addContactRole(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toUpperCase();
				var description = req.body.description.replace(/[^\w\s ,]/gi, '');

				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(description)){
					err_code = 3;
					err_msg = "Description is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'CONTACT_ROLE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataContactRole = {
																"code": code,	
																"description": description
															};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('contactRole', {"apikey": apikey}, {body: dataContactRole, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addContactRole"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var contactRole = body; //object
										  	//cek apakah ada error atau tidak
										  	if(contactRole.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Contact Role has been add.", "data":contactRole.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": contactRole.error, "application": "Api FHIR", "function": "addContactRole"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			animalSpecies: function addAnimalSpecies(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim();
				var display = req.body.display.replace(/[^\w\s ,]/gi, '');

				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 3;
					err_msg = "Display is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'ANIMAL_SPECIES', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataAnimalSpecies = {
																"code": code,	
																"display": display
															};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('animalSpecies', {"apikey": apikey}, {body: dataAnimalSpecies, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addAnimalSpecies"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var animalSpecies = body; //object
										  	//cek apakah ada error atau tidak
										  	if(animalSpecies.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Animal Species has been add.", "data":animalSpecies.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": animalSpecies.error, "application": "Api FHIR", "function": "addAnimalSpecies"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			animalBreeds: function addAnimalBreeds(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim();
				var display = req.body.display.replace(/[^\w\s ,]/gi, '');

				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 3;
					err_msg = "Display is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'ANIMAL_BREEDS', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataAnimalBreeds = {
																"code": code,	
																"display": display
															};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('animalBreeds', {"apikey": apikey}, {body: dataAnimalBreeds, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addAnimalBreeds"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var animalBreeds = body; //object
										  	//cek apakah ada error atau tidak
										  	if(animalBreeds.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Animal Breeds has been add.", "data":animalBreeds.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": animalBreeds.error, "application": "Api FHIR", "function": "addAnimalBreeds"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			animalGenderStatus: function addAnimalGenderStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');

				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 3;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'ANIMAL_GENDER_STATUS', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataAnimalGenderStatus = {
																"code": code,	
																"display": display,
																"definition": definition
															};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('animalGenderStatus', {"apikey": apikey}, {body: dataAnimalGenderStatus, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addAnimalGenderStatus"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var animalGenderStatus = body; //object
										  	//cek apakah ada error atau tidak
										  	if(animalGenderStatus.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Animal Gender Status has been add.", "data":animalGenderStatus.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": animalGenderStatus.error, "application": "Api FHIR", "function": "addAnimalGenderStatus"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			languages: function addLanguages(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim();
				var display = req.body.display;
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'LANGUAGES', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataLanguages = {
															"code": code,	
															"display": display
														};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('languages', {"apikey": apikey}, {body: dataLanguages, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addLanguages"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var languages = body; //object
										  	//cek apakah ada error atau tidak
										  	if(languages.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Language has been add.", "data":languages.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": languages.error, "application": "Api FHIR", "function": "addLanguages"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			linkType: function addLinkType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition;
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'LINK_TYPE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataLinkType = {
															"code": code,	
															"display": display,
															"definition": definition
														};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('linkType', {"apikey": apikey}, {body: dataLinkType, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addLinkType"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var linkType = body; //object
										  	//cek apakah ada error atau tidak
										  	if(linkType.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Link Type has been add.", "data":linkType.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": linkType.error, "application": "Api FHIR", "function": "addLinkType"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			relatedPersonRelationshipType: function addRelatedPersonRelationshipType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toUpperCase();
				var display = req.body.display;
				var system  = 'relatedperson-relationshiptype';
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(typeof req.body.definition !== 'undefined'){
					definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');
				}else{
					definition = "";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'RELATEDPERSON_RELATIONSHIPTYPE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataRelatedPersonRelationshipType = {
															"code": code,	
															"system": system,
															"display": display,
															"definition": definition
														};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('relatedPersonRelationshipType', {"apikey": apikey}, {body: dataRelatedPersonRelationshipType, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addRelatedPersonRelationshipType"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var relatedPersonRelationshipType = body; //object
										  	//cek apakah ada error atau tidak
										  	if(relatedPersonRelationshipType.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Related Person Relationship Type has been add.", "data":relatedPersonRelationshipType.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": relatedPersonRelationshipType.error, "application": "Api FHIR", "function": "addRelatedPersonRelationshipType"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			groupType: function addGroupType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition;

				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'GROUP_TYPE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataGroupType = {
															"code": code,	
															"display": display,
															"definition": definition
														};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('groupType', {"apikey": apikey}, {body: dataGroupType, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addGroupType"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var groupType = body; //object
										  	//cek apakah ada error atau tidak
										  	if(groupType.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Group Type has been add.", "data":groupType.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": groupType.error, "application": "Api FHIR", "function": "addGroupType"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			identifierUse: function addIdentifierUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display.replace(/[^\w\s , ( )]/gi, '');;
				var definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');

				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'IDENTIFIER_USE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataIdentifierUse = {
															"code": code,	
															"display": display,
															"definition": definition
														};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('identifierUse', {"apikey": apikey}, {body: dataIdentifierUse, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addIdentifierUse"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var identifierUse = body; //object
										  	//cek apakah ada error atau tidak
										  	if(identifierUse.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Identifier Use has been add.", "data":identifierUse.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": identifierUse.error, "application": "Api FHIR", "function": "addIdentifierUse"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			identifierType: function addIdentifierType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toUpperCase();
				var display = req.body.display.replace(/[^\w\s , ( )]/gi, '');;
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'IDENTIFIER_TYPE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataIdentifierType = {
															"code": code,	
															"display": display
														};
									
									//method, endpoint, params, options, callback
									ApiFHIR.post('identifierType', {"apikey": apikey}, {body: dataIdentifierType, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addIdentifierType"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var identifierType = body; //object
										  	//cek apakah ada error atau tidak
										  	if(identifierType.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Identifier Type has been add.", "data":identifierType.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": identifierType.error, "application": "Api FHIR", "function": "addIdentifierType"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			nameUse: function addNameUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'NAME_USE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataNameUse = {
														"code": code,	
														"display": display,
														"definition": definition
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('nameUse', {"apikey": apikey}, {body: dataNameUse, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addNameUse"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var nameUse = body; //object
										  	//cek apakah ada error atau tidak
										  	if(nameUse.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Name Use has been add.", "data":nameUse.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": nameUse.error, "application": "Api FHIR", "function": "addNameUse"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			contactPointSystem: function addContactPointSystem(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'CONTACT_POINT_SYSTEM', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataContactPointSystem = {
														"code": code,	
														"display": display,
														"definition": definition
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('contactPointSystem', {"apikey": apikey}, {body: dataContactPointSystem, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addContactPointSystem"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var contactPointSystem = body; //object
										  	//cek apakah ada error atau tidak
										  	if(contactPointSystem.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Contact Point System has been add.", "data":contactPointSystem.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": contactPointSystem.error, "application": "Api FHIR", "function": "addContactPointSystem"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			contactPointUse: function addContactPointUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'CONTACT_POINT_USE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataContactPointUse = {
														"code": code,	
														"display": display,
														"definition": definition
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('contactPointUse', {"apikey": apikey}, {body: dataContactPointUse, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addContactPointUse"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var contactPointUse = body; //object
										  	//cek apakah ada error atau tidak
										  	if(contactPointUse.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Contact Point Use has been add.", "data":contactPointUse.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": contactPointUse.error, "application": "Api FHIR", "function": "addContactPointUse"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			addressUse: function addAddressUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'ADDRESS_USE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataAddressUse = {
														"code": code,	
														"display": display,
														"definition": definition
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('addressUse', {"apikey": apikey}, {body: dataAddressUse, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addAddressUse"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var addressUse = body; //object
										  	//cek apakah ada error atau tidak
										  	if(addressUse.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Address Use has been add.", "data":addressUse.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": addressUse.error, "application": "Api FHIR", "function": "addAddressUse"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			addressType: function addAddressType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display;
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'ADDRESS_TYPE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataAddressType = {
														"code": code,	
														"display": display,
														"definition": definition
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('addressType', {"apikey": apikey}, {body: dataAddressType, json:true}, function(error, response, body){
										if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addAddressType"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var addressType = body; //object
										  	//cek apakah ada error atau tidak
										  	if(addressType.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Address Type has been add.", "data":addressType.data});
										  	}else{
										  		res.json({"err_code": 3, "err_msg": addressType.error, "application": "Api FHIR", "function": "addAddressType"});
										  	}
										  }
									})
								}else{
									res.json(resultCode);
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
			appointmentReasonCode: function addAppointmentReasonCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toUpperCase();
				var description = req.body.description.replace(/[^\w\s , ( ) / .]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(description)){
					err_code = 2;
					err_msg = "Description is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'APPOINTMENT_REASON_CODE', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataAppointmentReasonCode = {
														"code": code,
														"description": description
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('appointmentReasonCode', {"apikey": apikey}, {body: dataAppointmentReasonCode, json:true}, function(error, response, body){
										if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addAppointmentReasonCode"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var appointmentReasonCode = body; //object
									  	//cek apakah ada error atau tidak
									  	if(appointmentReasonCode.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Appointment Reason Code has been add.", "data":appointmentReasonCode.data});
									  	}else{
									  		res.json(appointmentReasonCode);
									  	}
									  }
									})
								}else{
									res.json(resultCode);
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
			slotStatus: function addSlotStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'SLOT_STATUS', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataSlotStatus = {
														"code": code,
														"display": display,
														"definition": definition
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('slotStatus', {"apikey": apikey}, {body: dataSlotStatus, json:true}, function(error, response, body){
										if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addSlotStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var slotStatus = body; //object
									  	//cek apakah ada error atau tidak
									  	if(slotStatus.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Slot Status has been add.", "data":slotStatus.data});
									  	}else{
									  		res.json(slotStatus);
									  	}
									  }
									})
								}else{
									res.json(resultCode);
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
			appointmentStatus: function addAppointmentStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'APPOINTMENT_STATUS', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataAppointmentStatus = {
														"code": code,
														"display": display,
														"definition": definition
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('appointmentStatus', {"apikey": apikey}, {body: dataAppointmentStatus, json:true}, function(error, response, body){
										if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addAppointmentStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var appointmentStatus = body; //object
									  	//cek apakah ada error atau tidak
									  	if(appointmentStatus.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Appointment Status has been add.", "data":appointmentStatus.data});
									  	}else{
									  		res.json(appointmentStatus);
									  	}
									  }
									})
								}else{
									res.json(resultCode);
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
			participantRequired: function addParticipantRequired(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'PARTICIPANT_REQUIRED', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataParticipantRequired = {
														"code": code,
														"display": display,
														"definition": definition
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('participantRequired', {"apikey": apikey}, {body: dataParticipantRequired, json:true}, function(error, response, body){
										if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addParticipantRequired"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var participantRequired = body; //object
									  	//cek apakah ada error atau tidak
									  	if(participantRequired.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Participant Required has been add.", "data":participantRequired.data});
									  	}else{
									  		res.json(participantRequired);
									  	}
									  }
									})
								}else{
									res.json(resultCode);
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
			participationStatus: function addparticipationStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				
				var code = req.body.code.trim().toLowerCase();
				var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				
				var err_code = 0;
				var err_msg = '';
				
				//input checking
				if(validator.isEmpty(code)){
					err_code = 1;
					err_msg = "Code is required";
				}

				if(validator.isEmpty(display)){
					err_code = 2;
					err_msg = "Display is required";
				}

				if(validator.isEmpty(definition)){
					err_code = 2;
					err_msg = "Definition is required";
				}

				if(err_code == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkCode(apikey, code, 'PARTICIPATION_STATUS', function(resultCode){
								if(resultCode.err_code == 0){
									//susun body
									var dataparticipationStatus = {
														"code": code,
														"display": display,
														"definition": definition
													};
								
									//method, endpoint, params, options, callback
									ApiFHIR.post('participationStatus', {"apikey": apikey}, {body: dataparticipationStatus, json:true}, function(error, response, body){
										if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addparticipationStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var participationStatus = body; //object
									  	//cek apakah ada error atau tidak
									  	if(participationStatus.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Participant Status has been add.", "data":participationStatus.data});
									  	}else{
									  		res.json(participationStatus);
									  	}
									  }
									})
								}else{
									res.json(resultCode);
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
			identityAssuranceLevel: function updateIdentityAssuranceLevel(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataAssuranceLevel = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataAssuranceLevel.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					var display = req.body.display;
					dataAssuranceLevel.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
					dataAssuranceLevel.definition = definition;
				}


				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'IDENTITY_ASSURANCE_LEVEL', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'IDENTITY_ASSURANCE_LEVEL', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('identityAssuranceLevel', {"apikey": apikey, "_id": _id}, {body: dataAssuranceLevel, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateIdentityAssuranceLevel"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var assuranceLevel = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(assuranceLevel.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Identity Assurance has been update.","data":assuranceLevel.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": assuranceLevel.error, "application": "Api FHIR", "function": "updateIdentityAssuranceLevel"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('identityAssuranceLevel', {"apikey": apikey, "_id": _id}, {body: dataAssuranceLevel, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateIdentityAssuranceLevel"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var assuranceLevel = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(assuranceLevel.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Identity Assurance has been update.","data":assuranceLevel.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": assuranceLevel.error, "application": "Api FHIR", "function": "updateIdentityAssuranceLevel"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			administrativeGender: function updateAdministrativeGender(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataAdministrativeGender = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataAdministrativeGender.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					var display = req.body.display;
					dataAdministrativeGender.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
					dataAdministrativeGender.definition = definition;
				}


				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'ADMINISTRATIVE_GENDER', function(resultCheckId){
									if(resultCheckId == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'ADMINISTRATIVE_GENDER', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('administrativeGender', {"apikey": apikey, "_id": _id}, {body: dataAdministrativeGender, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAdministrativeGender"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var administrativeGender = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(administrativeGender.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Administrative Gender has been update.","data":administrativeGender.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": administrativeGender.error, "application": "Api FHIR", "function": "updateAdministrativeGender"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('administrativeGender', {"apikey": apikey, "_id": _id}, {body: dataAdministrativeGender, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAdministrativeGender"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var administrativeGender = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(administrativeGender.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Administrative Gender has been update.","data":administrativeGender.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": administrativeGender.error, "application": "Api FHIR", "function": "updateAdministrativeGender"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			maritalStatus: function updateMaritalStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;
				
				var dataMaritalStatus = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toUpperCase();
					dataMaritalStatus.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					var display = req.body.display;
					dataMaritalStatus.display = display;
				}

				if(typeof req.body.system !== 'undefined'){
					var system = req.body.system;
					dataMaritalStatus.system = system;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
					dataMaritalStatus.definition = definition;
				}


				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'MARITAL_STATUS', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'MARITAL_STATUS', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('maritalStatus', {"apikey": apikey, "_id": _id}, {body: dataMaritalStatus, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMaritalStatus"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var maritalStatus = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(maritalStatus.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Marital Status has been update.","data":maritalStatus.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": maritalStatus.error, "application": "Api FHIR", "function": "updateMaritalStatus"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('maritalStatus', {"apikey": apikey, "_id": _id}, {body: dataMaritalStatus, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMaritalStatus"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var maritalStatus = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(maritalStatus.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Marital Status has been update.","data":maritalStatus.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": maritalStatus.error, "application": "Api FHIR", "function": "updateMaritalStatus"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			contactRole: function updateContactRole(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataMaritalStatus = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toUpperCase();
					dataMaritalStatus.code = code;
				}

				if(typeof req.body.description !== 'undefined'){
					description = req.body.description.replace(/[^\w\s ,]/gi, '');
					dataMaritalStatus.description = description;
				}


				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'CONTACT_ROLE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'CONTACT_ROLE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('contactRole', {"apikey": apikey, "_id": _id}, {body: dataMaritalStatus, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateContactRole"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var contactRole = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(contactRole.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Contact Role has been update.","data":contactRole.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": contactRole.error, "application": "Api FHIR", "function": "updateContactRole"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('contactRole', {"apikey": apikey, "_id": _id}, {body: dataMaritalStatus, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateContactRole"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var contactRole = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(contactRole.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Contact Role has been update.","data":contactRole.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": contactRole.error, "application": "Api FHIR", "function": "updateContactRole"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			animalSpecies: function updateAnimalSpecies(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataAnimalSpecies = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim();
					dataAnimalSpecies.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display.replace(/[^\w\s ,]/gi, '');
					dataAnimalSpecies.display = display;
				}


				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'ANIMAL_SPECIES', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'ANIMAL_SPECIES', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('animalSpecies', {"apikey": apikey, "_id": _id}, {body: dataAnimalSpecies, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAnimalSpecies"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var animalSpecies = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(animalSpecies.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Animal Species has been update.","data":animalSpecies.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": animalSpecies.error, "application": "Api FHIR", "function": "updateAnimalSpecies"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('animalSpecies', {"apikey": apikey, "_id": _id}, {body: dataAnimalSpecies, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAnimalSpecies"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var animalSpecies = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(animalSpecies.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Animal Species has been update.","data":animalSpecies.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": animalSpecies.error, "application": "Api FHIR", "function": "updateAnimalSpecies"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			animalBreeds: function updateAnimalBreeds(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataAnimalBreeds = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim();
					dataAnimalBreeds.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;//.replace(/[^\w\s ,]/gi, '');
					dataAnimalBreeds.display = display;
				}


				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'ANIMAL_BREEDS', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'ANIMAL_BREEDS', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('animalBreeds', {"apikey": apikey, "_id": _id}, {body: dataAnimalBreeds, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAnimalBreeds"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var animalBreeds = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(animalBreeds.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Animal Breeds has been update.","data":animalBreeds.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": animalBreeds.error, "application": "Api FHIR", "function": "updateAnimalBreeds"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('animalBreeds', {"apikey": apikey, "_id": _id}, {body: dataAnimalBreeds, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAnimalBreeds"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var animalBreeds = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(animalBreeds.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Animal Breeds has been update.","data":animalBreeds.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": animalBreeds.error, "application": "Api FHIR", "function": "updateAnimalBreeds"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			animalGenderStatus: function updateAnimalGenderStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataAnimalGenderStatus = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataAnimalGenderStatus.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;//.replace(/[^\w\s ,]/gi, '');
					dataAnimalGenderStatus.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
					dataAnimalGenderStatus.definition = definition;
				}


				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'ANIMAL_GENDER_STATUS', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'ANIMAL_GENDER_STATUS', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('animalGenderStatus', {"apikey": apikey, "_id": _id}, {body: dataAnimalGenderStatus, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAnimalGenderStatus"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var animalGenderStatus = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(animalGenderStatus.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Animal Gender Status has been update.","data":animalGenderStatus.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": animalGenderStatus.error, "application": "Api FHIR", "function": "updateAnimalGenderStatus"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('animalGenderStatus', {"apikey": apikey, "_id": _id}, {body: dataAnimalGenderStatus, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAnimalGenderStatus"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var animalGenderStatus = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(animalGenderStatus.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Animal Breeds has been update.","data":animalGenderStatus.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": animalGenderStatus.error, "application": "Api FHIR", "function": "updateAnimalGenderStatus"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			languages: function updateLanguage(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataLanguages = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim();
					dataLanguages.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display.replace(/[^\w\s ,]/gi, '');
					dataLanguages.display = display;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'LANGUAGES', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'LANGUAGES', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('languages', {"apikey": apikey, "_id": _id}, {body: dataLanguages, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLanguage"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var languages = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(languages.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Language has been update.","data":languages.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": languages.error, "application": "Api FHIR", "function": "updateLanguage"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('languages', {"apikey": apikey, "_id": _id}, {body: dataLanguages, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLanguage"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var languages = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(languages.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Languages has been update.","data":languages.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": languages.error, "application": "Api FHIR", "function": "updateLanguage"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			linkType: function updateLinkType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataLinkType = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataLinkType.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display.replace(/[^\w\s ,]/gi, '');
					dataLinkType.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
					dataLinkType.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'LINK_TYPE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'LINK_TYPE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('linkType', {"apikey": apikey, "_id": _id}, {body: dataLinkType, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLinkType"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var linkType = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(linkType.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Link Type has been update.","data":linkType.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": linkType.error, "application": "Api FHIR", "function": "updateLinkType"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('linkType', {"apikey": apikey, "_id": _id}, {body: dataLinkType, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLinkType"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var linkType = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(linkType.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Link Type has been update.","data":linkType.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": linkType.error, "application": "Api FHIR", "function": "updateLinkType"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			relatedPersonRelationshipType: function updateRelatedPersonRelationshipType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataRelatedPersonRelationshipType = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toUpperCase();
					dataRelatedPersonRelationshipType.code = code;
				}

				if(typeof req.body.system !== 'undefined'){
					system = req.body.system.replace(/[^\w\s ,]/gi, '');
					dataRelatedPersonRelationshipType.system = system;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display.replace(/[^\w\s ,]/gi, '');
					dataRelatedPersonRelationshipType.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');
					dataRelatedPersonRelationshipType.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'RELATEDPERSON_RELATIONSHIPTYPE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'RELATEDPERSON_RELATIONSHIPTYPE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('relatedPersonRelationshipType', {"apikey": apikey, "_id": _id}, {body: dataRelatedPersonRelationshipType, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateRelatedPersonRelationshipType"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var relatedPersonRelationshipType = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(relatedPersonRelationshipType.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Related Person Relationship Type has been update.","data":relatedPersonRelationshipType.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": relatedPersonRelationshipType.error, "application": "Api FHIR", "function": "updateRelatedPersonRelationshipType"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('relatedPersonRelationshipType', {"apikey": apikey, "_id": _id}, {body: dataRelatedPersonRelationshipType, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateRelatedPersonRelationshipType"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var relatedPersonRelationshipType = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(relatedPersonRelationshipType.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Related Person Relationship Type has been update.","data":relatedPersonRelationshipType.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": relatedPersonRelationshipType.error, "application": "Api FHIR", "function": "updateRelatedPersonRelationshipType"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			groupType: function updateGroupType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataGroupType = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataGroupType.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display.replace(/[^\w\s ,]/gi, '');
					dataGroupType.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');
					dataGroupType.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'GROUP_TYPE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'GROUP_TYPE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('groupType', {"apikey": apikey, "_id": _id}, {body: dataGroupType, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateGroupType"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var groupType = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(groupType.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Group Type has been update.","data":groupType.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": groupType.error, "application": "Api FHIR", "function": "updateGroupType"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('groupType', {"apikey": apikey, "_id": _id}, {body: dataGroupType, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateGroupType"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var groupType = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(groupType.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Group Type has been update.","data":groupType.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": groupType.error, "application": "Api FHIR", "function": "updateGroupType"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			identifierUse: function updateIdentifierUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataIdentifierUse = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataIdentifierUse.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display.replace(/[^\w\s ,]/gi, '');
					dataIdentifierUse.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');
					dataIdentifierUse.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'IDENTIFIER_USE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'IDENTIFIER_USE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('identifierUse', {"apikey": apikey, "_id": _id}, {body: dataIdentifierUse, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateIdentifierUse"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var identifierUse = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(identifierUse.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Identifier Use has been update.","data":identifierUse.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": identifierUse.error, "application": "Api FHIR", "function": "updateIdentifierUse"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('identifierUse', {"apikey": apikey, "_id": _id}, {body: dataIdentifierUse, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateIdentifierUse"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var identifierUse = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(identifierUse.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Identifier use has been update.","data":identifierUse.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": identifierUse.error, "application": "Api FHIR", "function": "updateIdentifierUse"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			identifierType: function updateIdentifierType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataIdentifierType = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toUpperCase();
					dataIdentifierType.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					var display = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
					dataIdentifierType.display = display;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'IDENTIFIER_TYPE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'IDENTIFIER_TYPE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('identifierType', {"apikey": apikey, "_id": _id}, {body: dataIdentifierType, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateIdentifierType"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var identifierType = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(identifierType.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Identifier Type has been update.","data":identifierType.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": identifierType.error, "application": "Api FHIR", "function": "updateIdentifierType"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('identifierType', {"apikey": apikey, "_id": _id}, {body: dataIdentifierType, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateIdentifierType"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var identifierType = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(identifierType.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Identifier Type has been update.","data":identifierType.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": identifierType.error, "application": "Api FHIR", "function": "updateIdentifierType"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			nameUse: function updateNameUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataNameUse = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim();
					dataNameUse.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;
					dataNameUse.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
					dataNameUse.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'NAME_USE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'NAME_USE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('nameUse', {"apikey": apikey, "_id": _id}, {body: dataNameUse, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateNameUse"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var nameUse = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(nameUse.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Name Use has been update.","data":nameUse.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": nameUse.error, "application": "Api FHIR", "function": "updateNameUse"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('nameUse', {"apikey": apikey, "_id": _id}, {body: dataNameUse, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateNameUse"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var nameUse = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(nameUse.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Name Use has been update.","data":nameUse.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": nameUse.error, "application": "Api FHIR", "function": "updateNameUse"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			contactPointSystem: function updateContactPointSystem(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataContactPointSystem = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataContactPointSystem.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;
					dataContactPointSystem.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
					dataContactPointSystem.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'CONTACT_POINT_SYSTEM', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'CONTACT_POINT_SYSTEM', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('contactPointSystem', {"apikey": apikey, "_id": _id}, {body: dataContactPointSystem, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateContactPointSystem"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var contactPointSystem = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(contactPointSystem.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Contact Point System has been update.","data":contactPointSystem.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": contactPointSystem.error, "application": "Api FHIR", "function": "updateContactPointSystem"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('contactPointSystem', {"apikey": apikey, "_id": _id}, {body: dataContactPointSystem, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateContactPointSystem"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var contactPointSystem = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(contactPointSystem.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Contact Point System has been update.","data":contactPointSystem.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": contactPointSystem.error, "application": "Api FHIR", "function": "updateContactPointSystem"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			contactPointUse: function updateContactPointUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataContactPointUse = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataContactPointUse.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;
					dataContactPointUse.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
					dataContactPointUse.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'CONTACT_POINT_USE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'CONTACT_POINT_USE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('contactPointUse', {"apikey": apikey, "_id": _id}, {body: dataContactPointUse, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateContactPointUse"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var contactPointUse = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(contactPointUse.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Contact Point Use has been update.","data":contactPointUse.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": contactPointUse.error, "application": "Api FHIR", "function": "updateContactPointUse"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('contactPointUse', {"apikey": apikey, "_id": _id}, {body: dataContactPointUse, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateContactPointUse"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var contactPointUse = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(contactPointUse.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Contact Point Use has been update.","data":contactPointSystem.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": contactPointUse.error, "application": "Api FHIR", "function": "updateContactPointUse"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			addressUse: function updateAddressUse(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataAddressUse = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataAddressUse.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;
					dataAddressUse.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
					dataAddressUse.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'ADDRESS_USE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'ADDRESS_USE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('addressUse', {"apikey": apikey, "_id": _id}, {body: dataAddressUse, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAddressUse"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var addressUse = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(addressUse.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Address Use has been update.","data":addressUse.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": addressUse.error, "application": "Api FHIR", "function": "updateAddressUse"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('addressUse', {"apikey": apikey, "_id": _id}, {body: dataAddressUse, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAddressUse"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var addressUse = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(addressUse.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Address Use has been update.","data":addressUse.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": addressUse.error, "application": "Api FHIR", "function": "updateAddressUse"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			addressType: function updateAddressType(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataAddressType = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataAddressType.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;
					dataAddressType.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
					dataAddressType.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'ADDRESS_TYPE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'ADDRESS_TYPE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('addressType', {"apikey": apikey, "_id": _id}, {body: dataAddressType, json: true}, function(error, response, body){
														if(error){
														  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAddressType"});
														  }else{
														  	//cek apakah ada error atau tidak
														  	var addressType = body; 
														  	
														  	//cek apakah ada error atau tidak
														  	if(addressType.err_code == 0){
															  	res.json({"err_code": 0, "err_msg": "Address Type has been update.","data":addressType.data});
														  	}else{
														  		res.json({"err_code": 3, "err_msg": addressType.error, "application": "Api FHIR", "function": "updateAddressType"});
														  	}
														  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('addressType', {"apikey": apikey, "_id": _id}, {body: dataAddressType, json: true}, function(error, response, body){
												if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAddressType"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var addressType = body; 
												  	
												  	//cek apakah ada error atau tidak
												  	if(addressType.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Address Type has been update.","data":addressType.data});
												  	}else{
												  		res.json({"err_code": 3, "err_msg": addressType.error, "application": "Api FHIR", "function": "updateAddressType"});
												  	}
												  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			appointmentReasonCode: function updateAppointmentReasonCode(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataAppointmentReasonCode = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toUpperCase();
					dataAppointmentReasonCode.code = code;
				}

				if(typeof req.body.description !== 'undefined'){
					var description = req.body.description.replace(/[^\w\s , ( ) / .]/gi, '');
					dataAppointmentReasonCode.description = description;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'APPOINTMENT_REASON_CODE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'APPOINTMENT_REASON_CODE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('appointmentReasonCode', {"apikey": apikey, "_id": _id}, {body: dataAppointmentReasonCode, json: true}, function(error, response, body){
														if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAppointmentReasonCode"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var appointmentReasonCode = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(appointmentReasonCode.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Appointment Reason Code has been update.","data":appointmentReasonCode.data});
													  	}else{
													  		res.json(appointmentReasonCode);
													  	}
													  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('appointmentReasonCode', {"apikey": apikey, "_id": _id}, {body: dataAppointmentReasonCode, json: true}, function(error, response, body){
												if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAppointmentReasonCode"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var appointmentReasonCode = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(appointmentReasonCode.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Appointment Reason Code has been update.","data":appointmentReasonCode.data});
											  	}else{
											  		res.json(appointmentReasonCode);
											  	}
											  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			slotStatus: function updateSlotStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataSlotStatus = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataSlotStatus.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;
					dataSlotStatus.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
					dataSlotStatus.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'SLOT_STATUS', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'SLOT_STATUS', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('slotStatus', {"apikey": apikey, "_id": _id}, {body: dataSlotStatus, json: true}, function(error, response, body){
														if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSlotStatus"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var slotStatus = body; 
													  	//cek apakah ada error atau tidak
													  	if(slotStatus.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Slot Status has been update.","data":slotStatus.data});
													  	}else{
													  		res.json(slotStatus);
													  	}
													  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('slotStatus', {"apikey": apikey, "_id": _id}, {body: dataSlotStatus, json: true}, function(error, response, body){
												if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSlotStatus"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var slotStatus = body; 
											  	//cek apakah ada error atau tidak
											  	if(slotStatus.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Slot Status has been update.","data":slotStatus.data});
											  	}else{
											  		res.json(slotStatus);
											  	}
											  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			appointmentStatus: function updateAppointmentStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataAppointmentStatus = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataAppointmentStatus.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;
					dataAppointmentStatus.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
					dataAppointmentStatus.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'APPOINTMENT_STATUS', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'APPOINTMENT_STATUS', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('appointmentStatus', {"apikey": apikey, "_id": _id}, {body: dataAppointmentStatus, json: true}, function(error, response, body){
														if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAppointmentStatus"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var appointmentStatus = body; 
													  	//cek apakah ada error atau tidak
													  	if(appointmentStatus.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Appointment Status has been update.","data":appointmentStatus.data});
													  	}else{
													  		res.json(appointmentStatus);
													  	}
													  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('appointmentStatus', {"apikey": apikey, "_id": _id}, {body: dataAppointmentStatus, json: true}, function(error, response, body){
												if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateAppointmentStatus"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var appointmentStatus = body; 
											  	//cek apakah ada error atau tidak
											  	if(appointmentStatus.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Appointment Status has been update.","data":appointmentStatus.data});
											  	}else{
											  		res.json(appointmentStatus);
											  	}
											  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			participantRequired: function updateParticipantRequired(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataParticipantRequired = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataParticipantRequired.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;
					dataParticipantRequired.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
					dataParticipantRequired.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'PARTICIPANT_REQUIRED', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'PARTICIPANT_REQUIRED', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('participantRequired', {"apikey": apikey, "_id": _id}, {body: dataParticipantRequired, json: true}, function(error, response, body){
														if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateParticipantRequired"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var participantRequired = body; 
													  	//cek apakah ada error atau tidak
													  	if(participantRequired.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Participant Required has been update.","data":participantRequired.data});
													  	}else{
													  		res.json(participantRequired);
													  	}
													  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('participantRequired', {"apikey": apikey, "_id": _id}, {body: dataParticipantRequired, json: true}, function(error, response, body){
												if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateParticipantRequired"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var participantRequired = body; 
											  	//cek apakah ada error atau tidak
											  	if(participantRequired.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Participant Required has been update.","data":participantRequired.data});
											  	}else{
											  		res.json(participantRequired);
											  	}
											  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			},
			participationStatus: function updateparticipationStatus(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var _id = req.params._id;

				var dataparticipationStatus = {};

				if(typeof req.body.code !== 'undefined'){
					var code = req.body.code.trim().toLowerCase();
					dataparticipationStatus.code = code;
				}

				if(typeof req.body.display !== 'undefined'){
					display = req.body.display;
					dataparticipationStatus.display = display;
				}

				if(typeof req.body.definition !== 'undefined'){
					var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
					dataparticipationStatus.definition = definition;
				}

				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'PARTICIPATION_STATUS', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'PARTICIPATION_STATUS', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('participationStatus', {"apikey": apikey, "_id": _id}, {body: dataparticipationStatus, json: true}, function(error, response, body){
														if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateparticipationStatus"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var participationStatus = body; 
													  	//cek apakah ada error atau tidak
													  	if(participationStatus.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Participant Status has been update.","data":participationStatus.data});
													  	}else{
													  		res.json(participationStatus);
													  	}
													  }
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('participationStatus', {"apikey": apikey, "_id": _id}, {body: dataparticipationStatus, json: true}, function(error, response, body){
												if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateparticipationStatus"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var participationStatus = body; 
											  	//cek apakah ada error atau tidak
											  	if(participationStatus.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Participant Status has been update.","data":dataparticipationStatus.data});
											  	}else{
											  		res.json(participationStatus);
											  	}
											  }
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
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