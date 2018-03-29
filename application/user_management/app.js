var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var configYaml = yamlconfig.readConfig('../config/config.yml');
var Apiclient = require('apiclient');
var md5 = require('md5');

var host = configYaml.user_management.host;
var port = configYaml.user_management.port;

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


var User = {
			get: function getUser(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						var user_id = req.params.user_id;
						if(typeof user_id !== 'undefined'){
							if(user_id == result.user_id || result.status == 'root' ){
								Api.get('user', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
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
								  			res.json({"err_code": 2, "err_msg": "User data is not found"});	
									  	}
								  	}else{
								  		res.json(body);
								  	}
								  }
								});
							}else{
								res.json({"err_code": 5, "err_msg": "Access denied to view user"});	
							}
						}else{
							if(result.status == 'root'){
								Api.get('users', {"apikey": apikey}, {}, function (error, response, body) {
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
								  			res.json({"err_code": 4, "err_msg": "User data is empty"});	
									  	}
								  	}else{
								  		res.json(body);
								  	}
								  }
								});
							}else{
								res.json({"err_code": 5, "err_msg": "Access denied to view users"});	
							}
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			},
			post: function addUser(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				//checking parameter input
				var user_firstname = req.body.user_firstname;
				var user_lastname = req.body.user_lastname;
				var user_email = req.body.user_email;
				var user_password = req.body.user_password;
				var user_ip_address = req.body.user_ip_address;

				var errCode = 0;
				var errMsg = "";
				if(typeof user_ip_address === 'undefined' || user_ip_address == ""){
					errCode = 1;
					errMsg = "IP address is required";
				}

				if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(user_ip_address)) {  
			  }else{
			  	errCode = 2;
					errMsg = "IP address is invalid";
			  }

			  if(typeof user_password === 'undefined' || user_password == ""){
					errCode = 3;
					errMsg = "Password is invalid";
				}

				if(typeof user_email === 'undefined' || user_email == ""){
					errCode = 4;
					errMsg = "Email is required";
				}

				if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(user_email)){
				}else{
					var errCode = 5;
					var errMsg = "Email is invalid";
				}	
				
				if(typeof user_firstname === 'undefined' || user_firstname == ""){
					errCode = 6;
					errMsg = "First name is required";
				}

				if(typeof user_lastname === 'undefined'){
					req.body.user_lastname = "";
				}
				
				if(errCode == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//cek email data user apakah sudah ada atau belum
							checkEmail(apikey, user_email, function(result2){
								if(result2.err_code == 0){
									//ambil id user terakhir
									getUserId(apikey, function(result3){
										if(result3.err_code == 0){
											//susun body
											var dataUser = {
																				"user_id": result3.user_id,
																				"user_firstname": req.body.user_firstname,
																				"user_lastname": req.body.user_lastname,
																				"user_email": req.body.user_email,
																				"user_apikey": generateApikey(getFormattedDate()),
																				"user_create_date": getFormattedDate(),
																				"user_password": md5(req.body.user_password),
																				"user_is_active": true,
																				"user_ip_address": req.body.user_ip_address
																			};
											
											//proses simpan data user
											//method, endpoint, params, options, callback
											Api.post('user', {"apikey": apikey}, {body: dataUser, json:true}, function(error, response, body){
												if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api User Management", "function": "addUser"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	if(body.err_code == 0){
												  	res.json({"err_code": 0, "data":body.data});
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
			put: function updateUser(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				var errCode = 0;
				var errMsg = "";
				//cek untuk data yang akan diupdate
				if(typeof req.body.user_email !== 'undefined'){
					if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.user_email)){
					}else{
						var errCode = 5;
						var errMsg = "Email is invalid";
					}	
				}				

				if(typeof req.body.user_ip_address !== 'undefined'){
					if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(req.body.user_ip_address)) {
				  }else{
				  	errCode = 2;
						errMsg = "IP address is invalid";
				  }
				}

				if(typeof req.body.user_firstname === 'undefined' || req.body.user_firstname == ""){
					errCode = 6;
					errMsg = "First name is required";
				}

				if(typeof req.body.user_lastname === 'undefined'){
					req.body.user_lastname = "";
				}

				if(errCode == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							if(result.status != 'root' && req.params.user_id != result.user_id){
								res.json({"err_code": 1, "err_msg": "Access denied to update this user"});	
							}else{
								var dataUser= {};
								if(typeof req.body.user_firstname !== 'undefined'){
									dataUser.user_firstname = req.body.user_firstname;
								}
								
								if(typeof req.body.user_lastname !== 'undefined'){
									dataUser.user_lastname = req.body.user_lastname;
								}

								if(typeof req.body.user_email !== 'undefined'){
									dataUser.user_email = req.body.user_email;
								}

								if(typeof req.body.user_password !== 'undefined'){
									dataUser.user_password = md5(req.body.user_password);
								}

								if(typeof req.body.user_is_active !== 'undefined'){
									dataUser.user_is_active = req.body.user_is_active;
								}

								if(typeof req.body.user_ip_address !== 'undefined'){
									dataUser.user_ip_address = req.body.user_ip_address;
								}

								if(typeof req.body.user_role_id !== 'undefined'){
									dataUser.user_role_id = req.body.user_role_id;
								}

								if(typeof req.body.user_cluster_id !== 'undefined'){
									dataUser.user_cluster_id = req.body.user_cluster_id;
								}

								dataUser.user_update_date = getFormattedDate();

								if(typeof req.body.user_email !== 'undefined'){
									var user_email = req.body.user_email;
									checkEmail(apikey, user_email, function(result2){
										if(result2.err_code == 0){
											//proses query ambil data user
											var user_id = req.params.user_id;
											if(typeof user_id !== 'undefined'){
												//check user_id dari rest phoenix
												checkUserId(apikey, user_id, function(result3){
													if(result3.err_code == 0){
														if(typeof req.body.user_cluster_id !== 'undefined'){
															checkClusterId(apikey, req.body.user_cluster_id, function(result5){
																if(result5.err_code == 0){
																	Api.put('user', {"apikey": apikey, "user_id": user_id}, {body: dataUser, json:true}, function (error, response, body) {
																	  if(error){
																	  	res.json(error)
																	  }else{
																	  	if(body.err_code == 0){
																		  	res.json({"err_code": 0, "data": body.data});
																	  	}else{
																	  		res.json(body);
																	  	}
																	  }
																	});
																}else{
																	res.json(result5)
																}
															})
														}else{
															Api.put('user', {"apikey": apikey, "user_id": user_id}, {body: dataUser, json:true}, function (error, response, body) {
															  if(error){
															  	res.json(error)
															  }else{
															  	if(body.err_code == 0){
																  	res.json({"err_code": 0, "data": body.data});
															  	}else{
															  		res.json(body);
															  	}
															  }
															});
														}
													}else{
														res.json(result3);
													}
												})
											}else{
												res.json({"err_code": 2, "err_msg": "User id not found"});
											}	
										}else{
											result.err_code = 500;
											res.json(result2);		
										}
									})
								}else{
									//proses query ambil data user
									var user_id = req.params.user_id;
									if(typeof user_id !== 'undefined'){
										//check user_id dari rest phoenix
										checkUserId(apikey, user_id, function(result3){
											if(result3.err_code == 0){												
												if(typeof req.body.user_cluster_id !== 'undefined'){
													checkClusterId(apikey, req.body.user_cluster_id, function(result5){
														if(result5.err_code == 0){
															Api.put('user', {"apikey": apikey, "user_id": user_id}, {body: dataUser, json:true}, function (error, response, body) {
															  if(error){
															  	res.json(error)
															  }else{
															  	if(body.err_code == 0){
																  	res.json({"err_code": 0, "data": body.data});
															  	}else{
															  		res.json(body);
															  	}
															  }
															});
														}else{
															res.json(result5)
														}
													})
												}else{
													Api.put('user', {"apikey": apikey, "user_id": user_id}, {body: dataUser, json:true}, function (error, response, body) {
													  if(error){
													  	res.json(error)
													  }else{
													  	if(body.err_code == 0){
														  	res.json({"err_code": 0, "data": body.data});
													  	}else{
													  		res.json(body);
													  	}
													  }
													});
												}
											}else{
												res.json(result3);
											}
										})
									}else{
										res.json({"err_code": 2, "err_msg": "User id not found"});
									}
								}	
							}
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				}else{
					res.json({"err_code": errCode, "err_msg": errMsg});
				}
			},
			delete: function deleteUser(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						if(result.status != 'root'){
							res.json({"err_code": 1, "err_msg": "Access denied. Cannot delete this user"});	
						}else{
							var user_id = req.params.user_id;
							if(typeof user_id !== 'undefined'){
								//check user_id dari rest phoenix
								checkUserId(apikey, user_id, function(result3){
									if(result3.err_code == 0){
										//check group by user id and member group
										Api.get('groupsByUser', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
										  if(error){
										  	res.json(error);
										  }else{
										  	var group = JSON.parse(body); //object
										  	//cek apakah ada error atau tidak
										  	if(group.err_code == 0){
											  	//cek jumdata dulu
											  	if(group.data.length > 0){
											  		for(i=0; i< group.data.length; i++){
											  			//check member group
											  			var group_id = group.data[i].group_id;
											  			Api.get('member', {"apikey": apikey, "group_id": group_id}, {}, function (error, response, body) {
															  if(error){
															  	res.json(error);
															  }else{
															  	var member = JSON.parse(body); //object
															  	//cek apakah ada error atau tidak
															  	if(member.err_code == 0){
																  	//cek jumdata dulu member lebih dari 1, maka lakukan perubahan admin
																  	if(member.data.length > 1){
																  		member_id1 = member.data[0].member_id; //old
																  		member_id = member.data[1].member_id; //new
																  		newOwner = member.data[1].user_id;
																  		//update owner group
																  		var dataGroup = {};
																  		dataGroup.group_update_date = getFormattedDate();
																			dataGroup.group_user_id = newOwner;
																			
																			Api.put('group', {"apikey": apikey, "group_id": group_id}, {body: dataGroup, json:true}, function (error, response, body) {});

																			//update data member
																			var dataMember= {};
																			dataMember.user_id = newOwner;
																			dataMember.group_id = group_id;
																			dataMember.member_update_date = getFormattedDate();
																			dataMember.member_status = 'Active';
																			dataMember.member_status_request = 'Confirm';
																			dataMember.member_role = 'Administrator';
																			
																			Api.delete('member', {"apikey": apikey, "member_id": member_id1}, {}, function (error, response, body) {});	

																			Api.put('member', {"apikey": apikey, "member_id": member_id}, {body: dataMember, json:true}, function (error, response, body) {});
																  	}else{
																  		//hapus group by group id
															  			Api.delete('group', {"apikey": apikey, "group_id": group_id}, {}, function (error, response, body) {});	
																  	}
															  	}
															  }
															});
											  		}//for(i=0; i< group.data.length; i++){

											  		// check project by user id and share true		  		
														Api.get('projectsByUser', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
														  if(error){
														  	res.json(error);
														  }else{
														  	var project = JSON.parse(body); //object
														  	//cek apakah ada error atau tidak
														  	if(project.err_code == 0){
															  	//cek jumdata dulu
															  	if(project.data.length > 0){
															  		for(j=0; j < project.data.length; j++){
															  			project_id = project.data[j].project_id;
															  			if(project.data[j].project_is_share !== "true"){
															  				//hapus data project
															  				Api.delete('project', {"apikey": apikey, "project_id": project_id}, {}, function (error, response, body) {});
															  			}
															  		}
																		
																		//hapus user
																		Api.delete('user', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
																		  if(error){
																		  	res.json(error);
																		  }else{
																		  	//cek apakah ada error atau tidak
																		  	rez = JSON.parse(body);
																		  	if(rez.err_code == 0){
																			  	res.json({"err_code": 0, "status": "User has been deleted"})
																		  	}else{
																		  		res.json(body);
																		  	}
																		  }
																		});
																		
															  	}else{
															  		//hapus group by group id
															  		Api.delete('group', {"apikey": apikey, "group_id": group_id}, {}, function (error, response, body) {});	
																		
																		//hapus user
																		Api.delete('user', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
																		  if(error){
																		  	res.json(error);
																		  }else{
																		  	//cek apakah ada error atau tidak
																		  	rez = JSON.parse(body);
																		  	if(rez.err_code == 0){
																			  	res.json({"err_code": 0, "status": "User has been deleted"})
																		  	}else{
																		  		res.json(body);
																		  	}
																		  }
																		});			  			
															  	}
														  	}else{
														  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getProjectByUser"});
														  	}
														  }
														});											  		
											  	}else{
														// check project by user id and share true		  		
														Api.get('projectsByUser', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
														  if(error){
														  	x(error);
														  }else{
														  	var project = JSON.parse(body); //object
														  	//cek apakah ada error atau tidak
														  	if(project.err_code == 0){
															  	//cek jumdata dulu
															  	if(project.data.length > 0){
															  		for(j=0; j < project.data.length; j++){
															  			project_id = project.data[j].project_id;		
														  				//hapus data project
														  				Api.delete('project', {"apikey": apikey, "project_id": project_id}, {}, function (error, response, body) {});
															  		}
																		
																		//hapus user
																		Api.delete('user', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
																		  if(error){
																		  	res.json(error);
																		  }else{
																		  	//cek apakah ada error atau tidak
																		  	rez = JSON.parse(body);
																		  	if(rez.err_code == 0){
																			  	res.json({"err_code": 0, "status": "User has been deleted"})
																		  	}else{
																		  		res.json(body);
																		  	}
																		  }
																		});
																		
															  	}else{
															  		//hapus user data
															  		Api.delete('user', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
																		  if(error){
																		  	res.json(error);
																		  }else{
																		  	//cek apakah ada error atau tidak
																		  	rez = JSON.parse(body);
																		  	if(rez.err_code == 0){
																			  	res.json({"err_code": 0, "status": "User has been deleted"})
																		  	}else{
																		  		res.json(body);
																		  	}
																		  }
																		});		
															  	}
														  	}else{
														  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api project", "function": "getProjectByUser"});
														  	}
														  }
														});
											  	}
										  	}else{
										  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getGroup"});
										  	}
										  }
										});	
									}else{
										res.json(result3);
									}
								})
							}else{
								res.json({"err_code": 1, "err_msg": "User id not found"});	
							}
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			}
}

var Group = {
			getGroupUser: function getGroupUser(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						var group_id = req.params.group_id;
						var user_id = req.params.user_id;

						if(typeof group_id !== 'undefined'){
							Api.get('groupByUser', {"apikey": apikey, "group_id": group_id, "user_id": user_id}, {}, function (error, response, body) {
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
							  			res.json({"err_code": 2, "err_msg": "Group data is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getGroup"});
							  	}
							  }
							});
						}else{
							Api.get('groupsByUser', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
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
							  			res.json({"err_code": 2, "err_msg": "Group data is empty"});	
								  	}
							  	}else{
							  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getGroup"});
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
			get: function getGroup(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						var group_id = req.params.group_id;
						if(typeof group_id !== 'undefined'){
							Api.get('group', {"apikey": apikey, "group_id": group_id}, {}, function (error, response, body) {
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
							  			res.json({"err_code": 2, "err_msg": "Group data is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getGroup"});
							  	}
							  }
							});
						}else{
							Api.get('groups', {"apikey": apikey}, {}, function (error, response, body) {
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
							  			res.json({"err_code": 2, "err_msg": "Group data is empty"});	
								  	}
							  	}else{
							  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getGroup"});
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
			post: function addGroup(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var group_name = req.body.group_name;
				
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//cek email data user apakah sudah ada atau belum
						checkGroupName(apikey, group_name, function(result2){
							if(result2.err_code == 0){
								//ambil id group terakhir
								getGroupId(apikey, function(result3){
									if(result3.err_code == 0){
										
							  		// tambahkan sebagai member
										getMemberId(apikey, function(result4){
											if(result3.err_code == 0){
												//susun body
												var dataMember = {
																					"member_id": result4.member_id,
																					"user_id": result.user_id,
																					"group_id": result3.group_id,
																					"member_create_date": getFormattedDate(),
																					"member_status": "Active",
																					"member_status_request": "Confirm",
																					"member_role": "Administrator"
																				};
												//method, endpoint, params, options, callback
												Api.post('member', {"apikey": apikey}, {body: dataMember, json:true}, function(error, response, body2){})
											}else{
												result.err_code = 500;
												res.json(result3);	
											}
										});

										//susun body
										var dataGroup = {
																			"group_id": result3.group_id,
																			"group_name": req.body.group_name,
																			"group_status": req.body.group_status,
																			"group_is_active": true,
																			"group_create_date": getFormattedDate(),
																			"group_user_id": result.user_id
																		};
										//proses simpan data user
										//method, endpoint, params, options, callback
										Api.post('group', {"apikey": apikey}, {body: dataGroup, json:true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api User Management", "function": "addGroup"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	if(body.err_code == 0){
										  		//daftar member group
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
			put: function updateGroup(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var group_id = req.params.group_id;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(result.status != 'root'){
							user_id = result.user_id;
							checkOwnerGroup(apikey, user_id, group_id, function(result5){
								if(result5.err_code > 0){
									//member tidak ada di group maka tidak diijinkan menghapus
									res.json({"err_code":2, "err_msg": "Access denied. Cannot update group"})
								}else{
									if(typeof group_id !== 'undefined'){
										checkGroupName(apikey, req.body.group_name, function(result2){
											if(result2.err_code == 0){
												checkGroupId(apikey, group_id, function(result4){
													if(result4.err_code == 0){
														//cek untuk data yang akan diupdate
														var dataGroup= {};
														if(typeof req.body.group_name !== 'undefined'){
															dataGroup.group_name = req.body.group_name;
														}

														if(typeof req.body.group_is_active !== 'undefined'){
															dataGroup.group_is_active = req.body.group_is_active;
														}

														if(typeof req.body.group_status !== 'undefined'){
															dataGroup.group_status = req.body.group_status;
														}
														
														dataGroup.group_update_date = getFormattedDate();
														dataGroup.group_user_id = user_id;

														Api.put('group', {"apikey": apikey, "group_id": group_id}, {body: dataGroup, json:true}, function (error, response, body) {
														  if(error){
														  	res.json(error)
														  }else{
														  	if(body.err_code == 0){
															  	res.json({"err_code": 0, "data": body.data});
														  	}else{
														  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "updateGroup"});
														  	}
														  }
														});		
													}else{
														res.json(result4);		
													}
												})
											}else{
												result.err_code = 500;
												res.json(result2);		
											}
										})
									}else{
										res.json({"err_code": 3, "err_msg": "Group ID is not found"});	
									}	
								}
							})	
						}else{
							if(typeof group_id !== 'undefined'){
								//proses query ambil data user
								checkGroupName(apikey, req.body.group_name, function(result2){
									if(result2.err_code == 0){
										var group_id = req.params.group_id;
										if(typeof group_id !== 'undefined'){
											checkGroupId(apikey, group_id, function(result4){
												if(result4.err_code == 0){
													//cek untuk data yang akan diupdate
													var dataGroup= {};
													if(typeof req.body.group_name !== 'undefined'){
														dataGroup.group_name = req.body.group_name;
													}

													if(typeof req.body.group_is_active !== 'undefined'){
														dataGroup.group_is_active = req.body.group_is_active;
													}

													if(typeof req.body.group_status !== 'undefined'){
														dataGroup.group_status = req.body.group_status;
													}
													
													dataGroup.group_update_date = getFormattedDate();

													Api.put('group', {"apikey": apikey, "group_id": group_id}, {body: dataGroup, json:true}, function (error, response, body) {
													  if(error){
													  	res.json(error)
													  }else{
													  	if(body.err_code == 0){
														  	res.json({"err_code": 0, "data": body.data});
													  	}else{
													  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "updateGroup"});
													  	}
													  }
													});		
												}else{
													res.json(result4);		
												}
											})
										}else{
											res.json({"err_code": 3, "err_msg": "Group ID is not found"});
										}	
									}else{
										result.err_code = 500;
										res.json(result2);		
									}
								})
							}else{
								res.json({"err_code": 3, "err_msg": "Group ID is not found"});	
							}
						}
						
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			},
			delete: function deleteGroup(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var group_id = req.params.group_id;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						if(result.status != 'root'){
							user_id = result.user_id;
							checkOwnerGroup(apikey, user_id, group_id, function(result5){
								if(result5.err_code > 0){
									//member tidak ada di group maka tidak diijinkan menghapus
									res.json({"err_code":2, "err_msg": "Access denied. Cannot delete group"})
								}else{
									if(typeof group_id !== 'undefined'){
										checkGroupId(apikey, group_id, function(result4){
											if(result4.err_code == 0){
												Api.delete('group', {"apikey": apikey, "group_id": group_id}, {}, function (error, response, body) {
												  if(error){
												  	res.json(error);
												  }else{
												  	//cek apakah ada error atau tidak
												  	rez = JSON.parse(body);
												  	if(rez.err_code == 0){
													  	res.json({"err_code": 0, "status": "Group has been deleted"})
												  	}else{
												  		res.json(rez);
												  	}
												  }
												});	
											}else{
												res.json(result4);		
											}
										})
									}else{
										res.json({"err_code": 3, "err_msg": "Group ID is not found"});	
									}	
								}
							})	
						}else{
							if(typeof group_id !== 'undefined'){
								checkGroupId(apikey, group_id, function(result4){
									if(result4.err_code == 0){
										Api.delete('group', {"apikey": apikey, "group_id": group_id}, {}, function (error, response, body) {
										  if(error){
										  	res.json(error);
										  }else{
										  	//cek apakah ada error atau tidak
										  	rez = JSON.parse(body);
										  	if(rez.err_code == 0){
											  	res.json({"err_code": 0, "status": "Group has been deleted"})
										  	}else{
										  		res.json(rez);
										  	}
										  }
										});	
									}else{
										res.json(result4);		
									}
								})
							}else{
								res.json({"err_code": 3, "err_msg": "Group ID is not found"});	
							}
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			}
}

var Member = {
			get: function getMember(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						var group_id = req.params.group_id;
						if(typeof group_id !== 'undefined'){
							Api.get('member', {"apikey": apikey, "group_id": group_id}, {}, function (error, response, body) {
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
							  			res.json({"err_code": 2, "err_msg": "No member in this group"});	
								  	}
							  	}else{
							  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getMember"});
							  	}
							  }
							});
						}else{
							res.json({"err_code": 3, "err_msg": "Group ID is not found"});
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			},
			post: function addMember(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var group_id = req.body.group_id;
				var user_id = req.body.user_id;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
							//check dulu user_id dan group id
							checkUserId(apikey, user_id, function(result2){
								if(result2.err_code == 0){
									checkGroupId(apikey, group_id, function(result4){
										if(result4.err_code == 0){
											checkOwnerGroup(apikey, result.user_id, group_id, function(result5){
												if(result5.err_code == 0){
													//check apakah user sudah menjadi member atau belum
													checkMemberGroup(apikey, user_id, group_id, function(result6){
														if(result6.err_code == 0){
															//user id sudah menjadi member 
															res.json({"err_code": 2, "err_msg": "Member is already exist"});
														}else{
															// ambil id member terakhir
															getMemberId(apikey, function(result3){
																if(result3.err_code == 0){
																	//susun body
																	var dataMember = {
																										"member_id": result3.member_id,
																										"user_id": user_id,
																										"group_id": group_id,
																										"member_create_date": getFormattedDate(),
																										"member_status": "Active",
																										"member_status_request": "Confirm",
																										"member_role": "Member"
																									};

																	//method, endpoint, params, options, callback
																	Api.post('member', {"apikey": apikey}, {body: dataMember, json:true}, function(error, response, body){
																		if(error){
																	  	res.json({"err_code": 1, "err_msg": error, "application": "Api User Management", "function": "addMember"});
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
														}
													})
												}else{
													res.json(result5);		
												}
											})
										}else{
											res.json(result4);		
										}
									})
								}else{
									res.json(result2);
								}
							})
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			},
			put: function updateMember(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						var member_id = req.params.member_id;
						var group_id = req.body.group_id;
						var user_id = req.body.user_id;
						var member_status = req.body.member_status;
						var member_status_request = req.body.member_status_request;
						var member_role = req.body.member_role;


						var errCode = 0;
						var errMsg = "";
						//cek untuk data yang akan diupdate
						if(typeof req.body.group_id === 'undefined' || req.body.group_id == ""){
							errCode = 1;
							errMsg = "Group ID is required";
						}

						if(typeof req.body.user_id === 'undefined' || req.body.user_id == ""){
							errCode = 2;
							errMsg = "User ID is required";
						}

						if(errCode == 0){
							if(typeof group_id !== 'undefined'){
								if(typeof user_id !== 'undefined'){
									//check dulu user_id dan group id
									checkUserId(apikey, user_id, function(result2){
										if(result2.err_code == 0){
											checkGroupId(apikey, group_id, function(result4){
												if(result4.err_code == 0){
													checkOwnerGroup(apikey, result.user_id, group_id, function(result5){
														if(result5.err_code == 0){
															//check apakah user sudah menjadi member atau belum
															checkMemberGroup(apikey, user_id, group_id, function(result6){
																if(result6.err_code == 0){
																	//user id sudah menjadi member 
																	res.json({"err_code": 2, "err_msg": "Member is already exist"});
																}else{
																	checkMemberId(apikey, member_id, function(result3){
																		if(result3.err_code == 0){
																			//cek untuk data yang akan diupdate
																			var dataMember= {};
																			dataMember.user_id = user_id;
																			dataMember.group_id = group_id;
																			dataMember.member_update_date = getFormattedDate();
																			dataMember.member_status = member_status;
																			dataMember.member_status_request = member_status_request;
																			dataMember.member_role = member_role;

																			Api.put('member', {"apikey": apikey, "member_id": member_id}, {body: dataMember, json:true}, function (error, response, body) {
																			  if(error){
																			  	res.json(error)
																			  }else{
																			  	if(body.err_code == 0){
																				  	res.json({"err_code": 0, "data": body.data});
																			  	}else{
																			  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "updateMember"});
																			  	}
																			  }
																			});		
																		}else{
																			res.json(result3);	
																		}
																	});
																}
															})
														}else{
															res.json(result5);		
														}
													})
												}else{
													res.json(result4);		
												}
											})
										}else{
											res.json(result2);
										}
									})	
								}else{
									res.json({"err_code": 3, "err_msg": "Member data is empty"});
								}
							}else{
								res.json({"err_code": 3, "err_msg": "Group ID is not found"});
							}
						}else{
							res.json({"err_code": errCode, "err_msg": errMsg});
						}						
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			},
			delete: function deleteMember(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						var group_id = req.params.group_id;
						var user_id = result.user_id;

						checkOwnerGroup(apikey, user_id, group_id, function(result5){
							if(result5.err_code == 0){
								//proses query ambil data user
								var member_id = req.params.member_id;
								checkMemberId(apikey, member_id, function(result3){
									if(result3.err_code == 0){
										Api.delete('member', {"apikey": apikey, "member_id": member_id}, {}, function (error, response, body) {
										  if(error){
										  	res.json(error)
										  }else{
										  	member = JSON.parse(body);
										  	if(member.err_code == 0){
											  	res.json({"err_code": 0, "status": "Member has been deleted"});
										  	}else{
										  		res.json({"err_code": 1, "err_msg": error, "application": "Api User Management", "function": "deleteMember"});
										  	}
										  }
										});	
									}else{
										res.json(result3);	
									}
								});	
							}else{
								res.json(result5);		
							}
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});		
			}
}

var Role = {
			get: function getRole(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						var role_id = req.params.role_id;
						if(typeof role_id !== 'undefined'){
							Api.get('role', {"apikey": apikey, "role_id": role_id}, {}, function (error, response, body) {
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
							  			res.json({"err_code": 2, "err_msg": "Role data is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getRole"});
							  	}
							  }
							});
						}else{
							Api.get('roles', {"apikey": apikey}, {}, function (error, response, body) {
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
							  			res.json({"err_code": 2, "err_msg": "Role data is empty"});	
								  	}
							  	}else{
							  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getRole"});
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
			post: function addRole(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var role_name = req.body.role_name;

				var errCode = 0;
				var errMsg = "";
				if(typeof role_name === 'undefined' || role_name == ""){
					errCode = 1;
					errMsg = "Role name is required";
				}

				if(errCode == 0){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							//cek email data user apakah sudah ada atau belum
							checkRoleName(apikey, role_name, function(result2){
								if(result2.err_code == 0){
									//ambil id user terakhir
									getRoleId(apikey, function(result3){
										if(result3.err_code == 0){
											//susun body
											var dataRole = {
																				"role_id": result3.role_id,
																				"role_name": role_name,
																				"role_create_date": getFormattedDate()
																			};
											
											//proses simpan data user
											//method, endpoint, params, options, callback
											Api.post('role', {"apikey": apikey}, {body: dataRole, json:true}, function(error, response, body){
												if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api User Management", "function": "addRole"});
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
					res.json({"err_code": errCode, "err_msg": errMsg})
				}
			},
			put: function updateRole(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var role_name = req.body.role_name;
				console.log(role_name)
				if(typeof role_name == 'undefined'  || role_name == ""){
					res.json({"err_code": 2, "err_msg": "Role is required"});
				}else{
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkRoleName(apikey, req.body.role_name, function(result2){
								if(result2.err_code == 0){
									//ambil id user terakhir
									var role_id = req.params.role_id;
									if(typeof role_id !== 'undefined'){
										checkRoleId(apikey, role_id, function(result2){
											if(result2.err_code == 0){
												//cek untuk data yang akan diupdate
												var dataRole= {};
												
													dataRole.role_name = req.body.role_name;
													dataRole.role_update_date = getFormattedDate();

													Api.put('role', {"apikey": apikey, "role_id": role_id}, {body: dataRole, json:true}, function (error, response, body) {
													  if(error){
													  	res.json(error)
													  }else{
													  	if(body.err_code == 0){
														  	res.json({"err_code": 0, "data": body.data});
													  	}else{
													  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "updateRole"});
													  	}
													  }
													});
											}else{
												res.json(result2);
											}
										})
									}else{
										res.json({"err_code": 3, "err_msg": "Role ID not found"});
									}
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
				}	
			},
			delete: function deleteRole(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						var role_id = req.params.role_id;						
						if(typeof role_id !== 'undefined'){
							checkRoleId(apikey, role_id, function(result2){
								if(result2.err_code == 0){
									Api.delete('role', {"apikey": apikey, "role_id": role_id}, {}, function (error, response, body) {
									  if(error){
									  	res.json(error);
									  }else{
									  	//cek apakah ada error atau tidak
									  	rez = JSON.parse(body);
									  	if(rez.err_code == 0){
										  	res.json({"err_code": 0, "status": "Role has been deleted"})
									  	}else{
									  		res.json(body);
									  	}
									  }
									});
								}else{
									res.json(result2);
								}
							})
						}else{
							res.json({"err_code": 3, "err_msg": "Role ID not found"});	
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			}
}

var Privilege = {
			post: function addPrivilege(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var role_id = req.params.role_id;
				var privilege_menu = req.body.privilege_menu;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//cek email data user apakah sudah ada atau belum
						checkPrivilegeMenu(apikey, privilege_menu, function(result2){
							if(result2.err_code == 0){
								//ambil id user terakhir
								getPrivilageId(apikey, function(result3){
									if(result3.err_code == 0){
										if(privilege_menu == '*'){
					            var privilege_view = true;
					            var privilege_create = true;
					            var privilege_update = true;
					            var privilege_delete = true;
					          }else{
					            var privilege_view = req.body.privilege_view;
					            var privilege_create = req.body.privilege_create;
					            var privilege_update = req.body.privilege_update;
					            var privilege_delete = req.body.privilege_delete;  
					          }


										//susun body
										var dataPrivilege = {
																			"privilege_id": result3.privilege_id,
																			"privilege_menu": privilege_menu,
																			"privilege_view": privilege_view,
																			"privilege_create": privilege_create,
																			"privilege_update": privilege_update,
																			"privilege_delete": privilege_delete,
																			"privilege_create_date": getFormattedDate()
																		};
										
										//proses simpan data user
										//method, endpoint, params, options, callback
										Api.post('privilege', {"apikey": apikey, "role_id": role_id}, {body: dataPrivilege, json:true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api User Management", "function": "addPrivilege"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	if(body.err_code == 0){
											  	res.json({"err_code": 0, "status": "Privilege add is succes "})
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
			put: function updatePrivilege(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						var privilege_id = req.params.privilege_id;
						if(typeof privilege_id !== 'undefined'){
							//cek untuk data yang akan diupdate
							var dataPrivilege= {};
							var privilege_menu = req.body.privilege_menu;
							if(typeof privilege_menu !== 'undefined'){
								if(privilege_menu == '*'){
			            var privilege_view = true;
			            var privilege_create = true;
			            var privilege_update = true;
			            var privilege_delete = true;
			          }else{
			          	var privilege_view = req.body.privilege_view;
			            var privilege_create = req.body.privilege_create;
			            var privilege_update = req.body.privilege_update;
			            var privilege_delete = req.body.privilege_delete;  
			          }

			          //susun body
								var dataPrivilege = {
																	"privilege_menu": privilege_menu,
																	"privilege_view": privilege_view,
																	"privilege_create": privilege_create,
																	"privilege_update": privilege_update,
																	"privilege_delete": privilege_delete,
																	"privilege_update_date": getFormattedDate()
																};
							}else{
								res.json({"err_code": 2, "err_msg": "Privilege menu is empty"});
							}

							Api.put('privilege', {"apikey": apikey, "privilege_id": privilege_id}, {body: dataPrivilege, json:true}, function (error, response, body) {
							  if(error){
							  	res.json(error)
							  }else{
							  	if(body.err_code == 0){
								  	res.json({"err_code": 0, "status": "Privilege have been update"});
							  	}else{
							  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "updatePrivilege"});
							  	}
							  }
							});
						}else{
							res.json({"err_code": 3, "err_msg": "Privilege id not found"});
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			},
			delete: function deleteRole(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;

				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						//proses query ambil data user
						var role_id = req.params.role_id;
						if(typeof role_id !== 'undefined'){
							Api.delete('role', {"apikey": apikey, "role_id": role_id}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	//cek apakah ada error atau tidak
							  	rez = JSON.parse(body);
							  	if(rez.err_code == 0){
								  	res.json({"err_code": 0, "status": "Role has been deleted"})
							  	}else{
							  		res.json(body);
							  	}
							  }
							});
						}else{
							res.json({"err_code": 3, "err_msg": "Role ID not found"});	
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}
				});	
			}
}

var Login = {
	post: function userLogin(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		
		var user_email = req.body.user_email;
		var user_password = md5(req.body.user_password);

		checkApikey(apikey, ipAddres, function(result){
			if(result.err_code == 0){		
				//susun body
				var dataUser = {
													"user_email": req.body.user_email,	
													"user_password": md5(req.body.user_password)
												};
				
				//proses simpan data user
				//method, endpoint, params, options, callback
				Api.post('login', {"apikey": apikey}, {body: dataUser, json:true}, function(error, response, body){
					if(error){
				  	res.json({"err_code": 1, "err_msg": error, "application": "Api User Management", "function": "userLogin"});
				  }else{
				  	//cek apakah ada error atau tidak
				  	var user = body; //object
				  	//cek apakah ada error atau tidak
				  	if(user.err_code == 0){
					  	//cek jumdata dulu
					  	if(user.data.length > 0){
					  		if(user.data[0].user_is_active){
					  			res.json({"err_code": 0, "data":user.data});
					  		}else{
					  			res.json({"err_code": 3, "err_msg": "User is not active"});		
					  		}
					  	}else{
				  			res.json({"err_code": 2, "err_msg": "User data is not found"});	
					  	}
				  	}else{
				  		res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "userLogin"});
				  	}
				  }
				})
			}else{
				result.err_code = 500;
				res.json(result);
			}	
		});
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
		  		//check user_role_id == 1 <-- admin/root
		  		if(user.data[0].user_role_id == 1){
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

function checkEmail(apikey, email, callback){
	//method, endpoint, params, options, callback
	Api.get('check_email', {"apikey": apikey, "user_email": email}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		x({"err_code": 2, "err_msg": "Email already exist", "application": "user_management"});	
		  	}else{
	  			x({"err_code": 0, "status": "Email ready to use"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "checkEmail"});
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
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "checkUserId"});
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
	  		x({"err_code": 1, "err_msg": group.error, "application": "Api User Management", "function": "checkGroupId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkMemberId(apikey, member_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_member_id', {"apikey": apikey, "member_id": member_id}, {}, function (error, response, body) {
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
	  			x({"err_code": 2, "err_msg": "Member id is not found"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": group.error, "application": "Api User Management", "function": "checkMemberId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkRoleId(apikey, role_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_role_id', {"apikey": apikey, "role_id": role_id}, {}, function (error, response, body) {
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
	  			x({"err_code": 2, "err_msg": "Role id is not found"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": group.error, "application": "Api User Management", "function": "checkRoleId"});
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
	  		x({"err_code": 1, "err_msg": group.error, "application": "Api User Management", "function": "checkMemberId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkOwnerGroup(apikey, user_id, group_id, callback){
	//method, endpoint, params, options, callback
	Api.get('check_owner_group', {"apikey": apikey, "user_id": user_id, "group_id": group_id}, {}, function (error, response, body) {
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
		  		x({"err_code": 2, "err_msg": "Access denied for this group"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": group.error, "application": "Api User Management", "function": "checkOwnerGroup"});
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

function checkGroupName(apikey, group_name, callback){
	//method, endpoint, params, options, callback
	Api.get('check_group_name', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	group = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(group.err_code == 0){
		  	//cek jumdata dulu
		  	if(group.data.length > 0){
		  		var status = false;
		  		for(i=0; i<group.data.length; i++){
		  			if(group.data[i].group_name.toString().toLowerCase() == group_name.toString().toLowerCase()){
		  				status = true;
		  			}
		  		}

		  		if(status){
		  			x({"err_code": 2, "status": "Group already exist"});	
		  		}else{
		  			x({"err_code": 0, "status": "Group ready to use"});	
		  		}
		  	}else{
	  			x({"err_code": 0, "status": "Group ready to use"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": group.error, "application": "Api User Management", "function": "checkGroupName"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkRoleName(apikey, role_name, callback){
	//method, endpoint, params, options, callback
	Api.get('check_role_name', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	role = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(role.err_code == 0){
		  	//cek jumdata dulu
		  	if(role.data.length > 0){
		  		var status = false;
		  		for(i=0; i<role.data.length; i++){
		  			if(role.data[i].role_name.toString().toLowerCase() == role_name.toString().toLowerCase()){
		  				status = true;
		  			}
		  		}

		  		if(status){
		  			x({"err_code": 2, "status": "Role name already exist"});	
		  		}else{
		  			x({"err_code": 0, "status": "Role name ready to use"});	
		  		}
		  	}else{
	  			x({"err_code": 0, "status": "Role name ready to use"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": role.error, "application": "Api User Management", "function": "checkRoleName"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkPrivilegeMenu(apikey, privilege_menu, callback){
	//method, endpoint, params, options, callback
	Api.get('check_privilege_menu', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	privilege = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(privilege.err_code == 0){
		  	//cek jumdata dulu
		  	if(privilege.data.length > 0){
		  		var status = false;
		  		for(i=0; i<privilege.data.length; i++){
		  			if(privilege.data[i].privilege_menu.toString().toLowerCase() == privilege_menu.toString().toLowerCase()){
		  				status = true;
		  			}
		  		}

		  		if(status){
		  			x({"err_code": 2, "status": "Privilege menu already exist"});	
		  		}else{
		  			x({"err_code": 0, "status": "Privilege menu ready to use"});	
		  		}
		  	}else{
	  			x({"err_code": 0, "status": "Privilege menu ready to use"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": privilege.error, "application": "Api User Management", "function": "checkPrivilegeMenu"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function generateApikey(date){
	return md5(date);
}

function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
}

function getUserId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_user_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		var user_id = parseInt(user.data[0].user_id) + 1;
		  		x({"err_code": 0, "user_id": user_id});	
		  	}else{
		  		x({"err_code": 0, "user_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getUserId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function getGroupId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_group_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		var group_id = parseInt(user.data[0].group_id) + 1;
		  		x({"err_code": 0, "group_id": group_id});	
		  	}else{
		  		x({"err_code": 0, "group_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getGroupId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function getRoleId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_role_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		var role_id = parseInt(user.data[0].role_id) + 1;
		  		x({"err_code": 0, "role_id": role_id});	
		  	}else{
		  		x({"err_code": 0, "role_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getRoleId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function getPrivilageId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_privilage_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	privilege = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(privilege.err_code == 0){
		  	//cek jumdata dulu
		  	if(privilege.data.length > 0){
		  		var privilege_id = parseInt(privilege.data[0].privilege_id) + 1;
		  		x({"err_code": 0, "privilege_id": privilege_id});	
		  	}else{
		  		x({"err_code": 0, "privilege_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": privilege.error, "application": "Api User Management", "function": "getPrivilageId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function getMemberId(apikey, callback){
	//method, endpoint, params, options, callback
	Api.get('get_member_id', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	member = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(member.err_code == 0){
		  	//cek jumdata dulu
		  	if(member.data.length > 0){
		  		var member_id = parseInt(member.data[0].member_id) + 1;
		  		x({"err_code": 0, "member_id": member_id});	
		  	}else{
		  		x({"err_code": 0, "member_id": 1});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": member.error, "application": "Api User Management", "function": "getMemberId"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

//get method
app.get('/:apikey/user/:user_id?', User.get);
app.get('/:apikey/group/:group_id?', Group.get);
app.get('/:apikey/group/:group_id?/user/:user_id', Group.getGroupUser);
app.get('/:apikey/group/:group_id?/member', Member.get);
app.get('/:apikey/role/:role_id?', Role.get);

//post method
app.post('/:apikey/user', User.post);
app.post('/:apikey/group', Group.post);
app.post('/:apikey/member', Member.post);
app.post('/:apikey/role', Role.post);
app.post('/:apikey/privilege/:role_id', Privilege.post);
app.post('/:apikey/login', Login.post);


//put method
app.put('/:apikey/user/:user_id?', User.put);
app.put('/:apikey/group/:group_id?', Group.put);
app.put('/:apikey/member/:member_id', Member.put);
app.put('/:apikey/role/:role_id?', Role.put);
app.put('/:apikey/privilege/:privilege_id?', Privilege.put);

//delete method
app.delete('/:apikey/user/:user_id?', User.delete);
app.delete('/:apikey/group/:group_id?', Group.delete);
app.delete('/:apikey/group/:group_id?/member/:member_id?', Member.delete);
app.delete('/:apikey/role/:role_id?', Role.delete);


var server = app.listen(port, host, function () {
  console.log("Server running at http://%s:%s", host, port);
})