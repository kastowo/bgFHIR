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

var hostHbase = configYaml.hbase.host;

var hostFHIR = configYaml.fhir.host;
var portFHIR = configYaml.fhir.port;

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
var db = new phoenix("jdbc:phoenix:" + hostHbase + ":/hbase-unsecure");

var controller = {
	get: {
		checkId: function getCheckId(req, res) {
			var id = req.params.id;
			var name = req.params.name;
			var condition = '';

			var query = "SELECT id FROM BACIRO_FHIR." + name + " WHERE id = " + id;

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
					"function": "getCheckId"
				});
			});
		},
		checkCode: function getCheckCode(req, res) {
			var code = req.params.code;
			var name = req.params.name;
			var condition = '';

			var query = "SELECT id FROM BACIRO_FHIR." + name + " WHERE code = '" + code + "' ";

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
					"function": "getCheckCode"
				});
			});
		},
		checkUniqeValue: function getCheckUniqeValue(req, res) {
			var fdvalue = req.params.fdvalue;
			var tbname = req.params.tbname;
			var condition = '';

			arrValue = fdvalue.split('|');
			field = arrValue[0];
			values = arrValue[1];

			var query = "SELECT " + field + " FROM BACIRO_FHIR." + tbname + " WHERE " + field + " = '" + values + "'";

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
					"function": "getCheckUniqeValue"
				});
			});
		},
		checkGroupQuota: function getCheckGroupQuota(req, res) {
			var group_id = req.params.group_id;

			var query = "SELECT COUNT(*) total_member, g.group_quantity quantity from BACIRO_FHIR.GROUP_MEMBER gm left join BACIRO_FHIR.GROUP_ g ON g.group_id = gm.group_id WHERE gm.group_id = '" + group_id + "' GROUP BY g.group_quantity";

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
					"function": "getCheckGroupQuota"
				});
			});
		},
		checkMemberEntityGroup: function getCheckMemberEntityGroup(req, res) {
			var group_id = req.params.group_id;
			var entity = req.params.entity_id;

			arrEntity = entity.split('|');
			field = arrEntity[0];
			value = arrEntity[1];
			condition = field + " = '" + value + "'";

			var query = "SELECT group_member_id from BACIRO_FHIR.GROUP_MEMBER WHERE " + condition + " AND group_id = '" + group_id + "' ";

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
					"function": "getCheckGroupQuota"
				});
			});
		},
		Identifier: function getIdentifier(req, res) {
			var apikey = req.params.apikey;

			var identifierId = req.query._id;
			var personId = req.query.person_id;
			var patientId = req.query.patient_id;
			var relatedPersonId = req.query.related_person_id;
			var organizationId = req.query.organization_id;
			var endpointId = req.query.endpoint_id;
			var locationId = req.query.location_id;
			var practitionerId = req.query.practitioner_id;
			var qualificationId = req.query.qualification_id;
			var qualificationId = req.query.qualification_id;
			var practitionerRoleId = req.query.practitioner_role_id;
			var healthcareServiceId = req.query.healthcare_service_id;
			var account_id = req.query.account_id;
			var encounter_id = req.query.encounter_id;
			var episode_of_care_id = req.query.episode_of_care_id;
			var flag_id = req.query.flag_id;
			var immunization_id = req.query.immunization_id;

			//susun query
			var condition = "";
			var systemURI = "";

			if (typeof identifierId !== 'undefined' && identifierId !== "") {
				condition += "identifier_id = '" + identifierId + "' AND ";
			}

			if (typeof personId !== 'undefined' && personId !== "") {
				condition += "person_id = '" + personId + "' AND ";
				systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/Person/' + personId + '/Identifier/';
			}

			if (typeof patientId !== 'undefined' && patientId !== "") {
				condition += "i.patient_id = '" + patientId + "' AND ";
				systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient/' + patientId + '/Identifier/';
			}

			if (typeof relatedPersonId !== 'undefined' && relatedPersonId !== "") {
				condition += "i.related_person_id = '" + relatedPersonId + "' AND ";
				systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson/' + relatedPersonId + '/Identifier/';
			}

			if(typeof organizationId !== 'undefined' && organizationId !== ""){
        condition += "organization_id = '" + organizationId + "' AND,";  
      }
			
			if(typeof endpointId !== 'undefined' && endpointId !== ""){
        condition += "endpoint_id = '" + endpointId + "' AND,";  
      }
			
			if(typeof locationId !== 'undefined' && locationId !== ""){
        condition += "location_id = '" + locationId + "' AND,";  
      }
			
			if(typeof practitionerId !== 'undefined' && practitionerId !== ""){
        condition += "practitioner_id = '" + practitionerId + "' AND,";  
      }
			
			if(typeof qualificationId !== 'undefined' && qualificationId !== ""){
        condition += "qualification_id = '" + qualificationId + "' AND,";  
      }
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "practitioner_role_id = '" + practitionerRoleId + "' AND,";  
      }
			
			if(typeof healthcareServiceId !== 'undefined' && healthcareServiceId !== ""){
        condition += "healthcare_service_id = '" + healthcareServiceId + "' AND,";  
      }
			
			if(typeof account_id !== 'undefined' && account_id !== ""){
        condition += "account_id = '" + account_id + "' AND,";  
      }
			
			if(typeof encounter_id !== 'undefined' && encounter_id !== ""){
        condition += "encounter_id = '" + encounter_id + "' AND,";  
      }
			
			if(typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== ""){
        condition += "episode_of_care_id = '" + episode_of_care_id + "' AND,";  
      }
			
			if(typeof flag_id !== 'undefined' && flag_id !== ""){
        condition += "flag_id = '" + flag_id + "' AND,";  
      }
			
			if(typeof immunization_id !== 'undefined' && immunization_id !== ""){
        condition += "immunization_id = '" + immunization_id + "' AND,";  
      }

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrIdentifier = [];
			var query = "SELECT identifier_id, identifier_use, identifier_type, identifier_system, identifier_value, identifier_period_start, identifier_period_end, org.organization_id as organization_id FROM BACIRO_FHIR.IDENTIFIER i LEFT JOIN BACIRO_FHIR.ORGANIZATION org on i.organization_id = org.organization_id " + fixCondition; //join ke organization

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Identifier = {};
					Identifier.id = rez[i].identifier_id;
					Identifier.use = rez[i].identifier_use;
					Identifier.type = rez[i].identifier_type;
					Identifier.system = systemURI + rez[i].identifier_system;
					Identifier.value = rez[i].identifier_value;
					Identifier.period = formatDate(rez[i].identifier_period_start) + ' to ' + formatDate(rez[i].identifier_period_end);
					Identifier.assigner = rez[i].organization_id;

					arrIdentifier[i] = Identifier;
				}
				res.json({
					"err_code": 0,
					"data": arrIdentifier
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getIdentifier"
				});
			});
		},
		HumanName: function getHumanName(req, res) {
			var humanNameId = req.query._id;
			var personId = req.query.person_id;
			var patientId = req.query.patient_id;
			var relatedPersonId = req.query.related_person_id;
			var practitionerId = req.query.practitioner_id;

			//susun query
			var condition = "";

			if (typeof humanNameId !== 'undefined' && humanNameId !== "") {
				condition += "human_name_id = '" + humanNameId + "' AND ";
			}

			if (typeof personId !== 'undefined' && personId !== "") {
				condition += "person_id = '" + personId + "' AND ";
			}

			if (typeof patientId !== 'undefined' && patientId !== "") {
				condition += "patient_id = '" + patientId + "' AND ";
			}

			if (typeof relatedPersonId !== 'undefined' && relatedPersonId !== "") {
				condition += "related_person_id = '" + relatedPersonId + "' AND ";
			}

			if(typeof practitionerId !== 'undefined' && practitionerId !== ""){
        condition += "practitioner_id = '" + practitionerId + "' AND,";  
      }

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrHumanName = [];
			var query = "SELECT human_name_id, human_name_use, human_name_text, human_name_family, human_name_given, human_name_prefix, human_name_suffix, human_name_period_start, human_name_period_end  FROM BACIRO_FHIR.HUMAN_NAME " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var HumanName = {};
					HumanName.id = rez[i].human_name_id;
					HumanName.use = rez[i].human_name_use;
					HumanName.text = rez[i].human_name_text;
					HumanName.family = rez[i].human_name_family;
					HumanName.given = rez[i].human_name_given;
					HumanName.prefix = rez[i].human_name_prefix;
					HumanName.suffix = rez[i].human_name_suffix;

					if (rez[i].human_name_period_start == null) {
						HumanName.period_start = formatDate(rez[i].human_name_period_start);
					} else {
						HumanName.period_start = rez[i].human_name_period_start;
					}

					if (rez[i].human_name_period_end == null) {
						HumanName.period_end = formatDate(rez[i].human_name_period_end);
					} else {
						HumanName.period_end = rez[i].human_name_period_end;
					}

					arrHumanName[i] = HumanName;
				}
				res.json({
					"err_code": 0,
					"data": arrHumanName
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getHumanName"
				});
			});
		},
		ContactPoint: function getContactPoint(req, res) {
			var contactPointId = req.query._id;
			var personId = req.query.person_id;
			var patientId = req.query.patient_id;
			var patientContactId = req.query.patient_contact_id;
			var relatedPersonId = req.query.related_person_id;
			var deviceId = req.query.device_id;
			var organizationId = req.query.organization_id;
			var endpointId  = req.query.endpoint_id;
			var locationId = req.query.location_id;
			var practitionerId = req.query.practitioner_id;
			var practitionerRoleId = req.query.practitioner_role_id;
			var healthcareServiceId = req.query.healthcare_service_id;

			//susun query
			var condition = "";

			if (typeof contactPointId !== 'undefined' && contactPointId !== "") {
				condition += "contact_point_id = '" + contactPointId + "' AND ";
			}

			if (typeof personId !== 'undefined' && personId !== "") {
				condition += "person_id = '" + personId + "' AND ";
			}

			if (typeof patientId !== 'undefined' && patientId !== "") {
				condition += "patient_id = '" + patientId + "' AND ";
			}

			if (typeof patientContactId !== 'undefined' && patientContactId !== "") {
				condition += "patient_contact_id = '" + patientContactId + "' AND ";
			}

			if (typeof relatedPersonId !== 'undefined' && relatedPersonId !== "") {
				condition += "related_person_id = '" + relatedPersonId + "' AND ";
			}

			if(typeof deviceId !== 'undefined' && deviceId !== ""){
        condition += "device_id = '" + deviceId + "' AND ";  
      }

      if(typeof organizationId !== 'undefined' && organizationId !== ""){
        condition += "organization_id = '" + organizationId + "' AND,";  
      }
			
			if(typeof endpointId !== 'undefined' && endpointId !== ""){
        condition += "endpoint_id = '" + endpointId + "' AND,";  
      }
			
			if(typeof locationId !== 'undefined' && locationId !== ""){
        condition += "location_id = '" + locationId + "' AND,";  
      }
			
			if(typeof practitionerId !== 'undefined' && practitionerId !== ""){
        condition += "practitioner_id = '" + practitionerId + "' AND,";  
      }			
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "practitioner_role_id = '" + practitionerRoleId + "' AND,";  
      }
			
			if(typeof healthcareServiceId !== 'undefined' && healthcareServiceId !== ""){
        condition += "healthcare_service_id = '" + healthcareServiceId + "' AND,";  
      }

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrContactPoint = [];
			var query = "SELECT contact_point_id, contact_point_system, contact_point_value, contact_point_use, contact_point_rank, contact_point_period_start, contact_point_period_end FROM BACIRO_FHIR.CONTACT_POINT " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ContactPoint = {};
					ContactPoint.id = rez[i].contact_point_id;
					ContactPoint.system = rez[i].contact_point_system;
					ContactPoint.value = rez[i].contact_point_value;
					ContactPoint.use = rez[i].contact_point_use;
					ContactPoint.rank = rez[i].contact_point_rank;

					if (rez[i].contact_point_period_start == null) {
						ContactPoint.period_start = formatDate(rez[i].contact_point_period_start);
					} else {
						ContactPoint.period_start = rez[i].contact_point_period_start;
					}

					if (rez[i].contact_point_period_end == null) {
						ContactPoint.period_end = formatDate(rez[i].contact_point_period_end);
					} else {
						ContactPoint.period_end = rez[i].contact_point_period_end;
					}

					arrContactPoint[i] = ContactPoint;
				}
				res.json({
					"err_code": 0,
					"data": arrContactPoint
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getContactPoint"
				});
			});
		},
		Address: function getAddress(req, res) {
			var addressId = req.query._id;
			var personId = req.query.person_id;
			var patientId = req.query.patient_id;
			var relatedPersonId = req.query.related_person_id;
			var organizationId = req.query.organization_id;
			var addressId = req.query.address_id;
			var practitionerId = req.query.practitioner_id;

			//susun query
			var condition = "";

			if (typeof addressId !== 'undefined' && addressId !== "") {
				condition += "address_id = '" + addressId + "' AND ";
			}

			if (typeof personId !== 'undefined' && personId !== "") {
				condition += "person_id = '" + personId + "' AND ";
			}

			if (typeof patientId !== 'undefined' && patientId !== "") {
				condition += "patient_id = '" + patientId + "' AND ";
			}

			if (typeof relatedPersonId !== 'undefined' && relatedPersonId !== "") {
				condition += "related_person_id = '" + relatedPersonId + "' AND ";
			}

			if(typeof organizationId !== 'undefined' && organizationId !== ""){
        condition += "organization_id = '" + organizationId + "' AND ";  
      }
			
			if(typeof addressId !== 'undefined' && addressId !== ""){
        condition += "address_id = '" + addressId + "' AND ";  
      }
			
			if(typeof practitionerId !== 'undefined' && practitionerId !== ""){
        condition += "practitioner_id = '" + practitionerId + "' AND ";  
      }

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrAddress = [];
			var query = "SELECT address_id, address_use, address_type, address_text, address_line, address_city, address_district, address_state, address_postal_code, address_country, address_period_start, address_period_end FROM BACIRO_FHIR.ADDRESS " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Address = {};
					Address.id = rez[i].address_id;
					Address.use = rez[i].address_use;
					Address.type = rez[i].address_type;
					Address.text = rez[i].address_text;
					Address.line = rez[i].address_line;
					Address.city = rez[i].address_city;
					Address.district = rez[i].address_district;
					Address.state = rez[i].address_state;
					Address.postal_code = rez[i].address_postal_code;
					Address.country = rez[i].address_country;

					if (rez[i].address_period_start == null) {
						Address.period_start = formatDate(rez[i].address_period_start);
					} else {
						Address.period_start = rez[i].address_period_start;
					}

					if (rez[i].address_period_end == null) {
						Address.period_end = formatDate(rez[i].address_period_end);
					} else {
						Address.period_end = rez[i].address_period_end;
					}

					arrAddress[i] = Address;
				}
				res.json({
					"err_code": 0,
					"data": arrAddress
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAddress"
				});
			});
		},
		Attachment: function getAttachment(req, res) {
			var apikey = req.params.apikey;
			var attachmentId = req.query._id;
			var patientId = req.query.patient_id;
			var relatedPersonId = req.query.related_person_id;
			var personId = req.query.person_id;
			var practitionerId = req.query.practitioner_id;

			//susun query
			var condition = "";
			var systemURI = "";

			if (typeof patientId !== 'undefined' && patientId !== "") {
				condition += "patient_id = '" + patientId + "' AND ";
				systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient/' + patientId + '/Photo/';
			}

			if (typeof attachmentId !== 'undefined' && attachmentId !== "") {
				condition += "attachment_id = '" + attachmentId + "' AND ";
			}

			if (typeof relatedPersonId !== 'undefined' && relatedPersonId !== "") {
				condition += "related_person_id = '" + relatedPersonId + "' AND ";
				systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson/' + relatedPersonId + '/Photo/';
			}

			if (typeof personId !== 'undefined' && personId !== "") {
				systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/Person/' + personId + '/Photo/';
			}

			if(typeof practitionerId !== 'undefined' && practitionerId !== ""){
        condition += "practitioner_id = '" + practitionerId + "' AND,";  
      }

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrAttachment = [];
			var query = "SELECT attachment_id, attachment_content_type, attachment_language, attachment_url, attachment_size, attachment_hash, attachment_title, attachment_creation, attachment_data FROM BACIRO_FHIR.ATTACHMENT " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
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

					arrAttachment[i] = Attachment;
				}
				res.json({
					"err_code": 0,
					"data": arrAttachment
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAttachment"
				});
			});
		},
		identityAssuranceLevel: function getIdentityAssuranceLevel(req, res) {
			id = req.params._id;
			if (id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + id;
			}
			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getIdentityAssuranceLevel"
				});
			});
		},
		identityAssuranceLevelCode: function getIdentityAssuranceLevelCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getIdentityAssuranceLevelCode"
				});
			});
		},
		administrativeGender: function getAdministrativeGender(req, res) {
			id = req.params._id;
			if (id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + id;
			}
			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAdministrativeGender"
				});
			});
		},
		administrativeGenderCode: function getAdministrativeGenderCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAdministrativeGenderCode"
				});
			});
		},
		maritalStatus: function getMaritalStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.MARITAL_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMaritalStatus"
				});
			});
		},
		maritalStatusCode: function getMaritalStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.MARITAL_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMaritalStatus"
				});
			});
		},
		contactRole: function getContactRole(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, description FROM BACIRO_FHIR.CONTACT_ROLE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getContactRole"
				});
			});
		},
		contactRoleCode: function getContactRoleCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, description FROM BACIRO_FHIR.CONTACT_ROLE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getContactRoleCode"
				});
			});
		},
		animalSpecies: function getAnimalSpecies(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_SPECIES " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAnimalSpecies"
				});
			});
		},
		animalSpeciesCode: function getAnimalSpeciesCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_SPECIES WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAnimalSpeciesCode"
				});
			});
		},
		animalBreeds: function getAnimalBreeds(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_BREEDS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAnimalBreeds"
				});
			});
		},
		animalBreedsCode: function getAnimalBreedsCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_BREEDS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAnimalBreedsCode"
				});
			});
		},
		animalGenderStatus: function getAnimalGenderStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAnimalGenderStatus"
				});
			});
		},
		animalGenderStatusCode: function getAnimalGenderStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAnimalGenderStatusCode"
				});
			});
		},
		languages: function getLanguages(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display FROM BACIRO_FHIR.LANGUAGES " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getLanguages"
				});
			});
		},
		languagesCode: function getLanguagesCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display FROM BACIRO_FHIR.LANGUAGES WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getLanguagesCode"
				});
			});
		},
		linkType: function getLinkType(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LINK_TYPE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getLinkType"
				});
			});
		},
		linkTypeCode: function getLinkTypeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LINK_TYPE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getLinkTypeCode"
				});
			});
		},
		relatedPersonRelationshipType: function getRelatedPersonRelationshipType(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getRelatedPersonRelationshipType"
				});
			});
		},
		relatedPersonRelationshipTypeCode: function getRelatedPersonRelationshipTypeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getRelatedPersonRelationshipTypeCode"
				});
			});
		},
		groupType: function getGroupType(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GROUP_TYPE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getGroupType"
				});
			});
		},
		groupTypeCode: function getGroupTypeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GROUP_TYPE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getGroupTypeCode"
				});
			});
		},
		identifierUse: function getIdentifierUse(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTIFIER_USE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getIdentifierUse"
				});
			});
		},
		identifierUseCode: function getIdentifierUseCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTIFIER_USE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getIdentifierUseCode"
				});
			});
		},
		identifierType: function getIdentifierType(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display FROM BACIRO_FHIR.IDENTIFIER_TYPE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getIdentifierType"
				});
			});
		},
		identifierTypeCode: function getIdentifierTypeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display FROM BACIRO_FHIR.IDENTIFIER_TYPE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getIdentifierTypeCode"
				});
			});
		},
		nameUse: function getNameUse(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.NAME_USE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getNameUse"
				});
			});
		},
		nameUseCode: function getNameUseCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.NAME_USE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getNameUseCode"
				});
			});
		},
		contactPointSystem: function getContactPointSystem(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getContactPointSystem"
				});
			});
		},
		contactPointSystemCode: function getContactPointSystemCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getContactPointSystemCode"
				});
			});
		},
		contactPointUse: function getContactPointUse(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_USE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getContactPointUse"
				});
			});
		},
		contactPointUseCode: function getContactPointUseCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_USE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getContactPointUseCode"
				});
			});
		},
		addressUse: function getAddressUse(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_USE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAddressUse"
				});
			});
		},
		addressUseCode: function getAddressUseCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_USE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAddressUseCode"
				});
			});
		},
		addressType: function getAddressType(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_TYPE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAddressType"
				});
			});
		},
		addressTypeCode: function getAddressTypeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_TYPE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAddressTypeCode"
				});
			});
		},
		appointmentReasonCode: function getAppointmentReasonCode(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, description FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAppointmentReasonCode"
				});
			});
		},
		appointmentReasonCodeCode: function getAppointmentReasonCodeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, description FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAppointmentReasonCodeCode"
				});
			});
		},
		slotStatus: function getSlotStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SLOT_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSlotStatus"
				});
			});
		},
		slotStatusCode: function getSlotStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SLOT_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSlotStatusCode"
				});
			});
		},
		appointmentStatus: function getAppointmentStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPOINTMENT_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAppointmentStatus"
				});
			});
		},
		appointmentStatusCode: function getAppointmentStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPOINTMENT_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAppointmentStatusCode"
				});
			});
		},
		participantRequired: function getParticipantRequired(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_REQUIRED " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getParticipantRequired"
				});
			});
		},
		participantRequiredCode: function getParticipantRequiredCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_REQUIRED WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getParticipantRequiredCode"
				});
			});
		},
		participationStatus: function getparticipationStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPATION_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getparticipationStatus"
				});
			});
		},
		participationStatusCode: function getparticipationStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPATION_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getparticipationStatusCode"
				});
			});
		},
		actEncounterCode: function getActEncounterCode(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_ENCOUNTER_CODE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getActEncounterCode"
				});
			});
		},
		actEncounterCodeCode: function getActEncounterCodeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_ENCOUNTER_CODE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getActEncounterCodeCode"
				});
			});
		},
		actPriority: function getActPriority(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ACT_PRIORITY " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getActPriority"
				});
			});
		},
		actPriorityCode: function getActPriorityCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_PRIORITY WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getActPriorityCode"
				});
			});
		},
		accountStatus: function getAccountStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ACCOUNT_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAccountStatus"
				});
			});
		},
		accountStatusCode: function getAccountStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACCOUNT_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAccountStatusCode"
				});
			});
		},
		accountType: function getAccountType(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ACCOUNT_TYPE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAccountType"
				});
			});
		},
		accountTypeCode: function getAccountTypeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACCOUNT_TYPE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getAccountStatusCode"
				});
			});
		},
		diagnosisRole: function getDiagnosisRole(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.DIAGNOSIS_ROLE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getDiagnosisRole"
				});
			});
		},
		diagnosisRoleCode: function getDiagnosisRoleCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DIAGNOSIS_ROLE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getDiagnosisRoleCode"
				});
			});
		},
		encounterAdmitSource: function getEncounterAdmitSource(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ENCOUNTER_ADMIT_SOURCE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterAdmitSource"
				});
			});
		},
		encounterAdmitSourceCode: function getEncounterAdmitSourceCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_ADMIT_SOURCE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterAdmitSource"
				});
			});
		},
		encounterDiet: function getEncounterDiet(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ENCOUNTER_DIET " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterDiet"
				});
			});
		},
		encounterDietCode: function getEncounterDietCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_DIET WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterDietCode"
				});
			});
		},
		encounterDischargeDisposition: function getEncounterDischargeDisposition(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ENCOUNTER_DISCHARGE_DISPOSITION " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterDischargeDisposition"
				});
			});
		},
		encounterDischargeDispositionCode: function getEncounterDischargeDispositionCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_DISCHARGE_DISPOSITION WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterDischargeDispositionCode"
				});
			});
		},
		encounterLocationStatus: function getEncounterLocationStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ENCOUNTER_LOCATION_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterLocationStatus"
				});
			});
		},
		encounterLocationStatusCode: function getEncounterLocationStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_LOCATION_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterLocationStatusCode"
				});
			});
		},
		encounterParticipantType: function getEncounterParticipantType(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition, system FROM BACIRO_FHIR.ENCOUNTER_PARTICIPANT_TYPE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterParticipantType"
				});
			});
		},
		encounterParticipantTypeCode: function getEncounterParticipantTypeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition, system FROM BACIRO_FHIR.ENCOUNTER_PARTICIPANT_TYPE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterParticipantTypeCode"
				});
			});
		},
		encounterReason: function getEncounterReason(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display definition FROM BACIRO_FHIR.ENCOUNTER_REASON " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterReason"
				});
			});
		},
		encounterReasonCode: function getEncounterReasonCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_REASON WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterReasonCode"
				});
			});
		},
		encounterSpecialCourtesy: function getEncounterSpecialCourtesy(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_COURTESY " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterSpecialCourtesy"
				});
			});
		},
		encounterSpecialCourtesyCode: function getEncounterSpecialCourtesyCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_COURTESY WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterSpecialCourtesyCode"
				});
			});
		},
		encounterSpecialArrangements: function getEncounterSpecialArrangements(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_ARRANGEMENTS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getgetEncounterSpecialArrangements"
				});
			});
		},
		encounterSpecialArrangementsCode: function getEncounterSpecialArrangementsCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_ARRANGEMENTS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getgetEncounterSpecialArrangementsCode"
				});
			});
		},
		encounterStatus: function getEncounterStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterStatus"
				});
			});
		},
		encounterStatusCode: function getEncounterStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterStatusCode"
				});
			});
		},
		encounterType: function getEncounterType(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.ENCOUNTER_TYPE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterType"
				});
			});
		},
		encounterTypeCode: function getEncounterTypeCode(req, res) {
			code = req.params.code.replace("<or>", "/");

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_TYPE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEncounterTypeCode"
				});
			});
		},
		episodeOfCareStatus: function getEpisodeOfCareStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.EPISODE_OF_CARE_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEpisodeOfCareStatus"
				});
			});
		},
		episodeOfCareStatusCode: function getEpisodeOfCareStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.EPISODE_OF_CARE_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEpisodeOfCareStatusCode"
				});
			});
		},
		episodeOfCareType: function getEpisodeOfCareType(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.EPISODE_OF_CARE_TYPE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEpisodeOfCareType"
				});
			});
		},
		episodeOfCareTypeCode: function getEpisodeOfCareTypeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.EPISODE_OF_CARE_TYPE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEpisodeOfCareTypeCode"
				});
			});
		},
		flagStatus: function getFlagStatus(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.FLAG_STATUS " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getflagStatus"
				});
			});
		},
		flagStatusCode: function getFlagStatusCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FLAG_STATUS WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getflagStatusCode"
				});
			});
		},
		flagCategory: function getFlagCategory(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.FLAG_CATEGORY " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getFlagCategory"
				});
			});
		},
		flagCategoryCode: function getFlagCategoryCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FLAG_CATEGORY WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getFlagCategoryCode"
				});
			});
		},
		flagCode: function getFlagCode(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, definition FROM BACIRO_FHIR.FLAG_CODE " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getFlagCode"
				});
			});
		},
		flagCodeCode: function getFlagCodeCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FLAG_CODE WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getFlagCodeCode"
				});
			});
		},
		reAdmissionIndicator: function getReAdmissionIndicator(req, res) {
			_id = req.params._id;

			if (_id == 0) {
				condition = "";
			} else {
				condition = "WHERE id  = " + _id;
			}

			var query = "SELECT id , code, display, description FROM BACIRO_FHIR.RE_ADMISSION_INDICATOR " + condition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getReAdmissionIndicator"
				});
			});
		},
		reAdmissionIndicatorCode: function getReAdmissionIndicatorCode(req, res) {
			code = req.params.code;

			var query = "SELECT id, code, display, description FROM BACIRO_FHIR.RE_ADMISSION_INDICATOR WHERE code = '" + code + "' ";

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				res.json({
					"err_code": 0,
					"data": rez
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getReAdmissionIndicatorCode"
				});
			});
		},
		udiEntryType: function getUdiEntryType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.UDI_ENTRY_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getUdiEntryType"});
      });
    },
    udiEntryTypeCode: function getUdiEntryTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.UDI_ENTRY_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getUdiEntryTypeCode"});
      });
    },
    deviceStatus: function getDeviceStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceStatus"});
      });
    },
    deviceStatusCode: function getDeviceStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceStatusCode"});
      });
    },
    deviceKind: function getdeviceKind(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_KIND " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getdeviceKind"});
      });
    },
    deviceKindCode: function getdeviceKindCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_KIND WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getdeviceKindCode"});
      });
    },
    deviceSafety: function getDeviceSafety(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_SAFETY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceSafety"});
      });
    },
    deviceSafetyCode: function getDeviceSafetyCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_SAFETY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceSafetyCode"});
      });
    },
    operationalStatus: function getOperationalStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OPERATIONAL_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getOperationalStatus"});
      });
    },
    operationalStatusCode: function getOperationalStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OPERATIONAL_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getOperationalStatusCode"});
      });
    },
    parameterGroup: function getParameterGroup(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARAMETER_GROUP " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getParameterGroup"});
      });
    },
    parameterGroupCode: function getParameterGroupCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARAMETER_GROUP WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getParameterGroupCode"});
      });
    },
    measurementPrinciple: function getMeasurementPrinciple(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEASUREMENT_PRINCIPLE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMeasurementPrinciple"});
      });
    },
    measurementPrincipleCode: function getMeasurementPrincipleCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEASUREMENT_PRINCIPLE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMeasurementPrincipleCode"});
      });
    },
    specificationType: function getSpecificationType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIFICATION_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecificationType"});
      });
    },
    specificationTypeCode: function getSpecificationTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIFICATION_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecificationTypeCode"});
      });
    },
    metricOperationalStatus: function getMetricOperationalStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_OPERATIONAL_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMetricOperationalStatus"});
      });
    },
    metricOperationalStatusCode: function getMetricOperationalStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_OPERATIONAL_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMetricOperationalStatusCode"});
      });
    },
    deviceMetricType: function getDeviceMetricType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_METRIC_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceMetricType"});
      });
    },
    deviceMetricTypeCode: function getDeviceMetricTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_METRIC_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceMetricTypeCode"});
      });
    },
    metricColor: function getMetricColor(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_COLOR " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMetricColor"});
      });
    },
    metricColorCode: function getMetricColorCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_COLOR WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMetricColorCode"});
      });
    },
    metricCategory: function getMetricCategory(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMetricCategory"});
      });
    },
    metricCategoryCode: function getMetricCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMetricCategoryCode"});
      });
    },
    metricCalibrationType: function getMetricCalibrationType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CALIBRATION_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMetricCalibrationType"});
      });
    },
    metricCalibrationTypeCode: function getMetricCalibrationTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CALIBRATION_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMetricCalibrationTypeCode"});
      });
    },
    metricCalibrationState: function getMetricCalibrationState(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CALIBRATION_STATE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getmetricCalibrationState"});
      });
    },
    metricCalibrationStateCode: function getMetricCalibrationStateCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CALIBRATION_STATE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getmetricCalibrationStateCode"});
      });
    },
    substanceStatus: function getSubstanceStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceStatus"});
      });
    },
    substanceStatusCode: function getSubstanceStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceStatusCode"});
      });
    },
    substanceCategory: function getSubstanceCategory(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceCategory"});
      });
    },
    substanceCategoryCode: function getSubstanceCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceCategoryCode"});
      });
    },
    substanceCode: function getSubstanceCode(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceCode"});
      });
    },
    substanceCodeCode: function getSubstanceCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceCodeCode"});
      });
    },
		organizationType: function getOrganizationType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ORGANIZATION_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getOrganizationType"});
      });
    },
		organizationTypeCode: function getOrganizationTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ORGANIZATION_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getOrganizationTypeCode"});
      });
    },
		contactentityType: function getContactentityType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_ENTITY_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getContactentityType"});
      });
    },
		contactentityTypeCode: function getContactentityTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_ENTITY_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getContactentityTypeCode"});
      });
    },
		locationStatus	: function getLocationStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLocationStatus"});
      });
    },
		locationStatusCode: function getLocationStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLocationStatusCode"});
      });
    },
		bedStatus	: function getBedStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, description FROM BACIRO_FHIR.BED_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getBedStatus"});
      });
    },
		bedStatusCode: function getBedStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, description FROM BACIRO_FHIR.BED_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getBedStatusCode"});
      });
    },
		locationMode	: function getLocationMode(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_MODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLocationMode"});
      });
    },
		locationModeCode: function getLocationModeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_MODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLocationModeCode"});
      });
    },
		serviceDeliveryLocationRoleType	: function getServiceDeliveryLocationRoleType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_DELIVERY_LOCATION_ROLE_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceDeliveryLocationRoleType"});
      });
    },
		serviceDeliveryLocationRoleTypeCode: function getServiceDeliveryLocationRoleTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_DELIVERY_LOCATION_ROLE_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceDeliveryLocationRoleTypeCode"});
      });
    },
		locationPhysicalType	: function getLocationPhysicalType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_PHYSICAL_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLocationPhysicalType"});
      });
    },
		locationPhysicalTypeCode: function getLocationPhysicalTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_PHYSICAL_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLocationPhysicalTypeCode"});
      });
    },
		qualificationCode	: function getQualificationCode(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, description FROM BACIRO_FHIR.QUALIFICATION_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getQualificationCode"});
      });
    },
		qualificationCodeCode: function getQualificationCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, description FROM BACIRO_FHIR.QUALIFICATION_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getQualificationCodeCode"});
      });
    },
		practitionerRoleCode	: function getPractitionerRoleCode(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      /*var query = "SELECT practitioner_role_id, practitioner_role_active, practitioner_role_period_start, practitioner_role_period_end, practitioner_id, organization_id,practitioner_role_code, practitioner_role_speciality, practitioner_role_availability_exceptions FROM BACIRO_FHIR.PRACTITIONER_ROLE " + condition;*/
      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PRACTITIONER_ROLE_CODE " + condition;
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getPractitionerRoleCode"});
      });
    },
		practitionerRoleCodeCode: function getPractitionerRoleCodeCode(req, res){
      code = req.params.code;

      /*var query = "SELECT practitioner_role_id, practitioner_role_active, practitioner_role_period_start, practitioner_role_period_end, practitioner_id, organization_id,practitioner_role_code, practitioner_role_speciality, practitioner_role_availability_exceptions FROM BACIRO_FHIR.PRACTITIONER_ROLE WHERE code = '" + code + "' ";*/
			var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PRACTITIONER_ROLE_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getPractitionerRoleCodeCode"});
      });
    },
		practiceCode	: function getPracticeCode(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM BACIRO_FHIR.PRACTICE_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getPracticeCode"});
      });
    },
		practiceCodeCode: function getPracticeCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.PRACTICE_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getPracticeCodeCode"});
      });
    },
		daysOfWeek	: function getDaysOfWeek(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DAYS_OF_WEEK " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDaysOfWeek"});
      });
    },
		daysOfWeekCode: function getDaysOfWeekCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DAYS_OF_WEEK WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDaysOfWeekCode"});
      });
    },
		serviceCategory	: function getServiceCategory(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceCategory"});
      });
    },
		serviceCategoryCode: function getServiceCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceCategoryCode"});
      });
    },
		serviceType	: function getServiceType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceType"});
      });
    },
		serviceTypeCode: function getServiceTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceTypeCode"});
      });
    },
		serviceProvisionConditions	: function getServiceProvisionConditions(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_PROVISION_CONDITIONS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceProvisionConditions"});
      });
    },
		serviceProvisionConditionsCode: function getServiceProvisionConditionsCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_PROVISION_CONDITIONS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceProvisionConditionsCode"});
      });
    },
		serviceReferralMethod	: function getServiceReferralMethod(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_REFERRAL_METHOD " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceReferralMethod"});
      });
    },
		serviceReferralMethodCode: function getServiceReferralMethodCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_REFERRAL_METHOD WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getServiceReferralMethodCode"});
      });
    },
		endpointStatus	: function getEndpointStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENDPOINT_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getEndpointStatus"});
      });
    },
		endpointStatusCode: function getEndpointStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENDPOINT_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getEndpointStatusCode"});
      });
    },
		endpointConnectionType	: function getEndpointConnectionType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENDPOINT_CONNECTION_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getEndpointConnectionType"});
      });
    },
		endpointConnectionTypeCode: function getEndpointConnectionTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENDPOINT_CONNECTION_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getEndpointConnectionTypeCode"});
      });
    },
		endpointPayloadType	: function getEndpointPayloadType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM BACIRO_FHIR.ENDPOINT_PAYLOAD_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getEndpointPayloadType"});
      });
    },
		endpointPayloadTypeCode: function getEndpointPayloadTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.ENDPOINT_PAYLOAD_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getEndpointPayloadTypeCode"});
      });
    },
		availableTime: function getAvailableTime(req, res){
			var availableTime = req.query._id;
			var practitionerRoleId = req.query.practitioner_role_id;
			var healthcareServiceId = req.query.healthcare_service_id;
			
			var condition = "";
			var join = "";
			
			if(typeof availableTime !== 'undefined' && availableTime !== ""){
        condition += "available_time_id = '" + availableTime + "' AND ";  
      }
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "practitioner_role_id = '" + practitionerRoleId + "' AND ";  
      }
			
			if(typeof healthcareServiceId !== 'undefined' && healthcareServiceId !== ""){
        condition += "healthcare_service_id = '" + healthcareServiceId + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select available_time_id, available_time_day_of_week, available_time_all_day, available_time_start, available_time_end from baciro_fhir.AVAILABLE_TIME " + fixCondition;
			//
      
			var arrAvailableTime = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var AvailableTime = {};
					AvailableTime.id = rez[i].available_time_id;
          AvailableTime.daysOfWeek = rez[i].available_time_day_of_week;
					AvailableTime.allDay = rez[i].available_time_all_day;
					AvailableTime.availableTimeStart = rez[i].available_time_start;
					AvailableTime.availableTimeEnd = rez[i].available_time_end;
					
          arrAvailableTime[i] = AvailableTime;
        }
        res.json({"err_code":0,"data": arrAvailableTime});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAvailableTime"});
      });
    },
		notAvailable: function getNotAvailable(req, res){
			//console.log(req.query);
			var notAvailableId = req.query._id;
			var practitionerRoleId = req.query.practitioner_role_id;			      
      var healthcareServiceId = req.query.healthcare_service_id;
			var condition = "";
			var join = "";
			
			if(typeof notAvailableId !== 'undefined' && notAvailableId !== ""){
        condition += "not_available_id = '" + notAvailableId + "' AND ";  
      }
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "practitioner_role_id = '" + practitionerRoleId + "' AND ";  
      }
			
			if(typeof healthcareServiceId !== 'undefined' && healthcareServiceId !== ""){
        condition += "healthcare_service_id = '" + healthcareServiceId + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
			
			var query = "select not_available_id, not_available_description, not_available_during from baciro_fhir.NOT_AVAILABLE " + fixCondition;
			
      //
			var arrAvailableTime = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var AvailableTime = {};
					AvailableTime.id = rez[i].not_available_id;
          AvailableTime.description = rez[i].not_available_description;
					AvailableTime.during = rez[i].not_available_during;
					
          arrAvailableTime[i] = AvailableTime;
        }
        res.json({"err_code":0,"data": arrAvailableTime});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getNotAvailable"});
      });
    },
		adverseEventCategory	: function getAdverseEventCategory(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ADVERSE_EVENT_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCategory"});
      });
    },
		adverseEventCategoryCode: function getAdverseEventCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCategoryCode"});
      });
    },
		adverseEventType	: function getAdverseEventType(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ADVERSE_EVENT_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventType"});
      });
    },
		adverseEventTypeCode: function getAdverseEventTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventTypeCode"});
      });
    },
		adverseEventSeriousness	: function getAdverseEventSeriousness(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ADVERSE_EVENT_SERIOUSNESS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventSeriousness"});
      });
    },
		adverseEventSeriousnessCode: function getAdverseEventSeriousnessCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_SERIOUSNESS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventSeriousnessCode"});
      });
    },
		adverseEventOutcome	: function getAdverseEventOutcome(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ADVERSE_EVENT_Outcome " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventOutcome"});
      });
    },
		adverseEventOutcomeCode: function getAdverseEventOutcomeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Outcome WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventOutcomeCode"});
      });
    },
		adverseEventCausality	: function getAdverseEventCausality(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ADVERSE_EVENT_Causality " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCausality"});
      });
    },
		adverseEventCausalityCode: function getAdverseEventCausalityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCausalityCode"});
      });
    },
		adverseEventCausalityAssess	: function getAdverseEventCausalityAssess(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ADVERSE_EVENT_Causality_Assess " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCausalityAssess"});
      });
    },
		adverseEventCausalityAssessCode: function getAdverseEventCausalityAssessCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Assess WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCausalityAssessCode"});
      });
    },
		adverseEventCausalityMethod	: function getAdverseEventCausalityMethod(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ADVERSE_EVENT_Causality_Method " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCausalityMethod"});
      });
    },
		adverseEventCausalityMethodCode: function getAdverseEventCausalityMethodCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Method WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCausalityMethodCode"});
      });
    },
		adverseEventCausalityResult	: function getAdverseEventCausalityResult(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ADVERSE_EVENT_Causality_Result " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCausalityResult"});
      });
    },
		adverseEventCausalityResultCode: function getAdverseEventCausalityResultCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Result WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEventCausalityResultCode"});
      });
    },
		allergyClinicalStatus	: function getallergyClinicalStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ALLERGY_CLINICAL_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyClinicalStatus"});
      });
    },
		allergyClinicalStatusCode: function getallergyClinicalStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_CLINICAL_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyClinicalStatusCode"});
      });
    },
		allergyVerificationStatus	: function getallergyVerificationStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ALLERGY_VERIFICATION_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyVerificationStatus"});
      });
    },
		allergyVerificationStatusCode: function getallergyVerificationStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_VERIFICATION_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyVerificationStatusCode"});
      });
    },
		allergyIntoleranceType	: function getallergyIntoleranceType(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ALLERGY_INTOLERANCE_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyIntoleranceType"});
      });
    },
		allergyIntoleranceTypeCode: function getallergyIntoleranceTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyIntoleranceTypeCode"});
      });
    },
		allergyIntoleranceCategory	: function getallergyIntoleranceCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ALLERGY_INTOLERANCE_Category " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyIntoleranceCategory"});
      });
    },
		allergyIntoleranceCategoryCode: function getallergyIntoleranceCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Category WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyIntoleranceCategoryCode"});
      });
    },
		allergyIntoleranceCriticality	: function getallergyIntoleranceCriticality(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ALLERGY_INTOLERANCE_Criticality " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyIntoleranceCriticality"});
      });
    },
		allergyIntoleranceCriticalityCode: function getallergyIntoleranceCriticalityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Criticality WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyIntoleranceCriticalityCode"});
      });
    },
		allergyIntoleranceCode	: function getallergyIntoleranceCode(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ALLERGY_INTOLERANCE_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyIntoleranceCode"});
      });
    },
		allergyIntoleranceCodeCode: function getallergyIntoleranceCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getallergyIntoleranceCodeCode"});
      });
    },
		substanceCode	: function getSubstanceCode(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.SUBSTANCE_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceCode"});
      });
    },
		substanceCodeCode: function getSubstanceCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceCodeCode"});
      });
    },
		clinicalFindings	: function getClinicalFindings(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CLINICAL_FINDINGS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getClinicalFindings"});
      });
    },
		clinicalFindingsCode: function getClinicalFindingsCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CLINICAL_FINDINGS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getClinicalFindingsCode"});
      });
    },
		reactionEventSeverity	: function getReactionEventSeverity(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.REACTION_EVENT_SEVERITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReactionEventSeverity"});
      });
    },
		reactionEventSeverityCode: function getReactionEventSeverityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REACTION_EVENT_SEVERITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReactionEventSeverityCode"});
      });
    },
		routeCodes	: function getRouteCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ROUTE_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRouteCodes"});
      });
    },
		routeCodesCode: function getRouteCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ROUTE_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRouteCodesCode"});
      });
    },
		carePlanStatus	: function getCarePlanStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CARE_PLAN_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanStatus"});
      });
    },
		carePlanStatusCode: function getCarePlanStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanStatusCode"});
      });
    },
		carePlanIntent	: function getCarePlanIntent(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CARE_PLAN_INTENT " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanIntent"});
      });
    },
		carePlanIntentCode: function getCarePlanIntentCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_INTENT WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanIntentCode"});
      });
    },
		carePlanCategory	: function getCarePlanCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CARE_PLAN_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanCategory"});
      });
    },
		carePlanCategoryCode: function getCarePlanCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanCategoryCode"});
      });
    },
		carePlanActivityOutcome	: function getCarePlanActivityOutcome(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CARE_PLAN_ACTIVITY_OUTCOME " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanActivityOutcome"});
      });
    },
		carePlanActivityOutcomeCode: function getCarePlanActivityOutcomeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_OUTCOME WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanActivityOutcomeCode"});
      });
    },
		carePlanActivityCategory	: function getCarePlanActivityCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CARE_PLAN_ACTIVITY_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanActivityCategory"});
      });
    },
		carePlanActivityCategoryCode: function getCarePlanActivityCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanActivityCategoryCode"});
      });
    },
		carePlanActivity	: function getCarePlanActivity(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CARE_PLAN_ACTIVITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanActivity"});
      });
    },
		carePlanActivityCode: function getCarePlanActivityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanActivityCode"});
      });
    },
		activityReason	: function getActivityReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ACTIVITY_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getActivityReason"});
      });
    },
		activityReasonCode: function getActivityReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACTIVITY_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getActivityReasonCode"});
      });
    },
		carePlanActivityStatus	: function getCarePlanActivityStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CARE_PLAN_ACTIVITY_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanActivityStatus"});
      });
    },
		carePlanActivityStatusCode: function getCarePlanActivityStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlanActivityStatusCode"});
      });
    },
		medicationCodes	: function getMedicationCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationCodes"});
      });
    },
		medicationCodesCode: function getMedicationCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationCodesCode"});
      });
    },
		careTeamStatus	: function getCareTeamStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CARE_TEAM_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCareTeamStatus"});
      });
    },
		careTeamStatusCode: function getCareTeamStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_TEAM_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCareTeamStatusCode"});
      });
    },
		careTeamCategory	: function getCareTeamCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CARE_TEAM_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCareTeamCategory"});
      });
    },
		careTeamCategoryCode: function getCareTeamCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_TEAM_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCareTeamCategoryCode"});
      });
    },
		participantRole	: function getParticipantRole(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.PARTICIPANT_ROLE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getParticipantRole"});
      });
    },
		participantRoleCode: function getParticipantRoleCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_ROLE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getParticipantRoleCode"});
      });
    },
		clinicalImpressionStatus	: function getClinicalImpressionStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CLINICAL_IMPRESSION_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getClinicalImpressionStatus"});
      });
    },
		clinicalImpressionStatusCode: function getClinicalImpressionStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CLINICAL_IMPRESSION_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getClinicalImpressionStatusCode"});
      });
    },
		investigationSets	: function getInvestigationSets(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.INVESTIGATION_SETS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getInvestigationSets"});
      });
    },
		investigationSetsCode: function getInvestigationSetsCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.INVESTIGATION_SETS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getInvestigationSetsCode"});
      });
    },
		clinicalimpressionPrognosis	: function getClinicalimpressionPrognosis(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CLINICALIMPRESSION_PROGNOSIS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getClinicalimpressionPrognosis"});
      });
    },
		clinicalimpressionPrognosisCode: function getClinicalimpressionPrognosisCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CLINICALIMPRESSION_PROGNOSIS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getClinicalimpressionPrognosisCode"});
      });
    },
		conditionClinical	: function getConditionClinical(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CONDITION_CLINICAL " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionClinical"});
      });
    },
		conditionClinicalCode: function getConditionClinicalCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_CLINICAL WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionClinicalCode"});
      });
    },
		conditionVerStatus	: function getConditionVerStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CONDITION_VER_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionVerStatus"});
      });
    },
		conditionVerStatusCode: function getConditionVerStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_VER_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionVerStatusCode"});
      });
    },
		conditionCategory	: function getConditionCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CONDITION_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionCategory"});
      });
    },
		conditionCategoryCode: function getConditionCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionCategoryCode"});
      });
    },
		conditionSeverity	: function getConditionSeverity(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.CONDITION_SEVERITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionSeverity"});
      });
    },
		conditionSeverityCode: function getConditionSeverityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.CONDITION_SEVERITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionSeverityCode"});
      });
    },
		conditionCode	: function getConditionCode(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CONDITION_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionCode"});
      });
    },
		conditionCodeCode: function getConditionCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionCodeCode"});
      });
    },
		bodySite	: function getBodySite(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.BODY_SITE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getBodySite"});
      });
    },
		bodySiteCode: function getBodySiteCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.BODY_SITE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getBodySiteCode"});
      });
    },
		conditionStage	: function getConditionStage(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CONDITION_STAGE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionStage"});
      });
    },
		conditionStageCode: function getConditionStageCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_STAGE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionStageCode"});
      });
    },
		manifestationOrSymptom	: function getManifestationOrSymptom(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MANIFESTATION_OR_SYMPTOM " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getManifestationOrSymptom"});
      });
    },
		manifestationOrSymptomCode: function getManifestationOrSymptomCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MANIFESTATION_OR_SYMPTOM WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getManifestationOrSymptomCode"});
      });
    },
		observationStatus	: function getObservationStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.OBSERVATION_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationStatus"});
      });
    },
		observationStatusCode: function getObservationStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationStatusCode"});
      });
    },
		detectedissueCategory	: function getDetectedissueCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.DETECTEDISSUE_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDetectedissueCategory"});
      });
    },
		detectedissueCategoryCode: function getDetectedissueCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DETECTEDISSUE_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDetectedissueCategoryCode"});
      });
    },
		detectedissueSeverity	: function getDetectedissueSeverity(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.DETECTEDISSUE_SEVERITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDetectedissueSeverity"});
      });
    },
		detectedissueSeverityCode: function getDetectedissueSeverityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DETECTEDISSUE_SEVERITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDetectedissueSeverityCode"});
      });
    },
		detectedissueMitigationAction	: function getDetectedissueMitigationAction(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.DETECTEDISSUE_MITIGATION_ACTION " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDetectedissueMitigationAction"});
      });
    },
		detectedissueMitigationActionCode: function getDetectedissueMitigationActionCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DETECTEDISSUE_MITIGATION_ACTION WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDetectedissueMitigationActionCode"});
      });
    },
		historyStatus	: function getHistoryStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.HISTORY_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getHistoryStatus"});
      });
    },
		historyStatusCode: function getHistoryStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.HISTORY_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getHistoryStatusCode"});
      });
    },
		historyNotDoneReason	: function getHistoryNotDoneReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.HISTORY_NOT_DONE_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getHistoryNotDoneReason"});
      });
    },
		historyNotDoneReasonCode: function getHistoryNotDoneReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.HISTORY_NOT_DONE_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getHistoryNotDoneReasonCode"});
      });
    },
		familyMember	: function getHamilyMember(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.FAMILY_MEMBER " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getHamilyMember"});
      });
    },
		familyMemberCode: function getHamilyMemberCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FAMILY_MEMBER WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getHamilyMemberCode"});
      });
    },
		conditionOutcome	: function getConditionOutcome(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CONDITION_OUTCOME " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionOutcome"});
      });
    },
		conditionOutcomeCode: function getConditionOutcomeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_OUTCOME WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getConditionOutcomeCode"});
      });
    },
		riskProbability	: function getRiskProbability(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.RISK_PROBABILITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRiskProbability"});
      });
    },
		riskProbabilityCode: function getRiskProbabilityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.RISK_PROBABILITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRiskProbabilityCode"});
      });
    },
		goalStatus	: function getGoalStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.GOAL_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGoalStatus"});
      });
    },
		goalStatusCode: function getGoalStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GOAL_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGoalStatusCode"});
      });
    },
		goalCategory	: function getGoalCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.GOAL_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGoalCategory"});
      });
    },
		goalCategoryCode: function getGoalCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GOAL_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGoalCategoryCode"});
      });
    },
		goalPriority	: function getGoalPriority(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.GOAL_PRIORITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGoalPriority"});
      });
    },
		goalPriorityCode: function getGoalPriorityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GOAL_PRIORITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGoalPriorityCode"});
      });
    },
		goalStartEvent	: function getGoalStartEvent(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.GOAL_START_EVENT " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGoalStartEvent"});
      });
    },
		goalStartEventCode: function getGoalStartEventCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.GOAL_START_EVENT WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGoalStartEventCode"});
      });
    },
		observationCodes	: function getObservationCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.OBSERVATION_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationCodes"});
      });
    },
		observationCodesCode: function getObservationCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.OBSERVATION_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationCodesCode"});
      });
    },
		eventStatus	: function getEventStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.EVENT_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getEventStatus"});
      });
    },
		eventStatusCode: function getEventStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.EVENT_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getEventStatusCode"});
      });
    },
		procedureNotPerformedReason	: function getProcedureNotPerformedReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.PROCEDURE_NOT_PERFORMED_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureNotPerformedReason"});
      });
    },
		procedureNotPerformedReasonCode: function getProcedureNotPerformedReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PROCEDURE_NOT_PERFORMED_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureNotPerformedReasonCode"});
      });
    },
		procedureCategory	: function getProcedureCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.PROCEDURE_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureCategory"});
      });
    },
		procedureCategoryCode: function getProcedureCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.PROCEDURE_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureCategoryCode"});
      });
    },
		procedureCode	: function getProcedureCode(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.PROCEDURE_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureCode"});
      });
    },
		procedureCodeCode: function getProcedureCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PROCEDURE_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureCodeCode"});
      });
    },
		performerRole	: function getPerformerRole(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.PERFORMER_ROLE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getPerformerRole"});
      });
    },
		performerRoleCode: function getPerformerRoleCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PERFORMER_ROLE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getPerformerRoleCode"});
      });
    },
		procedureReason	: function getProcedureReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.PROCEDURE_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureReason"});
      });
    },
		procedureReasonCode: function getProcedureReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PROCEDURE_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureReasonCode"});
      });
    },
		procedureOutcome	: function getProcedureOutcome(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.PROCEDURE_OUTCOME " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureOutcome"});
      });
    },
		procedureOutcomeCode: function getProcedureOutcomeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.PROCEDURE_OUTCOME WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureOutcomeCode"});
      });
    },
		procedureFollowup	: function getProcedureFollowup(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.PROCEDURE_FOLLOWUP " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureFollowup"});
      });
    },
		procedureFollowupCode: function getProcedureFollowupCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.PROCEDURE_FOLLOWUP WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureFollowupCode"});
      });
    },
		deviceAction	: function getDeviceAction(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.DEVICE_ACTION " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceAction"});
      });
    },
		deviceActionCode: function getDeviceActionCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_ACTION WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceActionCode"});
      });
    },
		deviceKind	: function getDeviceKind(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.DEVICE_KIND " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceKind"});
      });
    },
		deviceKindCode: function getDeviceKindCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_KIND WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceKindCode"});
      });
    },
		
		immunizationStatus	: function getImmunizationStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.IMMUNIZATION_STATUS " + condition;
      console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationStatus"});
      });
    },
		immunizationStatusCode: function getImmunizationStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationStatusCode"});
      });
    },
		vaccineCode	: function getVaccineCode(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, system, display FROM baciro_fhir.VACCINE_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getVaccineCode"});
      });
    },
		vaccineCodeCode: function getVaccineCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, system, display FROM BACIRO_FHIR.VACCINE_CODE WHERE code = '" + code + "' ";
      console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getVaccineCodeCode"});
      });
    },
		immunizationOrigin	: function getImmunizationOrigin(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.IMMUNIZATION_ORIGIN " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationOrigin"});
      });
    },
		immunizationOriginCode: function getImmunizationOriginCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_ORIGIN WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationOriginCode"});
      });
    },
		immunizationSite	: function getImmunizationSite(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.IMMUNIZATION_SITE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationSite"});
      });
    },
		immunizationSiteCode: function getImmunizationSiteCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_SITE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationSiteCode"});
      });
    },
		immunizationRoute	: function getImmunizationRoute(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.IMMUNIZATION_ROUTE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRoute"});
      });
    },
		immunizationRouteCode: function getImmunizationRouteCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_ROUTE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRouteCode"});
      });
    },
		immunizationRole	: function getImmunizationRole(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.IMMUNIZATION_ROLE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRole"});
      });
    },
		immunizationRoleCode: function getImmunizationRoleCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.IMMUNIZATION_ROLE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRoleCode"});
      });
    },
		immunizationReason	: function getImmunizationReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.IMMUNIZATION_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationReason"});
      });
    },
		immunizationReasonCode: function getImmunizationReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.IMMUNIZATION_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationReasonCode"});
      });
    },
		noImmunizationReason	: function getNoImmunizationReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, SYSTEM, display, definition FROM baciro_fhir.NO_IMMUNIZATION_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getNoImmunizationReason"});
      });
    },
		noImmunizationReasonCode: function getNoImmunizationReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, SYSTEM, display, definition FROM BACIRO_FHIR.NO_IMMUNIZATION_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getNoImmunizationReasonCode"});
      });
    },
		vaccinationProtocolDoseTarget	: function getVaccinationProtocolDoseTarget(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.VACCINATION_PROTOCOL_DOSE_TARGET " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getVaccinationProtocolDoseTarget"});
      });
    },
		vaccinationProtocolDoseTargetCode: function getVaccinationProtocolDoseTargetCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_TARGET WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getVaccinationProtocolDoseTargetCode"});
      });
    },
		vaccinationProtocolDoseStatus	: function getVaccinationProtocolDoseStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.VACCINATION_PROTOCOL_DOSE_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getVaccinationProtocolDoseStatus"});
      });
    },
		vaccinationProtocolDoseStatusCode: function getVaccinationProtocolDoseStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getVaccinationProtocolDoseStatusCode"});
      });
    },
		vaccinationProtocolDoseStatusReason	: function getVaccinationProtocolDoseStatusReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.VACCINATION_PROTOCOL_DOSE_STATUS_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getVaccinationProtocolDoseStatusReason"});
      });
    },
		vaccinationProtocolDoseStatusReasonCode: function getVaccinationProtocolDoseStatusReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getVaccinationProtocolDoseStatusReasonCode"});
      });
    },
		immunizationRecommendationStatus	: function getImmunizationRecommendationStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.IMMUNIZATION_RECOMMENDATION_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRecommendationStatus"});
      });
    },
		immunizationRecommendationStatusCode: function getImmunizationRecommendationStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRecommendationStatusCode"});
      });
    },
		immunizationRecommendationDateCriterion	: function getImmunizationRecommendationDateCriterion(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.IMMUNIZATION_RECOMMENDATION_DATE_CRITERION " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRecommendationDateCriterion"});
      });
    },
		immunizationRecommendationDateCriterionCode: function getImmunizationRecommendationDateCriterionCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_DATE_CRITERION WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRecommendationDateCriterionCode"});
      });
    },
		immunizationRecommendationTargetDisease	: function getImmunizationRecommendationTargetDisease(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRecommendationTargetDisease"});
      });
    },
		immunizationRecommendationTargetDiseaseCode: function getImmunizationRecommendationTargetDiseaseCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRecommendationTargetDiseaseCode"});
      });
    },
		
		medicationStatus	: function getMedicationStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationStatus"});
      });
    },
		medicationStatusCode: function getMedicationStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationStatusCode"});
      });
    },
		medicationFormCodes	: function getMedicationFormCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_FORM_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationFormCodes"});
      });
    },
		medicationFormCodesCode: function getMedicationFormCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_FORM_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationFormCodesCode"});
      });
    },
		medicationPackageForm	: function getMedicationPackageForm(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_PACKAGE_FORM " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationPackageForm"});
      });
    },
		medicationPackageFormCode: function getMedicationPackageFormCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_PACKAGE_FORM WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationPackageFormCode"});
      });
    },
		
		medicationAdminStatus	: function getMedicationAdminStatus(req, res){
			console.log("tes");
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_ADMIN_STATUS " + condition;
      console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationAdminStatus"});
      });
    },
		medicationAdminStatusCode: function getMedicationAdminStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_ADMIN_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationAdminStatusCode"});
      });
    },
		medicationAdminCategory	: function getMedicationAdminCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_ADMIN_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationAdminCategory"});
      });
    },
		medicationAdminCategoryCode: function getMedicationAdminCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_ADMIN_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationAdminCategoryCode"});
      });
    },
		reasonMedicationNotGivenCodes	: function getReasonMedicationNotGivenCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.REASON_MEDICATION_NOT_GIVEN_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReasonMedicationNotGivenCodes"});
      });
    },
		reasonMedicationNotGivenCodesCode: function getReasonMedicationNotGivenCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REASON_MEDICATION_NOT_GIVEN_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReasonMedicationNotGivenCodesCode"});
      });
    },
		reasonMedicationGivenCodes	: function getReasonMedicationGivenCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.REASON_MEDICATION_GIVEN_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReasonMedicationGivenCodes"});
      });
    },
		reasonMedicationGivenCodesCode: function getReasonMedicationGivenCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REASON_MEDICATION_GIVEN_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReasonMedicationGivenCodesCode"});
      });
    },
		approachSiteCodes	: function getApproachSiteCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.APPROACH_SITE_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getApproachSiteCodes"});
      });
    },
		approachSiteCodesCode: function getApproachSiteCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPROACH_SITE_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getApproachSiteCodesCode"});
      });
    },
		administrationMethodCodes	: function getAdministrationMethodCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ADMINISTRATION_METHOD_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdministrationMethodCodes"});
      });
    },
		administrationMethodCodesCode: function getAdministrationMethodCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATION_METHOD_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdministrationMethodCodesCode"});
      });
    },
		
		medicationDispenseStatus	: function getMedicationDispenseStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_DISPENSE_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationDispenseStatus"});
      });
    },
		medicationDispenseStatusCode: function getMedicationDispenseStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_DISPENSE_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationDispenseStatusCode"});
      });
    },
		medicationDispenseCategory	: function getMedicationDispenseCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_DISPENSE_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationDispenseCategory"});
      });
    },
		medicationDispenseCategoryCode: function getMedicationDispenseCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_DISPENSE_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationDispenseCategoryCode"});
      });
    },
		actPharmacySupplyType	: function getActPharmacySupplyType(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ACT_PHARMACY_SUPPLY_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getActPharmacySupplyType"});
      });
    },
		actPharmacySupplyTypeCode: function getActPharmacySupplyTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_PHARMACY_SUPPLY_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getActPharmacySupplyTypeCode"});
      });
    },
		actSubstanceAdminSubstitutionCode	: function getActSubstanceAdminSubstitutionCode(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getActSubstanceAdminSubstitutionCode"});
      });
    },
		actSubstanceAdminSubstitutionCodeCode: function getActSubstanceAdminSubstitutionCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getActSubstanceAdminSubstitutionCodeCode"});
      });
    },
		actSubstanceAdminSubstitutionReason	: function getActSubstanceAdminSubstitutionReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getActSubstanceAdminSubstitutionReason"});
      });
    },
		actSubstanceAdminSubstitutionReasonCode: function getActSubstanceAdminSubstitutionReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getActSubstanceAdminSubstitutionReasonCode"});
      });
    },
		
		medicationRequestStatus	: function getMedicationRequestStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_REQUEST_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequestStatus"});
      });
    },
		medicationRequestStatusCode: function getMedicationRequestStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequestStatusCode"});
      });
    },
		medicationRequestIntent	: function getMedicationRequestIntent(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_REQUEST_INTENT " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequestIntent"});
      });
    },
		medicationRequestIntentCode: function getMedicationRequestIntentCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_INTENT WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequestIntentCode"});
      });
    },
		medicationRequestCategory	: function getMedicationRequestCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_REQUEST_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequestCategory"});
      });
    },
		medicationRequestCategoryCode: function getMedicationRequestCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequestCategoryCode"});
      });
    },
		medicationRequestPriority	: function getMedicationRequestPriority(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_REQUEST_PRIORITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequestPriority"});
      });
    },
		medicationRequestPriorityCode: function getMedicationRequestPriorityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_PRIORITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequestPriorityCode"});
      });
    },
		medicationCodes	: function getMedicationCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationCodes"});
      });
    },
		medicationCodesCode: function getMedicationCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationCodesCode"});
      });
    },
		substanceAdminSubstitutionReason	: function getSubstanceAdminSubstitutionReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.SUBSTANCE_ADMIN_SUBSTITUTION_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceAdminSubstitutionReason"});
      });
    },
		substanceAdminSubstitutionReasonCode: function getSubstanceAdminSubstitutionReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_ADMIN_SUBSTITUTION_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceAdminSubstitutionReasonCode"});
      });
    },
		
		medicationStatementStatus	: function getMedicationStatementStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }
			
      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_STATEMENT_STATUS " + condition;
			console.log(query);
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationStatementStatus"});
      });
    },
		medicationStatementStatusCode: function getMedicationStatementStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATEMENT_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationStatementStatusCode"});
      });
    },
		medicationStatementCategory	: function getMedicationStatementCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_STATEMENT_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationStatementCategory"});
      });
    },
		medicationStatementCategoryCode: function getMedicationStatementCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATEMENT_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationStatementCategoryCode"});
      });
    },
		medicationStatementTaken	: function getMedicationStatementTaken(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_STATEMENT_TAKEN " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationStatementTaken"});
      });
    },
		medicationStatementTakenCode: function getMedicationStatementTakenCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATEMENT_TAKEN WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationStatementTakenCode"});
      });
    },
		reasonMedicationNotTakenCodes	: function getReasonMedicationNotTakenCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.REASON_MEDICATION_NOT_TAKEN_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReasonMedicationNotTakenCodes"});
      });
    },
		reasonMedicationNotTakenCodesCode: function getReasonMedicationNotTakenCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REASON_MEDICATION_NOT_TAKEN_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReasonMedicationNotTakenCodesCode"});
      });
    },
		
		observationCategory	: function getObservationCategory(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.OBSERVATION_CATEGORY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationCategory"});
      });
    },
		observationCategoryCode: function getObservationCategoryCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_CATEGORY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationCategoryCode"});
      });
    },
		observationValueabsentreason	: function getObservationValueabsentreason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.OBSERVATION_VALUEABSENTREASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationValueabsentreason"});
      });
    },
		observationValueabsentreasonCode: function getObservationValueabsentreasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_VALUEABSENTREASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationValueabsentreasonCode"});
      });
    },
		observationInterpretation	: function getObservationInterpretation(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.OBSERVATION_INTERPRETATION " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationInterpretation"});
      });
    },
		observationInterpretationCode: function getObservationInterpretationCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_INTERPRETATION WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationInterpretationCode"});
      });
    },
		observationMethods	: function getObservationMethods(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.OBSERVATION_METHODS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationMethods"});
      });
    },
		observationMethodsCode: function getObservationMethodsCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_METHODS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationMethodsCode"});
      });
    },
		referencerangeMeaning	: function getReferencerangeMeaning(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.REFERENCERANGE_MEANING " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReferencerangeMeaning"});
      });
    },
		referencerangeMeaningCode: function getReferencerangeMeaningCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REFERENCERANGE_MEANING WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReferencerangeMeaningCode"});
      });
    },
		referencerangeAppliesto	: function getReferencerangeAppliesto(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, system, display, definition FROM baciro_fhir.REFERENCERANGE_APPLIESTO " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReferencerangeAppliesto"});
      });
    },
		referencerangeAppliestoCode: function getReferencerangeAppliestoCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.REFERENCERANGE_APPLIESTO WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReferencerangeAppliestoCode"});
      });
    },
		observationRelationshiptypes	: function getObservationRelationshiptypes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.OBSERVATION_RELATIONSHIPTYPES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationRelationshiptypes"});
      });
    },
		observationRelationshiptypesCode: function getObservationRelationshiptypesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_RELATIONSHIPTYPES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getObservationRelationshiptypesCode"});
      });
    },
		
		diagnosticReportStatus	: function getDiagnosticReportStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.DIAGNOSTIC_REPORT_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDiagnosticReportStatus"});
      });
    },
		diagnosticReportStatusCode: function getDiagnosticReportStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DIAGNOSTIC_REPORT_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDiagnosticReportStatusCode"});
      });
    },
		diagnosticServiceSections	: function getDiagnosticServiceSections(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.DIAGNOSTIC_SERVICE_SECTIONS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDiagnosticServiceSections"});
      });
    },
		diagnosticServiceSectionsCode: function getDiagnosticServiceSectionsCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DIAGNOSTIC_SERVICE_SECTIONS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDiagnosticServiceSectionsCode"});
      });
    },
		reportCodes	: function getReportCodes(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.REPORT_CODES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReportCodes"});
      });
    },
		reportCodesCode: function getReportCodesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.REPORT_CODES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getReportCodesCode"});
      });
    },
		
		requestStatus	: function getRequestStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.REQUEST_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRequestStatus"});
      });
    },
		requestStatusCode: function getRequestStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REQUEST_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRequestStatusCode"});
      });
    },
		requestIntent	: function getRequestIntent(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.REQUEST_INTENT " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRequestIntent"});
      });
    },
		requestIntentCode: function getRequestIntentCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REQUEST_INTENT WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRequestIntentCode"});
      });
    },
		requestPriority	: function getRequestPriority(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.REQUEST_PRIORITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRequestPriority"});
      });
    },
		requestPriorityCode: function getRequestPriorityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REQUEST_PRIORITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRequestPriorityCode"});
      });
    },
		medicationAsNeededReason	: function getMedicationAsNeededReason(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.MEDICATION_AS_NEEDED_REASON " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationAsNeededReason"});
      });
    },
		medicationAsNeededReasonCode: function getMedicationAsNeededReasonCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_AS_NEEDED_REASON WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationAsNeededReasonCode"});
      });
    },
		
		
		instanceAvailability	: function getInstanceAvailability(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.INSTANCE_AVAILABILITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getInstanceAvailability"});
      });
    },
		instanceAvailabilityCode: function getInstanceAvailabilityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.INSTANCE_AVAILABILITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getInstanceAvailabilityCode"});
      });
    },
		dicomCid29	: function getDicomCid29(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.DICOM_CID29 " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDicomCid29"});
      });
    },
		dicomCid29Code: function getDicomCid29Code(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DICOM_CID29 WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDicomCid29Code"});
      });
    },
		bodysiteLaterality	: function getBodysiteLaterality(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.BODYSITE_LATERALITY " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getBodysiteLaterality"});
      });
    },
		bodysiteLateralityCode: function getBodysiteLateralityCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.BODYSITE_LATERALITY WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getBodysiteLateralityCode"});
      });
    },
		
		sequenceType	: function getSequenceType(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.SEQUENCE_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSequenceType"});
      });
    },
		sequenceTypeCode: function getSequenceTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SEQUENCE_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSequenceTypeCode"});
      });
    },
		sequenceReferenceSeq	: function getSequenceReferenceSeq(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.SEQUENCE_REFERENCESEQ " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSequenceReferenceSeq"});
      });
    },
		sequenceReferenceSeqCode: function getSequenceReferenceSeqCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SEQUENCE_REFERENCESEQ WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSequenceReferenceSeqCode"});
      });
    },
		qualityType	: function getQualityType(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.QUALITY_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getQualityType"});
      });
    },
		qualityTypeCode: function getQualityTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.QUALITY_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getQualityTypeCode"});
      });
    },
		repositoryType	: function getRepositoryType(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.REPOSITORY_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRepositoryType"});
      });
    },
		repositoryTypeCode: function getRepositoryTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REPOSITORY_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRepositoryTypeCode"});
      });
    },
		chromosomeHuman	: function getChromosomeHuman(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.CHROMOSOME_HUMAN " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getChromosomeHuman"});
      });
    },
		chromosomeHumanCode: function getChromosomeHumanCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CHROMOSOME_HUMAN WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getChromosomeHumanCode"});
      });
    },
		
		specimenStatus	: function getSpecimenStatus(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.SPECIMEN_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenStatus"});
      });
    },
		specimenStatusCode: function getSpecimenStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIMEN_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenStatusCode"});
      });
    },
		specimenProcessingProcedure	: function getSpecimenProcessingProcedure(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.SPECIMEN_PROCESSING_PROCEDURE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenProcessingProcedure"});
      });
    },
		specimenProcessingProcedureCode: function getSpecimenProcessingProcedureCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIMEN_PROCESSING_PROCEDURE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenProcessingProcedureCode"});
      });
    },
		specimenContainerType	: function getSpecimenContainerType(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM baciro_fhir.SPECIMEN_CONTAINER_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenContainerType"});
      });
    },
		specimenContainerTypeCode: function getSpecimenContainerTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIMEN_CONTAINER_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenContainerTypeCode"});
      });
    },
		specimenCollectionMethod	: function getSpecimenCollectionMethod(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.SPECIMEN_COLLECTION_METHOD " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenCollectionMethod"});
      });
    },
		specimenCollectionMethodCode: function getSpecimenCollectionMethodCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.SPECIMEN_COLLECTION_METHOD WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenCollectionMethodCode"});
      });
    },
		bodysiteRelativeLocation	: function getBodysiteRelativeLocation(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM baciro_fhir.BODYSITE_RELATIVE_LOCATION " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getBodysiteRelativeLocation"});
      });
    },
		bodysiteRelativeLocationCode: function getBodysiteRelativeLocationCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.BODYSITE_RELATIVE_LOCATION WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getBodysiteRelativeLocationCode"});
      });
    },
		specimenType	: function getSpecimenType(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, description FROM baciro_fhir.SPECIMEN_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenType"});
      });
    },
		specimenTypeCode: function getSpecimenTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, description FROM BACIRO_FHIR.SPECIMEN_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimenTypeCode"});
      });
    },
		preservative	: function getPreservative(req, res){
			_id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, description FROM baciro_fhir.PRESERVATIVE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getPreservative"});
      });
    },
		preservativeCode: function getPreservativeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, description FROM BACIRO_FHIR.PRESERVATIVE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getPreservativeCode"});
      });
    },
		
	},
	post: {
		identityAssuranceLevel: function addIdentityAssuranceLevel(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL_AUTO_ID,'" + code + "','" + display + "', '" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL WHERE code = '" + code + "' ";
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
						"function": "addIdentityAssuranceLevel"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addIdentityAssuranceLevel"
				});
			});
		},
		administrativeGender: function addAdministrativeGender(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ADMINISTRATIVE_GENDER(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ADMINISTRATIVE_GENDER_AUTO_ID,'" + code + "','" + display + "', '" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER WHERE code = '" + code + "' ";
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
						"function": "addAdministrativeGender"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAdministrativeGender"
				});
			});
		},
		maritalStatus: function addMaritalStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;
			var system = req.body.system;

			var query = "UPSERT INTO BACIRO_FHIR.MARITAL_STATUS(id, code, display, definition, system)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.MARITAL_STATUS_AUTO_ID,'" + code + "','" + display + "', '" + definition + "', '" + system + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition, system FROM BACIRO_FHIR.MARITAL_STATUS WHERE code = '" + code + "' ";
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
						"function": "addMaritalStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addMaritalStatus"
				});
			});
		},
		contactRole: function addContactRole(req, res) {
			var code = req.body.code;
			var description = req.body.description;

			var query = "UPSERT INTO BACIRO_FHIR.CONTACT_ROLE(id, code, description)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.CONTACT_ROLE_AUTO_ID,'" + code + "','" + description + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, description FROM BACIRO_FHIR.CONTACT_ROLE WHERE code = '" + code + "' ";
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
						"function": "addContactRole"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addContactRole"
				});
			});
		},
		animalSpecies: function addAnimalSpecies(req, res) {
			var code = req.body.code;
			var display = req.body.display;

			var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_SPECIES(id, code, display)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ANIMAL_SPECIES_AUTO_ID,'" + code + "','" + display + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_SPECIES WHERE code = '" + code + "' ";
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
						"function": "addAnimalSpecies"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAnimalSpecies"
				});
			});
		},
		animalBreeds: function addAnimalBreeds(req, res) {
			var code = req.body.code;
			var display = req.body.display;

			var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_BREEDS(id, code, display)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ANIMAL_BREEDS_AUTO_ID,'" + code + "','" + display + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_BREEDS WHERE code = '" + code + "' ";
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
						"function": "addAnimalBreeds"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAnimalBreeds"
				});
			});
		},
		animalGenderStatus: function addAnimalGenderStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_GENDER_STATUS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ANIMAL_GENDER_STATUS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS WHERE code = '" + code + "' ";
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
						"function": "addAnimalGenderStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAnimalGenderStatus"
				});
			});
		},
		languages: function addLanguages(req, res) {
			var code = req.body.code;
			var display = req.body.display;

			var query = "UPSERT INTO BACIRO_FHIR.LANGUAGES(id, code, display)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.LANGUAGES_AUTO_ID,'" + code + "','" + display + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display FROM BACIRO_FHIR.LANGUAGES WHERE code = '" + code + "' ";
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
						"function": "addLanguages"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addLanguages"
				});
			});
		},
		linkType: function addLinkType(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.LINK_TYPE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.LINK_TYPE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LINK_TYPE WHERE code = '" + code + "' ";
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
						"function": "addLinkType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addLinkType"
				});
			});
		},
		relatedPersonRelationshipType: function addRelatedPersonRelationshipType(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var system = req.body.system;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE(id, code, system, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE_AUTO_ID,'" + code + "','" + system + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE WHERE code = '" + code + "' ";
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
						"function": "addRelatedPersonRelationshipType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addRelatedPersonRelationshipType"
				});
			});
		},
		groupType: function addGroupType(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.GROUP_TYPE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.GROUP_TYPE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GROUP_TYPE WHERE code = '" + code + "' ";
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
						"function": "addGroupType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addGroupType"
				});
			});
		},
		identifierUse: function addIdentifierUse(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER_USE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.IDENTIFIER_USE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTIFIER_USE WHERE code = '" + code + "' ";
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
						"function": "addIdentifierUse"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addIdentifierUse"
				});
			});
		},
		identifierType: function addIdentifierType(req, res) {
			var code = req.body.code;
			var display = req.body.display;

			var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER_TYPE(id, code, display)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.IDENTIFIER_TYPE_AUTO_ID,'" + code + "','" + display + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display FROM BACIRO_FHIR.IDENTIFIER_TYPE WHERE code = '" + code + "' ";
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
						"function": "addIdentifierType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addIdentifierType"
				});
			});
		},
		nameUse: function addNameUse(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.NAME_USE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.NAME_USE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.NAME_USE WHERE code = '" + code + "' ";
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
						"function": "addNameUse"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addNameUse"
				});
			});
		},
		contactPointSystem: function addContactPointSystem(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT_SYSTEM(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.CONTACT_POINT_SYSTEM_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM WHERE code = '" + code + "' ";
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
						"function": "addContactPointSystem"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addContactPointSystem"
				});
			});
		},
		contactPointUse: function addContactPointUse(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT_USE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.CONTACT_POINT_USE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_USE WHERE code = '" + code + "' ";
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
						"function": "addContactPointUse"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addContactPointUse"
				});
			});
		},
		addressUse: function addAddressUse(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ADDRESS_USE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ADDRESS_USE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_USE WHERE code = '" + code + "' ";
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
						"function": "addAddressUse"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAddressUse"
				});
			});
		},
		addressType: function addAddressType(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ADDRESS_TYPE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ADDRESS_TYPE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_TYPE WHERE code = '" + code + "' ";
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
						"function": "addAddressType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAddressType"
				});
			});
		},
		attachment: function addAttachment(req, res) {
			var attachment_id = req.body.id;
			var attachment_content_type = req.body.content_type;
			var attachment_language = req.body.language;
			var attachment_data = req.body.data;
			var attachment_url = req.body.url;
			var attachment_size = req.body.size;
			var attachment_hash = req.body.hash;
			var attachment_title = req.body.title;
			var attachment_creation = req.body.creation;
			var patient_id = req.body.patient_id;
			var related_person_id = req.body.related_person_id;
			var practitioner_id = req.body.practitioner_id;

			//susun query update
			var column = "";
			var values = "";

			if (typeof attachment_content_type !== 'undefined') {
				column += 'attachment_content_type,';
				values += "'" + attachment_content_type + "',";
			}

			if (typeof attachment_language !== 'undefined') {
				column += 'attachment_language,';
				values += "'" + attachment_language + "',";
			}

			if (typeof attachment_data !== 'undefined') {
				column += 'attachment_data,';
				values += "'" + attachment_data + "',";
			}

			if (typeof attachment_url !== 'undefined') {
				column += 'attachment_url,';
				values += "'" + attachment_url + "',";
			}

			if (typeof attachment_size !== 'undefined') {
				column += 'attachment_size,';
				values += attachment_size + ",";
			}

			if (typeof attachment_hash !== 'undefined') {
				column += 'attachment_hash,';
				values += "'" + attachment_hash + "',";
			}

			if (typeof attachment_title !== 'undefined') {
				column += 'attachment_title,';
				values += "'" + attachment_title + "',";
			}

			if (typeof attachment_creation !== 'undefined') {
				column += 'attachment_creation,';
				values += "to_date('" + attachment_creation + "'),";
			}

			if (typeof patient_id !== 'undefined') {
				column += 'patient_id,';
				values += "'" + patient_id + "',";
			}

			if (typeof related_person_id !== 'undefined') {
				column += 'related_person_id,';
				values += "'" + related_person_id + "',";
			}

			if(typeof practitioner_id !== 'undefined'){
        column += 'practitioner_id,';
        values += "'"+ practitioner_id + "',";
      }

			var query = "UPSERT INTO BACIRO_FHIR.ATTACHMENT(attachment_id, " + column.slice(0, -1) + ")" +
				" VALUES ('" + attachment_id + "', " + values.slice(0, -1) + ")";

			db.upsert(query, function (succes) {
				var arrAttachment = [];
				var query = "SELECT attachment_id, attachment_url, attachment_content_type, attachment_language, attachment_data, attachment_size, attachment_hash, attachment_title, attachment_creation FROM BACIRO_FHIR.ATTACHMENT WHERE attachment_id = '" + attachment_id + "' ";
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var Attachment = {};
						Attachment.id = rez[i].attachment_id;
						Attachment.url = rez[i].attachment_url;
						Attachment.contentType = rez[i].attachment_content_type;
						Attachment.language = rez[i].attachment_language;
						Attachment.data = rez[i].attachment_data;
						Attachment.size = rez[i].attachment_size;
						Attachment.hash = rez[i].attachment_hash;
						Attachment.title = rez[i].attachment_title;
						Attachment.creation = rez[i].attachment_creation;

						arrAttachment[i] = Attachment;
					}
					res.json({
						"err_code": 0,
						"data": arrAttachment
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addAttachment"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAttachment"
				});
			});
		},
		identifier: function addIdentifier(req, res) {
			var identifier_id = req.body.id;
			var identifier_use = req.body.use;
			var identifier_type = req.body.type;
			var identifier_system = req.body.system;
			var identifier_value = req.body.value;
			var identifier_period_start = req.body.period_start;
			var identifier_period_end = req.body.period_end;
			var person_id = req.body.person_id;
			var patient_id = req.body.patient_id;
			var related_person_id = req.body.related_person_id;
			var organization_id = req.body.organization_id;
			var endpoint_id = req.body.endpoint_id;
			var location_id = req.body.location_id;
			var practitionerId = req.body.practitioner_id;
			var qualificationId = req.body.qualification_id;
			var practitionerRoleId = req.body.practitioner_role_id;
			var healthcareServiceId = req.body.healthcare_service_id;
			var immunization_id = req.body.immunization_id;

			//susun query
			var column = "";
			var values = "";

			if (typeof identifier_use !== 'undefined') {
				column += 'identifier_use,';
				values += "'" + identifier_use + "',";
			}

			if (typeof identifier_type !== 'undefined') {
				column += 'identifier_type,';
				values += "'" + identifier_type + "',";
			}

			if (typeof identifier_system !== 'undefined') {
				column += 'identifier_system,';
				values += "'" + identifier_system + "',";
			}

			if (typeof identifier_value !== 'undefined') {
				column += 'identifier_value,';
				values += "'" + identifier_value + "',";
			}

			if (typeof identifier_period_start !== 'undefined') {
				column += 'identifier_period_start,';
				values += "to_date('" + identifier_period_start + "', 'yyyy-MM-dd'),";
			}

			if (typeof identifier_period_end !== 'undefined') {
				column += 'identifier_period_end,';
				values += "to_date('" + identifier_period_end + "', 'yyyy-MM-dd'),";
			}

			if (typeof person_id !== 'undefined') {
				column += 'person_id,';
				values += "'" + person_id + "',";
			}

			if (typeof patient_id !== 'undefined') {
				column += 'patient_id,';
				values += "'" + patient_id + "',";
			}

			if (typeof related_person_id !== 'undefined') {
				column += 'related_person_id,';
				values += "'" + related_person_id + "',";
			}

			if(typeof organization_id !== 'undefined'){
        column += 'organization_id,';
        values += "'"+ organization_id + "',";
      }
			
			if(typeof endpoint_id !== 'undefined'){
        column += 'endpoint_id,';
        values += "'"+ endpoint_id + "',";
      }
			
			if(typeof location_id !== 'undefined'){
        column += 'location_id,';
        values += "'"+ location_id + "',";
      }
			
			if(typeof practitionerId !== 'undefined'){
        column += 'practitioner_id,';
        values += "'"+ practitionerId + "',";
      }
			
			if(typeof qualificationId !== 'undefined' ){
        column += 'qualification_id,';
        values += "'"+ qualificationId + "',";
      }
			
			if(typeof practitionerRoleId !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'"+ practitionerRoleId + "',";
      }
			
			if(typeof healthcareServiceId !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'"+ healthcareServiceId + "',";
      }
			
			if(typeof immunization_id !== 'undefined'){
        column += 'immunization_id,';
        values += "'"+ immunization_id + "',";
      }

			var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER(identifier_id, " + column.slice(0, -1) + ")" +
				" VALUES ('" + identifier_id + "', " + values.slice(0, -1) + ")";
			db.upsert(query, function (succes) {
				var arrIdentifier = [];
				var query = "SELECT identifier_id, identifier_use, identifier_type, identifier_system, identifier_value, identifier_period_start, identifier_period_end FROM BACIRO_FHIR.IDENTIFIER WHERE identifier_id = '" + identifier_id + "' ";
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var Identifier = {};
						Identifier.id = rez[i].identifier_id;
						Identifier.use = rez[i].identifier_use;
						Identifier.type = rez[i].identifier_type;
						Identifier.system = rez[i].identifier_system;
						Identifier.value = rez[i].identifier_value;
						Identifier.period = formatDate(rez[i].identifier_period_start) + ' to ' + formatDate(rez[i].identifier_period_end);

						arrIdentifier[i] = Identifier;
					}
					res.json({
						"err_code": 0,
						"data": arrIdentifier
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addIdentifier"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addIdentifier"
				});
			});
		},
		humanName: function addHumanName(req, res) {
			var human_name_id = req.body.id;
			var human_name_use = req.body.use;
			var human_name_text = req.body.text;
			var human_name_family = req.body.family;
			var human_name_given = req.body.given;
			var human_name_prefix = req.body.prefix;
			var human_name_suffix = req.body.suffix;
			var person_id = req.body.person_id;
			var patient_id = req.body.patient_id;
			var related_person_id = req.body.related_person_id;
			var practitioner_id = req.body.practitioner_id;

			//susun query
			var column = "";
			var values = "";

			if (typeof human_name_use !== 'undefined') {
				column += 'human_name_use,';
				values += "'" + human_name_use + "',";
			}

			if (typeof human_name_text !== 'undefined') {
				column += 'human_name_text,';
				values += "'" + human_name_text + "',";
			}

			if (typeof human_name_family !== 'undefined') {
				column += 'human_name_family,';
				values += "'" + human_name_family + "',";
			}

			if (typeof human_name_given !== 'undefined') {
				column += 'human_name_given,';
				values += "'" + human_name_given + "',";
			}

			if (typeof human_name_prefix !== 'undefined') {
				column += 'human_name_prefix,';
				values += "'" + human_name_prefix + "',";
			}

			if (typeof human_name_suffix !== 'undefined') {
				column += 'human_name_suffix,';
				values += "'" + human_name_suffix + "',";
			}

			if (typeof req.body.period_start !== 'undefined') {
				if (req.body.period_start == "") {
					human_name_period_start = null;
				} else {
					human_name_period_start = "to_date('" + req.body.period_start + "', 'yyyy-MM-dd')";
				}

				column += 'human_name_period_start,';
				values += human_name_period_start + ",";
			}

			if (typeof req.body.period_end !== 'undefined') {
				if (req.body.period_end == "") {
					human_name_period_end = null;
				} else {
					human_name_period_end = "to_date('" + req.body.period_end + "', 'yyyy-MM-dd')";
				}

				column += 'human_name_period_end,';
				values += human_name_period_end + ",";
			}

			if (typeof person_id !== 'undefined') {
				column += 'person_id,';
				values += "'" + person_id + "',";
			}

			if (typeof patient_id !== 'undefined') {
				column += 'patient_id,';
				values += "'" + patient_id + "',";
			}

			if (typeof related_person_id !== 'undefined') {
				column += 'related_person_id,';
				values += "'" + related_person_id + "',";
			}

			if(typeof practitioner_id !== 'undefined'){
        column += 'practitioner_id,';
        values += "'"+ practitioner_id + "',";
      }

			var query = "UPSERT INTO BACIRO_FHIR.HUMAN_NAME(human_name_id, " + column.slice(0, -1) + ")" +
				" VALUES ('" + human_name_id + "', " + values.slice(0, -1) + ")";

			db.upsert(query, function (succes) {
				var arrHumanName = [];
				var query = "SELECT human_name_id, human_name_use, human_name_text, human_name_family, human_name_given, human_name_prefix, human_name_suffix, human_name_period_start, human_name_period_end FROM BACIRO_FHIR.HUMAN_NAME WHERE human_name_id = '" + human_name_id + "'";
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var HumanName = {};
						HumanName.id = rez[i].human_name_id;
						HumanName.use = rez[i].human_name_use;
						HumanName.text = rez[i].human_name_text;
						HumanName.family = rez[i].human_name_family;
						HumanName.given = rez[i].human_name_given;
						HumanName.prefix = rez[i].human_name_prefix;
						HumanName.prefix = rez[i].human_name_suffix;
						if (rez[i].human_name_period_start == null) {
							HumanName.period = formatDate(rez[i].human_name_period_start) + ' to ' + formatDate(rez[i].human_name_period_end);
						} else {
							HumanName.period = "";
						}
						arrHumanName[i] = HumanName;
					}
					res.json({
						"err_code": 0,
						"data": arrHumanName
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addHumanName"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addHumanName"
				});
			});
		},
		contactPoint: function addContactPoint(req, res) {
			var contact_point_id = req.body.id;
			var contact_point_system = req.body.system;
			var contact_point_value = req.body.value;
			var contact_point_use = req.body.use;
			var contact_point_rank = req.body.rank;
			var person_id = req.body.person_id;
			var patient_id = req.body.patient_id;
			var patient_contact_id = req.body.patient_contact_id;
			var related_person_id = req.body.related_person_id;
			var device_id = req.body.device_id;
			var organization_id = req.body.organization_id;
			var organization_contact_id = req.body.organization_contact_id;
			var endpoint_id = req.body.endpoint_id;
			var location_id = req.body.location_id;
			var practitioner_id = req.body.practitioner_id;
			var practitioner_role_id = req.body.practitioner_role_id;
			var healthcareServiceId = req.body.healthcare_service_id;

			//susun query
			var column = "";
			var values = "";

			if (typeof contact_point_system !== 'undefined') {
				column += 'contact_point_system,';
				values += "'" + contact_point_system + "',";
			}

			if (typeof contact_point_value !== 'undefined') {
				column += 'contact_point_value,';
				values += "'" + contact_point_value + "',";
			}

			if (typeof contact_point_use !== 'undefined') {
				column += 'contact_point_use,';
				values += "'" + contact_point_use + "',";
			}

			if (typeof contact_point_rank !== 'undefined') {
				column += 'contact_point_rank,';
				values += contact_point_rank + ",";
			}

			if (typeof req.body.period_start !== 'undefined') {
				if (req.body.period_start == "") {
					contact_point_period_start = null;
				} else {
					contact_point_period_start = "to_date('" + req.body.period_start + "', 'yyyy-MM-dd')";
				}

				column += 'contact_point_period_start,';
				values += contact_point_period_start + ",";
			}

			if (typeof req.body.period_end !== 'undefined') {
				if (req.body.period_end == "") {
					contact_point_period_end = null;
				} else {
					contact_point_period_end = "to_date('" + req.body.period_end + "', 'yyyy-MM-dd')";
				}

				column += 'contact_point_period_end,';
				values += contact_point_period_end + ",";
			}

			if (typeof person_id !== 'undefined') {
				column += 'person_id,';
				values += "'" + person_id + "',";
			}

			if (typeof patient_id !== 'undefined') {
				column += 'patient_id,';
				values += "'" + patient_id + "',";
			}

			if (typeof patient_contact_id !== 'undefined') {
				column += 'patient_contact_id,';
				values += "'" + patient_contact_id + "',";
			}

			if (typeof related_person_id !== 'undefined') {
				column += 'related_person_id,';
				values += "'" + related_person_id + "',";
			}

			if(typeof device_id !== 'undefined'){
        column += 'device_id,';
        values += "'"+ device_id + "',";
      }

      if(typeof organization_id !== 'undefined'){
        column += 'organization_id,';
        values += "'"+ organization_id + "',";
      }
			
			if(typeof organization_contact_id !== 'undefined'){
        column += 'organization_contact_id,';
        values += "'"+ organization_contact_id + "',";
      }
			
			if(typeof endpoint_id !== 'undefined'){
        column += 'endpoint_id,';
        values += "'"+ endpoint_id + "',";
      }
			
			if(typeof location_id !== 'undefined'){
        column += 'location_id,';
        values += "'"+ location_id + "',";
      }
			
			if(typeof practitioner_id !== 'undefined'){
        column += 'practitioner_id,';
        values += "'"+ practitioner_id + "',";
      }
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'"+ practitioner_role_id + "',";
      }
			
			if(typeof healthcareServiceId !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'"+ healthcareServiceId + "',";
      }

			var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT(contact_point_id, " + column.slice(0, -1) + ")" +
				" VALUES ('" + contact_point_id + "', " + values.slice(0, -1) + ")";

			db.upsert(query, function (succes) {
				var arrContactPoint = [];
				var query = "SELECT contact_point_id, contact_point_system, contact_point_value, contact_point_use, contact_point_rank, contact_point_period_start, contact_point_period_end FROM BACIRO_FHIR.CONTACT_POINT WHERE contact_point_id = '" + contact_point_id + "'";
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var ContactPoint = {};
						ContactPoint.id = rez[i].contact_point_id;
						ContactPoint.system = rez[i].contact_point_system;
						ContactPoint.value = rez[i].contact_point_value;
						ContactPoint.use = rez[i].contact_point_use;
						ContactPoint.rank = rez[i].contact_point_rank;

						if (rez[i].contact_point_period_start == null) {
							ContactPoint.period = formatDate(rez[i].contact_point_period_start) + ' to ' + formatDate(rez[i].contact_point_period_end);
						} else {
							ContactPoint.period = "";
						}
						arrContactPoint[i] = ContactPoint;
					}
					res.json({
						"err_code": 0,
						"data": arrContactPoint
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addContactPoint"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addContactPoint"
				});
			});
		},
		address: function addAddress(req, res) {
			var address_id = req.body.id;
			var address_use = req.body.use;
			var address_type = req.body.type;
			var address_text = req.body.text;
			var address_line = req.body.line;
			var address_city = req.body.city;
			var address_district = req.body.district;
			var address_state = req.body.state;
			var address_postal_code = req.body.postal_code;
			var address_country = req.body.country;
			var person_id = req.body.person_id;
			var patient_id = req.body.patient_id;
			var related_person_id = req.body.related_person_id;
			var organization_id = req.body.organization_id;
			var practitioner_id = req.body.practitioner_id;

			//susun query
			var column = "";
			var values = "";

			if (typeof address_use !== 'undefined') {
				column += 'address_use,';
				values += "'" + address_use + "',";
			}

			if (typeof address_type !== 'undefined') {
				column += 'address_type,';
				values += "'" + address_type + "',";
			}

			if (typeof address_text !== 'undefined') {
				column += 'address_text,';
				values += "'" + address_text + "',";
			}

			if (typeof address_line !== 'undefined') {
				column += 'address_line,';
				values += "'" + address_line + "',";
			}

			if (typeof address_city !== 'undefined') {
				column += 'address_city,';
				values += "'" + address_city + "',";
			}

			if (typeof address_district !== 'undefined') {
				column += 'address_district,';
				values += "'" + address_district + "',";
			}

			if (typeof address_state !== 'undefined') {
				column += 'address_state,';
				values += "'" + address_state + "',";
			}

			if (typeof address_postal_code !== 'undefined') {
				column += 'address_postal_code,';
				values += "'" + address_postal_code + "',";
			}

			if (typeof address_country !== 'undefined') {
				column += 'address_country,';
				values += "'" + address_country + "',";
			}

			if (typeof req.body.period_start !== 'undefined') {
				if (req.body.period_start == "") {
					address_period_start = null;
				} else {
					address_period_start = "to_date('" + req.body.period_start + "', 'yyyy-MM-dd')";
				}

				column += 'address_period_start,';
				values += address_period_start + ",";
			}

			if (typeof req.body.period_end !== 'undefined') {
				if (req.body.period_end == "") {
					address_period_end = null;
				} else {
					address_period_end = "to_date('" + req.body.period_end + "', 'yyyy-MM-dd')";
				}

				column += 'address_period_end,';
				values += address_period_end + ",";
			}

			if (typeof person_id !== 'undefined') {
				column += 'person_id,';
				values += "'" + person_id + "',";
			}

			if (typeof patient_id !== 'undefined') {
				column += 'patient_id,';
				values += "'" + patient_id + "',";
			}

			if (typeof related_person_id !== 'undefined') {
				column += 'related_person_id,';
				values += "'" + related_person_id + "',";
			}

			if(typeof organization_id !== 'undefined'){
        column += 'organization_id,';
        values += "'"+ organization_id + "',";
      }
			
			if(typeof practitioner_id !== 'undefined'){
        column += 'practitioner_id,';
        values += "'"+ practitioner_id + "',";
      }

			var query = "UPSERT INTO BACIRO_FHIR.ADDRESS(address_id, " + column.slice(0, -1) + ")" +
				" VALUES ('" + address_id + "', " + values.slice(0, -1) + ")";

			db.upsert(query, function (succes) {
				var arrAddress = [];
				var query = "SELECT address_id, address_use, address_type, address_text, address_line, address_city, address_district, address_state, address_postal_code, address_country, address_period_start, address_period_end FROM BACIRO_FHIR.ADDRESS WHERE address_id = '" + address_id + "'";
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var Address = {};
						Address.id = rez[i].address_id;
						Address.use = rez[i].address_use;
						Address.type = rez[i].address_type;
						Address.text = rez[i].address_text;
						Address.line = rez[i].address_line;
						Address.city = rez[i].address_city;
						Address.district = rez[i].address_district;
						Address.state = rez[i].address_state;
						Address.postalCode = rez[i].address_postal_code;
						Address.addressCountry = rez[i].address_country;

						if (rez[i].address_period_start == null) {
							Address.period = formatDate(rez[i].address_period_start) + ' to ' + formatDate(rez[i].address_period_end);
						} else {
							Address.period = "";
						}
						arrAddress[i] = Address;
					}
					res.json({
						"err_code": 0,
						"data": arrAddress
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addAddress"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAddress"
				});
			});
		},
		appointmentReasonCode: function addAppointmentReasonCode(req, res) {
			var code = req.body.code;
			var description = req.body.description;

			var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_REASON_CODE(id, code, description)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.APPOINTMENT_REASON_CODE_AUTO_ID,'" + code + "','" + description + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, description FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE WHERE code = '" + code + "' ";
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
						"function": "addAppointmentReasonCode"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAppointmentReasonCode"
				});
			});
		},
		slotStatus: function addSlotStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.SLOT_STATUS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.SLOT_STATUS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SLOT_STATUS WHERE code = '" + code + "' ";
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
						"function": "addSlotStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addSlotStatus"
				});
			});
		},
		appointmentStatus: function addAppointmentStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_STATUS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.APPOINTMENT_STATUS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPOINTMENT_STATUS WHERE code = '" + code + "' ";
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
						"function": "addAppointmentStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAppointmentStatus"
				});
			});
		},
		participantRequired: function addParticipantRequired(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.PARTICIPANT_REQUIRED(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.PARTICIPANT_REQUIRED_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_REQUIRED WHERE code = '" + code + "' ";
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
						"function": "addParticipantRequired"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addParticipantRequired"
				});
			});
		},
		participationStatus: function addparticipationStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.PARTICIPATION_STATUS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.PARTICIPATION_STATUS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPATION_STATUS WHERE code = '" + code + "' ";
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
						"function": "addparticipationStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addparticipationStatus"
				});
			});
		},
		actEncounterCode: function addActEncounterCode(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ACT_ENCOUNTER_CODE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ACT_ENCOUNTER_CODE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_ENCOUNTER_CODE WHERE code = '" + code + "' ";
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
						"function": "addActEncounterCode"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addActEncounterCode"
				});
			});
		},
		actPriority: function addActPriority(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ACT_PRIORITY(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ACT_PRIORITY_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_PRIORITY WHERE code = '" + code + "' ";
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
						"function": "addActPriority"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addActPriority"
				});
			});
		},
		accountStatus: function addAccountStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT_STATUS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ACCOUNT_STATUS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACCOUNT_STATUS WHERE code = '" + code + "' ";
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
						"function": "addAccountStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAccountStatus"
				});
			});
		},
		accountType: function addAccountType(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT_TYPE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ACCOUNT_TYPE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACCOUNT_TYPE WHERE code = '" + code + "' ";
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
						"function": "addAccountType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addAccountType"
				});
			});
		},
		diagnosisRole: function addDiagnosisRole(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSIS_ROLE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.DIAGNOSIS_ROLE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DIAGNOSIS_ROLE WHERE code = '" + code + "' ";
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
						"function": "addDiagnosisRole"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addDiagnosisRole"
				});
			});
		},
		encounterAdmitSource: function addEncounterAdmitSource(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_ADMIT_SOURCE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_ADMIT_SOURCE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_ADMIT_SOURCE WHERE code = '" + code + "' ";
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
						"function": "addEncounterAdmitSource"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterAdmitSource"
				});
			});
		},
		encounterDiet: function addEncounterDiet(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_DIET(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_DIET_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_DIET WHERE code = '" + code + "' ";
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
						"function": "addEncounterDiet"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterDiet"
				});
			});
		},
		encounterDischargeDisposition: function addEncounterDischargeDisposition(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_DISCHARGE_DISPOSITION(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_DISCHARGE_DISPOSITION_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_DISCHARGE_DISPOSITION WHERE code = '" + code + "' ";
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
						"function": "addEncounterDischargeDisposition"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterDischargeDisposition"
				});
			});
		},
		encounterLocationStatus: function addEncounterLocationStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_LOCATION_STATUS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_LOCATION_STATUS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_LOCATION_STATUS WHERE code = '" + code + "' ";
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
						"function": "addEncounterLocationStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterLocationStatus"
				});
			});
		},
		encounterParticipantType: function addEncounterParticipantType(req, res) {
			var code = req.body.code;

			var display = req.body.display;
			var definition = req.body.definition;
			var system = req.body.system;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_PARTICIPANT_TYPE(id, code,display, definition,system)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_PARTICIPANT_TYPE_AUTO_ID,'" + code + "','" + display + "','" + definition + "','" + system + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code,display,definition,system FROM BACIRO_FHIR.ENCOUNTER_PARTICIPANT_TYPE WHERE code = '" + code + "' ";
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
						"function": "addEncounterParticipantType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterParticipantType"
				});
			});
		},
		encounterReason: function addEncounterReason(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_REASON(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_REASON_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_REASON WHERE code = '" + code + "' ";
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
						"function": "addEncounterReason"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterReason"
				});
			});
		},
		encounterSpecialCourtesy: function addEncounterSpecialCourtesy(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_SPECIAL_COURTESY(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_SPECIAL_COURTESY_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_COURTESY WHERE code = '" + code + "' ";
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
						"function": "addEncounterSpecialCourtesy"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterSpecialCourtesy"
				});
			});
		},
		encounterSpecialArrangements: function addEncounterSpecialArrangements(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_SPECIAL_ARRANGEMENTS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_SPECIAL_ARRANGEMENTS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_ARRANGEMENTS WHERE code = '" + code + "' ";
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
						"function": "addEncounterSpecialArrangements"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterSpecialArrangements"
				});
			});
		},
		encounterStatus: function addEncounterStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_STATUS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_STATUS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_STATUS WHERE code = '" + code + "' ";
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
						"function": "addEncounterStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterStatus"
				});
			});
		},
		encounterType: function addEncounterType(req, res) {
			var code = req.body.code.replace("<or>", "/");
			
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_TYPE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.ENCOUNTER_TYPE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_TYPE WHERE code = '" + code + "' ";
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
						"function": "addEncounterType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEncounterType"
				});
			});
		},
		episodeOfCareStatus: function addEpisodeOfCareStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE_STATUS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.EPISODE_OF_CARE_STATUS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.EPISODE_OF_CARE_STATUS WHERE code = '" + code + "' ";
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
						"function": "addEpisodeOfCareStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEpisodeOfCareStatus"
				});
			});
		},
		episodeOfCareType: function addEpisodeOfCareType(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE_TYPE(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.EPISODE_OF_CARE_TYPE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.EPISODE_OF_CARE_TYPE WHERE code = '" + code + "' ";
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
						"function": "addEpisodeOfCareType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addEpisodeOfCareType"
				});
			});
		},
		flagStatus: function addFlagStatus(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.FLAG_STATUS(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.FLAG_STATUS_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FLAG_STATUS WHERE code = '" + code + "' ";
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
						"function": "addFlagStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addFlagStatus"
				});
			});
		},
		flagCategory: function addFlagCategory(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.FLAG_CATEGORY(id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.FLAG_CATEGORY_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FLAG_CATEGORY WHERE code = '" + code + "' ";
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
						"function": "addFlagCategory"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addFlagCategory"
				});
			});
		},
		flagCode: function addFlagCode(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			var query = "UPSERT INTO BACIRO_FHIR.FLAG_CODE (id, code, display, definition)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.FLAG_CODE_AUTO_ID,'" + code + "','" + display + "','" + definition + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FLAG_CODE WHERE code = '" + code + "' ";
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
						"function": "addFlagCode"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addFlagCode"
				});
			});
		},
		reAdmissionIndicator: function addReAdmissionIndicator(req, res) {
			var code = req.body.code;
			var display = req.body.display;
			var description = req.body.description;

			var query = "UPSERT INTO BACIRO_FHIR.RE_ADMISSION_INDICATOR (id, code, display, description)" +
				" VALUES (NEXT VALUE FOR BACIRO_FHIR.RE_ADMISSION_INDICATOR_AUTO_ID,'" + code + "','" + display + "','" + description + "')";

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, description FROM BACIRO_FHIR.RE_ADMISSION_INDICATOR WHERE code = '" + code + "' ";
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
						"function": "addReAdmissionIndicator"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addReAdmissionIndicator"
				});
			});
		},
		udiEntryType: function addUdiEntryType(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.UDI_ENTRY_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.UDI_ENTRY_TYPE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.UDI_ENTRY_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addUdiEntryType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addUdiEntryType"});
      });
    },
    deviceStatus: function addDeviceStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DEVICE_STATUS_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceStatus"});
      });
    },
    deviceKind: function addDeviceKind(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_KIND(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DEVICE_KIND_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_KIND WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceKind"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceKind"});
      });
    },
    deviceSafety: function addDeviceSafety(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_SAFETY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DEVICE_SAFETY_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_SAFETY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceSafety"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceSafety"});
      });
    },
    operationalStatus: function addOperationalStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.OPERATIONAL_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.OPERATIONAL_STATUS_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OPERATIONAL_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addOperationalStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addOperationalStatus"});
      });
    },
    parameterGroup: function addParameterGroup(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.PARAMETER_GROUP(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PARAMETER_GROUP_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARAMETER_GROUP WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addParameterGroup"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addParameterGroup"});
      });
    },
    measurementPrinciple: function addMeasurementPrinciple(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEASUREMENT_PRINCIPLE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEASUREMENT_PRINCIPLE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEASUREMENT_PRINCIPLE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMeasurementPrinciple"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMeasurementPrinciple"});
      });
    },
    specificationType: function addSpecificationType(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SPECIFICATION_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SPECIFICATION_TYPE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIFICATION_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSpecificationType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSpecificationType"});
      });
    },
    metricOperationalStatus: function addMetricOperationalStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.METRIC_OPERATIONAL_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.METRIC_OPERATIONAL_STATUS_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_OPERATIONAL_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMetricOperationalStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMetricOperationalStatus"});
      });
    },
    deviceMetricType: function addDeviceMetricType(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_METRIC_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DEVICE_METRIC_TYPE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_METRIC_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceMetricType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceMetricType"});
      });
    },
    metricColor: function addMetricColor(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.METRIC_COLOR(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.METRIC_COLOR_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_COLOR WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMetricColor"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMetricColor"});
      });
    },
    metricCategory: function addMetricCategory(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.METRIC_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.METRIC_CATEGORY_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMetricCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMetricCategory"});
      });
    },
    metricCalibrationType: function addMetricCalibrationType(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.METRIC_CALIBRATION_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.METRIC_CALIBRATION_TYPE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CALIBRATION_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMetricCalibrationType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMetricCalibrationType"});
      });
    },
    metricCalibrationState: function addMetricCalibrationState(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.METRIC_CALIBRATION_STATE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.METRIC_CALIBRATION_STATE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CALIBRATION_STATE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMetricCalibrationState"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMetricCalibrationState"});
      });
    },
    substanceStatus: function addSubstanceStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SUBSTANCE_STATUS_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceStatus"});
      });
    },
    substanceCategory: function addSubstanceCategory(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SUBSTANCE_CATEGORY_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceCategory"});
      });
    },
    substanceCode: function addSubstanceCode(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_CODE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SUBSTANCE_CODE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceCode"});
      });
    },
		organizationType: function addOrganizationType(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ORGANIZATION_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ORGANIZATION_TYPE,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ORGANIZATION_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addOrganizationType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addOrganizationType"});
      });
    },
    contactentityType: function addContactentityType(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_ENTITY_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONTACT_ENTITY_TYPE,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_ENTITY_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addContactentityType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addContactentityType"});
      });
    },
    locationStatus	: function addLocationStatus(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.LOCATION_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.LOCATION_STATUS,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addLocationStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addLocationStatus"});
      });
    },
    bedStatus	: function addBedStatus(req, res){			
      var code = req.body.code;
      var description = req.body.description;
     
      var query = "UPSERT INTO BACIRO_FHIR.BED_STATUS(id, code, description)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.BED_STATUS,'"+code+"','"+description+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.BED_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addBedStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addBedStatus"});
      });
    },
    locationMode	: function addLocationMode(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.LOCATION_MODE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.LOCATION_MODE,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_MODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addLocationMode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addLocationMode"});
      });
    },
    serviceDeliveryLocationRoleType	: function addServiceDeliveryLocationRoleType(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_DELIVERY_LOCATION_ROLE_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SERVICE_DELIVERY_LOCATION_ROLE_TYPE,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_DELIVERY_LOCATION_ROLE_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addServiceDeliveryLocationRoleType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addServiceDeliveryLocationRoleType"});
      });
    },
    locationPhysicalType	: function addLocationPhysicalType(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.LOCATION_PHYSICAL_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.LOCATION_PHYSICAL_TYPE,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_PHYSICAL_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addLocationPhysicalType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addLocationPhysicalType"});
      });
    },
    qualificationCode	: function addQualificationCode(req, res){			
      var code = req.body.code;
      var description = req.body.description;
     
      var query = "UPSERT INTO BACIRO_FHIR.QUALIFICATION_CODE(id, code, description)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.QUALIFICATION_CODE,'"+code+"','"+description+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.QUALIFICATION_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addQualificationCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addQualificationCode"});
      });
    },
    practiceCode	: function addPracticeCode(req, res){			
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.PRACTICE_CODE(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PRACTICE_CODE,'"+code+"','"+display+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.PRACTICE_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPracticeCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPracticeCode"});
      });
    },
    practitionerRoleCode	: function addPractitionerRoleCode(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.PRACTITIONER_ROLE_CODE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PRACTITIONER_ROLE_CODE,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PRACTITIONER_ROLE_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleCode"});
      });
    },
		daysOfWeek	: function addDaysOfWeek(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DAYS_OF_WEEK(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DAYS_OF_WEEK,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DAYS_OF_WEEK WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDaysOfWeek"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDaysOfWeek"});
      });
    },
		serviceCategory	: function addServiceCategory(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SERVICE_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addServiceCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addServiceCategory"});
      });
    },
		serviceType	: function addServiceType(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SERVICE_TYPE,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addServiceType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addServiceType"});
      });
    },
		serviceProvisionConditions	: function addServiceProvisionConditions(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_PROVISION_CONDITIONS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SERVICE_PROVISION_CONDITIONS,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_PROVISION_CONDITIONS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addServiceProvisionConditions"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addServiceProvisionConditions"});
      });
    },
		serviceReferralMethod	: function addServiceReferralMethod(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_REFERRAL_METHOD(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SERVICE_REFERRAL_METHOD,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_REFERRAL_METHOD WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addServiceReferralMethod"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addServiceReferralMethod"});
      });
    },
		endpointStatus	: function addEndpointStatus(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ENDPOINT_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ENDPOINT_STATUS,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENDPOINT_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEndpointStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEndpointStatus"});
      });
    },
		endpointConnectionType	: function addEndpointConnectionType(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ENDPOINT_CONNECTION_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ENDPOINT_CONNECTION_TYPE,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENDPOINT_CONNECTION_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEndpointConnectionType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEndpointConnectionType"});
      });
    },
		endpointPayloadType	: function addEndpointPayloadType(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ENDPOINT_PAYLOAD_TYPE(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ENDPOINT_PAYLOAD_TYPE,'"+code+"','"+display+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.ENDPOINT_PAYLOAD_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEndpointPayloadType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEndpointPayloadType"});
      });
    },
		availableTime: function addAvailableTime(req, res){
			var available_time_id = req.body.id;
			var available_time_day_of_week = req.body.daysOfWeek;
			var available_time_all_day = req.body.allDay;
			var available_time_start = req.body.availableEndTime;
			var available_time_end = req.body.availableEndTime;
			var practitioner_role_id = req.body.practitionerRoleid;
			var healthcare_service_id = req.body.healthcareServiceId;
			
			var column = "";
      var values = "";
			
			if(typeof available_time_day_of_week !== 'undefined'){
        column += 'available_time_day_of_week,';
        values += " '" + available_time_day_of_week +"',";
      }
			
			if(typeof available_time_all_day !== 'undefined'){
        column += 'available_time_all_day,';
        values += " " + available_time_all_day +",";
      }
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'" + practitioner_role_id +"',";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
			
			if(typeof available_time_start !== 'undefined'){
        column += 'available_time_start,';
        values += "to_date('"+ available_time_start + "', 'yyyy-MM-dd'),";
      }
			
			if(typeof available_time_end !== 'undefined'){
        column += 'available_time_end,';
        values += "to_date('"+ available_time_end + "', 'yyyy-MM-dd'),";
      }
			
			

      var query = "UPSERT INTO BACIRO_FHIR.AVAILABLE_TIME(available_time_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+available_time_id+"', " + values.slice(0, -1) + ")";
			
      db.upsert(query,function(succes){
        var query = "SELECT available_time_id, available_time_day_of_week, available_time_all_day, available_time_start, available_time_end, practitioner_role_id FROM BACIRO_FHIR.AVAILABLE_TIME  WHERE available_time_id = '" + available_time_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAvailableTime"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAvailableTime"});
      });
    },
		notAvailable: function addNotAvailable(req, res){
			//console.log(req);
			var practitioner_role_id = req.body.practitionerRoleid;
			var not_available_id = req.body.id;
			var not_available_description = req.body.description;
			var not_available_during = req.body.during;
			var healthcare_service_id = req.body.healthcareServiceId;
			
			var column = "";
      var values = "";
			
			if(typeof not_available_description !== 'undefined'){
        column += 'not_available_description,';
        values += "'" + not_available_description +"',";
      }
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'" + practitioner_role_id +"',";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
			
			if(typeof not_available_during !== 'undefined'){
        column += 'not_available_during,';
        values += "to_date('"+ not_available_during + "', 'yyyy-MM-dd'),";
      }

      var query = "UPSERT INTO BACIRO_FHIR.NOT_AVAILABLE(not_available_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+not_available_id+"', " + values.slice(0, -1) + ")";
			
      db.upsert(query,function(succes){
        var query = "SELECT not_available_id, not_available_description, not_available_during, not_available_during FROM BACIRO_FHIR.NOT_AVAILABLE  WHERE not_available_id = '" + not_available_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNotAvailable"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNotAvailable"});
      });
    },
		adverseEventCategory	: function addAdverseEventCategory(req, res){			
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADVERSE_EVENT_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEventCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addadverseEventCategory"});
      });
    },
		adverseEventType	: function addAdverseEventType(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADVERSE_EVENT_TYPE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEventType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addadverseEventType"});
      });
    },
		adverseEventSeriousness	: function addAdverseEventSeriousness(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_SERIOUSNESS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADVERSE_EVENT_SERIOUSNESS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_SERIOUSNESS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEventSeriousness"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addadverseEventSeriousness"});
      });
    },
		adverseEventOutcome	: function addAdverseEventOutcome(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_OUTCOME(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADVERSE_EVENT_OUTCOME,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_OUTCOME WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEventOutcome"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addadverseEventOutcome"});
      });
    },
		adverseEventCausality	: function addAdverseEventCausality(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_Causality(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADVERSE_EVENT_Causality,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEventCausality"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addadverseEventCausality"});
      });
    },
		adverseEventCausalityAssess	: function addAdverseEventCausalityAssess(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_Causality_Assess(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADVERSE_EVENT_Causality_Assess,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Assess WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEventCausalityAssess"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addadverseEventCausalityAssess"});
      });
    },
		adverseEventCausalityMethod	: function addAdverseEventCausalityMethod(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_Causality_Method(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADVERSE_EVENT_Causality_Method,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Method WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEventCausalityMethod"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addadverseEventCausalityMethod"});
      });
    },
		adverseEventCausalityResult	: function addAdverseEventCausalityResult(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_Causality_Result(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADVERSE_EVENT_Causality_Result,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Result WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEventCausalityResult"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addadverseEventCausalityResult"});
      });
    },
		allergyClinicalStatus	: function addAllergyClinicalStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_CLINICAL_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ALLERGY_CLINICAL_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_CLINICAL_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyClinicalStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyClinicalStatus"});
      });
    },
		allergyVerificationStatus	: function addAllergyVerificationStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_VERIFICATION_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ALLERGY_VERIFICATION_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_VERIFICATION_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyVerificationStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyVerificationStatus"});
      });
    },
		allergyIntoleranceType	: function addAllergyIntoleranceType(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_INTOLERANCE_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ALLERGY_INTOLERANCE_TYPE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceType"});
      });
    },
		allergyIntoleranceCategory	: function addAllergyIntoleranceCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_INTOLERANCE_Category(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ALLERGY_INTOLERANCE_Category,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Category WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceCategory"});
      });
    },
		allergyIntoleranceCriticality	: function addAllergyIntoleranceCriticality(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_INTOLERANCE_Criticality(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ALLERGY_INTOLERANCE_Criticality,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Criticality WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceCriticality"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceCriticality"});
      });
    },
		allergyIntoleranceCode	: function addAllergyIntoleranceCode(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_INTOLERANCE_Code(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ALLERGY_INTOLERANCE_Code,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Code WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceCode"});
      });
    },
		substanceCode	: function addSubstanceCode(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_CODE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SUBSTANCE_CODE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceCode"});
      });
    },
		clinicalFindings	: function addClinicalFindings(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CLINICAL_FINDINGS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CLINICAL_FINDINGS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CLINICAL_FINDINGS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalFindings"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalFindings"});
      });
    },
		reactionEventSeverity	: function addReactionEventSeverity(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REACTION_EVENT_SEVERITY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REACTION_EVENT_SEVERITY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REACTION_EVENT_SEVERITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addReactionEventSeverity"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addReactionEventSeverity"});
      });
    },
		routeCodes	: function addRouteCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ROUTE_CODES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ROUTE_CODES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ROUTE_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRouteCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRouteCodes"});
      });
    },
		carePlanStatus	: function addCarePlanStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CARE_PLAN_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanStatus"});
      });
    },
		carePlanIntent	: function addCarePlanIntent(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_INTENT(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CARE_PLAN_INTENT,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_INTENT WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanIntent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanIntent"});
      });
    },
		carePlanCategory	: function addCarePlanCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CARE_PLAN_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanCategory"});
      });
    },
		carePlanActivityOutcome	: function addCarePlanActivityOutcome(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_ACTIVITY_OUTCOME(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CARE_PLAN_ACTIVITY_OUTCOME,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_OUTCOME WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivityOutcome"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivityOutcome"});
      });
    },
		carePlanActivityCategory	: function addCarePlanActivityCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_ACTIVITY_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CARE_PLAN_ACTIVITY_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivityCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivityCategory"});
      });
    },
		carePlanActivity	: function addCarePlanActivity(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_ACTIVITY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CARE_PLAN_ACTIVITY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivity"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivity"});
      });
    },
		activityReason	: function addActivityReason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ACTIVITY_REASON(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ACTIVITY_REASON,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACTIVITY_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addActivityReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addActivityReason"});
      });
    },
		carePlanActivityStatus	: function addCarePlanActivityStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_ACTIVITY_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CARE_PLAN_ACTIVITY_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivityStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivityStatus"});
      });
    },
		medicationCodes	: function addMedicationCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_CODES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_CODES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationCodes"});
      });
    },
		careTeamStatus	: function addCareTeamStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CARE_TEAM_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CARE_TEAM_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_TEAM_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCareTeamStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCareTeamStatus"});
      });
    },
		careTeamCategory	: function addCareTeamCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CARE_TEAM_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CARE_TEAM_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_TEAM_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCareTeamCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCareTeamCategory"});
      });
    },
		participantRole	: function addParticipantRole(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.PARTICIPANT_ROLE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PARTICIPANT_ROLE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_ROLE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addParticipantRole"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addParticipantRole"});
      });
    },
		clinicalImpressionStatus	: function addClinicalImpressionStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CLINICAL_IMPRESSION_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CLINICAL_IMPRESSION_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CLINICAL_IMPRESSION_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpressionStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpressionStatus"});
      });
    },
		investigationSets	: function addInvestigationSets(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.INVESTIGATION_SETS(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.INVESTIGATION_SETS,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.INVESTIGATION_SETS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addInvestigationSets"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addInvestigationSets"});
      });
    },
		clinicalimpressionPrognosis	: function addClinicalimpressionPrognosis(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CLINICALIMPRESSION_PROGNOSIS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CLINICALIMPRESSION_PROGNOSIS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CLINICALIMPRESSION_PROGNOSIS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalimpressionPrognosis"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalimpressionPrognosis"});
      });
    },
		conditionClinical	: function addConditionClinical(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_CLINICAL(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONDITION_CLINICAL,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_CLINICAL WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addConditionClinical"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addConditionClinical"});
      });
    },
		conditionVerStatus	: function addConditionVerStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_VER_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONDITION_VER_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_VER_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addConditionVerStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addConditionVerStatus"});
      });
    },
		conditionCategory	: function addConditionCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONDITION_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addConditionCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addConditionCategory"});
      });
    },
		conditionSeverity	: function addConditionSeverity(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_SEVERITY(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONDITION_SEVERITY,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.CONDITION_SEVERITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addConditionSeverity"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addConditionSeverity"});
      });
    },
		conditionCode	: function addConditionCode(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_CODE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONDITION_CODE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addConditionCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addConditionCode"});
      });
    },
		bodySite	: function addBodySite(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.BODY_SITE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.BODY_SITE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.BODY_SITE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addBodySite"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addBodySite"});
      });
    },
		conditionStage	: function addConditionStage(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_STAGE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONDITION_STAGE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_STAGE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addConditionStage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addConditionStage"});
      });
    },
		manifestationOrSymptom	: function addManifestationOrSymptom(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MANIFESTATION_OR_SYMPTOM(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MANIFESTATION_OR_SYMPTOM,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MANIFESTATION_OR_SYMPTOM WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addManifestationOrSymptom"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addManifestationOrSymptom"});
      });
    },
		observationStatus	: function addObservationStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.OBSERVATION_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationStatus"});
      });
    },
		detectedissueCategory	: function addDetectedissueCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DETECTEDISSUE_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DETECTEDISSUE_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DETECTEDISSUE_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedissueCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedissueCategory"});
      });
    },
		detectedissueSeverity	: function addDetectedissueSeverity(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DETECTEDISSUE_SEVERITY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DETECTEDISSUE_SEVERITY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DETECTEDISSUE_SEVERITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedissueSeverity"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedissueSeverity"});
      });
    },
		detectedissueMitigationAction	: function addDetectedissueMitigationAction(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DETECTEDISSUE_MITIGATION_ACTION(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DETECTEDISSUE_MITIGATION_ACTION,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DETECTEDISSUE_MITIGATION_ACTION WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedissueMitigationAction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedissueMitigationAction"});
      });
    },
		historyStatus	: function addHistoryStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.HISTORY_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.HISTORY_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.HISTORY_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addHistoryStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addHistoryStatus"});
      });
    },
		historyNotDoneReason	: function addHistoryNotDoneReason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.HISTORY_NOT_DONE_REASON(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.HISTORY_NOT_DONE_REASON,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.HISTORY_NOT_DONE_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addHistoryNotDoneReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addHistoryNotDoneReason"});
      });
    },
		familyMember	: function addFamilyMember(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.FAMILY_MEMBER(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.FAMILY_MEMBER,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FAMILY_MEMBER WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addFamilyMember"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addFamilyMember"});
      });
    },
		conditionOutcome	: function addConditionOutcome(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_OUTCOME(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONDITION_OUTCOME,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_OUTCOME WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addConditionOutcome"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addConditionOutcome"});
      });
    },
		riskProbability	: function addRiskProbability(req, res){	
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.RISK_PROBABILITY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.RISK_PROBABILITY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.RISK_PROBABILITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRiskProbability"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRiskProbability"});
      });
    },
		goalStatus	: function addGoalStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.GOAL_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.GOAL_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GOAL_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGoalStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGoalStatus"});
      });
    },
		goalCategory	: function addGoalCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.GOAL_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.GOAL_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GOAL_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGoalCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGoalCategory"});
      });
    },
		goalPriority	: function addGoalPriority(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.GOAL_PRIORITY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.GOAL_PRIORITY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GOAL_PRIORITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGoalPriority"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGoalPriority"});
      });
    },
		goalStartEvent	: function addGoalStartEvent(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      
      var query = "UPSERT INTO BACIRO_FHIR.GOAL_START_EVENT(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.GOAL_START_EVENT,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.GOAL_START_EVENT WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGoalStartEvent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGoalStartEvent"});
      });
    },
		observationCodes	: function addObservationCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_CODES(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.OBSERVATION_CODES,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.OBSERVATION_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationCodes"});
      });
    },
		eventStatus	: function addEventStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.EVENT_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.EVENT_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.EVENT_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEventStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEventStatus"});
      });
    },
		procedureNotPerformedReason	: function addProcedureNotPerformedReason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_NOT_PERFORMED_REASON(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PROCEDURE_NOT_PERFORMED_REASON,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PROCEDURE_NOT_PERFORMED_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureNotPerformedReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureNotPerformedReason"});
      });
    },
		procedureCategory	: function addProcedureCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_CATEGORY(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PROCEDURE_CATEGORY,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.PROCEDURE_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureCategory"});
      });
    },
		procedureCode	: function addProcedureCode(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_CODE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PROCEDURE_CODE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PROCEDURE_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureCode"});
      });
    },
		performerRole	: function addPerformerRole(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.PERFORMER_ROLE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PERFORMER_ROLE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PERFORMER_ROLE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPerformerRole"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPerformerRole"});
      });
    },
		procedureReason	: function addProcedureReason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_REASON(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PROCEDURE_REASON,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PROCEDURE_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureReason"});
      });
    },
		procedureOutcome	: function addProcedureOutcome(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_OUTCOME(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PROCEDURE_OUTCOME,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.PROCEDURE_OUTCOME WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureOutcome"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureOutcome"});
      });
    },
		procedureFollowup	: function addProcedureFollowup(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_FOLLOWUP(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PROCEDURE_FOLLOWUP,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.PROCEDURE_FOLLOWUP WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureFollowup"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureFollowup"});
      });
    },
		deviceAction	: function addDeviceAction(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_ACTION(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DEVICE_ACTION,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_ACTION WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceAction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceAction"});
      });
    },
		deviceKind	: function addDeviceKind(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_KIND(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DEVICE_KIND,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_KIND WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceKind"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceKind"});
      });
    },
		immunizationStatus	: function addImmunizationStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IMMUNIZATION_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationStatus"});
      });
    },
		vaccineCode	: function addVaccineCode(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var system = req.body.system;
     
      var query = "UPSERT INTO BACIRO_FHIR.VACCINE_CODE(id, code, display, system)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.VACCINE_CODE,'"+code+"','"+display+"','"+system+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, system FROM BACIRO_FHIR.VACCINE_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addVaccineCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addVaccineCode"});
      });
    },
		immunizationOrigin	: function addImmunizationOrigin(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_ORIGIN(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IMMUNIZATION_ORIGIN,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_ORIGIN WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationOrigin"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationOrigin"});
      });
    },
		immunizationSite	: function addImmunizationSite(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_SITE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IMMUNIZATION_SITE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_SITE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationSite"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationSite"});
      });
    },
		immunizationRoute	: function addImmunizationRoute(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_ROUTE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IMMUNIZATION_ROUTE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_ROUTE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRoute"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRoute"});
      });
    },
		immunizationRole	: function addImmunizationRole(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      
      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_ROLE(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IMMUNIZATION_ROLE,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.IMMUNIZATION_ROLE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRole"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRole"});
      });
    },
		immunizationReason	: function addImmunizationReason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      
      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_REASON(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IMMUNIZATION_REASON,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.IMMUNIZATION_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationReason"});
      });
    },
		noImmunizationReason	: function addNoImmunizationReason(req, res){	
      
      var code = req.body.code;
      var system = req.body.system;
			var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.NO_IMMUNIZATION_REASON(id, code, system, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.NO_IMMUNIZATION_REASON,'"+code+"','"+system+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.NO_IMMUNIZATION_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNoImmunizationReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNoImmunizationReason"});
      });
    },
		vaccinationProtocolDoseTarget	: function addVaccinationProtocolDoseTarget(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      
      var query = "UPSERT INTO BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_TARGET(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_TARGET,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_TARGET WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addVaccinationProtocolDoseTarget"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addVaccinationProtocolDoseTarget"});
      });
    },
		vaccinationProtocolDoseStatus	: function addVaccinationProtocolDoseStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addVaccinationProtocolDoseStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addVaccinationProtocolDoseStatus"});
      });
    },
		vaccinationProtocolDoseStatusReason	: function addVaccinationProtocolDoseStatusReason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS_REASON(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS_REASON,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addVaccinationProtocolDoseStatusReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addVaccinationProtocolDoseStatusReason"});
      });
    },
		
		immunizationRecommendationTargetDisease	: function addImmunizationRecommendationTargetDisease(req, res){
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE,'"+code+"','"+display+"')";
			
			console.log(query);
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationTargetDisease"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationTargetDisease"});
      });
    },
		immunizationRecommendationStatus	: function addImmunizationRecommendationStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationStatus"});
      });
    },
		immunizationRecommendationDateCriterion	: function addImmunizationRecommendationDateCriterion(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_DATE_CRITERION(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_DATE_CRITERION,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_DATE_CRITERION WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationDateCriterion"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationDateCriterion"});
      });
    },
		
		medicationStatus	: function addMedicationStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatus"});
      });
    },
		medicationFormCodes	: function addMedicationFormCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_FORM_CODES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_FORM_CODES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_FORM_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationFormCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationFormCodes"});
      });
    },
		medicationPackageForm	: function addMedicationPackageForm(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_PACKAGE_FORM(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_PACKAGE_FORM,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_PACKAGE_FORM WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationPackageForm"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationPackageForm"});
      });
    },
		
		medicationAdminStatus	: function addMedicationAdminStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMIN_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_ADMIN_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_ADMIN_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdminStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdminStatus"});
      });
    },
		medicationAdminCategory	: function addMedicationAdminCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMIN_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_ADMIN_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_ADMIN_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdminCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdminCategory"});
      });
    },
		reasonMedicationNotGivenCodes	: function addReasonMedicationNotGivenCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REASON_MEDICATION_NOT_GIVEN_CODES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REASON_MEDICATION_NOT_GIVEN_CODES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REASON_MEDICATION_NOT_GIVEN_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addReasonMedicationNotGivenCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addReasonMedicationNotGivenCodes"});
      });
    },
		reasonMedicationGivenCodes	: function addReasonMedicationGivenCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REASON_MEDICATION_GIVEN_CODES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REASON_MEDICATION_GIVEN_CODES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REASON_MEDICATION_GIVEN_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addReasonMedicationGivenCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addReasonMedicationGivenCodes"});
      });
    },
		approachSiteCodes	: function addApproachSiteCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.APPROACH_SITE_CODES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.APPROACH_SITE_CODES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPROACH_SITE_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addApproachSiteCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addApproachSiteCodes"});
      });
    },
		administrationMethodCodes	: function addAdministrationMethodCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADMINISTRATION_METHOD_CODES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADMINISTRATION_METHOD_CODES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATION_METHOD_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdministrationMethodCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAdministrationMethodCodes"});
      });
    },
		
		medicationDispenseStatus	: function addMedicationDispenseStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENSE_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_DISPENSE_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_DISPENSE_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispenseStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispenseStatus"});
      });
    },
		medicationDispenseCategory	: function addMedicationDispenseCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENSE_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_DISPENSE_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_DISPENSE_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispenseCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispenseCategory"});
      });
    },
		actPharmacySupplyType	: function addActPharmacySupplyType(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ACT_PHARMACY_SUPPLY_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ACT_PHARMACY_SUPPLY_TYPE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_PHARMACY_SUPPLY_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addActPharmacySupplyType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addActPharmacySupplyType"});
      });
    },
		actSubstanceAdminSubstitutionCode	: function addActSubstanceAdminSubstitutionCode(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addActSubstanceAdminSubstitutionCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addActSubstanceAdminSubstitutionCode"});
      });
    },
		actSubstanceAdminSubstitutionReason	: function addActSubstanceAdminSubstitutionReason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_REASON(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_REASON,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addActSubstanceAdminSubstitutionReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addActSubstanceAdminSubstitutionReason"});
      });
    },
		
		medicationRequestStatus	: function addMedicationRequestStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_REQUEST_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestStatus"});
      });
    },
		medicationRequestIntent	: function addMedicationRequestIntent(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_INTENT(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_REQUEST_INTENT,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_INTENT WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestIntent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestIntent"});
      });
    },
		medicationRequestCategory	: function addMedicationRequestCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_REQUEST_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestCategory"});
      });
    },
		medicationRequestPriority	: function addMedicationRequestPriority(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_PRIORITY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_REQUEST_PRIORITY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_PRIORITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestPriority"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestPriority"});
      });
    },
		medicationCodes	: function addMedicationCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_CODES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_CODES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationCodes"});
      });
    },
		substanceAdminSubstitutionReason	: function addSubstanceAdminSubstitutionReason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_ADMIN_SUBSTITUTION_REASON(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SUBSTANCE_ADMIN_SUBSTITUTION_REASON,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_ADMIN_SUBSTITUTION_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceAdminSubstitutionReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceAdminSubstitutionReason"});
      });
    },
		
		medicationStatementStatus	: function addMedicationStatementStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATEMENT_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_STATEMENT_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATEMENT_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatementStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatementStatus"});
      });
    },
		medicationStatementCategory	: function addMedicationStatementCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATEMENT_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_STATEMENT_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATEMENT_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatementCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatementCategory"});
      });
    },
		medicationStatementTaken	: function addMedicationStatementTaken(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATEMENT_TAKEN(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_STATEMENT_TAKEN,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATEMENT_TAKEN WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatementTaken"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatementTaken"});
      });
    },
		reasonMedicationNotTakenCodes	: function addReasonMedicationNotTakenCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REASON_MEDICATION_NOT_TAKEN_CODES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REASON_MEDICATION_NOT_TAKEN_CODES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REASON_MEDICATION_NOT_TAKEN_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addReasonMedicationNotTakenCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addReasonMedicationNotTakenCodes"});
      });
    },
		
		observationCategory	: function addObservationCategory(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_CATEGORY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.OBSERVATION_CATEGORY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_CATEGORY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationCategory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationCategory"});
      });
    },
		observationValueabsentreason	: function addObservationValueabsentreason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_VALUEABSENTREASON(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.OBSERVATION_VALUEABSENTREASON,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_VALUEABSENTREASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationValueabsentreason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationValueabsentreason"});
      });
    },
		observationInterpretation	: function addObservationInterpretation(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_INTERPRETATION(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.OBSERVATION_INTERPRETATION,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_INTERPRETATION WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationInterpretation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationInterpretation"});
      });
    },
		observationMethods	: function addObservationMethods(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_METHODS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.OBSERVATION_METHODS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_METHODS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationMethods"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationMethods"});
      });
    },
		referencerangeMeaning	: function addReferencerangeMeaning(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REFERENCERANGE_MEANING(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REFERENCERANGE_MEANING,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REFERENCERANGE_MEANING WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addReferencerangeMeaning"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addReferencerangeMeaning"});
      });
    },
		referencerangeAppliesto	: function addReferencerangeAppliesto(req, res){	
      
      var code = req.body.code;
			var system = req.body.system;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REFERENCERANGE_APPLIESTO(id, code, system, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REFERENCERANGE_APPLIESTO,'"+code+"','"+system+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.REFERENCERANGE_APPLIESTO WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addReferencerangeAppliesto"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addReferencerangeAppliesto"});
      });
    },
		observationRelationshiptypes	: function addObservationRelationshiptypes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_RELATIONSHIPTYPES(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.OBSERVATION_RELATIONSHIPTYPES,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_RELATIONSHIPTYPES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationRelationshiptypes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationRelationshiptypes"});
      });
    },
		
		diagnosticReportStatus	: function addDiagnosticReportStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_REPORT_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DIAGNOSTIC_REPORT_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DIAGNOSTIC_REPORT_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticReportStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticReportStatus"});
      });
    },
		diagnosticServiceSections	: function addDiagnosticServiceSections(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_SERVICE_SECTIONS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DIAGNOSTIC_SERVICE_SECTIONS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DIAGNOSTIC_SERVICE_SECTIONS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticServiceSections"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticServiceSections"});
      });
    },
		reportCodes	: function addReportCodes(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      
      var query = "UPSERT INTO BACIRO_FHIR.REPORT_CODES(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REPORT_CODES,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.REPORT_CODES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addReportCodes"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addReportCodes"});
      });
    },
		
		requestStatus	: function addRequestStatus(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REQUEST_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REQUEST_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REQUEST_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRequestStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRequestStatus"});
      });
    },
		requestIntent	: function addRequestIntent(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REQUEST_INTENT(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REQUEST_INTENT,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REQUEST_INTENT WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRequestIntent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRequestIntent"});
      });
    },
		requestPriority	: function addRequestPriority(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REQUEST_PRIORITY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REQUEST_PRIORITY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REQUEST_PRIORITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRequestPriority"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRequestPriority"});
      });
    },
		medicationAsNeededReason	: function addMedicationAsNeededReason(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_AS_NEEDED_REASON(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MEDICATION_AS_NEEDED_REASON,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_AS_NEEDED_REASON WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAsNeededReason"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAsNeededReason"});
      });
    },
		
		instanceAvailability	: function addInstanceAvailability(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.INSTANCE_AVAILABILITY(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.INSTANCE_AVAILABILITY,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.INSTANCE_AVAILABILITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addInstanceAvailability"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addInstanceAvailability"});
      });
    },
		dicomCid29	: function addDicomCid29(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.DICOM_CID29(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.DICOM_CID29,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DICOM_CID29 WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDicomCid29"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDicomCid29"});
      });
    },
		bodysiteLaterality	: function addBodysiteLaterality(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      
      var query = "UPSERT INTO BACIRO_FHIR.BODYSITE_LATERALITY(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.BODYSITE_LATERALITY,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.BODYSITE_LATERALITY WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addBodysiteLaterality"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addBodysiteLaterality"});
      });
    },
		
		sequenceType	: function addSequenceType(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SEQUENCE_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SEQUENCE_TYPE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SEQUENCE_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceType"});
      });
    },
		sequenceReferenceSeq	: function addSequenceReferenceSeq(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SEQUENCE_REFERENCESEQ(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SEQUENCE_REFERENCESEQ,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SEQUENCE_REFERENCESEQ WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceReferenceSeq"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceReferenceSeq"});
      });
    },
		qualityType	: function addQualityType(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.QUALITY_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.QUALITY_TYPE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.QUALITY_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addQualityType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addQualityType"});
      });
    },
		repositoryType	: function addRepositoryType(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.REPOSITORY_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.REPOSITORY_TYPE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REPOSITORY_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRepositoryType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRepositoryType"});
      });
    },
		chromosomeHuman	: function addChromosomeHuman(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CHROMOSOME_HUMAN(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CHROMOSOME_HUMAN,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CHROMOSOME_HUMAN WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addChromosomeHuman"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addChromosomeHuman"});
      });
    },
		
		specimenStatus	: function addSpecimenStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SPECIMEN_STATUS,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIMEN_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenStatus"});
      });
    },
		specimenProcessingProcedure	: function addSpecimenProcessingProcedure(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_PROCESSING_PROCEDURE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SPECIMEN_PROCESSING_PROCEDURE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIMEN_PROCESSING_PROCEDURE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenProcessingProcedure"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenProcessingProcedure"});
      });
    },
		specimenContainerType	: function addSpecimenContainerType(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_CONTAINER_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SPECIMEN_CONTAINER_TYPE,'"+code+"','"+display+"','"+definition+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIMEN_CONTAINER_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenContainerType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenContainerType"});
      });
    },
		specimenCollectionMethod	: function addSpecimenCollectionMethod(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      
      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_COLLECTION_METHOD(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SPECIMEN_COLLECTION_METHOD,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.SPECIMEN_COLLECTION_METHOD WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenCollectionMethod"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenCollectionMethod"});
      });
    },
		bodysiteRelativeLocation	: function addBodysiteRelativeLocation(req, res){	
      
      var code = req.body.code;
      var display = req.body.display;
      
      var query = "UPSERT INTO BACIRO_FHIR.BODYSITE_RELATIVE_LOCATION(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.BODYSITE_RELATIVE_LOCATION,'"+code+"','"+display+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.BODYSITE_RELATIVE_LOCATION WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addBodysiteRelativeLocation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addBodysiteRelativeLocation"});
      });
    },
		specimenType	: function addSpecimenType(req, res){	
      
      var code = req.body.code;
      var description = req.body.description;
      
      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_TYPE(id, code, description)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SPECIMEN_TYPE,'"+code+"','"+description+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.SPECIMEN_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenType"});
      });
    },
		preservative	: function addPreservative(req, res){	
      
      var code = req.body.code;
      var description = req.body.description;
      
      var query = "UPSERT INTO BACIRO_FHIR.PRESERVATIVE(id, code, description)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PRESERVATIVE,'"+code+"','"+description+"')";
			
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.PRESERVATIVE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPreservative"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPreservative"});
      });
    },
	},
	put: {
		identityAssuranceLevel: function updateIdentityAssuranceLevel(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateIdentityAssuranceLevel"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateIdentityAssuranceLevel"
				});
			});
		},
		administrativeGender: function updateAdministrativeGender(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ADMINISTRATIVE_GENDER(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAdministrativeGender"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAdministrativeGender"
				});
			});
		},
		maritalStatus: function updateMaritalStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;
			var system = req.body.system;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof system !== 'undefined') {
				column += 'system,';
				values += "'" + system + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.MARITAL_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MARITAL_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition, system FROM BACIRO_FHIR.MARITAL_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateMaritalStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateMaritalStatus"
				});
			});
		},
		contactRole: function updateContactRole(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var description = req.body.description;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof description !== 'undefined') {
				column += 'description,';
				values += "'" + description + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.CONTACT_ROLE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONTACT_ROLE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, description FROM BACIRO_FHIR.CONTACT_ROLE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateContactRole"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateContactRole"
				});
			});
		},
		animalSpecies: function updateAnimalSpecies(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_SPECIES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ANIMAL_SPECIES WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_SPECIES WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAnimalSpecies"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAnimalSpecies"
				});
			});
		},
		animalBreeds: function updateAnimalBreeds(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_BREEDS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ANIMAL_BREEDS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_BREEDS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAnimalBreeds"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAnimalBreeds"
				});
			});
		},
		animalGenderStatus: function updateAnimalGenderStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_GENDER_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAnimalGenderStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAnimalGenderStatus"
				});
			});
		},
		languages: function updateLanguages(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.LANGUAGES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.LANGUAGES WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display FROM BACIRO_FHIR.LANGUAGES WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateLanguages"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateLanguages"
				});
			});
		},
		linkType: function updateLinkType(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.LINK_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.LINK_TYPE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LINK_TYPE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateLinkType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateLinkType"
				});
			});
		},
		relatedPersonRelationshipType: function updateRelatedPersonRelationshipType(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var system = req.body.system;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof system !== 'undefined') {
				column += 'system,';
				values += "'" + system + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateRelatedPersonRelationshipType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateRelatedPersonRelationshipType"
				});
			});
		},
		groupType: function updateGroupType(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.GROUP_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.GROUP_TYPE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GROUP_TYPE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateGroupType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateGroupType"
				});
			});
		},
		identifierUse: function updateIdentifierUse(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER_USE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IDENTIFIER_USE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTIFIER_USE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateIdentifierUse"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateIdentifierUse"
				});
			});
		},
		identifierType: function updateIdentifierType(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IDENTIFIER_TYPE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display FROM BACIRO_FHIR.IDENTIFIER_TYPE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateIdentifierType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateIdentifierType"
				});
			});
		},
		nameUse: function updateNameUse(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.NAME_USE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.NAME_USE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.NAME_USE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateNameUse"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateNameUse"
				});
			});
		},
		contactPointSystem: function updateContactPointSystem(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT_SYSTEM(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateContactPointSystem"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateContactPointSystem"
				});
			});
		},
		contactPointUse: function updateContactPointUse(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT_USE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONTACT_POINT_USE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_USE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateContactPointUse"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateContactPointUse"
				});
			});
		},
		addressUse: function updateAddressUse(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ADDRESS_USE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADDRESS_USE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_USE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAddressUse"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAddressUse"
				});
			});
		},
		addressType: function updateAddressType(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ADDRESS_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADDRESS_TYPE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_TYPE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAddressType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAddressType"
				});
			});
		},
		identifier: function updateIdentifier(req, res) {
			var _id = req.params._id;
			var domainResource = req.params.dr;

			var identifier_use = req.body.use;
			var identifier_type = req.body.type;
			var identifier_system = req.body.system;
			var identifier_value = req.body.value;
			var identifier_period_start = req.body.period_start;
			var identifier_period_end = req.body.period_end;

			//susun query update
			var column = "";
			var values = "";

			if (typeof identifier_use !== 'undefined') {
				column += 'identifier_use,';
				values += "'" + identifier_use + "',";
			}

			if (typeof identifier_type !== 'undefined') {
				column += 'identifier_type,';
				values += "'" + identifier_type + "',";
			}

			if (typeof identifier_value !== 'undefined') {
				column += 'identifier_value,';
				values += "'" + identifier_value + "',";
			}

			if (typeof identifier_system !== 'undefined') {
				column += 'identifier_system,';
				values += "'" + identifier_system + "',";
			}

			if (typeof identifier_period_start !== 'undefined') {
				column += 'identifier_period_start,';
				values += "to_date('" + identifier_period_start + "', 'yyyy-MM-dd'),";
			}

			if (typeof identifier_period_end !== 'undefined') {
				column += 'identifier_period_end,';
				values += "to_date('" + identifier_period_end + "', 'yyyy-MM-dd'),";
			}

			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "identifier_id = '" + _id + "' AND " + fieldResource + " = '" + valueResource + "'";

			var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER(identifier_id," + column.slice(0, -1) + ") SELECT identifier_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IDENTIFIER WHERE " + condition;

			db.upsert(query, function (succes) {
				var arrIdentifier = [];
				var query = "SELECT identifier_id, identifier_use, identifier_type, identifier_system, identifier_value, identifier_period_start, identifier_period_end FROM BACIRO_FHIR.IDENTIFIER WHERE " + condition;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var Identifier = {};
						Identifier.id = rez[i].identifier_id;
						Identifier.use = rez[i].identifier_use;
						Identifier.type = rez[i].identifier_type;
						Identifier.system = rez[i].identifier_system;
						Identifier.value = rez[i].identifier_value;
						Identifier.period = formatDate(rez[i].identifier_period_start) + ' to ' + formatDate(rez[i].identifier_period_end);

						arrIdentifier[i] = Identifier;
					}
					res.json({
						"err_code": 0,
						"data": arrIdentifier
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateIdentifier"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateIdentifier"
				});
			});
		},
		humanName: function updateHumanName(req, res) {
			var _id = req.params._id;
			var domainResource = req.params.dr;

			var human_name_use = req.body.use;
			var human_name_text = req.body.text;
			var human_name_family = req.body.family;
			var human_name_given = req.body.given;
			var human_name_prefix = req.body.prefix;
			var human_name_suffix = req.body.suffix;
			var human_name_period_start = req.body.period_start;
			var human_name_period_end = req.body.period_end;

			//susun query update
			var column = "";
			var values = "";

			if (typeof human_name_use !== 'undefined') {
				column += 'human_name_use,';
				values += "'" + human_name_use + "',";
			}

			if (typeof human_name_text !== 'undefined') {
				column += 'human_name_text,';
				values += "'" + human_name_text + "',";
			}

			if (typeof human_name_family !== 'undefined') {
				column += 'human_name_family,';
				values += "'" + human_name_family + "',";
			}

			if (typeof human_name_given !== 'undefined') {
				column += 'human_name_given,';
				values += "'" + human_name_given + "',";
			}

			if (typeof human_name_prefix !== 'undefined') {
				column += 'human_name_prefix,';
				values += "'" + human_name_prefix + "',";
			}

			if (typeof human_name_suffix !== 'undefined') {
				column += 'human_name_suffix,';
				values += "'" + human_name_suffix + "',";
			}

			if (typeof human_name_period_start !== 'undefined') {
				column += 'human_name_period_start,';
				values += "to_date('" + human_name_period_start + "', 'yyyy-MM-dd'),";
			}

			if (typeof human_name_period_end !== 'undefined') {
				column += 'human_name_period_end,';
				values += "to_date('" + human_name_period_end + "', 'yyyy-MM-dd'),";
			}

			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "human_name_id = '" + _id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "human_name_id = '" + _id + "'";
			}

			var query = "UPSERT INTO BACIRO_FHIR.HUMAN_NAME(human_name_id," + column.slice(0, -1) + ") SELECT human_name_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.HUMAN_NAME WHERE " + condition;

			db.upsert(query, function (succes) {
				var arrHumanName = [];
				var query = "SELECT human_name_id, human_name_use, human_name_text, human_name_family, human_name_given, human_name_prefix, human_name_suffix, human_name_period_start, human_name_period_end FROM BACIRO_FHIR.HUMAN_NAME WHERE " + condition;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var HumanName = {};
						HumanName.id = rez[i].human_name_id;
						HumanName.use = rez[i].human_name_use;
						HumanName.text = rez[i].human_name_text;
						HumanName.family = rez[i].human_name_family;
						HumanName.given = rez[i].human_name_given;
						HumanName.prefix = rez[i].human_name_prefix;
						HumanName.prefix = rez[i].human_name_suffix;
						if (rez[i].human_name_period_start == null) {
							HumanName.period = formatDate(rez[i].human_name_period_start) + ' to ' + formatDate(rez[i].human_name_period_end);
						} else {
							HumanName.period = "";
						}
						arrHumanName[i] = HumanName;
					}
					res.json({
						"err_code": 0,
						"data": arrHumanName
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateHumanName"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateHumanName"
				});
			});
		},
		contactPoint: function updateContactPoint(req, res) {
			var _id = req.params._id;
			var domainResource = req.params.dr;

			var contact_point_system = req.body.system;
			var contact_point_value = req.body.value;
			var contact_point_use = req.body.use;
			var contact_point_rank = req.body.rank;
			var person_id = req.body.person_id;
			var patient_id = req.body.patient_id;
			var patient_contact_id = req.body.patient_contact_id;
			var related_person_id = req.body.related_person_id;
			var device_id = req.body.device_id;

			//susun query
			var column = "";
			var values = "";

			if (typeof contact_point_system !== 'undefined') {
				column += 'contact_point_system,';
				values += "'" + contact_point_system + "',";
			}

			if (typeof contact_point_value !== 'undefined') {
				column += 'contact_point_value,';
				values += "'" + contact_point_value + "',";
			}

			if (typeof contact_point_use !== 'undefined') {
				column += 'contact_point_use,';
				values += "'" + contact_point_use + "',";
			}

			if (typeof contact_point_rank !== 'undefined') {
				column += 'contact_point_rank,';
				values += contact_point_rank + ",";
			}

			if (typeof req.body.period_start !== 'undefined') {
				if (req.body.period_start == "") {
					contact_point_period_start = null;
				} else {
					contact_point_period_start = "to_date('" + req.body.period_start + "', 'yyyy-MM-dd')";
				}

				column += 'contact_point_period_start,';
				values += contact_point_period_start + ",";
			}

			if (typeof req.body.period_end !== 'undefined') {
				if (req.body.period_end == "") {
					contact_point_period_end = null;
				} else {
					contact_point_period_end = "to_date('" + req.body.period_end + "', 'yyyy-MM-dd')";
				}

				column += 'contact_point_period_end,';
				values += contact_point_period_end + ",";
			}

			if (typeof person_id !== 'undefined') {
				column += 'person_id,';
				values += "'" + person_id + "',";
			}

			if (typeof patient_id !== 'undefined') {
				column += 'patient_id,';
				values += "'" + patient_id + "',";
			}

			if (typeof patient_contact_id !== 'undefined') {
				column += 'patient_contact_id,';
				values += "'" + patient_contact_id + "',";
			}

			if (typeof related_person_id !== 'undefined') {
				column += 'related_person_id,';
				values += "'" + related_person_id + "',";
			}

			if(typeof device_id !== 'undefined'){
        column += 'device_id,';
        values += "'"+ device_id + "',";
      }

			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "contact_point_id = '" + _id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "contact_point_id = '" + _id + "'";
			}

			var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT(contact_point_id," + column.slice(0, -1) + ") SELECT contact_point_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONTACT_POINT WHERE " + condition;

			db.upsert(query, function (succes) {
				var arrContactPoint = [];
				var query = "SELECT contact_point_id, contact_point_system, contact_point_value, contact_point_use, contact_point_rank, contact_point_period_start, contact_point_period_end FROM BACIRO_FHIR.CONTACT_POINT WHERE " + condition;
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var ContactPoint = {};
						ContactPoint.id = rez[i].contact_point_id;
						ContactPoint.system = rez[i].contact_point_system;
						ContactPoint.value = rez[i].contact_point_value;
						ContactPoint.use = rez[i].contact_point_use;
						ContactPoint.rank = rez[i].contact_point_rank;

						if (rez[i].contact_point_period_start == null) {
							ContactPoint.period = formatDate(rez[i].contact_point_period_start) + ' to ' + formatDate(rez[i].contact_point_period_end);
						} else {
							ContactPoint.period = "";
						}
						arrContactPoint[i] = ContactPoint;
					}
					res.json({
						"err_code": 0,
						"data": arrContactPoint
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateContactPoint"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateContactPoint"
				});
			});
		},
		address: function updateAddress(req, res) {
			var _id = req.params._id;
			var domainResource = req.params.dr;

			var address_use = req.body.use;
			var address_type = req.body.type;
			var address_text = req.body.text;
			var address_line = req.body.line;
			var address_city = req.body.city;
			var address_district = req.body.district;
			var address_state = req.body.state;
			var address_postal_code = req.body.postal_code;
			var address_country = req.body.country;
			var person_id = req.body.person_id;
			var patient_id = req.body.patient_id;
			var related_person_id = req.body.related_person_id;

			//susun query
			var column = "";
			var values = "";

			if (typeof address_use !== 'undefined') {
				column += 'address_use,';
				values += "'" + address_use + "',";
			}

			if (typeof address_type !== 'undefined') {
				column += 'address_type,';
				values += "'" + address_type + "',";
			}

			if (typeof address_text !== 'undefined') {
				column += 'address_text,';
				values += "'" + address_text + "',";
			}

			if (typeof address_line !== 'undefined') {
				column += 'address_line,';
				values += "'" + address_line + "',";
			}

			if (typeof address_city !== 'undefined') {
				column += 'address_city,';
				values += "'" + address_city + "',";
			}

			if (typeof address_district !== 'undefined') {
				column += 'address_district,';
				values += "'" + address_district + "',";
			}

			if (typeof address_state !== 'undefined') {
				column += 'address_state,';
				values += "'" + address_state + "',";
			}

			if (typeof address_postal_code !== 'undefined') {
				column += 'address_postal_code,';
				values += "'" + address_postal_code + "',";
			}

			if (typeof address_country !== 'undefined') {
				column += 'address_country,';
				values += "'" + address_country + "',";
			}

			if (typeof req.body.period_start !== 'undefined') {
				if (req.body.period_start == "") {
					address_period_start = null;
				} else {
					address_period_start = "to_date('" + req.body.period_start + "', 'yyyy-MM-dd')";
				}

				column += 'address_period_start,';
				values += address_period_start + ",";
			}

			if (typeof req.body.period_end !== 'undefined') {
				if (req.body.period_end == "") {
					address_period_end = null;
				} else {
					address_period_end = "to_date('" + req.body.period_end + "', 'yyyy-MM-dd')";
				}

				column += 'address_period_end,';
				values += address_period_end + ",";
			}

			if (typeof person_id !== 'undefined') {
				column += 'person_id,';
				values += "'" + person_id + "',";
			}

			if (typeof patient_id !== 'undefined') {
				column += 'patient_id,';
				values += "'" + patient_id + "',";
			}

			if (typeof related_person_id !== 'undefined') {
				column += 'related_person_id,';
				values += "'" + related_person_id + "',";
			}

			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "address_id = '" + _id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "address_id = '" + _id + "'";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ADDRESS(address_id," + column.slice(0, -1) + ") SELECT address_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADDRESS WHERE " + condition;

			db.upsert(query, function (succes) {
				var arrAddress = [];
				var query = "SELECT address_id, address_use, address_type, address_text, address_line, address_city, address_district, address_state, address_postal_code, address_country, address_period_start, address_period_end FROM BACIRO_FHIR.ADDRESS WHERE " + condition;
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var Address = {};
						Address.id = rez[i].address_id;
						Address.use = rez[i].address_use;
						Address.type = rez[i].address_type;
						Address.text = rez[i].address_text;
						Address.line = rez[i].address_line;
						Address.city = rez[i].address_city;
						Address.district = rez[i].address_district;
						Address.state = rez[i].address_state;
						Address.postalCode = rez[i].address_postal_code;
						Address.addressCountry = rez[i].address_country;

						if (rez[i].address_period_start == null) {
							Address.period = formatDate(rez[i].address_period_start) + ' to ' + formatDate(rez[i].address_period_end);
						} else {
							Address.period = "";
						}
						arrAddress[i] = Address;
					}
					res.json({
						"err_code": 0,
						"data": arrAddress
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAddress"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAddress"
				});
			});
		},
		attachment: function updateAttachment(req, res) {
			var _id = req.params._id;
			var domainResource = req.params.dr;

			var attachment_content_type = req.body.content_type;
			var attachment_language = req.body.language;
			var attachment_url = req.body.url;
			var attachment_size = req.body.size;
			var attachment_data = req.body.data;
			var attachment_hash = req.body.hash;
			var attachment_title = req.body.title;
			var attachment_creation = req.body.creation;

			//susun query update
			var column = "";
			var values = "";

			if (typeof attachment_content_type !== 'undefined') {
				column += 'attachment_content_type,';
				values += "'" + attachment_content_type + "',";
			}

			if (typeof attachment_language !== 'undefined') {
				column += 'attachment_language,';
				values += "'" + attachment_language + "',";
			}

			if (typeof attachment_url !== 'undefined') {
				column += 'attachment_url,';
				values += "'" + attachment_url + "',";
			}

			if (typeof attachment_size !== 'undefined') {
				column += 'attachment_size,';
				values += "" + attachment_size + ",";
			}

			if (typeof attachment_data !== 'undefined') {
				column += 'attachment_data,';
				values += "'" + attachment_data + "',";
			}

			if (typeof attachment_hash !== 'undefined') {
				column += 'attachment_hash,';
				values += "'" + attachment_hash + "',";
			}

			if (typeof attachment_title !== 'undefined') {
				column += 'attachment_title,';
				values += "'" + attachment_title + "',";
			}

			if (typeof attachment_creation !== 'undefined') {
				column += 'attachment_creation,';
				values += "to_date('" + attachment_creation + "', 'yyyy-MM-dd'),";
			}
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "attachment_id = '" + _id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "attachment_id = '" + _id + "'";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ATTACHMENT(attachment_id," + column.slice(0, -1) + ") SELECT attachment_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ATTACHMENT WHERE " + condition;

			db.upsert(query, function (succes) {
				var arrAttachment = [];
				var query = "SELECT attachment_id, attachment_url, attachment_content_type, attachment_language, attachment_data, attachment_size, attachment_hash, attachment_title, attachment_creation FROM BACIRO_FHIR.ATTACHMENT WHERE " + condition;
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					for (i = 0; i < rez.length; i++) {
						var Attachment = {};
						Attachment.id = rez[i].attachment_id;
						Attachment.url = rez[i].attachment_url;
						Attachment.contentType = rez[i].attachment_content_type;
						Attachment.language = rez[i].attachment_language;
						Attachment.data = rez[i].attachment_data;
						Attachment.size = rez[i].attachment_size;
						Attachment.hash = rez[i].attachment_hash;
						Attachment.title = rez[i].attachment_title;
						Attachment.creation = rez[i].attachment_creation;

						arrAttachment[i] = Attachment;
					}
					res.json({
						"err_code": 0,
						"data": arrAttachment
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAttachment"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAddress"
				});
			});
		},
		appointmentReasonCode: function updateAppointmentReasonCode(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var description = req.body.description;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof description !== 'undefined') {
				column += 'description,';
				values += "'" + description + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_REASON_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, description FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAppointmentReasonCode"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAppointmentReasonCode"
				});
			});
		},
		slotStatus: function updateSlotStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.SLOT_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SLOT_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SLOT_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateSlotStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateSlotStatus"
				});
			});
		},
		appointmentStatus: function updateAppointmentStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.APPOINTMENT_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPOINTMENT_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAppointmentStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAppointmentStatus"
				});
			});
		},
		participantRequired: function updateParticipantRequired(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.PARTICIPANT_REQUIRED(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PARTICIPANT_REQUIRED WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_REQUIRED WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateParticipantRequired"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateParticipantRequired"
				});
			});
		},
		participationStatus: function updateparticipationStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.PARTICIPATION_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PARTICIPATION_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPATION_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateparticipationStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateparticipationStatus"
				});
			});
		},
		actEncounterCode: function updateActEncounterCode(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ACT_ENCOUNTER_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACT_ENCOUNTER_CODE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_ENCOUNTER_CODE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateActEncounterCode"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateActEncounterCode"
				});
			});
		},
		actPriority: function updateActPriority(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ACT_PRIORITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACT_PRIORITY WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_PRIORITY WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateActPriority"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateActPriority"
				});
			});
		},
		accountStatus: function updateAccountStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACCOUNT_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACCOUNT_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAccountStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAccountStatus"
				});
			});
		},
		accountType: function updateAccountType(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ACCOUNT_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACCOUNT_TYPE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACCOUNT_TYPE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateAccountType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateAccountType"
				});
			});
		},
		diagnosisRole: function updateDiagnosisRole(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSIS_ROLE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DIAGNOSIS_ROLE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DIAGNOSIS_ROLE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateDiagnosisRole"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateDiagnosisRole"
				});
			});
		},
		encounterAdmitSource: function updateEncounterAdmitSource(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_ADMIT_SOURCE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_ADMIT_SOURCE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_ADMIT_SOURCE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterAdmitSource"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterAdmitSource"
				});
			});
		},
		encounterDiet: function updateEncounterDiet(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_DIET(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_DIET WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_DIET WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterDiet"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterDiet"
				});
			});
		},
		encounterDischargeDisposition: function updateEncounterDischargeDisposition(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_DISCHARGE_DISPOSITION(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_DISCHARGE_DISPOSITION WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_DISCHARGE_DISPOSITION WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterDischargeDisposition"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterDischargeDisposition"
				});
			});
		},
		encounterLocationStatus: function updateEncounterLocationStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_LOCATION_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_LOCATION_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_LOCATION_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterLocationStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterLocationStatus"
				});
			});
		},
		encounterParticipantType: function updateEncounterParticipantType(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_PARTICIPANT_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_PARTICIPANT_TYPE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_PARTICIPANT_TYPE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterParticipantType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterParticipantType"
				});
			});
		},
		encounterReason: function updateEncounterReason(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_REASON WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_REASON WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterReason"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterReason"
				});
			});
		},
		encounterSpecialCourtesy: function updateEncounterSpecialCourtesy(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_SPECIAL_COURTESY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_COURTESY WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_COURTESY WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterSpecialCourtesy"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterSpecialCourtesy"
				});
			});
		},
		encounterSpecialArrangements: function updateEncounterSpecialArrangements(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_SPECIAL_ARRANGEMENTS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_ARRANGEMENTS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_SPECIAL_ARRANGEMENTS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterSpecialArrangements"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterSpecialArrangements"
				});
			});
		},
		encounterStatus: function updateEncounterStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterStatus"
				});
			});
		},
		encounterType: function updateEncounterType(req, res) {
			var _id = req.params._id;
			var code = req.body.code.replace("<or>", "/");
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_TYPE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENCOUNTER_TYPE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEncounterType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEncounterType"
				});
			});
		},
		episodeOfCareStatus: function updateEpisodeOfCareStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.EPISODE_OF_CARE_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.EPISODE_OF_CARE_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEpisodeOfCareStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEpisodeOfCareStatus"
				});
			});
		},
		episodeOfCareType: function updateEpisodeOfCareType(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.EPISODE_OF_CARE_TYPE (id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.EPISODE_OF_CARE_TYPE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.EPISODE_OF_CARE_TYPE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateEpisodeOfCareType"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateEpisodeOfCareType"
				});
			});
		},
		flagStatus: function updateFlagStatus(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.FLAG_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.FLAG_STATUS WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FLAG_STATUS WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateFlagStatus"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateFlagStatus"
				});
			});
		},
		flagCategory: function updateFlagCategory(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.FLAG_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.FLAG_CATEGORY WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FLAG_CATEGORY WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateFlagCategory"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateFlagCategory"
				});
			});
		},
		flagCode: function updateFlagCode(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof definition !== 'undefined') {
				column += 'definition,';
				values += "'" + definition + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.FLAG_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.FLAG_CODE WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FLAG_CODE WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateFlagCode"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateFlagCode"
				});
			});
		},
		reAdmissionIndicator: function updateReAdmissionIndicator(req, res) {
			var _id = req.params._id;
			var code = req.body.code;
			var display = req.body.display;
			var description = req.body.description;

			//susun query update
			var column = "";
			var values = "";

			if (typeof code !== 'undefined') {
				column += 'code,';
				values += "'" + code + "',";
			}

			if (typeof display !== 'undefined') {
				column += 'display,';
				values += "'" + display + "',";
			}

			if (typeof description !== 'undefined') {
				column += 'description,';
				values += "'" + description + "',";
			}

			var query = "UPSERT INTO BACIRO_FHIR.RE_ADMISSION_INDICATOR(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.RE_ADMISSION_INDICATOR WHERE id = " + _id;

			db.upsert(query, function (succes) {
				var query = "SELECT id, code, display, description FROM BACIRO_FHIR.RE_ADMISSION_INDICATOR WHERE id = " + _id;

				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 2,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "updateReAdmissionIndicator"
					});
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "updateReAdmissionIndicator"
				});
			});
		},
		udiEntryType: function updateUdiEntryType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.UDI_ENTRY_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.UDI_ENTRY_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.UDI_ENTRY_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          console.log(rez)
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "udpateUdiEntryType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "udpateUdiEntryType"});
      });
    },
    deviceStatus: function updateDeviceStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          console.log(rez)
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceStatus"});
      });
    },
    deviceKind: function updateDeviceKind(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_KIND(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_KIND WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_KIND WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          console.log(rez)
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceKind"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceKind"});
      });
    },
    deviceSafety: function updateDeviceSafety(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_SAFETY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_SAFETY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_SAFETY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          console.log(rez)
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceSafety"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceSafety"});
      });
    },
    operationalStatus: function updateOperationalStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.OPERATIONAL_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.OPERATIONAL_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OPERATIONAL_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          console.log(rez)
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateOperationalStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateOperationalStatus"});
      });
    },
    parameterGroup: function updateParameterGroup(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.PARAMETER_GROUP(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PARAMETER_GROUP WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARAMETER_GROUP WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateParameterGroup"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateParameterGroup"});
      });
    },
    measurementPrinciple: function updateMeasurementPrinciple(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.MEASUREMENT_PRINCIPLE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEASUREMENT_PRINCIPLE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEASUREMENT_PRINCIPLE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMeasurementPrinciple"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMeasurementPrinciple"});
      });
    },
    specificationType: function updateSpecificationType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SPECIFICATION_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SPECIFICATION_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIFICATION_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecificationType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecificationType"});
      });
    },
    metricOperationalStatus: function updateMetricOperationalStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.METRIC_OPERATIONAL_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.METRIC_OPERATIONAL_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_OPERATIONAL_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricOperationalStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricOperationalStatus"});
      });
    },
    deviceMetricType: function updateDeviceMetricType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_METRIC_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_METRIC_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_METRIC_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceMetricType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceMetricType"});
      });
    },
    metricColor: function updateMetricColor(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.METRIC_COLOR(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.METRIC_COLOR WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_COLOR WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricColor"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricColor"});
      });
    },
    metricCategory: function updateMetricCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.METRIC_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.METRIC_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricCategory"});
      });
    },
    metricCalibrationType: function updateMetricCalibrationType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.METRIC_CALIBRATION_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.METRIC_CALIBRATION_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CALIBRATION_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricCalibrationType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricCalibrationType"});
      });
    },
    metricCalibrationState: function updateMetricCalibrationState(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.METRIC_CALIBRATION_STATE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.METRIC_CALIBRATION_STATE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.METRIC_CALIBRATION_STATE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricCalibrationState"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMetricCalibrationState"});
      });
    },
    substanceStatus: function updateSubstanceStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SUBSTANCE_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceStatus"});
      });
    },
    substanceCategory: function updateSubstanceCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SUBSTANCE_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceCategory"});
      });
    },
    substanceCode: function updateSubstanceCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SUBSTANCE_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceCode"});
      });
    },
		organizationType: function updateOrganizationType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ORGANIZATION_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ORGANIZATION_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ORGANIZATION_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateOrganizationType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateOrganizationType"});
      });
    },
		contactentityType: function updateContactentityType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_ENTITY_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONTACT_ENTITY_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_ENTITY_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateContactentityType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateContactentityType"});
      });
    },
		locationStatus: function updateLocationStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.LOCATION_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.LOCATION_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateLocationStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateLocationStatus"});
      });
    },
		bedStatus: function updateBedStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var description = req.body.description;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof description !== 'undefined'){
        column += 'description,';
        values += "'" +description +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.BED_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.BED_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.BED_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateBbedStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateBbedStatus"});
      });
    },
		locationMode: function updatelocationMode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.LOCATION_MODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.LOCATION_MODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_MODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatelocationMode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatelocationMode"});
      });
    },
		serviceDeliveryLocationRoleType: function updateServiceDeliveryLocationRoleType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_DELIVERY_LOCATION_ROLE_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SERVICE_DELIVERY_LOCATION_ROLE_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_DELIVERY_LOCATION_ROLE_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceDeliveryLocationRoleType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceDeliveryLocationRoleType"});
      });
    },
		locationPhysicalType: function updateLocationPhysicalType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.LOCATION_PHYSICAL_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.LOCATION_PHYSICAL_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LOCATION_PHYSICAL_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateLocationPhysicalType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateLocationPhysicalType"});
      });
    },
		qualificationCode: function updateQualificationCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var description = req.body.description;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof description !== 'undefined'){
        column += 'description,';
        values += "'" +description +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.QUALIFICATION_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.QUALIFICATION_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.QUALIFICATION_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateQualificationCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateQualificationCode"});
      });
    },
		practitionerRoleCode: function updatePractitionerRoleCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.PRACTITIONER_ROLE_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PRACTITIONER_ROLE_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PRACTITIONER_ROLE_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePractitionerRoleCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePractitionerRoleCode"});
      });
    },
		practiceCode: function updatePracticeCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.PRACTICE_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PRACTICE_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.PRACTICE_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePracticeCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePracticeCode"});
      });
    },
		daysOfWeek: function updateDaysOfWeek(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DAYS_OF_WEEK(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DAYS_OF_WEEK WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DAYS_OF_WEEK WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDaysOfWeek"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDaysOfWeek"});
      });
    },
		serviceCategory: function updateServiceCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SERVICE_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceCategory"});
      });
    },
		serviceType: function updateServiceType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SERVICE_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceType"});
      });
    },
		serviceProvisionConditions: function updateServiceProvisionConditions(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_PROVISION_CONDITIONS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SERVICE_PROVISION_CONDITIONS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_PROVISION_CONDITIONS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceProvisionConditions"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceProvisionConditions"});
      });
    },
		serviceReferralMethod: function updateServiceReferralMethod(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SERVICE_REFERRAL_METHOD(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SERVICE_REFERRAL_METHOD WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SERVICE_REFERRAL_METHOD WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceReferralMethod"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateServiceReferralMethod"});
      });
    },
		endpointStatus: function updateEndpointStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ENDPOINT_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENDPOINT_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENDPOINT_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEndpointStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEndpointStatus"});
      });
    },
		endpointConnectionType: function updateEndpointConnectionType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ENDPOINT_CONNECTION_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENDPOINT_CONNECTION_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ENDPOINT_CONNECTION_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEndpointConnectionType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEndpointConnectionType"});
      });
    },
		endpointPayloadType: function updateEndpointPayloadType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ENDPOINT_PAYLOAD_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENDPOINT_PAYLOAD_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.ENDPOINT_PAYLOAD_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEndpointPayloadType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEndpointPayloadType"});
      });
    },
		availableTime: function updateAvailableTime(req, res){
			var _id = req.params._id;
			var domainResource = req.params.dr;
			
			var available_time_day_of_week = req.body.daysOfWeek;
			var available_time_all_day = req.body.allDay;
			var available_time_start = req.body.availableEndTime;
			var available_time_end = req.body.availableEndTime;
			var practitioner_role_id = req.body.practitionerRoleid;
			var healthcare_service_id = req.body.healthcareServiceId;
			
			var column = "";
      var values = "";
			
			if(typeof available_time_day_of_week !== 'undefined'){
        column += 'available_time_day_of_week,';
        values += " '" + available_time_day_of_week +"',";
      }
			
			if(typeof available_time_all_day !== 'undefined'){
        column += 'available_time_all_day,';
        values += " " + available_time_all_day +",";
      }
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'" + practitioner_role_id +"',";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
			
			if(typeof available_time_start !== 'undefined'){
        column += 'available_time_start,';
        values += "to_date('"+ available_time_start + "', 'yyyy-MM-dd'),";
      }
			
			if(typeof available_time_end !== 'undefined'){
        column += 'available_time_end,';
        values += "to_date('"+ available_time_end + "', 'yyyy-MM-dd'),";
      }
			
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "available_time_id = '" + _id + "' AND " + fieldResource + " = '" + valueResource + "'";

			var query = "UPSERT INTO BACIRO_FHIR.AVAILABLE_TIME(available_time_id," + column.slice(0, -1) + ") SELECT available_time_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.AVAILABLE_TIME WHERE " + condition;


      db.upsert(query,function(succes){
        var query = "SELECT available_time_id, available_time_day_of_week, available_time_all_day, available_time_start, available_time_end, practitioner_role_id FROM BACIRO_FHIR.AVAILABLE_TIME  WHERE available_time_id = '" + _id + "' ";
				
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAvailableTime"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAvailableTime"});
      });
    },
		notAvailable: function updateNotAvailable(req, res){
			//console.log(req);
			var _id = req.params._id;
			var domainResource = req.params.dr;
			
			var not_available_description = req.body.description;
			var not_available_during = req.body.during;
			var healthcare_service_id = req.body.healthcareServiceId;
			var practitioner_role_id = req.body.practitionerRoleid;
			var not_available_id = req.body.id;
			
			var column = "";
      var values = "";
			
			if(typeof not_available_description !== 'undefined'){
        column += 'not_available_description,';
        values += "'" + not_available_description +"',";
      }
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'" + practitioner_role_id +"',";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
			
			if(typeof not_available_during !== 'undefined'){
        column += 'not_available_during,';
        values += "to_date('"+ not_available_during + "', 'yyyy-MM-dd'),";
      }
			
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "not_available_id = '" + _id + "' AND " + fieldResource + " = '" + valueResource + "'";

			var query = "UPSERT INTO BACIRO_FHIR.NOT_AVAILABLE(not_available_id," + column.slice(0, -1) + ") SELECT not_available_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.NOT_AVAILABLE WHERE " + condition;

      db.upsert(query,function(succes){
        var query = "SELECT not_available_id, not_available_description, not_available_during, not_available_during FROM BACIRO_FHIR.NOT_AVAILABLE  WHERE not_available_id = '" + _id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateNotAvailable"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateNotAvailable"});
      });
    },
		adverseEventCategory: function updateAdverseEventCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADVERSE_EVENT_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCategory"});
      });
    },
		adverseEventType: function updateAdverseEventType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADVERSE_EVENT_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventType"});
      });
    },
		adverseEventSeriousness: function updateAdverseEventSeriousness(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_SERIOUSNESS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADVERSE_EVENT_SERIOUSNESS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_SERIOUSNESS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventSeriousness"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventSeriousness"});
      });
    },
		adverseEventOutcome: function updateAdverseEventOutcome(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_OUTCOME(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADVERSE_EVENT_OUTCOME WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_OUTCOME WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventOutcome"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventOutcome"});
      });
    },
		adverseEventCausality: function updateAdverseEventCausality(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_Causality(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADVERSE_EVENT_Causality WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCausality"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCausality"});
      });
    },
		adverseEventCausalityAssess: function updateAdverseEventCausalityAssess(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_Causality_Assess(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Assess WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Assess WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCausalityAssess"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCausalityAssess"});
      });
    },
		adverseEventCausalityMethod: function updateAdverseEventCausalityMethod(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_Causality_Method(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Method WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Method WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCausalityMethod"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCausalityMethod"});
      });
    },
		adverseEventCausalityResult: function updateAdverseEventCausalityResult(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT_Causality_Result(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Result WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADVERSE_EVENT_Causality_Result WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCausalityResult"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdverseEventCausalityResult"});
      });
    },
		allergyClinicalStatus: function updateAllergyClinicalStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_CLINICAL_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ALLERGY_CLINICAL_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_CLINICAL_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyClinicalStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyClinicalStatus"});
      });
    },
		allergyVerificationStatus: function updateAllergyVerificationStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_Verification_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ALLERGY_Verification_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_Verification_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyVerificationStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyVerificationStatus"});
      });
    },
		allergyIntoleranceType: function updateAllergyIntoleranceType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_INTOLERANCE_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceType"});
      });
    },
		allergyIntoleranceCategory: function updateAllergyIntoleranceCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_INTOLERANCE_Category(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Category WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Category WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceCategory"});
      });
    },
		allergyIntoleranceCriticality: function updateAllergyIntoleranceCriticality(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_INTOLERANCE_Criticality(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Criticality WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Criticality WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceCriticality"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceCriticality"});
      });
    },
		allergyIntoleranceCode: function updateAllergyIntoleranceCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ALLERGY_INTOLERANCE_Code(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Code WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ALLERGY_INTOLERANCE_Code WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceCode"});
      });
    },
		substanceCode: function updateSubstanceCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SUBSTANCE_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceCode"});
      });
    },
		clinicalFindings: function updateClinicalFindings(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CLINICAL_FINDINGS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CLINICAL_FINDINGS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CLINICAL_FINDINGS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalFindings"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalFindings"});
      });
    },
		reactionEventSeverity: function updateReactionEventSeverity(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REACTION_EVENT_SEVERITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REACTION_EVENT_SEVERITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REACTION_EVENT_SEVERITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateReactionEventSeverity"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateReactionEventSeverity"});
      });
    },
		routeCodes: function updateRouteCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ROUTE_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ROUTE_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ROUTE_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRouteCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRouteCodes"});
      });
    },
		carePlanStatus: function updateCarePlanStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_PLAN_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanStatus"});
      });
    },
		carePlanIntent: function updateCarePlanIntent(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_INTENT(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_PLAN_INTENT WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_INTENT WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanIntent"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanIntent"});
      });
    },
		carePlanCategory: function updateCarePlanCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_PLAN_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanCategory"});
      });
    },
		carePlanActivityOutcome: function updateCarePlanActivityOutcome(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_ACTIVITY_OUTCOME(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_OUTCOME WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_OUTCOME WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityOutcome"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityOutcome"});
      });
    },
		carePlanActivityCategory: function updateCarePlanActivityCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_ACTIVITY_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityCategory"});
      });
    },
		carePlanActivity: function updateCarePlanActivity(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_ACTIVITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivity"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivity"});
      });
    },
		activityReason: function updateActivityReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ACTIVITY_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACTIVITY_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACTIVITY_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateActivityReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateActivityReason"});
      });
    },
		carePlanActivityStatus: function updateCarePlanActivityStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CARE_PLAN_ACTIVITY_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_PLAN_ACTIVITY_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityStatus"});
      });
    },
		medicationCodes: function updateMedicationCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationCodes"});
      });
    },
		careTeamStatus: function updateCareTeamStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CARE_TEAM_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_TEAM_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_TEAM_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCareTeamStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCareTeamStatus"});
      });
    },
		careTeamCategory: function updateCareTeamCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CARE_TEAM_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CARE_TEAM_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CARE_TEAM_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCareTeamCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCareTeamCategory"});
      });
    },
		participantRole: function updateParticipantRole(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.PARTICIPANT_ROLE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PARTICIPANT_ROLE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_ROLE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateParticipantRole"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateParticipantRole"});
      });
    },
		clinicalImpressionStatus: function updateClinicalImpressionStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CLINICAL_IMPRESSION_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CLINICAL_IMPRESSION_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CLINICAL_IMPRESSION_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalImpressionStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalImpressionStatus"});
      });
    },
		investigationSets: function updateInvestigationSets(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.INVESTIGATION_SETS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.INVESTIGATION_SETS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.INVESTIGATION_SETS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateInvestigationSets"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateInvestigationSets"});
      });
    },
		clinicalimpressionPrognosis: function updateClinicalimpressionPrognosis(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CLINICALIMPRESSION_PROGNOSIS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CLINICALIMPRESSION_PROGNOSIS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CLINICALIMPRESSION_PROGNOSIS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalimpressionPrognosis"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalimpressionPrognosis"});
      });
    },
		conditionClinical: function updateConditionClinical(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_CLINICAL(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONDITION_CLINICAL WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_CLINICAL WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionClinical"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionClinical"});
      });
    },
		conditionVerStatus: function updateConditionVerStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_VER_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONDITION_VER_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_VER_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionVerStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionVerStatus"});
      });
    },
		conditionCategory: function updateConditionCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONDITION_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionCategory"});
      });
    },
		conditionSeverity: function updateConditionSeverity(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_SEVERITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONDITION_SEVERITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.CONDITION_SEVERITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionSeverity"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionSeverity"});
      });
    },
		conditionCode: function updateConditionCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONDITION_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionCode"});
      });
    },
		bodySite: function updateBodySite(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.BODY_SITE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.BODY_SITE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.BODY_SITE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateBodySite"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateBodySite"});
      });
    },
		conditionStage: function updateConditionStage(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_STAGE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONDITION_STAGE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_STAGE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionStage"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionStage"});
      });
    },
		manifestationOrSymptom: function updateManifestationOrSymptom(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MANIFESTATION_OR_SYMPTOM(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MANIFESTATION_OR_SYMPTOM WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MANIFESTATION_OR_SYMPTOM WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateManifestationOrSymptom"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateManifestationOrSymptom"});
      });
    },
		observationStatus: function updateObservationStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.OBSERVATION_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationStatus"});
      });
    },
		detectedissueCategory: function updateDetectedissueCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DETECTEDISSUE_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DETECTEDISSUE_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DETECTEDISSUE_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedissueCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedissueCategory"});
      });
    },
		detectedissueSeverity: function updateDetectedissueSeverity(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DETECTEDISSUE_SEVERITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DETECTEDISSUE_SEVERITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DETECTEDISSUE_SEVERITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedissueSeverity"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedissueSeverity"});
      });
    },
		detectedissueMitigationAction: function updateDetectedissueMitigationAction(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DETECTEDISSUE_MITIGATION_ACTION(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DETECTEDISSUE_MITIGATION_ACTION WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DETECTEDISSUE_MITIGATION_ACTION WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedissueMitigationAction"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedissueMitigationAction"});
      });
    },
		historyStatus: function updateHistoryStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.HISTORY_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.HISTORY_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.HISTORY_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateHistoryStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateHistoryStatus"});
      });
    },
		historyNotDoneReason: function updateHistoryNotDoneReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.HISTORY_NOT_DONE_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.HISTORY_NOT_DONE_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.HISTORY_NOT_DONE_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
					res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateHistoryNotDoneReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateHistoryNotDoneReason"});
      });
    },
		familyMember: function updateFamilyMember(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.FAMILY_MEMBER(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.FAMILY_MEMBER WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.FAMILY_MEMBER WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateFamilyMember"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateFamilyMember"});
      });
    },
		conditionOutcome: function updateConditionOutcome(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CONDITION_OUTCOME(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONDITION_OUTCOME WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONDITION_OUTCOME WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionOutcome"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionOutcome"});
      });
    },
		riskProbability: function updateRiskProbability(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.RISK_PROBABILITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.RISK_PROBABILITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.RISK_PROBABILITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRiskProbability"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRiskProbability"});
      });
    },
		goalStatus: function updateGoalStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.GOAL_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.GOAL_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GOAL_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalStatus"});
      });
    },
		goalCategory: function updateGoalCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.GOAL_CATEGORY (id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.GOAL_CATEGORY  WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GOAL_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalCategory"});
      });
    },
		goalPriority: function updateGoalPriority(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.GOAL_PRIORITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.GOAL_PRIORITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GOAL_PRIORITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalPriority"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalPriority"});
      });
    },
		goalStartEvent: function updateGoalStartEvent(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.GOAL_START_EVENT(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.GOAL_START_EVENT WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.GOAL_START_EVENT WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalStartEvent"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalStartEvent"});
      });
    },
		observationCodes: function updateObservationCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.OBSERVATION_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.OBSERVATION_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationCodes"});
      });
    },
		eventStatus: function updateEventStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.EVENT_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.EVENT_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.EVENT_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEventStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEventStatus"});
      });
    },
		procedureNotPerformedReason: function updateProcedureNotPerformedReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_NOT_PERFORMED_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PROCEDURE_NOT_PERFORMED_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PROCEDURE_NOT_PERFORMED_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureNotPerformedReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureNotPerformedReason"});
      });
    },
		procedureCategory: function updateProcedureCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PROCEDURE_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.PROCEDURE_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureCategory"});
      });
    },
		procedureCode: function updateProcedureCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PROCEDURE_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PROCEDURE_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureCode"});
      });
    },
		performerRole: function updatePerformerRole(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.PERFORMER_ROLE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PERFORMER_ROLE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PERFORMER_ROLE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePerformerRole"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePerformerRole"});
      });
    },
		procedureReason: function updateProcedureReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PROCEDURE_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PROCEDURE_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureReason"});
      });
    },
		procedureOutcome: function updateProcedureOutcome(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_OUTCOME(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PROCEDURE_OUTCOME WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.PROCEDURE_OUTCOME WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureOutcome"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureOutcome"});
      });
    },
		procedureFollowup: function updateProcedureFollowup(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_FOLLOWUP(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PROCEDURE_FOLLOWUP WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.PROCEDURE_FOLLOWUP WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureFollowup"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureFollowup"});
      });
    },
		deviceAction: function updateDeviceAction(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_ACTION(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_ACTION WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_ACTION WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceAction"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceAction"});
      });
    },
		deviceKind: function updateDeviceKind(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_KIND(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_KIND WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DEVICE_KIND WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceKind"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceKind"});
      });
    },
		immunizationStatus: function updateImmunizationStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationStatus"});
      });
    },
		vaccineCode: function updateVaccineCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var system = req.body.system;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof system !== 'undefined'){
        column += 'system,';
        values += "'" +system +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.VACCINE_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.VACCINE_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, system, display FROM BACIRO_FHIR.VACCINE_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateVaccineCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateVaccineCode"});
      });
    },
		immunizationOrigin: function updateImmunizationOrigin(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_ORIGIN(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_ORIGIN WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_ORIGIN WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationOrigin"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationOrigin"});
      });
    },
		immunizationSite: function updateImmunizationSite(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_SITE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_SITE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_SITE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationSite"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationSite"});
      });
    },
		immunizationRoute: function updateImmunizationRoute(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_ROUTE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_ROUTE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_ROUTE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRoute"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRoute"});
      });
    },
		immunizationRole: function updateImmunizationRole(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_ROLE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_ROLE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.IMMUNIZATION_ROLE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRole"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRole"});
      });
    },
		immunizationReason: function updateImmunizationReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.IMMUNIZATION_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationReason"});
      });
    },
		noImmunizationReason: function updateNoImmunizationReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
			var system = req.body.system;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }
			
			if(typeof system !== 'system'){
        column += 'system,';
        values += "'" +system +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.NO_IMMUNIZATION_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.NO_IMMUNIZATION_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.NO_IMMUNIZATION_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateNoImmunizationReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateNoImmunizationReason"});
      });
    },
		vaccinationProtocolDoseTarget: function updateVaccinationProtocolDoseTarget(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_TARGET(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_TARGET WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_TARGET WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateVaccinationProtocolDoseTarget"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateVaccinationProtocolDoseTarget"});
      });
    },
		vaccinationProtocolDoseStatus: function updateVaccinationProtocolDoseStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateVaccinationProtocolDoseStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateVaccinationProtocolDoseStatus"});
      });
    },
		vaccinationProtocolDoseStatusReason: function updateVaccinationProtocolDoseStatusReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.VACCINATION_PROTOCOL_DOSE_STATUS_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateVaccinationProtocolDoseStatusReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateVaccinationProtocolDoseStatusReason"});
      });
    },
		immunizationRecommendationTargetDisease: function updateImmunizationRecommendationTargetDisease(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationTargetDisease"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationTargetDisease"});
      });
    },
		immunizationRecommendationStatus: function updateImmunizationRecommendationStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationStatus"});
      });
    },
		immunizationRecommendationDateCriterion: function updateImmunizationRecommendationDateCriterion(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_DATE_CRITERION(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_DATE_CRITERION WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_DATE_CRITERION WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationDateCriterion"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationDateCriterion"});
      });
    },
		
		medicationStatus: function updateMedicationStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatus"});
      });
    },
		medicationFormCodes: function updateMedicationFormCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_FORM_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_FORM_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_FORM_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationFormCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationFormCodes"});
      });
    },
		medicationPackageForm: function updateMedicationPackageForm(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_PACKAGE_FORM(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_PACKAGE_FORM WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_PACKAGE_FORM WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationPackageForm"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationPackageForm"});
      });
    },
		
		medicationAdminStatus: function updateMedicationAdminStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMIN_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_ADMIN_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_ADMIN_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdminStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdminStatus"});
      });
    },
		medicationAdminCategory: function updateMedicationAdminCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMIN_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_ADMIN_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_ADMIN_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdminCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdminCategory"});
      });
    },
		reasonMedicationNotGivenCodes: function updateReasonMedicationNotGivenCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REASON_MEDICATION_NOT_GIVEN_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REASON_MEDICATION_NOT_GIVEN_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REASON_MEDICATION_NOT_GIVEN_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateReasonMedicationNotGivenCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateReasonMedicationNotGivenCodes"});
      });
    },
		reasonMedicationGivenCodes: function updateReasonMedicationGivenCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REASON_MEDICATION_GIVEN_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REASON_MEDICATION_GIVEN_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REASON_MEDICATION_GIVEN_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateReasonMedicationGivenCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateReasonMedicationGivenCodes"});
      });
    },
		approachSiteCodes: function updateApproachSiteCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.APPROACH_SITE_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.APPROACH_SITE_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPROACH_SITE_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateApproachSiteCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateApproachSiteCodes"});
      });
    },
		administrationMethodCodes: function updateAdministrationMethodCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADMINISTRATION_METHOD_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADMINISTRATION_METHOD_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATION_METHOD_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdministrationMethodCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdministrationMethodCodes"});
      });
    },
		
		medicationDispenseStatus: function updateMedicationDispenseStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENSE_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_DISPENSE_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_DISPENSE_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispenseStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispenseStatus"});
      });
    },
		medicationDispenseCategory: function updateMedicationDispenseCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENSE_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_DISPENSE_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_DISPENSE_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispenseCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispenseCategory"});
      });
    },
		actPharmacySupplyType: function updateActPharmacySupplyType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ACT_PHARMACY_SUPPLY_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACT_PHARMACY_SUPPLY_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_PHARMACY_SUPPLY_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateActPharmacySupplyType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateActPharmacySupplyType"});
      });
    },
		actSubstanceAdminSubstitutionCode: function updateActSubstanceAdminSubstitutionCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateActSubstanceAdminSubstitutionCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateActSubstanceAdminSubstitutionCode"});
      });
    },
		actSubstanceAdminSubstitutionReason: function updateActSubstanceAdminSubstitutionReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ACT_SUBSTANCE_ADMIN_SUBSTITUTION_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateActSubstanceAdminSubstitutionReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateActSubstanceAdminSubstitutionReason"});
      });
    },
		
		medicationRequestStatus: function updateMedicationRequestStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_REQUEST_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestStatus"});
      });
    },
		medicationRequestIntent: function updateMedicationRequestIntent(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_INTENT(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_REQUEST_INTENT WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_INTENT WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestIntent"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestIntent"});
      });
    },
		medicationRequestCategory: function updateMedicationRequestCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_REQUEST_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestCategory"});
      });
    },
		medicationRequestPriority: function updateMedicationRequestPriority(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_PRIORITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_REQUEST_PRIORITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_REQUEST_PRIORITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestPriority"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestPriority"});
      });
    },
		medicationCodes: function updateMedicationCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationCodes"});
      });
    },
		substanceAdminSubstitutionReason: function updateSubstanceAdminSubstitutionReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_ADMIN_SUBSTITUTION_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SUBSTANCE_ADMIN_SUBSTITUTION_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SUBSTANCE_ADMIN_SUBSTITUTION_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceAdminSubstitutionReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceAdminSubstitutionReason"});
      });
    },
		
		medicationStatementStatus: function updateMedicationStatementStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATEMENT_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_STATEMENT_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATEMENT_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatementStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatementStatus"});
      });
    },
		medicationStatementCategory: function updateMedicationStatementCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATEMENT_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_STATEMENT_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATEMENT_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatementCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatementCategory"});
      });
    },
		medicationStatementTaken: function updateMedicationStatementTaken(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATEMENT_TAKEN(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_STATEMENT_TAKEN WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_STATEMENT_TAKEN WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatementTaken"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatementTaken"});
      });
    },
		reasonMedicationNotTakenCodes: function updateReasonMedicationNotTakenCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REASON_MEDICATION_NOT_TAKEN_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REASON_MEDICATION_NOT_TAKEN_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REASON_MEDICATION_NOT_TAKEN_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateReasonMedicationNotTakenCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateReasonMedicationNotTakenCodes"});
      });
    },
		
		observationCategory: function updateObservationCategory(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_CATEGORY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.OBSERVATION_CATEGORY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_CATEGORY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationCategory"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationCategory"});
      });
    },
		observationValueabsentreason: function updateObservationValueabsentreason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_VALUEABSENTREASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.OBSERVATION_VALUEABSENTREASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_VALUEABSENTREASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationValueabsentreason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationValueabsentreason"});
      });
    },
		observationInterpretation: function updateObservationInterpretation(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_INTERPRETATION(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.OBSERVATION_INTERPRETATION WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_INTERPRETATION WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationInterpretation"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationInterpretation"});
      });
    },
		observationMethods: function updateObservationMethods(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_METHODS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.OBSERVATION_METHODS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_METHODS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationMethods"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationMethods"});
      });
    },
		referencerangeMeaning: function updateReferencerangeMeaning(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REFERENCERANGE_MEANING(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REFERENCERANGE_MEANING WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REFERENCERANGE_MEANING WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateReferencerangeMeaning"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateReferencerangeMeaning"});
      });
    },
		referencerangeAppliesto: function updateReferencerangeAppliesto(req, res){
      var _id = req.params._id;
      var code = req.body.code;
			var system = req.body.system;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }
			
			if(typeof system !== 'undefined'){
        column += 'system,';
        values += "'" +system +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REFERENCERANGE_APPLIESTO(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REFERENCERANGE_APPLIESTO WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.REFERENCERANGE_APPLIESTO WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateReferencerangeAppliesto"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateReferencerangeAppliesto"});
      });
    },
		observationRelationshiptypes: function updateObservationRelationshiptypes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.OBSERVATION_RELATIONSHIPTYPES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.OBSERVATION_RELATIONSHIPTYPES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.OBSERVATION_RELATIONSHIPTYPES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationRelationshiptypes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationRelationshiptypes"});
      });
    },
		
		diagnosticReportStatus: function updateDiagnosticReportStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_REPORT_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DIAGNOSTIC_REPORT_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DIAGNOSTIC_REPORT_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticReportStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticReportStatus"});
      });
    },
		diagnosticServiceSections: function updateDiagnosticServiceSections(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_SERVICE_SECTIONS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DIAGNOSTIC_SERVICE_SECTIONS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DIAGNOSTIC_SERVICE_SECTIONS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticServiceSections"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticServiceSections"});
      });
    },
		reportCodes: function updateReportCodes(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REPORT_CODES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REPORT_CODES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REPORT_CODES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateReportCodes"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateReportCodes"});
      });
    },
		
		requestStatus: function updateRequestStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REQUEST_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REQUEST_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REQUEST_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRequestStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRequestStatus"});
      });
    },
		requestIntent: function updateRequestIntent(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REQUEST_INTENT(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REQUEST_INTENT WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REQUEST_INTENT WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRequestIntent"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRequestIntent"});
      });
    },
		requestPriority: function updateRequestPriority(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REQUEST_PRIORITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REQUEST_PRIORITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REQUEST_PRIORITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRequestPriority"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRequestPriority"});
      });
    },
		medicationAsNeededReason: function updateMedicationAsNeededReason(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_AS_NEEDED_REASON(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_AS_NEEDED_REASON WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.MEDICATION_AS_NEEDED_REASON WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAsNeededReason"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAsNeededReason"});
      });
    },
		
		instanceAvailability: function updateInstanceAvailability(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.INSTANCE_AVAILABILITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.INSTANCE_AVAILABILITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.INSTANCE_AVAILABILITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateInstanceAvailability"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateInstanceAvailability"});
      });
    },
		dicomCid29: function updateDicomCid29(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DICOM_CID29(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DICOM_CID29 WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.DICOM_CID29 WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDicomCid29"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDicomCid29"});
      });
    },
		bodysiteLaterality: function updateBodysiteLaterality(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.BODYSITE_LATERALITY(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.BODYSITE_LATERALITY WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.BODYSITE_LATERALITY WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateBodysiteLaterality"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateBodysiteLaterality"});
      });
    },
		
		sequenceType: function updatesequenceType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SEQUENCE_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SEQUENCE_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SEQUENCE_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatesequenceType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatesequenceType"});
      });
    },
		sequenceReferenceSeq: function updateSequenceReferenceSeq(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SEQUENCE_REFERENCESEQ(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SEQUENCE_REFERENCESEQ WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SEQUENCE_REFERENCESEQ WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSequenceReferenceSeq"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSequenceReferenceSeq"});
      });
    },
		qualityType: function updateQualityType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.QUALITY_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.QUALITY_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.QUALITY_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateQualityType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateQualityType"});
      });
    },
		repositoryType: function updateRepositoryType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.REPOSITORY_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.REPOSITORY_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.REPOSITORY_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRepositoryType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRepositoryType"});
      });
    },
		chromosomeHuman: function updateChromosomeHuman(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CHROMOSOME_HUMAN(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CHROMOSOME_HUMAN WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CHROMOSOME_HUMAN WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateChromosomeHuman"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateChromosomeHuman"});
      });
    },
		
		specimenStatus: function updateSpecimenStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SPECIMEN_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIMEN_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenStatus"});
      });
    },
		specimenProcessingProcedure: function updateSpecimenProcessingProcedure(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_PROCESSING_PROCEDURE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SPECIMEN_PROCESSING_PROCEDURE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIMEN_PROCESSING_PROCEDURE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenProcessingProcedure"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenProcessingProcedure"});
      });
    },
		specimenContainerType: function updateSpecimenContainerType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_CONTAINER_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SPECIMEN_CONTAINER_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SPECIMEN_CONTAINER_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenContainerType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenContainerType"});
      });
    },
		specimenCollectionMethod: function updateSpecimenCollectionMethod(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_COLLECTION_METHOD(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SPECIMEN_COLLECTION_METHOD WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.SPECIMEN_COLLECTION_METHOD WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenCollectionMethod"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenCollectionMethod"});
      });
    },
		bodysiteRelativeLocation: function updateBodysiteRelativeLocation(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.BODYSITE_RELATIVE_LOCATION(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.BODYSITE_RELATIVE_LOCATION WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.BODYSITE_RELATIVE_LOCATION WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateBodysiteRelativeLocation"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateBodysiteRelativeLocation"});
      });
    },
		specimenType: function updateSpecimenType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var description = req.body.description;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof description !== 'undefined'){
        column += 'description,';
        values += "'" +description +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SPECIMEN_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SPECIMEN_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.SPECIMEN_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenType"});
      });
    },
		preservative: function updatePreservative(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var description = req.body.description;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof description !== 'undefined'){
        column += 'description,';
        values += "'" +description +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.PRESERVATIVE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PRESERVATIVE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.PRESERVATIVE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePreservative"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePreservative"});
      });
    },
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