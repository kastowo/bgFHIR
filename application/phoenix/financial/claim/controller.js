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
		claim: function getClaim(req, res){
			var apikey = req.params.apikey;
			var condition = "";
      var join = "";
			var offset = req.query.offset;
			var limit = req.query.limit;
			var claimId = req.query._id;
			var care_team = req.query.care_team;
			var created = req.query.created;
			var encounter = req.query.encounter;
			var enterer = req.query.enterer;
			var facility = req.query.facility;
			var identifier = req.query.identifier;
			var insurer = req.query.insurer;
			var organization = req.query.organization;
			var patient = req.query.patient;
			var payee = req.query.payee;
			var priority = req.query.priority;
			var provider = req.query.provider;
			var use = req.query.use;
			//susun query
			
			
			if (typeof created !== 'undefined' && created !== "") {
        condition += "cla.created = to_date('" + created + "', 'yyyy-MM-dd') AND ";
      }
			
			if((typeof care_team !== 'undefined' && care_team !== "")){
        join += " LEFT JOIN BACIRO_FHIR.CLAIM_CARE_TEAM cct ON cct.claim_id = cla.claim_id ";
        condition += "(cct.provider_practitioner = '" + care_team + "' OR cct.provider_organization = '" + care_team + "') AND ";
      }
			
			if((typeof encounter !== 'undefined' && encounter !== "")){
        join += " left join baciro_fhir.claim_item cit on cla.claim_id = cit.claim_id left join baciro_fhir.encounter enc on cit.item_id = enc.claim_id ";
        condition += "enc.claim_id = '" + encounter + "' AND ";
      }
			
			if(typeof enterer !== 'undefined' && enterer !== ""){
				condition += "cla.enterer = '" + enterer + "' AND,";  
      }
			
			if(typeof facility !== 'undefined' && facility !== ""){
				condition += "cla.facility = '" + facility + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.claim_id = cla.claim_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if(typeof insurer !== 'undefined' && insurer !== ""){
				condition += "cla.insurer = '" + insurer + "' AND,";  
      }
			
			if(typeof organization !== 'undefined' && organization !== ""){
				condition += "cla.organization = '" + organization + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
				condition += "cla.patient = '" + patient + "' AND,";  
      }
			
			if(typeof priority !== 'undefined' && priority !== ""){
				condition += "cla.priority = '" + priority + "' AND,";  
      }
			
			if(typeof payee !== 'undefined' && payee !== ""){
				condition += "(cla.payee_party_practitioner = '" + payee + "' OR cla.payee_party_organization = '" + payee + "' OR cla.payee_party_patient = '" + payee + "' OR cla.payee_party_related_person = '" + payee + "') AND,";  
      }
			
			if(typeof provider !== 'undefined' && provider !== ""){
				condition += "cla.provider = '" + provider + "' AND,";  
      }
			
			if(typeof use !== 'undefined' && use !== ""){
				condition += "cla.use = '" + use + "' AND,";  
      }

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " cla.claim_id > '" + offset + "' AND ";       
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

      var arrClaim = [];
      var query = "select cla.claim_id as claim_id, cla.total as status, cla.total as type, cla.total as subtype, cla.total as uses, cla.total as patient, cla.total as billable_period_start, cla.total as billable_period_end, cla.total as created, cla.total as enterer, cla.total as insurer, cla.total as provider, cla.total as organization, cla.total as priority, cla.total as funds_reserve, cla.total as prescription_medication_request, cla.total as prescription_vision_prescription, cla.total as original_prescription, cla.total as payee_type, cla.total as payee_resource_type, cla.total as payee_party_practitioner, cla.total as payee_party_organization, cla.total as payee_party_patient, cla.total as payee_party_related_person, cla.total as referral, cla.total as facility, cla.total as employment_impacted_start, cla.total as employment_impacted_end, cla.total as hospitalization_start, cla.total as hospitalization_end, cla.total as total from BACIRO_FHIR.claim cla " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Claim = {};
					Claim.resourceType = "Claim";
          Claim.id = rez[i].claim_id;
					Claim.status = rez[i].status;
					Claim.type = rez[i].type;
					Claim.subtype = rez[i].subtype;
					Claim.uses = rez[i].uses;
					if(rez[i].patient != "null"){
						Claim.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						Claim.patient = "";
					}
					var periodStart,periodEnd;
					if(rez[i].billable_period_start == null){
						periodStart = formatDate(rez[i].billable_period_start);  
					}else{
						periodStart = rez[i].billable_period_start;  
					}
					if(rez[i].billable_period_end == null){
						periodEnd = formatDate(rez[i].billable_period_end);  
					}else{
						periodEnd = rez[i].billable_period_end;  
					}
					Claim.billablePeriod = periodStart + ' to ' + periodEnd;
					if(rez[i].created == null){
						Claim.created = formatDate(rez[i].created);  
					}else{
						Claim.created = rez[i].created;  
					}
					if(rez[i].enterer != "null"){
						Claim.enterer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].enterer;
					} else {
						Claim.enterer = "";
					}
					if(rez[i].insurer != "null"){
						Claim.insurer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].insurer;
					} else {
						Claim.insurer = "";
					}
					if(rez[i].provider != "null"){
						Claim.provider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].provider;
					} else {
						Claim.provider = "";
					}
					if(rez[i].organization != "null"){
						Claim.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization;
					} else {
						Claim.organization = "";
					}
					Claim.priority = rez[i].priority;
					Claim.fundsReserve = rez[i].funds_reserve;
					var Prescription = {};					
					if(rez[i].prescription_medication_request != "null"){
						Prescription.medicationRequest = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' +  rez[i].prescription_medication_request;
					} else {
						Prescription.medicationRequest = "";
					}
					if(rez[i].prescription_vision_prescription != "null"){
						Prescription.visionPrescription = hostFHIR + ':' + portFHIR + '/' + apikey + '/VisionPrescription?_id=' +  rez[i].prescription_vision_prescription;
					} else {
						Prescription.visionPrescription = "";
					}
					Claim.prescription = Prescription;
					if(rez[i].original_prescription != "null"){
						Claim.originalPrescription = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' +  rez[i].original_prescription;
					} else {
						Claim.originalPrescription = "";
					}
					var Payee = {};				
					Payee.type = rez[i].payee_type;
					Payee.resourceType = rez[i].payee_resource_type;
					var Party = {};
					if(rez[i].payee_party_practitioner != "null"){
						Party.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].payee_party_practitioner;
					} else {
						Party.practitioner = "";
					}
					if(rez[i].payee_party_organization != "null"){
						Party.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].payee_party_organization;
					} else {
						Party.organization = "";
					}
					if(rez[i].payee_party_patient != "null"){
						Party.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].payee_party_patient;
					} else {
						Party.patient = "";
					}
					if(rez[i].payee_party_related_person != "null"){
						Party.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].payee_party_related_person;
					} else {
						Party.relatedPerson = "";
					}
					Payee.party = Party;
					Claim.payee = Payee;
					Claim.referral = rez[i].referral;
					Claim.facility = rez[i].facility;
					var employmentImpactedStart,employmentImpactedEnd;
					if(rez[i].employment_impacted_start == null){
						employmentImpactedStart = formatDate(rez[i].employment_impacted_start);  
					}else{
						employmentImpactedStart = rez[i].employment_impacted_start;  
					}
					if(rez[i].employment_impacted_end == null){
						employmentImpactedEnd = formatDate(rez[i].employment_impacted_end);  
					}else{
						employmentImpactedEnd = rez[i].employment_impacted_end;  
					}
					Claim.employmentImpacted = employmentImpactedStart + ' to ' + employmentImpactedEnd;
					var hospitalizationStart, hospitalizationEnd;
					if(rez[i].hospitalization_start == null){
						hospitalizationStart = formatDate(rez[i].hospitalization_start);  
					}else{
						hospitalizationStart = rez[i].hospitalization_start;  
					}
					if(rez[i].hospitalization_end == null){
						hospitalizationEnd = formatDate(rez[i].hospitalization_end);  
					}else{
						hospitalizationEnd = rez[i].hospitalization_end;  
					}
					Claim.hospitalization = hospitalizationStart + ' to ' + hospitalizationEnd;
					Claim.total = rez[i].total;
	
          arrClaim[i] = Claim;
        }
        res.json({"err_code":0,"data": arrClaim});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getClaim"});
      });
    },
		claimRelated: function getClaimRelated(req, res) {
			var apikey = req.params.apikey;
			
			var claimRelatedId = req.query._id;
			var claimId = req.query.claim_id;

			//susun query
			var condition = "";

			if (typeof claimRelatedId !== 'undefined' && claimRelatedId !== "") {
				condition += "related_id = '" + claimRelatedId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimRelated = [];
			var query = "select related_id, claim, relationship, reference from BACIRO_FHIR.claim_related " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimRelated = {};
					ClaimRelated.id = rez[i].related_id;
					if(rez[i].claim != "null"){
						Claim.claim = hostFHIR + ':' + portFHIR + '/' + apikey + '/Claim?_id=' +  rez[i].claim;
					} else {
						Claim.claim = "";
					}
					ClaimRelated.relationship = rez[i].relationship;
					ClaimRelated.reference = rez[i].reference;
					
					arrClaimRelated[i] = ClaimRelated;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimRelated
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimRelated"
				});
			});
		},
		claimCareTeam: function getClaimCareTeam(req, res) {
			var apikey = req.params.apikey;
			
			var claimCareTeamId = req.query._id;
			var claimId = req.query.claim_id;

			//susun query
			var condition = "";

			if (typeof claimCareTeamId !== 'undefined' && claimCareTeamId !== "") {
				condition += "care_team_id = '" + claimCareTeamId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimCareTeam = [];
			var query = "select care_team_id, sequences, provider_practitioner, provider_organization, responsible, role, qualification from BACIRO_FHIR.claim_care_team " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimCareTeam = {};
					ClaimCareTeam.id = rez[i].care_team_id;
					ClaimCareTeam.sequences = rez[i].sequences;
					var Provider = {};
					if(rez[i].provider_practitioner != "null"){
						Provider.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].provider_practitioner;
					} else {
						Provider.practitioner = "";
					}
					if(rez[i].provider_organization != "null"){
						Provider.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].provider_organization;
					} else {
						Provider.organization = "";
					}
					ClaimCareTeam.provider = Provider;
					ClaimCareTeam.responsible = rez[i].responsible;
					ClaimCareTeam.role = rez[i].role;
					ClaimCareTeam.qualification = rez[i].qualification;
					
					arrClaimCareTeam[i] = ClaimCareTeam;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimCareTeam
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimCareTeam"
				});
			});
		},
		claimInformation: function getClaimInformation(req, res) {
			var apikey = req.params.apikey;
			
			var claimInformationId = req.query._id;
			var claimId = req.query.claim_id;

			//susun query
			var condition = "";

			if (typeof claimInformationId !== 'undefined' && claimInformationId !== "") {
				condition += "information_id = '" + claimInformationId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimInformation = [];
			var query = "select information_id, sequences, category, code, timing_date, timing_period_start, timing_period_end, value_string, value_quantity, value_attachment, value_reference, reason from BACIRO_FHIR.claim_information " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimInformation = {};
					ClaimInformation.id = rez[i].information_id;
					ClaimInformation.sequences = rez[i].sequences;
					ClaimInformation.category = rez[i].category;
					ClaimInformation.code = rez[i].code;
					var Timing = {};
					if(rez[i].timing_date == null){
						Timing.timingDate = formatDate(rez[i].timing_date);  
					}else{
						Timing.timingDate = rez[i].timing_date;  
					}
					var PeriodStart, PeriodEnd;
					if(rez[i].timing_period_start == null){
						PeriodStart = formatDate(rez[i].timing_period_start);  
					}else{
						PeriodStart = rez[i].timing_period_start;  
					}
					if(rez[i].timing_period_end == null){
						PeriodEnd = formatDate(rez[i].timing_period_end);  
					}else{
						PeriodEnd = rez[i].timing_period_end;  
					}
					Timing.timingPeriod = PeriodStart + ' to ' + PeriodEnd;
					ClaimInformation.timing = Timing;
					var Value = {};
					Value.string = rez[i].value_string;
					Value.quantity = rez[i].value_quantity;
					if(rez[i].value_attachment != "null"){
						Value.attachment = hostFHIR + ':' + portFHIR + '/' + apikey + '/attachment?_id=' +  rez[i].value_attachment;
					} else {
						Value.attachment = "";
					}
					Value.reference = rez[i].value_reference;
					ClaimInformation.value = Value;
					ClaimInformation.reason = rez[i].reason;
					
					arrClaimInformation[i] = ClaimInformation;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimInformation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimInformation"
				});
			});
		},
		claimDiagnosis: function getClaimDiagnosis(req, res) {
			var apikey = req.params.apikey;
			
			var claimDiagnosisId = req.query._id;
			var claimId = req.query.claim_id;

			//susun query
			var condition = "";

			if (typeof claimDiagnosisId !== 'undefined' && claimDiagnosisId !== "") {
				condition += "diagnosis_id = '" + claimDiagnosisId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimDiagnosis = [];
			var query = "select diagnosis_id, sequences, diagnosis_codeable_concept, diagnosis_reference, type, package_code from BACIRO_FHIR.claim_diagnosis " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimDiagnosis = {};
					ClaimDiagnosis.id = rez[i].diagnosis_id;
					ClaimDiagnosis.id = rez[i].sequences;
					var Diagnosis = {};					
					Diagnosis.diagnosisCodeableConcept = rez[i].diagnosis_codeable_concept;
					if(rez[i].diagnosis_reference != "null"){
						Diagnosis.diagnosisReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].diagnosis_reference;
					} else {
						Diagnosis.diagnosisReference = "";
					}
					ClaimDiagnosis.type = rez[i].type;
					ClaimDiagnosis.packageCode = rez[i].package_code;
					
					arrClaimDiagnosis[i] = ClaimDiagnosis;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimDiagnosis
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimDiagnosis"
				});
			});
		},
		claimProcedure: function getClaimProcedure(req, res) {
			var apikey = req.params.apikey;
			
			var claimProcedureId = req.query._id;
			var claimId = req.query.claim_id;

			//susun query
			var condition = "";

			if (typeof claimProcedureId !== 'undefined' && claimProcedureId !== "") {
				condition += "procedure_id = '" + claimProcedureId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimProcedure = [];
			var query = "select procedure_id, sequences, date, procedure_codeable_concept, procedure_reference from BACIRO_FHIR.claim_procedure " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimProcedure = {};
					ClaimProcedure.id = rez[i].procedure_id;
					ClaimProcedure.sequences = rez[i].sequences;
					if(rez[i].date == null){
						ClaimProcedure.date = formatDate(rez[i].date);  
					}else{
						ClaimProcedure.date = rez[i].date;  
					}
					var Procedure = {};
					Procedure.procedureCodeableConcept = rez[i].procedure_codeable_concept;
					if(rez[i].procedure_reference != "null"){
						Procedure.procedureReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Procedure?_id=' +  rez[i].procedure_reference;
					} else {
						Procedure.procedureReference = "";
					}
					ClaimProcedure.procedure = Procedure;
					
					
					arrClaimProcedure[i] = ClaimProcedure;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimProcedure
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimProcedure"
				});
			});
		},
		claimInsurance: function getClaimInsurance(req, res) {
			var apikey = req.params.apikey;
			
			var claimInsuranceId = req.query._id;
			var claimId = req.query.claim_id;

			//susun query
			var condition = "";

			if (typeof claimInsuranceId !== 'undefined' && claimInsuranceId !== "") {
				condition += "insurance_id = '" + claimInsuranceId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimInsurance = [];
			var query = "select insurance_id, sequences, focal, coverage, business_arrangement, pre_auth_ref, claim_response from BACIRO_FHIR.claim_insurance " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimInsurance = {};
					ClaimInsurance.id = rez[i].insurance_id;
					ClaimInsurance.sequences = rez[i].sequences;
					ClaimInsurance.focal = rez[i].focal;
					if(rez[i].coverage != "null"){
						ClaimInsurance.coverage = hostFHIR + ':' + portFHIR + '/' + apikey + '/Coverage?_id=' +  rez[i].coverage;
					} else {
						ClaimInsurance.coverage = "";
					}
					ClaimInsurance.businessArrangement = rez[i].business_arrangement;
					ClaimInsurance.preAuthRef = rez[i].pre_auth_ref;
					if(rez[i].claim_response != "null"){
						ClaimInsurance.claimResponse = hostFHIR + ':' + portFHIR + '/' + apikey + '/ClaimResponse?_id=' +  rez[i].claim_response;
					} else {
						ClaimInsurance.claimResponse = "";
					}
					
					arrClaimInsurance[i] = ClaimInsurance;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimInsurance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimInsurance"
				});
			});
		},
		claimAccident: function getClaimAccident(req, res) {
			var apikey = req.params.apikey;
			
			var claimAccidentId = req.query._id;
			var claimId = req.query.claim_id;

			//susun query
			var condition = "";

			if (typeof claimAccidentId !== 'undefined' && claimAccidentId !== "") {
				condition += "accident_id = '" + claimAccidentId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimAccident = [];
			var query = "select accident_id, date, type, location_address_use, location_address_type, location_address_text, location_address_line, location_address_city, location_address_district, location_address_state, location_address_postal_code, location_address_country, location_address_period_start, location_address_period_end, location_reference from BACIRO_FHIR.claim_accident " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimAccident = {};
					ClaimAccident.id = rez[i].accident_id;
					if(rez[i].date == null){
						ClaimAccident.date = formatDate(rez[i].date);  
					}else{
						ClaimAccident.date = rez[i].date;  
					}
					ClaimAccident.type = rez[i].type;
					var Location = {};
					var Address = {};
					Address.use = rez[i].location_address_use; 
					Address.type = rez[i].location_address_type; 
					Address.text = rez[i].location_address_text; 
					Address.line = rez[i].location_address_line; 
					Address.city = rez[i].location_address_city; 
					Address.district = rez[i].location_address_district; 
					Address.state = rez[i].location_address_state; 
					Address.postalCode = rez[i].location_address_postal_code; 
					Address.country = rez[i].location_address_country; 
					var AddressStart, AddressEnd;
					if(rez[i].location_address_period_start == null){
						AddressStart = formatDate(rez[i].location_address_period_start);  
					}else{
						AddressStart = rez[i].location_address_period_start;  
					}
					if(rez[i].location_address_period_end == null){
						AddressEnd = formatDate(rez[i].location_address_period_end);  
					}else{
						AddressEnd = rez[i].location_address_period_end;  
					}
					Address.period = AddressStart + ' to ' + AddressEnd;
					Location.locationAddress = Address;
					if(rez[i].location_reference != "null"){
						Location.locationReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].location_reference;
					} else {
						Location.locationReference = "";
					}
					ClaimAccident.location = Location;
					
					arrClaimAccident[i] = ClaimAccident;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimAccident
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimAccident"
				});
			});
		},
		claimItem: function getClaimItem(req, res) {
			var apikey = req.params.apikey;
			
			var claimItemId = req.query._id;
			var claimId = req.query.claim_id;

			//susun query
			var condition = "";

			if (typeof claimItemId !== 'undefined' && claimItemId !== "") {
				condition += "item_id = '" + claimItemId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimItem = [];
			var query = "select item_id, sequences, care_team_link_id, diagnosis_link_id, procedure_link_id, information_link_id, revenue, category, service, modifier, program_code, serviced_date, serviced_period_start, serviced_period_end, location_codeable_concept, location_address_use, location_address_type, location_address_text, location_address_line, location_address_city, location_address_district, location_address_state, location_address_postal_code, location_address_country, location_address_period_start, location_address_period_end, location_reference, quantity, unit_price, factor, net, body_site, sub_site from BACIRO_FHIR.claim_item " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimItem = {};
					ClaimItem.id = rez[i].item_id;
					ClaimItem.sequences = rez[i].sequences;
					ClaimItem.careTeamLinkId = rez[i].care_team_link_id;
					ClaimItem.diagnosisLinkId = rez[i].diagnosis_link_id;
					ClaimItem.procedureLinkId = rez[i].procedure_link_id;
					ClaimItem.informationLinkId = rez[i].information_link_id;
					ClaimItem.revenue = rez[i].revenue;
					ClaimItem.category = rez[i].category;
					ClaimItem.service = rez[i].service;
					ClaimItem.modifier = rez[i].modifier;
					ClaimItem.programCode = rez[i].program_code;
					var Serviced = {};
					if(rez[i].serviced_date == null){
						Serviced.servicedDate = formatDate(rez[i].serviced_date);  
					}else{
						Serviced.servicedDate = rez[i].serviced_date;  
					}
					var servicedStart, servicedEnd;
					if(rez[i].serviced_period_start == null){
						servicedStart = formatDate(rez[i].serviced_period_start);  
					}else{
						servicedStart = rez[i].serviced_period_start;  
					}
					if(rez[i].serviced_period_end == null){
						servicedEnd = formatDate(rez[i].serviced_period_end);  
					}else{
						servicedEnd = rez[i].serviced_period_end;  
					}
					Serviced.servicedPeriod = servicedStart + ' to ' + servicedEnd;
					ClaimItem.serviced = Serviced;
					var Location = {};
					Location.locationCodeableConcept = rez[i].location_codeable_concept;
					var Address = {};
					Address.use = rez[i].location_address_use; 
					Address.type = rez[i].location_address_type; 
					Address.text = rez[i].location_address_text; 
					Address.line = rez[i].location_address_line; 
					Address.city = rez[i].location_address_city; 
					Address.district = rez[i].location_address_district; 
					Address.state = rez[i].location_address_state; 
					Address.postalCode = rez[i].location_address_postal_code; 
					Address.country = rez[i].location_address_country; 
					var AddressStart, AddressEnd;
					if(rez[i].location_address_period_start == null){
						AddressStart = formatDate(rez[i].location_address_period_start);  
					}else{
						AddressStart = rez[i].location_address_period_start;  
					}
					if(rez[i].location_address_period_end == null){
						AddressEnd = formatDate(rez[i].location_address_period_end);  
					}else{
						AddressEnd = rez[i].location_address_period_end;  
					}
					Address.period = AddressStart + ' to ' + AddressEnd;
					Location.locationAddress = Address;
					if(rez[i].location_reference != "null"){
						Location.locationReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].location_reference;
					} else {
						Location.locationReference = "";
					}
					ClaimItem.location = Location;
					ClaimItem.quantity = rez[i].quantity;
					ClaimItem.unitPrice = rez[i].unit_price;
					ClaimItem.factor = rez[i].factor;
					ClaimItem.net = rez[i].net;
					ClaimItem.bodySite = rez[i].body_site;
					ClaimItem.subSite = rez[i].sub_site;
					
					arrClaimItem[i] = ClaimItem;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimItem
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimItem"
				});
			});
		},
		claimDetail: function getClaimDetail(req, res) {
			var apikey = req.params.apikey;
			
			var claimDetailId = req.query._id;
			var claimId = req.query.item_id;

			//susun query
			var condition = "";

			if (typeof claimDetailId !== 'undefined' && claimDetailId !== "") {
				condition += "detail_id = '" + claimDetailId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "item_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimDetail = [];
			var query = "select detail_id, sequences, revenue, category, service, modifier, program_code, quantity, unit_price, factor, net from BACIRO_FHIR.claim_detail " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimDetail = {};
					ClaimDetail.id = rez[i].detail_id;
					ClaimDetail.sequences = rez[i].sequences;
					ClaimDetail.revenue = rez[i].revenue;
					ClaimDetail.category = rez[i].category;
					ClaimDetail.service = rez[i].service;
					ClaimDetail.modifier = rez[i].modifier;
					ClaimDetail.programCode = rez[i].program_code;
					ClaimDetail.quantity = rez[i].quantity;
					ClaimDetail.unitPrice = rez[i].unit_price;
					ClaimDetail.factor = rez[i].factor;
					ClaimDetail.net = rez[i].net;			
					
					arrClaimDetail[i] = ClaimDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimDetail"
				});
			});
		},
		claimSubDetail: function getClaimSubDetail(req, res) {
			var apikey = req.params.apikey;
			
			var claimSubDetailId = req.query._id;
			var claimId = req.query.detail_id;

			//susun query
			var condition = "";

			if (typeof claimSubDetailId !== 'undefined' && claimSubDetailId !== "") {
				condition += "sub_detail_id = '" + claimSubDetailId + "' AND ";
			}

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "detail_id = '" + claimId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimSubDetail = [];
			var query = "select sub_detail_id, sequences, revenue, category, service, modifier, program_code, quantity, unit_price, factor, net from BACIRO_FHIR.claim_sub_detail " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimSubDetail = {};
					ClaimSubDetail.id = rez[i].sub_detail_id;
					ClaimSubDetail.sequences = rez[i].sequences;
					ClaimSubDetail.revenue = rez[i].revenue;
					ClaimSubDetail.category = rez[i].category;
					ClaimSubDetail.service = rez[i].service;
					ClaimSubDetail.modifier = rez[i].modifier;
					ClaimSubDetail.programCode = rez[i].program_code;
					ClaimSubDetail.quantity = rez[i].quantity;
					ClaimSubDetail.unitPrice = rez[i].unit_price;
					ClaimSubDetail.factor = rez[i].factor;
					ClaimSubDetail.net = rez[i].net;		
					
					arrClaimSubDetail[i] = ClaimSubDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimSubDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimSubDetail"
				});
			});
		},
		
		claimItemUdi: function getClaimItemUdi(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var claimId = req.query.claim_item_id;

			//susun query
			var condition = '';

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_item_id = '" + claimId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrClaimItemUdi = [];
			var query = 'select device_id from BACIRO_FHIR.device ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var claimItemUdi = {};
					if(rez[i].device_id != "null"){
						claimItemUdi.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/device?_id=' +  rez[i].device_id;
					} else {
						claimItemUdi.id = "";
					}
					
					arrClaimItemUdi[i] = claimItemUdi;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimItemUdi
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimItemUdi"
				});
			});
		},
		claimItemEncounter: function getClaimItemEncounter(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var claimId = req.query.claim_id;

			//susun query
			var condition = '';

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_id = '" + claimId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrClaimItemEncounter = [];
			var query = 'select encounter_id from BACIRO_FHIR.encounter ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var claimItemEncounter = {};
					if(rez[i].encounter_id != "null"){
						claimItemEncounter.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/encounter?_id=' +  rez[i].encounter_id;
					} else {
						claimItemEncounter.id = "";
					}
					
					arrClaimItemEncounter[i] = claimItemEncounter;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimItemEncounter
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimItemEncounter"
				});
			});
		},		
		claimItemDetailUdi: function getClaimItemDetailUdi(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var claimId = req.query.claim_detail_id;

			//susun query
			var condition = '';

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_detail_id = '" + claimId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrClaimItemDetailUdi = [];
			var query = 'select device_id from BACIRO_FHIR.device ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var claimItemDetailUdi = {};
					if(rez[i].device_id != "null"){
						claimItemDetailUdi.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/device?_id=' +  rez[i].device_id;
					} else {
						claimItemDetailUdi.id = "";
					}
					
					arrClaimItemDetailUdi[i] = claimItemDetailUdi;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimItemDetailUdi
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimItemDetailUdi"
				});
			});
		},
		claimItemSubDetailUdi: function getClaimItemSubDetailUdi(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var claimId = req.query.claim_sub_detail_id;

			//susun query
			var condition = '';

			if (typeof claimId !== 'undefined' && claimId !== "") {
				condition += "claim_sub_detail_id = '" + claimId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrClaimItemSubDetailUdi = [];
			var query = 'select device_id from BACIRO_FHIR.device ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var claimItemSubDetailUdi = {};
					if(rez[i].device_id != "null"){
						claimItemSubDetailUdi.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/device?_id=' +  rez[i].device_id;
					} else {
						claimItemSubDetailUdi.id = "";
					}
					
					arrClaimItemSubDetailUdi[i] = claimItemSubDetailUdi;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimItemSubDetailUdi
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimItemSubDetailUdi"
				});
			});
		},		
  },
	post: {
		claim: function addClaim(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var claim_id  = req.body.claim_id;
			var status  = req.body.status;
			var type  = req.body.type;
			var subtype  = req.body.subtype;
			var uses  = req.body.uses;
			var patient  = req.body.patient;
			var billable_period_start  = req.body.billable_period_start;
			var billable_period_end  = req.body.billable_period_end;
			var created  = req.body.created;
			var enterer  = req.body.enterer;
			var insurer  = req.body.insurer;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var priority  = req.body.priority;
			var funds_reserve  = req.body.funds_reserve;
			var prescription_medication_request  = req.body.prescription_medication_request;
			var prescription_vision_prescription  = req.body.prescription_vision_prescription;
			var original_prescription  = req.body.original_prescription;
			var payee_type  = req.body.payee_type;
			var payee_resource_type  = req.body.payee_resource_type;
			var payee_party_practitioner  = req.body.payee_party_practitioner;
			var payee_party_organization  = req.body.payee_party_organization;
			var payee_party_patient  = req.body.payee_party_patient;
			var payee_party_related_person  = req.body.payee_party_related_person;
			var referral  = req.body.referral;
			var facility  = req.body.facility;
			var employment_impacted_start  = req.body.employment_impacted_start;
			var employment_impacted_end  = req.body.employment_impacted_end;
			var hospitalization_start  = req.body.hospitalization_start;
			var hospitalization_end  = req.body.hospitalization_end;
			var total  = req.body.total;
			var claim_response_id  = req.body.claim_response_id;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof subtype !== 'undefined' && subtype !== "") {
				column += 'subtype,';
				values += " '" + subtype +"',";
			}

			if (typeof uses !== 'undefined' && uses !== "") {
				column += 'uses,';
				values += " '" + uses +"',";
			}

			if (typeof patient !== 'undefined' && patient !== "") {
				column += 'patient,';
				values += " '" + patient +"',";
			}

			if (typeof  billable_period_start !== 'undefined' &&  billable_period_start !== "") {
				column += ' billable_period_start,';
				values += "to_date('"+  billable_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  billable_period_end !== 'undefined' &&  billable_period_end !== "") {
				column += ' billable_period_end,';
				values += "to_date('"+  billable_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof enterer !== 'undefined' && enterer !== "") {
				column += 'enterer,';
				values += " '" + enterer +"',";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof provider !== 'undefined' && provider !== "") {
				column += 'provider,';
				values += " '" + provider +"',";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof priority !== 'undefined' && priority !== "") {
				column += 'priority,';
				values += " '" + priority +"',";
			}

			if (typeof funds_reserve !== 'undefined' && funds_reserve !== "") {
				column += 'funds_reserve,';
				values += " '" + funds_reserve +"',";
			}

			if (typeof prescription_medication_request !== 'undefined' && prescription_medication_request !== "") {
				column += 'prescription_medication_request,';
				values += " '" + prescription_medication_request +"',";
			}

			if (typeof prescription_vision_prescription !== 'undefined' && prescription_vision_prescription !== "") {
				column += 'prescription_vision_prescription,';
				values += " '" + prescription_vision_prescription +"',";
			}

			if (typeof original_prescription !== 'undefined' && original_prescription !== "") {
				column += 'original_prescription,';
				values += " '" + original_prescription +"',";
			}

			if (typeof payee_type !== 'undefined' && payee_type !== "") {
				column += 'payee_type,';
				values += " '" + payee_type +"',";
			}

			if (typeof payee_resource_type !== 'undefined' && payee_resource_type !== "") {
				column += 'payee_resource_type,';
				values += " '" + payee_resource_type +"',";
			}

			if (typeof payee_party_practitioner !== 'undefined' && payee_party_practitioner !== "") {
				column += 'payee_party_practitioner,';
				values += " '" + payee_party_practitioner +"',";
			}

			if (typeof payee_party_organization !== 'undefined' && payee_party_organization !== "") {
				column += 'payee_party_organization,';
				values += " '" + payee_party_organization +"',";
			}

			if (typeof payee_party_patient !== 'undefined' && payee_party_patient !== "") {
				column += 'payee_party_patient,';
				values += " '" + payee_party_patient +"',";
			}

			if (typeof payee_party_related_person !== 'undefined' && payee_party_related_person !== "") {
				column += 'payee_party_related_person,';
				values += " '" + payee_party_related_person +"',";
			}

			if (typeof referral !== 'undefined' && referral !== "") {
				column += 'referral,';
				values += " '" + referral +"',";
			}

			if (typeof facility !== 'undefined' && facility !== "") {
				column += 'facility,';
				values += " '" + facility +"',";
			}

			if (typeof  employment_impacted_start !== 'undefined' &&  employment_impacted_start !== "") {
				column += ' employment_impacted_start,';
				values += "to_date('"+  employment_impacted_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  employment_impacted_end !== 'undefined' &&  employment_impacted_end !== "") {
				column += ' employment_impacted_end,';
				values += "to_date('"+  employment_impacted_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  hospitalization_start !== 'undefined' &&  hospitalization_start !== "") {
				column += ' hospitalization_start,';
				values += "to_date('"+  hospitalization_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  hospitalization_end !== 'undefined' &&  hospitalization_end !== "") {
				column += ' hospitalization_end,';
				values += "to_date('"+  hospitalization_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof total !== 'undefined' && total !== "") {
				column += 'total,';
				values += " '" + total +"',";
			}

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
			}

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim(claim_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+claim_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select claim_id from BACIRO_FHIR.claim WHERE claim_id = '" + claim_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaim"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaim"});
      });
    },
		claimRelated: function addClaimRelated(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var related_id = req.body.related_id;
			var claim  = req.body.claim;
			var relationship  = req.body.relationship;
			var reference  = req.body.reference;
			var claim_id  = req.body.claim_id;
			
			if (typeof claim !== 'undefined' && claim !== "") {
				column += 'claim,';
				values += " '" + claim +"',";
			}

			if (typeof relationship !== 'undefined' && relationship !== "") {
				column += 'relationship,';
				values += " '" + relationship +"',";
			}

			if (typeof reference !== 'undefined' && reference !== "") {
				column += 'reference,';
				values += " '" + reference +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_related(related_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+related_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select related_id from BACIRO_FHIR.claim_related WHERE related_id = '" + related_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimRelated"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimRelated"});
      });
    },
		claimCareTeam: function addClaimCareTeam(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var care_team_id = req.body.care_team_id;
			var sequences  = req.body.sequences;
			var provider_practitioner  = req.body.provider_practitioner;
			var provider_organization  = req.body.provider_organization;
			var responsible  = req.body.responsible;
			var role  = req.body.role;
			var qualification  = req.body.qualification;
			var claim_id  = req.body.claim_id;			
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof provider_practitioner !== 'undefined' && provider_practitioner !== "") {
				column += 'provider_practitioner,';
				values += " '" + provider_practitioner +"',";
			}

			if (typeof provider_organization !== 'undefined' && provider_organization !== "") {
				column += 'provider_organization,';
				values += " '" + provider_organization +"',";
			}

			if (typeof responsible !== 'undefined' && responsible !== "") {
				column += 'responsible,';
				values += " '" + responsible +"',";
			}

			if (typeof role !== 'undefined' && role !== "") {
				column += 'role,';
				values += " '" + role +"',";
			}

			if (typeof qualification !== 'undefined' && qualification !== "") {
				column += 'qualification,';
				values += " '" + qualification +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_care_team(care_team_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+care_team_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select care_team_id from BACIRO_FHIR.claim_care_team WHERE care_team_id = '" + care_team_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimCareTeam"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimCareTeam"});
      });
    },
		claimInformation: function addClaimInformation(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var information_id = req.body.information_id;
			var sequences  = req.body.sequences;
			var category  = req.body.category;
			var code  = req.body.code;
			var timing_date  = req.body.timing_date;
			var timing_period_start  = req.body.timing_period_start;
			var timing_period_end  = req.body.timing_period_end;
			var value_string  = req.body.value_string;
			var value_quantity  = req.body.value_quantity;
			var value_attachment  = req.body.value_attachment;
			var value_reference  = req.body.value_reference;
			var reason  = req.body.reason;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof code !== 'undefined' && code !== "") {
				column += 'code,';
				values += " '" + code +"',";
			}

			if (typeof  timing_date !== 'undefined' &&  timing_date !== "") {
				column += ' timing_date,';
				values += "to_date('"+  timing_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  timing_period_start !== 'undefined' &&  timing_period_start !== "") {
				column += ' timing_period_start,';
				values += "to_date('"+  timing_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  timing_period_end !== 'undefined' &&  timing_period_end !== "") {
				column += ' timing_period_end,';
				values += "to_date('"+  timing_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof value_string !== 'undefined' && value_string !== "") {
				column += 'value_string,';
				values += " '" + value_string +"',";
			}

			if (typeof value_quantity !== 'undefined' && value_quantity !== "") {
				column += 'value_quantity,';
				values += " '" + value_quantity +"',";
			}

			if (typeof value_attachment !== 'undefined' && value_attachment !== "") {
				column += 'value_attachment,';
				values += " '" + value_attachment +"',";
			}

			if (typeof value_reference !== 'undefined' && value_reference !== "") {
				column += 'value_reference,';
				values += " '" + value_reference +"',";
			}

			if (typeof reason !== 'undefined' && reason !== "") {
				column += 'reason,';
				values += " '" + reason +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_information(information_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+information_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select information_id from BACIRO_FHIR.claim_information WHERE information_id = '" + information_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimInformation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimInformation"});
      });
    },
		claimDiagnosis: function addClaimDiagnosis(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var diagnosis_id = req.body.diagnosis_id;
			var sequences  = req.body.sequences;
			var diagnosis_codeable_concept  = req.body.diagnosis_codeable_concept;
			var diagnosis_reference  = req.body.diagnosis_reference;
			var type  = req.body.type;
			var package_code  = req.body.package_code;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof diagnosis_codeable_concept !== 'undefined' && diagnosis_codeable_concept !== "") {
				column += 'diagnosis_codeable_concept,';
				values += " '" + diagnosis_codeable_concept +"',";
			}

			if (typeof diagnosis_reference !== 'undefined' && diagnosis_reference !== "") {
				column += 'diagnosis_reference,';
				values += " '" + diagnosis_reference +"',";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof package_code !== 'undefined' && package_code !== "") {
				column += 'package_code,';
				values += " '" + package_code +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_diagnosis(diagnosis_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+diagnosis_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select diagnosis_id from BACIRO_FHIR.claim_diagnosis WHERE diagnosis_id = '" + diagnosis_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimDiagnosis"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimDiagnosis"});
      });
    },
		claimProcedure: function addClaimProcedure(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var procedure_id = req.body.procedure_id;
			var sequences  = req.body.sequences;
			var date  = req.body.date;
			var procedure_codeable_concept  = req.body.procedure_codeable_concept;
			var procedure_reference  = req.body.procedure_reference;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof  date !== 'undefined' &&  date !== "") {
				column += ' date,';
				values += "to_date('"+  date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof procedure_codeable_concept !== 'undefined' && procedure_codeable_concept !== "") {
				column += 'procedure_codeable_concept,';
				values += " '" + procedure_codeable_concept +"',";
			}

			if (typeof procedure_reference !== 'undefined' && procedure_reference !== "") {
				column += 'procedure_reference,';
				values += " '" + procedure_reference +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_procedure(procedure_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+procedure_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select procedure_id from BACIRO_FHIR.claim_procedure WHERE procedure_id = '" + procedure_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimProcedure"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimProcedure"});
      });
    },
		claimInsurance: function addClaimInsurance(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var insurance_id = req.body.insurance_id;
			var sequences  = req.body.sequences;
			var focal  = req.body.focal;
			var coverage  = req.body.coverage;
			var business_arrangement  = req.body.business_arrangement;
			var pre_auth_ref  = req.body.pre_auth_ref;
			var claim_response  = req.body.claim_response;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof  focal !== 'undefined' && focal !== "") {
				column += ' focal,';
				values += " " + focal +",";
			}

			if (typeof coverage !== 'undefined' && coverage !== "") {
				column += 'coverage,';
				values += " '" + coverage +"',";
			}

			if (typeof business_arrangement !== 'undefined' && business_arrangement !== "") {
				column += 'business_arrangement,';
				values += " '" + business_arrangement +"',";
			}

			if (typeof pre_auth_ref !== 'undefined' && pre_auth_ref !== "") {
				column += 'pre_auth_ref,';
				values += " '" + pre_auth_ref +"',";
			}

			if (typeof claim_response !== 'undefined' && claim_response !== "") {
				column += 'claim_response,';
				values += " '" + claim_response +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_insurance(insurance_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+insurance_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select insurance_id from BACIRO_FHIR.claim_insurance WHERE insurance_id = '" + insurance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimInsurance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimInsurance"});
      });
    },
		claimAccident: function addClaimAccident(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var accident_id = req.body.accident_id;
			var date  = req.body.date;
			var type  = req.body.type;
			var location_address_use  = req.body.location_address_use;
			var location_address_type  = req.body.location_address_type;
			var location_address_text  = req.body.location_address_text;
			var location_address_line  = req.body.location_address_line;
			var location_address_city  = req.body.location_address_city;
			var location_address_district  = req.body.location_address_district;
			var location_address_state  = req.body.location_address_state;
			var location_address_postal_code  = req.body.location_address_postal_code;
			var location_address_country  = req.body.location_address_country;
			var location_address_period_start  = req.body.location_address_period_start;
			var location_address_period_end  = req.body.location_address_period_end;
			var location_reference  = req.body.location_reference;
			var claim_id  = req.body.claim_id;			
			
			if (typeof  date !== 'undefined' &&  date !== "") {
				column += ' date,';
				values += "to_date('"+  date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof location_address_use !== 'undefined' && location_address_use !== "") {
				column += 'location_address_use,';
				values += " '" + location_address_use +"',";
			}

			if (typeof location_address_type !== 'undefined' && location_address_type !== "") {
				column += 'location_address_type,';
				values += " '" + location_address_type +"',";
			}

			if (typeof location_address_text !== 'undefined' && location_address_text !== "") {
				column += 'location_address_text,';
				values += " '" + location_address_text +"',";
			}

			if (typeof location_address_line !== 'undefined' && location_address_line !== "") {
				column += 'location_address_line,';
				values += " '" + location_address_line +"',";
			}

			if (typeof location_address_city !== 'undefined' && location_address_city !== "") {
				column += 'location_address_city,';
				values += " '" + location_address_city +"',";
			}

			if (typeof location_address_district !== 'undefined' && location_address_district !== "") {
				column += 'location_address_district,';
				values += " '" + location_address_district +"',";
			}

			if (typeof location_address_state !== 'undefined' && location_address_state !== "") {
				column += 'location_address_state,';
				values += " '" + location_address_state +"',";
			}

			if (typeof location_address_postal_code !== 'undefined' && location_address_postal_code !== "") {
				column += 'location_address_postal_code,';
				values += " '" + location_address_postal_code +"',";
			}

			if (typeof location_address_country !== 'undefined' && location_address_country !== "") {
				column += 'location_address_country,';
				values += " '" + location_address_country +"',";
			}

			if (typeof  location_address_period_start !== 'undefined' &&  location_address_period_start !== "") {
				column += ' location_address_period_start,';
				values += "to_date('"+  location_address_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  location_address_period_end !== 'undefined' &&  location_address_period_end !== "") {
				column += ' location_address_period_end,';
				values += "to_date('"+  location_address_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}


			if (typeof location_reference !== 'undefined' && location_reference !== "") {
				column += 'location_reference,';
				values += " '" + location_reference +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_accident(accident_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+accident_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select accident_id from BACIRO_FHIR.claim_accident WHERE accident_id = '" + accident_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimAccident"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimAccident"});
      });
    },
		claimItem: function addClaimItem(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var item_id = req.body.item_id;
			var sequences  = req.body.sequences;
			var care_team_link_id  = req.body.care_team_link_id;
			var diagnosis_link_id  = req.body.diagnosis_link_id;
			var procedure_link_id  = req.body.procedure_link_id;
			var information_link_id  = req.body.information_link_id;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var serviced_date  = req.body.serviced_date;
			var serviced_period_start  = req.body.serviced_period_start;
			var serviced_period_end  = req.body.serviced_period_end;
			var location_codeable_concept  = req.body.location_codeable_concept;
			var location_address_use  = req.body.location_address_use;
			var location_address_type  = req.body.location_address_type;
			var location_address_text  = req.body.location_address_text;
			var location_address_line  = req.body.location_address_line;
			var location_address_city  = req.body.location_address_city;
			var location_address_district  = req.body.location_address_district;
			var location_address_state  = req.body.location_address_state;
			var location_address_postal_code  = req.body.location_address_postal_code;
			var location_address_country  = req.body.location_address_country;
			var location_address_period_start  = req.body.location_address_period_start;
			var location_address_period_end  = req.body.location_address_period_end;			
			var location_reference  = req.body.location_reference;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var body_site  = req.body.body_site;
			var sub_site  = req.body.sub_site;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof care_team_link_id !== 'undefined' && care_team_link_id !== "") {
				column += ' care_team_link_id,';
				values += " " + care_team_link_id +",";
			}

			if (typeof diagnosis_link_id !== 'undefined' && diagnosis_link_id !== "") {
				column += ' diagnosis_link_id,';
				values += " " + diagnosis_link_id +",";
			}

			if (typeof procedure_link_id !== 'undefined' && procedure_link_id !== "") {
				column += ' procedure_link_id,';
				values += " " + procedure_link_id +",";
			}

			if (typeof information_link_id !== 'undefined' && information_link_id !== "") {
				column += ' information_link_id,';
				values += " " + information_link_id +",";
			}

			if (typeof revenue !== 'undefined' && revenue !== "") {
				column += 'revenue,';
				values += " '" + revenue +"',";
			}

			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof service !== 'undefined' && service !== "") {
				column += 'service,';
				values += " '" + service +"',";
			}

			if (typeof modifier !== 'undefined' && modifier !== "") {
				column += 'modifier,';
				values += " '" + modifier +"',";
			}

			if (typeof program_code !== 'undefined' && program_code !== "") {
				column += 'program_code,';
				values += " '" + program_code +"',";
			}

			if (typeof  serviced_date !== 'undefined' &&  serviced_date !== "") {
				column += ' serviced_date,';
				values += "to_date('"+  serviced_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  serviced_period_start !== 'undefined' &&  serviced_period_start !== "") {
				column += ' serviced_period_start,';
				values += "to_date('"+  serviced_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  serviced_period_end !== 'undefined' &&  serviced_period_end !== "") {
				column += ' serviced_period_end,';
				values += "to_date('"+  serviced_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof location_codeable_concept !== 'undefined' && location_codeable_concept !== "") {
				column += 'location_codeable_concept,';
				values += " '" + location_codeable_concept +"',";
			}

			if (typeof location_address_use !== 'undefined' && location_address_use !== "") {
				column += 'location_address_use,';
				values += " '" + location_address_use +"',";
			}

			if (typeof location_address_type !== 'undefined' && location_address_type !== "") {
				column += 'location_address_type,';
				values += " '" + location_address_type +"',";
			}

			if (typeof location_address_text !== 'undefined' && location_address_text !== "") {
				column += 'location_address_text,';
				values += " '" + location_address_text +"',";
			}

			if (typeof location_address_line !== 'undefined' && location_address_line !== "") {
				column += 'location_address_line,';
				values += " '" + location_address_line +"',";
			}

			if (typeof location_address_city !== 'undefined' && location_address_city !== "") {
				column += 'location_address_city,';
				values += " '" + location_address_city +"',";
			}

			if (typeof location_address_district !== 'undefined' && location_address_district !== "") {
				column += 'location_address_district,';
				values += " '" + location_address_district +"',";
			}

			if (typeof location_address_state !== 'undefined' && location_address_state !== "") {
				column += 'location_address_state,';
				values += " '" + location_address_state +"',";
			}

			if (typeof location_address_postal_code !== 'undefined' && location_address_postal_code !== "") {
				column += 'location_address_postal_code,';
				values += " '" + location_address_postal_code +"',";
			}

			if (typeof location_address_country !== 'undefined' && location_address_country !== "") {
				column += 'location_address_country,';
				values += " '" + location_address_country +"',";
			}

			if (typeof  location_address_period_start !== 'undefined' &&  location_address_period_start !== "") {
				column += ' location_address_period_start,';
				values += "to_date('"+  location_address_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  location_address_period_end !== 'undefined' &&  location_address_period_end !== "") {
				column += ' location_address_period_end,';
				values += "to_date('"+  location_address_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof location_reference !== 'undefined' && location_reference !== "") {
				column += 'location_reference,';
				values += " '" + location_reference +"',";
			}

			if (typeof quantity !== 'undefined' && quantity !== "") {
				column += ' quantity,';
				values += " " + quantity +",";
			}

			if (typeof unit_price !== 'undefined' && unit_price !== "") {
				column += 'unit_price,';
				values += " '" + unit_price +"',";
			}

			if (typeof factor !== 'undefined' && factor !== "") {
				column += ' factor,';
				values += " " + factor +",";
			}

			if (typeof net !== 'undefined' && net !== "") {
				column += ' net,';
				values += " " + net +",";
			}

			if (typeof body_site !== 'undefined' && body_site !== "") {
				column += 'body_site,';
				values += " '" + body_site +"',";
			}

			if (typeof sub_site !== 'undefined' && sub_site !== "") {
				column += 'sub_site,';
				values += " '" + sub_site +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_item(item_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+item_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select item_id from BACIRO_FHIR.claim_item WHERE item_id = '" + item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimItem"});
      });
    },
		claimDetail: function addClaimDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var detail_id = req.body.detail_id;
			var sequences  = req.body.sequences;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var item_id  = req.body.item_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof revenue !== 'undefined' && revenue !== "") {
				column += 'revenue,';
				values += " '" + revenue +"',";
			}

			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof service !== 'undefined' && service !== "") {
				column += 'service,';
				values += " '" + service +"',";
			}

			if (typeof modifier !== 'undefined' && modifier !== "") {
				column += 'modifier,';
				values += " '" + modifier +"',";
			}

			if (typeof program_code !== 'undefined' && program_code !== "") {
				column += 'program_code,';
				values += " '" + program_code +"',";
			}

			if (typeof quantity !== 'undefined' && quantity !== "") {
				column += ' quantity,';
				values += " " + quantity +",";
			}

			if (typeof unit_price !== 'undefined' && unit_price !== "") {
				column += 'unit_price,';
				values += " '" + unit_price +"',";
			}

			if (typeof factor !== 'undefined' && factor !== "") {
				column += ' factor,';
				values += " " + factor +",";
			}

			if (typeof net !== 'undefined' && net !== "") {
				column += 'net,';
				values += " '" + net +"',";
			}

			if (typeof item_id !== 'undefined' && item_id !== "") {
				column += 'item_id,';
				values += " '" + item_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_detail(detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detail_id from BACIRO_FHIR.claim_detail WHERE detail_id = '" + detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimDetail"});
      });
    },
		claimSubDetail: function addClaimSubDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var sub_detail_id = req.body.sub_detail_id;
			var sequences  = req.body.sequences;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var detail_id  = req.body.detail_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof revenue !== 'undefined' && revenue !== "") {
				column += 'revenue,';
				values += " '" + revenue +"',";
			}

			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof service !== 'undefined' && service !== "") {
				column += 'service,';
				values += " '" + service +"',";
			}

			if (typeof modifier !== 'undefined' && modifier !== "") {
				column += 'modifier,';
				values += " '" + modifier +"',";
			}

			if (typeof program_code !== 'undefined' && program_code !== "") {
				column += 'program_code,';
				values += " '" + program_code +"',";
			}

			if (typeof quantity !== 'undefined' && quantity !== "") {
				column += ' quantity,';
				values += " " + quantity +",";
			}

			if (typeof unit_price !== 'undefined' && unit_price !== "") {
				column += 'unit_price,';
				values += " '" + unit_price +"',";
			}

			if (typeof factor !== 'undefined' && factor !== "") {
				column += ' factor,';
				values += " " + factor +",";
			}

			if (typeof net !== 'undefined' && net !== "") {
				column += 'net,';
				values += " '" + net +"',";
			}

			if (typeof detail_id !== 'undefined' && detail_id !== "") {
				column += 'detail_id,';
				values += " '" + detail_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_sub_detail(sub_detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+sub_detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sub_detail_id from BACIRO_FHIR.claim_sub_detail WHERE sub_detail_id = '" + sub_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimSubDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimSubDetail"});
      });
    }
	},
	put: {
		claim: function updateClaim(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var claim_id  = req.params._id;
			var status  = req.body.status;
			var type  = req.body.type;
			var subtype  = req.body.subtype;
			var uses  = req.body.uses;
			var patient  = req.body.patient;
			var billable_period_start  = req.body.billable_period_start;
			var billable_period_end  = req.body.billable_period_end;
			var created  = req.body.created;
			var enterer  = req.body.enterer;
			var insurer  = req.body.insurer;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var priority  = req.body.priority;
			var funds_reserve  = req.body.funds_reserve;
			var prescription_medication_request  = req.body.prescription_medication_request;
			var prescription_vision_prescription  = req.body.prescription_vision_prescription;
			var original_prescription  = req.body.original_prescription;
			var payee_type  = req.body.payee_type;
			var payee_resource_type  = req.body.payee_resource_type;
			var payee_party_practitioner  = req.body.payee_party_practitioner;
			var payee_party_organization  = req.body.payee_party_organization;
			var payee_party_patient  = req.body.payee_party_patient;
			var payee_party_related_person  = req.body.payee_party_related_person;
			var referral  = req.body.referral;
			var facility  = req.body.facility;
			var employment_impacted_start  = req.body.employment_impacted_start;
			var employment_impacted_end  = req.body.employment_impacted_end;
			var hospitalization_start  = req.body.hospitalization_start;
			var hospitalization_end  = req.body.hospitalization_end;
			var total  = req.body.total;
			var claim_response_id  = req.body.claim_response_id;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof subtype !== 'undefined' && subtype !== "") {
				column += 'subtype,';
				values += " '" + subtype +"',";
			}

			if (typeof uses !== 'undefined' && uses !== "") {
				column += 'uses,';
				values += " '" + uses +"',";
			}

			if (typeof patient !== 'undefined' && patient !== "") {
				column += 'patient,';
				values += " '" + patient +"',";
			}

			if (typeof  billable_period_start !== 'undefined' &&  billable_period_start !== "") {
				column += ' billable_period_start,';
				values += "to_date('"+  billable_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  billable_period_end !== 'undefined' &&  billable_period_end !== "") {
				column += ' billable_period_end,';
				values += "to_date('"+  billable_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof enterer !== 'undefined' && enterer !== "") {
				column += 'enterer,';
				values += " '" + enterer +"',";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof provider !== 'undefined' && provider !== "") {
				column += 'provider,';
				values += " '" + provider +"',";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof priority !== 'undefined' && priority !== "") {
				column += 'priority,';
				values += " '" + priority +"',";
			}

			if (typeof funds_reserve !== 'undefined' && funds_reserve !== "") {
				column += 'funds_reserve,';
				values += " '" + funds_reserve +"',";
			}

			if (typeof prescription_medication_request !== 'undefined' && prescription_medication_request !== "") {
				column += 'prescription_medication_request,';
				values += " '" + prescription_medication_request +"',";
			}

			if (typeof prescription_vision_prescription !== 'undefined' && prescription_vision_prescription !== "") {
				column += 'prescription_vision_prescription,';
				values += " '" + prescription_vision_prescription +"',";
			}

			if (typeof original_prescription !== 'undefined' && original_prescription !== "") {
				column += 'original_prescription,';
				values += " '" + original_prescription +"',";
			}

			if (typeof payee_type !== 'undefined' && payee_type !== "") {
				column += 'payee_type,';
				values += " '" + payee_type +"',";
			}

			if (typeof payee_resource_type !== 'undefined' && payee_resource_type !== "") {
				column += 'payee_resource_type,';
				values += " '" + payee_resource_type +"',";
			}

			if (typeof payee_party_practitioner !== 'undefined' && payee_party_practitioner !== "") {
				column += 'payee_party_practitioner,';
				values += " '" + payee_party_practitioner +"',";
			}

			if (typeof payee_party_organization !== 'undefined' && payee_party_organization !== "") {
				column += 'payee_party_organization,';
				values += " '" + payee_party_organization +"',";
			}

			if (typeof payee_party_patient !== 'undefined' && payee_party_patient !== "") {
				column += 'payee_party_patient,';
				values += " '" + payee_party_patient +"',";
			}

			if (typeof payee_party_related_person !== 'undefined' && payee_party_related_person !== "") {
				column += 'payee_party_related_person,';
				values += " '" + payee_party_related_person +"',";
			}

			if (typeof referral !== 'undefined' && referral !== "") {
				column += 'referral,';
				values += " '" + referral +"',";
			}

			if (typeof facility !== 'undefined' && facility !== "") {
				column += 'facility,';
				values += " '" + facility +"',";
			}

			if (typeof  employment_impacted_start !== 'undefined' &&  employment_impacted_start !== "") {
				column += ' employment_impacted_start,';
				values += "to_date('"+  employment_impacted_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  employment_impacted_end !== 'undefined' &&  employment_impacted_end !== "") {
				column += ' employment_impacted_end,';
				values += "to_date('"+  employment_impacted_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  hospitalization_start !== 'undefined' &&  hospitalization_start !== "") {
				column += ' hospitalization_start,';
				values += "to_date('"+  hospitalization_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  hospitalization_end !== 'undefined' &&  hospitalization_end !== "") {
				column += ' hospitalization_end,';
				values += "to_date('"+  hospitalization_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof total !== 'undefined' && total !== "") {
				column += 'total,';
				values += " '" + total +"',";
			}

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
			}

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "claim_id = '" + claim_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "claim_id = '" + claim_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim(claim_id," + column.slice(0, -1) + ") SELECT claim_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select claim_id from BACIRO_FHIR.claim WHERE claim_id = '" + claim_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaim"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaim"});
      });
    },
		claimRelated: function updateClaimRelated(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var related_id  = req.params._id;
			var claim  = req.body.claim;
			var relationship  = req.body.relationship;
			var reference  = req.body.reference;
			var claim_id  = req.body.claim_id;
			
			if (typeof claim !== 'undefined' && claim !== "") {
				column += 'claim,';
				values += " '" + claim +"',";
			}

			if (typeof relationship !== 'undefined' && relationship !== "") {
				column += 'relationship,';
				values += " '" + relationship +"',";
			}

			if (typeof reference !== 'undefined' && reference !== "") {
				column += 'reference,';
				values += " '" + reference +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "related_id = '" + related_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "related_id = '" + related_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_related(related_id," + column.slice(0, -1) + ") SELECT related_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_related WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select related_id from BACIRO_FHIR.claim_related WHERE related_id = '" + related_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimRelated"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimRelated"});
      });
    },
		claimCareTeam: function updateClaimCareTeam(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var care_team_id  = req.params._id;
			var sequences  = req.body.sequences;
			var provider_practitioner  = req.body.provider_practitioner;
			var provider_organization  = req.body.provider_organization;
			var responsible  = req.body.responsible;
			var role  = req.body.role;
			var qualification  = req.body.qualification;
			var claim_id  = req.body.claim_id;			
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof provider_practitioner !== 'undefined' && provider_practitioner !== "") {
				column += 'provider_practitioner,';
				values += " '" + provider_practitioner +"',";
			}

			if (typeof provider_organization !== 'undefined' && provider_organization !== "") {
				column += 'provider_organization,';
				values += " '" + provider_organization +"',";
			}

			if (typeof responsible !== 'undefined' && responsible !== "") {
				column += 'responsible,';
				values += " '" + responsible +"',";
			}

			if (typeof role !== 'undefined' && role !== "") {
				column += 'role,';
				values += " '" + role +"',";
			}

			if (typeof qualification !== 'undefined' && qualification !== "") {
				column += 'qualification,';
				values += " '" + qualification +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "care_team_id = '" + care_team_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "care_team_id = '" + care_team_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_care_team(care_team_id," + column.slice(0, -1) + ") SELECT care_team_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_care_team WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select care_team_id from BACIRO_FHIR.claim_care_team WHERE care_team_id = '" + care_team_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimCareTeam"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimCareTeam"});
      });
    },
		claimInformation: function updateClaimInformation(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var information_id  = req.params._id;
			var sequences  = req.body.sequences;
			var category  = req.body.category;
			var code  = req.body.code;
			var timing_date  = req.body.timing_date;
			var timing_period_start  = req.body.timing_period_start;
			var timing_period_end  = req.body.timing_period_end;
			var value_string  = req.body.value_string;
			var value_quantity  = req.body.value_quantity;
			var value_attachment  = req.body.value_attachment;
			var value_reference  = req.body.value_reference;
			var reason  = req.body.reason;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof code !== 'undefined' && code !== "") {
				column += 'code,';
				values += " '" + code +"',";
			}

			if (typeof  timing_date !== 'undefined' &&  timing_date !== "") {
				column += ' timing_date,';
				values += "to_date('"+  timing_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  timing_period_start !== 'undefined' &&  timing_period_start !== "") {
				column += ' timing_period_start,';
				values += "to_date('"+  timing_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  timing_period_end !== 'undefined' &&  timing_period_end !== "") {
				column += ' timing_period_end,';
				values += "to_date('"+  timing_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof value_string !== 'undefined' && value_string !== "") {
				column += 'value_string,';
				values += " '" + value_string +"',";
			}

			if (typeof value_quantity !== 'undefined' && value_quantity !== "") {
				column += 'value_quantity,';
				values += " '" + value_quantity +"',";
			}

			if (typeof value_attachment !== 'undefined' && value_attachment !== "") {
				column += 'value_attachment,';
				values += " '" + value_attachment +"',";
			}

			if (typeof value_reference !== 'undefined' && value_reference !== "") {
				column += 'value_reference,';
				values += " '" + value_reference +"',";
			}

			if (typeof reason !== 'undefined' && reason !== "") {
				column += 'reason,';
				values += " '" + reason +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "information_id = '" + information_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "information_id = '" + information_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_information(information_id," + column.slice(0, -1) + ") SELECT information_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_information WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select information_id from BACIRO_FHIR.claim_information WHERE information_id = '" + information_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimInformation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimInformation"});
      });
    },
		claimDiagnosis: function updateClaimDiagnosis(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var diagnosis_id  = req.params._id;
			var sequences  = req.body.sequences;
			var diagnosis_codeable_concept  = req.body.diagnosis_codeable_concept;
			var diagnosis_reference  = req.body.diagnosis_reference;
			var type  = req.body.type;
			var package_code  = req.body.package_code;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof diagnosis_codeable_concept !== 'undefined' && diagnosis_codeable_concept !== "") {
				column += 'diagnosis_codeable_concept,';
				values += " '" + diagnosis_codeable_concept +"',";
			}

			if (typeof diagnosis_reference !== 'undefined' && diagnosis_reference !== "") {
				column += 'diagnosis_reference,';
				values += " '" + diagnosis_reference +"',";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof package_code !== 'undefined' && package_code !== "") {
				column += 'package_code,';
				values += " '" + package_code +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "diagnosis_id = '" + diagnosis_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "diagnosis_id = '" + diagnosis_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_diagnosis(diagnosis_id," + column.slice(0, -1) + ") SELECT diagnosis_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_diagnosis WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select diagnosis_id from BACIRO_FHIR.claim_diagnosis WHERE diagnosis_id = '" + diagnosis_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimDiagnosis"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimDiagnosis"});
      });
    },
		claimProcedure: function addClaimProcedure(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var procedure_id = req.params._id;
			var sequences  = req.body.sequences;
			var date  = req.body.date;
			var procedure_codeable_concept  = req.body.procedure_codeable_concept;
			var procedure_reference  = req.body.procedure_reference;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof  date !== 'undefined' &&  date !== "") {
				column += ' date,';
				values += "to_date('"+  date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof procedure_codeable_concept !== 'undefined' && procedure_codeable_concept !== "") {
				column += 'procedure_codeable_concept,';
				values += " '" + procedure_codeable_concept +"',";
			}

			if (typeof procedure_reference !== 'undefined' && procedure_reference !== "") {
				column += 'procedure_reference,';
				values += " '" + procedure_reference +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_procedure(procedure_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+procedure_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select procedure_id from BACIRO_FHIR.claim_procedure WHERE procedure_id = '" + procedure_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimProcedure"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimProcedure"});
      });
    },
		claimInsurance: function updateClaimInsurance(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var insurance_id  = req.params._id;
			var sequences  = req.body.sequences;
			var focal  = req.body.focal;
			var coverage  = req.body.coverage;
			var business_arrangement  = req.body.business_arrangement;
			var pre_auth_ref  = req.body.pre_auth_ref;
			var claim_response  = req.body.claim_response;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof  focal !== 'undefined' && focal !== "") {
				column += ' focal,';
				values += " " + focal +",";
			}

			if (typeof coverage !== 'undefined' && coverage !== "") {
				column += 'coverage,';
				values += " '" + coverage +"',";
			}

			if (typeof business_arrangement !== 'undefined' && business_arrangement !== "") {
				column += 'business_arrangement,';
				values += " '" + business_arrangement +"',";
			}

			if (typeof pre_auth_ref !== 'undefined' && pre_auth_ref !== "") {
				column += 'pre_auth_ref,';
				values += " '" + pre_auth_ref +"',";
			}

			if (typeof claim_response !== 'undefined' && claim_response !== "") {
				column += 'claim_response,';
				values += " '" + claim_response +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "insurance_id = '" + insurance_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "insurance_id = '" + insurance_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_insurance(insurance_id," + column.slice(0, -1) + ") SELECT insurance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_insurance WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select insurance_id from BACIRO_FHIR.claim_insurance WHERE insurance_id = '" + insurance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimInsurance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimInsurance"});
      });
    },
		claimAccident: function updateClaimAccident(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var accident_id  = req.params._id;
						var date  = req.body.date;
			var type  = req.body.type;
			var location_address_use  = req.body.location_address_use;
			var location_address_type  = req.body.location_address_type;
			var location_address_text  = req.body.location_address_text;
			var location_address_line  = req.body.location_address_line;
			var location_address_city  = req.body.location_address_city;
			var location_address_district  = req.body.location_address_district;
			var location_address_state  = req.body.location_address_state;
			var location_address_postal_code  = req.body.location_address_postal_code;
			var location_address_country  = req.body.location_address_country;
			var location_address_period_start  = req.body.location_address_period_start;
			var location_address_period_end  = req.body.location_address_period_end;
			var location_reference  = req.body.location_reference;
			var claim_id  = req.body.claim_id;			
			
			if (typeof  date !== 'undefined' &&  date !== "") {
				column += ' date,';
				values += "to_date('"+  date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof location_address_use !== 'undefined' && location_address_use !== "") {
				column += 'location_address_use,';
				values += " '" + location_address_use +"',";
			}

			if (typeof location_address_type !== 'undefined' && location_address_type !== "") {
				column += 'location_address_type,';
				values += " '" + location_address_type +"',";
			}

			if (typeof location_address_text !== 'undefined' && location_address_text !== "") {
				column += 'location_address_text,';
				values += " '" + location_address_text +"',";
			}

			if (typeof location_address_line !== 'undefined' && location_address_line !== "") {
				column += 'location_address_line,';
				values += " '" + location_address_line +"',";
			}

			if (typeof location_address_city !== 'undefined' && location_address_city !== "") {
				column += 'location_address_city,';
				values += " '" + location_address_city +"',";
			}

			if (typeof location_address_district !== 'undefined' && location_address_district !== "") {
				column += 'location_address_district,';
				values += " '" + location_address_district +"',";
			}

			if (typeof location_address_state !== 'undefined' && location_address_state !== "") {
				column += 'location_address_state,';
				values += " '" + location_address_state +"',";
			}

			if (typeof location_address_postal_code !== 'undefined' && location_address_postal_code !== "") {
				column += 'location_address_postal_code,';
				values += " '" + location_address_postal_code +"',";
			}

			if (typeof location_address_country !== 'undefined' && location_address_country !== "") {
				column += 'location_address_country,';
				values += " '" + location_address_country +"',";
			}

			if (typeof  location_address_period_start !== 'undefined' &&  location_address_period_start !== "") {
				column += ' location_address_period_start,';
				values += "to_date('"+  location_address_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  location_address_period_end !== 'undefined' &&  location_address_period_end !== "") {
				column += ' location_address_period_end,';
				values += "to_date('"+  location_address_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}


			if (typeof location_reference !== 'undefined' && location_reference !== "") {
				column += 'location_reference,';
				values += " '" + location_reference +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "accident_id = '" + accident_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "accident_id = '" + accident_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_accident(accident_id," + column.slice(0, -1) + ") SELECT accident_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_accident WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select accident_id from BACIRO_FHIR.claim_accident WHERE accident_id = '" + accident_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimAccident"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimAccident"});
      });
    },
		claimItem: function updateClaimItem(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var item_id  = req.params._id;
			var sequences  = req.body.sequences;
			var care_team_link_id  = req.body.care_team_link_id;
			var diagnosis_link_id  = req.body.diagnosis_link_id;
			var procedure_link_id  = req.body.procedure_link_id;
			var information_link_id  = req.body.information_link_id;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var serviced_date  = req.body.serviced_date;
			var serviced_period_start  = req.body.serviced_period_start;
			var serviced_period_end  = req.body.serviced_period_end;
			var location_codeable_concept  = req.body.location_codeable_concept;
			var location_address_use  = req.body.location_address_use;
			var location_address_type  = req.body.location_address_type;
			var location_address_text  = req.body.location_address_text;
			var location_address_line  = req.body.location_address_line;
			var location_address_city  = req.body.location_address_city;
			var location_address_district  = req.body.location_address_district;
			var location_address_state  = req.body.location_address_state;
			var location_address_postal_code  = req.body.location_address_postal_code;
			var location_address_country  = req.body.location_address_country;
			var location_address_period_start  = req.body.location_address_period_start;
			var location_address_period_end  = req.body.location_address_period_end;			
			var location_reference  = req.body.location_reference;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var body_site  = req.body.body_site;
			var sub_site  = req.body.sub_site;
			var claim_id  = req.body.claim_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof care_team_link_id !== 'undefined' && care_team_link_id !== "") {
				column += ' care_team_link_id,';
				values += " " + care_team_link_id +",";
			}

			if (typeof diagnosis_link_id !== 'undefined' && diagnosis_link_id !== "") {
				column += ' diagnosis_link_id,';
				values += " " + diagnosis_link_id +",";
			}

			if (typeof procedure_link_id !== 'undefined' && procedure_link_id !== "") {
				column += ' procedure_link_id,';
				values += " " + procedure_link_id +",";
			}

			if (typeof information_link_id !== 'undefined' && information_link_id !== "") {
				column += ' information_link_id,';
				values += " " + information_link_id +",";
			}

			if (typeof revenue !== 'undefined' && revenue !== "") {
				column += 'revenue,';
				values += " '" + revenue +"',";
			}

			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof service !== 'undefined' && service !== "") {
				column += 'service,';
				values += " '" + service +"',";
			}

			if (typeof modifier !== 'undefined' && modifier !== "") {
				column += 'modifier,';
				values += " '" + modifier +"',";
			}

			if (typeof program_code !== 'undefined' && program_code !== "") {
				column += 'program_code,';
				values += " '" + program_code +"',";
			}

			if (typeof  serviced_date !== 'undefined' &&  serviced_date !== "") {
				column += ' serviced_date,';
				values += "to_date('"+  serviced_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  serviced_period_start !== 'undefined' &&  serviced_period_start !== "") {
				column += ' serviced_period_start,';
				values += "to_date('"+  serviced_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  serviced_period_end !== 'undefined' &&  serviced_period_end !== "") {
				column += ' serviced_period_end,';
				values += "to_date('"+  serviced_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof location_codeable_concept !== 'undefined' && location_codeable_concept !== "") {
				column += 'location_codeable_concept,';
				values += " '" + location_codeable_concept +"',";
			}

			if (typeof location_address_use !== 'undefined' && location_address_use !== "") {
				column += 'location_address_use,';
				values += " '" + location_address_use +"',";
			}

			if (typeof location_address_type !== 'undefined' && location_address_type !== "") {
				column += 'location_address_type,';
				values += " '" + location_address_type +"',";
			}

			if (typeof location_address_text !== 'undefined' && location_address_text !== "") {
				column += 'location_address_text,';
				values += " '" + location_address_text +"',";
			}

			if (typeof location_address_line !== 'undefined' && location_address_line !== "") {
				column += 'location_address_line,';
				values += " '" + location_address_line +"',";
			}

			if (typeof location_address_city !== 'undefined' && location_address_city !== "") {
				column += 'location_address_city,';
				values += " '" + location_address_city +"',";
			}

			if (typeof location_address_district !== 'undefined' && location_address_district !== "") {
				column += 'location_address_district,';
				values += " '" + location_address_district +"',";
			}

			if (typeof location_address_state !== 'undefined' && location_address_state !== "") {
				column += 'location_address_state,';
				values += " '" + location_address_state +"',";
			}

			if (typeof location_address_postal_code !== 'undefined' && location_address_postal_code !== "") {
				column += 'location_address_postal_code,';
				values += " '" + location_address_postal_code +"',";
			}

			if (typeof location_address_country !== 'undefined' && location_address_country !== "") {
				column += 'location_address_country,';
				values += " '" + location_address_country +"',";
			}

			if (typeof  location_address_period_start !== 'undefined' &&  location_address_period_start !== "") {
				column += ' location_address_period_start,';
				values += "to_date('"+  location_address_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  location_address_period_end !== 'undefined' &&  location_address_period_end !== "") {
				column += ' location_address_period_end,';
				values += "to_date('"+  location_address_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof location_reference !== 'undefined' && location_reference !== "") {
				column += 'location_reference,';
				values += " '" + location_reference +"',";
			}

			if (typeof quantity !== 'undefined' && quantity !== "") {
				column += ' quantity,';
				values += " " + quantity +",";
			}

			if (typeof unit_price !== 'undefined' && unit_price !== "") {
				column += 'unit_price,';
				values += " '" + unit_price +"',";
			}

			if (typeof factor !== 'undefined' && factor !== "") {
				column += ' factor,';
				values += " " + factor +",";
			}

			if (typeof net !== 'undefined' && net !== "") {
				column += ' net,';
				values += " " + net +",";
			}

			if (typeof body_site !== 'undefined' && body_site !== "") {
				column += 'body_site,';
				values += " '" + body_site +"',";
			}

			if (typeof sub_site !== 'undefined' && sub_site !== "") {
				column += 'sub_site,';
				values += " '" + sub_site +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "item_id = '" + item_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "item_id = '" + item_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_item(item_id," + column.slice(0, -1) + ") SELECT item_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_item WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select item_id from BACIRO_FHIR.claim_item WHERE item_id = '" + item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimItem"});
      });
    },
		claimDetail: function updateClaimDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var detail_id  = req.params._id;
			var sequences  = req.body.sequences;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var item_id  = req.body.item_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof revenue !== 'undefined' && revenue !== "") {
				column += 'revenue,';
				values += " '" + revenue +"',";
			}

			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof service !== 'undefined' && service !== "") {
				column += 'service,';
				values += " '" + service +"',";
			}

			if (typeof modifier !== 'undefined' && modifier !== "") {
				column += 'modifier,';
				values += " '" + modifier +"',";
			}

			if (typeof program_code !== 'undefined' && program_code !== "") {
				column += 'program_code,';
				values += " '" + program_code +"',";
			}

			if (typeof quantity !== 'undefined' && quantity !== "") {
				column += ' quantity,';
				values += " " + quantity +",";
			}

			if (typeof unit_price !== 'undefined' && unit_price !== "") {
				column += 'unit_price,';
				values += " '" + unit_price +"',";
			}

			if (typeof factor !== 'undefined' && factor !== "") {
				column += ' factor,';
				values += " " + factor +",";
			}

			if (typeof net !== 'undefined' && net !== "") {
				column += 'net,';
				values += " '" + net +"',";
			}

			if (typeof item_id !== 'undefined' && item_id !== "") {
				column += 'item_id,';
				values += " '" + item_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "detail_id = '" + detail_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "detail_id = '" + detail_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_detail(detail_id," + column.slice(0, -1) + ") SELECT detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_detail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detail_id from BACIRO_FHIR.claim_detail WHERE detail_id = '" + detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimDetail"});
      });
    },
		claimSubDetail: function updateClaimSubDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var sub_detail_id  = req.params._id;
			var sequences  = req.body.sequences;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var detail_id  = req.body.detail_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof revenue !== 'undefined' && revenue !== "") {
				column += 'revenue,';
				values += " '" + revenue +"',";
			}

			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof service !== 'undefined' && service !== "") {
				column += 'service,';
				values += " '" + service +"',";
			}

			if (typeof modifier !== 'undefined' && modifier !== "") {
				column += 'modifier,';
				values += " '" + modifier +"',";
			}

			if (typeof program_code !== 'undefined' && program_code !== "") {
				column += 'program_code,';
				values += " '" + program_code +"',";
			}

			if (typeof quantity !== 'undefined' && quantity !== "") {
				column += ' quantity,';
				values += " " + quantity +",";
			}

			if (typeof unit_price !== 'undefined' && unit_price !== "") {
				column += 'unit_price,';
				values += " '" + unit_price +"',";
			}

			if (typeof factor !== 'undefined' && factor !== "") {
				column += ' factor,';
				values += " " + factor +",";
			}

			if (typeof net !== 'undefined' && net !== "") {
				column += 'net,';
				values += " '" + net +"',";
			}

			if (typeof detail_id !== 'undefined' && detail_id !== "") {
				column += 'detail_id,';
				values += " '" + detail_id +"',";
			}			
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "sub_detail_id = '" + sub_detail_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "sub_detail_id = '" + sub_detail_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_sub_detail(sub_detail_id," + column.slice(0, -1) + ") SELECT sub_detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_sub_detail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sub_detail_id from BACIRO_FHIR.claim_sub_detail WHERE sub_detail_id = '" + sub_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimSubDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimSubDetail"});
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
