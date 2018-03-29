var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var configYaml = yamlconfig.readConfig('../config/config.yml');

//event emitter
var host = configYaml.phoenix.host;
var port = configYaml.phoenix.port;

var phoenix = require("./phoenix.js");
var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");

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



var Phoenix = {
			get: {
				check_apikey: function checkApikey(req, res){
          var apikey = req.params.apikey;
          //query phoenix
          var query = "SELECT user_id, user_apikey, user_mac_address, user_is_active, user_ip_address, user_role_id FROM baciro.user WHERE user_apikey = '"+ apikey + "' ";
          
          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkApikey"});
          });
        },
        check_email: function checkEmail(req, res){
          var user_email = req.params.user_email;
          //query phoenix
          var query = "SELECT user_id, user_email FROM baciro.user WHERE user_email = '"+ user_email + "' ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkEmail"});
          });
        },
        check_group_name: function checkGroupName(req, res){
          //query phoenix
          var query = "SELECT group_id, group_name FROM baciro.groups ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkGroupName"});
          });
        },
        check_role_name: function checkRoleName(req, res){
          //query phoenix
          var query = "SELECT role_id, role_name FROM baciro.role ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkRoleName"});
          });
        },
        check_privilege_menu: function checkPrivilegeMenu(req, res){
          //query phoenix
          var query = "SELECT privilege_id, privilege_menu FROM baciro.privilege ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkPrivilegeMenu"});
          });
        },
        check_project_name: function checkProjectName(req, res){
          //query phoenix
          user_id = req.params.user_id
          var query = "SELECT project_id, project_name FROM baciro.project LEFT JOIN baciro.user ON user_id = project_user_id WHERE user_id = "+user_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkProjectName"});
          });
        },
        check_inventory_name: function checkInventoryName(req, res){
          //query phoenix
          var project_id = req.params.project_id
          var query = "SELECT inventory_id, inventory_name FROM baciro.inventory LEFT JOIN baciro.project ON project_id = project_inventory_id WHERE project_id = "+project_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkInventoryName"});
          });
        },
        check_cluster_name: function checkClusterName(req, res){
          //query phoenix
          var query = "SELECT cluster_id, cluster_name, cluster_status FROM baciro.cluster ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkClusterName"});
          });
        },
        check_config_key: function checkConfigKey(req, res){
          //query phoenix
          var cluster_id = req.params.cluster_id;
          var query = "SELECT config_id, config_key FROM baciro.config LEFT JOIN baciro.cluster ON config_cluster_id = cluster_id WHERE cluster_id = "+cluster_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkConfigKey"});
          });
        },
        check_user_id: function checkUserId(req, res){
          //query phoenix
          var user_id = req.params.user_id;
          var query = "SELECT user_id FROM baciro.user WHERE user_id = "+user_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkUserId"});
          });
        },
        check_group_id: function checkGroupId(req, res){
          //query phoenix
          var group_id = req.params.group_id;
          var query = "SELECT group_id FROM baciro.groups WHERE group_id = "+group_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkGroupId"});
          });
        },
        check_member_id: function checkMemberId(req, res){
          //query phoenix
          var member_id = req.params.member_id;
          var query = "SELECT member_id FROM baciro.member WHERE member_id = "+member_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkMemberId"});
          });
        },
        check_role_id: function checkRoleId(req, res){
          //query phoenix
          var role_id = req.params.role_id;
          var query = "SELECT role_id FROM baciro.role WHERE role_id = "+role_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkRoleId"});
          });
        },
        check_project_id: function checkProjectId(req, res){
          //query phoenix
          var project_id = req.params.project_id;
          var query = "SELECT project_id FROM baciro.project WHERE project_id = "+project_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkProjectId"});
          });
        },
        check_inventory_id: function checkInventoryId(req, res){
          //query phoenix
          var inventory_id = req.params.inventory_id;
          var query = "SELECT inventory_id FROM baciro.inventory WHERE inventory_id = "+inventory_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkInventoryId"});
          });
        },
        check_cluster_id: function checkClusterId(req, res){
          //query phoenix
          var cluster_id = req.params.cluster_id;
          var query = "SELECT cluster_id FROM baciro.cluster WHERE cluster_id = "+cluster_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkClusterId"});
          });
        },
        check_owner_group: function checkOwnerGroup(req, res){
          //query phoenix
          var group_id = req.params.group_id;
          var user_id = req.params.user_id;
          var query = "SELECT u.user_id FROM baciro.groups g LEFT JOIN baciro.user u ON u.user_id = g.group_user_id WHERE g.group_id = "+ group_id +"AND u.user_id = "+ user_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkOwnerGroup"});
          });
        },
        check_member_group: function checkMemberGroup(req, res){
          //query phoenix
          var group_id = req.params.group_id;
          var user_id = req.params.user_id;
          var query = "SELECT user_id FROM baciro.groups g LEFT JOIN baciro.member m ON m.group_id = g.group_id WHERE g.group_id = "+ group_id +"AND m.user_id = "+ user_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkOwnerGroup"});
          });
        },
        check_project_share: function checkProjectShare(req, res){
          //query phoenix
          var project_id = req.params.project_id;
          var user_id = req.params.user_id;
          var query = "SELECT project_id, project_user_id, project_group_id, project_is_share FROM baciro.project p LEFT JOIN baciro.groups g ON p.project_group_id = g.group_id LEFT JOIN baciro.member m ON m.group_id = g.group_id WHERE m.user_id = "+ user_id +" AND p.project_id = "+ project_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkMemberGroup"});
          });
        },
        get_user_id: function getUserId(req, res){
          //query phoenix
          var query = "SELECT user_id FROM baciro.user ORDER BY user_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getUserId"});
          });
        },
        get_group_id: function getGroupId(req, res){
          //query phoenix
          var query = "SELECT group_id FROM baciro.groups ORDER BY group_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getGroupId"});
          });
        },
        get_role_id: function getRoleId(req, res){
          //query phoenix
          var query = "SELECT role_id FROM baciro.role ORDER BY role_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getRoleId"});
          });
        },
        get_privilage_id: function getPrivilageId(req, res){
          //query phoenix
          var query = "SELECT privilege_id FROM baciro.privilege ORDER BY privilege_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPrivilageId"});
          });
        },
        get_project_id: function getProjectId(req, res){
          //query phoenix
          var query = "SELECT project_id FROM baciro.project ORDER BY project_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProjectId"});
          });
        },
        get_inventory_id: function getInventoryId(req, res){
          //query phoenix
          var query = "SELECT inventory_id FROM baciro.inventory ORDER BY inventory_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getInventoryId"});
          });
        },
        get_cluster_id: function getClusterId(req, res){
          //query phoenix
          var query = "SELECT cluster_id FROM baciro.cluster ORDER BY cluster_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getClusterId"});
          });
        },
        get_config_id: function getConfigId(req, res){
          //query phoenix
          var query = "SELECT config_id FROM baciro.config ORDER BY config_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getConfigId"});
          });
        },
        get_compile_id: function getCompileId(req, res){
          //query phoenix
          var query = "SELECT compile_id FROM baciro.compile ORDER BY compile_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCompileId"});
          });
        },
        get_user_by_apikey: function getUserByApikey(req, res){
          //query phoenix
          var apikey = req.params.apikey;
          var query = "SELECT * FROM baciro.user where user_apikey = '"+apikey+"' ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getInventoryId"});
          });
        },
        get_member_id: function getMemberId(req, res){
          //query phoenix
          var query = "SELECT member_id FROM baciro.member ORDER BY member_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getMemberId"});
          });
        },
        user: function getUser(req, res){
          var apikey = req.params.apikey;
					var user_id = req.params.user_id;

          if(typeof user_id !== 'undefined'){
            var query = "SELECT user_id, user_firstname, user_lastname, user_email, user_apikey, user_ip_address, user_create_date, user_update_date, user_is_active, user_cluster_id FROM baciro.user WHERE user_id = "+ user_id +" ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getUser"});
            });
          }else{
            var query = "SELECT user_id, user_firstname, user_lastname, user_email, user_apikey, user_ip_address, user_create_date, user_update_date, user_is_active, user_cluster_id FROM baciro.user ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
                res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getUser"});
            });
          }
				},
        group: function getGroup(req, res){
          var apikey = req.params.apikey;
          var group_id = req.params.group_id;

          if(typeof group_id !== 'undefined'){
            var query = "SELECT group_id, group_name, group_is_active, group_status, group_create_date, group_update_date FROM baciro.groups WHERE group_id = "+ group_id +" ";
            
            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
                res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getGroup"});
            });
          }else{
            var query = "SELECT group_id, group_name, group_is_active, group_status, group_create_date, group_update_date FROM baciro.groups";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
                res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGroup"});
            });
          }
        },
        groupByUser: function getGroupByUser(req, res){
          var apikey = req.params.apikey;
          var group_id = req.params.group_id;
          var user_id = req.params.user_id;

          if(typeof group_id !== 'undefined'){
            var query = "SELECT group_id, group_name, group_is_active, group_status, group_create_date, group_update_date FROM baciro.groups LEFT JOIN baciro.user ON user_id = group_user_id WHERE group_id = "+ group_id +" AND user_id ="+user_id;
          }else{
            var query = "SELECT group_id, group_name, group_is_active, group_status, group_create_date, group_update_date FROM baciro.groups LEFT JOIN baciro.user ON user_id = group_user_id WHERE user_id ="+user_id;
          }

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getGroup"});
          });
        },
        member: function getMember(req, res){
          var apikey = req.params.apikey;
          var group_id = req.params.group_id;

          var query = "SELECT member_id, group_name, u.user_id as user_id, user_firstname, user_lastname, user_email, member_status, member_status_request, member_role FROM baciro.member m LEFT JOIN baciro.groups g ON g.group_id = m.group_id LEFT JOIN baciro.user u ON u.user_id = m.user_id WHERE m.group_id = "+ group_id +" ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
            res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getMember"});
          });
        },
        role: function getRole(req, res){
          var apikey = req.params.apikey;
          var role_id = req.params.role_id;

          if(typeof role_id !== 'undefined'){
            var query = "SELECT role_id, role_name, role_create_date, role_update_date FROM baciro.role WHERE role_id = "+ role_id +" ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getRole"});
            });
          }else{
            var query = "SELECT role_id, role_name, role_create_date, role_update_date FROM baciro.role";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
                res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRole"});
            });
          }
        },
        projectByUser: function getProjectByUser(req, res){
          var apikey = req.params.apikey;
          var project_id = req.params.project_id;
          var user_id = req.params.user_id;

          if(typeof project_id !== 'undefined'){
            var query = "SELECT project_id, project_name, project_create_date, project_update_date, project_is_share, user_id  FROM baciro.project LEFT JOIN baciro.user ON project_user_id = user_id WHERE user_id = "+ user_id +" AND project_id = " + project_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProjectByUser"});
            });
          }else{
            var query = "SELECT project_id, project_name, project_create_date, project_update_date, project_is_share, user_id  FROM baciro.project LEFT JOIN baciro.user ON project_user_id = user_id WHERE user_id = "+ user_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
                res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProjectByUser"});
            });
          }
        },
        projectByGroup: function getProjectByGroup(req, res){
          var apikey = req.params.apikey;
          var project_id = req.params.project_id;
          var group_id = req.params.group_id;

          if(typeof project_id !== 'undefined'){
            var query = "SELECT project_id, project_name, project_create_date, project_update_date, project_is_share, group_id  FROM baciro.project LEFT JOIN baciro.groups ON project_group_id = group_id WHERE group_id = "+ group_id +" AND project_id = " + project_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProjectByGroup"});
            });
          }else{
            var query = "SELECT project_id, project_name, project_create_date, project_update_date, project_is_share, group_id  FROM baciro.project LEFT JOIN baciro.groups ON project_group_id = group_id WHERE group_id = "+ group_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
                res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getProjectByGroup"});
            });
          }
        },
        inventory: function getInventory(req, res){
          var apikey = req.params.apikey;
          var project_id = req.params.project_id;
          var inventory_id = req.params.inventory_id;

          if(typeof project_id !== 'undefined'){
            if(typeof inventory_id !== 'undefined'){
              var query = "SELECT project_id, project_name, inventory_id, inventory_name, inventory_path, inventory_type, inventory_create_date, inventory_update_date, inventory_package  FROM baciro.project LEFT JOIN baciro.inventory ON project_id = project_inventory_id WHERE inventory_id = "+ inventory_id +" AND project_id = " + project_id;

              db.query(query,function(dataJson){
                rez = lowercaseObject(dataJson);
                res.json({"err_code":0,"data":rez});
              },function(e){
                res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getInventory"});
              });
            }else{
              var query = "SELECT project_id, project_name, inventory_id, inventory_name, inventory_path, inventory_type, inventory_create_date, inventory_update_date, inventory_package  FROM baciro.project LEFT JOIN baciro.inventory ON project_id = project_inventory_id WHERE project_id = " + project_id + "ORDER BY project_id DESC";

              db.query(query,function(dataJson){
                rez = lowercaseObject(dataJson);
                res.json({"err_code":0,"data":rez});
              },function(e){
                res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getInventory"});
              });
            }
          }else{
            res.json({"err_code": 3, "err_msg":"No project selected", "application": "Api Phoenix", "function": "getInventory"});
          }
        },
        cluster: function getCluster(req, res){
          var apikey = req.params.apikey;
          var cluster_id = req.params.cluster_id;

          if(typeof cluster_id !== 'undefined'){
            var query = "SELECT cluster_id, cluster_name, cluster_status, cluster_create_date, cluster_update_date  FROM baciro.cluster WHERE cluster_id = "+ cluster_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCluster"});
            });
          }else{
            var query = "SELECT cluster_id, cluster_name, cluster_status, cluster_create_date, cluster_update_date  FROM baciro.cluster";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCluster"});
            });
          }
        },
        cluster_config: function getClusterConfig(req, res){
          var apikey = req.params.apikey;
          var cluster_id = req.params.cluster_id;
          var config_id = req.params.config_id;

          if(typeof cluster_id !== 'undefined'){
            if(typeof config_id !== 'undefined'){
              var query = "SELECT cluster_id, cluster_name, cluster_status, config_id, config_key, config_value, config_create_date, config_update_date  FROM baciro.cluster LEFT JOIN baciro.config ON cluster_id = config_cluster_id WHERE cluster_id = "+ cluster_id + " AND config_id = "+config_id;

            }else{
              var query = "SELECT cluster_id, cluster_name, cluster_status, config_id, config_key, config_value, config_create_date, config_update_date  FROM baciro.cluster LEFT JOIN baciro.config ON cluster_id = config_cluster_id WHERE cluster_id = "+ cluster_id;
            }

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getClusterConfig"});
            });
          }else{
            res.json({"err_code": 2, "err_msg":"Please select a cluster"});
          }
        },
        compile: function getCompile(req, res){
          var apikey = req.params.apikey;
          var compile_id = req.params.compile_id;

          if(typeof compile_id !== 'undefined'){
            var query = "SELECT compile_id, compile_name, compile_path, compile_type, compile_create_date, compile_update_date, compile_project_id, compile_inventory_id  FROM baciro.compile WHERE compile_id = "+ compile_id;

          }else{
            res.json({"err_code": 2, "err_msg":"compile id not found"})
          }

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
            res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCompile"});
          });
        },
        get_job_id_from_db: function getJobIDfromDb(req, res){
          //query phoenix
          var user_id = req.params.user_id;
          var query = "SELECT oozie_job_id FROM baciro.job WHERE user_id="+user_id;

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getJobIDfromDb"});
          });
        },
        get_project_job_history: function getProjectJobHistory(req,res){
          //query phoenix
          var project_id = req.params.project_id;
          var query = "SELECT OOZIE_JOB_ID as JOB_ID, JOB_NAME, JOB_STATUS, JOB_CREATE_DATE, JOB_UPDATE_DATE, JOB_WORKFLOW, JOB_PROJECT_ID as PROJECT_ID, USER_ID FROM BACIRO.JOB LEFT JOIN BACIRO.PROJECT ON JOB_PROJECT_ID = PROJECT_ID WHERE JOB_PROJECT_ID = " + project_id;
            
          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProjectJobHistory"});
          });
        },
        default_config: function getDefaultConfig(req, res){
          var query = "SELECT cluster_id, cluster_name, cluster_status, config_id, config_key, config_value, config_create_date, config_update_date  FROM baciro.cluster LEFT JOIN baciro.config ON cluster_id = config_cluster_id WHERE cluster_status = 'default' ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getDefaultConfig"});
            });
        },
        view_jar: function viewJar(req, res){
          var compile_id = req.params.compile_id;
          var project_id = req.params.project_id;

          if(typeof compile_id !== 'undefined'){
            var query = "SELECT project_id, project_name, compile_id, compile_name, compile_path, compile_type, compile_create_date, compile_update_date, compile_inventory_id  FROM baciro.compile LEFT JOIN baciro.project ON project_id = compile_project_id WHERE compile_id = "+ compile_id + " AND project_id = "+project_id;
          }else{
            var query = "SELECT project_id, project_name, compile_id, compile_name, compile_path, compile_type, compile_create_date, compile_update_date, compile_inventory_id  FROM baciro.compile LEFT JOIN baciro.project ON project_id = compile_project_id WHERE project_id = "+project_id;
          }

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
            res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "viewJar"});
          });
        },
        project_inventory_by_user: function projectInventoryByUser(req, res){
          var user_id = req.params.user_id;

          var query = "SELECT project_id, project_name, inventory_id, inventory_name, inventory_path, inventory_type, inventory_create_date, inventory_update_date, inventory_package  FROM baciro.project LEFT JOIN baciro.inventory ON project_id = project_inventory_id LEFT JOIN baciro.user on user_id = project_user_id WHERE user_id = " + user_id + " ORDER BY project_id DESC";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
            res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "viewJar"});
          });
        }
			},
      post:{
        user: function addUser(req, res){
          var user_id = req.body.user_id;
          var user_firstname = req.body.user_firstname;
          var user_lastname = req.body.user_lastname;
          var user_email = req.body.user_email;
          var user_apikey =  req.body.user_apikey;
          var user_create_date =  req.body.user_create_date;
          var user_password = req.body.user_password;
          var user_is_active = req.body.user_is_active;
          var user_ip_address = req.body.user_ip_address;

          var query = "UPSERT INTO baciro.user (user_id, user_firstname, user_lastname, user_email, user_apikey, user_create_date, user_password, user_is_active, user_ip_address) VALUES ("+ user_id +",'"+ user_firstname +"', '"+ user_lastname +"', '"+ user_email +"','"+ user_apikey +"', to_date('"+ user_create_date +"'), '"+ user_password +"', "+ user_is_active +", '"+ user_ip_address +"')";

          db.upsert(query,function(succes){
            var query = "SELECT user_id, user_firstname, user_lastname, user_email, user_apikey, user_ip_address, user_create_date, user_update_date, user_is_active, user_cluster_id FROM baciro.user WHERE user_id = "+ user_id +" ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addUser"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addUser"});
          });
        },
        group: function addGroup(req, res){
          var group_id = req.body.group_id;
          var group_name = req.body.group_name;
          var group_status = req.body.group_status;
          var group_is_active = req.body.group_is_active;
          var group_create_date = req.body.group_create_date;
          var group_user_id = req.body.group_user_id;

          var query = "UPSERT INTO baciro.groups (group_id, group_name, group_status, group_is_active, group_create_date, group_user_id) VALUES ("+ group_id +",'"+ group_name +"', "+ group_status +", "+ group_is_active +", to_date('"+ group_create_date +"'), "+ group_user_id + ")";

          db.upsert(query,function(succes){
            var query = "SELECT group_id, group_name, group_is_active, group_status, group_create_date, group_update_date FROM baciro.groups WHERE group_id = "+ group_id +" ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
                res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGroup"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGroup"});
          });
        },
        member: function addMember(req, res){
          var member_id = req.body.member_id;
          var group_id = req.body.group_id;
          var user_id = req.body.user_id;
          var member_status = req.body.member_status;
          var member_status_request = req.body.member_status_request;
          var member_create_date = req.body.member_create_date;
          var member_role = req.body.member_role;

          var query = "UPSERT INTO baciro.member (member_id, member_status, member_status_request, member_role, member_create_date, user_id, group_id) VALUES ("+ member_id +",'"+ member_status +"','"+ member_status_request +"', '"+ member_role + "',to_date('"+ member_create_date +"')" +", "+ user_id + "," + group_id + " )";

          db.upsert(query,function(succes){
            // rez = lowercaseObject(dataJson);
            var query = "SELECT member_id, group_name, u.user_id as user_id, user_firstname, user_lastname, user_email, member_status, member_status_request, member_role FROM baciro.member m LEFT JOIN baciro.groups g ON g.group_id = m.group_id LEFT JOIN baciro.user u ON u.user_id = m.user_id WHERE m.group_id = "+ group_id +" AND m.user_id = "+user_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMember"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMember"});
          });
        },
        role: function addRole(req, res){
          var role_id = req.body.role_id;
          var role_name = req.body.role_name;
          var role_create_date = req.body.role_create_date;

          var query = "UPSERT INTO baciro.role (role_id, role_name, role_create_date) VALUES ("+ role_id +",'"+ role_name +"', " + " to_date('"+ role_create_date +"') )";

          db.upsert(query,function(succes){
            var query = "SELECT role_id, role_name, role_create_date, role_update_date FROM baciro.role WHERE role_id = "+ role_id +" ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getRole"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRole"});
          });
        },
        privilege: function addPrivilege(req, res){
          var role_id = req.params.role_id;
          var privilege_id =  req.body.privilege_id;
          var privilege_menu = req.body.privilege_menu;
          var privilege_view = req.body.privilege_view;
          var privilege_create = req.body.privilege_create;
          var privilege_update = req.body.privilege_update;
          var privilege_delete = req.body.privilege_delete;
          var privilege_create_date = req.body.privilege_create_date;

          var query = "UPSERT INTO baciro.privilege (privilege_id, privilege_menu, privilege_view, privilege_create, privilege_update, privilege_delete, privilege_create_date, privilege_role_id) VALUES ("+ privilege_id +",'"+ privilege_menu +"', "+ privilege_view + ", "+ privilege_create +", " + privilege_update +", "+ privilege_delete +", " + " to_date('"+ privilege_create_date +"'), "+ role_id +" )";

          db.upsert(query,function(succes){
            // rez = lowercaseObject(dataJson);
            res.json({"err_code":0, "status": succes});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPrivilege"});
          });
        },
        project: function addProject(req, res){
          var project_id =  req.body.project_id;
          var project_name = req.body.project_name;
          var project_create_date = req.body.project_create_date;
          var project_user_id = req.params.user_id;

          var query = "UPSERT INTO baciro.project (project_id, project_name, project_create_date, project_user_id) VALUES ("+ project_id +",'"+ project_name +"', " + " to_date('"+ project_create_date +"'), "+ project_user_id +")";

          db.upsert(query,function(succes){
            var query = "SELECT project_id, project_name, project_create_date, project_update_date, project_is_share, user_id  FROM baciro.project LEFT JOIN baciro.user ON project_user_id = user_id WHERE user_id = "+ project_user_id +" AND project_id = " + project_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProjectByUser"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProject"});
          });
        },
        inventory: function addInventory(req, res){
          var project_id =  req.params.project_id;
          var inventory_id = req.body.inventory_id;
          var inventory_name = req.body.inventory_name;
          var inventory_type = req.body.inventory_type;
          var inventory_path = req.body.inventory_path;
          var inventory_package = req.body.inventory_package;
          var inventory_create_date = req.body.inventory_create_date;
          var inventory_update_date = req.body.inventory_update_date;

          if(inventory_update_date = 'null'){
            var query = "UPSERT INTO baciro.inventory (inventory_id, inventory_name, inventory_type, inventory_path, inventory_package, inventory_create_date, project_inventory_id) VALUES ("+ inventory_id +",'"+ inventory_name +"', " +"'"+ inventory_type +"', "+"'"+ inventory_path +"', " +"'"+ inventory_package +"', " + " to_date('"+ inventory_create_date +"'), "+ project_id +")";
          }else{
            var query = "UPSERT INTO baciro.inventory (inventory_id, inventory_name, inventory_type, inventory_path, inventory_package, inventory_create_date, inventory_update_date, project_inventory_id) VALUES ("+ inventory_id +",'"+ inventory_name +"', " +"'"+ inventory_type +"', "+"'"+ inventory_path +"', " +"'"+ inventory_package +"', " + " to_date('"+ inventory_create_date +"'), "+ " to_date('"+ inventory_update_date +"'), "+ project_id +")";

          }

          db.upsert(query,function(succes){
            var query = "SELECT project_id, project_name, inventory_id, inventory_name, inventory_path, inventory_type, inventory_create_date, inventory_update_date, inventory_package  FROM baciro.project LEFT JOIN baciro.inventory ON project_id = project_inventory_id WHERE inventory_id = "+ inventory_id +" AND project_id = " + project_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getInventory"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addInventory"});
          });
        },
        cluster: function addCluster(req, res){
          var cluster_id = req.body.cluster_id;
          var cluster_name = req.body.cluster_name;
          var cluster_status = req.body.cluster_status;
          var cluster_create_date = req.body.cluster_create_date;

          var query = "UPSERT INTO baciro.cluster (cluster_id, cluster_name, cluster_status, cluster_create_date) VALUES ("+ cluster_id +",'"+ cluster_name +"', " +"'"+ cluster_status +"', " + " to_date('"+ cluster_create_date +"'))";

          db.upsert(query,function(succes){
            var query = "SELECT cluster_id, cluster_name, cluster_status, cluster_create_date, cluster_update_date  FROM baciro.cluster WHERE cluster_id = "+ cluster_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCluster"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCluster"});
          });
        },
        cluster_config: function addClusterConfig(req, res){
          var cluster_id = req.params.cluster_id;
          var config_id = req.body.config_id;
          var config_key = req.body.config_key;
          var config_value = req.body.config_value;
          var config_create_date = req.body.config_create_date;

          var query = "UPSERT INTO baciro.config (config_id, config_key, config_value, config_create_date, config_cluster_id) VALUES ("+ config_id +",'"+ config_key +"', " +"'"+ config_value +"', " + " to_date('"+ config_create_date +"'), "+ cluster_id +")";

          db.upsert(query,function(succes){  
            var query = "SELECT cluster_id, cluster_name, config_id, config_key, config_value, config_create_date, config_update_date  FROM baciro.cluster LEFT JOIN baciro.config ON cluster_id = config_cluster_id WHERE cluster_id = "+ cluster_id + " AND config_id = "+config_id;
            
            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getClusterConfig"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClusterConfig"});
          });
        },
        login: function userLogin(req, res){
          var user_email = req.body.user_email;
          var user_password = req.body.user_password;

         var query = "SELECT user_id, user_firstname, user_lastname, user_email, user_apikey, user_ip_address, user_create_date, user_update_date, user_is_active, user_cluster_id, role_id, role_name FROM baciro.user LEFT JOIN baciro.role ON user_role_id = role_id WHERE user_email = '"+ user_email +"' AND user_password = '"+user_password+"' ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            res.json({"err_code":0,"data":rez});
          },function(e){
            res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getCluster"});
          });
        },
        compile: function addCompile(req, res){
          var compile_id = req.body.compile_id;
          var compile_name = req.body.compile_name;
          var compile_path = req.body.compile_path;
          var compile_type = req.body.compile_type;
          var compile_create_date = req.body.compile_create_date;
          var compile_project_id = req.body.compile_project_id;
          var compile_inventory_id = req.body.compile_inventory_id;

          //check berdasarkan project id and inventory id, apakah sudah pernah melakukan compile atau belum.
          var query = "SELECT compile_id FROM baciro.compile WHERE compile_project_id = "+ compile_project_id +" AND compile_inventory_id = "+ compile_inventory_id + " ORDER BY compile_id DESC LIMIT 1 ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            if(rez.length > 0){
              var query = "DELETE FROM baciro.compile WHERE compile_project_id = "+ compile_project_id +" AND compile_inventory_id = "+ compile_inventory_id;

              db.upsert(query,function(succes){
                var query2 = "UPSERT INTO baciro.compile (compile_id, compile_name, compile_path, compile_type, compile_create_date, compile_project_id, compile_inventory_id) VALUES ("+ compile_id +",'"+ compile_name +"', " +"'"+ compile_path +"', '"+ compile_type +"', to_date('"+ compile_create_date +"'), "+ compile_project_id +", "+ compile_inventory_id +") ";

                db.upsert(query2,function(succes){
                  // rez = lowercaseObject(dataJson);
                  res.json({"err_code":0, "status": succes});
                },function(e){
                    res.json({"err_code": 3, "err_msg":e, "application": "Api Phoenix", "function": "addCompile"});
                });
              },function(e){
                  res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCompile"});
              });
            }else{
              var query = "UPSERT INTO baciro.compile (compile_id, compile_name, compile_path, compile_type, compile_create_date, compile_project_id, compile_inventory_id) VALUES ("+ compile_id +",'"+ compile_name +"', " +"'"+ compile_path +"', '"+ compile_type +"', to_date('"+ compile_create_date +"'), "+ compile_project_id +", "+ compile_inventory_id +") ";

              db.upsert(query,function(succes){
                // rez = lowercaseObject(dataJson);
                res.json({"err_code":0, "status": succes});
              },function(e){
                  res.json({"err_code": 4, "err_msg":e, "application": "Api Phoenix", "function": "addCompile"});
              });
            }
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkApikey"});
          });
        },
        job: function addJobInfo(req, res){
            var oozie_job_id = req.body.oozie_job_id;
            var job_name = req.body.job_name;
            var job_actions = req.body.job_actions;
            var job_status = req.body.job_status;
            var job_project_id = req.body.job_project_id;
            var application_job_id = req.body.application_job_id;
            var job_create_date = req.body.job_create_date;
            var job_update_date = req.body.job_update_date;
            var user_id = req.body.user_id;
            var job_workflow = req.body.job_workflow;


            var query = "UPSERT INTO BACIRO.JOB (oozie_job_id, job_name,job_status, job_project_id, application_job_id, job_create_date, job_update_date, user_id, job_workflow)"+
              " VALUES ('"+oozie_job_id+"','"+job_name+"','"+job_status+"',"+job_project_id+","+application_job_id+
              ",to_date('"+job_create_date+"'),to_date('"+job_update_date+"'),"+user_id+",'"+job_workflow+"')";

              db.upsert(query, function(success){
                res.json({"err_code":0, "status": success});
              },function(e){
                res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addJobInfo"});
              });
        }
      },
      put:{
        user: function updateUser(req, res){
          var user_id = req.params.user_id;
          var user_firstname = req.body.user_firstname;
          var user_lastname = req.body.user_lastname;
          var user_email = req.body.user_email;
          var user_apikey =  req.body.user_apikey;
          var user_update_date =  req.body.user_update_date;
          var user_password = req.body.user_password;
          var user_is_active = req.body.user_is_active;
          var user_ip_address = req.body.user_ip_address;
          var user_is_active = req.body.user_is_active;
          var user_role_id = req.body.user_role_id;
          var user_cluster_id = req.body.user_cluster_id;

          //susun query update
          var column = "";
          var values = "";

          if(typeof user_firstname !== 'undefined'){
            column += 'user_firstname,';
            values += "'" +user_firstname +"',";
          }

          if(typeof user_lastname !== 'undefined'){
            column += 'user_lastname,';
            values += "'" +user_lastname +"',";
          }

          if(typeof user_email !== 'undefined'){
            column += 'user_email,';
            values += "'" +user_email +"',";
          }

          if(typeof user_password !== 'undefined'){
            column += 'user_password,';
            values += "'"+user_password + "',";
          }

          if(typeof user_is_active !== 'undefined'){
            column += 'user_is_active,';
            values += user_is_active + ",";
          }

          if(typeof user_ip_address !== 'undefined'){
            column += 'user_ip_address,';
            values += "user_ip_address||',"+ user_ip_address+"',";
          }

          if(typeof user_cluster_id !== 'undefined'){
            column += 'user_cluster_id,';
            values += user_cluster_id + ",";
          }

          if(typeof user_role_id !== 'undefined'){
            column += 'user_role_id,';
            values += user_role_id + ",";
          }

          //set update date
          column += 'user_update_date,';
          values += "to_date('"+ user_update_date + "'),";

          var query = "UPSERT INTO baciro.user(user_id," + column.slice(0, -1) + ") SELECT user_id, " + values.slice(0, -1) + " FROM baciro.user WHERE user_id = " + user_id;

          db.upsert(query,function(succes){
            var query = "SELECT user_id, user_firstname, user_lastname, user_email, user_apikey, user_ip_address, user_create_date, user_update_date, user_is_active, user_cluster_id FROM baciro.user WHERE user_id = "+ user_id +" ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addUser"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateUser"});
          });
        },
        group: function updateGroup(req, res){
          var group_id = req.params.group_id;
          var group_name = req.body.group_name;
          var group_is_active = req.body.group_is_active;
          var group_status = req.body.group_status;
          var group_update_date =  req.body.group_update_date;
          var group_user_id =  req.body.group_user_id;


          //susun query update
          var column = "";
          var values = "";

          if(typeof group_name !== 'undefined'){
            column += 'group_name,';
            values += "'" +group_name +"',";
          }

          if(typeof group_is_active !== 'undefined'){
            column += 'group_is_active,';
            values += group_is_active + ",";
          }

          if(typeof group_status !== 'undefined'){
            column += 'group_status,';
            values += group_status + ",";
          }

          if(typeof group_user_id !== 'undefined'){
            column += 'group_user_id,';
            values += group_user_id + ",";
          }

          //set update date
          column += 'group_update_date,';
          values += "to_date('"+ group_update_date + "'),";

          var query = "UPSERT INTO baciro.groups(group_id," + column.slice(0, -1) + ") SELECT group_id, " + values.slice(0, -1) + " FROM baciro.groups WHERE group_id = " + group_id;

          db.upsert(query,function(succes){
            var query = "SELECT group_id, group_name, group_is_active, group_status, group_create_date, group_update_date FROM baciro.groups WHERE group_id = "+ group_id +" ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
                res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateGroup"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGroup"});
          });

        },
        member: function updateMember(req, res){
          var member_id = req.params.member_id;
          var user_id = req.body.user_id;
          var group_id = req.body.group_id;
          var member_update_date = req.body.member_update_date;
          var member_status = req.body.member_status;
          var member_status_request = req.body.member_status_request;
          var member_role = req.body.member_role;

          //susun query update
          var query = "UPSERT INTO baciro.member(member_id, group_id, user_id, member_update_date, member_status, member_status_request, member_role) SELECT member_id, "+ group_id + "," + user_id + ", to_date('"+ member_update_date +"'), " + "'"+ member_status+ "', "+ "'"+ member_status_request+ "',"+ "'"+ member_role+ "'" +" FROM baciro.member WHERE member_id = " + member_id;

          db.upsert(query,function(succes){
            var query = "SELECT member_id, group_name, u.user_id as user_id, user_firstname, user_lastname, user_email, member_status, member_status_request, member_role FROM baciro.member m LEFT JOIN baciro.groups g ON g.group_id = m.group_id LEFT JOIN baciro.user u ON u.user_id = m.user_id WHERE m.member_id = "+ member_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMember"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "phoenix"});
          });
        },
        role: function updateRole(req, res){
          var role_id = req.params.role_id

          var role_name = req.body.role_name;
          var role_update_date = req.body.role_update_date;

          //susun query update
          var query = "UPSERT INTO baciro.role(role_id, role_name, role_update_date) SELECT role_id, '"+ role_name +"', to_date('"+ role_update_date +"') FROM baciro.role WHERE role_id = " + role_id;

          db.upsert(query,function(succes){
            var query = "SELECT role_id, role_name, role_create_date, role_update_date FROM baciro.role WHERE role_id = "+ role_id +" ";

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRole"});
            });
          },function(e){
              res.json({"err_code": 1, "application": "Api Phoenix", "function": "updateRole"});
          });
        },
        privilege: function updatePrivilege(req, res){
          var privilege_id = req.params.privilege_id;
          var privilege_menu = req.body.privilege_menu;
          var privilege_view = req.body.privilege_view;
          var privilege_create = req.body.privilege_create;
          var privilege_update = req.body.privilege_update;
          var privilege_delete = req.body.privilege_delete;
          var privilege_update_date = req.body.privilege_update_date;

          //susun query update
          var query = "UPSERT INTO baciro.privilege(privilege_id, privilege_menu, privilege_view, privilege_create, privilege_update, privilege_delete, privilege_update_date) SELECT privilege_id, '" + privilege_menu + "', " + privilege_view + ", " + privilege_create + ", " + privilege_update + ", " + privilege_delete + ", to_date('"+ privilege_update_date +"') FROM baciro.privilege WHERE privilege_id = " + privilege_id;

          db.upsert(query,function(succes){
            // rez = lowercaseObject(dataJson);
            res.json({"err_code":0, "status": succes});
          },function(e){
              res.json({"err_code": 1, "application": "Api Phoenix", "function": "updatePrivilege"});
          });
        },
        projectByUser: function updateProjectByUser(req, res){
          var project_id = req.params.project_id;
          var project_user_id = req.params.user_id;
          var project_name = req.body.project_name;
          var project_update_date = req.body.project_update_date;

          //susun query update
          var query = "UPSERT INTO baciro.project(project_id, project_name, project_update_date, project_user_id) SELECT project_id, '" + project_name + "', to_date('"+ project_update_date +"'), " + project_user_id + " FROM baciro.project WHERE project_id = " + project_id;

          db.upsert(query,function(succes){
            var query = "SELECT project_id, project_name, project_create_date, project_update_date, project_is_share, user_id  FROM baciro.project LEFT JOIN baciro.user ON project_user_id = user_id WHERE project_id = " + project_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProjectByUser"});
            });
          },function(e){
              res.json({"err_code": 1, "application": "Api Phoenix", "function": "updateProjectByUser"});
          });
        },
        projectShareGroup: function updateProjectShareGroup(req, res){
          var project_id = req.params.project_id;
          var project_group_id = req.params.group_id;
          var project_is_share = req.body.project_is_share;
          var project_update_date = req.body.project_update_date;

          //susun query update
          if(project_is_share == 'true'){
            var query = "UPSERT INTO baciro.project(project_id, project_is_share, project_update_date, project_group_id) SELECT project_id, " + project_is_share + ", to_date('"+ project_update_date +"'), " + project_group_id + " FROM baciro.project WHERE project_id = " + project_id;
          }else{
            project_group_id = null;
            var query = "UPSERT INTO baciro.project(project_id, project_is_share, project_update_date, project_group_id) SELECT project_id, " + project_is_share + ", to_date('"+ project_update_date +"'), " + project_group_id + " FROM baciro.project WHERE project_id = " + project_id;

          }

          db.upsert(query,function(succes){
              // rez = lowercaseObject(dataJson);
              res.json({"err_code":0, "status": succes});
            },function(e){
                res.json({"err_code": 1, "application": "Api Phoenix", "function": "updateProjectShareGroup"});
            });
        },
        cluster: function updateCluster(req, res){
          var cluster_id = req.params.cluster_id;
          var cluster_name = req.body.cluster_name;
          var cluster_status = req.body.cluster_status;
          var cluster_update_date = req.body.cluster_update_date;

          //susun query update

          var query = "UPSERT INTO baciro.cluster(cluster_id, cluster_name, cluster_status, cluster_update_date) SELECT cluster_id, '" + cluster_name + "', '" + cluster_status + "', to_date('"+ cluster_update_date +"') FROM baciro.cluster WHERE cluster_id = " + cluster_id;

          db.upsert(query,function(succes){
            var query = "SELECT cluster_id, cluster_name, cluster_status, cluster_create_date, cluster_update_date  FROM baciro.cluster WHERE cluster_id = "+ cluster_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCluster"});
            });
          },function(e){
              res.json({"err_code": 1, "application": "Api Phoenix", "function": "updateCluster"});
          });
        },
        cluster_config: function updateClusterConfig(req, res){
          var cluster_id = req.params.cluster_id;
          var config_id = req.params.config_id;
          var config_key = req.body.config_key;
          var config_value = req.body.config_value;
          var config_update_date = req.body.config_update_date;

          //susun query update
          var query = "UPSERT INTO baciro.config(config_id, config_key, config_value, config_update_date) SELECT config_id, '" + config_key + "', '" + config_value + "', to_date('"+ config_update_date +"') FROM baciro.config WHERE config_cluster_id = " + cluster_id + " AND config_id = " + config_id;

          db.upsert(query,function(succes){
            var query = "SELECT cluster_id, cluster_name, config_id, config_key, config_value, config_create_date, config_update_date  FROM baciro.cluster LEFT JOIN baciro.config ON cluster_id = config_cluster_id WHERE cluster_id = "+ cluster_id + " AND config_id = "+config_id;

            db.query(query,function(dataJson){
              rez = lowercaseObject(dataJson);
              res.json({"err_code":0,"data":rez});
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClusterConfig"});
            });
          },function(e){
              res.json({"err_code": 1, "application": "Api Phoenix", "function": "updateClusterConfig"});
          });
        },
        job: function updateJobStatus(req, res){
          var oozie_job_id = req.body.job_id;
          var job_status = req.body.job_status;
          var job_update_date = req.body.job_update_date;

          var query = "UPSERT INTO BACIRO.JOB (oozie_job_id, job_status, job_update_date) values ('"+oozie_job_id+"', '"+job_status+"', to_date('"+job_update_date+"'))";

          db.upsert(query, function(success){
            res.json({"err_code":0, "status": success});
          },function(e){
              res.json({"err_code": 1, "application": "Api Phoenix", "function": "updateJobStatus"});
          });
        },
        default_config: function updateDefaultConfig(req, res){
          var query = "SELECT cluster_id, cluster_status from baciro.cluster WHERE cluster_status = 'default' ";

          db.query(query,function(dataJson){
            rez = lowercaseObject(dataJson);
            var cluster_id = rez[0].cluster_id;
            var query2 = "UPSERT INTO baciro.cluster (cluster_id, cluster_status) VALUES ("+cluster_id+", 'active')";

            db.upsert(query2, function(success){
              res.json({"err_code":0, "status": success});
            },function(e){
                res.json({"err_code": 1, "application": "Api Phoenix", "function": "updateJobStatus"});
            });
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDefaultConfig"});
          });
        }
      },
      delete:{
        user: function deleteUser(req, res){
          var apikey = req.params.apikey;
          var user_id = req.params.user_id;

          if(typeof user_id !== 'undefined'){
            var query = "DELETE FROM baciro.user WHERE user_id = "+ user_id +" ";

            db.upsert(query,function(succes){
            res.json({"err_code":0, "status": succes});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "deleteUser"});
            });
          }else{
            res.json({"err_code": 1, "err_msg": "User id not found"});
          }
        },
        group: function deleteGroup(req, res){
          var apikey = req.params.apikey;
          var group_id = req.params.group_id;

          if(typeof group_id !== 'undefined'){
            //delete group dari tabel member
            var query1 = "DELETE FROM baciro.member WHERE group_id = "+ group_id +" ";;

            var query2 = "DELETE FROM baciro.groups WHERE group_id = "+ group_id +" ";

            db.upsert(query1,function(succes){
              db.upsert(query2,function(succes){
                res.json({"err_code":0, "status": succes});
              },function(e){
                res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "deleteGroup"});
              });
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "deleteGroup"});
            });
          }else{
            res.json({"err_code": 3, "err_msg": "User id not found"});
          }
        },
        member: function deleteMember(req, res){
          var member_id = req.params.member_id;
          //susun query update
          var query = "DELETE FROM baciro.member WHERE member_id = "+ member_id +" ";

          db.upsert(query,function(succes){
            // rez = lowercaseObject(dataJson);
            res.json({"err_code":0, "status": succes});
          },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "deleteMember"});
          });
        },
        role: function deleteRole(req, res){
          var apikey = req.params.apikey;
          var role_id = req.params.role_id;

          if(typeof role_id !== 'undefined'){
            //update pada tabel user sebagai member group set ke nol
            var query1 = "DELETE FROM baciro.privilege WHERE privilege_role_id = "+ role_id +" ";

            var query2 = "DELETE FROM baciro.role WHERE role_id = "+ role_id +" ";

            db.upsert(query1,function(succes){
              db.upsert(query2,function(succes){
                res.json({"err_code":0, "status": succes});
              },function(e){
                res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "deleteRole"});
              });
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "deleteRole"});
            });
          }else{
            res.json({"err_code": 3, "err_msg": "Role id not found"});
          }
        },
        project: function deleteProject(req, res){
          var apikey = req.params.apikey;
          var project_id = req.params.project_id;

          if(typeof project_id !== 'undefined'){
            //update pada tabel user sebagai member group set ke nol
            var query1 = "DELETE FROM baciro.project WHERE project_id = "+ project_id +" ";

            var query2 = "DELETE FROM baciro.inventory WHERE project_inventory_id = "+ project_id +" ";

            db.upsert(query1,function(succes){
              db.upsert(query2,function(succes){
                res.json({"err_code":0, "status": succes});
              },function(e){
                res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "deleteProject"});
              });
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "deleteProject"});
            });
          }else{
            res.json({"err_code": 3, "err_msg": "Project id not found"});
          }
        },
        inventory: function deleteInventory(req, res){
          var apikey = req.params.apikey;
          var inventory_id = req.params.inventory_id;

          if(typeof inventory_id !== 'undefined'){
            //update pada tabel user sebagai member group set ke nol
            var query2 = "DELETE FROM baciro.inventory WHERE inventory_id = "+ inventory_id +" ";

            db.upsert(query2,function(succes){
              res.json({"err_code":0, "status": succes});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "deleteProject"});
            });

          }else{
            res.json({"err_code": 3, "err_msg": "Inventory id not found"});
          }
        },
        cluster: function deleteCluster(req, res){
          var apikey = req.params.apikey;
          var cluster_id = req.params.cluster_id;

          if(typeof cluster_id !== 'undefined'){
            //update pada tabel user sebagai member group set ke nol
            var query1 = "DELETE FROM baciro.cluster WHERE cluster_id = "+ cluster_id;

            var query2 = "DELETE FROM baciro.config WHERE config_cluster_id = "+ cluster_id +" ";

            db.upsert(query1,function(succes){
              db.upsert(query2,function(succes){
                res.json({"err_code":0, "status": succes});
              },function(e){
                res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "deleteCluster"});
              });
            },function(e){
              res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "deleteCluster"});
            });
          }else{
            res.json({"err_code": 3, "err_msg": "Cluster id not found"});
          }
        },
        cluster_config: function deleteClusterConfig(req, res){
          var apikey = req.params.apikey;
          var cluster_id = req.params.cluster_id;
          var config_id = req.params.config_id;

          if(typeof cluster_id !== 'undefined'){
            if(typeof config_id !== 'undefined'){
              var query = "DELETE FROM baciro.config WHERE config_cluster_id = "+ cluster_id + " AND config_id = " +config_id;
            }else{
              var query = "DELETE FROM baciro.config WHERE config_cluster_id = "+ cluster_id;
            }

            db.upsert(query,function(succes){
              res.json({"err_code":0, "status": succes});
            },function(e){
              res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "deleteClusterConfig"});
            });

          }else{
            res.json({"err_code": 3, "err_msg": "Cluster id not found"});
          }
        }
      }
}

function lowercaseObject(jsonData){
  var rez = [];
  for(i=0; i < jsonData.length; i++){
    json = JSON.stringify(jsonData[i]);
    json2 = json.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
    rez[i] = JSON.parse(json2);
  }
  return rez;
}

function checkApikey(apikey){
  var query = "SELECT user_id FROM baciro.user WHERE user_apikey = '"+ apikey +"' ";

  db.query(query,function(dataJson){
    rez = lowercaseObject(dataJson);
    return rez;
  },function(e){
    return {"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkApikey"};
  });
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

//get method
app.get('/:apikey/check_apikey', Phoenix.get.check_apikey);
app.get('/:apikey/check_email/:user_email', Phoenix.get.check_email);
app.get('/:apikey/check_group_name', Phoenix.get.check_group_name);
app.get('/:apikey/check_role_name', Phoenix.get.check_role_name);
app.get('/:apikey/check_privilege_menu', Phoenix.get.check_privilege_menu);
app.get('/:apikey/check_project_name/:user_id', Phoenix.get.check_project_name);
app.get('/:apikey/check_inventory_name/:project_id', Phoenix.get.check_inventory_name);
app.get('/:apikey/check_cluster_name', Phoenix.get.check_cluster_name);
app.get('/:apikey/check_config_key/:cluster_id', Phoenix.get.check_config_key);
app.get('/:apikey/check_user_id/:user_id', Phoenix.get.check_user_id);
app.get('/:apikey/check_group_id/:group_id', Phoenix.get.check_group_id);
app.get('/:apikey/check_member_id/:member_id', Phoenix.get.check_member_id);
app.get('/:apikey/check_role_id/:role_id', Phoenix.get.check_role_id);
app.get('/:apikey/check_project_id/:project_id', Phoenix.get.check_project_id);
app.get('/:apikey/check_inventory_id/:inventory_id', Phoenix.get.check_inventory_id);
app.get('/:apikey/check_cluster_id/:cluster_id', Phoenix.get.check_cluster_id);
app.get('/:apikey/check_owner_group/:user_id/:group_id', Phoenix.get.check_owner_group);
app.get('/:apikey/check_member_group/:user_id/:group_id', Phoenix.get.check_member_group);
app.get('/:apikey/check_project_share/:project_id/:user_id', Phoenix.get.check_project_share);
app.get('/:apikey/get_user_id', Phoenix.get.get_user_id);
app.get('/:apikey/get_group_id', Phoenix.get.get_group_id);
app.get('/:apikey/get_role_id', Phoenix.get.get_role_id);
app.get('/:apikey/get_privilage_id', Phoenix.get.get_privilage_id);
app.get('/:apikey/get_member_id', Phoenix.get.get_member_id);
app.get('/:apikey/get_project_id', Phoenix.get.get_project_id);
app.get('/:apikey/get_inventory_id', Phoenix.get.get_inventory_id);
app.get('/:apikey/get_cluster_id', Phoenix.get.get_cluster_id);
app.get('/:apikey/get_config_id', Phoenix.get.get_config_id);
app.get('/:apikey/get_compile_id', Phoenix.get.get_compile_id);
app.get('/:apikey/get_user_by_apikey', Phoenix.get.get_user_by_apikey);
app.get('/:apikey/user/:user_id?', Phoenix.get.user);
app.get('/:apikey/group/:group_id?', Phoenix.get.group);
app.get('/:apikey/group/:group_id?/user/:user_id', Phoenix.get.groupByUser);
app.get('/:apikey/member/:group_id', Phoenix.get.member);
app.get('/:apikey/role/:role_id?', Phoenix.get.role);
app.get('/:apikey/project/:project_id?/user/:user_id', Phoenix.get.projectByUser);
app.get('/:apikey/project/:project_id?/group/:group_id', Phoenix.get.projectByGroup);
app.get('/:apikey/project/:project_id?/inventory/:inventory_id?', Phoenix.get.inventory);
app.get('/:apikey/cluster/:cluster_id?', Phoenix.get.cluster);
app.get('/:apikey/cluster/:cluster_id?/config/:config_id?', Phoenix.get.cluster_config);
app.get('/:apikey/compile/:compile_id?', Phoenix.get.compile);
app.get('/:apikey/default_config', Phoenix.get.default_config);
app.get('/:apikey/view_jar/:compile_id?/project/:project_id?', Phoenix.get.view_jar);
app.get('/:apikey/project_inventory_by_user/:user_id?', Phoenix.get.project_inventory_by_user);

//for job http request
app.get('/:apikey/get_job_id_from_db/:user_id', Phoenix.get.get_job_id_from_db);
app.get('/:apikey/get_project_job_history/project/:project_id', Phoenix.get.get_project_job_history);

//post method
app.post('/:apikey/user', Phoenix.post.user);
app.post('/:apikey/group', Phoenix.post.group);
app.post('/:apikey/member', Phoenix.post.member);
app.post('/:apikey/role', Phoenix.post.role);
app.post('/:apikey/privilege/:role_id', Phoenix.post.privilege);
app.post('/:apikey/project/user/:user_id', Phoenix.post.project);
app.post('/:apikey/project/:project_id/inventory', Phoenix.post.inventory);
app.post('/:apikey/cluster', Phoenix.post.cluster);
app.post('/:apikey/cluster/:cluster_id/config', Phoenix.post.cluster_config);
app.post('/:apikey/login', Phoenix.post.login);
app.post('/:apikey/compile', Phoenix.post.compile);
app.post('/:apikey/job', Phoenix.post.job);

//put method
app.put('/:apikey/user/:user_id?', Phoenix.put.user);
app.put('/:apikey/group/:group_id?', Phoenix.put.group);
app.put('/:apikey/member/:member_id?', Phoenix.put.member);
app.put('/:apikey/role/:role_id?', Phoenix.put.role);
app.put('/:apikey/privilege/:privilege_id?', Phoenix.put.privilege);
app.put('/:apikey/project/:project_id?/user/:user_id', Phoenix.put.projectByUser);
app.put('/:apikey/project/:project_id?/share/:group_id', Phoenix.put.projectShareGroup);
app.put('/:apikey/cluster/:cluster_id?', Phoenix.put.cluster);
app.put('/:apikey/cluster/:cluster_id?/config/:config_id', Phoenix.put.cluster_config);
app.put('/:apikey/job/:oozie_job_id', Phoenix.put.job);
app.put('/:apikey/default_config', Phoenix.put.default_config);

//delete method
app.delete('/:apikey/user/:user_id?', Phoenix.delete.user);
app.delete('/:apikey/group/:group_id?', Phoenix.delete.group);
app.delete('/:apikey/member/:member_id?', Phoenix.delete.member);
app.delete('/:apikey/role/:role_id?', Phoenix.delete.role);
app.delete('/:apikey/project/:project_id?', Phoenix.delete.project);
app.delete('/:apikey/inventory/:inventory_id?', Phoenix.delete.inventory);
app.delete('/:apikey/cluster/:cluster_id?', Phoenix.delete.cluster);
app.delete('/:apikey/cluster/:cluster_id?/config/:config_id?', Phoenix.delete.cluster_config);


//fhir247
//import patient_registers module
var DefaultFHIR = require("./default_fhir/controller");
var Person = require("./patient_registers/person/controller");
var Patient = require("./patient_registers/patient/controller");
var RelatedPerson = require("./patient_registers/related_person/controller");
var Group = require("./patient_registers/group/controller");

//import routes
var routesDefaultFHIR    = require('./default_fhir/routes');  
var routesPerson    = require('./patient_registers/person/routes');  
var routesPatient    = require('./patient_registers/patient/routes');  
var routesRelatedPerson    = require('./patient_registers/related_person/routes');  
var routesGroup    = require('./patient_registers/group/routes');  

//setrouting
routesDefaultFHIR(app, DefaultFHIR);
routesPerson(app, Person);
routesPatient(app, Patient);
routesRelatedPerson(app, RelatedPerson);
routesGroup(app, Group);
//end fhir247

var server = app.listen(port, host, function () {
  console.log("Server running at http://%s:%s", host, port);
})
