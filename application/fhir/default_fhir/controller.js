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
seedPhoenix.base.port = configYaml.phoenix.port;

var Api = new Apiclient(seedPhoenix);

seedPhoenixFHIR = require(path.resolve('../../application/config/seed_phoenix_fhir.json'));
seedPhoenixFHIR.base.hostname = configYaml.phoenix.host;
seedPhoenixFHIR.base.port = configYaml.phoenix.port;

var ApiFHIR = new Apiclient(seedPhoenixFHIR);

var controller = {
	get: {
		identityAssuranceLevel: function getIdentityAssuranceLevel(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('identityAssuranceLevel', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getIdentityAssuranceLevel"
								});
							} else {
								//cek apakah ada error atau tidak
								var assuranceLevel = JSON.parse(body);
								//cek apakah ada error atau tidak
								if (assuranceLevel.err_code == 0) {
									//cek jumdata dulu
									if (assuranceLevel.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": assuranceLevel.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Identity Assurance Level is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": assuranceLevel.error,
										"application": "Api FHIR",
										"function": "getIdentityAssuranceLevel"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							//method, endpoint, params, options, callback
							ApiFHIR.get('identityAssuranceLevel', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getIdentityAssuranceLevel"
									});
								} else {
									//cek apakah ada error atau tidak
									var assuranceLevel = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (assuranceLevel.err_code == 0) {
										//cek jumdata dulu
										if (assuranceLevel.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": assuranceLevel.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Identity Assurance Level is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": assuranceLevel.error,
											"application": "Api FHIR",
											"function": "getIdentityAssuranceLevel"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}
					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		identityAssuranceLevelCode: function getIdentityAssuranceLevelCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						//method, endpoint, params, options, callback
						ApiFHIR.get('identityAssuranceLevelCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getIdentityAssuranceLevelCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var assuranceLevel = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (assuranceLevel.err_code == 0) {
									//cek jumdata dulu
									if (assuranceLevel.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": assuranceLevel.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Identity Assurance Level Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": assuranceLevel.error,
										"application": "Api FHIR",
										"function": "getIdentityAssuranceLevelCode"
									});
								}
							}
						})

					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		administrativeGender: function getAdministrativeGender(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('administrativeGender', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAdministrativeGender"
								});
							} else {
								//cek apakah ada error atau tidak
								var administrativeGender = JSON.parse(body);
								//cek apakah ada error atau tidak
								if (administrativeGender.err_code == 0) {
									//cek jumdata dulu
									if (administrativeGender.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": administrativeGender.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Administrative Gender is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": administrativeGender.error,
										"application": "Api FHIR",
										"function": "getAdministrativeGender"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							//method, endpoint, params, options, callback
							ApiFHIR.get('administrativeGender', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAdministrativeGender"
									});
								} else {
									//cek apakah ada error atau tidak
									var administrativeGender = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (administrativeGender.err_code == 0) {
										//cek jumdata dulu
										if (administrativeGender.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": administrativeGender.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Administrative Gender is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": administrativeGender.error,
											"application": "Api FHIR",
											"function": "getAdministrativeGender"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}
					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		administrativeGenderCode: function getAdministrativeGenderCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						//method, endpoint, params, options, callback
						ApiFHIR.get('administrativeGenderCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAdministrativeGenderCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var administrativeGender = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (administrativeGender.err_code == 0) {
									//cek jumdata dulu
									if (administrativeGender.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": administrativeGender.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Administrative Gender Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": administrativeGender.error,
										"application": "Api FHIR",
										"function": "getAdministrativeGender"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		maritalStatus: function getMaritalStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('maritalStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getMaritalStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var maritalStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (maritalStatus.err_code == 0) {
									//cek jumdata dulu
									if (maritalStatus.data.length > 0) {
										for (i = 0; i < maritalStatus.data.length; i++) {
											maritalStatus.data[i].system = host + ':' + port + '/' + apikey + '/' + maritalStatus.data[i].system;
										}
										res.json({
											"err_code": 0,
											"data": maritalStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Marital Status is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": maritalStatus.error,
										"application": "Api FHIR",
										"function": "getMaritalStatus"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('maritalStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getMaritalStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var maritalStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (maritalStatus.err_code == 0) {
										//cek jumdata dulu
										if (maritalStatus.data.length > 0) {
											maritalStatus.data[0].system = host + ':' + port + '/' + apikey + '/' + maritalStatus.data[0].system;
											res.json({
												"err_code": 0,
												"data": maritalStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Marital Status is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": maritalStatus.error,
											"application": "Api FHIR",
											"function": "getMaritalStatus"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		maritalStatusCode: function getMaritalStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('maritalStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getMaritalStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var maritalStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (maritalStatus.err_code == 0) {
									//cek jumdata dulu
									if (maritalStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": maritalStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Marital Status Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": maritalStatus.error,
										"application": "Api FHIR",
										"function": "getMaritalStatus"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		contactRole: function getContactRole(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('contactRole', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getContactRole"
								});
							} else {
								//cek apakah ada error atau tidak
								var contactRole = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (contactRole.err_code == 0) {
									//cek jumdata dulu
									if (contactRole.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": contactRole.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Contact Role is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": contactRole.error,
										"application": "Api FHIR",
										"function": "getContactRole"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('contactRole', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getContactRole"
									});
								} else {
									//cek apakah ada error atau tidak
									var contactRole = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (contactRole.err_code == 0) {
										//cek jumdata dulu
										if (contactRole.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": contactRole.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Contact Role is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": contactRole.error,
											"application": "Api FHIR",
											"function": "getContactRole"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		contactRoleCode: function getContactRoleCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('contactRoleCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getContactRoleCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var contactRole = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (contactRole.err_code == 0) {
									//cek jumdata dulu
									if (contactRole.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": contactRole.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Contact Role Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": contactRole.error,
										"application": "Api FHIR",
										"function": "getContactRole"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		animalSpecies: function getAnimalSpecies(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('animalSpecies', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAnimalSpecies"
								});
							} else {
								//cek apakah ada error atau tidak
								var animalSpecies = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (animalSpecies.err_code == 0) {
									//cek jumdata dulu
									if (animalSpecies.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": animalSpecies.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Animal Species is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": animalSpecies.error,
										"application": "Api FHIR",
										"function": "getAnimalSpecies"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('animalSpecies', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAnimalSpecies"
									});
								} else {
									//cek apakah ada error atau tidak
									var animalSpecies = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (animalSpecies.err_code == 0) {
										//cek jumdata dulu
										if (animalSpecies.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": animalSpecies.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Animal Species is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": animalSpecies.error,
											"application": "Api FHIR",
											"function": "getAnimalSpecies"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		animalSpeciesCode: function getAnimalSpeciesCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('animalSpeciesCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAnimalSpeciesCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var animalSpecies = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (animalSpecies.err_code == 0) {
									//cek jumdata dulu
									if (animalSpecies.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": animalSpecies.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Animal Species Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": animalSpecies.error,
										"application": "Api FHIR",
										"function": "getAnimalSpeciesCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		animalBreeds: function getAnimalBreeds(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('animalBreeds', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAnimalBreeds"
								});
							} else {
								//cek apakah ada error atau tidak
								var animalBreeds = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (animalBreeds.err_code == 0) {
									//cek jumdata dulu
									if (animalBreeds.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": animalBreeds.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Animal Breeds is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": animalBreeds.error,
										"application": "Api FHIR",
										"function": "getAnimalBreeds"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('animalBreeds', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAnimalBreeds"
									});
								} else {
									//cek apakah ada error atau tidak
									var animalBreeds = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (animalBreeds.err_code == 0) {
										//cek jumdata dulu
										if (animalBreeds.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": animalBreeds.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Animal Breeds is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": animalBreeds.error,
											"application": "Api FHIR",
											"function": "getAnimalBreeds"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		animalBreedsCode: function getAnimalBreedsCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('animalBreedsCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAnimalBreedsCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var animalBreeds = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (animalBreeds.err_code == 0) {
									//cek jumdata dulu
									if (animalBreeds.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": animalBreeds.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Animal Breeds Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": animalBreeds.error,
										"application": "Api FHIR",
										"function": "getAnimalBreedsCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		animalGenderStatus: function getAnimalGenderStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('animalGenderStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAnimalGenderStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var animalGenderStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (animalGenderStatus.err_code == 0) {
									//cek jumdata dulu
									if (animalGenderStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": animalGenderStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Animal Gender Status is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": animalGenderStatus.error,
										"application": "Api FHIR",
										"function": "getAnimalGenderStatus"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('animalGenderStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAnimalGenderStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var animalGenderStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (animalGenderStatus.err_code == 0) {
										//cek jumdata dulu
										if (animalGenderStatus.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": animalGenderStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Animal Gender Status is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": animalGenderStatus.error,
											"application": "Api FHIR",
											"function": "getAnimalGenderStatus"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		animalGenderStatusCode: function getAnimalGenderStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('animalGenderStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAnimalGenderStatusCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var animalGenderStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (animalGenderStatus.err_code == 0) {
									//cek jumdata dulu
									if (animalGenderStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": animalGenderStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Animal Gender Status Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": animalGenderStatus.error,
										"application": "Api FHIR",
										"function": "getAnimalGenderStatusCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		languages: function getLanguages(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('languages', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getLanguages"
								});
							} else {
								//cek apakah ada error atau tidak
								var languages = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (languages.err_code == 0) {
									//cek jumdata dulu
									if (languages.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": languages.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Languages is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": languages.error,
										"application": "Api FHIR",
										"function": "getLanguages"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('languages', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getLanguages"
									});
								} else {
									//cek apakah ada error atau tidak
									var languages = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (languages.err_code == 0) {
										//cek jumdata dulu
										if (languages.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": languages.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Languages is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": languages.error,
											"application": "Api FHIR",
											"function": "getLanguages"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		languagesCode: function getLanguagesCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('languagesCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getLanguagesCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var languages = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (languages.err_code == 0) {
									//cek jumdata dulu
									if (languages.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": languages.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Languages code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": languages.error,
										"application": "Api FHIR",
										"function": "getLanguagesCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		linkType: function getLinkType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('linkType', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getLinkType"
								});
							} else {
								//cek apakah ada error atau tidak
								var linkType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (linkType.err_code == 0) {
									//cek jumdata dulu
									if (linkType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": linkType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Link Type is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": linkType.error,
										"application": "Api FHIR",
										"function": "getLinkType"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('linkType', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getLinkType"
									});
								} else {
									//cek apakah ada error atau tidak
									var linkType = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (linkType.err_code == 0) {
										//cek jumdata dulu
										if (linkType.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": linkType.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Link Type is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": linkType.error,
											"application": "Api FHIR",
											"function": "getLinkType"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		linkTypeCode: function getLinkTypeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('linkTypeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getLinkTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var linkType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (linkType.err_code == 0) {
									//cek jumdata dulu
									if (linkType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": linkType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Link Type code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": linkType.error,
										"application": "Api FHIR",
										"function": "getLinkTypeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		relatedPersonRelationshipType: function getRelatedPersonRelationshipType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('relatedPersonRelationshipType', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getRelatedPersonRelationshipType"
								});
							} else {
								//cek apakah ada error atau tidak
								var relatedPersonRelationshipType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (relatedPersonRelationshipType.err_code == 0) {
									//cek jumdata dulu
									if (relatedPersonRelationshipType.data.length > 0) {
										for (i = 0; i < relatedPersonRelationshipType.data.length; i++) {
											relatedPersonRelationshipType.data[i].system = host + ':' + port + '/' + apikey + '/' + relatedPersonRelationshipType.data[i].system;
										}

										res.json({
											"err_code": 0,
											"data": relatedPersonRelationshipType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Related Person Relationship Type is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": relatedPersonRelationshipType.error,
										"application": "Api FHIR",
										"function": "getRelatedPersonRelationshipType"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('relatedPersonRelationshipType', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getRelatedPersonRelationshipType"
									});
								} else {
									//cek apakah ada error atau tidak
									var relatedPersonRelationshipType = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (relatedPersonRelationshipType.err_code == 0) {
										//cek jumdata dulu
										if (relatedPersonRelationshipType.data.length > 0) {

											relatedPersonRelationshipType.data[0].system = host + ':' + port + '/' + apikey + '/' + relatedPersonRelationshipType.data[0].system;

											res.json({
												"err_code": 0,
												"data": relatedPersonRelationshipType.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Related Person Relationship Type is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": relatedPersonRelationshipType.error,
											"application": "Api FHIR",
											"function": "getRelatedPersonRelationshipType"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		relatedPersonRelationshipTypeCode: function getRelatedPersonRelationshipTypeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('relatedPersonRelationshipTypeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getRelatedPersonRelationshipTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var relatedPersonRelationshipType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (relatedPersonRelationshipType.err_code == 0) {
									//cek jumdata dulu
									if (relatedPersonRelationshipType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": relatedPersonRelationshipType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Related Person Relationship Type Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": relatedPersonRelationshipType.error,
										"application": "Api FHIR",
										"function": "getRelatedPersonRelationshipTypeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		groupType: function getGroupType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('groupType', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getGroupType"
								});
							} else {
								//cek apakah ada error atau tidak
								var groupType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (groupType.err_code == 0) {
									//cek jumdata dulu
									if (groupType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": groupType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Group Type is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": groupType.error,
										"application": "Api FHIR",
										"function": "getGroupType"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('groupType', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getGroupType"
									});
								} else {
									//cek apakah ada error atau tidak
									var groupType = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (groupType.err_code == 0) {
										//cek jumdata dulu
										if (groupType.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": groupType.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Group Type is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": groupType.error,
											"application": "Api FHIR",
											"function": "getGroupType"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		groupTypeCode: function getGroupTypeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('groupTypeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getGroupTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var groupType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (groupType.err_code == 0) {
									//cek jumdata dulu
									if (groupType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": groupType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Group Type Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": groupType.error,
										"application": "Api FHIR",
										"function": "getGroupTypeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		identifierUse: function getIdentifierUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('identifierUse', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getIdentifierUse"
								});
							} else {
								//cek apakah ada error atau tidak
								var identifierUse = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (identifierUse.err_code == 0) {
									//cek jumdata dulu
									if (identifierUse.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": identifierUse.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Identifier Use is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": identifierUse.error,
										"application": "Api FHIR",
										"function": "getIdentifierUse"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('identifierUse', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getIdentifierUse"
									});
								} else {
									//cek apakah ada error atau tidak
									var identifierUse = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (identifierUse.err_code == 0) {
										//cek jumdata dulu
										if (identifierUse.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": identifierUse.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Identifier Use is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": identifierUse.error,
											"application": "Api FHIR",
											"function": "getIdentifierUse"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		identifierUseCode: function getIdentifierUseCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('identifierUseCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getIdentifierUseCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var identifierUse = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (identifierUse.err_code == 0) {
									//cek jumdata dulu
									if (identifierUse.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": identifierUse.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Identifier Use Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": identifierUse.error,
										"application": "Api FHIR",
										"function": "getIdentifierUseCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		identifierType: function getIdentifierType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('identifierType', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getIdentifierType"
								});
							} else {
								//cek apakah ada error atau tidak
								var identifierType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (identifierType.err_code == 0) {
									//cek jumdata dulu
									if (identifierType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": identifierType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Identifier Type is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": identifierType.error,
										"application": "Api FHIR",
										"function": "getIdentifierType"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('identifierType', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getIdentifierUse"
									});
								} else {
									//cek apakah ada error atau tidak
									var identifierType = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (identifierType.err_code == 0) {
										//cek jumdata dulu
										if (identifierType.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": identifierType.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Identifier Type is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": identifierType.error,
											"application": "Api FHIR",
											"function": "getIdentifierType"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		identifierTypeCode: function getIdentifierTypeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').toUpperCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('identifierTypeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getIdentifierTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var identifierType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (identifierType.err_code == 0) {
									//cek jumdata dulu
									if (identifierType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": identifierType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Identifier Type Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": identifierType.error,
										"application": "Api FHIR",
										"function": "getIdentifierTypeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		nameUse: function getNameUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('nameUse', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getNameUse"
								});
							} else {
								//cek apakah ada error atau tidak
								var nameUse = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (nameUse.err_code == 0) {
									//cek jumdata dulu
									if (nameUse.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": nameUse.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Name Use is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": nameUse.error,
										"application": "Api FHIR",
										"function": "getNameUse"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('nameUse', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getNameUse"
									});
								} else {
									//cek apakah ada error atau tidak
									var nameUse = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (nameUse.err_code == 0) {
										//cek jumdata dulu
										if (nameUse.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": nameUse.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Name Use is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": nameUse.error,
											"application": "Api FHIR",
											"function": "getNameUse"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		nameUseCode: function getNameUseCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('nameUseCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getNameUseCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var nameUse = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (nameUse.err_code == 0) {
									//cek jumdata dulu
									if (nameUse.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": nameUse.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Name Use Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": nameUse.error,
										"application": "Api FHIR",
										"function": "getNameUseCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		contactPointSystem: function getContactPointSystem(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('contactPointSystem', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getContactPointSystem"
								});
							} else {
								//cek apakah ada error atau tidak
								var contactPointSystem = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (contactPointSystem.err_code == 0) {
									//cek jumdata dulu
									if (contactPointSystem.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": contactPointSystem.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Contact Point System is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": contactPointSystem.error,
										"application": "Api FHIR",
										"function": "getContactPointSystem"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('contactPointSystem', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getContactPointSystem"
									});
								} else {
									//cek apakah ada error atau tidak
									var contactPointSystem = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (contactPointSystem.err_code == 0) {
										//cek jumdata dulu
										if (contactPointSystem.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": contactPointSystem.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Contact Point System is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": contactPointSystem.error,
											"application": "Api FHIR",
											"function": "getContactPointSystem"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		contactPointSystemCode: function getContactPointSystemCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('contactPointSystemCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getContactPointSystemCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var contactPointSystem = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (contactPointSystem.err_code == 0) {
									//cek jumdata dulu
									if (contactPointSystem.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": contactPointSystem.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Contact Point System Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": contactPointSystem.error,
										"application": "Api FHIR",
										"function": "getContactPointSystemCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		contactPointUse: function getContactPointUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('contactPointUse', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getContactPointUse"
								});
							} else {
								//cek apakah ada error atau tidak
								var contactPointUse = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (contactPointUse.err_code == 0) {
									//cek jumdata dulu
									if (contactPointUse.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": contactPointUse.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Contact Point Use is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": contactPointUse.error,
										"application": "Api FHIR",
										"function": "getContactPointUse"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('contactPointUse', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getContactPointUse"
									});
								} else {
									//cek apakah ada error atau tidak
									var contactPointUse = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (contactPointUse.err_code == 0) {
										//cek jumdata dulu
										if (contactPointUse.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": contactPointUse.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Contact Point Use is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": contactPointUse.error,
											"application": "Api FHIR",
											"function": "getContactPointUse"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		contactPointUseCode: function getContactPointUseCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('contactPointUseCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getContactPointUseCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var contactPointUse = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (contactPointUse.err_code == 0) {
									//cek jumdata dulu
									if (contactPointUse.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": contactPointUse.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Contact Point Use Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": contactPointUse.error,
										"application": "Api FHIR",
										"function": "getContactPointUseCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		addressUse: function getAddressUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('addressUse', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAddressUse"
								});
							} else {
								//cek apakah ada error atau tidak
								var addressUse = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (addressUse.err_code == 0) {
									//cek jumdata dulu
									if (addressUse.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": addressUse.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Address Use is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": addressUse.error,
										"application": "Api FHIR",
										"function": "getAddressUse"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('addressUse', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAddressUse"
									});
								} else {
									//cek apakah ada error atau tidak
									var addressUse = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (addressUse.err_code == 0) {
										//cek jumdata dulu
										if (addressUse.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": addressUse.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Address Use is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": addressUse.error,
											"application": "Api FHIR",
											"function": "getAddressUse"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		addressUseCode: function getAddressUseCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('addressUseCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAddressUseCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var addressUse = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (addressUse.err_code == 0) {
									//cek jumdata dulu
									if (addressUse.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": addressUse.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Address Use Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": addressUse.error,
										"application": "Api FHIR",
										"function": "getAddressUseCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		addressType: function getAddressType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('addressType', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAddressType"
								});
							} else {
								//cek apakah ada error atau tidak
								var addressType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (addressType.err_code == 0) {
									//cek jumdata dulu
									if (addressType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": addressType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Address Type is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": addressType.error,
										"application": "Api FHIR",
										"function": "getAddressType"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('addressType', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAddressType"
									});
								} else {
									//cek apakah ada error atau tidak
									var addressType = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (addressType.err_code == 0) {
										//cek jumdata dulu
										if (addressType.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": addressType.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Address Type is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": addressType.error,
											"application": "Api FHIR",
											"function": "getAddressType"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		addressTypeCode: function getAddressTypeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('addressTypeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAddressTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var addressType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (addressType.err_code == 0) {
									//cek jumdata dulu
									if (addressType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": addressType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Address Type Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": addressType.error,
										"application": "Api FHIR",
										"function": "getAddressTypeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		appointmentReasonCode: function getAppointmentReasonCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('appointmentReasonCode', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAppointmentReasonCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var appointmentReasonCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (appointmentReasonCode.err_code == 0) {
									//cek jumdata dulu
									if (appointmentReasonCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": appointmentReasonCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Appointment Reason Code is not found"
										});
									}
								} else {
									res.json(appointmentReasonCode);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('appointmentReasonCode', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAppointmentReasonCode"
									});
								} else {
									//cek apakah ada error atau tidak
									var appointmentReasonCode = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (appointmentReasonCode.err_code == 0) {
										//cek jumdata dulu
										if (appointmentReasonCode.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": appointmentReasonCode.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Appointment Reason Code is not found"
											});
										}
									} else {
										res.json(appointmentReasonCode);
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		appointmentReasonCodeCode: function getAppointmentReasonCodeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toUpperCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('appointmentReasonCodeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAddressTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var appointmentReasonCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (appointmentReasonCode.err_code == 0) {
									//cek jumdata dulu
									if (appointmentReasonCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": appointmentReasonCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Appointment Reason Code is not found"
										});
									}
								} else {
									res.json(appointmentReasonCode);
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		slotStatus: function getSlotStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('slotStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getSlotStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var slotStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (slotStatus.err_code == 0) {
									//cek jumdata dulu
									if (slotStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": slotStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Slot Status is not found"
										});
									}
								} else {
									res.json(slotStatus);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('slotStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getSlotStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var slotStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (slotStatus.err_code == 0) {
										//cek jumdata dulu
										if (slotStatus.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": slotStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Slot Status is not found"
											});
										}
									} else {
										res.json(slotStatus);
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		slotStatusCode: function getSlotStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('slotStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getSlotStatusCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var slotStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (slotStatus.err_code == 0) {
									//cek jumdata dulu
									if (slotStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": slotStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Slot Status Code is not found"
										});
									}
								} else {
									res.json(slotStatus);
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		appointmentStatus: function getAppointmentStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('appointmentStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAppointmentStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var appointmentStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (appointmentStatus.err_code == 0) {
									//cek jumdata dulu
									if (appointmentStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": appointmentStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Appointment Status is not found"
										});
									}
								} else {
									res.json(appointmentStatus);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('appointmentStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAppointmentStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var appointmentStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (appointmentStatus.err_code == 0) {
										//cek jumdata dulu
										if (appointmentStatus.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": appointmentStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Appointment Status is not found"
											});
										}
									} else {
										res.json(appointmentStatus);
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		appointmentStatusCode: function getAppointmentStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('appointmentStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAppointmentStatusCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var appointmentStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (appointmentStatus.err_code == 0) {
									//cek jumdata dulu
									if (appointmentStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": appointmentStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Appointment Status Code is not found"
										});
									}
								} else {
									res.json(appointmentStatus);
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		participantRequired: function getParticipantRequired(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('participantRequired', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getParticipantRequired"
								});
							} else {
								//cek apakah ada error atau tidak
								var participantRequired = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (participantRequired.err_code == 0) {
									//cek jumdata dulu
									if (participantRequired.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": participantRequired.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Participant Required is not found"
										});
									}
								} else {
									res.json(participantRequired);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('participantRequired', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getParticipantRequired"
									});
								} else {
									//cek apakah ada error atau tidak
									var participantRequired = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (participantRequired.err_code == 0) {
										//cek jumdata dulu
										if (participantRequired.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": participantRequired.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Participant Required is not found"
											});
										}
									} else {
										res.json(participantRequired);
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		participantRequiredCode: function getParticipantRequiredCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('participantRequiredCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getParticipantRequiredCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var participantRequired = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (participantRequired.err_code == 0) {
									//cek jumdata dulu
									if (participantRequired.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": participantRequired.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Participant Required Code is not found"
										});
									}
								} else {
									res.json(participantRequired);
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		participationStatus: function getParticipationStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('participationStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getParticipationStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var participationStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (participationStatus.err_code == 0) {
									//cek jumdata dulu
									if (participationStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": participationStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Participation Status is not found"
										});
									}
								} else {
									res.json(participationStatus);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('participationStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getParticipationStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var participationStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (participationStatus.err_code == 0) {
										//cek jumdata dulu
										if (participationStatus.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": participationStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Participation Status is not found"
											});
										}
									} else {
										res.json(participationStatus);
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		participationStatusCode: function getparticipationStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('participationStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getParticipationStatusCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var participationStatus = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (participationStatus.err_code == 0) {
									//cek jumdata dulu
									if (participationStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": participationStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Participant Status Code is not found"
										});
									}
								} else {
									res.json(participationStatus);
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		actEncounterCode: function getActEncounterCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('actEncounterCode', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getActEncounterCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var actEncounterCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (actEncounterCode.err_code == 0) {
									//cek jumdata dulu
									if (actEncounterCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": actEncounterCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Act Encounter Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": actEncounterCode.error,
										"application": "Api FHIR",
										"function": "getActEncounterCode"
									});
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('actEncounterCode', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getActEncounterCode"
									});
								} else {
									//cek apakah ada error atau tidak
									var actEncounterCode = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (actEncounterCode.err_code == 0) {
										//cek jumdata dulu
										if (actEncounterCode.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": actEncounterCode.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Act Encounter Code is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": actEncounterCode.error,
											"application": "Api FHIR",
											"function": "getActEncounterCode"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		actEncounterCodeCode: function getActEncounterCodeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('actEncounterCodeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getActEncounterCodeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var addressType = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (addressType.err_code == 0) {
									//cek jumdata dulu
									if (addressType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": addressType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Act Encounter CodeCode Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": addressType.error,
										"application": "Api FHIR",
										"function": "getActEncounterCodeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		actPriority: function getActPriority(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('actPriority', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getActPriority"
								});
							} else {
								//cek apakah ada error atau tidak
								var actPriority = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (actPriority.err_code == 0) {
									//cek jumdata dulu
									if (actPriority.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": actPriority.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Act Priority is not found "
										});
									}
								} else {
									res.json(actPriority);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('actPriority', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getActPriority"
									});
								} else {
									//cek apakah ada error atau tidak
									var actPriority = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (actPriority.err_code == 0) {
										//cek jumdata dulu
										if (actPriority.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": actPriority.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Act Priority is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": actPriority.error,
											"application": "Api FHIR",
											"function": "getActPriority"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		actPriorityCode: function getActPriorityCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('actPriorityCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getActPriorityCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var actPriorityCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (actPriorityCode.err_code == 0) {
									//cek jumdata dulu
									if (actPriorityCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": actPriorityCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "act Priority Code Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": actPriorityCode.error,
										"application": "Api FHIR",
										"function": "getActPriorityCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		accountStatus: function getAccountStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('accountStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAccountStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var accountStatus = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (accountStatus.err_code == 0) {
									//cek jumdata dulu
									if (accountStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": accountStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Account Status is not found "
										});
									}
								} else {
									res.json(accountStatus);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('accountStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAccountStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var accountStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (accountStatus.err_code == 0) {
										//cek jumdata dulu
										if (accountStatus.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": accountStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Account Status is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": accountStatus.error,
											"application": "Api FHIR",
											"function": "getAccountStatus"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		accountStatusCode: function getAccountStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('accountStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAccountStatusCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var accountStatusCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (accountStatusCode.err_code == 0) {
									//cek jumdata dulu
									if (accountStatusCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": accountStatusCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Account Status Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": accountStatusCode.error,
										"application": "Api FHIR",
										"function": "getAccountStatusCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		accountType: function getAccountType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('accountType', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAccountType"
								});
							} else {
								//cek apakah ada error atau tidak
								var accountType = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (accountType.err_code == 0) {
									//cek jumdata dulu
									if (accountType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": accountType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Account Type is not found "
										});
									}
								} else {
									res.json(accountType);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('accountType', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getAccountType"
									});
								} else {
									//cek apakah ada error atau tidak
									var accountType = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (accountType.err_code == 0) {
										//cek jumdata dulu
										if (accountType.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": accountType.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Account Status is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": accountType.error,
											"application": "Api FHIR",
											"function": "getAccountType"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		accountTypeCode: function getAccountTypeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.trim().toLowerCase(); //.replace(/[^\w\s ,]/gi, '')

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('accountTypeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getAccountTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var accountTypeCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (accountTypeCode.err_code == 0) {
									//cek jum data dulu
									if (accountTypeCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": accountTypeCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Account Type Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": accountTypeCode.error,
										"application": "Api FHIR",
										"function": "getAccountTypeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		diagnosisRole: function getDiagnosisRole(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('diagnosisRole', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getDiagnosisRole"
								});
							} else {
								//cek apakah ada error atau tidak
								var diagnosisRole = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (diagnosisRole.err_code == 0) {
									//cek jumdata dulu
									if (diagnosisRole.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": diagnosisRole.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Diagnosis Role Code is not found "
										});
									}
								} else {
									res.json(diagnosisRole);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('diagnosisRole', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getDiagnosisRole"
									});
								} else {
									//cek apakah ada error atau tidak
									var diagnosisRole = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (diagnosisRole.err_code == 0) {
										//cek jumdata dulu
										if (diagnosisRole.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": diagnosisRole.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Diagnosis Role Code is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": diagnosisRole.error,
											"application": "Api FHIR",
											"function": "getDiagnosisRole"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		diagnosisRoleCode: function getDiagnosisRoleCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('diagnosisRoleCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getDiagnosisRoleCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var diagnosisRoleCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (diagnosisRoleCode.err_code == 0) {
									//cek jum data dulu
									if (diagnosisRoleCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": diagnosisRoleCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Diagnosis Role Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": diagnosisRoleCode.error,
										"application": "Api FHIR",
										"function": "getDiagnosisRoleCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterAdmitSource: function getEncounterAdmitSource(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterAdmitSource', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterAdmitSource"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterAdmitSource = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (encounterAdmitSource.err_code == 0) {
									//cek jumdata dulu
									if (encounterAdmitSource.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterAdmitSource.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Admit Source is not found "
										});
									}
								} else {
									res.json(encounterAdmitSource);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterAdmitSource', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterAdmitSource"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterAdmitSource = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterAdmitSource.err_code == 0) {
										//cek jum data dulu
										if (encounterAdmitSource.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterAdmitSource.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Encounter Admit Source is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterAdmitSource.error,
											"application": "Api FHIR",
											"function": "getEncounterAdmitSource"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterAdmitSourceCode: function getEncounterAdmitSourceCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.trim().toLowerCase(); //.replace(/[^\w\s ,]/gi, '')

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterAdmitSourceCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterAdmitSourceCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterAdmitSourceCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterAdmitSourceCode.err_code == 0) {
									//cek jum data dulu
									if (encounterAdmitSourceCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterAdmitSourceCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter AdmitSource Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterAdmitSourceCode.error,
										"application": "Api FHIR",
										"function": "getEncounterAdmitSourceCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterDiet: function getEncounterDiet(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterDiet', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterDiet"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterDiet = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (encounterDiet.err_code == 0) {
									//cek jumdata dulu
									if (encounterDiet.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterDiet.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Diet is not found "
										});
									}
								} else {
									res.json(encounterDiet);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterDiet', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterDiet"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterDiet = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterDiet.err_code == 0) {
										//cek jum data dulu
										if (encounterDiet.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterDiet.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Encounter Diet is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterDiet.error,
											"application": "Api FHIR",
											"function": "getEncounterDiet"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterDietCode: function getEncounterDietCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.trim().toLowerCase(); //.replace(/[^\w\s ,]/gi, '')

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterDietCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterDietCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterDietCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterDietCode.err_code == 0) {
									//cek jum data dulu
									if (encounterDietCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterDietCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Diet Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterDietCode.error,
										"application": "Api FHIR",
										"function": "getEncounterDietCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterDischargeDisposition: function getEncounterDischargeDisposition(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterDischargeDisposition', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterDischargeDisposition"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterDischargeDisposition = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (encounterDischargeDisposition.err_code == 0) {
									//cek jumdata dulu
									if (encounterDischargeDisposition.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterDischargeDisposition.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Discharge Disposition is not found "
										});
									}
								} else {
									res.json(encounterDischargeDisposition);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterDischargeDisposition', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterDischargeDisposition"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterDischargeDisposition = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterDischargeDisposition.err_code == 0) {
										//cek jum data dulu
										if (encounterDischargeDisposition.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterDischargeDisposition.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Encounter Discharge Disposition is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterDischargeDisposition.error,
											"application": "Api FHIR",
											"function": "getEncounterDischargeDisposition"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterDischargeDispositionCode: function getEncounterDischargeDispositionCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.trim().toLowerCase(); //.replace(/[^\w\s ,]/gi, '')

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterDischargeDispositionCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterDischargeDispositionCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterDischargeDispositionCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterDischargeDispositionCode.err_code == 0) {
									//cek jum data dulu
									if (encounterDischargeDispositionCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterDischargeDispositionCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Discharge Disposition Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterDischargeDispositionCode.error,
										"application": "Api FHIR",
										"function": "getEncounterDischargeDispositionCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterLocationStatus: function getEncounterLocationStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterLocationStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterLocationStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterLocationStatus = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (encounterLocationStatus.err_code == 0) {
									//cek jumdata dulu
									if (encounterLocationStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterLocationStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Location Status is not found "
										});
									}
								} else {
									res.json(encounterLocationStatus);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterLocationStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterLocationStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterLocationStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterLocationStatus.err_code == 0) {
										//cek jum data dulu
										if (encounterLocationStatus.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterLocationStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Encounter Location Status is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterLocationStatus.error,
											"application": "Api FHIR",
											"function": "getEncounterLocationStatus"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterLocationStatusCode: function getEncounterLocationStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterLocationStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterLocationStatusCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterLocationStatusCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterLocationStatusCode.err_code == 0) {
									//cek jum data dulu
									if (encounterLocationStatusCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterLocationStatusCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Location Status Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterLocationStatusCode.error,
										"application": "Api FHIR",
										"function": "getEncounterLocationStatusCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterParticipantType: function getEncounterParticipantType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			//var code = req.params.code;
			//var display =req.params.display;
			//var definition =req.params.definition;
			//var system = req.params.system;


			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterParticipantType', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterParticipantType"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterParticipantType = JSON.parse(body);
								host = host;
								port = port;
								//system =(+ host + ':' + port + '/'+ apikey +'/' +system+);
								//cara cek error
								//console.log (actEncounterCode)	//192.168.56.101:2008/90867b984d2a5038ee21a190996b900b/encounter-participant-type
								//cek apakah ada error atau tidak
								if (encounterParticipantType.err_code == 0) {
									//cek jumdata dulu
									if (encounterParticipantType.data.length > 0) {
										for (i = 0; i < encounterParticipantType.data.length; i++) {
											encounterParticipantType.data[i].system = host + ':' + port + '/' + apikey + '/' + encounterParticipantType.data[i].system;
										}

										res.json({
											"err_code": 0,
											"data": encounterParticipantType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Participant Type is not found "
										});
									}
								} else {
									res.json(encounterParticipantType);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterParticipantType', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterParticipantType"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterParticipantType = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterParticipantType.err_code == 0) {
										//cek jum data dulu
										if (encounterParticipantType.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterParticipantType.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Encounter Participant Type is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterParticipantType.error,
											"application": "Api FHIR",
											"function": "getEncounterParticipantType"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterParticipantTypeCode: function getEncounterParticipantTypeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();
			//var system = req.params.system.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterParticipantTypeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterParticipantTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterParticipantTypeCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterParticipantTypeCode.err_code == 0) {
									//cek jum data dulu
									if (encounterParticipantTypeCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterParticipantTypeCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Participant Type Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterParticipantTypeCode.error,
										"application": "Api FHIR",
										"function": "getEncounterParticipantTypeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterReason: function getEncounterReason(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterReason', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterReason"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterReason = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (encounterReason.err_code == 0) {
									//cek jumdata dulu
									if (encounterReason.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterReason.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Reason is not found "
										});
									}
								} else {
									res.json(encounterReason);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterReason', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterReason"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterReason = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterReason.err_code == 0) {
										//cek jum data dulu
										if (encounterReason.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterReason.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Encounter Reason is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterReason.error,
											"application": "Api FHIR",
											"function": "getEncounterReason"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterReasonCode: function getEncounterReasonCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterReasonCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterReasonCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterReasonCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterReasonCode.err_code == 0) {
									//cek jum data dulu
									if (encounterReasonCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterReasonCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Reason Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterReasonCode.error,
										"application": "Api FHIR",
										"function": "getEncounterReasonCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterSpecialCourtesy: function getEncounterSpecialCourtesy(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterSpecialCourtesy', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterSpecialCourtesy"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterSpecialCourtesy = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (encounterSpecialCourtesy.err_code == 0) {
									//cek jumdata dulu
									if (encounterSpecialCourtesy.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterSpecialCourtesy.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Special Courtesy is not found "
										});
									}
								} else {
									res.json(encounterSpecialCourtesy);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterSpecialCourtesy', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterSpecialCourtesy"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterSpecialCourtesy = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterSpecialCourtesy.err_code == 0) {
										//cek jum data dulu
										if (encounterSpecialCourtesy.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterSpecialCourtesy.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": " Encounter Special Courtesy is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterSpecialCourtesy.error,
											"application": "Api FHIR",
											"function": "getEncounterSpecialCourtesy"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterSpecialCourtesyCode: function getEncounterSpecialCourtesyCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterSpecialCourtesyCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterSpecialCourtesyCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterSpecialCourtesyCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterSpecialCourtesyCode.err_code == 0) {
									//cek jum data dulu
									if (encounterSpecialCourtesyCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterSpecialCourtesyCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Special Courtesy Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterSpecialCourtesyCode.error,
										"application": "Api FHIR",
										"function": "getEncounterSpecialCourtesyCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterSpecialArrangements: function getEncounterSpecialArrangements(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterSpecialArrangements', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterSpecialArrangements"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterSpecialArrangements = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (encounterSpecialArrangements.err_code == 0) {
									//cek jumdata dulu
									if (encounterSpecialArrangements.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterSpecialArrangements.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Special Arrangements is not found "
										});
									}
								} else {
									res.json(encounterSpecialArrangements);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterSpecialArrangements', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterSpecialArrangements"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterSpecialArrangements = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterSpecialArrangements.err_code == 0) {
										//cek jum data dulu
										if (encounterSpecialArrangements.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterSpecialArrangements.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": " Encounter Special Arrangements is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterSpecialArrangements.error,
											"application": "Api FHIR",
											"function": "getEncounterSpecialArrangements"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterSpecialArrangementsCode: function getEncounterSpecialArrangementsCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.trim().toLowerCase(); //.replace(/[^\w\s ,]/gi, '')

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterSpecialArrangementsCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterSpecialArrangementsCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterSpecialArrangementsCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterSpecialArrangementsCode.err_code == 0) {
									//cek jum data dulu
									if (encounterSpecialArrangementsCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterSpecialArrangementsCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Special Arrangements Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterSpecialArrangementsCode.error,
										"application": "Api FHIR",
										"function": "getEncounterSpecialArrangementsCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterStatus: function getEncounterStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterStatus = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (encounterStatus.err_code == 0) {
									//cek jumdata dulu
									if (encounterStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Status is not found "
										});
									}
								} else {
									res.json(encounterStatus);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterStatus.err_code == 0) {
										//cek jum data dulu
										if (encounterStatus.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": " Encounter Status is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterStatus.error,
											"application": "Api FHIR",
											"function": "getEncounterStatus"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterStatusCode: function getEncounterStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterStatusCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterStatusCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterStatusCode.err_code == 0) {
									//cek jum data dulu
									if (encounterStatusCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterStatusCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Status Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterStatusCode.error,
										"application": "Api FHIR",
										"function": "getEncounterStatusCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		encounterType: function getEncounterType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('encounterType', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterType"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterType = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (encounterType.err_code == 0) {
									//cek jumdata dulu
									if (encounterType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Type is not found "
										});
									}
								} else {
									res.json(encounterType);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('encounterType', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEncounterType"
									});
								} else {
									//cek apakah ada error atau tidak
									var encounterType = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (encounterType.err_code == 0) {
										//cek jum data dulu
										if (encounterType.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": encounterType.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": " Encounter Type is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": encounterType.error,
											"application": "Api FHIR",
											"function": "getEncounterType"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		encounterTypeCode: function getEncounterTypeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace("/", "<or>").trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('encounterTypeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEncounterTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var encounterTypeCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (encounterTypeCode.err_code == 0) {
									//cek jum data dulu
									if (encounterTypeCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": encounterTypeCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Encounter Type Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": encounterTypeCode.error,
										"application": "Api FHIR",
										"function": "getEncounterTypeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		episodeOfCareStatus: function getEpisodeOfCareStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('episodeOfCareStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEpisodeOfCareStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var episodeOfCareStatus = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (episodeOfCareStatus.err_code == 0) {
									//cek jumdata dulu
									if (episodeOfCareStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": episodeOfCareStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Episode Of Care Status is not found "
										});
									}
								} else {
									res.json(episodeOfCareStatus);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('episodeOfCareStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEpisodeOfCareStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var episodeOfCareStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (episodeOfCareStatus.err_code == 0) {
										//cek jum data dulu
										if (episodeOfCareStatus.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": episodeOfCareStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Episode Of Care Status is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": episodeOfCareStatus.error,
											"application": "Api FHIR",
											"function": "getEpisodeOfCareStatus"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		episodeOfCareStatusCode: function getEpisodeOfCareStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('episodeOfCareStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEpisodeOfCareStatusCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var episodeOfCareStatusCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (episodeOfCareStatusCode.err_code == 0) {
									//cek jum data dulu
									if (episodeOfCareStatusCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": episodeOfCareStatusCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Episode Of Care Status Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": episodeOfCareStatusCode.error,
										"application": "Api FHIR",
										"function": "getEpisodeOfCareStatusCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		episodeOfCareType: function getEpisodeOfCareType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('episodeOfCareType', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEpisodeOfCareType"
								});
							} else {
								//cek apakah ada error atau tidak
								var episodeOfCareType = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (episodeOfCareType.err_code == 0) {
									//cek jumdata dulu
									if (episodeOfCareType.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": episodeOfCareType.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Episode Of Care Type is not found "
										});
									}
								} else {
									res.json(episodeOfCareType);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('episodeOfCareType', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getEpisodeOfCareType"
									});
								} else {
									//cek apakah ada error atau tidak
									var episodeOfCareType = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (episodeOfCareType.err_code == 0) {
										//cek jum data dulu
										if (episodeOfCareType.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": episodeOfCareType.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": " Episode Of Care Type is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": episodeOfCareType.error,
											"application": "Api FHIR",
											"function": "getEpisodeOfCareType"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		episodeOfCareTypeCode: function getEpisodeOfCareTypeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('episodeOfCareTypeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getEpisodeOfCareTypeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var episodeOfCareTypeCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (episodeOfCareTypeCode.err_code == 0) {
									//cek jum data dulu
									if (episodeOfCareTypeCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": episodeOfCareTypeCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Episode Of Care  Type Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": episodeOfCareTypeCode.error,
										"application": "Api FHIR",
										"function": "getEpisodeOfCareTypeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		flagStatus: function getFlagStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('flagStatus', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getFlagStatus"
								});
							} else {
								//cek apakah ada error atau tidak
								var flagStatus = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (flagStatus.err_code == 0) {
									//cek jumdata dulu
									if (flagStatus.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": flagStatus.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Flag Status is not found "
										});
									}
								} else {
									res.json(flagStatus);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('flagStatus', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getFlagStatus"
									});
								} else {
									//cek apakah ada error atau tidak
									var flagStatus = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (flagStatus.err_code == 0) {
										//cek jum data dulu
										if (flagStatus.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": flagStatus.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": " Flag Status is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": flagStatus.error,
											"application": "Api FHIR",
											"function": "getFlagStatus"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		flagStatusCode: function getFlagStatusCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('flagStatusCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getFlagStatusCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var flagStatusCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (flagStatusCode.err_code == 0) {
									//cek jum data dulu
									if (flagStatusCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": flagStatusCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Flag Status Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": flagStatusCode.error,
										"application": "Api FHIR",
										"function": "getFlagStatusCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		flagCategory: function getFlagCategory(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('flagCategory', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getFlagCategory"
								});
							} else {
								//cek apakah ada error atau tidak
								var flagCategory = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (flagCategory.err_code == 0) {
									//cek jumdata dulu
									if (flagCategory.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": flagCategory.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Flag  Category is not found "
										});
									}
								} else {
									res.json(flagCategory);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('flagCategory', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getFlagCategory"
									});
								} else {
									//cek apakah ada error atau tidak
									var flagCategory = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (flagCategory.err_code == 0) {
										//cek jum data dulu
										if (flagCategory.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": flagCategory.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Flag  Category is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": flagCategory.error,
											"application": "Api FHIR",
											"function": "getFlagCategory"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		flagCategoryCode: function getFlagCategoryCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('flagCategoryCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getFlagCategoryCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var flagCategoryCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (flagCategoryCode.err_code == 0) {
									//cek jum data dulu
									if (flagCategoryCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": flagCategoryCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Flag  Category Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": flagCategoryCode.error,
										"application": "Api FHIR",
										"function": "getFlagCategoryCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		flagCode: function getFlagCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('flagCode', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getFlagCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var flagCode = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (flagCode.err_code == 0) {
									//cek jumdata dulu
									if (flagCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": flagCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Flag Code is not found "
										});
									}
								} else {
									res.json(flagCode);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('flagCode', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getFlagCode"
									});
								} else {
									//cek apakah ada error atau tidak
									var flagCode = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (flagCode.err_code == 0) {
										//cek jum data dulu
										if (flagCode.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": flagCode.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Flag Code is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": flagCode.error,
											"application": "Api FHIR",
											"function": "getFlagCode"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		flagCodeCode: function getFlagCodeCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('flagCodeCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getFlagCodeCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var flagCodeCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (flagCodeCode.err_code == 0) {
									//cek jum data dulu
									if (flagCodeCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": flagCodeCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Flag Code Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": flagCodeCode.error,
										"application": "Api FHIR",
										"function": "getFlagCodeCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		reAdmissionIndicator: function getReAdmissionIndicator(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					if (_id == "" || typeof _id == 'undefined') {
						//method, endpoint, params, options, callback
						ApiFHIR.get('reAdmissionIndicator', {
							"apikey": apikey,
							"_id": 0
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getReAdmissionIndicator"
								});
							} else {
								//cek apakah ada error atau tidak
								var reAdmissionIndicator = JSON.parse(body);
								//cara cek error
								//console.log (actEncounterCode)
								//cek apakah ada error atau tidak
								if (reAdmissionIndicator.err_code == 0) {
									//cek jumdata dulu
									if (reAdmissionIndicator.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": reAdmissionIndicator.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Re Admission Indicator is not found "
										});
									}
								} else {
									res.json(reAdmissionIndicator);
								}
							}
						})
					} else {
						if (validator.isInt(_id)) {
							ApiFHIR.get('reAdmissionIndicator', {
								"apikey": apikey,
								"_id": _id
							}, {}, function (error, response, body) {
								if (error) {
									res.json({
										"err_code": 1,
										"err_msg": error,
										"application": "Api FHIR",
										"function": "getReAdmissionIndicator"
									});
								} else {
									//cek apakah ada error atau tidak
									var reAdmissionIndicator = JSON.parse(body);

									//cek apakah ada error atau tidak
									if (reAdmissionIndicator.err_code == 0) {
										//cek jum data dulu
										if (reAdmissionIndicator.data.length > 0) {
											res.json({
												"err_code": 0,
												"data": reAdmissionIndicator.data
											});
										} else {
											res.json({
												"err_code": 2,
												"err_msg": "Re Admission Indicator is not found"
											});
										}
									} else {
										res.json({
											"err_code": 3,
											"err_msg": reAdmissionIndicator.error,
											"application": "Api FHIR",
											"function": "getReAdmissionIndicator"
										});
									}
								}
							})
						} else {
							res.json({
								"err_code": 4,
								"err_msg": "Id must be a number."
							});
						}

					}
				} else {
					result.err_code = 500;
					res.json(result);
				}
			});
		},
		reAdmissionIndicatorCode: function getReAdmissionIndicatorCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if (code == "" || typeof code == 'undefined') {
				res.json({
					"err_code": 4,
					"err_msg": "Code is required."
				});
			} else {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						ApiFHIR.get('reAdmissionIndicatorCode', {
							"apikey": apikey,
							"code": code
						}, {}, function (error, response, body) {
							if (error) {
								res.json({
									"err_code": 1,
									"err_msg": error,
									"application": "Api FHIR",
									"function": "getReAdmissionIndicatorCode"
								});
							} else {
								//cek apakah ada error atau tidak
								var reAdmissionIndicatorCode = JSON.parse(body);

								//cek apakah ada error atau tidak
								if (reAdmissionIndicatorCode.err_code == 0) {
									//cek jum data dulu
									if (reAdmissionIndicatorCode.data.length > 0) {
										res.json({
											"err_code": 0,
											"data": reAdmissionIndicatorCode.data
										});
									} else {
										res.json({
											"err_code": 2,
											"err_msg": "Re Admission Indicator Code is not found"
										});
									}
								} else {
									res.json({
										"err_code": 3,
										"err_msg": reAdmissionIndicatorCode.error,
										"application": "Api FHIR",
										"function": "getReAdmissionIndicatorCode"
									});
								}
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			}
		},
		udiEntryType: function getUdiEntryType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('udiEntryType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getUdiEntryType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var udiEntryType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(udiEntryType.err_code == 0){
								  	//cek jumdata dulu
								  	if(udiEntryType.data.length > 0){
								  		res.json({"err_code": 0, "data":udiEntryType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Udi Entry Type is not found"});	
								  	}
							  	}else{
							  		res.json(udiEntryType);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('udiEntryType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getUdiEntryType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var udiEntryType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(udiEntryType.err_code == 0){
									  	//cek jumdata dulu
									  	if(udiEntryType.data.length > 0){
									  		res.json({"err_code": 0, "data":udiEntryType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Udi Entry Type is not found"});	
									  	}
								  	}else{
								  		res.json(udiEntryType);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		udiEntryTypeCode: function getUdiEntryTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('udiEntryTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getUdiEntryTypeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var udiEntryType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(udiEntryType.err_code == 0){
								  	//cek jumdata dulu
								  	if(udiEntryType.data.length > 0){
								  		res.json({"err_code": 0, "data":udiEntryType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Udi Entry Type Code is not found"});	
								  	}
							  	}else{
							  		res.json(udiEntryType);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		deviceStatus: function getDeviceStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('deviceStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDeviceStatus"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var deviceStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(deviceStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":deviceStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device Status is not found"});	
								  	}
							  	}else{
							  		res.json(deviceStatus);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('deviceStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDeviceStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var deviceStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(deviceStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(deviceStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":deviceStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Device Status is not found"});	
									  	}
								  	}else{
								  		res.json(deviceStatus);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		deviceStatusCode: function getDeviceStatusCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('udiEntryTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getUdiEntryTypeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var udiEntryType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(udiEntryType.err_code == 0){
								  	//cek jumdata dulu
								  	if(udiEntryType.data.length > 0){
								  		res.json({"err_code": 0, "data":udiEntryType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Udi Entry Type Code is not found"});	
								  	}
							  	}else{
							  		res.json(udiEntryType);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		deviceKind: function getdeviceKind(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('deviceKind', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getdeviceKind"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var deviceKind = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(deviceKind.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceKind.data.length > 0){
								  		res.json({"err_code": 0, "data":deviceKind.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device Kind is not found"});	
								  	}
							  	}else{
							  		res.json(deviceKind);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('deviceKind', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getdeviceKind"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var deviceKind = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(deviceKind.err_code == 0){
									  	//cek jumdata dulu
									  	if(deviceKind.data.length > 0){
									  		res.json({"err_code": 0, "data":deviceKind.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Device Kind is not found"});	
									  	}
								  	}else{
								  		res.json(deviceKind);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		deviceKindCode: function getdeviceKindCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('deviceKindCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getdeviceKindCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var deviceKind = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(deviceKind.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceKind.data.length > 0){
								  		res.json({"err_code": 0, "data":deviceKind.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device Kind Code is not found"});	
								  	}
							  	}else{
							  		res.json(deviceKind);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		deviceSafety: function getDeviceSafety(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('deviceSafety', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDeviceSafety"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var deviceSafety = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(deviceSafety.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceSafety.data.length > 0){
								  		res.json({"err_code": 0, "data":deviceSafety.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device Safety is not found"});	
								  	}
							  	}else{
							  		res.json(deviceSafety);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('deviceSafety', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDeviceSafety"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var deviceSafety = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(deviceSafety.err_code == 0){
									  	//cek jumdata dulu
									  	if(deviceSafety.data.length > 0){
									  		res.json({"err_code": 0, "data":deviceSafety.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Device Safety is not found"});	
									  	}
								  	}else{
								  		res.json(deviceSafety);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		deviceSafetyCode: function getDeviceSafetyCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('deviceSafetyCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDeviceSafetyCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var deviceSafety = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(deviceSafety.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceSafety.data.length > 0){
								  		res.json({"err_code": 0, "data":deviceSafety.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device Safety Code is not found"});	
								  	}
							  	}else{
							  		res.json(deviceSafety);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		operationalStatus: function getOperationalStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('operationalStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getOperationalStatus"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var operationalStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(operationalStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(operationalStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":operationalStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Operational Status is not found"});	
								  	}
							  	}else{
							  		res.json(operationalStatus);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('operationalStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getOperationalStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var operationalStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(operationalStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(operationalStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":operationalStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Operational Status is not found"});	
									  	}
								  	}else{
								  		res.json(operationalStatus);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		operationalStatusCode: function getOperationalStatusCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('operationalStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getOperationalStatusCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var operationalStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(operationalStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(operationalStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":operationalStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Operational Status Code is not found"});	
								  	}
							  	}else{
							  		res.json(operationalStatus);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		parameterGroup: function getParameterGroup(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('parameterGroup', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getParameterGroup"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var parameterGroup = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(parameterGroup.err_code == 0){
								  	//cek jumdata dulu
								  	if(parameterGroup.data.length > 0){
								  		res.json({"err_code": 0, "data":parameterGroup.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Parameter Group is not found"});	
								  	}
							  	}else{
							  		res.json(parameterGroup);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('parameterGroup', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getParameterGroup"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var parameterGroup = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(parameterGroup.err_code == 0){
									  	//cek jumdata dulu
									  	if(parameterGroup.data.length > 0){
									  		res.json({"err_code": 0, "data":parameterGroup.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Parameter Group is not found"});	
									  	}
								  	}else{
								  		res.json(parameterGroup);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		parameterGroupCode: function getParameterGroupCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('parameterGroupCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getParameterGroupCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var parameterGroup = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(parameterGroup.err_code == 0){
								  	//cek jumdata dulu
								  	if(parameterGroup.data.length > 0){
								  		res.json({"err_code": 0, "data":parameterGroup.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Parameter Group Code is not found"});	
								  	}
							  	}else{
							  		res.json(parameterGroup);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		measurementPrinciple: function getMeasurementPrinciple(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('measurementPrinciple', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMeasurementPrinciple"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var measurementPrinciple = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(measurementPrinciple.err_code == 0){
								  	//cek jumdata dulu
								  	if(measurementPrinciple.data.length > 0){
								  		res.json({"err_code": 0, "data":measurementPrinciple.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Measurement Principle is not found"});	
								  	}
							  	}else{
							  		res.json(measurementPrinciple);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('measurementPrinciple', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMeasurementPrinciple"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var measurementPrinciple = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(measurementPrinciple.err_code == 0){
									  	//cek jumdata dulu
									  	if(measurementPrinciple.data.length > 0){
									  		res.json({"err_code": 0, "data":measurementPrinciple.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Measurement Principle is not found"});	
									  	}
								  	}else{
								  		res.json(measurementPrinciple);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		measurementPrincipleCode: function getMeasurementPrincipleCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('measurementPrincipleCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMeasurementPrincipleCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var measurementPrinciple = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(measurementPrinciple.err_code == 0){
								  	//cek jumdata dulu
								  	if(measurementPrinciple.data.length > 0){
								  		res.json({"err_code": 0, "data":measurementPrinciple.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Measurement Principle Code is not found"});	
								  	}
							  	}else{
							  		res.json(measurementPrinciple);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		specificationType: function getSpecificationType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('specificationType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSpecificationType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var specificationType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(specificationType.err_code == 0){
								  	//cek jumdata dulu
								  	if(specificationType.data.length > 0){
								  		res.json({"err_code": 0, "data":specificationType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Specification Type is not found"});	
								  	}
							  	}else{
							  		res.json(specificationType);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('specificationType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSpecificationType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var specificationType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(specificationType.err_code == 0){
									  	//cek jumdata dulu
									  	if(specificationType.data.length > 0){
									  		res.json({"err_code": 0, "data":specificationType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Specification Type is not found"});	
									  	}
								  	}else{
								  		res.json(specificationType);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		specificationTypeCode: function getSpecificationTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('specificationTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSpecificationTypeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var specificationType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(specificationType.err_code == 0){
								  	//cek jumdata dulu
								  	if(specificationType.data.length > 0){
								  		res.json({"err_code": 0, "data":specificationType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Specification Type Code is not found"});	
								  	}
							  	}else{
							  		res.json(specificationType);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		metricOperationalStatus: function getMetricOperationalStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('metricOperationalStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricOperationalStatus"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricOperationalStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricOperationalStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricOperationalStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":metricOperationalStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Operational Status is not found"});	
								  	}
							  	}else{
							  		res.json(metricOperationalStatus);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('metricOperationalStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricOperationalStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricOperationalStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(metricOperationalStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(metricOperationalStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":metricOperationalStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Metric Operational Status is not found"});	
									  	}
								  	}else{
								  		res.json(metricOperationalStatus);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		metricOperationalStatusCode: function getMetricOperationalStatusCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('metricOperationalStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricOperationalStatusCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricOperationalStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricOperationalStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricOperationalStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":metricOperationalStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Operational Status Code is not found"});	
								  	}
							  	}else{
							  		res.json(metricOperationalStatus);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		deviceMetricType: function getDeviceMetricType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('deviceMetricType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDeviceMetricType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var deviceMetricType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(deviceMetricType.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceMetricType.data.length > 0){
								  		res.json({"err_code": 0, "data":deviceMetricType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device Metric Type is not found"});	
								  	}
							  	}else{
							  		res.json(deviceMetricType);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('deviceMetricType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDeviceMetricType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var deviceMetricType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(deviceMetricType.err_code == 0){
									  	//cek jumdata dulu
									  	if(deviceMetricType.data.length > 0){
									  		res.json({"err_code": 0, "data":deviceMetricType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Device Metric Type is not found"});	
									  	}
								  	}else{
								  		res.json(deviceMetricType);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		deviceMetricTypeCode: function getDeviceMetricTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-:]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('deviceMetricTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDeviceMetricTypeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var deviceMetricType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(deviceMetricType.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceMetricType.data.length > 0){
								  		res.json({"err_code": 0, "data":deviceMetricType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device Metric Type Code is not found"});	
								  	}
							  	}else{
							  		res.json(deviceMetricType);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		metricColor: function getMetricColor(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('metricColor', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricColor"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricColor = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricColor.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricColor.data.length > 0){
								  		res.json({"err_code": 0, "data":metricColor.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Color is not found"});	
								  	}
							  	}else{
							  		res.json(metricColor);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('metricColor', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricColor"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricColor = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(metricColor.err_code == 0){
									  	//cek jumdata dulu
									  	if(metricColor.data.length > 0){
									  		res.json({"err_code": 0, "data":metricColor.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Metric Color is not found"});	
									  	}
								  	}else{
								  		res.json(metricColor);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		metricColorCode: function getMetricColorCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-:]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('metricColorCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricColorCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricColor = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricColor.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricColor.data.length > 0){
								  		res.json({"err_code": 0, "data":metricColor.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Color Code is not found"});	
								  	}
							  	}else{
							  		res.json(metricColor);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		metricCategory: function getMetricCategory(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('metricCategory', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricCategory"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricCategory = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricCategory.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricCategory.data.length > 0){
								  		res.json({"err_code": 0, "data":metricCategory.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Category is not found"});	
								  	}
							  	}else{
							  		res.json(metricCategory);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('metricCategory', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricCategory"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricCategory = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(metricCategory.err_code == 0){
									  	//cek jumdata dulu
									  	if(metricCategory.data.length > 0){
									  		res.json({"err_code": 0, "data":metricCategory.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Metric Category is not found"});	
									  	}
								  	}else{
								  		res.json(metricCategory);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		metricCategoryCode: function getMetricCategoryCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-:]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('metricCategoryCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricCategoryCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricCategory = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricCategory.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricCategory.data.length > 0){
								  		res.json({"err_code": 0, "data":metricCategory.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Category Code is not found"});	
								  	}
							  	}else{
							  		res.json(metricCategory);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		metricCalibrationType: function getMetricCalibrationType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('metricCalibrationType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricCalibrationType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricCalibrationType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricCalibrationType.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricCalibrationType.data.length > 0){
								  		res.json({"err_code": 0, "data":metricCalibrationType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Calibration Type is not found"});	
								  	}
							  	}else{
							  		res.json(metricCalibrationType);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('metricCalibrationType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricCalibrationType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricCalibrationType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(metricCalibrationType.err_code == 0){
									  	//cek jumdata dulu
									  	if(metricCalibrationType.data.length > 0){
									  		res.json({"err_code": 0, "data":metricCalibrationType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Metric Calibration Type is not found"});	
									  	}
								  	}else{
								  		res.json(metricCalibrationType);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		metricCalibrationTypeCode: function getMetricCalibrationTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-:]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('metricCalibrationTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricCalibrationTypeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricCalibrationType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricCalibrationType.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricCalibrationType.data.length > 0){
								  		res.json({"err_code": 0, "data":metricCalibrationType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Calibration Type Code is not found"});	
								  	}
							  	}else{
							  		res.json(metricCalibrationType);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
		metricCalibrationState: function getMetricCalibrationState(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('metricCalibrationState', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricCalibrationState"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricCalibrationState = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricCalibrationState.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricCalibrationState.data.length > 0){
								  		res.json({"err_code": 0, "data":metricCalibrationState.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Calibration State is not found"});	
								  	}
							  	}else{
							  		res.json(metricCalibrationState);
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('metricCalibrationState', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricCalibrationState"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricCalibrationState = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(metricCalibrationState.err_code == 0){
									  	//cek jumdata dulu
									  	if(metricCalibrationState.data.length > 0){
									  		res.json({"err_code": 0, "data":metricCalibrationState.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Metric Calibration State is not found"});	
									  	}
								  	}else{
								  		res.json(metricCalibrationState);
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		metricCalibrationStateCode: function getMetricCalibrationStateCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,-:]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('metricCalibrationStateCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getMetricCalibrationStateCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var metricCalibrationState = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(metricCalibrationState.err_code == 0){
								  	//cek jumdata dulu
								  	if(metricCalibrationState.data.length > 0){
								  		res.json({"err_code": 0, "data":metricCalibrationState.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Metric Calibration State Code is not found"});	
								  	}
							  	}else{
							  		res.json(metricCalibrationState);
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}
		},
    substanceStatus: function getSubstanceStatus(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var _id = req.params._id;

      
      checkApikey(apikey, ipAddres, function(result){
        if(result.err_code == 0){
          if(_id == "" || typeof _id == 'undefined'){
            //method, endpoint, params, options, callback
            ApiFHIR.get('substanceStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
              if(error){
                  res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSubstanceStatus"});
                }else{
                  //cek apakah ada error atau tidak
                  var substanceStatus = JSON.parse(body); 
                  
                  //cek apakah ada error atau tidak
                  if(substanceStatus.err_code == 0){
                    //cek jumdata dulu
                    if(substanceStatus.data.length > 0){
                      res.json({"err_code": 0, "data":substanceStatus.data});
                    }else{
                      res.json({"err_code": 2, "err_msg": "Substance Status is not found"});  
                    }
                  }else{
                    res.json(substanceStatus);
                  }
                }
            })  
          }else{
            if(validator.isInt(_id)){
              ApiFHIR.get('substanceStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
                if(error){
                    res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSubstanceStatus"});
                  }else{
                    //cek apakah ada error atau tidak
                    var substanceStatus = JSON.parse(body); 
                    
                    //cek apakah ada error atau tidak
                    if(substanceStatus.err_code == 0){
                      //cek jumdata dulu
                      if(substanceStatus.data.length > 0){
                        res.json({"err_code": 0, "data":substanceStatus.data});
                      }else{
                        res.json({"err_code": 2, "err_msg": "Substance Status is not found"});  
                      }
                    }else{
                      res.json(substanceStatus);
                    }
                  }
              })
            }else{
              res.json({"err_code": 4, "err_msg": "Id must be a number."});
            }
            
          }
        }else{
          result.err_code = 500;
          res.json(result);
        } 
      });
    },
    substanceStatusCode: function getSubstanceStatusCode(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var code = req.params.code.replace(/[^\w\s ,-:]/gi, '').trim().toLowerCase();

      if(code == "" || typeof code == 'undefined'){
        res.json({"err_code": 4, "err_msg": "Code is required."});
      }else{
        checkApikey(apikey, ipAddres, function(result){
          if(result.err_code == 0){ 
            ApiFHIR.get('substanceStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
              if(error){
                  res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSubstanceStatusCode"});
                }else{
                  //cek apakah ada error atau tidak
                  var substanceStatus = JSON.parse(body); 
                  
                  //cek apakah ada error atau tidak
                  if(substanceStatus.err_code == 0){
                    //cek jumdata dulu
                    if(substanceStatus.data.length > 0){
                      res.json({"err_code": 0, "data":substanceStatus.data});
                    }else{
                      res.json({"err_code": 2, "err_msg": "Substance Status Code is not found"}); 
                    }
                  }else{
                    res.json(substanceStatus);
                  }
                }
            })
          }else{
            result.err_code = 500;
            res.json(result);
          } 
        });
      }
    },
    substanceCategory: function getSubstanceCategory(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var _id = req.params._id;

      
      checkApikey(apikey, ipAddres, function(result){
        if(result.err_code == 0){
          if(_id == "" || typeof _id == 'undefined'){
            //method, endpoint, params, options, callback
            ApiFHIR.get('substanceCategory', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
              if(error){
                  res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSubstanceCategory"});
                }else{
                  //cek apakah ada error atau tidak
                  var substanceCategory = JSON.parse(body); 
                  
                  //cek apakah ada error atau tidak
                  if(substanceCategory.err_code == 0){
                    //cek jumdata dulu
                    if(substanceCategory.data.length > 0){
                      res.json({"err_code": 0, "data":substanceCategory.data});
                    }else{
                      res.json({"err_code": 2, "err_msg": "Substance Category is not found"});  
                    }
                  }else{
                    res.json(substanceCategory);
                  }
                }
            })  
          }else{
            if(validator.isInt(_id)){
              ApiFHIR.get('substanceCategory', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
                if(error){
                    res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSubstanceCategory"});
                  }else{
                    //cek apakah ada error atau tidak
                    var substanceCategory = JSON.parse(body); 
                    
                    //cek apakah ada error atau tidak
                    if(substanceCategory.err_code == 0){
                      //cek jumdata dulu
                      if(substanceCategory.data.length > 0){
                        res.json({"err_code": 0, "data":substanceCategory.data});
                      }else{
                        res.json({"err_code": 2, "err_msg": "Substance Category is not found"});  
                      }
                    }else{
                      res.json(substanceCategory);
                    }
                  }
              })
            }else{
              res.json({"err_code": 4, "err_msg": "Id must be a number."});
            }
            
          }
        }else{
          result.err_code = 500;
          res.json(result);
        } 
      });
    },
    substanceCategoryCode: function getSubstanceCategoryCode(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var code = req.params.code.replace(/[^\w\s ,-:]/gi, '').trim().toLowerCase();

      if(code == "" || typeof code == 'undefined'){
        res.json({"err_code": 4, "err_msg": "Code is required."});
      }else{
        checkApikey(apikey, ipAddres, function(result){
          if(result.err_code == 0){ 
            ApiFHIR.get('substanceCategoryCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
              if(error){
                  res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSubstanceCategoryCode"});
                }else{
                  //cek apakah ada error atau tidak
                  var substanceCategory = JSON.parse(body); 
                  
                  //cek apakah ada error atau tidak
                  if(substanceCategory.err_code == 0){
                    //cek jumdata dulu
                    if(substanceCategory.data.length > 0){
                      res.json({"err_code": 0, "data":substanceCategory.data});
                    }else{
                      res.json({"err_code": 2, "err_msg": "Substance Category Code is not found"}); 
                    }
                  }else{
                    res.json(substanceCategory);
                  }
                }
            })
          }else{
            result.err_code = 500;
            res.json(result);
          } 
        });
      }
    },
    substanceCode: function getSubstanceCode(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var _id = req.params._id;

      
      checkApikey(apikey, ipAddres, function(result){
        if(result.err_code == 0){
          if(_id == "" || typeof _id == 'undefined'){
            //method, endpoint, params, options, callback
            ApiFHIR.get('substanceCode', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
              if(error){
                  res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSubstanceCode"});
                }else{
                  //cek apakah ada error atau tidak
                  var substanceCode = JSON.parse(body); 
                  
                  //cek apakah ada error atau tidak
                  if(substanceCode.err_code == 0){
                    //cek jumdata dulu
                    if(substanceCode.data.length > 0){
                      res.json({"err_code": 0, "data":substanceCode.data});
                    }else{
                      res.json({"err_code": 2, "err_msg": "Substance Code is not found"});  
                    }
                  }else{
                    res.json(substanceCode);
                  }
                }
            })  
          }else{
            if(validator.isInt(_id)){
              ApiFHIR.get('substanceCode', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
                if(error){
                    res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSubstanceCode"});
                  }else{
                    //cek apakah ada error atau tidak
                    var substanceCode = JSON.parse(body); 
                    
                    //cek apakah ada error atau tidak
                    if(substanceCode.err_code == 0){
                      //cek jumdata dulu
                      if(substanceCode.data.length > 0){
                        res.json({"err_code": 0, "data":substanceCode.data});
                      }else{
                        res.json({"err_code": 2, "err_msg": "Substance Code is not found"});  
                      }
                    }else{
                      res.json(substanceCode);
                    }
                  }
              })
            }else{
              res.json({"err_code": 4, "err_msg": "Id must be a number."});
            }
            
          }
        }else{
          result.err_code = 500;
          res.json(result);
        } 
      });
    },
    substanceCodeCode: function getSubstanceCodeCode(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var code = req.params.code.replace(/[^\w\s ,-:]/gi, '').trim().toLowerCase();

      if(code == "" || typeof code == 'undefined'){
        res.json({"err_code": 4, "err_msg": "Code is required."});
      }else{
        checkApikey(apikey, ipAddres, function(result){
          if(result.err_code == 0){ 
            ApiFHIR.get('substanceCodeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
              if(error){
                  res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getSubstanceCodeCode"});
                }else{
                  //cek apakah ada error atau tidak
                  var substanceCode = JSON.parse(body); 
                  
                  //cek apakah ada error atau tidak
                  if(substanceCode.err_code == 0){
                    //cek jumdata dulu
                    if(substanceCode.data.length > 0){
                      res.json({"err_code": 0, "data":substanceCode.data});
                    }else{
                      res.json({"err_code": 2, "err_msg": "Substance Code, code is not found"}); 
                    }
                  }else{
                    res.json(substanceCode);
                  }
                }
            })
          }else{
            result.err_code = 500;
            res.json(result);
          } 
        });
      }
    },
		organizationType: function getOrganizationType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('organizationType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getOrganizationType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var organizationType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(organizationType.err_code == 0){
								  	//cek jumdata dulu
								  	if(organizationType.data.length > 0){
								  		res.json({"err_code": 0, "data":organizationType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Organization Type is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": organizationType.error, "application": "Api FHIR", "function": "getOrganizationType"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('organizationType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getOrganizationType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var organizationType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(organizationType.err_code == 0){
									  	//cek jumdata dulu
									  	if(organizationType.data.length > 0){
									  		res.json({"err_code": 0, "data":organizationType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Organization Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": organizationType.error, "application": "Api FHIR", "function": "getOrganizationType"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		organizationTypeCode: function getOrganizationTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('organizationTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getOrganizationTypeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var organizationType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(organizationType.err_code == 0){
								  	//cek jumdata dulu
								  	if(organizationType.data.length > 0){
								  		res.json({"err_code": 0, "data":organizationType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Organization Type Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": organizationType.error, "application": "Api FHIR", "function": "getOrganizationTypeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		contactentityType: function getContactentityType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('contactentityType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactentityType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var contactentityType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(contactentityType.err_code == 0){
								  	//cek jumdata dulu
								  	if(contactentityType.data.length > 0){
								  		res.json({"err_code": 0, "data":contactentityType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Contact Entity Type is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": contactentityType.error, "application": "Api FHIR", "function": "getContactentityType"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('contactentityType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactentityType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var contactentityType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(contactentityType.err_code == 0){
									  	//cek jumdata dulu
									  	if(contactentityType.data.length > 0){
									  		res.json({"err_code": 0, "data":contactentityType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Contact Entity Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": contactentityType.error, "application": "Api FHIR", "function": "getContactentityType"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		contactentityTypeCode: function getContactentityTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('contactentityTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getContactentityTypeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var contactentityType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(contactentityType.err_code == 0){
								  	//cek jumdata dulu
								  	if(contactentityType.data.length > 0){
								  		res.json({"err_code": 0, "data":contactentityType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Contactentity Type Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": contactentityType.error, "application": "Api FHIR", "function": "getContactentityTypeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		locationStatus: function getLocationStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('locationStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLocationStatus"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var locationStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(locationStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(locationStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":locationStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Location Status is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": locationStatus.error, "application": "Api FHIR", "function": "getLocationStatus"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('locationStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLocationStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var locationStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(locationStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(locationStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":locationStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Location Status is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": locationStatus.error, "application": "Api FHIR", "function": "getLocationStatus"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		locationStatusCode: function getLocationStatusCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('locationStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLocationStatusCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var locationStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(locationStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(locationStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":locationStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Location Status Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": locationStatus.error, "application": "Api FHIR", "function": "getLocationStatusCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		bedStatus: function getBedStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('bedStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getBedStatus"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var bedStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(bedStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(bedStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":bedStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Bed Status is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": bedStatus.error, "application": "Api FHIR", "function": "getBedStatus"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('bedStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getBedStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var bedStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(bedStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(bedStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":bedStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Bed Status is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": bedStatus.error, "application": "Api FHIR", "function": "getBedStatus"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		bedStatusCode: function getBedStatusCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('bedStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getBedStatusCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var bedStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(bedStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(bedStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":bedStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Bed Status Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": bedStatus.error, "application": "Api FHIR", "function": "getBedStatusCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		locationMode: function getLocationMode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('locationMode', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLocationMode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var locationMode = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(locationMode.err_code == 0){
								  	//cek jumdata dulu
								  	if(locationMode.data.length > 0){
								  		res.json({"err_code": 0, "data":locationMode.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Location Mode is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": locationMode.error, "application": "Api FHIR", "function": "getLocationMode"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('locationMode', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLocationMode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var locationMode = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(locationMode.err_code == 0){
									  	//cek jumdata dulu
									  	if(locationMode.data.length > 0){
									  		res.json({"err_code": 0, "data":locationMode.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Location Mode is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": locationMode.error, "application": "Api FHIR", "function": "getLocationMode"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		locationModeCode: function getLocationModeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('locationModeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLocationModeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var locationMode = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(locationMode.err_code == 0){
								  	//cek jumdata dulu
								  	if(locationMode.data.length > 0){
								  		res.json({"err_code": 0, "data":locationMode.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Location Mode Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": locationMode.error, "application": "Api FHIR", "function": "getLocationModeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		serviceDeliveryLocationRoleType: function getServiceDeliveryLocationRoleType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('serviceDeliveryLocationRoleType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceDeliveryLocationRoleType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceDeliveryLocationRoleType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceDeliveryLocationRoleType.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceDeliveryLocationRoleType.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceDeliveryLocationRoleType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Delivery Location Role Type is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceDeliveryLocationRoleType.error, "application": "Api FHIR", "function": "getServiceDeliveryLocationRoleType"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('serviceDeliveryLocationRoleType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceDeliveryLocationRoleType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var serviceDeliveryLocationRoleType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(serviceDeliveryLocationRoleType.err_code == 0){
									  	//cek jumdata dulu
									  	if(serviceDeliveryLocationRoleType.data.length > 0){
									  		res.json({"err_code": 0, "data":locationMode.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Service Delivery Location Role Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": serviceDeliveryLocationRoleType.error, "application": "Api FHIR", "function": "getServiceDeliveryLocationRoleType"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		serviceDeliveryLocationRoleTypeCode: function getServiceDeliveryLocationRoleTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('serviceDeliveryLocationRoleTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceDeliveryLocationRoleTypeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceDeliveryLocationRoleType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceDeliveryLocationRoleType.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceDeliveryLocationRoleType.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceDeliveryLocationRoleType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Delivery Location Role Type Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceDeliveryLocationRoleType.error, "application": "Api FHIR", "function": "getServiceDeliveryLocationRoleTypeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		locationPhysicalType: function getLocationPhysicalType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('locationPhysicalType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLocationPhysicalType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var locationPhysicalType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(locationPhysicalType.err_code == 0){
								  	//cek jumdata dulu
								  	if(locationPhysicalType.data.length > 0){
								  		res.json({"err_code": 0, "data":locationPhysicalType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Location Physical Type is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": locationPhysicalType.error, "application": "Api FHIR", "function": "getLocationPhysicalType"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('locationPhysicalType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLocationPhysicalType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var locationPhysicalType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(locationPhysicalType.err_code == 0){
									  	//cek jumdata dulu
									  	if(locationPhysicalType.data.length > 0){
									  		res.json({"err_code": 0, "data":locationPhysicalType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Location Physical Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": locationPhysicalType.error, "application": "Api FHIR", "function": "getLocationPhysicalType"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		locationPhysicalTypeCode: function getLocationPhysicalTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('locationPhysicalTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getLocationPhysicalType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var locationPhysicalType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(locationPhysicalType.err_code == 0){
								  	//cek jumdata dulu
								  	if(locationPhysicalType.data.length > 0){
								  		res.json({"err_code": 0, "data":locationPhysicalType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Location Physical Type Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": locationPhysicalType.error, "application": "Api FHIR", "function": "getLocationPhysicalTypeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		qualificationCode: function getQualificationCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('qualificationCode', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getQualificationCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var qualificationCode = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(qualificationCode.err_code == 0){
								  	//cek jumdata dulu
								  	if(qualificationCode.data.length > 0){
								  		res.json({"err_code": 0, "data":qualificationCode.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Qualification Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": qualificationCode.error, "application": "Api FHIR", "function": "getQualificationCode"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('qualificationCode', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getQualificationCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var qualificationCode = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(qualificationCode.err_code == 0){
									  	//cek jumdata dulu
									  	if(qualificationCode.data.length > 0){
									  		res.json({"err_code": 0, "data":qualificationCode.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Qualification Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": qualificationCode.error, "application": "Api FHIR", "function": "getQualificationCode"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		qualificationCodeCode: function getQualificationCodeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toUpperCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('qualificationCodeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getQualificationCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var qualificationCode = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(qualificationCode.err_code == 0){
								  	//cek jumdata dulu
								  	if(qualificationCode.data.length > 0){
								  		res.json({"err_code": 0, "data":qualificationCode.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Qualification Code Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": qualificationCode.error, "application": "Api FHIR", "function": "getQualificationCodeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		practitionerRoleCode: function getPractitionerRoleCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('practitionerRoleCode', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getPractitionerRoleCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var practitionerRoleCode = JSON.parse(body); 
							  	//cek apakah ada error atau tidak
							  	if(practitionerRoleCode.err_code == 0){
								  	//cek jumdata dulu
								  	if(practitionerRoleCode.data.length > 0){
								  		res.json({"err_code": 0, "data":practitionerRoleCode.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Practitioner Role Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": practitionerRoleCode.error, "application": "Api FHIR", "function": "getPractitionerRoleCode"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('practitionerRoleCode', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getPractitionerRoleCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var practitionerRoleCode = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(practitionerRoleCode.err_code == 0){
									  	//cek jumdata dulu
									  	if(practitionerRoleCode.data.length > 0){
									  		res.json({"err_code": 0, "data":practitionerRoleCode.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Practitioner Role Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": practitionerRoleCode.error, "application": "Api FHIR", "function": "getPractitionerRoleCode"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		practitionerRoleCodeCode: function getPractitionerRoleCodeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('practitionerRoleCodeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getPractitionerRoleCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var practitionerRoleCode = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(practitionerRoleCode.err_code == 0){
								  	//cek jumdata dulu
								  	if(practitionerRoleCode.data.length > 0){
								  		res.json({"err_code": 0, "data":practitionerRoleCode.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Practitioner Role Code Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": practitionerRoleCode.error, "application": "Api FHIR", "function": "getPractitionerRoleCodeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		practiceCode: function getPracticeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('practiceCode', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getPracticeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var practiceCode = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(practiceCode.err_code == 0){
								  	//cek jumdata dulu
								  	if(practiceCode.data.length > 0){
								  		res.json({"err_code": 0, "data":practiceCode.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Practice Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": practiceCode.error, "application": "Api FHIR", "function": "getPracticeCode"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('practiceCode', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getPracticeCode"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var practiceCode = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(practiceCode.err_code == 0){
									  	//cek jumdata dulu
									  	if(practiceCode.data.length > 0){
									  		res.json({"err_code": 0, "data":practiceCode.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Practice Code is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": practiceCode.error, "application": "Api FHIR", "function": "getPracticeCode"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		practiceCodeCode: function getPracticeCodeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('practiceCodeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getPracticeCode"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var practiceCode = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(practiceCode.err_code == 0){
								  	//cek jumdata dulu
								  	if(practiceCode.data.length > 0){
								  		res.json({"err_code": 0, "data":practiceCode.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Practice Code Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": practiceCode.error, "application": "Api FHIR", "function": "getPracticeCodeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		daysOfWeek: function getDaysOfWeek(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('daysOfWeek', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDaysOfWeek"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var daysOfWeek = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(daysOfWeek.err_code == 0){
								  	//cek jumdata dulu
								  	if(daysOfWeek.data.length > 0){
								  		res.json({"err_code": 0, "data":daysOfWeek.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Days Of Week is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": daysOfWeek.error, "application": "Api FHIR", "function": "getDaysOfWeek"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('daysOfWeek', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDaysOfWeek"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var daysOfWeek = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(daysOfWeek.err_code == 0){
									  	//cek jumdata dulu
									  	if(daysOfWeek.data.length > 0){
									  		res.json({"err_code": 0, "data":daysOfWeek.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Days Of Week is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": daysOfWeek.error, "application": "Api FHIR", "function": "getDaysOfWeek"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		daysOfWeekCode: function getDaysOfWeekCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('daysOfWeekCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getDaysOfWeek"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var daysOfWeek = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(daysOfWeek.err_code == 0){
								  	//cek jumdata dulu
								  	if(daysOfWeek.data.length > 0){
								  		res.json({"err_code": 0, "data":daysOfWeek.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Days Of Week Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": daysOfWeek.error, "application": "Api FHIR", "function": "getDaysOfWeekCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		serviceCategory: function getServiceCategory(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('serviceCategory', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceCategory"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceCategory = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceCategory.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceCategory.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceCategory.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Category is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceCategory.error, "application": "Api FHIR", "function": "getServiceCategory"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('serviceCategory', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceCategory"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var serviceCategory = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(serviceCategory.err_code == 0){
									  	//cek jumdata dulu
									  	if(serviceCategory.data.length > 0){
									  		res.json({"err_code": 0, "data":serviceCategory.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Service Category is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": serviceCategory.error, "application": "Api FHIR", "function": "getServiceCategory"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		serviceCategoryCode: function getServiceCategoryCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('serviceCategoryCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceCategory"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceCategory = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceCategory.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceCategory.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceCategory.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Category Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceCategory.error, "application": "Api FHIR", "function": "getServiceCategoryCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		serviceType	: function getServiceType	(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('serviceType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceType	"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceType	 = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceType	.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceType	.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceType	.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Type is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceType	.error, "application": "Api FHIR", "function": "getServiceType"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('serviceType	', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceType	"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var serviceType	 = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(serviceType	.err_code == 0){
									  	//cek jumdata dulu
									  	if(serviceType	.data.length > 0){
									  		res.json({"err_code": 0, "data":serviceType	.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Service Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": serviceType	.error, "application": "Api FHIR", "function": "getServiceType	"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		serviceTypeCode: function getServiceTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('serviceTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceType	"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceType	 = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceType	.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceType	.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceType	.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Type Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceType	.error, "application": "Api FHIR", "function": "getServiceTypeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		serviceProvisionConditions: function getServiceProvisionConditions(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('serviceProvisionConditions', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceProvisionConditions"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceProvisionConditions = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceProvisionConditions.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceProvisionConditions.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceProvisionConditions.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Provision Conditions is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceProvisionConditions.error, "application": "Api FHIR", "function": "getServiceProvisionConditions"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('serviceProvisionConditions', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceProvisionConditions"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var serviceProvisionConditions = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(serviceProvisionConditions.err_code == 0){
									  	//cek jumdata dulu
									  	if(serviceProvisionConditions.data.length > 0){
									  		res.json({"err_code": 0, "data":serviceProvisionConditions.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Service Provision Conditions is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": serviceProvisionConditions.error, "application": "Api FHIR", "function": "getServiceProvisionConditions"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		serviceProvisionConditionsCode: function getServiceProvisionConditionsCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('serviceProvisionConditionsCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceProvisionConditions"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceProvisionConditions = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceProvisionConditions.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceProvisionConditions.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceProvisionConditions.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Provision Conditions Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceProvisionConditions.error, "application": "Api FHIR", "function": "getServiceProvisionConditionsCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		serviceReferralMethod: function getServiceReferralMethod(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('serviceReferralMethod', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceReferralMethod"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceReferralMethod = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceReferralMethod.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceReferralMethod.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceReferralMethod.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Category is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceReferralMethod.error, "application": "Api FHIR", "function": "getServiceReferralMethod"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('serviceReferralMethod', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceReferralMethod"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var serviceReferralMethod = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(serviceReferralMethod.err_code == 0){
									  	//cek jumdata dulu
									  	if(serviceReferralMethod.data.length > 0){
									  		res.json({"err_code": 0, "data":serviceReferralMethod.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "Service Category is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": serviceReferralMethod.error, "application": "Api FHIR", "function": "getServiceReferralMethod"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		serviceReferralMethodCode: function getServiceReferralMethodCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('serviceReferralMethodCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getServiceReferralMethod"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var serviceReferralMethod = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(serviceReferralMethod.err_code == 0){
								  	//cek jumdata dulu
								  	if(serviceReferralMethod.data.length > 0){
								  		res.json({"err_code": 0, "data":serviceReferralMethod.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Service Category Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": serviceReferralMethod.error, "application": "Api FHIR", "function": "getServiceReferralMethodCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		endpointStatus: function getEndpointStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('endpointStatus', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getEndpointStatus"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var endpointStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(endpointStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(endpointStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":endpointStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "End Point Status is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": endpointStatus.error, "application": "Api FHIR", "function": "getEndpointStatus"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('endpointStatus', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getEndpointStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var endpointStatus = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(endpointStatus.err_code == 0){
									  	//cek jumdata dulu
									  	if(endpointStatus.data.length > 0){
									  		res.json({"err_code": 0, "data":endpointStatus.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "End Point Status is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": endpointStatus.error, "application": "Api FHIR", "function": "getEndpointStatus"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		endpointStatusCode: function getEndpointStatusCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('endpointStatusCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getEndpointStatus"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var endpointStatus = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(endpointStatus.err_code == 0){
								  	//cek jumdata dulu
								  	if(endpointStatus.data.length > 0){
								  		res.json({"err_code": 0, "data":endpointStatus.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "End Point Status Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": endpointStatus.error, "application": "Api FHIR", "function": "getEndpointStatusCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		endpointConnectionType: function getEndpointConnectionType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('endpointConnectionType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getEndpointConnectionType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var endpointConnectionType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(endpointConnectionType.err_code == 0){
								  	//cek jumdata dulu
								  	if(endpointConnectionType.data.length > 0){
								  		res.json({"err_code": 0, "data":endpointConnectionType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "End Point Connection Type is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": endpointConnectionType.error, "application": "Api FHIR", "function": "getEndpointConnectionType"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('endpointConnectionType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getEndpointConnectionType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var endpointConnectionType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(endpointConnectionType.err_code == 0){
									  	//cek jumdata dulu
									  	if(endpointConnectionType.data.length > 0){
									  		res.json({"err_code": 0, "data":endpointConnectionType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "End Point Connection Type is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": endpointConnectionType.error, "application": "Api FHIR", "function": "getEndpointConnectionType"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		endpointConnectionTypeCode: function getEndpointConnectionTypeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('endpointConnectionTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getEndpointConnectionType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var endpointConnectionType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(endpointConnectionType.err_code == 0){
								  	//cek jumdata dulu
								  	if(endpointConnectionType.data.length > 0){
								  		res.json({"err_code": 0, "data":endpointConnectionType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "End Point Connection Type Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": endpointConnectionType.error, "application": "Api FHIR", "function": "getEndpointConnectionTypeCode"});
							  	}
							  }
						})
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}				
		},
		endpointPayloadType: function getEndpointPayloadType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					if(_id == "" || typeof _id == 'undefined'){
						//method, endpoint, params, options, callback
						ApiFHIR.get('endpointPayloadType', {"apikey": apikey, "_id": 0}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getEndpointPayloadType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var endpointPayloadType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(endpointPayloadType.err_code == 0){
								  	//cek jumdata dulu
								  	if(endpointPayloadType.data.length > 0){
								  		res.json({"err_code": 0, "data":endpointPayloadType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "End Point Status is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": endpointPayloadType.error, "application": "Api FHIR", "function": "getEndpointPayloadType"});
							  	}
							  }
						})	
					}else{
						if(validator.isInt(_id)){
							ApiFHIR.get('endpointPayloadType', {"apikey": apikey, "_id": _id}, {}, function(error, response, body){
								if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getEndpointPayloadType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var endpointPayloadType = JSON.parse(body); 
								  	
								  	//cek apakah ada error atau tidak
								  	if(endpointPayloadType.err_code == 0){
									  	//cek jumdata dulu
									  	if(endpointPayloadType.data.length > 0){
									  		res.json({"err_code": 0, "data":endpointPayloadType.data});
									  	}else{
								  			res.json({"err_code": 2, "err_msg": "End Point Status is not found"});	
									  	}
								  	}else{
								  		res.json({"err_code": 3, "err_msg": endpointPayloadType.error, "application": "Api FHIR", "function": "getEndpointPayloadType"});
								  	}
								  }
							})
						}else{
							res.json({"err_code": 4, "err_msg": "Id must be a number."});
						}
						
					}
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		endpointPayloadTypeCode: function getEndpointPayloadTypeCode(req, res){
			var ipAddres = req.Payload.remoteAddress;
			var apikey = req.params.apikey;
			var code = req.params.code.replace(/[^\w\s ,]/gi, '').trim().toLowerCase();

			if(code == "" || typeof code == 'undefined'){
				res.json({"err_code": 4, "err_msg": "Code is required."});
			}else{
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						ApiFHIR.get('endpointPayloadTypeCode', {"apikey": apikey, "code": code}, {}, function(error, response, body){
							if(error){
							  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "getEndpointPayloadType"});
							  }else{
							  	//cek apakah ada error atau tidak
							  	var endpointPayloadType = JSON.parse(body); 
							  	
							  	//cek apakah ada error atau tidak
							  	if(endpointPayloadType.err_code == 0){
								  	//cek jumdata dulu
								  	if(endpointPayloadType.data.length > 0){
								  		res.json({"err_code": 0, "data":endpointPayloadType.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "End Point Status Code is not found"});	
								  	}
							  	}else{
							  		res.json({"err_code": 3, "err_msg": endpointPayloadType.error, "application": "Api FHIR", "function": "getEndpointPayloadTypeCode"});
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
	},
	post: {
		identityAssuranceLevel: function addIdentityAssuranceLevel(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 3;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'IDENTITY_ASSURANCE_LEVEL', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAssuranceLevel = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('identityAssuranceLevel', {
									"apikey": apikey
								}, {
									body: dataAssuranceLevel,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addIdentityAssuranceLevel"
										});
									} else {
										//cek apakah ada error atau tidak
										var assuranceLevel = body; //object
										//cek apakah ada error atau tidak
										if (assuranceLevel.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Identity assurance level has been add.",
												"data": assuranceLevel.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": assuranceLevel.error,
												"application": "Api FHIR",
												"function": "addIdentityAssuranceLevel"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		administrativeGender: function addAdministrativeGender(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 3;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ADMINISTRATIVE_GENDER', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAdministrativeGender = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('administrativeGender', {
									"apikey": apikey
								}, {
									body: dataAdministrativeGender,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addAdministrativeGender"
										});
									} else {
										//cek apakah ada error atau tidak
										var administrativeGender = body; //object
										//cek apakah ada error atau tidak
										if (administrativeGender.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Administrative Gender has been add.",
												"data": administrativeGender.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": administrativeGender.error,
												"application": "Api FHIR",
												"function": "addAdministrativeGender"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		maritalStatus: function addMaritalStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toUpperCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');

			if (code == 'UNK') {
				var maritalSystem = 'null-flavor';
			} else {
				var maritalSystem = 'marital-status';
			}

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 3;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'MARITAL_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataMaritalStatus = {
									"code": code,
									"display": display,
									"definition": definition,
									"system": maritalSystem
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('maritalStatus', {
									"apikey": apikey
								}, {
									body: dataMaritalStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addMaritalStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var maritalStatus = body; //object
										//cek apakah ada error atau tidak
										if (maritalStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Marital Status has been add.",
												"data": maritalStatus.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": maritalStatus.error,
												"application": "Api FHIR",
												"function": "addMaritalStatus"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		contactRole: function addContactRole(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toUpperCase();
			var description = req.body.description.replace(/[^\w\s ,]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(description)) {
				err_code = 3;
				err_msg = "Description is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'CONTACT_ROLE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataContactRole = {
									"code": code,
									"description": description
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('contactRole', {
									"apikey": apikey
								}, {
									body: dataContactRole,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addContactRole"
										});
									} else {
										//cek apakah ada error atau tidak
										var contactRole = body; //object
										//cek apakah ada error atau tidak
										if (contactRole.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Contact Role has been add.",
												"data": contactRole.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": contactRole.error,
												"application": "Api FHIR",
												"function": "addContactRole"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		animalSpecies: function addAnimalSpecies(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim();
			var display = req.body.display.replace(/[^\w\s ,]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 3;
				err_msg = "Display is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ANIMAL_SPECIES', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAnimalSpecies = {
									"code": code,
									"display": display
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('animalSpecies', {
									"apikey": apikey
								}, {
									body: dataAnimalSpecies,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addAnimalSpecies"
										});
									} else {
										//cek apakah ada error atau tidak
										var animalSpecies = body; //object
										//cek apakah ada error atau tidak
										if (animalSpecies.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Animal Species has been add.",
												"data": animalSpecies.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": animalSpecies.error,
												"application": "Api FHIR",
												"function": "addAnimalSpecies"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		animalBreeds: function addAnimalBreeds(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim();
			var display = req.body.display.replace(/[^\w\s ,]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 3;
				err_msg = "Display is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ANIMAL_BREEDS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAnimalBreeds = {
									"code": code,
									"display": display
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('animalBreeds', {
									"apikey": apikey
								}, {
									body: dataAnimalBreeds,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addAnimalBreeds"
										});
									} else {
										//cek apakah ada error atau tidak
										var animalBreeds = body; //object
										//cek apakah ada error atau tidak
										if (animalBreeds.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Animal Breeds has been add.",
												"data": animalBreeds.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": animalBreeds.error,
												"application": "Api FHIR",
												"function": "addAnimalBreeds"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		animalGenderStatus: function addAnimalGenderStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 3;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ANIMAL_GENDER_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAnimalGenderStatus = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('animalGenderStatus', {
									"apikey": apikey
								}, {
									body: dataAnimalGenderStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addAnimalGenderStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var animalGenderStatus = body; //object
										//cek apakah ada error atau tidak
										if (animalGenderStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Animal Gender Status has been add.",
												"data": animalGenderStatus.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": animalGenderStatus.error,
												"application": "Api FHIR",
												"function": "addAnimalGenderStatus"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		languages: function addLanguages(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim();
			var display = req.body.display;

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'LANGUAGES', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataLanguages = {
									"code": code,
									"display": display
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('languages', {
									"apikey": apikey
								}, {
									body: dataLanguages,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addLanguages"
										});
									} else {
										//cek apakah ada error atau tidak
										var languages = body; //object
										//cek apakah ada error atau tidak
										if (languages.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Language has been add.",
												"data": languages.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": languages.error,
												"application": "Api FHIR",
												"function": "addLanguages"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		linkType: function addLinkType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition;

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'LINK_TYPE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataLinkType = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('linkType', {
									"apikey": apikey
								}, {
									body: dataLinkType,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addLinkType"
										});
									} else {
										//cek apakah ada error atau tidak
										var linkType = body; //object
										//cek apakah ada error atau tidak
										if (linkType.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Link Type has been add.",
												"data": linkType.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": linkType.error,
												"application": "Api FHIR",
												"function": "addLinkType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		relatedPersonRelationshipType: function addRelatedPersonRelationshipType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toUpperCase();
			var display = req.body.display;
			var system = 'relatedperson-relationshiptype';
			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (typeof req.body.definition !== 'undefined') {
				definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');
			} else {
				definition = "";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'RELATEDPERSON_RELATIONSHIPTYPE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataRelatedPersonRelationshipType = {
									"code": code,
									"system": system,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('relatedPersonRelationshipType', {
									"apikey": apikey
								}, {
									body: dataRelatedPersonRelationshipType,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addRelatedPersonRelationshipType"
										});
									} else {
										//cek apakah ada error atau tidak
										var relatedPersonRelationshipType = body; //object
										//cek apakah ada error atau tidak
										if (relatedPersonRelationshipType.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Related Person Relationship Type has been add.",
												"data": relatedPersonRelationshipType.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": relatedPersonRelationshipType.error,
												"application": "Api FHIR",
												"function": "addRelatedPersonRelationshipType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		groupType: function addGroupType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition;

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'GROUP_TYPE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataGroupType = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('groupType', {
									"apikey": apikey
								}, {
									body: dataGroupType,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addGroupType"
										});
									} else {
										//cek apakah ada error atau tidak
										var groupType = body; //object
										//cek apakah ada error atau tidak
										if (groupType.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Group Type has been add.",
												"data": groupType.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": groupType.error,
												"application": "Api FHIR",
												"function": "addGroupType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		identifierUse: function addIdentifierUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( )]/gi, ''); ;
			var definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'IDENTIFIER_USE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataIdentifierUse = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('identifierUse', {
									"apikey": apikey
								}, {
									body: dataIdentifierUse,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addIdentifierUse"
										});
									} else {
										//cek apakah ada error atau tidak
										var identifierUse = body; //object
										//cek apakah ada error atau tidak
										if (identifierUse.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Identifier Use has been add.",
												"data": identifierUse.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": identifierUse.error,
												"application": "Api FHIR",
												"function": "addIdentifierUse"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		identifierType: function addIdentifierType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toUpperCase();
			var display = req.body.display.replace(/[^\w\s , ( )]/gi, ''); ;

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'IDENTIFIER_TYPE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataIdentifierType = {
									"code": code,
									"display": display
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('identifierType', {
									"apikey": apikey
								}, {
									body: dataIdentifierType,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addIdentifierType"
										});
									} else {
										//cek apakah ada error atau tidak
										var identifierType = body; //object
										//cek apakah ada error atau tidak
										if (identifierType.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Identifier Type has been add.",
												"data": identifierType.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": identifierType.error,
												"application": "Api FHIR",
												"function": "addIdentifierType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		nameUse: function addNameUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'NAME_USE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataNameUse = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('nameUse', {
									"apikey": apikey
								}, {
									body: dataNameUse,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addNameUse"
										});
									} else {
										//cek apakah ada error atau tidak
										var nameUse = body; //object
										//cek apakah ada error atau tidak
										if (nameUse.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Name Use has been add.",
												"data": nameUse.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": nameUse.error,
												"application": "Api FHIR",
												"function": "addNameUse"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		contactPointSystem: function addContactPointSystem(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'CONTACT_POINT_SYSTEM', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataContactPointSystem = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('contactPointSystem', {
									"apikey": apikey
								}, {
									body: dataContactPointSystem,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addContactPointSystem"
										});
									} else {
										//cek apakah ada error atau tidak
										var contactPointSystem = body; //object
										//cek apakah ada error atau tidak
										if (contactPointSystem.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Contact Point System has been add.",
												"data": contactPointSystem.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": contactPointSystem.error,
												"application": "Api FHIR",
												"function": "addContactPointSystem"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		contactPointUse: function addContactPointUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'CONTACT_POINT_USE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataContactPointUse = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('contactPointUse', {
									"apikey": apikey
								}, {
									body: dataContactPointUse,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addContactPointUse"
										});
									} else {
										//cek apakah ada error atau tidak
										var contactPointUse = body; //object
										//cek apakah ada error atau tidak
										if (contactPointUse.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Contact Point Use has been add.",
												"data": contactPointUse.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": contactPointUse.error,
												"application": "Api FHIR",
												"function": "addContactPointUse"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		addressUse: function addAddressUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ADDRESS_USE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAddressUse = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('addressUse', {
									"apikey": apikey
								}, {
									body: dataAddressUse,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addAddressUse"
										});
									} else {
										//cek apakah ada error atau tidak
										var addressUse = body; //object
										//cek apakah ada error atau tidak
										if (addressUse.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Address Use has been add.",
												"data": addressUse.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": addressUse.error,
												"application": "Api FHIR",
												"function": "addAddressUse"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		addressType: function addAddressType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ADDRESS_TYPE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAddressType = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('addressType', {
									"apikey": apikey
								}, {
									body: dataAddressType,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addAddressType"
										});
									} else {
										//cek apakah ada error atau tidak
										var addressType = body; //object
										//cek apakah ada error atau tidak
										if (addressType.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Address Type has been add.",
												"data": addressType.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": addressType.error,
												"application": "Api FHIR",
												"function": "addAddressType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		appointmentReasonCode: function addAppointmentReasonCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toUpperCase();
			var description = req.body.description.replace(/[^\w\s ,]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(description)) {
				err_code = 2;
				err_msg = "Description is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'APPOINTMENT_REASON_CODE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAppointmentReasonCode = {
									"code": code,
									"description": description
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('appointmentReasonCode', {
									"apikey": apikey
								}, {
									body: dataAppointmentReasonCode,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addAppointmentReasonCode"
										});
									} else {
										//cek apakah ada error atau tidak
										var appointmentReasonCode = body; //object
										//cek apakah ada error atau tidak
										if (appointmentReasonCode.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Appointment Reason Code has been add.",
												"data": appointmentReasonCode.data
											});
										} else {
											res.json(appointmentReasonCode);
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		slotStatus: function addSlotStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s ,]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'SLOT_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataSlotStatus = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('slotStatus', {
									"apikey": apikey
								}, {
									body: dataSlotStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addSlotStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var slotStatus = body; //object
										//cek apakah ada error atau tidak
										if (slotStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Slot Status has been add.",
												"data": slotStatus.data
											});
										} else {
											res.json(slotStatus);
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		appointmentStatus: function addAppointmentStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s ,]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'APPOINTMENT_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAppointmentStatus = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('appointmentStatus', {
									"apikey": apikey
								}, {
									body: dataAppointmentStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addAppointmentStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var appointmentStatus = body; //object
										//cek apakah ada error atau tidak
										if (appointmentStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Appointment Status has been add.",
												"data": appointmentStatus.data
											});
										} else {
											res.json(appointmentStatus);
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		participantRequired: function addParticipantRequired(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s ,]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'PARTICIPANT_REQUIRED', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataParticipantRequired = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('participantRequired', {
									"apikey": apikey
								}, {
									body: dataParticipantRequired,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addParticipantRequired"
										});
									} else {
										//cek apakah ada error atau tidak
										var participantRequired = body; //object
										//cek apakah ada error atau tidak
										if (participantRequired.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Participant Required has been add.",
												"data": participantRequired.data
											});
										} else {
											res.json(participantRequired);
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		participationStatus: function addparticipationStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s ,]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'PARTICIPATION_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataparticipationStatus = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('participationStatus', {
									"apikey": apikey
								}, {
									body: dataparticipationStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "addparticipationStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var participationStatus = body; //object
										//cek apakah ada error atau tidak
										if (participationStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Participant Status has been add.",
												"data": participationStatus.data
											});
										} else {
											res.json(participationStatus);
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		actEncounterCode: function addActEncounterCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toUpperCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ACT_ENCOUNTER_CODE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataActEncounterCode = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('actEncounterCode', {
									"apikey": apikey
								}, {
									body: dataActEncounterCode,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "actEncounterCode"
										});
									} else {
										//cek apakah ada error atau tidak
										var actEncounterCode = body; //object
										//cek apakah ada error atau tidak
										if (actEncounterCode.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Act Encounter Code has been add.",
												"data": actEncounterCode.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": actEncounterCode.error,
												"application": "Api FHIR",
												"function": "actEncounterCode"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		actPriority: function addActPriority(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toUpperCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ACT_PRIORITY', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataActPriority = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('actPriority', {
									"apikey": apikey
								}, {
									body: dataActPriority,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "actPriority"
										});
									} else {
										//cek apakah ada error atau tidak
										var actPriority = body; //object
										//cek apakah ada error atau tidak
										if (actPriority.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Act Priority has been add.",
												"data": actPriority.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": actPriority.error,
												"application": "Api FHIR",
												"function": "actPriority"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		accountStatus: function addAccountStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ACCOUNT_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAccountStatus = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('accountStatus', {
									"apikey": apikey
								}, {
									body: dataAccountStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "accountStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var accountStatus = body; //object
										//cek apakah ada error atau tidak
										if (accountStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Account Status has been add.",
												"data": accountStatus.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": accountStatus.error,
												"application": "Api FHIR",
												"function": "accountStatus"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		accountType: function addAccountType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ACCOUNT_TYPE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataAccountType = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('accountType', {
									"apikey": apikey
								}, {
									body: dataAccountType,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "accountType"
										});
									} else {
										//cek apakah ada error atau tidak
										var accountType = body; //object
										//cek apakah ada error atau tidak
										if (accountType.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Account Type has been add.",
												"data": accountType.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": accountType.error,
												"application": "Api FHIR",
												"function": "accountType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		diagnosisRole: function addDiagnosisRole(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'DIAGNOSIS_ROLE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataDiagnosisRole = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('diagnosisRole', {
									"apikey": apikey
								}, {
									body: dataDiagnosisRole,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "diagnosisRole"
										});
									} else {
										//cek apakah ada error atau tidak
										var diagnosisRole = body; //object
										//cek apakah ada error atau tidak
										if (diagnosisRole.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Diagnosis Role has been add.",
												"data": diagnosisRole.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": diagnosisRole.error,
												"application": "Api FHIR",
												"function": "diagnosisRole"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterAdmitSource: function addEncounterAdmitSource(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_ADMIT_SOURCE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterAdmitSource = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterAdmitSource', {
									"apikey": apikey
								}, {
									body: dataEncounterAdmitSource,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterAdmitSource"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterAdmitSource = body; //object
										//cek apakah ada error atau tidak
										if (encounterAdmitSource.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Admit Source has been add.",
												"data": encounterAdmitSource.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterAdmitSource.error,
												"application": "Api FHIR",
												"function": "encounterAdmitSource"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterDiet: function addEncounterDiet(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_DIET', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterDiet = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterDiet', {
									"apikey": apikey
								}, {
									body: dataEncounterDiet,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterDiet"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterDiet = body; //object
										//cek apakah ada error atau tidak
										if (encounterDiet.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Diet has been add.",
												"data": encounterDiet.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterDiet.error,
												"application": "Api FHIR",
												"function": "encounterDiet"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterDischargeDisposition: function addEncounterDischargeDisposition(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_DISCHARGE_DISPOSITION', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterDischargeDisposition = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterDischargeDisposition', {
									"apikey": apikey
								}, {
									body: dataEncounterDischargeDisposition,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterDischargeDisposition"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterDischargeDisposition = body; //object
										//cek apakah ada error atau tidak
										if (encounterDischargeDisposition.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Discharge Disposition has been add.",
												"data": encounterDischargeDisposition.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterDischargeDisposition.error,
												"application": "Api FHIR",
												"function": "encounterDischargeDisposition"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterLocationStatus: function addEncounterLocationStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_LOCATION_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterLocationStatus = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterLocationStatus', {
									"apikey": apikey
								}, {
									body: dataEncounterLocationStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterLocationStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterLocationStatus = body; //object
										//cek apakah ada error atau tidak
										if (encounterLocationStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Location Status has been add.",
												"data": encounterLocationStatus.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterLocationStatus.error,
												"application": "Api FHIR",
												"function": "encounterLocationStatus"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterParticipantType: function addEncounterParticipantType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			var system = req.body.system;

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_PARTICIPANT_TYPE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterParticipantType = {
									"code": code,
									"display": display,
									"definition": definition,
									"system": "encounter-participant-type"
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterParticipantType', {
									"apikey": apikey
								}, {
									body: dataEncounterParticipantType,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterParticipantType"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterParticipantType = body; //object
										//cek apakah ada error atau tidak
										if (encounterParticipantType.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Participant Type has been add.",
												"data": encounterParticipantType.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterParticipantType.error,
												"application": "Api FHIR",
												"function": "encounterParticipantType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterReason: function addEncounterReason(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_REASON', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterReason = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterReason', {
									"apikey": apikey
								}, {
									body: dataEncounterReason,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterReason"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterReason = body; //object
										//cek apakah ada error atau tidak
										if (encounterReason.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Reason has been add.",
												"data": encounterReason.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterReason.error,
												"application": "Api FHIR",
												"function": "encounterReason"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterSpecialCourtesy: function addEncounterSpecialCourtesy(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toUpperCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_SPECIAL_COURTESY', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterSpecialCourtesy = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterSpecialCourtesy', {
									"apikey": apikey
								}, {
									body: dataEncounterSpecialCourtesy,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterSpecialCourtesy"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterSpecialCourtesy = body; //object
										//cek apakah ada error atau tidak
										if (encounterSpecialCourtesy.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Special Courtesy has been add.",
												"data": encounterSpecialCourtesy.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterSpecialCourtesy.error,
												"application": "Api FHIR",
												"function": "encounterSpecialCourtesy"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterSpecialArrangements: function addEncounterSpecialArrangements(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_SPECIAL_ARRANGEMENTS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterSpecialArrangements = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterSpecialArrangements', {
									"apikey": apikey
								}, {
									body: dataEncounterSpecialArrangements,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterSpecialArrangements"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterSpecialArrangements = body; //object
										//cek apakah ada error atau tidak
										if (encounterSpecialArrangements.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Special Arrangements has been add.",
												"data": encounterSpecialArrangements.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterSpecialArrangements.error,
												"application": "Api FHIR",
												"function": "encounterSpecialArrangements"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterStatus: function addEncounterStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterStatus = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterStatus', {
									"apikey": apikey
								}, {
									body: dataEncounterStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterStatus = body; //object
										//cek apakah ada error atau tidak
										if (encounterStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Status has been add.",
												"data": encounterStatus.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterStatus.error,
												"application": "Api FHIR",
												"function": "encounterStatus"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		encounterType: function addEncounterType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase().replace("/", "<or>");
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'ENCOUNTER_TYPE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEncounterType = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('encounterType', {
									"apikey": apikey
								}, {
									body: dataEncounterType,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "encounterType"
										});
									} else {
										//cek apakah ada error atau tidak
										var encounterType = body; //object
										//cek apakah ada error atau tidak
										if (encounterType.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Encounter Type has been add.",
												"data": encounterType.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": encounterType.error,
												"application": "Api FHIR",
												"function": "encounterType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		episodeOfCareStatus: function addEpisodeOfCareStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'EPISODE_OF_CARE_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEpisodeOfCareStatus = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('episodeOfCareStatus', {
									"apikey": apikey
								}, {
									body: dataEpisodeOfCareStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "episodeOfCareStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var episodeOfCareStatus = body; //object
										//cek apakah ada error atau tidak
										if (episodeOfCareStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Episode Of Care Status has been add.",
												"data": episodeOfCareStatus.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": episodeOfCareStatus.error,
												"application": "Api FHIR",
												"function": "encounterType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		episodeOfCareType: function addEpisodeOfCareType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'EPISODE_OF_CARE_TYPE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataEpisodeOfCareType = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('episodeOfCareType', {
									"apikey": apikey
								}, {
									body: dataEpisodeOfCareType,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "episodeOfCareType"
										});
									} else {
										//cek apakah ada error atau tidak
										var episodeOfCareType = body; //object
										//cek apakah ada error atau tidak
										if (episodeOfCareType.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Episode Of Care Type has been add.",
												"data": episodeOfCareType.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": episodeOfCareType.error,
												"application": "Api FHIR",
												"function": "episodeOfCareType"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		flagStatus: function addFlagStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'FLAG_STATUS', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataFlagStatus = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('flagStatus', {
									"apikey": apikey
								}, {
									body: dataFlagStatus,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "flagStatus"
										});
									} else {
										//cek apakah ada error atau tidak
										var flagStatus = body; //object
										//cek apakah ada error atau tidak
										if (flagStatus.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Flag Status has been add.",
												"data": flagStatus.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": flagStatus.error,
												"application": "Api FHIR",
												"function": "flagStatus"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		flagCategory: function addFlagCategory(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'FLAG_CATEGORY', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataFlagCategory = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('flagCategory', {
									"apikey": apikey
								}, {
									body: dataFlagCategory,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "flagCategory"
										});
									} else {
										//cek apakah ada error atau tidak
										var flagCategory = body; //object
										//cek apakah ada error atau tidak
										if (flagCategory.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Act Encounter Code has been add.",
												"data": flagCategory.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": flagCategory.error,
												"application": "Api FHIR",
												"function": "flagCategory"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		reAdmissionIndicator: function addReAdmissionIndicator(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var description = req.body.description.replace(/[^\w\s ,]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(description)) {
				err_code = 3;
				err_msg = "Description is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'RE_ADMISSION_INDICATOR', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataReAdmissionIndicator = {
									"code": code,
									"display": display,
									"description": description
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('reAdmissionIndicator', {
									"apikey": apikey
								}, {
									body: dataReAdmissionIndicator,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "reAdmissionIndicator"
										});
									} else {
										//cek apakah ada error atau tidak
										var reAdmissionIndicator = body; //object
										//cek apakah ada error atau tidak
										if (reAdmissionIndicator.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "re Admission Indicator has been add.",
												"data": reAdmissionIndicator.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": reAdmissionIndicator.error,
												"application": "Api FHIR",
												"function": "reAdmissionIndicator"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		flagCode: function addFlagCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;

			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');

			var err_code = 0;
			var err_msg = '';

			//input checking
			if (validator.isEmpty(code)) {
				err_code = 1;
				err_msg = "Code is required";
			}

			if (validator.isEmpty(display)) {
				err_code = 2;
				err_msg = "Display is required";
			}

			if (validator.isEmpty(definition)) {
				err_code = 2;
				err_msg = "Definition is required";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						checkCode(apikey, code, 'FLAG_CODE', function (resultCode) {
							if (resultCode.err_code == 0) {
								//susun body
								var dataFlagCode = {
									"code": code,
									"display": display,
									"definition": definition
								};

								//method, endpoint, params, options, callback
								ApiFHIR.post('flagCode', {
									"apikey": apikey
								}, {
									body: dataFlagCode,
									json: true
								}, function (error, response, body) {
									if (error) {
										res.json({
											"err_code": 1,
											"err_msg": error,
											"application": "Api FHIR",
											"function": "flagCode"
										});
									} else {
										//cek apakah ada error atau tidak
										var flagCode = body; //object
										//cek apakah ada error atau tidak
										if (flagCode.err_code == 0) {
											res.json({
												"err_code": 0,
												"err_msg": "Flag Code has been add.",
												"data": flagCode.data
											});
										} else {
											res.json({
												"err_code": 3,
												"err_msg": flagCode.error,
												"application": "Api FHIR",
												"function": "flagCode"
											});
										}
									}
								})
							} else {
								res.json(resultCode);
							}
						})
					} else {
						result.err_code = 500;
						res.json(result);
					}
				});
			} else {
				res.json({
					"err_code": err_code,
					"err_msg": err_msg
				});
			}
		},
		udiEntryType: function addUdiEntryType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'UDI_ENTRY_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataUdiEntryType = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('udiEntryType', {"apikey": apikey}, {body: dataUdiEntryType, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addUdiEntryType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var udiEntryType = body; //object
								  	//cek apakah ada error atau tidak
								  	if(udiEntryType.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Udi Entry Type has been add.", "data":udiEntryType.data});
								  	}else{
								  		res.json(udiEntryType);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		deviceStatus: function addDeviceStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'DEVICE_STATUS', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataDeviceStatus = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('deviceStatus', {"apikey": apikey}, {body: dataDeviceStatus, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addDeviceStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var deviceStatus = body; //object
								  	//cek apakah ada error atau tidak
								  	if(deviceStatus.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Device Status has been add.", "data":deviceStatus.data});
								  	}else{
								  		res.json(deviceStatus);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		deviceKind: function addDeviceKind(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(!validator.isInt(code)){
				err_code = 1;
				err_msg = "Code is number";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				definition = "";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'DEVICE_KIND', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var datadeviceKind = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('deviceKind', {"apikey": apikey}, {body: datadeviceKind, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addDeviceKind"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var deviceKind = body; //object
								  	//cek apakah ada error atau tidak
								  	if(deviceKind.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Device Kind has been add.", "data":deviceKind.data});
								  	}else{
								  		res.json(deviceKind);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		deviceSafety: function addDeviceSafety(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toUpperCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				definition = "";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'DEVICE_SAFETY', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataDeviceSafety = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('deviceSafety', {"apikey": apikey}, {body: dataDeviceSafety, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addDeviceSafety"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var deviceSafety = body; //object
								  	//cek apakah ada error atau tidak
								  	if(deviceSafety.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Device Safety has been add.", "data":deviceSafety.data});
								  	}else{
								  		res.json(deviceSafety);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		operationalStatus: function addOperationalStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				definition = "";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'OPERATIONAL_STATUS', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataOperationalStatus = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('operationalStatus', {"apikey": apikey}, {body: dataOperationalStatus, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addOperationalStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var operationalStatus = body; //object
								  	//cek apakah ada error atau tidak
								  	if(operationalStatus.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Operational Status has been add.", "data":operationalStatus.data});
								  	}else{
								  		res.json(operationalStatus);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		parameterGroup: function addParameterGroup(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .-]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'PARAMETER_GROUP', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataParameterGroup = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('parameterGroup', {"apikey": apikey}, {body: dataParameterGroup, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addParameterGroup"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var parameterGroup = body; //object
								  	//cek apakah ada error atau tidak
								  	if(parameterGroup.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Parameter Group has been add.", "data":parameterGroup.data});
								  	}else{
								  		res.json(parameterGroup);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		measurementPrinciple: function addMeasurementPrinciple(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .-]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'MEASUREMENT_PRINCIPLE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataMeasurementPrinciple = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('measurementPrinciple', {"apikey": apikey}, {body: dataMeasurementPrinciple, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addMeasurementPrinciple"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var measurementPrinciple = body; //object
								  	//cek apakah ada error atau tidak
								  	if(measurementPrinciple.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Measurement Principle has been add.", "data":measurementPrinciple.data});
								  	}else{
								  		res.json(measurementPrinciple);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		specificationType: function addSpecificationType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .-]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'SPECIFICATION_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataSpecificationType = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('specificationType', {"apikey": apikey}, {body: dataSpecificationType, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addSpecificationType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var specificationType = body; //object
								  	//cek apakah ada error atau tidak
								  	if(specificationType.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Specification Type has been add.", "data":specificationType.data});
								  	}else{
								  		res.json(specificationType);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		metricOperationalStatus: function addMetricOperationalStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .-]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'METRIC_OPERATIONAL_STATUS', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataMetricOperationalStatus = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('metricOperationalStatus', {"apikey": apikey}, {body: dataMetricOperationalStatus, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addMetricOperationalStatus"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricOperationalStatus = body; //object
								  	//cek apakah ada error atau tidak
								  	if(metricOperationalStatus.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Metric Operational Status has been add.", "data":metricOperationalStatus.data});
								  	}else{
								  		res.json(metricOperationalStatus);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		deviceMetricType: function addDeviceMetricType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .:]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .-:]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'DEVICE_METRIC_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataDeviceMetricType = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('deviceMetricType', {"apikey": apikey}, {body: dataDeviceMetricType, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addDeviceMetricType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var deviceMetricType = body; //object
								  	//cek apakah ada error atau tidak
								  	if(deviceMetricType.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Device Metric Type has been add.", "data":deviceMetricType.data});
								  	}else{
								  		res.json(deviceMetricType);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		metricColor: function addMetricColor(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'METRIC_COLOR', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataMetricColor = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('metricColor', {"apikey": apikey}, {body: dataMetricColor, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addMetricColor"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricColor = body; //object
								  	//cek apakah ada error atau tidak
								  	if(metricColor.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Metric Color has been add.", "data":metricColor.data});
								  	}else{
								  		res.json(metricColor);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		metricCategory: function addMetricCategory(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'METRIC_CATEGORY', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataMetricCategory = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('metricCategory', {"apikey": apikey}, {body: dataMetricCategory, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addMetricCategory"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricCategory = body; //object
								  	//cek apakah ada error atau tidak
								  	if(metricCategory.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Metric Category has been add.", "data":metricCategory.data});
								  	}else{
								  		res.json(metricCategory);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		metricCalibrationType: function addMetricCalibrationType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'METRIC_CALIBRATION_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataMetricCalibrationType = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('metricCalibrationType', {"apikey": apikey}, {body: dataMetricCalibrationType, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addMetricCalibrationType"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricCalibrationType = body; //object
								  	//cek apakah ada error atau tidak
								  	if(metricCalibrationType.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Metric Calibration Type has been add.", "data":metricCalibrationType.data});
								  	}else{
								  		res.json(metricCalibrationType);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
		metricCalibrationState: function addMetricCalibrationState(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
			var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'METRIC_CALIBRATION_STATE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataMetricCalibrationState = {
													"code": code,
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('metricCalibrationState', {"apikey": apikey}, {body: dataMetricCalibrationState, json:true}, function(error, response, body){
									if(error){
								  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addMetricCalibrationState"});
								  }else{
								  	//cek apakah ada error atau tidak
								  	var metricCalibrationState = body; //object
								  	//cek apakah ada error atau tidak
								  	if(metricCalibrationState.err_code == 0){
									  	res.json({"err_code": 0, "err_msg": "Metric Calibration State has been add.", "data":metricCalibrationState.data});
								  	}else{
								  		res.json(metricCalibrationState);
								  	}
								  }
								})
							}else{
								res.json(resultCode);
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
    substanceStatus: function addSubstanceStatus(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      
      var code = req.body.code.trim().toLowerCase();
      var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
      var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
      
      var err_code = 0;
      var err_msg = '';
      
      //input checking
      if(validator.isEmpty(code)){
        err_code = 1;
        err_msg = "Code is required";
      }

      if(validator.isEmpty(display)){
        err_code = 2;
        err_msg = "Display is required";
      }

      if(validator.isEmpty(definition)){
        err_code = 3;
        err_msg = "Definition is required";
      }

      if(err_code == 0){
        checkApikey(apikey, ipAddres, function(result){
          if(result.err_code == 0){
            checkCode(apikey, code, 'SUBSTANCE_STATUS', function(resultCode){
              if(resultCode.err_code == 0){
                //susun body
                var dataSubstanceStatus = {
                          "code": code,
                          "display": display,
                          "definition": definition
                        };
              
                //method, endpoint, params, options, callback
                ApiFHIR.post('substanceStatus', {"apikey": apikey}, {body: dataSubstanceStatus, json:true}, function(error, response, body){
                  if(error){
                    res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addSubstanceStatus"});
                  }else{
                    //cek apakah ada error atau tidak
                    var substanceStatus = body; //object
                    //cek apakah ada error atau tidak
                    if(substanceStatus.err_code == 0){
                      res.json({"err_code": 0, "err_msg": "Substance Status has been add.", "data":substanceStatus.data});
                    }else{
                      res.json(substanceStatus);
                    }
                  }
                })
              }else{
                res.json(resultCode);
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
    substanceCategory: function addSubstanceCategory(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      
      var code = req.body.code.trim().toLowerCase();
      var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
      var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
      
      var err_code = 0;
      var err_msg = '';
      
      //input checking
      if(validator.isEmpty(code)){
        err_code = 1;
        err_msg = "Code is required";
      }

      if(validator.isEmpty(display)){
        err_code = 2;
        err_msg = "Display is required";
      }

      if(validator.isEmpty(definition)){
        err_code = 3;
        err_msg = "Definition is required";
      }

      if(err_code == 0){
        checkApikey(apikey, ipAddres, function(result){
          if(result.err_code == 0){
            checkCode(apikey, code, 'SUBSTANCE_CATEGORY', function(resultCode){
              if(resultCode.err_code == 0){
                //susun body
                var dataSubstanceCategory = {
                          "code": code,
                          "display": display,
                          "definition": definition
                        };
              
                //method, endpoint, params, options, callback
                ApiFHIR.post('substanceCategory', {"apikey": apikey}, {body: dataSubstanceCategory, json:true}, function(error, response, body){
                  if(error){
                    res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addSubstanceCategory"});
                  }else{
                    //cek apakah ada error atau tidak
                    var substanceCategory = body; //object
                    //cek apakah ada error atau tidak
                    if(substanceCategory.err_code == 0){
                      res.json({"err_code": 0, "err_msg": "Substance Category has been add.", "data":substanceCategory.data});
                    }else{
                      res.json(substanceCategory);
                    }
                  }
                })
              }else{
                res.json(resultCode);
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
    substanceCode: function addSubstanceCode(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      
      var code = req.body.code.trim().toLowerCase();
      var display = req.body.display.replace(/[^\w\s , ( ) / .]/gi, '');
      var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
      
      var err_code = 0;
      var err_msg = '';
      
      //input checking
      if(!validator.isInt(code)){
        err_code = 1;
        err_msg = "Code is number";
      }

      if(validator.isEmpty(display)){
        err_code = 2;
        err_msg = "Display is required";
      }

      if(validator.isEmpty(definition)){
        definition = ""
      }

      if(err_code == 0){
        checkApikey(apikey, ipAddres, function(result){
          if(result.err_code == 0){
            checkCode(apikey, code, 'SUBSTANCE_CODE', function(resultCode){
              if(resultCode.err_code == 0){
                //susun body
                var dataSubstanceCode = {
                          "code": code,
                          "display": display,
                          "definition": definition
                        };
              
                //method, endpoint, params, options, callback
                ApiFHIR.post('substanceCode', {"apikey": apikey}, {body: dataSubstanceCode, json:true}, function(error, response, body){
                  if(error){
                    res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addSubstanceCode"});
                  }else{
                    //cek apakah ada error atau tidak
                    var substanceCode = body; //object
                    //cek apakah ada error atau tidak
                    if(substanceCode.err_code == 0){
                      res.json({"err_code": 0, "err_msg": "Substance Code has been add.", "data":substanceCode.data});
                    }else{
                      res.json(substanceCode);
                    }
                  }
                })
              }else{
                res.json(resultCode);
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
		organizationType: function addOrganizationType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}
			
			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'ORGANIZATION_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataOrganizationType = {
													"code": code,	
													"display": display,
													"definition": definition
												};
								console.log(dataOrganizationType);
								//method, endpoint, params, options, callback
								ApiFHIR.post('organizationType', {"apikey": apikey}, {body: dataOrganizationType, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addOrganizationType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var organizationType = body; //object
									  	//cek apakah ada error atau tidak
									  	if(organizationType.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Organization Type has been add.", "data":organizationType.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": organizationType.error, "application": "Api FHIR", "function": "addOrganizationType"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		contactentityType: function addContactentityType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toUpperCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'CONTACT_ENTITY_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataContactentityType = {
													"code": code,	
													"display": display,
													"definition": definition
												};
								console.log(dataContactentityType);
								//method, endpoint, params, options, callback
								ApiFHIR.post('contactentityType', {"apikey": apikey}, {body: dataContactentityType, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addContactentityType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var contactentityType = body; //object
									  	//cek apakah ada error atau tidak
											console.log(contactentityType);
									  	if(contactentityType.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Contactentity Type has been add.", "data":contactentityType.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": contactentityType.error, "application": "Api FHIR", "function": "addContactentityType"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		locationStatus: function addLocationStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'LOCATION_STATUS', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataLocationStatus = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('locationStatus', {"apikey": apikey}, {body: dataLocationStatus, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addLocationStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var locationStatus = body; //object
									  	//cek apakah ada error atau tidak
									  	if(locationStatus.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Location Status has been add.", "data":locationStatus.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": locationStatus.error, "application": "Api FHIR", "function": "addLocationStatus"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		bedStatus: function addBedStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toUpperCase();
			var description = req.body.description;
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(description)){
				err_code = 2;
				err_msg = "Description is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'BED_STATUS', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataBedStatus = {
													"code": code,	
													"description": description
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('bedStatus', {"apikey": apikey}, {body: dataBedStatus, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addBedStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var bedStatus = body; //object
									  	//cek apakah ada error atau tidak
									  	if(bedStatus.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Bed Status has been add.", "data":bedStatus.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": bedStatus.error, "application": "Api FHIR", "function": "addBedStatus"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		locationMode: function addLocationMode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'LOCATION_MODE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataLocationMode = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('locationMode', {"apikey": apikey}, {body: dataLocationMode, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addLocationMode"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var locationMode = body; //object
									  	//cek apakah ada error atau tidak
									  	if(locationMode.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Location Mode has been add.", "data":locationMode.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": locationMode.error, "application": "Api FHIR", "function": "addLocationMode"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		serviceDeliveryLocationRoleType: function addServiceDeliveryLocationRoleType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toUpperCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'SERVICE_DELIVERY_LOCATION_ROLE_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataServiceDeliveryLocationRoleTypeCode = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('serviceDeliveryLocationRoleType', {"apikey": apikey}, {body: dataServiceDeliveryLocationRoleTypeCode, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addServiceDeliveryLocationRoleType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var serviceDeliveryLocationRoleType = body; //object
									  	//cek apakah ada error atau tidak
									  	if(serviceDeliveryLocationRoleType.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Service Delivery Location Role Type has been add.", "data":serviceDeliveryLocationRoleType.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": serviceDeliveryLocationRoleType.error, "application": "Api FHIR", "function": "addServiceDeliveryLocationRoleType"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		locationPhysicalType: function addLocationPhysicalType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'LOCATION_PHYSICAL_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataLocationPhysicalType = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('locationPhysicalType', {"apikey": apikey}, {body: dataLocationPhysicalType, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addLocationPhysicalType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var locationPhysicalType = body; //object
									  	//cek apakah ada error atau tidak
									  	if(locationPhysicalType.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Location Physical Type has been add.", "data":locationPhysicalType.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": locationPhysicalType.error, "application": "Api FHIR", "function": "addLocationPhysicalType"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		qualificationCode: function addQualificationCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toUpperCase();
			var description = req.body.description;
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(description)){
				err_code = 2;
				err_msg = "Description is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'QUALIFICATION_CODE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataQualificationCode = {
													"code": code,	
													"description": description
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('qualificationCode', {"apikey": apikey}, {body: dataQualificationCode, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addQualificationCode"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var qualificationCode = body; //object
									  	//cek apakah ada error atau tidak
									  	if(qualificationCode.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Qualification Code has been add.", "data":qualificationCode.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": qualificationCode.error, "application": "Api FHIR", "function": "addQualificationCode"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		practitionerRoleCode: function addPractitionerRoleCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}
			
			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'PRACTITIONER_ROLE_CODE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataPractitionerRoleCode = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('practitionerRoleCode', {"apikey": apikey}, {body: dataPractitionerRoleCode, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addPractitionerRoleCode"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var practitionerRoleCode = body; //object
									  	//cek apakah ada error atau tidak
									  	if(practitionerRoleCode.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Practitioner Role Code has been add.", "data":practitionerRoleCode.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": practitionerRoleCode.error, "application": "Api FHIR", "function": "addPractitionerRoleCode"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		practiceCode: function addPracticeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim();
			var display = req.body.display;
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}
			
			//if (typeof code != "number") {
			if (isNaN(code)) {	
				err_code = 3;
				err_msg = "Code is not number";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'PRACTICE_CODE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataPracticeCode = {
													"code": code,	
													"display": display
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('practiceCode', {"apikey": apikey}, {body: dataPracticeCode, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addPracticeCode"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var practiceCode = body; //object
									  	//cek apakah ada error atau tidak
									  	if(practiceCode.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "PracticeCode has been add.", "data":practiceCode.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": practiceCode.error, "application": "Api FHIR", "function": "addPracticeCode"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		daysOfWeek: function addDaysOfWeek(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'DAYS_OF_WEEK', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataDaysOfWeek = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('daysOfWeek', {"apikey": apikey}, {body: dataDaysOfWeek, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addDaysOfWeek"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var daysOfWeek = body; //object
									  	//cek apakah ada error atau tidak
									  	if(daysOfWeek.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Days Of Week has been add.", "data":daysOfWeek.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": daysOfWeek.error, "application": "Api FHIR", "function": "addDaysOfWeek"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		serviceCategory: function addServiceCategory(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			//var code = req.body.code.trim().toLowerCase();
			var code = req.body.code;
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}
			
			//if (typeof code != "number") {
			if (isNaN(code)) {	
				err_code = 4;
				err_msg = "Code is not number";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'SERVICE_CATEGORY', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataServiceCategory = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('serviceCategory', {"apikey": apikey}, {body: dataServiceCategory, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addServiceCategory"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var serviceCategory = body; //object
									  	//cek apakah ada error atau tidak
									  	if(serviceCategory.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Service Category has been add.", "data":serviceCategory.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": serviceCategory.error, "application": "Api FHIR", "function": "addServiceCategory"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		serviceType: function addServiceType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 3;
				err_msg = "Definition is required";
			}
			
			//if (typeof code != "number") {
			if (isNaN(code)) {	
				err_code = 4;
				err_msg = "Code is not number";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'SERVICE_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataServiceType = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('serviceType', {"apikey": apikey}, {body: dataServiceType, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addServiceType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var serviceType = body; //object
									  	//cek apakah ada error atau tidak
									  	if(serviceType.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Service Type has been add.", "data":serviceType.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": serviceType.error, "application": "Api FHIR", "function": "addServiceType"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		serviceProvisionConditions: function addServiceProvisionConditions(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'SERVICE_PROVISION_CONDITIONS', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataServiceProvisionConditions = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('serviceProvisionConditions', {"apikey": apikey}, {body: dataServiceProvisionConditions, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addServiceProvisionConditions"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var serviceProvisionConditions = body; //object
									  	//cek apakah ada error atau tidak
									  	if(serviceProvisionConditions.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Service Provision Conditions has been add.", "data":serviceProvisionConditions.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": serviceProvisionConditions.error, "application": "Api FHIR", "function": "addServiceProvisionConditions"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		serviceReferralMethod: function addServiceReferralMethod(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'SERVICE_REFERRAL_METHOD', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataServiceReferralMethod = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('serviceReferralMethod', {"apikey": apikey}, {body: dataServiceReferralMethod, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addServiceReferralMethod"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var serviceReferralMethod = body; //object
									  	//cek apakah ada error atau tidak
									  	if(serviceReferralMethod.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Service Type has been add.", "data":serviceReferralMethod.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": serviceReferralMethod.error, "application": "Api FHIR", "function": "addServiceReferralMethod"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		endpointStatus: function addEndpointStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'ENDPOINT_STATUS', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataEndpointStatus = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('endpointStatus', {"apikey": apikey}, {body: dataEndpointStatus, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addEndpointStatus"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var endpointStatus = body; //object
											//cek apakah ada error atau tidak
									  	if(endpointStatus.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Endpoint Status has been add.", "data":endpointStatus.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": endpointStatus.error, "application": "Api FHIR", "function": "addEndpointStatus"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		endpointConnectionType: function addEndpointConnectionType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			if(validator.isEmpty(definition)){
				err_code = 2;
				err_msg = "Definition is required";
			}

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'ENDPOINT_CONNECTION_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataEndpointConnectionType = {
													"code": code,	
													"display": display,
													"definition": definition
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('endpointConnectionType', {"apikey": apikey}, {body: dataEndpointConnectionType, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addEndpointConnectionType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var endpointConnectionType = body; //object
									  	//cek apakah ada error atau tidak
									  	if(endpointConnectionType.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Endpoint Status has been add.", "data":endpointConnectionType.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": endpointConnectionType.error, "application": "Api FHIR", "function": "addEndpointConnectionType"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		endpointPayloadType: function addEndpointPayloadType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			
			var code = req.body.code.trim().toLowerCase();
			var display = req.body.display;
			
			var err_code = 0;
			var err_msg = '';
			
			//input checking
			if(validator.isEmpty(code)){
				err_code = 1;
				err_msg = "Code is required";
			}

			if(validator.isEmpty(display)){
				err_code = 2;
				err_msg = "Display is required";
			}

			

			if(err_code == 0){
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkCode(apikey, code, 'ENDPOINT_PAYLOAD_TYPE', function(resultCode){
							if(resultCode.err_code == 0){
								//susun body
								var dataEndpointPayloadType = {
													"code": code,	
													"display": display
												};
							
								//method, endpoint, params, options, callback
								ApiFHIR.post('endpointPayloadType', {"apikey": apikey}, {body: dataEndpointPayloadType, json:true}, function(error, response, body){
									if(error){
									  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addEndpointPayloadType"});
									  }else{
									  	//cek apakah ada error atau tidak
									  	var endpointPayloadType = body; //object
									  	//cek apakah ada error atau tidak
									  	if(endpointPayloadType.err_code == 0){
										  	res.json({"err_code": 0, "err_msg": "Endpoint Status has been add.", "data":endpointPayloadType.data});
									  	}else{
									  		res.json({"err_code": 3, "err_msg": endpointPayloadType.error, "application": "Api FHIR", "function": "addEndpointPayloadType"});
									  	}
									  }
								})
							}else{
								res.json(resultCode);
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
		}
	},
	put: {
		identityAssuranceLevel: function updateIdentityAssuranceLevel(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAssuranceLevel = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataAssuranceLevel.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataAssuranceLevel.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataAssuranceLevel.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'IDENTITY_ASSURANCE_LEVEL', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'IDENTITY_ASSURANCE_LEVEL', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('identityAssuranceLevel', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAssuranceLevel,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateIdentityAssuranceLevel"
														});
													} else {
														//cek apakah ada error atau tidak
														var assuranceLevel = body;

														//cek apakah ada error atau tidak
														if (assuranceLevel.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Identity Assurance has been update.",
																"data": assuranceLevel.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": assuranceLevel.error,
																"application": "Api FHIR",
																"function": "updateIdentityAssuranceLevel"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('identityAssuranceLevel', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAssuranceLevel,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateIdentityAssuranceLevel"
												});
											} else {
												//cek apakah ada error atau tidak
												var assuranceLevel = body;

												//cek apakah ada error atau tidak
												if (assuranceLevel.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Identity Assurance has been update.",
														"data": assuranceLevel.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": assuranceLevel.error,
														"application": "Api FHIR",
														"function": "updateIdentityAssuranceLevel"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		administrativeGender: function updateAdministrativeGender(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAdministrativeGender = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataAdministrativeGender.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataAdministrativeGender.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataAdministrativeGender.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ADMINISTRATIVE_GENDER', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ADMINISTRATIVE_GENDER', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('administrativeGender', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAdministrativeGender,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAdministrativeGender"
														});
													} else {
														//cek apakah ada error atau tidak
														var administrativeGender = body;

														//cek apakah ada error atau tidak
														if (administrativeGender.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Administrative Gender has been update.",
																"data": administrativeGender.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": administrativeGender.error,
																"application": "Api FHIR",
																"function": "updateAdministrativeGender"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('administrativeGender', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAdministrativeGender,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAdministrativeGender"
												});
											} else {
												//cek apakah ada error atau tidak
												var administrativeGender = body;

												//cek apakah ada error atau tidak
												if (administrativeGender.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Administrative Gender has been update.",
														"data": administrativeGender.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": administrativeGender.error,
														"application": "Api FHIR",
														"function": "updateAdministrativeGender"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		maritalStatus: function updateMaritalStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataMaritalStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toUpperCase();
				dataMaritalStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataMaritalStatus.display = display;
			}

			if (typeof req.body.system !== 'undefined') {
				var system = req.body.system;
				dataMaritalStatus.system = system;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataMaritalStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'MARITAL_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'MARITAL_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('maritalStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataMaritalStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateMaritalStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var maritalStatus = body;

														//cek apakah ada error atau tidak
														if (maritalStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Marital Status has been update.",
																"data": maritalStatus.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": maritalStatus.error,
																"application": "Api FHIR",
																"function": "updateMaritalStatus"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('maritalStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataMaritalStatus,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateMaritalStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var maritalStatus = body;

												//cek apakah ada error atau tidak
												if (maritalStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Marital Status has been update.",
														"data": maritalStatus.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": maritalStatus.error,
														"application": "Api FHIR",
														"function": "updateMaritalStatus"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		contactRole: function updateContactRole(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataMaritalStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toUpperCase();
				dataMaritalStatus.code = code;
			}

			if (typeof req.body.description !== 'undefined') {
				description = req.body.description.replace(/[^\w\s ,]/gi, '');
				dataMaritalStatus.description = description;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'CONTACT_ROLE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'CONTACT_ROLE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('contactRole', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataMaritalStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateContactRole"
														});
													} else {
														//cek apakah ada error atau tidak
														var contactRole = body;

														//cek apakah ada error atau tidak
														if (contactRole.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Contact Role has been update.",
																"data": contactRole.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": contactRole.error,
																"application": "Api FHIR",
																"function": "updateContactRole"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('contactRole', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataMaritalStatus,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateContactRole"
												});
											} else {
												//cek apakah ada error atau tidak
												var contactRole = body;

												//cek apakah ada error atau tidak
												if (contactRole.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Contact Role has been update.",
														"data": contactRole.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": contactRole.error,
														"application": "Api FHIR",
														"function": "updateContactRole"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		animalSpecies: function updateAnimalSpecies(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAnimalSpecies = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim();
				dataAnimalSpecies.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display.replace(/[^\w\s ,]/gi, '');
				dataAnimalSpecies.display = display;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ANIMAL_SPECIES', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ANIMAL_SPECIES', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('animalSpecies', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAnimalSpecies,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAnimalSpecies"
														});
													} else {
														//cek apakah ada error atau tidak
														var animalSpecies = body;

														//cek apakah ada error atau tidak
														if (animalSpecies.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Animal Species has been update.",
																"data": animalSpecies.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": animalSpecies.error,
																"application": "Api FHIR",
																"function": "updateAnimalSpecies"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('animalSpecies', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAnimalSpecies,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAnimalSpecies"
												});
											} else {
												//cek apakah ada error atau tidak
												var animalSpecies = body;

												//cek apakah ada error atau tidak
												if (animalSpecies.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Animal Species has been update.",
														"data": animalSpecies.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": animalSpecies.error,
														"application": "Api FHIR",
														"function": "updateAnimalSpecies"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		animalBreeds: function updateAnimalBreeds(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAnimalBreeds = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim();
				dataAnimalBreeds.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display; //.replace(/[^\w\s ,]/gi, '');
				dataAnimalBreeds.display = display;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ANIMAL_BREEDS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ANIMAL_BREEDS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('animalBreeds', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAnimalBreeds,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAnimalBreeds"
														});
													} else {
														//cek apakah ada error atau tidak
														var animalBreeds = body;

														//cek apakah ada error atau tidak
														if (animalBreeds.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Animal Breeds has been update.",
																"data": animalBreeds.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": animalBreeds.error,
																"application": "Api FHIR",
																"function": "updateAnimalBreeds"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('animalBreeds', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAnimalBreeds,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAnimalBreeds"
												});
											} else {
												//cek apakah ada error atau tidak
												var animalBreeds = body;

												//cek apakah ada error atau tidak
												if (animalBreeds.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Animal Breeds has been update.",
														"data": animalBreeds.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": animalBreeds.error,
														"application": "Api FHIR",
														"function": "updateAnimalBreeds"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		animalGenderStatus: function updateAnimalGenderStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAnimalGenderStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataAnimalGenderStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display; //.replace(/[^\w\s ,]/gi, '');
				dataAnimalGenderStatus.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataAnimalGenderStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ANIMAL_GENDER_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ANIMAL_GENDER_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('animalGenderStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAnimalGenderStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAnimalGenderStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var animalGenderStatus = body;

														//cek apakah ada error atau tidak
														if (animalGenderStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Animal Gender Status has been update.",
																"data": animalGenderStatus.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": animalGenderStatus.error,
																"application": "Api FHIR",
																"function": "updateAnimalGenderStatus"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('animalGenderStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAnimalGenderStatus,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAnimalGenderStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var animalGenderStatus = body;

												//cek apakah ada error atau tidak
												if (animalGenderStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Animal Breeds has been update.",
														"data": animalGenderStatus.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": animalGenderStatus.error,
														"application": "Api FHIR",
														"function": "updateAnimalGenderStatus"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		languages: function updateLanguage(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataLanguages = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim();
				dataLanguages.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display.replace(/[^\w\s ,]/gi, '');
				dataLanguages.display = display;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'LANGUAGES', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'LANGUAGES', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('languages', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataLanguages,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateLanguage"
														});
													} else {
														//cek apakah ada error atau tidak
														var languages = body;

														//cek apakah ada error atau tidak
														if (languages.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Language has been update.",
																"data": languages.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": languages.error,
																"application": "Api FHIR",
																"function": "updateLanguage"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('languages', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataLanguages,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateLanguage"
												});
											} else {
												//cek apakah ada error atau tidak
												var languages = body;

												//cek apakah ada error atau tidak
												if (languages.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Languages has been update.",
														"data": languages.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": languages.error,
														"application": "Api FHIR",
														"function": "updateLanguage"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		linkType: function updateLinkType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataLinkType = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataLinkType.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display.replace(/[^\w\s ,]/gi, '');
				dataLinkType.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataLinkType.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'LINK_TYPE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'LINK_TYPE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('linkType', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataLinkType,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateLinkType"
														});
													} else {
														//cek apakah ada error atau tidak
														var linkType = body;

														//cek apakah ada error atau tidak
														if (linkType.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Link Type has been update.",
																"data": linkType.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": linkType.error,
																"application": "Api FHIR",
																"function": "updateLinkType"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('linkType', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataLinkType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateLinkType"
												});
											} else {
												//cek apakah ada error atau tidak
												var linkType = body;

												//cek apakah ada error atau tidak
												if (linkType.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Link Type has been update.",
														"data": linkType.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": linkType.error,
														"application": "Api FHIR",
														"function": "updateLinkType"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		relatedPersonRelationshipType: function updateRelatedPersonRelationshipType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataRelatedPersonRelationshipType = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toUpperCase();
				dataRelatedPersonRelationshipType.code = code;
			}

			if (typeof req.body.system !== 'undefined') {
				system = req.body.system.replace(/[^\w\s ,]/gi, '');
				dataRelatedPersonRelationshipType.system = system;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display.replace(/[^\w\s ,]/gi, '');
				dataRelatedPersonRelationshipType.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');
				dataRelatedPersonRelationshipType.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'RELATEDPERSON_RELATIONSHIPTYPE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'RELATEDPERSON_RELATIONSHIPTYPE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('relatedPersonRelationshipType', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataRelatedPersonRelationshipType,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateRelatedPersonRelationshipType"
														});
													} else {
														//cek apakah ada error atau tidak
														var relatedPersonRelationshipType = body;

														//cek apakah ada error atau tidak
														if (relatedPersonRelationshipType.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Related Person Relationship Type has been update.",
																"data": relatedPersonRelationshipType.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": relatedPersonRelationshipType.error,
																"application": "Api FHIR",
																"function": "updateRelatedPersonRelationshipType"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('relatedPersonRelationshipType', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataRelatedPersonRelationshipType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateRelatedPersonRelationshipType"
												});
											} else {
												//cek apakah ada error atau tidak
												var relatedPersonRelationshipType = body;

												//cek apakah ada error atau tidak
												if (relatedPersonRelationshipType.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Related Person Relationship Type has been update.",
														"data": relatedPersonRelationshipType.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": relatedPersonRelationshipType.error,
														"application": "Api FHIR",
														"function": "updateRelatedPersonRelationshipType"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		groupType: function updateGroupType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataGroupType = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataGroupType.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display.replace(/[^\w\s ,]/gi, '');
				dataGroupType.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');
				dataGroupType.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'GROUP_TYPE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'GROUP_TYPE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('groupType', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataGroupType,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateGroupType"
														});
													} else {
														//cek apakah ada error atau tidak
														var groupType = body;

														//cek apakah ada error atau tidak
														if (groupType.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Group Type has been update.",
																"data": groupType.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": groupType.error,
																"application": "Api FHIR",
																"function": "updateGroupType"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('groupType', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataGroupType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateGroupType"
												});
											} else {
												//cek apakah ada error atau tidak
												var groupType = body;

												//cek apakah ada error atau tidak
												if (groupType.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Group Type has been update.",
														"data": groupType.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": groupType.error,
														"application": "Api FHIR",
														"function": "updateGroupType"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		identifierUse: function updateIdentifierUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataIdentifierUse = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataIdentifierUse.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display.replace(/[^\w\s ,]/gi, '');
				dataIdentifierUse.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				definition = req.body.definition.replace(/[^\w\s , ( )]/gi, '');
				dataIdentifierUse.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'IDENTIFIER_USE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'IDENTIFIER_USE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('identifierUse', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataIdentifierUse,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateIdentifierUse"
														});
													} else {
														//cek apakah ada error atau tidak
														var identifierUse = body;

														//cek apakah ada error atau tidak
														if (identifierUse.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Identifier Use has been update.",
																"data": identifierUse.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": identifierUse.error,
																"application": "Api FHIR",
																"function": "updateIdentifierUse"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('identifierUse', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataIdentifierUse,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateIdentifierUse"
												});
											} else {
												//cek apakah ada error atau tidak
												var identifierUse = body;

												//cek apakah ada error atau tidak
												if (identifierUse.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Identifier use has been update.",
														"data": identifierUse.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": identifierUse.error,
														"application": "Api FHIR",
														"function": "updateIdentifierUse"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		identifierType: function updateIdentifierType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataIdentifierType = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toUpperCase();
				dataIdentifierType.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display.replace(/[^\w\s , ( ) /]/gi, '');
				dataIdentifierType.display = display;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'IDENTIFIER_TYPE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'IDENTIFIER_TYPE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('identifierType', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataIdentifierType,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateIdentifierType"
														});
													} else {
														//cek apakah ada error atau tidak
														var identifierType = body;

														//cek apakah ada error atau tidak
														if (identifierType.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Identifier Type has been update.",
																"data": identifierType.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": identifierType.error,
																"application": "Api FHIR",
																"function": "updateIdentifierType"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('identifierType', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataIdentifierType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateIdentifierType"
												});
											} else {
												//cek apakah ada error atau tidak
												var identifierType = body;

												//cek apakah ada error atau tidak
												if (identifierType.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Identifier Type has been update.",
														"data": identifierType.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": identifierType.error,
														"application": "Api FHIR",
														"function": "updateIdentifierType"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		nameUse: function updateNameUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataNameUse = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim();
				dataNameUse.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataNameUse.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
				dataNameUse.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'NAME_USE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'NAME_USE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('nameUse', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataNameUse,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateNameUse"
														});
													} else {
														//cek apakah ada error atau tidak
														var nameUse = body;

														//cek apakah ada error atau tidak
														if (nameUse.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Name Use has been update.",
																"data": nameUse.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": nameUse.error,
																"application": "Api FHIR",
																"function": "updateNameUse"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('nameUse', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataNameUse,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateNameUse"
												});
											} else {
												//cek apakah ada error atau tidak
												var nameUse = body;

												//cek apakah ada error atau tidak
												if (nameUse.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Name Use has been update.",
														"data": nameUse.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": nameUse.error,
														"application": "Api FHIR",
														"function": "updateNameUse"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		contactPointSystem: function updateContactPointSystem(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataContactPointSystem = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataContactPointSystem.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataContactPointSystem.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
				dataContactPointSystem.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'CONTACT_POINT_SYSTEM', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'CONTACT_POINT_SYSTEM', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('contactPointSystem', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataContactPointSystem,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateContactPointSystem"
														});
													} else {
														//cek apakah ada error atau tidak
														var contactPointSystem = body;

														//cek apakah ada error atau tidak
														if (contactPointSystem.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Contact Point System has been update.",
																"data": contactPointSystem.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": contactPointSystem.error,
																"application": "Api FHIR",
																"function": "updateContactPointSystem"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('contactPointSystem', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataContactPointSystem,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateContactPointSystem"
												});
											} else {
												//cek apakah ada error atau tidak
												var contactPointSystem = body;

												//cek apakah ada error atau tidak
												if (contactPointSystem.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Contact Point System has been update.",
														"data": contactPointSystem.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": contactPointSystem.error,
														"application": "Api FHIR",
														"function": "updateContactPointSystem"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		contactPointUse: function updateContactPointUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataContactPointUse = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataContactPointUse.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataContactPointUse.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) /]/gi, '');
				dataContactPointUse.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'CONTACT_POINT_USE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'CONTACT_POINT_USE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('contactPointUse', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataContactPointUse,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateContactPointUse"
														});
													} else {
														//cek apakah ada error atau tidak
														var contactPointUse = body;

														//cek apakah ada error atau tidak
														if (contactPointUse.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Contact Point Use has been update.",
																"data": contactPointUse.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": contactPointUse.error,
																"application": "Api FHIR",
																"function": "updateContactPointUse"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('contactPointUse', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataContactPointUse,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateContactPointUse"
												});
											} else {
												//cek apakah ada error atau tidak
												var contactPointUse = body;

												//cek apakah ada error atau tidak
												if (contactPointUse.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Contact Point Use has been update.",
														"data": contactPointSystem.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": contactPointUse.error,
														"application": "Api FHIR",
														"function": "updateContactPointUse"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		addressUse: function updateAddressUse(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAddressUse = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataAddressUse.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataAddressUse.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataAddressUse.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ADDRESS_USE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ADDRESS_USE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('addressUse', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAddressUse,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAddressUse"
														});
													} else {
														//cek apakah ada error atau tidak
														var addressUse = body;

														//cek apakah ada error atau tidak
														if (addressUse.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Address Use has been update.",
																"data": addressUse.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": addressUse.error,
																"application": "Api FHIR",
																"function": "updateAddressUse"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('addressUse', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressUse,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAddressUse"
												});
											} else {
												//cek apakah ada error atau tidak
												var addressUse = body;

												//cek apakah ada error atau tidak
												if (addressUse.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Address Use has been update.",
														"data": addressUse.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": addressUse.error,
														"application": "Api FHIR",
														"function": "updateAddressUse"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		addressType: function updateAddressType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAddressType = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataAddressType.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataAddressType.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataAddressType.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ADDRESS_TYPE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ADDRESS_TYPE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('addressType', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAddressType,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAddressType"
														});
													} else {
														//cek apakah ada error atau tidak
														var addressType = body;

														//cek apakah ada error atau tidak
														if (addressType.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Address Type has been update.",
																"data": addressType.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": addressType.error,
																"application": "Api FHIR",
																"function": "updateAddressType"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('addressType', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAddressType"
												});
											} else {
												//cek apakah ada error atau tidak
												var addressType = body;

												//cek apakah ada error atau tidak
												if (addressType.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Address Type has been update.",
														"data": addressType.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": addressType.error,
														"application": "Api FHIR",
														"function": "updateAddressType"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		appointmentReasonCode: function updateAppointmentReasonCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAppointmentReasonCode = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toUpperCase();
				dataAppointmentReasonCode.code = code;
			}

			if (typeof req.body.description !== 'undefined') {
				var description = req.body.description.replace(/[^\w\s ,]/gi, '');
				dataAppointmentReasonCode.description = description;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'APPOINTMENT_REASON_CODE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'APPOINTMENT_REASON_CODE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('appointmentReasonCode', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAppointmentReasonCode,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAppointmentReasonCode"
														});
													} else {
														//cek apakah ada error atau tidak
														var appointmentReasonCode = body;

														//cek apakah ada error atau tidak
														if (appointmentReasonCode.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Appointment Reason Code has been update.",
																"data": appointmentReasonCode.data
															});
														} else {
															res.json(appointmentReasonCode);
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('appointmentReasonCode', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAppointmentReasonCode,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAppointmentReasonCode"
												});
											} else {
												//cek apakah ada error atau tidak
												var appointmentReasonCode = body;

												//cek apakah ada error atau tidak
												if (appointmentReasonCode.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Appointment Reason Code has been update.",
														"data": appointmentReasonCode.data
													});
												} else {
													res.json(appointmentReasonCode);
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		slotStatus: function updateSlotStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataSlotStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataSlotStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataSlotStatus.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataSlotStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'SLOT_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'SLOT_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('slotStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataSlotStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateSlotStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var slotStatus = body;
														//cek apakah ada error atau tidak
														if (slotStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Slot Status has been update.",
																"data": slotStatus.data
															});
														} else {
															res.json(slotStatus);
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('slotStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataSlotStatus,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateSlotStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var slotStatus = body;
												//cek apakah ada error atau tidak
												if (slotStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Slot Status has been update.",
														"data": slotStatus.data
													});
												} else {
													res.json(slotStatus);
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		appointmentStatus: function updateAppointmentStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAppointmentStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataAppointmentStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataAppointmentStatus.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataAppointmentStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'APPOINTMENT_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'APPOINTMENT_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('appointmentStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAppointmentStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAppointmentStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var appointmentStatus = body;
														//cek apakah ada error atau tidak
														if (appointmentStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Appointment Status has been update.",
																"data": appointmentStatus.data
															});
														} else {
															res.json(appointmentStatus);
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('appointmentStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAppointmentStatus,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAppointmentStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var appointmentStatus = body;
												//cek apakah ada error atau tidak
												if (appointmentStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Appointment Status has been update.",
														"data": appointmentStatus.data
													});
												} else {
													res.json(appointmentStatus);
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		participantRequired: function updateParticipantRequired(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataParticipantRequired = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataParticipantRequired.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataParticipantRequired.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataParticipantRequired.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'PARTICIPANT_REQUIRED', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'PARTICIPANT_REQUIRED', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('participantRequired', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataParticipantRequired,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateParticipantRequired"
														});
													} else {
														//cek apakah ada error atau tidak
														var participantRequired = body;
														//cek apakah ada error atau tidak
														if (participantRequired.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Participant Required has been update.",
																"data": participantRequired.data
															});
														} else {
															res.json(participantRequired);
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('participantRequired', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataParticipantRequired,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateParticipantRequired"
												});
											} else {
												//cek apakah ada error atau tidak
												var participantRequired = body;
												//cek apakah ada error atau tidak
												if (participantRequired.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Participant Required has been update.",
														"data": participantRequired.data
													});
												} else {
													res.json(participantRequired);
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		participationStatus: function updateparticipationStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataparticipationStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataparticipationStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataparticipationStatus.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataparticipationStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'PARTICIPATION_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'PARTICIPATION_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('participationStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataparticipationStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateparticipationStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var participationStatus = body;
														//cek apakah ada error atau tidak
														if (participationStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Participant Status has been update.",
																"data": participationStatus.data
															});
														} else {
															res.json(participationStatus);
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('participationStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataparticipationStatus,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateparticipationStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var participationStatus = body;
												//cek apakah ada error atau tidak
												if (participationStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Participant Status has been update.",
														"data": participationStatus.data
													});
												} else {
													res.json(participationStatus);
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		actEncounterCode: function updateActEncounterCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataActEncounterCode = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toUpperCase();
				dataActEncounterCode.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataActEncounterCode.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataActEncounterCode.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ACT_ENCOUNTER_CODE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ACT_ENCOUNTER_CODE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('actEncounterCode', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataActEncounterCode,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateActEncounterCode"
														});
													} else {
														//cek apakah ada error atau tidak
														var actEncounterCode = body;

														//cek apakah ada error atau tidak
														if (actEncounterCode.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Act Encounter Code has been update.",
																"data": actEncounterCode.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": actEncounterCode.error,
																"application": "Api FHIR",
																"function": "updateActEncounterCode"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('actEncounterCode', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateActEncounterCode"
												});
											} else {
												//cek apakah ada error atau tidak
												var actEncounterCode = body;

												//cek apakah ada error atau tidak
												if (actEncounterCode.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Act Encounter Code has been update.",
														"data": actEncounterCode.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": actEncounterCode.error,
														"application": "Api FHIR",
														"function": "updateActEncounterCode"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		actPriority: function updateActPriority(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataActPriority = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toUpperCase();
				dataActPriority.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataActPriority.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataActPriority.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ACT_PRIORITY', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ACT_PRIORITY', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('actPriority', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataActPriority,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateActPriority"
														});
													} else {
														//cek apakah ada error atau tidak
														var actPriority = body;

														//cek apakah ada error atau tidak
														if (actPriority.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Act Priority has been update.",
																"data": actPriority.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": actPriority.error,
																"application": "Api FHIR",
																"function": "updateActPriority"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('actPriority', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateActPriority"
												});
											} else {
												//cek apakah ada error atau tidak
												var actPriority = body;

												//cek apakah ada error atau tidak
												if (actPriority.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Act Priority has been update.",
														"data": actPriority.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": actPriority.error,
														"application": "Api FHIR",
														"function": "updateActPriority"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		accountStatus: function updateAccountStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAccountStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataAccountStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataAccountStatus.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataAccountStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ACCOUNT_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ACCOUNT_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('accountStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAccountStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAccountStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var accountStatus = body;

														//cek apakah ada error atau tidak
														if (accountStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Account Status has been update.",
																"data": accountStatus.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": accountStatus.error,
																"application": "Api FHIR",
																"function": "updateAccountStatus"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('accountStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAccountStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var accountStatus = body;

												//cek apakah ada error atau tidak
												if (accountStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Account Status has been update.",
														"data": accountStatus.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": accountStatus.error,
														"application": "Api FHIR",
														"function": "updateAccountStatus"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		accountType: function updateAccountType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataAccountType = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataAccountType.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataAccountType.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataAccountType.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ACCOUNT_TYPE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ACCOUNT_TYPE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('accountType', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataAccountType,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateAccountType"
														});
													} else {
														//cek apakah ada error atau tidak
														var accountType = body;

														//cek apakah ada error atau tidak
														if (accountType.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Account Type has been update.",
																"data": accountType.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": accountType.error,
																"application": "Api FHIR",
																"function": "updateAccountType"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('accountType', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateAccountType"
												});
											} else {
												//cek apakah ada error atau tidak
												var accountType = body;

												//cek apakah ada error atau tidak
												if (accountType.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Account Type has been update.",
														"data": accountType.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": accountType.error,
														"application": "Api FHIR",
														"function": "updateAccountType"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		diagnosisRole: function updateDiagnosisRole(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataDiagnosisRole = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataDiagnosisRole.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataDiagnosisRole.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataDiagnosisRole.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'DIAGNOSIS_ROLE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'DIAGNOSIS_ROLE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('diagnosisRole', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataDiagnosisRole,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateDiagnosisRole"
														});
													} else {
														//cek apakah ada error atau tidak
														var diagnosisRole = body;

														//cek apakah ada error atau tidak
														if (diagnosisRole.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Diagnosis Role has been update.",
																"data": diagnosisRole.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": diagnosisRole.error,
																"application": "Api FHIR",
																"function": "updateDiagnosisRole"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('diagnosisRole', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateDiagnosisRole"
												});
											} else {
												//cek apakah ada error atau tidak
												var diagnosisRole = body;

												//cek apakah ada error atau tidak
												if (diagnosisRole.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Diagnosis Role has been update.",
														"data": diagnosisRole.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": diagnosisRole.error,
														"application": "Api FHIR",
														"function": "updateDiagnosisRole"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterAdmitSource: function updateEncounterAdmitSource(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterAdmitSource = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEncounterAdmitSource.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterAdmitSource.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterAdmitSource.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_ADMIT_SOURCE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_ADMIT_SOURCE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterAdmitSource', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterAdmitSource,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterAdmitSource"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterAdmitSource = body;

														//cek apakah ada error atau tidak
														if (encounterAdmitSource.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Admit Source has been update.",
																"data": encounterAdmitSource.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterAdmitSource.error,
																"application": "Api FHIR",
																"function": "updateEncounterAdmitSource"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterAdmitSource', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterAdmitSource"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterAdmitSource = body;

												//cek apakah ada error atau tidak
												if (encounterAdmitSource.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Admit Source has been update.",
														"data": encounterAdmitSource.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterAdmitSource.error,
														"application": "Api FHIR",
														"function": "updateEncounterAdmitSource"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterDiet: function updateEncounterDiet(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterDiet = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEncounterDiet.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterDiet.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterDiet.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_DIET', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_DIET', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterDiet', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterDiet,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterDiet"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterDiet = body;

														//cek apakah ada error atau tidak
														if (encounterDiet.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Diet has been update.",
																"data": encounterDiet.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterDiet.error,
																"application": "Api FHIR",
																"function": "updateEncounterDiet"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterDiet', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterDiet"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterDiet = body;

												//cek apakah ada error atau tidak
												if (encounterDiet.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Diet has been update.",
														"data": encounterDiet.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterDiet.error,
														"application": "Api FHIR",
														"function": "updateEncounterDiet"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterDischargeDisposition: function updateEncounterDischargeDisposition(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterDischargeDisposition = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEncounterDischargeDisposition.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterDischargeDisposition.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterDischargeDisposition.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_DISCHARGE_DISPOSITION', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_DISCHARGE_DISPOSITION', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterDischargeDisposition', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterDischargeDisposition,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterDischargeDisposition"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterDischargeDisposition = body;

														//cek apakah ada error atau tidak
														if (encounterDischargeDisposition.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Discharge Disposition has been update.",
																"data": encounterDischargeDisposition.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterDischargeDisposition.error,
																"application": "Api FHIR",
																"function": "updateEncounterDischargeDisposition"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterDischargeDisposition', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterDischargeDisposition"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterDischargeDisposition = body;

												//cek apakah ada error atau tidak
												if (encounterDischargeDisposition.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Discharge Disposition has been update.",
														"data": encounterDischargeDisposition.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterDischargeDisposition.error,
														"application": "Api FHIR",
														"function": "updateEncounterDischargeDisposition"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterLocationStatus: function updateEncounterLocationStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterLocationStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEncounterLocationStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterLocationStatus.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterLocationStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_LOCATION_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_LOCATION_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterLocationStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterLocationStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterLocationStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterLocationStatus = body;

														//cek apakah ada error atau tidak
														if (encounterLocationStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Location Status has been update.",
																"data": encounterLocationStatus.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterLocationStatus.error,
																"application": "Api FHIR",
																"function": "updateEncounterLocationStatus"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterLocationStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterLocationStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterLocationStatus = body;

												//cek apakah ada error atau tidak
												if (encounterLocationStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Location Status has been update.",
														"data": encounterLocationStatus.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterLocationStatus.error,
														"application": "Api FHIR",
														"function": "updateEncounterLocationStatus"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterParticipantType: function updateEncounterParticipantType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterParticipantType = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEncounterParticipantType.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterParticipantType.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterParticipantType.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_PARTICIPANT_TYPE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_PARTICIPANT_TYPE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterParticipantType', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterParticipantType,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterParticipantType"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterParticipantType = body;

														//cek apakah ada error atau tidak
														if (encounterParticipantType.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Participant Type has been update.",
																"data": encounterParticipantType.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterParticipantType.error,
																"application": "Api FHIR",
																"function": "updateEncounterParticipantType"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterParticipantType', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterParticipantType"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterParticipantType = body;

												//cek apakah ada error atau tidak
												if (encounterParticipantType.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Participant Type has been update.",
														"data": encounterParticipantType.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterParticipantType.error,
														"application": "Api FHIR",
														"function": "updateEncounterParticipantType"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterReason: function updateEncounterReason(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterReason = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEncounterReason.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterReason.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterReason.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_REASON', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_REASON', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterReason', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterReason,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterReason"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterReason = body;

														//cek apakah ada error atau tidak
														if (encounterReason.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Reason has been update.",
																"data": encounterReason.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterReason.error,
																"application": "Api FHIR",
																"function": "updateEncounterReason"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterReason', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterReason"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterReason = body;

												//cek apakah ada error atau tidak
												if (encounterReason.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Reason been update.",
														"data": encounterReason.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterReason.error,
														"application": "Api FHIR",
														"function": "updateEncounterReason"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterSpecialCourtesy: function updateEncounterSpecialCourtesy(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterSpecialCourtesy = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toUpperCase();
				dataEncounterSpecialCourtesy.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterSpecialCourtesy.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterSpecialCourtesy.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_SPECIAL_COURTESY', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_SPECIAL_COURTESY', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterSpecialCourtesy', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterSpecialCourtesy,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterSpecialCourtesy"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterSpecialCourtesy = body;

														//cek apakah ada error atau tidak
														if (encounterSpecialCourtesy.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Special Courtesy has been update.",
																"data": encounterSpecialCourtesy.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterSpecialCourtesy.error,
																"application": "Api FHIR",
																"function": "updateEncounterSpecialCourtesy"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterSpecialCourtesy', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterSpecialCourtesy"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterSpecialCourtesy = body;

												//cek apakah ada error atau tidak
												if (encounterSpecialCourtesy.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Special Courtesy  has been update.",
														"data": encounterSpecialCourtesy.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterSpecialCourtesy.error,
														"application": "Api FHIR",
														"function": "updateEncounterSpecialCourtesy"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterSpecialArrangements: function updateEncounterSpecialArrangements(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterSpecialArrangements = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEncounterSpecialArrangements.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterSpecialArrangements.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterSpecialArrangements.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_SPECIAL_ARRANGEMENTS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_SPECIAL_ARRANGEMENTS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterSpecialArrangements', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterSpecialArrangements,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterSpecialArrangements"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterSpecialArrangements = body;

														//cek apakah ada error atau tidak
														if (encounterSpecialArrangements.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Special Arrangements has been update.",
																"data": encounterSpecialArrangements.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterSpecialArrangements.error,
																"application": "Api FHIR",
																"function": "updateEncounterSpecialArrangements"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterSpecialArrangements', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterSpecialArrangements"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterSpecialArrangements = body;

												//cek apakah ada error atau tidak
												if (encounterSpecialArrangements.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Special Arrangements has been update.",
														"data": encounterSpecialArrangements.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterSpecialArrangements.error,
														"application": "Api FHIR",
														"function": "updateEncounterSpecialArrangements"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterStatus: function updateEncounterStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEncounterStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterStatus.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterStatus = body;

														//cek apakah ada error atau tidak
														if (encounterStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Status has been update.",
																"data": encounterStatus.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterStatus.error,
																"application": "Api FHIR",
																"function": "updateEncounterStatus"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterStatus = body;

												//cek apakah ada error atau tidak
												if (encounterStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Status has been update.",
														"data": encounterStatus.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterStatus.error,
														"application": "Api FHIR",
														"function": "updateEncounterStatus"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		encounterType: function updateEncounterType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEncounterType = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase().replace("/", "<or>");
				dataEncounterType.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataEncounterType.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEncounterType.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'ENCOUNTER_TYPE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'ENCOUNTER_TYPE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('encounterType', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEncounterType,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEncounterType"
														});
													} else {
														//cek apakah ada error atau tidak
														var encounterType = body;

														//cek apakah ada error atau tidak
														if (encounterType.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Encounter Type has been update.",
																"data": encounterType.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": encounterType.error,
																"application": "Api FHIR",
																"function": "updateEncounterType"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('encounterType', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEncounterType"
												});
											} else {
												//cek apakah ada error atau tidak
												var encounterType = body;

												//cek apakah ada error atau tidak
												if (encounterType.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Encounter Type has been update.",
														"data": encounterType.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": encounterType.error,
														"application": "Api FHIR",
														"function": "updateEncounterType"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		episodeOfCareStatus: function updateEpisodeOfCareStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEpisodeOfCareStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEpisodeOfCareStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataEpisodeOfCareStatus.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEpisodeOfCareStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'EPISODE_OF_CARE_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'EPISODE_OF_CARE_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('episodeOfCareStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEpisodeOfCareStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEpisodeOfCareStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var episodeOfCareStatus = body;

														//cek apakah ada error atau tidak
														if (episodeOfCareStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Episode Of Care Status has been update.",
																"data": episodeOfCareStatus.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": episodeOfCareStatus.error,
																"application": "Api FHIR",
																"function": "updateEpisodeOfCareStatus"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('episodeOfCareStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataEpisodeOfCareStatus,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEpisodeOfCareStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var episodeOfCareStatus = body;

												//cek apakah ada error atau tidak
												if (episodeOfCareStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Episode Of Care Status has been update.",
														"data": episodeOfCareStatus.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": episodeOfCareStatus.error,
														"application": "Api FHIR",
														"function": "updateEpisodeOfCareStatus"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		episodeOfCareType: function updateEpisodeOfCareType(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataEpisodeOfCareType = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataEpisodeOfCareType.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataEpisodeOfCareType.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataEpisodeOfCareType.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'EPISODE_OF_CARE_TYPE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'EPISODE_OF_CARE_TYPE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('episodeOfCareType', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataEpisodeOfCareType,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateEpisodeOfCareType"
														});
													} else {
														//cek apakah ada error atau tidak
														var episodeOfCareType = body;

														//cek apakah ada error atau tidak
														if (episodeOfCareType.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Episode Of Care Type has been update.",
																"data": episodeOfCareType.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": episodeOfCareType.error,
																"application": "Api FHIR",
																"function": "updateEpisodeOfCareType"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('episodeOfCareType', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateEpisodeOfCareType"
												});
											} else {
												//cek apakah ada error atau tidak
												var episodeOfCareType = body;

												//cek apakah ada error atau tidak
												if (episodeOfCareType.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Episode Of Care Type has been update.",
														"data": episodeOfCareType.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": episodeOfCareType.error,
														"application": "Api FHIR",
														"function": "updateEpisodeOfCareType"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		flagStatus: function updateFlagStatus(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataFlagStatus = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataFlagStatus.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataFlagStatus.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataFlagStatus.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'FLAG_STATUS', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'FLAG_STATUS', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('flagStatus', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataFlagStatus,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateFlagStatus"
														});
													} else {
														//cek apakah ada error atau tidak
														var flagStatus = body;

														//cek apakah ada error atau tidak
														if (flagStatus.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Flag Status has been update.",
																"data": flagStatus.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": flagStatus.error,
																"application": "Api FHIR",
																"function": "updateFlagStatus"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('flagStatus', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateFlagStatus"
												});
											} else {
												//cek apakah ada error atau tidak
												var flagStatus = body;

												//cek apakah ada error atau tidak
												if (flagStatus.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Flag Status has been update.",
														"data": flagStatus.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": flagStatus.error,
														"application": "Api FHIR",
														"function": "updateFlagStatus"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		flagCategory: function updateFlagCategory(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataFlagCategory = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataFlagCategory.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataFlagCategory.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataFlagCategory.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'FLAG_CATEGORY', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'FLAG_CATEGORY', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('flagCategory', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataFlagCategory,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateFlagCategory"
														});
													} else {
														//cek apakah ada error atau tidak
														var flagCategory = body;

														//cek apakah ada error atau tidak
														if (flagCategory.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Flag Category has been update.",
																"data": flagCategory.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": flagCategory.error,
																"application": "Api FHIR",
																"function": "updateFlagCategory"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('flagCategory', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateFlagCategory"
												});
											} else {
												//cek apakah ada error atau tidak
												var flagCategory = body;

												//cek apakah ada error atau tidak
												if (flagCategory.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Flag Category has been update.",
														"data": flagCategory.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": flagCategory.error,
														"application": "Api FHIR",
														"function": "updateFlagCategory"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		flagCode: function updateFlagCode(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataFlagCode = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataFlagCode.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				var display = req.body.display;
				dataFlagCode.display = display;
			}

			if (typeof req.body.definition !== 'undefined') {
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataFlagCode.definition = definition;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'FLAG_CODE', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'FLAG_CODE', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('flagCode', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataFlagCode,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateFlagCode"
														});
													} else {
														//cek apakah ada error atau tidak
														var flagCode = body;

														//cek apakah ada error atau tidak
														if (flagCode.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Flag Status has been update.",
																"data": flagCode.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": flagCode.error,
																"application": "Api FHIR",
																"function": "updateFlagCode"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('flagCode', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateFlagCode"
												});
											} else {
												//cek apakah ada error atau tidak
												var flagCode = body;

												//cek apakah ada error atau tidak
												if (flagCode.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Flag Status has been update.",
														"data": flagCode.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": flagCode.error,
														"application": "Api FHIR",
														"function": "updateFlagCode"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		reAdmissionIndicator: function updateReAdmissionIndicator(req, res) {
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataReAdmissionIndicator = {};

			if (typeof req.body.code !== 'undefined') {
				var code = req.body.code.trim().toLowerCase();
				dataReAdmissionIndicator.code = code;
			}

			if (typeof req.body.display !== 'undefined') {
				display = req.body.display;
				dataReAdmissionIndicator.display = display;
			}

			if (typeof req.body.description !== 'undefined') {
				var description = req.body.description.replace(/[^\w\s ,]/gi, '');
				dataReAdmissionIndicator.description = description;
			}

			if (_id == "" || typeof _id == 'undefined') {
				res.json({
					"err_code": 5,
					"err_msg": "Id is required."
				});
			} else {
				if (validator.isInt(_id)) {
					checkApikey(apikey, ipAddres, function (result) {
						if (result.err_code == 0) {
							checkId(apikey, _id, 'RE_ADMISSION_INDICATOR', function (resultCheckId) {
								if (resultCheckId.err_code == 0) {
									if (typeof req.body.code !== 'undefined') {
										checkCode(apikey, code, 'RE_ADMISSION_INDICATOR', function (resultCode) {
											if (resultCode.err_code == 0) {
												//method, endpoint, params, options, callback
												ApiFHIR.put('reAdmissionIndicator', {
													"apikey": apikey,
													"_id": _id
												}, {
													body: dataReAdmissionIndicator,
													json: true
												}, function (error, response, body) {
													if (error) {
														res.json({
															"err_code": 1,
															"err_msg": error,
															"application": "Api FHIR",
															"function": "updateReAdmissionIndicator"
														});
													} else {
														//cek apakah ada error atau tidak
														var reAdmissionIndicator = body;

														//cek apakah ada error atau tidak
														if (reAdmissionIndicator.err_code == 0) {
															res.json({
																"err_code": 0,
																"err_msg": "Re Admission Indicator has been update.",
																"data": reAdmissionIndicator.data
															});
														} else {
															res.json({
																"err_code": 3,
																"err_msg": reAdmissionIndicator.error,
																"application": "Api FHIR",
																"function": "updateReAdmissionIndicator"
															});
														}
													}
												})
											} else {
												res.json(resultCode);
											}
										})
									} else {
										//method, endpoint, params, options, callback
										ApiFHIR.put('reAdmissionIndicator', {
											"apikey": apikey,
											"_id": _id
										}, {
											body: dataAddressType,
											json: true
										}, function (error, response, body) {
											if (error) {
												res.json({
													"err_code": 1,
													"err_msg": error,
													"application": "Api FHIR",
													"function": "updateReAdmissionIndicator"
												});
											} else {
												//cek apakah ada error atau tidak
												var reAdmissionIndicator = body;

												//cek apakah ada error atau tidak
												if (reAdmissionIndicator.err_code == 0) {
													res.json({
														"err_code": 0,
														"err_msg": "Re Admission Indicator has been update.",
														"data": reAdmissionIndicator.data
													});
												} else {
													res.json({
														"err_code": 3,
														"err_msg": reAdmissionIndicator.error,
														"application": "Api FHIR",
														"function": "updateReAdmissionIndicator"
													});
												}
											}
										})
									}
								} else {
									res.json(resultCheckId);
								}
							})
						} else {
							result.err_code = 500;
							res.json(result);
						}
					});
				} else {
					res.json({
						"err_code": 4,
						"err_msg": "Id must be a number."
					});
				}
			}
		},
		udiEntryType: function updateUdiEntryType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataUdiEntryType = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataUdiEntryType.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataUdiEntryType.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataUdiEntryType.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'UDI_ENTRY_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'UDI_ENTRY_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('udiEntryType', {"apikey": apikey, "_id": _id}, {body: dataUdiEntryType, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateUdiEntryType"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var udiEntryType = body; 
												  	//cek apakah ada error atau tidak
												  	if(udiEntryType.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Udi Entry Type has been update.","data":udiEntryType.data});
												  	}else{
												  		res.json(udiEntryType);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('udiEntryType', {"apikey": apikey, "_id": _id}, {body: dataUdiEntryType, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateUdiEntryType"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var udiEntryType = body; 
										  	//cek apakah ada error atau tidak
										  	if(udiEntryType.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Udi Entry Type has been update.","data":udiEntryType.data});
										  	}else{
										  		res.json(udiEntryType);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		deviceStatus: function updateDeviceStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataDeviceStatus = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataDeviceStatus.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataDeviceStatus.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataDeviceStatus.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'DEVICE_STATUS', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'DEVICE_STATUS', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('deviceStatus', {"apikey": apikey, "_id": _id}, {body: dataDeviceStatus, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDeviceStatus"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var deviceStatus = body; 
												  	//cek apakah ada error atau tidak
												  	if(deviceStatus.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Device Status has been update.","data":deviceStatus.data});
												  	}else{
												  		res.json(deviceStatus);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('deviceStatus', {"apikey": apikey, "_id": _id}, {body: dataDeviceStatus, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDeviceStatus"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var deviceStatus = body; 
										  	//cek apakah ada error atau tidak
										  	if(deviceStatus.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Device Status has been update.","data":deviceStatus.data});
										  	}else{
										  		res.json(deviceStatus);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		deviceKind: function updateDeviceKind(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var datadeviceKind = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim();
				datadeviceKind.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				datadeviceKind.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				datadeviceKind.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'DEVICE_KIND', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'DEVICE_KIND', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('deviceKind', {"apikey": apikey, "_id": _id}, {body: datadeviceKind, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDeviceKind"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var deviceKind = body; 
												  	//cek apakah ada error atau tidak
												  	if(deviceKind.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Device Kind has been update.","data":deviceKind.data});
												  	}else{
												  		res.json(deviceKind);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('deviceKind', {"apikey": apikey, "_id": _id}, {body: datadeviceKind, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDeviceKind"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var deviceKind = body; 
										  	//cek apakah ada error atau tidak
										  	if(deviceKind.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Device Kind has been update.","data":deviceKind.data});
										  	}else{
										  		res.json(deviceKind);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		deviceSafety: function updateDeviceSafety(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataDeviceSafety = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toUpperCase();
				dataDeviceSafety.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataDeviceSafety.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataDeviceSafety.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'DEVICE_SAFETY', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'DEVICE_SAFETY', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('deviceSafety', {"apikey": apikey, "_id": _id}, {body: dataDeviceSafety, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDeviceSafety"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var deviceSafety = body; 
												  	//cek apakah ada error atau tidak
												  	if(deviceSafety.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Device Safety has been update.","data":deviceSafety.data});
												  	}else{
												  		res.json(deviceSafety);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('deviceSafety', {"apikey": apikey, "_id": _id}, {body: dataDeviceSafety, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDeviceSafety"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var deviceSafety = body; 
										  	//cek apakah ada error atau tidak
										  	if(deviceSafety.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Device Safety has been update.","data":deviceSafety.data});
										  	}else{
										  		res.json(deviceSafety);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		operationalStatus: function updateOperationalStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataOperationalStatus = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataOperationalStatus.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataOperationalStatus.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .]/gi, '');
				dataOperationalStatus.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'OPERATIONAL_STATUS', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'OPERATIONAL_STATUS', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('operationalStatus', {"apikey": apikey, "_id": _id}, {body: dataOperationalStatus, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateOperationalStatus"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var operationalStatus = body; 
												  	//cek apakah ada error atau tidak
												  	if(operationalStatus.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Operational Status has been update.","data":operationalStatus.data});
												  	}else{
												  		res.json(operationalStatus);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('operationalStatus', {"apikey": apikey, "_id": _id}, {body: dataOperationalStatus, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateOperationalStatus"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var operationalStatus = body; 
										  	//cek apakah ada error atau tidak
										  	if(operationalStatus.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Operational Status has been update.","data":operationalStatus.data});
										  	}else{
										  		res.json(operationalStatus);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		parameterGroup: function updateParameterGroup(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataParameterGroup = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataParameterGroup.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataParameterGroup.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .-]/gi, '');
				dataParameterGroup.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'PARAMETER_GROUP', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'PARAMETER_GROUP', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('parameterGroup', {"apikey": apikey, "_id": _id}, {body: dataParameterGroup, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateParameterGroup"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var parameterGroup = body; 
												  	//cek apakah ada error atau tidak
												  	if(parameterGroup.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Parameter Group has been update.","data":parameterGroup.data});
												  	}else{
												  		res.json(parameterGroup);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('parameterGroup', {"apikey": apikey, "_id": _id}, {body: dataParameterGroup, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateParameterGroup"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var parameterGroup = body; 
										  	//cek apakah ada error atau tidak
										  	if(parameterGroup.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Parameter Group has been update.","data":parameterGroup.data});
										  	}else{
										  		res.json(parameterGroup);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		measurementPrinciple: function updateMeasurementPrinciple(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataMeasurementPrinciple = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataMeasurementPrinciple.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataMeasurementPrinciple.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .-]/gi, '');
				dataMeasurementPrinciple.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'MEASUREMENT_PRINCIPLE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'MEASUREMENT_PRINCIPLE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('measurementPrinciple', {"apikey": apikey, "_id": _id}, {body: dataMeasurementPrinciple, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMeasurementPrinciple"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var measurementPrinciple = body; 
												  	//cek apakah ada error atau tidak
												  	if(measurementPrinciple.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Measurement Principle has been update.","data":measurementPrinciple.data});
												  	}else{
												  		res.json(measurementPrinciple);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('measurementPrinciple', {"apikey": apikey, "_id": _id}, {body: dataMeasurementPrinciple, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMeasurementPrinciple"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var measurementPrinciple = body; 
										  	//cek apakah ada error atau tidak
										  	if(measurementPrinciple.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Measurement Principle has been update.","data":measurementPrinciple.data});
										  	}else{
										  		res.json(measurementPrinciple);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		specificationType: function updateSpecificationType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataSpecificationType = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataSpecificationType.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataSpecificationType.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .-]/gi, '');
				dataSpecificationType.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'SPECIFICATION_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'SPECIFICATION_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('specificationType', {"apikey": apikey, "_id": _id}, {body: dataSpecificationType, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSpecificationType"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var specificationType = body; 
												  	//cek apakah ada error atau tidak
												  	if(specificationType.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Specification Type has been update.","data":specificationType.data});
												  	}else{
												  		res.json(specificationType);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('specificationType', {"apikey": apikey, "_id": _id}, {body: dataSpecificationType, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSpecificationType"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var specificationType = body; 
										  	//cek apakah ada error atau tidak
										  	if(specificationType.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Specification Type has been update.","data":specificationType.data});
										  	}else{
										  		res.json(specificationType);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		metricOperationalStatus: function updateMetricOperationalStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataMetricOperationalStatus = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataMetricOperationalStatus.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataMetricOperationalStatus.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .-]/gi, '');
				dataMetricOperationalStatus.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'METRIC_OPERATIONAL_STATUS', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'METRIC_OPERATIONAL_STATUS', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('metricOperationalStatus', {"apikey": apikey, "_id": _id}, {body: dataMetricOperationalStatus, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricOperationalStatus"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var metricOperationalStatus = body; 
												  	//cek apakah ada error atau tidak
												  	if(metricOperationalStatus.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Metric Operational Status has been update.","data":metricOperationalStatus.data});
												  	}else{
												  		res.json(metricOperationalStatus);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('metricOperationalStatus', {"apikey": apikey, "_id": _id}, {body: dataMetricOperationalStatus, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricOperationalStatus"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var metricOperationalStatus = body; 
										  	//cek apakah ada error atau tidak
										  	if(metricOperationalStatus.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Metric Operational Status has been update.","data":metricOperationalStatus.data});
										  	}else{
										  		res.json(metricOperationalStatus);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		deviceMetricType: function updateDeviceMetricType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataDeviceMetricType = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataDeviceMetricType.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataDeviceMetricType.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / .-:]/gi, '');
				dataDeviceMetricType.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'DEVICE_METRIC_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'DEVICE_METRIC_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('deviceMetricType', {"apikey": apikey, "_id": _id}, {body: dataDeviceMetricType, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDeviceMetricType"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var deviceMetricType = body; 
												  	//cek apakah ada error atau tidak
												  	if(deviceMetricType.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Device Metric Type has been update.","data":deviceMetricType.data});
												  	}else{
												  		res.json(deviceMetricType);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('deviceMetricType', {"apikey": apikey, "_id": _id}, {body: dataDeviceMetricType, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDeviceMetricType"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var deviceMetricType = body; 
										  	//cek apakah ada error atau tidak
										  	if(deviceMetricType.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Device Metric Type has been update.","data":deviceMetricType.data});
										  	}else{
										  		res.json(deviceMetricType);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		metricColor: function updateMetricColor(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataMetricColor = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataMetricColor.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataMetricColor.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
				dataMetricColor.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'METRIC_COLOR', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'METRIC_COLOR', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('metricColor', {"apikey": apikey, "_id": _id}, {body: dataMetricColor, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricColor"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var metricColor = body; 
												  	//cek apakah ada error atau tidak
												  	if(metricColor.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Metric Color has been update.","data":metricColor.data});
												  	}else{
												  		res.json(metricColor);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('metricColor', {"apikey": apikey, "_id": _id}, {body: dataMetricColor, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricColor"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var metricColor = body; 
										  	//cek apakah ada error atau tidak
										  	if(metricColor.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Metric Color has been update.","data":metricColor.data});
										  	}else{
										  		res.json(metricColor);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		metricCategory: function updateMetricCategory(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataMetricCategory = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataMetricCategory.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataMetricCategory.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
				dataMetricCategory.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'METRIC_CATEGORY', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'METRIC_CATEGORY', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('metricCategory', {"apikey": apikey, "_id": _id}, {body: dataMetricCategory, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricCategory"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var metricCategory = body; 
												  	//cek apakah ada error atau tidak
												  	if(metricCategory.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Metric Category has been update.","data":metricCategory.data});
												  	}else{
												  		res.json(metricCategory);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('metricCategory', {"apikey": apikey, "_id": _id}, {body: dataMetricCategory, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricCategory"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var metricCategory = body; 
										  	//cek apakah ada error atau tidak
										  	if(metricCategory.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Metric Category has been update.","data":metricCategory.data});
										  	}else{
										  		res.json(metricCategory);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		metricCalibrationType: function updateMetricCalibrationType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataMetricCalibrationType = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataMetricCalibrationType.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataMetricCalibrationType.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
				dataMetricCalibrationType.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'METRIC_CALIBRATION_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'METRIC_CALIBRATION_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('metricCalibrationType', {"apikey": apikey, "_id": _id}, {body: dataMetricCalibrationType, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricCalibrationType"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var metricCalibrationType = body; 
												  	//cek apakah ada error atau tidak
												  	if(metricCalibrationType.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Metric Calibration Type has been update.","data":metricCalibrationType.data});
												  	}else{
												  		res.json(metricCalibrationType);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('metricCalibrationType', {"apikey": apikey, "_id": _id}, {body: dataMetricCalibrationType, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricCalibrationType"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var metricCalibrationType = body; 
										  	//cek apakah ada error atau tidak
										  	if(metricCalibrationType.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Metric Calibration Type has been update.","data":metricCalibrationType.data});
										  	}else{
										  		res.json(metricCalibrationType);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		metricCalibrationState: function updateMetricCalibrationState(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataMetricCalibrationState = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataMetricCalibrationState.code = code;
			}

			if(typeof req.body.display !== 'undefined'){
				display = req.body.display;
				dataMetricCalibrationState.display = display;
			}

			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
				dataMetricCalibrationState.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'METRIC_CALIBRATION_STATE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'METRIC_CALIBRATION_STATE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('metricCalibrationState', {"apikey": apikey, "_id": _id}, {body: dataMetricCalibrationState, json: true}, function(error, response, body){
													if(error){
												  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricCalibrationState"});
												  }else{
												  	//cek apakah ada error atau tidak
												  	var metricCalibrationState = body; 
												  	//cek apakah ada error atau tidak
												  	if(metricCalibrationState.err_code == 0){
													  	res.json({"err_code": 0, "err_msg": "Metric Calibration State has been update.","data":metricCalibrationState.data});
												  	}else{
												  		res.json(metricCalibrationType);
												  	}
												  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('metricCalibrationState', {"apikey": apikey, "_id": _id}, {body: dataMetricCalibrationState, json: true}, function(error, response, body){
											if(error){
										  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateMetricCalibrationState"});
										  }else{
										  	//cek apakah ada error atau tidak
										  	var metricCalibrationState = body; 
										  	//cek apakah ada error atau tidak
										  	if(metricCalibrationState.err_code == 0){
											  	res.json({"err_code": 0, "err_msg": "Metric Calibration State has been update.","data":metricCalibrationState.data});
										  	}else{
										  		res.json(metricCalibrationState);
										  	}
										  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
    substanceStatus: function updateSubstanceStatus(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var _id = req.params._id;

      var dataSubstanceStatus = {};

      if(typeof req.body.code !== 'undefined'){
        var code = req.body.code.trim().toLowerCase();
        dataSubstanceStatus.code = code;
      }

      if(typeof req.body.display !== 'undefined'){
        display = req.body.display;
        dataSubstanceStatus.display = display;
      }

      if(typeof req.body.definition !== 'undefined'){
        var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
        dataSubstanceStatus.definition = definition;
      }

      if(_id == "" || typeof _id == 'undefined'){
        res.json({"err_code": 5, "err_msg": "Id is required."});  
      }else{
        if(validator.isInt(_id)){
          checkApikey(apikey, ipAddres, function(result){
            if(result.err_code == 0){
              checkId(apikey, _id, 'SUBSTANCE_STATUS', function(resultCheckId){
                if(resultCheckId.err_code == 0){
                  if(typeof req.body.code !== 'undefined'){
                    checkCode(apikey, code, 'SUBSTANCE_STATUS', function(resultCode){
                      if(resultCode.err_code == 0){
                        //method, endpoint, params, options, callback
                        ApiFHIR.put('substanceStatus', {"apikey": apikey, "_id": _id}, {body: dataSubstanceStatus, json: true}, function(error, response, body){
                          if(error){
                            res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSubstanceStatus"});
                          }else{
                            //cek apakah ada error atau tidak
                            var substanceStatus = body; 
                            //cek apakah ada error atau tidak
                            if(substanceStatus.err_code == 0){
                              res.json({"err_code": 0, "err_msg": "Substance Status has been update.","data":substanceStatus.data});
                            }else{
                              res.json(substanceStatus);
                            }
                          }
                        })
                      }else{
                        res.json(resultCode);
                      }
                    })
                  }else{
                    //method, endpoint, params, options, callback
                    ApiFHIR.put('substanceStatus', {"apikey": apikey, "_id": _id}, {body: dataSubstanceStatus, json: true}, function(error, response, body){
                      if(error){
                        res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSubstanceStatus"});
                      }else{
                        //cek apakah ada error atau tidak
                        var substanceStatus = body; 
                        //cek apakah ada error atau tidak
                        if(substanceStatus.err_code == 0){
                          res.json({"err_code": 0, "err_msg": "Substance Status has been update.","data":substanceStatus.data});
                        }else{
                          res.json(substanceStatus);
                        }
                      }
                    })
                  }
                }else{
                  res.json(resultCheckId);
                }
              })
            }else{
              result.err_code = 500;
              res.json(result);
            } 
          });
        }else{
          res.json({"err_code": 4, "err_msg": "Id must be a number."}); 
        }
      }
    },
    substanceCategory: function updateSubstanceCategory(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var _id = req.params._id;

      var datasubstanceCategory = {};

      if(typeof req.body.code !== 'undefined'){
        var code = req.body.code.trim().toLowerCase();
        datasubstanceCategory.code = code;
      }

      if(typeof req.body.display !== 'undefined'){
        display = req.body.display;
        datasubstanceCategory.display = display;
      }

      if(typeof req.body.definition !== 'undefined'){
        var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
        datasubstanceCategory.definition = definition;
      }

      if(_id == "" || typeof _id == 'undefined'){
        res.json({"err_code": 5, "err_msg": "Id is required."});  
      }else{
        if(validator.isInt(_id)){
          checkApikey(apikey, ipAddres, function(result){
            if(result.err_code == 0){
              checkId(apikey, _id, 'SUBSTANCE_CATEGORY', function(resultCheckId){
                if(resultCheckId.err_code == 0){
                  if(typeof req.body.code !== 'undefined'){
                    checkCode(apikey, code, 'SUBSTANCE_CATEGORY', function(resultCode){
                      if(resultCode.err_code == 0){
                        //method, endpoint, params, options, callback
                        ApiFHIR.put('substanceCategory', {"apikey": apikey, "_id": _id}, {body: datasubstanceCategory, json: true}, function(error, response, body){
                          if(error){
                            res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSubstanceCategory"});
                          }else{
                            //cek apakah ada error atau tidak
                            var substanceCategory = body; 
                            //cek apakah ada error atau tidak
                            if(substanceCategory.err_code == 0){
                              res.json({"err_code": 0, "err_msg": "Substance Category has been update.","data":substanceCategory.data});
                            }else{
                              res.json(substanceCategory);
                            }
                          }
                        })
                      }else{
                        res.json(resultCode);
                      }
                    })
                  }else{
                    //method, endpoint, params, options, callback
                    ApiFHIR.put('substanceCategory', {"apikey": apikey, "_id": _id}, {body: datasubstanceCategory, json: true}, function(error, response, body){
                      if(error){
                        res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSubstanceCategory"});
                      }else{
                        //cek apakah ada error atau tidak
                        var substanceCategory = body; 
                        //cek apakah ada error atau tidak
                        if(substanceCategory.err_code == 0){
                          res.json({"err_code": 0, "err_msg": "Substance Category has been update.","data":substanceCategory.data});
                        }else{
                          res.json(substanceCategory);
                        }
                      }
                    })
                  }
                }else{
                  res.json(resultCheckId);
                }
              })
            }else{
              result.err_code = 500;
              res.json(result);
            } 
          });
        }else{
          res.json({"err_code": 4, "err_msg": "Id must be a number."}); 
        }
      }
    },
    substanceCode: function updateSubstanceCode(req, res){
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var _id = req.params._id;

      var dataSubstanceCode = {};

      if(typeof req.body.code !== 'undefined'){
        var code = req.body.code.trim().toLowerCase();
        if(!validator.isInt(code)){
        	res.json({"err_code": 1, "err_msg": "Code is number."});  
        }else{
        	dataSubstanceCode.code = code;
        }
      }

      if(typeof req.body.display !== 'undefined'){
        display = req.body.display;
        dataSubstanceCode.display = display;
      }

      if(typeof req.body.definition !== 'undefined'){
        var definition = req.body.definition.replace(/[^\w\s , ( ) / . -]/gi, '');
        dataSubstanceCode.definition = definition;
      }

      if(_id == "" || typeof _id == 'undefined'){
        res.json({"err_code": 5, "err_msg": "Id is required."});  
      }else{
        if(validator.isInt(_id)){
          checkApikey(apikey, ipAddres, function(result){
            if(result.err_code == 0){
              checkId(apikey, _id, 'SUBSTANCE_CODE', function(resultCheckId){
                if(resultCheckId.err_code == 0){
                  if(typeof req.body.code !== 'undefined'){
                    checkCode(apikey, code, 'SUBSTANCE_CODE', function(resultCode){
                      if(resultCode.err_code == 0){
                        //method, endpoint, params, options, callback
                        ApiFHIR.put('substanceCode', {"apikey": apikey, "_id": _id}, {body: dataSubstanceCode, json: true}, function(error, response, body){
                          if(error){
                            res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSubstanceCode"});
                          }else{
                            //cek apakah ada error atau tidak
                            var substanceCode = body; 
                            //cek apakah ada error atau tidak
                            if(substanceCode.err_code == 0){
                              res.json({"err_code": 0, "err_msg": "Substance Code has been update.","data":substanceCode.data});
                            }else{
                              res.json(substanceCode);
                            }
                          }
                        })
                      }else{
                        res.json(resultCode);
                      }
                    })
                  }else{
                    //method, endpoint, params, options, callback
                    ApiFHIR.put('substanceCode', {"apikey": apikey, "_id": _id}, {body: dataSubstanceCode, json: true}, function(error, response, body){
                      if(error){
                        res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateSubstanceCode"});
                      }else{
                        //cek apakah ada error atau tidak
                        var substanceCode = body; 
                        //cek apakah ada error atau tidak
                        if(substanceCode.err_code == 0){
                          res.json({"err_code": 0, "err_msg": "Substance Code has been update.","data":substanceCode.data});
                        }else{
                          res.json(substanceCode);
                        }
                      }
                    })
                  }
                }else{
                  res.json(resultCheckId);
                }
              })
            }else{
              result.err_code = 500;
              res.json(result);
            } 
          });
        }else{
          res.json({"err_code": 4, "err_msg": "Id must be a number."}); 
        }
      }
    },
		organizationType: function updateOrganizationType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataOrganizationType = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataOrganizationType.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				dataOrganizationType.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataOrganizationType.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'ORGANIZATION_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'ORGANIZATION_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('organizationType', {"apikey": apikey, "_id": _id}, {body: dataOrganizationType, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateOrganizationType"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var organizationType = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(organizationType.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Organization Type has been update.","data":organizationType.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": organizationType.error, "application": "Api FHIR", "function": "updateOrganizationType"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('organizationType', {"apikey": apikey, "_id": _id}, {body: dataOrganizationType, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateOrganizationType"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var organizationType = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(organizationType.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Organization Type has been update.","data":organizationType.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": organizationType.error, "application": "Api FHIR", "function": "updateOrganizationType"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		contactentityType: function updateContactentityType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataContactentityType = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toUpperCase();
				dataContactentityType.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				dataContactentityType.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataContactentityType.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'CONTACT_ENTITY_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'CONTACT_ENTITY_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('contactentityType', {"apikey": apikey, "_id": _id}, {body: dataContactentityType, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateContactentityType"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var contactentityType = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(contactentityType.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Contactentity Type has been update.","data":contactentityType.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": contactentityType.error, "application": "Api FHIR", "function": "updateContactentityType"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('contactentityType', {"apikey": apikey, "_id": _id}, {body: dataContactentityType, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateContactentityType"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var contactentityType = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(contactentityType.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Contactentity Type has been update.","data":contactentityType.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": contactentityType.error, "application": "Api FHIR", "function": "updateContactentityType"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		locationStatus: function updateLocationStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataLocationStatus = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataLocationStatus.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				dataLocationStatus.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataLocationStatus.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'LOCATION_STATUS', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'LOCATION_STATUS', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('locationStatus', {"apikey": apikey, "_id": _id}, {body: dataLocationStatus, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLocationStatus"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var locationStatus = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(locationStatus.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Location Status has been update.","data":locationStatus.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": locationStatus.error, "application": "Api FHIR", "function": "updateLocationStatus"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('locationStatus', {"apikey": apikey, "_id": _id}, {body: dataLocationStatus, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLocationStatus"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var locationStatus = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(locationStatus.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Location Status has been update.","data":locationStatus.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": locationStatus.error, "application": "Api FHIR", "function": "updateLocationStatus"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		bedStatus: function updateBedStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataBedStatus = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toUpperCase();
				dataBedStatus.code = code;
			}

			if(typeof req.body.description !== 'undefined'){
				description = req.body.description.replace(/[^\w\s ,]/gi, '');
				dataBedStatus.description = description;
			}


			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'BED_STATUS', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'BED_STATUS', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('bedStatus', {"apikey": apikey, "_id": _id}, {body: dataBedStatus, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateBedStatus"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var bedStatus = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(bedStatus.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Bed Status has been update.","data":bedStatus.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": bedStatus.error, "application": "Api FHIR", "function": "updateBedStatus"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('bedStatus', {"apikey": apikey, "_id": _id}, {body: dataBedStatus, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateBedStatus"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var bedStatus = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(bedStatus.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Bed Status has been update.","data":bedStatus.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": bedStatus.error, "application": "Api FHIR", "function": "updateBedStatus"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		locationMode: function updateLocationMode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataLocationMode = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataLocationMode.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				dataLocationMode.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataLocationMode.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'LOCATION_MODE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'LOCATION_MODE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('locationMode', {"apikey": apikey, "_id": _id}, {body: dataLocationMode, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLocationMode"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var locationMode = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(locationMode.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Location Mode has been update.","data":locationMode.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": locationMode.error, "application": "Api FHIR", "function": "updateLocationMode"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('locationMode', {"apikey": apikey, "_id": _id}, {body: dataLocationMode, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLocationMode"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var locationMode = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(locationMode.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Location Mode has been update.","data":locationMode.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": locationMode.error, "application": "Api FHIR", "function": "updateLocationMode"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		serviceDeliveryLocationRoleType: function updateServiceDeliveryLocationRoleType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toUpperCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				data.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'SERVICE_DELIVERY_LOCATION_ROLE_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'SERVICE_DELIVERY_LOCATION_ROLE_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('serviceDeliveryLocationRoleType', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceDeliveryLocationRoleType"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var serviceDeliveryLocationRoleType = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(serviceDeliveryLocationRoleType.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Update Service Delivery Location Role Type Code has been update.","data":serviceDeliveryLocationRoleType.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": serviceDeliveryLocationRoleType.error, "application": "Api FHIR", "function": "updateServiceDeliveryLocationRoleType"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('serviceDeliveryLocationRoleType', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceDeliveryLocationRoleType"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var serviceDeliveryLocationRoleType = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(serviceDeliveryLocationRoleType.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Update Service Delivery Location Role Type Code has been update.","data":serviceDeliveryLocationRoleType.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": serviceDeliveryLocationRoleType.error, "application": "Api FHIR", "function": "updateServiceDeliveryLocationRoleTypeCode"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		locationPhysicalType: function updateLocationPhysicalType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var dataLocationPhysicalType = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				dataLocationPhysicalType.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				dataLocationPhysicalType.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				dataLocationPhysicalType.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'LOCATION_PHYSICAL_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'LOCATION_PHYSICAL_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('locationPhysicalType', {"apikey": apikey, "_id": _id}, {body: dataLocationPhysicalType, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLocationPhysicalType"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var locationPhysicalType = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(locationPhysicalType.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Location Mode has been update.","data":locationPhysicalType.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": locationPhysicalType.error, "application": "Api FHIR", "function": "updateLocationPhysicalType"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('locationPhysicalType', {"apikey": apikey, "_id": _id}, {body: dataLocationPhysicalType, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateLocationPhysicalType"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var locationPhysicalType = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(locationPhysicalType.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Location Mode has been update.","data":locationPhysicalType.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": locationPhysicalType.error, "application": "Api FHIR", "function": "updateLocationPhysicalType"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		qualificationCode: function updateQualificationCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toUpperCase();
				data.code = code;
			}

			if(typeof req.body.description !== 'undefined'){
				description = req.body.description.replace(/[^\w\s ,]/gi, '');
				data.description = description;
			}


			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'QUALIFICATION_CODE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'QUALIFICATION_CODE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('qualificationCode', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updatequalificationCode"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var qualificationCode = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(qualificationCode.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Qualification Code has been update.","data":qualificationCode.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": qualificationCode.error, "application": "Api FHIR", "function": "updateQualificationCode"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('qualificationCode', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateQualificationCode"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var qualificationCode = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(qualificationCode.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Qualification Code has been update.","data":qualificationCode.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": qualificationCode.error, "application": "Api FHIR", "function": "updateQualificationCode"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		practitionerRoleCode: function updatePractitionerRoleCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				data.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'PRACTITIONER_ROLE_CODE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'PRACTITIONER_ROLE_CODE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('practitionerRoleCode', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updatePractitionerRoleCode"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var practitionerRoleCode = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(practitionerRoleCode.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Practitioner Role Code has been update.","data":practitionerRoleCode.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": practitionerRoleCode.error, "application": "Api FHIR", "function": "updatePractitionerRoleCode"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('practitionerRoleCode', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updatePractitionerRoleCode"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var practitionerRoleCode = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(practitionerRoleCode.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Practitioner Role Code has been update.","data":practitionerRoleCode.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": practitionerRoleCode.error, "application": "Api FHIR", "function": "updatePractitionerRoleCode"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		practiceCode: function updatePracticeCode(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};
			
			if(typeof req.body.code !== 'undefined'){
				//var code = req.body.code.trim();
				var code = req.body.code;
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			
			//console.log(req.body.code);
			/*if(typeof req.body.code != "number"){*/
			if(isNaN(code) && typeof code !== 'undefined'){
				res.json({"err_code": 6, "err_msg": "Code is not number"});
			}else{
				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'PRACTICE_CODE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'PRACTICE_CODE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('practiceCode', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
														if(error){
																res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updatePracticeCode"});
															}else{
																//cek apakah ada error atau tidak
																var practiceCode = body; 

																//cek apakah ada error atau tidak
																if(practiceCode.err_code == 0){
																	res.json({"err_code": 0, "err_msg": "Practice Code has been update.","data":practiceCode.data});
																}else{
																	res.json({"err_code": 3, "err_msg": practiceCode.error, "application": "Api FHIR", "function": "updatePracticeCode"});
																}
															}
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('practiceCode', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
												if(error){
														res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updatePracticeCode"});
													}else{
														//cek apakah ada error atau tidak
														var practiceCode = body; 

														//cek apakah ada error atau tidak
														if(practiceCode.err_code == 0){
															res.json({"err_code": 0, "err_msg": "Practice Code has been update.","data":practiceCode.data});
														}else{
															res.json({"err_code": 3, "err_msg": practiceCode.error, "application": "Api FHIR", "function": "updatePracticeCode"});
														}
													}
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			}
			
		},
		daysOfWeek: function updateDaysOfWeek(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				data.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'DAYS_OF_WEEK', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'DAYS_OF_WEEK', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('daysOfWeek', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDaysOfWeek"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var daysOfWeek = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(daysOfWeek.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Days Of Week has been update.","data":daysOfWeek.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": daysOfWeek.error, "application": "Api FHIR", "function": "updateDaysOfWeek"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('daysOfWeek', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateDaysOfWeek"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var daysOfWeek = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(daysOfWeek.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Days Of Week has been update.","data":daysOfWeek.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": daysOfWeek.error, "application": "Api FHIR", "function": "updateDaysOfWeek"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		serviceCategory: function updateServiceCategory(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				data.definition = definition;
			}
			
			if(isNaN(code) && typeof code !== 'undefined'){
				res.json({"err_code": 6, "err_msg": "Code is not number"});
			}else{
				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'SERVICE_CATEGORY', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'SERVICE_CATEGORY', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('serviceCategory', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
														if(error){
																res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceCategory"});
															}else{
																//cek apakah ada error atau tidak
																var serviceCategory = body; 

																//cek apakah ada error atau tidak
																if(serviceCategory.err_code == 0){
																	res.json({"err_code": 0, "err_msg": "Service Category has been update.","data":serviceCategory.data});
																}else{
																	res.json({"err_code": 3, "err_msg": serviceCategory.error, "application": "Api FHIR", "function": "updateServiceCategory"});
																}
															}
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('serviceCategory', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
												if(error){
														res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceCategory"});
													}else{
														//cek apakah ada error atau tidak
														var serviceCategory = body; 

														//cek apakah ada error atau tidak
														if(serviceCategory.err_code == 0){
															res.json({"err_code": 0, "err_msg": "Service Category has been update.","data":serviceCategory.data});
														}else{
															res.json({"err_code": 3, "err_msg": serviceCategory.error, "application": "Api FHIR", "function": "updateServiceCategory"});
														}
													}
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			}
		},
		serviceType: function updateServiceType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				data.definition = definition;
			}
			
			if(isNaN(code) && typeof code !== 'undefined'){
				res.json({"err_code": 6, "err_msg": "Code is not number"});
			}else{
				if(_id == "" || typeof _id == 'undefined'){
					res.json({"err_code": 5, "err_msg": "Id is required."});	
				}else{
					if(validator.isInt(_id)){
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkId(apikey, _id, 'SERVICE_TYPE', function(resultCheckId){
									if(resultCheckId.err_code == 0){
										if(typeof req.body.code !== 'undefined'){
											checkCode(apikey, code, 'SERVICE_TYPE', function(resultCode){
												if(resultCode.err_code == 0){
													//method, endpoint, params, options, callback
													ApiFHIR.put('serviceType', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
														if(error){
																res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceType"});
															}else{
																//cek apakah ada error atau tidak
																var serviceType = body; 

																//cek apakah ada error atau tidak
																if(serviceType.err_code == 0){
																	res.json({"err_code": 0, "err_msg": "Service Type has been update.","data":serviceType.data});
																}else{
																	res.json({"err_code": 3, "err_msg": serviceType.error, "application": "Api FHIR", "function": "updateServiceType"});
																}
															}
													})
												}else{
													res.json(resultCode);
												}
											})
										}else{
											//method, endpoint, params, options, callback
											ApiFHIR.put('serviceType', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
												if(error){
														res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceType"});
													}else{
														//cek apakah ada error atau tidak
														var serviceType = body; 

														//cek apakah ada error atau tidak
														if(serviceType.err_code == 0){
															res.json({"err_code": 0, "err_msg": "Service Type has been update.","data":serviceType.data});
														}else{
															res.json({"err_code": 3, "err_msg": serviceType.error, "application": "Api FHIR", "function": "updateServiceType"});
														}
													}
											})
										}
									}else{
										res.json(resultCheckId);
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": 4, "err_msg": "Id must be a number."});	
					}
				}
			}
		},
		serviceProvisionConditions: function updateServiceProvisionConditions(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				data.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'SERVICE_PROVISION_CONDITIONS', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'SERVICE_PROVISION_CONDITIONS', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('serviceProvisionConditions', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceProvisionConditions"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var serviceProvisionConditions = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(serviceProvisionConditions.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Service Provision Conditions has been update.","data":serviceProvisionConditions.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": serviceProvisionConditions.error, "application": "Api FHIR", "function": "updateServiceProvisionConditions"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('serviceProvisionConditions', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceProvisionConditions"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var serviceProvisionConditions = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(serviceProvisionConditions.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Service Provision Conditions has been update.","data":serviceProvisionConditions.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": serviceProvisionConditions.error, "application": "Api FHIR", "function": "updateServiceProvisionConditions"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		serviceReferralMethod: function updateServiceReferralMethod(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				data.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'SERVICE_REFERRAL_METHOD', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'SERVICE_REFERRAL_METHOD', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('serviceReferralMethod', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceReferralMethod"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var serviceReferralMethod = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(serviceReferralMethod.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Service Referral Method has been update.","data":serviceReferralMethod.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": serviceReferralMethod.error, "application": "Api FHIR", "function": "updateServiceReferralMethod"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('serviceReferralMethod', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateServiceReferralMethod"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var serviceReferralMethod = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(serviceReferralMethod.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Service Referral Method has been update.","data":serviceReferralMethod.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": serviceReferralMethod.error, "application": "Api FHIR", "function": "updateServiceReferralMethod"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		endpointStatus: function updateEndpointStatus(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				data.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'ENDPOINT_STATUS', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'ENDPOINT_STATUS', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('endpointStatus', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateEndpointStatus"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var endpointStatus = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(endpointStatus.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Endpoint Status has been update.","data":endpointStatus.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": endpointStatus.error, "application": "Api FHIR", "function": "updateEndpointStatus"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('endpointStatus', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateEndpointStatus"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var endpointStatus = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(endpointStatus.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Endpoint Status has been update.","data":endpointStatus.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": endpointStatus.error, "application": "Api FHIR", "function": "updateEndpointStatus"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		endpointConnectionType: function updateEndpointConnectionType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}
			if(typeof req.body.definition !== 'undefined'){
				var definition = req.body.definition.replace(/[^\w\s ,]/gi, '');
				data.definition = definition;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'ENDPOINT_CONNECTION_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'ENDPOINT_CONNECTION_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('endpointConnectionType', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateEndpointConnectionType"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var endpointConnectionType = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(endpointConnectionType.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Endpoint Connection Type has been update.","data":endpointConnectionType.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": endpointConnectionType.error, "application": "Api FHIR", "function": "updateEndpointConnectionType"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('endpointConnectionType', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateEndpointConnectionType"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var endpointConnectionType = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(endpointConnectionType.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Endpoint Connection Type has been update.","data":endpointConnectionType.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": endpointConnectionType.error, "application": "Api FHIR", "function": "updateEndpointConnectionType"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		},
		endpointPayloadType: function updateEndpointPayloadType(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var _id = req.params._id;

			var data = {};

			if(typeof req.body.code !== 'undefined'){
				var code = req.body.code.trim().toLowerCase();
				data.code = code;
			}
			if(typeof req.body.display !== 'undefined'){
				var display = req.body.display;
				data.display = display;
			}

			if(_id == "" || typeof _id == 'undefined'){
				res.json({"err_code": 5, "err_msg": "Id is required."});	
			}else{
				if(validator.isInt(_id)){
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							checkId(apikey, _id, 'ENDPOINT_PAYLOAD_TYPE', function(resultCheckId){
								if(resultCheckId.err_code == 0){
									if(typeof req.body.code !== 'undefined'){
										checkCode(apikey, code, 'ENDPOINT_PAYLOAD_TYPE', function(resultCode){
											if(resultCode.err_code == 0){
												//method, endpoint, params, options, callback
												ApiFHIR.put('endpointPayloadType', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
													if(error){
													  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateEndpointPayloadType"});
													  }else{
													  	//cek apakah ada error atau tidak
													  	var endpointPayloadType = body; 
													  	
													  	//cek apakah ada error atau tidak
													  	if(endpointPayloadType.err_code == 0){
														  	res.json({"err_code": 0, "err_msg": "Endpoint Payload Type has been update.","data":endpointPayloadType.data});
													  	}else{
													  		res.json({"err_code": 3, "err_msg": endpointPayloadType.error, "application": "Api FHIR", "function": "updateEndpointPayloadType"});
													  	}
													  }
												})
											}else{
												res.json(resultCode);
											}
										})
									}else{
										//method, endpoint, params, options, callback
										ApiFHIR.put('endpointPayloadType', {"apikey": apikey, "_id": _id}, {body: data, json: true}, function(error, response, body){
											if(error){
											  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "updateEndpointPayloadType"});
											  }else{
											  	//cek apakah ada error atau tidak
											  	var endpointPayloadType = body; 
											  	
											  	//cek apakah ada error atau tidak
											  	if(endpointPayloadType.err_code == 0){
												  	res.json({"err_code": 0, "err_msg": "Endpoint Payload Type has been update.","data":endpointPayloadType.data});
											  	}else{
											  		res.json({"err_code": 3, "err_msg": endpointPayloadType.error, "application": "Api FHIR", "function": "updateEndpointPayloadType"});
											  	}
											  }
										})
									}
								}else{
									res.json(resultCheckId);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}else{
					res.json({"err_code": 4, "err_msg": "Id must be a number."});	
				}
			}
		}
	}
}

function checkApikey(apikey, ipAddress, callback) {
	//method, endpoint, params, options, callback
	Api.get('check_apikey', {
		"apikey": apikey
	}, {}, function (error, response, body) {
		if (error) {
			x(error);
		} else {
			user = JSON.parse(body);
			//cek apakah ada error atau tidak
			if (user.err_code == 0) {
				//cek jumdata dulu
				if (user.data.length > 0) {
					//check user_role_id == 1 <-- admin/root
					if (user.data[0].user_role_id == 1) {
						x({
							"err_code": 0,
							"status": "root",
							"user_role_id": user.data[0].user_role_id,
							"user_id": user.data[0].user_id
						});
					} else {
						//cek apikey
						if (apikey == user.data[0].user_apikey) {
							//ipaddress
							dataIpAddress = user.data[0].user_ip_address;
							if (dataIpAddress.indexOf(ipAddress) >= 0) {
								//user is active
								if (user.data[0].user_is_active) {
									//cek data user terpenuhi
									x({
										"err_code": 0,
										"status": "active",
										"user_role_id": user.data[0].user_role_id,
										"user_id": user.data[0].user_id
									});
								} else {
									x({
										"err_code": 5,
										"err_msg": "User is not active"
									});
								}
							} else {
								x({
									"err_code": 4,
									"err_msg": "Ip Address not registered"
								});
							}
						} else {
							x({
								"err_code": 3,
								"err_msg": "Wrong apikey"
							});
						}
					}

				} else {
					x({
						"err_code": 2,
						"err_msg": "Wrong apikey"
					});
				}
			} else {
				x({
					"err_code": 1,
					"err_msg": user.error,
					"application": "Api User Management",
					"function": "checkApikey"
				});
			}
		}
	});

	function x(result) {
		callback(result)
	}
}

function checkId(apikey, tableId, tableName, callback) {
	ApiFHIR.get('checkId', {
		"apikey": apikey,
		"id": tableId,
		"name": tableName
	}, {}, function (error, response, body) {
		if (error) {
			x(error);
		} else {
			dataId = JSON.parse(body);
			//cek apakah ada error atau tidak
			if (dataId.err_code == 0) {
				//cek jumdata dulu
				if (dataId.data.length > 0) {
					x({
						"err_code": 0,
						"err_msg": "Id is valid."
					})
				} else {
					x({
						"err_code": 2,
						"err_msg": "Id is not found."
					});
				}
			} else {
				x({
					"err_code": 1,
					"err_msg": dataId.error,
					"application": "API FHIR",
					"function": "checkId"
				});
			}
		}
	});

	function x(result) {
		callback(result)
	}
}

function checkCode(apikey, code, tableName, callback) {
	ApiFHIR.get('checkCode', {
		"apikey": apikey,
		"code": code,
		"name": tableName
	}, {}, function (error, response, body) {
		if (error) {
			x(error);
		} else {
			dataId = JSON.parse(body);
			//cek apakah ada error atau tidak
			if (dataId.err_code == 0) {
				//cek jumdata dulu
				if (dataId.data.length > 0) {
					x({
						"err_code": 2,
						"err_msg": "Code is already exist."
					})
				} else {
					x({
						"err_code": 0,
						"err_msg": "Code is available to used."
					});
				}
			} else {
				x({
					"err_code": 1,
					"err_msg": dataId.error,
					"application": "API FHIR",
					"function": "checkCode"
				});
			}
		}
	});

	function x(result) {
		callback(result)
	}
}

function checkUniqeValue(apikey, fdValue, tableName, callback) {
	ApiFHIR.get('checkUniqeValue', {
		"apikey": apikey,
		"fdvalue": fdValue,
		"tbname": tableName
	}, {}, function (error, response, body) {
		if (error) {
			x(error);
		} else {
			dataId = JSON.parse(body);
			//cek apakah ada error atau tidak
			if (dataId.err_code == 0) {
				//cek jumdata dulu
				if (dataId.data.length > 0) {
					x({
						"err_code": 2,
						"err_msg": "The value is already exist."
					})
				} else {
					x({
						"err_code": 0,
						"err_msg": "The value is available to insert."
					});
				}
			} else {
				x({
					"err_code": 1,
					"err_msg": dataId.error,
					"application": "API FHIR",
					"function": "checkCode"
				});
			}
		}
	});

	function x(result) {
		callback(result)
	}
}

function checkGroupQouta(apikey, groupId, callback) {
	ApiFHIR.get('checkGroupQouta', {
		"apikey": apikey,
		"group_id": groupId
	}, {}, function (error, response, body) {
		if (error) {
			x(error);
		} else {
			quota = JSON.parse(body);
			//cek apakah ada error atau tidak
			if (quota.err_code == 0) {
				//cek jumdata dulu
				if (quota.data.length > 0) {
					groupQuota = parseInt(quota.data[0].quantity);
					memberCount = parseInt(quota.data[0].total_member);

					if (memberCount <= groupQuota) {
						x({
							"err_code": 0,
							"err_msg": "Group quota is ready"
						});
					} else {
						x({
							"err_code": 1,
							"err_msg": "Group quota is full, total member " + groupQuota
						});
					}
				} else {
					x({
						"err_code": 0,
						"err_msg": "Group quota is ready"
					});
				}
			} else {
				x({
					"err_code": 1,
					"err_msg": quota,
					"application": "API FHIR",
					"function": "checkGroupQouta"
				});
			}
		}
	});

	function x(result) {
		callback(result)
	}
}

function checkMemberEntityGroup(apikey, entityId, groupId, callback) {
	ApiFHIR.get('checkMemberEntityGroup', {
		"apikey": apikey,
		"entity_id": entityId,
		"group_id": groupId
	}, {}, function (error, response, body) {
		if (error) {
			x(error);
		} else {
			entity = JSON.parse(body);
			//cek apakah ada error atau tidak
			if (entity.err_code == 0) {
				if (parseInt(entity.data.length) > 0) {
					x({
						"err_code": 2,
						"err_msg": "Member entity already exist in this group."
					});
				} else {
					x({
						"err_code": 0,
						"err_msg": "Member not found in this group."
					});
				}
			} else {
				x({
					"err_code": 1,
					"err_msg": entity,
					"application": "API FHIR",
					"function": "checkMemberEntityGroup"
				});
			}
		}
	});

	function x(result) {
		callback(result)
	}
}

function getFormattedDate() {
	var date = new Date();
	var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

	return str;
}

function formatDate(date) {
	var d = new Date(date),
	month = '' + (d.getMonth() + 1),
	day = '' + d.getDate(),
	year = d.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;

	return [year, month, day].join('-');
}

function removeDuplicates(myArr, prop) {
	return myArr.filter((obj, pos, arr) => {
		return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
	});
}

module.exports = controller;