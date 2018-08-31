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
var hostFHIR = configYaml.fhir.host;
var portFHIR = configYaml.fhir.port;
var hostHbase = configYaml.hbase.host;

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
var db = new phoenix("jdbc:phoenix:" + hostHbase + ":/hbase-unsecure");

var controller = {
	get: {
		careTeam: function getCareTeam(req, res){
			var apikey = req.params.apikey;
			var careTeamId = req.query._id;
			var category = req.query.category;
			var context = req.query.context;
			var date = req.query.date;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var participant = req.query.participant;
			var patient = req.query.patient;
			var status = req.query.status;
			var subject = req.query.subject;
	
			
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof careTeamId !== 'undefined' && careTeamId !== ""){
        condition += "ct.CARE_TEAM_ID = '" + careTeamId + "' AND,";  
      }
			
			if(typeof category !== 'undefined' && category !== ""){
        condition += "ct.category = '" + category + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(ct.CONTEXT_ENCOUNTER = '" + context + "' OR ct.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "ct.PERIOD_START <= to_date('" + date + "', 'yyyy-MM-dd') AND ct.PERIOD_END >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
        condition += "ct.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on ct.CARE_TEAM_ID = i.CARE_TEAM_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof participant !== 'undefined' && participant !== ""){
				join += " LEFT JOIN BACIRO_FHIR.CARE_TEAM_PARTICIPANT ctp on ct.CARE_TEAM_ID = ctp.CARE_TEAM_ID ";
        condition += "(ctp.MEMBER_PRACTITIONER = '" + participant + "' OR ctp.MEMBER_RELATED_PERSON = '" + participant + "' OR ctp.MEMBER_PATIENT = '" + participant + "' OR ctp.MEMBER_ORGANIZATION = '" + participant + "' OR ctp.MEMBER_CARE_TEAM = '" + participant + "') AND,";
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "ct.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "ct.STATUS = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'subject' && subject !== ""){
				condition += "(ct.SUBJECT_PATIENT = '" + subject + "' OR ct.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrCareTeam = [];
      var query = "select care_team_id, status, category, name, subject_patient, subject_group, context_encounter, context_episode_of_care, period_start, period_end, reason_code, episode_of_care_id from baciro_fhir.CARE_TEAM ct " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var CareTeam = {};
					CareTeam.resourceType = "CareTeam";
          CareTeam.id = rez[i].care_team_id;
					CareTeam.status = rez[i].status;
					CareTeam.category = rez[i].category;
					CareTeam.name = rez[i].name;
					if (rez[i].subject_group !== 'null') {
						CareTeam.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_group;
					} else if (rez[i].subject_patient !== 'null') {
						CareTeam.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						CareTeam.subject = "";
					}
					if (rez[i].context_encounter !== 'null') {
						CareTeam.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else if (rez[i].context_episode_of_care !== 'null') {
						CareTeam.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						CareTeam.context = "";
					}
					CareTeam.period = rez[i].period_start + ' to ' + rez[i].period_end;
					CareTeam.reasonCode = rez[i].reason_code;
					
          arrCareTeam[i] = CareTeam;
        }
        res.json({"err_code":0,"data": arrCareTeam});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCareTeam"});
      });
    },
		careTeamParticipant: function getCareTeamParticipant(req, res) {
			var apikey = req.params.apikey;
			
			var careTeamParticipantId = req.query._id;
			var careTeamId = req.query.care_team_id;

			//susun query
			var condition = "";

			if (typeof careTeamParticipantId !== 'undefined' && careTeamParticipantId !== "") {
				condition += "PARTICIPANT_ID = '" + careTeamParticipantId + "' AND ";
			}

			if (typeof careTeamId !== 'undefined' && careTeamId !== "") {
				condition += "CARE_TEAM_ID = '" + careTeamId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrCareTeamParticipant = [];
			var query = "select participant_id, role, member_practitioner, member_related_person, member_patient, member_organization, member_care_team, on_behalf_of, period_start, period_end, care_team_id from baciro_fhir.care_team_participant " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var CareTeamParticipant = {};
					CareTeamParticipant.id = rez[i].participant_id;
					CareTeamParticipant.role = rez[i].role;
					if (rez[i].member_practitioner == null) {
						CareTeamParticipant.member = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].member_practitioner;
					} else if (rez[i].member_related_person == null) {
						CareTeamParticipant.member = hostFHIR + ':' + portFHIR + '/' + apikey + '/Person?_id=' + rez[i].member_related_person;
					} else if (rez[i].member_patient == null) {
						CareTeamParticipant.member =  hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +rez[i].member_patient;
					} else if (rez[i].member_organization == null) {
						CareTeamParticipant.member =  hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' + rez[i].member_organization;
					} else if (rez[i].member_care_team == null) {
						CareTeamParticipant.member =  hostFHIR + ':' + portFHIR + '/' + apikey + '/CareTeam?_id=' + rez[i].member_care_team;
					} else {
						CareTeamParticipant.member = "";
					}
					CareTeamParticipant.onBehalfOf = rez[i].on_behalf_of;
					CareTeamParticipant.period = formatDate(rez[i].period_start) + " to " + formatDate(rez[i].period_end);
					
					
					arrCareTeamParticipant[i] = CareTeamParticipant;
				}
				res.json({
					"err_code": 0,
					"data": arrCareTeamParticipant
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCareTeamParticipant"
				});
			});
		}
		
  },
	post: {
		careTeam: function addCareTeam(req, res) {
			console.log(req.body);
			var care_team_id  = req.body.care_team_id;
			var status  = req.body.status;
			var category  = req.body.category;
			var name  = req.body.name;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			var reason_code  = req.body.reason_code;
			var episode_of_care_id  = req.body.episode_of_care_id;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }	
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }	
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }	
			
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }	
			
			
			if (typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== "") {
        column += 'episode_of_care_id,';
        values += "'" + episode_of_care_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.CARE_TEAM(care_team_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+care_team_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select care_team_id, status, category, name, subject_patient, subject_group, context_encounter, context_episode_of_care, period_start, period_end, reason_code, episode_of_care_id from baciro_fhir.CARE_TEAM WHERE care_team_id = '" + care_team_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCareTeam"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCareTeam"});
      });
    },
		careTeamParticipant: function addCareTeamParticipant(req, res) {
			console.log(req.body);
			var participant_id  = req.body.participant_id;
			var role  = req.body.role;
			var member_practitioner  = req.body.member_practitioner;
			var member_related_person  = req.body.member_related_person;
			var member_patient  = req.body.member_patient;
			var member_organization  = req.body.member_organization;
			var member_care_team  = req.body.member_care_team;
			var on_behalf_of  = req.body.on_behalf_of;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			var care_team_id  = req.body.care_team_id;

			var column = "";
      var values = "";
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += "'" + role + "',";
      }
			
			if (typeof member_practitioner !== 'undefined' && member_practitioner !== "") {
        column += 'member_practitioner,';
        values += "'" + member_practitioner + "',";
      }
			
			if (typeof member_related_person !== 'undefined' && member_related_person !== "") {
        column += 'member_related_person,';
        values += "'" + member_related_person + "',";
      }
			
			if (typeof member_patient !== 'undefined' && member_patient !== "") {
        column += 'member_patient,';
        values += "'" + member_patient + "',";
      }
			
			if (typeof member_organization !== 'undefined' && member_organization !== "") {
        column += 'member_organization,';
        values += "'" + member_organization + "',";
      }	
			
			if (typeof member_care_team !== 'undefined' && member_care_team !== "") {
        column += 'member_care_team,';
        values += "'" + member_care_team + "',";
      }	
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }	
			
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof care_team_id !== 'undefined' && care_team_id !== "") {
        column += 'care_team_id,';
        values += "'" + care_team_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.care_team_participant(participant_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+participant_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select  participant_id, role, member_practitioner, member_related_person, member_patient , member_organization, member_care_team, on_behalf_of, period_start, period_end, care_team_id from baciro_fhir.care_team_participant WHERE participant_id = '" + participant_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCareTeamParticipant"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCareTeamParticipant"});
      });
    }
		
	},
	put: {
		careTeam: function updateCareTeam(req, res) {
			console.log(req.body);
			var care_team_id  = req.params.care_team_id;
			var status  = req.body.status;
			var category  = req.body.category;
			var name  = req.body.name;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			var reason_code  = req.body.reason_code;
			var episode_of_care_id  = req.body.episode_of_care_id;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }	
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }	
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }	
			
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }	
			
			
			if (typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== "") {
        column += 'episode_of_care_id,';
        values += "'" + episode_of_care_id + "',";
      }		
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "care_team_id = '" + care_team_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.CARE_TEAM(care_team_id," + column.slice(0, -1) + ") SELECT care_team_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_TEAM WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select care_team_id, status, category, name, subject_patient, subject_group, context_encounter, context_episode_of_care, period_start, period_end, reason_code, episode_of_care_id from baciro_fhir.CARE_TEAM WHERE care_team_id = '" + care_team_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCareTeam"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCareTeam"});
      });
    },
		careTeamParticipant: function updateCareTeamParticipant(req, res) {
			console.log(req.body);
			var participant_id  = req.params.participant_id;
			var role  = req.body.role;
			var member_practitioner  = req.body.member_practitioner;
			var member_related_person  = req.body.member_related_person;
			var member_patient  = req.body.member_patient;
			var member_organization  = req.body.member_organization;
			var member_care_team  = req.body.member_care_team;
			var on_behalf_of  = req.body.on_behalf_of;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			var care_team_id  = req.body.care_team_id;

			var column = "";
      var values = "";
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += "'" + role + "',";
      }
			
			if (typeof member_practitioner !== 'undefined' && member_practitioner !== "") {
        column += 'member_practitioner,';
        values += "'" + member_practitioner + "',";
      }
			
			if (typeof member_related_person !== 'undefined' && member_related_person !== "") {
        column += 'member_related_person,';
        values += "'" + member_related_person + "',";
      }
			
			if (typeof member_patient !== 'undefined' && member_patient !== "") {
        column += 'member_patient,';
        values += "'" + member_patient + "',";
      }
			
			if (typeof member_organization !== 'undefined' && member_organization !== "") {
        column += 'member_organization,';
        values += "'" + member_organization + "',";
      }	
			
			if (typeof member_care_team !== 'undefined' && member_care_team !== "") {
        column += 'member_care_team,';
        values += "'" + member_care_team + "',";
      }	
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }	
			
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof care_team_id !== 'undefined' && care_team_id !== "") {
        column += 'care_team_id,';
        values += "'" + care_team_id + "',";
      }	

     
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "participant_id = '" + participant_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.care_team_participant(participant_id," + column.slice(0, -1) + ") SELECT participant_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.care_team_participant WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select  participant_id, role, member_practitioner, member_related_person, member_patient , member_organization, member_care_team, on_behalf_of, period_start, period_end, care_team_id from baciro_fhir.care_team_participant WHERE participant_id = '" + participant_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCareTeamParticipant"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCareTeamParticipant"});
      });
    }
	}
}
function lowercaseObject(jsonData){
  var rez = [];
  for(i=0; i < jsonData.length; i++){
    json = JSON.stringify(jsonData[i]);
    json2 = json.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
    rez[i] = JSON.parse(json2);
  }
  return rez;
}

function checkApikey(apikey){
  var query = "SELECT user_id FROM baciro.user WHERE user_apikey = '"+ apikey +"' ";

  db.query(query,function(dataJson){
    rez = lowercaseObject(dataJson);
    return rez;
  },function(e){
    return {"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkApikey"};
  });
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

module.exports = controller;