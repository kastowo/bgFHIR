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
  get: {
    episodeOfCare: function getEpisodeOfCare(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

      var episodeOfCareId = req.query._id;
      var episodeOfCareCareManager = req.query.care_manager;
      var episodeOfCareCondition = req.query.condition;
      var episodeOfCareDate = req.query.date;
      var episodeOfCareIdentifier = req.query.identifier;
      var episodeOfCareReferral = req.query.incoming_referral;
      var episodeOfCareOrg = req.query.organization;
      var episodeOfCarePatient = req.query.patient;
      var episodeOfCareStatus = req.query.status;
      var episodeOfCareType = req.query.type;
			var offset = req.query.offset;
			var limit = req.query.limit;


      var qString = {};

      if (typeof episodeOfCareId !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareId)) {
          qString._id = episodeOfCareId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Episode Of Care ID is required."
          })
        }
      }
      if (typeof episodeOfCareCareManager !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareCareManager)) {
          qString.careManager = episodeOfCareCareManager;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Care manager is empty."
          });
        }
      }
      if (typeof episodeOfCareCondition !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareCondition)) {
          qString.condition = episodeOfCareCondition;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Condition is empty."
          });
        }
      }
      if (typeof episodeOfCareDate !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareDate)) {
          if (!regex.test(episodeOfCareDate)) {
            res.json({
              "err_code": 1,
              "err_msg": "Date invalid format."
            });
          } else {
            qString.date = episodeOfCareDate;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Date is empty."
          });
        }
      }
      if (typeof episodeOfCareIdentifier !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareIdentifier)) {
          qString.identifier = episodeOfCareIdentifier;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Identifier is empty."
          });
        }
      }
      if (typeof episodeOfCareReferral !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareReferral)) {
          qString.referral = episodeOfCareReferral;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Referral is empty."
          });
        }
      }
      if (typeof episodeOfCareOrg !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareOrg)) {
          qString.organization = episodeOfCareOrg;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Organization is empty."
          });
        }
      }
      if (typeof episodeOfCarePatient !== 'undefined') {
        if (!validator.isEmpty(episodeOfCarePatient)) {
          qString.patient = episodeOfCarePatient;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Patient is empty."
          });
        }
      }
      if (typeof episodeOfCareStatus !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareStatus)) {
          qString.status = episodeOfCareStatus;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Status is empty."
          });
        }
      }
      if (typeof episodeOfCareType !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareType)) {
          qString.type = episodeOfCareType;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Type is empty."
          });
        }
      }
			
			
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
			
      seedPhoenixFHIR.path.GET = {
        "EpisodeOfCare": {
          "location": "%(apikey)s/EpisodeOfCare",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);

      checkApikey(apikey, ipAddres, function (result) {
        if (result.err_code == 0) {
          ApiFHIR.get('EpisodeOfCare', {
            "apikey": apikey
          }, {}, function (error, response, body) {
            if (error) {
              res.json(error);
            } else {
              var episodeOfCare = JSON.parse(body); //object
              //cek apakah ada error atau tidak
              if (episodeOfCare.err_code == 0) {
                if (episodeOfCare.data.length > 0) {
                  newEpisodeOfCare = [];
                  for (i = 0; i < episodeOfCare.data.length; i++) {
                    myEmitter.prependOnceListener("getIdentifier", function (episodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare) {
                      //get identifier
                      qString = {};
                      qString.episode_of_care_id = episodeOfCare.id;
                      qString.identifier_value = episodeOfCareIdentifier;
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
                          var objectEpisodeOfCare = {};
                          objectEpisodeOfCare.resourceType = episodeOfCare.resourceType;
                          objectEpisodeOfCare.id = episodeOfCare.id;
                          objectEpisodeOfCare.identifier = identifier.data;
                          objectEpisodeOfCare.status = episodeOfCare.status;
                          objectEpisodeOfCare.type = episodeOfCare.type;
                          objectEpisodeOfCare.patient = episodeOfCare.patient;
                          objectEpisodeOfCare.managingOrganization = episodeOfCare.managingOrganization;
                          objectEpisodeOfCare.period = episodeOfCare.period;
                          objectEpisodeOfCare.careManager = episodeOfCare.careManager;

                          newEpisodeOfCare[index] = objectEpisodeOfCare

                            myEmitter.prependOnceListener("getStatusHistory", function (episodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare) {
                              qString = {};
                              qString.episode_of_care_id = episodeOfCare.id;
                              seedPhoenixFHIR.path.GET = {
                                "EpisodeOfCareStatusHistory": {
                                  "location": "%(apikey)s/EpisodeOfCareStatusHistory",
                                  "query": qString
                                }
                              }
                              var ApiFHIR = new Apiclient(seedPhoenixFHIR);
                              ApiFHIR.get('EpisodeOfCareStatusHistory', {
                                "apikey": apikey
                              }, {}, function (error, response, body) {
                                statusHistory = JSON.parse(body);
                                if (statusHistory.err_code == 0) {
                                  var objectEpisodeOfCare = {};
                                  objectEpisodeOfCare.resourceType = episodeOfCare.resourceType;
                                  objectEpisodeOfCare.id = episodeOfCare.id;
                                  objectEpisodeOfCare.identifier = identifier.data;
                                  objectEpisodeOfCare.status = episodeOfCare.status;
                                  objectEpisodeOfCare.statusHistory = statusHistory.data;
                                  objectEpisodeOfCare.type = episodeOfCare.type;
                                  objectEpisodeOfCare.patient = episodeOfCare.patient;
                                  objectEpisodeOfCare.managingOrganization = episodeOfCare.managingOrganization;
                                  objectEpisodeOfCare.period = episodeOfCare.period;
                                  objectEpisodeOfCare.careManager = episodeOfCare.careManager;

                                  newEpisodeOfCare[index] = objectEpisodeOfCare

                                    myEmitter.prependOnceListener("getDiagnosis", function (episodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare) {
                                      qString = {};
                                      qString.episode_of_care_id = episodeOfCare.id;
                                      qString.condition_id = episodeOfCareCondition;
                                      seedPhoenixFHIR.path.GET = {
                                        "EpisodeOfCareDiagnosis": {
                                          "location": "%(apikey)s/EpisodeOfCareDiagnosis",
                                          "query": qString
                                        }
                                      }
                                      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
                                      ApiFHIR.get('EpisodeOfCareDiagnosis', {
                                        "apikey": apikey
                                      }, {}, function (error, response, body) {
                                        diagnosis = JSON.parse(body);
                                        if (diagnosis.err_code == 0) {
                                          var objectEpisodeOfCare = {};
                                          objectEpisodeOfCare.resourceType = episodeOfCare.resourceType;
                                          objectEpisodeOfCare.id = episodeOfCare.id;
                                          objectEpisodeOfCare.identifier = identifier.data;
                                          objectEpisodeOfCare.status = episodeOfCare.status;
                                          objectEpisodeOfCare.statusHistory = statusHistory.data;
                                          objectEpisodeOfCare.type = episodeOfCare.type;
                                          objectEpisodeOfCare.diagnosis = diagnosis.data;
                                          objectEpisodeOfCare.patient = episodeOfCare.patient;
                                          objectEpisodeOfCare.managingOrganization = episodeOfCare.managingOrganization;
                                          objectEpisodeOfCare.period = episodeOfCare.period;
                                          objectEpisodeOfCare.careManager = episodeOfCare.careManager;

                                          newEpisodeOfCare[index] = objectEpisodeOfCare
																					
																					myEmitter.prependOnceListener("getReferralRequest", function (episodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare) {
																						qString = {};
																						qString.episode_of_care_id = episodeOfCare.id;
																						seedPhoenixFHIR.path.GET = {
																							"EpisodeOfCareReferralRequest": {
																								"location": "%(apikey)s/EpisodeOfCareReferralRequest",
																								"query": qString
																							}
																						}
																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																						ApiFHIR.get('EpisodeOfCareReferralRequest', {
																							"apikey": apikey
																						}, {}, function (error, response, body) {
																							referralRequest = JSON.parse(body);
																							if (referralRequest.err_code == 0) {
																								var objectEpisodeOfCare = {};
																								objectEpisodeOfCare.resourceType = episodeOfCare.resourceType;
																								objectEpisodeOfCare.id = episodeOfCare.id;
																								objectEpisodeOfCare.identifier = identifier.data;
																								objectEpisodeOfCare.status = episodeOfCare.status;
																								objectEpisodeOfCare.statusHistory = statusHistory.data;
																								objectEpisodeOfCare.type = episodeOfCare.type;
																								objectEpisodeOfCare.diagnosis = diagnosis.data;
																								objectEpisodeOfCare.patient = episodeOfCare.patient;
																								objectEpisodeOfCare.managingOrganization = episodeOfCare.managingOrganization;
																								objectEpisodeOfCare.period = episodeOfCare.period;
																								objectEpisodeOfCare.referralRequest = referralRequest.data;
																								objectEpisodeOfCare.careManager = episodeOfCare.careManager;

																								newEpisodeOfCare[index] = objectEpisodeOfCare
																								
																								myEmitter.prependOnceListener("getTeam", function (episodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare) {
																									qString = {};
																									qString.episode_of_care_id = episodeOfCare.id;
																									seedPhoenixFHIR.path.GET = {
																										"EpisodeOfCareTeam": {
																											"location": "%(apikey)s/EpisodeOfCareTeam",
																											"query": qString
																										}
																									}
																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																									ApiFHIR.get('EpisodeOfCareTeam', {
																										"apikey": apikey
																									}, {}, function (error, response, body) {
																										team = JSON.parse(body);
																										if (team.err_code == 0) {
																											var objectEpisodeOfCare = {};
																											objectEpisodeOfCare.resourceType = episodeOfCare.resourceType;
																											objectEpisodeOfCare.id = episodeOfCare.id;
																											objectEpisodeOfCare.identifier = identifier.data;
																											objectEpisodeOfCare.status = episodeOfCare.status;
																											objectEpisodeOfCare.statusHistory = statusHistory.data;
																											objectEpisodeOfCare.type = episodeOfCare.type;
																											objectEpisodeOfCare.diagnosis = diagnosis.data;
																											objectEpisodeOfCare.patient = episodeOfCare.patient;
																											objectEpisodeOfCare.managingOrganization = episodeOfCare.managingOrganization;
																											objectEpisodeOfCare.period = episodeOfCare.period;
																											objectEpisodeOfCare.referralRequest = referralRequest.data;
																											objectEpisodeOfCare.careManager = episodeOfCare.careManager;
																											objectEpisodeOfCare.team = team.data;

																											newEpisodeOfCare[index] = objectEpisodeOfCare
																											
																											myEmitter.prependOnceListener("getAccount", function (episodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare) {
																												qString = {};
																												qString.episode_of_care_id = episodeOfCare.id;
																												seedPhoenixFHIR.path.GET = {
																													"EpisodeOfCareAccount": {
																														"location": "%(apikey)s/EpisodeOfCareAccount",
																														"query": qString
																													}
																												}
																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																												ApiFHIR.get('EpisodeOfCareAccount', {
																													"apikey": apikey
																												}, {}, function (error, response, body) {
																													account = JSON.parse(body);
																													if (account.err_code == 0) {
																														var objectEpisodeOfCare = {};
																														objectEpisodeOfCare.resourceType = episodeOfCare.resourceType;
																														objectEpisodeOfCare.id = episodeOfCare.id;
																														objectEpisodeOfCare.identifier = identifier.data;
																														objectEpisodeOfCare.status = episodeOfCare.status;
																														objectEpisodeOfCare.statusHistory = statusHistory.data;
																														objectEpisodeOfCare.type = episodeOfCare.type;
																														objectEpisodeOfCare.diagnosis = diagnosis.data;
																														objectEpisodeOfCare.patient = episodeOfCare.patient;
																														objectEpisodeOfCare.managingOrganization = episodeOfCare.managingOrganization;
																														objectEpisodeOfCare.period = episodeOfCare.period;
																														objectEpisodeOfCare.referralRequest = referralRequest.data;
																														objectEpisodeOfCare.careManager = episodeOfCare.careManager;
																														objectEpisodeOfCare.team = team.data;
																														objectEpisodeOfCare.account = account.data;

																														newEpisodeOfCare[index] = objectEpisodeOfCare

																														if (index == countEpisodeOfCare - 1) {
																															res.json({
																																"err_code": 0,
																																"data": newEpisodeOfCare
																															});
																														}
																													} else {
																														res.json(account);
																													}
																												})
																											})
																											myEmitter.emit('getAccount', objectEpisodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare);
																										} else {
																											res.json(team);
																										}
																									})
																								})
																								myEmitter.emit('getTeam', objectEpisodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare);
																							} else {
																								res.json(referralRequest);
																							}
																						})
																					})
																					myEmitter.emit('getReferralRequest', objectEpisodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare);
                                        } else {
                                          res.json(diagnosis);
                                        }
                                      })
                                    })
                                    myEmitter.emit('getDiagnosis', objectEpisodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare);
                                } else {
                                  res.json(statusHistory);
                                }
                              })
                            })
                            myEmitter.emit('getStatusHistory', objectEpisodeOfCare, index, newEpisodeOfCare, countEpisodeOfCare);
                        } else {
                          res.json(identifier);
                        }
                      })
                    })
                    myEmitter.emit("getIdentifier", episodeOfCare.data[i], i, newEpisodeOfCare, episodeOfCare.data.length);
                  }
                } else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Episode of care is empty."
                  });
                }
              } else {
                res.json(person);
              }
            }
          });
        } else {
          result.err_code = 500;
          res.json(result);
        }
      });
    },
    identifier: function getIdentifier(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var episodeOfCareId = req.params.episode_of_care_id;
      var identifierValue = req.params.identifier_value;

      checkApikey(apikey, ipAddres, function (result) {
        if (result.err_code == 0) {
          checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareID) {
            if (resEpisodeOfCareID.err_code > 0) {
              if (typeof identifierValue !== 'undefined' && !validator.isEmpty(identifierValue)) {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierID) {
                  if (resIdentifierID.err_code > 0) {
                    //get identifier
                    qString = {};
                    qString.episode_of_care_id = episodeOfCareId;
                    qString.identifier_value = identifierValue;
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
                        res.json({
                          "err_code": 0,
                          "data": identifier.data
                        });
                      } else {
                        res.json(identifier);
                      }
                    })
                  } else {
                    res.json({
                      "err_code": 502,
                      "err_msg": "Identifier Id not found"
                    });
                  }
                })
              } else {
                //get identifier
                qString = {};
                qString.episode_of_care_id = episodeOfCareId;
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
                    res.json({
                      "err_code": 0,
                      "data": identifier.data
                    });
                  } else {
                    res.json(identifier);
                  }
                })
              }
            } else {
              res.json({
                "err_code": 501,
                "err_msg": "Episode of care Id not found"
              });
            }
          })
        } else {
          result.err_code = 500;
          res.json(result);
        }
      });
    },
    statusHistory: function getStatusHistory(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var episodeOfCareId = req.params.episode_of_care_id;
      var episodeOfCareStatusHistoryId = req.params.episode_of_care_status_history_id;

      checkApikey(apikey, ipAddres, function (result) {
        if (result.err_code == 0) {
          checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareID) {
            if (resEpisodeOfCareID.err_code > 0) {
              if (typeof episodeOfCareStatusHistoryId !== 'undefined' && !validator.isEmpty(episodeOfCareStatusHistoryId)) {
                checkUniqeValue(apikey, "EPISODE_OF_CARE_STATUS_HISTORY_ID|" + episodeOfCareStatusHistoryId, 'EPISODE_OF_CARE_STATUS_HISTORY', function (resEpisodeOfCareStatusHistoryID) {
                  if (resEpisodeOfCareStatusHistoryID.err_code > 0) {
                    //get statusHistory
                    qString = {};
                    qString.episode_of_care_id = episodeOfCareId;
                    qString._id = episodeOfCareStatusHistoryId;
                    seedPhoenixFHIR.path.GET = {
                      "statusHistory": {
                        "location": "%(apikey)s/statusHistory",
                        "query": qString
                      }
                    }
                    var ApiFHIR = new Apiclient(seedPhoenixFHIR);

                    ApiFHIR.get('statusHistory', {
                      "apikey": apikey
                    }, {}, function (error, response, body) {
                      var statusHistory = JSON.parse(body);
                      if (statusHistory.err_code == 0) {
                        res.json({
                          "err_code": 0,
                          "data": statusHistory.data
                        });
                      } else {
                        res.json(statusHistory);
                      }
                    })
                  } else {
                    res.json({
                      "err_code": 502,
                      "err_msg": "Episode of care history id not found"
                    });
                  }
                })
              } else {
                //get episode of care
                qString = {};
                qString.episode_of_care_id = episodeOfCareId;
                seedPhoenixFHIR.path.GET = {
                  "statusHistory": {
                    "location": "%(apikey)s/statusHistory",
                    "query": qString
                  }
                }
                var ApiFHIR = new Apiclient(seedPhoenixFHIR);

                ApiFHIR.get('statusHistory', {
                  "apikey": apikey
                }, {}, function (error, response, body) {
                  var statusHistory = JSON.parse(body);
                  if (statusHistory.err_code == 0) {
                    res.json({
                      "err_code": 0,
                      "data": statusHistory.data
                    });
                  } else {
                    res.json(statusHistory);
                  }
                })
              }
            } else {
              res.json({
                "err_code": 501,
                "err_msg": "Episode of care Id not found"
              });
            }
          })
        } else {
          result.err_code = 500;
          res.json(result);
        }
      });
    },
    diagnosis: function addDiagnosis(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var episodeOfCareId = req.params.episode_of_care_id;
      //var diagnosisId = req.params.episode_of_care_diagnosis_id;
      var conditionId = req.params.condition_id;

      checkApikey(apikey, ipAddres, function (result) {
        if (result.err_code == 0) {
          checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareID) {
            if (resEpisodeOfCareID.err_code > 0) {
              if (typeof conditionId !== 'undefined' && !validator.isEmpty(conditionId)) {
                checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'EPISODE_OF_CARE_DIAGNOSIS', function (resDiagnosisID) {
                  if (resDiagnosisID.err_code > 0) {
                    //get diagnosis
                    qString = {};
                    qString.episode_of_care_id = episodeOfCareId;
                    qString.condition_id = conditionId;
                    seedPhoenixFHIR.path.GET = {
                      "Diagnosis": {
                        "location": "%(apikey)s/Diagnosis",
                        "query": qString
                      }
                    }
                    var ApiFHIR = new Apiclient(seedPhoenixFHIR);

                    ApiFHIR.get('Diagnosis', {
                      "apikey": apikey
                    }, {}, function (error, response, body) {
                      diagnosis = JSON.parse(body);
                      if (diagnosis.err_code == 0) {
                        res.json({
                          "err_code": 0,
                          "data": diagnosis.data
                        });
                      } else {
                        res.json(diagnosis);
                      }
                    })
                  } else {
                    res.json({
                      "err_code": 502,
                      "err_msg": "Condition Id not found"
                    });
                  }
                })
              } else {
                //get diagnosis
                qString = {};
                qString.episode_of_care_id = episodeOfCareId;
                seedPhoenixFHIR.path.GET = {
                  "Diagnosis": {
                    "location": "%(apikey)s/Diagnosis",
                    "query": qString
                  }
                }
                var ApiFHIR = new Apiclient(seedPhoenixFHIR);

                ApiFHIR.get('Diagnosis', {
                  "apikey": apikey
                }, {}, function (error, response, body) {
                  diagnosis = JSON.parse(body);
                  if (diagnosis.err_code == 0) {
                    res.json({
                      "err_code": 0,
                      "data": diagnosis.data
                    });
                  } else {
                    res.json(diagnosis);
                  }
                })
              }
            } else {
              res.json({
                "err_code": 501,
                "err_msg": "Episode of care Id not found"
              });
            }
          })
        } else {
          result.err_code = 500;
          res.json(result);
        }
      });
    }
  },
  post: {
    episodeOfCare: function addEpisodeOfCare(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

      var err_code = 0;
      var err_msg = "";

      //input check
      //identifier use
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
      //identifier type
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
      //identifier value
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
      //identifier period
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
      //status
      if (typeof req.body.status !== 'undefined') {
        var statusCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(statusCode)) {
          err_code = 2;
          err_msg = "Status is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'episode of care status' in json request.";
      }
      //statusHistory status
      if (typeof req.body.statusHistory.status !== 'undefined') {
        var statusHistoryStatusCode = req.body.statusHistory.status.trim().toLowerCase();
        if (validator.isEmpty(statusHistoryStatusCode)) {
          err_code = 2;
          err_msg = "Status history is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'status history' in json request.";
      }
      //statusHistory period
      if (typeof req.body.statusHistory.period !== 'undefined') {
        var statusHistoryPeriod = req.body.statusHistory.period;
        if (statusHistoryPeriod.indexOf("to") > 0) {
          arrHistoryPeriod = statusHistoryPeriod.split("to");
          statusHistoryPeriodStart = arrHistoryPeriod[0];
          statusHistoryPeriodEnd = arrHistoryPeriod[1];
          if (!regex.test(statusHistoryPeriodStart) && !regex.test(statusHistoryPeriodEnd)) {
            err_code = 2;
            err_msg = "statusHistory Period invalid date format.";
          }
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'statusHistoryPeriod' in json request.";
      }
      //type
      if (typeof req.body.type !== 'undefined') {
        var typeCode = req.body.type.trim().toLowerCase();
        if (validator.isEmpty(typeCode)) {
          typeCode = "";
        }
      } else {
        typeCode = "";
      }
      //diagnosis condition
      if (typeof req.body.diagnosis.condition !== 'undefined') {
        var diagnosisConditionId = req.body.diagnosis.condition.trim().toLowerCase();
        if (validator.isEmpty(diagnosisConditionId)) {
          err_code = 2;
          err_msg = "Diagnosis condition id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'condition' in json identifier request.";
      }
      //diagnosis role
      if (typeof req.body.diagnosis.role !== 'undefined') {
        var diagnosisRoleCode = req.body.diagnosis.role.trim().toLowerCase();
        if (validator.isEmpty(diagnosisRoleCode)) {
          diagnosisRoleCode = "";
        }
      } else {
        diagnosisRoleCode = "";
      }
      //diagnosis rank
      if (typeof req.body.diagnosis.rank !== 'undefined' && req.body.diagnosis.rank !== "") {
        var diagnosisRank = req.body.diagnosis.rank;
        if (!validator.isInt(diagnosisRank)) {
          err_code = 2;
          err_msg = "Diagnosis rank is required and must be number.";
        }
      } else {
        diagnosisRank = "";
      }
      //patient
      if (typeof req.body.patient !== 'undefined') {
        var patientId = req.body.patient.trim().toLowerCase();
        if (validator.isEmpty(patientId)) {
          err_code = 2;
          err_msg = "Patient Id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'patient id' in json request.";
      }
      //managingOrganization
      if (typeof req.body.managingOrganization !== 'undefined') {
        var managingOrganizationId = req.body.managingOrganization.trim().toLowerCase();
        if (validator.isEmpty(managingOrganizationId)) {
          managingOrganizationId = "";
        }
      } else {
        managingOrganizationId = "";
      }
      //period
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          periodStart = arrPeriod[0];
          periodEnd = arrPeriod[1];
          if (!regex.test(periodStart) && !regex.test(periodEnd)) {
            err_code = 2;
            err_msg = "Period invalid date format.";
          }
        }
      } else {
        periodStart = "";
				periodEnd = "";
      }
      //encounter id
      if (typeof req.body.encounter !== 'undefined') {
        var encounterId = req.body.encounter;
        if (validator.isEmpty(encounterId)) {
          encounterId = "";
        }
      } else {
				encounterId = "";
			}
      // care manager
      if (typeof req.body.careManager !== 'undefined') {
        var careManagerId = req.body.careManager;
        if (validator.isEmpty(careManagerId)) {
          careManagerId = "";
        }
      } else {
				careManagerId = "";
			}
      
      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function (resUseCode) {
              if (resUseCode.err_code > 0) { //code > 0 => data valid
                checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function (resUseTypeCode) {
                  if (resUseTypeCode.err_code > 0) { //code > 0 => data valid
                    checkCode(apikey, statusCode, 'EPISODE_OF_CARE_STATUS', function (resStatusCode) {
                      if (resStatusCode.err_code > 0) { //code > 0 => data valid
                        checkCode(apikey, statusHistoryStatusCode, 'EPISODE_OF_CARE_STATUS', function (resHistoryStatusCode) {
                          if (resHistoryStatusCode.err_code > 0) { //code > 0 => data valid
														/*checkCode(apikey, diagnosisRoleCode, 'DIAGNOSIS_ROLE', function (resDiagnosisRoleCode) {
															if (resDiagnosisRoleCode.err_code > 0) { //code > 0 => data valid*/ //diagnosis role diganti diagnosis condition klo sudah ada
																checkUniqeValue(apikey, "PATIENT_ID|" + patientId, 'PATIENT', function (resPatientId) {
																	if (resPatientId.err_code > 0) {
																		myEmitter.once('checkIdentifierValue', function () {
																			checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resUniqeValue) {
																				if (resUniqeValue.err_code == 0) { //code = 0 => data bisa dipakai
																					//set uniqe id
																					var identifierId = 'ide' + uniqid.time();
																					var episodeOfCareId = 'eoc' + uniqid.time();
																					var episodeOfCareStatusHistoryId = 'sh' + uniqid.time();
																					var diagnosisId = 'dia' + uniqid.time();

																					//identifier
																					dataIdentifier = {
																						"id": identifierId,
																						"use": identifierUseCode,
																						"type": identifierTypeCode,
																						"system": identifierId,
																						"value": identifierValue,
																						"period_start": identifierPeriodStart,
																						"period_end": identifierPeriodEnd,
																						"episode_of_care_id": episodeOfCareId
																					}

																					ApiFHIR.post('identifier', {
																						"apikey": apikey
																					}, {
																						body: dataIdentifier,
																						json: true
																					}, function (error, response, body) {
																						identifier = body;
																						console.log(identifier)
																						if (identifier.err_code > 0) {
																							res.json(identifier);
																						}
																					})
																					//data episode of care
																					dataEpisodeOfCare = {
																						"episode_of_care_id": episodeOfCareId,
																						"episode_of_care_status": statusCode,
																						"episode_of_care_type": typeCode,
																						"patient_id": patientId,
																						"organization_id": managingOrganizationId,
																						"episode_of_care_period_start": periodStart,
																						"episode_of_care_period_end": periodEnd,
																						"practitioner_id": careManagerId,
																						"encounter_id": encounterId
																					}
																					ApiFHIR.post('episodeOfCare', {
																						"apikey": apikey
																					}, {
																						body: dataEpisodeOfCare,
																						json: true
																					}, function (error, response, body) {
																						var episodeOfCare = body;
																						console.log(episodeOfCare)
																						if (episodeOfCare.err_code > 0) {
																							res.json(episodeOfCare);
																						}
																					})
																					//data episode of care history
																					dataStatusHistory = {
																						"episode_of_care_status_history_id": episodeOfCareStatusHistoryId,
																						"episode_of_care_status_history_code": statusHistoryStatusCode,
																						"episode_of_care_status_history_period_start": statusHistoryPeriodStart,
																						"episode_of_care_status_history_period_end": statusHistoryPeriodEnd,
																						"episode_of_care_id": episodeOfCareId
																					}
																					ApiFHIR.post('episodeOfCareHistory', {
																						"apikey": apikey
																					}, {
																						body: dataStatusHistory,
																						json: true
																					}, function (error, response, body) {
																						var statusHistory = body;
																						console.log(statusHistory)
																						if (statusHistory.err_code > 0) {
																							res.json(statusHistory);
																						}
																					})
																					//data episode_of_care_diagnosis
																					dataDiagnosis = {
																						"episode_of_care_diagnosis_id": diagnosisId,
																						"episode_of_care_diagnosis_role": diagnosisRoleCode,
																						"episode_of_care_diagnosis_rank": diagnosisRank,
																						"condition_id": diagnosisConditionId,
																						"episode_of_care_id": episodeOfCareId
																					}
																					ApiFHIR.post('episodeOfCareDiagnosis', {
																						"apikey": apikey
																					}, {
																						body: dataDiagnosis,
																						json: true
																					}, function (error, response, body) {
																						var diagnosis = body;
																						console.log(diagnosis)
																						if (diagnosis.err_code > 0) {
																							res.json(diagnosis);
																						}
																					})
																					res.json({
																						"err_code": 0,
																						"err_msg": "Episode Of Care has been add.",
																						"data": [{
																								"id": episodeOfCareId
																							}
																						]
																					})
																				} else {
																					res.json({
																						"err_code": "514",
																						"err_msg": "Identifier value already exist."
																					});
																				}
																			})
																		})
																		//encounter id
																		myEmitter.prependOnceListener('checkEncounter', function () {
																			if (!validator.isEmpty(encounterId)) {
																				checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterId) {
																					if (resEncounterId.err_code > 0) {
																						myEmitter.emit('checkIdentifierValue');
																					} else {
																						res.json({
																							"err_code": "513",
																							"err_msg": "Encounter id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkIdentifierValue');
																			}
																		})
																		//careManager
																		myEmitter.prependOnceListener('checkCareManager', function () {
																			if (!validator.isEmpty(careManagerId)) {
																				checkUniqeValue(apikey, "PRACTITIONER_ID|" + careManagerId, 'PRACTITIONER', function (resCareMan) {
																					if (resCareMan.err_code > 0) {
																						myEmitter.emit('checkEncounter');
																					} else {
																						res.json({
																							"err_code": "509",
																							"err_msg": "Care Manager id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkEncounter');
																			}
																		})
																		//managingOrganizationId
																		myEmitter.prependOnceListener('checkManOrg', function () {
																			if (!validator.isEmpty(managingOrganizationId)) {
																				checkUniqeValue(apikey, "ORGANIZATION_ID|" + managingOrganizationId, 'ORGANIZATION', function (resOrganizationId) {
																					if (resOrganizationId.err_code > 0) {
																						myEmitter.emit('checkCareManager');
																					} else {
																						res.json({
																							"err_code": "508",
																							"err_msg": "Organization id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkCareManager');
																			}
																		})
																		//diagnosisRoleCode
																		myEmitter.prependOnceListener('checkDiagnosisRole', function () {
																			if (!validator.isEmpty(diagnosisRoleCode)) {
																				checkCode(apikey, diagnosisRoleCode, 'DIAGNOSIS_ROLE', function (resDiagnosisRoleCode) {
																					if (resDiagnosisRoleCode.err_code > 0) {
																						myEmitter.emit('checkManOrg');
																					} else {
																						res.json({
																							"err_code": "507",
																							"err_msg": "Diagnosis role code not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkManOrg');
																			}
																		})
																		//typeCode
																		if (!validator.isEmpty(typeCode)) {
																			checkCode(apikey, typeCode, 'EPISODE_OF_CARE_TYPE', function (resTypeCode) {
																				if (resTypeCode.err_code > 0) {
																					myEmitter.emit('checkDiagnosisRole');
																				} else {
																					res.json({
																						"err_code": "506",
																						"err_msg": "Type code not found"
																					});
																				}
																			})
																		} else {
																			myEmitter.emit('checkDiagnosisRole');
																		}
																	} else {
																		res.json({
																			"err_code": "505",
																			"err_msg": "Patient Id is not found."
																		});
																	}
																})
															/*} else {
																res.json({
																	"err_code": "506",
																	"err_msg": "Diagnosis condition id not found"
																});
															}
														})*/
                          } else {
                            res.json({
                              "err_code": "504",
                              "err_msg": "History status code not found"
                            });
                          }
                        })
                      } else {
                        res.json({
                          "err_code": "503",
                          "err_msg": "Status code not found"
                        });
                      }
                    })
                  } else {
                    res.json({
                      "err_code": "502",
                      "err_msg": "Identifier type code not found"
                    });
                  }
                })
              } else {
                res.json({
                  "err_code": "501",
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
    identifier: function addIdentifier(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var episodeOfCareId = req.params.episode_of_care_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof episodeOfCareId !== 'undefined') {
        if (validator.isEmpty(episodeOfCareId)) {
          err_code = 2;
          err_msg = "Epiosde of care id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Episode of care id is required";
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
                        checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareID) {
                          if (resEpisodeOfCareID.err_code > 0) {
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
                              "episode_of_care_id": episodeOfCareId
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
                                  "err_msg": "Identifier has been add in this episode of care.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "Episode of care Id not found"
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
    statusHistory: function addStatusHistory(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var episodeOfCareId = req.params.episode_of_care_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof episodeOfCareId !== 'undefined') {
        if (validator.isEmpty(episodeOfCareId)) {
          err_code = 2;
          err_msg = "Epiosde of care id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Episode of care id is required";
      }
      //status history
      if (typeof req.body.status !== 'undefined') {
        var statusCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(statusCode)) {
          err_code = 2;
          err_msg = "Status history is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'status history' in json identifier request.";
      }
      //statusHistory period
      if (typeof req.body.period !== 'undefined') {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrHistoryPeriod = period.split("to");
          statusHistoryPeriodStart = arrHistoryPeriod[0];
          statusHistoryPeriodEnd = arrHistoryPeriod[1];
          if (!regex.test(statusHistoryPeriodStart) && !regex.test(statusHistoryPeriodEnd)) {
            err_code = 2;
            err_msg = "statusHistory Period invalid date format.";
          }
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'statusHistoryPeriod' in json request.";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkCode(apikey, statusCode, 'EPISODE_OF_CARE_STATUS', function (resStatusCode) {
              if (resStatusCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareID) {
                  if (resEpisodeOfCareID.err_code > 0) {

                    var episodeOfCareStatusHistoryId = 'sh' + uniqid.time();

                    dataStatusHistory = {
                      "episode_of_care_status_history_id": episodeOfCareStatusHistoryId,
                      "episode_of_care_status_history_code": statusCode,
                      "episode_of_care_status_history_period_start": statusHistoryPeriodStart,
                      "episode_of_care_status_history_period_end": statusHistoryPeriodEnd,
                      "episode_of_care_id": episodeOfCareId
                    }
                    ApiFHIR.post('episodeOfCareHistory', {
                      "apikey": apikey
                    }, {
                      body: dataStatusHistory,
                      json: true
                    }, function (error, response, body) {
                      var statusHistory = body;
                      if (statusHistory.err_code == 0) {
                        res.json({
                          "err_code": 0,
                          "err_msg": "Status history has been add in this episode of care.",
                          "data": statusHistory.data
                        });
                      } else {
                        res.json(statusHistory);
                      }
                    })

                  } else {
                    res.json({
                      "err_code": 503,
                      "err_msg": "Episode of care Id not found"
                    });
                  }
                })
              } else {
                res.json({
                  "err_code": 501,
                  "err_msg": "Status code not found"
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
    diagnosis: function addDiagnosis(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var episodeOfCareId = req.params.episode_of_care_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof episodeOfCareId !== 'undefined') {
        if (validator.isEmpty(episodeOfCareId)) {
          err_code = 2;
          err_msg = "Epiosde of care id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Episode of care id is required";
      }
      //condition
      if (typeof req.body.condition !== 'undefined') {
        var diagnosisConditionId = req.body.condition.trim().toLowerCase();
        if (validator.isEmpty(diagnosisConditionId)) {
          err_code = 2;
          err_msg = "Diagnosis condition id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'condition' in json identifier request.";
      }
      //diagnosis role
      if (typeof req.body.role !== 'undefined') {
        var diagnosisRoleCode = req.body.role.trim().toLowerCase();
        if (validator.isEmpty(diagnosisRoleCode)) {
          diagnosisRoleCode = "";
        }
      } else {
        diagnosisRoleCode = "";
      }
      //rank
      if (typeof req.body.rank !== 'undefined' && req.body.rank !== "") {
        var diagnosisRank = req.body.rank;
        if (!validator.isInt(diagnosisRank)) {
          err_code = 2;
          err_msg = "Diagnosis rank is required and must be number.";
        }
      } else {
        diagnosisRank = "";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkCode(apikey, diagnosisRoleCode, 'DIAGNOSIS_ROLE', function (resDiagnosisRoleCode) {
              if (resDiagnosisRoleCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareID) {
                  if (resEpisodeOfCareID.err_code > 0) {

                    var diagnosisId = 'dia' + uniqid.time();

                    dataDiagnosis = {
                      "episode_of_care_diagnosis_id": diagnosisId,
                      "episode_of_care_diagnosis_role": diagnosisRoleCode,
                      "episode_of_care_diagnosis_rank": diagnosisRank,
                      "condition_id": diagnosisConditionId,
                      "episode_of_care_id": episodeOfCareId
                    }
                    ApiFHIR.post('episodeOfCareDiagnosis', {
                      "apikey": apikey
                    }, {
                      body: dataDiagnosis,
                      json: true
                    }, function (error, response, body) {
                      var diagnosis = body;
                      if (diagnosis.err_code == 0) {
                        res.json({
                          "err_code": 0,
                          "err_msg": "Diagnosis has been add in this episode of care.",
                          "data": diagnosis.data
                        });
                      } else {
                        res.json(diagnosis);
                      }
                    })
                  } else {
                    res.json({
                      "err_code": 503,
                      "err_msg": "Episode of care Id not found"
                    });
                  }
                })
              } else {
                res.json({
                  "err_code": 501,
                  "err_msg": "Diagnosis role code not found"
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
  put: {
    episodeOfCare: function updateEpisodeOfCare(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      //var encounterId = req.params.encounter_id;
      var episodeOfCareId = req.params.episode_of_care_id;

      var err_code = 0;
      var err_msg = "";
      var dataEpisodeOfCare = {};

      if (typeof episodeOfCareId !== 'undefined') {
        if (validator.isEmpty(episodeOfCareId)) {
          err_code = 2;
          err_msg = "Episode Of Care Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Episode Of Care Id is required.";
      }
      if (typeof req.body.status !== 'undefined') {
        var statusCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(statusCode)) {
          err_code = 2;
          err_msg = "Status is required";
        } else {
          dataEpisodeOfCare.status = statusCode;
        }
      } else {
				statusCode = "";
			}
      if (typeof req.body.type !== 'undefined') {
        var typeCode = req.body.type.trim().toLowerCase();
        if (validator.isEmpty(typeCode)) {
          err_code = 2;
          err_msg = "Type is required";
        } else {
          dataEpisodeOfCare.type = typeCode;
        }
      } else {
				typeCode = "";
			}
      if (typeof req.body.patient !== 'undefined') {
        var patientId = req.body.patient.trim().toLowerCase();
        if (validator.isEmpty(patientId)) {
          err_code = 2;
          err_msg = "Patient Id is required";
        } else {
          dataEpisodeOfCare.patient = patientId;
        }
      } else {
				patientId = "";
			}
			if (typeof req.body.managingOrganization !== 'undefined') {
        var orgId = req.body.managingOrganization.trim().toLowerCase();
        if (validator.isEmpty(orgId)) {
          err_code = 2;
          err_msg = "organization Id is required";
        } else {
          dataEpisodeOfCare.organization = orgId;
        }
      } else {
				orgId = "";
			}
      if (typeof req.body.period !== 'undefined') {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          periodStart = arrPeriod[0];
          periodEnd = arrPeriod[1];
          if (!regex.test(periodStart) && !regex.test(periodEnd)) {
            err_code = 2;
            err_msg = "Period invalid date format.";
          } else {
            dataEpisodeOfCare.period_start = periodStart;
            dataEpisodeOfCare.period_end = periodEnd;
          }
        } else {
          err_code = 1;
          err_msg = "Period request format is wrong, `ex: start to end` ";
        }
      } else {
				periodStart = "";
				periodEnd ="";
			}
      if (typeof req.body.careManager !== 'undefined') {
        var careManagerId = req.body.careManager;
				if (validator.isEmpty(careManagerId)) {
          err_code = 2;
          err_msg = "Care Manager Id is required";
        } else {
          dataEpisodeOfCare.practitioner = careManagerId;
        }
      } else {
				careManagerId = "";
			}
			
      if (err_code == 0) {
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareId) {
								if (resEpisodeOfCareId.err_code > 0) {
									ApiFHIR.put('episodeOfCare', {
										"apikey": apikey,
										"_id": episodeOfCareId
									}, {
										body: dataEpisodeOfCare,
										json: true
									}, function (error, response, body) {
										episodeOfCare = body;
										if (episodeOfCare.err_code > 0) {
											res.json(episodeOfCare);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Episode of care has been updated.",
												"data": episodeOfCare.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 506,
										"err_msg": "Episode of care Id not found"
									});
								}
							})
						})
						myEmitter.prependOnceListener('checkCareManager', function () {
							if (validator.isEmpty(careManagerId)) {
								myEmitter.emit('checkId');
							} else {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + careManagerId, 'PRACTITIONER', function (resCareManagerId) {
									if (resCareManagerId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkId');
									} else {
										res.json({
											"err_code": 505,
											"err_msg": "Practitioner Id not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkPatient', function () {
							if (validator.isEmpty(patientId)) {
								myEmitter.emit('checkCareManager');
							} else {
								checkUniqeValue(apikey, "PATIENT_ID|" + patientId, 'PATIENT', function (resPatientId) {
									if (resPatientId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkCareManager');
									} else {
										res.json({
											"err_code": 504,
											"err_msg": "Patient Id not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkOrg', function () {
							if (validator.isEmpty(orgId)) {
								myEmitter.emit('checkPatient');
							} else {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + orgId, 'ORGANIZATION', function (resOrgId) {
									if (resOrgId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkPatient');
									} else {
										res.json({
											"err_code": 503,
											"err_msg": "Organization id not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkType', function () {
							if (validator.isEmpty(typeCode)) {
								myEmitter.emit('checkOrg');
							} else {
								checkCode(apikey, typeCode, 'EPISODE_OF_CARE_TYPE', function (resTypeCode) {
									if (resTypeCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkOrg');
									} else {
										res.json({
											"err_code": 502,
											"err_msg": "Type code not found"
										});
									}
								})
							}
						})
						if (validator.isEmpty(statusCode)) {
							myEmitter.emit('checkType');
						} else {
							checkCode(apikey, statusCode, 'EPISODE_OF_CARE_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkType');
								} else {
									res.json({
										"err_code": 501,
										"err_msg": "Status code not found"
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
      var episodeOfCareId = req.params.episode_of_care_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof episodeOfCareId !== 'undefined') {
        if (validator.isEmpty(episodeOfCareId)) {
          err_code = 2;
          err_msg = "Episode of care id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Episode of care id is required";
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
            myEmitter.once('checkEpisodeOfCareID', function () {
              checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareID) {
                if (resEpisodeOfCareID.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "EPISODE_OF_CARE_ID|" + episodeOfCareId
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
                myEmitter.emit('checkEpisodeOfCareID');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkEpisodeOfCareID');
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
    statusHistory: function updateStatusHistory(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var episodeOfCareId = req.params.episode_of_care_id;
      var statusHistoryId = req.params.status_history_id;

      var err_code = 0;
      var err_msg = "";
      var dataStatusHistory = {};
			
			if (typeof episodeOfCareId !== 'undefined') {
        if (validator.isEmpty(episodeOfCareId)) {
          err_code = 2;
          err_msg = "Episode Of Care Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Episode Of Care Id is required.";
      }
			if (typeof statusHistoryId !== 'undefined') {
        if (validator.isEmpty(statusHistoryId)) {
          err_code = 2;
          err_msg = "Status history id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Status history id is required";
      }
			if (typeof req.body.status !== 'undefined') {
        var statusHistoryCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(statusHistoryCode)) {
          err_code = 2;
          err_msg = "Status History code is empty";
        } else {
          dataStatusHistory.status = statusHistoryCode;
        }
      } else {
        statusHistoryCode = "";
      }
      if (typeof req.body.period !== 'undefined') {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          periodStart = arrPeriod[0];
          periodEnd = arrPeriod[1];
          if (!regex.test(periodStart) && !regex.test(periodEnd)) {
            err_code = 2;
            err_msg = "Period invalid date format.";
          } else {
            dataStatusHistory.period_start = periodStart;
            dataStatusHistory.period_end = periodEnd;
          }
        } else {
          err_code = 1;
          err_msg = "Period request format is wrong, `ex: start to end` ";
        }
      } else {
				periodStart = "";
				periodEnd ="";
			}
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						myEmitter.once('checkEpisodeOfCareID', function () {
							checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareID) {
                if (resEpisodeOfCareID.err_code > 0) {
                  checkUniqeValue(apikey, "EPISODE_OF_CARE_STATUS_HISTORY_ID|" + statusHistoryId, 'EPISODE_OF_CARE_STATUS_HISTORY', function (resStatusHistoryID) {
                    if (resStatusHistoryID.err_code > 0) {
                      ApiFHIR.put('episodeOfCareHistory', {
                        "apikey": apikey,
                        "_id": statusHistoryId,
                        "dr": "EPISODE_OF_CARE_ID|" + episodeOfCareId
                      }, {
                        body: dataStatusHistory,
                        json: true
                      }, function (error, response, body) {
                        statusHistory = body;
                        if (statusHistory.err_code > 0) {
                          res.json(statusHistory);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Status History has been update in this episode of care.",
                            "data": statusHistory.data
                          });
                        }
                      })
                    } else {
                      res.json({
                        "err_code": 503,
                        "err_msg": "Status History Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Episode Of Care Id not found"
                  });
                }
              })
						})
						if (validator.isEmpty(statusHistoryCode)) {
              myEmitter.emit('checkEpisodeOfCareID');
            } else {
              checkCode(apikey, statusHistoryCode, 'EPISODE_OF_CARE_STATUS', function (resStatusCode) {
                if (resStatusCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkEpisodeOfCareID');
                } else {
                  res.json({
                    "err_code": 501,
                    "err_msg": "Status History code not found"
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
    diagnosis: function updateDiagnosis(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var episodeOfCareId = req.params.episode_of_care_id;
      var diagnosisId = req.params.diagnosis_id;

      var err_code = 0;
      var err_msg = "";
      var dataDiagnosis = {};
			
			if (typeof episodeOfCareId !== 'undefined') {
        if (validator.isEmpty(episodeOfCareId)) {
          err_code = 2;
          err_msg = "Episode Of Care Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Episode Of Care Id is required.";
      }
			if (typeof diagnosisId !== 'undefined') {
        if (validator.isEmpty(diagnosisId)) {
          err_code = 2;
          err_msg = "Diagnosis id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Diagnosis id is required";
      }
			if (typeof req.body.condition !== 'undefined') {
        var conditionId = req.body.condition.trim().toLowerCase();
        if (validator.isEmpty(conditionId)) {
          err_code = 2;
          err_msg = "Condition Id is empty";
        } else {
          dataDiagnosis.condition = conditionId;
        }
      } else {
        conditionId = "";
      }
			if (typeof req.body.role !== 'undefined') {
        var roleCode = req.body.role.trim().toLowerCase();
        if (validator.isEmpty(roleCode)) {
          err_code = 2;
          err_msg = "Role Code is empty";
        } else {
          dataDiagnosis.role = roleCode;
        }
      } else {
        roleCode = "";
      }
			if (typeof req.body.rank !== 'undefined' && req.body.rank !== "") {
				var diagnosisRank = req.body.rank;
				if (!validator.isInt(diagnosisRank)) {
					err_code = 2;
					err_msg = "Diagnosis rank is required and must be number.";
				} else {
					dataDiagnosis.rank = diagnosisRank;
				}
			} else {
				diagnosisRank = "";
			}
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkEpisodeOfCareID', function () {
							checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareID) {
                if (resEpisodeOfCareID.err_code > 0) {
                  checkUniqeValue(apikey, "EPISODE_OF_CARE_DIAGNOSIS_ID|" + diagnosisId, 'EPISODE_OF_CARE_DIAGNOSIS', function (resDiagnosisID) {
                    if (resDiagnosisID.err_code > 0) {
                      ApiFHIR.put('episodeOfCareDiagnosis', {
                        "apikey": apikey,
                        "_id": diagnosisId,
                        "dr": "EPISODE_OF_CARE_ID|" + episodeOfCareId
                      }, {
                        body: dataDiagnosis,
                        json: true
                      }, function (error, response, body) {
                        diagnosis = body;
                        if (diagnosis.err_code > 0) {
                          res.json(diagnosis);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Diagnosis has been update in this episode of care.",
                            "data": diagnosis.data
                          });
                        }
                      })
                    } else {
                      res.json({
                        "err_code": 503,
                        "err_msg": "Diagnosis Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Episode Of Care Id not found"
                  });
                }
              })
						})
						if (validator.isEmpty(roleCode)) {
              myEmitter.emit('checkEpisodeOfCareID');
            } else {
              checkCode(apikey, roleCode, 'DIAGNOSIS_ROLE', function (resRoleCode) {
                if (resRoleCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkEpisodeOfCareID');
                } else {
                  res.json({
                    "err_code": 501,
                    "err_msg": "Diagnosis Role code not found"
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