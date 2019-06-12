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
		coverage: function getCoverage(req, res){
			var apikey = req.params.apikey;
			var coverageId = req.query._id;
			var beneficiary = req.query.beneficiary;
			var clases = req.query.class;
			var dependent = req.query.dependent;
			var group = req.query.group;
			var identifier = req.query.identifier;
			var payor = req.query.payor;
			var plan = req.query.plan;
			var policy_holder = req.query.policy_holder;
			var sequence = req.query.sequence;
			var subclass = req.query.subclass;
			var subgroup = req.query.subgroup;
			var subplan = req.query.subplan;
			var subscriber = req.query.subscriber;
			var type = req.query.type;
			
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof coverageId !== 'undefined' && coverageId !== ""){
        condition += "cov.coverage_id = '" + coverageId + "' AND,";  
      }
			
			if(typeof beneficiary !== 'undefined' && beneficiary !== ""){
				condition += "cov.coverage_beneficiary = '" + beneficiary + "' AND,";  
      }
			
			if(typeof clases !== 'undefined' && clases !== ""){
				condition += "cov.grouping_class = '" + clases + "' AND,";  
      }
			
			if(typeof dependent !== 'undefined' && dependent !== ""){
				condition += "cov.coverage_dependent = '" + dependent + "' AND,";  
      }
			
			if(typeof group !== 'undefined' && group !== ""){
				condition += "cov.grouping_group = '" + group + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.coverage_id = cov.coverage_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if((typeof payor !== 'undefined' && payor !== "")){
				var res = payor.substring(0, 3);
				if(res == 'org'){
					join += " LEFT JOIN BACIRO_FHIR.ORGANIZATION org ON cov.COVERAGE_ID = org.COVERAGE_ID ";
          condition += "ORGANIZATION_ID = '" + payor + "' AND ";       
				}
				if(res == 'pat'){
					join += " LEFT JOIN BACIRO_FHIR.PATIENT pat ON cov.COVERAGE_ID = pat.COVERAGE_ID ";
          condition += "PATIENT_ID = '" + payor + "' AND ";       
				}
				if(res == 'rpe'){
					join += " LEFT JOIN BACIRO_FHIR.RELATED_PERSON rp ON cov.COVERAGE_ID = rp.COVERAGE_ID ";
          condition += "RELATED_PERSON_ID = '" + payor + "' AND ";       
				}
      }
			
			if(typeof plan !== 'undefined' && plan !== ""){
			  condition += "cov.grouping_plan = '" + plan + "' AND,";  
      }
			
			if(typeof policy_holder !== 'undefined' && policy_holder !== ""){
			  condition += "(cov.policy_holder_patient = '" + policy_holder + "' OR cov.policy_holder_related_person = '" + policy_holder + "' OR cov.policy_holder_organization = '" + policy_holder + "') AND,";  
      }
			
			if(typeof sequence !== 'undefined' && sequence !== ""){
			  condition += "cov.coverage_sequence = '" + sequence + "' AND,";  
      }
			
			if(typeof subclass !== 'undefined' && subclass !== ""){
			  condition += "cov.grouping_sub_class = '" + subclass + "' AND,";  
      }
			
			if(typeof subgroup !== 'undefined' && subgroup !== ""){
			  condition += "cov.grouping_sub_group = '" + subgroup + "' AND,";  
      }
			
			if(typeof subplan !== 'undefined' && subplan !== ""){
			  condition += "cov.grouping_sub_plan = '" + subplan + "' AND,";  
      }
			
			if(typeof type !== 'undefined' && type !== ""){
			  condition += "cov.coverage_type = '" + type + "' AND,";  
      }
			
			if(typeof subscriber !== 'undefined' && subscriber !== ""){
			  condition += "(cov.subscriber_patient = '" + subscriber + "' OR cov.subscriber_related_person = '" + subscriber + "') AND,";  
      }
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " cov.coverage_id > '" + offset + "' AND ";       
			}
			
			if((typeof limit !== 'undefined' && limit !== '')){
				limit = " limit " + limit + " ";
			} else {
				limit = " ";
			}
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrCoverage = [];
      var query = "select cov.coverage_id as coverage_id, cov.coverage_status as coverage_status, cov.coverage_type as coverage_type, cov.policy_holder_patient as policy_holder_patient, cov.policy_holder_related_person as policy_holder_related_person, cov.policy_holder_organization as policy_holder_organization, cov.subscriber_patient as subscriber_patient, cov.subscriber_related_person as subscriber_related_person, cov.subscriber_id as subscriber_id, cov.coverage_beneficiary as coverage_beneficiary, cov.coverage_relationship as coverage_relationship, cov.coverage_period_start as coverage_period_start, cov.coverage_perido_end as coverage_perido_end, cov.grouping_group as grouping_group, cov.grouping_group_display as grouping_group_display, cov.grouping_sub_group as grouping_sub_group, cov.grouping_sub_group_display as grouping_sub_group_display, cov.grouping_plan as grouping_plan, cov.grouping_plan_display as grouping_plan_display, cov.grouping_sub_plan as grouping_sub_plan, cov.grouping_sub_plan_display as grouping_sub_plan_display, cov.grouping_class as grouping_class, cov.grouping_class_display as grouping_class_display, cov.grouping_sub_class as grouping_sub_class, cov.grouping_sub_class_display as grouping_sub_class_display, cov.coverage_dependent as coverage_dependent, cov.coverage_sequence as coverage_sequence, cov.coverage_order as coverage_order, cov.coverage_network as coverage_network from BACIRO_FHIR.coverage cov " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Coverage = {};
					Coverage.resourceType = "Coverage";
          Coverage.id = rez[i].coverage_id;
					Coverage.status = rez[i].coverage_status;
					Coverage.type = rez[i].coverage_type;
					var PolicyHolder = {};
					if(rez[i].policy_holder_patient != "null"){
						PolicyHolder.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].policy_holder_patient;
					} else {
						PolicyHolder.patient = "";
					}
					if(rez[i].policy_holder_related_person != "null"){
						PolicyHolder.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].policy_holder_related_person;
					} else {
						PolicyHolder.relatedPerson = "";
					}
					if(rez[i].policy_holder_organization != "null"){
						PolicyHolder.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].policy_holder_organization;
					} else {
						PolicyHolder.organization = "";
					}
					Coverage.policyHolder = PolicyHolder;
					var Subscriber = {};
					if(rez[i].subscriber_patient != "null"){
						Subscriber.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subscriber_patient;
					} else {
						Subscriber.patient = "";
					}
					if(rez[i].subscriber_related_person != "null"){
						Subscriber.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].subscriber_related_person;
					} else {
						Subscriber.relatedPerson = "";
					}
					Coverage.subscriber = Subscriber;
					Coverage.subscriberId = rez[i].subscriber_id;
					if(rez[i].coverage_beneficiary != "null"){
						Coverage.beneficiary = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].coverage_beneficiary;
					} else {
						Coverage.beneficiary = "";
					}
					Coverage.relationship = rez[i].coverage_relationship;
					var periodStart,periodEnd;
					if(rez[i].coverage_period_start == null){
						periodStart = formatDate(rez[i].coverage_period_start);  
					}else{
						periodStart = rez[i].coverage_period_start;  
					}
					if(rez[i].coverage_perido_end == null){
						periodEnd = formatDate(rez[i].coverage_perido_end);  
					}else{
						periodEnd = rez[i].coverage_perido_end;  
					}
					Coverage.period = periodStart + ' to ' + periodEnd;
					var Group = {};
					Group.group = rez[i].grouping_group;
					Group.groupDisplay = rez[i].grouping_group_display;
					Group.subGroup = rez[i].grouping_sub_group;
					Group.subGroupDisplay = rez[i].grouping_sub_group_display;
					Group.plan = rez[i].grouping_plan;
					Group.planDisplay = rez[i].grouping_plan_display;
					Group.subPlan = rez[i].grouping_sub_plan;
					Group.subPlanDisplay = rez[i].grouping_sub_plan_display;
					Group.class = rez[i].grouping_class;
					Group.classDisplay = rez[i].grouping_class_display;
					Group.subClass = rez[i].grouping_sub_class;
					Group.subClassDisplay = rez[i].grouping_sub_class_display;
					Coverage.group = Group;
					Coverage.dependent = rez[i].coverage_dependent;
					Coverage.sequence = rez[i].coverage_sequence;
					Coverage.order = rez[i].coverage_order;
					Coverage.network = rez[i].coverage_network;
	
          arrCoverage[i] = Coverage;
        }
        res.json({"err_code":0,"data": arrCoverage});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCoverage"});
      });
    },
		coveragePayorOrganization: function getCoveragePayorOrganization(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var coverageId = req.query.coverage_id;

			//susun query
			var condition = '';

			if (typeof coverageId !== 'undefined' && coverageId !== "") {
				condition += "coverage_id = '" + coverageId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCoveragePayorOrganization = [];
			var query = 'select organization_id from BACIRO_FHIR.organization ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var coveragePayorOrganization = {};
					if(rez[i].organization_id != "null"){
						coveragePayorOrganization.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/organization?_id=' +  rez[i].organization_id;
					} else {
						coveragePayorOrganization.id = "";
					}
					
					arrCoveragePayorOrganization[i] = coveragePayorOrganization;
				}
				res.json({
					"err_code": 0,
					"data": arrCoveragePayorOrganization
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCoveragePayorOrganization"
				});
			});
		},
		coveragePayorPatient: function getCoveragePayorPatient(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var coverageId = req.query.coverage_id;

			//susun query
			var condition = '';

			if (typeof coverageId !== 'undefined' && coverageId !== "") {
				condition += "coverage_id = '" + coverageId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCoveragePayorPatient = [];
			var query = 'select patient_id from BACIRO_FHIR.patient ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var coveragePayorPatient = {};
					if(rez[i].patient_id != "null"){
						coveragePayorPatient.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/patient?_id=' +  rez[i].patient_id;
					} else {
						coveragePayorPatient.id = "";
					}
					
					arrCoveragePayorPatient[i] = coveragePayorPatient;
				}
				res.json({
					"err_code": 0,
					"data": arrCoveragePayorPatient
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCoveragePayorPatient"
				});
			});
		},
		coveragePayorRelatedPerson: function getCoveragePayorRelatedPerson(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var coverageId = req.query.coverage_id;

			//susun query
			var condition = '';

			if (typeof coverageId !== 'undefined' && coverageId !== "") {
				condition += "coverage_id = '" + coverageId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCoveragePayorRelatedPerson = [];
			var query = 'select related_person_id from BACIRO_FHIR.related_person ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var coveragePayorRelatedPerson = {};
					if(rez[i].related_person_id != "null"){
						coveragePayorRelatedPerson.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/relatedPerson?_id=' +  rez[i].related_person_id;
					} else {
						coveragePayorRelatedPerson.id = "";
					}
					
					arrCoveragePayorRelatedPerson[i] = coveragePayorRelatedPerson;
				}
				res.json({
					"err_code": 0,
					"data": arrCoveragePayorRelatedPerson
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCoveragePayorRelatedPerson"
				});
			});
		},		
  },
	post: {
		coverage: function addCoverage(req, res) {
			console.log(req.body);
			var coverage_id  = req.body.coverage_id;
			var coverage_status  = req.body.coverage_status;
			var coverage_type  = req.body.coverage_type;
			var policy_holder_patient  = req.body.policy_holder_patient;
			var policy_holder_related_person  = req.body.policy_holder_related_person;
			var policy_holder_organization  = req.body.policy_holder_organization;
			var subscriber_patient  = req.body.subscriber_patient;
			var subscriber_related_person  = req.body.subscriber_related_person;
			var subscriber_id  = req.body.subscriber_id;
			var coverage_beneficiary  = req.body.coverage_beneficiary;
			var coverage_relationship  = req.body.coverage_relationship;
			var coverage_period_start  = req.body.coverage_period_start;
			var coverage_perido_end  = req.body.coverage_perido_end;
			var grouping_group  = req.body.grouping_group;
			var grouping_group_display  = req.body.grouping_group_display;
			var grouping_sub_group  = req.body.grouping_sub_group;
			var grouping_sub_group_display  = req.body.grouping_sub_group_display;
			var grouping_plan  = req.body.grouping_plan;
			var grouping_plan_display  = req.body.grouping_plan_display;
			var grouping_sub_plan  = req.body.grouping_sub_plan;
			var grouping_sub_plan_display  = req.body.grouping_sub_plan_display;
			var grouping_class  = req.body.grouping_class;
			var grouping_class_display  = req.body.grouping_class_display;
			var grouping_sub_class  = req.body.grouping_sub_class;
			var grouping_sub_class_display  = req.body.grouping_sub_class_display;
			var coverage_dependent  = req.body.coverage_dependent;
			var coverage_sequence  = req.body.coverage_sequence;
			var coverage_order  = req.body.coverage_order;
			var coverage_network  = req.body.coverage_network;
			var account  = req.body.account;
			var claim  = req.body.claim;
			var claim_response  = req.body.claim_response;
			var eligibility_request  = req.body.eligibility_request;
			var eligibility_response  = req.body.eligibility_response;
			var enrollment_request  = req.body.enrollment_request;
			var explanation_of_benefit  = req.body.explanation_of_benefit;

			var column = "";
      var values = "";
			
			if (typeof coverage_status !== 'undefined' && coverage_status !== "") {
				column += 'coverage_status,';
				values += " '" + coverage_status +"',";
			}

			if (typeof coverage_type !== 'undefined' && coverage_type !== "") {
				column += 'coverage_type,';
				values += " '" + coverage_type +"',";
			}

			if (typeof policy_holder_patient !== 'undefined' && policy_holder_patient !== "") {
				column += 'policy_holder_patient,';
				values += " '" + policy_holder_patient +"',";
			}

			if (typeof policy_holder_related_person !== 'undefined' && policy_holder_related_person !== "") {
				column += 'policy_holder_related_person,';
				values += " '" + policy_holder_related_person +"',";
			}

			if (typeof policy_holder_organization !== 'undefined' && policy_holder_organization !== "") {
				column += 'policy_holder_organization,';
				values += " '" + policy_holder_organization +"',";
			}

			if (typeof subscriber_patient !== 'undefined' && subscriber_patient !== "") {
				column += 'subscriber_patient,';
				values += " '" + subscriber_patient +"',";
			}

			if (typeof subscriber_related_person !== 'undefined' && subscriber_related_person !== "") {
				column += 'subscriber_related_person,';
				values += " '" + subscriber_related_person +"',";
			}

			if (typeof subscriber_id !== 'undefined' && subscriber_id !== "") {
				column += 'subscriber_id,';
				values += " '" + subscriber_id +"',";
			}

			if (typeof coverage_beneficiary !== 'undefined' && coverage_beneficiary !== "") {
				column += 'coverage_beneficiary,';
				values += " '" + coverage_beneficiary +"',";
			}

			if (typeof coverage_relationship !== 'undefined' && coverage_relationship !== "") {
				column += 'coverage_relationship,';
				values += " '" + coverage_relationship +"',";
			}

			if (typeof  coverage_period_start !== 'undefined' &&  coverage_period_start !== "") {
				column += ' coverage_period_start,';
				values += "to_date('"+  coverage_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  coverage_perido_end !== 'undefined' &&  coverage_perido_end !== "") {
				column += ' coverage_perido_end,';
				values += "to_date('"+  coverage_perido_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof grouping_group !== 'undefined' && grouping_group !== "") {
				column += 'grouping_group,';
				values += " '" + grouping_group +"',";
			}

			if (typeof grouping_group_display !== 'undefined' && grouping_group_display !== "") {
				column += 'grouping_group_display,';
				values += " '" + grouping_group_display +"',";
			}

			if (typeof grouping_sub_group !== 'undefined' && grouping_sub_group !== "") {
				column += 'grouping_sub_group,';
				values += " '" + grouping_sub_group +"',";
			}

			if (typeof grouping_sub_group_display !== 'undefined' && grouping_sub_group_display !== "") {
				column += 'grouping_sub_group_display,';
				values += " '" + grouping_sub_group_display +"',";
			}

			if (typeof grouping_plan !== 'undefined' && grouping_plan !== "") {
				column += 'grouping_plan,';
				values += " '" + grouping_plan +"',";
			}

			if (typeof grouping_plan_display !== 'undefined' && grouping_plan_display !== "") {
				column += 'grouping_plan_display,';
				values += " '" + grouping_plan_display +"',";
			}

			if (typeof grouping_sub_plan !== 'undefined' && grouping_sub_plan !== "") {
				column += 'grouping_sub_plan,';
				values += " '" + grouping_sub_plan +"',";
			}

			if (typeof grouping_sub_plan_display !== 'undefined' && grouping_sub_plan_display !== "") {
				column += 'grouping_sub_plan_display,';
				values += " '" + grouping_sub_plan_display +"',";
			}

			if (typeof grouping_class !== 'undefined' && grouping_class !== "") {
				column += 'grouping_class,';
				values += " '" + grouping_class +"',";
			}

			if (typeof grouping_class_display !== 'undefined' && grouping_class_display !== "") {
				column += 'grouping_class_display,';
				values += " '" + grouping_class_display +"',";
			}

			if (typeof grouping_sub_class !== 'undefined' && grouping_sub_class !== "") {
				column += 'grouping_sub_class,';
				values += " '" + grouping_sub_class +"',";
			}

			if (typeof grouping_sub_class_display !== 'undefined' && grouping_sub_class_display !== "") {
				column += 'grouping_sub_class_display,';
				values += " '" + grouping_sub_class_display +"',";
			}

			if (typeof coverage_dependent !== 'undefined' && coverage_dependent !== "") {
				column += 'coverage_dependent,';
				values += " '" + coverage_dependent +"',";
			}

			if (typeof coverage_sequence !== 'undefined' && coverage_sequence !== "") {
				column += 'coverage_sequence,';
				values += " '" + coverage_sequence +"',";
			}

			if (typeof coverage_order !== 'undefined' && coverage_order !== "") {
				column += ' coverage_order,';
				values += " " + coverage_order +",";
			}

			if (typeof coverage_network !== 'undefined' && coverage_network !== "") {
				column += 'coverage_network,';
				values += " '" + coverage_network +"',";
			}

			if (typeof account !== 'undefined' && account !== "") {
				column += 'account,';
				values += " '" + account +"',";
			}

			if (typeof claim !== 'undefined' && claim !== "") {
				column += 'claim,';
				values += " '" + claim +"',";
			}

			if (typeof claim_response !== 'undefined' && claim_response !== "") {
				column += 'claim_response,';
				values += " '" + claim_response +"',";
			}

			if (typeof eligibility_request !== 'undefined' && eligibility_request !== "") {
				column += 'eligibility_request,';
				values += " '" + eligibility_request +"',";
			}

			if (typeof eligibility_response !== 'undefined' && eligibility_response !== "") {
				column += 'eligibility_response,';
				values += " '" + eligibility_response +"',";
			}

			if (typeof enrollment_request !== 'undefined' && enrollment_request !== "") {
				column += 'enrollment_request,';
				values += " '" + enrollment_request +"',";
			}

			if (typeof explanation_of_benefit !== 'undefined' && explanation_of_benefit !== "") {
				column += 'explanation_of_benefit,';
				values += " '" + explanation_of_benefit +"',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.coverage(coverage_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+coverage_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select coverage_id from BACIRO_FHIR.coverage WHERE coverage_id = '" + coverage_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCoverage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCoverage"});
      });
    }
	},
	put: {
		coverage: function updateCoverage(req, res) {
			console.log(req.body);
			var coverage_id  = req.params._id;
			var coverage_status  = req.body.coverage_status;
			var coverage_type  = req.body.coverage_type;
			var policy_holder_patient  = req.body.policy_holder_patient;
			var policy_holder_related_person  = req.body.policy_holder_related_person;
			var policy_holder_organization  = req.body.policy_holder_organization;
			var subscriber_patient  = req.body.subscriber_patient;
			var subscriber_related_person  = req.body.subscriber_related_person;
			var subscriber_id  = req.body.subscriber_id;
			var coverage_beneficiary  = req.body.coverage_beneficiary;
			var coverage_relationship  = req.body.coverage_relationship;
			var coverage_period_start  = req.body.coverage_period_start;
			var coverage_perido_end  = req.body.coverage_perido_end;
			var grouping_group  = req.body.grouping_group;
			var grouping_group_display  = req.body.grouping_group_display;
			var grouping_sub_group  = req.body.grouping_sub_group;
			var grouping_sub_group_display  = req.body.grouping_sub_group_display;
			var grouping_plan  = req.body.grouping_plan;
			var grouping_plan_display  = req.body.grouping_plan_display;
			var grouping_sub_plan  = req.body.grouping_sub_plan;
			var grouping_sub_plan_display  = req.body.grouping_sub_plan_display;
			var grouping_class  = req.body.grouping_class;
			var grouping_class_display  = req.body.grouping_class_display;
			var grouping_sub_class  = req.body.grouping_sub_class;
			var grouping_sub_class_display  = req.body.grouping_sub_class_display;
			var coverage_dependent  = req.body.coverage_dependent;
			var coverage_sequence  = req.body.coverage_sequence;
			var coverage_order  = req.body.coverage_order;
			var coverage_network  = req.body.coverage_network;
			var account  = req.body.account;
			var claim  = req.body.claim;
			var claim_response  = req.body.claim_response;
			var eligibility_request  = req.body.eligibility_request;
			var eligibility_response  = req.body.eligibility_response;
			var enrollment_request  = req.body.enrollment_request;
			var explanation_of_benefit  = req.body.explanation_of_benefit;

			var column = "";
      var values = "";
			
			if (typeof coverage_status !== 'undefined' && coverage_status !== "") {
				column += 'coverage_status,';
				values += " '" + coverage_status +"',";
			}

			if (typeof coverage_type !== 'undefined' && coverage_type !== "") {
				column += 'coverage_type,';
				values += " '" + coverage_type +"',";
			}

			if (typeof policy_holder_patient !== 'undefined' && policy_holder_patient !== "") {
				column += 'policy_holder_patient,';
				values += " '" + policy_holder_patient +"',";
			}

			if (typeof policy_holder_related_person !== 'undefined' && policy_holder_related_person !== "") {
				column += 'policy_holder_related_person,';
				values += " '" + policy_holder_related_person +"',";
			}

			if (typeof policy_holder_organization !== 'undefined' && policy_holder_organization !== "") {
				column += 'policy_holder_organization,';
				values += " '" + policy_holder_organization +"',";
			}

			if (typeof subscriber_patient !== 'undefined' && subscriber_patient !== "") {
				column += 'subscriber_patient,';
				values += " '" + subscriber_patient +"',";
			}

			if (typeof subscriber_related_person !== 'undefined' && subscriber_related_person !== "") {
				column += 'subscriber_related_person,';
				values += " '" + subscriber_related_person +"',";
			}

			if (typeof subscriber_id !== 'undefined' && subscriber_id !== "") {
				column += 'subscriber_id,';
				values += " '" + subscriber_id +"',";
			}

			if (typeof coverage_beneficiary !== 'undefined' && coverage_beneficiary !== "") {
				column += 'coverage_beneficiary,';
				values += " '" + coverage_beneficiary +"',";
			}

			if (typeof coverage_relationship !== 'undefined' && coverage_relationship !== "") {
				column += 'coverage_relationship,';
				values += " '" + coverage_relationship +"',";
			}

			if (typeof  coverage_period_start !== 'undefined' &&  coverage_period_start !== "") {
				column += ' coverage_period_start,';
				values += "to_date('"+  coverage_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  coverage_perido_end !== 'undefined' &&  coverage_perido_end !== "") {
				column += ' coverage_perido_end,';
				values += "to_date('"+  coverage_perido_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof grouping_group !== 'undefined' && grouping_group !== "") {
				column += 'grouping_group,';
				values += " '" + grouping_group +"',";
			}

			if (typeof grouping_group_display !== 'undefined' && grouping_group_display !== "") {
				column += 'grouping_group_display,';
				values += " '" + grouping_group_display +"',";
			}

			if (typeof grouping_sub_group !== 'undefined' && grouping_sub_group !== "") {
				column += 'grouping_sub_group,';
				values += " '" + grouping_sub_group +"',";
			}

			if (typeof grouping_sub_group_display !== 'undefined' && grouping_sub_group_display !== "") {
				column += 'grouping_sub_group_display,';
				values += " '" + grouping_sub_group_display +"',";
			}

			if (typeof grouping_plan !== 'undefined' && grouping_plan !== "") {
				column += 'grouping_plan,';
				values += " '" + grouping_plan +"',";
			}

			if (typeof grouping_plan_display !== 'undefined' && grouping_plan_display !== "") {
				column += 'grouping_plan_display,';
				values += " '" + grouping_plan_display +"',";
			}

			if (typeof grouping_sub_plan !== 'undefined' && grouping_sub_plan !== "") {
				column += 'grouping_sub_plan,';
				values += " '" + grouping_sub_plan +"',";
			}

			if (typeof grouping_sub_plan_display !== 'undefined' && grouping_sub_plan_display !== "") {
				column += 'grouping_sub_plan_display,';
				values += " '" + grouping_sub_plan_display +"',";
			}

			if (typeof grouping_class !== 'undefined' && grouping_class !== "") {
				column += 'grouping_class,';
				values += " '" + grouping_class +"',";
			}

			if (typeof grouping_class_display !== 'undefined' && grouping_class_display !== "") {
				column += 'grouping_class_display,';
				values += " '" + grouping_class_display +"',";
			}

			if (typeof grouping_sub_class !== 'undefined' && grouping_sub_class !== "") {
				column += 'grouping_sub_class,';
				values += " '" + grouping_sub_class +"',";
			}

			if (typeof grouping_sub_class_display !== 'undefined' && grouping_sub_class_display !== "") {
				column += 'grouping_sub_class_display,';
				values += " '" + grouping_sub_class_display +"',";
			}

			if (typeof coverage_dependent !== 'undefined' && coverage_dependent !== "") {
				column += 'coverage_dependent,';
				values += " '" + coverage_dependent +"',";
			}

			if (typeof coverage_sequence !== 'undefined' && coverage_sequence !== "") {
				column += 'coverage_sequence,';
				values += " '" + coverage_sequence +"',";
			}

			if (typeof coverage_order !== 'undefined' && coverage_order !== "") {
				column += ' coverage_order,';
				values += " " + coverage_order +",";
			}

			if (typeof coverage_network !== 'undefined' && coverage_network !== "") {
				column += 'coverage_network,';
				values += " '" + coverage_network +"',";
			}

			if (typeof account !== 'undefined' && account !== "") {
				column += 'account,';
				values += " '" + account +"',";
			}

			if (typeof claim !== 'undefined' && claim !== "") {
				column += 'claim,';
				values += " '" + claim +"',";
			}

			if (typeof claim_response !== 'undefined' && claim_response !== "") {
				column += 'claim_response,';
				values += " '" + claim_response +"',";
			}

			if (typeof eligibility_request !== 'undefined' && eligibility_request !== "") {
				column += 'eligibility_request,';
				values += " '" + eligibility_request +"',";
			}

			if (typeof eligibility_response !== 'undefined' && eligibility_response !== "") {
				column += 'eligibility_response,';
				values += " '" + eligibility_response +"',";
			}

			if (typeof enrollment_request !== 'undefined' && enrollment_request !== "") {
				column += 'enrollment_request,';
				values += " '" + enrollment_request +"',";
			}

			if (typeof explanation_of_benefit !== 'undefined' && explanation_of_benefit !== "") {
				column += 'explanation_of_benefit,';
				values += " '" + explanation_of_benefit +"',";
			}
			
							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "coverage_id = '" + coverage_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "coverage_id = '" + coverage_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.coverage(coverage_id," + column.slice(0, -1) + ") SELECT coverage_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.coverage WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select coverage_id from BACIRO_FHIR.coverage WHERE coverage_id = '" + coverage_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCoverage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCoverage"});
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
