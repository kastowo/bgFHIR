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
		explanationOfBenefit: function getExplanationOfBenefit(req, res){
			var apikey = req.params.apikey;
			var condition = "";
      var join = "";
			var offset = req.query.offset;
			var limit = req.query.limit;
			var care_team = req.query.care_team;
			var claim = req.query.claim;
			var coverage = req.query.coverage;
			var created = req.query.created;
			var disposition = req.query.disposition;
			var encounter = req.query.encounter;
			var enterer = req.query.enterer;
			var facility = req.query.facility;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var patient = req.query.patient;
			var payee = req.query.payee;
			var provider = req.query.provider;
			
			//susun query
			if((typeof care_team !== 'undefined' && care_team !== "")){
        join += " LEFT JOIN BACIRO_FHIR.EXPLANATION_OF_BENEFIT_CARE_TEAM ect ON eob.explanation_of_benefit_id = ect.explanation_of_benefit_id ";
        condition += "(ect.provider_practitioner = '" + care_team + "' OR ect.provider_organization = '" + care_team + "') AND ";
      }
			
			if(typeof claim !== 'undefined' && claim !== ""){
				condition += "eob.claim = '" + claim + "' AND,";  
      }
			
			if(typeof coverage !== 'undefined' && coverage !== ""){
				condition += "eob.insurance_coverage = '" + coverage + "' AND,";  
      }
			
			if (typeof created !== 'undefined' && created !== "") {
        condition += "eob.created = to_date('" + created + "', 'yyyy-MM-dd') AND ";
      }
			
			if(typeof disposition !== 'undefined' && disposition !== ""){
				condition += "eob.disposition = '" + disposition + "' AND,";  
      }
			
			if((typeof encounter !== 'undefined' && encounter !== "")){
        join += " left join baciro_fhir.explanation_of_benefit_item eot on eob.explanation_of_benefit_id = eot.explanation_of_benefit_id left join baciro_fhir.encounter enc on eot.item_id = enc.explanation_of_benefit_id ";
        condition += "enc.explanation_of_benefit_id = '" + encounter + "' AND ";
      }
			
			if(typeof enterer !== 'undefined' && enterer !== ""){
				condition += "eob.enterer = '" + enterer + "' AND,";  
      }
			
			if(typeof facility !== 'undefined' && facility !== ""){
				condition += "eob.facility = '" + facility + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.explanation_of_benefit_id = eob.explanation_of_benefit_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if(typeof organization !== 'undefined' && organization !== ""){
				condition += "eob.organization = '" + organization + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
				condition += "eob.patient = '" + patient + "' AND,";  
      }
			
			if(typeof provider !== 'undefined' && provider !== ""){
				condition += "eob.provider = '" + provider + "' AND,";  
      }
			
			if(typeof payee !== 'undefined' && payee !== ""){
				condition += "(eob.payee_party_practitioner = '" + payee + "' OR eob.payee_party_organization = '" + payee + "' OR eob.payee_party_patient = '" + payee + "' OR eob.payee_party_related_person = '" + payee + "') AND,";  
      }
			
			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " eob.explanation_of_benefit_id > '" + offset + "' AND ";       
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

      var arrExplanationOfBenefit = [];
      var query = "select eob.explanation_of_benefit_id as explanation_of_benefit_id, eob.status as status, eob.type as type, eob.subtype as subtype, eob.patient as patient, eob.billable_period_start as billable_period_start, eob.billable_period_end as billable_period_end, eob.created as created, eob.enterer as enterer, eob.insurer as insurer, eob.provider as provider, eob.organization as organization, eob.referral as referral, eob.facility as facility, eob.claim as claim, eob.claim_response as claim_response, eob.outcome as outcome, eob.disposition as disposition, eob.prescription_medication_request as prescription_medication_request, eob.prescription_vision_prescription as prescription_vision_prescription, eob.original_prescription as original_prescription, eob.payee_type as payee_type, eob.payee_resource_type as payee_resource_type, eob.payee_party_practitioner as payee_party_practitioner, eob.payee_party_organization as payee_party_organization, eob.payee_party_patient as payee_party_patient, eob.payee_party_related_person as payee_party_related_person, eob.precedence as precedence, eob.insurance_coverage as insurance_coverage, eob.insurance_pre_auth_ref as insurance_pre_auth_ref, eob.accident_date as accident_date, eob.accident_type as accident_type, eob.location_address_use as location_address_use, eob.location_address_type as location_address_type, eob.location_address_text as location_address_text, eob.location_address_line as location_address_line, eob.location_address_city as location_address_city, eob.location_address_district as location_address_district, eob.location_address_state as location_address_state, eob.location_address_postal_code as location_address_postal_code, eob.location_address_country as location_address_country, eob.location_address_period_start as location_address_period_start, eob.location_address_period_end as location_address_period_end, eob.accident_location_reference as accident_location_reference, eob.employment_impacted_start as employment_impacted_start, eob.employment_impacted_end as employment_impacted_end, eob.hospitalization_start as hospitalization_start, eob.hospitalization_end as hospitalization_end, eob.total_cost as total_cost, eob.unalloc_deductable as unalloc_deductable, eob.total_benefit as total_benefit, eob.payment_type as payment_type, eob.payment_adjustment as payment_adjustment, eob.payment_adjustment_reason as payment_adjustment_reason, eob.payment_date as payment_date, eob.payment_amount as payment_amount, eob.payment_identifier as payment_identifier, eob.form as form from BACIRO_FHIR.explanation_of_benefit eob " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ExplanationOfBenefit = {};
					ExplanationOfBenefit.resourceType = "ExplanationOfBenefit";
          ExplanationOfBenefit.id = rez[i].explanation_of_benefit_id;
					ExplanationOfBenefit.status = rez[i].status;
					ExplanationOfBenefit.type = rez[i].type;
					ExplanationOfBenefit.subtype = rez[i].subtype;
					if(rez[i].patient != "null"){
						ExplanationOfBenefit.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						ExplanationOfBenefit.patient = "";
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
					ExplanationOfBenefit.billablePeriod = periodStart + ' to ' + periodEnd;
					if(rez[i].created == null){
						ExplanationOfBenefit.created = formatDate(rez[i].created);  
					}else{
						ExplanationOfBenefit.created = rez[i].created;  
					}
					if(rez[i].enterer != "null"){
						ExplanationOfBenefit.enterer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].enterer;
					} else {
						ExplanationOfBenefit.enterer = "";
					}
					if(rez[i].insurer != "null"){
						ExplanationOfBenefit.insurer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].insurer;
					} else {
						ExplanationOfBenefit.insurer = "";
					}
					if(rez[i].provider != "null"){
						ExplanationOfBenefit.provider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].provider;
					} else {
						ExplanationOfBenefit.provider = "";
					}
					if(rez[i].organization != "null"){
						ExplanationOfBenefit.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization;
					} else {
						ExplanationOfBenefit.organization = "";
					}
					if(rez[i].referral != "null"){
						ExplanationOfBenefit.referral = hostFHIR + ':' + portFHIR + '/' + apikey + '/ReferralRequest?_id=' +  rez[i].referral;
					} else {
						ExplanationOfBenefit.referral = "";
					}
					if(rez[i].facility != "null"){
						ExplanationOfBenefit.facility = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].facility;
					} else {
						ExplanationOfBenefit.facility = "";
					}
					if(rez[i].claim != "null"){
						ExplanationOfBenefit.claim = hostFHIR + ':' + portFHIR + '/' + apikey + '/Claim?_id=' +  rez[i].claim;
					} else {
						ExplanationOfBenefit.claim = "";
					}
					if(rez[i].claim_response != "null"){
						ExplanationOfBenefit.claimResponse = hostFHIR + ':' + portFHIR + '/' + apikey + '/ClaimResponse?_id=' +  rez[i].claim_response;
					} else {
						ExplanationOfBenefit.claimResponse = "";
					}
					ExplanationOfBenefit.outcome = rez[i].outcome;
					ExplanationOfBenefit.disposition = rez[i].disposition;
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
					ExplanationOfBenefit.prescription = Prescription;
					if(rez[i].original_prescription != "null"){
						ExplanationOfBenefit.originalPrescription = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' +  rez[i].original_prescription;
					} else {
						ExplanationOfBenefit.originalPrescription = "";
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
					ExplanationOfBenefit.payee = Payee;
					ExplanationOfBenefit.precedence = rez[i].precedence;
					var Insurance = {};
					if(rez[i].insurance_coverage != "null"){
						Insurance.coverage = hostFHIR + ':' + portFHIR + '/' + apikey + '/Coverage?_id=' +  rez[i].insurance_coverage;
					} else {
						Insurance.coverage = "";
					}
					Insurance.preAuthRef = rez[i].insurance_pre_auth_ref;
					ExplanationOfBenefit.insurance = Insurance;
					var Accident = {};
					if(rez[i].accident_date == null){
						Accident.date = formatDate(rez[i].accident_date);  
					}else{
						Accident.date = rez[i].accident_date;  
					}
					Accident.type = rez[i].accident_type;
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
					if(rez[i].accident_location_reference != "null"){
						Location.locationReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].accident_location_reference;
					} else {
						Location.locationReference = "";
					}
					Accident.location = Location;
					ExplanationOfBenefit.accident = Accident;
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
					ExplanationOfBenefit.employmentImpacted = employmentImpactedStart + ' to ' + employmentImpactedEnd;
					var hospitalizationStart,hospitalizationEnd;
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
					ExplanationOfBenefit.hospitalization = hospitalizationStart + ' to ' + hospitalizationEnd;
					ExplanationOfBenefit.totalCost =  rez[i].total_cost;
					ExplanationOfBenefit.unallocDeductable =  rez[i].unalloc_deductable;
					ExplanationOfBenefit.totalBenefit =  rez[i].total_benefit;
					var Payment = {};
					Payment.paymentType = rez[i].payment_type;
					Payment.paymentAdjustment = rez[i].payment_adjustment;
					Payment.paymentAdjustmentReason = rez[i].payment_adjustment_reason;
					if(rez[i].payment_date == null){
						Payment.date = formatDate(rez[i].payment_date);  
					}else{
						Payment.date = rez[i].payment_date;  
					}
					Payment.amount = rez[i].payment_amount;
					if(rez[i].payment_identifier != "null"){
						Payment.identifier = hostFHIR + ':' + portFHIR + '/' + apikey + '/Identifier?_id=' +  rez[i].payment_identifier;
					} else {
						Payment.identifier = "";
					}
					ExplanationOfBenefit.payment = Payment;
					ExplanationOfBenefit.form = rez[i].form;
					
          arrExplanationOfBenefit[i] = ExplanationOfBenefit;
        }
        res.json({"err_code":0,"data": arrExplanationOfBenefit});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getExplanationOfBenefit"});
      });
    },
		explanationOfBenefitRelated: function getExplanationOfBenefitRelated(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitRelatedId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitRelatedId !== 'undefined' && explanationOfBenefitRelatedId !== "") {
				condition += "related_id = '" + explanationOfBenefitRelatedId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitRelated = [];
			var query = "select rel.related_id as related_id, rel.claim as claim, rel.relationship as relationship, i.identifier_id as identifier_id, i.identifier_use as identifier_use, i.identifier_type as identifier_type, i.identifier_system as identifier_system, i.identifier_value as identifier_value, i.identifier_period_start as identifier_period_start, i.identifier_period_end as identifier_period_end, i.assigner as assigner from BACIRO_FHIR.explanation_of_benefit_related rel left join BACIRO_FHIR.identifier i on rel.reference =  i.explanation_of_benefit_related_id " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitRelated = {};
					ExplanationOfBenefitRelated.id = rez[i].related_id;
					if(rez[i].claim != "null"){
						ExplanationOfBenefitRelated.claim = hostFHIR + ':' + portFHIR + '/' + apikey + '/Claim?_id=' +  rez[i].claim;
					} else {
						ExplanationOfBenefitRelated.claim = "";
					}
					ExplanationOfBenefitRelated.relationship = rez[i].relationship;
					var Identifier = {};
					Identifier.id = rez[i].identifier_id;
					Identifier.use = rez[i].identifier_use;
					Identifier.type = rez[i].identifier_type;
					Identifier.system = systemURI + rez[i].identifier_system;
					Identifier.value = rez[i].identifier_value;
					Identifier.period = formatDate(rez[i].identifier_period_start) + ' to ' + formatDate(rez[i].identifier_period_end);
					Identifier.assigner = rez[i].assigner;
					ExplanationOfBenefitRelated.reference = Identifier;
					
					arrExplanationOfBenefitRelated[i] = ExplanationOfBenefitRelated;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitRelated
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitRelated"
				});
			});
		},
		explanationOfBenefitInformation: function getExplanationOfBenefitInformation(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitInformationId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitInformationId !== 'undefined' && explanationOfBenefitInformationId !== "") {
				condition += "information_id = '" + explanationOfBenefitInformationId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitInformation = [];
			var query = "select i.information_id as information_id, i.sequences as sequences, i.category as category, i.code as code, i.timing_date as timing_date, i.timing_period_start as timing_period_start, i.timing_period_end as timing_period_end, i.value_string as value_string, i.value_quantity as value_quantity, i.value_reference as value_reference, i.reason as reason, a.attachment_id as attachment_id, a.attachment_content_type as attachment_content_type, a.attachment_language as attachment_language, a.attachment_url as attachment_url, a.attachment_size as attachment_size, a.attachment_hash as attachment_hash, a.attachment_title as attachment_title, a.attachment_creation as attachment_creation, a.attachment_data as attachment_data from BACIRO_FHIR.explanation_of_benefit_information i left join BACIRO_FHIR.ATTACHMENT a on i.value_attachment = a.explanation_of_benefit_information_id  " + fixCondition;
			
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitInformation = {};
					ExplanationOfBenefitInformation.id = rez[i].information_id;
					ExplanationOfBenefitInformation.sequences = rez[i].sequences;
					ExplanationOfBenefitInformation.category = rez[i].category;
					ExplanationOfBenefitInformation.code = rez[i].code;
					var Timing = {};
					if(rez[i].timing_date == null){
						Timing.timingDate = formatDate(rez[i].timing_date);  
					}else{
						Timing.timingDate = rez[i].timing_date;  
					}
					var timingStart,timingEnd;
					if(rez[i].timing_period_start == null){
						timingStart = formatDate(rez[i].timing_period_start);  
					}else{
						timingStart = rez[i].timing_period_start;  
					}
					if(rez[i].timing_period_end == null){
						timingEnd = formatDate(rez[i].timing_period_end);  
					}else{
						timingEnd = rez[i].timing_period_end;  
					}
					Timing.timingPeriod = timingStart + ' to ' + timingEnd;
					ExplanationOfBenefitInformation.timing = Timing;
					var Value = {};
					Value.valueString = rez[i].value_string;
					Value.valueQuantity = rez[i].value_quantity;
					var Attachment = {};
					Attachment.id = rez[i].attachment_id;
					Attachment.type = rez[i].attachment_content_type;
					Attachment.language = rez[i].attachment_language;
					Attachment.url = systemURI + rez[i].attachment_url;
					Attachment.size = rez[i].attachment_size; //attachmentSize = bytes(attachmentSize);
					Attachment.hash = rez[i].attachment_hash;
					Attachment.title = rez[i].attachment_title;
					Attachment.data = rez[i].attachment_data;
					if (rez[i].attachment_creation == null) {
						Attachment.creation = formatDate(rez[i].attachment_creation);
					} else {
						Attachment.creation = rez[i].attachment_creation;
					}
					Value.valueAttachment = Attachment;
					Value.valueReference = rez[i].value_reference;
					ExplanationOfBenefitInformation.value = Value;
					ExplanationOfBenefitInformation.reason = rez[i].reason;
					
					arrExplanationOfBenefitInformation[i] = ExplanationOfBenefitInformation;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitInformation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitInformation"
				});
			});
		},
		explanationOfBenefitCareTeam: function getExplanationOfBenefitCareTeam(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitCareTeamId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitCareTeamId !== 'undefined' && explanationOfBenefitCareTeamId !== "") {
				condition += "care_team_id = '" + explanationOfBenefitCareTeamId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitCareTeam = [];
			var query = "select care_team_id, sequences, provider_practitioner, provider_organization, responsible, role, qualification from BACIRO_FHIR.explanation_of_benefit_care_team " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitCareTeam = {};
					ExplanationOfBenefitCareTeam.id = rez[i].care_team_id;
					ExplanationOfBenefitCareTeam.sequences = rez[i].sequences;
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
					ExplanationOfBenefitCareTeam.provider = Provider;
					ExplanationOfBenefitCareTeam.responsible = rez[i].responsible;
					ExplanationOfBenefitCareTeam.role = rez[i].role;
					ExplanationOfBenefitCareTeam.qualification = rez[i].qualification;
					
					arrExplanationOfBenefitCareTeam[i] = ExplanationOfBenefitCareTeam;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitCareTeam
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitCareTeam"
				});
			});
		},
		explanationOfBenefitDiagnosis: function getExplanationOfBenefitDiagnosis(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitDiagnosisId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitDiagnosisId !== 'undefined' && explanationOfBenefitDiagnosisId !== "") {
				condition += "diagnosis_id = '" + explanationOfBenefitDiagnosisId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitDiagnosis = [];
			var query = "select diagnosis_id, sequences, diagnosis_codeable_concept, diagnosis_reference, type, package_code from BACIRO_FHIR.explanation_of_benefit_diagnosis " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitDiagnosis = {};
					ExplanationOfBenefitDiagnosis.id = rez[i].diagnosis_id;
					ExplanationOfBenefitDiagnosis.sequences = rez[i].sequences;
					var Diagnosis = {};
					Diagnosis.diagnosisCodeableConcept = rez[i].diagnosis_codeable_concept;
					Diagnosis.diagnosisReference = rez[i].diagnosis_reference;
					ExplanationOfBenefitDiagnosis.diagnosis = Diagnosis;
					ExplanationOfBenefitDiagnosis.type = rez[i].type;
					ExplanationOfBenefitDiagnosis.packageCode = rez[i].package_code;
					
					arrExplanationOfBenefitDiagnosis[i] = ExplanationOfBenefitDiagnosis;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitDiagnosis
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitDiagnosis"
				});
			});
		},
		explanationOfBenefitProcedure: function getExplanationOfBenefitProcedure(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitProcedureId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitProcedureId !== 'undefined' && explanationOfBenefitProcedureId !== "") {
				condition += "procedure_id = '" + explanationOfBenefitProcedureId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitProcedure = [];
			var query = "select procedure_id, sequences, date, procedure_codeable_concept, procedure_reference from BACIRO_FHIR.explanation_of_benefit_procedure " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitProcedure = {};
					ExplanationOfBenefitProcedure.id = rez[i].procedure_id;
					ExplanationOfBenefitProcedure.sequences = rez[i].sequences;
					if(rez[i].date == null){
						ExplanationOfBenefitProcedure.date = formatDate(rez[i].date);  
					}else{
						ExplanationOfBenefitProcedure.date = rez[i].date;  
					}
					var Procedure = {};
					Procedure.procedureCodeableConcept = rez[i].procedure_codeable_concept;  
					if(rez[i].procedure_reference != "null"){
						Procedure.procedureReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Procedure?_id=' +  rez[i].procedure_reference;
					} else {
						Procedure.procedureReference = "";
					}
					ExplanationOfBenefitProcedure.procedure = Procedure;
					
					arrExplanationOfBenefitProcedure[i] = ExplanationOfBenefitProcedure;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitProcedure
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitProcedure"
				});
			});
		},
		explanationOfBenefitItem: function getExplanationOfBenefitItem(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitItemId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitItemId !== 'undefined' && explanationOfBenefitItemId !== "") {
				condition += "item_id = '" + explanationOfBenefitItemId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitItem = [];
			var query = "select item_id, sequences, care_team_link_id, diagnosis_link_id, procedure_link_id, information_link_id, revenue, category, service, modifier, program_code, serviced_date,service_period_start, service_period_end, location_codeable_concept, location_address_use, location_address_type, location_address_text, location_address_line, location_address_city, location_address_district, location_address_state, location_address_postal_code, location_address_country, location_address_period_start, location_address_period_end, location_reference, quantity, unit_price, factor, net, body_site, sub_site, note_number from BACIRO_FHIR.explanation_of_benefit_item " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitItem = {};
					ExplanationOfBenefitItem.id = rez[i].item_id;
					ExplanationOfBenefitItem.sequences = rez[i].sequences;
					ExplanationOfBenefitItem.careTeamLinkId = rez[i].care_team_link_id;
					ExplanationOfBenefitItem.diagnosisLinkId = rez[i].diagnosis_link_id;
					ExplanationOfBenefitItem.procedureLinkId = rez[i].procedure_link_id;
					ExplanationOfBenefitItem.informationLinkId = rez[i].information_link_id;
					ExplanationOfBenefitItem.revenue = rez[i].revenue;
					ExplanationOfBenefitItem.category = rez[i].category;
					ExplanationOfBenefitItem.service = rez[i].service;
					ExplanationOfBenefitItem.modifier = rez[i].modifier;
					ExplanationOfBenefitItem.programCode = rez[i].program_code;
					var Serviced = {};
					if(rez[i].serviced_date == null){
						Serviced.servicedDate = formatDate(rez[i].serviced_date);  
					}else{
						Serviced.servicedDate = rez[i].serviced_date;  
					}
					var servicedPeriodStart,servicedPeriodEnd;
					if(rez[i].service_period_start == null){
						servicedPeriodStart = formatDate(rez[i].service_period_start);  
					}else{
						servicedPeriodStart = rez[i].service_period_start;  
					}
					if(rez[i].service_period_end == null){
						servicedPeriodEnd = formatDate(rez[i].service_period_end);  
					}else{
						servicedPeriodEnd = rez[i].service_period_end;  
					}
					Serviced.servicedPeriod = servicedPeriodStart + ' to ' + servicedPeriodEnd;
					ExplanationOfBenefitItem.serviced = Serviced;
					var Location = {};
					Location.programCode = rez[i].location_codeable_concept;
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
					if(rez[i].accident_location_reference != "null"){
						Location.locationReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].accident_location_reference;
					} else {
						Location.locationReference = "";
					}
					ExplanationOfBenefitItem.location = Location;
					ExplanationOfBenefitItem.quantity = rez[i].quantity;
					ExplanationOfBenefitItem.unitPrice = rez[i].unit_price;
					ExplanationOfBenefitItem.factor = rez[i].factor;
					ExplanationOfBenefitItem.net = rez[i].net;
					ExplanationOfBenefitItem.bodySite = rez[i].body_site;
					ExplanationOfBenefitItem.subSite = rez[i].sub_site;
					ExplanationOfBenefitItem.noteNumber = rez[i].note_number;
					
					arrExplanationOfBenefitItem[i] = ExplanationOfBenefitItem;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitItem
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitItem"
				});
			});
		},
		explanationOfBenefitItemDetail: function getExplanationOfBenefitItemDetail(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitItemDetailId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_item_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitItemDetailId !== 'undefined' && explanationOfBenefitItemDetailId !== "") {
				condition += "detail_id = '" + explanationOfBenefitItemDetailId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "item_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitItemDetail = [];
			var query = "select detail_id, sequences, type, revenue, category, service, modifier, program_code, quantity, unit_price, factor, net, note_number from BACIRO_FHIR.explanation_of_benefit_item_detail " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitItemDetail = {};
					ExplanationOfBenefitItemDetail.id = rez[i].detail_id;
					ExplanationOfBenefitItemDetail.sequences = rez[i].sequences;
					ExplanationOfBenefitItemDetail.type = rez[i].type;
					ExplanationOfBenefitItemDetail.revenue = rez[i].revenue;
					ExplanationOfBenefitItemDetail.category = rez[i].category;
					ExplanationOfBenefitItemDetail.service = rez[i].service;
					ExplanationOfBenefitItemDetail.modifier = rez[i].modifier;
					ExplanationOfBenefitItemDetail.programCode = rez[i].program_code;
					ExplanationOfBenefitItemDetail.quantity = rez[i].quantity;
					ExplanationOfBenefitItemDetail.unitPrice = rez[i].unit_price;
					ExplanationOfBenefitItemDetail.factor = rez[i].factor;
					ExplanationOfBenefitItemDetail.net = rez[i].net;
					ExplanationOfBenefitItemDetail.noteNumber = rez[i].note_number;
					
					arrExplanationOfBenefitItemDetail[i] = ExplanationOfBenefitItemDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitItemDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitItemDetail"
				});
			});
		},
		explanationOfBenefitItemSubDetail: function getExplanationOfBenefitItemSubDetail(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitItemSubDetailId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_item_detail_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitItemSubDetailId !== 'undefined' && explanationOfBenefitItemSubDetailId !== "") {
				condition += "sub_detail_id = '" + explanationOfBenefitItemSubDetailId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "detail_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitItemSubDetail = [];
			var query = "select sub_detail_id, sequences, type, revenue, category, service, modifier, program_code, quantity, unit_price, factor, net, note_number from BACIRO_FHIR.explanation_of_benefit_item_sub_detail " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitItemSubDetail = {};
					ExplanationOfBenefitItemSubDetail.id = rez[i].sub_detail_id;
					ExplanationOfBenefitItemSubDetail.sequences = rez[i].sequences;
					ExplanationOfBenefitItemSubDetail.type = rez[i].type;
					ExplanationOfBenefitItemSubDetail.revenue = rez[i].revenue;
					ExplanationOfBenefitItemSubDetail.category = rez[i].category;
					ExplanationOfBenefitItemSubDetail.service = rez[i].service;
					ExplanationOfBenefitItemSubDetail.modifier = rez[i].modifier;
					ExplanationOfBenefitItemSubDetail.programCode = rez[i].program_code;
					ExplanationOfBenefitItemSubDetail.quantity = rez[i].quantity;
					ExplanationOfBenefitItemSubDetail.unitPrice = rez[i].unit_price;
					ExplanationOfBenefitItemSubDetail.factor = rez[i].factor;
					ExplanationOfBenefitItemSubDetail.net = rez[i].net;
					ExplanationOfBenefitItemSubDetail.noteNumber = rez[i].note_number;
					
					arrExplanationOfBenefitItemSubDetail[i] = ExplanationOfBenefitItemSubDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitItemSubDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitItemSubDetail"
				});
			});
		},
		explanationOfBenefitAddItem: function getExplanationOfBenefitAddItem(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitAddItemId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitAddItemId !== 'undefined' && explanationOfBenefitAddItemId !== "") {
				condition += "add_item_id = '" + explanationOfBenefitAddItemId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitAddItem = [];
			var query = "select add_item_id, sequence_link_id, revenue, category, service, modifier, fee, note_number from BACIRO_FHIR.explanation_of_benefit_add_item " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitAddItem = {};
					ExplanationOfBenefitAddItem.id = rez[i].add_item_id;
					ExplanationOfBenefitAddItem.sequenceLinkId = rez[i].sequence_link_id;
					ExplanationOfBenefitAddItem.revenue = rez[i].revenue;
					ExplanationOfBenefitAddItem.category = rez[i].category;
					ExplanationOfBenefitAddItem.service = rez[i].service;
					ExplanationOfBenefitAddItem.modifier = rez[i].modifier;
					ExplanationOfBenefitAddItem.fee = rez[i].fee;
					ExplanationOfBenefitAddItem.noteNumber = rez[i].note_number;
					
					arrExplanationOfBenefitAddItem[i] = ExplanationOfBenefitAddItem;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitAddItem
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitAddItem"
				});
			});
		},
		explanationOfBenefitAddItemDetail: function getExplanationOfBenefitAddItemDetail(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitAddItemDetailId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_add_item_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitAddItemDetailId !== 'undefined' && explanationOfBenefitAddItemDetailId !== "") {
				condition += "add_item_detail_id = '" + explanationOfBenefitAddItemDetailId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "add_item_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitAddItemDetail = [];
			var query = "select add_item_detail_id, revenue, category, service, modifier, fee, note_number from BACIRO_FHIR.explanation_of_benefit_add_item_detail " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitAddItemDetail = {};
					ExplanationOfBenefitAddItemDetail.id = rez[i].add_item_detail_id;
					ExplanationOfBenefitAddItemDetail.revenue = rez[i].revenue;
					ExplanationOfBenefitAddItemDetail.category = rez[i].category;
					ExplanationOfBenefitAddItemDetail.service = rez[i].service;
					ExplanationOfBenefitAddItemDetail.modifier = rez[i].modifier;
					ExplanationOfBenefitAddItemDetail.fee = rez[i].fee;
					ExplanationOfBenefitAddItemDetail.note_number = rez[i].note_number;
					
					arrExplanationOfBenefitAddItemDetail[i] = ExplanationOfBenefitAddItemDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitAddItemDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitAddItemDetail"
				});
			});
		},
		explanationOfBenefitAdjudication: function getExplanationOfBenefitAdjudication(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitAdjudicationId = req.query._id;
			var itemId = req.query.item_id;
			var detailId = req.query.detail_id;
			var subDetailId = req.query.sub_detail_id;
			var addItemId = req.query.add_item_id;
			var addItemDetailId = req.query.add_item_detail_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitAdjudicationId !== 'undefined' && explanationOfBenefitAdjudicationId !== "") {
				condition += "adjudication_id = '" + explanationOfBenefitAdjudicationId + "' AND ";
			}

			if (typeof itemId !== 'undefined' && itemId !== "") {
				condition += "item_id = '" + itemId + "' AND ";
			}
			
			if (typeof detailId !== 'undefined' && detailId !== "") {
				condition += "detail_id = '" + detailId + "' AND ";
			}
			
			if (typeof subDetailId !== 'undefined' && subDetailId !== "") {
				condition += "sub_detail_id = '" + subDetailId + "' AND ";
			}
			
			if (typeof addItemId !== 'undefined' && addItemId !== "") {
				condition += "add_item_id = '" + addItemId + "' AND ";
			}
			
			if (typeof addItemDetailId !== 'undefined' && addItemDetailId !== "") {
				condition += "add_item_detail_id = '" + addItemDetailId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitAdjudication = [];
			var query = "select adjudication_id, category, reason, amount, valuee from BACIRO_FHIR.explanation_of_benefit_adjudication " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitAdjudication = {};
					ExplanationOfBenefitAdjudication.id = rez[i].adjudication_id;
					ExplanationOfBenefitAdjudication.category = rez[i].category;
					ExplanationOfBenefitAdjudication.reason = rez[i].reason;
					ExplanationOfBenefitAdjudication.amount = rez[i].amount;
					ExplanationOfBenefitAdjudication.value = rez[i].valuee;
					
					arrExplanationOfBenefitAdjudication[i] = ExplanationOfBenefitAdjudication;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitAdjudication
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitAdjudication"
				});
			});
		},
		explanationOfBenefitProcessNote: function getExplanationOfBenefitProcessNote(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitProcessNoteId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitProcessNoteId !== 'undefined' && explanationOfBenefitProcessNoteId !== "") {
				condition += "process_note_id = '" + explanationOfBenefitProcessNoteId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitProcessNote = [];
			var query = "select process_note_id, number, type, text, language from BACIRO_FHIR.explanation_of_benefit_process_note " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitProcessNote = {};
					ExplanationOfBenefitProcessNote.id = rez[i].process_note_id;
					ExplanationOfBenefitProcessNote.number = rez[i].number;
					ExplanationOfBenefitProcessNote.type = rez[i].type;
					ExplanationOfBenefitProcessNote.text = rez[i].text;
					ExplanationOfBenefitProcessNote.language = rez[i].language;
					
					arrExplanationOfBenefitProcessNote[i] = ExplanationOfBenefitProcessNote;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitProcessNote
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitProcessNote"
				});
			});
		},
		explanationOfBenefitBalance: function getExplanationOfBenefitBalance(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitBalanceId = req.query._id;
			var explanationOfBenefitId = req.query.explanation_of_benefit_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitBalanceId !== 'undefined' && explanationOfBenefitBalanceId !== "") {
				condition += "balance_id = '" + explanationOfBenefitBalanceId + "' AND ";
			}

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitBalance = [];
			var query = "select balance_id, category, sub_category, excluded, name, desciption, network, unit, term from BACIRO_FHIR.explanation_of_benefit_balance " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitBalance = {};
					ExplanationOfBenefitBalance.id = rez[i].balance_id;
					ExplanationOfBenefitBalance.sequenceLinkId = rez[i].sequence_link_id;
					ExplanationOfBenefitBalance.category = rez[i].category;
					ExplanationOfBenefitBalance.subCategory = rez[i].sub_category;
					ExplanationOfBenefitBalance.excluded = rez[i].excluded;
					ExplanationOfBenefitBalance.name = rez[i].name;
					ExplanationOfBenefitBalance.desciption = rez[i].desciption;
					ExplanationOfBenefitBalance.network = rez[i].network;
					ExplanationOfBenefitBalance.unit = rez[i].unit;
					ExplanationOfBenefitBalance.term = rez[i].term;
					
					arrExplanationOfBenefitBalance[i] = ExplanationOfBenefitBalance;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitBalance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitBalance"
				});
			});
		},
		explanationOfBenefitBalanceFinancial: function getExplanationOfBenefitBalanceFinancial(req, res) {
			var apikey = req.params.apikey;
			
			var explanationOfBenefitBalanceFinancialId = req.query._id;
			var explanationOfBenefitBalanceId = req.query.explanation_of_benefit_balance_id;

			//susun query
			var condition = "";

			if (typeof explanationOfBenefitBalanceFinancialId !== 'undefined' && explanationOfBenefitBalanceFinancialId !== "") {
				condition += "balance_financial_id = '" + explanationOfBenefitBalanceFinancialId + "' AND ";
			}

			if (typeof explanationOfBenefitBalanceId !== 'undefined' && explanationOfBenefitBalanceId !== "") {
				condition += "balance_id = '" + explanationOfBenefitBalanceId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrExplanationOfBenefitBalanceFinancial = [];
			var query = "select balance_financial_id, type, allowed_unsigned_int, allowed_string, allowed_money, used_unsigned_int, used_money from BACIRO_FHIR.explanation_of_benefit_balance_financial " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ExplanationOfBenefitBalanceFinancial = {};
					ExplanationOfBenefitBalanceFinancial.id = rez[i].balance_financial_id;
					ExplanationOfBenefitBalanceFinancial.type = rez[i].type;
					var Allowed = {};
					Allowed.allowedUnsignedInt = rez[i].allowed_unsigned_int;
					Allowed.allowedString = rez[i].allowed_string;
					Allowed.allowedMoney = rez[i].allowed_money;
					var Used = {};
					Used.usedUnsignedInt = rez[i].used_unsigned_int;
					Used.usedMoney = rez[i].used_money;
					ExplanationOfBenefitBalanceFinancial.allowed = Allowed;
					ExplanationOfBenefitBalanceFinancial.used = Used;
					
					arrExplanationOfBenefitBalanceFinancial[i] = ExplanationOfBenefitBalanceFinancial;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitBalanceFinancial
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitBalanceFinancial"
				});
			});
		},
		explanationOfBenefitItemUdi: function getExplanationOfBenefitItemUdi(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var explanationOfBenefitId = req.query.item_id;

			//susun query
			var condition = '';

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_item_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrExplanationOfBenefitItemUdi = [];
			var query = 'select device_id from BACIRO_FHIR.device ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var explanationOfBenefitItemUdi = {};
					if(rez[i].device_id != "null"){
						explanationOfBenefitItemUdi.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/device?_id=' +  rez[i].device_id;
					} else {
						explanationOfBenefitItemUdi.id = "";
					}
					
					arrExplanationOfBenefitItemUdi[i] = explanationOfBenefitItemUdi;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitItemUdi
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitItemUdi"
				});
			});
		},
		explanationOfBenefitItemEncounter: function getExplanationOfBenefitItemEncounter(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var explanationOfBenefitId = req.query.item_id;

			//susun query
			var condition = '';

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrExplanationOfBenefitItemEncounter = [];
			var query = 'select encounter_id from BACIRO_FHIR.encounter ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var explanationOfBenefitItemEncounter = {};
					if(rez[i].encounter_id != "null"){
						explanationOfBenefitItemEncounter.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/encounter?_id=' +  rez[i].encounter_id;
					} else {
						explanationOfBenefitItemEncounter.id = "";
					}
					
					arrExplanationOfBenefitItemEncounter[i] = explanationOfBenefitItemEncounter;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitItemEncounter
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitItemEncounter"
				});
			});
		},
		explanationOfBenefitItemDetailUdi: function getExplanationOfBenefitItemDetailUdi(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var explanationOfBenefitId = req.query.detail_id;

			//susun query
			var condition = '';

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrExplanationOfBenefitItemDetailUdi = [];
			var query = 'select device_id from BACIRO_FHIR.device ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var explanationOfBenefitItemDetailUdi = {};
					if(rez[i].device_id != "null"){
						explanationOfBenefitItemDetailUdi.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/device?_id=' +  rez[i].device_id;
					} else {
						explanationOfBenefitItemDetailUdi.id = "";
					}
					
					arrExplanationOfBenefitItemDetailUdi[i] = explanationOfBenefitItemDetailUdi;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitItemDetailUdi
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitItemDetailUdi"
				});
			});
		},
		explanationOfBenefitItemSubDetailUdi: function getExplanationOfBenefitItemSubDetailUdi(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var explanationOfBenefitId = req.query.sub_detail_id;

			//susun query
			var condition = '';

			if (typeof explanationOfBenefitId !== 'undefined' && explanationOfBenefitId !== "") {
				condition += "explanation_of_benefit_id = '" + explanationOfBenefitId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrExplanationOfBenefitItemSubDetailUdi = [];
			var query = 'select device_id from BACIRO_FHIR.device ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var explanationOfBenefitItemSubDetailUdi = {};
					if(rez[i].device_id != "null"){
						explanationOfBenefitItemSubDetailUdi.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/device?_id=' +  rez[i].device_id;
					} else {
						explanationOfBenefitItemSubDetailUdi.id = "";
					}
					
					arrExplanationOfBenefitItemSubDetailUdi[i] = explanationOfBenefitItemSubDetailUdi;
				}
				res.json({
					"err_code": 0,
					"data": arrExplanationOfBenefitItemSubDetailUdi
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getExplanationOfBenefitItemSubDetailUdi"
				});
			});
		},
  },
	post: {
		explanationOfBenefit: function addExplanationOfBenefit(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			var status  = req.body.status;
			var type  = req.body.type;
			var subtype  = req.body.subtype;
			var patient  = req.body.patient;
			var billable_period_start  = req.body.billable_period_start;
			var billable_period_end  = req.body.billable_period_end;
			var created  = req.body.created;
			var enterer  = req.body.enterer;
			var insurer  = req.body.insurer;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var referral  = req.body.referral;
			var facility  = req.body.facility;
			var claim  = req.body.claim;
			var claim_response  = req.body.claim_response;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var prescription_medication_request  = req.body.prescription_medication_request;
			var prescription_vision_prescription  = req.body.prescription_vision_prescription;
			var original_prescription  = req.body.original_prescription;
			var payee_type  = req.body.payee_type;
			var payee_resource_type  = req.body.payee_resource_type;
			var payee_party_practitioner  = req.body.payee_party_practitioner;
			var payee_party_organization  = req.body.payee_party_organization;
			var payee_party_patient  = req.body.payee_party_patient;
			var payee_party_related_person  = req.body.payee_party_related_person;
			var precedence  = req.body.precedence;
			var insurance_coverage  = req.body.insurance_coverage;
			var insurance_pre_auth_ref  = req.body.insurance_pre_auth_ref;
			var accident_date  = req.body.accident_date;
			var accident_type  = req.body.accident_type;
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
			var accident_location_reference  = req.body.accident_location_reference;
			var employment_impacted_start  = req.body.employment_impacted_start;
			var employment_impacted_end  = req.body.employment_impacted_end;
			var hospitalization_start  = req.body.hospitalization_start;
			var hospitalization_end  = req.body.hospitalization_end;
			var total_cost  = req.body.total_cost;
			var unalloc_deductable  = req.body.unalloc_deductable;
			var total_benefit  = req.body.total_benefit;
			var payment_type  = req.body.payment_type;
			var payment_adjustment  = req.body.payment_adjustment;
			var payment_adjustment_reason  = req.body.payment_adjustment_reason;
			var payment_date  = req.body.payment_date;
			var payment_amount  = req.body.payment_amount;
			var payment_identifier  = req.body.payment_identifier;
			var form  = req.body.form;
			
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

			if (typeof referral !== 'undefined' && referral !== "") {
				column += 'referral,';
				values += " '" + referral +"',";
			}

			if (typeof facility !== 'undefined' && facility !== "") {
				column += 'facility,';
				values += " '" + facility +"',";
			}

			if (typeof claim !== 'undefined' && claim !== "") {
				column += 'claim,';
				values += " '" + claim +"',";
			}

			if (typeof claim_response !== 'undefined' && claim_response !== "") {
				column += 'claim_response,';
				values += " '" + claim_response +"',";
			}

			if (typeof outcome !== 'undefined' && outcome !== "") {
				column += 'outcome,';
				values += " '" + outcome +"',";
			}

			if (typeof disposition !== 'undefined' && disposition !== "") {
				column += 'disposition,';
				values += " '" + disposition +"',";
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

			if (typeof precedence !== 'undefined' && precedence !== "") {
				column += ' precedence,';
				values += " " + precedence +",";
			}

			if (typeof insurance_coverage !== 'undefined' && insurance_coverage !== "") {
				column += 'insurance_coverage,';
				values += " '" + insurance_coverage +"',";
			}

			if (typeof insurance_pre_auth_ref !== 'undefined' && insurance_pre_auth_ref !== "") {
				column += 'insurance_pre_auth_ref,';
				values += " '" + insurance_pre_auth_ref +"',";
			}

			if (typeof  accident_date !== 'undefined' &&  accident_date !== "") {
				column += ' accident_date,';
				values += "to_date('"+  accident_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof accident_type !== 'undefined' && accident_type !== "") {
				column += 'accident_type,';
				values += " '" + accident_type +"',";
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

			if (typeof accident_location_reference !== 'undefined' && accident_location_reference !== "") {
				column += 'accident_location_reference,';
				values += " '" + accident_location_reference +"',";
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

			if (typeof total_cost !== 'undefined' && total_cost !== "") {
				column += 'total_cost,';
				values += " '" + total_cost +"',";
			}

			if (typeof unalloc_deductable !== 'undefined' && unalloc_deductable !== "") {
				column += 'unalloc_deductable,';
				values += " '" + unalloc_deductable +"',";
			}

			if (typeof total_benefit !== 'undefined' && total_benefit !== "") {
				column += 'total_benefit,';
				values += " '" + total_benefit +"',";
			}

			if (typeof payment_type !== 'undefined' && payment_type !== "") {
				column += 'payment_type,';
				values += " '" + payment_type +"',";
			}

			if (typeof payment_adjustment !== 'undefined' && payment_adjustment !== "") {
				column += 'payment_adjustment,';
				values += " '" + payment_adjustment +"',";
			}

			if (typeof payment_adjustment_reason !== 'undefined' && payment_adjustment_reason !== "") {
				column += 'payment_adjustment_reason,';
				values += " '" + payment_adjustment_reason +"',";
			}

			if (typeof  payment_date !== 'undefined' &&  payment_date !== "") {
				column += ' payment_date,';
				values += "to_date('"+  payment_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof payment_amount !== 'undefined' && payment_amount !== "") {
				column += 'payment_amount,';
				values += " '" + payment_amount +"',";
			}

			if (typeof payment_identifier !== 'undefined' && payment_identifier !== "") {
				column += 'payment_identifier,';
				values += " '" + payment_identifier +"',";
			}

			if (typeof form !== 'undefined' && form !== "") {
				column += 'form,';
				values += " '" + form +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit(explanation_of_benefit_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+explanation_of_benefit_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select explanation_of_benefit_id from BACIRO_FHIR.explanation_of_benefit WHERE explanation_of_benefit_id = '" + explanation_of_benefit_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefit"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefit"});
      });
    },
		explanationOfBenefitRelated: function addExplanationOfBenefitRelated(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var related_id = req.body.related_id;
			var claim  = req.body.claim;
			var relationship  = req.body.relationship;
			var reference  = req.body.reference;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_related(related_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+related_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select related_id from BACIRO_FHIR.explanation_of_benefit_related WHERE related_id = '" + related_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitRelated"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitRelated"});
      });
    },
		explanationOfBenefitInformation: function addExplanationOfBenefitInformation(req, res) {
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
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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
				column += ' value_quantity,';
				values += " " + value_quantity +",";
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

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
			
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_information(information_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+information_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select information_id from BACIRO_FHIR.explanation_of_benefit_information WHERE information_id = '" + information_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitInformation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitInformation"});
      });
    },
		explanationOfBenefitCareTeam: function addExplanationOfBenefitCareTeam(req, res) {
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
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof  responsible !== 'undefined' && responsible !== "") {
				column += ' responsible,';
				values += " " + responsible +",";
			}

			if (typeof role !== 'undefined' && role !== "") {
				column += 'role,';
				values += " '" + role +"',";
			}

			if (typeof qualification !== 'undefined' && qualification !== "") {
				column += 'qualification,';
				values += " '" + qualification +"',";
			}

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
			
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_care_team(care_team_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+care_team_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select care_team_id from BACIRO_FHIR.explanation_of_benefit_care_team WHERE care_team_id = '" + care_team_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitCareTeam"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitCareTeam"});
      });
    },
		explanationOfBenefitDiagnosis: function addExplanationOfBenefitDiagnosis(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var diagnosis_id = req.body.diagnosis_id;
			var sequences  = req.body.sequences;
			var diagnosis_codeable_concept  = req.body.diagnosis_codeable_concept;
			var diagnosis_reference  = req.body.diagnosis_reference;
			var type  = req.body.type;
			var package_code  = req.body.package_code;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
			
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_diagnosis(diagnosis_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+diagnosis_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select diagnosis_id from BACIRO_FHIR.explanation_of_benefit_diagnosis WHERE diagnosis_id = '" + diagnosis_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitDiagnosis"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitDiagnosis"});
      });
    },
		explanationOfBenefitProcedure: function addExplanationOfBenefitProcedure(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var procedure_id = req.body.procedure_id;
			var sequences  = req.body.sequences;
			var date  = req.body.date;
			var procedure_codeable_concept  = req.body.procedure_codeable_concept;
			var procedure_reference  = req.body.procedure_reference;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_procedure(procedure_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+procedure_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select procedure_id from BACIRO_FHIR.explanation_of_benefit_procedure WHERE procedure_id = '" + procedure_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitProcedure"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitProcedure"});
      });
    },
		explanationOfBenefitItem: function addExplanationOfBenefitItem(req, res) {
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
			var service_period_start  = req.body.service_period_start;
			var service_period_end  = req.body.service_period_end;
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
			var note_number  = req.body.note_number;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof  service_period_start !== 'undefined' &&  service_period_start !== "") {
				column += ' service_period_start,';
				values += "to_date('"+  service_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  service_period_end !== 'undefined' &&  service_period_end !== "") {
				column += ' service_period_end,';
				values += "to_date('"+  service_period_end + "', 'yyyy-MM-dd HH:mm'),";
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
				column += 'net,';
				values += " '" + net +"',";
			}

			if (typeof body_site !== 'undefined' && body_site !== "") {
				column += 'body_site,';
				values += " '" + body_site +"',";
			}

			if (typeof sub_site !== 'undefined' && sub_site !== "") {
				column += 'sub_site,';
				values += " '" + sub_site +"',";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_item(item_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+item_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select item_id from BACIRO_FHIR.explanation_of_benefit_item WHERE item_id = '" + item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitItem"});
      });
    },
		explanationOfBenefitItemDetail: function addExplanationOfBenefitItemDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var detail_id = req.body.detail_id;
			var sequences  = req.body.sequences;
			var type  = req.body.type;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var note_number  = req.body.note_number;
			var item_id  = req.body.item_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
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
				column += 'quantity,';
				values += " '" + quantity +"',";
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

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof item_id !== 'undefined' && item_id !== "") {
				column += 'item_id,';
				values += " '" + item_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_item_setail(detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detail_id from BACIRO_FHIR.explanation_of_benefit_item_setail WHERE detail_id = '" + detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitItemDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitItemDetail"});
      });
    },
		explanationOfBenefitItemSubDetail: function addExplanationOfBenefitItemSubDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var sub_detail_id = req.body.sub_detail_id;
			var sequences  = req.body.sequences;
			var type  = req.body.type;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var note_number  = req.body.note_number;
			var detail_id  = req.body.detail_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
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
				column += 'quantity,';
				values += " '" + quantity +"',";
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

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof detail_id !== 'undefined' && detail_id !== "") {
				column += 'detail_id,';
				values += " '" + detail_id +"',";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_item_sub_detail(sub_detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+sub_detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sub_detail_id from BACIRO_FHIR.explanation_of_benefit_item_sub_detail WHERE sub_detail_id = '" + sub_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitItemSubDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitItemSubDetail"});
      });
    },
		explanationOfBenefitAddItem: function addExplanationOfBenefitAddItem(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var add_item_id = req.body.add_item_id;
			var sequence_link_id  = req.body.sequence_link_id;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var fee  = req.body.fee;
			var note_number  = req.body.note_number;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
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

			if (typeof fee !== 'undefined' && fee !== "") {
				column += 'fee,';
				values += " '" + fee +"',";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_add_item(add_item_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+add_item_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select add_item_id from BACIRO_FHIR.explanation_of_benefit_add_item WHERE add_item_id = '" + add_item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitAddItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitAddItem"});
      });
    },
		explanationOfBenefitAddItemDetail: function addExplanationOfBenefitAddItemDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var add_item_detail_id = req.body.add_item_detail_id;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var fee  = req.body.fee;
			var note_number  = req.body.note_number;
			var add_item_id  = req.body.add_item_id;
			
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

			if (typeof fee !== 'undefined' && fee !== "") {
				column += 'fee,';
				values += " '" + fee +"',";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof add_item_id !== 'undefined' && add_item_id !== "") {
				column += 'add_item_id,';
				values += " '" + add_item_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_add_item_detail(add_item_detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+add_item_detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select add_item_detail_id from BACIRO_FHIR.explanation_of_benefit_add_item_detail WHERE add_item_detail_id = '" + add_item_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitAddItemDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitAddItemDetail"});
      });
    },
		explanationOfBenefitAdjudication: function addExplanationOfBenefitAdjudication(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var adjudication_id = req.body.adjudication_id;
			var category  = req.body.category;
			var reason  = req.body.reason;
			var amount  = req.body.amount;
			var valuee  = req.body.value;
			var item_id  = req.body.item_id;
			var detail_id  = req.body.detail_id;
			var sub_detail_id  = req.body.sub_detail_id;
			var add_item_id  = req.body.add_item_id;
			var add_item_detail_id  = req.body.add_item_detail_id;
			
			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof reason !== 'undefined' && reason !== "") {
				column += 'reason,';
				values += " '" + reason +"',";
			}

			if (typeof amount !== 'undefined' && amount !== "") {
				column += 'amount,';
				values += " '" + amount +"',";
			}

			if (typeof valuee !== 'undefined' && valuee !== "") {
				column += ' valuee,';
				values += " " + valuee +",";
			}

			if (typeof item_id !== 'undefined' && item_id !== "") {
				column += 'item_id,';
				values += " '" + item_id +"',";
			}

			if (typeof detail_id !== 'undefined' && detail_id !== "") {
				column += 'detail_id,';
				values += " '" + detail_id +"',";
			}

			if (typeof sub_detail_id !== 'undefined' && sub_detail_id !== "") {
				column += 'sub_detail_id,';
				values += " '" + sub_detail_id +"',";
			}

			if (typeof add_item_id !== 'undefined' && add_item_id !== "") {
				column += 'add_item_id,';
				values += " '" + add_item_id +"',";
			}

			if (typeof add_item_detail_id !== 'undefined' && add_item_detail_id !== "") {
				column += 'add_item_detail_id,';
				values += " '" + add_item_detail_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_adjudication(adjudication_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+adjudication_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select adjudication_id from BACIRO_FHIR.explanation_of_benefit_adjudication WHERE adjudication_id = '" + adjudication_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitAdjudication"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitAdjudication"});
      });
    },
		explanationOfBenefitProcessNote: function addExplanationOfBenefitProcessNote(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var process_note_id = req.body.process_note_id;
			var number  = req.body.number;
			var type  = req.body.type;
			var text  = req.body.text;
			var language  = req.body.language;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof number !== 'undefined' && number !== "") {
				column += ' number,';
				values += " " + number +",";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof text !== 'undefined' && text !== "") {
				column += 'text,';
				values += " '" + text +"',";
			}

			if (typeof language !== 'undefined' && language !== "") {
				column += 'language,';
				values += " '" + language +"',";
			}

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_process_note(process_note_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+process_note_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_note_id from BACIRO_FHIR.explanation_of_benefit_process_note WHERE process_note_id = '" + process_note_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitProcessNote"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitProcessNote"});
      });
    },
		explanationOfBenefitBalance: function addExplanationOfBenefitBalance(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var balance_id = req.body.balance_id;
			var category  = req.body.category;
			var sub_category  = req.body.sub_category;
			var excluded  = req.body.excluded;
			var name  = req.body.name;
			var desciption  = req.body.desciption;
			var network  = req.body.network;
			var unit  = req.body.unit;
			var term  = req.body.term;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof sub_category !== 'undefined' && sub_category !== "") {
				column += 'sub_category,';
				values += " '" + sub_category +"',";
			}

			if (typeof  excluded !== 'undefined' && excluded !== "") {
				column += ' excluded,';
				values += " " + excluded +",";
			}

			if (typeof name !== 'undefined' && name !== "") {
				column += 'name,';
				values += " '" + name +"',";
			}

			if (typeof desciption !== 'undefined' && desciption !== "") {
				column += 'desciption,';
				values += " '" + desciption +"',";
			}

			if (typeof network !== 'undefined' && network !== "") {
				column += 'network,';
				values += " '" + network +"',";
			}

			if (typeof unit !== 'undefined' && unit !== "") {
				column += 'unit,';
				values += " '" + unit +"',";
			}

			if (typeof term !== 'undefined' && term !== "") {
				column += 'term,';
				values += " '" + term +"',";
			}

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}			
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_balance(balance_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+balance_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select balance_id from BACIRO_FHIR.explanation_of_benefit_balance WHERE balance_id = '" + balance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitBalance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitBalance"});
      });
    },
		explanationOfBenefitBalanceFinancial: function addExplanationOfBenefitBalanceFinancial(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var balance_financial_id = req.body.balance_financial_id;
			var type  = req.body.type;
			var allowed_unsigned_int  = req.body.allowed_unsigned_int;
			var allowed_string  = req.body.allowed_string;
			var allowed_money  = req.body.allowed_money;
			var used_unsigned_int  = req.body.used_unsigned_int;
			var used_money  = req.body.used_money;
			var balance_id  = req.body.balance_id;
			
			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof allowed_unsigned_int !== 'undefined' && allowed_unsigned_int !== "") {
				column += ' allowed_unsigned_int,';
				values += " " + allowed_unsigned_int +",";
			}

			if (typeof allowed_string !== 'undefined' && allowed_string !== "") {
				column += 'allowed_string,';
				values += " '" + allowed_string +"',";
			}

			if (typeof allowed_money !== 'undefined' && allowed_money !== "") {
				column += 'allowed_money,';
				values += " '" + allowed_money +"',";
			}

			if (typeof used_unsigned_int !== 'undefined' && used_unsigned_int !== "") {
				column += ' used_unsigned_int,';
				values += " " + used_unsigned_int +",";
			}

			if (typeof used_money !== 'undefined' && used_money !== "") {
				column += 'used_money,';
				values += " '" + used_money +"',";
			}

			if (typeof balance_id !== 'undefined' && balance_id !== "") {
				column += 'balance_id,';
				values += " '" + balance_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_balance_financial(balance_financial_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+balance_financial_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select balance_financial_id from BACIRO_FHIR.explanation_of_benefit_balance_financial WHERE balance_financial_id = '" + balance_financial_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitBalanceFinancial"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitBalanceFinancial"});
      });
    },
	},
	put: {
		explanationOfBenefit: function updateExplanationOfBenefit(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var explanation_of_benefit_id  = req.params._id;
			var status  = req.body.status;
			var type  = req.body.type;
			var subtype  = req.body.subtype;
			var patient  = req.body.patient;
			var billable_period_start  = req.body.billable_period_start;
			var billable_period_end  = req.body.billable_period_end;
			var created  = req.body.created;
			var enterer  = req.body.enterer;
			var insurer  = req.body.insurer;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var referral  = req.body.referral;
			var facility  = req.body.facility;
			var claim  = req.body.claim;
			var claim_response  = req.body.claim_response;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var prescription_medication_request  = req.body.prescription_medication_request;
			var prescription_vision_prescription  = req.body.prescription_vision_prescription;
			var original_prescription  = req.body.original_prescription;
			var payee_type  = req.body.payee_type;
			var payee_resource_type  = req.body.payee_resource_type;
			var payee_party_practitioner  = req.body.payee_party_practitioner;
			var payee_party_organization  = req.body.payee_party_organization;
			var payee_party_patient  = req.body.payee_party_patient;
			var payee_party_related_person  = req.body.payee_party_related_person;
			var precedence  = req.body.precedence;
			var insurance_coverage  = req.body.insurance_coverage;
			var insurance_pre_auth_ref  = req.body.insurance_pre_auth_ref;
			var accident_date  = req.body.accident_date;
			var accident_type  = req.body.accident_type;
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
			var accident_location_reference  = req.body.accident_location_reference;
			var employment_impacted_start  = req.body.employment_impacted_start;
			var employment_impacted_end  = req.body.employment_impacted_end;
			var hospitalization_start  = req.body.hospitalization_start;
			var hospitalization_end  = req.body.hospitalization_end;
			var total_cost  = req.body.total_cost;
			var unalloc_deductable  = req.body.unalloc_deductable;
			var total_benefit  = req.body.total_benefit;
			var payment_type  = req.body.payment_type;
			var payment_adjustment  = req.body.payment_adjustment;
			var payment_adjustment_reason  = req.body.payment_adjustment_reason;
			var payment_date  = req.body.payment_date;
			var payment_amount  = req.body.payment_amount;
			var payment_identifier  = req.body.payment_identifier;
			var form  = req.body.form;
			
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

			if (typeof referral !== 'undefined' && referral !== "") {
				column += 'referral,';
				values += " '" + referral +"',";
			}

			if (typeof facility !== 'undefined' && facility !== "") {
				column += 'facility,';
				values += " '" + facility +"',";
			}

			if (typeof claim !== 'undefined' && claim !== "") {
				column += 'claim,';
				values += " '" + claim +"',";
			}

			if (typeof claim_response !== 'undefined' && claim_response !== "") {
				column += 'claim_response,';
				values += " '" + claim_response +"',";
			}

			if (typeof outcome !== 'undefined' && outcome !== "") {
				column += 'outcome,';
				values += " '" + outcome +"',";
			}

			if (typeof disposition !== 'undefined' && disposition !== "") {
				column += 'disposition,';
				values += " '" + disposition +"',";
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

			if (typeof precedence !== 'undefined' && precedence !== "") {
				column += ' precedence,';
				values += " " + precedence +",";
			}

			if (typeof insurance_coverage !== 'undefined' && insurance_coverage !== "") {
				column += 'insurance_coverage,';
				values += " '" + insurance_coverage +"',";
			}

			if (typeof insurance_pre_auth_ref !== 'undefined' && insurance_pre_auth_ref !== "") {
				column += 'insurance_pre_auth_ref,';
				values += " '" + insurance_pre_auth_ref +"',";
			}

			if (typeof  accident_date !== 'undefined' &&  accident_date !== "") {
				column += ' accident_date,';
				values += "to_date('"+  accident_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof accident_type !== 'undefined' && accident_type !== "") {
				column += 'accident_type,';
				values += " '" + accident_type +"',";
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

			if (typeof accident_location_reference !== 'undefined' && accident_location_reference !== "") {
				column += 'accident_location_reference,';
				values += " '" + accident_location_reference +"',";
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

			if (typeof total_cost !== 'undefined' && total_cost !== "") {
				column += 'total_cost,';
				values += " '" + total_cost +"',";
			}

			if (typeof unalloc_deductable !== 'undefined' && unalloc_deductable !== "") {
				column += 'unalloc_deductable,';
				values += " '" + unalloc_deductable +"',";
			}

			if (typeof total_benefit !== 'undefined' && total_benefit !== "") {
				column += 'total_benefit,';
				values += " '" + total_benefit +"',";
			}

			if (typeof payment_type !== 'undefined' && payment_type !== "") {
				column += 'payment_type,';
				values += " '" + payment_type +"',";
			}

			if (typeof payment_adjustment !== 'undefined' && payment_adjustment !== "") {
				column += 'payment_adjustment,';
				values += " '" + payment_adjustment +"',";
			}

			if (typeof payment_adjustment_reason !== 'undefined' && payment_adjustment_reason !== "") {
				column += 'payment_adjustment_reason,';
				values += " '" + payment_adjustment_reason +"',";
			}

			if (typeof  payment_date !== 'undefined' &&  payment_date !== "") {
				column += ' payment_date,';
				values += "to_date('"+  payment_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof payment_amount !== 'undefined' && payment_amount !== "") {
				column += 'payment_amount,';
				values += " '" + payment_amount +"',";
			}

			if (typeof payment_identifier !== 'undefined' && payment_identifier !== "") {
				column += 'payment_identifier,';
				values += " '" + payment_identifier +"',";
			}

			if (typeof form !== 'undefined' && form !== "") {
				column += 'form,';
				values += " '" + form +"',";
			}
							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "explanation_of_benefit_id = '" + explanation_of_benefit_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "explanation_of_benefit_id = '" + explanation_of_benefit_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit(explanation_of_benefit_id," + column.slice(0, -1) + ") SELECT explanation_of_benefit_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select explanation_of_benefit_id from BACIRO_FHIR.explanation_of_benefit WHERE explanation_of_benefit_id = '" + explanation_of_benefit_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefit"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefit"});
      });
    },
		explanationOfBenefitRelated: function updateExplanationOfBenefitRelated(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var related_id  = req.params._id;
			var claim  = req.body.claim;
			var relationship  = req.body.relationship;
			var reference  = req.body.reference;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_related(related_id," + column.slice(0, -1) + ") SELECT related_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_related WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select related_id from BACIRO_FHIR.explanation_of_benefit_related WHERE related_id = '" + related_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitRelated"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitRelated"});
      });
    },
		explanationOfBenefitInformation: function updateExplanationOfBenefitInformation(req, res) {
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
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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
				column += ' value_quantity,';
				values += " " + value_quantity +",";
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

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_information(information_id," + column.slice(0, -1) + ") SELECT information_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_information WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select information_id from BACIRO_FHIR.explanation_of_benefit_information WHERE information_id = '" + information_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitInformation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitInformation"});
      });
    },
		explanationOfBenefitCareTeam: function updateExplanationOfBenefitCareTeam(req, res) {
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
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof  responsible !== 'undefined' && responsible !== "") {
				column += ' responsible,';
				values += " " + responsible +",";
			}

			if (typeof role !== 'undefined' && role !== "") {
				column += 'role,';
				values += " '" + role +"',";
			}

			if (typeof qualification !== 'undefined' && qualification !== "") {
				column += 'qualification,';
				values += " '" + qualification +"',";
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
				var condition = "care_team_id = '" + care_team_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "care_team_id = '" + care_team_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_care_team(care_team_id," + column.slice(0, -1) + ") SELECT care_team_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_care_team WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select care_team_id from BACIRO_FHIR.explanation_of_benefit_care_team WHERE care_team_id = '" + care_team_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitCareTeam"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitCareTeam"});
      });
    },
		explanationOfBenefitDiagnosis: function updateExplanationOfBenefitDiagnosis(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var diagnosis_id  = req.params._id;
			var sequences  = req.body.sequences;
			var diagnosis_codeable_concept  = req.body.diagnosis_codeable_concept;
			var diagnosis_reference  = req.body.diagnosis_reference;
			var type  = req.body.type;
			var package_code  = req.body.package_code;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_diagnosis(diagnosis_id," + column.slice(0, -1) + ") SELECT diagnosis_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_diagnosis WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select diagnosis_id from BACIRO_FHIR.explanation_of_benefit_diagnosis WHERE diagnosis_id = '" + diagnosis_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitDiagnosis"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitDiagnosis"});
      });
    },
		explanationOfBenefitProcedure: function updateExplanationOfBenefitProcedure(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var procedure_id  = req.params._id;
			var sequences  = req.body.sequences;
			var date  = req.body.date;
			var procedure_codeable_concept  = req.body.procedure_codeable_concept;
			var procedure_reference  = req.body.procedure_reference;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}

			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "procedure_id = '" + procedure_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "procedure_id = '" + procedure_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_procedure(procedure_id," + column.slice(0, -1) + ") SELECT procedure_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_procedure WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select procedure_id from BACIRO_FHIR.explanation_of_benefit_procedure WHERE procedure_id = '" + procedure_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitProcedure"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitProcedure"});
      });
    },
		explanationOfBenefitItem: function updateExplanationOfBenefitItem(req, res) {
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
			var service_period_start  = req.body.service_period_start;
			var service_period_end  = req.body.service_period_end;
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
			var note_number  = req.body.note_number;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
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

			if (typeof  service_period_start !== 'undefined' &&  service_period_start !== "") {
				column += ' service_period_start,';
				values += "to_date('"+  service_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  service_period_end !== 'undefined' &&  service_period_end !== "") {
				column += ' service_period_end,';
				values += "to_date('"+  service_period_end + "', 'yyyy-MM-dd HH:mm'),";
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
				column += 'net,';
				values += " '" + net +"',";
			}

			if (typeof body_site !== 'undefined' && body_site !== "") {
				column += 'body_site,';
				values += " '" + body_site +"',";
			}

			if (typeof sub_site !== 'undefined' && sub_site !== "") {
				column += 'sub_site,';
				values += " '" + sub_site +"',";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
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
				var condition = "item_id = '" + item_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "item_id = '" + item_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_item(item_id," + column.slice(0, -1) + ") SELECT item_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_item WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select item_id from BACIRO_FHIR.explanation_of_benefit_item WHERE item_id = '" + item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitItem"});
      });
    },
		explanationOfBenefitItemDetail: function updateExplanationOfBenefitItemDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var detail_id  = req.params._id;
			var sequences  = req.body.sequences;
			var type  = req.body.type;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var note_number  = req.body.note_number;
			var item_id  = req.body.item_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
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
				column += 'quantity,';
				values += " '" + quantity +"',";
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

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_item_setail(detail_id," + column.slice(0, -1) + ") SELECT detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_item_setail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detail_id from BACIRO_FHIR.explanation_of_benefit_item_setail WHERE detail_id = '" + detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitItemDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitItemDetail"});
      });
    },
		explanationOfBenefitItemSubDetail: function updateExplanationOfBenefitItemSubDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var sub_detail_id  = req.params._id;
			var sequences  = req.body.sequences;
			var type  = req.body.type;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var program_code  = req.body.program_code;
			var quantity  = req.body.quantity;
			var unit_price  = req.body.unit_price;
			var factor  = req.body.factor;
			var net  = req.body.net;
			var note_number  = req.body.note_number;
			var detail_id  = req.body.detail_id;
			
			if (typeof sequences !== 'undefined' && sequences !== "") {
				column += ' sequences,';
				values += " " + sequences +",";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
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
				column += 'quantity,';
				values += " '" + quantity +"',";
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

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_item_sub_detail(sub_detail_id," + column.slice(0, -1) + ") SELECT sub_detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_item_sub_detail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sub_detail_id from BACIRO_FHIR.explanation_of_benefit_item_sub_detail WHERE sub_detail_id = '" + sub_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitItemSubDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitItemSubDetail"});
      });
    },
		explanationOfBenefitAddItem: function updateExplanationOfBenefitAddItem(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var add_item_id  = req.params._id;
			var sequence_link_id  = req.body.sequence_link_id;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var fee  = req.body.fee;
			var note_number  = req.body.note_number;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
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

			if (typeof fee !== 'undefined' && fee !== "") {
				column += 'fee,';
				values += " '" + fee +"',";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
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
				var condition = "add_item_id = '" + add_item_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "add_item_id = '" + add_item_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_add_item(add_item_id," + column.slice(0, -1) + ") SELECT add_item_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_add_item WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select add_item_id from BACIRO_FHIR.explanation_of_benefit_add_item WHERE add_item_id = '" + add_item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitAddItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitAddItem"});
      });
    },
		explanationOfBenefitAddItemDetail: function updateExplanationOfBenefitAddItemDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var add_item_detail_id  = req.params._id;
			var revenue  = req.body.revenue;
			var category  = req.body.category;
			var service  = req.body.service;
			var modifier  = req.body.modifier;
			var fee  = req.body.fee;
			var note_number  = req.body.note_number;
			var add_item_id  = req.body.add_item_id;
			
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

			if (typeof fee !== 'undefined' && fee !== "") {
				column += 'fee,';
				values += " '" + fee +"',";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof add_item_id !== 'undefined' && add_item_id !== "") {
				column += 'add_item_id,';
				values += " '" + add_item_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "add_item_detail_id = '" + add_item_detail_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "add_item_detail_id = '" + add_item_detail_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_add_item_detail(add_item_detail_id," + column.slice(0, -1) + ") SELECT add_item_detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_add_item_detail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select add_item_detail_id from BACIRO_FHIR.explanation_of_benefit_add_item_detail WHERE add_item_detail_id = '" + add_item_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitAddItemDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitAddItemDetail"});
      });
    },
		explanationOfBenefitAdjudication: function addExplanationOfBenefitAdjudication(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var adjudication_id = req.body.adjudication_id;
			var category  = req.body.category;
			var reason  = req.body.reason;
			var amount  = req.body.amount;
			var valuee  = req.body.value;
			var item_id  = req.body.item_id;
			var detail_id  = req.body.detail_id;
			var sub_detail_id  = req.body.sub_detail_id;
			var add_item_id  = req.body.add_item_id;
			var add_item_detail_id  = req.body.add_item_detail_id;
			
			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof reason !== 'undefined' && reason !== "") {
				column += 'reason,';
				values += " '" + reason +"',";
			}

			if (typeof amount !== 'undefined' && amount !== "") {
				column += 'amount,';
				values += " '" + amount +"',";
			}

			if (typeof valuee !== 'undefined' && valuee !== "") {
				column += ' valuee,';
				values += " " + valuee +",";
			}

			if (typeof item_id !== 'undefined' && item_id !== "") {
				column += 'item_id,';
				values += " '" + item_id +"',";
			}

			if (typeof detail_id !== 'undefined' && detail_id !== "") {
				column += 'detail_id,';
				values += " '" + detail_id +"',";
			}

			if (typeof sub_detail_id !== 'undefined' && sub_detail_id !== "") {
				column += 'sub_detail_id,';
				values += " '" + sub_detail_id +"',";
			}

			if (typeof add_item_id !== 'undefined' && add_item_id !== "") {
				column += 'add_item_id,';
				values += " '" + add_item_id +"',";
			}

			if (typeof add_item_detail_id !== 'undefined' && add_item_detail_id !== "") {
				column += 'add_item_detail_id,';
				values += " '" + add_item_detail_id +"',";
			}		
			
			var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_adjudication(adjudication_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+adjudication_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select adjudication_id from BACIRO_FHIR.explanation_of_benefit_adjudication WHERE adjudication_id = '" + adjudication_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitAdjudication"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addExplanationOfBenefitAdjudication"});
      });
    },
		explanationOfBenefitProcessNote: function updateExplanationOfBenefitProcessNote(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var process_note_id  = req.params._id;
			var number  = req.body.number;
			var type  = req.body.type;
			var text  = req.body.text;
			var language  = req.body.language;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof number !== 'undefined' && number !== "") {
				column += ' number,';
				values += " " + number +",";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof text !== 'undefined' && text !== "") {
				column += 'text,';
				values += " '" + text +"',";
			}

			if (typeof language !== 'undefined' && language !== "") {
				column += 'language,';
				values += " '" + language +"',";
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
				var condition = "process_note_id = '" + process_note_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "process_note_id = '" + process_note_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_process_note(process_note_id," + column.slice(0, -1) + ") SELECT process_note_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_process_note WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_note_id from BACIRO_FHIR.explanation_of_benefit_process_note WHERE process_note_id = '" + process_note_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitProcessNote"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitProcessNote"});
      });
    },
		explanationOfBenefitBalance: function updateExplanationOfBenefitBalance(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var balance_id  = req.params._id;
			var category  = req.body.category;
			var sub_category  = req.body.sub_category;
			var excluded  = req.body.excluded;
			var name  = req.body.name;
			var desciption  = req.body.desciption;
			var network  = req.body.network;
			var unit  = req.body.unit;
			var term  = req.body.term;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof sub_category !== 'undefined' && sub_category !== "") {
				column += 'sub_category,';
				values += " '" + sub_category +"',";
			}

			if (typeof  excluded !== 'undefined' && excluded !== "") {
				column += ' excluded,';
				values += " " + excluded +",";
			}

			if (typeof name !== 'undefined' && name !== "") {
				column += 'name,';
				values += " '" + name +"',";
			}

			if (typeof desciption !== 'undefined' && desciption !== "") {
				column += 'desciption,';
				values += " '" + desciption +"',";
			}

			if (typeof network !== 'undefined' && network !== "") {
				column += 'network,';
				values += " '" + network +"',";
			}

			if (typeof unit !== 'undefined' && unit !== "") {
				column += 'unit,';
				values += " '" + unit +"',";
			}

			if (typeof term !== 'undefined' && term !== "") {
				column += 'term,';
				values += " '" + term +"',";
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
				var condition = "balance_id = '" + balance_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "balance_id = '" + balance_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_balance(balance_id," + column.slice(0, -1) + ") SELECT balance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_balance WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select balance_id from BACIRO_FHIR.explanation_of_benefit_balance WHERE balance_id = '" + balance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitBalance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitBalance"});
      });
    },
		explanationOfBenefitBalanceFinancial: function updateExplanationOfBenefitBalanceFinancial(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var balance_financial_id  = req.params._id;
			var type  = req.body.type;
			var allowed_unsigned_int  = req.body.allowed_unsigned_int;
			var allowed_string  = req.body.allowed_string;
			var allowed_money  = req.body.allowed_money;
			var used_unsigned_int  = req.body.used_unsigned_int;
			var used_money  = req.body.used_money;
			var balance_id  = req.body.balance_id;
			
			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof allowed_unsigned_int !== 'undefined' && allowed_unsigned_int !== "") {
				column += ' allowed_unsigned_int,';
				values += " " + allowed_unsigned_int +",";
			}

			if (typeof allowed_string !== 'undefined' && allowed_string !== "") {
				column += 'allowed_string,';
				values += " '" + allowed_string +"',";
			}

			if (typeof allowed_money !== 'undefined' && allowed_money !== "") {
				column += 'allowed_money,';
				values += " '" + allowed_money +"',";
			}

			if (typeof used_unsigned_int !== 'undefined' && used_unsigned_int !== "") {
				column += ' used_unsigned_int,';
				values += " " + used_unsigned_int +",";
			}

			if (typeof used_money !== 'undefined' && used_money !== "") {
				column += 'used_money,';
				values += " '" + used_money +"',";
			}

			if (typeof balance_id !== 'undefined' && balance_id !== "") {
				column += 'balance_id,';
				values += " '" + balance_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "balance_financial_id = '" + balance_financial_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "balance_financial_id = '" + balance_financial_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.explanation_of_benefit_balance_financial(balance_financial_id," + column.slice(0, -1) + ") SELECT balance_financial_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.explanation_of_benefit_balance_financial WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select balance_financial_id from BACIRO_FHIR.explanation_of_benefit_balance_financial WHERE balance_financial_id = '" + balance_financial_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitBalanceFinancial"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateExplanationOfBenefitBalanceFinancial"});
      });
    },
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
