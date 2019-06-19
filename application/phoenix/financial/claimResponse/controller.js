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
		claimResponse: function getClaimResponse(req, res){
			var apikey = req.params.apikey;
			var condition = "";
      var join = "";
			var offset = req.query.offset;
			var limit = req.query.limit;
			var created = req.query.created;
			var disposition = req.query.disposition;
			var identifier = req.query.identifier;
			var insurer = req.query.insurer;
			var outcome = req.query.outcome;
			var patient = req.query.patient;
			var payment_date = req.query.payment_date;
			var request = req.query.request;
			var request_provider = req.query.request_provider;
			
			//susun query
			if (typeof created !== 'undefined' && created !== "") {
        condition += "cr.created = to_date('" + created + "', 'yyyy-MM-dd') AND ";
      }
			
			if(typeof disposition !== 'undefined' && disposition !== ""){
				condition += "cr.disposition = '" + disposition + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.claim_response_id = cr.claim_response_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if(typeof insurer !== 'undefined' && insurer !== ""){
				condition += "cr.insurer = '" + insurer + "' AND,";  
      }
			
			if(typeof outcome !== 'undefined' && outcome !== ""){
				condition += "cr.outcome = '" + outcome + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
				condition += "cr.patient = '" + patient + "' AND,";  
      }
			
			if (typeof payment_date !== 'undefined' && payment_date !== "") {
        condition += "cr.payment_date = to_date('" + payment_date + "', 'yyyy-MM-dd') AND ";
      }
			
			if(typeof request !== 'undefined' && request !== ""){
				condition += "cr.request = '" + request + "' AND,";  
      }
			
			if(typeof request_provider !== 'undefined' && request_provider !== ""){
				condition += "cr.request_provider = '" + request_provider + "' AND,";  
      }
			
			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " cr.claim_response_id > '" + offset + "' AND ";       
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

      var arrClaimResponse = [];
      var query = "select cr.claim_response_id as claim_response_id, cr.status as status, cr.patient as patient, cr.created as created, cr.insurer as insurer, cr.request_provider as request_provider, cr.request_organization as request_organization, cr.request as request, cr.outcome as outcome, cr.disposition as disposition, cr.payee_type as payee_type, cr.total_cost as total_cost, cr.unalloc_deductable as unalloc_deductable, cr.total_benefit as total_benefit, cr.payment_type as payment_type, cr.payment_adjustment as payment_adjustment, cr.payment_adjustment_reason as payment_adjustment_reason, cr.payment_date as payment_date, cr.payment_amount as payment_amount, cr.payment_identifier as payment_identifier, cr.reserved as reserved, cr.form as form from BACIRO_FHIR.claim_response cr " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ClaimResponse = {};
					ClaimResponse.resourceType = "ClaimResponse";
          ClaimResponse.id = rez[i].claim_response_id;
					ClaimResponse.status = rez[i].status;
					if(rez[i].patient != "null"){
						ClaimResponse.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						ClaimResponse.patient = "";
					}
					if(rez[i].created == null){
						ClaimResponse.created = formatDate(rez[i].created);  
					}else{
						ClaimResponse.created = rez[i].created;  
					}
					if(rez[i].insurer != "null"){
						ClaimResponse.insurer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].insurer;
					} else {
						ClaimResponse.insurer = "";
					}
					if(rez[i].request_provider != "null"){
						ClaimResponse.requestProvider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].request_provider;
					} else {
						ClaimResponse.requestProvider = "";
					}
					if(rez[i].request_organization != "null"){
						ClaimResponse.requestOrganization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].request_organization;
					} else {
						ClaimResponse.requestOrganization = "";
					}
					if(rez[i].request != "null"){
						ClaimResponse.request = hostFHIR + ':' + portFHIR + '/' + apikey + '/Claim?_id=' +  rez[i].request;
					} else {
						ClaimResponse.request = "";
					}
					ClaimResponse.outcome = rez[i].outcome;
					ClaimResponse.disposition = rez[i].disposition;
					ClaimResponse.payeeType = rez[i].payee_type;
					ClaimResponse.totalCost = rez[i].total_cost;
					ClaimResponse.unallocDeductable = rez[i].unalloc_deductable;
					ClaimResponse.totalBenefit = rez[i].total_benefit;
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
					ClaimResponse.payment = Payment;
					ClaimResponse.reserved = rez[i].reserved;
					ClaimResponse.form = rez[i].form;
					
          arrClaimResponse[i] = ClaimResponse;
        }
        res.json({"err_code":0,"data": arrClaimResponse});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getClaimResponse"});
      });
    },
		claimResponseItem: function getClaimResponseItem(req, res) {
			var apikey = req.params.apikey;
			
			var claimResponseItemId = req.query._id;
			var claimResponseId = req.query.claim_response_id;

			//susun query
			var condition = "";

			if (typeof claimResponseItemId !== 'undefined' && claimResponseItemId !== "") {
				condition += "item_id = '" + claimResponseItemId + "' AND ";
			}

			if (typeof claimResponseId !== 'undefined' && claimResponseId !== "") {
				condition += "claim_response_id = '" + claimResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimResponseItem = [];
			var query = "select item_id, sequence_link_id, note_number from BACIRO_FHIR.claim_response_item " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimResponseItem = {};
					ClaimResponseItem.id = rez[i].item_id;
					ClaimResponseItem.sequenceLinkId = rez[i].sequence_link_id;
					ClaimResponseItem.noteNumber = rez[i].note_number;
					
					arrClaimResponseItem[i] = ClaimResponseItem;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimResponseItem
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimResponseItem"
				});
			});
		},
		claimResponseItemDetail: function getClaimResponseItemDetail(req, res) {
			var apikey = req.params.apikey;
			
			var claimResponseItemDetailId = req.query._id;
			var claimResponseId = req.query.claim_response_item_id;

			//susun query
			var condition = "";

			if (typeof claimResponseItemDetailId !== 'undefined' && claimResponseItemDetailId !== "") {
				condition += "detail_id = '" + claimResponseItemDetailId + "' AND ";
			}

			if (typeof claimResponseId !== 'undefined' && claimResponseId !== "") {
				condition += "item_id = '" + claimResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimResponseItemDetail = [];
			var query = "select detail_id, sequence_link_id, note_number from BACIRO_FHIR.claim_response_item_detail " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimResponseItemDetail = {};
					ClaimResponseItemDetail.id = rez[i].detail_id;
					ClaimResponseItemDetail.sequenceLinkId = rez[i].sequence_link_id;
					ClaimResponseItemDetail.noteNumber = rez[i].note_number;
					
					arrClaimResponseItemDetail[i] = ClaimResponseItemDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimResponseItemDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimResponseItemDetail"
				});
			});
		},
		claimResponseItemSubDetail: function getClaimResponseItemSubDetail(req, res) {
			var apikey = req.params.apikey;
			
			var claimResponseItemSubDetailId = req.query._id;
			var claimResponseId = req.query.claim_response_item_detail_id;

			//susun query
			var condition = "";

			if (typeof claimResponseItemSubDetailId !== 'undefined' && claimResponseItemSubDetailId !== "") {
				condition += "sub_detail_id = '" + claimResponseItemSubDetailId + "' AND ";
			}

			if (typeof claimResponseId !== 'undefined' && claimResponseId !== "") {
				condition += "detail_id = '" + claimResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimResponseItemSubDetail = [];
			var query = "select sub_detail_id, sequence_link_id, note_number from BACIRO_FHIR.claim_response_item_sub_detail " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimResponseItemSubDetail = {};
					ClaimResponseItemSubDetail.id = rez[i].sub_detail_id;
					ClaimResponseItemSubDetail.sequenceLinkId = rez[i].sequence_link_id;
					ClaimResponseItemSubDetail.noteNumber = rez[i].note_number;
					
					arrClaimResponseItemSubDetail[i] = ClaimResponseItemSubDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimResponseItemSubDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimResponseItemSubDetail"
				});
			});
		},
		claimResponseAddItem: function getClaimResponseAddItem(req, res) {
			var apikey = req.params.apikey;
			
			var claimResponseAddItemId = req.query._id;
			var claimResponseId = req.query.claim_response_id;

			//susun query
			var condition = "";

			if (typeof claimResponseAddItemId !== 'undefined' && claimResponseAddItemId !== "") {
				condition += "add_item_id = '" + claimResponseAddItemId + "' AND ";
			}

			if (typeof claimResponseId !== 'undefined' && claimResponseId !== "") {
				condition += "claim_response_id = '" + claimResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimResponseAddItem = [];
			var query = "select add_item_id, sequence_link_id, revenue, category, service, modifier, fee, note_number from BACIRO_FHIR.claim_response_add_item " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimResponseAddItem = {};
					ClaimResponseAddItem.id = rez[i].add_item_id;
					ClaimResponseAddItem.sequenceLinkId = rez[i].sequence_link_id;
					ClaimResponseAddItem.revenue = rez[i].revenue;
					ClaimResponseAddItem.category = rez[i].category;
					ClaimResponseAddItem.service = rez[i].service;
					ClaimResponseAddItem.modifier = rez[i].modifier;
					ClaimResponseAddItem.fee = rez[i].fee;
					ClaimResponseAddItem.noteNumber = rez[i].note_number;
					
					arrClaimResponseAddItem[i] = ClaimResponseAddItem;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimResponseAddItem
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimResponseAddItem"
				});
			});
		},
		claimResponseAddItemDetail: function getClaimResponseAddItemDetail(req, res) {
			var apikey = req.params.apikey;
			
			var claimResponseAddItemDetailId = req.query._id;
			var claimResponseId = req.query.claim_response_add_item_id;

			//susun query
			var condition = "";

			if (typeof claimResponseAddItemDetailId !== 'undefined' && claimResponseAddItemDetailId !== "") {
				condition += "add_item_detail_id = '" + claimResponseAddItemDetailId + "' AND ";
			}

			if (typeof claimResponseId !== 'undefined' && claimResponseId !== "") {
				condition += "add_item_id = '" + claimResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimResponseAddItemDetail = [];
			var query = "select add_item_detail_id, revenue, category, service, modifier, fee, note_number from BACIRO_FHIR.claim_response_add_item_detail " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimResponseAddItemDetail = {};
					ClaimResponseAddItemDetail.id = rez[i].add_item_detail_id;
					ClaimResponseAddItemDetail.revenue = rez[i].revenue;
					ClaimResponseAddItemDetail.category = rez[i].category;
					ClaimResponseAddItemDetail.service = rez[i].service;
					ClaimResponseAddItemDetail.modifier = rez[i].modifier;
					ClaimResponseAddItemDetail.fee = rez[i].fee;
					ClaimResponseAddItemDetail.note_number = rez[i].note_number;
					
					arrClaimResponseAddItemDetail[i] = ClaimResponseAddItemDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimResponseAddItemDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimResponseAddItemDetail"
				});
			});
		},
		claimResponseError: function getClaimResponseError(req, res) {
			var apikey = req.params.apikey;
			
			var claimResponseErrorId = req.query._id;
			var claimResponseId = req.query.claim_response_id;

			//susun query
			var condition = "";

			if (typeof claimResponseErrorId !== 'undefined' && claimResponseErrorId !== "") {
				condition += "error_id = '" + claimResponseErrorId + "' AND ";
			}

			if (typeof claimResponseId !== 'undefined' && claimResponseId !== "") {
				condition += "claim_response_id = '" + claimResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimResponseError = [];
			var query = "select error_id, sequence_link_id, detail_sequence_link_id, subdetail_sequence_link_id, code from BACIRO_FHIR.claim_response_error " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimResponseError = {};
					ClaimResponseError.id = rez[i].error_id;
					ClaimResponseError.sequenceLinkId = rez[i].sequence_link_id;
					ClaimResponseError.detailSequenceLinkId = rez[i].detail_sequence_link_id;
					ClaimResponseError.subdetailSequenceLinkId = rez[i].subdetail_sequence_link_id;
					ClaimResponseError.code = rez[i].code;
					
					arrClaimResponseError[i] = ClaimResponseError;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimResponseError
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimResponseError"
				});
			});
		},
		claimResponseProcessNote: function getClaimResponseProcessNote(req, res) {
			var apikey = req.params.apikey;
			
			var claimResponseProcessNoteId = req.query._id;
			var claimResponseId = req.query.claim_response_id;

			//susun query
			var condition = "";

			if (typeof claimResponseProcessNoteId !== 'undefined' && claimResponseProcessNoteId !== "") {
				condition += "process_note_id = '" + claimResponseProcessNoteId + "' AND ";
			}

			if (typeof claimResponseId !== 'undefined' && claimResponseId !== "") {
				condition += "claim_response_id = '" + claimResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimResponseProcessNote = [];
			var query = "select process_note_id, number, type, text, language from BACIRO_FHIR.claim_response_process_note " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimResponseProcessNote = {};
					ClaimResponseProcessNote.id = rez[i].process_note_id;
					ClaimResponseProcessNote.number = rez[i].number;
					ClaimResponseProcessNote.type = rez[i].type;
					ClaimResponseProcessNote.text = rez[i].text;
					ClaimResponseProcessNote.language = rez[i].language;
					
					arrClaimResponseProcessNote[i] = ClaimResponseProcessNote;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimResponseProcessNote
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimResponseProcessNote"
				});
			});
		},
		claimResponseInsurance: function getClaimResponseInsurance(req, res) {
			var apikey = req.params.apikey;
			
			var claimResponseInsuranceId = req.query._id;
			var claimResponseId = req.query.claim_response_id;

			//susun query
			var condition = "";

			if (typeof claimResponseInsuranceId !== 'undefined' && claimResponseInsuranceId !== "") {
				condition += "insurance_id = '" + claimResponseInsuranceId + "' AND ";
			}

			if (typeof claimResponseId !== 'undefined' && claimResponseId !== "") {
				condition += "claim_response_id = '" + claimResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrClaimResponseInsurance = [];
			var query = "select insurance_id, sequences, focal, coverage, business_arrangement, pre_auth_ref, claim_response from BACIRO_FHIR.claim_response_insurance " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimResponseInsurance = {};
					ClaimResponseInsurance.id = rez[i].insurance_id;
					ClaimResponseInsurance.sequences = rez[i].sequences;
					ClaimResponseInsurance.focal = rez[i].focal;
					ClaimResponseInsurance.coverage = rez[i].coverage;
					ClaimResponseInsurance.businessArrangement = rez[i].business_arrangement;
					ClaimResponseInsurance.preAuthRef = rez[i].pre_auth_ref;
					if(rez[i].claim_response != "null"){
						ClaimResponseInsurance.ClaimResponse = hostFHIR + ':' + portFHIR + '/' + apikey + '/ClaimResponse?_id=' +  rez[i].claim_response;
					} else {
						ClaimResponseInsurance.ClaimResponse = "";
					}
					arrClaimResponseInsurance[i] = ClaimResponseInsurance;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimResponseInsurance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimResponseInsurance"
				});
			});
		},
		claimResponseAdjudication: function getClaimResponseAdjudication(req, res) {
			var apikey = req.params.apikey;
			
			var claimResponseAdjudicationId = req.query._id;
			var itemId = req.query.item_id;
			var detailId = req.query.detail_id;
			var subDetailId = req.query.sub_detail_id;
			var addItemId = req.query.add_item_id;
			var addItemDetailId = req.query.add_item_detail_id;

			//susun query
			var condition = "";

			if (typeof claimResponseAdjudicationId !== 'undefined' && claimResponseAdjudicationId !== "") {
				condition += "adjudication_id = '" + claimResponseAdjudicationId + "' AND ";
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
			
			var arrClaimResponseAdjudication = [];
			var query = "select adjudication_id, category, reason, amount, valuee from BACIRO_FHIR.claim_response_adjudication " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClaimResponseAdjudication = {};
					ClaimResponseAdjudication.id = rez[i].adjudication_id;
					ClaimResponseAdjudication.category = rez[i].category;
					ClaimResponseAdjudication.reason = rez[i].reason;
					ClaimResponseAdjudication.amount = rez[i].amount;
					ClaimResponseAdjudication.value = rez[i].valuee;
					
					arrClaimResponseAdjudication[i] = ClaimResponseAdjudication;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimResponseAdjudication
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimResponseAdjudication"
				});
			});
		},
		claimCommunicationRequest: function getClaimCommunicationRequest(req, res) {
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

			var arrClaimCommunicationRequest = [];
			var query = 'select communication_request_id from BACIRO_FHIR.communication_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var claimCommunicationRequest = {};
					if(rez[i].communication_request_id != "null"){
						claimCommunicationRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/communicationRequest?_id=' +  rez[i].communication_request_id;
					} else {
						claimCommunicationRequest.id = "";
					}
					
					arrClaimCommunicationRequest[i] = claimCommunicationRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrClaimCommunicationRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClaimCommunicationRequest"
				});
			});
		},
  },
	post: {
		claimResponse: function addClaimResponse(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var claim_response_id  = req.body.claim_response_id;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var created  = req.body.created;
			var insurer  = req.body.insurer;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var payee_type  = req.body.payee_type;
			var total_cost  = req.body.total_cost;
			var unalloc_deductable  = req.body.unalloc_deductable;
			var total_benefit  = req.body.total_benefit;
			var payment_type  = req.body.payment_type;
			var payment_adjustment  = req.body.payment_adjustment;
			var payment_adjustment_reason  = req.body.payment_adjustment_reason;
			var payment_date  = req.body.payment_date;
			var payment_amount  = req.body.payment_amount;
			var payment_identifier  = req.body.payment_identifier;
			var reserved  = req.body.reserved;
			var form  = req.body.form;
			var claim_id  = req.body.claim_id;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof patient !== 'undefined' && patient !== "") {
				column += 'patient,';
				values += " '" + patient +"',";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof request_provider !== 'undefined' && request_provider !== "") {
				column += 'request_provider,';
				values += " '" + request_provider +"',";
			}

			if (typeof request_organization !== 'undefined' && request_organization !== "") {
				column += 'request_organization,';
				values += " '" + request_organization +"',";
			}

			if (typeof request !== 'undefined' && request !== "") {
				column += 'request,';
				values += " '" + request +"',";
			}

			if (typeof outcome !== 'undefined' && outcome !== "") {
				column += 'outcome,';
				values += " '" + outcome +"',";
			}

			if (typeof disposition !== 'undefined' && disposition !== "") {
				column += 'disposition,';
				values += " '" + disposition +"',";
			}

			if (typeof payee_type !== 'undefined' && payee_type !== "") {
				column += 'payee_type,';
				values += " '" + payee_type +"',";
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

			if (typeof reserved !== 'undefined' && reserved !== "") {
				column += 'reserved,';
				values += " '" + reserved +"',";
			}

			if (typeof form !== 'undefined' && form !== "") {
				column += 'form,';
				values += " '" + form +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
			}

			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
				column += 'explanation_of_benefit_id,';
				values += " '" + explanation_of_benefit_id +"',";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response(claim_response_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+claim_response_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select claim_response_id from BACIRO_FHIR.claim_response WHERE claim_response_id = '" + claim_response_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponse"});
      });
    },
		claimResponseItem: function addClaimResponseItem(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var item_id = req.body.item_id;
			var sequence_link_id  = req.body.sequence_link_id;
			var note_number  = req.body.note_number;
			var claim_response_id  = req.body.claim_response_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_item(item_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+item_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select item_id from BACIRO_FHIR.claim_response_item WHERE item_id = '" + item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseItem"});
      });
    },
		claimResponseItemDetail: function addClaimResponseItemDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var detail_id = req.body.detail_id;
			var sequence_link_id  = req.body.sequence_link_id;
			var note_number  = req.body.note_number;
			var item_id  = req.body.item_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof item_id !== 'undefined' && item_id !== "") {
				column += 'item_id,';
				values += " '" + item_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_item_setail(detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detail_id from BACIRO_FHIR.claim_response_item_setail WHERE detail_id = '" + detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseItemDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseItemDetail"});
      });
    },
		claimResponseItemSubDetail: function addClaimResponseItemSubDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var sub_detail_id = req.body.sub_detail_id;
			var sequence_link_id  = req.body.sequence_link_id;
			var note_number  = req.body.note_number;
			var detail_id  = req.body.detail_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof detail_id !== 'undefined' && detail_id !== "") {
				column += 'detail_id,';
				values += " '" + detail_id +"',";
			}

			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_item_sub_detail(sub_detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+sub_detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sub_detail_id from BACIRO_FHIR.claim_response_item_sub_detail WHERE sub_detail_id = '" + sub_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseItemSubDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseItemSubDetail"});
      });
    },
		claimResponseAddItem: function addClaimResponseAddItem(req, res) {
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
			var claim_response_id  = req.body.claim_response_id;
			
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

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_add_item(add_item_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+add_item_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select add_item_id from BACIRO_FHIR.claim_response_add_item WHERE add_item_id = '" + add_item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseAddItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseAddItem"});
      });
    },
		claimResponseAddItemDetail: function addClaimResponseAddItemDetail(req, res) {
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
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_add_item_detail(add_item_detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+add_item_detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select add_item_detail_id from BACIRO_FHIR.claim_response_add_item_detail WHERE add_item_detail_id = '" + add_item_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseAddItemDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseAddItemDetail"});
      });
    },
		claimResponseError: function addClaimResponseError(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var error_id = req.body.error_id;
			var sequence_link_id  = req.body.sequence_link_id;
			var detail_sequence_link_id  = req.body.detail_sequence_link_id;
			var subdetail_sequence_link_id  = req.body.subdetail_sequence_link_id;
			var code  = req.body.code;
			var claim_response_id  = req.body.claim_response_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
			}

			if (typeof detail_sequence_link_id !== 'undefined' && detail_sequence_link_id !== "") {
				column += ' detail_sequence_link_id,';
				values += " " + detail_sequence_link_id +",";
			}

			if (typeof subdetail_sequence_link_id !== 'undefined' && subdetail_sequence_link_id !== "") {
				column += ' subdetail_sequence_link_id,';
				values += " " + subdetail_sequence_link_id +",";
			}

			if (typeof code !== 'undefined' && code !== "") {
				column += 'code,';
				values += " '" + code +"',";
			}

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_error(error_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+error_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select error_id from BACIRO_FHIR.claim_response_error WHERE error_id = '" + error_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseError"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseError"});
      });
    },
		claimResponseInsurance: function addClaimResponseInsurance(req, res) {
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
			var claim_response_id  = req.body.claim_response_id;
			
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

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
			}

			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_insurance(insurance_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+insurance_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select insurance_id from BACIRO_FHIR.claim_response_insurance WHERE insurance_id = '" + insurance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseInsurance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseInsurance"});
      });
    },
		claimResponseProcessNote: function addClaimResponseProcessNote(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var process_note_id = req.body.process_note_id;
			var number  = req.body.number;
			var type  = req.body.type;
			var text  = req.body.text;
			var language  = req.body.language;
			var claim_response_id  = req.body.claim_response_id;
			
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

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
			}			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_process_note(process_note_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+process_note_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_note_id from BACIRO_FHIR.claim_response_process_note WHERE process_note_id = '" + process_note_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseProcessNote"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseProcessNote"});
      });
    },
		claimResponseAdjudication: function addClaimResponseAdjudication(req, res) {
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
			
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_adjudication(adjudication_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+adjudication_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select adjudication_id from BACIRO_FHIR.claim_response_adjudication WHERE adjudication_id = '" + adjudication_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseAdjudication"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseAdjudication"});
      });
    },
	},
	put: {
		claimResponse: function updateClaimResponse(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var claim_response_id  = req.params._id;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var created  = req.body.created;
			var insurer  = req.body.insurer;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var payee_type  = req.body.payee_type;
			var total_cost  = req.body.total_cost;
			var unalloc_deductable  = req.body.unalloc_deductable;
			var total_benefit  = req.body.total_benefit;
			var payment_type  = req.body.payment_type;
			var payment_adjustment  = req.body.payment_adjustment;
			var payment_adjustment_reason  = req.body.payment_adjustment_reason;
			var payment_date  = req.body.payment_date;
			var payment_amount  = req.body.payment_amount;
			var payment_identifier  = req.body.payment_identifier;
			var reserved  = req.body.reserved;
			var form  = req.body.form;
			var claim_id  = req.body.claim_id;
			var explanation_of_benefit_id  = req.body.explanation_of_benefit_id;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof patient !== 'undefined' && patient !== "") {
				column += 'patient,';
				values += " '" + patient +"',";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof request_provider !== 'undefined' && request_provider !== "") {
				column += 'request_provider,';
				values += " '" + request_provider +"',";
			}

			if (typeof request_organization !== 'undefined' && request_organization !== "") {
				column += 'request_organization,';
				values += " '" + request_organization +"',";
			}

			if (typeof request !== 'undefined' && request !== "") {
				column += 'request,';
				values += " '" + request +"',";
			}

			if (typeof outcome !== 'undefined' && outcome !== "") {
				column += 'outcome,';
				values += " '" + outcome +"',";
			}

			if (typeof disposition !== 'undefined' && disposition !== "") {
				column += 'disposition,';
				values += " '" + disposition +"',";
			}

			if (typeof payee_type !== 'undefined' && payee_type !== "") {
				column += 'payee_type,';
				values += " '" + payee_type +"',";
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

			if (typeof reserved !== 'undefined' && reserved !== "") {
				column += 'reserved,';
				values += " '" + reserved +"',";
			}

			if (typeof form !== 'undefined' && form !== "") {
				column += 'form,';
				values += " '" + form +"',";
			}

			if (typeof claim_id !== 'undefined' && claim_id !== "") {
				column += 'claim_id,';
				values += " '" + claim_id +"',";
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
				var condition = "claim_response_id = '" + claim_response_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "claim_response_id = '" + claim_response_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_response(claim_response_id," + column.slice(0, -1) + ") SELECT claim_response_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_response WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select claim_response_id from BACIRO_FHIR.claim_response WHERE claim_response_id = '" + claim_response_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponse"});
      });
    },
		claimResponseItem: function updateClaimResponseItem(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var item_id  = req.params._id;
			var sequence_link_id  = req.body.sequence_link_id;
			var note_number  = req.body.note_number;
			var claim_response_id  = req.body.claim_response_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
			}

			if (typeof note_number !== 'undefined' && note_number !== "") {
				column += ' note_number,';
				values += " " + note_number +",";
			}

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_response_item(item_id," + column.slice(0, -1) + ") SELECT item_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_response_item WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select item_id from BACIRO_FHIR.claim_response_item WHERE item_id = '" + item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseItem"});
      });
    },
		claimResponseItemDetail: function updateClaimResponseItemDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var detail_id  = req.params._id;
			var sequence_link_id  = req.body.sequence_link_id;
			var note_number  = req.body.note_number;
			var item_id  = req.body.item_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_response_item_setail(detail_id," + column.slice(0, -1) + ") SELECT detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_response_item_setail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detail_id from BACIRO_FHIR.claim_response_item_setail WHERE detail_id = '" + detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseItemDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseItemDetail"});
      });
    },
		claimResponseItemSubDetail: function updateClaimResponseItemSubDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var sub_detail_id  = req.params._id;
			var sequence_link_id  = req.body.sequence_link_id;
			var note_number  = req.body.note_number;
			var detail_id  = req.body.detail_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_response_item_sub_detail(sub_detail_id," + column.slice(0, -1) + ") SELECT sub_detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_response_item_sub_detail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sub_detail_id from BACIRO_FHIR.claim_response_item_sub_detail WHERE sub_detail_id = '" + sub_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseItemSubDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseItemSubDetail"});
      });
    },
		claimResponseAddItem: function updateClaimResponseAddItem(req, res) {
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
			var claim_response_id  = req.body.claim_response_id;
			
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

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_response_add_item(add_item_id," + column.slice(0, -1) + ") SELECT add_item_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_response_add_item WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select add_item_id from BACIRO_FHIR.claim_response_add_item WHERE add_item_id = '" + add_item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseAddItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseAddItem"});
      });
    },
		claimResponseAddItemDetail: function updateClaimResponseAddItemDetail(req, res) {
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
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_response_add_item_detail(add_item_detail_id," + column.slice(0, -1) + ") SELECT add_item_detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_response_add_item_detail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select add_item_detail_id from BACIRO_FHIR.claim_response_add_item_detail WHERE add_item_detail_id = '" + add_item_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseAddItemDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseAddItemDetail"});
      });
    },
		claimResponseError: function updateClaimResponseError(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var error_id  = req.params._id;
			var sequence_link_id  = req.body.sequence_link_id;
			var detail_sequence_link_id  = req.body.detail_sequence_link_id;
			var subdetail_sequence_link_id  = req.body.subdetail_sequence_link_id;
			var code  = req.body.code;
			var claim_response_id  = req.body.claim_response_id;
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
				column += ' sequence_link_id,';
				values += " " + sequence_link_id +",";
			}

			if (typeof detail_sequence_link_id !== 'undefined' && detail_sequence_link_id !== "") {
				column += ' detail_sequence_link_id,';
				values += " " + detail_sequence_link_id +",";
			}

			if (typeof subdetail_sequence_link_id !== 'undefined' && subdetail_sequence_link_id !== "") {
				column += ' subdetail_sequence_link_id,';
				values += " " + subdetail_sequence_link_id +",";
			}

			if (typeof code !== 'undefined' && code !== "") {
				column += 'code,';
				values += " '" + code +"',";
			}

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "error_id = '" + error_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "error_id = '" + error_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_response_error(error_id," + column.slice(0, -1) + ") SELECT error_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_response_error WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select error_id from BACIRO_FHIR.claim_response_error WHERE error_id = '" + error_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseError"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseError"});
      });
    },
		claimResponseInsurance: function updateClaimResponseInsurance(req, res) {
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
			var claim_response_id  = req.body.claim_response_id;
			
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

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_response_insurance(insurance_id," + column.slice(0, -1) + ") SELECT insurance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_response_insurance WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select insurance_id from BACIRO_FHIR.claim_response_insurance WHERE insurance_id = '" + insurance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseInsurance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseInsurance"});
      });
    },
		claimResponseProcessNote: function updateClaimResponseProcessNote(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var process_note_id  = req.params._id;
			var number  = req.body.number;
			var type  = req.body.type;
			var text  = req.body.text;
			var language  = req.body.language;
			var claim_response_id  = req.body.claim_response_id;
			
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

			if (typeof claim_response_id !== 'undefined' && claim_response_id !== "") {
				column += 'claim_response_id,';
				values += " '" + claim_response_id +"',";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.claim_response_process_note(process_note_id," + column.slice(0, -1) + ") SELECT process_note_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.claim_response_process_note WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_note_id from BACIRO_FHIR.claim_response_process_note WHERE process_note_id = '" + process_note_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseProcessNote"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClaimResponseProcessNote"});
      });
    },
		claimResponseAdjudication: function addClaimResponseAdjudication(req, res) {
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
			
			var query = "UPSERT INTO BACIRO_FHIR.claim_response_adjudication(adjudication_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+adjudication_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select adjudication_id from BACIRO_FHIR.claim_response_adjudication WHERE adjudication_id = '" + adjudication_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseAdjudication"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClaimResponseAdjudication"});
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