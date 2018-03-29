var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var configYaml = yamlconfig.readConfig('../config/config.yml');
var Apiclient = require('apiclient');
var md5 = require('md5');
var XMLWriter = require('xml-writer');
var Hdfs = require('hdfs247');


var host = configYaml.baciro_oozie.host;
var port = configYaml.baciro_oozie.port;

//phoenix
//query data melalui rest phoenix
var seedPhoenix = require("../config/seed_phoenix.json");
seedPhoenix.base.hostname = configYaml.phoenix.host;
seedPhoenix.base.port 		= configYaml.phoenix.port;
var ApiPhoenix = new Apiclient(seedPhoenix);

//oozie
//submit job ke oozie
//var seedOozie = require("../config/seed_oozie.json");
var seedOozie =
{
			base: {
				protocol: 'http',
				pathname: '/oozie'
			},
			path: {
				GET: {
					get_job_info: {
							location: '/v1/job/%(ooziejob_id)s'
					}
				},
				POST: {
					oozie_job: {
							location: '/v1/jobs',
							query: {
								action:'start'
							}
						}
				}
			}
	}

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

var Phoenix = {
    getHistory: function getProjectJobHistory(req, res){
        var ipAddres = req.connection.remoteAddress;
        var apikey = req.params.apikey;
        var project_id = req.params.project_id

        checkApikey(apikey, ipAddres, function(result){
            if(result.err_code == 0){
                //proses query ambil data user
                if(typeof project_id !== 'undefined'){
                    ApiPhoenix.get('get_project_job_history', {"apikey": apikey, "project_id": project_id}, {}, function (error, response, body) {
                      if(error){
                        res.json(error);
                      }else{
                        var history = JSON.parse(body); //object
                        //cek apakah ada error atau tidak
                        if(history.err_code == 0){
                            //cek jumdata dulu
                            if(history.data.length > 0){
                                res.json({"err_code": 0, "data":history.data});
                            }else{
                                res.json({"err_code": 2, "err_msg": "History job is not found", "application": "Api Baciro Oozie", "function": "getProjectJobHistory"});
                            }
                        }else{
                            res.json(body);
                        }
                      }
                    });
                }else{
                    res.json({"err_code": 3, "err_msg": "Project ID is not defined", "application": "Api Baciro Oozie", "function": "getProjectJobHistory"});
                }
            }else{
                res.json({"err_code": 4, "err_msg": "API Key is invalid", "application": "Api Baciro Oozie", "function": "getProjectJobHistory"});
            }
        });
    },
	getxml: function getXml(req, res){
        var ipAddres = req.connection.remoteAddress;
        var apikey = req.params.apikey;

				var jarName = req.body.jarName;
				var jobName = req.body.jobName;
				var className = req.body.className;
				var projectId = req.body.projectId;
				if(req.body.args === undefined){
          var argumenInput = "";
          var argumenOutput = "";
          var argumenOthers = "";          
        }else{
          var argumenInput = req.body.args.input;
          if(req.body.args.output == undefined){
            var argumenOutput = "";
          }else{
            var argumenOutput = req.body.args.output;
          }
          
          if(req.body.args.others == undefined){
            var argumenOthers = "";
          }else{
            var argumenOthers = req.body.args.others;
          }
        }

        if(projectId == undefined || jarName == undefined || jobName == undefined || className ==undefined) {       
					res.json({"err_code":1, "err_msg":"Body Parameter is Invalid"});
				} else {
        checkApikey(apikey, ipAddres, function(result){
            if(result.err_code == 0){
                //proses query ambil data user
								getUserByApikey(apikey, function(result2){
                if(result2.err_code == 0){
                //ambil cluster_id
                var cluster_id = result2.user_cluster_id;
								var user_id = result2.user_id;
								
                //checking cluster config
                if(cluster_id !== 'null'){
                  ApiPhoenix.get('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function (error, response, body) {
                    if(error){
                        res.json(error);
                    }else{
                        var job_config = JSON.parse(body); //object

                        //cek apakah ada error atau tidak
                        if(job_config.err_code == 0){
                            //cek jumdata dulu
                            if(job_config.data.length > 0){
                              if(job_config.data[0].cluster_status == 'active' || job_config.data[0].cluster_status == 'default'){
                                var usernameOozie, nameNode, jobTracker, queueName, useSystemLibpath, oozieLibpath;

                                ApiPhoenix.get('projectByUser', {"apikey": apikey, "project_id":projectId, "user_id":user_id}, {}, function(error, response, body){
                                  if(error){
                                    res.json(error);
                                  }else{

                                    var userProject = JSON.parse(body); //object
                                    //cek apakah ada error atau tidak
                                    if(userProject.err_code == 0){
                                      //cek jumdata dulu
                                      if(userProject.data.length > 0){
                                        var projectName = userProject.data[0].project_name;

                                        for(var i = 0; i < job_config.data.length; i++){
                                            switch(job_config.data[i].config_key){
                                            case 'usernameOozie':
                                                usernameOozie = job_config.data[i].config_value; //dari user_id, kalau di workflow wf:user
                                                break;
                                            case 'jobTracker':
                                                jobTracker = job_config.data[i].config_value;
                                                break;
                                            case 'nameNode':
                                                nameNode = job_config.data[i].config_value;
                                                break;
                                            // case 'examplesRoot':
                                            //    examplesRoot = job_config.data[i].config_value;
                                            //    break;
                                            case 'queueName':
                                                queueName = job_config.data[i].config_value;
                                                break;
                                            // case 'oozieWfPath':
                                            //    oozieWfPath = job_config.data[i].config_value;
                                            //    break;
                                            case 'useSystemLibpath':
                                                useSystemLibpath = job_config.data[i].config_value;
                                                break;
                                            case 'oozieLibpath':
                                                oozieLibpath = job_config.data[i].config_value;
                                                break;
                                            }
                                        }

                                          var wfPath = '${nameNode}/user/' + usernameOozie + '/jobfile/workflow/' + projectName + '/workflow.xml';
                                          if(usernameOozie == undefined || nameNode == undefined || jobTracker == undefined || queueName == undefined || useSystemLibpath == undefined || oozieLibpath == undefined || wfPath == undefined) {
                                            res.json({"err_code": 1, "err_msg":"Configuration parameter is undefined"})
                                          }else {
                                            var xml = generateXml(usernameOozie, nameNode, jobTracker, queueName, useSystemLibpath, oozieLibpath, wfPath);
                                            console.log("Success generate XML Job Property");
                                          }

                                          var workflow = generateWorkflow(jarName, jobName, className, argumenInput, argumenOutput, argumenOthers, queueName);
                                          console.log("Success generate XML Workflow");

                                          res.set('Content-Type', 'application/json');
                                          res.send({"err_code": 0, "data":{ "xml":xml.output, "workflow":workflow.output }});
                                          //console.log(xml.output);
                                        }else{
                                          res.json({"err_code": 4, "err_msg": "Access denied. Cannot access this project"});
                                        }
                                      }else{
                                        res.json({"err_code": 3, "err_msg": user.error, "application": "Api Baciro Oozie", "function": "getProjectByUser"});
                                      }
                                    }
                                  });//getProjectByUser
                                }else{
                                    res.json({"err_code": 2, "err_msg": "Job Configuration is not found"});
                                }
                              }else{
                                res.json({"err_code": 3, "err_msg": "Job Configuration is not active"});
                              }
                          }else{
                              res.json({"err_code": 1, "err_msg": "Cluster is not found"});
                        }
                    }//else
                  });
                }else{
                  ApiPhoenix.get('default_config', {"apikey": apikey}, {}, function (error, response, body) {
                    if(error){
                        res.json(error);
                    }else{
                        var job_config = JSON.parse(body); //object

                        //cek apakah ada error atau tidak
                        if(job_config.err_code == 0){
                            //cek jumdata dulu
                            if(job_config.data.length > 0){
                              var usernameOozie, nameNode, jobTracker, queueName, useSystemLibpath, oozieLibpath;

                              ApiPhoenix.get('projectByUser', {"apikey": apikey, "project_id":projectId, "user_id":user_id}, {}, function(error, response, body){
                                if(error){
                                  res.json(error);
                                }else{

                                  var userProject = JSON.parse(body); //object
                                  //cek apakah ada error atau tidak
                                  if(userProject.err_code == 0){
                                    //cek jumdata dulu
                                    if(userProject.data.length > 0){
                                      var projectName = userProject.data[0].project_name;

                                      for(var i = 0; i < job_config.data.length; i++){
                                          switch(job_config.data[i].config_key){
                                          case 'usernameOozie':
                                              usernameOozie = job_config.data[i].config_value; //dari user_id, kalau di workflow wf:user
                                              break;
                                          case 'jobTracker':
                                              jobTracker = job_config.data[i].config_value;
                                              break;
                                          case 'nameNode':
                                              nameNode = job_config.data[i].config_value;
                                              break;
                                          // case 'examplesRoot':
                                          //    examplesRoot = job_config.data[i].config_value;
                                          //    break;
                                          case 'queueName':
                                              queueName = job_config.data[i].config_value;
                                              break;
                                          // case 'oozieWfPath':
                                          //    oozieWfPath = job_config.data[i].config_value;
                                          //    break;
                                          case 'useSystemLibpath':
                                              useSystemLibpath = job_config.data[i].config_value;
                                              break;
                                          case 'oozieLibpath':
                                              oozieLibpath = job_config.data[i].config_value;
                                              break;
                                          }
                                      }

                                        var wfPath = '${nameNode}/user/' + usernameOozie + '/jobfile/workflow/' + projectName + '/workflow.xml';
                                        if(usernameOozie == undefined || nameNode == undefined || jobTracker == undefined || queueName == undefined || useSystemLibpath == undefined || oozieLibpath == undefined || wfPath == undefined) {
                                          res.json({"err_code": 1, "err_msg":"Configuration parameter is undefined"})
                                        }else {
                                          var xml = generateXml(usernameOozie, nameNode, jobTracker, queueName, useSystemLibpath, oozieLibpath, wfPath);
                                          console.log("Success generate XML Job Property");
                                        }

                                        var workflow = generateWorkflow(jarName, jobName, className, argumenInput, argumenOutput, argumenOthers, queueName);
                                        console.log("Success generate XML Workflow");

                                        res.set('Content-Type', 'application/json');
                                        res.send({"err_code": 0, "data":{ "xml":xml.output, "workflow":workflow.output }});
                                        //console.log(xml.output);
                                      }else{
                                        res.json({"err_code": 4, "err_msg": "Access denied. Cannot access this project"});
                                      }
                                    }else{
                                      res.json({"err_code": 3, "err_msg": user.error, "application": "Api Baciro Oozie", "function": "getProjectByUser"});
                                    }
                                  }
                                });//getProjectByUser
                              }else{
                                  res.json({"err_code": 2, "err_msg": "Job Configuration is not found"});
                              }
                          }else{
                            res.json({"err_code": 1, "err_msg": "Cluster is not found"});
                        }
                    }//else
                  });
                }
							}else{
								result.err_code = 500;
								res.json(result2);//getclusterfromapikey
							}
						});
          }else{
              result.err_code = 500;
              res.json(result);//apikey
          }
        });
			}
    },
    getjobid: function getJobId(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;

      checkApikey(apikey, ipAddres, function(result){
        if(result.err_code == 0){
          getUserByApikey(apikey, function(result2){
          if(result2.err_code == 0){
          //ambil user_id
					console.log(result2);
          var user_id = result2.user_id;

          //proses query ambil data user
          if(typeof user_id !== 'undefined'){
            ApiPhoenix.get('get_job_id_from_db', {"apikey": apikey, "user_id": user_id}, {}, function (error, response, body) {
              if(error){
                res.json(error);
              }else{
                var job_id = JSON.parse(body); //object
                //cek apakah ada error atau tidak
                if(job_id.err_code == 0){
                  //cek jumdata dulu
                  if(job_id.data.length > 0){
                    res.json(job_id.data);
                  }else{
                    res.json({"err_code": 2, "err_msg": "No job found for this user"});
                  }
                }else{
                  res.json({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "getJobId"});
                }
              }
            });
          }
          }else{
            result.err_code = 500;
            res.json(result2);//getclusterfromapikey
          }
        });
        }else{
          result.err_code = 500;
          res.json(result);
        }
      });

    }
}

var Oozie = {
    post: function submitJob(req, res){
        var ipAddres = req.connection.remoteAddress;
        var apikey = req.params.apikey;

				var projectId = req.body.projectId;
				var jarName = req.body.jarName;
				var jobName = req.body.jobName;
				var className = req.body.className;

        if(req.body.args === undefined){
          var argumenInput = "";
          var argumenOutput = "";
          var argumenOthers = "";          
        }else{
          var argumenInput = req.body.args.input;
          if(req.body.args.output == undefined){
            var argumenOutput = "";
          }else{
            var argumenOutput = req.body.args.output;
          }
          
          if(req.body.args.others == undefined){
            var argumenOthers = "";
          }else{
            var argumenOthers = req.body.args.others;
          }
        }

				if(projectId == undefined || jarName == undefined || jobName == undefined || className ==undefined) {
					res.json({"err_code":11, "err_msg":"Body Parameter is Invalid"});
				}else{
        //cek API user
        checkApikey(apikey, ipAddres, function(result){
            if(result.err_code == 0){
                //variabel untuk upload workflow ke hdfs
                var hostnameHdfs, portHdfs, usernameHdfs;

                getUserByApikey(apikey, function(result2){
                  if(result2.err_code == 0){
                    //ambil cluster_id
                    var cluster_id = result2.user_cluster_id;
				    				var user_id = result2.user_id;
                    if(cluster_id !== 'null'){
                      //proses simpan data user
                      //method, endpoint, params, options, callback
                      ApiPhoenix.get('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function (error, response, body) {
                        if(error){
                            res.json(error);
                        }else{
                            if(body == undefined){
                              res.json({"err_code": 10, "err_msg":"Cluster configuration is not set"});
                            }
                            else{
                              var job_config = JSON.parse(body); //object
                              //cek apakah ada error atau tidak
                              if(job_config.err_code == 0){
                                  //cek jumdata dulu
                                  if(job_config.data.length > 0){
                                    if(job_config.data[0].cluster_status == 'active' || job_config.data[0].cluster_status == 'default'){
                                      //rest untuk ambil data project name dari project id
                                      ApiPhoenix.get('projectByUser', {"apikey": apikey, "project_id":projectId, "user_id":user_id}, {}, function(error, response, body){
                                        if(error){
                                          res.json(error);
                                        }else{
                                            var userProject = JSON.parse(body); //object
                                            //cek apakah ada error atau tidak
                                            if(userProject.err_code == 0){
                                              //cek jumdata dulu
                                              if(userProject.data.length > 0){
                                                var projectName = userProject.data[0].project_name;
                                                //rest untuk mengambil info job dari response yang diperoleh
                                                var usernameOozie, nameNode, /*examplesRoot,*/ jobTracker, queueName, useSystemLibpath, oozieLibpath;

                                                for(var i = 0; i < job_config.data.length; i++){
                                                    switch(job_config.data[i].config_key){
                                                    case 'usernameOozie':
                                                        usernameOozie = job_config.data[i].config_value; //dari user_id, kalau di workflow wf:user
                                                        break;
                                                    case 'jobTracker':
                                                        jobTracker = job_config.data[i].config_value;
                                                        break;
                                                    case 'nameNode':
                                                        nameNode = job_config.data[i].config_value;
                                                        break;
                                                    // case 'examplesRoot':
                                                    //     examplesRoot = job_config.data[i].config_value;
                                                    //     break;
                                                    case 'queueName':
                                                        queueName = job_config.data[i].config_value;
                                                        break;
                                                    case 'useSystemLibpath':
                                                        useSystemLibpath = job_config.data[i].config_value;
                                                        break;
                                                    case 'oozieLibpath':
                                                        oozieLibpath = job_config.data[i].config_value;
                                                        break;

                                                    //untuk seedOozie
                                                    case 'hostnameOozie':
                                                        seedOozie.base.hostname = job_config.data[i].config_value;
                                                        break;
                                                    case 'portOozie':
                                                        seedOozie.base.port = job_config.data[i].config_value;
                                                        break;

                                                        //untuk hdfs
                                                    case 'hostnameHdfs':
                                                        hostnameHdfs = job_config.data[i].config_value;
                                                        break;
                                                    case 'portHdfs':
                                                        portHdfs = job_config.data[i].config_value;
                                                        break;
                                                    case 'usernameHdfs':
                                                        usernameHdfs = job_config.data[i].config_value;
                                                        break;
                                                    }
                                                }


                                                    var wfPath = '${nameNode}/user/' + usernameOozie + '/jobfile/workflow/' + projectName + '/workflow.xml';

                                                    if(usernameOozie == undefined || nameNode == undefined || jobTracker == undefined || queueName == undefined || useSystemLibpath == undefined || oozieLibpath == undefined || wfPath == undefined) {
                                                      res.json({"err_code": 9, "err_msg":"Configuration parameter is undefined"});
                                                    }else {
                                                      var xml = generateXml(usernameOozie, nameNode, jobTracker, queueName, useSystemLibpath, oozieLibpath, wfPath);
                                                      console.log("Success generate XML Job Property");
                                                    }

                                                    try{
                                                        //Generate workflow.xml file
                                                        var workflow = generateWorkflow(jarName, jobName, className, argumenInput,argumenOutput,argumenOthers, queueName);
                                                        var pathFile = __dirname + '/workflow_xml/workflow.xml';
                                                        fs.writeFile(pathFile, workflow, function(error) {
                                                            if (error) {
                                                                console.error("write error:  " + error.message);
                                                             } else {
                                                                console.log("Success Write Workflow.xml to " + pathFile+"\nNext is upload to HDFS");
                                                            }
                                                        });

                                                        //HDFS property initialization
                                                        //var pathFile = __dirname + '/workflow_xml/workflow.xml';
                                                        var hdfs = new Hdfs({
                                                                  protocol:'http',
                                                                  hostname:hostnameHdfs,
                                                                  port:portHdfs
                                                                   });

                                                        var params = {
                                                            'user.name': usernameHdfs,
                                                            path: '/user/' + usernameOozie + '/jobfile/workflow/' + projectName
                                                        };

                                                        hdfs.liststatus(params, function(error, response, body){
                                                            var obj1 = JSON.parse(body);
                                                            var path = '/user/' + usernameOozie + '/jobfile/workflow/' + projectName;
                                                            if(obj1.FileStatuses !== undefined){
                                                                hdfs.upload({
                                                                     'user.name':usernameHdfs,
                                                                     overwrite:true,
                                                                     localpath:pathFile,
                                                                     path: path + '/workflow.xml'
                                                                 }, function(error, response, body){
                                                                     if(error){
                                                                            console.log(error);
                                                                            res.json({"err_code":5, "err_msg":"Cannot upload to HDFS"});
                                                                      }else{
                                                                            console.log("Workflow.xml is succesfully uploaded to HDFS");
                                                                            var ApiOozie = new Apiclient(seedOozie);
                                                                            ApiOozie.post('oozie_job', {}, {body:xml.output, headers: {'Content-Type': 'application/xml'}}, function(error, response, body){
                                                                                if(error){
                                                                                    console.log("Error while posting to Oozie");
                                                                                    res.json({"err_code": 8, "err_msg": "Error while posting to Oozie", "application": "Api Baciro Oozie", "function": "submitJob"});
                                                                                }else{
                                                                                    console.log("Success posting Job to Oozie");
                                                                                    //res.send(body);
                                                                                    var jobBody = JSON.parse(body);
                                                                                    //rest untuk mengambil info job dari response yang diperoleh
                                                                                    ApiOozie.get('get_job_info', {"ooziejob_id": jobBody.id}, {}, function(error, response, body){
                                                                                        if(error){
                                                                                            res.json(error);
                                                                                        }else{
                                                                                            var job_info = JSON.parse(body); //object
                                                                                            //sini buat ngambil dari tabel Job
                                                                                            var dataJob = {
                                                                                                "oozie_job_id":job_info.id,
                                                                                                "job_name":job_info.appName,
                                                                                                "job_status":job_info.status,
                                                                                                "job_project_id":projectId,
                                                                                                "application_job_id":0,
                                                                                                "job_create_date": getFormattedDate(),
                                                                                                "job_update_date": getFormattedDate(),
                                                                                                "user_id":user_id,
                                                                                                "job_workflow": workflow.output
                                                                                            };

                                                                                            ApiPhoenix.post('job', {"apikey":apikey}, {body:dataJob, json:true}, function(error, response, body){
                                                                                                if(error){
                                                                                                    console.log("Error while Saving Job Info to DB");
                                                                                                    res.json({"err_code": 7, "err_msg": "Error while Saving Job Info to Database", "application": "Api Baciro Oozie", "function": "job"});
                                                                                                }else{
                                                                                                    console.log("Success Saving Job Info to DB");
                                                                                                    res.json({"err_code": 0, "data": {"oozie_job_id":job_info.id, "job_status":job_info.status}});
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                      }
                                                                 });
                                                            }else if(obj1.RemoteException.message === 'File ' + path + ' does not exist.'){
                                                                hdfs.mkdirs(params, function(error, response, body){
                                                                        var obj2 = JSON.parse(body);
                                                                        if(obj2.boolean == true){
                                                                            console.log('Directory is created');
                                                                            //after directory is created, upload workflow.xml to the directory
                                                                             hdfs.upload({
                                                                                 'user.name':usernameHdfs,
                                                                                 overwrite:true,
                                                                                 localpath:pathFile,
                                                                                 path: path + '/workflow.xml'
                                                                             }, function(error, response, body){
                                                                                 //var obj3 = JSON.parse(body);
                                                                                 if(error){
                                                                                     console.log(error);
                                                                                     res.json({"err_code":9, "err_msg":"Cannot upload to HDFS"});
                                                                                 }else{
                                                                                     console.log("Workflow.xml is succesfully uploaded to HDFS");

                                                                                     //function call, posting job to oozie
                                                                                    var ApiOozie = new Apiclient(seedOozie);
                                                                                    var ApiOozie = new Apiclient(seedOozie);
                                                                                    ApiOozie.post('oozie_job', {}, {body:xml.output, headers: {'Content-Type': 'application/xml'}}, function(error, response, body){
                                                                                        if(error){
                                                                                            console.log("Error while posting to Oozie");
                                                                                            res.json({"err_code": 8, "err_msg": "Error while posting to Oozie", "application": "Api Baciro Oozie", "function": "submitJob"});
                                                                                        }else{
                                                                                            console.log("Success posting Job to Oozie");
                                                                                            //res.send(body);
                                                                                            var jobBody = JSON.parse(body);
                                                                                            //rest untuk mengambil info job dari response yang diperoleh
                                                                                            ApiOozie.get('get_job_info', {"ooziejob_id": jobBody.id}, {}, function(error, response, body){
                                                                                                if(error){
                                                                                                    res.json(error);
                                                                                                }else{
                                                                                                    var job_info = JSON.parse(body); //object
                                                                                                    //sini buat ngambil dari tabel Job
                                                                                                    var dataJob = {
                                                                                                        "oozie_job_id":job_info.id,
                                                                                                        "job_name":job_info.appName,
                                                                                                        "job_status":job_info.status,
                                                                                                        "job_project_id":projectId,
                                                                                                        "application_job_id":0,
                                                                                                        "job_create_date": getFormattedDate(),
                                                                                                        "job_update_date": getFormattedDate(),
                                                                                                        "user_id":user_id,
                                                                                                        "job_workflow": workflow.output
                                                                                                    };

                                                                                                    ApiPhoenix.post('job', {"apikey":apikey}, {body:dataJob, json:true}, function(error, response, body){
                                                                                                        if(error){
                                                                                                            console.log("Error while Saving Job Info to DB");
                                                                                                            res.json({"err_code": 7, "err_msg": "Error while Saving Job Info to Database", "application": "Api Baciro Oozie", "function": "job"});
                                                                                                        }else{
                                                                                                            console.log("Success Saving Job Info to DB");
                                                                                                            res.json({"err_code": 0, "data": {"oozie_job_id":job_info.id, "job_status":job_info.status}});
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                 }
                                                                             });
                                                                        }else{
                                                                            console.log('Directori is already exist');
                                                                        }
                                                                });
                                                            }else{
                                                                console.log('Directory is exist');
                                                            }
                                                        });
                                                    }
                                                    catch(err){
                                                        console.log('Error found!');
                                                        console.log(err);
                                                        res.json({"err_code":5, "err_msg":err});
                                                    }
                                                    //method, endpoint, params, options, callback
                                            }else{
                                              res.json({"err_code": 4, "err_msg": "Access denied. Cannot access this project"});
                                            }
                                          }else{
                                            res.json({"err_code": 3, "err_msg": "Project is not found"});
                                          }
                                        }
                                      });//getProjectByUser
                                    }else{
                                      res.json({"err_code": 5, "err_msg": "Job Configuration is not active"});
                                    }
                                }else{
                                  res.json({"err_code": 2, "err_msg": "Cluster configuration is not found or user cluster is not set"});
                                }
                              }else{
                                  res.json({"err_code": 1, "err_msg": "Error getting config from database"});
                              }
                            }

                        }
                      });
                    }else{
                      ApiPhoenix.get('default_config', {"apikey": apikey}, {}, function (error, response, body) {
                        if(error){
                            res.json(error);
                        }else{
                            if(body == undefined){
                              res.json({"err_code": 10, "err_msg":"Cluster configuration is not set"});
                            }
                            else{
                              var job_config = JSON.parse(body); //object
                              //cek apakah ada error atau tidak
                              if(job_config.err_code == 0){
                                  //cek jumdata dulu
                                  if(job_config.data.length > 0){
                                    //rest untuk ambil data project name dari project id
                                    ApiPhoenix.get('projectByUser', {"apikey": apikey, "project_id":projectId, "user_id":user_id}, {}, function(error, response, body){
                                      if(error){
                                        res.json(error);
                                      }else{

                                        var userProject = JSON.parse(body); //object
                                        //cek apakah ada error atau tidak
                                        if(userProject.err_code == 0){
                                          //cek jumdata dulu
                                          if(userProject.data.length > 0){
                                            var projectName = userProject.data[0].project_name;
                                            //rest untuk mengambil info job dari response yang diperoleh
                                            var usernameOozie, nameNode, /*examplesRoot,*/ jobTracker, queueName, useSystemLibpath, oozieLibpath;

                                            for(var i = 0; i < job_config.data.length; i++){
                                                switch(job_config.data[i].config_key){
                                                case 'usernameOozie':
                                                    usernameOozie = job_config.data[i].config_value; //dari user_id, kalau di workflow wf:user
                                                    break;
                                                case 'jobTracker':
                                                    jobTracker = job_config.data[i].config_value;
                                                    break;
                                                case 'nameNode':
                                                    nameNode = job_config.data[i].config_value;
                                                    break;
                                                // case 'examplesRoot':
                                                //     examplesRoot = job_config.data[i].config_value;
                                                //     break;
                                                case 'queueName':
                                                    queueName = job_config.data[i].config_value;
                                                    break;
                                                case 'useSystemLibpath':
                                                    useSystemLibpath = job_config.data[i].config_value;
                                                    break;
                                                case 'oozieLibpath':
                                                    oozieLibpath = job_config.data[i].config_value;
                                                    break;

                                                //untuk seedOozie
                                                case 'hostnameOozie':
                                                    seedOozie.base.hostname = job_config.data[i].config_value;
                                                    break;
                                                case 'portOozie':
                                                    seedOozie.base.port = job_config.data[i].config_value;
                                                    break;

                                                    //untuk hdfs
                                                case 'hostnameHdfs':
                                                    hostnameHdfs = job_config.data[i].config_value;
                                                    break;
                                                case 'portHdfs':
                                                    portHdfs = job_config.data[i].config_value;
                                                    break;
                                                case 'usernameHdfs':
                                                    usernameHdfs = job_config.data[i].config_value;
                                                    break;
                                                }
                                            }


                                                var wfPath = '${nameNode}/user/' + usernameOozie + '/jobfile/workflow/' + projectName + '/workflow.xml';

                                                if(usernameOozie == undefined || nameNode == undefined || jobTracker == undefined || queueName == undefined || useSystemLibpath == undefined || oozieLibpath == undefined || wfPath == undefined) {
                                                  res.json({"err_code": 9, "err_msg":"Configuration parameter is undefined"});
                                                }else {
                                                  var xml = generateXml(usernameOozie, nameNode, jobTracker, queueName, useSystemLibpath, oozieLibpath, wfPath);
                                                  console.log("Success generate XML Job Property");
                                                }

                                                try{
                                                    //Generate workflow.xml file
                                                    var workflow = generateWorkflow(jarName, jobName, className, argumenInput,argumenOutput,argumenOthers, queueName);
                                                    var pathFile = __dirname + '/workflow_xml/workflow.xml';
                                                    fs.writeFile(pathFile, workflow, function(error) {
                                                        if (error) {
                                                            console.error("write error:  " + error.message);
                                                         } else {
                                                            console.log("Success Write Workflow.xml to " + pathFile+"\nNext is upload to HDFS");
                                                        }
                                                    });

                                                    //HDFS property initialization
                                                    //var pathFile = __dirname + '/workflow_xml/workflow.xml';
                                                    var hdfs = new Hdfs({
                                                              protocol:'http',
                                                              hostname:hostnameHdfs,
                                                              port:portHdfs
                                                               });

                                                    var params = {
                                                        'user.name': usernameHdfs,
                                                        path: '/user/' + usernameOozie + '/jobfile/workflow/' + projectName
                                                    };

                                                    hdfs.liststatus(params, function(error, response, body){
                                                        var obj1 = JSON.parse(body);
                                                        var path = '/user/' + usernameOozie + '/jobfile/workflow/' + projectName;
                                                        if(obj1.FileStatuses !== undefined){
                                                            hdfs.upload({
                                                                 'user.name':usernameHdfs,
                                                                 overwrite:true,
                                                                 localpath:pathFile,
                                                                 path: path + '/workflow.xml'
                                                             }, function(error, response, body){
                                                                 if(error){
                                                                        console.log(error);
                                                                        res.json({"err_code":5, "err_msg":"Cannot upload to HDFS"});
                                                                  }else{
                                                                        console.log("Workflow.xml is succesfully uploaded to HDFS");
                                                                        var ApiOozie = new Apiclient(seedOozie);
                                                                        ApiOozie.post('oozie_job', {}, {body:xml.output, headers: {'Content-Type': 'application/xml'}}, function(error, response, body){
                                                                            if(error){
                                                                                console.log("Error while posting to Oozie");
                                                                                res.json({"err_code": 8, "err_msg": "Error while posting to Oozie", "application": "Api Baciro Oozie", "function": "submitJob"});
                                                                            }else{
                                                                                console.log("Success posting Job to Oozie");
                                                                                //res.send(body);
                                                                                var jobBody = JSON.parse(body);
                                                                                //rest untuk mengambil info job dari response yang diperoleh
                                                                                ApiOozie.get('get_job_info', {"ooziejob_id": jobBody.id}, {}, function(error, response, body){
                                                                                    if(error){
                                                                                        res.json(error);
                                                                                    }else{
                                                                                        var job_info = JSON.parse(body); //object
                                                                                        //sini buat ngambil dari tabel Job
                                                                                        var dataJob = {
                                                                                            "oozie_job_id":job_info.id,
                                                                                            "job_name":job_info.appName,
                                                                                            "job_status":job_info.status,
                                                                                            "job_project_id":projectId,
                                                                                            "application_job_id":0,
                                                                                            "job_create_date": getFormattedDate(),
                                                                                            "job_update_date": getFormattedDate(),
                                                                                            "user_id":user_id,
                                                                                            "job_workflow": workflow.output
                                                                                        };

                                                                                        ApiPhoenix.post('job', {"apikey":apikey}, {body:dataJob, json:true}, function(error, response, body){
                                                                                            if(error){
                                                                                                console.log("Error while Saving Job Info to DB");
                                                                                                res.json({"err_code": 7, "err_msg": "Error while Saving Job Info to Database", "application": "Api Baciro Oozie", "function": "job"});
                                                                                            }else{
                                                                                                console.log("Success Saving Job Info to DB");
                                                                                                res.json({"err_code": 0, "data": {"oozie_job_id":job_info.id, "job_status":job_info.status}});
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                  }
                                                             });
                                                        }else if(obj1.RemoteException.message === 'File ' + path + ' does not exist.'){
                                                            hdfs.mkdirs(params, function(error, response, body){
                                                                    var obj2 = JSON.parse(body);
                                                                    if(obj2.boolean == true){
                                                                        console.log('Directory is created');

                                                                        //after directory is created, upload workflow.xml to the directory
                                                                         hdfs.upload({
                                                                             'user.name':usernameHdfs,
                                                                             overwrite:true,
                                                                             localpath:pathFile,
                                                                             path: path + '/workflow.xml'
                                                                         }, function(error, response, body){
                                                                             //var obj3 = JSON.parse(body);
                                                                             if(error){
                                                                                 console.log(error);
                                                                                 res.json({"err_code":9, "err_msg":"Cannot upload to HDFS"});
                                                                             }else{
                                                                                 console.log("Workflow.xml is succesfully uploaded to HDFS");

                                                                                 //function call, posting job to oozie
                                                                                var ApiOozie = new Apiclient(seedOozie);
                                                                                var ApiOozie = new Apiclient(seedOozie);
                                                                                ApiOozie.post('oozie_job', {}, {body:xml.output, headers: {'Content-Type': 'application/xml'}}, function(error, response, body){
                                                                                    if(error){
                                                                                        console.log("Error while posting to Oozie");
                                                                                        res.json({"err_code": 8, "err_msg": "Error while posting to Oozie", "application": "Api Baciro Oozie", "function": "submitJob"});
                                                                                    }else{
                                                                                        console.log("Success posting Job to Oozie");
                                                                                        //res.send(body);
                                                                                        var jobBody = JSON.parse(body);
                                                                                        //rest untuk mengambil info job dari response yang diperoleh
                                                                                        ApiOozie.get('get_job_info', {"ooziejob_id": jobBody.id}, {}, function(error, response, body){
                                                                                            if(error){
                                                                                                res.json(error);
                                                                                            }else{
                                                                                                var job_info = JSON.parse(body); //object
                                                                                                //sini buat ngambil dari tabel Job
                                                                                                var dataJob = {
                                                                                                    "oozie_job_id":job_info.id,
                                                                                                    "job_name":job_info.appName,
                                                                                                    "job_status":job_info.status,
                                                                                                    "job_project_id":projectId,
                                                                                                    "application_job_id":0,
                                                                                                    "job_create_date": getFormattedDate(),
                                                                                                    "job_update_date": getFormattedDate(),
                                                                                                    "user_id":user_id,
                                                                                                    "job_workflow": workflow.output
                                                                                                };

                                                                                                ApiPhoenix.post('job', {"apikey":apikey}, {body:dataJob, json:true}, function(error, response, body){
                                                                                                    if(error){
                                                                                                        console.log("Error while Saving Job Info to DB");
                                                                                                        res.json({"err_code": 7, "err_msg": "Error while Saving Job Info to Database", "application": "Api Baciro Oozie", "function": "job"});
                                                                                                    }else{
                                                                                                        console.log("Success Saving Job Info to DB");
                                                                                                        res.json({"err_code": 0, "data": {"oozie_job_id":job_info.id, "job_status":job_info.status}});
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                             }
                                                                         });
                                                                    }else{
                                                                        console.log('Directori is already exist');
                                                                    }
                                                            });
                                                        }else{
                                                            console.log('Directory is exist');
                                                        }
                                                    });
                                                }
                                                catch(err){
                                                    console.log('Error found!');
                                                    console.log(err);
                                                    res.json({"err_code":5, "err_msg":err});
                                                }
                                                //method, endpoint, params, options, callback
                                        }else{
                                          res.json({"err_code": 4, "err_msg": "Access denied. Cannot access this project"});
                                        }
                                      }else{
                                        res.json({"err_code": 3, "err_msg": "Project is not found"});
                                      }
                                    }
                                  });//getProjectByUser
                                }else{
                                  res.json({"err_code": 2, "err_msg": "Cluster configuration is not found or user cluster is not set"});
                                }
                              }else{
                                  res.json({"err_code": 1, "err_msg": "Error getting config from database"});
                              }
                            }

                        }
                      });
                    }
                  }else{
                    result.err_code = 500;
                    res.json(result2);
                  }
               });
								//stop coba
            }else{
							res.json(result);
						}
        });
			}
    },

    get: function getJobInfo(req, res){
        var ipAddres = req.connection.remoteAddress;
        var apikey = req.params.apikey;

        checkApikey(apikey, ipAddres, function(result){
            if(result.err_code == 0){
                getUserByApikey(apikey, function(result2){
                    if(result2.err_code == 0){
                    //ambil cluster_id
                        var cluster_id = result2.user_cluster_id;
                        var ooziejob_id = req.params.ooziejob_id;
                        console.log('cluster_id '+ cluster_id);
                        if(cluster_id != "null"){
                          //proses query ambil data user
                          if(typeof ooziejob_id !== 'undefined'){
                              ApiPhoenix.get('cluster_configs', {"apikey": apikey, "cluster_id": cluster_id}, {}, function (error, response, body) {
                                  if(error){
                                      res.json(error);
                                  }else{
                                      var job_config = JSON.parse(body); //object
                                      //cek apakah ada error atau tidak
                                      if(job_config.err_code == 0){
                                          //cek jumdata dulu
                                          if(job_config.data.length > 0){
                                              for(var i = 0; i < job_config.data.length; i++){
                                                  switch(job_config.data[i].config_key){
                                                  case 'hostnameOozie':
                                                      seedOozie.base.hostname = job_config.data[i].config_value;
                                                      break;
                                                  case 'portOozie':
                                                      seedOozie.base.port = job_config.data[i].config_value;
                                                      break;
                                                  }
                                              }
                                              console.log("Port and Hostname Gotcha!");

                                              //method, endpoint, params, options, callback
                                              var ApiOozie = new Apiclient(seedOozie);
                                              ApiOozie.get('get_job_info', {"apikey": apikey, "ooziejob_id": ooziejob_id, "cluster_id": cluster_id}, {}, function (error, response, body) {
                                                  if(error){
                                                      res.json(error);
                                                  }else{
                                                    if(body.search("Error")>0) {
                                                      res.json({"err_code":7,"err_msg":"Job Id is not found"});
                                                    }else{
                                                      var job_info = JSON.parse(body); //object

                                                      //console.log(job_info);
                                                      //cek apakah ada error atau tidak
                                                      if(job_info !== undefined){
                                                          var data = {
                                                              "job_id":job_info.id,
                                                              "job_status":job_info.status,
                                                              "job_update_date":getFormattedDate()
                                                          };

                                                          ApiPhoenix.put('job', {"apikey": apikey, "ooziejob_id": ooziejob_id}, {body:data, json:true}, function(error, response, body){
                                                              if(error){
                                                                  console.log("Error Saving Status Update");
                                                                  res.json({"err_code": 1, "err_msg": error, "application": "Api Baciro Oozie", "function": "job"});
                                                              }else{
                                                                  console.log("Success Saving Status Update");
                                                                  res.json({"err_code": 0, "data": job_info});
                                                              }
                                                          });
                                                      }else{
                                                          res.json({"err_code": 2, "err_msg": "Job Configuration is not found"});
                                                      }
                                                  }
                                                }
                                              });
                                          }else{
                                              res.json({"err_code": 2, "err_msg": "Job Configuration is not found"});
                                          }
                                      }else{
                                          res.json({"err_code": 1, "err_msg": job_config.error, "application": "Api Baciro Oozie", "function": "get_job_info"});
                                      }
                                  }
                              });
                          }
                        }else{
                          if(typeof ooziejob_id !== 'undefined'){
                              ApiPhoenix.get('default_config', {"apikey": apikey}, {}, function (error, response, body) {
                                  if(error){
                                      res.json(error);
                                  }else{
                                      var job_config = JSON.parse(body); //object
                                      //cek apakah ada error atau tidak
                                      if(job_config.err_code == 0){
                                          //cek jumdata dulu
                                          if(job_config.data.length > 0){
                                              for(var i = 0; i < job_config.data.length; i++){
                                                  switch(job_config.data[i].config_key){
                                                  case 'hostnameOozie':
                                                      seedOozie.base.hostname = job_config.data[i].config_value;
                                                      break;
                                                  case 'portOozie':
                                                      seedOozie.base.port = job_config.data[i].config_value;
                                                      break;
                                                  }
                                              }
                                              console.log("Port and Hostname Gotcha!");

                                              //method, endpoint, params, options, callback
                                              var ApiOozie = new Apiclient(seedOozie);
                                              ApiOozie.get('get_job_info', {"apikey": apikey, "ooziejob_id": ooziejob_id, "cluster_id": cluster_id}, {}, function (error, response, body) {
                                                  if(error){
                                                      res.json(error);
                                                  }else{
                                                    if(body.search("Error")>0) {
                                                      res.json({"err_code":7,"err_msg":"Job Id is not found"});
                                                    }else{
                                                      var job_info = JSON.parse(body); //object

                                                      //console.log(job_info);
                                                      //cek apakah ada error atau tidak
                                                      if(job_info !== undefined){
                                                          var data = {
                                                              "job_id":job_info.id,
                                                              "job_status":job_info.status,
                                                              "job_update_date":getFormattedDate()
                                                          };

                                                          ApiPhoenix.put('job', {"apikey": apikey, "ooziejob_id": ooziejob_id}, {body:data, json:true}, function(error, response, body){
                                                              if(error){
                                                                  console.log("Error Saving Status Update");
                                                                  res.json({"err_code": 1, "err_msg": error, "application": "Api Baciro Oozie", "function": "job"});
                                                              }else{
                                                                  console.log("Success Saving Status Update");
                                                                  res.json({"err_code": 0, "data": job_info});
                                                              }
                                                          });
                                                      }else{
                                                          res.json({"err_code": 2, "err_msg": "Job Configuration is not found"});
                                                      }
                                                  }
                                                }
                                              });
                                          }else{
                                              res.json({"err_code": 2, "err_msg": "Job Configuration is not found"});
                                          }
                                      }else{
                                          res.json({"err_code": 1, "err_msg": job_config.error, "application": "Api Baciro Oozie", "function": "get_job_info"});
                                      }
                                  }
                              });
                          }
                        }
							}else{
		                result2.err_code = 500;
		                res.json(result2);
		            }
		        });
            }else{
                result.err_code = 500;
                res.json(result);
            }
        });
    }
}

function checkApikey(apikey, ipAddres, callback){
	//method, endpoint, params, options, callback
	ApiPhoenix.get('check_apikey', {"apikey": apikey}, {}, function (error, response, body) {
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
		  			x({"err_code": 0, "status": "root"});
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
					  			x({"err_code": 5, "err_msg": "User not active"});
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
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api Baciro Oozie", "function": "checkApikey"});
	  	}
	  }
	});
	function x(result){
		callback(result)
	}
}

function getUserByApikey(apikey, callback){
	//method, endpoint, params, options, callback
	ApiPhoenix.get('get_user_by_apikey', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
                var user_cluster_id = user.data[0].user_cluster_id;
                var user_id = user.data[0].user_id;
		  		x({"err_code": 0, "user_cluster_id":user_cluster_id, "user_id":user_id});
		  	}else{
		  		x({"err_code": 2, "err_msg": "Apikey failed", "application": "Api Baciro Oozie", "function": "getUserByApikey"});
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": inventory.error, "application": "Api Baciro Oozie", "function": "getInventoryId"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function generateWorkflow(jarName, jobName, className, argumenInput,argumenOutput,argumenOthers, queueName) {
  xw = new XMLWriter(true);

	//var jarName, jobName, className, argumenInputOutput ;

    var countInput = (argumenInput.match(/,/g) || []).length;
    var countOutput = (argumenOutput.match(/,/g) || []).length;
    if(argumenOthers !== undefined) {
      var countOthers = (argumenOthers.match(/,/g) || []).length;
    }
    var newArg = '';

      xw.startElement('workflow-app').writeAttribute('xmlns', 'uri:oozie:workflow:0.5').writeAttribute('name', jobName);
        xw.startElement('start').writeAttribute('to', 'hgrid');
        xw.endElement();
        xw.startElement('action').writeAttribute('name', 'hgrid');
          xw.startElement('java');
            xw.writeElement('job-tracker', '${jobTracker}');
            xw.writeElement('name-node', '${nameNode}');
            // xw.startElement('prepare');
            //   xw.startElement('delete').writeAttribute('path', "${nameNode}"+argumenOutput);
            //   xw.endElement();
            // xw.endElement();
            xw.startElement('configuration');
              xw.startElement('property');
                xw.writeElement('name', 'mapred.job.queue.name');
                xw.writeElement('value', queueName);
              xw.endElement();
            xw.endElement();
            xw.writeElement('main-class', className);

            //checking argument input
            if(argumenInput != ""){
              for(var i=0;i<=countInput;i++){
                  if(argumenInput.search(',') != -1){
                      newArg = argumenInput.substring(0, argumenInput.search(','));
                  }
                  else{
                      newArg = argumenInput;
                  }
                  argumenInput = argumenInput.substring(argumenInput.search(',')+1, argumenInput.length);
                  xw.writeElement('arg', "${nameNode}"+newArg);
              }
            }

            //checking argument output
            if(argumenOutput != ""){
              for(var i=0;i<=countOutput;i++){
                  if(argumenOutput.search(',') != -1){
                      newArg = argumenOutput.substring(0, argumenOutput.search(','));
                  }
                  else{
                      newArg = argumenOutput;
                  }
                  argumenOutput = argumenOutput.substring(argumenOutput.search(',')+1, argumenOutput.length);
                  xw.writeElement('arg', "${nameNode}"+newArg);
              }
						  // xw.writeElement('arg', "${nameNode}"+argumenOutput);
            }

            if(argumenOthers != "") {
              for(var i=0;i<=countOthers;i++){
                  if(argumenOthers.search(',') != -1){
                      newArg = argumenOthers.substring(0, argumenOthers.search(','));
                  }
                  else{
                      newArg = argumenOthers;
                  }
                  argumenOthers = argumenOthers.substring(argumenOthers.search(',')+1, argumenOthers.length);
                  xw.writeElement('arg', "${nameNode}"+newArg);
              }
            }
            xw.writeElement('file', "${nameNode}"+jarName);
            xw.startElement('capture-output');
            xw.endElement();
          xw.endElement();
          xw.startElement('ok').writeAttribute('to', 'end');
          xw.endElement();
          xw.startElement('error').writeAttribute('to', 'fail');
          xw.endElement();
        xw.endElement();
        xw.startElement('kill').writeAttribute('name', 'fail');
          xw.writeElement('message', 'Workflow failed, error message[${wf:errorMessage(wf:lastErrorNode())}]');
        xw.endElement();
        xw.startElement('end').writeAttribute('name', 'end');
        xw.endElement();
      xw.endElement();
      return xw;
}

function generateXml(usernameOozie, nameNode, /*examplesRoot,*/ jobTracker, queueName, useSystemLibpath, oozieLibpath, wfPath) {
  xw = new XMLWriter(true);

  xw.startDocument();
     xw.startElement('configuration');
       xw.startElement('property');
         xw.writeElement('name','user.name');
         xw.writeElement('value', usernameOozie);
       xw.endElement();
       xw.startElement('property');
         xw.writeElement('name','nameNode');
         xw.writeElement('value', nameNode);
       xw.endElement();
       xw.startElement('property');
         xw.writeElement('name','jobTracker');
         xw.writeElement('value',jobTracker);
       xw.endElement();
       xw.startElement('property');
         xw.writeElement('name','queueName');
         xw.writeElement('value', queueName);
       xw.endElement();
      //  xw.startElement('property');
      //    xw.writeElement('name','examplesRoot');
      //    xw.writeElement('value', examplesRoot);
      //  xw.endElement();
       xw.startElement('property');
         xw.writeElement('name','oozie.use.system.libpath');
         xw.writeElement('value', useSystemLibpath); //boolean
       xw.endElement();
       xw.startElement('property');
         xw.writeElement('name','oozie.libpath');
         xw.writeElement('value', oozieLibpath); //dibuat client input
       xw.endElement();
       xw.startElement('property');
         xw.writeElement('name','oozie.wf.application.path');
         xw.writeElement('value', wfPath);
       xw.endElement();

    xw.toString();
    return xw;
  }

function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return str;
}


//get method
app.get('/:apikey/get_job_id', Phoenix.getjobid);
app.get('/:apikey/get_job_info/:ooziejob_id', Oozie.get);
app.get('/:apikey/get_job_history/project/:project_id', Phoenix.getHistory);

//post
app.post('/:apikey/submit_job', Oozie.post);
app.post('/:apikey/generate_xml', Phoenix.getxml);//tapi methodnya post soalnya perlu input user

var server = app.listen(port, host, function () {
  console.log("Server running at http://%s:%s", host, port);
});
