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
seedPhoenix.base.port = configYaml.phoenix.port;

var Api = new Apiclient(seedPhoenix);

seedPhoenixFHIR = require(path.resolve('../../application/config/seed_phoenix_fhir.json'));
seedPhoenixFHIR.base.hostname = configYaml.phoenix.host;
seedPhoenixFHIR.base.port = configYaml.phoenix.port;

var ApiFHIR = new Apiclient(seedPhoenixFHIR);

var controller = {
	get:{
		bodySite: function getBodySite(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var bodySiteId = req.query._id;
			var code = req.query.code;
			var identifier = req.query.identifier;
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
			
			if (typeof bodySiteId !== 'undefined') {
        if (!validator.isEmpty(bodySiteId)) {
          qString._id = bodySiteId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Body Site ID is required."
          })
        }
      }
			
			if (typeof code !== 'undefined') {
        if (!validator.isEmpty(code)) {
          qString.code = code;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Body Site code is required."
          })
        }
      }
			
			if (typeof identifier !== 'undefined') {
        if (!validator.isEmpty(identifier)) {
          qString.identifier = identifier;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Body Site identifier is required."
          })
        }
      }
			
			if (typeof patient !== 'undefined') {
        if (!validator.isEmpty(patient)) {
          qString.patient = patient;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Body Site patient is required."
          })
        }
      }
			
			seedPhoenixFHIR.path.GET = {
        "BodySite": {
          "location": "%(apikey)s/BodySite",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('BodySite', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var bodySite = JSON.parse(body);
							if (bodySite.err_code == 0) {
								if (bodySite.data.length > 0) {
									newBodySite = [];
									for (i = 0; i < bodySite.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (bodySite, index, newBodySite, countBodySite) {
											qString = {};
                      qString.body_site_id = bodySite.id;
                      seedPhoenixFHIR.path.GET = {
                        "Identifier": {
                          "location": "%(apikey)s/Identifier",
                          "query": qString
                        }
                      }
											var ApiFHIR = new Apiclient(seedPhoenixFHIR);
                      ApiFHIR.get('Identifier', {
                        "apikey": apikey
                      }, {}, function (error, response, body) {
												identifier = JSON.parse(body);
												if (identifier.err_code == 0) {
													var objectBodySite = {};
													objectBodySite.resourceType = bodySite.resourceType;
													objectBodySite.id = bodySite.id;
													objectBodySite.identifier = identifier.data;
													objectBodySite.bodysiteActive = bodySite.bodysite_active;
													objectBodySite.code = bodySite.code;
													objectBodySite.qualifier = bodySite.qualifier;
													objectBodySite.issued = bodySite.issued;
													objectBodySite.description = bodySite.description;
													objectBodySite.patient = bodySite.patient;
													newBodySite[index] = objectBodySite
													
													/*if (index == countBodySite - 1) {
														res.json({
															"err_code": 0,
															"data": newBodySite
														});
													}*/
myEmitter.prependOnceListener("getAttachment", function (bodySite, index, newBodySite, countBodySite) {
	qString = {};
	qString.body_site_id = bodySite.id;
	seedPhoenixFHIR.path.GET = {
		"Attachment": {
			"location": "%(apikey)s/Attachment",
			"query": qString
		}
	}
	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
	ApiFHIR.get('Attachment', {
		"apikey": apikey
	}, {}, function (error, response, body) {
		attachment = JSON.parse(body);
		if (attachment.err_code == 0) {
			var objectBodySite = {};
			objectBodySite.resourceType = bodySite.resourceType;
			objectBodySite.id = bodySite.id;
			objectBodySite.identifier = bodySite.identifier;
			objectBodySite.bodysiteActive = bodySite.bodysite_active;
			objectBodySite.code = bodySite.code;
			objectBodySite.qualifier = bodySite.qualifier;
			objectBodySite.issued = bodySite.issued;
			objectBodySite.description = bodySite.description;
			objectBodySite.image = attachment.data;
			objectBodySite.patient = bodySite.patient;
			newBodySite[index] = objectBodySite

			if (index == countBodySite - 1) {
				res.json({
					"err_code": 0,
					"data": newBodySite
				});
			}
		} else {
			res.json(identifier);
		}
	})
})
myEmitter.emit("getAttachment", objectBodySite, index, newBodySite, countBodySite);
		
													
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", bodySite.data[i], i, newBodySite, bodySite.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Body Site is empty."
                  });
                }
							} else {
                res.json(bodySite);
              }
						}
					});
				} else {
          result.err_code = 500;
          res.json(result);
        }
			});
		},
		identifier: function getIdentifier(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var bodySiteId = req.params.body_site_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "BODY_SITE_ID|" + bodySiteId, 'BODYSITE', function(resBodySiteID){
								if(resBodySiteID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.body_site_id = bodySiteId;
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
						  			qString.body_site_id = bodySiteId;
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
									res.json({"err_code": 501, "err_msg": "Body Site Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		attachment: function getAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var bodySiteId = req.params.body_site_id;
			var attachmentId = req.params.attachment_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "BODY_SITE_ID|" + bodySiteId, 'BODYSITE', function(resBody_siteID){
						if(resBody_siteID.err_code > 0){
							if(typeof attachmentId !== 'undefined' && !validator.isEmpty(attachmentId)){
								checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
									if(resAttachmentID.err_code > 0){
										qString = {};
										qString.body_site_id = bodySiteId;
										qString._id = attachmentId;
										seedPhoenixFHIR.path.GET = {
											"Attachment" : {
												"location": "%(apikey)s/Attachment",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
											attachment = JSON.parse(body);
											if(attachment.err_code == 0){
												res.json({"err_code": 0, "data":attachment.data});	
											}else{
												res.json(address);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Attachment Id not found"});		
									}
								})
							}else{
								qString = {};
								qString.body_site_id = bodySiteId;

								seedPhoenixFHIR.path.GET = {
									"Attachment" : {
										"location": "%(apikey)s/Attachment",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
									attachment = JSON.parse(body);
									if(attachment.err_code == 0){
										res.json({"err_code": 0, "data":attachment.data});	
									}else{
										res.json(attachment);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Body site id not found"});		
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
		bodySite: function addBodySite(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var err_code = 0;
      var err_msg = "";
			
			//input check
      if (typeof req.body.identifier.use !== 'undefined') {
        var identifierUseCode = req.body.identifier.use.trim().toLowerCase();
        if (validator.isEmpty(identifierUseCode)) {
          err_code = 2;
          err_msg = "Identifier Use is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'use' in json identifier request.";
      }
      if (typeof req.body.identifier.type !== 'undefined') {
        var identifierTypeCode = req.body.identifier.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          err_code = 2;
          err_msg = "Identifier Type is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'type' in json identifier request.";
      }
      if (typeof req.body.identifier.value !== 'undefined') {
        var identifierValue = req.body.identifier.value.trim().toLowerCase();
        if (validator.isEmpty(identifierValue)) {
          err_code = 2;
          err_msg = "Identifier Value is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'value' in json identifier request.";
      }
      if (typeof req.body.identifier.period !== 'undefined') {
        var identifierPeriod = req.body.identifier.period;
        if (identifierPeriod.indexOf("to") > 0) {
          arrIdentifierPeriod = identifierPeriod.split("to");
          identifierPeriodStart = arrIdentifierPeriod[0];
          identifierPeriodEnd = arrIdentifierPeriod[1];
          if (!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)) {
            err_code = 2;
            err_msg = "Identifier Period invalid date format.";
          }
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'identifierPeriod' in json identifier request.";
      }
			
			if (typeof req.body.active !== 'undefined') {
				var active = req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					active = "false";
				}
				if(active === "true" || active === "false"){
					active = active;
				} else {
					err_code = 2;
					err_msg = "Body Site active is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'active' in json Body Site request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Body Site request.";
			}

			if(typeof req.body.qualifier !== 'undefined'){
				var qualifier =  req.body.qualifier.trim().toLowerCase();
				if(validator.isEmpty(qualifier)){
					qualifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'qualifier' in json Body Site request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					description = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Body Site request.";
			}
			
			if(typeof req.body.image.language !== 'undefined'){
				attachmentLanguageCode =  req.body.image.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'language' in json request.";
			}

			//photo data
			if(typeof req.body.image.data !== 'undefined'){
				attachmentData =  req.body.image.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'data' in json request.";
			}

			//photo size
			if(typeof req.body.image.size !== 'undefined'){
				attachmentSize =  req.body.image.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'size' in json request.";
			}

			//photo title
			if(typeof req.body.image.title !== 'undefined'){
				attachmentTitle =  req.body.image.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'title' in json request.";
			}

			//photo content_type
			if(typeof req.body.image.content_type !== 'undefined'){
				attachmentContentType =  req.body.image.content_type;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'content_type' in json request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Body Site request.";
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
														var bodySiteId = 'bos' + unicId;
														var attachmentId = 'att' + uniqid.time();
														
														dataBodySite = {
															"bodysite_id" : bodySiteId,
															"bodysite_active" : active,
															"code" : code,
															"qualifier" : qualifier,
															"description" : description,
															"patient_id" : patient
														}
														console.log(dataBodySite);
														ApiFHIR.post('bodysite', {"apikey": apikey}, {body: dataBodySite, json: true}, function(error, response, body){
															bodySite = body;
															if(bodySite.err_code > 0){
																res.json(bodySite);	
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
																							"body_site_id": bodySiteId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														var dataAttachment = {
															"id": attachmentId,
															"content_type": attachmentContentType,
															"language": attachmentLanguageCode,
															"data": attachmentData,
															"size": attachmentSize,
															"hash": sha1(attachmentData),
															"title": attachmentTitle,
															"creation": getFormattedDate(),
															"url": host + ':' + port + '/' + apikey + '/bodySite/'+bodySiteId+'/Photo/' + attachmentId,
															"body_site_id": bodySiteId
														}

														ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
															//cek apakah ada error atau tidak
															var attachment = body; //object
															//cek apakah ada error atau tidak
															if(attachment.err_code > 0){
																res.json(attachment);		
															}
														})
										
														res.json({"err_code": 0, "err_msg": "Body Site has been add.", "data": [{"_id": bodySiteId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										myEmitter.prependOnceListener('checkCode', function () {
											if (!validator.isEmpty(code)) {
												checkCode(apikey, code, 'BODY_SITE', function (resCodeCode) {
													if (resCodeCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkQualifier', function () {
											if (!validator.isEmpty(qualifier)) {
												checkCode(apikey, qualifier, 'BODYSITE_LATERALITY', function (resQualifierCode) {
													if (resQualifierCode.err_code > 0) {
														myEmitter.emit('checkCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Qualifier code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCode');
											}
										})
										
										myEmitter.prependOnceListener('checkAttachmentLanguageCode', function () {
											if (!validator.isEmpty(attachmentLanguageCode)) {
												checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resAttachmentLanguageCode){
													if (resAttachmentLanguageCode.err_code > 0) {
														myEmitter.emit('checkQualifier');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Attachment language code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkQualifier');
											}
										})
											
										if (!validator.isEmpty(patient)) {
											checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
												if (resPatient.err_code > 0) {
													myEmitter.emit('checkAttachmentLanguageCode');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Patient id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAttachmentLanguageCode');
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
		identifier: function addIdentifier(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var bodySiteId = req.params.body_site_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof bodySiteId !== 'undefined') {
        if (validator.isEmpty(bodySiteId)) {
          err_code = 2;
          err_msg = "Body Site id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Body Site id is required";
      }
      //identifier
      if (typeof req.body.use !== 'undefined') {
        identifierUseCode = req.body.use.trim().toLowerCase();
        if (validator.isEmpty(identifierUseCode)) {
          err_code = 2;
          err_msg = "Identifier Use is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'use' in json request.";
      }
      //type code
      if (typeof req.body.type !== 'undefined') {
        identifierTypeCode = req.body.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          err_code = 2;
          err_msg = "Identifier Type is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'type' in json request.";
      }
			//identifier uniqe value
      if (typeof req.body.value !== 'undefined') {
        identifierValue = req.body.value.trim();
        if (validator.isEmpty(identifierValue)) {
          err_code = 2;
          err_msg = "Identifier Value is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'value' in json request.";
      }
      //identifier period start
      if (typeof req.body.period !== 'undefined') {
        period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          identifierPeriodStart = arrPeriod[0];
          identifierPeriodEnd = arrPeriod[1];

          if (!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)) {
            err_code = 2;
            err_msg = "Identifier Period invalid date format.";
          }
        } else {
          err_code = 1;
          err_msg = "Identifier Period format is wrong, `ex: start to end` ";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'period' in json identifier request.";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function (resUseCode) {
              if (resUseCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function (resUseTypeCode) {
                  if (resUseTypeCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                    checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resUniqeValue) {
                      if (resUniqeValue.err_code == 0) {
                        checkUniqeValue(apikey, "BODY_SITE_ID|" + bodySiteId, 'BODYSITE', function (resEncounterID) {
                          if (resEncounterID.err_code > 0) {
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
                              "body_site_id": bodySiteId
                            }

                            ApiFHIR.post('identifier', {
                              "apikey": apikey
                            }, {
                              body: dataIdentifier,
                              json: true
                            }, function (error, response, body) {
                              identifier = body;
                              if (identifier.err_code == 0) {
                                res.json({
                                  "err_code": 0,
                                  "err_msg": "Identifier has been add in this Body Site.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "Body Site Id not found"
                            });
                          }
                        })
                      } else {
                        res.json({
                          "err_code": 504,
                          "err_msg": "Identifier value already exist."
                        });
                      }
                    })

                  } else {
                    res.json({
                      "err_code": 502,
                      "err_msg": "Identifier type code not found"
                    });
                  }
                })
              } else {
                res.json({
                  "err_code": 501,
                  "err_msg": "Identifier use code not found"
                });
              }
            })
          } else {
            result.err_code = 500;
            res.json(result);
          }
        });
      } else {
        res.json({
          "err_code": err_code,
          "err_msg": err_msg
        });
      }
    },
		attachment: function addAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var bodySiteId = req.params.body_site_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof bodySiteId !== 'undefined'){
				if(validator.isEmpty(bodySiteId)){
					err_code = 2;
					err_msg = "Body site id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Body site id is required";
			}

			if(typeof req.body.language !== 'undefined'){
				attachmentLanguageCode =  req.body.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'language' in json request.";
			}

			//photo data
			if(typeof req.body.data !== 'undefined'){
				attachmentData =  req.body.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'data' in json request.";
			}

			//photo size
			if(typeof req.body.size !== 'undefined'){
				attachmentSize =  req.body.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'size' in json request.";
			}

			//photo title
			if(typeof req.body.title !== 'undefined'){
				attachmentTitle =  req.body.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'title' in json request.";
			}

			//photo content_type
			if(typeof req.body.content_type !== 'undefined'){
				attachmentContentType =  req.body.content_type;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'content_type' in json request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "BODY_SITE_ID|" + bodySiteId, 'BODYSITE', function(resBody_siteID){
							if(resBody_siteID.err_code > 0){
								checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguage){
									if(resLanguage.err_code > 0){
										// attachment
										var attachmentId = 'att' + uniqid.time();
										var dataAttachment = {
											"id": attachmentId,
											"content_type": attachmentContentType,
											"language": attachmentLanguageCode,
											"data": attachmentData,
											"size": attachmentSize,
											"hash": sha1(attachmentData),
											"title": attachmentTitle,
											"creation": getFormattedDate(),
											"url": host + ':' + port + '/' + apikey + '/bodySite/'+bodySiteId+'/Photo/' + attachmentId,
											"body_site_id": bodySiteId
										}

										//method, endpoint, params, options, callback
										ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
											//cek apakah ada error atau tidak
											var attachment = body; //object
											//cek apakah ada error atau tidak
											if(attachment.err_code == 0){
												res.json({"err_code": 0, "err_msg": "Photo has been add in this body site.", "data": attachment.data});
											}else{
												res.json(attachment);		
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Language code not found"});			
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Body site id not found"});	
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
	},
	put:{
		bodySite: function updateBodySite(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var bodySiteId = req.params.body_site_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataBodySite = {};
			
			if (typeof bodySiteId !== 'undefined') {
        if (validator.isEmpty(bodySiteId)) {
          err_code = 2;
          err_msg = "Body Site Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Body Site Id is required.";
      }
			
			if (typeof req.body.active !== 'undefined' && req.body.active !== "") {
			  var active = req.body.active.trim().toLowerCase();
					if(validator.isEmpty(active)){
						active = "false";
					}
			  if(active === "true" || active === "false"){
					dataBodySite.bodysite_active = active;
			  } else {
			    err_code = 2;
			    err_msg = "Body site active is must be boolean.";
			  }
			} else {
			  active = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					dataBodySite.code = "";
				}else{
					dataBodySite.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.qualifier !== 'undefined' && req.body.qualifier !== ""){
				var qualifier =  req.body.qualifier.trim().toLowerCase();
				if(validator.isEmpty(qualifier)){
					dataBodySite.qualifier = "";
				}else{
					dataBodySite.qualifier = qualifier;
				}
			}else{
			  qualifier = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					dataBodySite.description = "";
				}else{
					dataBodySite.description = description;
				}
			}else{
			  description = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataBodySite.patient_id = "";
				}else{
					dataBodySite.patient_id = patient;
				}
			}else{
			  patient = "";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "BODY_SITE_ID|" + bodySiteId, 'BODYSITE', function (resBodySiteId) {
								if (resBodySiteId.err_code > 0) {
									ApiFHIR.put('bodysite', {
										"apikey": apikey,
										"_id": bodySiteId
									}, {
										body: dataBodySite,
										json: true
									}, function (error, response, body) {
										bodySite = body;
										if (bodySite.err_code > 0) {
											res.json(bodySite);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Body Site has been updated.",
												"data": bodySite.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Body Site Id not found"
									});
								}
							})
						})
						
						myEmitter.prependOnceListener('checkCode', function () {
							if (!validator.isEmpty(code)) {
								checkCode(apikey, code, 'BODY_SITE', function (resCodeCode) {
									if (resCodeCode.err_code > 0) {
										myEmitter.emit('checkId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkId');
							}
						})

						myEmitter.prependOnceListener('checkQualifier', function () {
							if (!validator.isEmpty(qualifier)) {
								checkCode(apikey, qualifier, 'BODYSITE_LATERALITY', function (resQualifierCode) {
									if (resQualifierCode.err_code > 0) {
										myEmitter.emit('checkCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Qualifier code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCode');
							}
						})

						if (!validator.isEmpty(patient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
								if (resPatient.err_code > 0) {
									myEmitter.emit('checkQualifier');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkQualifier');
						}
					} else {
            result.err_code = "500";
            res.json(result);
          }
				});
			} else {
        res.json({
          "err_code": err_code,
          "err_msg": err_msg
        });
      }
		},
		identifier: function updateIdentifier(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var bodySiteId = req.params.body_site_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof bodySiteId !== 'undefined') {
        if (validator.isEmpty(bodySiteId)) {
          err_code = 2;
          err_msg = "Body Site id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Body Site id is required";
      }
      if (typeof identifierId !== 'undefined') {
        if (validator.isEmpty(identifierId)) {
          err_code = 2;
          err_msg = "Identifier id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Identifier id is required";
      }
      //identifier
      if (typeof req.body.use !== 'undefined') {
        var identifierUseCode = req.body.use.trim().toLowerCase();
        if (validator.isEmpty(identifierUseCode)) {
          identifierUseCode = "";
        }
        dataIdentifier.use = identifierUseCode;
      } else {
        identifierUseCode = "";
      }
      //type code
      if (typeof req.body.type !== 'undefined') {
        var identifierTypeCode = req.body.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          identifierTypeCode = "";
        }
        dataIdentifier.type = identifierTypeCode;
      } else {
        identifierTypeCode = "";
      }
      //identifier uniqe value
      if (typeof req.body.value !== 'undefined') {
        var identifierValue = req.body.value.trim();
        if (validator.isEmpty(identifierValue)) {
          identifierValue = "";
        }
        dataIdentifier.value = identifierValue;
        dataIdentifier.system = identifierId;
       } else {
        identifierValue = "";
      }
      //identifier period start
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          identifierPeriodStart = arrPeriod[0];
          identifierPeriodEnd = arrPeriod[1];

          if (!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)) {
            err_code = 2;
            err_msg = "Identifier Period invalid date format.";
          } else {
            dataIdentifier.period_start = identifierPeriodStart;
            dataIdentifier.period_end = identifierPeriodEnd;
          }
        } else {
          err_code = 1;
          err_msg = "Period request format is wrong, `ex: start to end` ";
        }
      } else {
        identifierPeriodStart = "";
        identifierPeriodEnd = "";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            myEmitter.once('checkBodySiteId', function () {
              checkUniqeValue(apikey, "BODY_SITE_ID|" + bodySiteId, 'BODYSITE', function (resBodySiteId) {
                if (resBodySiteId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "BODY_SITE_ID|" + bodySiteId
                      }, {
                        body: dataIdentifier,
                        json: true
                      }, function (error, response, body) {
                        identifier = body;
                        if (identifier.err_code > 0) {
                          res.json(identifier);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Identifier has been update in this Body Site.",
                            "data": identifier.data
                          });
                        }
                      })
                    } else {
                      res.json({
                        "err_code": 505,
                        "err_msg": "Identifier Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 504,
                    "err_msg": "Body Site Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkBodySiteId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkBodySiteId');
                  } else {
                    res.json({
                      "err_code": 503,
                      "err_msg": "Identifier value already exist."
                    });
                  }
                })
              }
            })
            myEmitter.prependOnceListener('checkIdentifierType', function () {
              if (validator.isEmpty(identifierTypeCode)) {
                myEmitter.emit('checkIdentifierValue');
              } else {
                checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function (resUseTypeCode) {
                  if (resUseTypeCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                    myEmitter.emit('checkIdentifierValue');
                  } else {
                    res.json({
                      "err_code": 502,
                      "err_msg": "Identifier type code not found"
                    });
                  }
                })
              }
            })
            if (validator.isEmpty(identifierUseCode)) {
              myEmitter.emit('checkIdentifierType');
            } else {
              checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function (resUseCode) {
                if (resUseCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkIdentifierType');
                } else {
                  res.json({
                    "err_code": 501,
                    "err_msg": "Identifier use code not found"
                  });
                }
              })
            }
          } else {
            result.err_code = 500;
            res.json(result);
          }
        });
      } else {
        res.json({
          "err_code": err_code,
          "err_msg": err_msg
        });
      }
    },
		attachment: function updateAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var bodySiteId = req.params.body_site_id;
			var attachmentId = req.params.attachment_id;

			var err_code = 0;
			var err_msg = "";
			var dataAttachment = {};

			//input check 
			if(typeof bodySiteId !== 'undefined'){
				if(validator.isEmpty(bodySiteId)){
					err_code = 2;
					err_msg = "Body site id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Body site id is required";
			}

			if(typeof attachmentId !== 'undefined'){
				if(validator.isEmpty(attachmentId)){
					err_code = 2;
					err_msg = "Photo id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Photo id is required";
			}

			if(typeof req.body.language !== 'undefined'){
				attachmentLanguageCode =  req.body.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}else{
					dataAttachment.language = attachmentLanguageCode;
				}
			}else{
				attachmentLanguageCode = "";
			}

			//photo data
			if(typeof req.body.data !== 'undefined'){
				attachmentData =  req.body.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}else{
					dataAttachment.data = attachmentData;
				}
			}else{
				attachmentData = "";
			}

			//photo size
			if(typeof req.body.size !== 'undefined'){
				attachmentSize =  req.body.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
					dataAttachment.size = attachmentSize;
				}
			}

			//photo title
			if(typeof req.body.title !== 'undefined'){
				attachmentTitle =  req.body.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}else{
					dataAttachment.title = attachmentTitle;
				}
			}

			//photo content_type
			if(typeof req.body.content_type !== 'undefined'){
				attachmentContentType =  req.body.content_type;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
					dataAttachment.content_type = attachmentContentType;
				}
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkBodySiteID', function(){
							checkUniqeValue(apikey, "BODY_SITE_ID|" + bodySiteId, 'BODYSITE', function(resBody_siteID){
								if(resBody_siteID.err_code > 0){
									checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
										if(resAttachmentID.err_code > 0){
											ApiFHIR.put('attachment', {"apikey": apikey, "_id": attachmentId, "dr": "BODY_SITE_ID|"+bodySiteId}, {body: dataAttachment, json: true}, function(error, response, body){
												attachment = body;
												if(attachment.err_code > 0){
													res.json(attachment);	
												}else{
													res.json({"err_code": 0, "err_msg": "Photo has been update in this body site.", "data": attachment.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Photo Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Body_site Id not found"});		
								}
							})
						})

						if(validator.isEmpty(attachmentLanguageCode)){
							myEmitter.emit('checkBodySiteID');	
						}else{
							checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguageCode){
								if(resLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkBodySiteID');
								}else{
									res.json({"err_code": 501, "err_msg": "Language Code not found"});
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
	}
}

function checkApikey(apikey, ipAddress, callback) {
  //method, endpoint, params, options, callback
  Api.get('check_apikey', {
    "apikey": apikey
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      user = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (user.err_code == 0) {
        //cek jumdata dulu
        if (user.data.length > 0) {
          //check user_role_id == 1 <-- admin/root
          if (user.data[0].user_role_id == 1) {
            x({
              "err_code": 0,
              "status": "root",
              "user_role_id": user.data[0].user_role_id,
              "user_id": user.data[0].user_id
            });
          } else {
            //cek apikey
            if (apikey == user.data[0].user_apikey) {
              //ipaddress
              dataIpAddress = user.data[0].user_ip_address;
              if (dataIpAddress.indexOf(ipAddress) >= 0) {
                //user is active
                if (user.data[0].user_is_active) {
                  //cek data user terpenuhi
                  x({
                    "err_code": 0,
                    "status": "active",
                    "user_role_id": user.data[0].user_role_id,
                    "user_id": user.data[0].user_id
                  });
                } else {
                  x({
                    "err_code": 5,
                    "err_msg": "User is not active"
                  });
                }
              } else {
                x({
                  "err_code": 4,
                  "err_msg": "Ip Address not registered"
                });
              }
            } else {
              x({
                "err_code": 3,
                "err_msg": "Wrong apikey"
              });
            }
          }

        } else {
          x({
            "err_code": 2,
            "err_msg": "Wrong apikey"
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": user.error,
          "application": "Api User Management",
          "function": "checkApikey"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function checkId(apikey, tableId, tableName, callback) {
  ApiFHIR.get('checkId', {
    "apikey": apikey,
    "id": tableId,
    "name": tableName
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      dataId = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (dataId.err_code == 0) {
        //cek jumdata dulu
        if (dataId.data.length > 0) {
          x({
            "err_code": 0,
            "err_msg": "Id is valid."
          })
        } else {
          x({
            "err_code": 2,
            "err_msg": "Id is not found."
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": dataId.error,
          "application": "API FHIR",
          "function": "checkId"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function checkCode(apikey, code, tableName, callback) {
  ApiFHIR.get('checkCode', {
    "apikey": apikey,
    "code": code,
    "name": tableName
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      dataId = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (dataId.err_code == 0) {
        //cek jumdata dulu
        if (dataId.data.length > 0) {
          x({
            "err_code": 2,
            "err_msg": "Code is already exist."
          })
        } else {
          x({
            "err_code": 0,
            "err_msg": "Code is available to used."
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": dataId.error,
          "application": "API FHIR",
          "function": "checkCode"
        });
      }
    }
  });
  function x(result) {
    callback(result)
  }
}

function checkMultiCode(apikey, code_array, tableName, callback) {
	var code_array = str.split(',');
	for(var i = 0; i < code_array.length; i++) {
		code_array[i] = code_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		ApiFHIR.get('checkMultiCode', {
			"apikey": apikey,
			"code": code_array[i],
			"name": tableName
		}, {}, function (error, response, body) {
			if (error) {
				x(error);
			} else {
				dataId = JSON.parse(body);
				//cek apakah ada error atau tidak
				if (dataId.err_code == 0) {
					//cek jumdata dulu
					if (dataId.data.length > 0) {
						x({
							"err_code": 2,
							"err_msg": "Code is already exist."
						})
					} else {
						x({
							"err_code": 0,
							"err_msg": "Code is available to used."
						});
					}
				} else {
					x({
						"err_code": 1,
						"err_msg": dataId.error,
						"application": "API FHIR",
						"function": "checkCode"
					});
				}
			}
		});
	}
  function x(result) {
    callback(result)
  }
}

function checkUniqeValue(apikey, fdValue, tableName, callback) {
  ApiFHIR.get('checkUniqeValue', {
    "apikey": apikey,
    "fdvalue": fdValue,
    "tbname": tableName
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      dataId = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (dataId.err_code == 0) {
        //cek jumdata dulu
        if (dataId.data.length > 0) {
          x({
            "err_code": 2,
            "err_msg": "The value is already exist."
          })
        } else {
          x({
            "err_code": 0,
            "err_msg": "The value is available to insert."
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": dataId.error,
          "application": "API FHIR",
          "function": "checkCode"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function checkGroupQouta(apikey, groupId, callback) {
  ApiFHIR.get('checkGroupQouta', {
    "apikey": apikey,
    "group_id": groupId
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      quota = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (quota.err_code == 0) {
        //cek jumdata dulu
        if (quota.data.length > 0) {
          groupQuota = parseInt(quota.data[0].quantity);
          memberCount = parseInt(quota.data[0].total_member);

          if (memberCount <= groupQuota) {
            x({
              "err_code": 0,
              "err_msg": "Group quota is ready"
            });
          } else {
            x({
              "err_code": 1,
              "err_msg": "Group quota is full, total member " + groupQuota
            });
          }
        } else {
          x({
            "err_code": 0,
            "err_msg": "Group quota is ready"
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": quota,
          "application": "API FHIR",
          "function": "checkGroupQouta"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function checkMemberEntityGroup(apikey, entityId, groupId, callback) {
  ApiFHIR.get('checkMemberEntityGroup', {
    "apikey": apikey,
    "entity_id": entityId,
    "group_id": groupId
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      entity = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (entity.err_code == 0) {
        if (parseInt(entity.data.length) > 0) {
          x({
            "err_code": 2,
            "err_msg": "Member entity already exist in this group."
          });
        } else {
          x({
            "err_code": 0,
            "err_msg": "Member not found in this group."
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": entity,
          "application": "API FHIR",
          "function": "checkMemberEntityGroup"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
}

function formatDate(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

module.exports = controller;