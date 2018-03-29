function phoenix(host, username, password, javaoptions) {
  if (!host || typeof(host) != "string") {
    
    //throw "require phoenix url string like : jdbc:phoenix:192.168.1.231";
    
    throw "require phoenix host string like : jdbc:phoenix:127.0.0.1 ";
    return;
  }
  function db2Json(data) {
    var array = [];
    var head = data[0].split("\t");
    var body;
    for (var i = 1; i < data.length; i++) {
        var obj = {};
        body = data[i].split("\t");
        for (var j = 0; j < head.length; j++) {
            obj[head[j]] = body[j]
        }
        array.push(obj);
    }
    return array;
  }

  var java = require("java");
  javaoptions && javaoptions.forEach(function (option) {
    java.options.push(option);
  })
  
  java.classpath.push(__dirname + "/lib/druid-1.0.6.jar");
  java.classpath.push(__dirname + "/lib/phoenix-4.0.0-incubating-client.jar");
  java.classpath.push(__dirname + "/lib/PhoenixClient.jar");
  
  var db = java.newInstanceSync("com.mlsc.DBClient");
  java.callMethodSync(db, "init", host, username, password);
  
  this.query = function (sql,success,error) {
      try{
          success && success(db2Json(java.callMethodSync(db, "query", sql)));
      }catch(e){
          error && error(e);
      }
  }

  this.upsert = function (sql,success,error) {
      try{
          var result = java.callMethodSync(db, "upsert", sql);
          result && success && success();
          !result && error && error();
      }catch(e){
          error && error(e);
      }
  }
  this.upsertMuti = function (sqls,success,error) {
      if(!sqls instanceof Array || sqls.length == 0)
          return;
      var sqlArray = java.newArray("java.lang.String", sqls);
      try{
          var result = java.callMethodSync(db, "upsertMuti", sqlArray);
          result && success && success();
          !result && error && error();
      }catch(e){
          error && error(e);
      }
  }
}
module.exports = phoenix;