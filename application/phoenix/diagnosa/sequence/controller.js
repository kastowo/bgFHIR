var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//event emitter
var host = configYaml.phoenix.host;
var port = configYaml.phoenix.port;
var hostFHIR = configYaml.fhir.host;
var portFHIR = configYaml.fhir.port;
var hostHbase = configYaml.hbase.host;

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
var db = new phoenix("jdbc:phoenix:" + hostHbase + ":/hbase-unsecure");

var controller = {
	get: {
		sequence: function getSequence(req, res){
			var apikey = req.params.apikey;
			var sequenceId = req.query._id;
			
			/*var based_on = req.query.based_on;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var diagnosis = req.query.diagnosis;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var image = req.query.image;
			var issued = req.query.issued;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var result = req.query.result;
			var specimen = req.query.specimen;
			var status = req.query.status;
			var subject = req.query.subject;
			
			
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof sequenceId !== 'undefined' && sequenceId !== ""){
        condition += "dr.diagnostic_report_id = '" + sequenceId + "' AND,";  
      }
			
			if((typeof based_on !== 'undefined' && based_on !== "")){ 
			 var res = based_on.substring(0, 3);
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.CAREPLAN cap ON dr.diagnostic_report_id = cap.diagnostic_report_id ";
          condition += "CAREPLAN_ID = '" + based_on + "' AND ";       
				} 
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.immunization_recommendation ir ON dr.diagnostic_report_id = ir.diagnostic_report_id ";
          condition += "immunization_recommendation_id = '" + based_on + "' AND ";       
				}
				
				if(res == 'mer'){
					join += " LEFT JOIN BACIRO_FHIR.MEDICATION_REQUEST mr ON dr.diagnostic_report_id = mr.diagnostic_report_id ";
          condition += "MEDICATION_REQUEST_ID = '" + based_on + "' AND ";       
				}
				
				if(res == 'pre') {
					join += " LEFT JOIN BACIRO_FHIR.PROCEDURE_REQUEST pr ON dr.diagnostic_report_id = pr.diagnostic_report_id ";
          condition += "PROCEDURE_REQUEST_id = '" + based_on + "' AND ";       
				}
				
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.REFERRAL_REQUEST rr ON dr.diagnostic_report_id = rr.diagnostic_report_id ";
          condition += "REFERRAL_REQUEST_ID = '" + based_on + "' AND ";       
				} 
				
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.Nutrition_Order  no ON dr.diagnostic_report_id = no.diagnostic_report_id ";
          condition += "Nutrition_Order_id = '" + based_on + "' AND ";       
				}
      }
			
			if(typeof category !== 'undefined' && category !== ""){
				condition += "dr.category = '" + category + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "dr.CODE = '" + code + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(dr.CONTEXT_ENCOUNTER = '" + context + "' OR dr.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "dr.effective_period_start <= to_date('" + date + "', 'yyyy-MM-dd') AND dr.effective_period_end >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof diagnosis !== 'undefined' && diagnosis !== ""){
				condition += "dr.coded_diagnosis = '" + diagnosis + "' AND,";  
      }
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
			  condition += "dr.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if((typeof image !== 'undefined' && image !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Media me ON me.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "me.media_id = '" + image + "' AND ";
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
			  condition += "dr.subject_patient = '" + patient + "' AND,";  
      }
			
			if(typeof issued !== 'undefined' && issued !== ""){
			  condition += "dr.issued == to_date('" + issued + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof performer !== 'undefined' && performer !== ""){
				join += " LEFT JOIN BACIRO_FHIR.diagnostic_report_performer drp ON drp.diagnostic_report_id = dr.diagnostic_report_id ";
				condition += "(drp.actor_practitioner = '" + performer + "' OR drp.actor_organization = '" + performer + "') AND,";  
			}
			
			if((typeof result !== 'undefined' && result !== "")){
        join += " LEFT JOIN BACIRO_FHIR.observation obs ON obs.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "obs.observation_id = '" + result + "' AND ";
      }
			
			if((typeof specimen !== 'undefined' && specimen !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Specimen spe ON spe.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "spe.specimen_id = '" + specimen + "' AND ";
      }
			if(typeof status !== 'undefined' && status !== ""){
				condition += "dr.status = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(dr.SUBJECT_PATIENT = '" + subject + "' OR dr.SUBJECT_GROUP = '" + subject + "' OR dr.subject_device = '" + subject + "' OR dr.subject_location = '" + subject + "') AND,";  
			}*/
			
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			
      var arrSequence = [];
      var query = "select seq.sequence_id as sequence_id, seq.type as type, seq.coordinate_system as coordinate_system, seq.patient as patient, seq.specimen as specimen, seq.device as device, seq.performer as performer, seq.quantity as quantity, seq.reference_seq_chromosome as reference_seq_chromosome, seq.reference_seq_genome_build as reference_seq_genome_build, seq.reference_seq_reference_seq_id as reference_seq_reference_seq_id, seq.reference_seq_pointer as reference_seq_pointer, seq.reference_seq_string as reference_seq_string, seq.reference_seq_strand as reference_seq_strand, seq.reference_seq_window_start as reference_seq_window_start, seq.reference_seq_window_end as reference_seq_window_end, seq.observed_seq as observed_seq, seq.read_coverage as read_coverage from BACIRO_FHIR.sequences seq " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Sequence = {};
					Sequence.resourceType = "Sequence";
          Sequence.id = rez[i].sequence_id;
					Sequence.type = rez[i].type;
					Sequence.coordinateSystem = rez[i].coordinate_system;
					Sequence.code = rez[i].code;
					if (rez[i].patient !== 'null') {
						Sequence.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						Sequence.patient = "";
					}
					if (rez[i].specimen !== 'null') {
						Sequence.specimen = hostFHIR + ':' + portFHIR + '/' + apikey + '/Specimen?_id=' +  rez[i].specimen;
					} else {
						Sequence.specimen = "";
					}
					if (rez[i].device !== 'null') {
						Sequence.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].device;
					} else {
						Sequence.device = "";
					}
					if (rez[i].performer !== 'null') {
						Sequence.performer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].performer;
					} else {
						Sequence.performer = "";
					}
					Sequence.quantity = rez[i].quantity;
					Sequence.referenceSeq.chromosome = rez[i].reference_seq_chromosome;
					Sequence.referenceSeq.genomeBuild = rez[i].reference_seq_genome_build;
					Sequence.referenceSeq.referenceSeqId = rez[i].reference_seq_reference_seq_id;
					Sequence.referenceSeq.referenceSeqString	 = rez[i].reference_seq_string;
					if (rez[i].reference_seq_pointer !== 'null') {
						Sequence.referenceSeq.referenceSeqPointer	 = hostFHIR + ':' + portFHIR + '/' + apikey + '/Sequence?_id=' +  rez[i].reference_seq_pointer;
					} else {
						Sequence.referenceSeq.referenceSeqPointer	 = "";
					}
					Sequence.referenceSeq.strand	 = rez[i].reference_seq_strand;
					Sequence.referenceSeq.windowStart	 = rez[i].reference_seq_window_start;
					Sequence.referenceSeq.windowEnd	 = rez[i].reference_seq_window_end;				
					Sequence.observedSeq = rez[i].observed_seq;
					Sequence.readCoverage = rez[i].read_coverage;
					
          arrSequence[i] = Sequence;
        }
        res.json({"err_code":0,"data": arrSequence});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSequence"});
      });
    },
		sequenceRepository: function getSequenceRepository(req, res) {
			var apikey = req.params.apikey;
			
			var sequenceRepositoryId = req.query._id;
			var sequenceId = req.query.sequence_id;

			//susun query
			var condition = "";

			if (typeof sequenceRepositoryId !== 'undefined' && sequenceRepositoryId !== "") {
				condition += "repository_id = '" + sequenceRepositoryId + "' AND ";
			}

			if (typeof sequenceId !== 'undefined' && sequenceId !== "") {
				condition += "sequence_id = '" + sequenceId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrSequenceRepository = [];
			var query = "select repository_id, type, url, name, dataset_id, varianset_id, readset_id from BACIRO_FHIR.sequence_repository " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var SequenceRepository = {};
					SequenceRepository.id = rez[i].repository_id;
					SequenceRepository.type = rez[i].type;
					SequenceRepository.url = rez[i].url;
					SequenceRepository.name = rez[i].name;
					SequenceRepository.datasetId = rez[i].dataset_id;
					SequenceRepository.variansetId = rez[i].varianset_id;
					SequenceRepository.readsetId = rez[i].readset_id;
					
					arrSequenceRepository[i] = SequenceRepository;
				}
				res.json({
					"err_code": 0,
					"data": arrSequenceRepository
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSequenceRepository"
				});
			});
		},
		sequenceVariant: function getSequenceVariant(req, res) {
			var apikey = req.params.apikey;
			
			var sequenceVariantId = req.query._id;
			var sequenceId = req.query.diagnostic_report_id;

			//susun query
			var condition = "";

			if (typeof sequenceVariantId !== 'undefined' && sequenceVariantId !== "") {
				condition += 'variant_id = "' + sequenceVariantId + '" AND ';
			}

			if (typeof sequenceId !== 'undefined' && sequenceId !== "") {
				condition += 'sequence_id = "' + sequenceId + '" AND ';
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrSequenceVariant = [];
			var query = 'variant_id, "start" as start, "end" as end, observed_allele, reference_allele, cigar, variant_pointer from baciro_fhir.DIAGNOSTIC_REPORT_IMAGE ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var SequenceVariant = {};
					SequenceVariant.id = rez[i].variant_id;
					SequenceVariant.start = rez[i].start;
					SequenceVariant.end = rez[i].end;
					SequenceVariant.observedAllele = rez[i].observed_allele;
					SequenceVariant.referenceAllele = rez[i].reference_allele;
					SequenceVariant.cigar = rez[i].cigar;
					if (rez[i].variant_pointer !== 'null') {
						SequenceVariant.variantPointer  = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +  rez[i].variant_pointer;
					} else {
						SequenceVariant.variantPointer  = "";
					}
					
					arrSequenceVariant[i] = SequenceVariant;
				}
				res.json({
					"err_code": 0,
					"data": arrSequenceVariant
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSequenceVariant"
				});
			});
		},
		sequenceQuality: function getSequenceQuality(req, res) {
			var apikey = req.params.apikey;
			
			var sequenceQualityId = req.query._id;
			var sequenceId = req.query.diagnostic_report_id;

			//susun query
			var condition = "";

			if (typeof sequenceQualityId !== 'undefined' && sequenceQualityId !== "") {
				condition += 'quality_id = "' + sequenceQualityId + '" AND ';
			}

			if (typeof sequenceId !== 'undefined' && sequenceId !== "") {
				condition += 'sequence_id = "' + sequenceId + '" AND ';
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrSequenceQuality = [];
			var query = 'quality_id, type, standard_sequence, "start" as start, "end" as end, score, method, truth_tp, query_tp, truth_fn, query_fp, gt_fp, precision, recall, f_score from baciro_fhir.sequence_quality ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var SequenceQuality = {};
					SequenceQuality.id = rez[i].variant_id;
					SequenceQuality.type = rez[i].type;
					SequenceQuality.standardSequence = rez[i].standard_sequence;
					SequenceQuality.start = rez[i].start;
					SequenceQuality.end = rez[i].end;
					SequenceQuality.score = rez[i].score;
					SequenceQuality.method = rez[i].method;
					SequenceQuality.truthTp = rez[i].truth_tp;
					SequenceQuality.queryTp = rez[i].query_tp;
					SequenceQuality.truthFn = rez[i].truth_fn;
					SequenceQuality.queryFp = rez[i].query_fp;
					SequenceQuality.gtFp = rez[i].gt_fp;
					SequenceQuality.precision = rez[i].precision;
					SequenceQuality.recall = rez[i].recall;
					SequenceQuality.fScore = rez[i].f_score;
					
					arrSequenceQuality[i] = SequenceQuality;
				}
				res.json({
					"err_code": 0,
					"data": arrSequenceQuality
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSequenceQuality"
				});
			});
		},
  },
	post: {
		sequence: function addSequence(req, res) {
			console.log(req.body);
			var sequence_id  = req.body.sequence_id;
			var type  = req.body.type;
			var coordinate_system  = req.body.coordinate_system;
			var patient  = req.body.patient;
			var specimen  = req.body.specimen;
			var device  = req.body.device;
			var performer  = req.body.performer;
			var quantity  = req.body.quantity;
			var reference_seq_chromosome  = req.body.reference_seq_chromosome;
			var reference_seq_genome_bui  = req.body.reference_seq_genome_bui;
			var reference_seq_reference_seq_id  = req.body.reference_seq_reference_seq_id;
			var reference_seq_pointer  = req.body.reference_seq_pointer;
			var reference_seq_string  = req.body.reference_seq_string;
			var reference_seq_strand  = req.body.reference_seq_strand;
			var reference_seq_window_start  = req.body.reference_seq_window_start;
			var reference_seq_window_end  = req.body.reference_seq_window_end;
			var observed_seq  = req.body.observed_seq;
			var read_coverage  = req.body.read_coverage;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof coordinate_system !== 'undefined' && coordinate_system !== "") {
        column += 'coordinate_system,';
        values += "'" + coordinate_system + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof specimen !== 'undefined' && specimen !== "") {
        column += 'specimen,';
        values += "'" + specimen + "',";
      }	
			
			if (typeof device !== 'undefined' && device !== "") {
        column += 'device,';
        values += "'" + device + "',";
      }		
			
			if (typeof performer !== 'undefined' && performer !== "") {
        column += 'performer,';
        values += "'" + performer + "',";
      }	
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += "'" + quantity + "',";
      }		
			
			if (typeof reference_seq_chromosome !== 'undefined' && reference_seq_chromosome !== "") {
        column += 'reference_seq_chromosome,';
        values += "'" + reference_seq_chromosome + "',";
      }	
			
			if (typeof reference_seq_genome_bui !== 'undefined' && reference_seq_genome_bui !== "") {
        column += 'reference_seq_genome_bui,';
        values += "'" + reference_seq_genome_bui + "',";
      }
			
			if (typeof reference_seq_reference_seq_id !== 'undefined' && reference_seq_reference_seq_id !== "") {
        column += 'reference_seq_reference_seq_id,';
        values += "'" + reference_seq_reference_seq_id + "',";
      }		
			
			if (typeof reference_seq_pointer !== 'undefined' && reference_seq_pointer !== "") {
        column += 'reference_seq_pointer,';
        values += "'" + reference_seq_pointer + "',";
      }		
			
			if (typeof reference_seq_string !== 'undefined' && reference_seq_string !== "") {
        column += 'reference_seq_string,';
        values += "'" + reference_seq_string + "',";
      }		
			
			if (typeof reference_seq_strand !== 'undefined' && reference_seq_strand !== "") {
        column += 'reference_seq_strand,';
        values += " " + reference_seq_strand + ",";
      }
			
			if (typeof reference_seq_window_start !== 'undefined' && reference_seq_window_start !== "") {
        column += 'reference_seq_window_start,';
        values += " " + reference_seq_window_start + ",";
      }
			
			if (typeof reference_seq_window_end !== 'undefined' && reference_seq_window_end !== "") {
        column += 'reference_seq_window_end,';
        values += " " + reference_seq_window_end + ",";
      }
			
			if (typeof observed_seq !== 'undefined' && observed_seq !== "") {
        column += 'observed_seq,';
        values += "'" + observed_seq + "',";
      }	
			
			if (typeof read_coverage !== 'undefined' && read_coverage !== "") {
        column += 'read_coverage,';
        values += " " + read_coverage + ",";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.sequences(sequence_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+sequence_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sequence_id from BACIRO_FHIR.sequences WHERE sequence_id = '" + sequence_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSequence"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSequence"});
      });
    },
		sequenceRepository: function addSequenceRepository(req, res) {
			console.log(req.body);
			
			var repository_id  = req.body.repository_id;
			var type  = req.body.type;
			var url  = req.body.url;
			var name  = req.body.name;
			var dataset_id  = req.body.dataset_id;
			var varianset_id  = req.body.varianset_id;
			var readset_id  = req.body.readset_id;
			var sequence_id  = req.body.sequence_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof url !== 'undefined' && url !== "") {
        column += 'url,';
        values += "'" + url + "',";
      }
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }
			
			if (typeof dataset_id !== 'undefined' && dataset_id !== "") {
        column += 'dataset_id,';
        values += "'" + dataset_id + "',";
      }	
			
			if (typeof varianset_id !== 'undefined' && varianset_id !== "") {
        column += 'varianset_id,';
        values += "'" + varianset_id + "',";
      }
			
			if (typeof readset_id !== 'undefined' && readset_id !== "") {
        column += 'readset_id,';
        values += "'" + readset_id + "',";
      }
			
			if (typeof sequence_id !== 'undefined' && sequence_id !== "") {
        column += 'sequence_id,';
        values += "'" + sequence_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.sequence_repository(repository_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+repository_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select repository_id from BACIRO_FHIR.sequence_repository WHERE repository_id = '" + repository_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceRepository"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceRepository"});
      });
    },
		sequenceVariant: function addSequenceVariant(req, res) {
			var console.log(req.body);
			var variant_id   = req.body.variant_id;
			var start   = req.body.start;
			var end   = req.body.end;
			var observed_allele   = req.body.observed_allele;
			var reference_allele   = req.body.reference_allele;
			var cigar   = req.body.cigar;
			var variant_pointer   = req.body.variant_pointer;
			var sequence_id   = req.body.sequence_id;
			var column = "";
      var values = "";
			
			if (typeof reference_allele !== 'undefined' && reference_allele !== "") {
        column += 'reference_allele,';
        values += '"' + reference_allele + '",';
      }
			
			if (typeof cigar !== 'undefined' && cigar !== "") {
        column += 'cigar,';
        values += '"' + cigar + '",';
      }
			
			if (typeof variant_pointer !== 'undefined' && variant_pointer !== "") {
        column += 'variant_pointer,';
        values += '"' + variant_pointer + '",';
      }
			
			if (typeof start !== 'undefined' && start !== "") {
        column += '"start",';
        values += ' ' + start + ',';
      }
			
			if (typeof end !== 'undefined' && end !== "") {
        column += '"end",';
        values += ' ' + end + ',';
      }
			
			if (typeof observed_allele !== 'undefined' && observed_allele !== "") {
        column += 'observed_allele,';
        values += '"' + observed_allele + '",';
      }
			
			if (typeof sequence_id !== 'undefined' && sequence_id !== "") {
        column += 'sequence_id,';
        values += '"' + sequence_id + '",';
      }

      var query = 'UPSERT INTO BACIRO_FHIR.sequence_variant(variant_id, ' + column.slice(0, -1) + ')'+
        ' VALUES ("'+variant_id+'", ' + values.slice(0, -1) + ')';
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select variant_id from baciro_fhir.sequence_variant WHERE variant_id = '" + variant_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceVariant"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceVariant"});
      });
    },
		sequenceQuality: function addSequenceQuality(req, res) {
			var console.log(req.body);
			var quality_id   = req.body.quality_id;
			var type   = req.body.type;
			var standard_sequence   = req.body.standard_sequence;
			var start   = req.body.start;
			var end   = req.body.end;
			var score   = req.body.score;
			var method   = req.body.method;
			var truth_tp   = req.body.truth_tp;
			var query_tp   = req.body.query_tp;
			var truth_fn   = req.body.truth_fn;
			var query_fp   = req.body.query_fp;
			var gt_fp   = req.body.gt_fp;
			var precision   = req.body.precision;
			var recall   = req.body.recall;
			var f_score   = req.body.f_score;
			var sequence_id   = req.body.sequence_id;

			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += '"' + type + '",';
      }
			
			if (typeof standard_sequence !== 'undefined' && standard_sequence !== "") {
        column += 'standard_sequence,';
        values += '"' + standard_sequence + '",';
      }
			
			if (typeof start !== 'undefined' && start !== "") {
        column += '"start",';
        values += ' ' + start + ',';
      }
			
			if (typeof end !== 'undefined' && end !== "") {
        column += '"end",';
        values += ' ' + end + ',';
      }
			
			if (typeof score !== 'undefined' && score !== "") {
        column += 'score,';
        values += '"' + score + '",';
      }
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += '"' + method + '",';
      }
			
			if (typeof truth_tp !== 'undefined' && truth_tp !== "") {
        column += 'truth_tp,';
        values += ' ' + truth_tp + ',';
      }
			
			if (typeof query_tp !== 'undefined' && query_tp !== "") {
        column += 'query_tp,';
        values += ' ' + query_tp + ',';
      }
			
			if (typeof truth_fn !== 'undefined' && truth_fn !== "") {
        column += 'truth_fn,';
        values += ' ' + truth_fn + ',';
      }
			
			if (typeof query_fp !== 'undefined' && query_fp !== "") {
        column += 'query_fp,';
        values += ' ' + query_fp + ',';
      }
			
			if (typeof gt_fp !== 'undefined' && gt_fp !== "") {
        column += 'gt_fp,';
        values += ' ' + gt_fp + ',';
      }
			
			if (typeof precision !== 'undefined' && precision !== "") {
        column += 'precision,';
        values += ' ' + precision + ',';
      }
			
			if (typeof recall !== 'undefined' && recall !== "") {
        column += 'recall,';
        values += ' ' + recall + ',';
      }
			
			if (typeof f_score !== 'undefined' && f_score !== "") {
        column += 'f_score,';
        values += ' ' + f_score + ',';
      }
			
			if (typeof sequence_id !== 'undefined' && sequence_id !== "") {
        column += 'sequence_id,';
        values += '"' + sequence_id + '",';
      }

      var query = 'UPSERT INTO BACIRO_FHIR.sequence_quality(quality_id, ' + column.slice(0, -1) + ')'+
        ' VALUES ("'+quality_id+'", ' + values.slice(0, -1) + ')';
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select quality_id from baciro_fhir.sequence_quality WHERE quality_id = '" + quality_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceQuality"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSequenceQuality"});
      });
    }
	},
	put: {
		sequence: function updateSequence(req, res) {
			console.log(req.body);
			var sequence_id  = req.params.sequence_id;
			var type  = req.body.type;
			var coordinate_system  = req.body.coordinate_system;
			var patient  = req.body.patient;
			var specimen  = req.body.specimen;
			var device  = req.body.device;
			var performer  = req.body.performer;
			var quantity  = req.body.quantity;
			var reference_seq_chromosome  = req.body.reference_seq_chromosome;
			var reference_seq_genome_bui  = req.body.reference_seq_genome_bui;
			var reference_seq_reference_seq_id  = req.body.reference_seq_reference_seq_id;
			var reference_seq_pointer  = req.body.reference_seq_pointer;
			var reference_seq_string  = req.body.reference_seq_string;
			var reference_seq_strand  = req.body.reference_seq_strand;
			var reference_seq_window_start  = req.body.reference_seq_window_start;
			var reference_seq_window_end  = req.body.reference_seq_window_end;
			var observed_seq  = req.body.observed_seq;
			var read_coverage  = req.body.read_coverage;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof coordinate_system !== 'undefined' && coordinate_system !== "") {
        column += 'coordinate_system,';
        values += "'" + coordinate_system + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof specimen !== 'undefined' && specimen !== "") {
        column += 'specimen,';
        values += "'" + specimen + "',";
      }	
			
			if (typeof device !== 'undefined' && device !== "") {
        column += 'device,';
        values += "'" + device + "',";
      }		
			
			if (typeof performer !== 'undefined' && performer !== "") {
        column += 'performer,';
        values += "'" + performer + "',";
      }	
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += "'" + quantity + "',";
      }		
			
			if (typeof reference_seq_chromosome !== 'undefined' && reference_seq_chromosome !== "") {
        column += 'reference_seq_chromosome,';
        values += "'" + reference_seq_chromosome + "',";
      }	
			
			if (typeof reference_seq_genome_bui !== 'undefined' && reference_seq_genome_bui !== "") {
        column += 'reference_seq_genome_bui,';
        values += "'" + reference_seq_genome_bui + "',";
      }
			
			if (typeof reference_seq_reference_seq_id !== 'undefined' && reference_seq_reference_seq_id !== "") {
        column += 'reference_seq_reference_seq_id,';
        values += "'" + reference_seq_reference_seq_id + "',";
      }		
			
			if (typeof reference_seq_pointer !== 'undefined' && reference_seq_pointer !== "") {
        column += 'reference_seq_pointer,';
        values += "'" + reference_seq_pointer + "',";
      }		
			
			if (typeof reference_seq_string !== 'undefined' && reference_seq_string !== "") {
        column += 'reference_seq_string,';
        values += "'" + reference_seq_string + "',";
      }		
			
			if (typeof reference_seq_strand !== 'undefined' && reference_seq_strand !== "") {
        column += 'reference_seq_strand,';
        values += " " + reference_seq_strand + ",";
      }
			
			if (typeof reference_seq_window_start !== 'undefined' && reference_seq_window_start !== "") {
        column += 'reference_seq_window_start,';
        values += " " + reference_seq_window_start + ",";
      }
			
			if (typeof reference_seq_window_end !== 'undefined' && reference_seq_window_end !== "") {
        column += 'reference_seq_window_end,';
        values += " " + reference_seq_window_end + ",";
      }
			
			if (typeof observed_seq !== 'undefined' && observed_seq !== "") {
        column += 'observed_seq,';
        values += "'" + observed_seq + "',";
      }	
			
			if (typeof read_coverage !== 'undefined' && read_coverage !== "") {
        column += 'read_coverage,';
        values += " " + read_coverage + ",";
      }
			
      
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "sequence_id = '" + sequence_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.sequences(sequence_id," + column.slice(0, -1) + ") SELECT sequence_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DIAGNOSTIC_REPORT WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sequence_id from BACIRO_FHIR.sequences WHERE sequence_id = '" + sequence_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSequence"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSequence"});
      });
    },
		sequenceRepository: function updateSequenceRepository(req, res) {
			console.log(req.body);
			var repository_id  = req.body.repository_id;
			var type  = req.body.type;
			var url  = req.body.url;
			var name  = req.body.name;
			var dataset_id  = req.body.dataset_id;
			var varianset_id  = req.body.varianset_id;
			var readset_id  = req.body.readset_id;
			var sequence_id  = req.body.sequence_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof url !== 'undefined' && url !== "") {
        column += 'url,';
        values += "'" + url + "',";
      }
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }
			
			if (typeof dataset_id !== 'undefined' && dataset_id !== "") {
        column += 'dataset_id,';
        values += "'" + dataset_id + "',";
      }	
			
			if (typeof varianset_id !== 'undefined' && varianset_id !== "") {
        column += 'varianset_id,';
        values += "'" + varianset_id + "',";
      }
			
			if (typeof readset_id !== 'undefined' && readset_id !== "") {
        column += 'readset_id,';
        values += "'" + readset_id + "',";
      }
			
			if (typeof sequence_id !== 'undefined' && sequence_id !== "") {
        column += 'sequence_id,';
        values += "'" + sequence_id + "',";
      }
				
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "repository_id = '" + repository_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.sequence_repository(repository_id," + column.slice(0, -1) + ") SELECT repository_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.sequence_repository WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select repository_id from BACIRO_FHIR.sequence_repository WHERE repository_id = '" + repository_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSequenceRepository"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSequenceRepository"});
      });
    },
		sequenceVariant: function updateSequenceVariant(req, res) {
			console.log(req.body);
			var variant_id   = req.params.variant_id;
			var start   = req.body.start;
			var end   = req.body.end;
			var observed_allele   = req.body.observed_allele;
			var reference_allele   = req.body.reference_allele;
			var cigar   = req.body.cigar;
			var variant_pointer   = req.body.variant_pointer;
			var sequence_id   = req.body.sequence_id;
			var column = "";
      var values = "";
			
			if (typeof reference_allele !== 'undefined' && reference_allele !== "") {
        column += 'reference_allele,';
        values += '"' + reference_allele + '",';
      }
			
			if (typeof cigar !== 'undefined' && cigar !== "") {
        column += 'cigar,';
        values += '"' + cigar + '",';
      }
			
			if (typeof variant_pointer !== 'undefined' && variant_pointer !== "") {
        column += 'variant_pointer,';
        values += '"' + variant_pointer + '",';
      }
			
			if (typeof start !== 'undefined' && start !== "") {
        column += '"start",';
        values += ' ' + start + ',';
      }
			
			if (typeof end !== 'undefined' && end !== "") {
        column += '"end",';
        values += ' ' + end + ',';
      }
			
			if (typeof observed_allele !== 'undefined' && observed_allele !== "") {
        column += 'observed_allele,';
        values += '"' + observed_allele + '",';
      }
			
			if (typeof sequence_id !== 'undefined' && sequence_id !== "") {
        column += 'sequence_id,';
        values += '"' + sequence_id + '",';
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "variant_id = '" + variant_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.sequence_variant(variant_id," + column.slice(0, -1) + ") SELECT variant_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.sequence_variant WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select variant_id from baciro_fhir.sequence_variant WHERE variant_id = '" + variant_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSequenceVariant"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSequenceVariant"});
      });
    },
		sequenceQuality: function updateSequenceQuality(req, res) {
			console.log(req.body);
			var quality_id   = req.params.quality_id;
			var type   = req.body.type;
			var standard_sequence   = req.body.standard_sequence;
			var start   = req.body.start;
			var end   = req.body.end;
			var score   = req.body.score;
			var method   = req.body.method;
			var truth_tp   = req.body.truth_tp;
			var query_tp   = req.body.query_tp;
			var truth_fn   = req.body.truth_fn;
			var query_fp   = req.body.query_fp;
			var gt_fp   = req.body.gt_fp;
			var precision   = req.body.precision;
			var recall   = req.body.recall;
			var f_score   = req.body.f_score;
			var sequence_id   = req.body.sequence_id;

			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += '"' + type + '",';
      }
			
			if (typeof standard_sequence !== 'undefined' && standard_sequence !== "") {
        column += 'standard_sequence,';
        values += '"' + standard_sequence + '",';
      }
			
			if (typeof start !== 'undefined' && start !== "") {
        column += '"start",';
        values += ' ' + start + ',';
      }
			
			if (typeof end !== 'undefined' && end !== "") {
        column += '"end",';
        values += ' ' + end + ',';
      }
			
			if (typeof score !== 'undefined' && score !== "") {
        column += 'score,';
        values += '"' + score + '",';
      }
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += '"' + method + '",';
      }
			
			if (typeof truth_tp !== 'undefined' && truth_tp !== "") {
        column += 'truth_tp,';
        values += ' ' + truth_tp + ',';
      }
			
			if (typeof query_tp !== 'undefined' && query_tp !== "") {
        column += 'query_tp,';
        values += ' ' + query_tp + ',';
      }
			
			if (typeof truth_fn !== 'undefined' && truth_fn !== "") {
        column += 'truth_fn,';
        values += ' ' + truth_fn + ',';
      }
			
			if (typeof query_fp !== 'undefined' && query_fp !== "") {
        column += 'query_fp,';
        values += ' ' + query_fp + ',';
      }
			
			if (typeof gt_fp !== 'undefined' && gt_fp !== "") {
        column += 'gt_fp,';
        values += ' ' + gt_fp + ',';
      }
			
			if (typeof precision !== 'undefined' && precision !== "") {
        column += 'precision,';
        values += ' ' + precision + ',';
      }
			
			if (typeof recall !== 'undefined' && recall !== "") {
        column += 'recall,';
        values += ' ' + recall + ',';
      }
			
			if (typeof f_score !== 'undefined' && f_score !== "") {
        column += 'f_score,';
        values += ' ' + f_score + ',';
      }
			
			if (typeof sequence_id !== 'undefined' && sequence_id !== "") {
        column += 'sequence_id,';
        values += '"' + sequence_id + '",';
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "quality_id = '" + quality_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.sequence_quality(quality_id," + column.slice(0, -1) + ") SELECT quality_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.sequence_quality WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select quality_id from baciro_fhir.sequence_quality WHERE quality_id = '" + quality_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSequenceQuality"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSequenceQuality"});
      });
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

module.exports = controller;