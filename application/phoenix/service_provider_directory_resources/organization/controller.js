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
// var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");
var db = new phoenix("jdbc:phoenix:" + "192.168.1.231" + ":/hbase-unsecure");

var controller = {
	get: {
    organization: function getOrganization(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      //params from query string
			var organizationId = req.query._id;
			var organizationActive = req.query.active;
			var organizationAddress = req.query.address;
			var organizationAddressCity = req.query.city;
			var organizationAddressCountry = req.query.country;
			var organizationAddressPostalCode = req.query.postal_code;
			var organizationAddressState = req.query.state; //space encodeURI masih ada bug untuk sprintf
			var organizationAddressUse = req.query.address_use; 
			var organizationEndpoint = req.query.endpoint; 
			var organizationIdentifier = req.query.identifier; 
			var organizationName = req.query.name; 
			var organizationPart_of = req.query.part_of; 
			//var organizationPhonetic = req.query.phonetic; 
			var organizationType = req.query.type; 

      //susun query
      var condition = "";
      var join = "";

      if(typeof organizationId !== 'undefined' && organizationId !== ""){
        condition += "o.ORGANIZATION_ID = '" + organizationId + "' AND ";  
      }

      if(typeof organizationActive !== 'undefined' && organizationActive !== ""){
        condition += "organization_active = " + organizationActive + " AND ";  
      }

      if((typeof organizationAddress !== 'undefined' && organizationAddress !== "")||(typeof organizationAddressCity !== 'undefined' && organizationAddressCity !== "")|| (typeof organizationAddressCountry !== 'undefined' && organizationAddressCountry !== "")|| (typeof organizationAddressPostalCode !== 'undefined' && organizationAddressPostalCode !== "")||(typeof organizationAddressState !== 'undefined' && organizationAddressState !== "")||(typeof organizationAddressUseCode !== 'undefined' && organizationAddressUseCode !== "")){
         //set join 
        join = " LEFT JOIN BACIRO_FHIR.ADDRESS addr ON addr.organization_id = p.organization_id ";
        
        if(typeof organizationAddress !== 'undefined' && organizationAddress !== ""){
          if(organizationAddress.indexOf('nonbreaking_space') > 0){
            organizationAddress = organizationAddress.replace(/nonbreaking_space/g, " ");
          } 
          condition += "UPPER(address_text) LIKE '%" + organizationAddress.toUpperCase() + "%' AND ";     
        }

        if(typeof organizationAddressCity !== 'undefined' && organizationAddressCity !== ""){
          if(organizationAddressCity.indexOf('nonbreaking_space') > 0){
            organizationAddressCity = organizationAddressCity.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_city) = '" + organizationAddressCity.toUpperCase() + "' AND ";  
        }

        if(typeof organizationAddressCountry !== 'undefined' && organizationAddressCountry !== ""){
          if(organizationAddressCountry.indexOf('nonbreaking_space') > 0){
            organizationAddressCountry = organizationAddressCountry.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_country) = '" + organizationAddressCountry.toUpperCase() + "' AND "; 
        }

        if(typeof organizationAddressPostalCode !== 'undefined' && organizationAddressPostalCode !== ""){
          condition += "address_postal_code = '" + organizationAddressPostalCode + "' AND ";     
        }

        if(typeof organizationAddressState !== 'undefined' && organizationAddressState !== ""){
          if(organizationAddressState.indexOf('nonbreaking_space') > 0){
            organizationAddressState = organizationAddressState.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_state) = '" + organizationAddressState.toUpperCase() + "' AND "; 
        }

        if(typeof organizationAddressUseCode !== 'undefined' && organizationAddressUseCode !== ""){
          condition += "UPPER(address_use) = '" + organizationAddressUseCode.toUpperCase() + "' AND ";     
        }
      }

      if((typeof organizationEmail !== 'undefined' && organizationEmail !== "") || (typeof organizationTelecom !== 'undefined' && organizationTelecom !== "")){
        join += " LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON cp.organization_id = p.organization_id ";
        
        if(typeof organizationEmail !== 'undefined' && organizationEmail !== ""){
          organizationEmail = organizationEmail.replace('at_sign', '@');
          condition += "UPPER(contact_point_value) = '" + organizationEmail.toUpperCase() + "' AND contact_point_system = 'email' AND ";       
        }

        if(typeof organizationTelecom !== 'undefined' && organizationTelecom !== ""){
          if(organizationTelecom.indexOf('at_sign') > 0){
            organizationTelecom = organizationTelecom.replace('at_sign', '@');  
          }
          
          condition += "(UPPER(contact_point_system) = '" + organizationTelecom.toUpperCase() + "' OR UPPER(contact_point_value) = '" + organizationTelecom.toUpperCase() + "' OR UPPER(contact_point_use) = '" + organizationTelecom.toUpperCase() + "') AND ";       
        }
      }

      if((typeof organizationFamily !== 'undefined' && organizationFamily !== "") || (typeof organizationGiven !== 'undefined' && organizationGiven !== "") || (typeof organizationName !== 'undefined' && organizationName !== "") || (typeof organizationPhonetic !== 'undefined' && organizationPhonetic !== "")){
        join += " LEFT JOIN BACIRO_FHIR.HUMAN_NAME hn ON hn.organization_id = p.organization_id ";
        
        if(typeof organizationFamily !== 'undefined' && organizationFamily !== ""){
          condition += "UPPER(human_name_family) = '" + organizationFamily.toUpperCase() + "' AND ";       
        }

        if(typeof organizationGiven !== 'undefined' && organizationGiven !== ""){
          condition += "UPPER(human_name_given) = '" + organizationGiven.toUpperCase() + "' AND ";       
        }

        if(typeof organizationName !== 'undefined' && organizationName !== ""){
          if(organizationName.indexOf('nonbreaking_space') > 0){
            organizationName = organizationName.replace(/nonbreaking_space/g, " ");
          }

          condition += "(UPPER(human_name_text) LIKE '%" + organizationName.toUpperCase() + "%' OR UPPER(human_name_family) LIKE '%" + organizationName.toUpperCase() + "%' OR UPPER(human_name_given) LIKE '%" + organizationName.toUpperCase() + "%' OR UPPER(human_name_prefix) LIKE '%" + organizationName.toUpperCase() + "%' OR UPPER(human_name_suffix) LIKE '%" + organizationName.toUpperCase() + "%') AND ";       
        }

        if(typeof organizationPhonetic !== 'undefined' && organizationPhonetic !== ""){
          condition += "(UPPER(human_name_given) = '" + organizationPhonetic.toUpperCase() + "' OR UPPER(human_name_family) = '" + organizationPhonetic.toUpperCase() + "') AND ";       
        }
      }

      if((typeof organizationIdentifier !== 'undefined' && organizationIdentifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.organization_id = p.organization_id ";
        
        if(typeof organizationIdentifier !== 'undefined' && organizationIdentifier !== ""){
          condition += "identifier_value = '" + organizationIdentifier + "' AND ";       
        }
      }

      if((typeof organizationEndpoint !== 'undefined' && organizationEndpoint !== "")){
        join += " LEFT JOIN BACIRO_FHIR.ENDPOINT ep ON ep.organization_id = o.organization_id ";
      }

			if(typeof organizationType !== 'undefined' && organizationType !== ""){
        condition += "organization_type = " + organizationType + " AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrOrganization = [];
      var query = "select organization_id, organization_active, organization_type, organization_name, organization_alias, parent_id, endpoint_id from baciro_fhir.organization o " + fixCondition;
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Organization = {};
          Organization.resourceType = "Organization";
          Organization.id = rez[i].organization_id;
          Organization.active = rez[i].organization_active;
          Organization.type = rez[i].organization_type;
					Organization.name = rez[i].organization_name;
					Organization.alias = rez[i].organization_alias;
					Organization.parent_id = rez[i].parent_id;
					Organization.endpoint_id = rez[i].endpoint_id;
          arrOrganization[i] = Organization;
        }
        res.json({"err_code":0,"data": arrOrganization});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getOrganization"});
      });
    },
		organizationContact: function getOrganizationContact(req, res){
      var organizationId = req.query.organization_id;
			
      //susun query
      var condition = "";
			
			if(typeof organizationId !== 'undefined' && organizationId !== ""){
        condition += "oc.organization_id = '" + organizationId + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrOrganizationContact = [];
      
			var query = "SELECT oc.organization_contact_id as organization_contact_id, organization_contact_purpose, hn.human_name_id as human_name_id, human_name_use, human_name_text, human_name_family, human_name_given, human_name_prefix, human_name_suffix, human_name_period_start, human_name_period_end, addr.address_id as address_id, address_use, address_type, address_text, address_line, address_city, address_district, address_state, address_postal_code, address_country, address_period_start, address_period_end, cp.contact_point_id as contact_point_id, contact_point_system, contact_point_value, contact_point_use, contact_point_rank, contact_point_period_start, contact_point_period_end FROM BACIRO_FHIR.ORGANIZATION_CONTACT oc LEFT JOIN BACIRO_FHIR.HUMAN_NAME hn ON hn.human_name_id = oc.human_name_id LEFT JOIN BACIRO_FHIR.ADDRESS addr ON oc.address_id = addr.address_id LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON oc.organization_contact_id = cp.organization_contact_id " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				var arrOrganizationContact = [];
        for(i = 0; i < rez.length; i++){
          index = i;
          countOrganizationContact = rez.length;
          var OrganizationContact = {id: "", purpose: "", name:{}, address: {}, telecom: []};
          // var 
          OrganizationContact.id = rez[i].organization_contact_id;
          OrganizationContact.purpose = rez[i].organization_contact_purpose;
          OrganizationContact.name.id = rez[i].human_name_id;
          OrganizationContact.name.use = rez[i].human_name_use;
          OrganizationContact.name.text = rez[i].human_name_text;
          OrganizationContact.name.family = rez[i].human_name_family;
          OrganizationContact.name.given = rez[i].human_name_given;
          OrganizationContact.name.prefix = rez[i].human_name_prefix;
          OrganizationContact.name.suffix = rez[i].human_name_suffix;
					
					var nameperiod_start,nameperiod_end;
          if(rez[i].human_name_period_start == null){
            nameperiod_start = formatDate(rez[i].human_name_period_start);  
          }else{
            nameperiod_start = rez[i].human_name_period_start;  
          }

          if(rez[i].human_name_period_end == null){
            nameperiod_end = formatDate(rez[i].human_name_period_end);  
          }else{
            nameperiod_end = rez[i].human_name_period_end;  
          }
					
					OrganizationContact.name.period = nameperiod_start + ' to ' + nameperiod_end;

          OrganizationContact.address.id = rez[i].address_id;
          OrganizationContact.address.use = rez[i].address_use;
          OrganizationContact.address.type = rez[i].address_type;
          OrganizationContact.address.text = rez[i].address_text;
          OrganizationContact.address.line = rez[i].address_line;
          OrganizationContact.address.city = rez[i].address_city;
          OrganizationContact.address.district = rez[i].address_district;
          OrganizationContact.address.state = rez[i].address_state;
          OrganizationContact.address.postalCode = rez[i].address_postal_code;
          OrganizationContact.address.country = rez[i].address_country;
					
					var addressperiod_start;
					var addressperiod_end;
          if(rez[i].address_period_start == null){
            addressperiod_start = formatDate(rez[i].address_period_start);  
          }else{
            addressperiod_start = rez[i].address_period_start;  
          }

          if(rez[i].address_period_end == null){
            addressperiod_end = formatDate(rez[i].address_period_end);  
          }else{
            addressperiod_end = rez[i].address_period_end;  
          }
					
					OrganizationContact.address.period = addressperiod_start + ' to ' + addressperiod_end;
				
          if(rez[i].contact_point_period_start == null){
            contactPeriodStart = formatDate(rez[i].contact_point_period_start);
          }else{
            contactPeriodStart = rez[i].contact_point_period_start;
          }

          if(rez[i].contact_point_period_end == null){
            contactPeriodEnd = formatDate(rez[i].contact_point_period_end);
          }else{
            contactPeriodEnd = rez[i].contact_point_period_end;
          }

          OrganizationContact.telecom.push({
						id: rez[i].contact_point_id, 
						system: rez[i].contact_point_system, 
						value: rez[i].contact_point_value, 
						use: rez[i].contact_point_use, 
						rank: rez[i].contact_point_rank,
						//period_start: contactPeriodStart,
						//period_end: contactPeriodEnd
						period : contactPeriodStart + ' to ' + contactPeriodEnd
					});   

          arrOrganizationContact[i] = OrganizationContact;
        }
        res.json({"err_code":0,"data": arrOrganizationContact});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getOrganizationContact"});
      });
    },
		endpoint: function getEndpoint(req, res){
      var organizationId = req.query.organization_id;
			
      //susun query
      var condition = "";
			
			if(typeof organizationId !== 'undefined' && organizationId !== ""){
        condition += "organization_id = '" + organizationId + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrOrganizationContact = [];
      var query = "SELECT endpoint_id,endpoint_status,endpoint_connection_type,endpoint_name,endpoint_managing_organization,endpoint_period_start,endpoint_period_end,endpoint_payload_type,endpoint_payload_mime_type,endpoint_address,endpoint_header,organization_id,location_id,practitioner_role_id,healthcare_service_id FROM BACIRO_FHIR.ORGANIZATION_CONTACT " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var OrganizationContact = {};
          OrganizationContact.endpoint_id = rez[i].endpoint_id;
          OrganizationContact.endpoint_status = rez[i].endpoint_status;
					OrganizationContact.endpoint_connection_type = rez[i].endpoint_connection_type;
					OrganizationContact.endpoint_name = rez[i].endpoint_name;
					OrganizationContact.endpoint_managing_organization = rez[i].endpoint_managing_organization;
					OrganizationContact.endpoint_period_start = rez[i].endpoint_period_start;
					OrganizationContact.endpoint_period_end = rez[i].endpoint_period_end;
					OrganizationContact.endpoint_payload_type = rez[i].endpoint_payload_type;
					OrganizationContact.endpoint_payload_mime_type = rez[i].endpoint_payload_mime_type;
					OrganizationContact.endpoint_address = rez[i].endpoint_address;
					OrganizationContact.endpoint_header = rez[i].endpoint_header;
					OrganizationContact.organization_id = rez[i].organization_id;
					OrganizationContact.location_id = rez[i].location_id;
					OrganizationContact.practitioner_role_id = rez[i].practitioner_role_id;
					OrganizationContact.healthcare_service_id = rez[i].healthcare_service_id;
               
          arrOrganizationContact[i] = OrganizationContact;
        }
        res.json({"err_code":0,"data": arrOrganizationContact});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getEndpoint"});
      });
    }
  },
  post: {
    organization: function addOrganization(req, res){
      var organization_id = req.body.id;
      var organization_active = req.body.active;
      var organization_type = req.body.type;
      var organization_name = req.body.name;
      var organization_alias = req.body.alias;
      var organization_parentId = req.body.parentId;
			var organization_endpointId = req.body.endpointId;

     
      if(organization_id == ""){
        organization_id = null;
      }
			
			var column= "";
			var values= "";
			
			if(typeof organization_active !== 'undefined'){
        column += 'ORGANIZATION_ACTIVE,';
        values += "" + organization_active +",";
      }
			
			if(typeof organization_type !== 'undefined'){
        column += 'ORGANIZATION_TYPE,';
        values += "'" + organization_type +"',";
      }
			
			if(typeof organization_name !== 'undefined'){
        column += 'ORGANIZATION_NAME,';
        values += "'" + organization_name +"',";
      }
			
			if(typeof organization_alias !== 'undefined'){
        column += 'ORGANIZATION_ALIAS,';
        values += "'" + organization_alias +"',";
      }
			
			if(typeof organization_parentId !== 'undefined'){
        column += 'PARENT_ID,';
        values += "'" + organization_parentId +"',";
      }
			
			if(typeof organization_endpointId !== 'undefined'){
        column += 'ENDPOINT_ID,';
        values += "'" + organization_endpointId +"',";
      }

			var query = "UPSERT INTO BACIRO_FHIR.ORGANIZATION(ORGANIZATION_ID, " + column.slice(0, -1) + ")"+ " VALUES ('"+organization_id+"', " + values.slice(0, -1) + ")";
			
      db.upsert(query,function(succes){
        var query = "SELECT organization_id, organization_active, organization_type, organization_name, organization_alias, parent_id, endpoint_id FROM BACIRO_FHIR.ORGANIZATION WHERE organization_id = '" + organization_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addOrganization"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addOrganization"});
      });
    },
		organizationContact: function addOrganizationContact(req, res){
			console.log(req.body);
      var organization_contact_id = req.body.id;
      var purpose = req.body.purpose;
      var humanNameId = req.body.humanNameId;
      var addressId = req.body.addressId;
      var OrganizationId = req.body.OrganizationId;
			var column= "";
			var values= "";
						
			if(typeof purpose !== 'undefined'){
        column += 'ORGANIZATION_CONTACT_PURPOSE,';
        values += "'" + purpose +"',";
      }
			
			if(typeof humanNameId !== 'undefined'){
        column += 'HUMAN_NAME_ID,';
        values += "'" + humanNameId +"',";
      }
			
			if(typeof addressId !== 'undefined'){
        column += 'ADDRESS_ID,';
        values += "'" + addressId +"',";
      }
			
			if(typeof OrganizationId !== 'undefined'){
        column += 'ORGANIZATION_ID,';
        values += "'" + OrganizationId +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.ORGANIZATION_CONTACT(ORGANIZATION_CONTACT_ID, " + column.slice(0, -1) + ")"+ " VALUES ('"+organization_contact_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "SELECT ORGANIZATION_CONTACT_ID,ORGANIZATION_CONTACT_PURPOSE,HUMAN_NAME_ID,ADDRESS_ID,ORGANIZATION_ID FROM BACIRO_FHIR.ORGANIZATION_CONTACT WHERE ORGANIZATION_ID = '" + OrganizationId + "' ";
				
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
					console.log(rez);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addOrganizationContact"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addOrganizationContact"});
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