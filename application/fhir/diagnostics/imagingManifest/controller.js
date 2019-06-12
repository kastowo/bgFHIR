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
	seedPhoenix.base.port 		= configYaml.phoenix.port;
	
var Api = new Apiclient(seedPhoenix);

seedPhoenixFHIR = require(path.resolve('../../application/config/seed_phoenix_fhir.json'));
seedPhoenixFHIR.base.hostname = configYaml.phoenix.host;
seedPhoenixFHIR.base.port 	  = configYaml.phoenix.port;

var ApiFHIR  = new Apiclient(seedPhoenixFHIR);

var controller = {
	get: {
		imagingManifest : function getImagingManifest(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var imagingManifestId = req.query._id;
			var author = req.query.author;
			var authoring_time = req.query.authoringTime;
			var endpoint = req.query.endpoint;
			var identifier = req.query.identifier;
			var imaging_study = req.query.imagingStudy;
			var patient = req.query.patient;
			var selected_study = req.query.selectedStudy;
			var offset = req.query.offset;
			var limit = req.query.limit;

			if(typeof offset !== 'undefined'){
				if(!validator.isEmpty(offset)){
					qString.offset = offset; 
				}else{
					res.json({"err_code": 1, "err_msg": "offset id is empty."});
				}
			}

			if(typeof limit !== 'undefined'){
				if(!validator.isEmpty(limit)){
					if(!validator.isInt(limit)){
						err_code = 2;
						err_msg = "limit must be number";
					} else{
						qString.limit = limit; 	
					}
				}else{
					res.json({"err_code": 1, "err_msg": "limit is empty."});
				}
			}
			
			if(typeof imagingManifestId !== 'undefined'){
				if(!validator.isEmpty(imagingManifestId)){
					qString._id = imagingManifestId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Imaging Manifest Id is required."});
				}
			}
			
			if(typeof author !== 'undefined'){
				if(!validator.isEmpty(author)){
					qString.author = author; 
				}else{
					res.json({"err_code": 1, "err_msg": "Author is empty."});
				}
			}

			if(typeof authoring_time !== 'undefined'){
				if(!validator.isEmpty(authoring_time)){
					if(!regex.test(authoring_time)){
						res.json({"err_code": 1, "err_msg": "Authoring time invalid format."});
					}else{
						qString.authoring_time = authoring_time; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Authoring time is empty."});
				}
			}

			if(typeof endpoint !== 'undefined'){
				if(!validator.isEmpty(endpoint)){
					qString.endpoint = endpoint; 
				}else{
					res.json({"err_code": 1, "err_msg": "Endpoint is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof imaging_study !== 'undefined'){
				if(!validator.isEmpty(imaging_study)){
					qString.imaging_study = imaging_study; 
				}else{
					res.json({"err_code": 1, "err_msg": "Imaging study is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}

			if(typeof selected_study !== 'undefined'){
				if(!validator.isEmpty(selected_study)){
					qString.selected_study = selected_study; 
				}else{
					res.json({"err_code": 1, "err_msg": "Selected study is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"ImagingManifest" : {
					"location": "%(apikey)s/ImagingManifest",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('ImagingManifest', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var imagingManifest = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(imagingManifest.err_code == 0){
								//cek jumdata dulu
								if(imagingManifest.data.length > 0){
									newImagingManifest = [];
									for(i=0; i < imagingManifest.data.length; i++){
										myEmitter.once("getIdentifier", function(imagingManifest, index, newImagingManifest, countImagingManifest){
											console.log(imagingManifest);
											//get identifier
											qString = {};
											qString.imaging_manifest_id = imagingManifest.id;
											seedPhoenixFHIR.path.GET = {
												"Identifier" : {
													"location": "%(apikey)s/Identifier",
													"query": qString
												}
											}
											var ApiFHIR = new Apiclient(seedPhoenixFHIR);
											ApiFHIR.get('Identifier', {"apikey": apikey}, {}, function(error, response, body){
												identifier = JSON.parse(body);
												if(identifier.err_code == 0){
													var objectImagingManifest = {};
													objectImagingManifest.resourceType = imagingManifest.resourceType;
													objectImagingManifest.id = imagingManifest.id;
													objectImagingManifest.identifier = identifier.data;
													objectImagingManifest.patient = imagingManifest.patient;
													objectImagingManifest.authoringTime = imagingManifest.authoringTime;
													objectImagingManifest.author = imagingManifest.author;
													objectImagingManifest.description = imagingManifest.description;
													objectImagingManifest.study = host + ':' + port + '/' + apikey + '/ImagingManifest/' +  imagingManifest.id + '/ImagingManifestStudy';
													
													newImagingManifest[index] = objectImagingManifest;
													
													if(index == countImagingManifest -1 ){
														res.json({"err_code": 0, "data":newImagingManifest});
													}
													/*myEmitter.once('getImagingManifestStudy', function(imagingManifest, index, newImagingManifest, countImagingManifest){
														qString = {};
														qString.imaging_manifest_id = imagingManifest.id;
														seedPhoenixFHIR.path.GET = {
															"ImagingManifestStudy" : {
																"location": "%(apikey)s/ImagingManifestStudy",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('ImagingManifestStudy', {"apikey": apikey}, {}, function(error, response, body){
															imagingManifestStudy = JSON.parse(body);
															if(imagingManifestStudy.err_code == 0){
																var objectImagingManifest = {};
																objectImagingManifest.resourceType = imagingManifest.resourceType;
																objectImagingManifest.id = imagingManifest.id;
																objectImagingManifest.identifier = imagingManifest.identifier;
																objectImagingManifest.patient = imagingManifest.patient;
																objectImagingManifest.authoringTime = imagingManifest.authoringTime;
																objectImagingManifest.author = imagingManifest.author;
																objectImagingManifest.description = imagingManifest.description;
																objectImagingManifest.study = imagingManifestStudy.data;
																
																newImagingManifest[index] = objectImagingManifest;
																if(index == countImagingManifest -1 ){
																	res.json({"err_code": 0, "data":newImagingManifest});
																}
															}else{
																res.json(imagingManifestStudy);			
															}
														})
													})
													myEmitter.emit('getImagingManifestStudy', objectImagingManifest, index, newImagingManifest, countImagingManifest);*/
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", imagingManifest.data[i], i, newImagingManifest, imagingManifest.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Imaging Manifest is empty."});	
								}
							}else{
								res.json(imagingManifest);
							}
						}
					});
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		},
		imagingManifestStudy: function getImagingManifestStudy(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifest_id;
			var imagingManifestStudyId = req.params.imaging_manifest_study_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "IMAGING_MANIFEST_ID|" + imagingManifestId, 'IMAGING_MANIFEST', function(resImagingManifest){
						if(resImagingManifest.err_code > 0){
							if(typeof imagingManifestStudyId !== 'undefined' && !validator.isEmpty(imagingManifestStudyId)){
								checkUniqeValue(apikey, "STUDY_ID|" + imagingManifestStudyId, 'IMAGING_MANIFEST_STUDY', function(resImagingManifestStudyID){
									if(resImagingManifestStudyID.err_code > 0){
										//get imagingManifestStudy
										qString = {};
										qString.imaging_manifest_id = imagingManifestId;
										qString._id = imagingManifestStudyId;
										seedPhoenixFHIR.path.GET = {
											"ImagingManifestStudy" : {
												"location": "%(apikey)s/ImagingManifestStudy",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImagingManifestStudy', {"apikey": apikey}, {}, function(error, response, body){
											imagingManifestStudy = JSON.parse(body);
											if(imagingManifestStudy.err_code == 0){
												//res.json({"err_code": 0, "data":imagingManifestStudy.data});	
												if(imagingManifestStudy.data.length > 0){
													newImagingManifestStudy = [];
													for(i=0; i < imagingManifestStudy.data.length; i++){
														myEmitter.once('getImagingManifestStudyEndpoint', function(imagingManifestStudy, index, newImagingManifestStudy, countImagingManifestStudy){
															qString = {};
															qString.study_id = imagingManifestStudy.id;
															seedPhoenixFHIR.path.GET = {
																"ImagingManifestStudyEndpoint" : {
																	"location": "%(apikey)s/ImagingManifestStudyEndpoint",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('ImagingManifestStudyEndpoint', {"apikey": apikey}, {}, function(error, response, body){
																imagingManifestStudyEndpoint = JSON.parse(body);
																if(imagingManifestStudyEndpoint.err_code == 0){
																	var objectImagingManifestStudy = {};
																	objectImagingManifestStudy.id = imagingManifestStudy.id;
																	objectImagingManifestStudy.uid = imagingManifestStudy.uid;
																	objectImagingManifestStudy.endpoint = imagingManifestStudyEndpoint.data;
																	objectImagingManifestStudy.series = host + ':' + port + '/' + apikey + '/ImagingManifestStudy/' +  imagingManifestStudy.id + '/ImagingManifestSeries';

																	newImagingManifestStudy[index] = objectImagingManifestStudy;

																	if(index == countImagingManifestStudy -1 ){
																		res.json({"err_code": 0, "data":newImagingManifestStudy});	
																	}
																}else{
																	res.json(imagingManifestStudyEndpoint);			
																}
															})
														})
														myEmitter.emit('getImagingManifestStudyEndpoint', imagingManifestStudy.data[i], i, newImagingManifestStudy, imagingManifestStudy.data.length);

													}
												}else{
													res.json({"err_code": 2, "err_msg": "imaging Manifest Series is empty."});	
												}
												
											}else{
												res.json(imagingManifestStudy);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Imaging Manifest Study Id not found"});		
									}
								})
							}else{
								//get imagingManifestStudy
								qString = {};
								qString.imaging_manifest_id = imagingManifestId;
								seedPhoenixFHIR.path.GET = {
									"ImagingManifestStudy" : {
										"location": "%(apikey)s/ImagingManifestStudy",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ImagingManifestStudy', {"apikey": apikey}, {}, function(error, response, body){
									imagingManifestStudy = JSON.parse(body);
									if(imagingManifestStudy.err_code == 0){
										//res.json({"err_code": 0, "data":imagingManifestStudy.data});	
										if(imagingManifestStudy.data.length > 0){
											newImagingManifestStudy = [];
											for(i=0; i < imagingManifestStudy.data.length; i++){
												myEmitter.once('getImagingManifestStudyEndpoint', function(imagingManifestStudy, index, newImagingManifestStudy, countImagingManifestStudy){
													qString = {};
													qString.study_id = imagingManifestStudy.id;
													seedPhoenixFHIR.path.GET = {
														"ImagingManifestStudyEndpoint" : {
															"location": "%(apikey)s/ImagingManifestStudyEndpoint",
															"query": qString
														}
													}

													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get('ImagingManifestStudyEndpoint', {"apikey": apikey}, {}, function(error, response, body){
														imagingManifestStudyEndpoint = JSON.parse(body);
														if(imagingManifestStudyEndpoint.err_code == 0){
															var objectImagingManifestStudy = {};
															objectImagingManifestStudy.id = imagingManifestStudy.id;
															objectImagingManifestStudy.uid = imagingManifestStudy.uid;
															objectImagingManifestStudy.endpoint = imagingManifestStudyEndpoint.data;
															objectImagingManifestStudy.series = host + ':' + port + '/' + apikey + '/ImagingManifestStudy/' +  imagingManifestStudy.id + '/ImagingManifestSeries';

															newImagingManifestStudy[index] = objectImagingManifestStudy;

															if(index == countImagingManifestStudy -1 ){
																res.json({"err_code": 0, "data":newImagingManifestStudy});	
															}
														}else{
															res.json(imagingManifestStudyEndpoint);			
														}
													})
												})
												myEmitter.emit('getImagingManifestStudyEndpoint', imagingManifestStudy.data[i], i, newImagingManifestStudy, imagingManifestStudy.data.length);

											}
										}else{
											res.json({"err_code": 2, "err_msg": "imaging Manifest Series is empty."});	
										}
									}else{
										res.json(imagingManifestStudy);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Imaging Manifest Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		imagingManifestSeries: function getImagingManifestSeries(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifes_study_id;
			var imagingManifestSeriesId = req.params.imaging_manifest_series_id;
			console.log(req.params);
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "STUDY_ID|" + imagingManifestId, 'IMAGING_MANIFEST_STUDY', function(resImagingManifest){
						if(resImagingManifest.err_code > 0){
							if(typeof imagingManifestSeriesId !== 'undefined' && !validator.isEmpty(imagingManifestSeriesId)){
								checkUniqeValue(apikey, "SERIES_ID|" + imagingManifestSeriesId, 'IMAGING_MANIFEST_SERIES', function(resImagingManifestSeriesID){
									if(resImagingManifestSeriesID.err_code > 0){
										//get imagingManifestSeries
										qString = {};
										qString.imaging_manifest_study_id = imagingManifestId;
										qString._id = imagingManifestSeriesId;
										seedPhoenixFHIR.path.GET = {
											"ImagingManifestSeries" : {
												"location": "%(apikey)s/ImagingManifestSeries",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImagingManifestSeries', {"apikey": apikey}, {}, function(error, response, body){
											imagingManifestSeries = JSON.parse(body);
											if(imagingManifestSeries.err_code == 0){
												//res.json({"err_code": 0, "data":imagingManifestSeries.data});	
												if(imagingManifestSeries.data.length > 0){
													newImagingManifestSeries = [];
													for(i=0; i < imagingManifestSeries.data.length; i++){
														myEmitter.once('getImagingManifestSeriesEndpoint', function(imagingManifestSeries, index, newImagingManifestSeries, countImagingManifestSeries){
															qString = {};
															qString.series_id = imagingManifestSeries.id;
															seedPhoenixFHIR.path.GET = {
																"ImagingManifestSeriesEndpoint" : {
																	"location": "%(apikey)s/ImagingManifestSeriesEndpoint",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('ImagingManifestSeriesEndpoint', {"apikey": apikey}, {}, function(error, response, body){
																imagingManifestSeriesEndpoint = JSON.parse(body);
																if(imagingManifestSeriesEndpoint.err_code == 0){
																	var objectImagingManifestSeries = {};
																	objectImagingManifestSeries.id = imagingManifestSeries.id;
																	objectImagingManifestSeries.uid = imagingManifestSeries.uid;
																	objectImagingManifestSeries.endpoint = imagingManifestSeriesEndpoint.data;
																	objectImagingManifestSeries.instance = host + ':' + port + '/' + apikey + '/ImagingManifestSeries/' +  imagingManifestSeries.id + '/ImagingManifestInstance';

																	newImagingManifestSeries[index] = objectImagingManifestSeries;

																	if(index == countImagingManifestSeries -1 ){
																		res.json({"err_code": 0, "data":newImagingManifestSeries});	
																	}
																}else{
																	res.json(imagingManifestSeriesEndpoint);			
																}
															})
														})
														myEmitter.emit('getImagingManifestSeriesEndpoint', imagingManifestSeries.data[i], i, newImagingManifestSeries, imagingManifestSeries.data.length);

													}
												}else{
													res.json({"err_code": 2, "err_msg": "imaging Manifest Series is empty."});	
												}
											}else{
												res.json(imagingManifestSeries);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Imaging Manifest Series Id not found"});		
									}
								})
							}else{
								//get imagingManifestSeries
								qString = {};
								qString.imaging_manifest_study_id = imagingManifestId;
								seedPhoenixFHIR.path.GET = {
									"ImagingManifestSeries" : {
										"location": "%(apikey)s/ImagingManifestSeries",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ImagingManifestSeries', {"apikey": apikey}, {}, function(error, response, body){
									imagingManifestSeries = JSON.parse(body);
									console.log(imagingManifestSeries);
									if(imagingManifestSeries.err_code == 0){
										//res.json({"err_code": 0, "data":imagingManifestSeries.data});	
										if(imagingManifestSeries.data.length > 0){
											newImagingManifestSeries = [];
											for(i=0; i < imagingManifestSeries.data.length; i++){
												myEmitter.once('getImagingManifestSeriesEndpoint', function(imagingManifestSeries, index, newImagingManifestSeries, countImagingManifestSeries){
													qString = {};
													qString.series_id = imagingManifestSeries.id;
													seedPhoenixFHIR.path.GET = {
														"ImagingManifestSeriesEndpoint" : {
															"location": "%(apikey)s/ImagingManifestSeriesEndpoint",
															"query": qString
														}
													}

													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get('ImagingManifestSeriesEndpoint', {"apikey": apikey}, {}, function(error, response, body){
														imagingManifestSeriesEndpoint = JSON.parse(body);
														if(imagingManifestSeriesEndpoint.err_code == 0){
															var objectImagingManifestSeries = {};
															objectImagingManifestSeries.id = imagingManifestSeries.id;
															objectImagingManifestSeries.uid = imagingManifestSeries.uid;
															objectImagingManifestSeries.endpoint = imagingManifestSeriesEndpoint.data;
															objectImagingManifestSeries.instance = host + ':' + port + '/' + apikey + '/ImagingManifestSeries/' +  imagingManifestSeries.id + '/ImagingManifestInstance';

															newImagingManifestSeries[index] = objectImagingManifestSeries;

															if(index == countImagingManifestSeries -1 ){
																res.json({"err_code": 0, "data":newImagingManifestSeries});	
															}
														}else{
															res.json(imagingManifestSeriesEndpoint);			
														}
													})
												})
												myEmitter.emit('getImagingManifestSeriesEndpoint', imagingManifestSeries.data[i], i, newImagingManifestSeries, imagingManifestSeries.data.length);

											}
										}else{
											res.json({"err_code": 2, "err_msg": "imaging Manifest Series is empty."});	
										}
									}else{
										res.json(imagingManifestSeries);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Imaging Manifest Study Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		imagingManifestInstance: function getImagingManifestInstance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifest_series_id;
			var imagingManifestInstanceId = req.params.imaging_manifest_instance_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "SERIES_ID|" + imagingManifestId, 'IMAGING_MANIFEST_SERIES', function(resImagingManifest){
						if(resImagingManifest.err_code > 0){
							if(typeof imagingManifestInstanceId !== 'undefined' && !validator.isEmpty(imagingManifestInstanceId)){
								checkUniqeValue(apikey, "INSTANCE_ID|" + imagingManifestInstanceId, 'IMAGING_MANIFEST_INSTANCE', function(resImagingManifestInstanceID){
									if(resImagingManifestInstanceID.err_code > 0){
										//get imagingManifestInstance
										qString = {};
										qString.imaging_manifest_series_id = imagingManifestId;
										qString._id = imagingManifestInstanceId;
										seedPhoenixFHIR.path.GET = {
											"ImagingManifestInstance" : {
												"location": "%(apikey)s/ImagingManifestInstance",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImagingManifestInstance', {"apikey": apikey}, {}, function(error, response, body){
											imagingManifestInstance = JSON.parse(body);
											if(imagingManifestInstance.err_code == 0){
												res.json({"err_code": 0, "data":imagingManifestInstance.data});	
											}else{
												res.json(imagingManifestInstance);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Imaging Manifest Instance Id not found"});		
									}
								})
							}else{
								//get imagingManifestInstance
								qString = {};
								qString.imaging_manifest_series_id = imagingManifestId;
								seedPhoenixFHIR.path.GET = {
									"ImagingManifestInstance" : {
										"location": "%(apikey)s/ImagingManifestInstance",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ImagingManifestInstance', {"apikey": apikey}, {}, function(error, response, body){
									imagingManifestInstance = JSON.parse(body);
									if(imagingManifestInstance.err_code == 0){
										res.json({"err_code": 0, "data":imagingManifestInstance.data});	
									}else{
										res.json(imagingManifestInstance);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Imaging Manifest Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
	},
	post: {
		imagingManifest : function addImagingManifest(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");

      var err_code = 0;
      var err_msg = "";
			
			if(typeof req.body.identifier.use !== 'undefined'){
				identifierUseCode =  req.body.identifier.use.trim().toLowerCase();
				if(validator.isEmpty(identifierUseCode)){
					err_code = 2;
					err_msg = "Identifier Use is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'use' in json identifier request.";
			} 

			//type code
			if(typeof req.body.identifier.type !== 'undefined'){
				identifierTypeCode =  req.body.identifier.type.trim().toUpperCase();
				if(validator.isEmpty(identifierTypeCode)){
					err_code = 2;
					err_msg = "Identifier Type is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json identifier request.";
			} 

			//identifier uniqe value
			if(typeof req.body.identifier.value !== 'undefined'){
				identifierValue =  req.body.identifier.value.trim();
				if(validator.isEmpty(identifierValue)){
					err_code = 2;
					err_msg = "Identifier Value is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value' in json identifier request.";
			}

			//identifier period start
			if(typeof req.body.identifier.period !== 'undefined'){
				period = req.body.identifier.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					identifierPeriodStart = arrPeriod[0];
					identifierPeriodEnd = arrPeriod[1];

					if(!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)){
						err_code = 2;
						err_msg = "Identifier Period invalid date format.";
					}	
				}

			}else{
				err_code = 1;
				err_msg = "Please add key 'period' in json identifier request.";
			}

/*
patient|patient|||
authoringTime|authoringTime|date||
author.practitioner|authorPractitioner|||
author.device|authorDevice|||
author.organization|authorOrganization|||
author.patient|authorPatient|||
author.relatedPerson|authorRelatedPerson|||
description|description|||
study.uid|studyUid||nn|
study.imagingStudy|studyImagingStudy|||
study.endpoint|studyEndpoint|||
study.series.uid|studySeriesUid||nn|
study.series.endpoint|studySeriesEndpoint|||
study.series.instance.sopClass|studySeriesInstanceSopClass||nn|
study.series.instance.uid|studySeriesInstanceUid||nn|
*/
			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Imaging Manifest request.";
			}

			if(typeof req.body.authoringTime !== 'undefined'){
				var authoringTime =  req.body.authoringTime;
				if(validator.isEmpty(authoringTime)){
					authoringTime = "";
				}else{
					if(!regex.test(authoringTime)){
						err_code = 2;
						err_msg = "Imaging Manifest authoring time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'authoring time' in json Imaging Manifest request.";
			}

			if(typeof req.body.author.practitioner !== 'undefined'){
				var authorPractitioner =  req.body.author.practitioner.trim().toLowerCase();
				if(validator.isEmpty(authorPractitioner)){
					authorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author practitioner' in json Imaging Manifest request.";
			}

			if(typeof req.body.author.device !== 'undefined'){
				var authorDevice =  req.body.author.device.trim().toLowerCase();
				if(validator.isEmpty(authorDevice)){
					authorDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author device' in json Imaging Manifest request.";
			}

			if(typeof req.body.author.organization !== 'undefined'){
				var authorOrganization =  req.body.author.organization.trim().toLowerCase();
				if(validator.isEmpty(authorOrganization)){
					authorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author organization' in json Imaging Manifest request.";
			}

			if(typeof req.body.author.patient !== 'undefined'){
				var authorPatient =  req.body.author.patient.trim().toLowerCase();
				if(validator.isEmpty(authorPatient)){
					authorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author patient' in json Imaging Manifest request.";
			}

			if(typeof req.body.author.relatedPerson !== 'undefined'){
				var authorRelatedPerson =  req.body.author.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(authorRelatedPerson)){
					authorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author related person' in json Imaging Manifest request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					description = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Imaging Manifest request.";
			}

			if(typeof req.body.study.uid !== 'undefined'){
				var studyUid =  req.body.study.uid.trim().toLowerCase();
				if(validator.isEmpty(studyUid)){
					err_code = 2;
					err_msg = "Imaging Manifest study uid is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study uid' in json Imaging Manifest request.";
			}

			if(typeof req.body.study.imagingStudy !== 'undefined'){
				var studyImagingStudy =  req.body.study.imagingStudy.trim().toLowerCase();
				if(validator.isEmpty(studyImagingStudy)){
					studyImagingStudy = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study imaging study' in json Imaging Manifest request.";
			}

			if(typeof req.body.study.endpoint !== 'undefined'){
				var studyEndpoint =  req.body.study.endpoint.trim().toLowerCase();
				if(validator.isEmpty(studyEndpoint)){
					studyEndpoint = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study endpoint' in json Imaging Manifest request.";
			}

			if(typeof req.body.study.series.uid !== 'undefined'){
				var studySeriesUid =  req.body.study.series.uid.trim().toLowerCase();
				if(validator.isEmpty(studySeriesUid)){
					err_code = 2;
					err_msg = "Imaging Manifest study series uid is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study series uid' in json Imaging Manifest request.";
			}

			if(typeof req.body.study.series.endpoint !== 'undefined'){
				var studySeriesEndpoint =  req.body.study.series.endpoint.trim().toLowerCase();
				if(validator.isEmpty(studySeriesEndpoint)){
					studySeriesEndpoint = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study series endpoint' in json Imaging Manifest request.";
			}

			if(typeof req.body.study.series.instance.sopClass !== 'undefined'){
				var studySeriesInstanceSopClass =  req.body.study.series.instance.sopClass.trim().toLowerCase();
				if(validator.isEmpty(studySeriesInstanceSopClass)){
					err_code = 2;
					err_msg = "Imaging Manifest study series instance sop class is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study series instance sop class' in json Imaging Manifest request.";
			}

			if(typeof req.body.study.series.instance.uid !== 'undefined'){
				var studySeriesInstanceUid =  req.body.study.series.instance.uid.trim().toLowerCase();
				if(validator.isEmpty(studySeriesInstanceUid)){
					err_code = 2;
					err_msg = "Imaging Manifest study series instance uid is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study series instance uid' in json Imaging Manifest request.";
			}

			if(err_code == 0){
			//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
							if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid	
										//event emiter
										myEmitter.prependOnceListener('checkIdentifierValue', function() {

												checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
													if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada

														//proses insert

														//set uniqe id
														var unicId = uniqid.time();
														var identifierId = 'ide' + unicId;
														var imagingManifestId = 'ima' + unicId;
														var imagingManifestStudyId = 'ims' + unicId;
														var imagingManifestSeriesId = 'ime' + unicId;
														var imagingManifestInstanceId = 'imi' + unicId;
														
														dataImagingManifest = {
															"imaging_manifest_id" : imagingManifestId,
															"identifier" : identifierId,
															"patient" : patient,
															"authoring_time" : authoringTime,
															"author_practitioner" : authorPractitioner,
															"author_device" : authorDevice,
															"author_organization" : authorOrganization,
															"author_patient" : authorPatient,
															"author_related_person" : authorRelatedPerson,
															"description" :	description
														}
														console.log(dataImagingManifest);
														ApiFHIR.post('imagingManifest', {"apikey": apikey}, {body: dataImagingManifest, json: true}, function(error, response, body){
															imagingManifest = body;
															if(imagingManifest.err_code > 0){
																res.json(imagingManifest);	
																console.log("ok");
															}
														});

														//identifier
														/*var identifierSystem = identifierId;
														dataIdentifier = {
																							"id": identifierId,
																							"use": identifierUseCode,
																							"type": identifierTypeCode,
																							"system": identifierSystem,
																							"value": identifierValue,
																							"period_start": identifierPeriodStart,
																							"period_end": identifierPeriodEnd,
																							"imaging_manifest_id": imagingManifestId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})		*/									
										
														//ImagingManifestStudy
														dataImagingManifestStudy = {
															"study_id" : imagingManifestStudyId,
															"uid" : studyUid,
															"imaging_study" : studyImagingStudy,
															"imaging_manifest_id" : imagingManifestId
														};
														ApiFHIR.post('imagingManifestStudy', {"apikey": apikey}, {body: dataImagingManifestStudy, json: true}, function(error, response, body){
															imagingManifestStudy = body;
															if(imagingManifestStudy.err_code > 0){
																res.json(imagingManifestStudy);	
																console.log("ok");
															}
														});
														
														//ImagingManifestImage
														dataImagingManifestSeries = {
															"series_id" : imagingManifestSeriesId,
															"uid" : studySeriesUid,
															"study_id" : imagingManifestStudyId
														};
														ApiFHIR.post('imagingManifestSeries', {"apikey": apikey}, {body: dataImagingManifestSeries, json: true}, function(error, response, body){
															imagingManifestImage = body;
															if(imagingManifestImage.err_code > 0){
																res.json(imagingManifestImage);	
																console.log("ok");
															}
														});
														
														var dataImagingManifestInstance = {
															"instance_id": imagingManifestInstanceId,
															"sop_class" : studySeriesInstanceSopClass,
															"uid" : studySeriesInstanceUid,
															"series_id" : imagingManifestSeriesId
														}

														ApiFHIR.post('imagingManifestInstance', {"apikey": apikey}, {body: dataImagingManifestInstance, json:true}, function(error, response, body){
															imagingManifestInstance = body;
															if(imagingManifestInstance.err_code > 0){
																res.json(imagingManifestInstance);	
																console.log("ok");
															}
														});											
															
														if(studyEndpoint !== ""){
															console.log("1" + studyEndpoint);
															dataStudyEndpoint = {
																"endpoint_id" : studyEndpoint,
																"imaging_manifest_study_id" : imagingManifestStudyId
															}
															ApiFHIR.put('endpoint', {"apikey": apikey, "_id": studyEndpoint, "endpoint_id": studyEndpoint}, {body: dataStudyEndpoint, json: true}, function(error, response, body){
																returnStudyEndpoint = body;
																if(returnStudyEndpoint.err_code > 0){
																	res.json(returnStudyEndpoint);	
																	console.log("add reference study endpoint : " + studyEndpoint);
																}
															});
														}
														
														if(studySeriesEndpoint !== ""){
															console.log("2" + studySeriesEndpoint);
															dataStudySeriesEndpoint = {
																"endpoint_id" : studySeriesEndpoint,
																"imaging_manifest_study_series_id" : imagingManifestSeriesId
															}
															ApiFHIR.put('endpoint', {"apikey": apikey, "_id": studySeriesEndpoint, "endpoint_id": studySeriesEndpoint}, {body: dataStudySeriesEndpoint, json: true}, function(error, response, body){
																returnStudySeriesEndpoint = body;
																if(returnStudySeriesEndpoint.err_code > 0){
																	res.json(returnStudySeriesEndpoint);	
																	console.log("add reference study series endpoint : " + studySeriesEndpoint);
																}
															});
														}
/*--------*/														
														res.json({"err_code": 0, "err_msg": "Imaging Manifest has been add.", "data": [{"_id": imagingManifestId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek value
										/*
patient|patient
authorPractitioner|Practitioner
authorDevice|Device
authorOrganization|Organization
authorPatient|patient
authorRelatedPerson|Related_Person
studyImagingStudy|Imaging_Study
studyEndpoint|Endpoint
studySeriesEndpoint|Endpoint
*/
										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkAuthorPractitioner', function () {
											if (!validator.isEmpty(authorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + authorPractitioner, 'PRACTITIONER', function (resAuthorPractitioner) {
													if (resAuthorPractitioner.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkAuthorDevice', function () {
											if (!validator.isEmpty(authorDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + authorDevice, 'DEVICE', function (resAuthorDevice) {
													if (resAuthorDevice.err_code > 0) {
														myEmitter.emit('checkAuthorPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkAuthorOrganization', function () {
											if (!validator.isEmpty(authorOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + authorOrganization, 'ORGANIZATION', function (resAuthorOrganization) {
													if (resAuthorOrganization.err_code > 0) {
														myEmitter.emit('checkAuthorDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorDevice');
											}
										})

										myEmitter.prependOnceListener('checkAuthorPatient', function () {
											if (!validator.isEmpty(authorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + authorPatient, 'PATIENT', function (resAuthorPatient) {
													if (resAuthorPatient.err_code > 0) {
														myEmitter.emit('checkAuthorOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorOrganization');
											}
										})

										myEmitter.prependOnceListener('checkAuthorRelatedPerson', function () {
											if (!validator.isEmpty(authorRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + authorRelatedPerson, 'RELATED_PERSON', function (resAuthorRelatedPerson) {
													if (resAuthorRelatedPerson.err_code > 0) {
														myEmitter.emit('checkAuthorPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorPatient');
											}
										})

										myEmitter.prependOnceListener('checkStudyImagingStudy', function () {
											if (!validator.isEmpty(studyImagingStudy)) {
												checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + studyImagingStudy, 'IMAGING_STUDY', function (resStudyImagingStudy) {
													if (resStudyImagingStudy.err_code > 0) {
														myEmitter.emit('checkAuthorRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Study imaging study id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkStudyEndpoint', function () {
											if (!validator.isEmpty(studyEndpoint)) {
												checkUniqeValue(apikey, "ENDPOINT_ID|" + studyEndpoint, 'ENDPOINT', function (resStudyEndpoint) {
													if (resStudyEndpoint.err_code > 0) {
														myEmitter.emit('checkStudyImagingStudy');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Study endpoint id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStudyImagingStudy');
											}
										})

										if (!validator.isEmpty(studySeriesEndpoint)) {
											checkUniqeValue(apikey, "ENDPOINT_ID|" + studySeriesEndpoint, 'ENDPOINT', function (resStudySeriesEndpoint) {
												if (resStudySeriesEndpoint.err_code > 0) {
													myEmitter.emit('checkStudyEndpoint');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Study series endpoint id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkStudyEndpoint');
										}
										
									}else{
										res.json({"err_code": 502, "err_msg": "Identifier type code not found"});		
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Identifier use code not found"});
							}
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}	
			
		},
		imagingManifestStudy: function addImagingManifestStudy(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifest_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof imagingManifestId !== 'undefined'){
				if(validator.isEmpty(imagingManifestId)){
					err_code = 2;
					err_msg = "Imaging Manifest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest id is required";
			}

			if(typeof req.body.uid !== 'undefined'){
				var studyUid =  req.body.uid.trim().toLowerCase();
				if(validator.isEmpty(studyUid)){
					err_code = 2;
					err_msg = "Imaging Manifest study uid is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study uid' in json Imaging Manifest request.";
			}

			if(typeof req.body.imagingStudy !== 'undefined'){
				var studyImagingStudy =  req.body.imagingStudy.trim().toLowerCase();
				if(validator.isEmpty(studyImagingStudy)){
					studyImagingStudy = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study imaging study' in json Imaging Manifest request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkImagingManifestID', function(){
							checkUniqeValue(apikey, "IMAGING_MANIFEST_ID|" + imagingManifestId, 'IMAGING_MANIFEST', function(resImagingManifestID){
								if(resImagingManifestID.err_code > 0){
									var unicId = uniqid.time();
									var imagingManifestStudyId = 'ims' + unicId;
									//ImagingManifestStudy
									dataImagingManifestStudy = {
										"study_id" : imagingManifestStudyId,
										"uid" : studyUid,
										"imaging_study" : studyImagingStudy,
										"imaging_manifest_id" : imagingManifestId
									}
									ApiFHIR.post('imagingManifestStudy', {"apikey": apikey}, {body: dataImagingManifestStudy, json: true}, function(error, response, body){
										imagingManifestStudy = body;
										if(imagingManifestStudy.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Imaging Manifest Study has been add in this Imaging Manifest.", "data": imagingManifestStudy.data});
										}else{
											res.json(imagingManifestStudy);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Imaging Manifest Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(studyImagingStudy)) {
							checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + studyImagingStudy, 'IMAGING_STUDY', function (resStudyImagingStudy) {
								if (resStudyImagingStudy.err_code > 0) {
									myEmitter.emit('checkImagingManifestID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Study imaging study id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkImagingManifestID');
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		imagingManifestSeries: function addImagingManifestSeries(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifest_study_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof imagingManifestId !== 'undefined'){
				if(validator.isEmpty(imagingManifestId)){
					err_code = 2;
					err_msg = "Imaging Manifest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest id is required";
			}
			
			if(typeof req.body.uid !== 'undefined'){
				var studySeriesUid =  req.body.uid.trim().toLowerCase();
				if(validator.isEmpty(studySeriesUid)){
					err_code = 2;
					err_msg = "Imaging Manifest study series uid is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study series uid' in json Imaging Manifest request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "IMAGING_MANIFEST_ID|" + imagingManifestId, 'IMAGING_MANIFEST', function(resImagingManifestID){
							if(resImagingManifestID.err_code > 0){
								var unicId = uniqid.time();
								var imagingManifestSeriesId = 'ime' + unicId;
								//ImagingManifestSeries
								dataImagingManifestSeries = {
									"series_id" : imagingManifestSeriesId,
									"uid" : studySeriesUid,
									"study_id" : imagingManifestId
								}
								ApiFHIR.post('imagingManifestSeries', {"apikey": apikey}, {body: dataImagingManifestSeries, json: true}, function(error, response, body){
									imagingManifestSeries = body;
									if(imagingManifestSeries.err_code == 0){
										res.json({"err_code": 0, "err_msg": "Imaging Manifest Series has been add in this Imaging Manifest.", "data": imagingManifestSeries.data});
									}else{
										res.json(imagingManifestSeries);	
									}
								});
							}else{
								res.json({"err_code": 504, "err_msg": "Imaging Manifest Study Id not found"});		
							}
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		imagingManifestInstance: function addImagingManifestInstance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifest_series_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof imagingManifestId !== 'undefined'){
				if(validator.isEmpty(imagingManifestId)){
					err_code = 2;
					err_msg = "Imaging Manifest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest id is required";
			}

			if(typeof req.body.sopClass !== 'undefined'){
				var studySeriesInstanceSopClass =  req.body.sopClass.trim().toLowerCase();
				if(validator.isEmpty(studySeriesInstanceSopClass)){
					err_code = 2;
					err_msg = "Imaging Manifest study series instance sop class is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study series instance sop class' in json Imaging Manifest request.";
			}

			if(typeof req.body.uid !== 'undefined'){
				var studySeriesInstanceUid =  req.body.uid.trim().toLowerCase();
				if(validator.isEmpty(studySeriesInstanceUid)){
					err_code = 2;
					err_msg = "Imaging Manifest study series instance uid is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study series instance uid' in json Imaging Manifest request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "SERIES_ID|" + imagingManifestId, 'IMAGING_MANIFEST_SERIES', function(resImagingManifestID){
							if(resImagingManifestID.err_code > 0){
								var unicId = uniqid.time();
								var imagingManifestInstanceId = 'imi' + unicId;
								//ImagingManifestInstance
								dataImagingManifestInstance = {
									"instance_id": imagingManifestInstanceId,
									"sop_class" : studySeriesInstanceSopClass,
									"uid" : studySeriesInstanceUid,
									"series_id" : imagingManifestId
								}
								ApiFHIR.post('imagingManifestInstance', {"apikey": apikey}, {body: dataImagingManifestInstance, json: true}, function(error, response, body){
									imagingManifestInstance = body;
									if(imagingManifestInstance.err_code == 0){
										res.json({"err_code": 0, "err_msg": "Imaging Manifest Instance has been add in this Imaging Manifest.", "data": imagingManifestInstance.data});
									}else{
										res.json(imagingManifestInstance);	
									}
								});
							}else{
								res.json({"err_code": 504, "err_msg": "Imaging Manifest Series Id not found"});		
							}
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
	},
	put: {
		imagingManifest : function putImagingManifest(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var imagingManifestId = req.params.imaging_manifest_id;

      var err_code = 0;
      var err_msg = "";
      var dataImagingManifest = {};

			if(typeof imagingManifestId !== 'undefined'){
				if(validator.isEmpty(imagingManifestId)){
					err_code = 2;
					err_msg = "Imaging Manifest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest id is required";
			}

			/*
			var patient  = req.body.patient;
			var authoring_time  = req.body.authoring_time;
			var author_practitioner  = req.body.author_practitioner;
			var author_device  = req.body.author_device;
			var author_organization  = req.body.author_organization;
			var author_patient  = req.body.author_patient;
			var author_related_person  = req.body.author_related_person;
			var description  = req.body.description;
			*/
			
			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataImagingManifest.patient = "";
				}else{
					dataImagingManifest.patient = patient;
				}
			}else{
			  patient = "";
			}

			if(typeof req.body.authoringTime !== 'undefined' && req.body.authoringTime !== ""){
				var authoringTime =  req.body.authoringTime;
				if(validator.isEmpty(authoringTime)){
					err_code = 2;
					err_msg = "imaging manifest authoring time is required.";
				}else{
					if(!regex.test(authoringTime)){
						err_code = 2;
						err_msg = "imaging manifest authoring time invalid date format.";	
					}else{
						dataImagingManifest.authoring_time = authoringTime;
					}
				}
			}else{
			  authoringTime = "";
			}

			if(typeof req.body.author.practitioner !== 'undefined' && req.body.author.practitioner !== ""){
				var authorPractitioner =  req.body.author.practitioner.trim().toLowerCase();
				if(validator.isEmpty(authorPractitioner)){
					dataImagingManifest.author_practitioner = "";
				}else{
					dataImagingManifest.author_practitioner = authorPractitioner;
				}
			}else{
			  authorPractitioner = "";
			}

			if(typeof req.body.author.device !== 'undefined' && req.body.author.device !== ""){
				var authorDevice =  req.body.author.device.trim().toLowerCase();
				if(validator.isEmpty(authorDevice)){
					dataImagingManifest.author_device = "";
				}else{
					dataImagingManifest.author_device = authorDevice;
				}
			}else{
			  authorDevice = "";
			}

			if(typeof req.body.author.organization !== 'undefined' && req.body.author.organization !== ""){
				var authorOrganization =  req.body.author.organization.trim().toLowerCase();
				if(validator.isEmpty(authorOrganization)){
					dataImagingManifest.author_organization = "";
				}else{
					dataImagingManifest.author_organization = authorOrganization;
				}
			}else{
			  authorOrganization = "";
			}

			if(typeof req.body.author.patient !== 'undefined' && req.body.author.patient !== ""){
				var authorPatient =  req.body.author.patient.trim().toLowerCase();
				if(validator.isEmpty(authorPatient)){
					dataImagingManifest.author_patient = "";
				}else{
					dataImagingManifest.author_patient = authorPatient;
				}
			}else{
			  authorPatient = "";
			}

			if(typeof req.body.author.relatedPerson !== 'undefined' && req.body.author.relatedPerson !== ""){
				var authorRelatedPerson =  req.body.author.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(authorRelatedPerson)){
					dataImagingManifest.author_related_person = "";
				}else{
					dataImagingManifest.author_related_person = authorRelatedPerson;
				}
			}else{
			  authorRelatedPerson = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					dataImagingManifest.description = "";
				}else{
					dataImagingManifest.description = description;
				}
			}else{
			  description = "";
			}

			
			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkImagingManifestId', function(){
						checkUniqeValue(apikey, "IMAGING_MANIFEST_ID|" + imagingManifestId, 'IMAGING_MANIFEST', function(resImagingManifestId){
							if(resImagingManifestId.err_code > 0){
								ApiFHIR.put('imagingManifest', {"apikey": apikey, "_id": imagingManifestId}, {body: dataImagingManifest, json: true}, function(error, response, body){
									imagingManifest = body;
									if(imagingManifest.err_code > 0){
										res.json(imagingManifest);	
									}else{
										res.json({"err_code": 0, "err_msg": "Imaging Manifest has been update.", "data": [{"_id": imagingManifestId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Imaging Manifest Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkPatient', function () {
						if (!validator.isEmpty(patient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
								if (resPatient.err_code > 0) {
									myEmitter.emit('checkImagingManifestId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkImagingManifestId');
						}
					})

					myEmitter.prependOnceListener('checkAuthorPractitioner', function () {
						if (!validator.isEmpty(authorPractitioner)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + authorPractitioner, 'PRACTITIONER', function (resAuthorPractitioner) {
								if (resAuthorPractitioner.err_code > 0) {
									myEmitter.emit('checkPatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Author practitioner id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPatient');
						}
					})

					myEmitter.prependOnceListener('checkAuthorDevice', function () {
						if (!validator.isEmpty(authorDevice)) {
							checkUniqeValue(apikey, "DEVICE_ID|" + authorDevice, 'DEVICE', function (resAuthorDevice) {
								if (resAuthorDevice.err_code > 0) {
									myEmitter.emit('checkAuthorPractitioner');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Author device id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAuthorPractitioner');
						}
					})

					myEmitter.prependOnceListener('checkAuthorOrganization', function () {
						if (!validator.isEmpty(authorOrganization)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + authorOrganization, 'ORGANIZATION', function (resAuthorOrganization) {
								if (resAuthorOrganization.err_code > 0) {
									myEmitter.emit('checkAuthorDevice');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Author organization id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAuthorDevice');
						}
					})

					myEmitter.prependOnceListener('checkAuthorPatient', function () {
						if (!validator.isEmpty(authorPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + authorPatient, 'PATIENT', function (resAuthorPatient) {
								if (resAuthorPatient.err_code > 0) {
									myEmitter.emit('checkAuthorOrganization');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Author patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAuthorOrganization');
						}
					})

					if (!validator.isEmpty(authorRelatedPerson)) {
						checkUniqeValue(apikey, "RELATED_PERSON_ID|" + authorRelatedPerson, 'RELATED_PERSON', function (resAuthorRelatedPerson) {
							if (resAuthorRelatedPerson.err_code > 0) {
								myEmitter.emit('checkAuthorPatient');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Author related person id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkAuthorPatient');
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		}else{
			res.json({"err_code": err_code, "err_msg": err_msg});
		}	
			
		},
		identifier: function updateIdentifier(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifest_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof imagingManifestId !== 'undefined'){
				if(validator.isEmpty(imagingManifestId)){
					err_code = 2;
					err_msg = "Imaging Manifest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest id is required";
			}

			if(typeof identifierId !== 'undefined'){
				if(validator.isEmpty(identifierId)){
					err_code = 2;
					err_msg = "Identifier id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Identifier id is required";
			}

			//identifier
			if(typeof req.body.use !== 'undefined'){
				identifierUseCode =  req.body.use.trim().toLowerCase();
				if(validator.isEmpty(identifierUseCode)){
					err_code = 2;
					err_msg = "Identifier Use is empty";
				}else{
					dataIdentifier.use = identifierUseCode;
				}
			}else{
				identifierUseCode = "";
			} 

			//type code
			if(typeof req.body.type !== 'undefined'){
				identifierTypeCode =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(identifierTypeCode)){
					err_code = 2;
					err_msg = "Identifier Type is empty";
				}else{
					dataIdentifier.type = identifierTypeCode;
				}
			}else{
				identifierTypeCode = "";
			} 

			//identifier uniqe value
			if(typeof req.body.value !== 'undefined'){
				identifierValue =  req.body.value.trim();
				if(validator.isEmpty(identifierValue)){
					err_code = 2;
					err_msg = "Identifier Value is empty";
				}else{
					dataIdentifier.value = identifierValue;
				}
			}else{
				identifierValue = "";
			}

			//identifier period start
			if(typeof req.body.period !== 'undefined'){
				period = req.body.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					identifierPeriodStart = arrPeriod[0];
					identifierPeriodEnd = arrPeriod[1];

					if(!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)){
						err_code = 2;
						err_msg = "Identifier Period invalid date format.";
					}else{
						dataIdentifier.period_start = identifierPeriodStart;
						dataIdentifier.period_end = identifierPeriodEnd;
					}	
				}else{
					err_code = 1;
					err_msg = "Period request format is wrong, `ex: start to end` ";
				}
			}else{
				identifierPeriodStart = "";
				identifierPeriodEnd = "";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImagingManifestID', function(){
							checkUniqeValue(apikey, "IMAGING_MANIFEST_ID|" + imagingManifestId, 'IMAGING_MANIFEST', function(resImagingManifestID){
								if(resImagingManifestID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "IMAGING_MANIFEST_ID|"+imagingManifestId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Imaging Manifest.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Imaging Manifest Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkImagingManifestID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkImagingManifestID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Identifier value already exist."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkIdentifierType', function(){
							if(validator.isEmpty(identifierTypeCode)){
								myEmitter.emit('checkIdentifierValue');
							}else{
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkIdentifierValue');
									}else{
										res.json({"err_code": 502, "err_msg": "Identifier type code not found"});		
									}
								})
							}
						})

						if(validator.isEmpty(identifierUseCode)){
							myEmitter.emit('checkIdentifierType');	
						}else{
							checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
								if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkIdentifierType');
								}else{
									res.json({"err_code": 501, "err_msg": "Identifier use code not found"});
								}
							})
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		imagingManifestStudy: function updateImagingManifestStudy(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifest_id;
			var imagingManifestStudyId = req.params.imaging_manifest_study_id;

			var err_code = 0;
			var err_msg = "";
			var dataImagingManifest = {};
			//input check 
			if(typeof imagingManifestId !== 'undefined'){
				if(validator.isEmpty(imagingManifestId)){
					err_code = 2;
					err_msg = "Imaging Manifest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest id is required";
			}

			if(typeof imagingManifestStudyId !== 'undefined'){
				if(validator.isEmpty(imagingManifestStudyId)){
					err_code = 2;
					err_msg = "Imaging Manifest Study id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest Study id is required";
			}
			
			/*
			"study_id" : imagingManifestStudyId,
			"uid" : studyUid,
			"imaging_study" : studyImagingStudy,
			"imaging_manifest_id" : imagingManifestId
			*/
			
			if(typeof req.body.uid !== 'undefined' && req.body.uid !== ""){
				var studyUid =  req.body.uid.trim().toLowerCase();
				if(validator.isEmpty(studyUid)){
					err_code = 2;
					err_msg = "imaging manifest study uid is required.";
				}else{
					dataImagingManifest.uid = studyUid;
				}
			}else{
			  studyUid = "";
			}

			if(typeof req.body.imagingStudy !== 'undefined' && req.body.imagingStudy !== ""){
				var studyImagingStudy =  req.body.imagingStudy.trim().toLowerCase();
				if(validator.isEmpty(studyImagingStudy)){
					dataImagingManifest.imaging_study = "";
				}else{
					dataImagingManifest.imaging_study = studyImagingStudy;
				}
			}else{
			  studyImagingStudy = "";
			}

			/*if(typeof req.body.endpoint !== 'undefined' && req.body.endpoint !== ""){
				var studyEndpoint =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(studyEndpoint)){
					dataImagingManifest.endpoint = "";
				}else{
					dataImagingManifest.endpoint = studyEndpoint;
				}
			}else{
			  studyEndpoint = "";
			}*/
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkImagingManifestID', function(){
							checkUniqeValue(apikey, "IMAGING_MANIFEST_ID|" + imagingManifestId, 'IMAGING_MANIFEST', function(resImagingManifestId){
								if(resImagingManifestId.err_code > 0){
									checkUniqeValue(apikey, "STUDY_ID|" + imagingManifestStudyId, 'IMAGING_MANIFEST_STUDY', function(resImagingManifestStudyID){
										if(resImagingManifestStudyID.err_code > 0){
											ApiFHIR.put('imagingManifestStudy', {"apikey": apikey, "_id": imagingManifestStudyId, "dr": "IMAGING_MANIFEST_ID|"+imagingManifestId}, {body: dataImagingManifest, json: true}, function(error, response, body){
												imagingManifestStudy = body;
												if(imagingManifestStudy.err_code > 0){
													res.json(imagingManifestStudy);	
												}else{
													res.json({"err_code": 0, "err_msg": "Imaging Manifest Study has been update in this Imaging Manifest.", "data": imagingManifestStudy.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Imaging Manifest Study Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Imaging Manifest Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(studyImagingStudy)) {
							checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + studyImagingStudy, 'IMAGING_STUDY', function (resStudyImagingStudy) {
								if (resStudyImagingStudy.err_code > 0) {
									myEmitter.emit('checkImagingManifestID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Study imaging study id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkImagingManifestID');
						}
						/*---------*/
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		imagingManifestSeries: function updateImagingManifestSeries(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifest_study_id;
			var imagingManifestSeriesId = req.params.imaging_manifest_series_id;

			var err_code = 0;
			var err_msg = "";
			var dataImagingManifest = {};
			//input check 
			if(typeof imagingManifestId !== 'undefined'){
				if(validator.isEmpty(imagingManifestId)){
					err_code = 2;
					err_msg = "Imaging Manifest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "ImagingManifest id is required";
			}

			if(typeof imagingManifestSeriesId !== 'undefined'){
				if(validator.isEmpty(imagingManifestSeriesId)){
					err_code = 2;
					err_msg = "Imaging Manifest Series id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest Series id is required";
			}
			
			if(typeof req.body.uid !== 'undefined' && req.body.uid !== ""){
				var studySeriesUid =  req.body.uid.trim().toLowerCase();
				if(validator.isEmpty(studySeriesUid)){
					err_code = 2;
					err_msg = "imaging manifest study series uid is required.";
				}else{
					dataImagingManifest.uid = studySeriesUid;
				}
			}else{
			  studySeriesUid = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "STUDY_ID|" + imagingManifestId, 'IMAGING_MANIFEST_STUDY', function(resImagingManifestId){
							if(resImagingManifestId.err_code > 0){
								checkUniqeValue(apikey, "SERIES_ID|" + imagingManifestSeriesId, 'IMAGING_MANIFEST_SERIES', function(resImagingManifestSeriesID){
									if(resImagingManifestSeriesID.err_code > 0){
										ApiFHIR.put('imagingManifestSeries', {"apikey": apikey, "_id": imagingManifestSeriesId, "dr": "STUDY_ID|"+imagingManifestId}, {body: dataImagingManifest, json: true}, function(error, response, body){
											imagingManifestSeries = body;
											if(imagingManifestSeries.err_code > 0){
												res.json(imagingManifestSeries);	
											}else{
												res.json({"err_code": 0, "err_msg": "Imaging Manifest Series has been update in this Imaging Manifest.", "data": imagingManifestSeries.data});
											}
										})
									}else{
										res.json({"err_code": 505, "err_msg": "Imaging Manifest Series Id not found"});		
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Imaging Manifest Study Id not found"});		
							}
						})
						/*---------*/
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		imagingManifestInstance: function updateImagingManifestInstance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var imagingManifestId = req.params.imaging_manifest_series_id;
			var imagingManifestInstanceId = req.params.imaging_manifest_instance_id;

			var err_code = 0;
			var err_msg = "";
			var dataImagingManifest = {};
			//input check 
			if(typeof imagingManifestId !== 'undefined'){
				if(validator.isEmpty(imagingManifestId)){
					err_code = 2;
					err_msg = "Imaging Manifest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest id is required";
			}

			if(typeof imagingManifestInstanceId !== 'undefined'){
				if(validator.isEmpty(imagingManifestInstanceId)){
					err_code = 2;
					err_msg = "Imaging Manifest Instance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Imaging Manifest Instance id is required";
			}
			
			/*
			var sop_class  = req.body.sop_class;
			var uid  = req.body.uid;
			*/
			if(typeof req.body.sopClass !== 'undefined' && req.body.sopClass !== ""){
				var studySeriesInstanceSopClass =  req.body.sopClass.trim().toLowerCase();
				if(validator.isEmpty(studySeriesInstanceSopClass)){
					err_code = 2;
					err_msg = "imaging manifest study series instance sop class is required.";
				}else{
					dataImagingManifest.sop_class = studySeriesInstanceSopClass;
				}
			}else{
			  studySeriesInstanceSopClass = "";
			}

			if(typeof req.body.uid !== 'undefined' && req.body.uid !== ""){
				var studySeriesInstanceUid =  req.body.uid.trim().toLowerCase();
				if(validator.isEmpty(studySeriesInstanceUid)){
					err_code = 2;
					err_msg = "imaging manifest study series instance uid is required.";
				}else{
					dataImagingManifest.uid = studySeriesInstanceUid;
				}
			}else{
			  studySeriesInstanceUid = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "SERIES_ID|" + imagingManifestId, 'IMAGING_MANIFEST_SERIES', function(resImagingManifestId){
							if(resImagingManifestId.err_code > 0){
								checkUniqeValue(apikey, "INSTANCE_ID|" + imagingManifestInstanceId, 'IMAGING_MANIFEST_INSTANCE', function(resImagingManifestInstanceID){
									if(resImagingManifestInstanceID.err_code > 0){
										ApiFHIR.put('imagingManifestInstance', {"apikey": apikey, "_id": imagingManifestInstanceId, "dr": "SERIES_ID|"+imagingManifestId}, {body: dataImagingManifest, json: true}, function(error, response, body){
											imagingManifestInstance = body;
											if(imagingManifestInstance.err_code > 0){
												res.json(imagingManifestInstance);	
											}else{
												res.json({"err_code": 0, "err_msg": "Imaging Manifest Instance has been update in this Imaging Manifest.", "data": imagingManifestInstance.data});
											}
										})
									}else{
										res.json({"err_code": 505, "err_msg": "Imaging Manifest Instance Id not found"});		
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Imaging Manifest Series Id not found"});		
							}
						})
						/*---------*/
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
	}
}

function checkApikey(apikey, ipAddress, callback){
	//method, endpoint, params, options, callback
	Api.get('check_apikey', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		//check user_role_id == 1 <-- admin/root
		  		if(user.data[0].user_role_id == 1){
		  			x({"err_code": 0, "status": "root", "user_role_id": user.data[0].user_role_id, "user_id": user.data[0].user_id});	
		  		}else{
			  		//cek apikey
				  	if(apikey == user.data[0].user_apikey){
				  		//ipaddress
					  	dataIpAddress = user.data[0].user_ip_address;
					  	if(dataIpAddress.indexOf(ipAddress) >= 0){
					  		//user is active
					  		if(user.data[0].user_is_active){
					  			//cek data user terpenuhi
					  			x({"err_code": 0, "status": "active", "user_role_id": user.data[0].user_role_id, "user_id": user.data[0].user_id});	
					  		}else{
					  			x({"err_code": 5, "err_msg": "User is not active"});	
					  		}
					  	}else{
					  		x({"err_code": 4, "err_msg": "Ip Address not registered"});
					  	}
				  	}else{
				  		x({"err_code": 3, "err_msg": "Wrong apikey"});
				  	}
		  		}
		  		
		  	}else{
		  			x({"err_code": 2, "err_msg": "Wrong apikey"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "checkApikey"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkId(apikey, tableId, tableName, callback){
	ApiFHIR.get('checkId', {"apikey": apikey, "id": tableId, "name": tableName}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	dataId = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(dataId.err_code == 0){
		  	//cek jumdata dulu
		  	if(dataId.data.length > 0){
		  			x({"err_code": 0, "err_msg": "Id is valid."})
		  	}else{
		  			x({"err_code": 2, "err_msg": "Id is not found."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": dataId.error, "application": "API FHIR", "function": "checkId"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkCode(apikey, code, tableName, callback){
	ApiFHIR.get('checkCode', {"apikey": apikey, "code": code, "name": tableName}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	dataId = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(dataId.err_code == 0){
		  	//cek jumdata dulu
		  	if(dataId.data.length > 0){
		  			x({"err_code": 2, "err_msg": "Code is already exist."})
		  	}else{
		  			x({"err_code": 0, "err_msg": "Code is available to used."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": dataId.error, "application": "API FHIR", "function": "checkCode"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkUniqeValue(apikey, fdValue, tableName, callback){
	ApiFHIR.get('checkUniqeValue', {"apikey": apikey, "fdvalue": fdValue, "tbname": tableName}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	dataId = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(dataId.err_code == 0){
		  	//cek jumdata dulu
		  	if(dataId.data.length > 0){
		  			x({"err_code": 2, "err_msg": "The value is already exist."})
		  	}else{
		  			x({"err_code": 0, "err_msg": "The value is available to insert."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": dataId.error, "application": "API FHIR", "function": "checkCode"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkGroupQouta(apikey, groupId, callback){
	ApiFHIR.get('checkGroupQouta', {"apikey": apikey, "group_id": groupId}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	quota = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(quota.err_code == 0){
		  	//cek jumdata dulu
		  	if(quota.data.length > 0){
		  		groupQuota = parseInt(quota.data[0].quantity);
		  		memberCount = parseInt(quota.data[0].total_member);

		  		if(memberCount <= groupQuota){
		  			x({"err_code": 0, "err_msg": "Group quota is ready"});	
		  		}else{
		  			x({"err_code": 1, "err_msg": "Group quota is full, total member "+ groupQuota});	
		  		}
		  	}else{
		  			x({"err_code": 0, "err_msg": "Group quota is ready"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": quota, "application": "API FHIR", "function": "checkGroupQouta"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkMemberEntityGroup(apikey, entityId, groupId, callback){
	ApiFHIR.get('checkMemberEntityGroup', {"apikey": apikey, "entity_id": entityId ,"group_id": groupId}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	entity = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(entity.err_code == 0){
		  	if(parseInt(entity.data.length) > 0){
		  		x({"err_code": 2, "err_msg": "Member entity already exist in this group."});	
		  	}else{
	  			x({"err_code": 0, "err_msg": "Member not found in this group."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": entity, "application": "API FHIR", "function": "checkMemberEntityGroup"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
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

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

module.exports = controller;