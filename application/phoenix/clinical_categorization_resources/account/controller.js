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

<<<<<<< HEAD
// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js")); 
var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");
=======
var hostHbase = configYaml.hbase.host;

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js")); 
var db = new phoenix("jdbc:phoenix:" + hostHbase + ":/hbase-unsecure");
>>>>>>> hcs

var controller = {
	get: {
		account: function getAccount(req, res) {
			var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var accountId = req.query._id;
			var balance = req.query.balance;
			var identifier = req.query.identifier;
			var name = req.query.name;
			var owner = req.query.owner; //_organization_id;
			var patient = req.query.patient;
			var period = req.query.period;
			var status = req.query.status;
			var subject = req.query.subject;
			var type = req.query.type;
			
			//susun query
      var condition = "";
      var join = "";
			
			if (typeof accountId !== 'undefined' && accountId !== "") {
        condition += "acc.account_id = '" + accountId + "' AND ";
      }
			if (typeof balance !== 'undefined' && balance !== "") {
        condition += "acc.account_balance = '" + balance + "' AND ";
      }
			if ((typeof identifier !== 'undefined' && identifier !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.account_id = acc.account_id ";
				if (typeof identifier !== 'undefined' && identifier !== "") {
          condition += "i.identifier_value = '" + identifier + "' AND ";
				}
      }
			if (typeof name !== 'undefined' && name !== "") {
        condition += "acc.account_name = '" + name + "' AND ";
      }
			if (typeof owner !== 'undefined' && owner !== "") {
        condition += "acc.owner_organization_id = '" + owner + "' AND ";
      }
			if (typeof patient !== 'undefined' && patient !== "") {
        condition += "acc.subject_patient_id = '" + patient + "' AND ";
      }
			if (typeof period !== 'undefined' && period !== "") {
        condition += "acc.account_period_start <= to_date('" + period + "', 'yyyy-MM-dd') AND acc.account_period_end >= to_date('" + period + "', 'yyyy-MM-dd') AND";
      }
			if (typeof status !== 'undefined' && status !== "") {
        condition += "acc.account_status = '" + status + "' AND ";
      }
			if (typeof subject !== 'undefined' && subject !== "") {
        condition += "acc.subject_practitioner_id = '" + subject + "' OR acc.subject_organization_id = '" + subject + "' OR acc.subject_device_id = '" + subject + "' OR acc.subject_patient_id = '" + subject + "' OR acc.subject_healthcare_service_id = '" + subject  + "' OR acc.subject_location_id = '" + subject + "' AND ";
      }
			if (typeof type !== 'undefined' && type !== "") {
        condition += "acc.account_type = '" + type + "' AND ";
      }
			
			if (condition == "") {
        fixCondition = "";
      } else {
        fixCondition = join + " WHERE  " + condition.slice(0, -4);
      }
			
			var arrAccount = [];
			
			var query = "SELECT acc.account_id as id, acc.account_status as acc_status, acc.account_type as acc_type, acc.account_name as acc_name, acc.subject_patient_id as subj_patient, acc.subject_device_id as subj_device, acc.subject_practitioner_id as subj_practitioner, acc.subject_location_id as subj_location, acc.subject_healthcare_service_id as subj_healthcare_service, acc.subject_organization_id as subj_org, acc.account_period_start as period_start, acc.account_period_end as period_end, acc.account_active_start as active_start, acc.account_active_end as active_end, acc.account_balance as acc_balance, acc.owner_organization_id as owner, acc.account_description as acc_description, acc.episode_of_care_id as episode_of_care, acc.encounter_id as encounter FROM BACIRO_FHIR.ACCOUNT acc " + fixCondition;
			
			//console.log(query);
			db.query(query, function (dataJson) {
        rez = lowercaseObject(dataJson);
        for (i = 0; i < rez.length; i++) {
          var Account = {};
					var arrSubject = [];
					var Subject = {};
					if(rez[i].subj_patient != "null"){
						Subject.Patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subj_patient;
					} else {
						Subject.Patient = "";
					}
					if(rez[i].subj_device != "null"){
						Subject.Device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].subj_device;
					} else {
						Subject.Device = "";
					}
					if(rez[i].subj_practitioner != "null"){
						Subject.Practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].subj_practitioner;
					} else {
						Subject.Practitioner = "";
					}
					if(rez[i].subj_location != "null"){
						Subject.Location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].subj_location;
					} else {
						Subject.Location = "";
					}
					if(rez[i].subj_healthcare_service != "null"){
						Subject.HealthcareService = hostFHIR + ':' + portFHIR + '/' + apikey + '/HealthcareService?_id=' +  rez[i].subj_healthcare_service;
					} else {
						Subject.HealthcareService = "";
					}
					if(rez[i].subj_org != "null"){
						Subject.Organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].subj_org;
					} else {
						Subject.Organization = "";
					}
					
					arrSubject[i] = Subject;
					
          Account.resourceType = "Account";
          Account.id = rez[i].id;
          Account.status = rez[i].acc_status;
          Account.type = rez[i].acc_type;
          Account.name = rez[i].acc_name;
          Account.subject = arrSubject[i];					
					Account.period = formatDate(rez[i].period_start) + " to " + formatDate(rez[i].period_end);
					Account.active = formatDate(rez[i].active_start) + " to " + formatDate(rez[i].active_end);
					Account.balance = rez[i].acc_balance;
					if(rez[i].owner != "null"){
						Account.owner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].owner;
					} else {
						Account.owner = "";
					}
					Account.description = rez[i].acc_description;

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
		},
		guarantor: function getGuarantor(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var guarantorId = req.query._id;
			var accountId = req.query.account_id;

			//susun query
			var condition = "";

			if (typeof guarantorId !== 'undefined' && guarantorId !== "") {
				condition += "account_guarantor_id = '" + guarantorId + "' AND ";
			}

			if (typeof accountId !== 'undefined' && accountId !== "") {
				condition += "account_id = '" + accountId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrGuarantor = [];
			var arrParty = [];
			var query = "SELECT account_guarantor_id, party_patient_id, party_related_person_id, party_organization_id, account_guarantor_on_hold, account_guarantor_period_start, account_guarantor_period_end FROM BACIRO_FHIR.ACCOUNT_GUARANTOR " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Guarantor = {};
					var Party = {};
					if(rez[i].party_patient_id != "null"){
						Party.Patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].party_patient_id;
					} else {
						Party.Patient = "";
					}
					if(rez[i].party_related_person_id != "null"){
						Party.RelatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].party_related_person_id;
					} else {
						Party.RelatedPerson = "";
					}
					if(rez[i].party_organization_id != "null"){
						Party.Organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].party_organization_id;
					} else {
						Party.Organization = "";
					}
					arrParty[i] = Party;
					
					Guarantor.id = rez[i].account_guarantor_id;
					Guarantor.party = arrParty[i];
					Guarantor.onHold = rez[i].account_guarantor_on_hold;
					Guarantor.period = formatDate(rez[i].account_guarantor_period_start) + " to " + formatDate(rez[i].account_guarantor_period_end);

					arrGuarantor[i] = Guarantor;
				}
				res.json({
					"err_code": 0,
					"data": arrGuarantor
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getGuarantor"
				});
			});
		},
		coverage: function getCoverage(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var coverageId = req.query._id;
			var accountId = req.query.account_id;

			//susun query
			var condition = "";

			if (typeof coverageId !== 'undefined' && coverageId !== "") {
				condition += "account_coverage_id = '" + coverageId + "' AND ";
			}

			if (typeof accountId !== 'undefined' && accountId !== "") {
				condition += "account_id = '" + accountId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrCoverage = [];
			var query = "SELECT account_coverage_id, coverage_id, account_coverage_priority FROM BACIRO_FHIR.ACCOUNT_COVERAGE " + fixCondition;
<<<<<<< HEAD
			console.log(query)
=======
			//console.log(query)
>>>>>>> hcs
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Coverage = {};
					Coverage.id = rez[i].account_coverage_id;
					if(rez[i].coverage_id != "null"){
						Coverage.coverage = hostFHIR + ':' + portFHIR + '/' + apikey + '/Coverage?_id=' +  rez[i].coverage_id;
					} else {
						Coverage.coverage = "";
					}
					Coverage.priority = rez[i].account_coverage_priority;

					arrCoverage[i] = Coverage;
				}
				res.json({
					"err_code": 0,
					"data": arrCoverage
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCoverage"
				});
			});
		}
	},
  post: {
    account: function addAccount(req, res) {
      var id = req.body.account_id;
			var status = req.body.account_status;
			var type = req.body.account_type;
			var name = req.body.account_name;
			var sub_patient_id = req.body.subject_patient_id;
			var sub_device_id = req.body.subject_device_id;
			var sub_practitioner_id = req.body.subject_practitioner_id;
			var sub_location_id = req.body.subject_location_id;
			var sub_healthcare_service_id = req.body.subject_healthcare_service_id;
			var sub_organization_id = req.body.subject_organization_id;
			var period_start = req.body.account_period_start;
			var period_end = req.body.account_period_end;
			var active_start = req.body.account_active_start;
			var active_end = req.body.account_active_end;
			var balance = req.body.account_balance;
			var owner_organization_id = req.body.owner_organization_id;
			var description = req.body.account_description;
			var episode_of_care_id = req.body.episode_of_care_id;
			var encounter_id = req.body.encounter_id;
			
			//susun query
      var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'account_status,';
        values += "'" + status + "',";
      }
			if (typeof type !== 'undefined' && type !== "") {
        column += 'account_type,';
        values += "'" + type + "',";
      }
			if (typeof name !== 'undefined' && name !== "") {
        column += 'account_name,';
        values += "'" + name + "',";
      }
			if (typeof sub_patient_id !== 'undefined' && sub_patient_id !== "") {
        column += 'subject_patient_id,';
        values += "'" + sub_patient_id + "',";
      }
			if (typeof sub_device_id !== 'undefined' && sub_device_id !== "") {
        column += 'subject_device_id,';
        values += "'" + sub_device_id + "',";
      }
			if (typeof sub_practitioner_id !== 'undefined' && sub_practitioner_id !== "") {
        column += 'subject_practitioner_id,';
        values += "'" + sub_practitioner_id + "',";
      }
			if (typeof sub_location_id !== 'undefined' && sub_location_id !== "") {
        column += 'subject_location_id,';
        values += "'" + sub_location_id + "',";
      }
			if (typeof sub_healthcare_service_id !== 'undefined' && sub_healthcare_service_id !== "") {
        column += 'subject_healthcare_service_id,';
        values += "'" + sub_healthcare_service_id + "',";
      }
			if (typeof sub_organization_id !== 'undefined' && sub_organization_id !== "") {
        column += 'subject_organization_id,';
        values += "'" + sub_organization_id + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					account_period_start = null;
				} else {
					account_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'account_period_start,';
				values += account_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					account_period_end = null;
				} else {
					account_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'account_period_end,';
				values += account_period_end + ",";
			}
			if (typeof active_start !== 'undefined' && active_start !== "") {
				if (active_start == "") {
					account_active_start = null;
				} else {
					account_active_start = "to_date('" + active_start + "', 'yyyy-MM-dd')";
				}
				column += 'account_active_start,';
				values += account_active_start + ",";
			}
			if (typeof active_end !== 'undefined' && active_end !== "") {
				if (active_end == "") {
					account_active_end = null;
				} else {
					account_active_end = "to_date('" + active_end + "', 'yyyy-MM-dd')";
				}
				column += 'account_active_end,';
				values += account_active_end + ",";
			}
			if (typeof balance !== 'undefined' && balance !== "") {
        column += 'account_balance,';
        values += "'" + balance + "',";
      }
			if (typeof owner_organization_id !== 'undefined' && owner_organization_id !== "") {
        column += 'owner_organization_id,';
        values += "'" + owner_organization_id + "',";
      }
			if (typeof description !== 'undefined' && description !== "") {
        column += 'account_description,';
        values += "'" + description + "',";
      }
			if (typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== "") {
        column += 'episode_of_care_id,';
        values += "'" + episode_of_care_id + "',";
      }
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }

			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT(ACCOUNT_ID, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
<<<<<<< HEAD
			console.log(query)
=======
			//console.log(query)
>>>>>>> hcs
      db.upsert(query, function (succes) {
        var query = "SELECT ACCOUNT_ID, ACCOUNT_STATUS, ACCOUNT_TYPE, ACCOUNT_NAME, SUBJECT_PATIENT_ID, SUBJECT_DEVICE_ID, SUBJECT_PRACTITIONER_ID, SUBJECT_LOCATION_ID, SUBJECT_HEALTHCARE_SERVICE_ID, SUBJECT_ORGANIZATION_ID, ACCOUNT_PERIOD_START, ACCOUNT_PERIOD_END, ACCOUNT_ACTIVE_START, ACCOUNT_ACTIVE_END, ACCOUNT_BALANCE, OWNER_ORGANIZATION_ID, ACCOUNT_DESCRIPTION, EPISODE_OF_CARE_ID, ENCOUNTER_ID FROM BACIRO_FHIR.ACCOUNT WHERE ACCOUNT_ID = '" + id + "' ";
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
            "function": "addAccount"
          });
        });
      }, function (e) {
        res.json({
          "err_code": 2,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "addAccount"
        });
      });
    },
		coverage: function addCoverage(req, res) {
			
			var id = req.body.account_coverage_id;
			var coverage_id = req.body.coverage_id;
			var coverage_priority = req.body.account_coverage_priority;
			var account_id = req.body.account_id;
			
			//susun query
      var column = "";
      var values = "";
			
			if (typeof coverage_id !== 'undefined' && coverage_id !== "") {
        column += 'coverage_id,';
        values += "'" + coverage_id + "',";
      }
			if (typeof coverage_priority !== 'undefined' && coverage_priority !== "") {
        column += 'account_coverage_priority,';
        values += coverage_priority + ",";
      }
			if (typeof account_id !== 'undefined' && account_id !== "") {
        column += 'account_id,';
        values += "'" + account_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT_COVERAGE(ACCOUNT_COVERAGE_ID, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
<<<<<<< HEAD
			console.log(query)
=======
			//console.log(query)
>>>>>>> hcs
			db.upsert(query, function (succes) {
				var query = "SELECT account_coverage_id, coverage_id, account_coverage_priority, account_id FROM BACIRO_FHIR.ACCOUNT_COVERAGE WHERE account_coverage_id = '" + id + "' ";
				
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
						"function": "addCoverage"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addCoverage"
				});
			});
		},
		guarantor: function addGuarantor(req, res) {
			var id = req.body.account_guarantor_id;
			var patient_id = req.body.party_patient_id;
			var person_id = req.body.party_related_person_id;
			var organization_id = req.body.party_organization_id;
			var on_hold = req.body.account_guarantor_on_hold;
			var period_start = req.body.account_guarantor_period_start;
			var period_end = req.body.account_guarantor_period_end;
			var account_id = req.body.account_id;
			
			//susun query
      var column = "";
      var values = "";
			
			if (typeof patient_id !== 'undefined' && patient_id !== "") {
        column += 'party_patient_id,';
        values += "'" + patient_id + "',";
      }
			if (typeof person_id !== 'undefined' && person_id !== "") {
        column += 'party_related_person_id,';
        values += "'" + person_id + "',";
      }
			if (typeof organization_id !== 'undefined' && organization_id !== "") {
        column += 'party_organization_id,';
        values += "'" + organization_id + "',";
      }
			if (typeof on_hold !== 'undefined' && on_hold !== "") {
        column += 'account_guarantor_on_hold,';
        values += on_hold + ",";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					guarantor_period_start = null;
				} else {
					guarantor_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'account_guarantor_period_start,';
				values += guarantor_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					guarantor_period_end = null;
				} else {
					guarantor_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'account_guarantor_period_end,';
				values += guarantor_period_end + ",";
			}
			if (typeof account_id !== 'undefined' && account_id !== "") {
        column += 'account_id,';
        values += "'" + account_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT_GUARANTOR(account_guarantor_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
<<<<<<< HEAD
			console.log(query)
			db.upsert(query, function (succes) {
				var query = "SELECT account_guarantor_id, party_patient_id, party_related_person_id, party_organization_id, account_guarantor_on_hold, account_guarantor_period_start, account_guarantor_period_end, account_id FROM BACIRO_FHIR.ACCOUNT_GUARANTOR WHERE account_guarantor_id = '" + id + "' ";
				console.log(query);
=======
			//console.log(query)
			db.upsert(query, function (succes) {
				var query = "SELECT account_guarantor_id, party_patient_id, party_related_person_id, party_organization_id, account_guarantor_on_hold, account_guarantor_period_start, account_guarantor_period_end, account_id FROM BACIRO_FHIR.ACCOUNT_GUARANTOR WHERE account_guarantor_id = '" + id + "' ";
				//console.log(query);
>>>>>>> hcs
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
						"function": "addGuarantor"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addGuarantor"
				});
			});
		}
  },
	put: {
		account: function updateAccount(req, res) {
			var account_id = req.params._id;
			
			var status = req.body.account_status;
			var type = req.body.account_type;
			var name = req.body.account_name;
			var sub_patient_id = req.body.subject_patient_id;
			var sub_device_id = req.body.subject_device_id;
			var sub_practitioner_id = req.body.subject_practitioner_id;
			var sub_location_id = req.body.subject_location_id;
			var sub_healthcare_service_id = req.body.subject_healthcare_service_id;
			var sub_organization_id = req.body.subject_organization_id;
			var period_start = req.body.account_period_start;
			var period_end = req.body.account_period_end;
			var active_start = req.body.account_active_start;
			var active_end = req.body.account_active_end;
			var balance = req.body.account_balance;
			var owner_organization_id = req.body.owner_organization_id;
			var description = req.body.account_description;
			var episode_of_care_id = req.body.episode_of_care_id;
			var encounter_id = req.body.encounter_id;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'account_status,';
        values += "'" + status + "',";
      }
			if (typeof type !== 'undefined' && type !== "") {
        column += 'account_type,';
        values += "'" + type + "',";
      }
			if (typeof name !== 'undefined' && name !== "") {
        column += 'account_name,';
        values += "'" + name + "',";
      }
			if (typeof sub_patient_id !== 'undefined' && sub_patient_id !== "") {
        column += 'subject_patient_id,';
        values += "'" + sub_patient_id + "',";
      }
			if (typeof sub_device_id !== 'undefined' && sub_device_id !== "") {
        column += 'subject_device_id,';
        values += "'" + sub_device_id + "',";
      }
			if (typeof sub_practitioner_id !== 'undefined' && sub_practitioner_id !== "") {
        column += 'subject_practitioner_id,';
        values += "'" + sub_practitioner_id + "',";
      }
			if (typeof sub_location_id !== 'undefined' && sub_location_id !== "") {
        column += 'subject_location_id,';
        values += "'" + sub_location_id + "',";
      }
			if (typeof sub_healthcare_service_id !== 'undefined' && sub_healthcare_service_id !== "") {
        column += 'subject_healthcare_service_id,';
        values += "'" + sub_healthcare_service_id + "',";
      }
			if (typeof sub_organization_id !== 'undefined' && sub_organization_id !== "") {
        column += 'subject_organization_id,';
        values += "'" + sub_organization_id + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					account_period_start = null;
				} else {
					account_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'account_period_start,';
				values += account_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					account_period_end = null;
				} else {
					account_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'account_period_end,';
				values += account_period_end + ",";
			}
			if (typeof active_start !== 'undefined' && active_start !== "") {
				if (active_start == "") {
					account_active_start = null;
				} else {
					account_active_start = "to_date('" + active_start + "', 'yyyy-MM-dd')";
				}
				column += 'account_active_start,';
				values += account_active_start + ",";
			}
			if (typeof active_end !== 'undefined' && active_end !== "") {
				if (active_end == "") {
					account_active_end = null;
				} else {
					account_active_end = "to_date('" + active_end + "', 'yyyy-MM-dd')";
				}
				column += 'account_active_end,';
				values += account_active_end + ",";
			}
			if (typeof balance !== 'undefined' && balance !== "") {
        column += 'account_balance,';
        values += "'" + balance + "',";
      }
			if (typeof owner_organization_id !== 'undefined' && owner_organization_id !== "") {
        column += 'owner_organization_id,';
        values += "'" + owner_organization_id + "',";
      }
			if (typeof description !== 'undefined' && description !== "") {
        column += 'account_description,';
        values += "'" + description + "',";
      }
			if (typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== "") {
        column += 'episode_of_care_id,';
        values += "'" + episode_of_care_id + "',";
      }
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
		
			var condition = "account_id = '" + account_id + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT(account_id," + column.slice(0, -1) + ") SELECT account_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACCOUNT WHERE " + condition;
			
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
          "function": "updateAccount"
        });
      });
		},
		guarantor: function updateGuarantor(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			var patient_id = req.body.party_patient_id;
			var person_id = req.body.party_related_person_id;
			var organization_id = req.body.party_organization_id;
			var on_hold = req.body.account_guarantor_on_hold;
			var period_start = req.body.account_guarantor_period_start;
			var period_end = req.body.account_guarantor_period_end;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof patient_id !== 'undefined' && patient_id !== "") {
        column += 'party_patient_id,';
        values += "'" + patient_id + "',";
      }
			if (typeof person_id !== 'undefined' && person_id !== "") {
        column += 'party_related_person_id,';
        values += "'" + person_id + "',";
      }
			if (typeof organization_id !== 'undefined' && organization_id !== "") {
        column += 'party_organization_id,';
        values += "'" + organization_id + "',";
      }
			if (typeof on_hold !== 'undefined' && on_hold !== "") {
        column += 'account_guarantor_on_hold,';
        values += on_hold + ",";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'account_guarantor_period_start,';
        values += "to_date('" + period_start + "', 'yyyy-MM-dd'),";
      }
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'account_guarantor_period_end,';
        values += "to_date('" + period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "account_guarantor_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "account_guarantor_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT_GUARANTOR(account_guarantor_id," + column.slice(0, -1) + ") SELECT account_guarantor_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACCOUNT_GUARANTOR WHERE " + condition;
<<<<<<< HEAD
			console.log(query)
=======
			//console.log(query)
>>>>>>> hcs
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
          "function": "updateGuarantor"
        });
      });
		},
		coverage: function updateCoverage(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			//var id = req.body.account_coverage_id;
			var coverage_id = req.body.coverage_id;
			var coverage_priority = req.body.account_coverage_priority;
			//var account_id = req.body.account_id;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof coverage_id !== 'undefined' && coverage_id !== "") {
        column += 'coverage_id,';
        values += "'" + coverage_id + "',";
      }
			if (typeof coverage_priority !== 'undefined' && coverage_priority !== "") {
        column += 'account_coverage_priority,';
        values += coverage_priority + ",";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "account_coverage_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "account_coverage_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT_COVERAGE(account_coverage_id," + column.slice(0, -1) + ") SELECT account_coverage_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACCOUNT_COVERAGE WHERE " + condition;
<<<<<<< HEAD
			console.log(query)
=======
			//console.log(query)
>>>>>>> hcs
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
          "function": "updateCoverage"
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