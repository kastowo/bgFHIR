var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//event emitter
var host = configYaml.phoenix.host;
var port = configYaml.phoenix.port;

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js")); 
//var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");
var db = new phoenix("jdbc:phoenix:" + "192.168.1.231" + ":/hbase-unsecure");

var controller = {
	get: {
		episodeOfCare: function getEpisodeOfCare(req, res) {
			var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
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
			
			//susun query
      var condition = "";
      var join = "";
			
			if (typeof episodeOfCareId !== 'undefined' && episodeOfCareId !== "") {
        condition += "eoc.episode_of_care_id = '" + episodeOfCareId + "' AND ";
      }
			if (typeof episodeOfCareCareManager !== 'undefined' && episodeOfCareCareManager !== "") {
        condition += "eoc.practitioner_id = '" + episodeOfCareCareManager + "' AND ";
      }
			if (typeof episodeOfCareCondition !== 'undefined' && episodeOfCareCondition !== "") {
				join += " LEFT JOIN BACIRO_FHIR.EPISODE_OF_CARE_DIAGNOSIS dia ON dia.episode_of_care_id = eoc.episode_of_care_id ";
        if (typeof 	episodeOfCareCondition !== 'undefined' && episodeOfCareCondition !== "") {
          condition += "dia.condition_id = '" + episodeOfCareCondition + "' AND ";
        }
      }
			if (typeof episodeOfCareDate !== 'undefined' && episodeOfCareDate !== "") {
				condition += "eoc.episode_of_care_period_start <= to_date('" + episodeOfCareDate + "', 'yyyy-MM-dd') AND eoc.episode_of_care_period_end >= to_date('" + episodeOfCareDate + "', 'yyyy-MM-dd') AND";
      }
			if ((typeof episodeOfCareIdentifier !== 'undefined' && episodeOfCareIdentifier !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.episode_of_care_id = eoc.episode_of_care_id ";
				if (typeof episodeOfCareIdentifier !== 'undefined' && episodeOfCareIdentifier !== "") {
          condition += "i.identifier_value = '" + episodeOfCareIdentifier + "' AND ";
				}
      }
			if ((typeof episodeOfCareReferral !== 'undefined' && episodeOfCareReferral !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.REFERRAL_REQUEST ref ON ref.episode_of_care_id = eoc.episode_of_care_id ";
				if ((typeof episodeOfCareReferral !== 'undefined' && episodeOfCareReferral !== "")) {
          condition += "ref.referral_request_id = '" + episodeOfCareReferral + "' AND ";
				}
      }
			if (typeof episodeOfCareOrg !== 'undefined' && episodeOfCareOrg !== "") {
        condition += "eoc.organization_id = '" + episodeOfCareOrg + "' AND ";
      }
			if (typeof episodeOfCarePatient !== 'undefined' && episodeOfCarePatient !== "") {
        condition += "eoc.patient_id = '" + episodeOfCarePatient + "' AND ";
      }
			if (typeof episodeOfCareStatus !== 'undefined' && episodeOfCareStatus !== "") {
        condition += "eoc.episode_of_care_status = '" + episodeOfCareStatus + "' AND ";
      }
			if (typeof episodeOfCareType !== 'undefined' && episodeOfCareType !== "") {
        condition += "eoc.episode_of_care_type = '" + episodeOfCareType + "' AND ";
      }
			
			if (condition == "") {
        fixCondition = "";
      } else {
        fixCondition = join + " WHERE  " + condition.slice(0, -4);
      }
			
			var arrEpisodeOfCare = [];
			var query = "SELECT eoc.episode_of_care_id as id, eoc.practitioner_id as practitioner_id, eoc.episode_of_care_period_start as period_start, eoc.episode_of_care_period_end as period_end, eoc.organization_id as org_id, eoc.patient_id as patient_id, eoc.episode_of_care_status as status, eoc.episode_of_care_type as type FROM BACIRO_FHIR.EPISODE_OF_CARE eoc " + fixCondition;
			
			db.query(query, function (dataJson) {
        rez = lowercaseObject(dataJson);
        for (i = 0; i < rez.length; i++) {
          var EpisodeOfCare = {};
          EpisodeOfCare.resourceType = "EpisodeOfCare";
          EpisodeOfCare.id = rez[i].id;
          EpisodeOfCare.status = rez[i].status;
          EpisodeOfCare.type = rez[i].type;
					if(rez[i].patient_id != "null"){
						EpisodeOfCare.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient_id;
					} else {
						EpisodeOfCare.patient = "";
					}
					if(rez[i].org_id != "null"){
						EpisodeOfCare.managingOrganization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].org_id;
					} else {
						EpisodeOfCare.managingOrganization = "";
					}
					EpisodeOfCare.period = formatDate(rez[i].period_start) + " to " + formatDate(rez[i].period_end);
					if(rez[i].practitioner_id != "null"){
						EpisodeOfCare.careManager = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].practitioner_id;
					} else {
						EpisodeOfCare.careManager = "";
					}

          arrEpisodeOfCare[i] = EpisodeOfCare;
        }
        res.json({
          "err_code": 0,
          "data": arrEpisodeOfCare
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "getEpisodeOfCare"
        });
      });
		},
		statusHistory: function getStatusHistory(req, res) {
			var apikey = req.params.apikey;
			
			var statusHistoryId = req.query._id;
			var episodeOfCareId = req.query.episode_of_care_id;

			//susun query
			var condition = "";

			if (typeof statusHistoryId !== 'undefined' && statusHistoryId !== "") {
				condition += "episode_of_care_status_history_id = '" + statusHistoryId + "' AND ";
			}

			if (typeof episodeOfCareId !== 'undefined' && episodeOfCareId !== "") {
				condition += "episode_of_care_id = '" + episodeOfCareId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrStatusHistory = [];
			var query = "SELECT episode_of_care_status_history_id, episode_of_care_status_history_code, episode_of_care_status_history_period_start, episode_of_care_status_history_period_end FROM BACIRO_FHIR.EPISODE_OF_CARE_STATUS_HISTORY " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var StatusHistory = {};
					StatusHistory.id = rez[i].episode_of_care_status_history_id;
					StatusHistory.code = rez[i].episode_of_care_status_history_code;
					StatusHistory.period = formatDate(rez[i].episode_of_care_status_history_period_start) + " to " + formatDate(rez[i].episode_of_care_status_history_period_end);

					arrStatusHistory[i] = StatusHistory;
				}
				res.json({
					"err_code": 0,
					"data": arrStatusHistory
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getStatusHistory"
				});
			});
		},
		diagnosis: function getDiagnosis(req, res) {
			var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var diagnosisId = req.query._id;
			var episodeOfCareId = req.query.episode_of_care_id;
			var conditionId = req.query.condition_id;

			//susun query
			var condition = "";

			if (typeof diagnosisId !== 'undefined' && diagnosisId !== "") {
				condition += "episode_of_care_diagnosis_id = '" + diagnosisId + "' AND ";
			}

			if (typeof episodeOfCareId !== 'undefined' && episodeOfCareId !== "") {
				condition += "episode_of_care_id = '" + episodeOfCareId + "' AND ";
			}
			
			if (typeof conditionId !== 'undefined' && conditionId !== "") {
				condition += "condition_id = '" + conditionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrDiagnosis = [];
			var query = "SELECT episode_of_care_diagnosis_id, episode_of_care_diagnosis_role, episode_of_care_diagnosis_rank, condition_id FROM BACIRO_FHIR.EPISODE_OF_CARE_DIAGNOSIS " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Diagnosis = {};
					Diagnosis.id = rez[i].episode_of_care_diagnosis_id;
					if(rez[i].condition_id != "null"){
						Diagnosis.condition = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition_id;
					} else {
						Diagnosis.condition = "";
					}
					Diagnosis.role = rez[i].episode_of_care_diagnosis_role;
					Diagnosis.rank = rez[i].episode_of_care_diagnosis_rank;

					arrDiagnosis[i] = Diagnosis;
				}
				res.json({
					"err_code": 0,
					"data": arrDiagnosis
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getDiagnosis"
				});
			});
		},
		referralRequest: function getReferralRequest(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var referralRequestId = req.query._id;
			var episodeOfCareId = req.query.episode_of_care_id;
			var encounterId = req.query.encounter_id;
			
			//susun query
			var condition = "";

			if (typeof referralRequestId !== 'undefined' && referralRequestId !== "") {
				condition += "referral_request_id = '" + referralRequestId + "' AND ";
			}
			if (typeof episodeOfCareId !== 'undefined' && episodeOfCareId !== "") {
				condition += "episode_of_care_id = '" + episodeOfCareId + "' AND ";
			}
			if (typeof encounterId !== 'undefined' && encounterId !== "") {
				condition += "encounter_id = '" + encounterId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrReferralRequest = [];
			var query = "SELECT referral_request_id FROM BACIRO_FHIR.REFERRAL_REQUEST " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ReferralRequest = {};
					
					if(rez[i].referral_request_id != "null"){
						ReferralRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/referralRequest?_id=' +  rez[i].referral_request_id;
					} else {
						ReferralRequest.id = "";
					}

					arrReferralRequest[i] = ReferralRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrReferralRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getReferralRequest"
				});
			});
		},
		team: function getTeam(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var teamId = req.query._id;
			var episodeOfCareId = req.query.episode_of_care_id;
			
			//susun query
			var condition = "";

			if (typeof teamId !== 'undefined' && teamId !== "") {
				condition += "care_team_id = '" + teamId + "' AND ";
			}
			if (typeof episodeOfCareId !== 'undefined' && episodeOfCareId !== "") {
				condition += "episode_of_care_id = '" + episodeOfCareId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrTeam = [];
			var query = "SELECT care_team_id FROM BACIRO_FHIR.CARE_TEAM " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Team = {};
					
					if(rez[i].care_team_id != "null"){
						Team.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Team?_id=' +  rez[i].care_team_id;
					} else {
						Team.id = "";
					}

					arrTeam[i] = Team;
				}
				res.json({
					"err_code": 0,
					"data": arrTeam
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getTeam"
				});
			});
		},
		account: function getAccount(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var accountId = req.query._id;
			var episodeOfCareId = req.query.episode_of_care_id;
			var encounterId = req.query.encounter_id;
			
			//susun query
			var condition = "";

			if (typeof accountId !== 'undefined' && accountId !== "") {
				condition += "account_id = '" + accountId + "' AND ";
			}
			if (typeof episodeOfCareId !== 'undefined' && episodeOfCareId !== "") {
				condition += "episode_of_care_id = '" + episodeOfCareId + "' AND ";
			}
			if (typeof encounterId !== 'undefined' && encounterId !== "") {
				condition += "encounter_id = '" + encounterId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrAccount = [];
			var query = "SELECT account_id FROM BACIRO_FHIR.ACCOUNT " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Account = {};
					
					if(rez[i].account_id != "null"){
						Account.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Account?_id=' +  rez[i].account_id;
					} else {
						Account.id = "";
					}

					arrAccount[i] = Account;
				}
				res.json({
					"err_code": 0,
					"data": arrAccount
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAccount"
				});
			});
		}
	},
  post: {
    episodeOfCare: function addEpisodeOfCare(req, res) {
      var id = req.body.episode_of_care_id;
      var status = req.body.episode_of_care_status;
      var type = req.body.episode_of_care_type;
      var patient_id = req.body.patient_id;
      var organization_id = req.body.organization_id;
      var periode_start = req.body.episode_of_care_period_start;
      var periode_end = req.body.episode_of_care_period_end;
      var practitioner_id = req.body.practitioner_id;
      var encounter_id = req.body.encounter_id;

      var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE(EPISODE_OF_CARE_ID, EPISODE_OF_CARE_STATUS, EPISODE_OF_CARE_TYPE, PATIENT_ID, ORGANIZATION_ID, EPISODE_OF_CARE_PERIOD_START, EPISODE_OF_CARE_PERIOD_END, PRACTITIONER_ID, ENCOUNTER_ID)" + " VALUES ('" + id + "','" + status + "','" + type + "','" + patient_id + "','" + organization_id + "',to_date('" + periode_start + "','yyyy-MM-dd'),to_date('" + periode_end + "','yyyy-MM-dd'),'" + practitioner_id + "','" + encounter_id + "')";

      db.upsert(query, function (succes) {
        var query = "SELECT EPISODE_OF_CARE_ID, EPISODE_OF_CARE_STATUS, EPISODE_OF_CARE_TYPE, PATIENT_ID, ORGANIZATION_ID, EPISODE_OF_CARE_PERIOD_START, EPISODE_OF_CARE_PERIOD_END, PRACTITIONER_ID, ENCOUNTER_ID FROM BACIRO_FHIR.EPISODE_OF_CARE WHERE EPISODE_OF_CARE_ID = '" + id + "' ";
				console.log(query);
        db.query(query, function (dataJson) {
          rez = lowercaseObject(dataJson);
          res.json({
            "err_code": 0,
            "data": rez
          });
        }, function (e) {
          res.json({
            "err_code": 1,
            "err_msg": e,
            "application": "Api Phoenix",
            "function": "addEpisodeOfCare"
          });
        });
      }, function (e) {
        res.json({
          "err_code": 2,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "addEpisodeOfCare"
        });
      });
    },
		statusHistory: function addStatusHistory(req, res) {
			var id = req.body.episode_of_care_status_history_id;
			var code = req.body.episode_of_care_status_history_code;
			var period_start = req.body.episode_of_care_status_history_period_start;
			var period_end = req.body.episode_of_care_status_history_period_end;
			var episode_of_care_id = req.body.episode_of_care_id;
			//susun query
      var column = "";
      var values = "";
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'episode_of_care_status_history_code,';
        values += "'" + code + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					episode_of_care_status_history_period_start = null;
				} else {
					episode_of_care_status_history_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'episode_of_care_status_history_period_start,';
				values += episode_of_care_status_history_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					episode_of_care_status_history_period_end = null;
				} else {
					episode_of_care_status_history_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'episode_of_care_status_history_period_end,';
				values += episode_of_care_status_history_period_end + ",";
			}
			if (typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== "") {
        column += 'episode_of_care_id,';
        values += "'" + episode_of_care_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE_STATUS_HISTORY(episode_of_care_status_history_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			
			db.upsert(query, function (succes) {
				var arrEocHistory = [];
				var query = "SELECT episode_of_care_status_history_id, episode_of_care_status_history_code, episode_of_care_status_history_period_start, episode_of_care_status_history_period_end FROM BACIRO_FHIR.EPISODE_OF_CARE_STATUS_HISTORY WHERE episode_of_care_status_history_id = '" + id + "' ";
				console.log(query);
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
            "err_code": 0,
            "data": rez
          });
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addEpisodeOfCareHistory"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEpisodeOfCareHistory"
				});
			});
		},
		diagnosis: function addDiagnosis(req, res) {
			var id = req.body.episode_of_care_diagnosis_id;
			var role = req.body.episode_of_care_diagnosis_role;
			var rank = req.body.episode_of_care_diagnosis_rank;
			var condition_id = req.body.condition_id;
			var episode_of_care_id = req.body.episode_of_care_id;
			//susun query
      var column = "";
      var values = "";
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'episode_of_care_diagnosis_role,';
        values += "'" + role + "',";
      }
			if (typeof rank !== 'undefined' && rank !== "") {
        column += 'episode_of_care_diagnosis_rank,';
        values += rank + ",";
      }
			if (typeof condition_id !== 'undefined' && condition_id !== "") {
        column += 'condition_id,';
        values += "'" + condition_id + "',";
      }
			if (typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== "") {
        column += 'episode_of_care_id,';
        values += "'" + episode_of_care_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE_DIAGNOSIS(episode_of_care_diagnosis_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";

			db.upsert(query, function (succes) {
				var arrEocDiagnosis = [];
				var query = "SELECT episode_of_care_diagnosis_id, episode_of_care_diagnosis_role, episode_of_care_diagnosis_rank FROM BACIRO_FHIR.EPISODE_OF_CARE_DIAGNOSIS WHERE episode_of_care_diagnosis_id = '" + id + "' ";
				console.log(query);
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
            "err_code": 0,
            "data": rez
          });
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addEpisodeOfCareDiagnosis"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEpisodeOfCareDiagnosis"
				});
			});
		},
		referralRequest: function addReferralRequest(req, res) {
			var id = req.body.referral_request_id;
			var episode_of_care_id = req.body.episode_of_care_id;
			var encounter_id = req.body.encounter_id;
			//susun query
      var column = "";
      var values = "";
			
			if (typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== "") {
        column += 'episode_of_care_id,';
        values += "'" + episode_of_care_id + "',";
      }
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.REFERRAL_REQUEST(referral_request_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			
			db.upsert(query, function (succes) {
				var arrRefReq = [];
				var query = "SELECT referral_request_id FROM BACIRO_FHIR.REFERRAL_REQUEST WHERE referral_request_id = '" + id + "'";
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
            "err_code": 0,
            "data": rez
          });
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addReferralRequest"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addReferralRequest"
				});
			});
		}
  },
	put: {
		episodeOfCare: function updateEpisodeOfCare(req, res) {
			var episode_of_care_id = req.params._id;
			
			var status = req.body.status;
			var type = req.body.type;
			var patient = req.body.patient;
			var organization = req.body.organization;
			var period_start = req.body.period_start;
			var period_end = req.body.period_end;
			var practitioner = req.body.practitioner;
			var encounter_id = req.body.encounter_id;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'episode_of_care_status,';
        values += "'" + status + "',";
      }
			if (typeof type !== 'undefined' && type !== "") {
        column += 'episode_of_care_type,';
        values += "'" + type + "',";
      }
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient_id,';
        values += "'" + patient + "',";
      }
			if (typeof organization !== 'undefined' && organization !== "") {
        column += 'organization_id,';
        values += "'" + organization + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'episode_of_care_period_start,';
        values += "to_date('" + period_start + "', 'yyyy-MM-dd'),";
      }
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'episode_of_care_period_end,';
        values += "to_date('" + period_end + "', 'yyyy-MM-dd'),";
      }
			if (typeof practitioner !== 'undefined' && practitioner !== "") {
        column += 'practitioner_id,';
        values += "'" + practitioner + "',";
      }
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			
			var condition = "episode_of_care_id = '" + episode_of_care_id + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE(episode_of_care_id," + column.slice(0, -1) + ") SELECT episode_of_care_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.EPISODE_OF_CARE WHERE " + condition;
			
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateEpisodeOfCare"
        });
      });
		},
		statusHistory: function updateStatusHistory(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			var status = req.body.status;
			var period_start = req.body.period_start;
			var period_end = req.body.period_end;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'episode_of_care_status_history_code,';
        values += "'" + status + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'episode_of_care_status_history_period_start,';
        values += "to_date('" + period_start + "', 'yyyy-MM-dd'),";
      }
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'episode_of_care_status_history_period_end,';
        values += "to_date('" + period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "episode_of_care_status_history_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "episode_of_care_status_history_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE_STATUS_HISTORY(episode_of_care_status_history_id," + column.slice(0, -1) + ") SELECT episode_of_care_status_history_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.EPISODE_OF_CARE_STATUS_HISTORY WHERE " + condition;
			console.log(query)
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateStatusHistory"
        });
      });
		},
		diagnosis: function updateDiagnosis(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			var diagnosis_role = req.body.role;
			var diagnosis_rank = req.body.rank;
			var condition_id = req.body.condition;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof diagnosis_role !== 'undefined' && diagnosis_role !== "") {
        column += 'episode_of_care_diagnosis_role,';
        values += "'" + diagnosis_role + "',";
      }
			if (typeof diagnosis_rank !== 'undefined' && diagnosis_rank !== "") {
        column += 'episode_of_care_diagnosis_rank,';
        values += diagnosis_rank + ",";
      }
			if (typeof condition_id !== 'undefined' && condition_id !== "") {
        column += 'condition_id,';
        values += "'" + condition_id + "',";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "episode_of_care_diagnosis_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "episode_of_care_diagnosis_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE_DIAGNOSIS(episode_of_care_diagnosis_id," + column.slice(0, -1) + ") SELECT episode_of_care_diagnosis_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.EPISODE_OF_CARE_DIAGNOSIS WHERE " + condition;
			console.log(query)
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateDiagnosis"
        });
      });
		}
	}
}

function lowercaseObject(jsonData) {
  var rez = [];
  for (i = 0; i < jsonData.length; i++) {
    json = JSON.stringify(jsonData[i]);
    json2 = json.replace(/"([^"]+)":/g, function ($0, $1) {
        return ('"' + $1.toLowerCase() + '":');
      });
    rez[i] = JSON.parse(json2);
  }
  return rez;
}

function checkApikey(apikey) {
  var query = "SELECT user_id FROM baciro.user WHERE user_apikey = '" + apikey + "' ";

  db.query(query, function (dataJson) {
    rez = lowercaseObject(dataJson);
    return rez;
  }, function (e) {
    return {
      "err_code": 1,
      "err_msg": e,
      "application": "Api Phoenix",
      "function": "checkApikey"
    };
  });
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

module.exports = controller;