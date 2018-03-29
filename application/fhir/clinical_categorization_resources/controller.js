var Apiclient = require('apiclient');
var sha1 = require('sha1');
var validator = require('validator');
var bytes = require('bytes');
var uniqid = require('uniqid');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

var host = configYaml.fhir.host;
var port = configYaml.fhir.port;

//event emitter
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

//phoenix
//query data melalui rest phoenix
var seedPhoenix = require(path.resolve('../../application/config/seed_phoenix.json'));
seedPhoenix.base.hostname = configYaml.phoenix.host;
seedPhoenix.base.port = configYaml.phoenix.port;

var Api = new Apiclient(seedPhoenix);

seedPhoenixFHIR = require(path.resolve('../../application/config/seed_phoenix_fhir.json'));
seedPhoenixFHIR.base.hostname = configYaml.phoenix.host;
seedPhoenixFHIR.base.port = configYaml.phoenix.port;

var ApiFHIR = new Apiclient(seedPhoenixFHIR);

var controller = {
	post: function addClinicalCategorizationResources(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
		
		var err_code = 0;
		var err_msg = "";

		//input check
		//identifier use
		if (typeof req.body.identifier.use !== 'undefined') {
			identifierUseCode = req.body.identifier.use.trim().toLowerCase();
			if (validator.isEmpty(identifierUseCode)) {
				err_code = 2;
				err_msg = "Identifier Use is required";
			}
		} else {
			err_code = 1;
			err_msg = "Please add sub-key 'use' in json identifier request.";
		}
		//identifier type
		if (typeof req.body.identifier.type !== 'undefined') {
			identifierTypeCode = req.body.identifier.type.trim().toLowerCase();
			if (validator.isEmpty(identifierTypeCode)) {
				err_code = 2;
				err_msg = "Identifier Type is required";
			}
		} else {
			err_code = 1;
			err_msg = "Please add sub-key 'type' in json identifier request.";
		}
		//identifier value
		if (typeof req.body.identifier.value !== 'undefined') {
			identifierValueCode = req.body.identifier.value.trim().toLowerCase();
			if (validator.isEmpty(identifierValueCode)) {
				err_code = 2;
				err_msg = "Identifier Value is required";
			}
		} else {
			err_code = 1;
			err_msg = "Please add sub-key 'value' in json identifier request.";
		}
		//identifier period
		if (typeof req.body.identifier.period !== 'undefined') {
			period = req.body.identifier.period;
			if (period.indexOf("to") > 0) {
				arrPeriod = period.split("to");
				identifierPeriodStart = arrPeriod[0];
				identifierPeriodEnd = arrPeriod[1];
				if (!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)) {
					err_code = 2;
					err_msg = "Identifier Period invalid date format.";
				}
			}
		} else {
			err_code = 1;
			err_msg = "Please add key 'period' in json identifier request.";
		}
		//set by sistem
		var identifierSystem = host + ':' + port + '/' + 'identifier/value/' + identifierValue
	}
		
}