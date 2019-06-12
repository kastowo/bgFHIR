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
		paymentNotice: function getPaymentNotice(req, res){
			var apikey = req.params.apikey;
			var condition = "";
      var join = "";
			var offset = req.query.offset;
			var limit = req.query.limit;
			var paymentNoticeId = req.query._id;
			var created = req.query.created;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var payment_status = req.query.payment_status;
			var provider = req.query.provider;
			var request = req.query.request;
			var response = req.query.response;
			var statusdate = req.query.statusdate;
			//susun query
			
			
			if (typeof created !== 'undefined' && created !== "") {
        condition += "pan.created = to_date('" + created + "', 'yyyy-MM-dd') AND ";
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.payment_notice_id = pan.payment_notice_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if(typeof organization !== 'undefined' && organization !== ""){
				condition += "pan.organization = '" + organization + "' AND,";  
      }
			
			if(typeof payment_status !== 'undefined' && payment_status !== ""){
				condition += "pan.payment_status = '" + payment_status + "' AND,";  
      }
			
			if(typeof provider !== 'undefined' && provider !== ""){
				condition += "pan.provider = '" + provider + "' AND,";  
      }
			
			if(typeof request !== 'undefined' && request !== ""){
				condition += "pan.request = '" + request + "' AND,";  
      }
			
			if(typeof response !== 'undefined' && response !== ""){
				condition += "pan.response = '" + response + "' AND,";  
      }
			
			if(typeof statusdate !== 'undefined' && statusdate !== ""){
				condition += "pan.status_date = '" + statusdate + "' AND,";  
      }

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " pan.payment_notice_id > '" + offset + "' AND ";       
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

      var arrPaymentNotice = [];
      var query = "select pan.payment_notice_id as payment_notice_id, pan.status as status, pan.request as request, pan.response as response, pan.status_date as status_date, pan.created as created, pan.target as target, pan.provider as provider, pan.organization as organization, pan.payment_status as payment_status from BACIRO_FHIR.payment_notice pan " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var PaymentNotice = {};
					PaymentNotice.resourceType = "PaymentNotice";
          PaymentNotice.id = rez[i].payment_notice_id;
					PaymentNotice.status = rez[i].status;
					PaymentNotice.request = rez[i].request;
					PaymentNotice.response = rez[i].response;
					if(rez[i].status_date == null){
						PaymentNotice.statusDate = formatDate(rez[i].status_date);  
					}else{
						PaymentNotice.statusDate = rez[i].status_date;  
					}
					if(rez[i].created == null){
						PaymentNotice.created = formatDate(rez[i].created);  
					}else{
						PaymentNotice.created = rez[i].created;  
					}
					if(rez[i].target != "null"){
						PaymentNotice.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].target;
					} else {
						PaymentNotice.target = "";
					}
					if(rez[i].provider != "null"){
						PaymentNotice.provider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].provider;
					} else {
						PaymentNotice.provider = "";
					}
					if(rez[i].organization != "null"){
						PaymentNotice.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization;
					} else {
						PaymentNotice.organization = "";
					}
					PaymentNotice.paymentStatus = rez[i].payment_status;
	
          arrPaymentNotice[i] = PaymentNotice;
        }
        res.json({"err_code":0,"data": arrPaymentNotice});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPaymentNotice"});
      });
    }
  },
	post: {
		paymentNotice: function addPaymentNotice(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var payment_notice_id  = req.body.payment_notice_id;
			var status  = req.body.status;
			var request  = req.body.request;
			var response  = req.body.response;
			var status_date  = req.body.status_date;
			var created  = req.body.created;
			var target  = req.body.target;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var payment_status  = req.body.payment_status;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof request !== 'undefined' && request !== "") {
				column += 'request,';
				values += " '" + request +"',";
			}

			if (typeof response !== 'undefined' && response !== "") {
				column += 'response,';
				values += " '" + response +"',";
			}

			if (typeof  status_date !== 'undefined' &&  status_date !== "") {
				column += ' status_date,';
				values += "to_date('"+  status_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof target !== 'undefined' && target !== "") {
				column += 'target,';
				values += " '" + target +"',";
			}

			if (typeof provider !== 'undefined' && provider !== "") {
				column += 'provider,';
				values += " '" + provider +"',";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof payment_status !== 'undefined' && payment_status !== "") {
				column += 'payment_status,';
				values += " '" + payment_status +"',";
			}			
			
			var query = "UPSERT INTO BACIRO_FHIR.payment_notice(payment_notice_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+payment_notice_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select payment_notice_id from BACIRO_FHIR.payment_notice WHERE payment_notice_id = '" + payment_notice_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPaymentNotice"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPaymentNotice"});
      });
    }
	},
	put: {
		paymentNotice: function updatePaymentNotice(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var payment_notice_id  = req.params._id;
			var status  = req.body.status;
			var request  = req.body.request;
			var response  = req.body.response;
			var status_date  = req.body.status_date;
			var created  = req.body.created;
			var target  = req.body.target;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var payment_status  = req.body.payment_status;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof request !== 'undefined' && request !== "") {
				column += 'request,';
				values += " '" + request +"',";
			}

			if (typeof response !== 'undefined' && response !== "") {
				column += 'response,';
				values += " '" + response +"',";
			}

			if (typeof  status_date !== 'undefined' &&  status_date !== "") {
				column += ' status_date,';
				values += "to_date('"+  status_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof target !== 'undefined' && target !== "") {
				column += 'target,';
				values += " '" + target +"',";
			}

			if (typeof provider !== 'undefined' && provider !== "") {
				column += 'provider,';
				values += " '" + provider +"',";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof payment_status !== 'undefined' && payment_status !== "") {
				column += 'payment_status,';
				values += " '" + payment_status +"',";
			}			
							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "payment_notice_id = '" + payment_notice_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "payment_notice_id = '" + payment_notice_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.payment_notice(payment_notice_id," + column.slice(0, -1) + ") SELECT payment_notice_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.payment_notice WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select payment_notice_id from BACIRO_FHIR.payment_notice WHERE payment_notice_id = '" + payment_notice_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePaymentNotice"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePaymentNotice"});
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
