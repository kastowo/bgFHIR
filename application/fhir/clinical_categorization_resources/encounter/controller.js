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
    encounter: function getEncounter(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

      var encounterId = req.query._id;
			var appointmentId = req.query.appointment;
			var encounterClass = req.query.encounter_class;
			var encounterDate = req.query.date;
			var diagnosisConditionId = req.query.diagnosis_condition; //-> tabel diagnosis
			var diagnosisProcedureId = req.query.diagnosis_procedure; //-> tabel diagnosis
			var episodeOfCareId = req.query.episode_of_care;
			var identfierValue = req.query.identifier;
			var incomingReferral = req.query.incoming_referral;
			var encounterLength = req.query.length;
			var locationId = req.query.location; //-> tabel location
			var locationPeriod = req.query.location_period; //-> tabel location
			var partOf = req.query.part_of;
			var participantPractitionerId = req.query.participant_practitioner; //-> tabel participant
			var participantRelatedPersonId = req.query.participant_related_person; //-> tabel participant
			var participantType = req.query.participant_type; //-> tabel participant
			var encounterReason = req.query.reason;
			var organizationId = req.query.service_provider;
			var specialArrangement = req.query.special_arrangement; //-> tabel hospitalization
			var encounterStatus = req.query.status;
			var subjectId = req.query.subject;
			var typeId = req.query.type;

      var qString = {};

      if (typeof encounterId !== 'undefined') {
        if (!validator.isEmpty(encounterId)) {
          qString._id = encounterId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Encounter ID is required."
          })
        }
      }
      if (typeof appointmentId !== 'undefined') {
        if (!validator.isEmpty(appointmentId)) {
          qString.appointment = appointmentId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Appointment is empty."
          });
        }
      }
      if (typeof encounterClass !== 'undefined') {
        if (!validator.isEmpty(encounterClass)) {
          qString.encounter_class = encounterClass;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Encounter Class is empty."
          });
        }
      }
      if (typeof encounterDate !== 'undefined') {
        if (!validator.isEmpty(encounterDate)) {
          if (!regex.test(encounterDate)) {
            res.json({
              "err_code": 1,
              "err_msg": "Date invalid format."
            });
          } else {
            qString.date = encounterDate;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Date is empty."
          });
        }
      }
      if (typeof episodeOfCareId !== 'undefined') {
        if (!validator.isEmpty(episodeOfCareId)) {
          qString.episode_of_care = episodeOfCareId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Episode Of Care is empty."
          });
        }
      }
      if (typeof identfierValue !== 'undefined') {
        if (!validator.isEmpty(identfierValue)) {
          qString.identifier = identfierValue;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Identifier is empty."
          });
        }
      }
      if (typeof incomingReferral !== 'undefined') {
        if (!validator.isEmpty(incomingReferral)) {
          qString.incoming_referral = incomingReferral;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Incoming Referral is empty."
          });
        }
      }
      if (typeof encounterLength !== 'undefined') {
        if (!validator.isEmpty(encounterLength)) {
          qString.length = encounterLength;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Length is empty."
          });
        }
      }
      if (typeof partOf !== 'undefined') {
        if (!validator.isEmpty(partOf)) {
          qString.part_of = partOf;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Part Of is empty."
          });
        }
      }
      if (typeof encounterReason !== 'undefined') {
        if (!validator.isEmpty(encounterReason)) {
          qString.reason = encounterReason;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Reason is empty."
          });
        }
      }
			if (typeof subjectId !== 'undefined') {
        if (!validator.isEmpty(subjectId)) {
          qString.subject = subjectId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Subject is empty."
          });
        }
      }
			if (typeof typeId !== 'undefined') {
        if (!validator.isEmpty(typeId)) {
          qString.type = typeId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Type is empty."
          });
        }
      }
			if (typeof diagnosisConditionId !== 'undefined') {
        if (!validator.isEmpty(diagnosisConditionId)) {
          qString.diagnosis_condition = diagnosisConditionId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Diagnosis Condition is empty."
          });
        }
      }
			if (typeof diagnosisProcedureId !== 'undefined') {
        if (!validator.isEmpty(diagnosisProcedureId)) {
          qString.diagnosis_procedure = diagnosisProcedureId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Diagnosis Procedure is empty."
          });
        }
      }
			if (typeof locationId !== 'undefined') {
        if (!validator.isEmpty(locationId)) {
          qString.location = locationId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Location is empty."
          });
        }
      }
			if (typeof locationPeriod !== 'undefined') {
        if (!validator.isEmpty(locationPeriod)) {
          qString.location_period = locationPeriod;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Location Period is empty."
          });
        }
      }
			if (typeof participantPractitionerId !== 'undefined') {
        if (!validator.isEmpty(participantPractitionerId)) {
          qString.participant_practitioner = participantPractitionerId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Participant Practitioner is empty."
          });
        }
      }
			if (typeof participantRelatedPersonId !== 'undefined') {
        if (!validator.isEmpty(participantRelatedPersonId)) {
          qString.participant_related_person = participantRelatedPersonId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Participant Related Person is empty."
          });
        }
      }
			if (typeof participantType !== 'undefined') {
        if (!validator.isEmpty(participantType)) {
          qString.participant_type = participantType;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Participant Type is empty."
          });
        }
      }
			if (typeof specialArrangement !== 'undefined') {
        if (!validator.isEmpty(specialArrangement)) {
          qString.special_arrangement = specialArrangement;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Special Arrangement is empty."
          });
        }
      }
      seedPhoenixFHIR.path.GET = {
        "Encounter": {
          "location": "%(apikey)s/Encounter",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
      checkApikey(apikey, ipAddres, function (result) {
        if (result.err_code == 0) {
          ApiFHIR.get('Encounter', {
            "apikey": apikey
          }, {}, function (error, response, body) {
            if (error) {
              res.json(error);
            } else {
              var encounter = JSON.parse(body); //object
              //cek apakah ada error atau tidak
              if (encounter.err_code == 0) {
                if (encounter.data.length > 0) {
                  newEncounter = [];
                  for (i = 0; i < encounter.data.length; i++) {
                    myEmitter.prependOnceListener("getIdentifier", function (encounter, index, newEncounter, countEncounter) {
                      //get identifier
                      qString = {};
                      qString.encounter_id = encounter.id;
                      qString.identifier_value = identfierValue;
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
                          var objectEncounter = {};
                          objectEncounter.resourceType = encounter.resourceType;
                          objectEncounter.id = encounter.id;
                          objectEncounter.identifier = identifier.data;
                          objectEncounter.status = encounter.status;
                          objectEncounter.encounter_class = encounter.encounter_class;
                          objectEncounter.type = encounter.type;
													objectEncounter.priority = encounter.priority;
													objectEncounter.subject = encounter.subject;
													objectEncounter.appointment = encounter.appointment;
                          objectEncounter.period = encounter.period;
                          objectEncounter.length = encounter.length;
                          objectEncounter.reason = encounter.reason;
                          objectEncounter.serviceProvider = encounter.serviceProvider;
                          objectEncounter.partOf = encounter.partOf;

                          newEncounter[index] = objectEncounter
													
													myEmitter.prependOnceListener("getStatusHistory", function (encounter, index, newEncounter, countEncounter) {
														qString = {};
														qString.encounter_id = encounter.id;
														seedPhoenixFHIR.path.GET = {
															"encounterStatusHistory": {
																"location": "%(apikey)s/encounterStatusHistory",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('encounterStatusHistory', {
															"apikey": apikey
														}, {}, function (error, response, body) {
															statusHistory = JSON.parse(body);
															if (statusHistory.err_code == 0) {
																var objectEncounter = {};
																objectEncounter.resourceType = encounter.resourceType;
																objectEncounter.id = encounter.id;
																objectEncounter.identifier = identifier.data;
																objectEncounter.status = encounter.status;
																objectEncounter.statusHistory = statusHistory.data;
																objectEncounter.encounter_class = encounter.encounter_class;
																objectEncounter.type = encounter.type;
																objectEncounter.priority = encounter.priority;
																objectEncounter.subject = encounter.subject
																objectEncounter.appointment = encounter.appointment;
																objectEncounter.period = encounter.period;
																objectEncounter.length = encounter.length;
																objectEncounter.reason = encounter.reason;
																objectEncounter.serviceProvider = encounter.serviceProvider;
																objectEncounter.partOf = encounter.partOf;

																newEncounter[index] = objectEncounter
																
																myEmitter.prependOnceListener("getClassHistory", function (encounter, index, newEncounter, countEncounter) {
																	qString = {};
																	qString.encounter_id = encounter.id;
																	seedPhoenixFHIR.path.GET = {
																		"encounterClassHistory": {
																			"location": "%(apikey)s/encounterClassHistory",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('encounterClassHistory', {
																		"apikey": apikey
																	}, {}, function (error, response, body) {
																		classHistory = JSON.parse(body);
																		if (classHistory.err_code == 0) {
																			var objectEncounter = {};
																			objectEncounter.resourceType = encounter.resourceType;
																			objectEncounter.id = encounter.id;
																			objectEncounter.identifier = identifier.data;
																			objectEncounter.status = encounter.status;
																			objectEncounter.statusHistory = statusHistory.data;
																			objectEncounter.encounter_class = encounter.encounter_class;
																			objectEncounter.classHistory = classHistory.data;
																			objectEncounter.type = encounter.type;
																			objectEncounter.priority = encounter.priority;
																			objectEncounter.subject = encounter.subject;
																			objectEncounter.appointment = encounter.appointment;
																			objectEncounter.period = encounter.period;
																			objectEncounter.length = encounter.length;
																			objectEncounter.reason = encounter.reason;
																			objectEncounter.serviceProvider = encounter.serviceProvider;
																			objectEncounter.partOf = encounter.partOf;

																			newEncounter[index] = objectEncounter
																			
																			myEmitter.prependOnceListener("getParticipant", function (encounter, index, newEncounter, countEncounter) {
																				qString = {};
																				qString.encounter_id = encounter.id;
																				qString.participant_practitioner = participantPractitionerId;
																				qString.participant_related_person = participantRelatedPersonId;
																				qString.participant_type = participantType;
																				seedPhoenixFHIR.path.GET = {
																					"encounterParticipant": {
																						"location": "%(apikey)s/encounterParticipant",
																						"query": qString
																					}
																				}
																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																				ApiFHIR.get('encounterParticipant', {
																					"apikey": apikey
																				}, {}, function (error, response, body) {
																					participant = JSON.parse(body);
																					if (participant.err_code == 0) {
																						var objectEncounter = {};
																						objectEncounter.resourceType = encounter.resourceType;
																						objectEncounter.id = encounter.id;
																						objectEncounter.identifier = identifier.data;
																						objectEncounter.status = encounter.status;
																						objectEncounter.statusHistory = statusHistory.data;
																						objectEncounter.encounter_class = encounter.encounter_class;
																						objectEncounter.classHistory = classHistory.data;
																						objectEncounter.type = encounter.type;
																						objectEncounter.priority = encounter.priority;
																						objectEncounter.subject = encounter.subject;
																						objectEncounter.participant = participant.data;
																						objectEncounter.appointment = encounter.appointment;
																						objectEncounter.period = encounter.period;
																						objectEncounter.length = encounter.length;
																						objectEncounter.reason = encounter.reason;
																						objectEncounter.serviceProvider = encounter.serviceProvider;
																						objectEncounter.partOf = encounter.partOf;

																						newEncounter[index] = objectEncounter
																						
																						myEmitter.prependOnceListener("getDiagnosis", function (encounter, index, newEncounter, countEncounter) {
																							qString = {};
																							qString.encounter_id = encounter.id;
																							qString.diagnosis_condition = diagnosisConditionId;
																							qString.diagnosis_procedure = diagnosisProcedureId;
																							seedPhoenixFHIR.path.GET = {
																								"encounterDiagnosis": {
																									"location": "%(apikey)s/encounterDiagnosis",
																									"query": qString
																								}
																							}
																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																							ApiFHIR.get('encounterDiagnosis', {
																								"apikey": apikey
																							}, {}, function (error, response, body) {
																								diagnosis = JSON.parse(body);
																								if (diagnosis.err_code == 0) {
																									var objectEncounter = {};
																									objectEncounter.resourceType = encounter.resourceType;
																									objectEncounter.id = encounter.id;
																									objectEncounter.identifier = identifier.data;
																									objectEncounter.status = encounter.status;
																									objectEncounter.statusHistory = statusHistory.data;
																									objectEncounter.encounter_class = encounter.encounter_class;
																									objectEncounter.classHistory = classHistory.data;
																									objectEncounter.type = encounter.type;
																									objectEncounter.priority = encounter.priority;
																									objectEncounter.subject = encounter.subject;
																									objectEncounter.participant = participant.data;
																									objectEncounter.appointment = encounter.appointment;
																									objectEncounter.period = encounter.period;
																									objectEncounter.length = encounter.length;
																									objectEncounter.reason = encounter.reason;
																									objectEncounter.diagnosis = diagnosis.data;
																									objectEncounter.serviceProvider = encounter.serviceProvider;
																									objectEncounter.partOf = encounter.partOf;

																									newEncounter[index] = objectEncounter
																									
																									myEmitter.prependOnceListener("getHospitalization", function (encounter, index, newEncounter, countEncounter) {
																										qString = {};
																										qString.encounter_id = encounter.id;
																										qString.special_arrangement = specialArrangement;
																										seedPhoenixFHIR.path.GET = {
																											"encounterHospitalization": {
																												"location": "%(apikey)s/encounterHospitalization",
																												"query": qString
																											}
																										}
																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																										ApiFHIR.get('encounterHospitalization', {
																											"apikey": apikey
																										}, {}, function (error, response, body) {
																											hospitalization = JSON.parse(body);
																											//console.log(hospitalization)
																											if (hospitalization.err_code == 0) {
																												var objectEncounter = {};
																												objectEncounter.resourceType = encounter.resourceType;
																												objectEncounter.id = encounter.id;
																												objectEncounter.identifier = identifier.data;
																												objectEncounter.status = encounter.status;
																												objectEncounter.statusHistory = statusHistory.data;
																												objectEncounter.encounter_class = encounter.encounter_class;
																												objectEncounter.classHistory = classHistory.data;
																												objectEncounter.type = encounter.type;
																												objectEncounter.priority = encounter.priority;
																												objectEncounter.subject = encounter.subject;
																												objectEncounter.participant = participant.data;
																												objectEncounter.appointment = encounter.appointment;
																												objectEncounter.period = encounter.period;
																												objectEncounter.length = encounter.length;
																												objectEncounter.reason = encounter.reason;
																												objectEncounter.diagnosis = diagnosis.data;
																												objectEncounter.hospitalization = hospitalization.data;
																												objectEncounter.serviceProvider = encounter.serviceProvider;
																												objectEncounter.partOf = encounter.partOf;

																												newEncounter[index] = objectEncounter
																												
																												myEmitter.prependOnceListener("getLocation", function (encounter, index, newEncounter, countEncounter) {
																													qString = {};
																													qString.encounter_id = encounter.id;
																													qString._id = locationId;
																													qString.location_period = locationPeriod;
																													
																													seedPhoenixFHIR.path.GET = {
																														"encounterLocation": {
																															"location": "%(apikey)s/encounterLocation",
																															"query": qString
																														}
																													}
																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																													ApiFHIR.get('encounterLocation', {
																														"apikey": apikey
																													}, {}, function (error, response, body) {
																														location = JSON.parse(body);
																														if (location.err_code == 0) {
																															var objectEncounter = {};
																															objectEncounter.resourceType = encounter.resourceType;
																															objectEncounter.id = encounter.id;
																															objectEncounter.identifier = identifier.data;
																															objectEncounter.status = encounter.status;
																															objectEncounter.statusHistory = statusHistory.data;
																															objectEncounter.encounter_class = encounter.encounter_class;
																															objectEncounter.classHistory = classHistory.data;
																															objectEncounter.type = encounter.type;
																															objectEncounter.priority = encounter.priority;
																															objectEncounter.subject = encounter.subject;
																															objectEncounter.participant = participant.data;
																															objectEncounter.appointment = encounter.appointment;
																															objectEncounter.period = encounter.period;
																															objectEncounter.length = encounter.length;
																															objectEncounter.reason = encounter.reason;
																															objectEncounter.diagnosis = diagnosis.data;
																															objectEncounter.hospitalization = hospitalization.data;
																															objectEncounter.location = location.data;
																															objectEncounter.serviceProvider = encounter.serviceProvider;
																															objectEncounter.partOf = encounter.partOf;

																															newEncounter[index] = objectEncounter
																															myEmitter.prependOnceListener("getEpisodeOfCare", function (encounter, index, newEncounter, countEncounter) {
																																qString = {};
																																qString.encounter_id = encounter.id;
																																qString._id = episodeOfCareId;
																																
																																seedPhoenixFHIR.path.GET = {
																																	"encounterEpisodeOfCare": {
																																		"location": "%(apikey)s/encounterEpisodeOfCare",
																																		"query": qString
																																	}
																																}
																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																ApiFHIR.get('encounterEpisodeOfCare', {
																																	"apikey": apikey
																																}, {}, function (error, response, body) {
																																	episodeOfCare = JSON.parse(body);
																																	if (episodeOfCare.err_code == 0) {
																																		var objectEncounter = {};
																																		objectEncounter.resourceType = encounter.resourceType;
																																		objectEncounter.id = encounter.id;
																																		objectEncounter.identifier = identifier.data;
																																		objectEncounter.status = encounter.status;
																																		objectEncounter.statusHistory = statusHistory.data;
																																		objectEncounter.encounter_class = encounter.encounter_class;
																																		objectEncounter.classHistory = classHistory.data;
																																		objectEncounter.type = encounter.type;
																																		objectEncounter.priority = encounter.priority;
																																		objectEncounter.subject = encounter.subject;
																																		objectEncounter.episodeOfCare = episodeOfCare.data;
																																		objectEncounter.participant = participant.data;
																																		objectEncounter.appointment = encounter.appointment;
																																		objectEncounter.period = encounter.period;
																																		objectEncounter.length = encounter.length;
																																		objectEncounter.reason = encounter.reason;
																																		objectEncounter.diagnosis = diagnosis.data;
																																		objectEncounter.hospitalization = hospitalization.data;
																																		objectEncounter.location = location.data;
																																		objectEncounter.serviceProvider = encounter.serviceProvider;
																																		objectEncounter.partOf = encounter.partOf;

																																		newEncounter[index] = objectEncounter
																																		myEmitter.prependOnceListener("getAccount", function (encounter, index, newEncounter, countEncounter) {
																																			qString = {};
																																			qString.encounter_id = encounter.id;
																																			
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
																																					var objectEncounter = {};
																																					objectEncounter.resourceType = encounter.resourceType;
																																					objectEncounter.id = encounter.id;
																																					objectEncounter.identifier = identifier.data;
																																					objectEncounter.status = encounter.status;
																																					objectEncounter.statusHistory = statusHistory.data;
																																					objectEncounter.encounter_class = encounter.encounter_class;
																																					objectEncounter.classHistory = classHistory.data;
																																					objectEncounter.type = encounter.type;
																																					objectEncounter.priority = encounter.priority;
																																					objectEncounter.subject = encounter.subject;
																																					objectEncounter.episodeOfCare = episodeOfCare.data;
																																					objectEncounter.participant = participant.data;
																																					objectEncounter.appointment = encounter.appointment;
																																					objectEncounter.period = encounter.period;
																																					objectEncounter.length = encounter.length;
																																					objectEncounter.reason = encounter.reason;
																																					objectEncounter.diagnosis = diagnosis.data;
																																					objectEncounter.account = account.data;
																																					objectEncounter.hospitalization = hospitalization.data;
																																					objectEncounter.location = location.data;
																																					objectEncounter.serviceProvider = encounter.serviceProvider;
																																					objectEncounter.partOf = encounter.partOf;

																																					newEncounter[index] = objectEncounter
																																					
																																					myEmitter.prependOnceListener("getReferral", function (encounter, index, newEncounter, countEncounter) {
																																						qString = {};
																																						qString.encounter_id = encounter.id;
																																						
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
																																							incomingReferral = JSON.parse(body);
																																							if (incomingReferral.err_code == 0) {
																																								var objectEncounter = {};
																																								objectEncounter.resourceType = encounter.resourceType;
																																								objectEncounter.id = encounter.id;
																																								objectEncounter.identifier = identifier.data;
																																								objectEncounter.status = encounter.status;
																																								objectEncounter.statusHistory = statusHistory.data;
																																								objectEncounter.encounter_class = encounter.encounter_class;
																																								objectEncounter.classHistory = classHistory.data;
																																								objectEncounter.type = encounter.type;
																																								objectEncounter.priority = encounter.priority;
																																								objectEncounter.subject = encounter.subject;
																																								objectEncounter.episodeOfCare = episodeOfCare.data;
																																								objectEncounter.incomingReferral = incomingReferral.data;
																																								objectEncounter.participant = participant.data;
																																								objectEncounter.appointment = encounter.appointment;
																																								objectEncounter.period = encounter.period;
																																								objectEncounter.length = encounter.length;
																																								objectEncounter.reason = encounter.reason;
																																								objectEncounter.diagnosis = diagnosis.data;
																																								objectEncounter.account = account.data;
																																								objectEncounter.hospitalization = hospitalization.data;
																																								objectEncounter.location = location.data;
																																								objectEncounter.serviceProvider = encounter.serviceProvider;
																																								objectEncounter.partOf = encounter.partOf;

																																								newEncounter[index] = objectEncounter
																						
																																								if (index == countEncounter - 1) {
																																									res.json({
																																										"err_code": 0,
																																										"data": newEncounter
																																									});
																																								}
																																							} else {
																																								res.json(incomingReferral);
																																							}
																																						})
																																					})
																																					myEmitter.emit('getReferral', objectEncounter, index, newEncounter, countEncounter);
																																				} else {
																																					res.json(account);
																																				}
																																			})
																																		})
																																		myEmitter.emit('getAccount', objectEncounter, index, newEncounter, countEncounter);
																																	} else {
																																		res.json(episodeOfCare);
																																	}
																																})
																															})
																															myEmitter.emit('getEpisodeOfCare', objectEncounter, index, newEncounter, countEncounter);			
																														} else {
																															res.json(location);
																														}
																													})
																												})
																												myEmitter.emit('getLocation', objectEncounter, index, newEncounter, countEncounter);
																											} else {
																												res.json(hospitalization);
																											}
																										})
																									})
																									myEmitter.emit('getHospitalization', objectEncounter, index, newEncounter, countEncounter);
																								} else {
																									res.json(diagnosis);
																								}
																							})
																						})
																						myEmitter.emit('getDiagnosis', objectEncounter, index, newEncounter, countEncounter);
																					} else {
																						res.json(participant);
																					}
																				})
																			})
																			myEmitter.emit('getParticipant', objectEncounter, index, newEncounter, countEncounter);
																		} else {
																			res.json(classHistory);
																		}
																	})
																})
																myEmitter.emit('getClassHistory', objectEncounter, index, newEncounter, countEncounter);
															} else {
																res.json(statusHistory);
															}
														})
													})
													myEmitter.emit('getStatusHistory', objectEncounter, index, newEncounter, countEncounter);
                        } else {
                          res.json(identifier);
                        }
                      })
                    })
                    myEmitter.emit("getIdentifier", encounter.data[i], i, newEncounter, encounter.data.length);
                  }
                } else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Encounter is empty."
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
    }
  },
  post: {
    encounter: function addEncounter(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");

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
        err_msg = "Please add key 'encounter status' in json request.";
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
        err_msg = "Please add 'status history' in json statusHistory request.";
      }
      //statusHistory period
      if (typeof req.body.statusHistory.period !== 'undefined') {
        var statusHistoryPeriod = req.body.statusHistory.period;
        if (statusHistoryPeriod.indexOf("to") > 0) {
          arrStatusHistoryPeriod = statusHistoryPeriod.split("to");
          statusHistoryPeriodStart = arrStatusHistoryPeriod[0];
          statusHistoryPeriodEnd = arrStatusHistoryPeriod[1];
          if (!regex.test(statusHistoryPeriodStart) && !regex.test(statusHistoryPeriodEnd)) {
            err_code = 2;
            err_msg = "statusHistory Period invalid date format.";
          }
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'statusHistoryPeriod' in json statusHistory request.";
      }
			//class
      if (typeof req.body.encounter_class !== 'undefined') {
        var classCode = req.body.encounter_class.trim().toLowerCase();
        if (validator.isEmpty(classCode)) {
          err_code = 2;
          err_msg = "Class code is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'encounter code' in json request.";
      }
      //classHistory
      if (typeof req.body.classHistory.encounter_class !== 'undefined') {
        var classHistoryCode = req.body.classHistory.encounter_class.trim().toLowerCase();
        if (validator.isEmpty(classHistoryCode)) {
          err_code = 2;
          err_msg = "Class history code is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'class history code' in json classHistory request.";
      }
      //classHistory period
      if (typeof req.body.classHistory.period !== 'undefined') {
        var classHistoryPeriod = req.body.classHistory.period;
        if (classHistoryPeriod.indexOf("to") > 0) {
          arrClassHistoryPeriod = classHistoryPeriod.split("to");
          classHistoryPeriodStart = arrClassHistoryPeriod[0];
          classHistoryPeriodEnd = arrClassHistoryPeriod[1];
          if (!regex.test(classHistoryPeriodStart) && !regex.test(classHistoryPeriodEnd)) {
            err_code = 2;
            err_msg = "classHistory Period invalid date format.";
          }
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'class History Period' in json classHistory request.";
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
			//priority
      if (typeof req.body.priority !== 'undefined') {
        var priorityCode = req.body.priority.trim().toUpperCase();
        if (validator.isEmpty(priorityCode)) {
          priorityCode = "";
        }
      } else {
        priorityCode = "";
      }
			//subject 
      if (typeof req.body.subject.patient_id !== 'undefined'){
				var subjectPatientId = req.body.subject.patient_id.trim().toLowerCase();
				if(!validator.isEmpty(subjectPatientId)){
					subjectPatientId = req.body.subject.patient_id;
					subjectGroupId = "";
				}else{
					subjectPatientId = "";
				}
			}
			if (typeof req.body.subject.group_id !== 'undefined'){
				var subjectGroupId = req.body.subject.group_id.trim().toLowerCase();
				if(!validator.isEmpty(subjectGroupId)){
					subjectGroupId = req.body.subject.group_id;
					subjectPatientId = "";
				}else{
					subjectGroupId = "";
				}
			}
      //participant
			if (typeof req.body.participant.type !== 'undefined') {
        var participantTypeCode = req.body.participant.type.trim().toLowerCase();
        if (validator.isEmpty(participantTypeCode)) {
          participantTypeCode = "";
        }
      } else {
        participantTypeCode = "";
      }
			//participant period
			if (typeof req.body.participant.period !== 'undefined') {
        var participantPeriod = req.body.participant.period;
        if (participantPeriod.indexOf("to") > 0) {
          arrParticipantPeriod = participantPeriod.split("to");
          participantPeriodStart = arrParticipantPeriod[0];
          participantPeriodEnd = arrParticipantPeriod[1];
          if (!regex.test(statusHistoryPeriodStart) && !regex.test(statusHistoryPeriodEnd)) {
            err_code = 2;
            err_msg = "Participant Period invalid date format.";
          }
        }
      } else {
        participantPeriodStart = "";
				participantPeriodEnd = "";
      }
			//participant individual
			if (typeof req.body.participant.individual.practitioner !== 'undefined') {
        var participantPractitionerId = req.body.participant.individual.practitioner.trim().toLowerCase();
        if (validator.isEmpty(participantPractitionerId)) {
          participantPractitionerId = "";
        }
      } else {
        participantPractitionerId = "";
      }
			if (typeof req.body.participant.individual.related_person !== 'undefined') {
        var participantRelatedPersonId = req.body.participant.individual.related_person.trim().toLowerCase();
        if (validator.isEmpty(participantRelatedPersonId)) {
          participantRelatedPersonId = "";
        }
      } else {
        participantRelatedPersonId = "";
      }
			//appointment
      if (typeof req.body.appointment !== 'undefined') {
        var appointmentId = req.body.appointment.trim().toLowerCase();
        if (validator.isEmpty(appointmentId)) {
          appointmentId = "";
        }
      } else {
        appointmentId = "";
      }
			//period
      if (typeof req.body.period !== 'undefined') {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          periodStart = arrPeriod[0];
          periodEnd = arrPeriod[1];
          if (!regex.test(periodStart) && !regex.test(periodEnd)) {
            periodStart = "";
						periodEnd = "";
          }
        }
      } else {
        periodStart = "";
				periodEnd = "";
      }
      //length
      if (typeof req.body.length !== 'undefined') {
        var length = req.body.length;
        if (validator.isEmpty(length)) {
          length = "";
        }
      } else {
        length = "";
      }
      //reason
      if (typeof req.body.reason !== 'undefined') {
        var reasonCode = req.body.reason.trim().toLowerCase();
        if (validator.isEmpty(reasonCode)){
          reasonCode = "";
        }
      } else {
        reasonCode = "";
      }
			//diagnosis condition
      if (typeof req.body.diagnosis.condition.condition !== 'undefined') {
        var diagnosisConditionId = req.body.diagnosis.condition.condition.trim().toLowerCase();
        if (validator.isEmpty(diagnosisConditionId)) {
          //err_code = 2;
          //err_msg = "Diagnosis condition id is required";
					diagnosisConditionId = "";
        }
      } else {
        //err_code = 1;
        //err_msg = "Please add sub-key 'condition' in json request.";
				diagnosisConditionId = "";
      }
			//diagnosis condition procedure
      if (typeof req.body.diagnosis.condition.procedure !== 'undefined') {
        var procedureConditionId = req.body.diagnosis.condition.procedure.trim().toLowerCase();
        if (validator.isEmpty(procedureConditionId)) {
          //err_code = 2;
          //err_msg = "Preposedur condition id is required";
					procedureConditionId = "";
        }
      } else {
        //err_code = 1;
        //err_msg = "Please add sub-key 'condition' in json request.";
				procedureConditionId = "";
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
      if (typeof req.body.diagnosis.rank !== 'undefined') {
        var diagnosisRank = req.body.diagnosis.rank;
        if (!validator.isInt(diagnosisRank)) {
          diagnosisRank = "";
        }
      } else {
        diagnosisRank = "";
      }
      //hospitalization preAdmissionIdentifier use
      if (typeof req.body.hospitalization.preAdmissionIdentifier.use !== 'undefined') {
        var preAdmissionIdentifierUseCode = req.body.hospitalization.preAdmissionIdentifier.use.trim().toLowerCase();
        if (validator.isEmpty(preAdmissionIdentifierUseCode)) {
          preAdmissionIdentifierUseCode = "";
        }
      } else {
        preAdmissionIdentifierUseCode = "";
      }
      //hospitalization preAdmissionIdentifier type
      if (typeof req.body.hospitalization.preAdmissionIdentifier.type !== 'undefined') {
        var preAdmissionIdentifierTypeCode = req.body.hospitalization.preAdmissionIdentifier.type.trim().toUpperCase();
        if (validator.isEmpty(preAdmissionIdentifierTypeCode)) {
          preAdmissionIdentifierTypeCode = "";
        }
      } else {
        preAdmissionIdentifierTypeCode = "";
      }
      //hospitalization preAdmissionIdentifier value
      if (typeof req.body.hospitalization.preAdmissionIdentifier.value !== 'undefined') {
        var preAdmissionIdentifierValue = req.body.hospitalization.preAdmissionIdentifier.value.trim().toLowerCase();
        if (validator.isEmpty(preAdmissionIdentifierValue)) {
          preAdmissionIdentifierValue = "";
        }
      } else {
        preAdmissionIdentifierValue = "";
      }
      //hospitalization preAdmissionIdentifier period
      if (typeof req.body.hospitalization.preAdmissionIdentifier.period !== 'undefined') {
        var preAdmissionIdentifierPeriod = req.body.hospitalization.preAdmissionIdentifier.period;
        if (preAdmissionIdentifierPeriod.indexOf("to") > 0) {
          arrPreAdmissionIdentifierPeriod = preAdmissionIdentifierPeriod.split("to");
          preAdmissionIdentifierPeriodStart = arrPreAdmissionIdentifierPeriod[0];
          preAdmissionIdentifierPeriodEnd = arrPreAdmissionIdentifierPeriod[1];
          if (!regex.test(preAdmissionIdentifierPeriodStart) && !regex.test(preAdmissionIdentifierPeriodEnd)) {
            err_code = 2;
            err_msg = "Identifier Period invalid date format.";
          }
        }
      } else {
        preAdmissionIdentifierPeriodStart = "";
				preAdmissionIdentifierPeriodEnd = "";
      }
			//hospitalization origin
      if (typeof req.body.hospitalization.origin !== 'undefined') {
        var hospitalizationOriginId = req.body.hospitalization.origin.trim().toLowerCase();
        if (validator.isEmpty(hospitalizationOriginId)) {
          hospitalizationOriginId = "";
        }
      } else {
        hospitalizationOriginId = "";
      }
			//hospitalization admitSource
      if (typeof req.body.hospitalization.admitSource !== 'undefined') {
        var hospitalizationAdmitSourceCode = req.body.hospitalization.admitSource.trim().toLowerCase();
        if (validator.isEmpty(hospitalizationAdmitSourceCode)) {
          hospitalizationAdmitSourceCode = "";
        }
      } else {
        hospitalizationAdmitSourceCode = "";
      }
			//hospitalization reAdmission
      if (typeof req.body.hospitalization.reAdmission !== 'undefined') {
        var hospitalizationReAdmissionCode = req.body.hospitalization.reAdmission.trim().toUpperCase();
        if (validator.isEmpty(hospitalizationReAdmissionCode)) {
          hospitalizationReAdmissionCode = "";
        }
      } else {
        hospitalizationReAdmissionCode = "";
      }
			//hospitalization dietPreference
      if (typeof req.body.hospitalization.dietPreference !== 'undefined') {
        var hospitalizationDietPreferenceCode = req.body.hospitalization.dietPreference.trim().toLowerCase();
        if (validator.isEmpty(hospitalizationDietPreferenceCode)) {
          hospitalizationDietPreferenceCode = "";
        }
      } else {
        hospitalizationDietPreferenceCode = "";
      }
			//hospitalization specialCourtesy
      if (typeof req.body.hospitalization.specialCourtesy !== 'undefined') {
        var hospitalizationSpecialCourtesyCode = req.body.hospitalization.specialCourtesy.trim().toUpperCase();
        if (validator.isEmpty(hospitalizationSpecialCourtesyCode)) {
          hospitalizationSpecialCourtesyCode = "";
        }
      } else {
        hospitalizationSpecialCourtesyCode = "";
      }
			//hospitalization specialArrangement
      if (typeof req.body.hospitalization.specialArrangement !== 'undefined') {
        var hospitalizationSpecialArrangementCode = req.body.hospitalization.specialArrangement.trim().toLowerCase();
        if (validator.isEmpty(hospitalizationSpecialArrangementCode)) {
          hospitalizationSpecialArrangementCode = "";
        }
      } else {
        hospitalizationSpecialArrangementCode = "";
      }
			//hospitalization destination
      if (typeof req.body.hospitalization.destination !== 'undefined') {
        var hospitalizationDestinationId = req.body.hospitalization.destination.trim().toLowerCase();
        if (validator.isEmpty(hospitalizationDestinationId)) {
          hospitalizationDestinationId = "";
        }
      } else {
        hospitalizationDestinationId = "";
      }
			//hospitalization dischargeDisposition
      if (typeof req.body.hospitalization.dischargeDisposition !== 'undefined') {
        var hospitalizationDischargeDispositionCode = req.body.hospitalization.dischargeDisposition.trim().toLowerCase();
        if (validator.isEmpty(hospitalizationDischargeDispositionCode)) {
          hospitalizationDischargeDispositionCode = "";
        }
      } else {
        hospitalizationDischargeDispositionCode = "";
      }
      //location location
      if (typeof req.body.location.location !== 'undefined') {
        var locationId = req.body.location.location.trim().toLowerCase();
        if (validator.isEmpty(locationId)) {
          err_code = 2;
          err_msg = "Location Id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'location id' in json request.";
      }
			//location status
      if (typeof req.body.location.status !== 'undefined') {
        var locationStatusCode = req.body.location.status.trim().toLowerCase();
        if (validator.isEmpty(locationStatusCode)) {
          locationStatusCode = "";
        }
      } else {
        locationStatusCode = "";
      }
			//location period
			if (typeof req.body.location.period !== 'undefined') {
        var locationPeriod = req.body.location.period;
        if (locationPeriod.indexOf("to") > 0) {
          arrLocationPeriod = locationPeriod.split("to");
          locationPeriodStart = arrLocationPeriod[0];
          locationPeriodEnd = arrLocationPeriod[1];
          if (!regex.test(locationPeriodStart) && !regex.test(locationPeriodEnd)) {
            err_code = 2;
            err_msg = "Identifier Period invalid date format.";
          }
        }
      } else {
        locationPeriodStart = "";
				locationPeriodEnd = "";
      }
      //serviceProvider
      if (typeof req.body.serviceProvider !== 'undefined') {
        var serviceProviderId = req.body.serviceProvider.trim().toLowerCase();
        if (validator.isEmpty(serviceProviderId)) {
          serviceProviderId = "";
        }
      } else {
				serviceProviderId = "";
			}
      //partOf
      if (typeof req.body.partOf !== 'undefined') {
        var partOfId = req.body.partOf.trim().toLowerCase();
        if (validator.isEmpty(partOfId)) {
          partOfId = "";
        }
      } else {
				partOfId = "";
			}
			
      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function (resUseCode) {
              if (resUseCode.err_code > 0) { //code > 0 => data valid
                checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function (resUseTypeCode) {
                  if (resUseTypeCode.err_code > 0) { //code > 0 => data valid
                    checkCode(apikey, statusCode, 'ENCOUNTER_STATUS', function (resStatusCode) {
                      if (resStatusCode.err_code > 0) { //code > 0 => data valid
                        checkCode(apikey, statusHistoryStatusCode, 'ENCOUNTER_STATUS', function (resHistoryStatusCode) {
                          if (resHistoryStatusCode.err_code > 0) { //code > 0 => data valid
														checkCode(apikey, classCode, 'ACT_ENCOUNTER_CODE', function (resClassCode) {
															if (resClassCode.err_code > 0) { //code > 0 => data valid
																checkCode(apikey, classHistoryCode, 'ACT_ENCOUNTER_CODE', function (resHistoryClassCode) {
																	if (resHistoryClassCode.err_code > 0) { //code > 0 => data valid
																		/*checkUniqeValue(apikey, "CONDITION_ID|" + diagnosisConditionId, 'CONDITION', function (resDiagnosisConditionId) {
																			if (resDiagnosisConditionId.err_code > 0) { //code > 0 => data valid
																				checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureConditionId, 'PROCEDURE', function (resDiagnosisProcedureId) {
																					if (resDiagnosisProcedureId.err_code > 0) { //code > 0 => data valid*/
																						checkUniqeValue(apikey, "LOCATION_ID|" + locationId, 'LOCATION', function (resLocationId) {
																							if (resLocationId.err_code > 0) { //code > 0 => data valid					
																								myEmitter.once('checkIdentifierValue', function () {
																									checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resUniqeValue) {
																										if (resUniqeValue.err_code == 0) { //code = 0 => data bisa dipakai
																											//set uniqe id
																											var identifierId = 'ide' + uniqid.time();
																											var preAdmissionIdentifierId = 'ide' + uniqid.time();
																											var encounterId = 'enc' + uniqid.time();
																											var classHistoryId = 'ech' + uniqid.time();
																											var statusHistoryId = 'esh' + uniqid.time();
																											var diagnosisId = 'edi' + uniqid.time();
																											var hospitalizationId = 'eho' + uniqid.time();
																											var encounterlocationId = 'elo' + uniqid.time();
																											var participantId = 'epa' + uniqid.time();

																											//identifier
																											dataIdentifier = {
																												"id": identifierId,
																												"use": identifierUseCode,
																												"type": identifierTypeCode,
																												"system": identifierId,
																												"value": identifierValue,
																												"period_start": identifierPeriodStart,
																												"period_end": identifierPeriodEnd,
																												"encounter_id": encounterId
																											}

																											ApiFHIR.post('identifier', {
																												"apikey": apikey
																											}, {
																												body: dataIdentifier,
																												json: true
																											}, function (error, response, body) {
																												identifier = body;
																												//console.log(identifier)
																												if (identifier.err_code > 0) {
																													res.json(identifier);
																												}
																											})
																											//data encounter
																											dataEncounter = {
																												"encounter_id": encounterId,
																												"encounter_status": statusCode,
																												"encounter_class": classCode,
																												"encounter_type": typeCode,
																												"encounter_priority": priorityCode,
																												"encounter_period_start": periodStart,
																												"encounter_period_end": periodEnd,
																												"encounter_length": length,
																												"encounter_reason": reasonCode,
																												"subject_patient_id": subjectPatientId,
																												"subject_group_id": subjectGroupId,
																												"appointment_id": appointmentId,
																												"organization_id": serviceProviderId,
																												"parent_id": partOfId
																											}
																											ApiFHIR.post('encounter', {
																												"apikey": apikey
																											}, {
																												body: dataEncounter,
																												json: true
																											}, function (error, response, body) {
																												var encounter = body;
																												if (encounter.err_code > 0) {
																													res.json(encounter);
																												}
																											})
																											//data class history
																											dataEncounterClassHistory = {
																												"class_history_id": classHistoryId,
																												"class_history_class": classHistoryCode,
																												"class_history_period_start": classHistoryPeriodStart,
																												"class_history_period_end": classHistoryPeriodEnd,
																												"encounter_id": encounterId
																											}
																											ApiFHIR.post('encounterClassHistory', {
																												"apikey": apikey
																											}, {
																												body: dataEncounterClassHistory,
																												json: true
																											}, function (error, response, body) {
																												var encounterClassHistory = body;
																												if (encounterClassHistory.err_code > 0) {
																													res.json(encounterClassHistory);
																												}
																											})
																											//data status history
																											dataEncounterStatusHistory = {
																												"status_history_id": statusHistoryId,
																												"status_history_status": statusHistoryStatusCode,
																												"status_history_period_start": statusHistoryPeriodStart,
																												"status_history_period_end": statusHistoryPeriodEnd,
																												"encounter_id": encounterId
																											}
																											ApiFHIR.post('encounterStatusHistory', {
																												"apikey": apikey
																											}, {
																												body: dataEncounterStatusHistory,
																												json: true
																											}, function (error, response, body) {
																												var encounterStatusHistory = body;
																												if (encounterStatusHistory.err_code > 0) {
																													res.json(encounterStatusHistory);
																												}
																											})
																											//data encounter diagnosis
																											dataEncounterDiagnosis = {
																												"diagnosis_id": diagnosisId,
																												"diagnosis_role": diagnosisRoleCode,
																												"diagnosis_rank": diagnosisRank,
																												"condition_id": diagnosisConditionId,
																												"procedure_id": procedureConditionId,
																												"encounter_id": encounterId
																											}
																											ApiFHIR.post('encounterDiagnosis', {
																												"apikey": apikey
																											}, {
																												body: dataEncounterDiagnosis,
																												json: true
																											}, function (error, response, body) {
																												var encounterDiagnosis = body;
																												if (encounterDiagnosis.err_code > 0) {
																													res.json(encounterDiagnosis);
																												}
																											})
																											//data encounter hospitalization
																											dataEncounterHospitalization = {
																												"hospitalization_id": hospitalizationId,
																												"hospitalization_origin": hospitalizationOriginId,
																												"hospitalization_admit_source": hospitalizationAdmitSourceCode,
																												"hospitalization_re_addmission": hospitalizationReAdmissionCode,
																												"hospitalization_diet_preference": hospitalizationDietPreferenceCode,
																												"hospitalization_special_courtesy": hospitalizationSpecialCourtesyCode,
																												"hospitalization_special_arrangement": hospitalizationSpecialArrangementCode,
																												"hospitalization_destination": hospitalizationDestinationId,
																												"hospitalization_discharge_dispotition": hospitalizationDischargeDispositionCode,
																												"identifier_id": preAdmissionIdentifierId,
																												"encounter_id": encounterId
																											}
																											ApiFHIR.post('encounterHospitalization', {
																												"apikey": apikey
																											}, {
																												body: dataEncounterHospitalization,
																												json: true
																											}, function (error, response, body) {
																												var encounterHospitalization = body;
																												if (encounterHospitalization.err_code > 0) {
																													res.json(encounterHospitalization);
																												}
																											})
																											//preAdmissionIdentifier
																											dataPreAdmissionIdentifier = {
																												"id": preAdmissionIdentifierId,
																												"use": preAdmissionIdentifierUseCode,
																												"type": preAdmissionIdentifierTypeCode,
																												"system": preAdmissionIdentifierId,
																												"value": preAdmissionIdentifierValue,
																												"period_start": preAdmissionIdentifierPeriodStart,
																												"period_end": preAdmissionIdentifierPeriodEnd,
																												"hospitalization_id": hospitalizationId
																											}

																											ApiFHIR.post('identifier', {
																												"apikey": apikey
																											}, {
																												body: dataPreAdmissionIdentifier,
																												json: true
																											}, function (error, response, body) {
																												preAdmissionIdentifier = body;
																												//console.log(preAdmissionIdentifier)
																												if (preAdmissionIdentifier.err_code > 0) {
																													res.json(preAdmissionIdentifier);
																												}
																											})
																											
																											//data encounter location
																											dataEncounterLocation = {
																												"encounter_location_id": encounterlocationId,
																												"location_status": locationStatusCode,
																												"location_period_start": locationPeriodStart,
																												"location_period_end": locationPeriodEnd,
																												"location_id": locationId,
																												"encounter_id": encounterId
																											}
																											ApiFHIR.post('encounterLocation', {
																												"apikey": apikey
																											}, {
																												body: dataEncounterLocation,
																												json: true
																											}, function (error, response, body) {
																												var encounterLocation = body;
																												if (encounterLocation.err_code > 0) {
																													res.json(encounterLocation);
																												}
																											})
																											//data encounter participant
																											dataEncounterParticipant = {
																												"participant_id": participantId,
																												"participant_type": participantTypeCode,
																												"participant_period_start": participantPeriodStart,
																												"participant_period_end": participantPeriodEnd,
																												"individual_practitioner_id": participantPractitionerId,
																												"individual_related_person_id": participantRelatedPersonId,
																												"encounter_id": encounterId
																											}
																											ApiFHIR.post('encounterParticipant', {
																												"apikey": apikey
																											}, {
																												body: dataEncounterParticipant,
																												json: true
																											}, function (error, response, body) {
																												var encounterParticipant = body;
																												if (encounterParticipant.err_code > 0) {
																													res.json(encounterParticipant);
																												}
																											})
																											res.json({
																												"err_code": 0,
																												"err_msg": "Encounter has been add.",
																												"data": [{
																														"id": encounterId
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
																								//part of
																								myEmitter.prependOnceListener('checkPartOf', function () {
																									if (!validator.isEmpty(partOfId)) {
																										checkUniqeValue(apikey, "ENCOUNTER_ID|" + partOfId, 'ENCOUNTER', function (resPartOfId) {
																											if (resPartOfId.err_code > 0) {
																												myEmitter.emit('checkIdentifierValue');
																											} else {
																												res.json({
																													"err_code": "527",
																													"err_msg": "Encounter id not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkIdentifierValue');
																									}
																								})
																								//serviceProvider
																								myEmitter.prependOnceListener('checkServiceProvider', function () {
																									if (!validator.isEmpty(serviceProviderId)) {
																										checkUniqeValue(apikey, "ORGANIZATION_ID|" + serviceProviderId, 'ORGANIZATION', function (resServiceProviderId) {
																											if (resServiceProviderId.err_code > 0) {
																												myEmitter.emit('checkPartOf');
																											} else {
																												res.json({
																													"err_code": "526",
																													"err_msg": "serviceProvider id not found."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkPartOf');
																									}
																								})
																								//location status
																								myEmitter.prependOnceListener('checkLocationStatus', function () {
																									if (!validator.isEmpty(locationStatusCode)) {
																										checkCode(apikey, locationStatusCode, 'ENCOUNTER_LOCATION_STATUS', function (resLocationStatusCode) {
																											if (resLocationStatusCode.err_code > 0) {
																												myEmitter.emit('checkServiceProvider');
																											} else {
																												res.json({
																													"err_code": "525",
																													"err_msg": "Location Status code not found."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkServiceProvider');
																									}
																								})
																								//hospitalization dischargeDisposition
																								myEmitter.prependOnceListener('checkDischargeDisposition', function () {
																									if (!validator.isEmpty(hospitalizationDischargeDispositionCode)) {
																										checkCode(apikey, hospitalizationDischargeDispositionCode, 'ENCOUNTER_DISCHARGE_DISPOSITION', function (resHosDiscDispCode) {
																											if (resHosDiscDispCode.err_code > 0) {
																												myEmitter.emit('checkLocationStatus');
																											} else {
																												res.json({
																													"err_code": "524",
																													"err_msg": "dischargeDisposition code not found."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkLocationStatus');
																									}
																								})
																								//hospitalization destination
																								myEmitter.prependOnceListener('checkDestination', function () {
																									if (!validator.isEmpty(hospitalizationDestinationId)) {
																										checkUniqeValue(apikey, "LOCATION_ID|" + hospitalizationDestinationId, 'LOCATION', function (resHosDestinationId) {
																											if (resHosDestinationId.err_code > 0) {
																												myEmitter.emit('checkDischargeDisposition');
																											} else {
																												res.json({
																													"err_code": "523",
																													"err_msg": "Destination Id not found."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkDischargeDisposition');
																									}
																								})
																								//hospitalization specialArrangement
																								myEmitter.prependOnceListener('checkSpecialArrangement', function () {
																									if (!validator.isEmpty(hospitalizationSpecialArrangementCode)) {
																										checkCode(apikey, hospitalizationSpecialArrangementCode, 'ENCOUNTER_SPECIAL_ARRANGEMENTS', function (resHosSpecialArrCode) {
																											if (resHosSpecialArrCode.err_code > 0) {
																												myEmitter.emit('checkDestination');
																											} else {
																												res.json({
																													"err_code": "522",
																													"err_msg": "specialArrangement code not found."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkDestination');
																									}
																								})
																								//hospitalization specialCourtesy
																								myEmitter.prependOnceListener('checkSpecialCourtesy', function () {
																									if (!validator.isEmpty(hospitalizationSpecialCourtesyCode)) {
																										checkCode(apikey, hospitalizationSpecialCourtesyCode, 'ENCOUNTER_SPECIAL_COURTESY', function (resHosSpecialCourtesyCode) {
																											if (resHosSpecialCourtesyCode.err_code > 0) {
																												myEmitter.emit('checkSpecialArrangement');
																											} else {
																												res.json({
																													"err_code": "521",
																													"err_msg": "specialCourtesy code not found."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkSpecialArrangement');
																									}
																								})
																								//hospitalization dietPreference
																								myEmitter.prependOnceListener('checkDietPreference', function () {
																									if (!validator.isEmpty(hospitalizationDietPreferenceCode)) {
																										checkCode(apikey, hospitalizationDietPreferenceCode, 'ENCOUNTER_DIET', function (resHosDietPreferenceCode) {
																											if (resHosDietPreferenceCode.err_code > 0) {
																												myEmitter.emit('checkSpecialCourtesy');
																											} else {
																												res.json({
																													"err_code": "520",
																													"err_msg": "dietPreference code not found."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkSpecialCourtesy');
																									}
																								})
																								//hospitalization AdmitSource
																								myEmitter.prependOnceListener('checkAdmitSource', function () {
																									if (!validator.isEmpty(hospitalizationAdmitSourceCode)) {
																										checkCode(apikey, hospitalizationAdmitSourceCode, 'ENCOUNTER_ADMIT_SOURCE', function (resHosAdmitSourceCode) {
																											if (resHosAdmitSourceCode.err_code > 0) {
																												myEmitter.emit('checkDietPreference');
																											} else {
																												res.json({
																													"err_code": "519",
																													"err_msg": "AdmitSource code not found."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkDietPreference');
																									}
																								})
																								//hospitalization origin
																								myEmitter.prependOnceListener('checkHospitalOrigin', function () {
																									if (!validator.isEmpty(hospitalizationOriginId)) {
																										checkUniqeValue(apikey, "LOCATION_ID|" + hospitalizationOriginId, 'LOCATION', function (resHosOriginId) {
																											if (resHosOriginId.err_code > 0) {
																												myEmitter.emit('checkAdmitSource');
																											} else {
																												res.json({
																													"err_code": "518",
																													"err_msg": "Origin Id not found."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkAdmitSource');
																									}
																								})
																								//preAdmissionIdentifier value
																								myEmitter.prependOnceListener('checkPreAdmissionIdentifierValue', function () {
																									if (!validator.isEmpty(preAdmissionIdentifierValue)) {
																										checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + preAdmissionIdentifierValue, 'IDENTIFIER', function (resPreAdmissionIdeValue) {
																											if (resPreAdmissionIdeValue.err_code == 0) {
																												myEmitter.emit('checkHospitalOrigin');
																											} else {
																												res.json({
																													"err_code": "517",
																													"err_msg": "preAdmissionIdentifier value already exist."
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkHospitalOrigin');
																									}
																								})
																								//preAdmissionIdentifier type
																								myEmitter.prependOnceListener('checkPreAdmissionIdentifierType', function () {
																									if (!validator.isEmpty(preAdmissionIdentifierTypeCode)) {
																										checkCode(apikey, preAdmissionIdentifierTypeCode, 'IDENTIFIER_TYPE', function (resPreAdmissionIdeTypeCode) {
																											if (resPreAdmissionIdeTypeCode.err_code > 0) {
																												myEmitter.emit('checkPreAdmissionIdentifierValue');
																											} else {
																												res.json({
																													"err_code": "516",
																													"err_msg": "preAdmissionIdentifier Type Code not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkPreAdmissionIdentifierValue');
																									}
																								})
																								//preAdmissionIdentifier use
																								myEmitter.prependOnceListener('checkPreAdmissionIdentifierUse', function () {
																									if (!validator.isEmpty(preAdmissionIdentifierUseCode)) {
																										checkCode(apikey, preAdmissionIdentifierUseCode, 'IDENTIFIER_USE', function (resPreAdmissionIdeUseCode) {
																											if (resPreAdmissionIdeUseCode.err_code > 0) {
																												myEmitter.emit('checkPreAdmissionIdentifierType');
																											} else {
																												res.json({
																													"err_code": "516",
																													"err_msg": "preAdmissionIdentifier Use Code not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkPreAdmissionIdentifierType');
																									}
																								})
																								//diagnosis role
																								myEmitter.prependOnceListener('checkDiagnosisRole', function () {
																									if (!validator.isEmpty(diagnosisRoleCode)) {
																										checkCode(apikey, diagnosisRoleCode, 'DIAGNOSIS_ROLE', function (resDiagnosisRoleCode) {
																											if (resDiagnosisRoleCode.err_code > 0) {
																												myEmitter.emit('checkPreAdmissionIdentifierUse');
																											} else {
																												res.json({
																													"err_code": "515",
																													"err_msg": "Diagnosis Role Code not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkPreAdmissionIdentifierUse');
																									}
																								})
																								//appointment
																								myEmitter.prependOnceListener('checkReason', function () {
																									if (!validator.isEmpty(reasonCode)) {
																										checkCode(apikey, reasonCode, 'ENCOUNTER_REASON', function (resReasonCode) {
																											if (resReasonCode.err_code > 0) {
																												myEmitter.emit('checkDiagnosisRole');
																											} else {
																												res.json({
																													"err_code": "515",
																													"err_msg": "Reason Code not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkDiagnosisRole');
																									}
																								})
																								//appointment
																								myEmitter.prependOnceListener('checkAppointment', function () {
																									if (!validator.isEmpty(appointmentId)) {
																										checkUniqeValue(apikey, "APPOINTMENT_ID|" + appointmentId, 'APPOINTMENT', function (resAppointmentId) {
																											if (resAppointmentId.err_code > 0) {
																												myEmitter.emit('checkReason');
																											} else {
																												res.json({
																													"err_code": "515",
																													"err_msg": "Appointment id not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkReason');
																									}
																								})
																								//participant individual practitioner
																								myEmitter.prependOnceListener('checkParticipantRelatedPerson', function () {
																									if (!validator.isEmpty(participantRelatedPersonId)) {
																										checkUniqeValue(apikey, "RELATED_PERSON_ID|" + participantRelatedPersonId, 'RELATED_PERSON', function (resRelatedPersonId) {
																											if (resRelatedPersonId.err_code > 0) {
																												myEmitter.emit('checkAppointment');
																											} else {
																												res.json({
																													"err_code": "514",
																													"err_msg": "Related Person id not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkAppointment');
																									}
																								})
																								//participant individual practitioner
																								myEmitter.prependOnceListener('checkParticipantPractitioner', function () {
																									if (!validator.isEmpty(participantPractitionerId)) {
																										checkUniqeValue(apikey, "PRACTITIONER_ID|" + participantPractitionerId, 'PRACTITIONER', function (resPractitionerId) {
																											if (resPractitionerId.err_code > 0) {
																												myEmitter.emit('checkParticipantRelatedPerson');
																											} else {
																												res.json({
																													"err_code": "514",
																													"err_msg": "Practitioner id not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkParticipantRelatedPerson');
																									}
																								})
																								//participant type
																								myEmitter.prependOnceListener('checkParticipant', function () {
																									if (!validator.isEmpty(participantTypeCode)) {
																										checkCode(apikey, participantTypeCode, 'ENCOUNTER_PARTICIPANT_TYPE', function (resParticipantTypeCode) {
																											if (resParticipantTypeCode.err_code > 0) {
																												myEmitter.emit('checkParticipantPractitioner');
																											} else {
																												res.json({
																													"err_code": "513",
																													"err_msg": "Participant Type code not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkParticipantPractitioner');
																									}
																								})
																								//Subject Group
																								myEmitter.prependOnceListener('checkSubjectGroup', function () {
																									if (!validator.isEmpty(subjectGroupId)) {
																										checkUniqeValue(apikey, "GROUP_ID|" + subjectGroupId, 'GROUP', function (resGroupId) {
																											if (resGroupId.err_code == 0) {
																												myEmitter.emit('checkParticipant');
																											} else {
																												res.json({
																													"err_code": "512",
																													"err_msg": "Group id not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkParticipant');
																									}
																								})
																								//Subject Patient
																								myEmitter.prependOnceListener('checkSubjectPatient', function () {
																									if (!validator.isEmpty(subjectPatientId)) {
																										checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatientId, 'PATIENT', function (resPatientId) {
																											if (resPatientId.err_code > 0) {
																												myEmitter.emit('checkSubjectGroup');
																											} else {
																												res.json({
																													"err_code": "511",
																													"err_msg": "Patient id not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkSubjectGroup');
																									}
																								})
																								//priority
																								myEmitter.prependOnceListener('checkPriority', function () {
																									if (!validator.isEmpty(priorityCode)) {
																										checkCode(apikey, priorityCode, 'ACT_PRIORITY', function (resPriorityCode) {
																											if (resPriorityCode.err_code > 0) {
																												myEmitter.emit('checkSubjectPatient');
																											} else {
																												res.json({
																													"err_code": "510",
																													"err_msg": "Priority code not found"
																												});
																											}
																										})
																									} else {
																										myEmitter.emit('checkSubjectPatient');
																									}
																								})
																								//type code
																								if (!validator.isEmpty(typeCode)) {
																									checkCode(apikey, typeCode, 'ENCOUNTER_TYPE', function (resTypeCode) {
																										if (resTypeCode.err_code > 0) {
																											myEmitter.emit('checkPriority');
																										} else {
																											res.json({
																												"err_code": "509",
																												"err_msg": "Encounter Type code not found"
																											});
																										}
																									})
																								} else {
																									myEmitter.emit('checkPriority');
																								}				
																							} else {
																								res.json({
																									"err_code": "508",
																									"err_msg": "Location id not found"
																								});
																							}
																						})
																					/*} else {
																						res.json({
																							"err_code": "507",
																							"err_msg": "Condition id not found"
																						});
																					}																					
																				})
																			} else {
																				res.json({
																					"err_code": "507",
																					"err_msg": "Condition id not found"
																				});
																			}
																		})*/
																	} else {
																		res.json({
																			"err_code": "506",
																			"err_msg": "History Class code not found"
																		});
																	}
																})
															} else {
																res.json({
																	"err_code": "505",
																	"err_msg": "Class code not found"
																});
															}
														})
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
      var encounterId = req.params.encounter_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Encounter id is required";
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
                        checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterID) {
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
                              "encounter_id": encounterId
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
                                  "err_msg": "Identifier has been add in this encounter.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "Encounter Id not found"
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
      var encounterId = req.params.encounter_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Encounter id is required";
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
        err_msg = "Please add 'status history' in json request.";
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
            checkCode(apikey, statusCode, 'ENCOUNTER_STATUS', function (resStatusCode) {
              if (resStatusCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterID) {
                  if (resEncounterID.err_code > 0) {
										var statusHistoryId = 'esh' + uniqid.time();
										
										dataEncounterStatusHistory = {
											"status_history_id": statusHistoryId,
											"status_history_status": statusCode,
											"status_history_period_start": statusHistoryPeriodStart,
											"status_history_period_end": statusHistoryPeriodEnd,
											"encounter_id": encounterId
										}
										ApiFHIR.post('encounterStatusHistory', {
											"apikey": apikey
										}, {
											body: dataEncounterStatusHistory,
											json: true
										}, function (error, response, body) {
											var encounterStatusHistory = body;
											if (encounterStatusHistory.err_code == 0) {
                        res.json({
                          "err_code": 0,
                          "err_msg": "Status history has been add in this encounter.",
                          "data": encounterStatusHistory.data
                        });
                      } else {
                        res.json(encounterStatusHistory);
                      }
										})
                  } else {
                    res.json({
                      "err_code": 503,
                      "err_msg": "Encounter Id not found"
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
		classHistory: function addClassHistory(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var encounterId = req.params.encounter_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Encounter id is required";
      }
      //status history
      if (typeof req.body.encounter_class !== 'undefined') {
        var classCode = req.body.encounter_class.trim().toLowerCase();
        if (validator.isEmpty(classCode)) {
          err_code = 2;
          err_msg = "Class history is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'class history' in json request.";
      }
      //statusHistory period
      if (typeof req.body.period !== 'undefined') {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrHistoryPeriod = period.split("to");
          classHistoryPeriodStart = arrHistoryPeriod[0];
          classHistoryPeriodEnd = arrHistoryPeriod[1];
          if (!regex.test(classHistoryPeriodStart) && !regex.test(classHistoryPeriodEnd)) {
            err_code = 2;
            err_msg = "classHistory Period invalid date format.";
          }
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'classHistory Period' in json request.";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkCode(apikey, classCode, 'ACT_ENCOUNTER_CODE', function (resClassCode) {
              if (resClassCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterID) {
                  if (resEncounterID.err_code > 0) {
										var classHistoryId = 'ech' + uniqid.time();
										//data class history
										dataEncounterClassHistory = {
											"class_history_id": classHistoryId,
											"class_history_class": classCode,
											"class_history_period_start": classHistoryPeriodStart,
											"class_history_period_end": classHistoryPeriodEnd,
											"encounter_id": encounterId
										}
										ApiFHIR.post('encounterClassHistory', {
											"apikey": apikey
										}, {
											body: dataEncounterClassHistory,
											json: true
										}, function (error, response, body) {
											var encounterClassHistory = body;
											if (encounterClassHistory.err_code == 0) {
                        res.json({
                          "err_code": 0,
                          "err_msg": "Class history has been add in this encounter.",
                          "data": encounterClassHistory.data
                        });
                      } else {
                        res.json(encounterClassHistory);
                      }
										})
                  } else {
                    res.json({
                      "err_code": 503,
                      "err_msg": "Encounter Id not found"
                    });
                  }
                })
              } else {
                res.json({
                  "err_code": 501,
                  "err_msg": "Class code not found"
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
		participant: function addParticipant(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var encounterId = req.params.encounter_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Encounter id is required";
      }
      //participant
			if (typeof req.body.type !== 'undefined') {
        var participantTypeCode = req.body.type.trim().toLowerCase();
        if (validator.isEmpty(participantTypeCode)) {
          participantTypeCode = "";
        }
      } else {
        participantTypeCode = "";
      }
			//participant period
			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var participantPeriod = req.body.period;
        if (participantPeriod.indexOf("to") > 0) {
          arrParticipantPeriod = participantPeriod.split("to");
          participantPeriodStart = arrParticipantPeriod[0];
          participantPeriodEnd = arrParticipantPeriod[1];
          if (!regex.test(participantPeriodStart) && !regex.test(participantPeriodEnd)) {
            err_code = 2;
            err_msg = "Participant Period invalid date format.";
          }
        }
      } else {
        participantPeriodStart = "";
				participantPeriodEnd = "";
      }
			//participant individual
			if (typeof req.body.individual.practitioner !== 'undefined') {
        var participantPractitionerId = req.body.individual.practitioner.trim().toLowerCase();
        if (validator.isEmpty(participantPractitionerId)) {
          participantPractitionerId = "";
        }
      } else {
        participantPractitionerId = "";
      }
			if (typeof req.body.individual.related_person !== 'undefined') {
        var participantRelatedPersonId = req.body.individual.related_person.trim().toLowerCase();
        if (validator.isEmpty(participantRelatedPersonId)) {
          participantRelatedPersonId = "";
        }
      } else {
        participantRelatedPersonId = "";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						myEmitter.once('checkEncounter', function () {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterID) {
								if (resEncounterID.err_code > 0) {
									var participantId = 'epa' + uniqid.time();									
									//data encounter participant
									dataEncounterParticipant = {
										"participant_id": participantId,
										"participant_type": participantTypeCode,
										"participant_period_start": participantPeriodStart,
										"participant_period_end": participantPeriodEnd,
										"individual_practitioner_id": participantPractitionerId,
										"individual_related_person_id": participantRelatedPersonId,
										"encounter_id": encounterId
									}
									ApiFHIR.post('encounterParticipant', {
										"apikey": apikey
									}, {
										body: dataEncounterParticipant,
										json: true
									}, function (error, response, body) {
										var encounterParticipant = body;
										if (encounterParticipant.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Participant has been add in this encounter.",
												"data": encounterParticipant.data
											});
										} else {
											res.json(encounterParticipant);
										}
									})
									
								} else {
									res.json({
										"err_code": 501,
										"err_msg": "Encounter Id not found"
									});
								}
							})
						})
						//participant individual practitioner
						myEmitter.prependOnceListener('checkParticipantRelatedPerson', function () {
							if (!validator.isEmpty(participantRelatedPersonId)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + participantRelatedPersonId, 'RELATED_PERSON', function (resRelatedPersonId) {
									if (resRelatedPersonId.err_code > 0) {
										myEmitter.emit('checkEncounter');
									} else {
										res.json({
											"err_code": "514",
											"err_msg": "Related Person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEncounter');
							}
						})
						//participant individual practitioner
						myEmitter.prependOnceListener('checkParticipantPractitioner', function () {
							if (!validator.isEmpty(participantPractitionerId)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + participantPractitionerId, 'PRACTITIONER', function (resPractitionerId) {
									if (resPractitionerId.err_code > 0) {
										myEmitter.emit('checkParticipantRelatedPerson');
									} else {
										res.json({
											"err_code": "514",
											"err_msg": "Practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantRelatedPerson');
							}
						})
						//participant type
						if (!validator.isEmpty(participantTypeCode)) {
							checkCode(apikey, participantTypeCode, 'ENCOUNTER_PARTICIPANT_TYPE', function (resParticipantTypeCode) {
								if (resParticipantTypeCode.err_code > 0) {
									myEmitter.emit('checkParticipantPractitioner');
								} else {
									res.json({
										"err_code": "513",
										"err_msg": "Participant Type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkParticipantPractitioner');
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
		diagnosis: function addDiagnosis(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var encounterId = req.params.encounter_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Encounter id is required";
      }
      //diagnosis condition
      if (typeof req.body.condition.condition !== 'undefined') {
        var diagnosisConditionId = req.body.condition.condition.trim().toLowerCase();
        if (validator.isEmpty(diagnosisConditionId)) {
          err_code = 2;
          err_msg = "Diagnosis condition id is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'condition' in json request.";
      }
			//diagnosis condition procedure
      if (typeof req.body.condition.procedure !== 'undefined') {
        var procedureConditionId = req.body.condition.procedure.trim().toLowerCase();
        if (validator.isEmpty(procedureConditionId)) {
          err_code = 2;
          err_msg = "Preposedur condition id is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'procedure' in json request.";
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
      //diagnosis rank
      if (typeof req.body.rank !== 'undefined' && req.body.rank !== "") {
        var diagnosisRank = req.body.rank;
        if (!validator.isInt(diagnosisRank)) {
          err_code = 2;
          err_msg = "Diagnosis Rank must be int";
        }
      } else {
        diagnosisRank = "";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						/*checkUniqeValue(apikey, "CONDITION_ID|" + diagnosisConditionId, 'CONDITION', function (resDiagnosisConditionId) {
							if (resDiagnosisConditionId.err_code > 0) { //code > 0 => data valid
								checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureConditionId, 'PROCEDURE', function (resDiagnosisProcedureId) {
									if (resDiagnosisProcedureId.err_code > 0) { //code > 0 => data valid */
										myEmitter.once('checkEncounter', function () {
											checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterID) {
												if (resEncounterID.err_code > 0) {
													var diagnosisId = 'edi' + uniqid.time();
														
													//data encounter diagnosis
													dataEncounterDiagnosis = {
														"diagnosis_id": diagnosisId,
														"diagnosis_role": diagnosisRoleCode,
														"diagnosis_rank": diagnosisRank,
														"condition_id": diagnosisConditionId,
														"procedure_id": procedureConditionId,
														"encounter_id": encounterId
													}
													ApiFHIR.post('encounterDiagnosis', {
														"apikey": apikey
													}, {
														body: dataEncounterDiagnosis,
														json: true
													}, function (error, response, body) {
														var encounterDiagnosis = body;
														if (encounterDiagnosis.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Diagnosis has been add in this encounter.",
																"data": encounterDiagnosis.data
															});
														} else {
															res.json(encounterDiagnosis);
														}
													})
																						
												} else {
													res.json({
														"err_code": 501,
														"err_msg": "Encounter Id not found"
													});
												}
											})
										})
										//diagnosis role
										if (!validator.isEmpty(diagnosisRoleCode)) {
											checkCode(apikey, diagnosisRoleCode, 'DIAGNOSIS_ROLE', function (resDiagnosisRoleCode) {
												if (resDiagnosisRoleCode.err_code > 0) {
													myEmitter.emit('checkEncounter');
												} else {
													res.json({
														"err_code": "503",
														"err_msg": "Diagnosis Role Code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkEncounter');
										}
									/*} else {
										res.json({
											"err_code": "502",
											"err_msg": "Condition Procedure id not found"
										});
									}																					
								})
							} else {
								res.json({
									"err_code": "501",
									"err_msg": "Condition id not found"
								});
							}
						})*/
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
		location: function addLocation(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var encounterId = req.params.encounter_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Encounter id is required";
      }
      //location location
      if (typeof req.body.location !== 'undefined') {
        var locationId = req.body.location.trim().toLowerCase();
        if (validator.isEmpty(locationId)) {
          err_code = 2;
          err_msg = "Location Id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'location id' in json request.";
      }
			//location status
      if (typeof req.body.status !== 'undefined') {
        var locationStatusCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(locationStatusCode)) {
          locationStatusCode = "";
        }
      } else {
        locationStatusCode = "";
      }
			//location period
			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var locationPeriod = req.body.period;
        if (locationPeriod.indexOf("to") > 0) {
          arrLocationPeriod = locationPeriod.split("to");
          locationPeriodStart = arrLocationPeriod[0];
          locationPeriodEnd = arrLocationPeriod[1];
          if (!regex.test(locationPeriodStart) && !regex.test(locationPeriodEnd)) {
            err_code = 2;
            err_msg = "Identifier Period invalid date format.";
          }
        }
      } else {
        locationPeriodStart = "";
				locationPeriodEnd = "";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						checkUniqeValue(apikey, "LOCATION_ID|" + locationId, 'LOCATION', function (resLocationId) {
							if (resLocationId.err_code > 0) { //code > 0 => data valid
								myEmitter.prependOnceListener('checkEncounter', function () {
									checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterID) {
										if (resEncounterID.err_code > 0) {
											var encounterlocationId = 'elo' + uniqid.time();
											//data encounter location
											dataEncounterLocation = {
												"encounter_location_id": encounterlocationId,
												"location_status": locationStatusCode,
												"location_period_start": locationPeriodStart,
												"location_period_end": locationPeriodEnd,
												"location_id": locationId,
												"encounter_id": encounterId
											}
											ApiFHIR.post('encounterLocation', {
												"apikey": apikey
											}, {
												body: dataEncounterLocation,
												json: true
											}, function (error, response, body) {
												var encounterLocation = body;
												if (encounterLocation.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Location has been add in this encounter.",
														"data": encounterLocation.data
													});
												} else {
													res.json(encounterLocation);
												}
											})								
										} else {
											res.json({
												"err_code": 501,
												"err_msg": "Encounter Id not found"
											});
										}
									})
								})
							  //location status
								if (!validator.isEmpty(locationStatusCode)) {
									checkCode(apikey, locationStatusCode, 'LOCATION_STATUS', function (resLocationStatusCode) {
										if (resLocationStatusCode.err_code > 0) {
											myEmitter.emit('checkEncounter');
										} else {
											res.json({
												"err_code": "525",
												"err_msg": "Location Status code not found."
											});
										}
									})
								} else {
									myEmitter.emit('checkEncounter');
								}
							} else {
								res.json({
									"err_code": "501",
									"err_msg": "Location id not found"
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
    encounter: function updateEncounter(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var encounterId = req.params.encounter_id;

      var err_code = 0;
      var err_msg = "";
      var dataEncounter = {};

      if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Encounter Id is required.";
      }
      if (typeof req.body.status !== 'undefined') {
        var statusCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(statusCode)) {
          statusCode = "";
        }
        dataEncounter.encounter_status = statusCode;
      } else {
				statusCode = "";
			}
			if (typeof req.body.encounter_class !== 'undefined') {
        var classCode = req.body.encounter_class.trim().toLowerCase();
        if (validator.isEmpty(classCode)) {
          classCode = "";
        }
				dataEncounter.encounter_class = classCode;
      } else {
        classCode = "";
      }
      if (typeof req.body.type !== 'undefined') {
        var typeCode = req.body.type.trim().toLowerCase();
        if (validator.isEmpty(typeCode)) {
          typeCode = "";
        }
        dataEncounter.encounter_type = typeCode;
      } else {
        typeCode = "";
			}
      if (typeof req.body.priority !== 'undefined') {
        var priorityCode = req.body.priority.trim().toUpperCase();
        if (validator.isEmpty(priorityCode)) {
          priorityCode = "";
        }
        dataEncounter.encounter_priority = priorityCode;
      } else {
				priorityCode = "";
			}
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          periodStart = arrPeriod[0];
          periodEnd = arrPeriod[1];
          if (!regex.test(periodStart) && !regex.test(periodEnd)) {
            err_code = 2;
            err_msg = "Period invalid date format.";
          } else {
            dataEncounter.encounter_period_start = periodStart;
            dataEncounter.encounter_period_end = periodEnd;
          }
        } else {
          err_code = 1;
          err_msg = "Period request format is wrong, `ex: start to end` ";
        }
      } else {
				periodStart = "";
				periodEnd ="";
			}
			if (typeof req.body.length !== 'undefined') {
        var length = req.body.length;
        if (validator.isEmpty(length)) {
          length = "";
        }
        dataEncounter.encounter_length = length;
      } else {
				length = "";
			}
      if (typeof req.body.reason !== 'undefined') {
        var reasonCode = req.body.reason.trim().toLowerCase();
				if (validator.isEmpty(reasonCode)) {
          reasonCode = "";
        }
        dataEncounter.encounter_reason = reasonCode;
      } else {
				reasonCode = "";
			}
			if (typeof req.body.subject !== 'undefined'){
				if (typeof req.body.subject.patient_id !== 'undefined'){
					var subjectPatientId = req.body.subject.patient_id.trim().toLowerCase();
					if (validator.isEmpty(subjectPatientId)) {
						subjectPatientId = "";
					}
					dataEncounter.subject_patient_id = subjectPatientId;
				} else {
					subjectPatientId = "";
				}
				
				if (typeof req.body.subject.group_id !== 'undefined'){
					var subjectGroupId = req.body.subject.group_id.trim().toLowerCase();
					if (validator.isEmpty(subjectGroupId)) {
						subjectGroupId = "";
					}
					dataEncounter.subject_group_id = subjectGroupId;
				} else {
					subjectGroupId = "";
				}
			} else {
				subjectPatientId = "";
				subjectGroupId = "";
			}
			if (typeof req.body.appointment !== 'undefined') {
        var appointmentId = req.body.appointment.trim().toLowerCase();
				if (validator.isEmpty(appointmentId)) {
          appointmentId = "";
        }
        dataEncounter.appointment_id = appointmentId;
      } else {
				appointmentId = "";
			}
			if (typeof req.body.serviceProvider !== 'undefined') {
        var serviceProviderId = req.body.serviceProvider.trim().toLowerCase();
				if (validator.isEmpty(serviceProviderId)) {
          serviceProviderId = "";
        }
        dataEncounter.organization_id = serviceProviderId;
      } else {
				serviceProviderId = "";
			}
			if (typeof req.body.partOf !== 'undefined') {
        var partOfId = req.body.partOf.trim().toLowerCase();
				if (validator.isEmpty(partOfId)) {
          partOfId = "";
        }
        dataEncounter.parent_id = partOfId;
      } else {
				partOfId = "";
			}
			
      if (err_code == 0) {
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterIDId) {
								if (resEncounterIDId.err_code > 0) {
									ApiFHIR.put('encounter', {
										"apikey": apikey,
										"_id": encounterId
									}, {
										body: dataEncounter,
										json: true
									}, function (error, response, body) {
										encounter = body;
										if (encounter.err_code > 0) {
											res.json(encounter);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter has been updated.",
												"data": encounter.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 506,
										"err_msg": "Encounter Id not found"
									});
								}
							})
						})
						myEmitter.prependOnceListener('checkPartOf', function () {
							if (validator.isEmpty(partOfId)) {
								myEmitter.emit('checkId');
							} else {
								checkUniqeValue(apikey, "ENCOUNTER_ID|" + partOfId, 'ENCOUNTER', function (resPartOfId) {
									if (resPartOfId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkId');
									} else {
										res.json({
											"err_code": 505,
											"err_msg": "Encounter Id not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkServiceProvider', function () {
							if (validator.isEmpty(serviceProviderId)) {
								myEmitter.emit('checkPartOf');
							} else {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + serviceProviderId, 'ORGANIZATION', function (resServiceProviderId) {
									if (resServiceProviderId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkPartOf');
									} else {
										res.json({
											"err_code": 504,
											"err_msg": "Organization Id not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkAppointment', function () {
							if (validator.isEmpty(appointmentId)) {
								myEmitter.emit('checkServiceProvider');
							} else {
								checkUniqeValue(apikey, "APPOINTMENT_ID|" + appointmentId, 'APPOINTMENT', function (resAppointmentId) {
									if (resAppointmentId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkServiceProvider');
									} else {
										res.json({
											"err_code": 503,
											"err_msg": "Appointment id not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkGroup', function () {
							if (validator.isEmpty(subjectGroupId)) {
								myEmitter.emit('checkAppointment');
							} else {
								checkUniqeValue(apikey, "GROUP_ID|" + subjectGroupId, 'GROUP', function (resGroupId) {
									if (resGroupId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkAppointment');
									} else {
										res.json({
											"err_code": 503,
											"err_msg": "Group id not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkPatient', function () {
							if (validator.isEmpty(subjectPatientId)) {
								myEmitter.emit('checkGroup');
							} else {
								checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatientId, 'PATIENT', function (resPatientId) {
									if (resPatientId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkGroup');
									} else {
										res.json({
											"err_code": 503,
											"err_msg": "Patient id not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkReason', function () {
							if (validator.isEmpty(reasonCode)) {
								myEmitter.emit('checkPatient');
							} else {
								checkCode(apikey, reasonCode, 'ENCOUNTER_REASON', function (resReasonCode) {
									if (resReasonCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkPatient');
									} else {
										res.json({
											"err_code": 503,
											"err_msg": "Reason code not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkPriority', function () {
							if (validator.isEmpty(priorityCode)) {
								myEmitter.emit('checkReason');
							} else {
								checkCode(apikey, priorityCode, 'ACT_PRIORITY', function (resPriorityCode) {
									if (resPriorityCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkReason');
									} else {
										res.json({
											"err_code": 502,
											"err_msg": "Priority code not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkType', function () {
							if (validator.isEmpty(typeCode)) {
								myEmitter.emit('checkPriority');
							} else {
								checkCode(apikey, typeCode, 'ENCOUNTER_TYPE', function (resTypeCode) {
									if (resTypeCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkPriority');
									} else {
										res.json({
											"err_code": 502,
											"err_msg": "Type code not found"
										});
									}
								})
							}
						})
						myEmitter.prependOnceListener('checkClass', function () {
							if (validator.isEmpty(classCode)) {
								myEmitter.emit('checkType');
							} else {
								checkCode(apikey, classCode, 'ACT_ENCOUNTER_CODE', function (resClassCode) {
									if (resClassCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkType');
									} else {
										res.json({
											"err_code": 502,
											"err_msg": "Class code not found"
										});
									}
								})
							}
						})
						if (validator.isEmpty(statusCode)) {
							myEmitter.emit('checkClass');
						} else {
							checkCode(apikey, statusCode, 'ENCOUNTER_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkClass');
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
      var encounterId = req.params.encounter_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Encounter id is required";
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
      if (typeof req.body.use !== 'undefined' && req.body.use !== "") {
        var identifierUseCode = req.body.use.trim().toLowerCase();
        if (validator.isEmpty(identifierUseCode)) {
          err_code = 2;
          err_msg = "Identifier Use is empty";
        } else {
          dataIdentifier.use = identifierUseCode;
        }
      } else {
        identifierUseCode = "";
      }
      //type code
      if (typeof req.body.type !== 'undefined' && req.body.type !== "") {
        var identifierTypeCode = req.body.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          err_code = 2;
          err_msg = "Identifier Type is empty";
        } else {
          dataIdentifier.type = identifierTypeCode;
        }
      } else {
        identifierTypeCode = "";
      }
      //identifier uniqe value
      if (typeof req.body.value !== 'undefined' && req.body.value !== "") {
        var identifierValue = req.body.value.trim();
        if (validator.isEmpty(identifierValue)) {
          err_code = 2;
          err_msg = "Identifier Value is empty";
        } else {
          dataIdentifier.value = identifierValue;
          dataIdentifier.system = identifierId;
        }
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
            myEmitter.once('checkEncounter', function () {
              checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterID) {
                if (resEncounterID.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "ENCOUNTER_ID|" + encounterId
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
                    "err_msg": "Encounter Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkEncounter');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkEncounter');
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
		preAdmissionIdentifier: function updatePreAdmissionIdentifier(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var hospitalizationId = req.params.hospitalization_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof hospitalizationId !== 'undefined') {
        if (validator.isEmpty(hospitalizationId)) {
          err_code = 2;
          err_msg = "Hospitalization id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Hospitalization id is required";
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
            myEmitter.once('checkHospitalization', function () {
              checkUniqeValue(apikey, "ENCOUNTER_HOSPITALIZATION_ID|" + hospitalizationId, 'ENCOUNTER_HOSPITALIZATION', function (resHospiID) {
                if (resHospiID.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "HOSPITALIZATION_ID|" + hospitalizationId
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
                            "err_msg": "Identifier has been update in this hospitalization.",
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
                    "err_msg": "Hospitalization Id not found"
                  });
                }
              })
            })

            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkHospitalization');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkHospitalization');
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
      var encounterId = req.params.encounter_id;
      var statusHistoryId = req.params.status_history_id;

      var err_code = 0;
      var err_msg = "";
      var dataStatusHistory = {};
			
			if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Encounter Id is required.";
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
          statusHistoryCode = "";
        }
        dataStatusHistory.encounter_status_history_status = statusHistoryCode;
      } else {
        statusHistoryCode = "";
      }
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          periodStart = arrPeriod[0];
          periodEnd = arrPeriod[1];
          if (!regex.test(periodStart) && !regex.test(periodEnd)) {
            err_code = 2;
            err_msg = "Period invalid date format.";
          } else {
            dataStatusHistory.encounter_status_history_period_start = periodStart;
            dataStatusHistory.encounter_status_history_period_end = periodEnd;
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
						myEmitter.once('checkEncounterID', function () {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEpisodeOfCareID) {
                if (resEpisodeOfCareID.err_code > 0) {
                  checkUniqeValue(apikey, "ENCOUNTER_STATUS_HISTORY_ID|" + statusHistoryId, 'ENCOUNTER_STATUS_HISTORY', function (resStatusHistoryID) {
                    if (resStatusHistoryID.err_code > 0) {
                      ApiFHIR.put('encounterStatusHistory', {
                        "apikey": apikey,
                        "_id": statusHistoryId,
                        "dr": "ENCOUNTER_ID|" + encounterId
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
                            "err_msg": "Status History has been update in this encounter.",
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
                    "err_msg": "Encounter Id not found"
                  });
                }
              })
						})
						if (validator.isEmpty(statusHistoryCode)) {
              myEmitter.emit('checkEncounterID');
            } else {
              checkCode(apikey, statusHistoryCode, 'ENCOUNTER_STATUS', function (resStatusCode) {
                if (resStatusCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkEncounterID');
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
		classHistory: function updateClassHistory(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var encounterId = req.params.encounter_id;
      var classHistoryId = req.params.class_history_id;

      var err_code = 0;
      var err_msg = "";
      var dataClassHistory = {};
			
			if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Encounter Id is required.";
      }
			if (typeof classHistoryId !== 'undefined') {
        if (validator.isEmpty(classHistoryId)) {
          err_code = 2;
          err_msg = "Class history id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Class history id is required";
      }
			if (typeof req.body.encounter_class !== 'undefined') {
        var classHistoryCode = req.body.encounter_class.trim().toLowerCase();
        if (validator.isEmpty(classHistoryCode)) {
          classHistoryCode = "";
        }
        dataClassHistory.encounter_class_history_class = classHistoryCode;
      } else {
        classHistoryCode = "";
      }
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          periodStart = arrPeriod[0];
          periodEnd = arrPeriod[1];
          if (!regex.test(periodStart) && !regex.test(periodEnd)) {
            err_code = 2;
            err_msg = "Period invalid date format.";
          } else {
            dataClassHistory.encounter_class_history_period_start = periodStart;
            dataClassHistory.encounter_class_history_period_end = periodEnd;
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
						myEmitter.once('checkEncounterID', function () {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEpisodeOfCareID) {
                if (resEpisodeOfCareID.err_code > 0) {
                  checkUniqeValue(apikey, "ENCOUNTER_CLASS_HISTORY_ID|" + classHistoryId, 'ENCOUNTER_CLASS_HISTORY', function (resClassHistoryID) {
                    if (resClassHistoryID.err_code > 0) {
                      ApiFHIR.put('encounterClassHistory', {
                        "apikey": apikey,
                        "_id": classHistoryId,
                        "dr": "ENCOUNTER_ID|" + encounterId
                      }, {
                        body: dataClassHistory,
                        json: true
                      }, function (error, response, body) {
                        classHistory = body;
                        if (classHistory.err_code > 0) {
                          res.json(classHistory);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Class History has been update in this encounter.",
                            "data": classHistory.data
                          });
                        }
                      })
                    } else {
                      res.json({
                        "err_code": 503,
                        "err_msg": "Class History Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Encounter Id not found"
                  });
                }
              })
						})
						if (validator.isEmpty(classHistoryCode)) {
              myEmitter.emit('checkEncounterID');
            } else {
              checkCode(apikey, classHistoryCode, 'ACT_ENCOUNTER_CODE', function (resClassCode) {
                if (resClassCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkEncounterID');
                } else {
                  res.json({
                    "err_code": 501,
                    "err_msg": "Class History code not found"
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
      var encounterId = req.params.encounter_id;
      var diagnosisId = req.params.diagnosis_id;

      var err_code = 0;
      var err_msg = "";
      var dataDiagnosis = {};
			
			if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Encounter Id is required.";
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
				if (typeof req.body.condition.condition !== 'undefined') {
					var conditionId = req.body.condition.condition.trim().toLowerCase();
					if (validator.isEmpty(conditionId)) {
						conditionId = "";
					}
					dataDiagnosis.condition_id = conditionId;
				} else {
					conditionId = "";
				}
				if (typeof req.body.condition.procedure !== 'undefined') {
					var procedureId = req.body.condition.procedure.trim().toLowerCase();
					if (validator.isEmpty(procedureId)) {
						procedureId = "";
					}
					dataDiagnosis.procedure_id = procedureId;
				} else {
					procedureId = "";
				}
			} else {
				conditionId = "";
				procedureId = "";
			}
			if (typeof req.body.role !== 'undefined') {
        var roleCode = req.body.role.trim().toLowerCase();
        if (validator.isEmpty(roleCode)) {
          roleCode = "";
        }
        dataDiagnosis.encounter_diagnosis_role = roleCode;
      } else {
        roleCode = "";
      }
			if (typeof req.body.rank !== 'undefined' && req.body.rank !== "") {
				var diagnosisRank = req.body.rank;
				if (!validator.isInt(diagnosisRank)) {
					err_code = 2;
					err_msg = "Diagnosis rank is required and must be number.";
				} else {
					dataDiagnosis.encounter_diagnosis_rank = diagnosisRank;
				}
			} else {
				diagnosisRank = "";
			}
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkEncounterID', function () {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterID) {
                if (resEncounterID.err_code > 0) {
                  checkUniqeValue(apikey, "ENCOUNTER_DIAGNOSIS_ID|" + diagnosisId, 'ENCOUNTER_DIAGNOSIS', function (resDiagnosisID) {
                    if (resDiagnosisID.err_code > 0) {
                      ApiFHIR.put('encounterDiagnosis', {
                        "apikey": apikey,
                        "_id": diagnosisId,
                        "dr": "ENCOUNTER_ID|" + encounterId
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
                            "err_msg": "Diagnosis has been update in this encounter.",
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
                    "err_msg": "Ecounter Id not found"
                  });
                }
              })
						})
						if (validator.isEmpty(roleCode)) {
              myEmitter.emit('checkEncounterID');
            } else {
              checkCode(apikey, roleCode, 'DIAGNOSIS_ROLE', function (resRoleCode) {
                if (resRoleCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkEncounterID');
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
		},
		hospitalization: function updateHospitalization(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var encounterId = req.params.encounter_id;
      var hospitalizationId = req.params.hospitalization_id;

      var err_code = 0;
      var err_msg = "";
      var dataHospitalization = {};
			
			if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Encounter Id is required.";
      }
			if (typeof hospitalizationId !== 'undefined') {
        if (validator.isEmpty(hospitalizationId)) {
          err_code = 2;
          err_msg = "Hospitalization id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Hospitalization id is required";
      }
			if (typeof req.body.origin !== 'undefined') {
        var originId = req.body.origin.trim().toLowerCase();
        if (validator.isEmpty(originId)) {
          originId = "";
        }
        dataHospitalization.encounter_hospitalization_origin = originId;
      } else {
        originId = "";
      }
			if (typeof req.body.admitSource !== 'undefined') {
        var admitSourceCode = req.body.admitSource.trim().toLowerCase();
        if (validator.isEmpty(admitSourceCode)) {
          admitSourceCode = "";
        }
        dataHospitalization.encounter_hospitalization_admit_source = admitSourceCode;
      } else {
        admitSourceCode = "";
      }
			if (typeof req.body.reAddmission !== 'undefined') {
        var reAddmissionCode = req.body.reAddmission.trim().toUpperCase();
        if (validator.isEmpty(reAddmissionCode)) {
          reAddmissionCode = "";
        }
        dataHospitalization.encounter_hospitalization_re_addmission = reAddmissionCode;
      } else {
        reAddmissionCode = "";
      }
			if (typeof req.body.dietPreference !== 'undefined') {
        var dietPreferenceCode = req.body.dietPreference.trim().toLowerCase();
        if (validator.isEmpty(dietPreferenceCode)) {
          dietPreferenceCode = "";
        }
        dataHospitalization.encounter_hospitalization_diet_preference = dietPreferenceCode;
      } else {
        dietPreferenceCode = "";
      }
			if (typeof req.body.specialCourtesy !== 'undefined') {
        var specialCourtesyCode = req.body.specialCourtesy.trim().toUpperCase();
        if (validator.isEmpty(specialCourtesyCode)) {
          specialCourtesyCode = "";
        }
        dataHospitalization.encounter_hospitalization_special_courtesy = specialCourtesyCode;
      } else {
        specialCourtesyCode = "";
      }
			if (typeof req.body.specialArrangement !== 'undefined') {
        var specialArrangementCode = req.body.specialArrangement.trim().toLowerCase();
        if (validator.isEmpty(specialArrangementCode)) {
          specialArrangementCode = "";
        }
        dataHospitalization.encounter_hospitalization_special_arrangement = specialArrangementCode;
      } else {
        specialArrangementCode = "";
      }
			if (typeof req.body.destination !== 'undefined') {
        var destinationId = req.body.destination.trim().toLowerCase();
        if (validator.isEmpty(destinationId)) {
          destinationId = "";
        }
        dataHospitalization.encounter_hospitalization_destination = destinationId;
      } else {
        destinationId = "";
      }
			if (typeof req.body.dischargeDisposition !== 'undefined') {
        var dischargeDispositionCode = req.body.dischargeDisposition.trim().toLowerCase();
        if (validator.isEmpty(dischargeDispositionCode)) {
          dischargeDispositionCode = "";
        }
        dataHospitalization.encounter_hospitalization_discharge_dispotition = dischargeDispositionCode;
      } else {
        dischargeDispositionCode = "";
      }
			if (typeof req.body.identifier !== 'undefined') {
        var identifierId = req.body.identifier.trim().toLowerCase();
        if (validator.isEmpty(identifierId)) {
          identifierId = "";
        }
        dataHospitalization.identifier_id = identifierId;
      } else {
        identifierId = "";
      }
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkEncounterID', function () {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterID) {
                if (resEncounterID.err_code > 0) {
                  checkUniqeValue(apikey, "ENCOUNTER_HOSPITALIZATION_ID|" + hospitalizationId, 'ENCOUNTER_HOSPITALIZATION', function (resHosID) {
                    if (resHosID.err_code > 0) {
                      ApiFHIR.put('encounterHospitalization', {
                        "apikey": apikey,
                        "_id": hospitalizationId,
                        "dr": "ENCOUNTER_ID|" + encounterId
                      }, {
                        body: dataHospitalization,
                        json: true
                      }, function (error, response, body) {
                        hospitalization = body;
                        if (hospitalization.err_code > 0) {
                          res.json(hospitalization);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Hospitalization has been update in this encounter.",
                            "data": hospitalization.data
                          });
                        }
                      })
                    } else {
                      res.json({
                        "err_code": 503,
                        "err_msg": "Hospitalization Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Ecounter Id not found"
                  });
                }
              })
						})
						myEmitter.prependOnceListener('checkIdentifier', function () {
							if (!validator.isEmpty(identifierId)) {
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
									if (resIdentifierID.err_code > 0) {
										myEmitter.emit('checkEncounterID');
									} else {
										res.json({
											"err_code": 508,
											"err_msg": "Identifier Id not found."
										});
									}
								})
							} else {
								myEmitter.emit('checkEncounterID');
							}
						})
						//hospitalization dischargeDisposition
						myEmitter.prependOnceListener('checkDischargeDisposition', function () {
							if (!validator.isEmpty(dischargeDispositionCode)) {
								checkCode(apikey, dischargeDispositionCode, 'ENCOUNTER_DISCHARGE_DISPOSITION', function (resHosDiscDispCode) {
									if (resHosDiscDispCode.err_code > 0) {
										myEmitter.emit('checkIdentifier');
									} else {
										res.json({
											"err_code": 507,
											"err_msg": "dischargeDisposition code not found."
										});
									}
								})
							} else {
								myEmitter.emit('checkIdentifier');
							}
						})
						//hospitalization destination
						myEmitter.prependOnceListener('checkDestination', function () {
							if (!validator.isEmpty(destinationId)) {
								checkUniqeValue(apikey, "LOCATION_ID|" + destinationId, 'LOCATION', function (resHosDestinationId) {
									if (resHosDestinationId.err_code > 0) {
										myEmitter.emit('checkDischargeDisposition');
									} else {
										res.json({
											"err_code": 506,
											"err_msg": "Destination Id not found."
										});
									}
								})
							} else {
								myEmitter.emit('checkDischargeDisposition');
							}
						})
						//hospitalization specialArrangement
						myEmitter.prependOnceListener('checkSpecialArrangement', function () {
							if (!validator.isEmpty(specialArrangementCode)) {
								checkCode(apikey, specialArrangementCode, 'ENCOUNTER_SPECIAL_ARRANGEMENTS', function (resHosSpecialArrCode) {
									if (resHosSpecialArrCode.err_code > 0) {
										myEmitter.emit('checkDestination');
									} else {
										res.json({
											"err_code": 505,
											"err_msg": "specialArrangement code not found."
										});
									}
								})
							} else {
								myEmitter.emit('checkDestination');
							}
						})
						//hospitalization specialCourtesy
						myEmitter.prependOnceListener('checkSpecialCourtesy', function () {
							if (!validator.isEmpty(specialCourtesyCode)) {
								checkCode(apikey, specialCourtesyCode, 'ENCOUNTER_SPECIAL_COURTESY', function (resHosSpecialCourtesyCode) {
									if (resHosSpecialCourtesyCode.err_code > 0) {
										myEmitter.emit('checkSpecialArrangement');
									} else {
										res.json({
											"err_code": 504,
											"err_msg": "specialCourtesy code not found."
										});
									}
								})
							} else {
								myEmitter.emit('checkSpecialArrangement');
							}
						})
						//hospitalization dietPreference
						myEmitter.prependOnceListener('checkDietPreference', function () {
							if (!validator.isEmpty(dietPreferenceCode)) {
								checkCode(apikey, dietPreferenceCode, 'ENCOUNTER_DIET', function (resHosDietPreferenceCode) {
									if (resHosDietPreferenceCode.err_code > 0) {
										myEmitter.emit('checkSpecialCourtesy');
									} else {
										res.json({
											"err_code": 503,
											"err_msg": "dietPreference code not found."
										});
									}
								})
							} else {
								myEmitter.emit('checkSpecialCourtesy');
							}
						})
						//hospitalization AdmitSource
						myEmitter.prependOnceListener('checkAdmitSource', function () {
							if (!validator.isEmpty(admitSourceCode)) {
								checkCode(apikey, admitSourceCode, 'ENCOUNTER_ADMIT_SOURCE', function (resHosAdmitSourceCode) {
									if (resHosAdmitSourceCode.err_code > 0) {
										myEmitter.emit('checkDietPreference');
									} else {
										res.json({
											"err_code": 502,
											"err_msg": "AdmitSource code not found."
										});
									}
								})
							} else {
								myEmitter.emit('checkDietPreference');
							}
						})
						//hospitalization origin						
						if (!validator.isEmpty(originId)) {
							checkUniqeValue(apikey, "LOCATION_ID|" + originId, 'LOCATION', function (resHosOriginId) {
								if (resHosOriginId.err_code > 0) {
									myEmitter.emit('checkAdmitSource');
								} else {
									res.json({
										"err_code": 501,
										"err_msg": "Origin Id not found."
									});
								}
							})
						} else {
							myEmitter.emit('checkAdmitSource');
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
		participant: function updateParticipant(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var encounterId = req.params.encounter_id;
      var participantId = req.params.participant_id;

      var err_code = 0;
      var err_msg = "";
      var dataParticipant = {};
			
			if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Encounter Id is required.";
      }
			if (typeof participantId !== 'undefined') {
        if (validator.isEmpty(participantId)) {
          err_code = 2;
          err_msg = "Participant id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Participant id is required";
      }
			if (typeof req.body.type !== 'undefined') {
        var typeCode = req.body.type.trim().toLowerCase();
        if (validator.isEmpty(typeCode)) {
          typeCode = "";
        }
        dataParticipant.encounter_participant_type = typeCode;
      } else {
        typeCode = "";
      }
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          periodStart = arrPeriod[0];
          periodEnd = arrPeriod[1];
          if (!regex.test(periodStart) && !regex.test(periodEnd)) {
            err_code = 2;
            err_msg = "Period invalid date format.";
          } else {
            dataParticipant.encounter_participant_period_start = periodStart;
            dataParticipant.encounter_participant_period_end = periodEnd;
          }
        } else {
          err_code = 1;
          err_msg = "Period request format is wrong, `ex: start to end` ";
        }
      } else {
				periodStart = "";
				periodEnd ="";
			}
			if (typeof req.body.individual !== 'undefined') {
				if (typeof req.body.individual.practitioner !== 'undefined') {
					var practitionerId = req.body.individual.practitioner.trim().toLowerCase();
					if (validator.isEmpty(practitionerId)) {
						practitionerId = "";
					}
					dataParticipant.individual_practitioner_id = practitionerId;
				} else {
					practitionerId = "";
				}
				if (typeof req.body.individual.related_person !== 'undefined') {
					var relatedPersonId = req.body.individual.related_person.trim().toLowerCase();
					if (validator.isEmpty(relatedPersonId)) {
						relatedPersonId = "";
					}
					dataParticipant.individual_related_person_id = relatedPersonId;
				} else {
					relatedPersonId = "";
				}
			} else {
				practitionerId = "";
				relatedPersonId = "";
			}
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						myEmitter.once('checkEncounterID', function () {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEpisodeOfCareID) {
                if (resEpisodeOfCareID.err_code > 0) {
                  checkUniqeValue(apikey, "ENCOUNTER_PARTICIPANT_ID|" + participantId, 'ENCOUNTER_PARTICIPANT', function (resClassHistoryID) {
                    if (resClassHistoryID.err_code > 0) {
                      ApiFHIR.put('encounterParticipant', {
                        "apikey": apikey,
                        "_id": participantId,
                        "dr": "ENCOUNTER_ID|" + encounterId
                      }, {
                        body: dataParticipant,
                        json: true
                      }, function (error, response, body) {
                        participant = body;
                        if (participant.err_code > 0) {
                          res.json(participant);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Participant has been update in this encounter.",
                            "data": participant.data
                          });
                        }
                      })
                    } else {
                      res.json({
                        "err_code": 503,
                        "err_msg": "Participant Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Encounter Id not found"
                  });
                }
              })
						})
						//participant individual practitioner
						myEmitter.prependOnceListener('checkParticipantRelatedPerson', function () {
							if (!validator.isEmpty(relatedPersonId)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function (resRelatedPersonId) {
									if (resRelatedPersonId.err_code > 0) {
										myEmitter.emit('checkEncounterID');
									} else {
										res.json({
											"err_code": "514",
											"err_msg": "Related Person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEncounterID');
							}
						})
						//participant individual practitioner
						myEmitter.prependOnceListener('checkParticipantPractitioner', function () {
							if (!validator.isEmpty(practitionerId)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + practitionerId, 'PRACTITIONER', function (resPractitionerId) {
									if (resPractitionerId.err_code > 0) {
										myEmitter.emit('checkParticipantRelatedPerson');
									} else {
										res.json({
											"err_code": "514",
											"err_msg": "Practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantRelatedPerson');
							}
						})
						if (validator.isEmpty(typeCode)) {
              myEmitter.emit('checkParticipantPractitioner');
            } else {
              checkCode(apikey, typeCode, 'ENCOUNTER_PARTICIPANT_TYPE', function (resTypeCode) {
                if (resTypeCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkParticipantPractitioner');
                } else {
                  res.json({
                    "err_code": 501,
                    "err_msg": "Type code not found"
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
		location: function updateLocation(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var encounterId = req.params.encounter_id;
      var locationId = req.params.location_id;

      var err_code = 0;
      var err_msg = "";
      var dataLocation = {};
			
			if (typeof encounterId !== 'undefined') {
        if (validator.isEmpty(encounterId)) {
          err_code = 2;
          err_msg = "Encounter Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Encounter Id is required.";
      }
			if (typeof locationId !== 'undefined') {
        if (validator.isEmpty(locationId)) {
          err_code = 2;
          err_msg = "Encoounter location id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Encoounter location id is required";
      }
			if (typeof req.body.status !== 'undefined') {
        var statusCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(statusCode)) {
          statusCode = "";
        }
        dataLocation.encounter_location_status = statusCode;
      } else {
        statusCode = "";
      }
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          periodStart = arrPeriod[0];
          periodEnd = arrPeriod[1];
          if (!regex.test(periodStart) && !regex.test(periodEnd)) {
            err_code = 2;
            err_msg = "Period invalid date format.";
          } else {
            dataLocation.encounter_location_period_start = periodStart;
            dataLocation.encounter_location_period_end = periodEnd;
          }
        } else {
          err_code = 1;
          err_msg = "Period request format is wrong, `ex: start to end` ";
        }
      } else {
				periodStart = "";
				periodEnd ="";
			}
			if (typeof req.body.location !== 'undefined') {
        var locId = req.body.location.trim().toLowerCase();
        if (validator.isEmpty(locId)) {
          err_code = 2;
          err_msg = "Location id is empty";
        } else {
          dataLocation.location_id = locId;
        }
      } else {
        locId = "";
      }
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						myEmitter.once('checkEncounterID', function () {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEpisodeOfCareID) {
                if (resEpisodeOfCareID.err_code > 0) {
                  checkUniqeValue(apikey, "ENCOUNTER_LOCATION_ID|" + locationId, 'ENCOUNTER_LOCATION', function (resLocationID) {
                    if (resLocationID.err_code > 0) {
											ApiFHIR.put('encounterLocation', {
												"apikey": apikey,
												"_id": locationId,
												"dr": "ENCOUNTER_ID|" + encounterId
											}, {
												body: dataLocation,
												json: true
											}, function (error, response, body) {
												location = body;
												if (location.err_code > 0) {
													res.json(location);
												} else {
													res.json({
														"err_code": 0,
														"err_msg": "Location has been update in this encounter.",
														"data": location.data
													});
												}
											})
                    } else {
                      res.json({
                        "err_code": 503,
                        "err_msg": "Encounter location Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Encounter Id not found"
                  });
                }
              })
						})
						myEmitter.prependOnceListener('checkLocationID', function () {
							if (!validator.isEmpty(locId)) {
								checkUniqeValue(apikey, "LOCATION_ID|" + locId, 'LOCATION', function (resLocId) {
									if (resLocId.err_code > 0) { //code > 0 => data valid
										myEmitter.emit('checkEncounterID');
									} else {
										res.json({
											"err_code": 501,
											"err_msg": "Location Id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEncounterID');
							}
						})
						if (!validator.isEmpty(statusCode)) {
							checkCode(apikey, statusCode, 'LOCATION_STATUS', function (resLocationStatusCode) {
								if (resLocationStatusCode.err_code > 0) {
									myEmitter.emit('checkLocationID');
								} else {
									res.json({
										"err_code": 501,
										"err_msg": "Location Status code not found."
									});
								}
							})
						} else {
							myEmitter.emit('checkLocationID');
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