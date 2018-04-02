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
var portIdentifier = configYaml.phoenix.port;

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
	get: function getLocation(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

		var locationId = req.query._id;
		var locationName = req.query.name;
		var locationAlias = req.query.alias;
		var locationOperationalStatus = req.query.operational_status;
		var locationIdPartOf = req.query.part_of;
		var locationStatus = req.query.status;
		var locationType = req.query.type;	
		//table LOCATION_POSITION
		var locationPosition = req.query.near;
		//var locationPosition = req.query.near_distance;
		// table address
		var locationAddress = req.query.address;
		var locationAddressCity = req.query.city;
		var locationAddressCountry = req.query.country;
		var locationAddressPostalcode = req.query.postal_code;
		var locationAddressState = req.query.state;
		var locationAddressUse = req.query.address_use;
		// table organization
		var organizationId = req.query.organization;
		//table endpoint
		var endpointId = req.query.endpoint;
		//table identifier
		var identifierLocationId = req.query.identifier;

		var qString = {};
				
		if(typeof locationId !== 'undefined'){
			if(!validator.isEmpty(locationId)){
				qString._id = locationId; 
			}else{
				res.json({"err_code": 1, "err_msg": "organization id is required."});
			}
		}
		
		if(typeof locationName !== 'undefined'){
			if(!validator.isEmpty(locationName)){
				if(locationName.indexOf(" ") > 0){
					qString.name = locationName.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.name = locationName;
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Name is empty."});
			}
		}
		
		if(typeof locationAlias !== 'undefined'){
			if(!validator.isEmpty(locationAlias)){
				if(locationAlias.indexOf(" ") > 0){
					qString.alias = locationAlias.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.alias = locationAlias;
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Alias is empty."});
			}
		}
		
		if(typeof locationOperationalStatus !== 'undefined'){
			if(!validator.isEmpty(locationOperationalStatus)){
				if(locationOperationalStatus.indexOf(" ") > 0){
					qString.operationalStatus = locationOperationalStatus.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.operationalStatus = locationOperationalStatus;
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Operasional status is empty."});
			}
		}
		
		if(typeof locationIdPartOf !== 'undefined'){
			if(!validator.isEmpty(locationIdPartOf)){
				qString.Part_of = locationIdPartOf;
			}else{
				res.json({"err_code": 1, "err_msg": "Part of is empty."});
			}
		}
		
		if(typeof locationStatus !== 'undefined'){
			if(!validator.isEmpty(locationStatus)){
				qString.status = locationStatus;
			}else{
				res.json({"err_code": 1, "err_msg": "Status of is empty."});
			}
		}

		if(typeof locationType !== 'undefined'){
			if(!validator.isEmpty(locationType)){
				qString.type = locationType;
			}else{
				res.json({"err_code": 1, "err_msg": "Type of is empty."});
			}
		}	
		
		if(typeof organizationId !== 'undefined'){
			if(!validator.isEmpty(organizationId)){
				qString.organizationId = organizationId; 
			}else{
				res.json({"err_code": 1, "err_msg": "organization id is required."});
			}
		}
		
		if(typeof locationPosition !== 'undefined'){
			if(!validator.isEmpty(locationPosition)){
				qString.locationPosition = locationPosition;
			}else{
				res.json({"err_code": 1, "err_msg": "Location Position of is empty."});
			}
		}

		if(typeof locationAddress !== 'undefined'){
			if(!validator.isEmpty(locationAddress)){
				locationAddress = decodeURI(locationAddress);
				if(locationAddress.indexOf(" ") > 0){
					qString.address = locationAddress.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.address = locationAddress; 	
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Address is empty."});
			}
		}

		if(typeof locationAddressCity !== 'undefined'){
			if(!validator.isEmpty(locationAddressCity)){
				locationAddressCity = decodeURI(locationAddressCity);
				if(locationAddressCity.indexOf(" ") > 0){
					qString.city = locationAddressCity.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.city = locationAddressCity; 
				}
			}else{
				res.json({"err_code": 1, "err_msg": "City is empty."});
			}
		}

		if(typeof locationAddressCountry !== 'undefined'){
			if(!validator.isEmpty(locationAddressCountry)){
				locationAddressCountry = decodeURI(locationAddressCountry);
				if(locationAddressCountry.indexOf(" ") > 0){
					qString.country = locationAddressCountry.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.country = locationAddressCountry; 
				}						
			}else{
				res.json({"err_code": 1, "err_msg": "Country is empty."});
			}
		}

		if(typeof locationAddressPostalcode !== 'undefined'){
			if(validator.isPostalCode(locationAddressPostalcode, 'any')){
				qString.postalcode = locationAddressPostalcode; 
			}else{
				res.json({"err_code": 1, "err_msg": "Postal code is invalid format."});
			}
		}

		if(typeof locationAddressState !== 'undefined'){
			if(!validator.isEmpty(locationAddressState)){
				locationAddressState = decodeURI(locationAddressState);
				if(locationAddressState.indexOf(" ") > 0){
					qString.state = locationAddressState.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.state = locationAddressState; 
				}
			}else{
				res.json({"err_code": 1, "err_msg": "State is empty."});
			}
		}

		if(typeof locationAddressUse !== 'undefined'){
			if(!validator.isEmpty(locationAddressUse)){
				qString.addressuse = locationAddressUse; 
			}else{
				res.json({"err_code": 1, "err_msg": "Address use code is empty."});
			}
		}

		if(typeof endpointId !== 'undefined'){
			if(!validator.isEmpty(endpointId)){
				qString.endpoint = endpointId; 
			}else{
				res.json({"err_code": 1, "err_msg": "endpoint is empty."});
			}
		}

		if(typeof identifierLocationId !== 'undefined'){
			if(!validator.isEmpty(identifierLocationId)){
				qString.identifier = identifierLocationId;
			}else{
				res.json({"err_code": 1, "err_msg": "Identifier is empty."});
			}
		}


		seedPhoenixFHIR.path.GET = {
			"Location" : {
				"location": "%(apikey)s/Location",
				"query": qString
			}
		}
		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

		checkApikey(apikey, ipAddres, function(result){
			if(result.err_code == 0){
				ApiFHIR.get('Location', {"apikey": apikey}, {}, function (error, response, body) {
					if(error){
						res.json(error);
					}else{
						var location = JSON.parse(body); //object
						//cek apakah ada error atau tidak
						if(location.err_code == 0){
							//cek jumdata dulu
							if(location.data.length > 0){
								newLocation = [];
								for(i=0; i < location.data.length; i++){
									myEmitter.once('getContactPoint', function(location, index, newLocation, countLocation){
										qString = {};
										qString.location_id = location.id;
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
												var objectLocation = {};
												objectLocation.resourceType = location.resourceType;
												objectLocation.id = location.id;
												var identifierId;															
												if(location.identifierId !== 'null') {
													identifierId = host + ":" + portIdentifier + "/" + apikey + "/identifier?_id=" + location.identifierId;
												} else {
													identifierId = location.identifierId;
												}
												objectLocation.identifier = identifierId;
												objectLocation.status = location.status;
												objectLocation.operationalStatus = location.operationalStatus;
												objectLocation.name = location.name;
												objectLocation.alias = location.alias;
												objectLocation.description = location.description;
												objectLocation.mode = location.mode;
												objectLocation.type = location.type;
												objectLocation.telecom = contactPoint.data;
												objectLocation.addressId = location.addressId;
												objectLocation.physicalType = location.physicalType;
												var managingOrganization;															
												if(location.managingOrganization !== 'null') {
													managingOrganization = host + ":" + port + "/" + apikey + "/Organization?_id=" + location.managingOrganization;
												} else {
													managingOrganization = location.managingOrganization;
												}																
												objectLocation.managingOrganization = managingOrganization;												
												var partOf;															
												if(location.parent_id !== 'null') {
													partOf = host + ":" + port + "/" + apikey + "/Location?_id=" + location.parent_id;
												} else {
													partOf = location.parent_id;
												}																
												objectLocation.partOf = partOf;
												objectLocation.locationPosition = location.locationPosition;
												var endpointId;															
												if(location.endpointId !== 'null') {
													endpointId = host + ":" + port + "/" + apikey + "/Endpoint?_id=" + location.endpointId;
												} else {
													endpointId = location.endpointId;
												}
												objectLocation.endpointId = endpointId;

												newLocation[index] = objectLocation;
console.log(objectLocation);
												myEmitter.once('getAddress', function(location, index, newLocation, countLocation){
													
													qString = {};
													qString.address_id = location.addressId;
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
															var objectLocation = {};
															objectLocation.resourceType = location.resourceType;
															objectLocation.id = location.id;
															objectLocation.identifier = location.identifierId;
															objectLocation.status = location.status;
															objectLocation.operationalStatus = location.operationalStatus;
															objectLocation.name = location.name;
															objectLocation.alias = location.alias;
															objectLocation.description = location.description;
															objectLocation.mode = location.mode;
															objectLocation.type = location.type;
															objectLocation.telecom = location.telecom;
															objectLocation.address = address.data;
															objectLocation.physicalType = location.physicalType;
															objectLocation.managingOrganization = location.managingOrganization;
															objectLocation.partOf = location.partOf;
															objectLocation.locationPosition = location.locationPosition;
															objectLocation.endpointId = location.endpointId;

															newLocation[index] = objectLocation;

															myEmitter.once('getPosition', function(location, index, newLocation, countLocation){
																qString = {};
																qString.locationPosition = location.locationPosition;
																seedPhoenixFHIR.path.GET = {
																	"LocationPosition" : {
																		"location": "%(apikey)s/LocationPosition",
																		"query": qString
																	}
																}

																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																ApiFHIR.get('LocationPosition', {"apikey": apikey}, {}, function(error, response, body){
																	locationPosition = JSON.parse(body);

																	if(locationPosition.err_code == 0){
																		var objectLocation = {};
																		objectLocation.resourceType = location.resourceType;
																		objectLocation.id = location.id;
																		objectLocation.identifier = location.identifierId;
																		objectLocation.status = location.status;
																		objectLocation.operationalStatus = location.operationalStatus;
																		objectLocation.name = location.name;
																		objectLocation.alias = location.alias;
																		objectLocation.description = location.description;
																		objectLocation.mode = location.mode;
																		objectLocation.type = location.type;
																		objectLocation.telecom = location.telecom;
																		objectLocation.address = location.address;
																		objectLocation.physicalType = location.physicalType;
																		objectLocation.position = locationPosition.data;
																		objectLocation.managingOrganization = location.managingOrganization;
																		objectLocation.partOf = location.partOf;
																		objectLocation.endpointId = location.endpointId;

																		newLocation[index] = objectLocation;
																		

																		if(index == countLocation -1 ){
																			res.json({"err_code": 0, "data":newLocation});				
																		}
																	}else{
																		res.json(locationPosition);			
																	}
																})
															})
															myEmitter.emit('getPosition', objectLocation, index, newLocation, countLocation);
														}else{
															res.json(address);			
														}
													})
												})
												myEmitter.emit('getAddress', objectLocation, index, newLocation, countLocation);			
											}else{
												res.json(contactPoint);			
											}
										})
									})
									myEmitter.emit('getContactPoint', location.data[i], i, newLocation, location.data.length);
										
								}
							}else{
								res.json({"err_code": 2, "err_msg": "Location is empty."});	
							}
						}else{
							res.json(location);
						}
					}
				});
			}else{
				result.err_code = 500;
				res.json(result);
			}
		});	
	},
	post: function postLocaftion(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

		var err_code = 0;
		var err_msg = "";

		//location status
		if(typeof req.body.status !== 'undefined'){
			locationStatusCode =  req.body.status.trim().toLowerCase();
			if(validator.isEmpty(locationStatusCode)){
				err_code = 2;
				err_msg = "Location Status is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'status' in json Location request.";
		}
		
		//location operasional status
		if(typeof req.body.operationalStatus !== 'undefined'){
			locationOperationalStatusCode =  req.body.operationalStatus.trim().toLowerCase();
			if(validator.isEmpty(locationOperationalStatusCode)){
				err_code = 2;
				err_msg = "Location Operational Status is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'operational status' in json Location request.";
		}
		
		//location name
		if(typeof req.body.name !== 'undefined'){
			locationNameCode =  req.body.name.trim().toLowerCase();
			if(validator.isEmpty(locationNameCode)){
				err_code = 2;
				err_msg = "Location name is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'name' in json Location request.";
		}
	
		//location alias
		if(typeof req.body.alias !== 'undefined'){
			locationAliasCode =  req.body.alias.trim().toLowerCase();
			if(validator.isEmpty(locationAliasCode)){
				err_code = 2;
				err_msg = "Location alias is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'alias' in json location request.";
		}
		
		//location description
		if(typeof req.body.description !== 'undefined'){
			locationDescriptionCode =  req.body.description.trim().toLowerCase();
			if(validator.isEmpty(locationDescriptionCode)){
				err_code = 2;
				err_msg = "Location description is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'description' in json Location request.";
		}
		
		//location mode
		if(typeof req.body.mode !== 'undefined'){
			locationModeCode =  req.body.mode.trim().toLowerCase();
			if(validator.isEmpty(locationModeCode)){
				err_code = 2;
				err_msg = "Location mode is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'mode' in json Location request.";
		}
		
		//location type
		if(typeof req.body.type !== 'undefined'){
			locationTypeCode =  req.body.type.trim().toLowerCase();
			if(validator.isEmpty(locationTypeCode)){
				err_code = 2;
				err_msg = "Location type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'type' in json Location request.";
		}
		
		//location physical type
		if(typeof req.body.physicalType !== 'undefined'){
			locationPhysicalTypeCode =  req.body.physicalType.trim().toLowerCase();
			if(validator.isEmpty(locationPhysicalTypeCode)){
				err_code = 2;
				err_msg = "Location physical type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'physical type' in json Location request.";
		}
		
		//location managing organization
		if(typeof req.body.managingOrganization !== 'undefined'){
			locationManagingOrganizationCode =  req.body.managingOrganization.trim().toLowerCase();
			if(validator.isEmpty(locationManagingOrganizationCode)){
				err_code = 2;
				err_msg = "Location managing organization is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'managing organization' in json Location request.";
		}
		
		//location partOf
		if(typeof req.body.partOf !== 'undefined'){
			locationPartOfCode =  req.body.partOf.trim().toLowerCase();
			if(validator.isEmpty(locationPartOfCode)){
				err_code = 2;
				err_msg = "location partOf is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'partOf' in json location request.";
		}
		
		if(typeof req.body.endpoint !== 'undefined'){
			locationEndpointCode =  req.body.endpoint.trim().toLowerCase();
			if(validator.isEmpty(locationEndpointCode)){
				err_code = 2;
				err_msg = "location endpoint is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'endpoint' in json location request.";
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
		
		//location position longitude
		if(typeof req.body.position.longitude !== 'undefined'){
			locationLongitudeCode =  req.body.position.longitude.trim().toLowerCase();
			if(validator.isEmpty(locationLongitudeCode)){
				err_code = 2;
				err_msg = "location position longitude is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'position longitude' in json location request.";
		}
		
		///location position latitude
		if(typeof req.body.position.latitude !== 'undefined'){
			locationLatitudeCode =  req.body.position.latitude.trim().toLowerCase();
			if(validator.isEmpty(locationLatitudeCode)){
				err_code = 2;
				err_msg = "location position latitude is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'position latitude' in json location request.";
		}
		
		//location position altitude
		if(typeof req.body.position.altitude !== 'undefined'){
			locationAltitudeCode =  req.body.position.altitude.trim().toLowerCase();
			if(validator.isEmpty(locationAltitudeCode)){
				err_code = 2;
				err_msg = "location position altitude is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'position altitude' in json location request.";
		}
		
		

		if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){				 
					 //code harus lebih besar dari nol, ini menunjukan datanya valid
					
					checkCode(apikey, locationStatusCode, 'LOCATION_STATUS', function(resLocationStatus){
						if(resLocationStatus.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							checkCode(apikey, locationModeCode, 'LOCATION_MODE', function(resLocationMode){
								if(resLocationMode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									checkCode(apikey, locationOperationalStatusCode, 'BED_STATUS', function(resLocationOperationalStatus){
										if(resLocationOperationalStatus.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											checkCode(apikey, locationTypeCode, 'SERVICE_DELIVERY_LOCATION_ROLE_TYPE', function(resLocationType){
												if(resLocationType.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
													checkCode(apikey, locationPhysicalTypeCode, 'LOCATION_PHYSICAL_TYPE', function(resLocationPhysicalType){
														if(resLocationPhysicalType.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
															checkCode(apikey, addressUseCode, 'ADDRESS_USE', function(resAddressUseCode){
																if(resAddressUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																	checkCode(apikey, addressTypeCode, 'ADDRESS_TYPE', function(resAddressTypeCode){
																		if(resAddressTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							
					/////
																			checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
																				if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																					checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
																						if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid		

																						 //event emiter
																							myEmitter.prependOnceListener('checkLocationId', function() {
																								//untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
																								checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
																									if(resContactPointValue.err_code == 0){
																										checkUniqeValue(apikey, "ORGANIZATION_ID|" + locationManagingOrganizationCode, 'ORGANIZATION', function(resManagingOrganization){
																											if(locationManagingOrganizationCode == 'null') {
																												resManagingOrganization.err_code = 2;
																											}
																											if(resManagingOrganization.err_code == 2){ 	
																												
																												checkUniqeValue(apikey, "ENDPOINT_ID|" + locationEndpointCode, 'ENDPOINT', function(resEndpointValue){
																														if(locationEndpointCode == 'null') {
																															resEndpointValue.err_code = 2;
																														}
																														if(resEndpointValue.err_code == 2){
																															
																															checkUniqeValue(apikey, "LOCATION_ID|" + locationPartOfCode, 'LOCATION', function(resLocationPartOfCode){
																																if(locationPartOfCode == 'null') {
																																	resLocationPartOfCode.err_code = 2;
																																}
																																if(resLocationPartOfCode.err_code == 2){ 	
																																	//proses insert

																																	//set uniqe id
																																	var unicId = uniqid.time();
																																	var locationId = 'loc' + unicId;
																																	var locationPositionId = 'lop' + unicId;
																																	var contactPointId = 'cop' + unicId;
																																	var addressId = 'add' + unicId;

																																	dataLocation = {
																																		"id" : locationId,
																																		"status" : locationStatusCode,
																																		"operationalStatus" : locationOperationalStatusCode,
																																		"name" : locationNameCode,
																																		"alias" : locationAliasCode,
																																		"description" : locationDescriptionCode,
																																		"mode" : locationModeCode,
																																		"type" : locationTypeCode,
																																		"physicalType" : locationPhysicalTypeCode,
																																		"managingOrganization" : locationManagingOrganizationCode,
																																		"parent_id" : locationPartOfCode,
																																		"addressId" : addressId,
																																		"locationPositionId" : locationPositionId,
																																		"locationEndpointId" : locationEndpointCode
																																	}
																																	ApiFHIR.post('location', {"apikey": apikey}, {body: dataLocation, json: true}, function(error, response, body){
																																		console.log(body);
																																		location = body;
																																		if(location.err_code > 0){
																																			res.json(location);	
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
																																											"location_id": locationId
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
																																									}

																																	//post to contact point
																																	console.log(dataAddress);
																																	ApiFHIR.post('address', {"apikey": apikey}, {body: dataAddress, json: true}, function(error, response, body){
																																		address = body;
																																		if(address.err_code > 0){
																																			res.json(address);	
																																		}
																																	})

																																	//locationPosition
																																	dataLocationPosition = {
																																									"id": locationPositionId,
																																									"longitude": locationLongitudeCode,
																																									"latitude": locationLatitudeCode,
																																									"altitude": locationAltitudeCode
																																								}

																																	//post to contact point
																																	ApiFHIR.post('locationPosition', {"apikey": apikey}, {body: dataLocationPosition, json: true}, function(error, response, body){
																																		locationPosition = body;
																																		if(locationPosition.err_code > 0){
																																			res.json(locationPosition);	
																																		}
																																	})

																																	res.json({"err_code": 0, "err_msg": "Location has been add.", "data": [{"_id": locationId}]});
																																	
																																}else{
																																	res.json({"err_code": 509, "err_msg": "Location Part Of is not exist."});			
																																}
																															})
																										
																														}else{
																															res.json({"err_code": 509, "err_msg": "Endpoint value is not exist."});			
																														}
																													})
																											
																											}else{
																												res.json({"err_code": 509, "err_msg": "Managing Organization is not exist."});			
																											}
																										})																	
																										
																									}else{
																										res.json({"err_code": 508, "err_msg": "Telecom value already exist."});			
																									}
																								})
																							});
																							myEmitter.emit('checkLocationId');	
																						}else{
																							res.json({"err_code": 504, "err_msg": "Contact Point Use Code not found"});
																						}
																					})
																				}else{
																					res.json({"err_code": 504, "err_msg": "Contact Point System Code not found"});		
																				}
																			})
					//////
																		}else{
																			res.json({"err_code": 504, "err_msg": "Address Type Code not found"});	
																		}
																	})
																}else{
																	res.json({"err_code": 504, "err_msg": "Address Use Code not found"});	
																}
															})
														}else{
															res.json({"err_code": 504, "err_msg": "Location Physical Type Code not found"});		
														}
													})
												}else{
													res.json({"err_code": 504, "err_msg": "Location Type Code not found"});		
												}
											})
										}else{
											res.json({"err_code": 504, "err_msg": "Location Operational Status Code not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Location Mode Code not found"});		
								}
							})
							
						}else{
							res.json({"err_code": 504, "err_msg": "Location Status Code not found"});		
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