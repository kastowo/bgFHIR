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
var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");

var controller = {
	get: {
		flag: function getFlag(req, res) {
			var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var flagId = req.query._id;
			var author = req.query.author;
			var date = req.query.date;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var patient = req.query.patient;
			var subject = req.query.subject;
			
			//susun query
      var condition = "";
      var join = "";
			
			if (typeof flagId !== 'undefined' && flagId !== "") {
        condition += "fl.flag_id = '" + flagId + "' AND ";
      }
			if (typeof author !== 'undefined' && author !== "") {
        condition += "fl.author_device_id = '" + author + "' OR fl.author_organization_id = '" + author + "' OR fl.author_patient_id = '" + author + "' OR fl.author_practitioner_id = '" + author + "' AND ";
      }
			if (typeof date !== 'undefined' && date !== "") {
        condition += "fl.flag_period_start <= to_date('" + date + "', 'yyyy-MM-dd') AND fl.flag_period_end >= to_date('" + date + "', 'yyyy-MM-dd') AND";
      }
			if ((typeof encounter !== 'undefined' && encounter !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.ENCOUNTER enc ON enc.encounter_id = fl.encounter_id ";
				if (typeof encounter !== 'undefined' && encounter !== "") {
          condition += "enc.encounter_id = '" + encounter + "' AND ";
				}
      }			
			if ((typeof identifier !== 'undefined' && identifier !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.flag_id = fl.flag_id ";
				if (typeof identifier !== 'undefined' && identifier !== "") {
          condition += "i.identifier_value = '" + identifier + "' AND ";
				}
      }
			if (typeof patient !== 'undefined' && patient !== "") {
        condition += "fl.subject_patient_id = '" + patient + "' AND ";
      }
			if (typeof subject !== 'undefined' && subject !== "") {
        condition += "fl.subject_patient_id = '" + subject + "' OR fl.subject_location_id = '" + subject + "' OR fl.subject_group_id = '" + subject + "' OR fl.subject_organization_id = '" + subject + "' OR fl.subject_practitioner_id = '" + subject  + "' OR fl.subject_plan_definition_id = '" + subject + "' OR fl.subject_medication_id = '" + subject  + "' OR fl.subject_procedure_id = '" + subject + "' AND ";
      }
			
			if (condition == "") {
        fixCondition = "";
      } else {
        fixCondition = join + " WHERE " + condition.slice(0, -4);
      }
			
			var arrFlag = [];
			var arrSubject = [];
			var arrAuthor = [];
			var query = "SELECT fl.flag_id as id, fl.flag_status as flag_status, fl.flag_category as flag_category, fl.flag_code as flag_code, fl.subject_patient_id as subj_patient, fl.subject_location_id as subj_location, fl.subject_group_id as subj_group, fl.subject_organization_id as subj_org, fl.subject_practitioner_id as subj_practitioner, fl.subject_plan_definition_id as subj_plan_definition, fl.subject_medication_id as subj_medication, fl.subject_procedure_id as subj_procedure, fl.flag_period_start as period_start, fl.flag_period_end as period_end, fl.encounter_id as encounter, fl.author_device_id as author_device, fl.author_organization_id as author_org, fl.author_patient_id as author_patient, fl.author_practitioner_id as author_practitioner FROM BACIRO_FHIR.FLAG fl " + fixCondition;
			
			//console.log(query);
			db.query(query, function (dataJson) {
        rez = lowercaseObject(dataJson);
        for (i = 0; i < rez.length; i++) {
          var Flag = {};
					var Subject = {};
					if(rez[i].subj_patient != "null"){
						Subject.Patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subj_patient;
					} else {
						Subject.Patient = "";
					}
					if(rez[i].subj_location != "null"){
						Subject.Location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].subj_location;
					} else {
						Subject.Location = "";
					}
					if(rez[i].subj_group != "null"){
						Subject.Group = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subj_group;
					} else {
						Subject.Group = "";
					}
					if(rez[i].subj_org != "null"){
						Subject.Organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].subj_org;
					} else {
						Subject.Organization = "";
					}
					if(rez[i].subj_practitioner != "null"){
						Subject.Practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].subj_practitioner;
					} else {
						Subject.Practitioner = "";
					}
					if(rez[i].subj_plan_definition != "null"){
						Subject.PlanDefinition = hostFHIR + ':' + portFHIR + '/' + apikey + '/PlanDefinition?_id=' +  rez[i].subj_plan_definition;
					} else {
						Subject.PlanDefinition = "";
					}
					if(rez[i].subj_medication != "null"){
						Subject.Medication = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].subj_medication;
					} else {
						Subject.Medication = "";
					}
					if(rez[i].subj_procedure != "null"){
						Subject.Procedure = hostFHIR + ':' + portFHIR + '/' + apikey + '/Procedure?_id=' +  rez[i].subj_procedure;
					} else {
						Subject.Procedure = "";
					}
					arrSubject[i] = Subject;
					
					var Author = {};
					if(rez[i].author_device != "null"){
						Author.Device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].author_device;
					} else {
						Author.Device = "";
					}
					if(rez[i].author_org != "null"){
						Author.Organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].author_org;
					} else {
						Author.Organization = "";
					}
					if(rez[i].author_patient != "null"){
						Author.Patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].author_patient;
					} else {
						Author.Patient = "";
					}
					if(rez[i].author_practitioner != "null"){
						Author.Practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].author_practitioner;
					} else {
						Author.Practitioner = "";
					}
					arrAuthor[i] = Author;
					
          Flag.resourceType = "Flag";
          Flag.id = rez[i].id;
          Flag.status = rez[i].flag_status;
          Flag.category = rez[i].flag_category;
          Flag.code = rez[i].flag_code;
          Flag.subject = arrSubject[i];					
					Flag.period = formatDate(rez[i].period_start) + " to " + formatDate(rez[i].period_end);
					if(rez[i].encounter != "null"){
						Flag.encounter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].encounter;
					} else {
						Flag.encounter = "";
					}
					Flag.author = arrAuthor[i];

          arrFlag[i] = Flag;
        }
        res.json({
          "err_code": 0,
          "data": arrFlag
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "getFlag"
        });
      });
		}
	},
  post: {
    flag: function addFlag(req, res) {
			var id = req.body.flag_id;
			var status = req.body.flag_status;
			var category = req.body.flag_category;
			var code = req.body.flag_code;
			var sub_patient_id = req.body.subject_patient_id;
			var sub_location_id = req.body.subject_location_id;
			var sub_group_id = req.body.subject_group_id;
			var sub_organization_id = req.body.subject_organization_id;
			var sub_practitioner_id = req.body.subject_practitioner_id;
			var sub_plan_def_id = req.body.subject_plan_definition_id;
			var sub_medication_id = req.body.subject_medication_id;
			var sub_procedure_id = req.body.subject_procedure_id;
			var period_start = req.body.flag_period_start;
			var period_end = req.body.flag_period_end;
			var encounter_id = req.body.encounter_id;
			var auth_device_id = req.body.author_device_id;
			var auth_organization_id = req.body.author_organization_id;
			var auth_patient_id = req.body.author_patient_id;
			var auth_practitioner_id = req.body.author_practitioner_id;
			
			//susun query
      var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'flag_status,';
        values += "'" + status + "',";
      }
			if (typeof category !== 'undefined' && category !== "") {
        column += 'flag_category,';
        values += "'" + category + "',";
      }
			if (typeof code !== 'undefined' && code !== "") {
        column += 'flag_code,';
        values += "'" + code + "',";
      }
			if (typeof sub_patient_id !== 'undefined' && sub_patient_id !== "") {
        column += 'subject_patient_id,';
        values += "'" + sub_patient_id + "',";
      }
			if (typeof sub_location_id !== 'undefined' && sub_location_id !== "") {
        column += 'subject_location_id,';
        values += "'" + sub_location_id + "',";
      }
			if (typeof sub_group_id !== 'undefined' && sub_group_id !== "") {
        column += 'subject_group_id,';
        values += "'" + sub_group_id + "',";
      }
			if (typeof sub_organization_id !== 'undefined' && sub_organization_id !== "") {
        column += 'subject_organization_id,';
        values += "'" + sub_organization_id + "',";
      }
			if (typeof sub_practitioner_id !== 'undefined' && sub_practitioner_id !== "") {
        column += 'subject_practitioner_id,';
        values += "'" + sub_practitioner_id + "',";
      }
			if (typeof sub_plan_def_id !== 'undefined' && sub_plan_def_id !== "") {
        column += 'subject_plan_definition_id,';
        values += "'" + sub_plan_def_id + "',";
      }
			if (typeof sub_medication_id !== 'undefined' && sub_medication_id !== "") {
        column += 'subject_medication_id,';
        values += "'" + sub_medication_id + "',";
      }
			if (typeof sub_procedure_id !== 'undefined' && sub_procedure_id !== "") {
        column += 'subject_procedure_id,';
        values += "'" + sub_procedure_id + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					flag_period_start = null;
				} else {
					flag_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'flag_period_start,';
				values += flag_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					flag_period_end = null;
				} else {
					flag_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'flag_period_end,';
				values += flag_period_end + ",";
			}
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			if (typeof auth_device_id !== 'undefined' && auth_device_id !== "") {
        column += 'author_device_id,';
        values += "'" + auth_device_id + "',";
      }
			if (typeof auth_organization_id !== 'undefined' && auth_organization_id !== "") {
        column += 'author_organization_id,';
        values += "'" + auth_organization_id + "',";
      }
			if (typeof auth_patient_id !== 'undefined' && auth_patient_id !== "") {
        column += 'author_patient_id,';
        values += "'" + auth_patient_id + "',";
      }
			if (typeof auth_practitioner_id !== 'undefined' && auth_practitioner_id !== "") {
        column += 'author_practitioner_id,';
        values += "'" + auth_practitioner_id + "',";
      }			

			var query = "UPSERT INTO BACIRO_FHIR.FLAG(FLAG_ID, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			console.log(query)
			
      db.upsert(query, function (succes) {
        var query = "SELECT FLAG_ID, FLAG_STATUS, FLAG_CATEGORY, FLAG_CODE, SUBJECT_PATIENT_ID, SUBJECT_LOCATION_ID, SUBJECT_GROUP_ID, SUBJECT_ORGANIZATION_ID, SUBJECT_PRACTITIONER_ID, SUBJECT_PLAN_DEFINITION_ID, SUBJECT_MEDICATION_ID, SUBJECT_PROCEDURE_ID, FLAG_PERIOD_START, FLAG_PERIOD_END, ENCOUNTER_ID, AUTHOR_DEVICE_ID, AUTHOR_ORGANIZATION_ID, AUTHOR_PATIENT_ID, AUTHOR_PRACTITIONER_ID FROM BACIRO_FHIR.FLAG WHERE FLAG_ID = '" + id + "' ";
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
            "function": "addFlag"
          });
        });
      }, function (e) {
        res.json({
          "err_code": 2,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "addFlag"
        });
      });
    }
	},
	put: {
		flag: function updateFlag(req, res) {
			var flag_id = req.params._id;
			
			var status = req.body.flag_status;
			var category = req.body.flag_category;
			var code = req.body.flag_code;
			var sub_patient_id = req.body.subject_patient_id;
			var sub_location_id = req.body.subject_location_id;
			var sub_group_id = req.body.subject_group_id;
			var sub_organization_id = req.body.subject_organization_id;
			var sub_practitioner_id = req.body.subject_practitioner_id;
			var sub_plan_def_id = req.body.subject_plan_definition_id;
			var sub_medication_id = req.body.subject_medication_id;
			var sub_procedure_id = req.body.subject_procedure_id;
			var period_start = req.body.flag_period_start;
			var period_end = req.body.flag_period_end;
			var encounter_id = req.body.encounter_id;
			var auth_device_id = req.body.author_device_id;
			var auth_organization_id = req.body.author_organization_id;
			var auth_patient_id = req.body.author_patient_id;
			var auth_practitioner_id = req.body.author_practitioner_id;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'flag_status,';
        values += "'" + status + "',";
      }
			if (typeof category !== 'undefined' && category !== "") {
        column += 'flag_category,';
        values += "'" + category + "',";
      }
			if (typeof code !== 'undefined' && code !== "") {
        column += 'flag_code,';
        values += "'" + code + "',";
      }
			if (typeof sub_patient_id !== 'undefined' && sub_patient_id !== "") {
        column += 'subject_patient_id,';
        values += "'" + sub_patient_id + "',";
      }
			if (typeof sub_location_id !== 'undefined' && sub_location_id !== "") {
        column += 'subject_location_id,';
        values += "'" + sub_location_id + "',";
      }
			if (typeof sub_group_id !== 'undefined' && sub_group_id !== "") {
        column += 'subject_group_id,';
        values += "'" + sub_group_id + "',";
      }
			if (typeof sub_organization_id !== 'undefined' && sub_organization_id !== "") {
        column += 'subject_organization_id,';
        values += "'" + sub_organization_id + "',";
      }
			if (typeof sub_practitioner_id !== 'undefined' && sub_practitioner_id !== "") {
        column += 'subject_practitioner_id,';
        values += "'" + sub_practitioner_id + "',";
      }
			if (typeof sub_plan_def_id !== 'undefined' && sub_plan_def_id !== "") {
        column += 'subject_plan_definition_id,';
        values += "'" + sub_plan_def_id + "',";
      }
			if (typeof sub_medication_id !== 'undefined' && sub_medication_id !== "") {
        column += 'subject_medication_id,';
        values += "'" + sub_medication_id + "',";
      }
			if (typeof sub_procedure_id !== 'undefined' && sub_procedure_id !== "") {
        column += 'subject_procedure_id,';
        values += "'" + sub_procedure_id + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					flag_period_start = null;
				} else {
					flag_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'flag_period_start,';
				values += flag_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					flag_period_end = null;
				} else {
					flag_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'flag_period_end,';
				values += flag_period_end + ",";
			}
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			if (typeof auth_device_id !== 'undefined' && auth_device_id !== "") {
        column += 'author_device_id,';
        values += "'" + auth_device_id + "',";
      }
			if (typeof auth_organization_id !== 'undefined' && auth_organization_id !== "") {
        column += 'author_organization_id,';
        values += "'" + auth_organization_id + "',";
      }
			if (typeof auth_patient_id !== 'undefined' && auth_patient_id !== "") {
        column += 'author_patient_id,';
        values += "'" + auth_patient_id + "',";
      }
			if (typeof auth_practitioner_id !== 'undefined' && auth_practitioner_id !== "") {
        column += 'author_practitioner_id,';
        values += "'" + auth_practitioner_id + "',";
      }		
		
			var condition = "flag_id = '" + flag_id + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.FLAG(FLAG_ID," + column.slice(0, -1) + ") SELECT FLAG_ID, " + values.slice(0, -1) + " FROM BACIRO_FHIR.FLAG WHERE " + condition;
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
          "function": "updateFlag"
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