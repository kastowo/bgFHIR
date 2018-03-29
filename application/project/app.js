var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var configYaml = yamlconfig.readConfig('../config/config.yml');
var Apiclient = require('apiclient');
var md5 = require('md5');
var data2xml = require('data2xml');
var convert = data2xml({xmlheader: '<?xml version="1.0" standalone="yes" ?>\n'});

var host = configYaml.project.host;
var port = configYaml.project.port;

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
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

// parse application/json
app.use(bodyParser.json({limit: '50mb'}))

var Project = {
			get: {
				projectByUser: function getProjectByUser(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var project_id = req.params.project_id;
							var user_id = req.params.user_id;
							if(result.status != 'root' && user_id != result.user_id){
								res.json({"err_code": 1, "err_msg": "Access denied. Cannot access this project"});	
							}else{
								if(typeof project_id !== 'undefined'){
									Api.get('projectByUser', {"apikey": apikey, "project_id": project_id, "user_id": user_id}, {}, function (error, response, body) {
									  if(error){
									  	res.json(error);
									  }else{
									  	var user = JSON.parse(body); //object
									  	//cek apakah ada error atau tidak
									  	if(user.err_code == 0){
										  	//cek jumdata dulu
										  	if(user.data.length > 0){
										  		res.json({"err_code": 0, "data":user.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Project is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getProjectByUser"});
									  	}
									  }
									});
								}else{
									Api.get('projectsByUser', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
									  if(error){
									  	res.json(error);
									  }else{
									  	var user = JSON.parse(body); //object
									  	//cek apakah ada error atau tidak
									  	if(user.err_code == 0){
										  	//cek jumdata dulu
										  	if(user.data.length > 0){
										  		res.json({"err_code": 0, "data":user.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "No project for this user"});	
										  	}
									  	}else{
									  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getProjectByUser"});
									  	}
									  }
									});
								}
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				projectByGroup: function getProjectByGroup(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var project_id = req.params.project_id;
							var group_id = req.params.group_id;

							if(typeof project_id !== 'undefined'){
								Api.get('projectByGroup', {"apikey": apikey, "project_id": project_id, "group_id": group_id}, {}, function (error, response, body) {
								  if(error){
								  	res.json(error);
								  }else{
								  	var user = JSON.parse(body); //object
								  	//cek apakah ada error atau tidak
								  	if(user.err_code == 0){
									  	//cek jumdata dulu
									  	if(user.data.length > 0){
									  		res.json({"err_code": 0, "data":user.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Project is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getProjectByGroup"});
								  	}
								  }
								});
							}else{
								Api.get('projectsByGroup', {"apikey": apikey, "group_id": group_id}, {}, function (error, response, body) {
								  if(error){
								  	x(error);
								  }else{
								  	var user = JSON.parse(body); //object
								  	//cek apakah ada error atau tidak
								  	if(user.err_code == 0){
									  	//cek jumdata dulu
									  	if(user.data.length > 0){
									  		res.json({"err_code": 0, "data":user.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "No project for this group"});	
									  	}
								  	}else{
								  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getProjectByGroup"});
								  	}
								  }
								});
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				inventory: function getInventory(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var project_id = req.params.project_id;
							var inventory_id = req.params.inventory_id;
							
							userIdApikey = result.user_id;
							//check project dulu
							Api.get('projectByUser', {"apikey": apikey, "project_id": project_id, "user_id": userIdApikey}, {}, function(error, response, body){
								if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addInventory"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	body = JSON.parse(body);
							  	if(body.err_code == 0){													  		
								  	if(body.data.length > 0){
											if(typeof project_id !== 'undefined'){
												if(typeof inventory_id !== 'undefined'){
													Api.get('inventory', {"apikey": apikey, "project_id": project_id, "inventory_id": inventory_id}, {}, function (error, response, body) {
													  if(error){
													  	res.json(error);
													  }else{
													  	var user = JSON.parse(body); //object
													  	//cek apakah ada error atau tidak
													  	if(user.err_code == 0){
														  	//cek jumdata dulu
														  	if(user.data.length > 0){
														  		for(i=0; i<user.data.length;i++){
														  			if(user.data[i].inventory_package != 'null'){
															  			var packageEncrypt = user.data[i].inventory_package;
															  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
															  			var packageJSON = JSON.parse(packageDecrypt);
															  			user.data[i].inventory_package = packageJSON;
														  			}
														  		}
														  		res.json({"err_code": 0, "data":user.data});
														  	}else{
													  			res.json({"err_code": 2, "err_msg": "Inventory is not found"});	
														  	}
													  	}else{
													  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getInventory"});
													  	}
													  }
													});
												}else{
													Api.get('inventories', {"apikey": apikey, "project_id": project_id}, {}, function (error, response, body) {
													  if(error){
													  	res.json(error);
													  }else{
													  	var user = JSON.parse(body); //object
													  	//cek apakah ada error atau tidak
													  	if(user.err_code == 0){
														  	//cek jumdata dulu
														  	if(user.data.length > 0){
														  		for(i=0; i<user.data.length;i++){
														  			if(user.data[i].inventory_package != 'null'){
															  			var packageEncrypt = user.data[i].inventory_package;
															  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
															  			var packageJSON = JSON.parse(packageDecrypt);
															  			user.data[i].inventory_package = packageJSON;
														  			}
														  		}
														  		res.json({"err_code": 0, "data":user.data});
														  	}else{
													  			res.json({"err_code": 2, "err_msg": "Inventory is empty"});	
														  	}
													  	}else{
													  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getInventory"});
													  	}
													  }
													});
												}
											}else{
												res.json({"err_code": 3, "err_msg": "No project is selected"});	
											}
								  	}else{
											checkProjectShare(apikey, project_id, userIdApikey, function(result5){
												if(result5.err_code == 0){
													var projectShare = result5.data;
													
													if(projectShare[0].project_is_share){
														if(typeof project_id !== 'undefined'){
															if(typeof inventory_id !== 'undefined'){
																Api.get('inventory', {"apikey": apikey, "project_id": project_id, "inventory_id": inventory_id}, {}, function (error, response, body) {
																  if(error){
																  	res.json(error);
																  }else{
																  	var user = JSON.parse(body); //object
																  	//cek apakah ada error atau tidak
																  	if(user.err_code == 0){
																	  	//cek jumdata dulu
																	  	if(user.data.length > 0){
																	  		for(i=0; i<user.data.length;i++){
																	  			if(user.data[i].inventory_package != 'null'){
																		  			var packageEncrypt = user.data[i].inventory_package;
																		  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
																		  			var packageJSON = JSON.parse(packageDecrypt);
																		  			user.data[i].inventory_package = packageJSON;
																	  			}
																	  		}
																	  		res.json({"err_code": 0, "data":user.data});
																	  	}else{
																  			res.json({"err_code": 2, "err_msg": "Inventory is not found"});	
																	  	}
																  	}else{
																  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getInventory"});
																  	}
																  }
																});
															}else{
																Api.get('inventories', {"apikey": apikey, "project_id": project_id}, {}, function (error, response, body) {
																  if(error){
																  	res.json(error);
																  }else{
																  	var user = JSON.parse(body); //object
																  	//cek apakah ada error atau tidak
																  	if(user.err_code == 0){
																	  	//cek jumdata dulu
																	  	if(user.data.length > 0){
																	  		for(i=0; i<user.data.length;i++){
																	  			if(user.data[i].inventory_package != 'null'){
																		  			var packageEncrypt = user.data[i].inventory_package;
																		  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
																		  			var packageJSON = JSON.parse(packageDecrypt);
																		  			user.data[i].inventory_package = packageJSON;
																	  			}
																	  		}
																	  		res.json({"err_code": 0, "data":user.data});
																	  	}else{
																  			res.json({"err_code": 2, "err_msg": "Inventory is empty"});	
																	  	}
																  	}else{
																  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getInventory"});
																  	}
																  }
																});
															}
														}else{
															res.json({"err_code": 3, "err_msg": "No project is selected"});	
														}
													}else{
														res.json({"err_code": 2, "err_msg": "Project is not share to this user"});
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
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				download_inventory: function downloadInventory(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var project_id = req.params.project_id;
							var inventory_id = req.params.inventory_id;
							
							userIdApikey = result.user_id;
							//check project dulu
							Api.get('projectByUser', {"apikey": apikey, "project_id": project_id, "user_id": userIdApikey}, {}, function(error, response, body){
								if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addInventory"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	body = JSON.parse(body);
							  	if(body.err_code == 0){													  		
								  	if(body.data.length > 0){
											if(typeof project_id !== 'undefined'){
												if(typeof inventory_id !== 'undefined'){
													Api.get('inventory', {"apikey": apikey, "project_id": project_id, "inventory_id": inventory_id}, {}, function (error, response, body) {
													  if(error){
													  	res.json(error);
													  }else{
													  	var user = JSON.parse(body); //object
													  	//cek apakah ada error atau tidak
													  	if(user.err_code == 0){
														  	//cek jumdata dulu
														  	if(user.data.length > 0){
														  		filepath = '/tmp/'+ user.data[0].inventory_name + '.' + user.data[0].inventory_type;
														  		
													  			//tulis file ke dir tsb
													  			var packageEncrypt = user.data[0].inventory_package;
													  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
													  			var packageJson = JSON.parse(packageDecrypt);
													  			var packageXml = convert('BG', packageJson);

													  			packageXml = packageXml.replace('<BG>', '');
													  			packageXml = packageXml.replace('</BG>', '');
													  			filepackage = packageXml;
											  					fs.writeFile(filepath, filepackage,{mode:0o777}, function(err){
											  						if(err){
											  							res.json({"err_code": 12, "err_msg": err, "application": "Api generate jar", "function": "getGenerateJar"});
											  						}else{
											  							res.download(filepath);
											  						}
											  					})
														  	}else{
													  			res.json({"err_code": 2, "err_msg": "Inventory is not found"});	
														  	}
													  	}else{
													  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getInventory"});
													  	}
													  }
													});
												}else{
													res.json({"err_code": 4, "err_msg": "Inventory ID is not found"});	
												}
											}else{
												res.json({"err_code": 3, "err_msg": "No project is selected"});	
											}
								  	}else{
											checkProjectShare(apikey, project_id, userIdApikey, function(result5){
												if(result5.err_code == 0){
													var projectShare = result5.data;
													
													if(projectShare[0].project_is_share){
														if(typeof project_id !== 'undefined'){
															if(typeof inventory_id !== 'undefined'){
																Api.get('inventory', {"apikey": apikey, "project_id": project_id, "inventory_id": inventory_id}, {}, function (error, response, body) {
																  if(error){
																  	res.json(error);
																  }else{
																  	var user = JSON.parse(body); //object
																  	//cek apakah ada error atau tidak
																  	if(user.err_code == 0){
																	  	//cek jumdata dulu
																	  	if(user.data.length > 0){
																	  		filepath = '/tmp/'+ user.data[0].inventory_name + '.' + user.data[0].inventory_type;
														  		
																  			//tulis file ke dir tsb
																  			var packageEncrypt = user.data[0].inventory_package;
																  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
																  			var packageJson = JSON.parse(packageDecrypt);
																  			var packageXml = convert('BG', packageJson);

																  			packageXml = packageXml.replace('<BG>', '');
																  			packageXml = packageXml.replace('</BG>', '');
																  			filepackage = packageXml;
														  					fs.writeFile(filepath, filepackage,{mode:0o777}, function(err){
														  						if(err){
														  							res.json({"err_code": 12, "err_msg": err, "application": "Api generate jar", "function": "getGenerateJar"});
														  						}else{
														  							res.download(filepath);
														  						}
														  					})
																	  	}else{
																  			res.json({"err_code": 2, "err_msg": "Inventory is not found"});	
																	  	}
																  	}else{
																  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getInventory"});
																  	}
																  }
																});
															}else{
																res.json({"err_code": 4, "err_msg": "Inventory ID is not found"});					
															}
														}else{
															res.json({"err_code": 3, "err_msg": "No project is selected"});	
														}
													}else{
														res.json({"err_code": 2, "err_msg": "Project is not share to this user"});
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
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				projectInventoryByUser: function getProjectInventoryByUser(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var user_id = req.params.user_id;
							if(result.status != 'root' && user_id != result.user_id){
								res.json({"err_code": 1, "err_msg": "Access denied. Cannot access this project"});	
							}else{
								if(typeof user_id !== 'undefined'){
									Api.get('projectInventoryByUser', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
									  if(error){
									  	res.json(error);
									  }else{
									  	var user = JSON.parse(body); //object
									  	//cek apakah ada error atau tidak
									  	if(user.err_code == 0){
										  	//cek jumdata dulu
										  	if(user.data.length > 0){
										  		for(i=0; i<user.data.length;i++){
										  			if(user.data[i].inventory_package != 'null'){
											  			var packageEncrypt = user.data[i].inventory_package;
											  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
											  			var packageJSON = JSON.parse(packageDecrypt);
											  			user.data[i].inventory_package = packageJSON;
										  			}
										  		}
										  		res.json({"err_code": 0, "data":user.data});
										  	}else{
									  			res.json({"err_code": 2, "err_msg": "Project or user is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getProjectByUser"});
									  	}
									  }
									});
								}else{
									res.json({"err_code": 2, "err_msg": "User id not found"});	
								}
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
			},
			post: {
				project: function addProject(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var user_id = req.params.user_id;
					var project_name = req.body.project_name.trim();
							project_name = project_name.replace(/ /g,'');
							project_name = project_name.replace(/[^\w\s]/gi, '');

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//cek email data user apakah sudah ada atau belum
							checkProjectName(apikey, project_name, user_id, function(result2){
								if(result2.err_code == 0){
									//ambil id user terakhir
									getProjectId(apikey, function(result3){
										if(result3.err_code == 0){
											//susun body
											var dataProject = {
																				"project_id": result3.project_id,
																				"project_name": project_name,
																				"project_create_date": getFormattedDate()
																			};
											
											//proses simpan data user
											//method, endpoint, params, options, callback
											Api.post('project', {"apikey": apikey, "user_id": user_id}, {body: dataProject, json:true}, function(error, response, body){
												if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addProject"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	if(body.err_code == 0){
												  	res.json({"err_code": 0, "data": body.data})
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
								}else{
									result.err_code = 500;
									res.json(result2);		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});					
				},
				inventory: function addInventory(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var project_id = req.params.project_id;
					var inventory_name = req.body.inventory_name.trim();
							inventory_name = inventory_name.replace(/ /g,'');
							inventory_name = inventory_name.replace(/[^\w\s]/gi, '');							
					var inventory_type = req.body.inventory_type;
					var inventory_package = req.body.inventory_package;

					//encryption base64 encode
					inventory_package = JSON.stringify(inventory_package);
					inventory_package = new Buffer(inventory_package).toString('base64');			

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//check apakah project ini di share atau tidak, user id dari apikey
							userIdApikey = result.user_id; 
							//check project dulu
							Api.get('projectByUser', {"apikey": apikey, "project_id": project_id, "user_id": userIdApikey}, {}, function(error, response, body){
								if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addInventory"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	body = JSON.parse(body);
							  	if(body.err_code == 0){													  		
								  	if(body.data.length > 0){
								  		checkInventoryName(apikey, inventory_name, project_id, function(result2){
												if(result2.err_code == 0){
													//ambil id user terakhir
													getInventoryId(apikey, function(result3){
														if(result3.err_code == 0){
															getUserByApikey(apikey, function(result4){
																if(result4.err_code == 0){
																	//setting path --> /home/baciro/namauser/tahun/bulan/tanggal/file.xml
																	//susun body
																	if(result4.user_firstname != 'null' && result4.user_lastname != 'null'){
																		var path = '/usr/share/baciro/inventory/'+ result4.user_firstname +'_'+ result4.user_lastname + '/' + inventory_type + '/';
																	}else{
																		var path = '/usr/share/baciro/inventory/'+ result4.user_firstname + '/' + inventory_type + '/';
																	}

																	var dataInventory = {
																										"inventory_id": result3.inventory_id,
																										"inventory_name": inventory_name.trim(),
																										"inventory_type": inventory_type,
																										"inventory_path": path,
																										"inventory_package": inventory_package,
																										"inventory_create_date": getFormattedDate(),
																										"inventory_update_date": ""
																									};
																	
																	//proses simpan data user
																	//method, endpoint, params, options, callback
																	Api.post('inventory', {"apikey": apikey, "project_id": project_id}, {body: dataInventory, json:true}, function(error, response, body){
																		if(error){
																	  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addInventory"});
																	  }else{
																	  	//cek apakah ada error atau tidak
																	  	if(body.err_code == 0){													  		
																		  	for(i=0; i<body.data.length;i++){
																		  		if(body.data[i].inventory_package != 'null'){
																		  			var packageEncrypt = body.data[i].inventory_package;
																		  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
																		  			var packageJSON = JSON.parse(packageDecrypt);
																		  			body.data[i].inventory_package = packageJSON;
																		  		}
																	  		}
																	  		res.json({"err_code": 0, "data":body.data});
																	  	}else{
																	  		res.json(body);
																	  	}
																	  }
																	})
																}else{
																	res.json({"err_code": 1, "err_msg": result4.err_msg, "application": "Api project", "function": "addInventory"})
																}
															})
														}else{
															res.json(result3);	
														}
													});
												}else{
													// res.json(result2);		
													getInventoryId(apikey, function(result3){
														if(result3.err_code == 0){
															getUserByApikey(apikey, function(result4){
																if(result4.err_code == 0){
																	//setting path --> /home/baciro/namauser/tahun/bulan/tanggal/file.xml
																	//susun body
																	if(result4.user_firstname != 'null' && result4.user_lastname != 'null'){
																		var path = '/usr/share/baciro/inventory/'+ result4.user_firstname +'_'+ result4.user_lastname + '/' + inventory_type + '/';
																	}else{
																		var path = '/usr/share/baciro/inventory/'+ result4.user_firstname + '/' + inventory_type + '/';
																	}
																	
																	var dataInventory = {
																										"inventory_id": result3.inventory_id,
																										"inventory_name": inventory_name,
																										"inventory_type": inventory_type,
																										"inventory_path": path,
																										"inventory_package": inventory_package,
																										"inventory_create_date": getFormattedDate(),
																										"inventory_update_date": getFormattedDate()
																									};
																	
																	//proses simpan data user
																	//method, endpoint, params, options, callback
																	Api.post('inventory', {"apikey": apikey, "project_id": project_id}, {body: dataInventory, json:true}, function(error, response, body){
																		if(error){
																	  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addInventory"});
																	  }else{
																	  	//cek apakah ada error atau tidak
																	  	if(body.err_code == 0){
																		  	for(i=0; i<body.data.length;i++){
																	  			if(body.data[i].inventory_package != 'null'){
																		  			var packageEncrypt = body.data[i].inventory_package;
																		  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
																		  			var packageJSON = JSON.parse(packageDecrypt);
																		  			body.data[i].inventory_package = packageJSON;
																		  		}
																	  		}
																	  		res.json({"err_code": 0, "data":body.data});
																	  	}else{
																	  		res.json(body);
																	  	}
																	  }
																	})
																}else{
																	res.json({"err_code": 1, "err_msg": result4.err_msg, "application": "Api project", "function": "addInventory"})
																}
															})
														}else{
															result.err_code = 500;
															res.json(result3);	
														}
													});
												}
											})	
								  	}else{
								  		checkProjectShare(apikey, project_id, userIdApikey, function(result5){
												if(result5.err_code == 0){
													var projectShare = result5.data;
													
													if(projectShare[0].project_is_share){
														checkInventoryName(apikey, inventory_name, project_id, function(result2){
															if(result2.err_code == 0){
																//ambil id user terakhir
																getInventoryId(apikey, function(result3){
																	if(result3.err_code == 0){
																		getUserByApikey(apikey, function(result4){
																			if(result4.err_code == 0){
																				//setting path --> /home/baciro/namauser/tahun/bulan/tanggal/file.xml
																				//susun body
																				if(result4.user_firstname != 'null' && result4.user_lastname != 'null'){
																					var path = '/usr/share/baciro/inventory/'+ result4.user_firstname +'_'+ result4.user_lastname + '/' + inventory_type + '/';
																				}else{
																					var path = '/usr/share/baciro/inventory/'+ result4.user_firstname + '/' + inventory_type + '/';
																				}

																				var dataInventory = {
																													"inventory_id": result3.inventory_id,
																													"inventory_name": inventory_name.trim(),
																													"inventory_type": inventory_type,
																													"inventory_path": path,
																													"inventory_package": inventory_package,
																													"inventory_create_date": getFormattedDate(),
																													"inventory_update_date": ""
																												};
																				
																				//proses simpan data user
																				//method, endpoint, params, options, callback
																				Api.post('inventory', {"apikey": apikey, "project_id": project_id}, {body: dataInventory, json:true}, function(error, response, body){
																					if(error){
																				  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addInventory"});
																				  }else{
																				  	//cek apakah ada error atau tidak
																				  	if(body.err_code == 0){													  		
																					  	for(i=0; i<body.data.length;i++){
																					  		if(body.data[i].inventory_package != 'null'){
																					  			var packageEncrypt = body.data[i].inventory_package;
																					  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
																					  			var packageJSON = JSON.parse(packageDecrypt);
																					  			body.data[i].inventory_package = packageJSON;
																					  		}
																				  		}
																				  		res.json({"err_code": 0, "data":body.data});
																				  	}else{
																				  		res.json(body);
																				  	}
																				  }
																				})
																			}else{
																				res.json({"err_code": 1, "err_msg": result4.err_msg, "application": "Api project", "function": "addInventory"})
																			}
																		})
																	}else{
																		res.json(result3);	
																	}
																});
															}else{
																// res.json(result2);		
																getInventoryId(apikey, function(result3){
																	if(result3.err_code == 0){
																		getUserByApikey(apikey, function(result4){
																			if(result4.err_code == 0){
																				//setting path --> /home/baciro/namauser/tahun/bulan/tanggal/file.xml
																				//susun body
																				if(result4.user_firstname != 'null' && result4.user_lastname != 'null'){
																					var path = '/usr/share/baciro/inventory/'+ result4.user_firstname +'_'+ result4.user_lastname + '/' + inventory_type + '/';
																				}else{
																					var path = '/usr/share/baciro/inventory/'+ result4.user_firstname + '/' + inventory_type + '/';
																				}
																				
																				var dataInventory = {
																													"inventory_id": result3.inventory_id,
																													"inventory_name": inventory_name,
																													"inventory_type": inventory_type,
																													"inventory_path": path,
																													"inventory_package": inventory_package,
																													"inventory_create_date": getFormattedDate(),
																													"inventory_update_date": getFormattedDate()
																												};
																				
																				//proses simpan data user
																				//method, endpoint, params, options, callback
																				Api.post('inventory', {"apikey": apikey, "project_id": project_id}, {body: dataInventory, json:true}, function(error, response, body){
																					if(error){
																				  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addInventory"});
																				  }else{
																				  	//cek apakah ada error atau tidak
																				  	if(body.err_code == 0){
																					  	for(i=0; i<body.data.length;i++){
																				  			if(body.data[i].inventory_package != 'null'){
																					  			var packageEncrypt = body.data[i].inventory_package;
																					  			var packageDecrypt = new Buffer(packageEncrypt, 'base64').toString('ascii');
																					  			var packageJSON = JSON.parse(packageDecrypt);
																					  			body.data[i].inventory_package = packageJSON;
																					  		}
																				  		}
																				  		res.json({"err_code": 0, "data":body.data});
																				  	}else{
																				  		res.json(body);
																				  	}
																				  }
																				})
																			}else{
																				res.json({"err_code": 1, "err_msg": result4.err_msg, "application": "Api project", "function": "addInventory"})
																			}
																		})
																	}else{
																		result.err_code = 500;
																		res.json(result3);	
																	}
																});
															}
														})			
													}else{
														res.json({"err_code": 2, "err_msg": "Project is not share to this user"});
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
							result.err_code = 500;
							res.json(result);
						}
					});					
				},
			},	
			put: {
				projectByUser: function updateProjectByUser(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data user
							var user_id = req.params.user_id;
							var project_id = req.params.project_id;
							if(result.status != 'root' && user_id != result.user_id){
								res.json({"err_code": 1, "err_msg": "Access denied. Cannot access this project"});	
							}else{
								checkUserId(apikey, user_id, function(result2){
									if(result2.err_code == 0){
										if(typeof project_id !== 'undefined'){
											checkProjectId(apikey, project_id, function(result3){
												if(result3.err_code == 0){
													//cek untuk data yang akan diupdate
													var dataProject = {};
													if(typeof req.body.project_name !== 'undefined'){
														project_name = req.body.project_name;
														project_name = project_name.replace(/ /g,'');
														project_name = project_name.replace(/[^\w\s]/gi, '');	
														dataProject.project_name = project_name;
													}							

													dataProject.project_update_date = getFormattedDate();

													Api.put('projectByUser', {"apikey": apikey, "user_id": user_id, "project_id": project_id}, {body: dataProject, json:true}, function (error, response, body) {
													  if(error){
													  	res.json(error)
													  }else{
													  	if(body.err_code == 0){
														  	res.json({"err_code": 0, "data": body.data});
													  	}else{
													  		res.json({"err_code": 1, "err_msg": body.error, "application": "Api project", "function": "updateProjectByUser"});
													  	}
													  }
													});
												}else{
													res.json(result3);
												}
											})
										}else{
											res.json({"err_code": 3, "err_msg": "Project id not found"});
										}									
									}else{
										res.json(result2);
									}
								})
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				projectShareGroup: function updateProjectShareGroup(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data user
							var group_id = req.params.group_id;
							var project_id = req.params.project_id;
							var userIdApikey = result.user_id;

							//check status member in group
							checkMemberGroup(apikey, userIdApikey, group_id, function(result4){
								if(result4.err_code == 0){
									checkGroupId(apikey, group_id, function(result2){
										if(result2.err_code == 0){
											if(typeof project_id !== 'undefined'){
												checkProjectId(apikey, project_id, function(result3){
													if(result3.err_code == 0){
														//cek untuk data yang akan diupdate
														var dataProject = {};
														if(typeof req.body.project_is_share !== 'undefined'){
															dataProject.project_is_share = req.body.project_is_share;
														}							

														dataProject.project_update_date = getFormattedDate();

														Api.put('projectShareGroup', {"apikey": apikey, "group_id": group_id, "project_id": project_id}, {body: dataProject, json:true}, function (error, response, body) {
														  if(error){
														  	res.json(error)
														  }else{
														  	if(body.err_code == 0){
														  		if(req.body.project_is_share == 'true'){
															  		res.json({"err_code": 0, "status": "Project has been shared to group"});
														  		}else{
														  			res.json({"err_code": 0, "status": "Project has been unshare in group"});
														  		}

														  	}else{
														  		res.json({"err_code": 1, "err_msg": body.error, "application": "Api project", "function": "updateProjectByUser"});
														  	}
														  }
														});
													}else{
														res.json(result3)
													}
												})
											}else{
												res.json({"err_code": 3, "err_msg": "Project id not found"});
											}
										}else{
											res.json(result2)
										}
									})	
								}else{
									res.json(result4)
								}
							})									
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				}
			},	
			delete: {
				project: function deleteProject(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var project_id = req.params.project_id;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data user
							if(typeof project_id !== 'undefined'){
								userIdApikey = result.user_id; 
								//check project dulu
								Api.get('projectByUser', {"apikey": apikey, "project_id": project_id, "user_id": userIdApikey}, {}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api project", "function": "addInventory"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	body = JSON.parse(body);
								  	if(body.err_code == 0){													  		
									  	if(body.data.length > 0){
									  		checkProjectId(apikey, project_id, function(result3){
													if(result3.err_code == 0){
														Api.delete('project', {"apikey": apikey, "project_id": project_id}, {}, function (error, response, body) {
														  if(error){
														  	res.json(error);
														  }else{
														  	//cek apakah ada error atau tidak
														  	rez = JSON.parse(body);
														  	if(rez.err_code == 0){
															  	res.json({"err_code": 0, "status": "Project has been deleted"})
														  	}else{
														  		res.json(body);
														  	}
														  }
														});
													}else{
														res.json(result3);
													}
												})
									  	}else{
												res.json({"err_code": 2, "err_msg": "Access denied. Cannot access this project"});			
									  	}
								  	}else{
								  		res.json(body);
								  	}
								  }
								})
							}else{
								res.json({"err_code": 3, "err_msg": "Project id not found"});	
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});
				},
				inventory: function deleteInventory(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							var inventory_id = req.params.inventory_id;
							var project_id = req.params.project_id;

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
													checkInventoryId(apikey, inventory_id, function(result2){
														if(result2.err_code == 0){
															Api.delete('inventory', {"apikey": apikey, "inventory_id": inventory_id}, {}, function (error, response, body) {
															  if(error){
															  	res.json(error);
															  }else{
															  	//cek apakah ada error atau tidak
															  	rez = JSON.parse(body);
															  	if(rez.err_code == 0){
																  	res.json({"err_code": 0, "status": "Inventory has been deleted"})
															  	}else{
															  		res.json(body);
															  	}
															  }
															});
														}else{
															res.json(result2)
														}
													})  		
										  	}else{
													res.json({"err_code": 2, "err_msg": "Access denied. Cannot access this project"});			
										  	}
									  	}else{
									  		res.json(body);
									  	}
									  }
									})								
								}else{
									res.json({"err_code": 2, "err_msg": "Inventory ID is not found"});		
								}
							}else{
								res.json({"err_code": 3, "err_msg": "Project id not found"});	
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

function checkProjectName(apikey, project_name, user_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_project_name', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	project = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(project.err_code == 0){
		  	//cek jumdata dulu
		  	if(project.data.length > 0){
		  		var status = false;
		  		var projectOld = [];
		  		for(i=0; i<project.data.length; i++){
		  			if(project.data[i].project_name.toString().toLowerCase() == project_name.toString().toLowerCase()){
		  				status = true;
		  				projectOld[0] = project.data[i]; 
		  			}
		  		}

		  		if(status){
		  			x({"err_code": 2, "status": "Project already exist", "data": projectOld});	
		  		}else{
		  			x({"err_code": 0, "status": "Project ready to use"});	
		  		}
		  	}else{
	  			x({"err_code": 0, "status": "Project ready to use"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": project.error, "application": "Api project", "function": "checkProjectName"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkInventoryName(apikey, inventory_name, project_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_inventory_name', {"apikey": apikey, "project_id": project_id}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	inventory = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(inventory.err_code == 0){
		  	//cek jumdata dulu
		  	if(inventory.data.length > 0){
		  		var status = false;
		  		var inventoryOld = [];
		  		for(i=0; i<inventory.data.length; i++){
		  			if(inventory.data[i].inventory_name.toString().toLowerCase() == inventory_name.toString().toLowerCase()){
		  				status = true;
		  				inventoryOld[0] = inventory.data[i];
		  			}
		  		}

		  		if(status){
		  			x({"err_code": 2, "status": "Inventory already exist", "data": inventoryOld});	
		  		}else{
		  			x({"err_code": 0, "status": "Inventory ready to use"});	
		  		}
		  	}else{
	  			x({"err_code": 0, "status": "Inventory ready to use"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": project.error, "application": "Api project", "function": "checkInventoryName"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkUserId(apikey, user_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_user_id', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		x({"err_code": 0});	
		  	}else{
	  			x({"err_code": 2, "err_msg": "User id is not found"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api Project", "function": "checkUserId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkProjectId(apikey, project_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_project_id', {"apikey": apikey, "project_id": project_id}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		x({"err_code": 0});	
		  	}else{
	  			x({"err_code": 2, "err_msg": "Project id is not found"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "checkProjectId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkGroupId(apikey, group_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_group_id', {"apikey": apikey, "group_id": group_id}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	group = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(group.err_code == 0){
		  	//cek jumdata dulu
		  	if(group.data.length > 0){
		  		x({"err_code": 0});	
		  	}else{
	  			x({"err_code": 2, "err_msg": "Group id is not found"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": group.error, "application": "Api Project", "function": "checkGroupId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkInventoryId(apikey, inventory_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_inventory_id', {"apikey": apikey, "inventory_id": inventory_id}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	group = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(group.err_code == 0){
		  	//cek jumdata dulu
		  	if(group.data.length > 0){
		  		x({"err_code": 0});	
		  	}else{
	  			x({"err_code": 2, "err_msg": "Inventory id is not found"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": group.error, "application": "Api Project", "function": "checkInventoryId"});
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
	  			x({"err_code": 2, "err_msg": "Access denied. Cannot access this project"});	
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

function checkMemberGroup(apikey, user_id, group_id, callback){
	Api.get('check_member_group', {"apikey": apikey, "user_id": user_id, "group_id": group_id}, {}, function (error, response, body) {
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
	  			x({"err_code": 2, "err_msg": "Access denied for this group"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": project.error, "application": "Api Project", "function": "checkMemberGroup"});
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

function getProjectId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_project_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	project = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(project.err_code == 0){
		  	//cek jumdata dulu
		  	if(project.data.length > 0){
		  		var project_id = parseInt(project.data[0].project_id) + 1;
		  		x({"err_code": 0, "project_id": project_id});	
		  	}else{
		  		x({"err_code": 0, "project_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": project.error, "application": "Api project", "function": "getProjectId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function getInventoryId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_inventory_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	inventory = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(inventory.err_code == 0){
		  	//cek jumdata dulu
		  	if(inventory.data.length > 0){
		  		var inventory_id = parseInt(inventory.data[0].inventory_id) + 1;
		  		x({"err_code": 0, "inventory_id": inventory_id});	
		  	}else{
		  		x({"err_code": 0, "inventory_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": inventory.error, "application": "Api project", "function": "getInventoryId"});
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
		  		x({"err_code": 0, "user_firstname": user_firstname, "user_lastname": user_lastname});	
		  	}else{
		  		x({"err_code": 2, "err_msg": "Apikey failed", "application": "Api project", "function": "getUserByApikey"});
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": inventory.error, "application": "Api project", "function": "getInventoryId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}



//get method
app.get('/:apikey/project/:project_id?/user/:user_id', Project.get.projectByUser);
app.get('/:apikey/project/:project_id?/group/:group_id', Project.get.projectByGroup);
app.get('/:apikey/project/:project_id?/inventory/:inventory_id?', Project.get.inventory);
app.get('/:apikey/download_inventory/:inventory_id?/project/:project_id?', Project.get.download_inventory);
app.get('/:apikey/project_inventory_by_user/:user_id?', Project.get.projectInventoryByUser);

//post method
app.post('/:apikey/project/user/:user_id', Project.post.project);
app.post('/:apikey/project/:project_id/inventory', Project.post.inventory);


//put method
app.put('/:apikey/project/:project_id/user/:user_id', Project.put.projectByUser);
app.put('/:apikey/project/:project_id/share/:group_id', Project.put.projectShareGroup);

//delete method
app.delete('/:apikey/project/:project_id', Project.delete.project);
app.delete('/:apikey/project/:project_id/inventory/:inventory_id', Project.delete.inventory);


var server = app.listen(port, host, function () {
  console.log("Server running at http://%s:%s", host, port);
})