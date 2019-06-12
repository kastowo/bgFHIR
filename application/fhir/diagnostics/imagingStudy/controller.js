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
		imagingStudy: function getImagingStudy(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var imagingStudyId = req.query._id;
			var accessionId = req.query.accession;
			var basedOn = req.query.basedOn;
			var seriesBodySite = req.query.bodySite;
			var context = req.query.context;
			var seriesInstanceSopClass = req.query.dicomClass;
			var endpointId = req.query.endpoint;
			var identifierId = req.query.identifier;
			var seriesModality = req.query.modality;
			var patientId = req.query.patient;
			var performerId = req.query.performer;
			var reason = req.query.reason;
			var seriesUid = req.query.series;
			var started = req.query.started;
			var uid = req.query.study;
			var seriesInstanceUid = req.query.uid;
			
			var qString = {};
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
			
			if (typeof imagingStudyId !== 'undefined') {
        if (!validator.isEmpty(imagingStudyId)) {
          qString._id = imagingStudyId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Imaging Study ID is required."
          })
        }
      }
			if (typeof accessionId !== 'undefined') {
        if (!validator.isEmpty(accessionId)) {
          qString.accession = accessionId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Accession ID is required."
          })
        }
      }
			if (typeof basedOn !== 'undefined') {
        if (!validator.isEmpty(basedOn)) {
          qString.based_on = basedOn;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "basedOn ID is required."
          })
        }
      }
			if (typeof seriesBodySite !== 'undefined') {
        if (!validator.isEmpty(seriesBodySite)) {
          qString.body_site = seriesBodySite;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Body Site is required."
          })
        }
      }
			if (typeof context !== 'undefined') {
        if (!validator.isEmpty(context)) {
          qString.context = context;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "context is required."
          })
        }
      }
			if (typeof seriesInstanceSopClass !== 'undefined') {
        if (!validator.isEmpty(seriesInstanceSopClass)) {
          qString.dicom_class = seriesInstanceSopClass;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "dicom_class is required."
          })
        }
      }
			if (typeof endpointId !== 'undefined') {
        if (!validator.isEmpty(endpointId)) {
          qString.endpoint = endpointId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "endpoint Id is required."
          })
        }
      }
			if (typeof identifierId !== 'undefined') {
        if (!validator.isEmpty(identifierId)) {
          qString.identifier = identifierId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "identifier Id is required."
          })
        }
      }
			if (typeof seriesModality !== 'undefined') {
        if (!validator.isEmpty(seriesModality)) {
          qString.modality = seriesModality;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "modality Id is required."
          })
        }
      }
			if (typeof patientId !== 'undefined') {
        if (!validator.isEmpty(patientId)) {
          qString.patient = patientId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "patient Id is required."
          })
        }
      }
			if (typeof performerId !== 'undefined') {
        if (!validator.isEmpty(performerId)) {
          qString.performer = performerId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "performer Id is required."
          })
        }
      }
			if (typeof reason !== 'undefined') {
        if (!validator.isEmpty(reason)) {
          qString.reason = reason;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "reason is required."
          })
        }
      }
			if (typeof seriesUid !== 'undefined') {
        if (!validator.isEmpty(seriesUid)) {
          qString.series = seriesUid;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "series id is required."
          })
        }
      }
			if (typeof started !== 'undefined') {
        if (!validator.isEmpty(started)) {
          if (!regex.test(started)) {
            res.json({
              "err_code": 1,
              "err_msg": "Date invalid format."
            });
          } else {
            qString.started = started;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Date is empty."
          });
        }
      }
			if (typeof uid !== 'undefined') {
        if (!validator.isEmpty(uid)) {
          qString.study = uid;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "study is required."
          })
        }
      }
			if (typeof seriesInstanceUid !== 'undefined') {
        if (!validator.isEmpty(seriesInstanceUid)) {
          qString.uid = seriesInstanceUid;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "uid is required."
          })
        }
      }
			seedPhoenixFHIR.path.GET = {
        "ImagingStudy": {
          "location": "%(apikey)s/ImagingStudy",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('ImagingStudy', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var imagingStudy = JSON.parse(body);
							if (imagingStudy.err_code == 0) {
								if (imagingStudy.data.length > 0) {
									newImagingStudy = [];
									for (i = 0; i < imagingStudy.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (imagingStudy, index, newImagingStudy, countImagingStudy) {
											qString = {};
                      qString.imaging_study_id = imagingStudy.id;
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
													var objectImagingStudy = {};
													objectImagingStudy.resourceType = imagingStudy.resourceType;
													objectImagingStudy.id = imagingStudy.id;
													objectImagingStudy.uid = imagingStudy.uid;
													objectImagingStudy.accession = imagingStudy.accession;
													objectImagingStudy.identifier = identifier.data;
													objectImagingStudy.availability = imagingStudy.availability;
													objectImagingStudy.modalityList = imagingStudy.modalityList;
													objectImagingStudy.patient = imagingStudy.patient;
													objectImagingStudy.context = imagingStudy.context;
													objectImagingStudy.started = imagingStudy.started;
													objectImagingStudy.referrer = imagingStudy.referrer;
													objectImagingStudy.numberOfSeries = imagingStudy.numberOfSeries;
													objectImagingStudy.numberOfInstances = imagingStudy.numberOfInstances;
													objectImagingStudy.procedureCode = imagingStudy.procedureCode;
													objectImagingStudy.reason = imagingStudy.reason;
													objectImagingStudy.description = imagingStudy.description;
													
													newImagingStudy[index] = objectImagingStudy;
													
													myEmitter.prependOnceListener("getImagingStudyBasedOnReferralRequest", function (imagingStudy, index, newImagingStudy, countImagingStudy) {
														qString = {};
														qString.imaging_study_id = imagingStudy.id;
														
														seedPhoenixFHIR.path.GET = {
															"ImagingStudyBasedOnReferralRequest": {
																"location": "%(apikey)s/ImagingStudyBasedOnReferralRequest",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('ImagingStudyBasedOnReferralRequest', {
															"apikey": apikey
														}, {}, function (error, response, body) {
															imagingStudyBasedOnReferralRequest = JSON.parse(body);
																														
															if (imagingStudyBasedOnReferralRequest.err_code == 0) {
																var objectImagingStudy = {};
																objectImagingStudy.resourceType = imagingStudy.resourceType;
																objectImagingStudy.id = imagingStudy.id;
																objectImagingStudy.uid = imagingStudy.uid;
																objectImagingStudy.accession = imagingStudy.accession;
																objectImagingStudy.identifier = imagingStudy.identifier;
																objectImagingStudy.availability = imagingStudy.availability;
																objectImagingStudy.modalityList = imagingStudy.modalityList;
																objectImagingStudy.patient = imagingStudy.patient;
																objectImagingStudy.context = imagingStudy.context;
																objectImagingStudy.started = imagingStudy.started;
																var BasedOn = {};
																BasedOn.referralRequest = imagingStudyBasedOnReferralRequest.data;
																objectImagingStudy.basedOn = BasedOn;
																objectImagingStudy.referrer = imagingStudy.referrer;
																objectImagingStudy.numberOfSeries = imagingStudy.numberOfSeries;
																objectImagingStudy.numberOfInstances = imagingStudy.numberOfInstances;
																objectImagingStudy.procedureCode = imagingStudy.procedureCode;
																objectImagingStudy.reason = imagingStudy.reason;
																objectImagingStudy.description = imagingStudy.description;
																
																newImagingStudy[index] = objectImagingStudy;
																
																myEmitter.prependOnceListener("getImagingStudyBasedOnCarePlan", function (imagingStudy, index, newImagingStudy, countImagingStudy) {
																	qString = {};
																	qString.imaging_study_id = imagingStudy.id;

																	seedPhoenixFHIR.path.GET = {
																		"ImagingStudyBasedOnCarePlan": {
																			"location": "%(apikey)s/ImagingStudyBasedOnCarePlan",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('ImagingStudyBasedOnCarePlan', {
																		"apikey": apikey
																	}, {}, function (error, response, body) {
																		imagingStudyBasedOnCarePlan = JSON.parse(body);

																		if (imagingStudyBasedOnCarePlan.err_code == 0) {
																			var objectImagingStudy = {};
																			objectImagingStudy.resourceType = imagingStudy.resourceType;
																			objectImagingStudy.id = imagingStudy.id;
																			objectImagingStudy.uid = imagingStudy.uid;
																			objectImagingStudy.accession = imagingStudy.accession;
																			objectImagingStudy.identifier = imagingStudy.identifier;
																			objectImagingStudy.availability = imagingStudy.availability;
																			objectImagingStudy.modalityList = imagingStudy.modalityList;
																			objectImagingStudy.patient = imagingStudy.patient;
																			objectImagingStudy.context = imagingStudy.context;
																			objectImagingStudy.started = imagingStudy.started;
																			var BasedOn = {};
																			BasedOn.referralRequest = imagingStudy.basedOn.referralRequest;
																			BasedOn.carePlan = imagingStudyBasedOnCarePlan.data;
																			objectImagingStudy.basedOn = BasedOn;
																			objectImagingStudy.referrer = imagingStudy.referrer;
																			objectImagingStudy.numberOfSeries = imagingStudy.numberOfSeries;
																			objectImagingStudy.numberOfInstances = imagingStudy.numberOfInstances;
																			objectImagingStudy.procedureCode = imagingStudy.procedureCode;
																			objectImagingStudy.reason = imagingStudy.reason;
																			objectImagingStudy.description = imagingStudy.description;

																			newImagingStudy[index] = objectImagingStudy;

																			myEmitter.prependOnceListener("getImagingStudyBasedOnProcedureRequest", function (imagingStudy, index, newImagingStudy, countImagingStudy) {
																				qString = {};
																				qString.imaging_study_id = imagingStudy.id;

																				seedPhoenixFHIR.path.GET = {
																					"ImagingStudyBasedOnProcedureRequest": {
																						"location": "%(apikey)s/ImagingStudyBasedOnProcedureRequest",
																						"query": qString
																					}
																				}
																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																				ApiFHIR.get('ImagingStudyBasedOnProcedureRequest', {
																					"apikey": apikey
																				}, {}, function (error, response, body) {
																					imagingStudyBasedOnProcedureRequest = JSON.parse(body);

																					if (imagingStudyBasedOnProcedureRequest.err_code == 0) {
																						var objectImagingStudy = {};
																						objectImagingStudy.resourceType = imagingStudy.resourceType;
																						objectImagingStudy.id = imagingStudy.id;
																						objectImagingStudy.uid = imagingStudy.uid;
																						objectImagingStudy.accession = imagingStudy.accession;
																						objectImagingStudy.identifier = imagingStudy.identifier;
																						objectImagingStudy.availability = imagingStudy.availability;
																						objectImagingStudy.modalityList = imagingStudy.modalityList;
																						objectImagingStudy.patient = imagingStudy.patient;
																						objectImagingStudy.context = imagingStudy.context;
																						objectImagingStudy.started = imagingStudy.started;
																						var BasedOn = {};
																						BasedOn.referralRequest = imagingStudy.basedOn.referralRequest;
																						BasedOn.carePlan = imagingStudy.basedOn.carePlan;
																						BasedOn.procedureRequest = imagingStudyBasedOnProcedureRequest.data;
																						objectImagingStudy.basedOn = BasedOn;
																						objectImagingStudy.referrer = imagingStudy.referrer;
																						objectImagingStudy.numberOfSeries = imagingStudy.numberOfSeries;
																						objectImagingStudy.numberOfInstances = imagingStudy.numberOfInstances;
																						objectImagingStudy.procedureCode = imagingStudy.procedureCode;
																						objectImagingStudy.reason = imagingStudy.reason;
																						objectImagingStudy.description = imagingStudy.description;

																						newImagingStudy[index] = objectImagingStudy;

																						myEmitter.prependOnceListener("getImagingStudyInterpreter", function (imagingStudy, index, newImagingStudy, countImagingStudy) {
																							qString = {};
																							qString.imaging_study_id = imagingStudy.id;

																							seedPhoenixFHIR.path.GET = {
																								"ImagingStudyInterpreter": {
																									"location": "%(apikey)s/ImagingStudyInterpreter",
																									"query": qString
																								}
																							}
																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																							ApiFHIR.get('ImagingStudyInterpreter', {
																								"apikey": apikey
																							}, {}, function (error, response, body) {
																								imagingStudyInterpreter = JSON.parse(body);

																								if (imagingStudyInterpreter.err_code == 0) {
																									var objectImagingStudy = {};
																									objectImagingStudy.resourceType = imagingStudy.resourceType;
																									objectImagingStudy.id = imagingStudy.id;
																									objectImagingStudy.uid = imagingStudy.uid;
																									objectImagingStudy.accession = imagingStudy.accession;
																									objectImagingStudy.identifier = imagingStudy.identifier;
																									objectImagingStudy.availability = imagingStudy.availability;
																									objectImagingStudy.modalityList = imagingStudy.modalityList;
																									objectImagingStudy.patient = imagingStudy.patient;
																									objectImagingStudy.context = imagingStudy.context;
																									objectImagingStudy.started = imagingStudy.started;
																									objectImagingStudy.basedOn = imagingStudy.basedOn;
																									objectImagingStudy.referrer = imagingStudy.referrer;
																									objectImagingStudy.interpreter = imagingStudyInterpreter.data;
																									objectImagingStudy.numberOfSeries = imagingStudy.numberOfSeries;
																									objectImagingStudy.numberOfInstances = imagingStudy.numberOfInstances;
																									objectImagingStudy.procedureCode = imagingStudy.procedureCode;
																									objectImagingStudy.reason = imagingStudy.reason;
																									objectImagingStudy.description = imagingStudy.description;

																									newImagingStudy[index] = objectImagingStudy;

																									myEmitter.prependOnceListener("getImagingStudyEndpoint", function (imagingStudy, index, newImagingStudy, countImagingStudy) {
																										qString = {};
																										qString.imaging_study_id = imagingStudy.id;

																										seedPhoenixFHIR.path.GET = {
																											"ImagingStudyEndpoint": {
																												"location": "%(apikey)s/ImagingStudyEndpoint",
																												"query": qString
																											}
																										}
																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																										ApiFHIR.get('ImagingStudyEndpoint', {
																											"apikey": apikey
																										}, {}, function (error, response, body) {
																											imagingStudyEndpoint = JSON.parse(body);

																											if (imagingStudyEndpoint.err_code == 0) {
																												var objectImagingStudy = {};
																												objectImagingStudy.resourceType = imagingStudy.resourceType;
																												objectImagingStudy.id = imagingStudy.id;
																												objectImagingStudy.uid = imagingStudy.uid;
																												objectImagingStudy.accession = imagingStudy.accession;
																												objectImagingStudy.identifier = imagingStudy.identifier;
																												objectImagingStudy.availability = imagingStudy.availability;
																												objectImagingStudy.modalityList = imagingStudy.modalityList;
																												objectImagingStudy.patient = imagingStudy.patient;
																												objectImagingStudy.context = imagingStudy.context;
																												objectImagingStudy.started = imagingStudy.started;
																												objectImagingStudy.basedOn = imagingStudy.basedOn;
																												objectImagingStudy.referrer = imagingStudy.referrer;
																												objectImagingStudy.interpreter = imagingStudy.interpreter;
																												objectImagingStudy.endpoint = imagingStudyEndpoint.data;
																												objectImagingStudy.numberOfSeries = imagingStudy.numberOfSeries;
																												objectImagingStudy.numberOfInstances = imagingStudy.numberOfInstances;
																												objectImagingStudy.procedureCode = imagingStudy.procedureCode;
																												objectImagingStudy.reason = imagingStudy.reason;
																												objectImagingStudy.description = imagingStudy.description;

																												newImagingStudy[index] = objectImagingStudy;

																												myEmitter.prependOnceListener("getImagingStudyProcedureReference", function (imagingStudy, index, newImagingStudy, countImagingStudy) {
																													qString = {};
																													qString.imaging_study_id = imagingStudy.id;

																													seedPhoenixFHIR.path.GET = {
																														"ImagingStudyProcedureReference": {
																															"location": "%(apikey)s/ImagingStudyProcedureReference",
																															"query": qString
																														}
																													}
																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																													ApiFHIR.get('ImagingStudyProcedureReference', {
																														"apikey": apikey
																													}, {}, function (error, response, body) {
																														imagingStudyProcedureReference = JSON.parse(body);

																														if (imagingStudyProcedureReference.err_code == 0) {
																															var objectImagingStudy = {};
																															objectImagingStudy.resourceType = imagingStudy.resourceType;
																															objectImagingStudy.id = imagingStudy.id;
																															objectImagingStudy.uid = imagingStudy.uid;
																															objectImagingStudy.accession = imagingStudy.accession;
																															objectImagingStudy.identifier = imagingStudy.identifier;
																															objectImagingStudy.availability = imagingStudy.availability;
																															objectImagingStudy.modalityList = imagingStudy.modalityList;
																															objectImagingStudy.patient = imagingStudy.patient;
																															objectImagingStudy.context = imagingStudy.context;
																															objectImagingStudy.started = imagingStudy.started;
																															objectImagingStudy.basedOn = imagingStudy.basedOn;
																															objectImagingStudy.referrer = imagingStudy.referrer;
																															objectImagingStudy.interpreter = imagingStudy.interpreter;
																															objectImagingStudy.endpoint = imagingStudy.endpoint;
																															objectImagingStudy.numberOfSeries = imagingStudy.numberOfSeries;
																															objectImagingStudy.numberOfInstances = imagingStudy.numberOfInstances;
																															objectImagingStudy.procedureReference = imagingStudyProcedureReference.data;
																															objectImagingStudy.procedureCode = imagingStudy.procedureCode;
																															objectImagingStudy.reason = imagingStudy.reason;
																															objectImagingStudy.description = imagingStudy.description;
																															objectImagingStudy.series = host + ':' + port + '/' + apikey + '/ImagingStudy/' +  imagingStudy.id + '/ImagingStudySeries';

																															newImagingStudy[index] = objectImagingStudy;

																															if (index == countImagingStudy - 1) {
																																res.json({
																																	"err_code": 0,
																																	"data": newImagingStudy
																																});
																															}
																														} else {
																															res.json(imagingStudyProcedureReference);
																														}
																													})
																												})
																												myEmitter.emit('getImagingStudyProcedureReference', objectImagingStudy, index, newImagingStudy, countImagingStudy);
																											} else {
																												res.json(imagingStudyEndpoint);
																											}
																										})
																									})
																									myEmitter.emit('getImagingStudyEndpoint', objectImagingStudy, index, newImagingStudy, countImagingStudy);
																								} else {
																									res.json(imagingStudyInterpreter);
																								}
																							})
																						})
																						myEmitter.emit('getImagingStudyInterpreter', objectImagingStudy, index, newImagingStudy, countImagingStudy);
																					} else {
																						res.json(imagingStudyBasedOnProcedureRequest);
																					}
																				})
																			})
																			myEmitter.emit('getImagingStudyBasedOnProcedureRequest', objectImagingStudy, index, newImagingStudy, countImagingStudy);
																		} else {
																			res.json(imagingStudyBasedOnCarePlan);
																		}
																	})
																})
																myEmitter.emit('getImagingStudyBasedOnCarePlan', objectImagingStudy, index, newImagingStudy, countImagingStudy);
															} else {
																res.json(imagingStudyBasedOnReferralRequest);
															}
														})
													})
													myEmitter.emit('getImagingStudyBasedOnReferralRequest', objectImagingStudy, index, newImagingStudy, countImagingStudy);
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", imagingStudy.data[i], i, newImagingStudy, imagingStudy.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Imaging Study is empty."
                  });
                }
							} else {
                res.json(imagingStudy);
              }
						}
					});
				} else {
          result.err_code = 500;
          res.json(result);
        }
			});
		},
		imagingStudySeries: function getImagingStudySeries(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingStudyId = req.params.imaging_study_id;
			var imagingStudySeriesId = req.params.series_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + imagingStudyId, 'IMAGING_STUDY', function(resImagingStudy){
						if(resImagingStudy.err_code > 0){
							if(typeof imagingStudySeriesId !== 'undefined' && !validator.isEmpty(imagingStudySeriesId)){
								checkUniqeValue(apikey, "SERIES_ID|" + imagingStudySeriesId, 'IMAGING_STUDY_SERIES', function(resImagingStudySeriesID){
									if(resImagingStudySeriesID.err_code > 0){
										//get imagingStudySeries
										qString = {};
										qString.imaging_study_id = imagingStudyId;
										qString._id = imagingStudySeriesId;
										seedPhoenixFHIR.path.GET = {
											"ImagingStudySeries" : {
												"location": "%(apikey)s/ImagingStudySeries",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImagingStudySeries', {"apikey": apikey}, {}, function(error, response, body){
											imagingStudySeries = JSON.parse(body);
											if(imagingStudySeries.err_code == 0){
												//res.json({"err_code": 0, "data":imagingStudySeries.data});	
												if(imagingStudySeries.data.length > 0){
													newImagingStudySeries = [];
													for(i=0; i < imagingStudySeries.data.length; i++){
														myEmitter.once('getImagingStudySeriesEndpoint', function(imagingStudySeries, index, newImagingStudySeries, countImagingStudySeries){
															qString = {};
															qString.imaging_study_series_id = imagingStudySeries.id;
															seedPhoenixFHIR.path.GET = {
																"ImagingStudySeriesEndpoint" : {
																	"location": "%(apikey)s/ImagingStudySeriesEndpoint",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('ImagingStudySeriesEndpoint', {"apikey": apikey}, {}, function(error, response, body){
																imagingStudySeriesEndpoint = JSON.parse(body);
																if(imagingStudySeriesEndpoint.err_code == 0){
																	var objectImagingStudySeries = {};
																	objectImagingStudySeries.id = imagingStudySeries.id;
																	objectImagingStudySeries.uid = imagingStudySeries.uid;
																	objectImagingStudySeries.number = imagingStudySeries.number;
																	objectImagingStudySeries.modality = imagingStudySeries.modality;
																	objectImagingStudySeries.description = imagingStudySeries.description;
																	objectImagingStudySeries.numberOfInstances = imagingStudySeries.numberOfInstances;
																	objectImagingStudySeries.availability = imagingStudySeries.availability;
																	objectImagingStudySeries.endpoint = imagingStudySeriesEndpoint.data;
																	objectImagingStudySeries.bodySite = imagingStudySeries.bodySite;
																	objectImagingStudySeries.laterality = imagingStudySeries.laterality;
																	objectImagingStudySeries.started = imagingStudySeries.started;															
																	newImagingStudySeries[index] = objectImagingStudySeries;

																	myEmitter.once('getImagingStudySeriesPerformer', function(imagingStudySeries, index, newImagingStudySeries, countImagingStudySeries){
																		qString = {};
																		qString.imaging_study_series_id = imagingStudySeries.id;
																		seedPhoenixFHIR.path.GET = {
																			"ImagingStudySeriesPerformer" : {
																				"location": "%(apikey)s/ImagingStudySeriesPerformer",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																		ApiFHIR.get('ImagingStudySeriesPerformer', {"apikey": apikey}, {}, function(error, response, body){
																			imagingStudySeriesPerformer = JSON.parse(body);
																			if(imagingStudySeriesPerformer.err_code == 0){
																				var objectImagingStudySeries = {};
																				objectImagingStudySeries.id = imagingStudySeries.id;
																				objectImagingStudySeries.uid = imagingStudySeries.uid;
																				objectImagingStudySeries.number = imagingStudySeries.number;
																				objectImagingStudySeries.modality = imagingStudySeries.modality;
																				objectImagingStudySeries.description = imagingStudySeries.description;
																				objectImagingStudySeries.numberOfInstances = imagingStudySeries.numberOfInstances;
																				objectImagingStudySeries.availability = imagingStudySeries.availability;
																				objectImagingStudySeries.endpoint = imagingStudySeries.endpoint;
																				objectImagingStudySeries.bodySite = imagingStudySeries.bodySite;
																				objectImagingStudySeries.laterality = imagingStudySeries.laterality;
																				objectImagingStudySeries.started = imagingStudySeries.started;
																				objectImagingStudySeries.performer = imagingStudySeriesPerformer.data;
																				newImagingStudySeries[index] = objectImagingStudySeries;

																				myEmitter.once('getImagingStudySeriesInstance', function(imagingStudySeries, index, newImagingStudySeries, countImagingStudySeries){
																					qString = {};
																					qString.imaging_study_series_id = imagingStudySeries.id;
																					seedPhoenixFHIR.path.GET = {
																						"ImagingStudySeriesInstance" : {
																							"location": "%(apikey)s/ImagingStudySeriesInstance",
																							"query": qString
																						}
																					}

																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																					ApiFHIR.get('ImagingStudySeriesInstance', {"apikey": apikey}, {}, function(error, response, body){
																						imagingStudySeriesInstance = JSON.parse(body);
																						if(imagingStudySeriesInstance.err_code == 0){
																							var objectImagingStudySeries = {};
																							objectImagingStudySeries.id = imagingStudySeries.id;
																							objectImagingStudySeries.uid = imagingStudySeries.uid;
																							objectImagingStudySeries.number = imagingStudySeries.number;
																							objectImagingStudySeries.modality = imagingStudySeries.modality;
																							objectImagingStudySeries.description = imagingStudySeries.description;
																							objectImagingStudySeries.numberOfInstances = imagingStudySeries.numberOfInstances;
																							objectImagingStudySeries.availability = imagingStudySeries.availability;
																							objectImagingStudySeries.endpoint = imagingStudySeries.endpoint;
																							objectImagingStudySeries.bodySite = imagingStudySeries.bodySite;
																							objectImagingStudySeries.laterality = imagingStudySeries.laterality;
																							objectImagingStudySeries.started = imagingStudySeries.started;
																							objectImagingStudySeries.performer = imagingStudySeries.performer;
																							objectImagingStudySeries.instance = imagingStudySeriesInstance.data;
																							newImagingStudySeries[index] = objectImagingStudySeries;

																							if(index == countImagingStudySeries -1 ){
																								res.json({"err_code": 0, "data":newImagingStudySeries});	
																							}
																						}else{
																							res.json(imagingStudySeriesInstance);			
																						}
																					})
																				})
																				myEmitter.emit('getImagingStudySeriesInstance', objectImagingStudySeries, index, newImagingStudySeries, countImagingStudySeries);
																			}else{
																				res.json(imagingStudySeriesPerformer);			
																			}
																		})
																	})
																	myEmitter.emit('getImagingStudySeriesPerformer', objectImagingStudySeries, index, newImagingStudySeries, countImagingStudySeries);
																}else{
																	res.json(imagingStudySeriesEndpoint);			
																}
															})
														})
														myEmitter.emit('getImagingStudySeriesEndpoint', imagingStudySeries.data[i], i, newImagingStudySeries, imagingStudySeries.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "imaging Study Series is empty."});	
												}
											}else{
												res.json(imagingStudySeries);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Imaging Study Series Id not found"});		
									}
								})
							}else{
								//get imagingStudySeries
								qString = {};
								qString.imaging_study_id = imagingStudyId;
								seedPhoenixFHIR.path.GET = {
									"ImagingStudySeries" : {
										"location": "%(apikey)s/ImagingStudySeries",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ImagingStudySeries', {"apikey": apikey}, {}, function(error, response, body){
									imagingStudySeries = JSON.parse(body);
									if(imagingStudySeries.err_code == 0){
										//res.json({"err_code": 0, "data":imagingStudySeries.data});	
										if(imagingStudySeries.data.length > 0){
													newImagingStudySeries = [];
													for(i=0; i < imagingStudySeries.data.length; i++){
														myEmitter.once('getImagingStudySeriesEndpoint', function(imagingStudySeries, index, newImagingStudySeries, countImagingStudySeries){
															qString = {};
															qString.imaging_study_series_id = imagingStudySeries.id;
															seedPhoenixFHIR.path.GET = {
																"ImagingStudySeriesEndpoint" : {
																	"location": "%(apikey)s/ImagingStudySeriesEndpoint",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('ImagingStudySeriesEndpoint', {"apikey": apikey}, {}, function(error, response, body){
																imagingStudySeriesEndpoint = JSON.parse(body);
																if(imagingStudySeriesEndpoint.err_code == 0){
																	var objectImagingStudySeries = {};
																	objectImagingStudySeries.id = imagingStudySeries.id;
																	objectImagingStudySeries.uid = imagingStudySeries.uid;
																	objectImagingStudySeries.number = imagingStudySeries.number;
																	objectImagingStudySeries.modality = imagingStudySeries.modality;
																	objectImagingStudySeries.description = imagingStudySeries.description;
																	objectImagingStudySeries.numberOfInstances = imagingStudySeries.numberOfInstances;
																	objectImagingStudySeries.availability = imagingStudySeries.availability;
																	objectImagingStudySeries.endpoint = imagingStudySeriesEndpoint.data;
																	objectImagingStudySeries.bodySite = imagingStudySeries.bodySite;
																	objectImagingStudySeries.laterality = imagingStudySeries.laterality;
																	objectImagingStudySeries.started = imagingStudySeries.started;															
																	newImagingStudySeries[index] = objectImagingStudySeries;

																	myEmitter.once('getImagingStudySeriesPerformer', function(imagingStudySeries, index, newImagingStudySeries, countImagingStudySeries){
																		qString = {};
																		qString.imaging_study_series_id = imagingStudySeries.id;
																		seedPhoenixFHIR.path.GET = {
																			"ImagingStudySeriesPerformer" : {
																				"location": "%(apikey)s/ImagingStudySeriesPerformer",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																		ApiFHIR.get('ImagingStudySeriesPerformer', {"apikey": apikey}, {}, function(error, response, body){
																			imagingStudySeriesPerformer = JSON.parse(body);
																			if(imagingStudySeriesPerformer.err_code == 0){
																				var objectImagingStudySeries = {};
																				objectImagingStudySeries.id = imagingStudySeries.id;
																				objectImagingStudySeries.uid = imagingStudySeries.uid;
																				objectImagingStudySeries.number = imagingStudySeries.number;
																				objectImagingStudySeries.modality = imagingStudySeries.modality;
																				objectImagingStudySeries.description = imagingStudySeries.description;
																				objectImagingStudySeries.numberOfInstances = imagingStudySeries.numberOfInstances;
																				objectImagingStudySeries.availability = imagingStudySeries.availability;
																				objectImagingStudySeries.endpoint = imagingStudySeries.endpoint;
																				objectImagingStudySeries.bodySite = imagingStudySeries.bodySite;
																				objectImagingStudySeries.laterality = imagingStudySeries.laterality;
																				objectImagingStudySeries.started = imagingStudySeries.started;
																				objectImagingStudySeries.performer = imagingStudySeriesPerformer.data;
																				newImagingStudySeries[index] = objectImagingStudySeries;

																				myEmitter.once('getImagingStudySeriesInstance', function(imagingStudySeries, index, newImagingStudySeries, countImagingStudySeries){
																					qString = {};
																					qString.imaging_study_series_id = imagingStudySeries.id;
																					seedPhoenixFHIR.path.GET = {
																						"ImagingStudySeriesInstance" : {
																							"location": "%(apikey)s/ImagingStudySeriesInstance",
																							"query": qString
																						}
																					}

																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																					ApiFHIR.get('ImagingStudySeriesInstance', {"apikey": apikey}, {}, function(error, response, body){
																						imagingStudySeriesInstance = JSON.parse(body);
																						if(imagingStudySeriesInstance.err_code == 0){
																							var objectImagingStudySeries = {};
																							objectImagingStudySeries.id = imagingStudySeries.id;
																							objectImagingStudySeries.uid = imagingStudySeries.uid;
																							objectImagingStudySeries.number = imagingStudySeries.number;
																							objectImagingStudySeries.modality = imagingStudySeries.modality;
																							objectImagingStudySeries.description = imagingStudySeries.description;
																							objectImagingStudySeries.numberOfInstances = imagingStudySeries.numberOfInstances;
																							objectImagingStudySeries.availability = imagingStudySeries.availability;
																							objectImagingStudySeries.endpoint = imagingStudySeries.endpoint;
																							objectImagingStudySeries.bodySite = imagingStudySeries.bodySite;
																							objectImagingStudySeries.laterality = imagingStudySeries.laterality;
																							objectImagingStudySeries.started = imagingStudySeries.started;
																							objectImagingStudySeries.performer = imagingStudySeries.performer;
																							objectImagingStudySeries.instance = imagingStudySeriesInstance.data;
																							newImagingStudySeries[index] = objectImagingStudySeries;

																							if(index == countImagingStudySeries -1 ){
																								res.json({"err_code": 0, "data":newImagingStudySeries});	
																							}
																						}else{
																							res.json(imagingStudySeriesInstance);			
																						}
																					})
																				})
																				myEmitter.emit('getImagingStudySeriesInstance', objectImagingStudySeries, index, newImagingStudySeries, countImagingStudySeries);
																			}else{
																				res.json(imagingStudySeriesPerformer);			
																			}
																		})
																	})
																	myEmitter.emit('getImagingStudySeriesPerformer', objectImagingStudySeries, index, newImagingStudySeries, countImagingStudySeries);
																}else{
																	res.json(imagingStudySeriesEndpoint);			
																}
															})
														})
														myEmitter.emit('getImagingStudySeriesEndpoint', imagingStudySeries.data[i], i, newImagingStudySeries, imagingStudySeries.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "imaging Study Series is empty."});	
												}
									}else{
										res.json(imagingStudySeries);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Imaging Study Id not found"});		
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
		imagingStudy: function addImagingStudy(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var err_code = 0;
      var err_msg = "";
			
			//input check
      if (typeof req.body.accession.use !== 'undefined') {
        var accessionUseCode = req.body.accession.use.trim().toLowerCase();
        if (validator.isEmpty(accessionUseCode)) {
          err_code = 2;
          err_msg = "Accession Use is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'use' in json accession request.";
      }
      if (typeof req.body.accession.type !== 'undefined') {
        var accessionTypeCode = req.body.accession.type.trim().toUpperCase();
        if (validator.isEmpty(accessionTypeCode)) {
          err_code = 2;
          err_msg = "Accession Type is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'type' in json accession request.";
      }
      if (typeof req.body.accession.value !== 'undefined') {
        var accessionValue = req.body.accession.value.trim().toLowerCase();
        if (validator.isEmpty(accessionValue)) {
          err_code = 2;
          err_msg = "Accession Value is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'value' in json accession request.";
      }
      if (typeof req.body.accession.period !== 'undefined') {
        var accessionPeriod = req.body.accession.period;
        if (accessionPeriod.indexOf("to") > 0) {
          arrAccessionPeriod = accessionPeriod.split("to");
          accessionPeriodStart = arrAccessionPeriod[0];
          accessionPeriodEnd = arrAccessionPeriod[1];
          if (!regex.test(accessionPeriodStart) && !regex.test(accessionPeriodEnd)) {
            err_code = 2;
            err_msg = "Accession Period invalid date format.";
          }
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'accessionPeriod' in json accession request.";
      }
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
			/*
uid|uid|string|nn|
availability|availabilityCode|string||u
modalityList|modalityListCode|string||u
patient|patientId|string||
context.encounter|contextEncounterId|string||
context.episodeOfCare|contextEpisodeOfCareId|string||
started|started|date||
basedOn.referralRequest|basedOnReferralRequest|string||
basedOn.carePlan|basedOnCarePlan|string||
basedOn.procedureRequest|basedOnProcedureRequest|string||
referrer|referrerId|string||
interpreter|interpreter|string||
endpoint|endpoint|string||
numberOfSeries|numberOfSeries|integer||
numberOfInstances|numberOfInstances|integer||
procedureReference|procedureReference|string||
procedureCode|procedureCodeCode|
reason|reasonCode|string||
description|description|string||
series.uid|seriesUid|string||
series.number|seriesNumber|integer||
series.modality|seriesModalityCode|string|nn|u
series.description|seriesDescription|string||
series.numberOfInstances|seriesNumberOfInstances|integer||
series.availability|seriesAvailabilityCode|string||u
series.endpoint|seriesEndpoint|string||
series.bodySite|seriesBodySiteCode|string||
series.laterality|seriesLateralityCode|string||
series.started|seriesStarted|date||
series.performer|seriesPerformer|string||
series.instance.uid|seriesInstanceUid|string||
series.instance.number|seriesInstanceNumber|integer||
series.instance.sopClass|seriesInstanceSopClass|string||
series.instance.title|seriesInstanceTitle|string||
*/
			if(typeof req.body.uid !== 'undefined'){
				var uid =  req.body.uid.trim().toLowerCase();
				if(validator.isEmpty(uid)){
					err_code = 2;
					err_msg = "imaging Study uid is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'uid' in json imaging Study request.";
			}

			if(typeof req.body.availability !== 'undefined'){
				var availabilityCode =  req.body.availability.trim().toUpperCase();
				if(validator.isEmpty(availabilityCode)){
					availabilityCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'availability' in json imaging Study request.";
			}

			if(typeof req.body.modalityList !== 'undefined'){
				var modalityListCode =  req.body.modalityList.trim().toUpperCase();
				if(validator.isEmpty(modalityListCode)){
					modalityListCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'modality list' in json imaging Study request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patientId =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patientId)){
					patientId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json imaging Study request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounterId =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounterId)){
					contextEncounterId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json imaging Study request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCareId =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCareId)){
					contextEpisodeOfCareId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json imaging Study request.";
			}

			if(typeof req.body.started !== 'undefined'){
				var started =  req.body.started;
				if(validator.isEmpty(started)){
					started = "";
				}else{
					if(!regex.test(started)){
						err_code = 2;
						err_msg = "imaging Study started invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'started' in json imaging Study request.";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined'){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					basedOnReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on referral request' in json imaging Study request.";
			}

			if(typeof req.body.basedOn.carePlan !== 'undefined'){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					basedOnCarePlan = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on care plan' in json imaging Study request.";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined'){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					basedOnProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on procedure request' in json imaging Study request.";
			}

			if(typeof req.body.referrer !== 'undefined'){
				var referrerId =  req.body.referrer.trim().toLowerCase();
				if(validator.isEmpty(referrerId)){
					referrerId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'referrer' in json imaging Study request.";
			}

			if(typeof req.body.interpreter !== 'undefined'){
				var interpreter =  req.body.interpreter.trim().toLowerCase();
				if(validator.isEmpty(interpreter)){
					interpreter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'interpreter' in json imaging Study request.";
			}

			if(typeof req.body.endpoint !== 'undefined'){
				var endpoint =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpoint)){
					endpoint = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'endpoint' in json imaging Study request.";
			}

			if(typeof req.body.numberOfSeries !== 'undefined'){
				var numberOfSeries =  req.body.numberOfSeries.trim();
				if(validator.isEmpty(numberOfSeries)){
					numberOfSeries = "";
				}else{
					if(!validator.isInt(numberOfSeries)){
						err_code = 2;
						err_msg = "imaging Study number of series is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'number of series' in json imaging Study request.";
			}

			if(typeof req.body.numberOfInstances !== 'undefined'){
				var numberOfInstances =  req.body.numberOfInstances.trim();
				if(validator.isEmpty(numberOfInstances)){
					numberOfInstances = "";
				}else{
					if(!validator.isInt(numberOfInstances)){
						err_code = 2;
						err_msg = "imaging Study number of instances is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'number of instances' in json imaging Study request.";
			}

			if(typeof req.body.procedureReference !== 'undefined'){
				var procedureReference =  req.body.procedureReference.trim().toLowerCase();
				if(validator.isEmpty(procedureReference)){
					procedureReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure reference' in json imaging Study request.";
			}

			if(typeof req.body.procedureCode !== 'undefined'){
				var procedureCodeCode =  req.body.procedureCode.trim().toLowerCase();
				if(validator.isEmpty(procedureCodeCode)){
					procedureCodeCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure code' in json imaging Study request.";
			}

			if(typeof req.body.reason !== 'undefined'){
				var reasonCode =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					reasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason' in json imaging Study request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					description = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json imaging Study request.";
			}

			if(typeof req.body.series.uid !== 'undefined'){
				var seriesUid =  req.body.series.uid.trim().toLowerCase();
				if(validator.isEmpty(seriesUid)){
					seriesUid = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series uid' in json imaging Study request.";
			}

			if(typeof req.body.series.number !== 'undefined'){
				var seriesNumber =  req.body.series.number.trim();
				if(validator.isEmpty(seriesNumber)){
					seriesNumber = "";
				}else{
					if(!validator.isInt(seriesNumber)){
						err_code = 2;
						err_msg = "imaging Study series number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series number' in json imaging Study request.";
			}

			if(typeof req.body.series.modality !== 'undefined'){
				var seriesModalityCode =  req.body.series.modality.trim().toUpperCase();
				if(validator.isEmpty(seriesModalityCode)){
					err_code = 2;
					err_msg = "imaging Study series modality is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series modality' in json imaging Study request.";
			}

			if(typeof req.body.series.description !== 'undefined'){
				var seriesDescription =  req.body.series.description.trim().toLowerCase();
				if(validator.isEmpty(seriesDescription)){
					seriesDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series description' in json imaging Study request.";
			}

			if(typeof req.body.series.numberOfInstances !== 'undefined'){
				var seriesNumberOfInstances =  req.body.series.numberOfInstances.trim();
				if(validator.isEmpty(seriesNumberOfInstances)){
					seriesNumberOfInstances = "";
				}else{
					if(!validator.isInt(seriesNumberOfInstances)){
						err_code = 2;
						err_msg = "imaging Study series number of instances is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series number of instances' in json imaging Study request.";
			}

			if(typeof req.body.series.availability !== 'undefined'){
				var seriesAvailabilityCode =  req.body.series.availability.trim().toUpperCase();
				if(validator.isEmpty(seriesAvailabilityCode)){
					seriesAvailabilityCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series availability' in json imaging Study request.";
			}

			if(typeof req.body.series.endpoint !== 'undefined'){
				var seriesEndpoint =  req.body.series.endpoint.trim().toLowerCase();
				if(validator.isEmpty(seriesEndpoint)){
					seriesEndpoint = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series endpoint' in json imaging Study request.";
			}

			if(typeof req.body.series.bodySite !== 'undefined'){
				var seriesBodySiteCode =  req.body.series.bodySite.trim().toLowerCase();
				if(validator.isEmpty(seriesBodySiteCode)){
					seriesBodySiteCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series body site' in json imaging Study request.";
			}

			if(typeof req.body.series.laterality !== 'undefined'){
				var seriesLateralityCode =  req.body.series.laterality.trim().toLowerCase();
				if(validator.isEmpty(seriesLateralityCode)){
					seriesLateralityCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series laterality' in json imaging Study request.";
			}

			if(typeof req.body.series.started !== 'undefined'){
				var seriesStarted =  req.body.series.started;
				if(validator.isEmpty(seriesStarted)){
					seriesStarted = "";
				}else{
					if(!regex.test(seriesStarted)){
						err_code = 2;
						err_msg = "imaging Study series started invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series started' in json imaging Study request.";
			}

			if(typeof req.body.series.performer !== 'undefined'){
				var seriesPerformer =  req.body.series.performer.trim().toLowerCase();
				if(validator.isEmpty(seriesPerformer)){
					seriesPerformer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series performer' in json imaging Study request.";
			}

			if(typeof req.body.series.instance.uid !== 'undefined'){
				var seriesInstanceUid =  req.body.series.instance.uid.trim().toLowerCase();
				if(validator.isEmpty(seriesInstanceUid)){
					seriesInstanceUid = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series instance uid' in json imaging Study request.";
			}

			if(typeof req.body.series.instance.number !== 'undefined'){
				var seriesInstanceNumber =  req.body.series.instance.number.trim();
				if(validator.isEmpty(seriesInstanceNumber)){
					seriesInstanceNumber = "";
				}else{
					if(!validator.isInt(seriesInstanceNumber)){
						err_code = 2;
						err_msg = "imaging Study series instance number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series instance number' in json imaging Study request.";
			}

			if(typeof req.body.series.instance.sopClass !== 'undefined'){
				var seriesInstanceSopClass =  req.body.series.instance.sopClass.trim().toLowerCase();
				if(validator.isEmpty(seriesInstanceSopClass)){
					seriesInstanceSopClass = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series instance sop class' in json imaging Study request.";
			}

			if(typeof req.body.series.instance.title !== 'undefined'){
				var seriesInstanceTitle =  req.body.series.instance.title.trim().toLowerCase();
				if(validator.isEmpty(seriesInstanceTitle)){
					seriesInstanceTitle = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series instance title' in json imaging Study request.";
			}
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function (resIdentifierUseCode) {
							if (resIdentifierUseCode.err_code > 0) {
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function (resIdentifierTypeCode) {
									if (resIdentifierTypeCode.err_code > 0) {
										myEmitter.once('checkIdentifierValue', function () {
											checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resUniqeValue) {
												if (resUniqeValue.err_code == 0) {
													//set uniqe id
													var accessionId = 'acs' + uniqid.time();
													var identifierId = 'ide' + uniqid.time();
													var imagingStudyId = 'ims' + uniqid.time();
													var seriesId = 'ser' + uniqid.time();
													var instanceId = 'ins' + uniqid.time();

													//identifier
													dataIdentifier = {
														"id": identifierId,
														"use": identifierUseCode,
														"type": identifierTypeCode,
														"system": identifierId,
														"value": identifierValue,
														"period_start": identifierPeriodStart,
														"period_end": identifierPeriodEnd,
														"imaging_study_id": imagingStudyId
													}
													console.log(dataIdentifier)
													ApiFHIR.post('identifier', {
														"apikey": apikey
													}, {
														body: dataIdentifier,
														json: true
													}, function (error, response, body) {
														identifier = body;
														if (identifier.err_code > 0) {
															res.json(identifier);
														}
													})

													//accession
													dataAccession = {
														"id": accessionId,
														"use": accessionUseCode,
														"type": accessionTypeCode,
														"system": accessionId,
														"value": accessionValue,
														"period_start": accessionPeriodStart,
														"period_end": accessionPeriodEnd
													}
													ApiFHIR.post('identifier', {
														"apikey": apikey
													}, {
														body: dataAccession,
														json: true
													}, function (error, response, body) {
														accession = body;
														if (accession.err_code > 0) {
															res.json(accession);
														}
													})

													//imaging study
													/*dataImagingStudy = {
														"imaging_study_id": imagingStudyId,
														"uid": uid,
														"accession": accessionId,
														"availability": availabilityCode,
														"modality_list": modalityListCode,
														"patient": patientId,
														"context_encounter": contextEncounterId,
														"context_episode_of_care": contextEpisodeOfCareId,
														"started": started,
														"referrer": referrerId,
														"number_of_series": numberOfSeries,
														"number_of_instances": numberOfInstances,
														"procedure_code": procedureCodeCode,
														"reason": reasonCode,
														"description": description,
														"charge_item_id": chargeItemId,
														"clinical_impression_investigation_id": clinicalImpressionInvestigationId,
														"diagnostic_report_id": diagnosticReportId,
														"imaging_manifest_study_id": imagingManifestStudyId
													}*/
													dataImagingStudy = {
														"imaging_study_id": imagingStudyId,
														"uid": uid,
														"accession": accessionId,
														"availability": availabilityCode,
														"modality_list": modalityListCode,
														"patient": patientId,
														"context_encounter": contextEncounterId,
														"context_episode_of_care": contextEpisodeOfCareId,
														"started": started,
														"referrer": referrerId,
														"number_of_series": numberOfSeries,
														"number_of_instances": numberOfInstances,
														"procedure_code": procedureCodeCode,
														"reason": reasonCode,
														"description": description
													}
													ApiFHIR.post('imagingStudy', {
														"apikey": apikey
													}, {
														body: dataImagingStudy,
														json: true
													}, function (error, response, body) {
														imagingStudy = body;
														if (imagingStudy.err_code > 0) {
															res.json(imagingStudy);
														}
													})

													//data series
													dataSeries = {
														"series_id": seriesId,
														"uid": seriesUid,
														"number": seriesNumber,
														"modality": seriesModalityCode,
														"description": seriesDescription,
														"number_of_instances": seriesNumberOfInstances,
														"availability": seriesAvailabilityCode,
														"body_site": seriesBodySiteCode,
														"laterality": seriesLateralityCode,
														"started": seriesStarted,
														"imaging_study_id": imagingStudyId
													}
													ApiFHIR.post('imagingStudySeries', {
														"apikey": apikey
													}, {
														body: dataSeries,
														json: true
													}, function (error, response, body) {
														imagingStudySeries = body;
														if (imagingStudySeries.err_code > 0) {
															res.json(imagingStudySeries);
														}
													})

													// data instance
													dataInstance = {
														"instance_id": instanceId,
														"uid": seriesInstanceUid,
														"number": seriesInstanceNumber,
														"sop_class": seriesInstanceSopClass,
														"title": seriesInstanceTitle,
														"series_id": seriesId
													}
													ApiFHIR.post('imagingStudySeriesInstance', {
														"apikey": apikey
													}, {
														body: dataInstance,
														json: true
													}, function (error, response, body) {
														imagingStudySeriesInstance = body;
														if (imagingStudySeriesInstance.err_code > 0) {
															res.json(imagingStudySeriesInstance);
														}
													})
													
													
													/*
													post reference
													*/
													
													if(basedOnReferralRequest !== ""){
														dataBasedOnReferralRequest = {
															"_id" : basedOnReferralRequest,
															"imaging_study_id" : imagingStudyId
														}
														ApiFHIR.put('referralRequest', {"apikey": apikey, "_id": basedOnReferralRequest}, {body: dataBasedOnReferralRequest, json: true}, function(error, response, body){
															returnBasedOnReferralRequest = body;
															if(returnBasedOnReferralRequest.err_code > 0){
																res.json(returnBasedOnReferralRequest);	
																console.log("add reference Based on referral request : " + basedOnReferralRequest);
															}
														});
													}

													if(basedOnCarePlan !== ""){
														dataBasedOnCarePlan = {
															"_id" : basedOnCarePlan,
															"imaging_study_id" : imagingStudyId
														}
														ApiFHIR.put('careplan', {"apikey": apikey, "_id": basedOnCarePlan}, {body: dataBasedOnCarePlan, json: true}, function(error, response, body){
															returnBasedOnCarePlan = body;
															if(returnBasedOnCarePlan.err_code > 0){
																res.json(returnBasedOnCarePlan);	
																console.log("add reference Based on care plan : " + basedOnCarePlan);
															}
														});
													}

													if(basedOnProcedureRequest !== ""){
														dataBasedOnProcedureRequest = {
															"_id" : basedOnProcedureRequest,
															"imaging_study_id" : imagingStudyId
														}
														ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": basedOnProcedureRequest}, {body: dataBasedOnProcedureRequest, json: true}, function(error, response, body){
															returnBasedOnProcedureRequest = body;
															if(returnBasedOnProcedureRequest.err_code > 0){
																res.json(returnBasedOnProcedureRequest);	
																console.log("add reference Based on procedure request : " + basedOnProcedureRequest);
															}
														});
													}

													if(interpreter !== ""){
														dataInterpreter = {
															"_id" : interpreter,
															"imaging_study_id" : imagingStudyId
														}
														ApiFHIR.put('practitioner', {"apikey": apikey, "_id": interpreter}, {body: dataInterpreter, json: true}, function(error, response, body){
															returnInterpreter = body;
															if(returnInterpreter.err_code > 0){
																res.json(returnInterpreter);	
																console.log("add reference Interpreter : " + interpreter);
															}
														});
													}

													if(endpoint !== ""){
														dataEndpoint = {
															"_id" : endpoint,
															"imaging_study_id" : imagingStudyId
														}
														ApiFHIR.put('endpoint', {"apikey": apikey, "_id": endpoint}, {body: dataEndpoint, json: true}, function(error, response, body){
															returnEndpoint = body;
															if(returnEndpoint.err_code > 0){
																res.json(returnEndpoint);	
																console.log("add reference Endpoint : " + endpoint);
															}
														});
													}

													if(procedureReference !== ""){
														dataProcedureReference = {
															"_id" : procedureReference,
															"imaging_study_procedure_reference_id" : imagingStudyId
														}
														ApiFHIR.put('procedure', {"apikey": apikey, "_id": procedureReference}, {body: dataProcedureReference, json: true}, function(error, response, body){
															returnProcedureReference = body;
															if(returnProcedureReference.err_code > 0){
																res.json(returnProcedureReference);	
																console.log("add reference Procedure reference : " + procedureReference);
															}
														});
													}

													if(seriesEndpoint !== ""){
														dataSeriesEndpoint = {
															"_id" : seriesEndpoint,
															"imaging_study_series_id" : imagingStudyId
														}
														ApiFHIR.put('endpoint', {"apikey": apikey, "_id": seriesEndpoint}, {body: dataSeriesEndpoint, json: true}, function(error, response, body){
															returnSeriesEndpoint = body;
															if(returnSeriesEndpoint.err_code > 0){
																res.json(returnSeriesEndpoint);	
																console.log("add reference Series endpoint : " + seriesEndpoint);
															}
														});
													}

													if(seriesPerformer !== ""){
														dataSeriesPerformer = {
															"_id" : seriesPerformer,
															"imaging_study_series_id" : imagingStudyId
														}
														ApiFHIR.put('practitioner', {"apikey": apikey, "_id": seriesPerformer}, {body: dataSeriesPerformer, json: true}, function(error, response, body){
															returnSeriesPerformer = body;
															if(returnSeriesPerformer.err_code > 0){
																res.json(returnSeriesPerformer);	
																console.log("add reference Series performer : " + seriesPerformer);
															}
														});
													}					
													
													res.json({
														"err_code": 0,
														"err_msg": "Imaging Study has been add.",
														"data": [{
																"id": imagingStudyId
															}
														]
													})
												} else {
													res.json({
														"err_code": "404",
														"err_msg": "Identifier value has been used"
													});
												}
											})
										})
										
										/* //check code
													
accessionUse|identifier-use
accessionType|identifier-type											
availabilityCode|instance-availability
modalityListCode|dicom-cid29
procedureCodeCode|procedure-code
reasonCode|procedure-reason
seriesModalityCode|dicom-cid29
seriesAvailabilityCode|instance-availability
seriesBodySiteCode|body-site
seriesLateralityCode|bodysite-laterality
													*/
										myEmitter.prependOnceListener('checkAccessionUse', function () {
											if (!validator.isEmpty(accessionUse)) {
												checkCode(apikey, accessionUse, 'IDENTIFIER_USE', function (resAccessionUseCode) {
													if (resAccessionUseCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accession use code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkAccessionType', function () {
											if (!validator.isEmpty(accessionType)) {
												checkCode(apikey, accessionType, 'IDENTIFIER_TYPE', function (resAccessionTypeCode) {
													if (resAccessionTypeCode.err_code > 0) {
														myEmitter.emit('checkAccessionUse');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accession type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAccessionUse');
											}
										})

										myEmitter.prependOnceListener('checkAvailabilityCode', function () {
											if (!validator.isEmpty(availabilityCode)) {
												checkCode(apikey, availabilityCode, 'INSTANCE_AVAILABILITY', function (resAvailabilityCodeCode) {
													if (resAvailabilityCodeCode.err_code > 0) {
														myEmitter.emit('checkAccessionType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Availability code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAccessionType');
											}
										})

										myEmitter.prependOnceListener('checkModalityListCode', function () {
											if (!validator.isEmpty(modalityListCode)) {
												checkCode(apikey, modalityListCode, 'DICOM_CID29', function (resModalityListCodeCode) {
													if (resModalityListCodeCode.err_code > 0) {
														myEmitter.emit('checkAvailabilityCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Modality list code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAvailabilityCode');
											}
										})

										myEmitter.prependOnceListener('checkProcedureCodeCode', function () {
											if (!validator.isEmpty(procedureCodeCode)) {
												checkCode(apikey, procedureCodeCode, 'PROCEDURE_CODE', function (resProcedureCodeCodeCode) {
													if (resProcedureCodeCodeCode.err_code > 0) {
														myEmitter.emit('checkModalityListCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Procedure code code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkModalityListCode');
											}
										})

										myEmitter.prependOnceListener('checkReasonCode', function () {
											if (!validator.isEmpty(reasonCode)) {
												checkCode(apikey, reasonCode, 'PROCEDURE_REASON', function (resReasonCodeCode) {
													if (resReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkProcedureCodeCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcedureCodeCode');
											}
										})

										myEmitter.prependOnceListener('checkSeriesModalityCode', function () {
											if (!validator.isEmpty(seriesModalityCode)) {
												checkCode(apikey, seriesModalityCode, 'DICOM_CID29', function (resSeriesModalityCodeCode) {
													if (resSeriesModalityCodeCode.err_code > 0) {
														myEmitter.emit('checkReasonCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Series modality code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonCode');
											}
										})

										myEmitter.prependOnceListener('checkSeriesAvailabilityCode', function () {
											if (!validator.isEmpty(seriesAvailabilityCode)) {
												checkCode(apikey, seriesAvailabilityCode, 'INSTANCE_AVAILABILITY', function (resSeriesAvailabilityCodeCode) {
													if (resSeriesAvailabilityCodeCode.err_code > 0) {
														myEmitter.emit('checkSeriesModalityCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Series availability code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSeriesModalityCode');
											}
										})

										myEmitter.prependOnceListener('checkSeriesBodySiteCode', function () {
											if (!validator.isEmpty(seriesBodySiteCode)) {
												checkCode(apikey, seriesBodySiteCode, 'BODY_SITE', function (resSeriesBodySiteCodeCode) {
													if (resSeriesBodySiteCodeCode.err_code > 0) {
														myEmitter.emit('checkSeriesAvailabilityCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Series body site code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSeriesAvailabilityCode');
											}
										})

										myEmitter.prependOnceListener('checkSeriesLateralityCode', function () {
											if (!validator.isEmpty(seriesLateralityCode)) {
												checkCode(apikey, seriesLateralityCode, 'BODYSITE_LATERALITY', function (resSeriesLateralityCodeCode) {
													if (resSeriesLateralityCodeCode.err_code > 0) {
														myEmitter.emit('checkSeriesBodySiteCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Series laterality code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSeriesBodySiteCode');
											}
										})

													
													/* check value
													
accessionValue|identifier
patientId|patient
contextEncounterId|encounter
contextEpisodeOfCareId|episodeOfCare
basedOnReferralRequest|referralRequest
basedOnCarePlan|careplan
basedOnProcedureRequest|procedureRequest
referrerId|practitioner
interpreter|practitioner
endpoint|endpoint
procedureReference|procedure
seriesEndpoint|endpoint
seriesPerformer|practitioner
													*/
										myEmitter.prependOnceListener('checkAccessionValue', function () {
											if (!validator.isEmpty(accessionValue)) {
												checkUniqeValue(apikey, "IDENTIFIER_ID|" + accessionValue, 'IDENTIFIER', function (resAccessionValue) {
													if (resAccessionValue.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accession value id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkPatientId', function () {
											if (!validator.isEmpty(patientId)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patientId, 'PATIENT', function (resPatientId) {
													if (resPatientId.err_code > 0) {
														myEmitter.emit('checkAccessionValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAccessionValue');
											}
										})

										myEmitter.prependOnceListener('checkContextEncounterId', function () {
											if (!validator.isEmpty(contextEncounterId)) {
												checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounterId, 'ENCOUNTER', function (resContextEncounterId) {
													if (resContextEncounterId.err_code > 0) {
														myEmitter.emit('checkPatientId');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context encounter id id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatientId');
											}
										})

										myEmitter.prependOnceListener('checkContextEpisodeOfCareId', function () {
											if (!validator.isEmpty(contextEpisodeOfCareId)) {
												checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + contextEpisodeOfCareId, 'EPISODE_OF_CARE', function (resContextEpisodeOfCareId) {
													if (resContextEpisodeOfCareId.err_code > 0) {
														myEmitter.emit('checkContextEncounterId');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context episode of care id id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEncounterId');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnReferralRequest', function () {
											if (!validator.isEmpty(basedOnReferralRequest)) {
												checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + basedOnReferralRequest, 'REFERRAL_REQUEST', function (resBasedOnReferralRequest) {
													if (resBasedOnReferralRequest.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCareId');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on referral request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCareId');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnCarePlan', function () {
											if (!validator.isEmpty(basedOnCarePlan)) {
												checkUniqeValue(apikey, "CAREPLAN_ID|" + basedOnCarePlan, 'CAREPLAN', function (resBasedOnCarePlan) {
													if (resBasedOnCarePlan.err_code > 0) {
														myEmitter.emit('checkBasedOnReferralRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on care plan id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnReferralRequest');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnProcedureRequest', function () {
											if (!validator.isEmpty(basedOnProcedureRequest)) {
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + basedOnProcedureRequest, 'PROCEDURE_REQUEST', function (resBasedOnProcedureRequest) {
													if (resBasedOnProcedureRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnCarePlan');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on procedure request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnCarePlan');
											}
										})

										myEmitter.prependOnceListener('checkReferrerId', function () {
											if (!validator.isEmpty(referrerId)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + referrerId, 'PRACTITIONER', function (resReferrerId) {
													if (resReferrerId.err_code > 0) {
														myEmitter.emit('checkBasedOnProcedureRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Referrer id id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnProcedureRequest');
											}
										})

										myEmitter.prependOnceListener('checkInterpreter', function () {
											if (!validator.isEmpty(interpreter)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + interpreter, 'PRACTITIONER', function (resInterpreter) {
													if (resInterpreter.err_code > 0) {
														myEmitter.emit('checkReferrerId');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Interpreter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReferrerId');
											}
										})

										myEmitter.prependOnceListener('checkEndpoint', function () {
											if (!validator.isEmpty(endpoint)) {
												checkUniqeValue(apikey, "ENDPOINT_ID|" + endpoint, 'ENDPOINT', function (resEndpoint) {
													if (resEndpoint.err_code > 0) {
														myEmitter.emit('checkInterpreter');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Endpoint id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInterpreter');
											}
										})

										myEmitter.prependOnceListener('checkProcedureReference', function () {
											if (!validator.isEmpty(procedureReference)) {
												checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureReference, 'PROCEDURE', function (resProcedureReference) {
													if (resProcedureReference.err_code > 0) {
														myEmitter.emit('checkEndpoint');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Procedure reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkEndpoint');
											}
										})

										myEmitter.prependOnceListener('checkSeriesEndpoint', function () {
											if (!validator.isEmpty(seriesEndpoint)) {
												checkUniqeValue(apikey, "ENDPOINT_ID|" + seriesEndpoint, 'ENDPOINT', function (resSeriesEndpoint) {
													if (resSeriesEndpoint.err_code > 0) {
														myEmitter.emit('checkProcedureReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Series endpoint id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcedureReference');
											}
										})

										if (!validator.isEmpty(seriesPerformer)) {
											checkUniqeValue(apikey, "PRACTITIONER_ID|" + seriesPerformer, 'PRACTITIONER', function (resSeriesPerformer) {
												if (resSeriesPerformer.err_code > 0) {
													myEmitter.emit('checkSeriesEndpoint');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Series performer id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSeriesEndpoint');
										}
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Identifier type code not found"
										});
									}
								})
							} else {
								res.json({
									"err_code": "404",
									"err_msg": "Identifier use code not found"
								});
							}
						})
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
		imagingStudySeries: function addImagingStudySeries(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingStudyId = req.params.imaging_study_id;
			
			var err_code = 0;
      var err_msg = "";
			//input check
      if (typeof imagingStudyId !== 'undefined') {
        if (validator.isEmpty(imagingStudyId)) {
          err_code = 2;
          err_msg = "Imaging Study id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Imaging Study id is required";
      }
			
			if (typeof req.body.uid !== 'undefined') {
        var seriesUid = req.body.uid.trim().toLowerCase();
        if (validator.isEmpty(seriesUid)) {
          err_code = 2;
          err_msg = "Series Uid is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add series uid in json request.";
      }
			if (typeof req.body.number !== 'undefined') {
        var seriesNumber = req.body.number;
        if (!validator.isInt(seriesNumber)) {
          seriesNumber = "";
        }
      } else {
        //seriesNumber = "";
				err_code = 1;
        err_msg = "Please add Series series number in json request.";
      }
			if (typeof req.body.modality !== 'undefined') {
        var seriesModalityCode = req.body.modality.trim().toUpperCase();
        if (validator.isEmpty(seriesModalityCode)) {
          err_code = 2;
          err_msg = "Series Modality Code is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add Series Modality Code in json request.";
      }
			if (typeof req.body.description !== 'undefined') {
        var seriesDescription = req.body.description;
        if (validator.isEmpty(seriesDescription)) {
          seriesDescription = "";
        }
      } else {
        //seriesDescription = "";
				err_code = 1;
        err_msg = "Please add Series description in json request.";
      }
			if (typeof req.body.numberOfInstances !== 'undefined') {
        var seriesNumberOfInstances = req.body.numberOfInstances;
        if (!validator.isInt(seriesNumberOfInstances)) {
          seriesNumberOfInstances = "";
        }
      } else {
        //seriesNumberOfInstances = "";
				err_code = 1;
        err_msg = "Please add Series number of instances in json request.";
      }
			if (typeof req.body.availability !== 'undefined') {
        var seriesAvailabilityCode = req.body.availability.trim().toUpperCase();
        if (validator.isEmpty(seriesAvailabilityCode)) {
          seriesAvailabilityCode = "";
        }
      } else {
        //seriesAvailabilityCode = "";
				err_code = 1;
        err_msg = "Please add Series availability code in json request.";
      }
			if (typeof req.body.bodySite !== 'undefined') {
        var seriesBodySiteCode = req.body.bodySite.trim().toUpperCase();
        if (validator.isEmpty(seriesBodySiteCode)) {
          seriesBodySiteCode = "";
        }
      } else {
        //seriesBodySiteCode = "";
				err_code = 1;
        err_msg = "Please add Series body site code in json request.";
      }
			if (typeof req.body.laterality !== 'undefined') {
        var seriesLateralityCode = req.body.laterality.trim().toUpperCase();
        if (validator.isEmpty(seriesLateralityCode)) {
          seriesLateralityCode = "";
        }
      } else {
        //seriesLateralityCode = "";
				err_code = 1;
        err_msg = "Please add Series laterality code in json request.";
      }
			if (typeof req.body.started !== 'undefined') {
        var seriesStarted = req.body.started;
        if (!regex.test(seriesStarted)) {
          err_code = 2;
          err_msg = "Series Started invalid date format.";
        }
      } else {
        //seriesStarted = "";
				err_code = 1;
        err_msg = "Please add Series started in json request.";
      }
			
			if (err_code == 0) {
				checkCode(apikey, seriesModalityCode, 'DICOM_CID29', function (resSeriesModalityCode) {
					if (resSeriesModalityCode.err_code > 0) {
						myEmitter.once('checkImagingStudyId', function () {
							checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + imagingStudyId, 'IMAGING_STUDY', function (resImagingStudyId) {
								if (resImagingStudyId.err_code > 0) {
									var seriesId = 'ser' + uniqid.time();

									//data series
									dataSeries = {
										"series_id": seriesId,
										"uid": seriesUid,
										"number": seriesNumber,
										"modality": seriesModalityCode,
										"description": seriesDescription,
										"number_of_instances": seriesNumberOfInstances,
										"availability": seriesAvailabilityCode,
										"body_site": seriesBodySiteCode,
										"laterality": seriesLateralityCode,
										"started": seriesStarted,
										"imaging_study_id": imagingStudyId
									}
									ApiFHIR.post('imagingStudySeries', {
										"apikey": apikey
									}, {
										body: dataSeries,
										json: true
									}, function (error, response, body) {
										imagingStudySeries = body;
										if (imagingStudySeries.err_code > 0) {
											res.json(imagingStudySeries);
										}
									})

									res.json({
										"err_code": 0,
										"err_msg": "Imaging Study Series has been add.",
										"data": [{
												"id": seriesId
											}
										]
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Imaging Study Id not found"
									});
								}
							})
						})
						myEmitter.prependOnceListener('checkLaterality', function () {
							if (!validator.isEmpty(seriesLateralityCode)) {
								checkCode(apikey, seriesLateralityCode, 'BODYSITE_LATERALITY', function (resSeriesLateralityCode) {
									if (resSeriesLateralityCode.err_code > 0) {
										myEmitter.emit('checkImagingStudyId');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Bodysite Laterality code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImagingStudyId');
							}
						})
						myEmitter.prependOnceListener('checkBodySite', function () {
							if (!validator.isEmpty(seriesBodySiteCode)) {
								checkCode(apikey, seriesBodySiteCode, 'BODY_SITE', function (resSeriesBodySiteCode) {
									if (resSeriesBodySiteCode.err_code > 0) {
										myEmitter.emit('checkLaterality');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Body Site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkLaterality');
							}
						})
						if (!validator.isEmpty(seriesAvailabilityCode)) {
							checkCode(apikey, seriesAvailabilityCode, 'INSTANCE_AVAILABILITY', function (resSeriesAvailabilityCode) {
								if (resSeriesAvailabilityCode.err_code > 0) {
									myEmitter.emit('checkBodySite');
								} else {
									res.json({
										"err_code": "404",
										"err_msg": "Instance Availability code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkBodySite');
						}
					} else {
						res.json({
							"err_code": "404",
							"err_msg": "Modality code not found"
						});
					}
				})
			} else {
        res.json({
          "err_code": err_code,
          "err_msg": err_msg
        });
      }
		},
		imagingStudySeriesInstance: function addImagingStudySeriesInstance(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var seriesId = req.params.series_id;
			
			var err_code = 0;
      var err_msg = "";
			
			//input check
      if (typeof seriesId !== 'undefined') {
        if (validator.isEmpty(seriesId)) {
          err_code = 2;
          err_msg = "Imaging Study Series id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Imaging Study Series id is required";
      }
			
			if (typeof req.body.uid !== 'undefined') {
        var seriesInstanceUid = req.body.uid.trim().toLowerCase();
        if (validator.isEmpty(seriesInstanceUid)) {
          err_code = 2;
          err_msg = "Series instance Uid is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add series instance uid in json request.";
      }
			if (typeof req.body.number !== 'undefined') {
        var seriesInstanceNumber = req.body.number;
        if (!validator.isInt(seriesInstanceNumber)) {
          seriesInstanceNumber = "";
        }
      } else {
        //seriesInstanceNumber = "";
				err_code = 1;
        err_msg = "Please add series instance number in json request.";
      }
			if (typeof req.body.sopClass !== 'undefined') {
        var seriesInstanceSopClass = req.body.sopClass.trim().toLowerCase();
        if (validator.isEmpty(seriesInstanceSopClass)) {
          err_code = 2;
          err_msg = "Series instance sopClass is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add series instance sopClass in json request.";
      }
			if (typeof req.body.title !== 'undefined') {
        var seriesInstanceTitle = req.body.title;
        if (validator.isEmpty(seriesInstanceTitle)) {
          seriesInstanceTitle = "";
        }
      } else {
        //seriesInstanceTitle = "";
				err_code = 1;
        err_msg = "Please add series instance title in json request.";
      }
			
			if (err_code == 0) {
				checkUniqeValue(apikey, "IMAGING_STUDY_SERIES_ID|" + seriesId, 'IMAGING_STUDY_SERIES', function (resSeriesId) {
					if (resSeriesId.err_code > 0) {
						var instanceId = 'ins' + uniqid.time();
						
						// data instance
						dataInstance = {
							"instance_id": instanceId,
							"uid": seriesInstanceUid,
							"number": seriesInstanceNumber,
							"sop_class": seriesInstanceSopClass,
							"title": seriesInstanceTitle,
							"series_id": seriesId
						}
						ApiFHIR.post('imagingStudySeriesInstance', {
							"apikey": apikey
						}, {
							body: dataInstance,
							json: true
						}, function (error, response, body) {
							imagingStudySeriesInstance = body;
							if (imagingStudySeriesInstance.err_code > 0) {
								res.json(imagingStudySeriesInstance);
							}
						})
						res.json({
							"err_code": 0,
							"err_msg": "Imaging Study Series Instance has been add.",
							"data": [{
									"id": instanceId
								}
							]
						})
					} else {
						res.json({
							"err_code": 404,
							"err_msg": "Imaging Study Series Id not found"
						});
					}
				})
			} else {
        res.json({
          "err_code": err_code,
          "err_msg": err_msg
        });
      }
		},
		identifier: function addIdentifier(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var imagingStudyId = req.params.imaging_study_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof imagingStudyId !== 'undefined') {
        if (validator.isEmpty(imagingStudyId)) {
          err_code = 2;
          err_msg = "Imaging Study id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Imaging Study id is required";
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
                        checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + imagingStudyId, 'IMAGING_STUDY', function (resEncounterID) {
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
                              "imaging_study_id": imagingStudyId
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
                                  "err_msg": "Identifier has been add in this imaging study.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "Imaging Study Id not found"
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
    }
	},
	put:{
		imagingStudy: function updateImagingStudy(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var imagingStudyId = req.params.imaging_study_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataImagingStudy = {};
			
			if (typeof imagingStudyId !== 'undefined') {
        if (validator.isEmpty(imagingStudyId)) {
          err_code = 2;
          err_msg = "Imaging Study Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Imaging Study Id is required.";
      }
			if (typeof req.body.uid !== 'undefined') {
        var uid = req.body.uid.trim().toLowerCase();
        if (validator.isEmpty(uid)) {
          err_code = 2;
          err_msg = "Uid is empty";
        } else {
					dataImagingStudy.uid = uid;
				}
      } else {
        uid = "";
      }
			if (typeof req.body.accession !== 'undefined') {
        var accessionId = req.body.accession.trim().toLowerCase();
        if (validator.isEmpty(accessionId)) {
					dataImagingStudy.accession = "";
        } else {
					dataImagingStudy.accession = accessionId;
				}
      } else {
        accessionId = "";
      }
			if (typeof req.body.availability !== 'undefined') {
        var availabilityCode = req.body.availability.trim().toUpperCase();
        if (validator.isEmpty(availabilityCode)) {
          dataImagingStudy.availability = "";
        } else {
					dataImagingStudy.availability = availabilityCode;
				}
      } else {
        availabilityCode = "";
      }
			if (typeof req.body.modalityList !== 'undefined') {
        var modalityListCode = req.body.modalityList.trim().toUpperCase();
        if (validator.isEmpty(modalityListCode)) {
          dataImagingStudy.modalityList = "";
        } else {
					dataImagingStudy.modalityList = modalityListCode;
				}
      } else {
        modalityListCode = "";
      }
			if (typeof req.body.patient !== 'undefined') {
        var patientId = req.body.patient.trim().toLowerCase();
        if (validator.isEmpty(patientId)) {
          err_code = 2;
          err_msg = "Patient id is required";
        } else {
					dataImagingStudy.patient = patientId;
				}
      } else {
        patientId = "";
      }
			if (typeof req.body.context.encounter !== 'undefined') {
        var contextEncounterId = req.body.context.encounter.trim().toLowerCase();
        if (validator.isEmpty(contextEncounterId)) {
          dataImagingStudy.context_encounter = "";
        } else {
					dataImagingStudy.context_encounter = contextEncounterId;
				}
      } else {
        contextEncounterId = "";
      }
			if (typeof req.body.context.episodeOfCare !== 'undefined') {
        var contextEpisodeOfCareId = req.body.context.episodeOfCare.trim().toLowerCase();
        if (validator.isEmpty(contextEpisodeOfCareId)) {
          dataImagingStudy.context_episode_of_care = "";
        } else {
					dataImagingStudy.context_episode_of_care = contextEpisodeOfCareId;
				}
      } else {
        contextEpisodeOfCareId = "";
      }
			if (typeof req.body.started !== 'undefined') {
        var started = req.body.started;
        if (!regex.test(started)) {
          err_code = 2;
          err_msg = "Started invalid date format.";
        } else {
					dataImagingStudy.started = started;
				}
      } else {
        started = "";
      }
			if (typeof req.body.referrer !== 'undefined') {
        var referrerId = req.body.referrer.trim().toLowerCase();
        if (validator.isEmpty(referrerId)) {
          dataImagingStudy.referrer = "";
        } else {
					dataImagingStudy.referrer = referrerId;
				}
      } else {
        referrerId = "";
      }
			if (typeof req.body.numberOfSeries !== 'undefined') {
        var numberOfSeries = req.body.numberOfSeries;
        if (!validator.isInt(numberOfSeries)) {
          err_code = 2;
          err_msg = "numberOfSeries is invalid format";
        } else {
					dataImagingStudy.number_of_series = numberOfSeries;
				}
      } else {
        numberOfSeries = "";
      }
			if (typeof req.body.numberOfInstances !== 'undefined') {
        var numberOfInstances = req.body.numberOfInstances;
        if (!validator.isInt(numberOfInstances)) {
          err_code = 2;
          err_msg = "numberOfSeries is invalid format";
        } else {
					dataImagingStudy.number_of_instances = numberOfInstances;
				}
      } else {
        numberOfInstances = "";
      }
			if (typeof req.body.procedureCode !== 'undefined') {
        var procedureCodeCode = req.body.procedureCode.trim().toLowerCase();
        if (validator.isEmpty(procedureCodeCode)) {
          dataImagingStudy.procedure_code = "";
        } else {
					dataImagingStudy.procedure_code = procedureCodeCode;
				}
      } else {
        procedureCodeCode = "";
      }
			if (typeof req.body.reason !== 'undefined') {
        var reasonCode = req.body.reason.trim();
        if (validator.isEmpty(reasonCode)) {
          dataImagingStudy.reason = "";
        } else {
					dataImagingStudy.reason = reasonCode;
				}
      } else {
        reasonCode = "";
      }
			if (typeof req.body.description !== 'undefined') {
        var description = req.body.description;
        if (validator.isEmpty(description)) {
          dataImagingStudy.description = "";
        } else {
					dataImagingStudy.description = description;
				}
      } else {
        description = "";
      }
			if (typeof req.body.chargeItem !== 'undefined') {
        var chargeItemId = req.body.chargeItem.trim().toLowerCase();
        if (validator.isEmpty(chargeItemId)) {
          dataImagingStudy.charge_item_id = "";
        } else {
					dataImagingStudy.charge_item_id = chargeItemId;
				}
      } else {
        chargeItemId = "";
      }
			if (typeof req.body.clinicalImpressionInvestigation !== 'undefined') {
        var clinicalImpressionInvestigationId = req.body.clinicalImpressionInvestigation.trim().toLowerCase();
        if (validator.isEmpty(clinicalImpressionInvestigationId)) {
          dataImagingStudy.clinical_impression_investigation_id = "";
        } else {
					dataImagingStudy.clinical_impression_investigation_id = clinicalImpressionInvestigationId;
				}
      } else {
        clinicalImpressionInvestigationId = "";
      }
			if (typeof req.body.diagnosticReport !== 'undefined') {
        var diagnosticReportId = req.body.diagnosticReport.trim().toLowerCase();
        if (validator.isEmpty(diagnosticReportId)) {
          dataImagingStudy.diagnostic_report_id = "";
        } else {
					dataImagingStudy.diagnostic_report_id = diagnosticReportId;
				}
      } else {
        diagnosticReportId = "";
      }
			if (typeof req.body.imagingManifestStudy !== 'undefined') {
        var imagingManifestStudyId = req.body.imagingManifestStudy.trim().toLowerCase();
        if (validator.isEmpty(imagingManifestStudyId)) {
          dataImagingStudy.imaging_manifest_study_id = "";
        } else {
					dataImagingStudy.imaging_manifest_study_id = imagingManifestStudyId;
				}
      } else {
        imagingManifestStudyId = "";
      }
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + imagingStudyId, 'IMAGING_STUDY', function (resImagingStudyId) {
								if (resImagingStudyId.err_code > 0) {
									ApiFHIR.put('imagingStudy', {
										"apikey": apikey,
										"_id": imagingStudyId
									}, {
										body: dataImagingStudy,
										json: true
									}, function (error, response, body) {
										imagingStudy = body;
										if (imagingStudy.err_code > 0) {
											res.json(imagingStudy);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Imaging Study has been updated.",
												"data": imagingStudy.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Imaging Study Id not found"
									});
								}
							})
						})
						myEmitter.prependOnceListener('checkImagingManifestStudy', function () {
							if (!validator.isEmpty(imagingManifestStudyId)) {
								checkUniqeValue(apikey, "STUDY_ID|" + imagingManifestStudyId, 'IMAGING_MANIFEST_STUDY', function (resImagingManifestStudyId) {
									if (resImagingManifestStudyId.err_code > 0) {
										myEmitter.emit('checkId');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Imaging Manifest Study id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkId');
							}
						})
						myEmitter.prependOnceListener('checkDiagnosticReport', function () {
							if (!validator.isEmpty(diagnosticReportId)) {
								checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function (resDiagnosticReportId) {
									if (resDiagnosticReportId.err_code > 0) {
										myEmitter.emit('checkImagingManifestStudy');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Diagnostic Report id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImagingManifestStudy');
							}
						})
						myEmitter.prependOnceListener('checkClinicalImpressionInvestigation', function () {
							if (!validator.isEmpty(clinicalImpressionInvestigationId)) {
								checkUniqeValue(apikey, "INVESTIGATION_ID|" + clinicalImpressionInvestigationId, 'CLINICAL_IMPRESSION_INVESTIGATION', function (resClinicalImpressionInvestigationId) {
									if (resClinicalImpressionInvestigationId.err_code > 0) {
										myEmitter.emit('checkDiagnosticReport');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Clinical Impression Investigation id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDiagnosticReport');
							}
						})
						myEmitter.prependOnceListener('checkChargeItem', function () {
							if (!validator.isEmpty(chargeItemId)) {
								checkUniqeValue(apikey, "CHARGE_ITEM_ID|" + chargeItemId, 'CHARGE_ITEM', function (resChargeItemId) {
									if (resChargeItemId.err_code > 0) {
										myEmitter.emit('checkClinicalImpressionInvestigation');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Charge Item id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClinicalImpressionInvestigation');
							}
						})
						myEmitter.prependOnceListener('checkReason', function () {
							if (!validator.isEmpty(reasonCode)) {
								checkCode(apikey, reasonCode, 'PROCEDURE_REASON', function (resReasonCode) {
									if (resReasonCode.err_code > 0) {
										myEmitter.emit('checkChargeItem');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Reason code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkChargeItem');
							}
						})
						myEmitter.prependOnceListener('checkProcedureCode', function () {
							if (!validator.isEmpty(procedureCodeCode)) {
								checkCode(apikey, procedureCodeCode, 'PROCEDURE_CODE', function (resProcedureCodeCode) {
									if (resProcedureCodeCode.err_code > 0) {
										myEmitter.emit('checkReason');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Procedure code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReason');
							}
						})
						myEmitter.prependOnceListener('checkReferrer', function () {
							if (!validator.isEmpty(referrerId)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + referrerId, 'PRACTITIONER', function (resReferrerId) {
									if (resReferrerId.err_code > 0) {
										myEmitter.emit('checkProcedureCode');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Referrer Of care id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureCode');
							}
						})
						myEmitter.prependOnceListener('checkEpisodeOfCare', function () {
							if (!validator.isEmpty(contextEpisodeOfCareId)) {
								checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + contextEpisodeOfCareId, 'EPISODE_OF_CARE', function (resContextEpisodeOfCare) {
									if (resContextEpisodeOfCare.err_code > 0) {
										myEmitter.emit('checkReferrer');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Episode Of care id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReferrer');
							}
						})
						myEmitter.prependOnceListener('checkEncounter', function () {
							if (!validator.isEmpty(contextEncounterId)) {
								checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounterId, 'ENCOUNTER', function (resContextEncounterId) {
									if (resContextEncounterId.err_code > 0) {
										myEmitter.emit('checkEpisodeOfCare');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Encounter id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEpisodeOfCare');
							}
						})
						myEmitter.prependOnceListener('checkPatient', function () {
							if (validator.isEmpty(patientId)) {
								myEmitter.emit('checkEncounter');
							} else {
								checkUniqeValue(apikey, "PATIENT_ID|" + patientId, 'PATIENT', function (resPatientId) {
									if (resPatientId.err_code > 0) {
										myEmitter.emit('checkEncounter');
									} else {
										res.json({
											"err_code": 404,
											"err_msg": "Patient Id not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkModalityList', function () {
							if (!validator.isEmpty(modalityListCode)) {
								checkCode(apikey, modalityListCode, 'DICOM_CID29', function (resModalityListCode) {
									if (resModalityListCode.err_code > 0) {
										myEmitter.emit('checkPatient');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "ModalityList code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPatient');
							}
						})
						myEmitter.prependOnceListener('checkAvailability', function () {
							if (validator.isEmpty(availabilityCode)) {
								myEmitter.emit('checkModalityList');
							} else {
								checkCode(apikey, availabilityCode, 'INSTANCE_AVAILABILITY', function (resAvailabilityCode) {
									if (resAvailabilityCode.err_code > 0) {
										myEmitter.emit('checkModalityList');
									} else {
										res.json({
											"err_code": 404,
											"err_msg": "Availability code not found"
										});
									}
								})
							}
						})
						if (validator.isEmpty(accessionId)) {
							myEmitter.emit('checkAvailability');
						} else {
							checkUniqeValue(apikey, "IDENTIFIER_ID|" + accessionId, 'IDENTIFIER', function (resAccessionId) {
								if (resAccessionId.err_code > 0) {
									myEmitter.emit('checkAvailability');
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Accession Id not found"
									});
								}
							})
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
      var imagingStudyId = req.params.imaging_study_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof imagingStudyId !== 'undefined') {
        if (validator.isEmpty(imagingStudyId)) {
          err_code = 2;
          err_msg = "Imaging Study id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Imaging Study id is required";
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
            myEmitter.once('checkImagingStudyId', function () {
              checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + imagingStudyId, 'IMAGING_STUDY', function (resImagingStudyId) {
                if (resImagingStudyId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "IMAGING_STUDY_ID|" + imagingStudyId
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
                            "err_msg": "Identifier has been update in this episode of care.",
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
                    "err_msg": "Episode Of Care Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkImagingStudyId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkImagingStudyId');
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
		imagingStudySeries: function updateImagingStudySeries(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingStudyId = req.params.imaging_study_id;
      var seriesId = req.params.series_id;

      var err_code = 0;
      var err_msg = "";
      var dataSeries = {};
			
			if (typeof imagingStudyId !== 'undefined') {
        if (validator.isEmpty(imagingStudyId)) {
          err_code = 2;
          err_msg = "Imaging Study id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Imaging Study id is required";
      }
			if (typeof seriesId !== 'undefined') {
        if (validator.isEmpty(seriesId)) {
          err_code = 2;
          err_msg = "Imaging Study Series id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Imaging Study Series id is required";
      }
			if (typeof req.body.uid !== 'undefined') {
        var seriesUid = req.body.uid.trim().toLowerCase();
        if (validator.isEmpty(seriesUid)) {
          err_code = 2;
          err_msg = "Series Uid is required";
        } else {
					dataSeries.uid = seriesUid;
				}
      } else {
        seriesUid = "";
      }
			if (typeof req.body.number !== 'undefined') {
        var seriesNumber = req.body.number;
        if (!validator.isInt(seriesNumber)) {
          seriesNumber = "";
        } else {
					dataSeries.number = seriesNumber;
				}
      } else {
        seriesNumber = "";
      }
			if (typeof req.body.modality !== 'undefined') {
        var seriesModalityCode = req.body.modality.trim().toUpperCase();
        if (validator.isEmpty(seriesModalityCode)) {
          seriesModalityCode = "";
        } else {
					dataSeries.modality = seriesModalityCode;
				}
      } else {
        seriesModalityCode = "";
      }
			if (typeof req.body.description !== 'undefined') {
        var seriesDescription = req.body.description;
        if (validator.isEmpty(seriesDescription)) {
          seriesDescription = "";
        } else {
					dataSeries.description = seriesDescription;
				}
      } else {
        seriesDescription = "";
      }
			if (typeof req.body.numberOfInstances !== 'undefined') {
        var seriesNumberOfInstances = req.body.numberOfInstances;
        if (!validator.isInt(seriesNumberOfInstances)) {
          seriesNumberOfInstances = "";
        } else {
					dataSeries.number_of_instances = seriesNumberOfInstances;
				}
      } else {
        seriesNumberOfInstances = "";
      }
			if (typeof req.body.availability !== 'undefined') {
        var seriesAvailabilityCode = req.body.availability.trim().toUpperCase();
        if (validator.isEmpty(seriesAvailabilityCode)) {
          seriesAvailabilityCode = "";
        } else {
					dataSeries.availability = seriesAvailabilityCode;
				}
      } else {
        seriesAvailabilityCode = "";
      }
			if (typeof req.body.bodySite !== 'undefined') {
        var seriesBodySiteCode = req.body.bodySite.trim().toUpperCase();
        if (validator.isEmpty(seriesBodySiteCode)) {
          seriesBodySiteCode = "";
        } else {
					dataSeries.body_site = seriesBodySiteCode; 
				}
      } else {
        seriesBodySiteCode = "";
      }
			if (typeof req.body.laterality !== 'undefined') {
        var seriesLateralityCode = req.body.laterality.trim().toUpperCase();
        if (validator.isEmpty(seriesLateralityCode)) {
          seriesLateralityCode = "";
        } else {
					dataSeries.laterality = seriesLateralityCode;
				}
      } else {
        seriesLateralityCode = "";
      }
			if (typeof req.body.started !== 'undefined') {
        var seriesStarted = req.body.started;
        if (!regex.test(seriesStarted)) {
          err_code = 2;
          err_msg = "Series Started invalid date format.";
        } else {
					dataSeries.started = seriesStarted;
				}
      } else {
        seriesStarted = "";
      }
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkImagingStudyId', function () {
							checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + imagingStudyId, 'IMAGING_STUDY', function (resImagingStudyId) {
								if (resImagingStudyId.err_code > 0) {
									checkUniqeValue(apikey, "SERIES_ID|" + seriesId, 'IMAGING_STUDY_SERIES', function (resSeriesId) {
										if (resSeriesId.err_code > 0) {
											ApiFHIR.put('imagingStudySeries', {
                        "apikey": apikey,
                        "_id": seriesId,
                        "dr": "IMAGING_STUDY_ID|" + imagingStudyId
                      }, {
                        body: dataSeries,
                        json: true
                      }, function (error, response, body) {
                        series = body;
                        if (series.err_code > 0) {
                          res.json(series);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Imaging Study Series has been update in this episode of care.",
                            "data": series.data
                          });
                        }
                      })
										} else {
                      res.json({
                        "err_code": 503,
                        "err_msg": "Series Id not found"
                      });
                    }								
									})
								} else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Imaging Study Id not found"
                  });
                }
							})
						})
						myEmitter.prependOnceListener('checkLaterality', function () {
							if (!validator.isEmpty(seriesLateralityCode)) {
								checkCode(apikey, seriesLateralityCode, 'BODYSITE_LATERALITY', function (resSeriesLateralityCode) {
									if (resSeriesLateralityCode.err_code > 0) {
										myEmitter.emit('checkImagingStudyId');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Bodysite Laterality code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImagingStudyId');
							}
						})
						myEmitter.prependOnceListener('checkBodySite', function () {
							if (!validator.isEmpty(seriesBodySiteCode)) {
								checkCode(apikey, seriesBodySiteCode, 'BODY_SITE', function (resSeriesBodySiteCode) {
									if (resSeriesBodySiteCode.err_code > 0) {
										myEmitter.emit('checkLaterality');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Body Site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkLaterality');
							}
						})
						myEmitter.prependOnceListener('checkAvailability', function () {
							if (!validator.isEmpty(seriesAvailabilityCode)) {
								checkCode(apikey, seriesAvailabilityCode, 'INSTANCE_AVAILABILITY', function (resSeriesAvailabilityCode) {
									if (resSeriesAvailabilityCode.err_code > 0) {
										myEmitter.emit('checkBodySite');
									} else {
										res.json({
											"err_code": "404",
											"err_msg": "Instance Availability code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkBodySite');
							}
						})
						if (!validator.isEmpty(seriesModalityCode)) {
							checkCode(apikey, seriesModalityCode, 'DICOM_CID29', function (resSeriesModalityCode) {
								if (resSeriesModalityCode.err_code > 0) {
									myEmitter.emit('checkAvailability');
								} else {
									res.json({
										"err_code": "404",
										"err_msg": "Instance Modality code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAvailability');
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
		imagingStudySeriesInstance: function updateImagingStudySeriesInstance(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var seriesId = req.params.series_id;
			var instanceId = req.params.instance_id;

      var err_code = 0;
      var err_msg = "";
      var dataSeriesInstance = {};
			
			//input check
      if (typeof seriesId !== 'undefined') {
        if (validator.isEmpty(seriesId)) {
          err_code = 2;
          err_msg = "Imaging Study Series id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Imaging Study Series id is required";
      }
			if (typeof instanceId !== 'undefined') {
        if (validator.isEmpty(instanceId)) {
          err_code = 2;
          err_msg = "Imaging Study Series Instance id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Imaging Study Series Instance id is required";
      }
			if (typeof req.body.uid !== 'undefined') {
        var seriesInstanceUid = req.body.uid.trim().toLowerCase();
        if (validator.isEmpty(seriesInstanceUid)) {
          err_code = 2;
          err_msg = "Series instance Uid is required";
        } else {
					dataSeriesInstance.uid = seriesInstanceUid;
				}
      } else {
        seriesInstanceUid = "";
      }
			if (typeof req.body.number !== 'undefined') {
        var seriesInstanceNumber = req.body.number;
        if (!validator.isInt(seriesInstanceNumber)) {
          err_code = 2;
          err_msg = "Instance Number is invalid";
        } else {
					dataSeriesInstance.number = seriesInstanceNumber;
				}
      } else {
        seriesInstanceNumber = "";
      }
			if (typeof req.body.sopClass !== 'undefined') {
        var seriesInstanceSopClass = req.body.sopClass.trim().toLowerCase();
        if (validator.isEmpty(seriesInstanceSopClass)) {
          seriesInstanceSopClass = "";
        } else {
					dataSeriesInstance.sop_class = seriesInstanceSopClass;
				}
      } else {
        seriesInstanceSopClass = "";
      }
			if (typeof req.body.title !== 'undefined') {
        var seriesInstanceTitle = req.body.title;
        if (validator.isEmpty(seriesInstanceTitle)) {
          seriesInstanceTitle = "";
        } else {
					dataSeriesInstance.title = seriesInstanceTitle;
				}
      } else {
        seriesInstanceTitle = "";
      }
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkUniqeValue(apikey, "SERIES_ID|" + seriesId, 'IMAGING_STUDY_SERIES', function (resSeriesId) {
							if (resSeriesId.err_code > 0) {
								checkUniqeValue(apikey, "INSTANCE_ID|" + instanceId, 'IMAGING_STUDY_SERIES_INSTANCE', function (resInstanceId) {
									if (resInstanceId.err_code > 0) {
										ApiFHIR.put('imagingStudySeriesInstance', {
											"apikey": apikey,
											"_id": instanceId,
											"dr": "SERIES_ID|" + seriesId
										}, {
											body: dataSeriesInstance,
											json: true
										}, function (error, response, body) {
											seriesInstance = body;
											if (seriesInstance.err_code > 0) {
												res.json(seriesInstance);
											} else {
												res.json({
													"err_code": 0,
													"err_msg": "Imaging Study Series Instance has been updated",
													"data": seriesInstance.data
												});
											}
										})
									} else {
										res.json({
											"err_code": 503,
											"err_msg": "Imaging Study Series Instance Id not found"
										});
                  }
								})
							} else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Imaging Study Series Id not found"
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
		}
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