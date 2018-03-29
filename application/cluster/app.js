var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var configYaml = yamlconfig.readConfig('../config/config.yml');
var Apiclient = require('apiclient');

var host = configYaml.cluster.host;
var port = configYaml.cluster.port;

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


var Cluster = {
			get: {
				cluster: function getCluster(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var cluster_id = req.params.cluster_id;

							if(typeof cluster_id !== 'undefined'){
								Api.get('cluster', {"apikey": apikey, "cluster_id": cluster_id}, {}, function (error, response, body) {
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
								  			res.json({"err_code": 2, "err_msg": "Cluster is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api cluster", "function": "getCluster"});
								  	}
								  }
								});
							}else{
								Api.get('clusters', {"apikey": apikey}, {}, function (error, response, body) {
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
								  			res.json({"err_code": 2, "err_msg": "Cluster is empty"});	
									  	}
								  	}else{
								  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api cluster", "function": "getCluster"});
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
				cluster_config: function getClusterConfig(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data project
							var cluster_id = req.params.cluster_id;
							var config_id = req.params.config_id;

							if(typeof cluster_id !== 'undefined'){
								if(typeof config_id !== 'undefined'){
									Api.get('cluster_config', {"apikey": apikey, "cluster_id": cluster_id, "config_id": config_id}, {}, function (error, response, body) {
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
									  			res.json({"err_code": 2, "err_msg": "Cluster is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api cluster", "function": "getClusterConfig"});
									  	}
									  }
									});
								}else{
									Api.get('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function (error, response, body) {
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
									  			res.json({"err_code": 2, "err_msg": "Cluster is not found"});	
										  	}
									  	}else{
									  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api cluster", "function": "getClusterConfig"});
									  	}
									  }
									});
								}
							}else{
								res.json({"err_code": 2, "err_msg": "Please select a cluster"});		
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				}
			},
			post: {
				cluster: function addCluster(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var cluster_name = req.body.cluster_name;
					var cluster_status = req.body.cluster_status;

					var errCode = 0;
					var errMsg = "";
					if(typeof cluster_name === 'undefined' || cluster_name == ""){
						errCode = 1;
						errMsg = "Cluster name is required";
					}

					if(errCode == 0){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								//cek email data user apakah sudah ada atau belum
								checkClusterName(apikey, cluster_name, cluster_status,function(result2){
									if(result2.err_code == 0){
										//ambil id user terakhir
										getClusterId(apikey, function(result3){
											if(result3.err_code == 0){
												//susun body
												if(result2.default_status){
														//update dulu cluster default sebelumnya menjadi active
														updateConfigDefault(apikey, function(result4){});
														cluster_status = req.body.cluster_status;	
													}else{
														cluster_status = req.body.cluster_status;	
													}
												var dataCluster = {
																					"cluster_id": result3.cluster_id,
																					"cluster_name": cluster_name,
																					"cluster_status": cluster_status,
																					"cluster_create_date": getFormattedDate()
																				};
												
												//proses simpan data user
												//method, endpoint, params, options, callback
												Api.post('cluster', {"apikey": apikey}, {body: dataCluster, json:true}, function(error, response, body){
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
					}else{
						res.json({"err_code": errCode, "err_msg": errMsg});
					}	
				},
				cluster_config: function addClusterConfig(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					
					var cluster_id = req.params.cluster_id;
					var config_key = req.body.config_key;
					var config_value = req.body.config_value;
					
					var errCode = 0;
					var errMsg = "";

					if(typeof cluster_id === 'undefined' || cluster_id == ""){
						errCode = 1;
						errMsg = "Cluster ID is required";
					}

					if(typeof config_key === 'undefined' || config_key == ""){
						errCode = 1;
						errMsg = "Configuration key is required";
					}

					if(typeof config_value === 'undefined' || config_value == ""){
						errCode = 1;
						errMsg = "Configuration value is required";
					}

					if(errCode == 0){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								//cek email data user apakah sudah ada atau belum
								checkConfigKey(apikey, cluster_id, config_key,function(result2){
									if(result2.err_code == 0){
										//ambil id user terakhir
										getConfigId(apikey, function(result3){
											if(result3.err_code == 0){
												//susun body
												var dataConfig = {
																					"config_id": result3.config_id,
																					"config_key": config_key,
																					"config_value": config_value,
																					"config_create_date": getFormattedDate()
																				};
												
												//proses simpan data user
												//method, endpoint, params, options, callback
												Api.post('cluster_config', {"apikey": apikey, "cluster_id": cluster_id}, {body: dataConfig, json:true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api cluster", "function": "addClusterConfig"});
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
					}else{
						res.json({"err_code": errCode, "err_msg": errMsg});
					}
				}
			},	
			put: {
				cluster: function updateCluster(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					var cluster_id = req.params.cluster_id;
					var cluster_name = req.body.cluster_name;
					var cluster_status = req.body.cluster_status;

					var errCode = 0;
					var errMsg = "";
					if(typeof cluster_name === 'undefined' || cluster_name == ""){
						errCode = 1;
						errMsg = "Cluster name is required";
					}
					if(errCode == 0){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
										if(typeof cluster_id !== 'undefined'){
											checkClusterId(apikey, cluster_id, function(result3){
												if(result3.err_code == 0){
													if(req.body.cluster_status == 'default'){
														//update dulu cluster default sebelumnya menjadi active
														updateConfigDefault(apikey, function(result4){});
														cluster_status = req.body.cluster_status;											
													}else{
														cluster_status = req.body.cluster_status;	
													}
													var dataCluster = {
																						"cluster_name": cluster_name,
																						"cluster_status": cluster_status,
																						"cluster_update_date": getFormattedDate()
																					};

													//proses simpan data user
													//method, endpoint, params, options, callback
													Api.put('cluster', {"apikey": apikey, "cluster_id": cluster_id}, {body: dataCluster, json:true}, function(error, response, body){
														if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api cluster", "function": "updateCluster"});
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
													res.json(result3)
												}
											})								
										}else{
											res.json({"err_code": 3, "err_msg": "Cluster ID is not found"});
										}
									/*}else{
										result.err_code = 500;
										res.json(result2);		
									}
								})*/
							}else{
								result.err_code = 500;
								res.json(result);
							}
						});
					}else{
						res.json({"err_code": errCode, "err_msg": errMsg});
					}
				},
				cluster_config: function updateClusterConfig(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					
					var cluster_id = req.params.cluster_id;
					var config_id = req.params.config_id;
					var config_key = req.body.config_key;
					var config_value = req.body.config_value;
					
					var errCode = 0;
					var errMsg = "";

					if(typeof cluster_id === 'undefined' || cluster_id == ""){
						errCode = 1;
						errMsg = "Cluster ID is required";
					}

					if(typeof config_id === 'undefined' || config_id == ""){
						errCode = 2;
						errMsg = "Config id is required";
					}

					if(typeof config_key === 'undefined' || config_key == ""){
						errCode = 3;
						errMsg = "Configuration key is required";
					}

					if(typeof config_value === 'undefined' || config_value == ""){
						errCode = 4;
						errMsg = "Configuration value is required";
					}

					if(errCode == 0){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								Api.get('cluster_config', {"apikey": apikey, "cluster_id": cluster_id, "config_id": config_id}, {}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api cluster", "function": "updateClusterConfig"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	body = JSON.parse(body);
								  	if(body.err_code == 0){
								  		if(body.data.length > 0){
								  			var dataConfig = {									
																	"config_key": config_key,
																	"config_value": config_value,
																	"config_update_date": getFormattedDate()
																};
								
												//method, endpoint, params, options, callback
												Api.put('cluster_config', {"apikey": apikey, "cluster_id": cluster_id, "config_id": config_id}, {body: dataConfig, json:true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api cluster", "function": "updateClusterConfig"});
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
									  		res.json({"err_code": 2, "err_msg": "Configuration is not found in this cluster"})
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
					}else{
						res.json({"err_code": errCode, "err_msg": errMsg})
					}			
				}
			},	
			delete: {
				cluster: function deleteCluster(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data user
							var cluster_id = req.params.cluster_id;
							if(typeof cluster_id !== 'undefined'){
								checkClusterId(apikey, cluster_id, function(result3){
									if(result3.err_code == 0){
										Api.delete('cluster', {"apikey": apikey, "cluster_id": cluster_id}, {}, function (error, response, body) {
										  if(error){
										  	res.json(error);
										  }else{
										  	//cek apakah ada error atau tidak
										  	rez = JSON.parse(body);
										  	if(rez.err_code == 0){
											  	res.json({"err_code": 0, "status": "Cluster has been deleted"})
										  	}else{
										  		res.json(body);
										  	}
										  }
										});
									}else{
										res.json(result3)
									}
								})
							}else{
								res.json({"err_code": 3, "err_msg": "Cluster ID is not found"});	
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});
				},
				cluster_config: function deleteClusterConfig(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//proses query ambil data user
							var cluster_id = req.params.cluster_id;
							var config_id = req.params.config_id;

							if(typeof cluster_id !== 'undefined'){
								checkClusterId(apikey, cluster_id, function(result3){
									if(result3.err_code == 0){
										if(typeof config_id !== 'undefined'){
											Api.delete('cluster_config', {"apikey": apikey, "cluster_id": cluster_id, "config_id": config_id}, {}, function (error, response, body) {
											  if(error){
											  	res.json(error);
											  }else{
											  	//cek apakah ada error atau tidak
											  	rez = JSON.parse(body);
											  	if(rez.err_code == 0){
												  	res.json({"err_code": 0, "status": "Configuration has been deleted"})
											  	}else{
											  		res.json(body);
											  	}
											  }
											});
										}else{
											Api.delete('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function (error, response, body) {
											  if(error){
											  	res.json(error);
											  }else{
											  	//cek apakah ada error atau tidak
											  	rez = JSON.parse(body);
											  	if(rez.err_code == 0){
												  	res.json({"err_code": 0, "status": "All Configuration has been deleted in cluster"})
											  	}else{
											  		res.json(body);
											  	}
											  }
											});
										}
									}else{
										res.json(result3)
									}
								})								
							}else{
								res.json({"err_code": 3, "err_msg": "Please select a cluster"});	
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
					  			x({"err_code": 0, "status": "active"});	
					  		}else{
					  			x({"err_code": 5, "err_msg": "User not active", "application": "Api cluster"});	
					  		}
					  	}else{
					  		x({"err_code": 4, "err_msg": "Ip Address not registered", "application": "Api cluster"});
					  	}
				  	}else{
				  		x({"err_code": 3, "err_msg": "Wrong apikey", "application": "Api cluster"});
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

function checkClusterName(apikey, cluster_name, cluster_status, callback){
	//method, endpoint, params, options, callback
	Api.get('check_cluster_name', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	cluster = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(cluster.err_code == 0){
		  	//cek jumdata dulu
		  	if(cluster.data.length > 0){
		  		var status = false;
		  		var status2 = false;
		  		for(i=0; i<cluster.data.length; i++){
		  			if(cluster.data[i].cluster_name.toString().toLowerCase() == cluster_name.toString().toLowerCase()){
		  				status = true;
		  			}

		  			if(cluster.data[i].cluster_status.toString().toLowerCase() == cluster_status.toString().toLowerCase()){
		  				status2 = true;
		  			}
		  		}

		  		if(status){
		  			x({"err_code": 2, "status": "Cluster already exist"});	
		  		}else{
		  			x({"err_code": 0, "status": "Cluster ready to use", "default_status": status2});	
		  		}
		  	}else{
	  			x({"err_code": 0, "status": "Cluster ready to use", "default_status": status2});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": cluster.error, "application": "Api cluster", "function": "checkClusterName"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkClusterId(apikey, cluster_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_cluster_id', {"apikey": apikey, "cluster_id": cluster_id}, {}, function (error, response, body) {
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
	  			x({"err_code": 2, "err_msg": "Cluster id is not found"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": group.error, "application": "Api cluster", "function": "checkMemberId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkConfigKey(apikey, cluster_id, config_key, callback){
	//method, endpoint, params, options, callback
	Api.get('check_config_key', {"apikey": apikey, "cluster_id": cluster_id}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	config = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(config.err_code == 0){
		  	//cek jumdata dulu
		  	if(config.data.length > 0){
		  		var status = false;
		  		for(i=0; i<config.data.length; i++){
		  			if(config.data[i].config_key.toString().toLowerCase() == config_key.toString().toLowerCase()){
		  				status = true;
		  			}
		  		}

		  		if(status){
		  			x({"err_code": 2, "status": "Config key already exist"});	
		  		}else{
		  			x({"err_code": 0, "status": "Config key ready to use"});	
		  		}
		  	}else{
	  			x({"err_code": 0, "status": "Config key ready to use"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": config.error, "application": "Api cluster", "function": "checkConfigKey"});
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

function getClusterId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_cluster_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	cluster = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(cluster.err_code == 0){
		  	//cek jumdata dulu
		  	if(cluster.data.length > 0){
		  		var cluster_id = parseInt(cluster.data[0].cluster_id) + 1;
		  		x({"err_code": 0, "cluster_id": cluster_id});	
		  	}else{
		  		x({"err_code": 0, "cluster_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": project.error, "application": "Api cluster", "function": "getClusterId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function getConfigId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_config_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	config = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(config.err_code == 0){
		  	//cek jumdata dulu
		  	if(config.data.length > 0){
		  		var config_id = parseInt(config.data[0].config_id) + 1;
		  		x({"err_code": 0, "config_id": config_id});	
		  	}else{
		  		x({"err_code": 0, "config_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": project.error, "application": "Api cluster", "function": "getConfigId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function updateConfigDefault(apikey, callback){
	//method, endpoint, params, options, callback
	Api.put('default_config', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	config = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(config.err_code == 0){
		  	x({"err_code": 0, "err_msg": config.data});			  	
	  	}else{
	  		x({"err_code": 1, "err_msg": config.error, "application": "Api cluster", "function": "updateConfigDefault"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}


//get method
app.get('/:apikey/cluster/:cluster_id?', Cluster.get.cluster);
app.get('/:apikey/cluster/:cluster_id?/config/:config_id?', Cluster.get.cluster_config);

//post method
app.post('/:apikey/cluster', Cluster.post.cluster);
app.post('/:apikey/cluster/:cluster_id?/config', Cluster.post.cluster_config);

//put method
app.put('/:apikey/cluster/:cluster_id?', Cluster.put.cluster);
app.put('/:apikey/cluster/:cluster_id?/config/:config_id?', Cluster.put.cluster_config);

//delete method
app.delete('/:apikey/cluster/:cluster_id?', Cluster.delete.cluster);
app.delete('/:apikey/cluster/:cluster_id?/config/:config_id?', Cluster.delete.cluster_config);



var server = app.listen(port, host, function () {
  console.log("Server running at http://%s:%s", host, port);
})