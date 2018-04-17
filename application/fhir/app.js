var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var configYaml = yamlconfig.readConfig('../config/config.yml');

//end event emitter

var host = configYaml.fhir.host;
var port = configYaml.fhir.port;

//setting midleware
app.use (function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT, OPTIONS");
//  res.removeHeader("x-powered-by");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

// parse application/json
app.use(bodyParser.json({limit: '50mb'}))

//import default fhir module
var DefaultFHIR = require("./default_fhir/controller");

//import patient_registers module
var Person = require("./patient_registers/person/controller");
var Patient = require("./patient_registers/patient/controller");
var RelatedPerson = require("./patient_registers/related_person/controller");
var Group = require("./patient_registers/group/controller");

//import scheduling_and_appointments module
var Schedule = require("./scheduling_and_appointments/schedule/controller");
var Slot = require("./scheduling_and_appointments/slot/controller");
var Appointment = require("./scheduling_and_appointments/appointment/controller");
var AppointmentResponse = require("./scheduling_and_appointments/appointment_response/controller");

//import clinical categorization resources
var ClinicalCategorizationResources = require("./clinical_categorization_resources/controller");

//import devices_and_substances module
var Device = require("./devices_and_substances/device/controller");

//import routes
var routesDefaultFHIR	= require('./default_fhir/routes');

// var routesClinicalCategorizationResources = require('./clinical_categorization_resources/routes');
var routesPerson		= require('./patient_registers/person/routes');
var routesPatient		= require('./patient_registers/patient/routes');
var routesRelatedPerson	= require('./patient_registers/related_person/routes');
var routesGroup			= require('./patient_registers/group/routes');
var routesSchedule		= require('./scheduling_and_appointments/schedule/routes');
var routesSlot		= require('./scheduling_and_appointments/slot/routes');
var routesAppointment	= require('./scheduling_and_appointments/appointment/routes');
var routesAppointmentResponse		= require('./scheduling_and_appointments/appointment_response/routes');
var routesDevice 		= require("./devices_and_substances/device/routes");

//setrouting
routesDefaultFHIR(app, DefaultFHIR);
// routesClinicalCategorizationResources(app, ClinicalCategorizationResources);
routesPerson(app, Person);
routesPatient(app, Patient);
routesRelatedPerson(app, RelatedPerson);
routesGroup(app, Group);
routesSchedule(app, Schedule);
routesSlot(app, Slot);
routesAppointment(app, Appointment);
routesAppointmentResponse(app, AppointmentResponse);
routesDevice(app, Device);

var server = app.listen(port, host, function () {
  console.log("Server running at http://%s:%s", host, port);
})