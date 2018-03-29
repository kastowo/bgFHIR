var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var configYaml = yamlconfig.readConfig('../config/config.yml');
var Apiclient = require('apiclient');
var md5 = require('md5');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var Hdfs = require('hdfs');
var host = configYaml.generate_jar.host;
var port = configYaml.generate_jar.port;
var data2xml = require('data2xml');
var convert = data2xml({xmlheader: '<?xml version="1.0" standalone="yes" ?>\n'});
//phoenix
//query data melalui rest phoenix
var seedPhoenix = require("../config/seed_phoenix.json");
	seedPhoenix.base.hostname = configYaml.phoenix.host;
	seedPhoenix.base.port 		= configYaml.phoenix.port;
var Api = new Apiclient(seedPhoenix);


//setting midleware
app.use (function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT, OPTIONS");
//  res.removeHeader("x-powered-by");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


var Jar = {
			get: {
				generate_jar: function getGenerateJar(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var project_id = req.params.project_id;
							var inventory_id = req.params.inventory_id;
							var userIdApikey = result.user_id;

							if(typeof project_id !== 'undefined'){
								if(typeof inventory_id !== 'undefined'){
									//check project dulu
									Api.get('projectByUser', {"apikey": apikey, "project_id": project_id, "user_id": userIdApikey}, {}, function(error, response, body){
										if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addInventory"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	body = JSON.parse(body);
									  	if(body.err_code == 0){													  		
										  	if(body.data.length > 0){
										  		//proses pembuatan file fisiknya ambil dari inventory
													Api.get('inventory', {"apikey": apikey, "project_id": project_id, "inventory_id": inventory_id}, {}, function (error, response, body) {
													  if(error){
													  	res.json({"err_code":1, "err_msg": error});
													  }else{
													  	var user = JSON.parse(body); //object
													  	//cek apakah ada error atau tidak
													  	if(user.err_code == 0){
														  	//cek jumdata dulu
														  	if(user.data.length > 0){
														  		var invData = user.data[0];
														  		var projectName = invData.project_name;
														  		var filename = invData.inventory_name;
														  		var filepath = invData.inventory_path;
														  		var filetype = invData.inventory_type;
														  		var packageEncrypt = invData.inventory_package;
													  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
													  			var packageJson = JSON.parse(packageDecrypt);
													  			var packageXml = convert('BG', packageJson);

													  			packageXml = packageXml.replace('<BG>', '');
													  			packageXml = packageXml.replace('</BG>', '');
													  			filepackage = packageXml;

														  		var project_id = invData.project_id;
														  		var inventory_id = invData.inventory_id;

														  		//cek dir path udah ada belum
														  		if(!fs.existsSync(filepath)){
														  			mkdirp(filepath, function(err){
														  				// path exists unless there was an error
														  				if(err){
														  					res.json({"err_code": 1, "err_msg": err, "application": "Api generate jar", "function": "getGenerateJar"});				
														  				}else{
														  					//tulis file ke dir tsb
														  					fs.writeFile(filepath+filename+'.'+filetype, filepackage,{mode:0o777}, function(err){
														  						if(err){
														  							res.json({"err_code": 12, "err_msg": err, "application": "Api generate jar", "function": "getGenerateJar"});
														  						}else{
														  							//running script x11.sh
														  							exec("x11.sh");
														  							//compile ke file jar
														  							exec("/usr/lib/jvm/java-1.7.0/bin/java -jar HGrid247.jar -flow="+ filepath + filename +'.'+ filetype +' -project='+ projectName +' -projectDir=/tmp', function(error, stdout, stderr){
														  								console.log(stdout);
																		  				if(stdout.indexOf('succesfuly') > 0){
																		  					//ambil config hdfs
																		  					getUserByApikey(apikey, function(result4){
																									if(result4.err_code == 0){
																										//get cluster_config by cluster_id
																										
																										var cluster_id = result4.user_cluster_id;

																										//check ketersedian clusterid
																										if(cluster_id !== 'null'){
																											Api.get('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function(error, response, body){
																												if(error){
																											  	res.json({"err_code": 13, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																											  }else{
																											  	//cek apakah ada error atau tidak
																											  	var config = JSON.parse(body);
																											  	var jumdata = config.data.length;
																											  	if(config.err_code == 0){
																											  		if(jumdata > 0){
																											  			// check status cluster active
																											  			if(config.data[0].cluster_status == 'active' || config.data[0].cluster_status == 'default'){
																											  				//looping config and check for config hdfs
																														  	var hostname_hdfs = "";
																														  	var port_hdfs = "";
																														  	var username_hdfs = "";

																														  	for(var i = 0; i < jumdata; i++){
																			                            switch(config.data[i].config_key){
																			                            	case 'hostnameHdfs':
									                                                    hostname_hdfs = config.data[i].config_value;
																			                              break;
																			                              case 'portHdfs':
									                                                    port_hdfs = config.data[i].config_value;
																			                              break;
																			                              case 'usernameHdfs':
									                                                    username_hdfs = config.data[i].config_value;
																			                              break;
																			                            }
																			                          }
																			                          
																			                       		//cek config harus lengkap
																			                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
																			                          	var hdfs = new Hdfs({
																																	  protocol: 'http',
																																	  hostname: hostname_hdfs,
																																	  port: port_hdfs
																																	});
																																	var filepathjar = '/user/'+username_hdfs+'/baciro/jar/'+projectName+'/';

																												  				//check dir dulu
																																	hdfs.liststatus({
																																	  'user.name': username_hdfs,
																																		path: filepathjar
																																	}, function(error, response, body){
																																		if(error){
																																			res.json({"err_code": 14, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																		}else{
																																			if(body.indexOf('does not exist') > 0){
																																				//buat dirnya
																																				hdfs.mkdirs({
																																					'user.name': username_hdfs,
																																					path: filepathjar
																																				}, function(error, response, body){
																																					if(error){
																																						res.json({"err_code": 15, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																					}else{
																																						hdfs.upload({
																																						  'user.name': username_hdfs,
																																						  overwrite: true,
																																						  localpath: '/tmp/'+ projectName +'.jar',
																																						  path: filepathjar+projectName +'.jar'
																																						}, function(error, response, body) {
																																						  //save to table compile		
																																							getCompileId(apikey, function(result3){
																																								if(result3.err_code == 0){
																																									//susun body
																																									var dataCompile = {
																																																		"compile_id": result3.compile_id,
																																																		"compile_name": projectName,
																																																		"compile_path": filepathjar,
																																																		"compile_type": "jar",
																																																		"compile_create_date": getFormattedDate(),
																																																		"compile_project_id": project_id,
																																																		"compile_inventory_id": inventory_id,
																																																	};
																																									

																																									//proses simpan data user
																																									//method, endpoint, params, options, callback
																																									Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																										if(error){
																																									  	res.json({"err_code": 16, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																									  }else{
																																									  	//cek apakah ada error atau tidak
																																									  	if(body.err_code == 0){
																																										  	//get compile by id
																																										  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																												  if(errorc){
																																												  	res.json(errorc);
																																												  }else{
																																												  	var compile = JSON.parse(bodyc); //object
																																												  	//cek apakah ada error atau tidak
																																												  	if(compile.err_code == 0){
																																													  	//cek jumdata dulu
																																													  	if(compile.data.length > 0){
																																													  		res.json({"err_code": 0, "data":compile.data});
																																													  	}else{
																																												  			res.json({"err_code": 17, "err_msg": "Project not found"});	
																																													  	}
																																												  	}else{
																																												  		res.json({"err_code": 18, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																												  	}
																																												  }
																																												});
																																									  	}else{
																																									  		res.json(body);
																																									  	}
																																									  }
																																									})
																																								}else{
																																									result.err_code = 500;
																																									res.json(result3);	
																																								}
																																							});
																																						});		
																																					}
																																				})
																																			}else{
																																				//langsung upload
																																				hdfs.upload({
																																				  'user.name': username_hdfs,
																																				  overwrite: true,
																																				  localpath: '/tmp/'+ projectName +'.jar',
																																				  path: filepathjar+projectName +'.jar'
																																				}, function(error, response, body) {
																																				  //save to table compile		
																																					getCompileId(apikey, function(result3){
																																						if(result3.err_code == 0){
																																							//susun body
																																							var dataCompile = {
																																																"compile_id": result3.compile_id,
																																																"compile_name": projectName,
																																																"compile_path": filepathjar,
																																																"compile_type": "jar",
																																																"compile_create_date": getFormattedDate(),
																																																"compile_project_id": project_id,
																																																"compile_inventory_id": inventory_id,
																																															};
																																							

																																							//proses simpan data user
																																							//method, endpoint, params, options, callback
																																							Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																								if(error){
																																							  	res.json({"err_code": 19, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																							  }else{
																																							  	//cek apakah ada error atau tidak
																																							  	if(body.err_code == 0){
																																								  	//get compile by id
																																								  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																										  if(errorc){
																																										  	res.json(errorc);
																																										  }else{
																																										  	var compile = JSON.parse(bodyc); //object
																																										  	//cek apakah ada error atau tidak
																																										  	if(compile.err_code == 0){
																																											  	//cek jumdata dulu
																																											  	if(compile.data.length > 0){
																																											  		res.json({"err_code": 0, "data":compile.data});
																																											  	}else{
																																										  			res.json({"err_code": 20, "err_msg": "Project not found"});	
																																											  	}
																																										  	}else{
																																										  		res.json({"err_code": 21, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																										  	}
																																										  }
																																										});
																																							  	}else{
																																							  		res.json(body);
																																							  	}
																																							  }
																																							})
																																						}else{
																																							result.err_code = 500;
																																							res.json(result3);	
																																						}
																																					});
																																				});
																																			}
																																		}
																																	})
																			                          }else{
																			                          	res.json({"err_code": 22, "err_msg": "No config in cluster"});
																			                          }
																											  			}else{
																											  				res.json({"err_code": 22, "err_msg": "Your cluster is not active"});
																											  			}
																											  		}else{
																											  			res.json({"err_code": 24, "err_msg": "Cluster not found"});
																											  		}
																											  	}else{
																											  		res.json(config);
																											  	}
																											  }
																											})
																										}else{
																											//setting ke config default
																											Api.get('default_config', {"apikey": apikey}, {}, function(error, response, body){
																												if(error){
																											  	res.json({"err_code": 13, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																											  }else{
																											  	//cek apakah ada error atau tidak
																											  	var config = JSON.parse(body);
																											  	var jumdata = config.data.length;
																											  	if(config.err_code == 0){
																									  				//looping config and check for config hdfs
																												  	var hostname_hdfs = "";
																												  	var port_hdfs = "";
																												  	var username_hdfs = "";

																												  	for(var i = 0; i < jumdata; i++){
																	                            switch(config.data[i].config_key){
																	                            	case 'hostnameHdfs':
							                                                    hostname_hdfs = config.data[i].config_value;
																	                              break;
																	                              case 'portHdfs':
							                                                    port_hdfs = config.data[i].config_value;
																	                              break;
																	                              case 'usernameHdfs':
							                                                    username_hdfs = config.data[i].config_value;
																	                              break;
																	                            }
																	                          }
																		                          
																	                       		//cek config harus lengkap
																	                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
																	                          	var hdfs = new Hdfs({
																															  protocol: 'http',
																															  hostname: hostname_hdfs,
																															  port: port_hdfs
																															});
																															var filepathjar = '/user/'+username_hdfs+'/baciro/jar/'+projectName+'/';

																										  				//check dir dulu
																															hdfs.liststatus({
																															  'user.name': username_hdfs,
																																path: filepathjar
																															}, function(error, response, body){
																																if(error){
																																	res.json({"err_code": 14, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																}else{
																																	if(body.indexOf('does not exist') > 0){
																																		//buat dirnya
																																		hdfs.mkdirs({
																																			'user.name': username_hdfs,
																																			path: filepathjar
																																		}, function(error, response, body){
																																			if(error){
																																				res.json({"err_code": 15, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																			}else{
																																				hdfs.upload({
																																				  'user.name': username_hdfs,
																																				  overwrite: true,
																																				  localpath: '/tmp/'+ projectName +'.jar',
																																				  path: filepathjar+projectName +'.jar'
																																				}, function(error, response, body) {
																																				  //save to table compile		
																																					getCompileId(apikey, function(result3){
																																						if(result3.err_code == 0){
																																							//susun body
																																							var dataCompile = {
																																																"compile_id": result3.compile_id,
																																																"compile_name": projectName,
																																																"compile_path": filepathjar,
																																																"compile_type": "jar",
																																																"compile_create_date": getFormattedDate(),
																																																"compile_project_id": project_id,
																																																"compile_inventory_id": inventory_id,
																																															};
																																							

																																							//proses simpan data user
																																							//method, endpoint, params, options, callback
																																							Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																								if(error){
																																							  	res.json({"err_code": 16, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																							  }else{
																																							  	//cek apakah ada error atau tidak
																																							  	if(body.err_code == 0){
																																								  	//get compile by id
																																								  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																										  if(errorc){
																																										  	res.json(errorc);
																																										  }else{
																																										  	var compile = JSON.parse(bodyc); //object
																																										  	//cek apakah ada error atau tidak
																																										  	if(compile.err_code == 0){
																																											  	//cek jumdata dulu
																																											  	if(compile.data.length > 0){
																																											  		res.json({"err_code": 0, "data":compile.data});
																																											  	}else{
																																										  			res.json({"err_code": 17, "err_msg": "Project not found"});	
																																											  	}
																																										  	}else{
																																										  		res.json({"err_code": 18, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																										  	}
																																										  }
																																										});
																																							  	}else{
																																							  		res.json(body);
																																							  	}
																																							  }
																																							})
																																						}else{
																																							result.err_code = 500;
																																							res.json(result3);	
																																						}
																																					});
																																				});		
																																			}
																																		})
																																	}else{
																																		//langsung upload
																																		hdfs.upload({
																																		  'user.name': username_hdfs,
																																		  overwrite: true,
																																		  localpath: '/tmp/'+ projectName +'.jar',
																																		  path: filepathjar+projectName +'.jar'
																																		}, function(error, response, body) {
																																		  //save to table compile		
																																			getCompileId(apikey, function(result3){
																																				if(result3.err_code == 0){
																																					//susun body
																																					var dataCompile = {
																																														"compile_id": result3.compile_id,
																																														"compile_name": projectName,
																																														"compile_path": filepathjar,
																																														"compile_type": "jar",
																																														"compile_create_date": getFormattedDate(),
																																														"compile_project_id": project_id,
																																														"compile_inventory_id": inventory_id,
																																													};
																																					

																																					//proses simpan data user
																																					//method, endpoint, params, options, callback
																																					Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																						if(error){
																																					  	res.json({"err_code": 19, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																					  }else{
																																					  	//cek apakah ada error atau tidak
																																					  	if(body.err_code == 0){
																																						  	//get compile by id
																																						  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																								  if(errorc){
																																								  	res.json(errorc);
																																								  }else{
																																								  	var compile = JSON.parse(bodyc); //object
																																								  	//cek apakah ada error atau tidak
																																								  	if(compile.err_code == 0){
																																									  	//cek jumdata dulu
																																									  	if(compile.data.length > 0){
																																									  		res.json({"err_code": 0, "data":compile.data});
																																									  	}else{
																																								  			res.json({"err_code": 20, "err_msg": "Project not found"});	
																																									  	}
																																								  	}else{
																																								  		res.json({"err_code": 21, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																								  	}
																																								  }
																																								});
																																					  	}else{
																																					  		res.json(body);
																																					  	}
																																					  }
																																					})
																																				}else{
																																					result.err_code = 500;
																																					res.json(result3);	
																																				}
																																			});
																																		});
																																	}
																																}
																															})
																	                          }else{
																	                          	res.json({"err_code": 22, "err_msg": "No config in cluster default"});
																	                          }
																											  	}else{
																											  		res.json(config);
																											  	}
																											  }
																											})
																										}
																									}else{
																										res.json({"err_code": 23, "err_msg": result4.err_msg, "application": "Api generate jar", "function": "getGenerateJar"})
																									}
																								})
																		  					
																		  				}else{
																		  					if(error){
																									res.json({"err_code": 24, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																		  					}else{
																		  						res.json({"err_code": 25, "err_msg": stdout, "application": "Api generate jar", "function": "getGenerateJar"});
																		  					}
																		  				}
															  						})
														  						}
														  					})
														  				}
														  			})
														  		}else{
														  			//tulis file ke dir tsb
												  					fs.writeFile(filepath+filename+'.'+filetype, filepackage,{mode:0o777}, function(err){
												  						if(err){
												  							res.json({"err_code": 12, "err_msg": err, "application": "Api generate jar", "function": "getGenerateJar"});
												  						}else{
												  							//running script x11.sh
												  							exec("x11.sh");
												  							//compile ke file jar
												  							exec("/usr/lib/jvm/java-1.7.0/bin/java -jar HGrid247.jar -flow="+ filepath + filename +'.'+ filetype +' -project='+ projectName +' -projectDir=/tmp', function(error, stdout, stderr){
												  								console.log(stdout);
																  				if(stdout.indexOf('succesfuly') > 0){
																  					//ambil config hdfs
																  					getUserByApikey(apikey, function(result4){
																							if(result4.err_code == 0){
																								//get cluster_config by cluster_id
																								
																								var cluster_id = result4.user_cluster_id;
																								if(cluster_id !== 'null'){
																									Api.get('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function(error, response, body){
																										if(error){
																									  	res.json({"err_code": 13, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																									  }else{
																									  	//cek apakah ada error atau tidak
																									  	var config = JSON.parse(body);
																									  	var jumdata = config.data.length;
																									  	if(config.err_code == 0){
																									  		if(jumdata > 0){
																									  			// check status cluster active
																											  	if(config.data[0].cluster_status == 'active' || config.data[0].cluster_status == 'default'){
																											  		//looping config and check for config hdfs
																												  	var hostname_hdfs = "";
																												  	var port_hdfs = "";
																												  	var username_hdfs = "";

																												  	for(var i = 0; i < jumdata; i++){
																	                            switch(config.data[i].config_key){
																	                            	case 'hostnameHdfs':
							                                                    hostname_hdfs = config.data[i].config_value;
																	                              break;
																	                              case 'portHdfs':
							                                                    port_hdfs = config.data[i].config_value;
																	                              break;
																	                              case 'usernameHdfs':
							                                                    username_hdfs = config.data[i].config_value;
																	                              break;
																	                            }
																	                          }
																	                          
																	                       		//cek config harus lengkap
																	                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
																	                          	var hdfs = new Hdfs({
																															  protocol: 'http',
																															  hostname: hostname_hdfs,
																															  port: port_hdfs
																															});
																															var filepathjar = '/user/'+username_hdfs+'/baciro/jar/'+projectName+'/';

																										  				//check dir dulu
																															hdfs.liststatus({
																															  'user.name': username_hdfs,
																																path: filepathjar
																															}, function(error, response, body){
																																if(error){
																																	res.json({"err_code": 14, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																}else{
																																	if(body.indexOf('does not exist') > 0){
																																		//buat dirnya
																																		hdfs.mkdirs({
																																			'user.name': username_hdfs,
																																			path: filepathjar
																																		}, function(error, response, body){
																																			if(error){
																																				res.json({"err_code": 15, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																			}else{
																																				hdfs.upload({
																																				  'user.name': username_hdfs,
																																				  overwrite: true,
																																				  localpath: '/tmp/'+ projectName +'.jar',
																																				  path: filepathjar+ projectName +'.jar'
																																				}, function(error, response, body) {
																																				  //save to table compile		
																																					getCompileId(apikey, function(result3){
																																						if(result3.err_code == 0){
																																							//susun body
																																							var dataCompile = {
																																																"compile_id": result3.compile_id,
																																																"compile_name": projectName,
																																																"compile_path": filepathjar,
																																																"compile_type": "jar",
																																																"compile_create_date": getFormattedDate(),
																																																"compile_project_id": project_id,
																																																"compile_inventory_id": inventory_id,
																																															};
																																							

																																							//proses simpan data user
																																							//method, endpoint, params, options, callback
																																							Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																								if(error){
																																							  	res.json({"err_code": 16, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																							  }else{
																																							  	//cek apakah ada error atau tidak
																																							  	if(body.err_code == 0){
																																								  	//get compile by id
																																								  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																										  if(errorc){
																																										  	res.json(errorc);
																																										  }else{
																																										  	var compile = JSON.parse(bodyc); //object
																																										  	//cek apakah ada error atau tidak
																																										  	if(compile.err_code == 0){
																																											  	//cek jumdata dulu
																																											  	if(compile.data.length > 0){
																																											  		res.json({"err_code": 0, "data":compile.data});
																																											  	}else{
																																										  			res.json({"err_code": 17, "err_msg": "Project not found"});	
																																											  	}
																																										  	}else{
																																										  		res.json({"err_code": 18, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																										  	}
																																										  }
																																										});
																																							  	}else{
																																							  		res.json(body);
																																							  	}
																																							  }
																																							})
																																						}else{
																																							result.err_code = 500;
																																							res.json(result3);	
																																						}
																																					});
																																				});		
																																			}
																																		})
																																	}else{
																																		//langsung upload
																																		hdfs.upload({
																																		  'user.name': username_hdfs,
																																		  overwrite: true,
																																		  localpath: '/tmp/'+ projectName +'.jar',
																																		  path: filepathjar+projectName +'.jar'
																																		}, function(error, response, body) {
																																		  //save to table compile		
																																			getCompileId(apikey, function(result3){
																																				if(result3.err_code == 0){
																																					//susun body
																																					var dataCompile = {
																																														"compile_id": result3.compile_id,
																																														"compile_name": projectName,
																																														"compile_path": filepathjar,
																																														"compile_type": "jar",
																																														"compile_create_date": getFormattedDate(),
																																														"compile_project_id": project_id,
																																														"compile_inventory_id": inventory_id,
																																													};
																																					

																																					//proses simpan data user
																																					//method, endpoint, params, options, callback
																																					Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																						if(error){
																																					  	res.json({"err_code": 19, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																					  }else{
																																					  	//cek apakah ada error atau tidak
																																					  	if(body.err_code == 0){
																																						  	//get compile by id
																																						  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																								  if(errorc){
																																								  	res.json(errorc);
																																								  }else{
																																								  	var compile = JSON.parse(bodyc); //object
																																								  	//cek apakah ada error atau tidak
																																								  	if(compile.err_code == 0){
																																									  	//cek jumdata dulu
																																									  	if(compile.data.length > 0){
																																									  		res.json({"err_code": 0, "data":compile.data});
																																									  	}else{
																																								  			res.json({"err_code": 20, "err_msg": "Project not found"});	
																																									  	}
																																								  	}else{
																																								  		res.json({"err_code": 21, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																								  	}
																																								  }
																																								});
																																					  	}else{
																																					  		res.json(body);
																																					  	}
																																					  }
																																					})
																																				}else{
																																					result.err_code = 500;
																																					res.json(result3);	
																																				}
																																			});
																																		});
																																	}
																																}
																															})
																	                          }else{
																	                          	res.json({"err_code": 22, "err_msg": "No config in cluster"});
																	                          }
																											  	}else{
																	                          res.json({"err_code": 22, "err_msg": "Your cluster is not active"});
																											  	}
																									  		}else{
																									  			res.json({"err_code": 24, "err_msg": "Cluster not found"});
																									  		}
																									  	}else{
																									  		res.json(config);
																									  	}
																									  }
																									})
																								}else{
																									//setting ke config default
																									Api.get('default_config', {"apikey": apikey}, {}, function(error, response, body){
																										if(error){
																									  	res.json({"err_code": 13, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																									  }else{
																									  	//cek apakah ada error atau tidak
																									  	var config = JSON.parse(body);
																									  	
																									  	var jumdata = config.data.length;
																									  	if(config.err_code == 0){
																										  	
																										  		//looping config and check for config hdfs
																											  	var hostname_hdfs = "";
																											  	var port_hdfs = "";
																											  	var username_hdfs = "";

																											  	for(var i = 0; i < jumdata; i++){
																                            switch(config.data[i].config_key){
																                            	case 'hostnameHdfs':
						                                                    hostname_hdfs = config.data[i].config_value;
																                              break;
																                              case 'portHdfs':
						                                                    port_hdfs = config.data[i].config_value;
																                              break;
																                              case 'usernameHdfs':
						                                                    username_hdfs = config.data[i].config_value;
																                              break;
																                            }
																                          }
																                          
																                       		//cek config harus lengkap
																                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
																                          	var hdfs = new Hdfs({
																														  protocol: 'http',
																														  hostname: hostname_hdfs,
																														  port: port_hdfs
																														});
																														var filepathjar = '/user/'+username_hdfs+'/baciro/jar/'+projectName+'/';

																									  				//check dir dulu
																														hdfs.liststatus({
																														  'user.name': username_hdfs,
																															path: filepathjar
																														}, function(error, response, body){
																															if(error){
																																res.json({"err_code": 14, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																															}else{
																																if(body.indexOf('does not exist') > 0){
																																	//buat dirnya
																																	hdfs.mkdirs({
																																		'user.name': username_hdfs,
																																		path: filepathjar
																																	}, function(error, response, body){
																																		if(error){
																																			res.json({"err_code": 15, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																		}else{
																																			hdfs.upload({
																																			  'user.name': username_hdfs,
																																			  overwrite: true,
																																			  localpath: '/tmp/'+ projectName +'.jar',
																																			  path: filepathjar+ projectName +'.jar'
																																			}, function(error, response, body) {
																																			  //save to table compile		
																																				getCompileId(apikey, function(result3){
																																					if(result3.err_code == 0){
																																						//susun body
																																						var dataCompile = {
																																															"compile_id": result3.compile_id,
																																															"compile_name": projectName,
																																															"compile_path": filepathjar,
																																															"compile_type": "jar",
																																															"compile_create_date": getFormattedDate(),
																																															"compile_project_id": project_id,
																																															"compile_inventory_id": inventory_id,
																																														};
																																						

																																						//proses simpan data user
																																						//method, endpoint, params, options, callback
																																						Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																							if(error){
																																						  	res.json({"err_code": 16, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																						  }else{
																																						  	//cek apakah ada error atau tidak
																																						  	if(body.err_code == 0){
																																							  	//get compile by id
																																							  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																									  if(errorc){
																																									  	res.json(errorc);
																																									  }else{
																																									  	var compile = JSON.parse(bodyc); //object
																																									  	//cek apakah ada error atau tidak
																																									  	if(compile.err_code == 0){
																																										  	//cek jumdata dulu
																																										  	if(compile.data.length > 0){
																																										  		res.json({"err_code": 0, "data":compile.data});
																																										  	}else{
																																									  			res.json({"err_code": 17, "err_msg": "Project not found"});	
																																										  	}
																																									  	}else{
																																									  		res.json({"err_code": 18, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																									  	}
																																									  }
																																									});
																																						  	}else{
																																						  		res.json(body);
																																						  	}
																																						  }
																																						})
																																					}else{
																																						result.err_code = 500;
																																						res.json(result3);	
																																					}
																																				});
																																			});		
																																		}
																																	})
																																}else{
																																	//langsung upload
																																	hdfs.upload({
																																	  'user.name': username_hdfs,
																																	  overwrite: true,
																																	  localpath: '/tmp/'+ projectName +'.jar',
																																	  path: filepathjar+projectName +'.jar'
																																	}, function(error, response, body) {
																																	  //save to table compile		
																																		getCompileId(apikey, function(result3){
																																			if(result3.err_code == 0){
																																				//susun body
																																				var dataCompile = {
																																													"compile_id": result3.compile_id,
																																													"compile_name": projectName,
																																													"compile_path": filepathjar,
																																													"compile_type": "jar",
																																													"compile_create_date": getFormattedDate(),
																																													"compile_project_id": project_id,
																																													"compile_inventory_id": inventory_id,
																																												};
																																				

																																				//proses simpan data user
																																				//method, endpoint, params, options, callback
																																				Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																					if(error){
																																				  	res.json({"err_code": 19, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																				  }else{
																																				  	//cek apakah ada error atau tidak
																																				  	if(body.err_code == 0){
																																					  	//get compile by id
																																					  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																							  if(errorc){
																																							  	res.json(errorc);
																																							  }else{
																																							  	var compile = JSON.parse(bodyc); //object
																																							  	//cek apakah ada error atau tidak
																																							  	if(compile.err_code == 0){
																																								  	//cek jumdata dulu
																																								  	if(compile.data.length > 0){
																																								  		res.json({"err_code": 0, "data":compile.data});
																																								  	}else{
																																							  			res.json({"err_code": 20, "err_msg": "Project not found"});	
																																								  	}
																																							  	}else{
																																							  		res.json({"err_code": 21, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																							  	}
																																							  }
																																							});
																																				  	}else{
																																				  		res.json(body);
																																				  	}
																																				  }
																																				})
																																			}else{
																																				result.err_code = 500;
																																				res.json(result3);	
																																			}
																																		});
																																	});
																																}
																															}
																														})
																                          }else{
																                          	res.json({"err_code": 22, "err_msg": "No config in cluster default"});
																                          }
																									  	}else{
																									  		res.json(config);
																									  	}
																									  }
																									})
																								}
																							}else{
																								res.json({"err_code": 23, "err_msg": result4.err_msg, "application": "Api generate jar", "function": "getGenerateJar"})
																							}
																						})
																  					
																  				}else{
																  					if(error){
																  						console.log(error);
																							res.json({"err_code": 24, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																  					}else{
																  						res.json({"err_code": 25, "err_msg": stdout, "application": "Api generate jar", "function": "getGenerateJar"});
																  					}
																  				}
													  						})
												  						}
												  					})
														  		}
														  	}else{
													  			res.json({"err_code": 26, "err_msg": "Project or inventory not found"});	
														  	}
													  	}else{
													  		res.json({"err_code": 27, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
													  	}
													  }
													});
										  	}else{
										  		checkProjectShare(apikey, project_id, userIdApikey, function(result5){
														if(result5.err_code == 0){
															var projectShare = result5.data;
															
															if(projectShare[0].project_is_share){
																//proses pembuatan file fisiknya ambil dari inventory
																Api.get('inventory', {"apikey": apikey, "project_id": project_id, "inventory_id": inventory_id}, {}, function (error, response, body) {
																  if(error){
																  	res.json({"err_code":1, "err_msg": error});
																  }else{
																  	var user = JSON.parse(body); //object
																  	//cek apakah ada error atau tidak
																  	if(user.err_code == 0){
																	  	//cek jumdata dulu
																	  	if(user.data.length > 0){
																	  		var invData = user.data[0];
																	  		var projectName = invData.project_name;
																	  		var filename = invData.inventory_name;
																	  		var filepath = invData.inventory_path;
																	  		var filetype = invData.inventory_type;
																	  		var packageEncrypt = invData.inventory_package;
																  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
																  			var packageJson = JSON.parse(packageDecrypt);
																  			var packageXml = convert('BG', packageJson);

																  			packageXml = packageXml.replace('<BG>', '');
																  			packageXml = packageXml.replace('</BG>', '');
																  			filepackage = packageXml;

																	  		var project_id = invData.project_id;
																	  		var inventory_id = invData.inventory_id;

																	  		//cek dir path udah ada belum
																	  		if(!fs.existsSync(filepath)){
																	  			mkdirp(filepath, function(err){
																	  				// path exists unless there was an error
																	  				if(err){
																	  					res.json({"err_code": 1, "err_msg": err, "application": "Api generate jar", "function": "getGenerateJar"});				
																	  				}else{
																	  					//tulis file ke dir tsb
																	  					fs.writeFile(filepath+filename+'.'+filetype, filepackage,{mode:0o777}, function(err){
																	  						if(err){
																	  							res.json({"err_code": 12, "err_msg": err, "application": "Api generate jar", "function": "getGenerateJar"});
																	  						}else{
																	  							//running script x11.sh
																	  							exec("x11.sh");
																	  							//compile ke file jar
																	  							exec("/usr/lib/jvm/java-1.7.0/bin/java -jar HGrid247.jar -flow="+ filepath + filename +'.'+ filetype +' -project='+ projectName +' -projectDir=/tmp', function(error, stdout, stderr){
																	  								console.log(stdout);
																					  				if(stdout.indexOf('succesfuly') > 0){
																					  					//ambil config hdfs
																					  					getUserByApikey(apikey, function(result4){
																												if(result4.err_code == 0){
																													//get cluster_config by cluster_id
																													
																													var cluster_id = result4.user_cluster_id;

																													//check ketersedian clusterid
																													if(cluster_id !== 'null'){
																														Api.get('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function(error, response, body){
																															if(error){
																														  	res.json({"err_code": 13, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																														  }else{
																														  	//cek apakah ada error atau tidak
																														  	var config = JSON.parse(body);
																														  	var jumdata = config.data.length;
																														  	if(config.err_code == 0){
																														  		if(jumdata > 0){
																														  			// check status cluster active
																														  			if(config.data[0].cluster_status == 'active' || config.data[0].cluster_status == 'default'){
																														  				//looping config and check for config hdfs
																																	  	var hostname_hdfs = "";
																																	  	var port_hdfs = "";
																																	  	var username_hdfs = "";

																																	  	for(var i = 0; i < jumdata; i++){
																						                            switch(config.data[i].config_key){
																						                            	case 'hostnameHdfs':
												                                                    hostname_hdfs = config.data[i].config_value;
																						                              break;
																						                              case 'portHdfs':
												                                                    port_hdfs = config.data[i].config_value;
																						                              break;
																						                              case 'usernameHdfs':
												                                                    username_hdfs = config.data[i].config_value;
																						                              break;
																						                            }
																						                          }
																						                          
																						                       		//cek config harus lengkap
																						                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
																						                          	var hdfs = new Hdfs({
																																				  protocol: 'http',
																																				  hostname: hostname_hdfs,
																																				  port: port_hdfs
																																				});
																																				var filepathjar = '/user/'+username_hdfs+'/baciro/jar/'+projectName+'/';

																															  				//check dir dulu
																																				hdfs.liststatus({
																																				  'user.name': username_hdfs,
																																					path: filepathjar
																																				}, function(error, response, body){
																																					if(error){
																																						res.json({"err_code": 14, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																					}else{
																																						if(body.indexOf('does not exist') > 0){
																																							//buat dirnya
																																							hdfs.mkdirs({
																																								'user.name': username_hdfs,
																																								path: filepathjar
																																							}, function(error, response, body){
																																								if(error){
																																									res.json({"err_code": 15, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																								}else{
																																									hdfs.upload({
																																									  'user.name': username_hdfs,
																																									  overwrite: true,
																																									  localpath: '/tmp/'+ projectName +'.jar',
																																									  path: filepathjar+projectName +'.jar'
																																									}, function(error, response, body) {
																																									  //save to table compile		
																																										getCompileId(apikey, function(result3){
																																											if(result3.err_code == 0){
																																												//susun body
																																												var dataCompile = {
																																																					"compile_id": result3.compile_id,
																																																					"compile_name": projectName,
																																																					"compile_path": filepathjar,
																																																					"compile_type": "jar",
																																																					"compile_create_date": getFormattedDate(),
																																																					"compile_project_id": project_id,
																																																					"compile_inventory_id": inventory_id,
																																																				};
																																												

																																												//proses simpan data user
																																												//method, endpoint, params, options, callback
																																												Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																													if(error){
																																												  	res.json({"err_code": 16, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																												  }else{
																																												  	//cek apakah ada error atau tidak
																																												  	if(body.err_code == 0){
																																													  	//get compile by id
																																													  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																															  if(errorc){
																																															  	res.json(errorc);
																																															  }else{
																																															  	var compile = JSON.parse(bodyc); //object
																																															  	//cek apakah ada error atau tidak
																																															  	if(compile.err_code == 0){
																																																  	//cek jumdata dulu
																																																  	if(compile.data.length > 0){
																																																  		res.json({"err_code": 0, "data":compile.data});
																																																  	}else{
																																															  			res.json({"err_code": 17, "err_msg": "Project not found"});	
																																																  	}
																																															  	}else{
																																															  		res.json({"err_code": 18, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																															  	}
																																															  }
																																															});
																																												  	}else{
																																												  		res.json(body);
																																												  	}
																																												  }
																																												})
																																											}else{
																																												result.err_code = 500;
																																												res.json(result3);	
																																											}
																																										});
																																									});		
																																								}
																																							})
																																						}else{
																																							//langsung upload
																																							hdfs.upload({
																																							  'user.name': username_hdfs,
																																							  overwrite: true,
																																							  localpath: '/tmp/'+ projectName +'.jar',
																																							  path: filepathjar+projectName +'.jar'
																																							}, function(error, response, body) {
																																							  //save to table compile		
																																								getCompileId(apikey, function(result3){
																																									if(result3.err_code == 0){
																																										//susun body
																																										var dataCompile = {
																																																			"compile_id": result3.compile_id,
																																																			"compile_name": projectName,
																																																			"compile_path": filepathjar,
																																																			"compile_type": "jar",
																																																			"compile_create_date": getFormattedDate(),
																																																			"compile_project_id": project_id,
																																																			"compile_inventory_id": inventory_id,
																																																		};
																																										

																																										//proses simpan data user
																																										//method, endpoint, params, options, callback
																																										Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																											if(error){
																																										  	res.json({"err_code": 19, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																										  }else{
																																										  	//cek apakah ada error atau tidak
																																										  	if(body.err_code == 0){
																																											  	//get compile by id
																																											  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																													  if(errorc){
																																													  	res.json(errorc);
																																													  }else{
																																													  	var compile = JSON.parse(bodyc); //object
																																													  	//cek apakah ada error atau tidak
																																													  	if(compile.err_code == 0){
																																														  	//cek jumdata dulu
																																														  	if(compile.data.length > 0){
																																														  		res.json({"err_code": 0, "data":compile.data});
																																														  	}else{
																																													  			res.json({"err_code": 20, "err_msg": "Project not found"});	
																																														  	}
																																													  	}else{
																																													  		res.json({"err_code": 21, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																													  	}
																																													  }
																																													});
																																										  	}else{
																																										  		res.json(body);
																																										  	}
																																										  }
																																										})
																																									}else{
																																										result.err_code = 500;
																																										res.json(result3);	
																																									}
																																								});
																																							});
																																						}
																																					}
																																				})
																						                          }else{
																						                          	res.json({"err_code": 22, "err_msg": "No config in cluster"});
																						                          }
																														  			}else{
																														  				res.json({"err_code": 22, "err_msg": "Your cluster is not active"});
																														  			}
																														  		}else{
																														  			res.json({"err_code": 24, "err_msg": "Cluster not found"});
																														  		}
																														  	}else{
																														  		res.json(config);
																														  	}
																														  }
																														})
																													}else{
																														//setting ke config default
																														Api.get('default_config', {"apikey": apikey}, {}, function(error, response, body){
																															if(error){
																														  	res.json({"err_code": 13, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																														  }else{
																														  	//cek apakah ada error atau tidak
																														  	var config = JSON.parse(body);
																														  	var jumdata = config.data.length;
																														  	if(config.err_code == 0){
																												  				//looping config and check for config hdfs
																															  	var hostname_hdfs = "";
																															  	var port_hdfs = "";
																															  	var username_hdfs = "";

																															  	for(var i = 0; i < jumdata; i++){
																				                            switch(config.data[i].config_key){
																				                            	case 'hostnameHdfs':
										                                                    hostname_hdfs = config.data[i].config_value;
																				                              break;
																				                              case 'portHdfs':
										                                                    port_hdfs = config.data[i].config_value;
																				                              break;
																				                              case 'usernameHdfs':
										                                                    username_hdfs = config.data[i].config_value;
																				                              break;
																				                            }
																				                          }
																					                          
																				                       		//cek config harus lengkap
																				                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
																				                          	var hdfs = new Hdfs({
																																		  protocol: 'http',
																																		  hostname: hostname_hdfs,
																																		  port: port_hdfs
																																		});
																																		var filepathjar = '/user/'+username_hdfs+'/baciro/jar/'+projectName+'/';

																													  				//check dir dulu
																																		hdfs.liststatus({
																																		  'user.name': username_hdfs,
																																			path: filepathjar
																																		}, function(error, response, body){
																																			if(error){
																																				res.json({"err_code": 14, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																			}else{
																																				if(body.indexOf('does not exist') > 0){
																																					//buat dirnya
																																					hdfs.mkdirs({
																																						'user.name': username_hdfs,
																																						path: filepathjar
																																					}, function(error, response, body){
																																						if(error){
																																							res.json({"err_code": 15, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																						}else{
																																							hdfs.upload({
																																							  'user.name': username_hdfs,
																																							  overwrite: true,
																																							  localpath: '/tmp/'+ projectName +'.jar',
																																							  path: filepathjar+projectName +'.jar'
																																							}, function(error, response, body) {
																																							  //save to table compile		
																																								getCompileId(apikey, function(result3){
																																									if(result3.err_code == 0){
																																										//susun body
																																										var dataCompile = {
																																																			"compile_id": result3.compile_id,
																																																			"compile_name": projectName,
																																																			"compile_path": filepathjar,
																																																			"compile_type": "jar",
																																																			"compile_create_date": getFormattedDate(),
																																																			"compile_project_id": project_id,
																																																			"compile_inventory_id": inventory_id,
																																																		};
																																										

																																										//proses simpan data user
																																										//method, endpoint, params, options, callback
																																										Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																											if(error){
																																										  	res.json({"err_code": 16, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																										  }else{
																																										  	//cek apakah ada error atau tidak
																																										  	if(body.err_code == 0){
																																											  	//get compile by id
																																											  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																													  if(errorc){
																																													  	res.json(errorc);
																																													  }else{
																																													  	var compile = JSON.parse(bodyc); //object
																																													  	//cek apakah ada error atau tidak
																																													  	if(compile.err_code == 0){
																																														  	//cek jumdata dulu
																																														  	if(compile.data.length > 0){
																																														  		res.json({"err_code": 0, "data":compile.data});
																																														  	}else{
																																													  			res.json({"err_code": 17, "err_msg": "Project not found"});	
																																														  	}
																																													  	}else{
																																													  		res.json({"err_code": 18, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																													  	}
																																													  }
																																													});
																																										  	}else{
																																										  		res.json(body);
																																										  	}
																																										  }
																																										})
																																									}else{
																																										result.err_code = 500;
																																										res.json(result3);	
																																									}
																																								});
																																							});		
																																						}
																																					})
																																				}else{
																																					//langsung upload
																																					hdfs.upload({
																																					  'user.name': username_hdfs,
																																					  overwrite: true,
																																					  localpath: '/tmp/'+ projectName +'.jar',
																																					  path: filepathjar+projectName +'.jar'
																																					}, function(error, response, body) {
																																					  //save to table compile		
																																						getCompileId(apikey, function(result3){
																																							if(result3.err_code == 0){
																																								//susun body
																																								var dataCompile = {
																																																	"compile_id": result3.compile_id,
																																																	"compile_name": projectName,
																																																	"compile_path": filepathjar,
																																																	"compile_type": "jar",
																																																	"compile_create_date": getFormattedDate(),
																																																	"compile_project_id": project_id,
																																																	"compile_inventory_id": inventory_id,
																																																};
																																								

																																								//proses simpan data user
																																								//method, endpoint, params, options, callback
																																								Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																									if(error){
																																								  	res.json({"err_code": 19, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																								  }else{
																																								  	//cek apakah ada error atau tidak
																																								  	if(body.err_code == 0){
																																									  	//get compile by id
																																									  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																											  if(errorc){
																																											  	res.json(errorc);
																																											  }else{
																																											  	var compile = JSON.parse(bodyc); //object
																																											  	//cek apakah ada error atau tidak
																																											  	if(compile.err_code == 0){
																																												  	//cek jumdata dulu
																																												  	if(compile.data.length > 0){
																																												  		res.json({"err_code": 0, "data":compile.data});
																																												  	}else{
																																											  			res.json({"err_code": 20, "err_msg": "Project not found"});	
																																												  	}
																																											  	}else{
																																											  		res.json({"err_code": 21, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																											  	}
																																											  }
																																											});
																																								  	}else{
																																								  		res.json(body);
																																								  	}
																																								  }
																																								})
																																							}else{
																																								result.err_code = 500;
																																								res.json(result3);	
																																							}
																																						});
																																					});
																																				}
																																			}
																																		})
																				                          }else{
																				                          	res.json({"err_code": 22, "err_msg": "No config in cluster default"});
																				                          }
																														  	}else{
																														  		res.json(config);
																														  	}
																														  }
																														})
																													}
																												}else{
																													res.json({"err_code": 23, "err_msg": result4.err_msg, "application": "Api generate jar", "function": "getGenerateJar"})
																												}
																											})
																					  					
																					  				}else{
																					  					if(error){
																												res.json({"err_code": 24, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																					  					}else{
																					  						res.json({"err_code": 25, "err_msg": stdout, "application": "Api generate jar", "function": "getGenerateJar"});
																					  					}
																					  				}
																		  						})
																	  						}
																	  					})
																	  				}
																	  			})
																	  		}else{
																	  			//tulis file ke dir tsb
															  					fs.writeFile(filepath+filename+'.'+filetype, filepackage,{mode:0o777}, function(err){
															  						if(err){
															  							res.json({"err_code": 12, "err_msg": err, "application": "Api generate jar", "function": "getGenerateJar"});
															  						}else{
															  							//running script x11.sh
															  							exec("x11.sh");
															  							//compile ke file jar
															  							exec("/usr/lib/jvm/java-1.7.0/bin/java -jar HGrid247.jar -flow="+ filepath + filename +'.'+ filetype +' -project='+ projectName +' -projectDir=/tmp', function(error, stdout, stderr){
															  								console.log(stdout);
																			  				if(stdout.indexOf('succesfuly') > 0){
																			  					//ambil config hdfs
																			  					getUserByApikey(apikey, function(result4){
																										if(result4.err_code == 0){
																											//get cluster_config by cluster_id
																											
																											var cluster_id = result4.user_cluster_id;
																											if(cluster_id !== 'null'){
																												Api.get('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function(error, response, body){
																													if(error){
																												  	res.json({"err_code": 13, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																												  }else{
																												  	//cek apakah ada error atau tidak
																												  	var config = JSON.parse(body);
																												  	var jumdata = config.data.length;
																												  	if(config.err_code == 0){
																												  		if(jumdata > 0){
																												  			// check status cluster active
																														  	if(config.data[0].cluster_status == 'active' || config.data[0].cluster_status == 'default'){
																														  		//looping config and check for config hdfs
																															  	var hostname_hdfs = "";
																															  	var port_hdfs = "";
																															  	var username_hdfs = "";

																															  	for(var i = 0; i < jumdata; i++){
																				                            switch(config.data[i].config_key){
																				                            	case 'hostnameHdfs':
										                                                    hostname_hdfs = config.data[i].config_value;
																				                              break;
																				                              case 'portHdfs':
										                                                    port_hdfs = config.data[i].config_value;
																				                              break;
																				                              case 'usernameHdfs':
										                                                    username_hdfs = config.data[i].config_value;
																				                              break;
																				                            }
																				                          }
																				                          
																				                       		//cek config harus lengkap
																				                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
																				                          	var hdfs = new Hdfs({
																																		  protocol: 'http',
																																		  hostname: hostname_hdfs,
																																		  port: port_hdfs
																																		});
																																		var filepathjar = '/user/'+username_hdfs+'/baciro/jar/'+projectName+'/';

																													  				//check dir dulu
																																		hdfs.liststatus({
																																		  'user.name': username_hdfs,
																																			path: filepathjar
																																		}, function(error, response, body){
																																			if(error){
																																				res.json({"err_code": 14, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																			}else{
																																				if(body.indexOf('does not exist') > 0){
																																					//buat dirnya
																																					hdfs.mkdirs({
																																						'user.name': username_hdfs,
																																						path: filepathjar
																																					}, function(error, response, body){
																																						if(error){
																																							res.json({"err_code": 15, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																						}else{
																																							hdfs.upload({
																																							  'user.name': username_hdfs,
																																							  overwrite: true,
																																							  localpath: '/tmp/'+ projectName +'.jar',
																																							  path: filepathjar+ projectName +'.jar'
																																							}, function(error, response, body) {
																																							  //save to table compile		
																																								getCompileId(apikey, function(result3){
																																									if(result3.err_code == 0){
																																										//susun body
																																										var dataCompile = {
																																																			"compile_id": result3.compile_id,
																																																			"compile_name": projectName,
																																																			"compile_path": filepathjar,
																																																			"compile_type": "jar",
																																																			"compile_create_date": getFormattedDate(),
																																																			"compile_project_id": project_id,
																																																			"compile_inventory_id": inventory_id,
																																																		};
																																										

																																										//proses simpan data user
																																										//method, endpoint, params, options, callback
																																										Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																											if(error){
																																										  	res.json({"err_code": 16, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																										  }else{
																																										  	//cek apakah ada error atau tidak
																																										  	if(body.err_code == 0){
																																											  	//get compile by id
																																											  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																													  if(errorc){
																																													  	res.json(errorc);
																																													  }else{
																																													  	var compile = JSON.parse(bodyc); //object
																																													  	//cek apakah ada error atau tidak
																																													  	if(compile.err_code == 0){
																																														  	//cek jumdata dulu
																																														  	if(compile.data.length > 0){
																																														  		res.json({"err_code": 0, "data":compile.data});
																																														  	}else{
																																													  			res.json({"err_code": 17, "err_msg": "Project not found"});	
																																														  	}
																																													  	}else{
																																													  		res.json({"err_code": 18, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																													  	}
																																													  }
																																													});
																																										  	}else{
																																										  		res.json(body);
																																										  	}
																																										  }
																																										})
																																									}else{
																																										result.err_code = 500;
																																										res.json(result3);	
																																									}
																																								});
																																							});		
																																						}
																																					})
																																				}else{
																																					//langsung upload
																																					hdfs.upload({
																																					  'user.name': username_hdfs,
																																					  overwrite: true,
																																					  localpath: '/tmp/'+ projectName +'.jar',
																																					  path: filepathjar+projectName +'.jar'
																																					}, function(error, response, body) {
																																					  //save to table compile		
																																						getCompileId(apikey, function(result3){
																																							if(result3.err_code == 0){
																																								//susun body
																																								var dataCompile = {
																																																	"compile_id": result3.compile_id,
																																																	"compile_name": projectName,
																																																	"compile_path": filepathjar,
																																																	"compile_type": "jar",
																																																	"compile_create_date": getFormattedDate(),
																																																	"compile_project_id": project_id,
																																																	"compile_inventory_id": inventory_id,
																																																};
																																								

																																								//proses simpan data user
																																								//method, endpoint, params, options, callback
																																								Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																									if(error){
																																								  	res.json({"err_code": 19, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																								  }else{
																																								  	//cek apakah ada error atau tidak
																																								  	if(body.err_code == 0){
																																									  	//get compile by id
																																									  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																											  if(errorc){
																																											  	res.json(errorc);
																																											  }else{
																																											  	var compile = JSON.parse(bodyc); //object
																																											  	//cek apakah ada error atau tidak
																																											  	if(compile.err_code == 0){
																																												  	//cek jumdata dulu
																																												  	if(compile.data.length > 0){
																																												  		res.json({"err_code": 0, "data":compile.data});
																																												  	}else{
																																											  			res.json({"err_code": 20, "err_msg": "Project not found"});	
																																												  	}
																																											  	}else{
																																											  		res.json({"err_code": 21, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																											  	}
																																											  }
																																											});
																																								  	}else{
																																								  		res.json(body);
																																								  	}
																																								  }
																																								})
																																							}else{
																																								result.err_code = 500;
																																								res.json(result3);	
																																							}
																																						});
																																					});
																																				}
																																			}
																																		})
																				                          }else{
																				                          	res.json({"err_code": 22, "err_msg": "No config in cluster"});
																				                          }
																														  	}else{
																				                          res.json({"err_code": 22, "err_msg": "Your cluster is not active"});
																														  	}
																												  		}else{
																												  			res.json({"err_code": 24, "err_msg": "Cluster not found"});
																												  		}
																												  	}else{
																												  		res.json(config);
																												  	}
																												  }
																												})
																											}else{
																												//setting ke config default
																												Api.get('default_config', {"apikey": apikey}, {}, function(error, response, body){
																													if(error){
																												  	res.json({"err_code": 13, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																												  }else{
																												  	//cek apakah ada error atau tidak
																												  	var config = JSON.parse(body);
																												  	
																												  	var jumdata = config.data.length;
																												  	if(config.err_code == 0){
																													  	
																													  		//looping config and check for config hdfs
																														  	var hostname_hdfs = "";
																														  	var port_hdfs = "";
																														  	var username_hdfs = "";

																														  	for(var i = 0; i < jumdata; i++){
																			                            switch(config.data[i].config_key){
																			                            	case 'hostnameHdfs':
									                                                    hostname_hdfs = config.data[i].config_value;
																			                              break;
																			                              case 'portHdfs':
									                                                    port_hdfs = config.data[i].config_value;
																			                              break;
																			                              case 'usernameHdfs':
									                                                    username_hdfs = config.data[i].config_value;
																			                              break;
																			                            }
																			                          }
																			                          
																			                       		//cek config harus lengkap
																			                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
																			                          	var hdfs = new Hdfs({
																																	  protocol: 'http',
																																	  hostname: hostname_hdfs,
																																	  port: port_hdfs
																																	});
																																	var filepathjar = '/user/'+username_hdfs+'/baciro/jar/'+projectName+'/';

																												  				//check dir dulu
																																	hdfs.liststatus({
																																	  'user.name': username_hdfs,
																																		path: filepathjar
																																	}, function(error, response, body){
																																		if(error){
																																			res.json({"err_code": 14, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																		}else{
																																			if(body.indexOf('does not exist') > 0){
																																				//buat dirnya
																																				hdfs.mkdirs({
																																					'user.name': username_hdfs,
																																					path: filepathjar
																																				}, function(error, response, body){
																																					if(error){
																																						res.json({"err_code": 15, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																																					}else{
																																						hdfs.upload({
																																						  'user.name': username_hdfs,
																																						  overwrite: true,
																																						  localpath: '/tmp/'+ projectName +'.jar',
																																						  path: filepathjar+ projectName +'.jar'
																																						}, function(error, response, body) {
																																						  //save to table compile		
																																							getCompileId(apikey, function(result3){
																																								if(result3.err_code == 0){
																																									//susun body
																																									var dataCompile = {
																																																		"compile_id": result3.compile_id,
																																																		"compile_name": projectName,
																																																		"compile_path": filepathjar,
																																																		"compile_type": "jar",
																																																		"compile_create_date": getFormattedDate(),
																																																		"compile_project_id": project_id,
																																																		"compile_inventory_id": inventory_id,
																																																	};
																																									

																																									//proses simpan data user
																																									//method, endpoint, params, options, callback
																																									Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																										if(error){
																																									  	res.json({"err_code": 16, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																									  }else{
																																									  	//cek apakah ada error atau tidak
																																									  	if(body.err_code == 0){
																																										  	//get compile by id
																																										  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																												  if(errorc){
																																												  	res.json(errorc);
																																												  }else{
																																												  	var compile = JSON.parse(bodyc); //object
																																												  	//cek apakah ada error atau tidak
																																												  	if(compile.err_code == 0){
																																													  	//cek jumdata dulu
																																													  	if(compile.data.length > 0){
																																													  		res.json({"err_code": 0, "data":compile.data});
																																													  	}else{
																																												  			res.json({"err_code": 17, "err_msg": "Project not found"});	
																																													  	}
																																												  	}else{
																																												  		res.json({"err_code": 18, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																												  	}
																																												  }
																																												});
																																									  	}else{
																																									  		res.json(body);
																																									  	}
																																									  }
																																									})
																																								}else{
																																									result.err_code = 500;
																																									res.json(result3);	
																																								}
																																							});
																																						});		
																																					}
																																				})
																																			}else{
																																				//langsung upload
																																				hdfs.upload({
																																				  'user.name': username_hdfs,
																																				  overwrite: true,
																																				  localpath: '/tmp/'+ projectName +'.jar',
																																				  path: filepathjar+projectName +'.jar'
																																				}, function(error, response, body) {
																																				  //save to table compile		
																																					getCompileId(apikey, function(result3){
																																						if(result3.err_code == 0){
																																							//susun body
																																							var dataCompile = {
																																																"compile_id": result3.compile_id,
																																																"compile_name": projectName,
																																																"compile_path": filepathjar,
																																																"compile_type": "jar",
																																																"compile_create_date": getFormattedDate(),
																																																"compile_project_id": project_id,
																																																"compile_inventory_id": inventory_id,
																																															};
																																							

																																							//proses simpan data user
																																							//method, endpoint, params, options, callback
																																							Api.post('compile', {"apikey": apikey}, {body: dataCompile, json:true}, function(error, response, body){
																																								if(error){
																																							  	res.json({"err_code": 19, "err_msg": error, "application": "Api project", "function": "getGenerateJar"});
																																							  }else{
																																							  	//cek apakah ada error atau tidak
																																							  	if(body.err_code == 0){
																																								  	//get compile by id
																																								  	Api.get('compile', {"apikey": apikey, "compile_id": result3.compile_id}, {}, function (errorc, responsec, bodyc) {
																																										  if(errorc){
																																										  	res.json(errorc);
																																										  }else{
																																										  	var compile = JSON.parse(bodyc); //object
																																										  	//cek apakah ada error atau tidak
																																										  	if(compile.err_code == 0){
																																											  	//cek jumdata dulu
																																											  	if(compile.data.length > 0){
																																											  		res.json({"err_code": 0, "data":compile.data});
																																											  	}else{
																																										  			res.json({"err_code": 20, "err_msg": "Project not found"});	
																																											  	}
																																										  	}else{
																																										  		res.json({"err_code": 21, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																																										  	}
																																										  }
																																										});
																																							  	}else{
																																							  		res.json(body);
																																							  	}
																																							  }
																																							})
																																						}else{
																																							result.err_code = 500;
																																							res.json(result3);	
																																						}
																																					});
																																				});
																																			}
																																		}
																																	})
																			                          }else{
																			                          	res.json({"err_code": 22, "err_msg": "No config in cluster default"});
																			                          }
																												  	}else{
																												  		res.json(config);
																												  	}
																												  }
																												})
																											}
																										}else{
																											res.json({"err_code": 23, "err_msg": result4.err_msg, "application": "Api generate jar", "function": "getGenerateJar"})
																										}
																									})
																			  					
																			  				}else{
																			  					if(error){
																			  						console.log(error);
																										res.json({"err_code": 24, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																			  					}else{
																			  						res.json({"err_code": 25, "err_msg": stdout, "application": "Api generate jar", "function": "getGenerateJar"});
																			  					}
																			  				}
																  						})
															  						}
															  					})
																	  		}
																	  	}else{
																  			res.json({"err_code": 26, "err_msg": "Project or inventory not found"});	
																	  	}
																  	}else{
																  		res.json({"err_code": 27, "err_msg": user.error, "application": "Api generate jar", "function": "getGenerateJar"});
																  	}
																  }
																});	
															}else{
																res.json({"err_code": 2, "err_msg": "Project is not share for this user"});
															}
														}else{
															res.json(result5);	
														}
													})
										  	}
									  	}else{
									  		res.json(body);
									  	}
									  }
									})									
								}else{
									res.json({"err_code": 28, "err_msg": "No inventory to compile"});
								}
							}else{
								res.json({"err_code": 29, "err_msg": "No project to compile"});
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				download_jar: function downloadJar(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var compile_id = req.params.compile_id;
							var project_id = req.params.project_id;
							var userIdApikey = result.user_id;

							if(typeof project_id !== 'undefined'){
								if(typeof compile_id !== 'undefined'){
									Api.get('projectByUser', {"apikey": apikey, "project_id": project_id, "user_id": userIdApikey}, {}, function(error, response, body){
										if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api generate jar", "function": "downloadJar"});
									  }else{
									  	project = JSON.parse(body);
									  	if(project.data.length > 0){
									  		//proses pembuatan file fisiknya ambil dari inventory
												Api.get('compile', {"apikey": apikey, "compile_id": compile_id}, {}, function (error, response, body) {
												  if(error){
												  	res.json({"err_code":2, "err_msg": error});
												  }else{
												  	compile = JSON.parse(body);
												  	if(compile.data.length > 0){
												  		//ambil config hdfs dari user cluster id
									  					getUserByApikey(apikey, function(result2){
																if(result2.err_code == 0){
																	//get cluster_config by cluster_id																	
																	var cluster_id = result2.user_cluster_id;
																	//check ketersedian clusterid
																	if(cluster_id !== 'null'){
																		Api.get('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function(error, response, body){
																			if(error){
																		  	res.json({"err_code": 3, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																		  }else{
																		  	//cek apakah ada error atau tidak
																		  	var config = JSON.parse(body);
																		  	var jumdata = config.data.length;
																		  	if(config.err_code == 0){
																		  		if(jumdata > 0){
																		  			// check status cluster active
																		  			if(config.data[0].cluster_status == 'active' || config.data[0].cluster_status == 'default'){
																		  				//looping config and check for config hdfs
																					  	var hostname_hdfs = "";
																					  	var port_hdfs = "";
																					  	var username_hdfs = "";

																					  	for(var i = 0; i < jumdata; i++){
										                            switch(config.data[i].config_key){
										                            	case 'hostnameHdfs':
	                                                  hostname_hdfs = config.data[i].config_value;
										                              break;
										                              case 'portHdfs':
	                                                  port_hdfs = config.data[i].config_value;
										                              break;
										                              case 'usernameHdfs':
	                                                  username_hdfs = config.data[i].config_value;
										                              break;
										                            }
										                          }
										                          
										                       		//cek config harus lengkap
										                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
										                          	var hdfs = new Hdfs({
																								  protocol: 'http',
																								  hostname: hostname_hdfs,
																								  port: port_hdfs
																								});
																								var filepathjar = compile.data[0].compile_path+compile.data[0].compile_name+'.'+compile.data[0].compile_type;
																								
																								hdfs.download({
																								  'user.name': username_hdfs,
																								  path: filepathjar
																								}, function(error, response, body) {
																								  res.download(body, compile.data[0].compile_name+'.'+compile.data[0].compile_type);
																								});
										                          }else{
										                          	res.json({"err_code": 7, "err_msg": "No config in cluster"});
										                          }
																		  			}else{
																		  				res.json({"err_code": 6, "err_msg": "Your cluster is not active"});
																		  			}
																		  		}else{
																		  			res.json({"err_code": 24, "err_msg": "Cluster not found"});
																		  		}
																		  	}else{
																		  		res.json(config);
																		  	}
																		  }
																		})
																	}else{
																		Api.get('default_config', {"apikey": apikey}, {}, function(error, response, body){
																			if(error){
																		  	res.json({"err_code": 3, "err_msg": error, "application": "Api generate jar", "function": "getGenerateJar"});
																		  }else{
																		  	//cek apakah ada error atau tidak
																		  	var config = JSON.parse(body);
																		  	var jumdata = config.data.length;
																		  	if(config.err_code == 0){
																		  		if(jumdata > 0){
																		  			// check status cluster active
																		  			if(config.data[0].cluster_status == 'active' || config.data[0].cluster_status == 'default'){
																		  				//looping config and check for config hdfs
																					  	var hostname_hdfs = "";
																					  	var port_hdfs = "";
																					  	var username_hdfs = "";

																					  	for(var i = 0; i < jumdata; i++){
										                            switch(config.data[i].config_key){
										                            	case 'hostnameHdfs':
	                                                  hostname_hdfs = config.data[i].config_value;
										                              break;
										                              case 'portHdfs':
	                                                  port_hdfs = config.data[i].config_value;
										                              break;
										                              case 'usernameHdfs':
	                                                  username_hdfs = config.data[i].config_value;
										                              break;
										                            }
										                          }
										                          
										                       		//cek config harus lengkap
										                          if(hostname_hdfs !== "" && port_hdfs !== "" && username_hdfs !== ""){
										                          	var hdfs = new Hdfs({
																								  protocol: 'http',
																								  hostname: hostname_hdfs,
																								  port: port_hdfs
																								});
																								var filepathjar = compile.data[0].compile_path+compile.data[0].compile_name+'.'+compile.data[0].compile_type;
																								
																								hdfs.download({
																								  'user.name': username_hdfs,
																								  path: filepathjar
																								}, function(error, response, body) {
																								  res.download(body, compile.data[0].compile_name+'.'+compile.data[0].compile_type);
																								});
										                          }else{
										                          	res.json({"err_code": 7, "err_msg": "No config in cluster"});
										                          }
																		  			}else{
																		  				res.json({"err_code": 6, "err_msg": "Your cluster is not active"});
																		  			}
																		  		}else{
																		  			res.json({"err_code": 24, "err_msg": "Cluster not found"});
																		  		}
																		  	}else{
																		  		res.json(config);
																		  	}
																		  }
																		});
																	}
																}else{
																	res.json(result2);
																}
															})  		
												  	}else{
															res.json({"err_code":5, "err_msg": "Data not found"});	  		
												  	}								  	
												  }
												});
									  	}else{
									  		checkProjectShare(apikey, project_id, userIdApikey, function(result5){
														if(result5.err_code == 0){
															var projectShare = result5.data;
															if(projectShare[0].project_is_share){
																//proses pembuatan file fisiknya ambil dari inventory
																Api.get('compile', {"apikey": apikey, "compile_id": compile_id}, {}, function (error, response, body) {
																  if(error){
																  	res.json({"err_code":3, "err_msg": error});
																  }else{
																  	compile = JSON.parse(body);
																  	if(compile.data.length > 0){
																  		res.json({"err_code":0, "data": compile.data});	  		
																  	}else{
																			res.json({"err_code":5, "err_msg": "Data not found"});	  		
																  	}								  	
																  }
																});
															}else{
																res.json({"err_code": 2, "err_msg": "Project is not share for this user"});
															}
														}else{
															res.json(result5);	
														}
													})
									  	}
									  }
									})
								}else{
									res.json({"err_code":2, "err_msg": "Compile id not found"});
								}
							}else{
								res.json({"err_code":2, "err_msg": "Project id not found"});
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});
				},
				view_jar: function viewJar(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var compile_id = req.params.compile_id;
							var project_id = req.params.project_id;
							var userIdApikey = result.user_id;

							if(typeof project_id !== 'undefined'){
								if(typeof compile_id !== 'undefined'){
									Api.get('projectByUser', {"apikey": apikey, "project_id": project_id, "user_id": userIdApikey}, {}, function(error, response, body){
										if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api generate jar", "function": "viewJar"});
									  }else{
									  	project = JSON.parse(body);
									  	if(project.data.length > 0){
									  		//proses pembuatan file fisiknya ambil dari inventory
												Api.get('view_jar', {"apikey": apikey, "project_id": project_id, "compile_id": compile_id}, {}, function (error, response, body) {
												  if(error){
												  	res.json({"err_code":3, "err_msg": error});
												  }else{
												  	compile = JSON.parse(body);
												  	if(compile.data.length > 0){
												  		res.json({"err_code":0, "data": compile.data});	  		
												  	}else{
															res.json({"err_code":5, "err_msg": "Data not found"});	  		
												  	}								  	
												  }
												});
									  	}else{
									  		checkProjectShare(apikey, project_id, userIdApikey, function(result5){
														if(result5.err_code == 0){
															var projectShare = result5.data;
															if(projectShare[0].project_is_share){
																//proses pembuatan file fisiknya ambil dari inventory
																Api.get('view_jar', {"apikey": apikey, "project_id": project_id, "compile_id": compile_id}, {}, function (error, response, body) {
																  if(error){
																  	res.json({"err_code":3, "err_msg": error});
																  }else{
																  	compile = JSON.parse(body);
																  	if(compile.data.length > 0){
																  		res.json({"err_code":0, "data": compile.data});	  		
																  	}else{
																			res.json({"err_code":5, "err_msg": "Data not found"});	  		
																  	}								  	
																  }
																});
															}else{
																res.json({"err_code": 2, "err_msg": "Project is not share for this user"});
															}
														}else{
															res.json(result5);	
														}
													})
									  	}
									  }
									})
								}else{
									Api.get('projectByUser', {"apikey": apikey, "project_id": project_id, "user_id": userIdApikey}, {}, function(error, response, body){
										if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api generate jar", "function": "viewJar"});
									  }else{
									  	project = JSON.parse(body);
									  	if(project.data.length > 0){
									  		//proses pembuatan file fisiknya ambil dari inventory
												Api.get('view_jars', {"apikey": apikey, "project_id": project_id}, {}, function (error, response, body) {
												  if(error){
												  	res.json({"err_code":3, "err_msg": error});
												  }else{
												  	compile = JSON.parse(body);
												  	if(compile.data.length > 0){
												  		res.json({"err_code":0, "data": compile.data});	  		
												  	}else{
															res.json({"err_code":5, "err_msg": "Data is empty"});	  		
												  	}								  	
												  }
												});
									  	}else{
									  		res.json({"err_code":4, "err_msg": "Access denied for this project"});	
									  	}
									  }
									})
								}
							}else{
								res.json({"err_code":2, "err_msg": "Project id not found"});
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});
				}
			}
}

function checkApikey(apikey, ipAddres, callback){
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
		  		//check user_id == 1 <-- admin/root
		  		if(user.data[0].user_id == 1){
		  			x({"err_code": 0, "status": "root", "user_role_id": user.data[0].user_role_id, "user_id": user.data[0].user_id});	
		  		}else{
			  		//cek apikey
				  	if(apikey == user.data[0].user_apikey){
				  		//ipaddress
					  	dataIpAddress = user.data[0].user_ip_address;
					  	if(dataIpAddress.indexOf(ipAddres) >= 0){
					  		//user is active
					  		if(user.data[0].user_is_active){
					  			//cek data user terpenuhi
					  			x({"err_code": 0, "status": "active", "user_role_id": user.data[0].user_role_id, "user_id": user.data[0].user_id});	
					  		}else{
					  			x({"err_code": 5, "err_msg": "User not active", "application": "user_management"});	
					  		}
					  	}else{
					  		x({"err_code": 4, "err_msg": "Ip Address not registered", "application": "user_management"});
					  	}
				  	}else{
				  		x({"err_code": 3, "err_msg": "Wrong apikey", "application": "user_management"});
				  	}
		  		}
		  		
		  	}else{
		  			x({"err_code": 2, "err_msg": "Wrong apikey", "application": "user_management"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "user_management"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkProjectShare(apikey, project_id, user_id, callback){
	Api.get('check_project_share', {"apikey": apikey, "project_id": project_id, "user_id": user_id}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	project = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(project.err_code == 0){
		  	//cek jumdata dulu
		  	if(project.data.length > 0){
		  		x({"err_code": 0, "data": project.data});	
		  	}else{
	  			x({"err_code": 2, "err_msg": "Access denied for this project"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": project.error, "application": "Api Project", "function": "checkProjectShare"});
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

function getCompileId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_compile_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	compile = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(compile.err_code == 0){
		  	//cek jumdata dulu
		  	if(compile.data.length > 0){
		  		var compile_id = parseInt(compile.data[0].compile_id) + 1;
		  		x({"err_code": 0, "compile_id": compile_id});	
		  	}else{
		  		x({"err_code": 0, "compile_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": project.error, "application": "Api generate jar", "function": "getCompileId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function getUserByApikey(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_user_by_apikey', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		var user_firstname = user.data[0].user_firstname;
		  		var user_lastname = user.data[0].user_lastname;
		  		var user_cluster_id = user.data[0].user_cluster_id;
		  		x({"err_code": 0, "user_firstname": user_firstname, "user_lastname": user_lastname, "user_cluster_id": user_cluster_id});	
		  	}else{
		  		x({"err_code": 2, "err_msg": "Apikey failed", "application": "Api project", "function": "getUserByApikey"});
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": inventory.error, "application": "Api project", "function": "getUserByApikey"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}



//get method
app.get('/:apikey/generate_jar/:project_id?/:inventory_id?', Jar.get.generate_jar);
app.get('/:apikey/download_jar/:compile_id?/project/:project_id?/', Jar.get.download_jar);
app.get('/:apikey/view_jar/:compile_id?/project/:project_id?', Jar.get.view_jar);

//post method
// app.post('/:apikey/project/user/:user_id', Project.post.project);



//put method
// app.put('/:apikey/project/:project_id/user/:user_id', Project.put.projectByUser);


//delete method
// app.delete('/:apikey/project/:project_id', Project.delete.project);



var server = app.listen(port, host, function () {
  console.log("Server running at http://%s:%s", host, port);
})