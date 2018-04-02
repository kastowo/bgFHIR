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
	get: function getOrganization(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

		//params from query string
		var organizationId = req.query._id;
		var organizationActive = req.query.active;
		var organizationAddress = req.query.address;
		var organizationAddressCity = req.query.city;
		var organizationAddressCountry = req.query.country;
		var organizationAddressPostalCode = req.query.postal_code;
		var organizationAddressState = req.query.state; //space encodeURI masih ada bug untuk sprintf
		var organizationAddressUse = req.query.address_use; 
		var organizationEndpoint = req.query.endpoint; 
		var organizationIdentifier = req.query.identifier; 
		var organizationName = req.query.name; 
		var organizationPart_of = req.query.part_of; 
		//var organizationPhonetic = req.query.phonetic; 
		var organizationType = req.query.type; 

		var qString = {};
		if(typeof organizationId !== 'undefined'){
			if(!validator.isEmpty(organizationId)){
				qString._id = organizationId; 
			}else{
				res.json({"err_code": 1, "err_msg": "organization id is required."});
			}
		}

		if(typeof organizationActive !== 'undefined'){
			if(validator.isBoolean(organizationActive)){
				qString.active = organizationActive; 
			}else{
				res.json({"err_code": 1, "err_msg": "organization is boolean."});
			}
		}

		if(typeof organizationAddress !== 'undefined'){
			if(!validator.isEmpty(organizationAddress)){
				organizationAddress = decodeURI(organizationAddress);
				if(organizationAddress.indexOf(" ") > 0){
					qString.address = organizationAddress.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.address = organizationAddress; 	
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Address is empty."});
			}
		}

		if(typeof organizationAddressCity !== 'undefined'){
			if(!validator.isEmpty(organizationAddressCity)){
				organizationAddressCity = decodeURI(organizationAddressCity);
				if(organizationAddressCity.indexOf(" ") > 0){
					qString.city = organizationAddressCity.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.city = organizationAddressCity; 
				}
			}else{
				res.json({"err_code": 1, "err_msg": "City is empty."});
			}
		}

		if(typeof organizationAddressCountry !== 'undefined'){
			if(!validator.isEmpty(organizationAddressCountry)){
				organizationAddressCountry = decodeURI(organizationAddressCountry);
				if(organizationAddressCountry.indexOf(" ") > 0){
					qString.country = organizationAddressCountry.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.country = organizationAddressCountry; 
				}						
			}else{
				res.json({"err_code": 1, "err_msg": "Country is empty."});
			}
		}

		if(typeof organizationAddressPostalCode !== 'undefined'){
			if(validator.isPostalCode(organizationAddressPostalCode, 'any')){
				qString.postalcode = organizationAddressPostalCode; 
			}else{
				res.json({"err_code": 1, "err_msg": "Postal code is invalid format."});
			}
		}

		if(typeof organizationAddressState !== 'undefined'){
			if(!validator.isEmpty(organizationAddressState)){
				organizationAddressState = decodeURI(organizationAddressState);
				if(organizationAddressState.indexOf(" ") > 0){
					qString.state = organizationAddressState.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.state = organizationAddressState; 
				}
			}else{
				res.json({"err_code": 1, "err_msg": "State is empty."});
			}
		}

		if(typeof organizationAddressUse !== 'undefined'){
			if(!validator.isEmpty(organizationAddressUse)){
				qString.addressuse = organizationAddressUse; 
			}else{
				res.json({"err_code": 1, "err_msg": "Address use code is empty."});
			}
		}

		if(typeof organizationEndpoint !== 'undefined'){
			if(!validator.isEmpty(organizationEndpoint)){
				qString.endpoint = organizationEndpoint; 
			}else{
				res.json({"err_code": 1, "err_msg": "endpoint is empty."});
			}
		}

		if(typeof organizationIdentifier !== 'undefined'){
			if(!validator.isEmpty(organizationIdentifier)){
				qString.identifier = organizationIdentifier;
			}else{
				res.json({"err_code": 1, "err_msg": "Identifier is empty."});
			}
		}

		if(typeof organizationName !== 'undefined'){
			if(!validator.isEmpty(organizationName)){
				if(organizationName.indexOf(" ") > 0){
					qString.name = organizationName.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.name = organizationName;
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Name is empty."});
			}
		}

		if(typeof organizationPart_of !== 'undefined'){
			if(!validator.isEmpty(organizationPart_of)){
				qString.Part_of = organizationPart_of;
			}else{
				res.json({"err_code": 1, "err_msg": "Part of is empty."});
			}
		}

		if(typeof organizationType !== 'undefined'){
			if(!validator.isEmpty(organizationType)){
				qString.type = organizationType;
			}else{
				res.json({"err_code": 1, "err_msg": "Type of is empty."});
			}
		}	

		/*if(typeof organizationPhonetic !== 'undefined'){
			if(!validator.isEmpty(organizationPhonetic)){
				qString.phonetic = organizationPhonetic;
			}else{
				res.json({"err_code": 1, "err_msg": "Phonetic is empty."});
			}
		 }*/
		seedPhoenixFHIR.path.GET = {
			"Organization" : {
				"location": "%(apikey)s/Organization",
				"query": qString
			}
		}
		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

		checkApikey(apikey, ipAddres, function(result){
			if(result.err_code == 0){
				ApiFHIR.get('Organization', {"apikey": apikey}, {}, function (error, response, body) {
					if(error){
						res.json(error);
					}else{
						var organization = JSON.parse(body); //object
						//cek apakah ada error atau tidak
						if(organization.err_code == 0){
							//cek jumdata dulu
							if(organization.data.length > 0){
								newOrganization = [];
								for(i=0; i < organization.data.length; i++){
									myEmitter.once("getIdentifier", function(organization, index, newOrganization, countOrganization){
													//get identifier
													qString = {};
													qString.organization_id = organization.id;
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
															var objectOrganization = {};
															objectOrganization.resourceType = organization.resourceType;
															objectOrganization.id = organization.id;
															objectOrganization.identifier = identifier.data;
															objectOrganization.active = organization.active;
															objectOrganization.type = organization.type;
															objectOrganization.name = organization.name;
															objectOrganization.alias = organization.alias;
															var partOf;															
															if(organization.parent_id !== 'null') {
																partOf = host + ":" + port + "/" + apikey + "/Organization?_id=" + organization.parent_id;
															} else {
																partOf = organization.parent_id;
															}																
															objectOrganization.partOf = partOf;
															var endpoint;
															if(organization.endpoint_id !== 'null'){
																endpoint = host + ":" + port + "/" + apikey + "/Endpoint?_id=" + organization.endpoint_id;
															} else {
																endpoint = organization.endpoint_id;
															}
															objectOrganization.endpoint_id = endpoint;

															newOrganization[index] = objectOrganization

															myEmitter.once('getContactPoint', function(organization, index, newOrganization, countOrganization){
																			qString = {};
																			qString.organization_id = organization.id;
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
																					var objectOrganization = {};
																					objectOrganization.resourceType = organization.resourceType;
																					objectOrganization.id = organization.id;
																					objectOrganization.identifier = organization.identifier;
																					objectOrganization.active = organization.active;
																					objectOrganization.type = organization.type;
																					objectOrganization.name = organization.name;
																					objectOrganization.alias = organization.alias;
																					objectOrganization.telecom = contactPoint.data;
																					objectOrganization.partOf = organization.partOf;
																					objectOrganization.endpoint_id = organization.endpoint_id;
																					
																					newOrganization[index] = objectOrganization;

																					myEmitter.once('getAddress', function(organization, index, newOrganization, countOrganization){
																						qString = {};
																						qString.organization_id = organization.id;
																						seedPhoenixFHIR.path.GET = {
																							"Address" : {
																								"location": "%(apikey)s/Address",
																								"query": qString
																							}
																						}

																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																						ApiFHIR.get('Address', {"apikey": apikey}, {}, function(error, response, body){
																							address = JSON.parse(body);

																							if(address.err_code == 0){
																								var objectOrganization = {};
																								objectOrganization.resourceType = organization.resourceType;
																								objectOrganization.id = organization.id;
																								objectOrganization.identifier = organization.identifier;
																								objectOrganization.active = organization.active;
																								objectOrganization.type = organization.type;
																								objectOrganization.name = organization.name;
																								objectOrganization.alias = organization.alias;
																								objectOrganization.telecom = organization.telecom;
																								objectOrganization.address = address.data;
																								objectOrganization.partOf = organization.partOf;
																								objectOrganization.endpoint_id = organization.endpoint_id;
																								
																								newOrganization[index] = objectOrganization;
																								
																								myEmitter.once('getContact', function(organization, index, newOrganization, countOrganization){
																									qString = {};
																									qString.organization_id = organization.id;
																									seedPhoenixFHIR.path.GET = {
																										"OrganizationContact" : {
																											"location": "%(apikey)s/OrganizationContact",
																											"query": qString
																										}
																									}

																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																									ApiFHIR.get('OrganizationContact', {"apikey": apikey}, {}, function(error, response, body){
																										contact = JSON.parse(body);

																										if(contact.err_code == 0){
																											var objectOrganization = {};
																											objectOrganization.resourceType = organization.resourceType;
																											objectOrganization.id = organization.id;
																											objectOrganization.identifier = organization.identifier;
																											objectOrganization.active = organization.active;
																											objectOrganization.type = organization.type;
																											objectOrganization.name = organization.name;
																											objectOrganization.alias = organization.alias;
																											objectOrganization.telecom = organization.telecom;
																											objectOrganization.address = organization.address;
																											objectOrganization.partOf = organization.partOf;
																											objectOrganization.contact = contact.data;
																											objectOrganization.endpoint_id = organization.endpoint_id;
																											newOrganization[index] = objectOrganization;

																											if(index == countOrganization -1 ){
																												res.json({"err_code": 0, "data":newOrganization});				
																											}
																											
																										}else{
																											res.json(contact);			
																										}
																									})
																								})
																								myEmitter.emit('getContact', objectOrganization, index, newOrganization, countOrganization);
																							}else{
																								res.json(address);			
																							}
																						})
																					})
																					myEmitter.emit('getAddress', objectOrganization, index, newOrganization, countOrganization);			
																				}else{
																					res.json(contactPoint);			
																				}
																			})
																		})
																		myEmitter.emit('getContactPoint', objectOrganization, index, newOrganization, countOrganization);
														}else{
															res.json(identifier);
														}
													})
												})
									myEmitter.emit("getIdentifier", organization.data[i], i, newOrganization, organization.data.length);
									//res.json({"err_code": 0, "err_msg": "Organitazion is not empty."});		
								}
								// res.json({"err_code": 0, "data":organization.data});
							}else{
								res.json({"err_code": 2, "err_msg": "Organitazion is empty."});	
							}
						}else{
							res.json(organization);
						}
					}
				});
			}else{
				result.err_code = 500;
				res.json(result);
			}
		});	
	},
	post: function postOrganization(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

		var err_code = 0;
		var err_msg = "";
//console.log(req.body);
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

		//set by sistem
		//var identifierSystem = host + ':' + port + '/' + apikey + 'identifier/value/' + identifierValue 

		//organization active
		if(typeof req.body.active !== 'undefined'){
			organizationActiveCode =  req.body.active.trim().toLowerCase();
			if(validator.isEmpty(organizationActiveCode)){
				err_code = 2;
				err_msg = "Organization active is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'active' in json Organization request.";
		}
		//organization type
		if(typeof req.body.type !== 'undefined'){
			organizationTypeCode =  req.body.type.trim().toLowerCase();
			if(validator.isEmpty(organizationTypeCode)){
				err_code = 2;
				err_msg = "Organization type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'type' in json Organization request.";
		}
		//organization name
		if(typeof req.body.name !== 'undefined'){
			organizationNameCode =  req.body.name.trim().toLowerCase();
			if(validator.isEmpty(organizationNameCode)){
				err_code = 2;
				err_msg = "Organization name is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'name' in json Organization request.";
		}
		//organization alias
		if(typeof req.body.alias !== 'undefined'){
			organizationAliasCode =  req.body.alias.trim().toLowerCase();
			if(validator.isEmpty(organizationAliasCode)){
				err_code = 2;
				err_msg = "Organization alias is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'alias' in json Organization request.";
		}
		//organization partOf
		if(typeof req.body.partOf !== 'undefined'){
			organizationPartOfCode =  req.body.partOf.trim().toLowerCase();
			if(validator.isEmpty(organizationPartOfCode)){
				err_code = 2;
				err_msg = "Organization partOf is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'partOf' in json Organization request.";
		}
		
		//organization endpoint
		if(typeof req.body.endpoint !== 'undefined'){
			endpointId =  req.body.endpoint.trim().toLowerCase();
			if(validator.isEmpty(endpointId)){
				err_code = 2;
				err_msg = "Reference endpoint is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'endpoint' in json Organization request.";
		}
		
		//contact point system
		if(typeof req.body.telecom.system !== 'undefined'){
			contactPointSystemCode =  req.body.telecom.system.trim().toLowerCase();
			if(validator.isEmpty(contactPointSystemCode)){
				err_code = 2;
				err_msg = "Contact Point System is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'system' in json telecom request.";
		}

		//contact point value
		if(typeof req.body.telecom.value !== 'undefined'){
			contactPointValue =  req.body.telecom.value;
			if(validator.isEmpty(contactPointValue)){
				err_code = 2;
				err_msg = "Contact Point Value is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'value' in json telecom request.";
		}

		//contact poin use
		if(typeof req.body.telecom.use !== 'undefined'){
			contactPointUseCode =  req.body.telecom.use.trim().toLowerCase();
			if(validator.isEmpty(contactPointUseCode)){
				err_code = 2;
				err_msg = "Telecom Use Code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'use' in json telecom request.";
		} 

		//contact poin rank
		if(typeof req.body.telecom.rank !== 'undefined'){
			contactPointRank =  req.body.telecom.rank;
			if(!validator.isInt(contactPointRank)){
				err_code = 2;
				err_msg = "Telecom Rank must be number";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'rank' in json telecom request.";
		} 

		//contact point period
		if(typeof req.body.telecom.period !== 'undefined'){
			var period = req.body.telecom.period;
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

		//address use
		if(typeof req.body.address.use !== 'undefined'){
			addressUseCode =  req.body.address.use.trim().toLowerCase();
			if(validator.isEmpty(addressUseCode)){
				err_code = 2;
				err_msg = "Address Use is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'use' in json address request.";
		} 

		//address type
		if(typeof req.body.address.type !== 'undefined'){
			addressTypeCode =  req.body.address.type.trim().toLowerCase();
			if(validator.isEmpty(addressTypeCode)){
				err_code = 2;
				err_msg = "Address Type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'type' in json address request.";
		} 

		//address text
		if(typeof req.body.address.text !== 'undefined'){
			addressText =  req.body.address.text;
			if(validator.isEmpty(addressText)){
				err_code = 2;
				err_msg = "Address Text is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'text' in json address request.";
		}

		//address line
		if(typeof req.body.address.line !== 'undefined'){
			addressLine =  req.body.address.line;
			if(validator.isEmpty(addressLine)){
				err_code = 2;
				err_msg = "Address Line is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'text' in json address request.";
		}

		//address city
		if(typeof req.body.address.city !== 'undefined'){
			addressCity =  req.body.address.city;
			if(validator.isEmpty(addressCity)){
				err_code = 2;
				err_msg = "Address City is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'city' in json address request.";
		} 

		//address district
		if(typeof req.body.address.district !== 'undefined'){
			addressDistrict =  req.body.address.district;
			// if(validator.isEmpty(addressDistrict)){
			// 	err_code = 2;
			// 	err_msg = "Address District is required";
			// }
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'district' in json address request.";
		}

		//address state
		if(typeof req.body.address.state !== 'undefined'){
			addressState =  req.body.address.state;
			if(validator.isEmpty(addressState)){
				err_code = 2;
				err_msg = "State is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'state' in json address request.";
		}

		//address postal code
		if(typeof req.body.address.postal_code !== 'undefined'){
			addressPostalCode =  req.body.address.postal_code;
			if(validator.isEmpty(addressPostalCode)){
				err_code = 2;
				err_msg = "Postal Code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'postal_code' in json address request.";
		} 

		//address country
		if(typeof req.body.address.country !== 'undefined'){
			addressCountry =  req.body.address.country;
			if(validator.isEmpty(addressCountry)){
				err_code = 2;
				err_msg = "Country is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'country' in json address request.";
		} 

		//address period
		if(typeof req.body.address.period !== 'undefined'){
			var period = req.body.address.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				addressPeriodStart = arrPeriod[0];
				addressPeriodEnd = arrPeriod[1];

				if(!regex.test(addressPeriodStart) && !regex.test(addressPeriodEnd)){
					err_code = 2;
					err_msg = "Address Period invalid date format.";
				}	
			}else{
				addressPeriodStart = "";
				addressPeriodEnd = "";
			}
		}else{
			addressPeriodStart = "";
			addressPeriodEnd = "";
		}
		
		
		//contact purpose
		if(typeof req.body.contact.purpose !== 'undefined'){
			purposeCode =  req.body.contact.purpose.trim().toLowerCase();
			if(validator.isEmpty(purposeCode)){
				err_code = 2;
				err_msg = "purpose Code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'purpose' in json name request.";
		}
		
		//contact human_name
		//use code
		if(typeof req.body.contact.name.use !== 'undefined'){
			humanNameUseCode =  req.body.contact.name.use.trim().toLowerCase();
			if(validator.isEmpty(humanNameUseCode)){
				err_code = 2;
				err_msg = "Name Use Code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'use' in json name request.";
		} 

		//fullname
		if(typeof req.body.contact.name.text !== 'undefined'){
			humanNameText =  req.body.contact.name.text;
			if(validator.isEmpty(humanNameText)){
				err_code = 2;
				err_msg = "Name text is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'text' in your json name request.";
		} 

		//surname
		if(typeof req.body.contact.name.family !== 'undefined'){
			humanNameFamily =  req.body.contact.name.family;
			if(validator.isEmpty(humanNameFamily)){
				err_code = 2;
				err_msg = "Family name is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'family' in your json name request.";
		}

		//given name
		if(typeof req.body.contact.name.given !== 'undefined'){
			humanNameGiven =  req.body.contact.name.given;
			if(validator.isEmpty(humanNameGiven)){
				 humanNameGiven = "";
			}
		}else{
			humanNameGiven = "";
		}

		//prefix name
		if(typeof req.body.contact.name.prefix !== 'undefined'){
			humanNamePrefix =  req.body.contact.name.prefix;
		}else{
			humanNamePrefix = '';
		}

		//suffix name
		if(typeof req.body.contact.name.suffix !== 'undefined'){
			humanNameSuffix =  req.body.contact.name.suffix;
		}else{
			humanNameSuffix =  "";
		}

		//period name
		if(typeof req.body.contact.name.period !== 'undefined'){
			var period = req.body.contact.name.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				humanNamePeriodStart = arrPeriod[0];
				humanNamePeriodEnd = arrPeriod[1];

				if(!regex.test(humanNamePeriodStart) && !regex.test(humanNamePeriodEnd)){
					err_code = 2;
					err_msg = "Identifier Period invalid date format.";
				}	
			}else{
				humanNamePeriodStart = "";
				humanNamePeriodEnd = "";
			}
		}else{
			humanNamePeriodStart = "";
			humanNamePeriodEnd = "";
		}
		
		//contact telecom
		//contact point system
		if(typeof req.body.contact.telecom.system !== 'undefined'){
			contactContactPointSystemCode =  req.body.contact.telecom.system.trim().toLowerCase();
			if(validator.isEmpty(contactContactPointSystemCode)){
				err_code = 2;
				err_msg = "Contact Point System is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact system' in json telecom request.";
		}

		//contact point value
		if(typeof req.body.contact.telecom.value !== 'undefined'){
			contactContactPointValue =  req.body.contact.telecom.value;
			if(validator.isEmpty(contactContactPointValue)){
				err_code = 2;
				err_msg = "Contact Point Value is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact value' in json telecom request.";
		}

		//contact poin use
		if(typeof req.body.contact.telecom.use !== 'undefined'){
			contactContactPointUseCode =  req.body.contact.telecom.use.trim().toLowerCase();
			if(validator.isEmpty(contactContactPointUseCode)){
				err_code = 2;
				err_msg = "Contact Telecom Use Code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact use' in json telecom request.";
		} 

		//contact poin rank
		if(typeof req.body.contact.telecom.rank !== 'undefined'){
			contactContactPointRank =  req.body.contact.telecom.rank;
			if(!validator.isInt(contactContactPointRank)){
				err_code = 2;
				err_msg = "Contact Telecom Rank must be number";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact rank' in json telecom request.";
		} 

		//contact point period
		if(typeof req.body.contact.telecom.period !== 'undefined'){
			var period = req.body.contact.telecom.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				contactContactPointPeriodStart = arrPeriod[0];
				contactContactPointPeriodEnd = arrPeriod[1];

				if(!regex.test(contactContactPointPeriodStart) && !regex.test(contactContactPointPeriodEnd)){
					err_code = 2;
					err_msg = "Contact Telecom Period invalid date format.";
				}	
			}else{
				contactContactPointPeriodStart = "";
				contactContactPointPeriodEnd = "";
			}
		}else{
			contactContactPointPeriodStart = "";
			contactContactPointPeriodEnd = "";
		}
		
		// contact address
		//address use
		if(typeof req.body.contact.address.use !== 'undefined'){
			contactAddressUseCode =  req.body.contact.address.use.trim().toLowerCase();
			if(validator.isEmpty(contactAddressUseCode)){
				err_code = 2;
				err_msg = "Contact Address Use is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact use' in json address request.";
		} 

		//address type
		if(typeof req.body.contact.address.type !== 'undefined'){
			contactAddressTypeCode =  req.body.contact.address.type.trim().toLowerCase();
			if(validator.isEmpty(contactAddressTypeCode)){
				err_code = 2;
				err_msg = "Contact Address Type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact type' in json address request.";
		} 

		//address text
		if(typeof req.body.contact.address.text !== 'undefined'){
			contactAddressText =  req.body.contact.address.text;
			if(validator.isEmpty(contactAddressText)){
				err_code = 2;
				err_msg = "Contact Address Text is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact text' in json address request.";
		}

		//address line
		if(typeof req.body.contact.address.line !== 'undefined'){
			contactAddressLine =  req.body.contact.address.line;
			if(validator.isEmpty(contactAddressLine)){
				err_code = 2;
				err_msg = "Contact Address Line is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact text' in json address request.";
		}

		//address city
		if(typeof req.body.contact.address.city !== 'undefined'){
			contactAddressCity =  req.body.contact.address.city;
			if(validator.isEmpty(contactAddressCity)){
				err_code = 2;
				err_msg = "Contact Address City is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact city' in json address request.";
		} 

		//address district
		if(typeof req.body.contact.address.district !== 'undefined'){
			contactAddressDistrict =  req.body.contact.address.district;
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact district' in json address request.";
		}

		//address state
		if(typeof req.body.contact.address.state !== 'undefined'){
			contactAddressState =  req.body.contact.address.state;
			if(validator.isEmpty(contactAddressState)){
				err_code = 2;
				err_msg = "Contact State is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact state' in json address request.";
		}

		//address postal code
		if(typeof req.body.contact.address.postal_code !== 'undefined'){
			contactAddressPostalCode =  req.body.contact.address.postal_code;
			if(validator.isEmpty(contactAddressPostalCode)){
				err_code = 2;
				err_msg = "Contact Postal Code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact postal_code' in json address request.";
		} 

		//address country
		if(typeof req.body.contact.address.country !== 'undefined'){
			contactAddressCountry =  req.body.contact.address.country;
			if(validator.isEmpty(contactAddressCountry)){
				err_code = 2;
				err_msg = "Contact Country is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'contact country' in json address request.";
		} 

		//address period
		if(typeof req.body.contact.address.period !== 'undefined'){
			var period = req.body.contact.address.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				contactAddressPeriodStart = arrPeriod[0];
				contactAddressPeriodEnd = arrPeriod[1];

				if(!regex.test(contactAddressPeriodStart) && !regex.test(contactAddressPeriodEnd)){
					err_code = 2;
					err_msg = "Address Period invalid date format.";
				}	
			}else{
				contactAddressPeriodStart = "";
				contactAddressPeriodEnd = "";
			}
		}else{
			contactAddressPeriodStart = "";
			contactAddressPeriodEnd = "";
		}
		 

		//managing Organization
		/*if(typeof req.body.organization_id !== 'undefined'){
			organizationId =  req.body.organization_id;
			if(validator.isEmpty(organizationId)){
				organizationId = "";
			}else{
				if(!validator.isInt(organizationId)){
					err_code = 2;
					err_msg = "Organization id must be a number."
				}
			}
		}else{
			organizationId = "";
		}*/

		if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
						if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
								if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									checkCode(apikey, humanNameUseCode, 'NAME_USE', function(resNameUseCode){
										if(resNameUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
												if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
													checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
														if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
															checkCode(apikey, addressUseCode, 'ADDRESS_USE', function(resAddrUse){
																if(resAddrUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																	checkCode(apikey, addressTypeCode, 'ADDRESS_TYPE', function(resAddrType){
																		if(resAddrType.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																			checkCode(apikey, organizationTypeCode, 'ORGANIZATION_TYPE', function(resOrgType){
																				if(resOrgType.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				//event emiter
																					myEmitter.prependOnceListener('checkOrganizationId', function() {
																							checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																								if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
																									checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
																										if(resContactPointValue.err_code == 0){
																											checkUniqeValue(apikey, "ORGANIZATION_ID|" + organizationPartOfCode, 'ORGANIZATION', function(resPartOfValue){
																												if(organizationPartOfCode == 'null') {
																													resPartOfValue.err_code = 2;
																												}
																												if(resPartOfValue.err_code == 2){
																													checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointValue){
																														if(endpointId == 'null') {
																															resEndpointValue.err_code = 2;
																														}
																														if(resEndpointValue.err_code == 2){
																											
																															//proses insert
																															//set uniqe id
																															var unicId = uniqid.time();
																															var organizationId = 'org' + unicId;
																															var organizationContactId = 'orc' + unicId;
																															var identifierId = 'ide' + unicId;
																															var humanNameId = 'hun' + unicId;
																															var contactPointId = 'cop' + unicId;
																															var contactContactPointId = 'ccp' + unicId;
																															var addressId = 'add' + unicId;
																															var contactAddressId = 'adc' + unicId;
																															//var endpointId = 'enp' + unicId;

																															dataOrganization = {
																																"id" : organizationId,
																																"active" : organizationActiveCode,
																																"type" : organizationTypeCode,
																																"name" : organizationNameCode,
																																"alias" : organizationAliasCode,
																																"parentId" : organizationPartOfCode,
																																"endpointId" : endpointId
																															}
																															ApiFHIR.post('organization', {"apikey": apikey}, {body: dataOrganization, json: true}, function(error, response, body){
																																organization = body;
																																if(organization.err_code > 0){
																																	res.json(organization);	
																																}
																															})

																															dataOrganizationContact = {
																																"id" : organizationContactId,
																																"purpose" : purposeCode,
																																"humanNameId" : humanNameId,
																																"addressId" : contactAddressId,
																																"OrganizationId" : organizationId
																															}
																															ApiFHIR.post('organizationContact', {"apikey": apikey}, {body: dataOrganizationContact, json: true}, function(error, response, body){
																																organizationContact = body;
																																if(organizationContact.err_code > 0){
																																	console.log(organizationContact);
																																	res.json(organizationContact);	
																																}
																															})

																															//identifier
																															dataIdentifier = {
																																								"id": identifierId,
																																								"use": identifierUseCode,
																																								"type": identifierTypeCode,
																																								//"system": identifierSystem,
																																								"value": identifierValue,
																																								"period_start": identifierPeriodStart,
																																								"period_end": identifierPeriodEnd,
																																								"organization_id": organizationId
																																							}

																															ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
																																identifier = body;
																																if(identifier.err_code > 0){
																																	res.json(identifier);	
																																}
																															})

																															//human name
																															dataHumanName = {
																																								"id": humanNameId,
																																								"use": humanNameUseCode,
																																								"text": humanNamePrefix + ' ' + humanNameText + ' ' + humanNameSuffix,
																																								"family": humanNameFamily,
																																								"given": humanNameGiven,
																																								"prefix": humanNamePrefix,
																																								"suffix": humanNameSuffix,
																																								"period_start": humanNamePeriodStart,
																																								"period_end": humanNamePeriodEnd
																																							}

																															ApiFHIR.post('humanName', {"apikey": apikey}, {body: dataHumanName, json: true}, function(error, response, body){
																																humanName = body;
																																if(humanName.err_code > 0){
																																	res.json(humanName);	
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
																																									"organization_id": organizationId/*,
																																									"organization_contact_id": organizationContactId*/
																																								}

																															//post to contact point
																															ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
																																contactPoint = body;
																																if(contactPoint.err_code > 0){
																																	res.json(contactPoint);	
																																}
																															})

																															//contcat contact_point
																															dataContactPoint = {
																																									"id": contactContactPointId,
																																									"system": contactContactPointSystemCode,
																																									"value": contactContactPointValue,
																																									"use": contactContactPointUseCode,
																																									"rank": contactContactPointRank,
																																									"period_start": contactContactPointPeriodStart,
																																									"period_end": contactContactPointPeriodEnd,
																																									/*"organization_id": organizationId,*/
																																									"organization_contact_id": organizationContactId
																																								}

																															//post to contact point
																															ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
																																contactPoint = body;
																																if(contactPoint.err_code > 0){
																																	res.json(contactPoint);	
																																}
																															})

																															//address
																															dataAddress = {
																																							"id": addressId,
																																							"use": addressUseCode,
																																							"type": addressTypeCode,
																																							"text": addressText,
																																							"line": addressLine,
																																							"city": addressCity,
																																							"district": addressDistrict,
																																							"state": addressState,
																																							"postal_code": addressPostalCode,
																																							"country": addressCountry,
																																							"period_start": addressPeriodStart,
																																							"period_end": addressPeriodEnd,
																																							"organization_id": organizationId
																																						}

																															//post to contact point
																															ApiFHIR.post('address', {"apikey": apikey}, {body: dataAddress, json: true}, function(error, response, body){
																																address = body;
																																if(address.err_code > 0){
																																	res.json(address);	
																																}
																															})

																															//address Contcat
																															dataContactAddress = {
																																							"id": contactAddressId,
																																							"use": contactAddressUseCode,
																																							"type": contactAddressTypeCode,
																																							"text": contactAddressText,
																																							"line": contactAddressLine,
																																							"city": contactAddressCity,
																																							"district": contactAddressDistrict,
																																							"state": contactAddressState,
																																							"postal_code": contactAddressPostalCode,
																																							"country": contactAddressCountry,
																																							"period_start": contactAddressPeriodStart,
																																							"period_end": contactAddressPeriodEnd
																																							//"organization_id": organizationId
																																						}

																															//post to contact point
																															ApiFHIR.post('address', {"apikey": apikey}, {body: dataContactAddress, json: true}, function(error, response, body){
																																address = body;
																																if(address.err_code > 0){
																																	res.json(address);	
																																}
																															})

																															res.json({"err_code": 0, "err_msg": "Organization has been add.", "data": [{"_id": organizationId}]});
																															
																														}else{
																															res.json({"err_code": 509, "err_msg": "Endpoint value is not exist."});			
																														}
																													})
																											
																												}else{
																													res.json({"err_code": 509, "err_msg": "Part of value is not exist."});			
																												}
																											})																											
																										}else{
																											res.json({"err_code": 509, "err_msg": "Telecom value already exist."});			
																										}
																									})
																								}else{
																									res.json({"err_code": 509, "err_msg": "Identifier value already exist."});		
																								}
																							})

																					});
																					myEmitter.emit('checkOrganizationId');
																				}else{
																					res.json({"err_code": 508, "err_msg": "Organization Type Code not found"});
																				}
																			})
																		}else{
																			res.json({"err_code": 507, "err_msg": "Address Type Code not found"});		
																		}
																	})
																}else{
																	res.json({"err_code": 506, "err_msg": "Address Use Code not found"});		
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
											res.json({"err_code": 503, "err_msg": "Human name use code not found"});		
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