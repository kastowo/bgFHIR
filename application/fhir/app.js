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
var EpisodeOfCare = require("./clinical_categorization_resources/episode_of_care/controller");
var Encounter = require("./clinical_categorization_resources/encounter/controller");
var Account = require("./clinical_categorization_resources/account/controller");
var Flag = require("./clinical_categorization_resources/flag/controller");

//import devices_and_substances module
var Device = require("./devices_and_substances/device/controller");
var DeviceComponent = require("./devices_and_substances/device_component/controller");
var DeviceMetric = require("./devices_and_substances/device_metric/controller");
var Substance = require("./devices_and_substances/substance/controller");

//import service_provider_directory_resources
var Organization = require("./service_provider_directory_resources/organization/controller");
var Endpoint = require("./service_provider_directory_resources/endpoint/controller");
var Location = require("./service_provider_directory_resources/location/controller");
var Practitioner = require("./service_provider_directory_resources/practitioner/controller");
var PractitionerRole = require("./service_provider_directory_resources/practitionerRole/controller");
var HealthcareService = require("./service_provider_directory_resources/healthcareService/controller");

<<<<<<< HEAD
=======
var Immunization = require("./medication/immunization/controller");
var ImmunizationRecommendation = require("./medication/immunizationRecommendation/controller");
var Medication = require("./medication/medication/controller");

var AdverseEvent = require("./clinical_summary/adverseEvent/controller");
var AllergyIntolerance = require("./clinical_summary/allergyIntolerance/controller");
var CarePlan = require("./clinical_summary/carePlan/controller");
var CareTeam = require("./clinical_summary/careTeam/controller");

>>>>>>> hcs
//import routes
var routesDefaultFHIR	= require('./default_fhir/routes');

// var routesClinicalCategorizationResources = require('./clinical_categorization_resources/routes');
var routesPerson		= require('./patient_registers/person/routes');
var routesPatient		= require('./patient_registers/patient/routes');
var routesRelatedPerson	= require('./patient_registers/related_person/routes');
var routesGroup			= require('./patient_registers/group/routes');
var routesEpisodeOfCare = require('./clinical_categorization_resources/episode_of_care/routes');
var routesEncounter = require('./clinical_categorization_resources/encounter/routes');
var routesAccount = require('./clinical_categorization_resources/account/routes');
var routesFlag = require('./clinical_categorization_resources/flag/routes');
var routesSchedule		= require('./scheduling_and_appointments/schedule/routes');
var routesSlot		= require('./scheduling_and_appointments/slot/routes');
var routesAppointment	= require('./scheduling_and_appointments/appointment/routes');
var routesAppointmentResponse		= require('./scheduling_and_appointments/appointment_response/routes');
var routesDevice 		= require("./devices_and_substances/device/routes");
var routesDeviceComponent 	= require("./devices_and_substances/device_component/routes");
var routesDeviceMetric 		= require("./devices_and_substances/device_metric/routes");
var routesSubstance 		= require("./devices_and_substances/substance/routes");
var routesOrganization = require('./service_provider_directory_resources/organization/routes');
var routesEndpoint = require('./service_provider_directory_resources/endpoint/routes');
var routesLocation = require('./service_provider_directory_resources/location/routes');
var routesPractitioner = require('./service_provider_directory_resources/practitioner/routes');
var routesPractitionerRole = require('./service_provider_directory_resources/practitionerRole/routes');
var routesHealthcareService = require('./service_provider_directory_resources/healthcareService/routes');
<<<<<<< HEAD
=======

var routesImmunization = require('./medication/immunization/routes');
var routesImmunizationRecommendation = require('./medication/immunizationRecommendation/routes');
var routesMedication = require('./medication/medication/routes');

var routesAdverseEvent = require('./clinical_summary/adverseEvent/routes');
var routesAllergyIntolerance = require('./clinical_summary/allergyIntolerance/routes');
var routesCarePlan = require('./clinical_summary/carePlan/routes');
var routesCareTeam = require('./clinical_summary/careTeam/routes');
>>>>>>> hcs

//setrouting
routesDefaultFHIR(app, DefaultFHIR);
// routesClinicalCategorizationResources(app, ClinicalCategorizationResources);
routesPerson(app, Person);
routesPatient(app, Patient);
routesRelatedPerson(app, RelatedPerson);
routesGroup(app, Group);
routesEpisodeOfCare(app, EpisodeOfCare);
routesEncounter(app, Encounter);
routesAccount(app, Account);
routesFlag(app, Flag);
routesSchedule(app, Schedule);
routesSlot(app, Slot);
routesAppointment(app, Appointment);
routesAppointmentResponse(app, AppointmentResponse);
routesDevice(app, Device);
routesDeviceComponent(app, DeviceComponent);
routesDeviceMetric(app, DeviceMetric);
routesSubstance(app, Substance);
routesOrganization(app, Organization);
routesEndpoint(app, Endpoint);
routesLocation(app, Location);
routesPractitioner(app, Practitioner);
routesPractitionerRole(app, PractitionerRole);
routesHealthcareService(app, HealthcareService);
<<<<<<< HEAD
=======

routesImmunization(app, Immunization);
routesImmunizationRecommendation(app, ImmunizationRecommendation);
routesMedication(app, Medication);

routesAdverseEvent(app, AdverseEvent);
routesAllergyIntolerance(app, AllergyIntolerance);
routesCarePlan(app, CarePlan);
routesCareTeam(app, CareTeam);
>>>>>>> hcs

var server = app.listen(port, host, function () {
  console.log("Server running at http://%s:%s", host, port);
})