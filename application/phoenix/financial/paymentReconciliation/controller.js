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
		paymentReconciliation: function getPaymentReconciliation(req, res){
			var apikey = req.params.apikey;
			var condition = "";
      var join = "";
			var offset = req.query.offset;
			var limit = req.query.limit;
			var paymentReconciliationId = req.query._id;
			var created = req.query.created;
			var disposition = req.query.disposition;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var outcome = req.query.outcome;
			var request = req.query.request;
			var request_organization = req.query.request_organization;
			var request_provider = req.query.request_provider;
			//susun query
			
			
			if (typeof created !== 'undefined' && created !== "") {
        condition += "par.created = to_date('" + created + "', 'yyyy-MM-dd') AND ";
      }
			
			if(typeof disposition !== 'undefined' && disposition !== ""){
				condition += "par.disposition = '" + disposition + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.payment_reconciliation_id = par.payment_reconciliation_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if(typeof organization !== 'undefined' && organization !== ""){
				condition += "par.organization = '" + organization + "' AND,";  
      }
			
			if(typeof outcome !== 'undefined' && outcome !== ""){
				condition += "par.outcome = '" + outcome + "' AND,";  
      }
			
			if(typeof request !== 'undefined' && request !== ""){
				condition += "par.request = '" + request + "' AND,";  
      }
			
			if(typeof request_organization !== 'undefined' && request_organization !== ""){
				condition += "par.request_organization = '" + request_organization + "' AND,";  
      }
			
			if(typeof request_provider !== 'undefined' && request_provider !== ""){
				condition += "par.request_provider = '" + request_provider + "' AND,";  
      }

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " par.payment_reconciliation_id > '" + offset + "' AND ";       
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

      var arrPaymentReconciliation = [];
      var query = "select par.payment_reconciliation_id as payment_reconciliation_id, par.status as status, par.period_start as period_start, par.period_end as period_end, par.created as created, par.organization as organization, par.request as request, par.outcome as outcome, par.disposition as disposition, par.request_provider as request_provider, par.request_organization as request_organization, par.form as form, par.total as total from BACIRO_FHIR.payment_reconciliation par " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var PaymentReconciliation = {};
					PaymentReconciliation.resourceType = "PaymentReconciliation";
          PaymentReconciliation.id = rez[i].payment_reconciliation_id;
					PaymentReconciliation.status = rez[i].status;
					var periodStart,periodEnd;
					if(rez[i].period_start == null){
						periodStart = formatDate(rez[i].period_start);  
					}else{
						periodStart = rez[i].period_start;  
					}
					if(rez[i].period_end == null){
						periodEnd = formatDate(rez[i].period_end);  
					}else{
						periodEnd = rez[i].period_end;  
					}
					PaymentReconciliation.period = periodStart + ' to ' + periodEnd;
					if(rez[i].created == null){
						PaymentReconciliation.created = formatDate(rez[i].created);  
					}else{
						PaymentReconciliation.created = rez[i].created;  
					}
					if(rez[i].organization != "null"){
						PaymentReconciliation.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization;
					} else {
						PaymentReconciliation.organization = "";
					}
					if(rez[i].request != "null"){
						PaymentReconciliation.request = hostFHIR + ':' + portFHIR + '/' + apikey + '/ProcessRequest?_id=' +  rez[i].request;
					} else {
						PaymentReconciliation.request = "";
					}
					PaymentReconciliation.outcome = rez[i].outcome;
					PaymentReconciliation.disposition = rez[i].disposition;
					if(rez[i].request_provider != "null"){
						PaymentReconciliation.requestProvider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].request_provider;
					} else {
						PaymentReconciliation.requestProvider = "";
					}
					if(rez[i].request_organization != "null"){
						PaymentReconciliation.requestOrganization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].request_organization;
					} else {
						PaymentReconciliation.requestOrganization = "";
					}
					PaymentReconciliation.form = rez[i].form;
					PaymentReconciliation.total = rez[i].total;
	
          arrPaymentReconciliation[i] = PaymentReconciliation;
        }
        res.json({"err_code":0,"data": arrPaymentReconciliation});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPaymentReconciliation"});
      });
    },
		paymentReconciliationDetail: function getPaymentReconciliationDetail(req, res) {
			var apikey = req.params.apikey;
			
			var paymentReconciliationDetailId = req.query._id;
			var paymentReconciliationId = req.query.payment_reconciliation_id;

			//susun query
			var condition = "";

			if (typeof paymentReconciliationDetailId !== 'undefined' && paymentReconciliationDetailId !== "") {
				condition += "detail_id = '" + paymentReconciliationDetailId + "' AND ";
			}

			if (typeof paymentReconciliationId !== 'undefined' && paymentReconciliationId !== "") {
				condition += "payment_reconciliation_id = '" + paymentReconciliationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrPaymentReconciliationDetail = [];
			var query = "select detail_id, type, request, response, submitter, payee, date, amount from BACIRO_FHIR.payment_reconciliation_detail " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var PaymentReconciliationDetail = {};
					PaymentReconciliationDetail.id = rez[i].detail_id;
					PaymentReconciliationDetail.type = rez[i].type;
					PaymentReconciliationDetail.request = rez[i].request;
					PaymentReconciliationDetail.response = rez[i].response;
					if(rez[i].submitter != "null"){
						PaymentReconciliation.submitter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].submitter;
					} else {
						PaymentReconciliation.submitter = "";
					}
					if(rez[i].payee != "null"){
						PaymentReconciliation.payee = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].payee;
					} else {
						PaymentReconciliation.payee = "";
					}
					if(rez[i].date == null){
						PaymentReconciliationDetail.date = formatDate(rez[i].date);  
					}else{
						PaymentReconciliationDetail.date = rez[i].date;  
					}
					PaymentReconciliationDetail.amount = rez[i].amount;
					
					arrPaymentReconciliationDetail[i] = PaymentReconciliationDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrPaymentReconciliationDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getPaymentReconciliationDetail"
				});
			});
		},
		paymentReconciliationProcessNote: function getPaymentReconciliationProcessNote(req, res) {
			var apikey = req.params.apikey;
			
			var paymentReconciliationProcessNoteId = req.query._id;
			var paymentReconciliationId = req.query.payment_reconciliation_id;

			//susun query
			var condition = "";

			if (typeof paymentReconciliationProcessNoteId !== 'undefined' && paymentReconciliationProcessNoteId !== "") {
				condition += "process_note_id = '" + paymentReconciliationProcessNoteId + "' AND ";
			}

			if (typeof paymentReconciliationId !== 'undefined' && paymentReconciliationId !== "") {
				condition += "payment_reconciliation_id = '" + paymentReconciliationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrPaymentReconciliationProcessNote = [];
			var query = "select process_note_id, type, text from BACIRO_FHIR.payment_reconciliation_process_note " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var PaymentReconciliationProcessNote = {};
					PaymentReconciliationProcessNote.id = rez[i].process_note_id;
					PaymentReconciliationProcessNote.type = rez[i].type;
					PaymentReconciliationProcessNote.text = rez[i].text;
					
					arrPaymentReconciliationProcessNote[i] = PaymentReconciliationProcessNote;
				}
				res.json({
					"err_code": 0,
					"data": arrPaymentReconciliationProcessNote
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getPaymentReconciliationProcessNote"
				});
			});
		},
  },
	post: {
		paymentReconciliation: function addPaymentReconciliation(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var payment_reconciliation_id  = req.body.payment_reconciliation_id;
			var status  = req.body.status;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			var created  = req.body.created;
			var organization  = req.body.organization;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			var form  = req.body.form;
			var total  = req.body.total;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof  period_start !== 'undefined' &&  period_start !== "") {
				column += ' period_start,';
				values += "to_date('"+  period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  period_end !== 'undefined' &&  period_end !== "") {
				column += ' period_end,';
				values += "to_date('"+  period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
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

			if (typeof request_provider !== 'undefined' && request_provider !== "") {
				column += 'request_provider,';
				values += " '" + request_provider +"',";
			}

			if (typeof request_organization !== 'undefined' && request_organization !== "") {
				column += 'request_organization,';
				values += " '" + request_organization +"',";
			}

			if (typeof form !== 'undefined' && form !== "") {
				column += 'form,';
				values += " '" + form +"',";
			}

			if (typeof total !== 'undefined' && total !== "") {
				column += 'total,';
				values += " '" + total +"',";
			}			
			
			var query = "UPSERT INTO BACIRO_FHIR.payment_reconciliation(payment_reconciliation_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+payment_reconciliation_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select payment_reconciliation_id from BACIRO_FHIR.payment_reconciliation WHERE payment_reconciliation_id = '" + payment_reconciliation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPaymentReconciliation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPaymentReconciliation"});
      });
    },
		paymentReconciliationDetail: function addPaymentReconciliationDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var detail_id = req.body.detail_id;
			var type  = req.body.type;
			var request  = req.body.request;
			var response  = req.body.response;
			var submitter  = req.body.submitter;
			var payee  = req.body.payee;
			var date  = req.body.date;
			var amount  = req.body.amount;
			var payment_reconciliation_id  = req.body.payment_reconciliation_id;
			
			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof request !== 'undefined' && request !== "") {
				column += 'request,';
				values += " '" + request +"',";
			}

			if (typeof response !== 'undefined' && response !== "") {
				column += 'response,';
				values += " '" + response +"',";
			}

			if (typeof submitter !== 'undefined' && submitter !== "") {
				column += 'submitter,';
				values += " '" + submitter +"',";
			}

			if (typeof payee !== 'undefined' && payee !== "") {
				column += 'payee,';
				values += " '" + payee +"',";
			}

			if (typeof  date !== 'undefined' &&  date !== "") {
				column += ' date,';
				values += "to_date('"+  date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof amount !== 'undefined' && amount !== "") {
				column += 'amount,';
				values += " '" + amount +"',";
			}

			if (typeof payment_reconciliation_id !== 'undefined' && payment_reconciliation_id !== "") {
				column += 'payment_reconciliation_id,';
				values += " '" + payment_reconciliation_id +"',";
			}			
			
			var query = "UPSERT INTO BACIRO_FHIR.payment_reconciliation_detail(detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detail_id from BACIRO_FHIR.payment_reconciliation_detail WHERE detail_id = '" + detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPaymentReconciliationDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPaymentReconciliationDetail"});
      });
    },
		paymentReconciliationProcessNote: function addPaymentReconciliationProcessNote(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var process_note_id = req.body.process_note_id;
			var type  = req.body.type;
			var text  = req.body.text;
			var payment_reconciliation_id  = req.body.payment_reconciliation_id;
			
			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof text !== 'undefined' && text !== "") {
				column += 'text,';
				values += " '" + text +"',";
			}

			if (typeof payment_reconciliation_id !== 'undefined' && payment_reconciliation_id !== "") {
				column += 'payment_reconciliation_id,';
				values += " '" + payment_reconciliation_id +"',";
			}

			
			var query = "UPSERT INTO BACIRO_FHIR.payment_reconciliation_process_note(process_note_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+process_note_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_note_id from BACIRO_FHIR.payment_reconciliation_process_note WHERE process_note_id = '" + process_note_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPaymentReconciliationProcessNote"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPaymentReconciliationProcessNote"});
      });
    },
	},
	put: {
		paymentReconciliation: function updatePaymentReconciliation(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var payment_reconciliation_id  = req.params._id;
			var status  = req.body.status;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			var created  = req.body.created;
			var organization  = req.body.organization;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			var form  = req.body.form;
			var total  = req.body.total;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof  period_start !== 'undefined' &&  period_start !== "") {
				column += ' period_start,';
				values += "to_date('"+  period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  period_end !== 'undefined' &&  period_end !== "") {
				column += ' period_end,';
				values += "to_date('"+  period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
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

			if (typeof request_provider !== 'undefined' && request_provider !== "") {
				column += 'request_provider,';
				values += " '" + request_provider +"',";
			}

			if (typeof request_organization !== 'undefined' && request_organization !== "") {
				column += 'request_organization,';
				values += " '" + request_organization +"',";
			}

			if (typeof form !== 'undefined' && form !== "") {
				column += 'form,';
				values += " '" + form +"',";
			}

			if (typeof total !== 'undefined' && total !== "") {
				column += 'total,';
				values += " '" + total +"',";
			}
							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "payment_reconciliation_id = '" + payment_reconciliation_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "payment_reconciliation_id = '" + payment_reconciliation_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.payment_reconciliation(payment_reconciliation_id," + column.slice(0, -1) + ") SELECT payment_reconciliation_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.payment_reconciliation WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select payment_reconciliation_id from BACIRO_FHIR.payment_reconciliation WHERE payment_reconciliation_id = '" + payment_reconciliation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePaymentReconciliation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePaymentReconciliation"});
      });
    },
		paymentReconciliationDetail: function updatePaymentReconciliationDetail(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var detail_id  = req.params._id;
			var type  = req.body.type;
			var request  = req.body.request;
			var response  = req.body.response;
			var submitter  = req.body.submitter;
			var payee  = req.body.payee;
			var date  = req.body.date;
			var amount  = req.body.amount;
			var payment_reconciliation_id  = req.body.payment_reconciliation_id;
			
			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof request !== 'undefined' && request !== "") {
				column += 'request,';
				values += " '" + request +"',";
			}

			if (typeof response !== 'undefined' && response !== "") {
				column += 'response,';
				values += " '" + response +"',";
			}

			if (typeof submitter !== 'undefined' && submitter !== "") {
				column += 'submitter,';
				values += " '" + submitter +"',";
			}

			if (typeof payee !== 'undefined' && payee !== "") {
				column += 'payee,';
				values += " '" + payee +"',";
			}

			if (typeof  date !== 'undefined' &&  date !== "") {
				column += ' date,';
				values += "to_date('"+  date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof amount !== 'undefined' && amount !== "") {
				column += 'amount,';
				values += " '" + amount +"',";
			}

			if (typeof payment_reconciliation_id !== 'undefined' && payment_reconciliation_id !== "") {
				column += 'payment_reconciliation_id,';
				values += " '" + payment_reconciliation_id +"',";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.payment_reconciliation_detail(detail_id," + column.slice(0, -1) + ") SELECT detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.payment_reconciliation_detail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detail_id from BACIRO_FHIR.payment_reconciliation_detail WHERE detail_id = '" + detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePaymentReconciliationDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePaymentReconciliationDetail"});
      });
    },
		paymentReconciliationProcessNote: function updatePaymentReconciliationProcessNote(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var process_note_id  = req.params._id;
			var type  = req.body.type;
			var text  = req.body.text;
			var payment_reconciliation_id  = req.body.payment_reconciliation_id;
			
			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof text !== 'undefined' && text !== "") {
				column += 'text,';
				values += " '" + text +"',";
			}

			if (typeof payment_reconciliation_id !== 'undefined' && payment_reconciliation_id !== "") {
				column += 'payment_reconciliation_id,';
				values += " '" + payment_reconciliation_id +"',";
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
			

      var query = "UPSERT INTO BACIRO_FHIR.payment_reconciliation_process_note(process_note_id," + column.slice(0, -1) + ") SELECT process_note_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.payment_reconciliation_process_note WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_note_id from BACIRO_FHIR.payment_reconciliation_process_note WHERE process_note_id = '" + process_note_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePaymentReconciliationProcessNote"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePaymentReconciliationProcessNote"});
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
